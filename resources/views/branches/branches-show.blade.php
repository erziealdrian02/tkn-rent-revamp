@extends('layouts.app')

@section('title', 'Branch Detail — EquipRent Enterprise')

@section('content')
<div class="er-card">
          <div class="detail-header" id="detailHeader"></div>
          <div class="er-tabs" id="detailTabs"></div>
          <div id="tabContents"></div>
        </div>
@endsection

@push('scripts')
<script>
const bid = getUrlParam('id') || 'BR-001';
    const branch = MockData.branches.find(b => b.id === bid) || MockData.branches[0];
    initApp('branches',[{label:'Inventory',href:'#'},{label:'Branches',href:'branches'},{label:branch.name}],branch.name);

    const branchName = branch.name.replace(' Warehouse','');
    const branchStock = MockData.stock.filter(s => s.branch === branchName || s.branch === branch.name);
    const branchEquip = MockData.equipment.filter(e => e.branchId === branch.id);
    const branchMov = MockData.movements.filter(m => m.from.includes(branchName) || m.to.includes(branchName));

    document.getElementById('detailHeader').innerHTML = `
      <div class="detail-header-left">
        <div class="detail-header-icon"><i class="bi bi-building"></i></div>
        <div class="detail-header-info">
          <h2>${branch.name} ${statusBadge(branch.status)}</h2>
          <div class="detail-meta">
            <span class="detail-meta-item"><i class="bi bi-hash"></i>${branch.code}</span>
            <span class="detail-meta-item"><i class="bi bi-geo-alt"></i>${branch.address}</span>
          </div>
        </div>
      </div>`;

    const tabs = ['Overview','Stock','Equipment','Movements','Rental Activity'];
    document.getElementById('detailTabs').innerHTML = tabs.map((t,i) =>
      `<button class="er-tab ${i===0?'active':''}" data-tab="${t.toLowerCase().replace(/\s/g,'-')}" onclick="switchTab('${t.toLowerCase().replace(/\s/g,'-')}')">${t}</button>`
    ).join('');

    let tc = '';
    tc += `<div class="er-tab-content active" id="tab-overview">
      <div class="row g-3 mb-4">
        <div class="col-md-3"><div class="kpi-card"><div class="kpi-icon blue"><i class="bi bi-boxes"></i></div><div class="kpi-content"><div class="kpi-value">${branch.totalEquipment}</div><div class="kpi-label">Total Equipment</div></div></div></div>
        <div class="col-md-3"><div class="kpi-card"><div class="kpi-icon green"><i class="bi bi-check-circle"></i></div><div class="kpi-content"><div class="kpi-value">${branch.available}</div><div class="kpi-label">Available</div></div></div></div>
        <div class="col-md-3"><div class="kpi-card"><div class="kpi-icon purple"><i class="bi bi-arrow-right-circle"></i></div><div class="kpi-content"><div class="kpi-value">${branch.onRental}</div><div class="kpi-label">On Rental</div></div></div></div>
        <div class="col-md-3"><div class="kpi-card"><div class="kpi-icon orange"><i class="bi bi-archive"></i></div><div class="kpi-content"><div class="kpi-value">${branch.capacity}</div><div class="kpi-label">Capacity</div></div></div></div>
      </div>
      <div class="info-grid">
        <div class="info-item"><span class="info-label">Branch Code</span><span class="info-value">${branch.code}</span></div>
        <div class="info-item"><span class="info-label">Address</span><span class="info-value">${branch.address}</span></div>
        <div class="info-item"><span class="info-label">Status</span><span class="info-value">${statusBadge(branch.status)}</span></div>
      </div>
    </div>`;

    tc += `<div class="er-tab-content" id="tab-stock">
      <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Equipment</th><th>Total</th><th>Available</th><th>Reserved</th><th>On Rental</th><th>Damaged</th><th>Maintenance</th><th>Lost</th></tr></thead><tbody>
      ${branchStock.map(s=>`<tr><td>${s.equipment}</td><td class="fw-600">${s.total}</td><td><span class="badge-status available">${s.available}</span></td><td>${s.reserved}</td><td><span class="badge-status on-rental">${s.onRental}</span></td><td>${s.damaged||0}</td><td>${s.maintenance||0}</td><td>${s.lost||0}</td></tr>`).join('')}
      </tbody></table></div>
    </div>`;

    tc += `<div class="er-tab-content" id="tab-equipment">
      <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Asset ID</th><th>Name</th><th>Serial</th><th>Status</th><th>Project</th></tr></thead><tbody>
      ${branchEquip.map(e=>`<tr><td class="text-mono"><a href="equipment-detail?id=${e.id}" class="cell-link">${e.id}</a></td><td>${e.name}</td><td class="text-mono fs-12">${e.serial}</td><td>${statusBadge(e.status)}</td><td>${e.project||'-'}</td></tr>`).join('')}
      </tbody></table></div>
    </div>`;

    tc += `<div class="er-tab-content" id="tab-movements">
      <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>ID</th><th>Date</th><th>Equipment</th><th>From</th><th>To</th><th>Type</th></tr></thead><tbody>
      ${branchMov.map(m=>`<tr><td class="text-mono">${m.id}</td><td>${formatDate(m.date)}</td><td>${m.equipment}</td><td>${m.from}</td><td>${m.to}</td><td>${statusBadge(m.type)}</td></tr>`).join('')}
      </tbody></table></div>
    </div>`;

    tc += `<div class="er-tab-content" id="tab-rental-activity">${renderActivityTimeline(MockData.activityLog.slice(0,5))}</div>`;

    document.getElementById('tabContents').innerHTML = tc;
</script>
@endpush
