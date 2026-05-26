<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRolePermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $role = $request->user()?->role;
        $permissions = config("permissions.roles.$role", []);

        if ($role === 'admin' || in_array('*', $permissions, true) || in_array($permission, $permissions, true)) {
            return $next($request);
        }

        abort(403, 'Anda tidak memiliki izin untuk mengakses fitur ini.');
    }
}
