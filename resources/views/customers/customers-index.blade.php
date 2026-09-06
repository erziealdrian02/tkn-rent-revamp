@extends('layouts.app')

@section('title', 'Customers — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Customers</h2><p class="page-header-subtitle">Manage customer database and relations</p></div>
        <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add customer form','info')"><i class="bi bi-plus-lg me-1"></i>Add Customer</button></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search customers..." id="searchInput" oninput="filterData()"></div>
            <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Active</option><option>Inactive</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Customer ID</th><th>Company Code</th><th>Company Name</th><th>PIC</th><th>Contact</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('customers',[{label:'Master Data',href:'#'},{label:'Customers'}],'Customers');

    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-toggle', 'modal');
    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-target', '#addCustomerModal');
    document.querySelector('.page-header-actions .btn-primary').removeAttribute('onclick');

    document.getElementById('cusId').value = MockData.generateId('CUS', 'customers');

    document.getElementById('customerForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }

      const newCus = {
        id: document.getElementById('cusId').value,
        code: document.getElementById('cusCode').value.toUpperCase(),
        name: document.getElementById('cusName').value,
        pic: document.getElementById('cusPic').value,
        phone: document.getElementById('cusPhone').value,
        email: document.getElementById('cusEmail').value,
        address: document.getElementById('cusAddress').value,
        status: document.getElementById('cusStatus').value
      };

      MockData.customers.push(newCus);
      MockData.save('customers');

      bootstrap.Modal.getInstance(document.getElementById('addCustomerModal')).hide();
      showToast('Customer successfully added.', 'success');
      
      this.reset();
      this.classList.remove('was-validated');
      document.getElementById('cusId').value = MockData.generateId('CUS', 'customers');
      
      filterData();
    });

    function filterData(){
      const q=document.getElementById('searchInput').value.toLowerCase();
      const s=document.getElementById('statusFilter').value;
      const data=MockData.customers.filter(c=>{
        if(q&&!c.id.toLowerCase().includes(q)&&!c.name.toLowerCase().includes(q)&&!c.code.toLowerCase().includes(q)&&!c.pic.toLowerCase().includes(q))return false;
        if(s&&c.status!==s)return false;return true;
      });
      document.getElementById('tableBody').innerHTML=data.map(c=>`<tr>
        <td><a href="customer-detail?id=${c.id}" class="cell-link text-mono">${c.id}</a></td>
        <td><span class="badge bg-light text-dark border">${c.code}</span></td>
        <td class="fw-500">${c.name}</td><td>${c.pic}</td>
        <td><div class="fs-13"><i class="bi bi-telephone text-muted me-1"></i>${c.phone}<br><i class="bi bi-envelope text-muted me-1"></i>${c.email}</div></td>
        <td>${statusBadge(c.status)}</td>
        <td><a href="customer-detail?id=${c.id}" class="btn-action"><i class="bi bi-eye"></i></a><button class="btn-action"><i class="bi bi-pencil"></i></button></td>
      </tr>`).join('')||'<tr><td colspan="7" class="text-center text-muted py-4">No customers found</td></tr>';
    }
    filterData();
</script>
@endpush
