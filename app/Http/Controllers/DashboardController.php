<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rental;
use App\Models\Equipment;
use App\Models\Invoice;
use App\Models\GeneralLedger;

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
            ->sum(\Illuminate\Support\Facades\DB::raw('total_amount - paid_amount'));

        // 4. Monthly Revenue (Money In this month)
        $monthlyRevenue = GeneralLedger::where('entry_type', 'MONEY_IN')
            ->whereMonth('transaction_date', now()->month)
            ->whereYear('transaction_date', now()->year)
            ->sum('amount');

        // Recent Rentals
        $recentRentals = Rental::with('project.customer')->orderBy('created_at', 'desc')->take(5)->get();

        // Recent Invoices
        $recentInvoices = Invoice::with('customer')->orderBy('created_at', 'desc')->take(5)->get();

        return view('dashboard.dashboard-index', compact(
            'activeRentals',
            'totalEquipment',
            'outstandingInvoices',
            'monthlyRevenue',
            'recentRentals',
            'recentInvoices'
        ));
    }
}
