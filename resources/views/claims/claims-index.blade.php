@extends('layouts.app')

@section('title', 'Claims — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Claims</h2><p class="page-header-subtitle">Equipment loss and damage claims</p></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search claims..." id="searchInput" oninput="filterData()"></div>
            <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Draft</option><option>Waiting Customer Confirmation</option><option>Customer Confirmed</option><option>Claim Approved</option><option>Invoiced</option><option>Closed</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Claim #</th><th>Return</th><th>Project</th><th>Customer</th><th>Equipment</th><th>Qty</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('claims',[{label:'Rental',href:'#'},{label:'Claims'}],'Claims');
    function filterData(){
      const q=document.getElementById('searchInput').value.toLowerCase();
      const s=document.getElementById('statusFilter').value;
      const data=MockData.claims.filter(c=>{
        if(q&&!c.id.toLowerCase().includes(q)&&!c.customerName.toLowerCase().includes(q)&&!c.equipment.toLowerCase().includes(q))return false;
        if(s&&c.status!==s)return false;return true;
      });
      document.getElementById('tableBody').innerHTML=data.map(c=>`<tr>
        <td><a href="claim-detail?id=${c.id}" class="cell-link text-mono">${c.id}</a></td>
        <td><a href="return-detail?id=${c.returnId}" class="cell-link">${c.returnId}</a></td>
        <td>${c.projectName}</td><td>${c.customerName}</td><td>${c.equipment}</td><td>${c.quantity}</td>
        <td class="fw-600">${formatRupiah(c.claimAmount)}</td><td>${statusBadge(c.status)}</td>
        <td><a href="claim-detail?id=${c.id}" class="btn-action"><i class="bi bi-eye"></i></a></td>
      </tr>`).join('')||'<tr><td colspan="9" class="text-center text-muted py-4">No claims found</td></tr>';
    }
    filterData();
</script>
@endpush
