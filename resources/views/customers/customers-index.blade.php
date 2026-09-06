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
          <tbody>
            @forelse($customers as $customer)
            <tr>
              <td><a href="{{ route('customers.show', $customer->id) }}" class="cell-link text-mono">{{ explode('-', $customer->id)[0] ?? $customer->id }}</a></td>
              <td><span class="badge bg-light text-dark border">-</span></td>
              <td class="fw-500">{{ $customer->name }}</td>
              <td>{{ $customer->pic_name }}</td>
              <td><div class="fs-13"><i class="bi bi-telephone text-muted me-1"></i>{{ $customer->contact }}<br><i class="bi bi-envelope text-muted me-1"></i>{{ $customer->email }}</div></td>
              <td>
                @if($customer->status == 'ACTIVE')
                  <span class="badge bg-success-subtle text-success border border-success-subtle">Active</span>
                @else
                  <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">{{ $customer->status }}</span>
                @endif
              </td>
              <td><a href="{{ route('customers.show', $customer->id) }}" class="btn-action"><i class="bi bi-eye"></i></a><button class="btn-action"><i class="bi bi-pencil"></i></button></td>
            </tr>
            @empty
            <tr><td colspan="7" class="text-center text-muted py-4">No customers found</td></tr>
            @endforelse
          </tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('customers',[{label:'Master Data',href:'#'},{label:'Customers'}],'Customers');

    // Make sure add customer modal shows correctly
    const btnPrimary = document.querySelector('.page-header-actions .btn-primary');
    if (btnPrimary) {
        btnPrimary.setAttribute('data-bs-toggle', 'modal');
        btnPrimary.setAttribute('data-bs-target', '#addCustomerModal');
        btnPrimary.removeAttribute('onclick');
    }

    // JS filtering can be re-implemented later or handled via backend
</script>
@endpush
