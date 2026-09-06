@extends('layouts.app')

@section('title', 'Vehicles — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Vehicles</h2><p class="page-header-subtitle">Delivery vehicle fleet management</p></div>
        <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add vehicle','info')"><i class="bi bi-plus-lg me-1"></i>Add Vehicle</button></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Available</option><option>On Delivery</option><option>Maintenance</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>ID</th><th>License Plate</th><th>Type</th><th>Brand</th><th>Capacity (Ton)</th><th>Tax Expiry</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('vehicles',[{label:'Master Data',href:'#'},{label:'Vehicles'}],'Vehicles');

    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-toggle', 'modal');
    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-target', '#addVehicleModal');
    document.querySelector('.page-header-actions .btn-primary').removeAttribute('onclick');

    document.getElementById('vehicleForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }

      const newVhc = {
        id: MockData.generateId('VHC', 'vehicles'),
        plate: document.getElementById('vhcPlate').value.toUpperCase(),
        type: document.getElementById('vhcType').value,
        brand: document.getElementById('vhcBrand').value,
        capacity: document.getElementById('vhcCapacity').value,
        status: document.getElementById('vhcStatus').value,
        taxExpiry: document.getElementById('vhcTax').value || '2028-01-01',
        driverId: null,
        driverName: null,
        currentDelivery: null
      };

      MockData.vehicles.push(newVhc);
      MockData.save('vehicles');

      bootstrap.Modal.getInstance(document.getElementById('addVehicleModal')).hide();
      showToast('Vehicle successfully added.', 'success');
      
      this.reset();
      this.classList.remove('was-validated');
      
      filterData();
    });

    function filterData(){
      const s=document.getElementById('statusFilter').value;
      const data=MockData.vehicles.filter(v=>{if(s&&v.status!==s)return false;return true;});
      document.getElementById('tableBody').innerHTML=data.map(v=>`<tr>
        <td class="text-mono">${v.id}</td><td><a href="vehicle-detail?id=${v.id}" class="cell-link fw-600">${v.plate}</a></td>
        <td>${v.type}</td><td>${v.brand}</td><td>${v.capacity}</td><td>${v.taxExpiry ? formatDate(v.taxExpiry) : '-'}</td>
        <td>${statusBadge(v.status)}</td>
        <td><a href="vehicle-detail?id=${v.id}" class="btn-action"><i class="bi bi-eye"></i></a><button class="btn-action"><i class="bi bi-pencil"></i></button></td>
      </tr>`).join('')||'<tr><td colspan="8" class="text-center text-muted py-4">No vehicles found</td></tr>';
    }
    filterData();
</script>
@endpush
