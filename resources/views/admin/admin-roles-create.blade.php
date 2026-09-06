@extends('layouts.app')

@section('title', 'Create New Role — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left">
            <h2 class="page-header-title">Create New Role</h2>
            <p class="page-header-subtitle">Configure system access permissions for a new user role.</p>
          </div>
        </div>
        
        <form id="roleForm" class="needs-validation" novalidate>
          <div class="row g-4">
            <div class="col-lg-8">
              <div class="er-card mb-4">
                <div class="er-card-header"><h5 class="er-card-title">1. Role Information</h5></div>
                <div class="er-card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label form-label-er">Role Name <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" id="roleName" required placeholder="e.g. Rental Supervisor">
                      <div class="invalid-feedback">Role name is required.</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label form-label-er">Status</label>
                      <select class="form-select" id="roleStatus">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label class="form-label form-label-er">Description</label>
                      <input type="text" class="form-control" id="roleDesc" placeholder="e.g. Can manage rentals and approve discounts">
                    </div>
                  </div>
                </div>
              </div>

              <div class="er-card mb-4">
                <div class="er-card-header d-flex justify-content-between align-items-center">
                  <h5 class="er-card-title mb-0">2. Permission Matrix</h5>
                  <div>
                    <button type="button" class="btn btn-outline-secondary btn-sm me-2" onclick="setPreset('none')">Clear All</button>
                    <button type="button" class="btn btn-outline-primary btn-sm" onclick="setPreset('all')">Select All</button>
                  </div>
                </div>
                <div class="er-card-body p-0">
                  <div class="bg-light p-3 border-bottom d-flex gap-2">
                    <span class="fs-13 fw-600 me-2 mt-1">Presets:</span>
                    <button type="button" class="btn btn-sm btn-light border" onclick="setPreset('readonly')">Read Only</button>
                    <button type="button" class="btn btn-sm btn-light border" onclick="setPreset('operations')">Operations</button>
                    <button type="button" class="btn btn-sm btn-light border" onclick="setPreset('finance')">Finance</button>
                    <button type="button" class="btn btn-sm btn-light border" onclick="setPreset('admin')">Administrator</button>
                  </div>
                  <div class="er-table-wrapper">
                    <table class="table matrix-table mb-0 fs-13">
                      <thead class="table-light">
                        <tr>
                          <th style="text-align:left">Module</th>
                          <th>View</th>
                          <th>Create</th>
                          <th>Update</th>
                          <th>Delete</th>
                          <th>Approve</th>
                        </tr>
                      </thead>
                      <tbody id="matrixBody">
                        <!-- Rendered via JS -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="er-card mb-4" style="position: sticky; top: 80px;">
                <div class="er-card-header"><h5 class="er-card-title">Summary</h5></div>
                <div class="er-card-body">
                  <div class="info-grid mb-4" style="grid-template-columns: 1fr;">
                    <div class="info-item">
                      <span class="info-label">Role Name</span>
                      <span class="info-value fw-600" id="sumRoleName">-</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Status</span>
                      <span class="info-value" id="sumStatus"><span class="badge-status good">Active</span></span>
                    </div>
                  </div>
                  
                  <h6 class="fs-13 fw-600 mb-3 text-secondary text-uppercase">Permissions Granted</h6>
                  <div class="d-flex justify-content-between mb-2 fs-13">
                    <span class="text-secondary">Modules</span><span class="fw-600" id="cntModules">0</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2 fs-13">
                    <span class="text-secondary">View</span><span class="fw-600" id="cntView">0</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2 fs-13">
                    <span class="text-secondary">Create</span><span class="fw-600" id="cntCreate">0</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2 fs-13">
                    <span class="text-secondary">Update</span><span class="fw-600" id="cntUpdate">0</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2 fs-13">
                    <span class="text-secondary">Delete</span><span class="fw-600 text-danger" id="cntDelete">0</span>
                  </div>
                  <div class="d-flex justify-content-between mb-4 fs-13">
                    <span class="text-secondary">Approve</span><span class="fw-600 text-primary" id="cntApprove">0</span>
                  </div>

                  <hr>
                  <div class="d-flex justify-content-between">
                    <button type="button" class="btn btn-outline-secondary" onclick="cancelCreate()">Cancel</button>
                    <div>
                      <button type="button" class="btn btn-outline-primary me-2">Save Draft</button>
                      <button type="submit" class="btn btn-primary">Create Role</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
@endsection

@push('scripts')
<script>
initApp('role-create', [{label:'Settings',href:'#'},{label:'Roles',href:'roles'},{label:'New Role'}], 'Create New Role');
    
    const modules = [
      'Dashboard', 'Rentals', 'Projects', 'Deliveries', 'Returns', 
      'Claims', 'Equipment', 'Branches', 'Stock', 'Movements', 
      'Purchases', 'Customers', 'Drivers', 'Vehicles', 'Company Accounts', 
      'Invoices', 'Users', 'Roles'
    ];
    const actions = ['View', 'Create', 'Update', 'Delete', 'Approve'];
    
    let formDirty = false;
    
    // Render Matrix
    document.getElementById('matrixBody').innerHTML = modules.map(m => `
      <tr>
        <td>${m}</td>
        ${actions.map(a => `<td class="text-center"><input type="checkbox" class="perm-cb" data-module="${m}" data-action="${a}" onchange="updateCounts()"></td>`).join('')}
      </tr>
    `).join('');

    // Update Summary
    document.getElementById('roleForm').addEventListener('input', (e) => {
      formDirty = true;
      if(e.target.id === 'roleName') document.getElementById('sumRoleName').textContent = e.target.value || '-';
      if(e.target.id === 'roleStatus') {
        const isAct = e.target.value === 'Active';
        document.getElementById('sumStatus').innerHTML = `<span class="badge-status ${isAct?'good':'draft'}">${e.target.value}</span>`;
      }
    });

    function updateCounts() {
      formDirty = true;
      const cbs = Array.from(document.querySelectorAll('.perm-cb'));
      const activeMods = new Set();
      const counts = { View: 0, Create: 0, Update: 0, Delete: 0, Approve: 0 };
      
      cbs.forEach(cb => {
        if(cb.checked) {
          activeMods.add(cb.dataset.module);
          counts[cb.dataset.action]++;
        }
      });
      
      document.getElementById('cntModules').textContent = activeMods.size;
      document.getElementById('cntView').textContent = counts.View;
      document.getElementById('cntCreate').textContent = counts.Create;
      document.getElementById('cntUpdate').textContent = counts.Update;
      document.getElementById('cntDelete').textContent = counts.Delete;
      document.getElementById('cntApprove').textContent = counts.Approve;
    }

    function setPreset(preset) {
      const cbs = document.querySelectorAll('.perm-cb');
      cbs.forEach(cb => {
        const a = cb.dataset.action;
        const m = cb.dataset.module;
        if(preset === 'none') cb.checked = false;
        else if(preset === 'all') cb.checked = true;
        else if(preset === 'readonly') cb.checked = (a === 'View');
        else if(preset === 'operations') {
          if(['Users','Roles','Company Accounts'].includes(m)) cb.checked = false;
          else cb.checked = ['View','Create','Update'].includes(a);
        }
        else if(preset === 'finance') {
          if(['Invoices','Claims','Purchases','Company Accounts','Returns','Rentals'].includes(m)) {
            cb.checked = ['View','Create','Update'].includes(a);
          } else {
            cb.checked = (a === 'View');
          }
        }
        else if(preset === 'admin') {
          cb.checked = ['View','Create','Update','Delete'].includes(a);
        }
      });
      updateCounts();
    }

    function cancelCreate() {
      if (formDirty && !confirm("Are you sure you want to leave? Your unsaved changes will be lost.")) {
        return;
      }
      window.location.href = 'roles';
    }

    document.getElementById('roleForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }

      const newId = MockData.generateId('ROLE', 'roles');
      const newRole = {
        id: newId,
        name: document.getElementById('roleName').value,
        description: document.getElementById('roleDesc').value || 'Custom Role',
        usersCount: 0
      };

      MockData.roles.push(newRole);
      MockData.save('roles');

      formDirty = false;
      showToast(`Role ${newRole.name} successfully created.`, 'success');
      setTimeout(() => window.location.href = 'roles', 1500);
    });

    window.addEventListener('beforeunload', function (e) {
      if (formDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
</script>
@endpush
