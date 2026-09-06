@extends('layouts.app')

@section('title', 'Deliveries — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Deliveries</h2><p class="page-header-subtitle">Monitor delivery operations</p></div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search deliveries..." id="searchInput" oninput="filterData()"></div>
              <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Preparing</option><option>Assigned</option><option>Departed</option><option>Arrived</option><option>Completed</option></select>
              <select class="filter-select" id="driverFilter" onchange="filterData()"><option value="">All Drivers</option></select>
            </div>
          </div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Delivery #</th><th>Rental</th><th>Project</th><th>Customer</th><th>Driver</th><th>Vehicle</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('deliveries',[{label:'Rental',href:'#'},{label:'Deliveries'}],'Deliveries');
    const df=document.getElementById('driverFilter');
    [...new Set(MockData.deliveries.filter(d=>d.driverName).map(d=>d.driverName))].forEach(n=>{const o=document.createElement('option');o.value=n;o.textContent=n;df.appendChild(o);});
    const sessionUser = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    const isDriver = sessionUser.role === 'Driver';
    
    if (isDriver && sessionUser.driverId) {
      // Force driver filter if logged in as driver
      df.value = sessionUser.name;
      df.disabled = true;
    }

    function filterData(){
      const q=document.getElementById('searchInput').value.toLowerCase();
      const s=document.getElementById('statusFilter').value;
      const d = (isDriver && sessionUser.name) ? sessionUser.name : document.getElementById('driverFilter').value;
      const data=MockData.deliveries.filter(r=>{
        if(q&&!r.id.toLowerCase().includes(q)&&!r.customerName.toLowerCase().includes(q)&&!r.projectName.toLowerCase().includes(q))return false;
        if(s&&r.status!==s)return false;if(d&&r.driverName!==d)return false;return true;
      });
      document.getElementById('tableBody').innerHTML=data.map(r=>`<tr>
        <td><a href="delivery-detail?id=${r.id}" class="cell-link text-mono">${r.id}</a></td>
        <td><a href="rental-detail?id=${r.rentalId}" class="cell-link">${r.rentalId}</a></td>
        <td>${r.projectName}</td><td>${r.customerName}</td>
        <td>${r.driverName||'<span class="text-muted">Unassigned</span>'}</td>
        <td>${r.vehiclePlate||'-'}</td><td>${formatDate(r.deliveryDate)}</td>
        <td>${statusBadge(r.status)}</td>
        <td><a href="delivery-detail?id=${r.id}" class="btn-action"><i class="bi bi-eye"></i></a></td>
      </tr>`).join('')||'<tr><td colspan="9" class="text-center text-muted py-4">No deliveries found</td></tr>';
    }
    filterData();
</script>
@endpush
