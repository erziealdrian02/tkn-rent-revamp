@extends('layouts.app')

@section('title', 'Stock Transfer — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Stock Transfer</h2><p class="page-header-subtitle">Move equipment between warehouse branches</p></div>
        </div>
        
        <div class="row g-4">
          <div class="col-md-6">
            <div class="er-card h-100">
              <div class="er-card-header"><h5 class="er-card-title">New Transfer</h5></div>
              <div class="er-card-body">
                <div class="mb-3">
                  <label class="form-label form-label-er">Equipment</label>
                  <select class="form-select" id="tfEquip" onchange="updateAvailability()"></select>
                </div>
                <div class="row g-3 mb-3">
                  <div class="col-6">
                    <label class="form-label form-label-er">Source Branch</label>
                    <select class="form-select" id="tfSource" onchange="updateAvailability()"><option>Jakarta Warehouse</option><option>Bekasi Warehouse</option><option>Surabaya Warehouse</option></select>
                  </div>
                  <div class="col-6">
                    <label class="form-label form-label-er">Destination Branch</label>
                    <select class="form-select" id="tfDest"><option>Bekasi Warehouse</option><option>Jakarta Warehouse</option><option>Surabaya Warehouse</option></select>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="d-flex justify-content-between">
                      <label class="form-label form-label-er">Quantity to Transfer</label>
                      <span class="fs-12 text-muted">Available in Source: <strong id="availQty" class="text-primary">0</strong></span>
                  </div>
                  <input type="number" class="form-control" id="tfQty" value="1" min="1">
                </div>
                <div class="mb-4">
                  <label class="form-label form-label-er">Notes / Reason</label>
                  <textarea class="form-control" id="tfNotes" rows="2" placeholder="e.g., Inventory rebalancing..."></textarea>
                </div>
                <button class="btn btn-primary w-100" onclick="submitTransfer()"><i class="bi bi-arrow-left-right me-1"></i>Execute Transfer</button>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="er-card h-100">
              <div class="er-card-header"><h5 class="er-card-title">Recent Transfers</h5></div>
              <div class="er-card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle fs-13 mb-0" id="recentTable">
                        <thead class="table-light"><tr><th>ID</th><th>Equipment</th><th>From → To</th><th>Qty</th></tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>
@endsection

@push('scripts')
<script>
initApp('stock-transfer',[{label:'Inventory',href:'#'},{label:'Stock Transfer'}],'Stock Transfer');
    
    // Populate equipment dropdown
    const uniqueEquip = [...new Set(MockData.stock.map(s => s.equipment))];
    const equipSel = document.getElementById('tfEquip');
    uniqueEquip.forEach(eq => { equipSel.innerHTML += `<option value="${eq}">${eq}</option>`; });

    function updateAvailability() {
        const eq = document.getElementById('tfEquip').value;
        const src = document.getElementById('tfSource').value;
        const st = MockData.stock.find(s => s.equipment === eq && s.branch === src);
        const avail = st ? st.available : 0;
        document.getElementById('availQty').innerText = avail;
        document.getElementById('tfQty').max = avail;
    }
    updateAvailability();

    function loadRecent() {
        // filter movements by type 'Transfer Out'
        const trfs = MockData.movements.filter(m => m.type === 'Transfer Out').reverse().slice(0, 5);
        document.getElementById('recentTable').querySelector('tbody').innerHTML = trfs.map(t => `
            <tr>
                <td class="text-mono text-muted">${t.reference}</td>
                <td class="fw-500">${t.equipment}</td>
                <td><span class="badge bg-light text-dark border">${t.location}</span> <i class="bi bi-arrow-right text-muted"></i> <span class="badge bg-light text-dark border">${t.destination}</span></td>
                <td class="fw-600 text-end">${t.quantity}</td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="text-center text-muted py-4">No recent transfers</td></tr>';
    }
    loadRecent();

    function submitTransfer() {
        const eq = document.getElementById('tfEquip').value;
        const src = document.getElementById('tfSource').value;
        const dest = document.getElementById('tfDest').value;
        const qty = document.getElementById('tfQty').value;
        const notes = document.getElementById('tfNotes').value;

        const res = BizLogic.StockTransfer.create(src, dest, eq, qty, notes);
        if(res.success) {
            showToast('Stock transferred successfully!', 'success');
            updateAvailability();
            loadRecent();
        } else {
            showToast(res.error, 'danger');
        }
    }
</script>
@endpush
