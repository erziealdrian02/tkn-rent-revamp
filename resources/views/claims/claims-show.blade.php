@extends('layouts.app')

@section('title', 'Claim Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
          <div class="detail-header" id="detailHeader"></div>
          <div class="er-card-body" id="detailBody"></div>
        </div>
@endsection

@push('scripts')
<script>
const cid = getUrlParam('id') || 'CLM-001';
    let clm = (MockData.claims||[]).find(c => c.id === cid);
    if (!clm) {
        clm = {
            id: cid, returnId: 'RET-001', customerId: 'CUS-001', customerName: 'PT Adhi Karya', equipment: 'Excavator PC200', quantity: 1, claimAmount: 5000000, status: 'Draft', createdDate: '2023-11-01', disputeReason: null
        };
    }

    initApp('claims',[{label:'Rental',href:'#'},{label:'Claims',href:'claims'},{label:clm.id}],clm.id);

    document.getElementById('detailHeader').innerHTML = `
      <div class="detail-header-left">
        <div class="detail-header-icon" style="background:var(--warning-bg);color:var(--warning)"><i class="bi bi-file-earmark-break"></i></div>
        <div class="detail-header-info">
          <h2>${clm.id} ${statusBadge(clm.status)}</h2>
          <div class="detail-meta">
            <span class="detail-meta-item"><i class="bi bi-person"></i>${clm.customerName}</span>
            <span class="detail-meta-item"><i class="bi bi-tools"></i>${clm.equipment}</span>
            <span class="detail-meta-item"><i class="bi bi-calendar"></i>${formatDate(clm.createdDate || '2023-11-01')}</span>
          </div>
        </div>
      </div>
      <div class="detail-header-actions">
        ${clm.status === 'Draft' ? `<button class="btn btn-warning btn-sm" onclick="submitClaim()"><i class="bi bi-send me-1"></i>Request Confirmation</button>` : ''}
        ${(clm.status === 'Pending Customer Confirmation' || clm.status === 'Waiting Customer Confirmation') ? `
            <button class="btn btn-success btn-sm" onclick="approveClaim()"><i class="bi bi-check-circle me-1"></i>Customer Approved</button>
            <button class="btn btn-danger btn-sm" onclick="disputeClaim()"><i class="bi bi-x-circle me-1"></i>Customer Disputed</button>
        ` : ''}
        ${clm.status === 'Approved' ? `<button class="btn btn-primary btn-sm" onclick="invoiceClaim()"><i class="bi bi-receipt me-1"></i>Generate Invoice</button>` : ''}
        ${clm.status === 'Disputed' ? `<button class="btn btn-success btn-sm" onclick="approveClaim()"><i class="bi bi-check-circle me-1"></i>Force Approve (Manager)</button>` : ''}
        <button class="btn btn-outline-secondary btn-sm" onclick="showToast('Print initiated','info')"><i class="bi bi-printer me-1"></i>Print</button>
      </div>`;

    document.getElementById('detailBody').innerHTML = `
      <div class="row g-4">
        <div class="col-md-6">
          <h6 class="fw-600 mb-3">Claim Details</h6>
          <div class="info-grid">
            <div class="info-item"><span class="info-label">Claim Number</span><span class="info-value text-mono">${clm.id}</span></div>
            <div class="info-item"><span class="info-label">Source Return</span><span class="info-value">${clm.returnId?`<a href="return-detail?id=${clm.returnId}">${clm.returnId}</a>`:'-'}</span></div>
            <div class="info-item"><span class="info-label">Customer</span><span class="info-value">${clm.customerName}</span></div>
            <div class="info-item"><span class="info-label">Equipment</span><span class="info-value fw-600">${clm.equipment}</span></div>
            <div class="info-item"><span class="info-label">Quantity Lost/Missing</span><span class="info-value">${clm.quantity}</span></div>
            <div class="info-item"><span class="info-label">Claim Amount</span><span class="info-value text-danger fw-700">${formatRupiah(clm.claimAmount)}</span></div>
            ${clm.invoiceId ? `<div class="info-item"><span class="info-label">Generated Invoice</span><span class="info-value"><a href="invoice-detail?id=${clm.invoiceId}">${clm.invoiceId}</a></span></div>` : ''}
          </div>
        </div>
        <div class="col-md-6">
          ${clm.disputeReason ? `
            <div class="alert alert-danger">
                <h6 class="alert-heading fw-600 mb-1"><i class="bi bi-exclamation-triangle me-1"></i>Dispute Reason</h6>
                <p class="mb-0 fs-13">${clm.disputeReason}</p>
            </div>
          ` : ''}
          <div class="alert alert-secondary mt-3">
            <h6 class="fw-600 mb-2">Claim Workflow Steps</h6>
            <ul class="mb-0 fs-13 ps-3">
                <li><strong>Draft:</strong> Claim drafted by warehouse</li>
                <li><strong>Pending Confirmation:</strong> Awaiting customer agreement</li>
                <li><strong>Approved:</strong> Customer agrees to the replacement value</li>
                <li><strong>Invoiced:</strong> Bill sent to customer</li>
                <li><strong>Paid:</strong> Claim closed</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    function submitClaim() {
        const res = BizLogic.Claim.updateStatus(clm.id, 'Pending Customer Confirmation');
        if(res.success) {
            showToast('Claim sent to customer for confirmation', 'success');
            setTimeout(() => location.reload(), 600);
        } else {
            showToast(res.error, 'error');
        }
    }

    function approveClaim() {
        const res = BizLogic.Claim.updateStatus(clm.id, 'Approved');
        if(res.success) {
            showToast('Claim approved by customer', 'success');
            setTimeout(() => location.reload(), 600);
        } else {
            showToast(res.error, 'error');
        }
    }

    function disputeClaim() {
        const reason = prompt("Enter customer dispute reason:", "");
        if (reason === null) return;
        const res = BizLogic.Claim.updateStatus(clm.id, 'Disputed', { reason: reason });
        if(res.success) {
            showToast('Claim marked as disputed', 'warning');
            setTimeout(() => location.reload(), 600);
        } else {
            showToast(res.error, 'error');
        }
    }

    function invoiceClaim() {
        const res = BizLogic.Claim.updateStatus(clm.id, 'Invoiced');
        if(res.success) {
            showToast('Invoice generated for claim', 'success');
            // MockData contains the new invoice now, let's redirect to it
            const claimNow = MockData.claims.find(c => c.id === clm.id);
            setTimeout(() => window.location.href = 'invoice-detail?id=' + claimNow.invoiceId, 800);
        } else {
            showToast(res.error, 'error');
        }
    }
</script>
@endpush
