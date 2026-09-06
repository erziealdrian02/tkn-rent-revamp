@extends('layouts.app')

@section('title', 'Driver Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
          <div class="detail-header" id="detailHeader"></div>
          <div class="er-tabs" id="detailTabs"></div>
          <div id="tabContents"></div>
        </div>
@endsection

@push('scripts')
<script>
const drvId = getUrlParam('id') || 'DRV-001';
    const drv = MockData.drivers.find(d => d.id === drvId) || MockData.drivers[0];
    initApp('drivers',[{label:'Master Data',href:'#'},{label:'Drivers',href:'drivers'},{label:drv.name}],drv.name);

    const drvDeliveries = MockData.deliveries.filter(d => d.driverId === drv.id);

    document.getElementById('detailHeader').innerHTML = `
      <div class="detail-header-left">
        <div class="detail-header-icon"><i class="bi bi-person-badge"></i></div>
        <div class="detail-header-info">
          <h2>${drv.name} ${statusBadge(drv.status)}</h2>
          <div class="detail-meta">
            <span class="detail-meta-item"><i class="bi bi-hash"></i>${drv.id}</span>
            <span class="detail-meta-item"><i class="bi bi-phone"></i>${drv.phone}</span>
          </div>
        </div>
      </div>`;

    const tabs = ['Personal','Deliveries','Performance'];
    document.getElementById('detailTabs').innerHTML = tabs.map((t,i) => `<button class="er-tab ${i===0?'active':''}" data-tab="${t.toLowerCase()}" onclick="switchTab('${t.toLowerCase()}')">${t}${t==='Deliveries'?`<span class="er-tab-count">${drvDeliveries.length}</span>`:''}</button>`).join('');

    let tc = '';
    tc += `<div class="er-tab-content active" id="tab-personal">
      <div class="info-grid">
        <div class="info-item"><span class="info-label">Driver ID</span><span class="info-value">${drv.id}</span></div>
        <div class="info-item"><span class="info-label">Full Name</span><span class="info-value">${drv.name}</span></div>
        <div class="info-item"><span class="info-label">Phone</span><span class="info-value">${drv.phone}</span></div>
        <div class="info-item"><span class="info-label">License Number</span><span class="info-value">${drv.licenseNumber}</span></div>
        <div class="info-item"><span class="info-label">License Expiry</span><span class="info-value">${formatDate(drv.licenseExpiry)}</span></div>
        <div class="info-item"><span class="info-label">Status</span><span class="info-value">${statusBadge(drv.status)}</span></div>
        <div class="info-item"><span class="info-label">Current Delivery</span><span class="info-value">${drv.currentDelivery?`<a href="delivery-detail?id=${drv.currentDelivery}">${drv.currentDelivery}</a>`:'-'}</span></div>
      </div>
    </div>`;

    tc += `<div class="er-tab-content" id="tab-deliveries">
      <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Delivery #</th><th>Customer</th><th>Project</th><th>Date</th><th>Status</th></tr></thead><tbody>
      ${drvDeliveries.map(d=>`<tr><td><a href="delivery-detail?id=${d.id}" class="cell-link text-mono">${d.id}</a></td><td>${d.customerName}</td><td>${d.projectName}</td><td>${formatDate(d.deliveryDate)}</td><td>${statusBadge(d.status)}</td></tr>`).join('')}
      </tbody></table></div>
    </div>`;

    tc += `<div class="er-tab-content" id="tab-performance">
      <div class="row g-3">
        <div class="col-md-3"><div class="kpi-card"><div class="kpi-icon blue"><i class="bi bi-truck"></i></div><div class="kpi-content"><div class="kpi-value">${drvDeliveries.length}</div><div class="kpi-label">Total Deliveries</div></div></div></div>
        <div class="col-md-3"><div class="kpi-card"><div class="kpi-icon green"><i class="bi bi-check-circle"></i></div><div class="kpi-content"><div class="kpi-value">${drvDeliveries.filter(d=>d.status==='Completed').length}</div><div class="kpi-label">Completed</div></div></div></div>
        <div class="col-md-3"><div class="kpi-card"><div class="kpi-icon orange"><i class="bi bi-clock"></i></div><div class="kpi-content"><div class="kpi-value">${drvDeliveries.filter(d=>d.status!=='Completed').length}</div><div class="kpi-label">In Progress</div></div></div></div>
        <div class="col-md-3"><div class="kpi-card"><div class="kpi-icon purple"><i class="bi bi-star"></i></div><div class="kpi-content"><div class="kpi-value">4.8</div><div class="kpi-label">Rating</div></div></div></div>
      </div>
    </div>`;

    document.getElementById('tabContents').innerHTML = tc;
</script>
@endpush
