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

        $remote = config('deploy.remote', 'origin');
        $targetTag = $this->configuredTag();
        $remoteUrl = trim($this->runGit('remote get-url '.$remote)['output'] ?? '');

        $fetch = $this->runGit('fetch '.$remote.' --tags --force');
        $resolvedTag = $this->resolveTagRef($targetTag, false);
        $remoteTagExists = $this->remoteTagExists($remote, $targetTag);

        $describe = $this->runGit('describe --tags --exact-match');
        $currentExactTag = $describe['success'] ? trim($describe['output']) : null;

        $currentShort = trim($this->runGit('rev-parse --short HEAD')['output'] ?? '');
        $targetShort = $resolvedTag
            ? trim($this->runGit('rev-parse --short '.escapeshellarg($resolvedTag))['output'] ?? '')
            : null;

        $head = trim($this->runGit('rev-parse HEAD')['output'] ?? '');
        $tagCommit = $resolvedTag
            ? trim($this->runGit('rev-parse '.escapeshellarg($resolvedTag))['output'] ?? '')
            : '';
        $onTarget = $resolvedTag && $head !== '' && $head === $tagCommit;

        $lastMessage = trim($this->runGit('log -1 --pretty=%s')['output'] ?? '');
        $lastDate = trim($this->runGit('log -1 --pretty=%ci')['output'] ?? '');

        return [
            'available' => true,
            'enabled' => (bool) config('deploy.enabled'),
            'remote' => $remote,
            'remote_url' => $remoteUrl,
            'target_tag' => $targetTag,
            'target_tag_ref' => $resolvedTag,
            'target_tag_exists' => $remoteTagExists,
            'current_version' => $currentExactTag ?: ('commit '.$currentShort),
            'current_tag' => $currentExactTag,
            'current_short' => $currentShort,
            'target_short' => $targetShort,
            'is_on_target_version' => $onTarget,
            'needs_update' => $remoteTagExists && ! $onTarget,
            'last_commit_message' => $lastMessage,
            'last_commit_date' => $lastDate,
            'has_local_changes' => $this->hasLocalChanges(),
            'can_deploy' => ($remoteTagExists && (! $this->hasLocalChanges() || config('deploy.allow_dirty_working_tree'))),
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
        $remote = config('deploy.remote', 'origin');
        $targetTag = $this->configuredTag();

        if (! $this->isGitRepository()) {
            return $this->fail($logs, 'Bukan repository Git.');
        }

        if ($this->hasLocalChanges() && ! config('deploy.allow_dirty_working_tree')) {
            return $this->fail($logs, 'Ada perubahan lokal yang belum di-commit. Commit atau stash dulu sebelum update.');
        }

        $fetchResult = $this->runGit('fetch '.$remote.' --tags --force');
        $logs[] = $this->logEntry('Git fetch tags', $fetchResult);
        if (! $fetchResult['success']) {
            return $this->result(false, $logs, 'Gagal mengambil tag dari GitHub.');
        }

        $tagRef = $this->resolveTagRef($targetTag, true);
        if (! $tagRef) {
            return $this->result(false, $logs, "Tag versi \"{$targetTag}\" tidak ditemukan di GitHub. Buat tag di repo: git tag {$targetTag} && git push origin {$targetTag}");
        }

        $checkout = $this->runGit('checkout -f '.escapeshellarg($tagRef));
        $logs[] = $this->logEntry('Checkout tag '.$targetTag, $checkout);
        if (! $checkout['success']) {
            return $this->result(false, $logs, 'Gagal checkout ke tag '.$targetTag);
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

        return $this->result(true, $logs, 'Aplikasi berhasil diperbarui ke versi '.$targetTag.'.');
    }

    protected function configuredTag(): string
    {
        return (string) config('deploy.tag', '1.1');
    }

    /** @return list<string> */
    protected function tagCandidates(string $tag): array
    {
        $tag = trim($tag);
        $candidates = [$tag];

        if (! str_starts_with($tag, 'v')) {
            $candidates[] = 'v'.$tag;
        } else {
            $candidates[] = ltrim($tag, 'v');
        }

        return array_values(array_unique($candidates));
    }

    protected function resolveTagRef(string $tag, bool $strict): ?string
    {
        foreach ($this->tagCandidates($tag) as $candidate) {
            if ($this->runGit('rev-parse --verify '.escapeshellarg($candidate.'^{commit}'))['success']) {
                return $candidate;
            }
        }

        return $strict ? null : null;
    }

    protected function remoteTagExists(string $remote, string $tag): bool
    {
        foreach ($this->tagCandidates($tag) as $candidate) {
            $result = $this->runGit('ls-remote --tags '.$remote.' '.escapeshellarg('refs/tags/'.$candidate));
            if ($result['success'] && trim($result['output']) !== '') {
                return true;
            }
        }

        return false;
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
