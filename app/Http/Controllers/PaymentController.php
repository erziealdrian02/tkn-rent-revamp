<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Services\FinanceService;

class PaymentController extends Controller
{
    protected $financeService;

    public function __construct(FinanceService $financeService)
    {
        $this->financeService = $financeService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required|uuid|exists:rnt_invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string',
            'company_account_id' => 'nullable|uuid|exists:ms_company_accounts,id',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        $invoice = Invoice::findOrFail($request->invoice_id);
        $remaining = $invoice->total_amount - $invoice->paid_amount;
        if ($request->amount > $remaining) {
            return back()->with('error', 'Payment amount exceeds the remaining balance of ' . number_format($remaining, 0, ',', '.'));
        }

        try {
            $this->financeService->recordPayment(
                $request->invoice_id,
                $request->amount,
                $request->payment_method,
                $request->company_account_id,
                $request->reference_number,
                $request->notes
            );
            return back()->with('success', 'Payment recorded successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
