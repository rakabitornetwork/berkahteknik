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
            'has_local_changes' => $this->hasBlockingLocalChanges(),
            'local_changes' => $this->getBlockingLocalChangePaths(),
            'can_deploy' => ($remoteTagExists && (! $this->hasBlockingLocalChanges() || config('deploy.allow_dirty_working_tree'))),
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

        if ($this->hasBlockingLocalChanges() && ! config('deploy.allow_dirty_working_tree')) {
            $files = implode(', ', $this->getBlockingLocalChangePaths());

            return $this->fail($logs, 'Ada perubahan lokal pada file penting: '.$files.'. Commit/stash dulu, atau set DEPLOY_ALLOW_DIRTY=true di .env');
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
            $clean = $this->cleanNodeModules();
            $logs[] = $this->logEntry('Bersihkan node_modules', $clean);

            $npmInstall = file_exists($this->basePath.'/package-lock.json')
                ? $this->runShell('npm ci --include=dev --no-audit --no-fund')
                : $this->runShell('npm install --include=dev --no-audit --no-fund');
            $logs[] = $this->logEntry('NPM install (termasuk dev)', $npmInstall);
            if (! $npmInstall['success']) {
                return $this->result(false, $logs, 'NPM install gagal.');
            }

            $ensurePos = $this->ensurePointOfSalePackages();
            $logs[] = $this->logEntry('Pastikan paket thermal printer', $ensurePos);
            if (! $ensurePos['success']) {
                return $this->result(false, $logs, 'Paket @point-of-sale tidak terpasang. Cek koneksi npm registry di server.');
            }

            $npmBuild = $this->runShell('npm run build');
            $logs[] = $this->logEntry('NPM build', $npmBuild);
            if (! $npmBuild['success']) {
                return $this->result(false, $logs, 'NPM build gagal.');
            }

            $npmPrune = $this->runShell('npm prune --omit=dev --no-audit --no-fund');
            $logs[] = $this->logEntry('NPM prune dev (hemat disk)', $npmPrune);
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

    /** @return list<string> */
    protected function getLocalChangePaths(): array
    {
        $status = $this->runGit('status --porcelain');
        $output = trim($status['output'] ?? '');

        if ($output === '') {
            return [];
        }

        $paths = [];
        foreach (explode("\n", $output) as $line) {
            if (strlen($line) < 4) {
                continue;
            }

            $path = trim(substr($line, 3));
            if (str_contains($path, ' -> ')) {
                $path = trim(substr($path, strpos($path, ' -> ') + 4));
            }

            $paths[] = $path;
        }

        return $paths;
    }

    protected function isIgnoredDirtyPath(string $path): bool
    {
        $normalized = str_replace('\\', '/', $path);

        foreach (config('deploy.ignore_dirty_paths', []) as $ignore) {
            $ignore = rtrim(str_replace('\\', '/', (string) $ignore), '/');
            if ($normalized === $ignore || str_starts_with($normalized, $ignore.'/')) {
                return true;
            }
        }

        return false;
    }

    /** @return list<string> */
    protected function getBlockingLocalChangePaths(): array
    {
        return array_values(array_filter(
            $this->getLocalChangePaths(),
            fn (string $path) => ! $this->isIgnoredDirtyPath($path)
        ));
    }

    protected function hasBlockingLocalChanges(): bool
    {
        return $this->getBlockingLocalChangePaths() !== [];
    }

    protected function cleanNodeModules(): array
    {
        $dir = $this->basePath.'/node_modules';

        if (! is_dir($dir)) {
            return ['success' => true, 'output' => 'node_modules tidak ada, lewati.', 'exit_code' => 0];
        }

        $command = PHP_OS_FAMILY === 'Windows'
            ? 'rmdir /s /q node_modules'
            : 'rm -rf node_modules';

        return $this->runShell($command, $this->basePath);
    }

    protected function ensurePointOfSalePackages(): array
    {
        $required = [
            '@point-of-sale/receipt-printer-encoder',
            '@point-of-sale/webbluetooth-receipt-printer',
        ];

        $missing = [];
        foreach ($required as $package) {
            $path = $this->basePath.'/node_modules/'.$package;
            if (! is_dir($path)) {
                $missing[] = $package;
            }
        }

        if ($missing === []) {
            return ['success' => true, 'output' => 'Semua paket @point-of-sale terpasang.', 'exit_code' => 0];
        }

        $install = $this->runShell(
            'npm install '.implode(' ', array_map('escapeshellarg', $missing)).' --no-audit --no-fund',
            $this->basePath
        );

        if (! $install['success']) {
            return $install;
        }

        foreach ($required as $package) {
            if (! is_dir($this->basePath.'/node_modules/'.$package)) {
                return [
                    'success' => false,
                    'output' => 'Masih hilang setelah install: '.$package.'. Perbarui package.json & package-lock.json dari Git.',
                    'exit_code' => 1,
                ];
            }
        }

        return ['success' => true, 'output' => 'Paket dilengkapi: '.implode(', ', $missing), 'exit_code' => 0];
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
