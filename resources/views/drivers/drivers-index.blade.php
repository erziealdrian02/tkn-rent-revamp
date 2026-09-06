@extends('layouts.app')

@section('title', 'Drivers — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Drivers</h2><p class="page-header-subtitle">Manage driver personnel</p></div>
          <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add driver form','info')"><i class="bi bi-plus-lg me-1"></i>Add Driver</button></div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Driver ID</th><th>Name</th><th>Phone</th><th>License #</th><th>License Expiry</th><th>Status</th><th>Current Delivery</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('drivers',[{label:'Master Data',href:'#'},{label:'Drivers'}],'Drivers');

    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-toggle', 'modal');
    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-target', '#addDriverModal');
    document.querySelector('.page-header-actions .btn-primary').removeAttribute('onclick');

    document.getElementById('driverForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }

      const newDrv = {
        id: MockData.generateId('DRV', 'drivers'),
        name: document.getElementById('drvName').value,
        phone: document.getElementById('drvPhone').value,
        licenseNumber: document.getElementById('drvLicense').value,
        licenseExpiry: document.getElementById('drvExpiry').value,
        status: document.getElementById('drvStatus').value,
        currentDelivery: null
      };

      MockData.drivers.push(newDrv);
      MockData.save('drivers');

      bootstrap.Modal.getInstance(document.getElementById('addDriverModal')).hide();
      showToast('Driver successfully added.', 'success');
      
      this.reset();
      this.classList.remove('was-validated');
      
      renderTable();
    });

    function renderTable() {
      document.getElementById('tableBody').innerHTML=MockData.drivers.map(d=>`<tr>
        <td class="text-mono">${d.id}</td>
        <td><a href="driver-detail?id=${d.id}" class="cell-link">${d.name}</a></td>
        <td>${d.phone}</td><td>${d.licenseNumber}</td><td>${formatDate(d.licenseExpiry)}</td>
        <td>${statusBadge(d.status)}</td>
        <td>${d.currentDelivery?`<a href="delivery-detail?id=${d.currentDelivery}" class="cell-link">${d.currentDelivery}</a>`:'-'}</td>
        <td><a href="driver-detail?id=${d.id}" class="btn-action"><i class="bi bi-eye"></i></a><button class="btn-action"><i class="bi bi-pencil"></i></button></td>
      </tr>`).join('');
    }
    renderTable();
</script>
@endpush
