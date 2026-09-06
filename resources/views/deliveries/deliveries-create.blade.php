@extends('layouts.app')

@section('title', 'Create Delivery — EquipRent Enterprise')

@section('content')
<div class="page-header">
    <div class="page-header-left">
        <h2 class="page-header-title">Create Delivery for Rental {{ substr($rental->id ?? '', 0, 8) }}</h2>
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

<form method="POST" action="{{ route('deliveries.store') }}">
    @csrf
    <input type="hidden" name="rental_id" value="{{ $rental->id }}">
    
    <div class="form-section">
        <h5 class="form-section-title">Delivery Details</h5>
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label form-label-er">Driver *</label>
                <select name="driver_id" class="form-select" required>
                    <option value="">Select Driver</option>
                    @foreach($drivers as $d)
                        <option value="{{ $d->id }}">{{ $d->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label form-label-er">Vehicle *</label>
                <select name="vehicle_id" class="form-select" required>
                    <option value="">Select Vehicle</option>
                    @foreach($vehicles as $v)
                        <option value="{{ $v->id }}">{{ $v->plate_number }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label form-label-er">Delivery Date *</label>
                <input type="date" name="delivery_date" class="form-control" required value="{{ date('Y-m-d') }}">
            </div>
        </div>
    </div>

    <div class="form-section mt-4">
        <h5 class="form-section-title">Items to Deliver</h5>
        <table class="er-table border mt-3">
            <thead class="table-light">
                <tr>
                    <th>Equipment</th>
                    <th>Ordered Qty</th>
                    <th>Qty to Deliver *</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rental->items as $idx => $item)
                    <tr>
                        <td>
                            {{ $item->equipment->name ?? '-' }}
                            <input type="hidden" name="items[{{ $idx }}][rental_item_id]" value="{{ $item->id }}">
                        </td>
                        <td>{{ $item->quantity }}</td>
                        <td>
                            <input type="number" name="items[{{ $idx }}][qty_delivered]" class="form-control form-control-sm" style="width: 120px;" value="{{ $item->quantity }}" min="1" max="{{ $item->quantity }}" required>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        <a href="{{ route('rentals.show', $rental->id) }}" class="btn btn-outline-secondary me-2">Cancel</a>
        <button type="submit" class="btn btn-primary">Create Delivery Order</button>
    </div>
</form>
@endsection
