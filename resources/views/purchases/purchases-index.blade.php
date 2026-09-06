@extends('layouts.app')

@section('title', 'Purchase Orders — EquipRent Enterprise')

@section('content')
<div class="page-header">
    <div class="page-header-left">
        <h2 class="page-header-title">Purchase Orders</h2>
        <p class="page-header-subtitle">Manage procurement of new equipment</p>
    </div>
    <div class="page-header-actions">
        <a href="{{ route('purchases.create') }}" class="btn btn-primary btn-sm"><i class="bi bi-plus-lg me-1"></i>Create PO</a>
    </div>
</div>

<div class="er-card">
    <div class="er-card-body p-0">
        <div class="er-table-wrapper">
            <table class="er-table">
                <thead>
                    <tr>
                        <th>PO Number</th>
                        <th>Equipment</th>
                        <th>Vendor</th>
                        <th>Amount (Rp)</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($purchases as $po)
                    <tr>
                        <td><a href="{{ route('purchases.show', $po->id) }}" class="cell-link text-mono">{{ $po->po_number }}</a></td>
                        <td class="fw-500">{{ $po->equipment->name ?? '-' }} (x{{ $po->qty_ordered }})</td>
                        <td>{{ $po->vendor_name }}</td>
                        <td>Rp {{ number_format($po->total_amount, 0, ',', '.') }}</td>
                        <td>
                            @if($po->status === 'APPROVED')
                                <span class="badge bg-success-subtle text-success">Approved</span>
                            @elseif($po->status === 'RECEIVED')
                                <span class="badge bg-info-subtle text-info">Received</span>
                            @else
                                <span class="badge bg-secondary-subtle text-secondary">{{ $po->status }}</span>
                            @endif
                        </td>
                        <td>{{ \Carbon\Carbon::parse($po->order_date)->format('d M Y') }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="text-center py-4 text-muted">No purchase orders found.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
