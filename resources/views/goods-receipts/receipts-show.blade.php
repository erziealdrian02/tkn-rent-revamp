@extends('layouts.app')

@section('title', 'Goods Receipt Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
          <div class="detail-header" id="detailHeader"></div>
          <div class="er-card-body" id="detailBody"></div>
        </div>
@endsection

@push('scripts')
<script>
const grid = getUrlParam('id') || 'GR-001';
    let gr = (MockData.goodsReceipts||[]).find(g => g.id === grid);
    if (!gr) {
        gr = {
            id: grid, purchaseId: 'PO-001', vendor: 'PT Adhi Karya', branch: 'Jakarta Warehouse', receiptDate: '2023-11-01', receivedBy: 'Warehouse Staff', notes: 'All good', status: 'Completed', items: [{name: 'Excavator PC200', qty: 1}]
        };
    }

    initApp('goods-receipts',[{label:'Inventory',href:'#'},{label:'Goods Receipts',href:'goods-receipts'},{label:gr.id}],gr.id);

    document.getElementById('detailHeader').innerHTML = `
      <div class="detail-header-left">
        <div class="detail-header-icon" style="background:var(--success-bg);color:var(--success)"><i class="bi bi-box-seam"></i></div>
        <div class="detail-header-info">
          <h2>${gr.id} ${statusBadge(gr.status)}</h2>
          <div class="detail-meta">
            <span class="detail-meta-item"><i class="bi bi-file-earmark-text"></i><a href="purchase-detail?id=${gr.purchaseId}">${gr.purchaseId}</a></span>
            <span class="detail-meta-item"><i class="bi bi-shop"></i>${gr.vendor}</span>
            <span class="detail-meta-item"><i class="bi bi-calendar"></i>${formatDate(gr.receiptDate)}</span>
          </div>
        </div>
      </div>
      <div class="detail-header-actions">
        <button class="btn btn-outline-secondary btn-sm" onclick="showToast('Print initiated','info')"><i class="bi bi-printer me-1"></i>Print GR</button>
      </div>`;

    document.getElementById('detailBody').innerHTML = `
      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <h6 class="fw-600 mb-3">Goods Receipt Details</h6>
          <div class="info-grid">
            <div class="info-item"><span class="info-label">Receipt Number</span><span class="info-value text-mono">${gr.id}</span></div>
            <div class="info-item"><span class="info-label">Purchase Order</span><span class="info-value"><a href="purchase-detail?id=${gr.purchaseId}">${gr.purchaseId}</a></span></div>
            <div class="info-item"><span class="info-label">Vendor</span><span class="info-value">${gr.vendor}</span></div>
            <div class="info-item"><span class="info-label">Receipt Date</span><span class="info-value">${formatDate(gr.receiptDate)}</span></div>
            <div class="info-item"><span class="info-label">Target Branch</span><span class="info-value">${gr.branch}</span></div>
            <div class="info-item"><span class="info-label">Received By</span><span class="info-value">${gr.receivedBy}</span></div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="alert alert-secondary h-100">
            <h6 class="fw-600 mb-2"><i class="bi bi-info-circle me-1"></i>Receipt Notes</h6>
            <p class="mb-0 fs-13">${gr.notes || 'No notes provided.'}</p>
          </div>
        </div>
      </div>
      <h6 class="fw-600 mb-3">Received Items</h6>
      <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Equipment</th><th>Quantity Received</th></tr></thead><tbody>
      ${gr.items.map(i=>`<tr><td class="fw-500">${i.name}</td><td><strong>${i.qty}</strong></td></tr>`).join('')}
      </tbody></table></div>
    `;
</script>
@endpush
