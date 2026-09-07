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
          <tbody id="tableBody">
            @forelse($customers as $c)
              <tr>
                <td><a href="{{ route('customers.show', $c->id) }}" class="cell-link text-mono">{{ substr($c->id, 0, 8) }}</a></td>
                <td class="fw-500">{{ $c->name }}</td>
                <td>{{ $c->pic_name ?? '-' }}</td>
                <td><div class="fs-13"><i class="bi bi-telephone text-muted me-1"></i>{{ $c->contact ?? '-' }}<br><i class="bi bi-envelope text-muted me-1"></i>{{ $c->email ?? '-' }}</div></td>
                <td>
                    @if($c->status === 'ACTIVE')
                        <span class="badge bg-success-subtle text-success">Active</span>
                    @else
                        <span class="badge bg-secondary-subtle text-secondary">Inactive</span>
                    @endif
                </td>
                <td>
                    <a href="{{ route('customers.show', $c->id) }}" class="btn-action"><i class="bi bi-eye"></i></a>
                    <a href="{{ route('customers.edit', $c->id) }}" class="btn-action"><i class="bi bi-pencil"></i></a>
                </td>
              </tr>
            @empty
              <tr><td colspan="6" class="text-center text-muted py-4">No customers found</td></tr>
            @endforelse
          </tbody>
          </table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('customers',[{label:'Master Data',href:'#'},{label:'Customers'}],'Customers');

function filterData() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        if (row.cells.length < 5) return;
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
    });
}
</script>
@endpush
