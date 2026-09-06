<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\CompanyAccount;
use App\Models\Payment;
use App\Services\FinanceService;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with(['customer', 'creator'])->orderBy('created_at', 'desc')->get();
        return view('invoices.invoices-index', compact('invoices'));
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(['items', 'customer', 'payments.companyAccount', 'creator']);
        $companyAccounts = CompanyAccount::where('status', 'ACTIVE')->get();
        return view('invoices.invoices-show', compact('invoice', 'companyAccounts'));
    }
}
