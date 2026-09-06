@extends('layouts.app')

@section('title', 'Purchase Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
          <div class="detail-header" id="detailHeader"></div>
          <div class="er-card-body" id="detailBody"></div>
        </div>
@endsection

@push('scripts')
<script>
const pid = getUrlParam('id') || 'PO-001';
    const po = MockData.purchases.find(p => p.id === pid) || MockData.purchases[0];
    initApp('purchases',[{label:'Inventory',href:'#'},{label:'Purchases',href:'purchases'},{label:po.id}],po.id);

    document.getElementById('detailHeader').innerHTML = `
      <div class="detail-header-left">
        <div class="detail-header-icon"><i class="bi bi-cart"></i></div>
        <div class="detail-header-info">
          <h2>${po.id} ${statusBadge(po.status)}</h2>
          <div class="detail-meta">
            <span class="detail-meta-item"><i class="bi bi-shop"></i>${po.vendor}</span>
            <span class="detail-meta-item"><i class="bi bi-calendar"></i>${formatDate(po.poDate)}</span>
          </div>
        </div>
      </div>
      <div class="detail-header-actions">
        ${po.status==='Ordered'?'<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#receiveModal"><i class="bi bi-box-seam me-1"></i>Receive Items</button>':''}
        <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-printer me-1"></i>Print PO</button>
      </div>`;

    document.getElementById('detailBody').innerHTML = `
      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <h6 class="fw-600 mb-3">Purchase Order Details</h6>
          <div class="info-grid">
            <div class="info-item"><span class="info-label">PO Number</span><span class="info-value text-mono">${po.id}</span></div>
            <div class="info-item"><span class="info-label">Vendor</span><span class="info-value">${po.vendor}</span></div>
            <div class="info-item"><span class="info-label">PO Date</span><span class="info-value">${formatDate(po.poDate)}</span></div>
            <div class="info-item"><span class="info-label">Expected Date</span><span class="info-value">${formatDate(po.expectedDate)}</span></div>
            <div class="info-item"><span class="info-label">Status</span><span class="info-value">${statusBadge(po.status)}</span></div>
            <div class="info-item"><span class="info-label">Created By</span><span class="info-value">${po.createdBy}</span></div>
            <div class="info-item"><span class="info-label">Total Amount</span><span class="info-value fw-600">${formatRupiah(po.totalAmount)}</span></div>
          </div>
        </div>
      </div>
      <h6 class="fw-600 mb-3">Order Items</h6>
      <div class="er-table-wrapper mb-4"><table class="er-table"><thead><tr><th>Equipment</th><th>Qty Ordered</th><th>Qty Received</th><th>Unit Price</th><th>Subtotal</th></tr></thead><tbody>
      ${po.items.map(i=>`<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.received}</td><td>${formatRupiah(i.price)}</td><td class="fw-600">${formatRupiah(i.qty*i.price)}</td></tr>`).join('')}
      </tbody></table></div>
      <h6 class="fw-600 mb-3"><i class="bi bi-clock-history me-2"></i>Activity Timeline</h6>
      ${renderActivityTimeline([
        {time:'09:00', date:po.poDate, action:`Purchase Order ${po.id} created`, user:po.createdBy, type:'info'},
        {time:'10:30', date:po.poDate, action:'Purchase Order approved by Manager', user:'Manager', type:'success'},
        {time:'14:00', date:po.poDate, action:'Purchase Order sent to vendor', user:'Admin', type:'info'},
        ...(po.status==='Received'?[{time:'10:00', date:po.expectedDate, action:'All items received and stored in branch', user:'Warehouse Staff', type:'success'}]:[])
      ])}`;

    document.getElementById('recvItems').innerHTML = `<table class="table table-sm fs-13"><thead><tr><th>Item</th><th>Ordered</th><th>Receive Qty</th></tr></thead><tbody>
      ${po.items.map(i=>`<tr><td>${i.name}</td><td>${i.qty}</td><td><input type="number" class="form-control form-control-sm" value="${i.qty - i.received}" max="${i.qty - i.received}"></td></tr>`).join('')}
      </tbody></table>`;

    function receiveItems() {
      const branchName = document.getElementById('recvBranch').value;
      const inputs = document.querySelectorAll('#recvItems input[type="number"]');
      const receivedItems = [];
      
      po.items.forEach((item, index) => {
        const recvQty = Number(inputs[index].value) || 0;
        if(recvQty > 0) {
          receivedItems.push({
            name: item.name,
            qty: recvQty
          });
        }
      });
      
      if(receivedItems.length === 0) {
        showToast('Please enter quantity to receive', 'danger');
        return;
      }
      
      const res = BizLogic.Purchase.createGoodsReceipt(po.id, receivedItems, { branch: branchName });
      
      if (res.success) {
        bootstrap.Modal.getInstance(document.getElementById('receiveModal')).hide();
        showToast('Goods Receipt created successfully', 'success');
        setTimeout(() => window.location.href = 'goods-receipt-detail?id=' + res.goodsReceipt.id, 800);
      } else {
        showToast(res.error, 'danger');
      }
    }
</script>
@endpush
