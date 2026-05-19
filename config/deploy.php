<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Update dari GitHub (panel admin)
    |--------------------------------------------------------------------------
    |
    | Set DEPLOY_GITHUB_ENABLED=true di .env untuk mengaktifkan menu update.
    | Hanya user dengan role "admin" yang dapat menjalankan perintah deploy.
    |
    */

    'enabled' => env('DEPLOY_GITHUB_ENABLED', env('APP_ENV', 'production') === 'local'),

    'remote' => env('DEPLOY_GITHUB_REMOTE', 'origin'),

    /** CLI PHP (bukan php-fpm). Wajib di VPS jika deploy lewat panel web. */
    'php_binary' => env('DEPLOY_PHP_BINARY'),

    'composer_binary' => env('DEPLOY_COMPOSER_BINARY', 'composer'),

    'timeout' => (int) env('DEPLOY_COMMAND_TIMEOUT', 300),

    /*
    | Di VPS, vendor/node_modules/build/storage sering tampak "kotor" — itu normal.
    | Production default: izinkan deploy (checkout -f akan timpa file ter-track).
    */
    'allow_dirty_working_tree' => env('DEPLOY_ALLOW_DIRTY', env('APP_ENV', 'production') === 'production'),

    'ignore_dirty_paths' => [
        'vendor',
        'node_modules',
        'public/build',
        'public/hot',
        'storage',
        'bootstrap/cache',
        '.env',
        '.npmrc',
        'build',
        'vite',
    ],

];
