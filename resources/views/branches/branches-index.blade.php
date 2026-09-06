@extends('layouts.app')

@section('title', 'Branches — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Branches</h2><p class="page-header-subtitle">Warehouse and branch management</p></div>
        <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add branch','info')"><i class="bi bi-plus-lg me-1"></i>Add Branch</button></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Code</th><th>Branch Name</th><th>Address</th><th>Capacity</th><th>Total Equipment</th><th>Available</th><th>On Rental</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('branches',[{label:'Inventory',href:'#'},{label:'Branches'}],'Branches');

    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-toggle', 'modal');
    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-target', '#addBranchModal');
    document.querySelector('.page-header-actions .btn-primary').removeAttribute('onclick');

    document.getElementById('branchForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }

      const newBr = {
        id: MockData.generateId('BR', 'branches'),
        code: document.getElementById('brCode').value.toUpperCase(),
        name: document.getElementById('brName').value,
        address: document.getElementById('brAddress').value,
        capacity: parseInt(document.getElementById('brCapacity').value) || 0,
        totalEquipment: 0,
        available: 0,
        onRental: 0,
        status: document.getElementById('brStatus').value
      };

      MockData.branches.push(newBr);
      MockData.save('branches');

      bootstrap.Modal.getInstance(document.getElementById('addBranchModal')).hide();
      showToast('Branch successfully added.', 'success');
      
      this.reset();
      this.classList.remove('was-validated');
      
      renderTable();
    });

    function renderTable() {
      document.getElementById('tableBody').innerHTML=MockData.branches.map(b=>`<tr>
        <td class="text-mono fw-600">${b.code}</td>
        <td><a href="branch-detail?id=${b.id}" class="cell-link">${b.name}</a></td>
        <td class="fs-12">${b.address}</td><td>${b.capacity}</td><td>${b.totalEquipment}</td>
        <td><span class="badge-status available">${b.available}</span></td>
        <td><span class="badge-status on-rental">${b.onRental}</span></td>
        <td>${statusBadge(b.status)}</td>
        <td><a href="branch-detail?id=${b.id}" class="btn-action"><i class="bi bi-eye"></i></a><button class="btn-action"><i class="bi bi-pencil"></i></button></td>
      </tr>`).join('');
    }
    renderTable();
</script>
@endpush
