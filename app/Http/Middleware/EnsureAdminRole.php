<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, ['owner', 'admin', 'cashier', 'purchasing'], true)) {
            abort(403, 'Hanya administrator yang dapat mengakses fitur ini.');
        }

        return $next($request);
    }
}
