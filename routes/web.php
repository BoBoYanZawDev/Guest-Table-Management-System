<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;

include __DIR__ . '/frontend.php';

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('mgmt-admin')->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        // master data routes
        include __DIR__ . '/master.php';
    });
});
require __DIR__ . '/auth.php';
