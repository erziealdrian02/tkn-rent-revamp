@extends('layouts.app')

@section('title', 'Invoices — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Invoices</h2><p class="page-header-subtitle">Invoice management</p></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search invoices..." id="searchInput" oninput="filterData()"></div>
            <select class="filter-select" id="typeFilter" onchange="filterData()"><option value="">All Types</option><option>Delivery</option><option>Return</option></select>
            <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Draft</option><option>Issued</option><option>Paid</option><option>Partially Paid</option><option>Overdue</option><option>Cancelled</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Invoice #</th><th>Type</th><th>Project</th><th>Customer</th><th>Reference</th><th>Date</th><th>Due Date</th><th>Amount</th><th>Account</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('invoices',[{label:'Billing',href:'#'},{label:'Invoices'}],'Invoices');
    function filterData(){
      const q=document.getElementById('searchInput').value.toLowerCase();
      const t=document.getElementById('typeFilter').value;
      const s=document.getElementById('statusFilter').value;
      const data=MockData.invoices.filter(i=>{
        if(q&&!i.id.toLowerCase().includes(q)&&!i.customerName.toLowerCase().includes(q)&&!i.projectName.toLowerCase().includes(q))return false;
        if(t&&i.type!==t)return false;if(s&&i.status!==s)return false;return true;
      });
      document.getElementById('tableBody').innerHTML=data.map(i=>`<tr>
        <td><a href="invoice-detail?id=${i.id}" class="cell-link text-mono">${i.id}</a></td>
        <td><span class="badge bg-${i.type==='Delivery'?'primary':'warning'} bg-opacity-10 text-${i.type==='Delivery'?'primary':'warning'}" style="font-size:11px">${i.type}</span></td>
        <td>${i.projectName}</td><td>${i.customerName}</td><td class="text-mono fs-12">${i.reference}</td>
        <td>${formatDate(i.invoiceDate)}</td><td>${formatDate(i.dueDate)}</td>
        <td class="fw-600">${formatRupiah(i.amount)}</td><td class="fs-12">${i.accountName}</td>
        <td>${statusBadge(i.status)}</td>
        <td><a href="invoice-detail?id=${i.id}" class="btn-action"><i class="bi bi-eye"></i></a><button class="btn-action" onclick="showToast('Print invoice ${i.id}','info')"><i class="bi bi-printer"></i></button></td>
      </tr>`).join('')||'<tr><td colspan="11" class="text-center text-muted py-4">No invoices found</td></tr>';
    }
    filterData();
</script>
@endpush
