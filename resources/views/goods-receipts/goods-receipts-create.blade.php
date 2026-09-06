@extends('layouts.app')

@section('title', 'Receive Goods — EquipRent Enterprise')

@section('content')
<div class="page-header">
    <div class="page-header-left">
        <h2 class="page-header-title">Receive Goods</h2>
        <p class="page-header-subtitle">Record received equipment into inventory stock</p>
    </div>
</div>

@if($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form method="POST" action="{{ route('goods-receipts.store') }}">
    @csrf
    <input type="hidden" name="purchase_id" value="{{ $purchase->id ?? old('purchase_id') }}">

    <div class="er-card mb-4">
        <div class="er-card-body">
            <h5 class="fw-bold mb-4"><i class="bi bi-box-seam me-2"></i>Receipt Details</h5>
            
            @if($purchase)
                <div class="alert alert-info mb-4">
                    <strong>Purchase Order:</strong> {{ $purchase->po_number }}<br>
                    <strong>Equipment:</strong> {{ $purchase->equipment->name ?? '-' }}<br>
                    <strong>Ordered Qty:</strong> {{ $purchase->qty_ordered }}
                </div>
            @else
                <div class="alert alert-warning mb-4">
                    Please provide a valid Purchase Order ID in the URL to receive goods.
                </div>
            @endif

            <div class="row g-3">
                <div class="col-md-4">
                    <label class="form-label form-label-er">Received Date *</label>
                    <input type="date" name="received_date" class="form-control" value="{{ old('received_date', date('Y-m-d')) }}" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label form-label-er">Quantity Received *</label>
                    <input type="number" name="qty_received" class="form-control" min="1" max="{{ $purchase ? $purchase->qty_ordered : '' }}" value="{{ old('qty_received', $purchase ? $purchase->qty_ordered : 1) }}" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label form-label-er">Destination Branch *</label>
                    <select name="branch_id" class="form-select" required>
                        <option value="">Select Branch</option>
                        @foreach($branches as $b)
                            <option value="{{ $b->id }}" {{ old('branch_id') == $b->id ? 'selected' : '' }}>{{ $b->name }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="col-12">
                    <label class="form-label form-label-er">Notes</label>
                    <textarea name="notes" class="form-control" rows="3">{{ old('notes') }}</textarea>
                </div>
            </div>
        </div>
    </div>

    <div class="d-flex justify-content-between">
        <a href="{{ route('purchases.index') }}" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Back</a>
        <button type="submit" class="btn btn-primary" {{ !$purchase ? 'disabled' : '' }}><i class="bi bi-check-lg me-1"></i>Process Receipt</button>
    </div>
</form>
@endsection
