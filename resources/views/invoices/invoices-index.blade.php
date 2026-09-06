@extends('layouts.app')

@section('title', 'Invoices — EquipRent Enterprise')

@section('content')
<div class="page-header">
    <div class="page-header-left">
        <h2 class="page-header-title">Invoices</h2>
        <p class="page-header-subtitle">Manage customer billing and payments</p>
    </div>
</div>

<div class="er-card">
    <div class="er-card-body p-0">
        <div class="er-table-wrapper">
            <table class="er-table">
                <thead>
                    <tr>
                        <th>Invoice Number</th>
                        <th>Type</th>
                        <th>Customer</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($invoices as $inv)
                    <tr>
                        <td><a href="{{ route('invoices.show', $inv->id) }}" class="cell-link text-mono">{{ $inv->invoice_number }}</a></td>
                        <td>
                            @if($inv->type === 'RENTAL')
                                <span class="badge bg-primary-subtle text-primary border border-primary-subtle"><i class="bi bi-file-earmark-text me-1"></i>Rental</span>
                            @else
                                <span class="badge bg-warning-subtle text-warning border border-warning-subtle"><i class="bi bi-exclamation-triangle me-1"></i>Claim</span>
                            @endif
                        </td>
                        <td class="fw-500">{{ $inv->customer->name ?? '-' }}</td>
                        <td class="fw-600">Rp {{ number_format($inv->total_amount, 0, ',', '.') }}</td>
                        <td>
                            @if($inv->status === 'PAID')
                                <span class="badge bg-success-subtle text-success">Paid</span>
                            @elseif($inv->status === 'PARTIAL')
                                <span class="badge bg-warning-subtle text-warning">Partial</span>
                            @elseif($inv->status === 'OVERDUE')
                                <span class="badge bg-danger-subtle text-danger">Overdue</span>
                            @else
                                <span class="badge bg-secondary-subtle text-secondary">{{ $inv->status }}</span>
                            @endif
                        </td>
                        <td>{{ \Carbon\Carbon::parse($inv->issue_date)->format('d M Y') }}</td>
                        <td>
                            @if(\Carbon\Carbon::parse($inv->due_date)->isPast() && !in_array($inv->status, ['PAID', 'CANCELLED']))
                                <span class="text-danger fw-500"><i class="bi bi-exclamation-circle me-1"></i>{{ \Carbon\Carbon::parse($inv->due_date)->format('d M Y') }}</span>
                            @else
                                {{ \Carbon\Carbon::parse($inv->due_date)->format('d M Y') }}
                            @endif
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="text-center py-4 text-muted">No invoices found.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
