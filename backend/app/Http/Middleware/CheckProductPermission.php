<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckProductPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $admin = auth()->user();
        
        if (!$admin) {
            return response()->json(['error' => 'Non authentifié'], 401);
        }

        if ($admin->role && $admin->role->all_permissions) {
            return $next($request);
        }

        $hasPermission = $admin->role && $admin->role->permissions()
            ->where('code', $permission)
            ->exists();

        if (!$hasPermission) {
            return response()->json([
                'error' => 'Permission insuffisante',
                'required_permission' => $permission
            ], 403);
        }

        return $next($request);
    }
}
