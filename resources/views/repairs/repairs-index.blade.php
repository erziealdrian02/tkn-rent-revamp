@extends('layouts.app')

@section('title', 'Repairs — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Equipment Repairs</h2><p class="page-header-subtitle">Manage damaged equipment and repair workflows</p></div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search repairs..." id="searchInput" oninput="filterData()"></div>
              <select class="filter-select" id="statusFilter" onchange="filterData()">
                <option value="">All Status</option><option>Pending</option><option>In Repair</option><option>Completed</option><option>Unrepairable</option>
              </select>
            </div>
          </div>
          <div class="er-table-wrapper">
            <table class="er-table">
              <thead><tr><th>Repair #</th><th>Equipment</th><th>Qty</th><th>Source Return</th><th>Branch</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="tableBody"></tbody>
            </table>
          </div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('repairs',[{label:'Equipment',href:'#'},{label:'Repairs'}],'Repairs');
    function filterData(){
      const q=document.getElementById('searchInput').value.toLowerCase();
      const s=document.getElementById('statusFilter').value;
      const data=(MockData.repairs||[]).filter(r=>{
        if(q&&!r.id.toLowerCase().includes(q)&&!r.equipmentName.toLowerCase().includes(q))return false;
        if(s&&r.status!==s)return false;return true;
      });
      document.getElementById('tableBody').innerHTML=data.map(r=>`<tr>
        <td><a href="repair-detail?id=${r.id}" class="cell-link text-mono">${r.id}</a></td>
        <td class="fw-500">${r.equipmentName}</td><td>${r.quantity}</td>
        <td>${r.sourceReturn?`<a href="return-detail?id=${r.sourceReturn}">${r.sourceReturn}</a>`:'-'}</td>
        <td>${r.branch}</td><td>${formatDate(r.createdDate)}</td>
        <td>${statusBadge(r.status)}</td>
        <td><a href="repair-detail?id=${r.id}" class="btn-action"><i class="bi bi-eye"></i></a></td>
      </tr>`).join('')||'<tr><td colspan="8" class="text-center text-muted py-4">No repair records found</td></tr>';
    }
    filterData();
</script>
@endpush
