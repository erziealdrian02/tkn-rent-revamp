<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Auth Routes (Guest)
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

/*
|--------------------------------------------------------------------------
| Redirect root to dashboard
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return redirect()->route('dashboard');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
| Phase 2: semua halaman sementara return view statis.
| Phase 3+ nanti akan diganti dengan Controller yang memanggil data dari DB.
*/
Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        return view('dashboard.index');
    })->name('dashboard');

    // ── RENTAL MODULE ──
    Route::get('/rentals', function () {
        return view('rentals.index');
    })->name('rentals.index');

    Route::get('/rental-create', function () {
        return view('rentals.create');
    })->name('rentals.create');

    Route::get('/rental-detail', function () {
        return view('rentals.show');
    })->name('rentals.show');

    // ── PROJECTS ──
    Route::get('/projects', function () {
        return view('projects.index');
    })->name('projects.index');

    Route::get('/project-create', function () {
        return view('projects.create');
    })->name('projects.create');

    Route::get('/project-detail', function () {
        return view('projects.show');
    })->name('projects.show');

    // ── DELIVERIES ──
    Route::get('/deliveries', function () {
        return view('deliveries.index');
    })->name('deliveries.index');

    Route::get('/delivery-detail', function () {
        return view('deliveries.show');
    })->name('deliveries.show');

    // ── RETURNS ──
    Route::get('/returns', function () {
        return view('returns.index');
    })->name('returns.index');

    Route::get('/return-detail', function () {
        return view('returns.show');
    })->name('returns.show');

    // ── CLAIMS ──
    Route::get('/claims', function () {
        return view('claims.index');
    })->name('claims.index');

    Route::get('/claim-detail', function () {
        return view('claims.show');
    })->name('claims.show');

    // ── EQUIPMENT ──
    Route::get('/equipment', [\App\Http\Controllers\EquipmentController::class, 'index'])->name('equipment.index');

    Route::get('/equipment-detail/{id}', [\App\Http\Controllers\EquipmentController::class, 'show'])->name('equipment.show');

    // ── BRANCHES ──
    Route::get('/branches', [\App\Http\Controllers\BranchController::class, 'index'])->name('branches.index');

    Route::get('/branch-detail/{id}', [\App\Http\Controllers\BranchController::class, 'show'])->name('branches.show');

    // ── STOCK & MOVEMENTS ──
    Route::get('/stock', [\App\Http\Controllers\StockController::class, 'index'])->name('stock.index');

    Route::get('/stock-transfer', function () {
        return view('stock.transfer');
    })->name('stock.transfer');

    Route::get('/movements', function () {
        return view('movements.index');
    })->name('movements.index');

    Route::get('/movement-detail', function () {
        return view('movements.show');
    })->name('movements.show');

    // ── PURCHASES ──
    Route::get('/purchases', function () {
        return view('purchases.index');
    })->name('purchases.index');

    Route::get('/purchase-create', function () {
        return view('purchases.create');
    })->name('purchases.create');

    Route::get('/purchase-detail', function () {
        return view('purchases.show');
    })->name('purchases.show');

    // ── GOODS RECEIPTS ──
    Route::get('/goods-receipts', function () {
        return view('goods-receipts.index');
    })->name('goods-receipts.index');

    Route::get('/goods-receipt-detail', function () {
        return view('goods-receipts.show');
    })->name('goods-receipts.show');

    // ── REPAIRS ──
    Route::get('/repairs', function () {
        return view('repairs.index');
    })->name('repairs.index');

    Route::get('/repair-detail', function () {
        return view('repairs.show');
    })->name('repairs.show');

    // ── MAINTENANCE ──
    Route::get('/maintenance', function () {
        return view('maintenance.index');
    })->name('maintenance.index');

    Route::get('/maintenance-detail', function () {
        return view('maintenance.show');
    })->name('maintenance.show');

    // ── CUSTOMERS ──
    Route::get('/customers', [\App\Http\Controllers\CustomerController::class, 'index'])->name('customers.index');

    Route::get('/customer-detail/{id}', [\App\Http\Controllers\CustomerController::class, 'show'])->name('customers.show');

    // ── DRIVERS ──
    Route::get('/drivers', [\App\Http\Controllers\DriverController::class, 'index'])->name('drivers.index');

    Route::get('/driver-detail/{id}', [\App\Http\Controllers\DriverController::class, 'show'])->name('drivers.show');

    // ── VEHICLES ──
    Route::get('/vehicles', [\App\Http\Controllers\VehicleController::class, 'index'])->name('vehicles.index');

    Route::get('/vehicle-detail/{id}', [\App\Http\Controllers\VehicleController::class, 'show'])->name('vehicles.show');

    // ── COMPANY ACCOUNTS ──
    Route::get('/accounts', function () {
        return view('accounts.index');
    })->name('accounts.index');

    // ── INVOICES ──
    Route::get('/invoices', function () {
        return view('invoices.index');
    })->name('invoices.index');

    Route::get('/invoice-detail', function () {
        return view('invoices.show');
    })->name('invoices.show');

    // ── FINANCE LEDGER ──
    Route::get('/finance-ledger', function () {
        return view('finance.ledger');
    })->name('finance.ledger');

    // ── ADMIN ──
    Route::get('/users', function () {
        return view('admin.users');
    })->name('admin.users');

    Route::get('/roles', function () {
        return view('admin.roles');
    })->name('admin.roles');

    Route::get('/role-create', function () {
        return view('admin.roles-create');
    })->name('admin.roles.create');

    // ── DRIVER PORTAL ──
    Route::get('/driver-dashboard', function () {
        return view('driver.dashboard');
    })->name('driver.dashboard');

    Route::get('/driver-deliveries', function () {
        return view('driver.deliveries');
    })->name('driver.deliveries');

    Route::get('/driver-delivery-detail', function () {
        return view('driver.delivery-show');
    })->name('driver.delivery.show');
});
