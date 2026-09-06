@extends('layouts.app')

@section('title', 'Goods Receipts — EquipRent Enterprise')

@section('content')
<div class="page-header">
    <div class="page-header-left">
        <h2 class="page-header-title">Goods Receipts</h2>
        <p class="page-header-subtitle">Record received equipment from vendors</p>
    </div>
</div>

<div class="er-card">
    <div class="er-card-body p-0">
        <div class="er-table-wrapper">
            <table class="er-table">
                <thead>
                    <tr>
                        <th>GR Number</th>
                        <th>PO Number</th>
                        <th>Equipment</th>
                        <th>Branch</th>
                        <th>Qty Received</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($receipts as $gr)
                    <tr>
                        <td><a href="{{ route('goods-receipts.show', $gr->id) }}" class="cell-link text-mono">{{ $gr->gr_number }}</a></td>
                        <td><a href="{{ route('purchases.show', $gr->purchase_id) }}" class="text-mono">{{ $gr->purchase->po_number ?? '-' }}</a></td>
                        <td class="fw-500">{{ $gr->purchase->equipment->name ?? '-' }}</td>
                        <td>{{ $gr->branch->name ?? '-' }}</td>
                        <td>{{ $gr->qty_received }}</td>
                        <td>{{ \Carbon\Carbon::parse($gr->received_date)->format('d M Y') }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="text-center py-4 text-muted">No goods receipts found.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
