@extends('layouts.app')

@section('title', 'Equipment — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Equipment</h2><p class="page-header-subtitle">Manage equipment assets</p></div>
          <div class="page-header-actions">
            <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-upload me-1"></i>Import</button>
            <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-download me-1"></i>Export</button>
            <button class="btn btn-primary btn-sm" onclick="showToast('Add equipment form','info')"><i class="bi bi-plus-lg me-1"></i>Add Equipment</button>
          </div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search equipment..." id="searchInput" oninput="filterData()"></div>
            <select class="filter-select" id="categoryFilter" onchange="filterData()"><option value="">All Categories</option></select>
            <select class="filter-select" id="branchFilter" onchange="filterData()"><option value="">All Branches</option><option>Jakarta</option><option>Bekasi</option></select>
            <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Available</option><option>Reserved</option><option>On Rental</option><option>Maintenance</option><option>Damaged</option><option>Lost</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Asset ID</th><th>Equipment Name</th><th>Category</th><th>Serial #</th><th>Condition</th><th>Branch</th><th>Availability</th><th>Project</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody"></tbody></table></div>
          <div class="er-card-footer" id="pagination"></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('equipment',[{label:'Inventory',href:'#'},{label:'Equipment'}],'Equipment');
    // Update main buttons
    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-toggle', 'modal');
    document.querySelector('.page-header-actions .btn-primary').setAttribute('data-bs-target', '#addEquipmentModal');
    document.querySelector('.page-header-actions .btn-primary').removeAttribute('onclick');

    // Populate category filters & form
    const cf = document.getElementById('categoryFilter');
    const formCat = document.getElementById('eqCategory');
    formCat.innerHTML = '<option value="">Select category...</option>';
    MockData.equipmentCategories.forEach(c=>{
      cf.innerHTML += `<option value="${c}">${c}</option>`;
      formCat.innerHTML += `<option value="${c}">${c}</option>`;
    });

    const formBranch = document.getElementById('eqBranch');
    formBranch.innerHTML = '<option value="">Select branch...</option>';
    MockData.branches.forEach(b => {
      formBranch.innerHTML += `<option value="${b.id}">${b.name}</option>`;
    });

    document.getElementById('eqAssetId').value = MockData.generateId('EQP', 'equipment');

    function toggleTrackingType() {
      const isQty = document.getElementById('eqTrackingType').value === 'Quantity';
      document.getElementById('fieldSerial').style.display = isQty ? 'none' : 'block';
      document.getElementById('fieldQty').style.display = isQty ? 'block' : 'none';
      if(isQty) document.getElementById('eqSerial').removeAttribute('required');
    }

    document.getElementById('equipmentForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }

      const branchId = document.getElementById('eqBranch').value;
      const branchName = MockData.branches.find(b => b.id === branchId)?.name.replace(' Warehouse','') || branchId;

      const newEq = {
        id: document.getElementById('eqAssetId').value,
        name: document.getElementById('eqName').value,
        category: document.getElementById('eqCategory').value,
        serial: document.getElementById('eqSerial').value || '-',
        condition: document.getElementById('eqCondition').value,
        branch: branchName,
        branchId: branchId,
        availability: document.getElementById('eqStatus').value,
        project: null,
        status: document.getElementById('eqStatus').value,
        rate: document.getElementById('eqPrice').value || 0
      };

      MockData.equipment.push(newEq);
      MockData.save('equipment');

      // Update Stock
      const isQty = document.getElementById('eqTrackingType').value === 'Quantity';
      const addedQty = isQty ? parseInt(document.getElementById('eqQty').value) : 1;
      
      let stockItem = MockData.stock.find(s => s.equipment === newEq.name && s.branch === newEq.branch);
      if(stockItem) {
        stockItem.total += addedQty;
        stockItem.available += addedQty;
      } else {
        MockData.stock.push({
          equipment: newEq.name, branch: newEq.branch, total: addedQty, available: addedQty, reserved: 0, onRental: 0, damaged: 0, maintenance: 0, lost: 0
        });
      }
      MockData.save('stock');

      bootstrap.Modal.getInstance(document.getElementById('addEquipmentModal')).hide();
      showToast('Equipment successfully added.', 'success');
      
      // Reset form and UI
      this.reset();
      this.classList.remove('was-validated');
      document.getElementById('eqAssetId').value = MockData.generateId('EQP', 'equipment');
      
      filterData();
    });

    let currentPage=1; const pageSize=15;
    function filterData(){currentPage=1;renderTable();}
    function changePage(p){currentPage=p;renderTable();}
    function renderTable(){
      const q=document.getElementById('searchInput').value.toLowerCase();
      const cat=document.getElementById('categoryFilter').value;
      const br=document.getElementById('branchFilter').value;
      const st=document.getElementById('statusFilter').value;
      let data=MockData.equipment.filter(e=>{
        if(q&&!e.id.toLowerCase().includes(q)&&!e.name.toLowerCase().includes(q)&&!e.serial.toLowerCase().includes(q))return false;
        if(cat&&e.category!==cat)return false;if(br&&e.branch!==br)return false;if(st&&e.status!==st)return false;return true;
      });
      const total=data.length;
      const paged=data.slice((currentPage-1)*pageSize,currentPage*pageSize);
      document.getElementById('tableBody').innerHTML=paged.map(e=>`<tr>
        <td class="text-mono"><a href="equipment-detail?id=${e.id}" class="cell-link">${e.id}</a></td>
        <td>${e.name}</td><td>${e.category}</td><td class="text-mono fs-12">${e.serial}</td>
        <td>${statusBadge(e.condition)}</td><td>${e.branch}</td><td>${statusBadge(e.availability)}</td>
        <td>${e.project?`<a href="project-detail?id=${e.project}" class="cell-link fs-12">${e.project}</a>`:'-'}</td>
        <td>${statusBadge(e.status)}</td>
        <td><a href="equipment-detail?id=${e.id}" class="btn-action"><i class="bi bi-eye"></i></a><button class="btn-action"><i class="bi bi-pencil"></i></button></td>
      </tr>`).join('')||'<tr><td colspan="10" class="text-center text-muted py-4">No equipment found</td></tr>';
      document.getElementById('pagination').innerHTML=renderPagination(total,currentPage,pageSize,'changePage');
    }
    renderTable();
</script>
@endpush
