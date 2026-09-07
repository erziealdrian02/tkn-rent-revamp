@extends('layouts.app')

@section('title', 'Goods Receipt Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
    <div class="detail-header" id="detailHeader">
        <div class="detail-header-left">
            <div class="detail-header-icon" style="background:var(--success-bg,#dcfce7);color:var(--success,#16a34a)">
                <i class="bi bi-box-seam"></i>
            </div>
            <div class="detail-header-info">
                <h2>{{ $goodsReceipt->gr_number }}</h2>
                <div class="detail-meta">
                    <span class="detail-meta-item"><i class="bi bi-building"></i>Branch: {{ $goodsReceipt->branch->name ?? '-' }}</span>
                    <span class="detail-meta-item"><i class="bi bi-calendar"></i>Received on: {{ \Carbon\Carbon::parse($goodsReceipt->received_date)->format('d M Y') }}</span>
                    <span class="detail-meta-item"><i class="bi bi-person"></i>Received by: {{ $goodsReceipt->receiver->name ?? '-' }}</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="p-4">
        <div class="row g-4">
            <div class="col-md-6">
                <div class="info-group">
                    <h5 class="info-group-title"><i class="bi bi-info-circle me-2"></i>Receipt Details</h5>
                    <div class="info-row mt-3">
                        <span class="info-label">Source PO Number</span>
                        <span class="info-value"><a href="{{ route('purchases.show', $goodsReceipt->purchase_id) }}" class="text-mono">{{ $goodsReceipt->purchase->po_number ?? '-' }}</a></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Equipment</span>
                        <span class="info-value fw-600">{{ $goodsReceipt->purchase->equipment->name ?? '-' }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Quantity Received</span>
                        <span class="info-value">{{ $goodsReceipt->qty_received }}</span>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="info-group">
                    <h5 class="info-group-title"><i class="bi bi-chat-text me-2"></i>Notes</h5>
                    <div class="alert alert-secondary mt-3">
                        <p class="mb-0 fs-14">{{ $goodsReceipt->notes ?? 'No notes provided.' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
