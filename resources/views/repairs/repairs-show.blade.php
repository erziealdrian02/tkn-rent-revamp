@extends('layouts.app')

@section('title', 'Repair Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
    <div class="detail-header" id="detailHeader">
        <div class="detail-header-left">
            <div class="detail-header-icon"><i class="bi bi-tools"></i></div>
            <div class="detail-header-info">
                <h2>{{ substr($repair->id, 0, 8) }} <span class="badge bg-secondary-subtle text-secondary">{{ $repair->status }}</span></h2>
                <div class="detail-meta">
                    <span class="detail-meta-item"><i class="bi bi-gear"></i>Equipment: {{ $repair->equipment->name ?? '-' }}</span>
                    <span class="detail-meta-item"><i class="bi bi-hash"></i>Qty: {{ $repair->quantity }}</span>
                    <span class="detail-meta-item"><i class="bi bi-building"></i>Branch: {{ $repair->branch->name ?? '-' }}</span>
                    @if($repair->returnItem)
                        <span class="detail-meta-item"><i class="bi bi-box-arrow-in-left"></i>Source Return: <a href="{{ route('returns.show', $repair->returnItem->returnRecord->id) }}">{{ substr($repair->returnItem->returnRecord->id, 0, 8) }}</a></span>
                    @endif
                </div>
            </div>
        </div>
        <div class="detail-header-actions d-flex gap-2">
            @if($repair->status === 'PENDING')
                <form action="{{ route('repairs.fixed', $repair->id) }}" method="POST">
                    @csrf
                    <button type="submit" class="btn btn-success btn-sm"><i class="bi bi-check-circle me-1"></i>Mark as Fixed</button>
                </form>
            @endif
        </div>
    </div>
    
    <div class="p-4">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <div class="info-group">
            <h5 class="info-group-title"><i class="bi bi-info-circle me-2"></i>Repair Information</h5>
            <div class="info-row mt-3">
                <span class="info-label">Created At</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($repair->created_at)->format('d M Y H:i') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Status</span>
                <span class="info-value">{{ $repair->status }}</span>
            </div>
        </div>
    </div>
</div>
@endsection
