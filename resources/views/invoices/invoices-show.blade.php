@extends('layouts.app')

@section('title', 'Invoice Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
    <div class="detail-header">
        <div class="detail-header-left">
            <div class="detail-header-icon" style="background:var(--primary-bg,#eff6ff);color:var(--primary,#2563eb)">
                <i class="bi bi-receipt"></i>
            </div>
            <div class="detail-header-info">
                <h2>{{ $invoice->invoice_number }} 
                    @if($invoice->status === 'PAID')
                        <span class="badge bg-success-subtle text-success">Paid</span>
                    @elseif($invoice->status === 'PARTIAL')
                        <span class="badge bg-warning-subtle text-warning">Partial</span>
                    @else
                        <span class="badge bg-secondary-subtle text-secondary">{{ $invoice->status }}</span>
                    @endif
                </h2>
                <div class="detail-meta">
                    <span class="detail-meta-item"><i class="bi bi-building"></i>Customer: {{ $invoice->customer->name ?? '-' }}</span>
                    <span class="detail-meta-item"><i class="bi bi-calendar"></i>Issue: {{ \Carbon\Carbon::parse($invoice->issue_date)->format('d M Y') }}</span>
                    <span class="detail-meta-item"><i class="bi bi-calendar-x"></i>Due: {{ \Carbon\Carbon::parse($invoice->due_date)->format('d M Y') }}</span>
                </div>
            </div>
        </div>
        <div class="detail-header-actions d-flex gap-2">
            <button class="btn btn-outline-secondary btn-sm" onclick="window.print()"><i class="bi bi-printer me-1"></i>Print</button>
        </div>
    </div>
    
    <div class="p-4">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        @if(session('error'))
            <div class="alert alert-danger">{{ session('error') }}</div>
        @endif

        <div class="row g-4">
            <div class="col-md-8">
                <div class="info-group">
                    <h5 class="info-group-title"><i class="bi bi-list-ul me-2"></i>Invoice Items</h5>
                    <table class="er-table border mt-3">
                        <thead class="table-light">
                            <tr>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($invoice->items as $item)
                            <tr>
                                <td class="fw-500">{{ $item->description }}</td>
                                <td>{{ $item->quantity }}</td>
                                <td>Rp {{ number_format($item->unit_price, 0, ',', '.') }}</td>
                                <td>Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                        <tfoot class="table-light">
                            <tr>
                                <td colspan="3" class="text-end fw-500">Subtotal:</td>
                                <td class="fw-600">Rp {{ number_format($invoice->subtotal, 0, ',', '.') }}</td>
                            </tr>
                            @if($invoice->discount > 0)
                            <tr>
                                <td colspan="3" class="text-end fw-500 text-success">Discount:</td>
                                <td class="fw-600 text-success">- Rp {{ number_format($invoice->discount, 0, ',', '.') }}</td>
                            </tr>
                            @endif
                            @if($invoice->tax > 0)
                            <tr>
                                <td colspan="3" class="text-end fw-500">Tax:</td>
                                <td class="fw-600">Rp {{ number_format($invoice->tax, 0, ',', '.') }}</td>
                            </tr>
                            @endif
                            <tr>
                                <td colspan="3" class="text-end fw-bold fs-5">Total Amount:</td>
                                <td class="fw-bold fs-5 text-primary">Rp {{ number_format($invoice->total_amount, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td colspan="3" class="text-end fw-500 text-success">Total Paid:</td>
                                <td class="fw-600 text-success">Rp {{ number_format($invoice->paid_amount, 0, ',', '.') }}</td>
                            </tr>
                            <tr class="table-warning">
                                <td colspan="3" class="text-end fw-bold text-danger">Balance Due:</td>
                                <td class="fw-bold text-danger">Rp {{ number_format($invoice->total_amount - $invoice->paid_amount, 0, ',', '.') }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                @if($invoice->payments->count() > 0)
                <div class="info-group mt-4">
                    <h5 class="info-group-title"><i class="bi bi-wallet2 me-2"></i>Payment History</h5>
                    <table class="er-table border mt-3">
                        <thead class="table-light">
                            <tr>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Reference</th>
                                <th>Account</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($invoice->payments as $payment)
                            <tr>
                                <td>{{ \Carbon\Carbon::parse($payment->payment_date)->format('d M Y') }}</td>
                                <td>{{ $payment->payment_method }}</td>
                                <td>{{ $payment->reference_number ?? '-' }}</td>
                                <td>{{ $payment->companyAccount->bank_name ?? '-' }}</td>
                                <td class="fw-600 text-success">Rp {{ number_format($payment->amount, 0, ',', '.') }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                @endif
            </div>

            <div class="col-md-4">
                @if(!in_array($invoice->status, ['PAID', 'CANCELLED']))
                <div class="card border-primary mb-4">
                    <div class="card-header bg-primary text-white fw-bold">
                        <i class="bi bi-credit-card me-2"></i>Record Payment
                    </div>
                    <div class="card-body">
                        <form action="{{ route('payments.store') }}" method="POST">
                            @csrf
                            <input type="hidden" name="invoice_id" value="{{ $invoice->id }}">
                            
                            <div class="mb-3">
                                <label class="form-label form-label-er">Payment Amount (Rp)</label>
                                <input type="number" name="amount" class="form-control fw-bold text-primary" min="1" max="{{ $invoice->total_amount - $invoice->paid_amount }}" value="{{ $invoice->total_amount - $invoice->paid_amount }}" required>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label form-label-er">Payment Method</label>
                                <select name="payment_method" class="form-select" required>
                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                    <option value="CASH">Cash</option>
                                    <option value="CHEQUE">Cheque</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label form-label-er">Company Bank Account</label>
                                <select name="company_account_id" class="form-select" required>
                                    <option value="">Select Account...</option>
                                    @foreach($companyAccounts as $account)
                                        <option value="{{ $account->id }}">{{ $account->bank_name }} ({{ $account->account_number }})</option>
                                    @endforeach
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label form-label-er">Reference No.</label>
                                <input type="text" name="reference_number" class="form-control" placeholder="e.g. TRF-12345">
                            </div>

                            <div class="mb-3">
                                <label class="form-label form-label-er">Notes</label>
                                <textarea name="notes" class="form-control" rows="2"></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary w-100"><i class="bi bi-check-circle me-1"></i>Confirm Payment</button>
                        </form>
                    </div>
                </div>
                @endif
                
                <div class="info-group">
                    <h5 class="info-group-title"><i class="bi bi-chat-text me-2"></i>Invoice Notes</h5>
                    <div class="alert alert-secondary mt-3">
                        <p class="mb-0 fs-14">{{ $invoice->notes ?? 'No notes provided.' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
