<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,  
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Register middleware aliases
        $middleware->alias([
            'check.account.type' => \App\Http\Middleware\CheckAccountTypeMiddleware::class,
            'hr' => \App\Http\Middleware\IsHrUser::class, 
        ]);
        
        // Or add it to the web middleware group if you want it to run on all web requests
        // $middleware->appendToGroup('web', \App\Http\Middleware\CheckAccountTypeMiddleware::class);
        
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();