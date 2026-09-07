@extends('layouts.app')

@section('title', 'Claim Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
    <div class="detail-header" id="detailHeader">
        <div class="detail-header-left">
            <div class="detail-header-icon"><i class="bi bi-shield-exclamation"></i></div>
            <div class="detail-header-info">
                <h2>{{ substr($claim->id, 0, 8) }} <span class="badge bg-secondary-subtle text-secondary">{{ $claim->status }}</span></h2>
                <div class="detail-meta">
                    <span class="detail-meta-item"><i class="bi bi-person"></i>Customer: {{ $claim->customer->name ?? '-' }}</span>
                    <span class="detail-meta-item"><i class="bi bi-box-arrow-in-left"></i>Source Return: <a href="{{ route('returns.show', $claim->return_id) }}">{{ substr($claim->return_id, 0, 8) }}</a></span>
                    <span class="detail-meta-item"><i class="bi bi-exclamation-triangle"></i>Type: {{ $claim->type }}</span>
                </div>
            </div>
        </div>
        <div class="detail-header-actions d-flex gap-2">
            @if($claim->status === 'DRAFT')
                <form action="{{ route('claims.approve', $claim->id) }}" method="POST">
                    @csrf
                    <button type="submit" class="btn btn-success btn-sm"><i class="bi bi-check-lg me-1"></i>Approve Claim</button>
                </form>
                <form action="{{ route('claims.reject', $claim->id) }}" method="POST">
                    @csrf
                    <button type="submit" class="btn btn-outline-danger btn-sm"><i class="bi bi-x-lg me-1"></i>Reject Claim</button>
                </form>
            @endif
        </div>
    </div>
    
    <div class="p-4">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        
        <div class="info-group">
            <h5 class="info-group-title"><i class="bi bi-cash-stack me-2"></i>Claim Details</h5>
            <table class="er-table border mt-3">
                <thead class="table-light">
                    <tr>
                        <th>Equipment</th>
                        <th>Qty</th>
                        <th>Unit Price (Rp)</th>
                        <th>Subtotal (Rp)</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($claim->items as $item)
                        <tr>
                            <td class="fw-500">{{ $item->equipment->name ?? '-' }}</td>
                            <td>{{ $item->quantity }}</td>
                            <td>{{ number_format($item->unit_price, 0, ',', '.') }}</td>
                            <td class="fw-600">{{ number_format($item->subtotal, 0, ',', '.') }}</td>
                        </tr>
                    @endforeach
                    <tr class="table-light fw-bold">
                        <td colspan="3" class="text-end">Total Claim Amount:</td>
                        <td class="text-danger">Rp {{ number_format($claim->amount, 0, ',', '.') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
