@extends('layouts.app')

@section('title', 'Movement Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
          <div class="detail-header" id="detailHeader"></div>
          <div class="er-card-body" id="detailBody"></div>
        </div>
@endsection

@push('scripts')
<script>
const mid = getUrlParam('id') || 'MOV-002';
    const mov = MockData.movements.find(m => m.id === mid) || MockData.movements[1];
    initApp('movements',[{label:'Inventory',href:'#'},{label:'Movements',href:'movements'},{label:mov.id}],mov.id);

    document.getElementById('detailHeader').innerHTML = `
      <div class="detail-header-left">
        <div class="detail-header-icon"><i class="bi bi-arrow-left-right"></i></div>
        <div class="detail-header-info">
          <h2>${mov.id} ${statusBadge(mov.type)}</h2>
          <div class="detail-meta">
            <span class="detail-meta-item"><i class="bi bi-tools"></i>${mov.equipment} (${mov.assetId})</span>
            <span class="detail-meta-item"><i class="bi bi-calendar"></i>${formatDate(mov.date)}</span>
          </div>
        </div>
      </div>`;

    // Get all movements for this asset
    const assetMovements = MockData.movements.filter(m => m.assetId === mov.assetId).sort((a,b) => new Date(a.date) - new Date(b.date));

    document.getElementById('detailBody').innerHTML = `
      <div class="info-grid mb-4">
        <div class="info-item"><span class="info-label">Movement ID</span><span class="info-value text-mono">${mov.id}</span></div>
        <div class="info-item"><span class="info-label">Date</span><span class="info-value">${formatDate(mov.date)}</span></div>
        <div class="info-item"><span class="info-label">Equipment</span><span class="info-value"><a href="equipment-detail?id=${mov.assetId}">${mov.equipment}</a></span></div>
        <div class="info-item"><span class="info-label">Asset ID</span><span class="info-value text-mono">${mov.assetId}</span></div>
        <div class="info-item"><span class="info-label">From</span><span class="info-value">${mov.from}</span></div>
        <div class="info-item"><span class="info-label">To</span><span class="info-value">${mov.to}</span></div>
        <div class="info-item"><span class="info-label">Type</span><span class="info-value">${statusBadge(mov.type)}</span></div>
        <div class="info-item"><span class="info-label">Reference</span><span class="info-value text-mono">${mov.reference}</span></div>
        <div class="info-item"><span class="info-label">User</span><span class="info-value">${mov.user}</span></div>
        <div class="info-item"><span class="info-label">Status</span><span class="info-value">${statusBadge(mov.status)}</span></div>
      </div>

      <h6 class="fw-600 mb-3"><i class="bi bi-clock-history me-2"></i>Asset Timeline — ${mov.assetId}</h6>
      <div class="movement-timeline">
      ${assetMovements.map(m=>`<div class="movement-step">
        <div class="movement-step-dot" ${m.id===mov.id?'style="background:var(--primary);width:16px;height:16px;left:-27px"':''}></div>
        <div class="movement-step-date">${formatDate(m.date)}</div>
        <div class="movement-step-title">${m.id===mov.id?'<strong>':''}${m.type}: ${m.from} → ${m.to}${m.id===mov.id?'</strong> (current)':''}</div>
        <div class="movement-step-desc">Ref: ${m.reference} · ${m.id}</div>
      </div>`).join('')}
      </div>`;
</script>
@endpush
