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
    if (!$user) {
        return $next($request);
    }

    $currentRoute = $request->route()->getName();

    // Admin user
    if ($user->isAdmin()) {
        // Allow admin to access admin routes (prefix 'admin.')
        if (str_starts_with($currentRoute, 'admin.')) {
            return $next($request);
        }
        // Otherwise, block access and redirect to admin dashboard
        return redirect()->route('admin.dashboard');
    }

    // Department head
    if ($user->isDepartmentHead()) {
        if (!str_starts_with($currentRoute, 'department-head.')) {
            Auth::logout();
            $request->session()->invalidate();
            return redirect()->route('login')->with('error', 'Invalid account type.');
        }
        return $next($request);
    }

    // Regular user (role 'user')
    if ($user->isRegularUser()) {
        if ($currentRoute !== 'dashboard') { // adjust as needed
            Auth::logout();
            $request->session()->invalidate();
            return redirect()->route('login')->with('error', 'Invalid account type.');
        }
        return $next($request);
    }

    return $next($request);
}
}
