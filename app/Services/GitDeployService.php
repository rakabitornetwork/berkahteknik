<?php

namespace App\Services;

use Symfony\Component\Process\Process;

class GitDeployService
{
    protected string $basePath;

    public function __construct()
    {
        $this->basePath = base_path();
    }

    public function isGitRepository(): bool
    {
        return is_dir($this->basePath.'/.git');
    }

    public function getStatus(): array
    {
        if (! $this->isGitRepository()) {
            return [
                'available' => false,
                'message' => 'Folder ini bukan repository Git.',
            ];
        }

        $branch = config('deploy.branch', 'main');
        $remote = config('deploy.remote', 'origin');

        $remoteUrl = trim($this->runGit('remote get-url '.$remote)['output'] ?? '');
        $currentBranch = trim($this->runGit('branch --show-current')['output'] ?? $branch);
        $head = trim($this->runGit('rev-parse --short HEAD')['output'] ?? '');
        $lastMessage = trim($this->runGit('log -1 --pretty=%s')['output'] ?? '');
        $lastDate = trim($this->runGit('log -1 --pretty=%ci')['output'] ?? '');

        $dirty = $this->hasLocalChanges();
        $behind = 0;
        $ahead = 0;

        $fetch = $this->runGit('fetch '.$remote.' '.$branch);
        if ($fetch['success']) {
            $behind = (int) trim($this->runGit('rev-list --count HEAD..'.$remote.'/'.$branch)['output'] ?? '0');
            $ahead = (int) trim($this->runGit('rev-list --count '.$remote.'/'.$branch.'..HEAD')['output'] ?? '0');
        }

        return [
            'available' => true,
            'enabled' => (bool) config('deploy.enabled'),
            'remote' => $remote,
            'remote_url' => $remoteUrl,
            'branch' => $branch,
            'current_branch' => $currentBranch,
            'head' => $head,
            'last_commit_message' => $lastMessage,
            'last_commit_date' => $lastDate,
            'has_local_changes' => $dirty,
            'commits_behind' => $behind,
            'commits_ahead' => $ahead,
            'can_pull' => ! $dirty || config('deploy.allow_dirty_working_tree'),
            'fetch_ok' => $fetch['success'],
            'fetch_output' => $fetch['output'],
        ];
    }

    public function deploy(array $options = []): array
    {
        $runComposer = $options['composer'] ?? true;
        $runMigrate = $options['migrate'] ?? true;
        $runNpm = $options['npm'] ?? true;
        $runOptimize = $options['optimize'] ?? true;

        $logs = [];
        $branch = config('deploy.branch', 'main');
        $remote = config('deploy.remote', 'origin');

        if (! $this->isGitRepository()) {
            return $this->fail($logs, 'Bukan repository Git.');
        }

        if ($this->hasLocalChanges() && ! config('deploy.allow_dirty_working_tree')) {
            return $this->fail($logs, 'Ada perubahan lokal yang belum di-commit. Commit atau stash dulu sebelum update.');
        }

        $steps = [
            'Git fetch' => 'fetch '.$remote.' '.$branch,
            'Git pull' => 'pull '.$remote.' '.$branch,
        ];

        foreach ($steps as $label => $cmd) {
            $result = $this->runGit($cmd);
            $logs[] = $this->logEntry($label, $result);
            if (! $result['success']) {
                return $this->result(false, $logs, 'Update Git gagal pada langkah: '.$label);
            }
        }

        if ($runComposer && file_exists($this->basePath.'/composer.json')) {
            $composer = $this->runShell('composer install --no-interaction --prefer-dist --optimize-autoloader');
            $logs[] = $this->logEntry('Composer install', $composer);
            if (! $composer['success']) {
                return $this->result(false, $logs, 'Composer install gagal.');
            }
        }

        if ($runMigrate && file_exists($this->basePath.'/artisan')) {
            $migrate = $this->runPhp('migrate --force');
            $logs[] = $this->logEntry('Database migrate', $migrate);
            if (! $migrate['success']) {
                return $this->result(false, $logs, 'Migrasi database gagal.');
            }
        }

        if ($runNpm && file_exists($this->basePath.'/package.json')) {
            $npmInstall = file_exists($this->basePath.'/package-lock.json')
                ? $this->runShell('npm ci --no-audit --no-fund')
                : $this->runShell('npm install --no-audit --no-fund');
            $logs[] = $this->logEntry('NPM install', $npmInstall);
            if (! $npmInstall['success']) {
                return $this->result(false, $logs, 'NPM install gagal.');
            }

            $npmBuild = $this->runShell('npm run build');
            $logs[] = $this->logEntry('NPM build', $npmBuild);
            if (! $npmBuild['success']) {
                return $this->result(false, $logs, 'NPM build gagal.');
            }
        }

        if ($runOptimize) {
            foreach ([
                'Optimize' => 'optimize',
                'Config cache' => 'config:cache',
                'Route cache' => 'route:cache',
                'View cache' => 'view:cache',
            ] as $label => $cmd) {
                $opt = $this->runPhp($cmd);
                $logs[] = $this->logEntry($label, $opt);
            }
        }

        return $this->result(true, $logs, 'Update dari GitHub berhasil diselesaikan.');
    }

    protected function hasLocalChanges(): bool
    {
        $status = $this->runGit('status --porcelain');

        return trim($status['output'] ?? '') !== '';
    }

    protected function runGit(string $args): array
    {
        return $this->runShell('git '.$args, $this->basePath);
    }

    protected function runPhp(string $args): array
    {
        $php = PHP_BINARY ?: 'php';

        return $this->runShell(escapeshellarg($php).' artisan '.$args, $this->basePath);
    }

    protected function runShell(string $command, ?string $cwd = null): array
    {
        $timeout = (int) config('deploy.timeout', 300);

        try {
            $process = Process::fromShellCommandline($command, $cwd ?? $this->basePath);
            $process->setTimeout($timeout);
            $process->run();

            return [
                'success' => $process->isSuccessful(),
                'output' => trim($process->getOutput()."\n".$process->getErrorOutput()),
                'exit_code' => $process->getExitCode(),
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'output' => $e->getMessage(),
                'exit_code' => -1,
            ];
        }
    }

    protected function logEntry(string $step, array $result): array
    {
        return [
            'step' => $step,
            'success' => $result['success'],
            'output' => $result['output'],
        ];
    }

    protected function fail(array $logs, string $message): array
    {
        return $this->result(false, $logs, $message);
    }

    protected function result(bool $success, array $logs, string $message): array
    {
        return [
            'success' => $success,
            'message' => $message,
            'logs' => $logs,
        ];
    }
}
