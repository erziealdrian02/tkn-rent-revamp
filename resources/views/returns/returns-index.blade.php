@extends('layouts.app')

@section('title', 'Returns — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Returns</h2><p class="page-header-subtitle">Equipment return management</p></div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search returns..." id="searchInput" oninput="filterData()"></div>
            <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Pending</option><option>Inspection</option><option>Partially Returned</option><option>Returned</option><option>Completed</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Return #</th><th>Rental</th><th>Project</th><th>Customer</th><th>Return Date</th><th>Items</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('returns',[{label:'Rental',href:'#'},{label:'Returns'}],'Returns');
    function filterData(){
      const q=document.getElementById('searchInput').value.toLowerCase();
      const s=document.getElementById('statusFilter').value;
      const data=MockData.returns.filter(r=>{
        if(q&&!r.id.toLowerCase().includes(q)&&!r.projectName.toLowerCase().includes(q)&&!r.customerName.toLowerCase().includes(q))return false;
        if(s&&r.status!==s)return false;return true;
      });
      document.getElementById('tableBody').innerHTML=data.map(r=>`<tr>
        <td><a href="return-detail?id=${r.id}" class="cell-link text-mono">${r.id}</a></td>
        <td><a href="rental-detail?id=${r.rentalId}" class="cell-link">${r.rentalId}</a></td>
        <td>${r.projectName}</td><td>${r.customerName}</td><td>${formatDate(r.returnDate)}</td>
        <td>${r.items.length} types</td><td>${statusBadge(r.status)}</td>
        <td><a href="return-detail?id=${r.id}" class="btn-action"><i class="bi bi-eye"></i></a></td>
      </tr>`).join('')||'<tr><td colspan="8" class="text-center text-muted py-4">No returns found</td></tr>';
    }
    filterData();
</script>
@endpush
