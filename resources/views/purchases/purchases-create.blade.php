@extends('layouts.app')

@section('title', 'Create Purchase Order — EquipRent Enterprise')

@section('content')
<div class="page-header">
    <div class="page-header-left">
        <h2 class="page-header-title">Create Purchase Order</h2>
        <p class="page-header-subtitle">Procure new equipment from vendor</p>
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

<form method="POST" action="{{ route('purchases.store') }}">
    @csrf
    <div class="er-card mb-4">
        <div class="er-card-body">
            <h5 class="fw-bold mb-4"><i class="bi bi-cart me-2"></i>PO Details</h5>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label form-label-er">Vendor Name *</label>
                    <input type="text" name="vendor_name" class="form-control" value="{{ old('vendor_name') }}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label form-label-er">Expected Delivery</label>
                    <input type="date" name="expected_delivery" class="form-control" value="{{ old('expected_delivery') }}">
                </div>
                <div class="col-md-6">
                    <label class="form-label form-label-er">Equipment *</label>
                    <select name="equipment_id" class="form-select" required>
                        <option value="">Select Equipment</option>
                        @foreach($equipment as $eq)
                            <option value="{{ $eq->id }}" {{ old('equipment_id') == $eq->id ? 'selected' : '' }}>{{ $eq->name }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label form-label-er">Quantity *</label>
                    <input type="number" name="qty_ordered" class="form-control" min="1" value="{{ old('qty_ordered', 1) }}" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label form-label-er">Unit Price (Rp) *</label>
                    <input type="number" name="unit_price" class="form-control" min="0" value="{{ old('unit_price', 0) }}" required>
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
        <button type="submit" class="btn btn-primary"><i class="bi bi-save me-1"></i>Create PO</button>
    </div>
</form>
@endsection
