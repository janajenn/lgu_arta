<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\DepartmentHead\DashboardController as DepartmentHeadDashboardController;
use App\Http\Controllers\DepartmentHead\DepartmentUserController;

// Public department selection (landing page)
Route::get('/', [App\Http\Controllers\Public\DepartmentController::class, 'index'])->name('public.departments');

// Department-specific welcome page
Route::get('/department/{department}', [App\Http\Controllers\Public\DepartmentController::class, 'show'])->name('public.department.show');

// Public survey routes (keep under /survey)
Route::prefix('survey')->group(function () {
    Route::get('/', [SurveyController::class, 'create'])->name('survey.create');   // survey form
    Route::post('/', [SurveyController::class, 'store'])->name('survey.store');
    Route::post('/record-transaction', [SurveyController::class, 'recordTransaction'])->name('survey.record-transaction');
    Route::get('/thank-you', [SurveyController::class, 'thankYou'])->name('survey.thank-you');
});

// Guest routes (for non-authenticated users)
Route::middleware('guest')->group(function () {
    // Registration
    Route::get('register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);

    // Login
    Route::get('login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);

    // Password Reset
    Route::get('forgot-password', [\App\Http\Controllers\Auth\PasswordResetLinkController::class, 'create'])
        ->name('password.request');
    Route::post('forgot-password', [\App\Http\Controllers\Auth\PasswordResetLinkController::class, 'store'])
        ->name('password.email');
    Route::get('reset-password/{token}', [\App\Http\Controllers\Auth\NewPasswordController::class, 'create'])
        ->name('password.reset');
    Route::post('reset-password', [\App\Http\Controllers\Auth\NewPasswordController::class, 'store'])
        ->name('password.store');
});

// Authenticated routes with account validation
Route::middleware(['auth'])->group(function () {
    // Email Verification
    Route::get('verify-email', \App\Http\Controllers\Auth\EmailVerificationPromptController::class)
        ->name('verification.notice');
    Route::get('verify-email/{id}/{hash}', \App\Http\Controllers\Auth\VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post('email/verification-notification', [\App\Http\Controllers\Auth\EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Password Confirmation
    Route::get('confirm-password', [\App\Http\Controllers\Auth\ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');
    Route::post('confirm-password', [\App\Http\Controllers\Auth\ConfirmablePasswordController::class, 'store']);

    // Password Update
    Route::put('password', [\App\Http\Controllers\Auth\PasswordController::class, 'update'])->name('password.update');

    // Logout
    Route::post('logout', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    // 🔐 PROTECTED ROUTES - Check account type before accessing
    Route::middleware(['check.account.type'])->group(function () {
        // // Main Dashboard - Shows different content based on role
        // Route::get('/dashboard', function () {
        //     return redirect()->route('department-head.dashboard');
        // })->name('dashboard');
        // Department Head Dashboard
        Route::get('/department-head/dashboard', [\App\Http\Controllers\DepartmentHead\DashboardController::class, 'index'])
            ->name('department-head.dashboard');
        
        // Export route
        Route::get('/department-head/export', [\App\Http\Controllers\DepartmentHead\DashboardController::class, 'export'])
            ->name('department-head.export');

        // Department Head Analytics
        Route::get('/department-head/analytics', [\App\Http\Controllers\DepartmentHead\AnalyticsController::class, 'index'])
            ->name('department-head.analytics');

        Route::get('/department-head/analytics/export', [\App\Http\Controllers\DepartmentHead\AnalyticsController::class, 'export'])
            ->name('department-head.analytics.export');


            Route::post('/department-head/departments', [DepartmentUserController::class, 'store'])
        ->name('department-head.departments.store');


        Route::get('/department-head/departments/create', [DepartmentUserController::class, 'create'])
    ->name('department-head.departments.create');


    Route::get('/department-head/departments', [\App\Http\Controllers\DepartmentHead\DepartmentController::class, 'index'])
    ->name('department-head.departments.index');
Route::get('/department-head/departments/{department}', [\App\Http\Controllers\DepartmentHead\DepartmentController::class, 'show'])
    ->name('department-head.departments.show');

    
    });




});