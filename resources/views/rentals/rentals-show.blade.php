@extends('layouts.app')

@section('title', 'Rental Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
    <div class="detail-header" id="detailHeader">
        <div class="detail-header-left">
            <div class="detail-header-icon"><i class="bi bi-file-earmark-text"></i></div>
            <div class="detail-header-info">
                <h2>{{ substr($rental->id, 0, 8) }} <span class="badge bg-secondary-subtle text-secondary">{{ $rental->status }}</span></h2>
                <div class="detail-meta">
                    <span class="detail-meta-item"><i class="bi bi-people"></i>{{ $rental->project->customer->name ?? '-' }}</span>
                    <span class="detail-meta-item"><i class="bi bi-folder"></i>{{ $rental->project->name ?? '-' }}</span>
                    <span class="detail-meta-item"><i class="bi bi-calendar"></i>{{ \Carbon\Carbon::parse($rental->start_date)->format('d M Y') }} — {{ \Carbon\Carbon::parse($rental->return_date)->format('d M Y') }}</span>
                </div>
            </div>
        </div>
        <div class="detail-header-actions d-flex gap-2">
            @if($rental->status === 'PENDING_APPROVAL')
                <form action="{{ route('rentals.approve', $rental->id) }}" method="POST">
                    @csrf
                    <!-- For now hardcode a branch or get from input -->
                    <input type="hidden" name="branch_id" value="09d1ccae-9dd2-45e0-b630-f94dfde5c95a"> 
                    <button type="submit" class="btn btn-success btn-sm"><i class="bi bi-check-lg me-1"></i>Approve</button>
                </form>
                <form action="{{ route('rentals.cancel', $rental->id) }}" method="POST">
                    @csrf
                    <input type="hidden" name="branch_id" value="09d1ccae-9dd2-45e0-b630-f94dfde5c95a">
                    <button type="submit" class="btn btn-outline-danger btn-sm"><i class="bi bi-x-lg me-1"></i>Cancel</button>
                </form>
            @endif
            @if(in_array($rental->status, ['APPROVED', 'ON_RENTAL']))
                <a href="{{ route('deliveries.create', ['rental_id' => $rental->id]) }}" class="btn btn-primary btn-sm"><i class="bi bi-truck me-1"></i>Create Delivery</a>
                <a href="{{ route('returns.create', ['rental_id' => $rental->id]) }}" class="btn btn-outline-primary btn-sm"><i class="bi bi-box-arrow-in-left me-1"></i>Create Return</a>
            @endif
        </div>
    </div>
    
    <div class="er-tabs" id="detailTabs">
        <button class="er-tab active">Overview</button>
    </div>
    
    <div class="p-4">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        @if(session('error'))
            <div class="alert alert-danger">{{ session('error') }}</div>
        @endif

        <div class="row g-4">
            <div class="col-md-8">
                <div class="info-group">
                    <h5 class="info-group-title"><i class="bi bi-box me-2"></i>Equipment Items</h5>
                    <table class="er-table border mt-3">
                        <thead class="table-light">
                            <tr>
                                <th>Equipment</th>
                                <th>Quantity</th>
                                <th>Unit Price (Rp)</th>
                                <th>Subtotal (Rp)</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($rental->items as $item)
                                <tr>
                                    <td class="fw-500">{{ $item->equipment->name ?? '-' }}</td>
                                    <td>{{ $item->quantity }}</td>
                                    <td>{{ number_format($item->unit_price, 0, ',', '.') }}</td>
                                    <td class="fw-600">{{ number_format($item->quantity * $item->unit_price, 0, ',', '.') }}</td>
                                </tr>
                            @endforeach
                            <tr class="table-light fw-bold">
                                <td colspan="3" class="text-end">Total Amount:</td>
                                <td>{{ number_format($rental->total_amount, 0, ',', '.') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-md-4">
                <div class="info-group">
                    <h5 class="info-group-title"><i class="bi bi-file-text me-2"></i>Summary</h5>
                    <div class="info-row">
                        <span class="info-label">Created By</span>
                        <span class="info-value">{{ $rental->creator->name ?? 'System' }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Created Date</span>
                        <span class="info-value">{{ \Carbon\Carbon::parse($rental->created_at)->format('d M Y H:i') }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total Deliveries</span>
                        <span class="info-value">{{ $rental->deliveries->count() }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
