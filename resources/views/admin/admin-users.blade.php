@extends('layouts.app')

@section('title', 'Users — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">System Users</h2><p class="page-header-subtitle">Manage user access and accounts</p></div>
        <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add user','info')"><i class="bi bi-plus-lg me-1"></i>Add User</button></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('users',[{label:'Settings',href:'#'},{label:'Users'}],'Users');

    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-toggle', 'modal');
    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-target', '#addUserModal');
    document.querySelector('.page-header-actions .btn-primary').removeAttribute('onclick');

    const roleSel = document.getElementById('usrRole');
    MockData.roles.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.name;
      opt.textContent = r.name;
      roleSel.appendChild(opt);
    });

    const branchSel = document.getElementById('usrBranch');
    MockData.branches.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.name.replace(' Warehouse', '');
      opt.textContent = b.name;
      branchSel.appendChild(opt);
    });

    document.getElementById('userForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }

      const name = document.getElementById('usrName').value;
      const initials = name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();

      const newUsr = {
        name: name,
        username: document.getElementById('usrUsername').value,
        password: document.getElementById('usrPassword').value,
        role: document.getElementById('usrRole').value,
        branch: document.getElementById('usrBranch').value,
        initials: initials
      };

      MockData.demoUsers.push(newUsr);
      MockData.save('demoUsers');

      bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
      showToast('User successfully added.', 'success');
      
      this.reset();
      this.classList.remove('was-validated');
      
      renderTable();
    });

    function renderTable() {
      document.getElementById('tableBody').innerHTML=MockData.demoUsers.map(u=>`<tr>
        <td class="fw-600">${u.name}</td><td>${u.username}</td><td><span class="badge bg-light text-dark border">${u.role}</span></td>
        <td><span class="badge-status good">Active</span></td>
        <td><button class="btn-action" onclick="showToast('Edit user','info')"><i class="bi bi-pencil"></i></button></td>
      </tr>`).join('');
    }
    renderTable();
</script>
@endpush
