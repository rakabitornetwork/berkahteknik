<?php

namespace App\Http\Controllers;

use App\Services\GitDeployService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemUpdateController extends Controller
{
    public function index(GitDeployService $deploy)
    {
        return Inertia::render('Admin/SystemUpdate/Index', [
            'status' => fn () => $deploy->getStatus(),
            'config' => fn () => $this->deployConfig(),
        ]);
    }

    /** @return array<string, mixed> */
    protected function deployConfig(): array
    {
        return [
            'enabled' => (bool) config('deploy.enabled'),
            'tag_mode' => 'latest',
            'remote' => config('deploy.remote'),
        ];
    }

    public function deploy(Request $request, GitDeployService $deploy)
    {
        if (! config('deploy.enabled')) {
            return back()->with('error', 'Fitur update GitHub belum diaktifkan. Set DEPLOY_GITHUB_ENABLED=true di file .env');
        }

        $request->validate([
            'confirm' => 'accepted',
            'run_composer' => 'boolean',
            'run_migrate' => 'boolean',
            'run_npm' => 'boolean',
            'run_optimize' => 'boolean',
        ]);

        $result = $deploy->deploy([
            'composer' => $request->boolean('run_composer', true),
            'migrate' => $request->boolean('run_migrate', true),
            'npm' => $request->boolean('run_npm', true),
            'optimize' => $request->boolean('run_optimize', true),
        ]);

        if ($result['success']) {
            return back()->with([
                'success' => $result['message'],
                'deploy_logs' => $result['logs'],
            ]);
        }

        return back()->with([
            'error' => $result['message'],
            'deploy_logs' => $result['logs'],
        ]);
    }
}
