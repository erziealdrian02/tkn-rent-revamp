@extends('layouts.app')

@section('title', 'Maintenance Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
          <div class="detail-header" id="detailHeader"></div>
          <div class="er-card-body" id="detailBody"></div>
        </div>
@endsection

@push('scripts')
<script>
const mtid = getUrlParam('id') || 'MT-001';
    let mt = (MockData.maintenance||[]).find(m => m.id === mtid);
    if (!mt) {
        mt = {
            id: mtid, equipment: 'Excavator PC200', branch: 'Jakarta Warehouse', quantity: 1, type: 'Routine Check', status: 'In Progress', startDate: '2023-11-01', notes: 'Routine check', technician: 'Budi'
        };
    }

    initApp('maintenance',[{label:'Equipment',href:'#'},{label:'Maintenance',href:'maintenance'},{label:mt.id}],mt.id);

    document.getElementById('detailHeader').innerHTML = `
      <div class="detail-header-left">
        <div class="detail-header-icon" style="background:var(--info-bg);color:var(--info)"><i class="bi bi-tools"></i></div>
        <div class="detail-header-info">
          <h2>${mt.id} ${statusBadge(mt.status)}</h2>
          <div class="detail-meta">
            <span class="detail-meta-item"><i class="bi bi-truck"></i>${mt.equipment}</span>
            <span class="detail-meta-item"><i class="bi bi-geo-alt"></i>${mt.branch}</span>
            <span class="detail-meta-item"><i class="bi bi-person"></i>${mt.technician}</span>
          </div>
        </div>
      </div>
      <div class="detail-header-actions">
        ${mt.status === 'In Progress' ? `<button class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#completeModal"><i class="bi bi-check-circle me-1"></i>Complete Maintenance</button>` : ''}
        <button class="btn btn-outline-secondary btn-sm" onclick="showToast('Print initiated','info')"><i class="bi bi-printer me-1"></i>Print Form</button>
      </div>`;

    document.getElementById('detailBody').innerHTML = `
      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <h6 class="fw-600 mb-3">Maintenance Details</h6>
          <div class="info-grid">
            <div class="info-item"><span class="info-label">Maintenance ID</span><span class="info-value text-mono">${mt.id}</span></div>
            <div class="info-item"><span class="info-label">Equipment</span><span class="info-value fw-600">${mt.equipment}</span></div>
            <div class="info-item"><span class="info-label">Quantity</span><span class="info-value">${mt.quantity}</span></div>
            <div class="info-item"><span class="info-label">Branch</span><span class="info-value">${mt.branch}</span></div>
            <div class="info-item"><span class="info-label">Type</span><span class="info-value">${mt.type}</span></div>
            <div class="info-item"><span class="info-label">Technician</span><span class="info-value">${mt.technician}</span></div>
            <div class="info-item"><span class="info-label">Start Date</span><span class="info-value">${formatDate(mt.startDate)}</span></div>
            <div class="info-item"><span class="info-label">Completion Date</span><span class="info-value">${mt.completionDate ? formatDate(mt.completionDate) : '-'}</span></div>
          </div>
        </div>
        <div class="col-md-6">
          <h6 class="fw-600 mb-3">Notes & Resolution</h6>
          <div class="alert alert-secondary mb-3">
            <h6 class="fw-600 mb-2"><i class="bi bi-info-circle me-1"></i>Initial Notes</h6>
            <p class="mb-0 fs-13">${mt.notes || 'No notes provided.'}</p>
          </div>
          ${mt.resolution ? `
          <div class="alert alert-success">
            <h6 class="fw-600 mb-2"><i class="bi bi-check-circle me-1"></i>Resolution</h6>
            <p class="mb-0 fs-13">${mt.resolution}</p>
          </div>
          ` : ''}
        </div>
      </div>
    `;

    function completeMaintenance() {
        const resNotes = document.getElementById('mtResolution').value;
        const res = BizLogic.Maintenance.complete(mt.id, resNotes);
        if(res.success) {
            bootstrap.Modal.getInstance(document.getElementById('completeModal')).hide();
            showToast('Maintenance completed, stock returned to available', 'success');
            setTimeout(() => location.reload(), 800);
        } else {
            showToast(res.error, 'danger');
        }
    }
</script>
@endpush
