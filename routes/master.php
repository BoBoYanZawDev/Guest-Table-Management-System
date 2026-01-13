<?php

use App\Http\Controllers\AppSettingController;
use App\Http\Middleware\MustBeAdmin;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\AdvertisementController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\GuestTableController;
// for user
Route::resource('users', UserController::class);
Route::get('/qr/{userid}', [UserController::class, 'generate'])->name('users.qr.generate');
Route::resource('app_settings', AppSettingController::class);
Route::resource('guest_tables', GuestTableController::class);

// Route::resource();
