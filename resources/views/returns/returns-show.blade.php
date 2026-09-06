@extends('layouts.app')

@section('title', 'Return Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
    <div class="detail-header" id="detailHeader">
        <div class="detail-header-left">
            <div class="detail-header-icon"><i class="bi bi-box-arrow-in-left"></i></div>
            <div class="detail-header-info">
                <h2>{{ substr($return->id, 0, 8) }} <span class="badge bg-secondary-subtle text-secondary">{{ $return->status }}</span></h2>
                <div class="detail-meta">
                    <span class="detail-meta-item"><i class="bi bi-file-text"></i>Rental: <a href="{{ route('rentals.show', $return->rental_id) }}">{{ substr($return->rental_id, 0, 8) }}</a></span>
                    <span class="detail-meta-item"><i class="bi bi-calendar"></i>Returned on: {{ \Carbon\Carbon::parse($return->return_date)->format('d M Y') }}</span>
                    @if($return->inspected_by)
                        <span class="detail-meta-item"><i class="bi bi-person-check"></i>Inspected By: {{ $return->inspector->name ?? '-' }}</span>
                    @endif
                </div>
            </div>
        </div>
    </div>
    
    <div class="er-tabs" id="detailTabs">
        <button class="er-tab active">Inspection Result</button>
    </div>
    
    <div class="p-4">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <div class="info-group">
            <h5 class="info-group-title"><i class="bi bi-check2-square me-2"></i>Items Inspected</h5>
            <table class="er-table border mt-3">
                <thead class="table-light">
                    <tr>
                        <th>Equipment</th>
                        <th>Qty Sent Back</th>
                        <th><span class="text-success"><i class="bi bi-check-circle me-1"></i>Good</span></th>
                        <th><span class="text-warning"><i class="bi bi-tools me-1"></i>Damaged</span></th>
                        <th><span class="text-danger"><i class="bi bi-exclamation-circle me-1"></i>Lost</span></th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($return->items as $item)
                        <tr>
                            <td class="fw-500">{{ $item->equipment->name ?? '-' }}</td>
                            <td>{{ $item->qty_good + $item->qty_damaged + $item->qty_lost }}</td>
                            <td>{{ $item->qty_good }}</td>
                            <td>{{ $item->qty_damaged }}</td>
                            <td>{{ $item->qty_lost }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            @if($return->notes)
                <div class="mt-4">
                    <strong>Notes:</strong> {{ $return->notes }}
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
