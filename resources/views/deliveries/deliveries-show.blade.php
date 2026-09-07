@extends('layouts.app')

@section('title', 'Delivery Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
    <div class="detail-header" id="detailHeader">
        <div class="detail-header-left">
            <div class="detail-header-icon"><i class="bi bi-truck"></i></div>
            <div class="detail-header-info">
                <h2>{{ substr($delivery->id, 0, 8) }} <span class="badge bg-secondary-subtle text-secondary">{{ $delivery->status }}</span></h2>
                <div class="detail-meta">
                    <span class="detail-meta-item"><i class="bi bi-file-text"></i>Rental: <a href="{{ route('rentals.show', $delivery->rental_id) }}">{{ substr($delivery->rental_id, 0, 8) }}</a></span>
                    <span class="detail-meta-item"><i class="bi bi-person"></i>Driver: {{ $delivery->driver->name ?? '-' }}</span>
                    <span class="detail-meta-item"><i class="bi bi-car-front"></i>Vehicle: {{ $delivery->vehicle->plate_number ?? '-' }}</span>
                    <span class="detail-meta-item"><i class="bi bi-calendar"></i>{{ \Carbon\Carbon::parse($delivery->delivery_date)->format('d M Y') }}</span>
                </div>
            </div>
        </div>
        <div class="detail-header-actions d-flex gap-2">
            @if($delivery->status === 'PENDING')
                <form action="{{ route('deliveries.dispatchDelivery', $delivery->id) }}" method="POST">
                    @csrf
                    <button type="submit" class="btn btn-success btn-sm"><i class="bi bi-cursor me-1"></i>Dispatch / Mark Delivered</button>
                </form>
            @endif
        </div>
    </div>
    
    <div class="er-tabs" id="detailTabs">
        <button class="er-tab active">Items</button>
    </div>
    
    <div class="p-4">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <div class="info-group">
            <h5 class="info-group-title"><i class="bi bi-box me-2"></i>Delivered Equipment</h5>
            <table class="er-table border mt-3">
                <thead class="table-light">
                    <tr>
                        <th>Equipment</th>
                        <th>Qty Delivered</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($delivery->items as $item)
                        <tr>
                            <td class="fw-500">{{ $item->rentalItem->equipment->name ?? '-' }}</td>
                            <td>{{ $item->qty_delivered }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
