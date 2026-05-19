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

    'branch' => env('DEPLOY_GITHUB_BRANCH', 'main'),

    /** Tag versi yang dipasang saat update (mis. 1.1), bukan commit hash */
    'tag' => env('DEPLOY_GITHUB_TAG', '1.1'),

    'remote' => env('DEPLOY_GITHUB_REMOTE', 'origin'),

    'timeout' => (int) env('DEPLOY_COMMAND_TIMEOUT', 300),

    'allow_dirty_working_tree' => env('DEPLOY_ALLOW_DIRTY', false),

];
