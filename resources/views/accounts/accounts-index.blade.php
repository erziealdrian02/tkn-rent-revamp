@extends('layouts.app')

@section('title', 'Accounts — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Bank Accounts</h2><p class="page-header-subtitle">Manage company bank accounts for billing</p></div>
        <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add account','info')"><i class="bi bi-plus-lg me-1"></i>Add Account</button></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>ID</th><th>Account Name</th><th>Bank</th><th>Account Number</th><th>Holder Name</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('accounts',[{label:'Settings',href:'#'},{label:'Accounts'}],'Bank Accounts');

    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-toggle', 'modal');
    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-target', '#addAccountModal');
    document.querySelector('.page-header-actions .btn-primary').removeAttribute('onclick');

    const branchSel = document.getElementById('accBranch');
    MockData.branches.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.name.replace(' Warehouse', '');
      opt.textContent = b.name;
      branchSel.appendChild(opt);
    });

    document.getElementById('accountForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }

      const newAcc = {
        id: MockData.generateId('ACC', 'accounts'),
        name: document.getElementById('accName').value,
        bank: document.getElementById('accBank').value,
        accountNumber: document.getElementById('accNumber').value,
        accountHolder: document.getElementById('accHolder').value,
        type: document.getElementById('accType').value,
        branch: document.getElementById('accBranch').value,
        status: document.getElementById('accStatus').value
      };

      MockData.accounts.push(newAcc);
      MockData.save('accounts');

      bootstrap.Modal.getInstance(document.getElementById('addAccountModal')).hide();
      showToast('Account successfully added.', 'success');
      
      this.reset();
      this.classList.remove('was-validated');
      
      renderTable();
    });

    function renderTable() {
      document.getElementById('tableBody').innerHTML=MockData.accounts.map(a=>`<tr>
        <td class="text-mono">${a.id}</td><td><span class="fw-600">${a.name}</span></td>
        <td>${a.bank}</td><td class="text-mono">${a.accountNumber}</td><td>${a.accountHolder}</td>
        <td><span class="badge-status ${a.status==='Active'?'good':'draft'}">${a.status}</span></td>
        <td><button class="btn-action" onclick="showToast('Edit Account','info')"><i class="bi bi-pencil"></i></button></td>
      </tr>`).join('');
    }
    renderTable();
</script>
@endpush
