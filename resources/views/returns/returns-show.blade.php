@extends('layouts.app')

@section('title', 'Return Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
          <div class="detail-header" id="detailHeader"></div>
          <div class="er-card-body" id="detailBody"></div>
        </div>
@endsection

@push('scripts')
<script>
const rid = getUrlParam('id') || 'RET-003';
    const ret = MockData.returns.find(r => r.id === rid) || MockData.returns[2];
    initApp('returns',[{label:'Rental',href:'#'},{label:'Returns',href:'returns'},{label:ret.id}],ret.id);

    const hasMissing = ret.items.some(i => i.lost > 0 || i.missing > 0 || i.damaged > 0);
    const relatedClaims = MockData.claims.filter(c => c.returnId === ret.id);

    document.getElementById('detailHeader').innerHTML = `
      <div class="detail-header-left">
        <div class="detail-header-icon" style="background:var(--warning-bg);color:var(--warning)"><i class="bi bi-box-arrow-in-left"></i></div>
        <div class="detail-header-info">
          <h2>${ret.id} ${statusBadge(ret.status)}</h2>
          <div class="detail-meta">
            <span class="detail-meta-item"><i class="bi bi-file-earmark-text"></i><a href="rental-detail?id=${ret.rentalId}">${ret.rentalId}</a></span>
            <span class="detail-meta-item"><i class="bi bi-folder"></i>${ret.projectName}</span>
            <span class="detail-meta-item"><i class="bi bi-people"></i>${ret.customerName}</span>
            <span class="detail-meta-item"><i class="bi bi-calendar"></i>${formatDate(ret.returnDate)}</span>
          </div>
        </div>
      </div>
      <div class="detail-header-actions">
        ${hasMissing && !relatedClaims.length ? '<button class="btn btn-warning btn-sm" onclick="createClaim()"><i class="bi bi-exclamation-triangle me-1"></i>Create Claim</button>' : ''}
        ${ret.status === 'Inspection' ? '<button class="btn btn-success btn-sm" onclick="completeReturn()"><i class="bi bi-check-lg me-1"></i>Complete Inspection</button>' : ''}
      </div>`;

    let body = '';

    // Return Info
    body += `<div class="info-grid mb-4">
      <div class="info-item"><span class="info-label">Return Number</span><span class="info-value text-mono">${ret.id}</span></div>
      <div class="info-item"><span class="info-label">Rental</span><span class="info-value"><a href="rental-detail?id=${ret.rentalId}">${ret.rentalId}</a></span></div>
      <div class="info-item"><span class="info-label">Project</span><span class="info-value">${ret.projectName}</span></div>
      <div class="info-item"><span class="info-label">Customer</span><span class="info-value">${ret.customerName}</span></div>
      <div class="info-item"><span class="info-label">Return Date</span><span class="info-value">${formatDate(ret.returnDate)}</span></div>
      <div class="info-item"><span class="info-label">Inspected By</span><span class="info-value">${ret.inspectedBy||'Pending'}</span></div>
    </div>`;

    // Equipment Classification Table
    body += `<h6 class="fw-600 mb-3"><i class="bi bi-clipboard-check me-2"></i>Equipment Return Classification</h6>
    <div class="er-table-wrapper mb-4"><table class="er-table">
      <thead><tr>
        <th>Equipment</th><th>Sent</th>
        <th><span class="badge-status good">Good</span></th>
        <th><span class="badge-status damaged">Damaged</span></th>
        <th><span class="badge-status lost">Lost</span></th>
        <th><span class="badge-status missing">Missing</span></th>
        <th>Notes</th>
      </tr></thead>
      <tbody>
      ${ret.items.map((item, idx) => `<tr>
        <td class="fw-600">${item.name}</td>
        <td><strong>${item.sent}</strong></td>
        <td><input type="number" class="form-control form-control-sm" style="width:60px" value="${item.good}" min="0" max="${item.sent}" onchange="validateRow(${idx})"></td>
        <td><input type="number" class="form-control form-control-sm" style="width:60px" value="${item.damaged}" min="0" onchange="validateRow(${idx})"></td>
        <td><input type="number" class="form-control form-control-sm" style="width:60px" value="${item.lost}" min="0" onchange="validateRow(${idx})"></td>
        <td><input type="number" class="form-control form-control-sm" style="width:60px" value="${item.missing}" min="0" onchange="validateRow(${idx})"></td>
        <td><input type="text" class="form-control form-control-sm" value="${item.damageNotes||''}" placeholder="Notes..."></td>
      </tr>`).join('')}
      </tbody>
    </table></div>
    <div id="validationMsg" class="mb-3"></div>`;

    // Related Claims
    if (relatedClaims.length) {
      body += `<h6 class="fw-600 mb-3"><i class="bi bi-exclamation-triangle me-2"></i>Related Claims</h6>
      <div class="er-table-wrapper mb-4"><table class="er-table"><thead><tr><th>Claim #</th><th>Equipment</th><th>Qty</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      ${relatedClaims.map(c=>`<tr><td><a href="claim-detail?id=${c.id}" class="cell-link text-mono">${c.id}</a></td><td>${c.equipment}</td><td>${c.quantity}</td><td class="fw-600">${formatRupiah(c.claimAmount)}</td><td>${statusBadge(c.status)}</td><td><a href="claim-detail?id=${c.id}" class="btn-action"><i class="bi bi-eye"></i></a></td></tr>`).join('')}
      </tbody></table></div>`;
    }

    // Activity
    body += `<h6 class="fw-600 mb-3"><i class="bi bi-clock-history me-2"></i>Activity</h6>`;
    body += renderActivityTimeline([
      {time:'09:00', date:ret.returnDate, action:`Return ${ret.id} created`, user:'Warehouse Staff', type:'info'},
      {time:'09:30', date:ret.returnDate, action:'Equipment inspection started', user:ret.inspectedBy||'Pending', type:'warning'},
      ...(ret.status==='Completed'?[{time:'11:00', date:ret.returnDate, action:'Return completed', user:ret.inspectedBy, type:'success'}]:[]),
    ]);

    document.getElementById('detailBody').innerHTML = body;

    function validateAllRows() {
      let isValid = true;
      const rows = document.querySelectorAll('#detailBody tbody tr');
      for (let idx = 0; idx < rows.length; idx++) {
        const row = rows[idx];
        const inputs = row.querySelectorAll('input[type="number"]');
        const sent = ret.items[idx].sent;
        const total = Array.from(inputs).reduce((s,i) => s + Number(i.value), 0);
        
        if (total !== sent) {
          isValid = false;
        }
      }
      return isValid;
    }

    function validateRow(idx) {
      const row = document.querySelectorAll('#detailBody tbody tr')[idx];
      if (!row) return;
      const inputs = row.querySelectorAll('input[type="number"]');
      const sent = ret.items[idx].sent;
      const total = Array.from(inputs).reduce((s,i) => s + Number(i.value), 0);
      const msg = document.getElementById('validationMsg');
      if (total !== sent) {
        msg.innerHTML = `<div class="alert alert-warning py-2 fs-12"><i class="bi bi-exclamation-triangle me-1"></i><strong>${ret.items[idx].name}</strong>: Total classified (${total}) does not match sent quantity (${sent})</div>`;
      } else {
        msg.innerHTML = '';
      }
    }

    function createClaim() {
      // Find items that need claims
      let claimCreated = false;
      ret.items.forEach((item, idx) => {
        if(item.damaged > 0 || item.lost > 0 || item.missing > 0) {
          const qty = item.damaged + item.lost + item.missing;
          const newClaim = {
            id: MockData.generateId('CLM', 'claims'),
            returnId: ret.id,
            customerId: ret.customerId,
            customerName: ret.customerName,
            equipment: item.name,
            quantity: qty,
            // Mock value, in real app would look up replacement cost
            claimAmount: qty * 1500000, 
            status: 'Draft',
            createdDate: new Date().toISOString().split('T')[0]
          };
          MockData.claims.push(newClaim);
          claimCreated = true;
          BizLogic.Activity.log('Claim ' + newClaim.id + ' created for ' + item.name, 'warning');
        }
      });
      
      if(claimCreated) {
        MockData.save('claims');
        showToast('Claims created from missing/lost/damaged items', 'success');
        setTimeout(() => window.location.href = 'claims', 800);
      } else {
        showToast('No missing/lost/damaged items to claim', 'warning');
      }
    }

    function completeReturn() {
      if (!validateAllRows()) {
        showToast('Cannot complete return: Quantities do not match sent amounts!', 'danger');
        return;
      }
      
      const classifiedItems = [];
      ret.items.forEach((item, idx) => {
        const row = document.querySelectorAll('#detailBody tbody tr')[idx];
        const inputs = row.querySelectorAll('input[type="number"]');
        classifiedItems.push({
          good: Number(inputs[0].value),
          damaged: Number(inputs[1].value),
          lost: Number(inputs[2].value),
          missing: Number(inputs[3].value),
          damageNotes: row.querySelector('input[type="text"]').value
        });
      });
      
      const result = BizLogic.Return.completeInspection(ret.id, classifiedItems);
      if (result.success) {
        showToast('Return inspection completed', 'success');
        setTimeout(() => location.reload(), 800);
      } else {
        showToast(result.error, 'danger');
      }
    }
</script>
@endpush
