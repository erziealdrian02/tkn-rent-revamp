@extends('layouts.app')

@section('title', 'Driver Dashboard — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Driver Dashboard</h2><p class="page-header-subtitle">Welcome back! Here's your delivery overview.</p></div>
        </div>

        <div class="kpi-grid" style="grid-template-columns: repeat(3, 1fr);">
          <div class="kpi-card">
            <div class="kpi-icon orange"><i class="bi bi-clock"></i></div>
            <div class="kpi-content"><div class="kpi-value" id="incomingCount">0</div><div class="kpi-label">Incoming Deliveries</div></div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon blue"><i class="bi bi-truck"></i></div>
            <div class="kpi-content"><div class="kpi-value" id="todayCount">0</div><div class="kpi-label">Today's Deliveries</div></div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon green"><i class="bi bi-check-circle"></i></div>
            <div class="kpi-content"><div class="kpi-value" id="completedCount">0</div><div class="kpi-label">Completed Deliveries</div></div>
          </div>
        </div>

        <div class="er-card">
          <div class="er-card-header">
            <h5 class="er-card-title"><i class="bi bi-list-check me-2"></i>My Upcoming Deliveries</h5>
            <a href="{{ url('driver-deliveries') }}" class="fs-12">View All</a>
          </div>
          <div class="er-card-body p-0">
            <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Delivery #</th><th>Customer</th><th>Destination</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="deliveryList"></tbody></table></div>
          </div>
        </div>
@endsection

@push('scripts')
<script>
const user = initApp('driver-dashboard',[],'Driver Dashboard');
    // Get driver's deliveries (simulate: show all for Budi Santoso, or DRV-001)
    const myDeliveries = MockData.deliveries.filter(d => d.driverName === 'Budi Santoso');
    const incoming = myDeliveries.filter(d => d.status === 'Preparing' || d.status === 'Assigned');
    const today = myDeliveries.filter(d => d.status === 'Departed');
    const completed = myDeliveries.filter(d => d.status === 'Completed' || d.status === 'Arrived');

    document.getElementById('incomingCount').textContent = incoming.length;
    document.getElementById('todayCount').textContent = today.length;
    document.getElementById('completedCount').textContent = completed.length;

    const upcoming = myDeliveries.filter(d => d.status !== 'Completed');
    document.getElementById('deliveryList').innerHTML = upcoming.length ? upcoming.map(d => `<tr>
      <td><a href="driver-delivery-detail?id=${d.id}" class="cell-link text-mono">${d.id}</a></td>
      <td>${d.customerName}</td><td>${d.destination}</td><td>${formatDate(d.deliveryDate)}</td>
      <td>${statusBadge(d.status)}</td>
      <td><a href="driver-delivery-detail?id=${d.id}" class="btn btn-primary btn-sm">Detail</a></td>
    </tr>`).join('') : '<tr><td colspan="6" class="text-center text-muted py-4">No upcoming deliveries</td></tr>';
</script>
@endpush
