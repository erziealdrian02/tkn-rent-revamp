<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\DriverPortalController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\RepairController;
use App\Http\Controllers\ReturnController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

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
        return view('dashboard.dashboard-index');
    })->name('dashboard');

    // ── RENTAL MODULE ──
    Route::resource('rentals', RentalController::class)->except(['edit', 'update', 'destroy']);
    Route::post('/rentals/{rental}/approve', [RentalController::class, 'approve'])->name('rentals.approve');
    Route::post('/rentals/{rental}/cancel', [RentalController::class, 'cancel'])->name('rentals.cancel');

    // ── PROJECTS ──
    Route::resource('projects', ProjectController::class);

    // ── DELIVERIES ──
    Route::resource('deliveries', DeliveryController::class)->except(['edit', 'update', 'destroy']);
    Route::post('/deliveries/{delivery}/dispatch', [DeliveryController::class, 'dispatchDelivery'])->name('deliveries.dispatch');

    // ── RETURNS ──
    Route::resource('returns', ReturnController::class)->except(['edit', 'update', 'destroy']);

    // ── CLAIMS ──
    Route::resource('claims', ClaimController::class)->except(['edit', 'update', 'destroy']);
    Route::post('/claims/{claim}/approve', [ClaimController::class, 'approve'])->name('claims.approve');
    Route::post('/claims/{claim}/reject', [ClaimController::class, 'reject'])->name('claims.reject');

    // ── EQUIPMENT ──
    Route::resource('equipment', EquipmentController::class);

    // ── BRANCHES ──
    Route::resource('branches', BranchController::class);

    // ── STOCK & MOVEMENTS ──
    Route::get('/stock', [StockController::class, 'index'])->name('stock.index');
    Route::get('/stock-transfer', [StockController::class, 'transferForm'])->name('stock.transfer');
    Route::post('/stock-transfer', [StockController::class, 'transfer'])->name('stock.transfer.submit');

    Route::get('/movements', function () {
        return view('movements.movements-index');
    })->name('movements.index');

    Route::get('/movement-detail', function () {
        return view('movements.movements-show');
    })->name('movements.show');

    // ── PURCHASES ──
    Route::get('/purchases', function () {
        return view('purchases.purchases-index');
    })->name('purchases.index');

    Route::get('/purchase-create', function () {
        return view('purchases.purchases-create');
    })->name('purchases.create');

    Route::get('/purchase-detail', function () {
        return view('purchases.purchases-show');
    })->name('purchases.show');

    // ── GOODS RECEIPTS ──
    Route::get('/goods-receipts', function () {
        return view('goods-receipts.goods-receipts-index');
    })->name('goods-receipts.index');

    Route::get('/goods-receipt-detail', function () {
        return view('goods-receipts.goods-receipts-show');
    })->name('goods-receipts.show');

    // ── REPAIRS ──
    Route::resource('repairs', RepairController::class)->except(['create', 'store', 'edit', 'update', 'destroy']);
    Route::post('/repairs/{repair}/mark-fixed', [RepairController::class, 'markAsFixed'])->name('repairs.fixed');

    // ── MAINTENANCE ──
    Route::resource('maintenance', MaintenanceController::class)->except(['edit', 'update', 'destroy']);
    Route::post('/maintenance/{maintenance}/complete', [MaintenanceController::class, 'complete'])->name('maintenance.complete');

    // ── CUSTOMERS ──
    Route::resource('customers', CustomerController::class);

    // ── DRIVERS ──
    Route::resource('drivers', DriverController::class);

    // ── VEHICLES ──
    Route::resource('vehicles', VehicleController::class);

    // ── COMPANY ACCOUNTS ──
    Route::get('/accounts', function () {
        return view('accounts.accounts-index');
    })->name('accounts.index');

    // ── INVOICES ──
    Route::get('/invoices', function () {
        return view('invoices.invoices-index');
    })->name('invoices.index');

    Route::get('/invoice-detail', function () {
        return view('invoices.invoices-show');
    })->name('invoices.show');

    // ── FINANCE LEDGER ──
    Route::get('/finance-ledger', function () {
        return view('finance.finance-ledger');
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
    // ── DRIVER PORTAL ──
    // Currently relying on auth middleware, role checking can be done in Controller or custom Middleware.
    Route::prefix('driver')->name('driver.')->group(function () {
        Route::get('/deliveries', [DriverPortalController::class, 'index'])->name('deliveries.index');
        Route::get('/deliveries/{delivery}', [DriverPortalController::class, 'show'])->name('deliveries.show');
        Route::post('/deliveries/{delivery}/capture-pod', [DriverPortalController::class, 'capturePoD'])->name('deliveries.capture_pod');
    });
});
