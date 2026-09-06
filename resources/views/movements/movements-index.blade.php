@extends('layouts.app')

@section('title', 'Movements — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Asset Movements</h2><p class="page-header-subtitle">Track equipment movements across locations</p></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search movements..." id="searchInput" oninput="filterData()"></div>
            <select class="filter-select" id="typeFilter" onchange="filterData()"><option value="">All Types</option><option>Purchase</option><option>Rental Out</option><option>Return</option><option>Transfer</option><option>Maintenance</option><option>Lost</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Movement ID</th><th>Date</th><th>Equipment</th><th>Asset ID</th><th>From</th><th>To</th><th>Type</th><th>Reference</th><th>User</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('movements',[{label:'Inventory',href:'#'},{label:'Movements'}],'Asset Movements');
    function filterData(){
      const q=document.getElementById('searchInput').value.toLowerCase();
      const t=document.getElementById('typeFilter').value;
      const data=MockData.movements.filter(m=>{
        if(q&&!m.id.toLowerCase().includes(q)&&!m.equipment.toLowerCase().includes(q)&&!m.assetId.toLowerCase().includes(q))return false;
        if(t&&m.type!==t)return false;return true;
      });
      document.getElementById('tableBody').innerHTML=data.map(m=>`<tr>
        <td><a href="movement-detail?id=${m.id}" class="cell-link text-mono">${m.id}</a></td>
        <td>${formatDate(m.date)}</td><td>${m.equipment}</td><td class="text-mono">${m.assetId}</td>
        <td>${m.from}</td><td>${m.to}</td><td>${statusBadge(m.type)}</td>
        <td class="text-mono fs-12">${m.reference}</td><td>${m.user}</td><td>${statusBadge(m.status)}</td>
        <td><a href="movement-detail?id=${m.id}" class="btn-action"><i class="bi bi-eye"></i></a></td>
      </tr>`).join('')||'<tr><td colspan="11" class="text-center text-muted py-4">No movements found</td></tr>';
    }
    filterData();
</script>
@endpush
