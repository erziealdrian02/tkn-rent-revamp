@extends('layouts.app')

@section('title', 'Stock — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Stock Monitoring</h2><p class="page-header-subtitle">Equipment stock levels across branches</p></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <select class="filter-select" id="branchFilter" onchange="filterData()"><option value="">All Branches</option><option>Jakarta</option><option>Bekasi</option></select>
            <select class="filter-select" id="equipFilter" onchange="filterData()"><option value="">All Equipment</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Equipment</th><th>Branch</th><th>Total</th><th>Available</th><th>Reserved</th><th>On Rental</th><th>Damaged</th><th>Maintenance</th><th>Lost</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('stock',[{label:'Inventory',href:'#'},{label:'Stock'}],'Stock Monitoring');
    const ef=document.getElementById('equipFilter');
    [...new Set(MockData.stock.map(s=>s.equipment))].forEach(e=>{const o=document.createElement('option');o.value=e;o.textContent=e;ef.appendChild(o);});
    function filterData(){
      const b=document.getElementById('branchFilter').value;
      const e=document.getElementById('equipFilter').value;
      const data=MockData.stock.filter(s=>{
        if(b&&s.branch!==b)return false;if(e&&s.equipment!==e)return false;return true;
      });
      document.getElementById('tableBody').innerHTML=data.map(s=>`<tr>
        <td class="fw-600">${s.equipment}</td><td>${s.branch}</td><td class="fw-600">${s.total}</td>
        <td><span class="badge-status available">${s.available}</span></td><td>${s.reserved}</td>
        <td><span class="badge-status on-rental">${s.onRental}</span></td>
        <td>${s.damaged?`<span class="badge-status damaged">${s.damaged}</span>`:0}</td>
        <td>${s.maintenance||0}</td>
        <td>${s.lost?`<span class="badge-status lost">${s.lost}</span>`:0}</td>
      </tr>`).join('');
    }
    filterData();
</script>
@endpush
