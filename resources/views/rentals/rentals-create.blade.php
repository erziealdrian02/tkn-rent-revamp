@extends('layouts.app')

@section('title', 'Create Rental — EquipRent Enterprise')

@section('content')
<div class="page-header">
    <div class="page-header-left">
        <h2 class="page-header-title">Create New Rental</h2>
        <p class="page-header-subtitle">Add a new equipment rental transaction</p>
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

<form method="POST" action="{{ route('rentals.store') }}">
    @csrf
    <!-- Section 1: Rental Information -->
    <div class="form-section">
        <h5 class="form-section-title"><i class="bi bi-info-circle me-2"></i>Rental Information</h5>
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label form-label-er">Project *</label>
                <select name="project_id" class="form-select" required>
                    <option value="">Select Project</option>
                    @foreach($projects as $p)
                        <option value="{{ $p->id }}">{{ $p->name }} (Customer: {{ $p->customer->name ?? '-' }})</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label form-label-er">Branch (Source) *</label>
                <select name="branch_id" class="form-select" required>
                    <option value="">Select Branch</option>
                    @foreach($branches as $b)
                        <option value="{{ $b->id }}">{{ $b->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label form-label-er">Rental Start Date *</label>
                <input type="date" name="start_date" class="form-control" required value="{{ date('Y-m-d') }}">
            </div>
            <div class="col-md-6">
                <label class="form-label form-label-er">Expected Return Date *</label>
                <input type="date" name="return_date" class="form-control" required value="{{ date('Y-m-d', strtotime('+3 months')) }}">
            </div>
        </div>
    </div>

    <!-- Section 2: Equipment Items -->
    <div class="form-section mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="form-section-title mb-0"><i class="bi bi-box me-2"></i>Equipment Details</h5>
            <button type="button" class="btn btn-outline-primary btn-sm" onclick="addEquipmentRow()"><i class="bi bi-plus me-1"></i>Add Item</button>
        </div>
        <div class="er-table-wrapper">
            <table class="er-table">
                <thead>
                    <tr>
                        <th>Equipment</th>
                        <th width="150">Quantity</th>
                        <th width="200">Unit Price (Rp)</th>
                        <th width="80"></th>
                    </tr>
                </thead>
                <tbody id="equipmentBody">
                    <!-- Rows dynamically generated -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Actions -->
    <div class="d-flex justify-content-between align-items-center mt-4">
        <a href="{{ route('rentals.index') }}" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Back</a>
        <button type="submit" class="btn btn-primary"><i class="bi bi-save me-1"></i>Save Draft & Proceed</button>
    </div>
</form>

<script>
    let rowCount = 0;
    const equipmentList = [
        @foreach($equipment as $eq)
            { id: '{{ $eq->id }}', name: '{{ $eq->name }}', rate: {{ $eq->rental_rate ?? 0 }} },
        @endforeach
    ];

    function getEquipmentOptions() {
        let html = '<option value="">Select Equipment</option>';
        equipmentList.forEach(e => {
            html += `<option value="${e.id}" data-rate="${e.rate}">${e.name}</option>`;
        });
        return html;
    }

    function addEquipmentRow() {
        const tbody = document.getElementById('equipmentBody');
        const idx = rowCount++;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <select name="items[${idx}][equipment_id]" class="form-select form-select-sm eq-select" required onchange="updateRate(this, ${idx})">
                    ${getEquipmentOptions()}
                </select>
            </td>
            <td>
                <input type="number" name="items[${idx}][quantity]" class="form-control form-control-sm" value="1" min="1" required>
            </td>
            <td>
                <input type="number" name="items[${idx}][unit_price]" id="rate-${idx}" class="form-control form-control-sm" value="0" min="0" required>
            </td>
            <td>
                <button type="button" class="btn-action danger" onclick="this.closest('tr').remove()"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    }

    function updateRate(selectObj, idx) {
        const option = selectObj.options[selectObj.selectedIndex];
        const rate = option.getAttribute('data-rate');
        document.getElementById(`rate-${idx}`).value = rate || 0;
    }

    // Initialize with 1 row
    document.addEventListener("DOMContentLoaded", function() {
        addEquipmentRow();
    });
</script>
@endsection
