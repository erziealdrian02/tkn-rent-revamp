<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\GeneralLedger;
use App\Models\Rental;
use App\Models\Claim;
use App\Models\CompanyAccount;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FinanceService
{
    /**
     * Generate an invoice for a newly approved rental
     */
    public function generateInvoiceFromRental(Rental $rental): Invoice
    {
        return DB::transaction(function () use ($rental) {
            $invoice = Invoice::create([
                'id' => Str::uuid(),
                'invoice_number' => 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(4)),
                'type' => 'RENTAL',
                'rental_id' => $rental->id,
                'customer_id' => $rental->project->customer_id,
                'subtotal' => 0,
                'discount' => 0,
                'tax' => 0,
                'total_amount' => 0,
                'status' => 'ISSUED',
                'issue_date' => now()->toDateString(),
                'due_date' => now()->addDays(30)->toDateString(),
                'created_by' => auth()->id() ?? null,
            ]);

            $subtotal = 0;
            // Calculate total based on days between start_date and return_date
            $start = \Carbon\Carbon::parse($rental->start_date);
            $end = \Carbon\Carbon::parse($rental->return_date);
            $days = $start->diffInDays($end) ?: 1;

            foreach ($rental->items as $item) {
                $lineSubtotal = $item->quantity * $item->unit_price * $days;
                InvoiceItem::create([
                    'id' => Str::uuid(),
                    'invoice_id' => $invoice->id,
                    'description' => "Rental of {$item->equipment->name} for {$days} days",
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price * $days, // Price for the duration
                    'subtotal' => $lineSubtotal,
                ]);
                $subtotal += $lineSubtotal;
            }

            $tax = $subtotal * 0.11; // 11% tax assumption
            $invoice->update([
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total_amount' => $subtotal + $tax
            ]);

            return $invoice;
        });
    }

    /**
     * Generate an invoice for an approved claim (damaged/lost)
     */
    public function generateInvoiceFromClaim(Claim $claim): Invoice
    {
        return DB::transaction(function () use ($claim) {
            $invoice = Invoice::create([
                'id' => Str::uuid(),
                'invoice_number' => 'INV-CLM-' . date('Ymd') . '-' . strtoupper(Str::random(4)),
                'type' => 'CLAIM',
                'claim_id' => $claim->id,
                'customer_id' => $claim->customer_id,
                'subtotal' => $claim->amount,
                'discount' => 0,
                'tax' => 0, // Assume no tax on penalty claims
                'total_amount' => $claim->amount,
                'status' => 'ISSUED',
                'issue_date' => now()->toDateString(),
                'due_date' => now()->addDays(14)->toDateString(),
                'created_by' => auth()->id() ?? null,
            ]);

            foreach ($claim->items as $item) {
                InvoiceItem::create([
                    'id' => Str::uuid(),
                    'invoice_id' => $invoice->id,
                    'description' => "Claim for {$item->equipment->name}",
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                ]);
            }

            return $invoice;
        });
    }

    /**
     * Record a payment and log it to the general ledger
     */
    public function recordPayment(string $invoiceId, float $amount, string $method, ?string $companyAccountId, ?string $referenceNumber = null, ?string $notes = null): Payment
    {
        return DB::transaction(function () use ($invoiceId, $amount, $method, $companyAccountId, $referenceNumber, $notes) {
            $invoice = Invoice::findOrFail($invoiceId);

            $payment = Payment::create([
                'id' => Str::uuid(),
                'invoice_id' => $invoice->id,
                'amount' => $amount,
                'payment_method' => $method,
                'reference_number' => $referenceNumber,
                'company_account_id' => $companyAccountId,
                'payment_date' => now()->toDateString(),
                'notes' => $notes,
                'recorded_by' => auth()->id() ?? null,
            ]);

            $invoice->paid_amount += $amount;
            
            if ($invoice->paid_amount >= $invoice->total_amount) {
                $invoice->status = 'PAID';
            } else {
                $invoice->status = 'PARTIAL';
            }
            $invoice->save();

            // Record to General Ledger
            // Get previous running balance
            $lastEntry = GeneralLedger::where('company_account_id', $companyAccountId)->orderBy('created_at', 'desc')->first();
            $prevBalance = $lastEntry ? $lastEntry->running_balance : 0;
            $newBalance = $prevBalance + $amount;

            GeneralLedger::create([
                'id' => Str::uuid(),
                'entry_type' => 'MONEY_IN',
                'category' => $invoice->type === 'CLAIM' ? 'CLAIM_PAYMENT' : 'RENTAL_PAYMENT',
                'reference_id' => $payment->id,
                'reference_type' => Payment::class,
                'company_account_id' => $companyAccountId,
                'amount' => $amount,
                'running_balance' => $newBalance,
                'description' => "Payment received for Invoice {$invoice->invoice_number}",
                'transaction_date' => now()->toDateString(),
                'created_by' => auth()->id() ?? null,
            ]);

            return $payment;
        });
    }
}
