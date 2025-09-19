<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::prefix('admin/auth')->group(function () {
    Route::post('/register', [AdminAuthController::class, 'register']);
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::get('/roles', [AdminAuthController::class, 'getRoles']);
});

Route::middleware(['auth:sanctum', 'role.user'])->prefix('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});

Route::middleware(['auth:sanctum', 'role.admin'])->prefix('admin/auth')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);
    Route::post('/refresh', [AdminAuthController::class, 'refresh']);
});

Route::middleware(['auth:sanctum', 'role.admin'])->prefix('admin')->group(function () {
    Route::get('/me', [AdminAuthController::class, 'me']);
});

Route::middleware(['auth:sanctum', 'role.user'])->group(function () {
    Route::get('/user/dashboard', function () {
        return response()->json([
            'message' => 'Welcome to user dashboard',
            'user' => auth()->user()
        ]);
    });
});

Route::middleware(['auth:sanctum', 'role.admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json([
            'message' => 'Welcome to admin dashboard',
            'admin' => auth()->user()->load('role')
        ]);
    });
});

Route::middleware(['auth:sanctum', 'role.admin'])->prefix('admin')->group(function () {
    Route::get('products', [ProductController::class, 'index']);
    Route::post('products', [ProductController::class, 'store'])->middleware('permission.product:products.create');
    Route::get('products/{product}', [ProductController::class, 'show']);
    Route::put('products/{product}', [ProductController::class, 'update'])->middleware('permission.product:products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->middleware('permission.product:products.delete');
    
    Route::get('users', [UserController::class, 'index'])->middleware('permission.product:users.read');
    Route::post('users', [UserController::class, 'store'])->middleware('permission.product:users.create');
    Route::get('users/{user}', [UserController::class, 'show'])->middleware('permission.product:users.read');
    Route::put('users/{user}', [UserController::class, 'update'])->middleware('permission.product:users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->middleware('permission.product:users.delete');
});