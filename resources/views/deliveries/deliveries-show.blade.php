@extends('layouts.app')

@section('title', 'Delivery Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
          <div class="detail-header" id="detailHeader"></div>
          <div class="er-card-body" id="detailBody"></div>
        </div>
      </div>
    </main>
@endsection

@push('scripts')
<script>
const did = getUrlParam('id') || 'DLV-001';
    const dlv = MockData.deliveries.find(d => d.id === did) || MockData.deliveries[0];
    initApp('deliveries',[{label:'Rental',href:'#'},{label:'Deliveries',href:'deliveries'},{label:dlv.id}],dlv.id);

    document.getElementById('detailHeader').innerHTML = `
      <div class="detail-header-left">
        <div class="detail-header-icon"><i class="bi bi-truck"></i></div>
        <div class="detail-header-info">
          <h2>${dlv.id} ${statusBadge(dlv.status)}</h2>
          <div class="detail-meta">
            <span class="detail-meta-item"><i class="bi bi-file-earmark-text"></i><a href="rental-detail?id=${dlv.rentalId}">${dlv.rentalId}</a></span>
            <span class="detail-meta-item"><i class="bi bi-people"></i>${dlv.customerName}</span>
            <span class="detail-meta-item"><i class="bi bi-folder"></i><a href="project-detail?id=${dlv.projectId}">${dlv.projectName}</a></span>
            <span class="detail-meta-item"><i class="bi bi-calendar"></i>${formatDate(dlv.deliveryDate)}</span>
          </div>
        </div>
      </div>
      <div class="detail-header-actions">
        ${dlv.status === 'Assigned' ? `<button class="btn btn-warning btn-sm" onclick="departDelivery()"><i class="bi bi-truck me-1"></i>Depart</button>` : ''}
        ${dlv.status === 'Departed' ? `<button class="btn btn-info btn-sm" onclick="arriveDelivery()"><i class="bi bi-geo-alt me-1"></i>Arrive at Site</button>
                                       <button class="btn btn-outline-danger btn-sm" onclick="openFailModal()"><i class="bi bi-exclamation-triangle me-1"></i>Report Issue</button>` : ''}
        ${dlv.status === 'Arrived' ? `<button class="btn btn-success btn-sm" onclick="openPodModal()"><i class="bi bi-check-circle me-1"></i>Complete Handover (PoD)</button>
                                      <button class="btn btn-outline-danger btn-sm" onclick="openFailModal()"><i class="bi bi-exclamation-triangle me-1"></i>Report Issue</button>` : ''}
        ${dlv.status === 'Failed' ? `<button class="btn btn-primary btn-sm" onclick="rescheduleDelivery()"><i class="bi bi-arrow-repeat me-1"></i>Reschedule</button>` : ''}
        <button class="btn btn-outline-secondary btn-sm" onclick="showToast('Print initiated','info')"><i class="bi bi-printer me-1"></i>Print</button>
      </div>`;

    document.getElementById('detailBody').innerHTML = `
      <div class="row g-4">
        <div class="col-md-6">
          <h6 class="fw-600 mb-3">Delivery Information</h6>
          <div class="info-grid">
            <div class="info-item"><span class="info-label">Delivery Number</span><span class="info-value text-mono">${dlv.id}</span></div>
            <div class="info-item"><span class="info-label">Rental Number</span><span class="info-value"><a href="rental-detail?id=${dlv.rentalId}">${dlv.rentalId}</a></span></div>
            <div class="info-item"><span class="info-label">Customer</span><span class="info-value">${dlv.customerName}</span></div>
            <div class="info-item"><span class="info-label">Project</span><span class="info-value">${dlv.projectName}</span></div>
            <div class="info-item"><span class="info-label">Delivery Date</span><span class="info-value">${formatDate(dlv.deliveryDate)}</span></div>
            <div class="info-item"><span class="info-label">Destination</span><span class="info-value">${dlv.destination}</span></div>
            <div class="info-item"><span class="info-label">Status</span><span class="info-value">${statusBadge(dlv.status)}</span></div>
            <div class="info-item"><span class="info-label">Notes</span><span class="info-value">${dlv.notes||'-'}</span></div>
          </div>
        </div>
        <div class="col-md-6">
          <h6 class="fw-600 mb-3">Driver & Vehicle</h6>
          <div class="info-grid">
            <div class="info-item"><span class="info-label">Driver</span><span class="info-value">${dlv.driverName?`<a href="driver-detail?id=${dlv.driverId}">${dlv.driverName}</a>`:'<span class="text-muted">Unassigned</span>'}</span></div>
            <div class="info-item"><span class="info-label">Vehicle</span><span class="info-value">${dlv.vehiclePlate?`<a href="vehicle-detail?id=${dlv.vehicleId}">${dlv.vehiclePlate}</a>`:'-'}</span></div>
          </div>
        </div>
      </div>

      ${dlv.proofOfDelivery ? `
      <div class="alert alert-success mt-4 mb-0">
        <h6 class="alert-heading fw-600 mb-2"><i class="bi bi-person-check me-2"></i>Proof of Delivery (PoD)</h6>
        <div class="row">
          <div class="col-md-4"><strong>Receiver:</strong> ${dlv.proofOfDelivery.receiverName}</div>
          <div class="col-md-4"><strong>Phone:</strong> ${dlv.proofOfDelivery.receiverPhone}</div>
          <div class="col-md-4"><strong>Received At:</strong> ${dlv.completedAt}</div>
        </div>
      </div>` : ''}

      ${dlv.failureInfo ? `
      <div class="alert alert-danger mt-4 mb-0">
        <h6 class="alert-heading fw-600 mb-2"><i class="bi bi-exclamation-triangle me-2"></i>Delivery Failed</h6>
        <p class="mb-0"><strong>Reason:</strong> ${dlv.failureInfo.reason}</p>
        <p class="mb-0"><strong>Details:</strong> ${dlv.failureInfo.notes || 'None'}</p>
      </div>` : ''}

      <h6 class="fw-600 mt-4 mb-3">Equipment Being Delivered</h6>
      <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Equipment</th><th>Quantity</th></tr></thead><tbody>
      ${dlv.items.map(i=>`<tr><td>${i.name}</td><td>${i.qty}</td></tr>`).join('')}
      </tbody></table></div>

      <h6 class="fw-600 mt-4 mb-3">Delivery Timeline</h6>
      ${renderActivityTimeline([
        {time:(dlv.createdAt || '09:00'),date:dlv.deliveryDate,action:'Delivery created',user:'Admin',type:'info'},
        ...(dlv.driverName?[{time:(dlv.createdAt || '09:30'),date:dlv.deliveryDate,action:`Driver ${dlv.driverName} assigned`,user:'Admin',type:'info'}]:[]),
        ...(dlv.departedAt?[{time:dlv.departedAt.split(' ')[1],date:dlv.departedAt.split(' ')[0],action:'Delivery departed',user:dlv.driverName,type:'warning'}]:[]),
        ...(dlv.arrivedAt?[{time:dlv.arrivedAt.split(' ')[1],date:dlv.arrivedAt.split(' ')[0],action:'Delivery arrived at destination',user:dlv.driverName,type:'info'}]:[]),
        ...(dlv.completedAt?[{time:dlv.completedAt.split(' ')[1],date:dlv.completedAt.split(' ')[0],action:'Delivery completed - items handed over',user:dlv.driverName,type:'success'}]:[]),
        ...(dlv.failedAt?[{time:dlv.failedAt.split(' ')[1],date:dlv.failedAt.split(' ')[0],action:'Delivery failed',user:dlv.driverName,type:'danger'}]:[]),
        ...(dlv.rescheduledAt?[{time:dlv.rescheduledAt.split(' ')[1],date:dlv.rescheduledAt.split(' ')[0],action:'Delivery rescheduled',user:'Admin',type:'primary'}]:[]),
      ])}`;

    function departDelivery() {
      const res = BizLogic.Delivery.updateStatus(dlv.id, 'Departed');
      if (res.success) { showToast('Delivery departed', 'success'); setTimeout(() => location.reload(), 600); }
      else { showToast(res.error, 'error'); }
    }

    function arriveDelivery() {
      const res = BizLogic.Delivery.updateStatus(dlv.id, 'Arrived');
      if (res.success) { showToast('Arrived at site', 'success'); setTimeout(() => location.reload(), 600); }
      else { showToast(res.error, 'error'); }
    }

    function openPodModal() {
      new bootstrap.Modal(document.getElementById('podModal')).show();
    }

    function completeDelivery() {
      const name = document.getElementById('podName').value;
      const phone = document.getElementById('podPhone').value;
      if (!name) { showToast('Receiver name is required', 'warning'); return; }
      
      const podData = { receiverName: name, receiverPhone: phone, signatureMock: true };
      // BizLogic requires 'Arrived' -> 'Completed', PoD can be attached on 'Arrived' or passed in 'Completed'
      // Based on business logic, we just pass proofOfDelivery as extraData for Arrived, but here we can just update the object and transition to Completed
      
      // But wait, the engine says proofOfDelivery is saved when transitioning to Arrived, but we are already arrived. 
      // Let's modify the local object and let Completed save it.
      dlv.proofOfDelivery = podData; 
      
      const res = BizLogic.Delivery.updateStatus(dlv.id, 'Completed');
      if (res.success) { 
        // Force save the PoD that we injected
        MockData.save('deliveries'); 
        showToast('Delivery completed successfully!', 'success'); 
        setTimeout(() => location.reload(), 600); 
      }
      else { showToast(res.error, 'error'); }
    }

    function openFailModal() {
      new bootstrap.Modal(document.getElementById('failModal')).show();
    }

    function failDelivery() {
      const reason = document.getElementById('failReasonType').value;
      const notes = document.getElementById('failReasonText').value;
      
      const res = BizLogic.Delivery.updateStatus(dlv.id, 'Failed', { reason: reason, notes: notes });
      if (res.success) { 
        showToast('Delivery marked as failed', 'error'); 
        setTimeout(() => location.reload(), 600); 
      }
      else { showToast(res.error, 'error'); }
    }

    function rescheduleDelivery() {
      const newDateStr = prompt('Enter new delivery date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
      if (newDateStr) {
        const res = BizLogic.Delivery.updateStatus(dlv.id, 'Rescheduled', { newDate: newDateStr });
        if (res.success) {
          showToast('Delivery rescheduled', 'success');
          setTimeout(() => location.reload(), 600);
        } else {
          showToast(res.error, 'error');
        }
      }
    }
</script>
@endpush
