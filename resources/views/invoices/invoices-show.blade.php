@extends('layouts.app')

@section('title', 'Invoice Detail — EquipRent Enterprise')

@section('content')
<div class="d-flex justify-content-end gap-2 mb-3 no-print">
          <button class="btn btn-outline-secondary btn-sm" onclick="window.print()"><i class="bi bi-printer me-1"></i>Print</button>
          <button class="btn btn-outline-secondary btn-sm" onclick="showToast('PDF downloaded','success')"><i class="bi bi-file-pdf me-1"></i>Download PDF</button>
          <span id="markPaidBtn"></span>
        </div>
        <div class="invoice-paper" id="invoiceContent"></div>
@endsection

@push('scripts')
<script>
const invId = getUrlParam('id') || 'INV-001';
    const inv = MockData.invoices.find(i => i.id === invId) || MockData.invoices[0];
    initApp('invoices',[{label:'Billing',href:'#'},{label:'Invoices',href:'invoices'},{label:inv.id}],inv.id);

    // Populate account select
    const accSel = document.getElementById('payAccount');
    if (!MockData.companyBanks) {
      MockData.companyBanks = [
        { id: 'BA-001', name: 'BCA Perusahaan', accountNumber: '1234567890' },
        { id: 'BA-002', name: 'Mandiri Perusahaan', accountNumber: '0987654321' }
      ];
    }
    MockData.companyBanks.forEach(a => { accSel.innerHTML += `<option value="${a.id}">${a.name} — ${a.accountNumber}</option>`; });

    const company = MockData.company;
    const customer = MockData.customers.find(c => c.id === inv.customerId);
    
    // Fallback amount logic based on original design
    const tax = Math.round(inv.amount * 0.11);
    const grandTotal = (inv.totalAmount || inv.amount + tax);
    const totalPaid = inv.paidAmount || 0;
    const remainingBalance = grandTotal - totalPaid;

    // Set default payment amount to remaining balance
    document.getElementById('payAmount').value = remainingBalance;

    // Mark as paid button
    if (remainingBalance > 0 && inv.status !== 'Paid') {
      document.getElementById('markPaidBtn').innerHTML = `<button class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#paidModal"><i class="bi bi-cash me-1"></i>Record Payment</button>`;
    }

    document.getElementById('invoiceContent').innerHTML = `
      <div class="invoice-header">
        <div class="invoice-company">
          <h3><i class="bi bi-gear-wide-connected me-2"></i>${company.name}</h3>
          <p>${company.address}</p>
          <p>Tel: ${company.phone} | Email: ${company.email}</p>
          <p>Tax ID: ${company.taxId}</p>
        </div>
        <div class="invoice-title-section">
          <h2>INVOICE</h2>
          <p class="text-mono" style="font-size:18px;font-weight:600">${inv.id}</p>
          <p>${statusBadge(inv.status)}</p>
        </div>
      </div>

      <div class="invoice-info-grid">
        <div>
          <h6 class="fw-600 mb-2">Bill To</h6>
          <p class="fw-600 mb-1">${inv.customerName}</p>
          <p class="text-muted fs-12 mb-1">${customer?.address || '-'}</p>
          <p class="text-muted fs-12 mb-1">${customer?.phone || '-'}</p>
          <p class="text-muted fs-12">${customer?.email || '-'}</p>
        </div>
        <div>
          <table class="w-100 fs-13">
            <tr><td class="text-muted py-1">Invoice Number</td><td class="text-end py-1 fw-600 text-mono">${inv.id}</td></tr>
            <tr><td class="text-muted py-1">Invoice Type</td><td class="text-end py-1">${inv.type}</td></tr>
            <tr><td class="text-muted py-1">Invoice Date</td><td class="text-end py-1">${formatDate(inv.invoiceDate)}</td></tr>
            <tr><td class="text-muted py-1">Due Date</td><td class="text-end py-1">${formatDate(inv.dueDate)}</td></tr>
            <tr><td class="text-muted py-1">Project</td><td class="text-end py-1">${inv.projectName}</td></tr>
            <tr><td class="text-muted py-1">Reference</td><td class="text-end py-1 text-mono">${inv.reference}</td></tr>
            <tr><td class="text-muted py-1">Payment Account</td><td class="text-end py-1">${inv.accountName}</td></tr>
            ${inv.paidDate ? `<tr><td class="text-muted py-1">Paid Date</td><td class="text-end py-1">${formatDate(inv.paidDate)}</td></tr>` : ''}
          </table>
        </div>
      </div>

      <table class="w-100 invoice-items-table mb-0">
        <thead><tr><th style="width:50%">Description</th><th class="text-center">Qty</th><th class="text-end">Unit Price</th><th class="text-end">Amount</th></tr></thead>
        <tbody>
        ${inv.items.map(item => `<tr>
          <td>${item.desc}</td>
          <td class="text-center">${item.qty}</td>
          <td class="text-end">${formatRupiah(Math.abs(item.price))}</td>
          <td class="text-end ${item.price<0?'text-danger':''}">${item.price<0?'(':''}${formatRupiah(Math.abs(item.price))}${item.price<0?')':''}</td>
        </tr>`).join('')}
        </tbody>
      </table>

      <div class="invoice-summary mt-4">
        <table style="width: 100%; max-width: 300px; margin-left: auto;">
          <tr><td class="text-muted pb-1">Total Due</td><td class="text-end fw-600">${formatRupiah(grandTotal)}</td></tr>
          <tr><td class="text-muted pb-1 border-bottom">Amount Paid</td><td class="text-end text-success border-bottom pb-1">- ${formatRupiah(totalPaid)}</td></tr>
          <tr class="total-row"><td class="pt-2">Balance Due</td><td class="text-end pt-2" style="color:var(--primary)">${formatRupiah(remainingBalance)}</td></tr>
        </table>
      </div>

      <div class="mt-4 pt-3 border-top">
        <div class="row">
          <div class="col-md-6">
            <h6 class="fw-600 fs-12">Payment Information</h6>
            <p class="fs-12 text-muted mb-1">Bank: ${MockData.companyBanks[0].name}</p>
            <p class="fs-12 text-muted mb-1">Account: ${MockData.companyBanks[0].accountNumber}</p>
            <p class="fs-12 text-muted">Holder: ${company.name}</p>
          </div>
          <div class="col-md-6 text-end">
            <p class="fs-12 text-muted mt-4">Authorized Signature</p>
            <div class="mt-4 pt-3 border-top d-inline-block" style="width:200px">
              <p class="fs-12 fw-600 mb-0">${company.name}</p>
            </div>
          </div>
        </div>
      </div>`;

    function markAsPaid() {
      const amt = document.getElementById('payAmount').value;
      const bankId = document.getElementById('payAccount').value;
      const notes = document.getElementById('payNotes').value;
      
      const res = BizLogic.Invoice.recordPayment(inv.id, amt, 'Transfer', bankId, notes);
      
      if(res.success) {
        bootstrap.Modal.getInstance(document.getElementById('paidModal')).hide();
        showToast('Payment recorded successfully', 'success');
        setTimeout(() => location.reload(), 800);
      } else {
        showToast(res.error, 'danger');
      }
    }
</script>
@endpush
