<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $permissionCode): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        $userId = Auth::id();

        // Check if user has a role that has the required permission
        $hasPermission = DB::table('rl_user_roles')
            ->join('ms_roles', 'rl_user_roles.role_id', '=', 'ms_roles.id')
            ->join('rl_role_permissions', 'ms_roles.id', '=', 'rl_role_permissions.role_id')
            ->join('ms_permissions', 'rl_role_permissions.permission_id', '=', 'ms_permissions.id')
            ->where('rl_user_roles.user_id', $userId)
            ->where('ms_permissions.code', $permissionCode)
            ->where('ms_roles.status', 'ACTIVE')
            ->where('ms_permissions.status', 'ACTIVE')
            ->exists();

        if (!$hasPermission) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
