@extends('layouts.app')

@section('title', 'Vehicle Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
          <div class="detail-header" id="detailHeader"></div>
          <div class="er-tabs" id="detailTabs"></div>
          <div id="tabContents"></div>
        </div>
@endsection

@push('scripts')
<script>
const vid = getUrlParam('id') || 'VEH-001';
    const veh = MockData.vehicles.find(v => v.id === vid) || MockData.vehicles[0];
    initApp('vehicles',[{label:'Master Data',href:'#'},{label:'Vehicles',href:'vehicles'},{label:veh.plate}],veh.plate);

    const deliveries = MockData.deliveries.filter(d => d.vehiclePlate === veh.plate);

    document.getElementById('detailHeader').innerHTML = `
      <div class="detail-header-left">
        <div class="detail-header-icon"><i class="bi bi-truck-front"></i></div>
        <div class="detail-header-info">
          <h2>${veh.plate} ${statusBadge(veh.status)}</h2>
          <div class="detail-meta">
            <span class="detail-meta-item"><i class="bi bi-hash"></i>${veh.id}</span>
            <span class="detail-meta-item"><i class="bi bi-tag"></i>${veh.type}</span>
            <span class="detail-meta-item"><i class="bi bi-info-circle"></i>${veh.brand}</span>
          </div>
        </div>
      </div>
      <div class="detail-header-actions">
        <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-pencil me-1"></i>Edit Data</button>
      </div>`;

    const tabs = ['General','Deliveries','Maintenance'];
    document.getElementById('detailTabs').innerHTML = tabs.map((t,i) => `<button class="er-tab ${i===0?'active':''}" data-tab="${t.toLowerCase()}" onclick="switchTab('${t.toLowerCase()}')">${t}${t==='Deliveries'?`<span class="er-tab-count">${deliveries.length}</span>`:''}</button>`).join('');

    let tc = '';
    tc += `<div class="er-tab-content active" id="tab-general">
      <div class="info-grid">
        <div class="info-item"><span class="info-label">Vehicle ID</span><span class="info-value text-mono">${veh.id}</span></div>
        <div class="info-item"><span class="info-label">License Plate</span><span class="info-value fw-600">${veh.plate}</span></div>
        <div class="info-item"><span class="info-label">Type</span><span class="info-value">${veh.type}</span></div>
        <div class="info-item"><span class="info-label">Brand</span><span class="info-value">${veh.brand}</span></div>
        <div class="info-item"><span class="info-label">Capacity (Ton)</span><span class="info-value">${veh.capacity} Ton</span></div>
        <div class="info-item"><span class="info-label">Tax Expiry Date</span><span class="info-value">${formatDate(veh.taxExpiry)}</span></div>
        <div class="info-item"><span class="info-label">Status</span><span class="info-value">${statusBadge(veh.status)}</span></div>
      </div>
    </div>`;

    tc += `<div class="er-tab-content" id="tab-deliveries">
      <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Delivery #</th><th>Date</th><th>Driver</th><th>Destination</th><th>Status</th></tr></thead><tbody>
      ${deliveries.map(d=>`<tr><td><a href="delivery-detail?id=${d.id}" class="cell-link text-mono">${d.id}</a></td><td>${formatDate(d.deliveryDate)}</td><td>${d.driverName}</td><td>${d.destination}</td><td>${statusBadge(d.status)}</td></tr>`).join('')||'<tr><td colspan="5" class="text-center text-muted py-4">No deliveries</td></tr>'}
      </tbody></table></div>
    </div>`;

    tc += `<div class="er-tab-content" id="tab-maintenance"><div class="empty-state"><i class="bi bi-wrench"></i><h5>No Maintenance Records</h5><p>This vehicle has no maintenance history.</p></div></div>`;

    document.getElementById('tabContents').innerHTML = tc;
</script>
@endpush
