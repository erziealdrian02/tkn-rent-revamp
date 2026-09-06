@extends('layouts.app')

@section('title', 'Maintenance — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left">
            <h2 class="page-header-title">Equipment Maintenance</h2>
            <p class="page-header-subtitle">Schedule and track routine equipment checks and calibrations</p>
          </div>
          <div class="page-header-right">
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newMaintenanceModal"><i class="bi bi-tools me-1"></i>Start Maintenance</button>
          </div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search maintenance..." id="searchInput" oninput="filterData()"></div>
              <select class="filter-select" id="statusFilter" onchange="filterData()">
                <option value="">All Status</option><option>In Progress</option><option>Completed</option>
              </select>
            </div>
          </div>
          <div class="er-table-wrapper">
            <table class="er-table">
              <thead><tr><th>ID</th><th>Equipment</th><th>Branch</th><th>Qty</th><th>Type</th><th>Start Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="tableBody"></tbody>
            </table>
          </div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('maintenance',[{label:'Equipment',href:'#'},{label:'Maintenance'}],'Maintenance');
    
    // Populate equipment dropdown
    const uniqueEquip = [...new Set(MockData.stock.map(s => s.equipment))];
    const equipSel = document.getElementById('mtEquip');
    uniqueEquip.forEach(eq => { equipSel.innerHTML += `<option value="${eq}">${eq}</option>`; });

    function updateAvailability() {
        const eq = document.getElementById('mtEquip').value;
        const br = document.getElementById('mtBranch').value;
        const st = MockData.stock.find(s => s.equipment === eq && s.branch === br);
        const avail = st ? st.available : 0;
        document.getElementById('availQty').innerText = avail;
        document.getElementById('mtQty').max = avail;
    }
    updateAvailability();

    function startMaintenance() {
        const eq = document.getElementById('mtEquip').value;
        const br = document.getElementById('mtBranch').value;
        const qty = document.getElementById('mtQty').value;
        const type = document.getElementById('mtType').value;
        const notes = document.getElementById('mtNotes').value;

        const res = BizLogic.Maintenance.create(eq, br, qty, type, notes);
        if(res.success) {
            bootstrap.Modal.getInstance(document.getElementById('newMaintenanceModal')).hide();
            showToast('Maintenance started successfully!', 'success');
            setTimeout(() => window.location.href = 'maintenance-detail?id=' + res.maintenance.id, 800);
        } else {
            showToast(res.error, 'danger');
        }
    }

    function filterData(){
      const q=document.getElementById('searchInput').value.toLowerCase();
      const s=document.getElementById('statusFilter').value;
      const data=(MockData.maintenance||[]).filter(m=>{
        if(q&&!m.id.toLowerCase().includes(q)&&!m.equipment.toLowerCase().includes(q))return false;
        if(s&&m.status!==s)return false;
        return true;
      }).reverse();
      
      document.getElementById('tableBody').innerHTML=data.map(m=>`<tr>
        <td><a href="maintenance-detail?id=${m.id}" class="cell-link text-mono">${m.id}</a></td>
        <td class="fw-500">${m.equipment}</td>
        <td>${m.branch}</td>
        <td>${m.quantity}</td>
        <td>${m.type}</td>
        <td>${formatDate(m.startDate)}</td>
        <td>${statusBadge(m.status)}</td>
        <td><a href="maintenance-detail?id=${m.id}" class="btn-action"><i class="bi bi-eye"></i></a></td>
      </tr>`).join('')||'<tr><td colspan="8" class="text-center text-muted py-4">No maintenance records found</td></tr>';
    }
    
    // Seed initial mock data if empty
    if(!MockData.maintenance || MockData.maintenance.length === 0) {
        MockData.maintenance = [
            { id: 'MT-001', equipment: 'Excavator PC200', branch: 'Jakarta Warehouse', quantity: 1, type: 'Routine Check', status: 'Completed', startDate: '2023-10-15', completionDate: '2023-10-16', notes: 'Monthly routine check', technician: 'Budi' },
            { id: 'MT-002', equipment: 'Bulldozer D85', branch: 'Bekasi Warehouse', quantity: 2, type: 'Calibration', status: 'In Progress', startDate: new Date().toISOString().split('T')[0], completionDate: null, notes: 'Blade calibration', technician: 'Andi' }
        ];
        MockData.save('maintenance');
    }
    
    filterData();
</script>
@endpush
