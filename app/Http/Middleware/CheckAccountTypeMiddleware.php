<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckAccountTypeMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // If no user is authenticated, allow the request
        if (!$user) {
            return $next($request);
        }

        // Get current route name
        $currentRoute = $request->route()->getName();
        
        // Check if this is a department head route
        $isDepartmentHeadRoute = str_starts_with($currentRoute, 'department-head.');
        
        // Check if this is a regular user route
        $isRegularUserRoute = $currentRoute === 'dashboard';
        
        // User must be a department head for department head routes
        if ($isDepartmentHeadRoute && !$user->isDepartmentHead()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            return redirect()->route('login')
                ->with('error', 'This is not the correct account. Please use the appropriate account type.');
        }
        
        // User must NOT be a department head for regular dashboard
        if ($isRegularUserRoute && $user->isDepartmentHead()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            return redirect()->route('login')
                ->with('error', 'This is not the correct account. Please use the appropriate account type.');
        }

        return $next($request);
    }
}