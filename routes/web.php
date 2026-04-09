<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\DepartmentHead\DashboardController as DepartmentHeadDashboardController;
use App\Http\Controllers\DepartmentHead\DepartmentUserController;
use App\Http\Controllers\PermaSurveyController;
use App\Http\Controllers\PermaReportController;
use App\Http\Controllers\DepartmentHead\ReportsController;
use App\Http\Controllers\Admin\AdminReportsController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Auth\HrLoginController;
use  App\Http\Controllers\DepartmentHead\TrackingController;

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



   // Add PERMA survey routes here (public)
  // Add PERMA survey routes here (public)
Route::get('/perma', [PermaSurveyController::class, 'create'])->name('survey.perma');     // ← Landing page
Route::get('/perma/form', [PermaSurveyController::class, 'form'])->name('survey.perma.form'); // ← Actual form
Route::post('/perma', [PermaSurveyController::class, 'store']);
Route::get('/survey/perma/thankyou', [PermaSurveyController::class, 'thankyou'])->name('perma.thankyou');

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



       // Add HR-specific login
Route::get('/hr/login', [App\Http\Controllers\Auth\HrLoginController::class, 'create'])->name('hr.login.form');
Route::post('/hr/login', [App\Http\Controllers\Auth\HrLoginController::class, 'store'])->name('hr.login.store');



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


    Route::get('/department-head/departments/{department}/edit', [\App\Http\Controllers\DepartmentHead\DepartmentController::class, 'edit'])
    ->name('department-head.departments.edit');
Route::put('/department-head/departments/{department}', [\App\Http\Controllers\DepartmentHead\DepartmentController::class, 'update'])
    ->name('department-head.departments.update');




    // HR Reports (overall)
Route::get('/department-head/reports', [\App\Http\Controllers\DepartmentHead\ReportsController::class, 'index'])
->name('department-head.reports.index');

Route::get('/department-head/reports/service-summary', [\App\Http\Controllers\DepartmentHead\ReportsController::class, 'serviceSummary'])
->name('department-head.reports.service-summary');

Route::get('/department-head/reports/age-distribution', [\App\Http\Controllers\DepartmentHead\ReportsController::class, 'ageDistribution'])
->name('department-head.reports.age-distribution');

Route::get('/department-head/reports/client-type-distribution', [\App\Http\Controllers\DepartmentHead\ReportsController::class, 'clientTypeDistribution'])
->name('department-head.reports.client-type-distribution');


Route::get('/department-head/reports/cc-sqd-summary', [\App\Http\Controllers\DepartmentHead\ReportsController::class, 'ccSqdSummary'])
    ->name('department-head.reports.cc-sqd-summary');


    Route::get('/department-head/reports/region-distribution', [\App\Http\Controllers\DepartmentHead\ReportsController::class, 'regionDistribution'])
    ->name('department-head.reports.region-distribution');


    Route::get('/department-head/reports/gender-distribution', [\App\Http\Controllers\DepartmentHead\ReportsController::class, 'genderDistribution'])
    ->name('department-head.reports.gender-distribution');

    Route::get('/department-head/reports/summary-of-result', [\App\Http\Controllers\DepartmentHead\ReportsController::class, 'summaryOfResult'])
    ->name('department-head.reports.summary-of-result');


    Route::get('/department-head/reports/service-ratings', [\App\Http\Controllers\DepartmentHead\ReportsController::class, 'serviceRatings'])
    ->name('department-head.reports.service-ratings');



        // HR view of a specific department's dashboard and analytics
Route::get('/department-head/dashboard/{department}', [\App\Http\Controllers\DepartmentHead\DashboardController::class, 'show'])
    ->name('department-head.dashboard.show');
Route::get('/department-head/analytics/{department}', [\App\Http\Controllers\DepartmentHead\AnalyticsController::class, 'show'])
    ->name('department-head.analytics.show');



    Route::post('/department-head/verify-pin', [\App\Http\Controllers\DepartmentHead\TrackingController::class, 'verifyPin'])
    ->name('department-head.verify-pin');
    Route::get('/department-head/track-departments', [\App\Http\Controllers\DepartmentHead\TrackingController::class, 'index'])
    ->name('department-head.track-departments');

    });







    // Route::middleware(['auth', 'hr'])->group(function () {
    //     Route::get('/perma-reports', [PermaReportController::class, 'index'])->name('perma.reports');


    //     Route::get('/perma-reports/{id}', [PermaReportController::class, 'show'])->name('perma.reports.show');


    //     Route::get('/perma-reports/stats', [PermaReportController::class, 'stats'])->name('perma-reports.stats');


    //     // Add other report routes here (e.g., show, export)
    // });


Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Reports index page (selection)
    Route::get('/reports', [AdminReportsController::class, 'index'])->name('reports.index');

    // Individual reports – all using the same controller
    Route::get('/reports/age-distribution', [AdminReportsController::class, 'ageDistribution'])->name('reports.age-distribution');
    Route::get('/reports/client-type-distribution', [AdminReportsController::class, 'clientTypeDistribution'])->name('reports.client-type-distribution');
    Route::get('/reports/gender-distribution', [AdminReportsController::class, 'genderDistribution'])->name('reports.gender-distribution');
    Route::get('/reports/region-distribution', [AdminReportsController::class, 'regionDistribution'])->name('reports.region-distribution');
    Route::get('/reports/service-summary', [AdminReportsController::class, 'serviceSummary'])->name('reports.service-summary');
    Route::get('/reports/cc-sqd-summary', [AdminReportsController::class, 'ccSqdSummary'])->name('reports.cc-sqd-summary');

  Route::get('/reports/summary-of-result', [App\Http\Controllers\Admin\AdminReportsController::class, 'summaryOfResult'])
    ->name('reports.summary-of-result');
Route::get('/reports/service-ratings', [App\Http\Controllers\Admin\AdminReportsController::class, 'serviceRatings'])
    ->name('reports.service-ratings');
});



});
