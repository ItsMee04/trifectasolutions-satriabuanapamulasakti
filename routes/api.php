<?php

use App\Http\Controllers\Authentication\AuthController;
use App\Http\Controllers\Master\CustomerController;
use App\Http\Controllers\Master\DriverController;
use App\Http\Controllers\Master\PegawaiController;
use App\Http\Controllers\Master\PermissionController;
use App\Http\Controllers\Master\RoleController;
use App\Http\Controllers\Master\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Master\JenisKendaraanController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Public Routes ---
// Route yang bisa diakses tanpa token (sebelum login)
Route::post('/login', [AuthController::class, 'login']);


// --- Protected Routes ---
// Hanya bisa diakses jika membawa Bearer Token yang valid
Route::middleware('auth:sanctum')->group(function () {

    // Route untuk mengambil data user & hak akses (untuk kebutuhan Vue App.vue / Pinia)
    Route::get('/me', [AuthController::class, 'me']);

    // Route untuk menghapus token (Logout)
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- Module Master ---
    // Anda bisa menambahkan middleware kustom nanti untuk mengecek modul spesifik
    Route::prefix('master')->group(function () {

        // Mengelompokkan route khusus Role
        Route::prefix('role')->group(function () {
            Route::get('/', [RoleController::class, 'getRole']);          // GET /api/master/role
            Route::post('/store', [RoleController::class, 'storeRole']);    // POST /api/master/role/store
            Route::put('/update', [RoleController::class, 'updateRole']);   // PUT /api/master/role/update
            Route::delete('/delete', [RoleController::class, 'deleteRole']); // DELETE /api/master/role/delete
        });

        // Mengelompokkan route khusus Pegawai
        Route::prefix('pegawai')->group(function () {
            Route::get('/', [PegawaiController::class, 'getPegawai']);          // GET /api/master/pegawai
            Route::post('/store', [PegawaiController::class, 'storePegawai']);    // POST /api/master/pegawai/store
            Route::post('/update', [PegawaiController::class, 'updatePegawai']);   // PUT /api/master/pegawai/update
            Route::delete('/delete', [PegawaiController::class, 'deletePegawai']); // DELETE /api/master/pegawai/delete
        });

        // Mengelompokkan route khusus Pengguna
        Route::prefix('user')->group(function () {
            Route::get('/', [UserController::class, 'getUsers']);          // GET /api/master/user
            Route::post('/store', [UserController::class, 'storeUser']);    // POST /api/master/user/store
            Route::post('/update', [UserController::class, 'updateUser']);   // PUT /api/master/user/update
            Route::delete('/delete', [UserController::class, 'deleteUser']); // DELETE /api/master/user/delete
        });

        // Mengelompokkan route khusus Permission
        Route::prefix('permission')->group(function () {
            Route::get('/', [PermissionController::class, 'getPermissions']);
            // Tambahkan {userId} di sini
            Route::post('/update/{userId}', [PermissionController::class, 'updatePermissions']);
        });

        // Mengelompokkan route khusus Driver
        Route::prefix('driver')->group(function () {
            Route::get('/', [DriverController::class, 'getDriver']);          // GET /api/master/driver
            Route::post('/store', [DriverController::class, 'storeDriver']);    // POST /api/master/driver/store
            Route::post('/update', [DriverController::class, 'updateDriver']);   // PUT /api/master/driver/update
            Route::delete('/delete', [DriverController::class, 'deleteDriver']); // DELETE /api/master/driver/delete
        });

        // Mengelompokkan route khusus Customer
        Route::prefix('customer')->group(function () {
            Route::get('/', [CustomerController::class, 'getCustomer']);          // GET /api/master/customer
            Route::post('/store', [CustomerController::class, 'storeCustomer']);    // POST /api/master/customer/store
            Route::post('/update', [CustomerController::class, 'updateCustomer']);   // PUT /api/master/customer/update
            Route::delete('/delete', [CustomerController::class, 'deleteCustomer']); // DELETE /api/master/customer/delete
        });

        // Mengelompokkan route khusus Jenis Kendaraan
        Route::prefix('jeniskendaraan')->group(function () {
            Route::get('/', [JenisKendaraanController::class, 'getJenisKendaraan']);          // GET /api/master/jenis-kendaraan
            Route::post('/store', [JenisKendaraanController::class, 'storeJenisKendaraan']);    // POST /api/master/jenis-kendaraan/store
            Route::post('/update', [JenisKendaraanController::class, 'updateJenisKendaraan']);   // PUT /api/master/jenis-kendaraan/update
            Route::delete('/delete', [JenisKendaraanController::class, 'deleteJenisKendaraan']); // DELETE /api/master/jenis-kendaraan/delete
        });
    });
});
