@extends('layouts.app')

@section('title', 'Roles & Permissions — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Roles & Permissions</h2><p class="page-header-subtitle">Manage access levels</p></div>
        <div class="page-header-actions"><a href="{{ url('role-create') }}" class="btn btn-primary btn-sm"><i class="bi bi-plus-lg me-1"></i>Add Role</a></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Role Name</th><th>Description</th><th>Users</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('roles',[{label:'Settings',href:'#'},{label:'Roles'}],'Roles & Permissions');
    const roles = [
      {name:'Super Admin',desc:'Full system access',users:1},
      {name:'Admin',desc:'System administration and settings',users:2},
      {name:'Manager',desc:'Approval and reporting access',users:3},
      {name:'Rental Staff',desc:'Manage rentals and customers',users:5},
      {name:'Warehouse Staff',desc:'Manage inventory and returns',users:8},
      {name:'Finance',desc:'Manage invoices and claims',users:2},
      {name:'Driver',desc:'Driver portal access only',users:12}
    ];
    document.getElementById('tableBody').innerHTML=roles.map(r=>`<tr>
      <td class="fw-600">${r.name}</td><td>${r.desc}</td><td>${r.users}</td>
      <td><button class="btn-action" onclick="showToast('Edit permissions','info')"><i class="bi bi-shield-lock"></i></button></td>
    </tr>`).join('');
</script>
@endpush
