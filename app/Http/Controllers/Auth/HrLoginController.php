<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HrLoginController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/HrLogin', [
            'canResetPassword' => true, // enables "Forgot?" link
        ]);
    }

    public function store(Request $request)
    {


        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            // Ensure the user is HR
            if (Auth::user()->role !== 'hr') {
                Auth::logout();
                return back()->withErrors([
                    'email' => 'You are not authorized to access this area.',
                ]);
            }

            // 🔥 Force redirect to PERMA reports – no intended, no dashboard
            return redirect('/perma-reports');

            \Log::info('HrLoginController store');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    
}