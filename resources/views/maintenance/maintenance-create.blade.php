@extends('layouts.app')

@section('title', 'Schedule Maintenance — EquipRent Enterprise')

@section('content')
<div class="page-header">
    <div class="page-header-left">
        <h2 class="page-header-title">Schedule New Maintenance</h2>
        <p class="page-header-subtitle">Schedule equipment for routine check, calibration, or repair</p>
    </div>
</div>

@if(session('error'))
    <div class="alert alert-danger">{{ session('error') }}</div>
@endif
@if($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach($errors->all() as $err)
                <li>{{ $err }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form method="POST" action="{{ route('maintenance.store') }}">
    @csrf
    <div class="form-section">
        <h5 class="form-section-title"><i class="bi bi-tools me-2"></i>Maintenance Information</h5>
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label form-label-er">Equipment *</label>
                <select name="equipment_id" class="form-select" required>
                    <option value="">Select Equipment</option>
                    @foreach($equipment as $eq)
                        <option value="{{ $eq->id }}">{{ $eq->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label form-label-er">Branch / Location *</label>
                <select name="branch_id" class="form-select" required>
                    <option value="">Select Branch</option>
                    @foreach($branches as $b)
                        <option value="{{ $b->id }}">{{ $b->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label form-label-er">Quantity *</label>
                <input type="number" name="quantity" class="form-control" min="1" value="1" required>
            </div>
            <div class="col-md-4">
                <label class="form-label form-label-er">Maintenance Type *</label>
                <select name="type" class="form-select" required>
                    <option value="">Select Type</option>
                    <option value="Routine Check">Routine Check</option>
                    <option value="Calibration">Calibration</option>
                    <option value="Repair">Repair</option>
                    <option value="Overhaul">Overhaul</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label form-label-er">Start Date *</label>
                <input type="date" name="start_date" class="form-control" value="{{ date('Y-m-d') }}" required>
            </div>
            <div class="col-12">
                <label class="form-label form-label-er">Notes</label>
                <textarea name="notes" class="form-control" rows="3" placeholder="Describe what needs to be done..."></textarea>
            </div>
        </div>
    </div>

    <div class="mt-4 d-flex justify-content-between">
        <a href="{{ route('maintenance.index') }}" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Back</a>
        <button type="submit" class="btn btn-primary"><i class="bi bi-tools me-1"></i>Start Maintenance</button>
    </div>
</form>
@endsection
