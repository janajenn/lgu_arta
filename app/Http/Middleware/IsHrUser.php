<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsHrUser
{
    public function handle(Request $request, Closure $next)
    {
        // Check if the user is logged in and their email matches the HR email from .env
        if (Auth::check() && Auth::user()->email === env('HR_EMAIL')) {
            return $next($request);
        }

        // Otherwise, deny access
        abort(403, 'Unauthorized access.');
    }
}