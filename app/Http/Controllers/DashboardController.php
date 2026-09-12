<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\GeneralLedger;
use App\Models\Invoice;
use App\Models\Rental;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Total Active Rentals (status = APPROVED or ON_GOING - assuming ON_GOING based on previous logic, but let's check non-completed)
        $activeRentals = Rental::whereNotIn('status', ['DRAFT', 'COMPLETED', 'CANCELLED'])->count();

        // 2. Total Equipment Types
        $totalEquipment = Equipment::where('status', 'ACTIVE')->count();

        // 3. Outstanding Invoices (Amount)
        $outstandingInvoices = Invoice::whereNotIn('status', ['DRAFT', 'PAID', 'CANCELLED'])
            ->selectRaw('SUM(amount - paid_amount) as outstanding')
            ->value('outstanding') ?? 0;

        // 4. Monthly Revenue (Money In this month)
        $monthlyRevenue = GeneralLedger::where('type', 'MONEY_IN')
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount') ?? 0;

        // Recent Rentals
        $recentRentals = Rental::with('project.customer')->orderBy('created_at', 'desc')->take(5)->get();

        // Recent Invoices
        $recentInvoices = Invoice::with('customer')->orderBy('created_at', 'desc')->take(5)->get();

        // Chart data: Rental Status distribution
        $rentalStatusData = Rental::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // Chart data: Invoice Status distribution
        $invoiceStatusData = Invoice::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // Chart data: Equipment Utilization (available vs on_rental from stock)
        $equipUtilData = [];

        return view('dashboard.dashboard-index', compact(
            'activeRentals',
            'totalEquipment',
            'outstandingInvoices',
            'monthlyRevenue',
            'recentRentals',
            'recentInvoices',
            'rentalStatusData',
            'invoiceStatusData',
            'equipUtilData',
        ));
    }
}
