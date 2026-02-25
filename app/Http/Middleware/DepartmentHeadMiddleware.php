<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DepartmentHeadMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        
        // Check if user is department head
        if (!$user->isDepartmentHead()) {
            // If not department head, redirect to their appropriate dashboard
            // or show 403 error
            abort(403, 'Unauthorized access. Department head privileges required.');
        }

        return $next($request);
    }
}