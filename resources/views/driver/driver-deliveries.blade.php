@extends('layouts.app')

@section('title', 'My Deliveries — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">My Deliveries</h2><p class="page-header-subtitle">All deliveries assigned to you</p></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Preparing</option><option>Assigned</option><option>Departed</option><option>Arrived</option><option>Completed</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Delivery #</th><th>Customer</th><th>Project</th><th>Destination</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('driver-deliveries',[{label:'My Deliveries'}],'My Deliveries');
    const myDeliveries = MockData.deliveries.filter(d => d.driverName === 'Budi Santoso');
    function filterData(){
      const s=document.getElementById('statusFilter').value;
      const data=s?myDeliveries.filter(d=>d.status===s):myDeliveries;
      document.getElementById('tableBody').innerHTML=data.map(d=>`<tr>
        <td><a href="driver-delivery-detail?id=${d.id}" class="cell-link text-mono">${d.id}</a></td>
        <td>${d.customerName}</td><td>${d.projectName}</td><td>${d.destination}</td><td>${formatDate(d.deliveryDate)}</td>
        <td>${statusBadge(d.status)}</td>
        <td><a href="driver-delivery-detail?id=${d.id}" class="btn btn-primary btn-sm">Detail</a></td>
      </tr>`).join('')||'<tr><td colspan="7" class="text-center text-muted py-4">No deliveries found</td></tr>';
    }
    filterData();
</script>
@endpush
