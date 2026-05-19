<?php

namespace App\Services;

use Symfony\Component\Process\PhpExecutableFinder;
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
        $remoteUrl = trim($this->runGit('remote get-url '.$remote)['output'] ?? '');

        $fetch = $this->runGit('fetch '.$remote.' --tags --force');
        $availableTags = $this->listReleaseTags();
        $targetTag = $availableTags[0] ?? null;
        $resolvedTag = $targetTag ? $this->resolveTagRef($targetTag, false) : null;
        $remoteTagExists = $targetTag !== null && $resolvedTag !== null;

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
            'tag_mode' => 'latest',
            'available_tags' => array_slice($availableTags, 0, 5),
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
            'ignored_local_changes' => $this->getIgnoredLocalChangePaths(),
            'allow_dirty' => (bool) config('deploy.allow_dirty_working_tree'),
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

        $targetTag = $this->resolveLatestRemoteTag();
        if (! $targetTag) {
            return $this->result(false, $logs, 'Tidak ada tag rilis semver di GitHub. Buat tag: git tag 1.2 && git push origin 1.2');
        }

        $tagRef = $this->resolveTagRef($targetTag, true);
        if (! $tagRef) {
            return $this->result(false, $logs, "Tag versi \"{$targetTag}\" tidak ditemukan setelah fetch. Coba push ulang: git push origin {$targetTag}");
        }

        $checkout = $this->runGit('checkout -f '.escapeshellarg($tagRef));
        $logs[] = $this->logEntry('Checkout tag '.$targetTag, $checkout);
        if (! $checkout['success']) {
            return $this->result(false, $logs, 'Gagal checkout ke tag '.$targetTag);
        }

        if ($runComposer && file_exists($this->basePath.'/composer.json')) {
            $composer = $this->runComposerInstall();
            $logs[] = $this->logEntry('Composer install (--no-dev)', $composer);
            if (! $composer['success']) {
                return $this->result(false, $logs, 'Composer install gagal. Pastikan DEPLOY_PHP_BINARY mengarah ke PHP CLI (bukan php-fpm).');
            }

            $discover = $this->runPhp('package:discover --ansi');
            $logs[] = $this->logEntry('Artisan package:discover', $discover);
            if (! $discover['success']) {
                return $this->result(false, $logs, 'package:discover gagal. Set DEPLOY_PHP_BINARY=/usr/bin/php8.3 di .env VPS.');
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
                ? $this->runShell('npm ci --no-audit --no-fund')
                : $this->runShell('npm install --no-audit --no-fund');
            $logs[] = $this->logEntry('NPM install', $npmInstall);
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

    protected function resolveLatestRemoteTag(): ?string
    {
        $tags = $this->listReleaseTags();

        return $tags[0] ?? null;
    }

    /**
     * Tag rilis semver dari repo lokal (setelah git fetch), tertinggi pertama.
     *
     * @return list<string> Tanpa prefix "v", mis. ["1.2", "1.1", "1.0"]
     */
    protected function listReleaseTags(): array
    {
        $result = $this->runGit('tag -l --sort=-v:refname');
        if (! $result['success']) {
            return [];
        }

        $tags = [];
        foreach (explode("\n", trim($result['output'] ?? '')) as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }

            if (preg_match('/^v?(\d+\.\d+(?:\.\d+)?)$/', $line, $matches)) {
                $tags[] = $matches[1];
            }
        }

        return array_values(array_unique($tags));
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

    /** @return list<string> */
    protected function getIgnoredLocalChangePaths(): array
    {
        return array_values(array_filter(
            $this->getLocalChangePaths(),
            fn (string $path) => $this->isIgnoredDirtyPath($path)
        ));
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

    protected function runComposerInstall(): array
    {
        $composer = (string) config('deploy.composer_binary', 'composer');

        return $this->runShell(
            escapeshellarg($composer).' install --no-dev --no-interaction --prefer-dist --optimize-autoloader',
            $this->basePath,
            $this->deployProcessEnv(),
        );
    }

    protected function runPhp(string $args): array
    {
        $php = $this->resolvePhpCliBinary();

        return $this->runShell(
            escapeshellarg($php).' artisan '.$args,
            $this->basePath,
            $this->deployProcessEnv(),
        );
    }

    /** @return array<string, string> */
    protected function deployProcessEnv(): array
    {
        return array_filter([
            'COMPOSER_PHP' => $this->resolvePhpCliBinary(),
            'COMPOSER_ALLOW_SUPERUSER' => '1',
        ]);
    }

    protected function resolvePhpCliBinary(): string
    {
        if ($configured = config('deploy.php_binary')) {
            return (string) $configured;
        }

        $binary = PHP_BINARY ?: '';
        if ($binary !== '' && ! str_contains($binary, 'fpm')) {
            return $binary;
        }

        $finder = new PhpExecutableFinder;
        $found = $finder->find(false);
        if (is_string($found) && $found !== '' && ! str_contains($found, 'fpm')) {
            return $found;
        }

        foreach (['php8.3', 'php8.2', 'php8.1', 'php'] as $candidate) {
            $which = trim((string) shell_exec('command -v '.$candidate.' 2>/dev/null'));
            if ($which !== '' && ! str_contains($which, 'fpm')) {
                return $which;
            }
        }

        return 'php';
    }

    protected function runShell(string $command, ?string $cwd = null, array $env = []): array
    {
        $timeout = (int) config('deploy.timeout', 300);

        try {
            $processEnv = $env === [] ? null : array_merge($_ENV, $_SERVER, $env);
            $process = Process::fromShellCommandline($command, $cwd ?? $this->basePath, $processEnv);
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
