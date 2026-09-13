@extends('layouts.app')

@section('title', 'Driver Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
    <div class="detail-header" id="detailHeader">
        <div class="detail-header-left">
            <div class="detail-header-icon"><i class="bi bi-person-badge"></i></div>
            <div class="detail-header-info">
                <h2>{{ $driver->user->name ?? '-' }} <span class="badge-status {{ $driver->status === 'ACTIVE' ? 'available' : 'inactive' }}">{{ $driver->status }}</span></h2>
                <div class="detail-meta">
                    <span class="detail-meta-item"><i class="bi bi-hash"></i>{{ $driver->driver_code }}</span>
                    <span class="detail-meta-item"><i class="bi bi-phone"></i>{{ $driver->user->phone ?? '-' }}</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="er-tabs" id="detailTabs">
        <button class="er-tab active" data-tab="personal" onclick="switchTab('personal')">Personal</button>
        <button class="er-tab" data-tab="deliveries" onclick="switchTab('deliveries')">Deliveries <span class="er-tab-count">0</span></button>
        <button class="er-tab" data-tab="performance" onclick="switchTab('performance')">Performance</button>
    </div>
    
    <div id="tabContents">
        <div class="er-tab-content active" id="tab-personal">
            <div class="info-grid">
                <div class="info-item"><span class="info-label">Driver Code</span><span class="info-value">{{ $driver->driver_code }}</span></div>
                <div class="info-item"><span class="info-label">Full Name</span><span class="info-value">{{ $driver->user->name ?? '-' }}</span></div>
                <div class="info-item"><span class="info-label">Phone</span><span class="info-value">{{ $driver->user->phone ?? '-' }}</span></div>
                <div class="info-item"><span class="info-label">License Number</span><span class="info-value">{{ $driver->license_number ?? '-' }}</span></div>
                <div class="info-item"><span class="info-label">License Expiry</span><span class="info-value">{{ $driver->license_exp ? \Carbon\Carbon::parse($driver->license_exp)->format('d M Y') : '-' }}</span></div>
                <div class="info-item"><span class="info-label">Status</span><span class="info-value"><span class="badge-status {{ $driver->status === 'ACTIVE' ? 'available' : 'inactive' }}">{{ $driver->status }}</span></span></div>
            </div>
        </div>
        
        <div class="er-tab-content" id="tab-deliveries">
            <div class="er-table-wrapper">
                <table class="er-table">
                    <thead>
                        <tr>
                            <th>Delivery #</th>
                            <th>Customer</th>
                            <th>Project</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colspan="5" class="text-center text-muted py-4">No deliveries found (Integration pending)</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="er-tab-content" id="tab-performance">
            <div class="row g-3">
                <div class="col-md-3">
                    <div class="kpi-card">
                        <div class="kpi-icon blue"><i class="bi bi-truck"></i></div>
                        <div class="kpi-content">
                            <div class="kpi-value">0</div>
                            <div class="kpi-label">Total Deliveries</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="kpi-card">
                        <div class="kpi-icon green"><i class="bi bi-check-circle"></i></div>
                        <div class="kpi-content">
                            <div class="kpi-value">0</div>
                            <div class="kpi-label">Completed</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="kpi-card">
                        <div class="kpi-icon orange"><i class="bi bi-clock"></i></div>
                        <div class="kpi-content">
                            <div class="kpi-value">0</div>
                            <div class="kpi-label">In Progress</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="kpi-card">
                        <div class="kpi-icon purple"><i class="bi bi-star"></i></div>
                        <div class="kpi-content">
                            <div class="kpi-value">N/A</div>
                            <div class="kpi-label">Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    initApp('drivers',[{label:'Master Data',href:'#'},{label:'Drivers',href:'{{ route("drivers.index") }}'},{label:'{{ addslashes($driver->user->name ?? $driver->driver_code) }}'}],'{{ addslashes($driver->user->name ?? $driver->driver_code) }}');
</script>
@endpush
