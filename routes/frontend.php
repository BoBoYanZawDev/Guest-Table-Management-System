<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FrontendController;

Route::get('/guest_table', [FrontendController::class, 'guest_table'])->name('guest_table');

Route::get('/planner/checkin', [FrontendController::class, 'checkinPage'])->name('planner.checkin');

// actions (Inertia posts)FrontendController
Route::post('/planner/guests', [FrontendController::class, 'storeGuest'])->name('planner.guests.store');
Route::post('/planner/guests/{guest}/checkin', [FrontendController::class, 'checkinGuest'])->name('planner.guests.checkin');
Route::post('/planner/guests/{guest}/toggle', [FrontendController::class, 'toggleGuestStatus'])->name('planner.guests.toggle');
Route::post('/planner/move', [FrontendController::class, 'moveGuest'])->name('planner.move');
Route::post('/planner/swap', [FrontendController::class, 'swapGuests'])->name('planner.swap');
