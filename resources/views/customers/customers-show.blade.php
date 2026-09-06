@extends('layouts.app')

@section('title', 'Customer Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
          <div class="detail-header" id="detailHeader"></div>
          <div class="er-tabs" id="detailTabs"></div>
          <div id="tabContents"></div>
        </div>
@endsection

@push('scripts')
<script>
const cid = getUrlParam('id') || 'CUST-001';
    const cust = MockData.customers.find(c => c.id === cid) || MockData.customers[0];
    initApp('customers',[{label:'Master Data',href:'#'},{label:'Customers',href:'customers'},{label:cust.name}],cust.name);

    const projects = MockData.projects.filter(p => p.customerId === cust.id);
    const rentals = MockData.rentals.filter(r => r.customerName === cust.name);

    document.getElementById('detailHeader').innerHTML = `
      <div class="detail-header-left">
        <div class="detail-header-icon"><i class="bi bi-building"></i></div>
        <div class="detail-header-info">
          <h2>${cust.name} ${statusBadge(cust.status)}</h2>
          <div class="detail-meta">
            <span class="detail-meta-item"><i class="bi bi-hash"></i>${cust.id}</span>
            <span class="detail-meta-item"><i class="bi bi-person"></i>${cust.pic}</span>
            <span class="detail-meta-item"><i class="bi bi-telephone"></i>${cust.phone}</span>
          </div>
        </div>
      </div>
      <div class="detail-header-actions">
        <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-pencil me-1"></i>Edit Profile</button>
      </div>`;

    const tabs = ['Profile','Projects','Rentals'];
    document.getElementById('detailTabs').innerHTML = tabs.map((t,i) => `<button class="er-tab ${i===0?'active':''}" data-tab="${t.toLowerCase()}" onclick="switchTab('${t.toLowerCase()}')">${t}${t==='Projects'?`<span class="er-tab-count">${projects.length}</span>`:t==='Rentals'?`<span class="er-tab-count">${rentals.length}</span>`:''}</button>`).join('');

    let tc = '';
    tc += `<div class="er-tab-content active" id="tab-profile">
      <div class="info-grid">
        <div class="info-item"><span class="info-label">Customer ID</span><span class="info-value text-mono">${cust.id}</span></div>
        <div class="info-item"><span class="info-label">Company Name</span><span class="info-value fw-600">${cust.name}</span></div>
        <div class="info-item"><span class="info-label">Person In Charge (PIC)</span><span class="info-value">${cust.pic}</span></div>
        <div class="info-item"><span class="info-label">Phone</span><span class="info-value">${cust.phone}</span></div>
        <div class="info-item"><span class="info-label">Email</span><span class="info-value"><a href="mailto:${cust.email}">${cust.email}</a></span></div>
        <div class="info-item"><span class="info-label">Tax ID (NPWP)</span><span class="info-value">${cust.taxId}</span></div>
        <div class="info-item" style="grid-column:1/-1"><span class="info-label">Address</span><span class="info-value">${cust.address}</span></div>
      </div>
    </div>`;

    tc += `<div class="er-tab-content" id="tab-projects">
      <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Project #</th><th>Project Name</th><th>Dates</th><th>Total Rentals</th><th>Status</th></tr></thead><tbody>
      ${projects.map(p=>`<tr><td><a href="project-detail?id=${p.id}" class="cell-link text-mono">${p.id}</a></td><td>${p.name}</td><td>${formatDate(p.startDate)} - ${formatDate(p.endDate)}</td><td>${p.totalRentals}</td><td>${statusBadge(p.status)}</td></tr>`).join('')||'<tr><td colspan="5" class="text-center text-muted py-4">No projects</td></tr>'}
      </tbody></table></div>
    </div>`;

    tc += `<div class="er-tab-content" id="tab-rentals">
      <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Rental #</th><th>Project</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>
      ${rentals.map(r=>`<tr><td><a href="rental-detail?id=${r.id}" class="cell-link text-mono">${r.id}</a></td><td><a href="project-detail?id=${r.projectId}" class="cell-link">${r.projectName}</a></td><td>${formatDate(r.rentalDate)}</td><td class="fw-600">${formatRupiah(r.total)}</td><td>${statusBadge(r.status)}</td></tr>`).join('')||'<tr><td colspan="5" class="text-center text-muted py-4">No rentals</td></tr>'}
      </tbody></table></div>
    </div>`;

    document.getElementById('tabContents').innerHTML = tc;
</script>
@endpush
