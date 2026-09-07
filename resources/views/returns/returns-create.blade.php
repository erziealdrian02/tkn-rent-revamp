@extends('layouts.app')

@section('title', 'Create Return — EquipRent Enterprise')

@section('content')
<div class="page-header">
    <div class="page-header-left">
        <h2 class="page-header-title">Create Return for Rental {{ substr($rental->id ?? '', 0, 8) }}</h2>
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

<form method="POST" action="{{ route('returns.store') }}">
    @csrf
    <input type="hidden" name="rental_id" value="{{ $rental->id }}">
    
    <div class="form-section">
        <h5 class="form-section-title">Return Details</h5>
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label form-label-er">Return Date *</label>
                <input type="date" name="return_date" class="form-control" required value="{{ date('Y-m-d') }}">
            </div>
            <div class="col-md-6">
                <label class="form-label form-label-er">Notes</label>
                <textarea name="notes" class="form-control" rows="2"></textarea>
            </div>
        </div>
    </div>

    <div class="form-section mt-4">
        <h5 class="form-section-title">Items Inspection</h5>
        <table class="er-table border mt-3">
            <thead class="table-light">
                <tr>
                    <th>Equipment</th>
                    <th>Remaining on Rent</th>
                    <th>Good</th>
                    <th>Damaged</th>
                    <th>Lost</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rentedItems as $idx => $rItem)
                    <tr>
                        <td>
                            {{ $rItem['equipment_name'] }}
                            <input type="hidden" name="items[{{ $idx }}][rental_item_id]" value="{{ $rItem['rental_item_id'] }}">
                            <input type="hidden" name="items[{{ $idx }}][equipment_id]" value="{{ $rItem['equipment_id'] }}">
                        </td>
                        <td>{{ $rItem['remaining'] }}</td>
                        <td>
                            <input type="number" name="items[{{ $idx }}][qty_good]" class="form-control form-control-sm" style="width: 100px;" value="{{ $rItem['remaining'] }}" min="0" max="{{ $rItem['remaining'] }}" required>
                        </td>
                        <td>
                            <input type="number" name="items[{{ $idx }}][qty_damaged]" class="form-control form-control-sm" style="width: 100px;" value="0" min="0" max="{{ $rItem['remaining'] }}" required>
                        </td>
                        <td>
                            <input type="number" name="items[{{ $idx }}][qty_lost]" class="form-control form-control-sm" style="width: 100px;" value="0" min="0" max="{{ $rItem['remaining'] }}" required>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <small class="text-muted mt-2 d-block">Note: Total of Good + Damaged + Lost cannot exceed Remaining on Rent.</small>
    </div>

    <div class="mt-4">
        <a href="{{ route('rentals.show', $rental->id) }}" class="btn btn-outline-secondary me-2">Cancel</a>
        <button type="submit" class="btn btn-primary">Submit Return & Inspection</button>
    </div>
</form>
@endsection
