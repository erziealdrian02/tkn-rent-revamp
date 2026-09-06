@extends('layouts.app')

@section('title', 'Purchase Order Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
    <div class="detail-header" id="detailHeader">
        <div class="detail-header-left">
            <div class="detail-header-icon" style="background:var(--success-bg,#dcfce7);color:var(--success,#16a34a)">
                <i class="bi bi-cart"></i>
            </div>
            <div class="detail-header-info">
                <h2>{{ $purchase->po_number }} 
                    @if($purchase->status === 'APPROVED')
                        <span class="badge bg-success-subtle text-success">Approved</span>
                    @elseif($purchase->status === 'RECEIVED')
                        <span class="badge bg-info-subtle text-info">Received</span>
                    @else
                        <span class="badge bg-secondary-subtle text-secondary">{{ $purchase->status }}</span>
                    @endif
                </h2>
                <div class="detail-meta">
                    <span class="detail-meta-item"><i class="bi bi-building"></i>Vendor: {{ $purchase->vendor_name }}</span>
                    <span class="detail-meta-item"><i class="bi bi-calendar"></i>Date: {{ \Carbon\Carbon::parse($purchase->order_date)->format('d M Y') }}</span>
                    <span class="detail-meta-item"><i class="bi bi-person"></i>Created by: {{ $purchase->creator->name ?? '-' }}</span>
                </div>
            </div>
        </div>
        <div class="detail-header-actions d-flex gap-2">
            @if($purchase->status === 'DRAFT')
                <form action="{{ route('purchases.approve', $purchase->id) }}" method="POST">
                    @csrf
                    <button type="submit" class="btn btn-success btn-sm"><i class="bi bi-check-lg me-1"></i>Approve PO</button>
                </form>
            @elseif($purchase->status === 'APPROVED')
                <a href="{{ route('goods-receipts.create', ['purchase_id' => $purchase->id]) }}" class="btn btn-primary btn-sm"><i class="bi bi-box-arrow-in-down me-1"></i>Receive Goods</a>
            @endif
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
            <div class="col-md-7">
                <div class="info-group">
                    <h5 class="info-group-title"><i class="bi bi-info-circle me-2"></i>Order Details</h5>
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
                            <tr>
                                <td class="fw-500">{{ $purchase->equipment->name ?? '-' }}</td>
                                <td>{{ $purchase->qty_ordered }}</td>
                                <td>{{ number_format($purchase->unit_price, 0, ',', '.') }}</td>
                                <td class="fw-600">{{ number_format($purchase->total_amount, 0, ',', '.') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                @if($purchase->goodsReceipts->count() > 0)
                <div class="info-group mt-4">
                    <h5 class="info-group-title"><i class="bi bi-boxes me-2"></i>Goods Receipts</h5>
                    <ul class="list-group mt-3">
                        @foreach($purchase->goodsReceipts as $gr)
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong><a href="{{ route('goods-receipts.show', $gr->id) }}">{{ $gr->gr_number }}</a></strong><br>
                                    <small class="text-muted">Received on {{ \Carbon\Carbon::parse($gr->received_date)->format('d M Y') }}</small>
                                </div>
                                <span class="badge bg-primary rounded-pill">{{ $gr->qty_received }} items</span>
                            </li>
                        @endforeach
                    </ul>
                </div>
                @endif
            </div>
            <div class="col-md-5">
                <div class="info-group">
                    <h5 class="info-group-title"><i class="bi bi-chat-text me-2"></i>Notes</h5>
                    <div class="alert alert-secondary mt-3">
                        <p class="mb-0 fs-14">{{ $purchase->notes ?? 'No notes provided.' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
