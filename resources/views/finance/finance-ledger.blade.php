@extends('layouts.app')

@section('title', 'Bank & Cash Ledger — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Bank & Cash Ledger</h2><p class="page-header-subtitle">Company general ledger and transaction history (Buku Besar Kas & Bank)</p></div>
        </div>
        
        <div class="row g-4 mb-4" id="bankCards"></div>

        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <select class="filter-select" id="accountFilter" onchange="filterData()">
                <option value="">All Bank Accounts</option>
              </select>
              <select class="filter-select" id="typeFilter" onchange="filterData()">
                <option value="">All Transactions</option>
                <option value="IN">Money In (Debit)</option>
                <option value="OUT">Money Out (Credit)</option>
              </select>
              <input type="month" class="filter-select" id="monthFilter" onchange="filterData()">
            </div>
            <div class="table-toolbar-right">
              <button class="btn btn-primary"><i class="bi bi-file-earmark-excel me-1"></i>Export Ledger</button>
            </div>
          </div>
          <div class="er-table-wrapper">
            <table class="er-table">
              <thead><tr><th>Date</th><th>Trx ID</th><th>Account</th><th>Reference</th><th>Description</th><th>Type</th><th>Amount</th><th>Running Balance</th></tr></thead>
              <tbody id="tableBody"></tbody>
            </table>
          </div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('finance-ledger',[{label:'Finance',href:'#'},{label:'Ledger'}],'Ledger');
    
    if (!MockData.companyBanks) {
      MockData.companyBanks = [
        { id: 'BA-001', name: 'BCA Perusahaan', accountNumber: '1234567890', openingBalance: 500000000 },
        { id: 'BA-002', name: 'Mandiri Perusahaan', accountNumber: '0987654321', openingBalance: 250000000 }
      ];
    }
    if (!MockData.ledger) MockData.ledger = [];

    // Populate Account Filter
    const accFilter = document.getElementById('accountFilter');
    MockData.companyBanks.forEach(b => { accFilter.innerHTML += `<option value="${b.id}">${b.name} (${b.accountNumber})</option>`; });

    function renderBankCards() {
        let html = '';
        MockData.companyBanks.forEach(bank => {
            // Calculate current balance based on ledger
            let balance = bank.openingBalance;
            MockData.ledger.forEach(l => {
                if(l.bankAccountId === bank.id) {
                    if(l.type === 'IN') balance += l.amount;
                    if(l.type === 'OUT') balance -= l.amount;
                }
            });
            
            html += `
            <div class="col-md-6">
                <div class="er-card" style="background: linear-gradient(135deg, var(--card-bg) 0%, rgba(37, 99, 235, 0.05) 100%);">
                    <div class="er-card-body p-4">
                        <div class="d-flex justify-content-between mb-3">
                            <div>
                                <h6 class="text-muted mb-1 fs-13">Bank Account</h6>
                                <h5 class="fw-700 mb-0">${bank.name}</h5>
                            </div>
                            <div class="fs-4" style="color:var(--primary)"><i class="bi bi-bank"></i></div>
                        </div>
                        <p class="text-mono text-muted mb-3">${bank.accountNumber}</p>
                        <h3 class="fw-700 mb-0">${formatRupiah(balance)}</h3>
                    </div>
                </div>
            </div>`;
        });
        document.getElementById('bankCards').innerHTML = html;
    }

    function filterData(){
      const a=document.getElementById('accountFilter').value;
      const t=document.getElementById('typeFilter').value;
      const m=document.getElementById('monthFilter').value; // format: YYYY-MM
      
      let runningBalances = {};
      MockData.companyBanks.forEach(b => runningBalances[b.id] = b.openingBalance);

      // We need to calculate running balance sequentially from oldest to newest
      // MockData.ledger is assumed to be ordered chronologically
      const ledgerWithBalance = MockData.ledger.map(trx => {
          if(trx.type === 'IN') runningBalances[trx.bankAccountId] += trx.amount;
          if(trx.type === 'OUT') runningBalances[trx.bankAccountId] -= trx.amount;
          return { ...trx, balance: runningBalances[trx.bankAccountId] };
      });

      // Now filter for display (reverse so newest is on top)
      const data = ledgerWithBalance.filter(r=>{
        if(a&&r.bankAccountId!==a)return false;
        if(t&&r.type!==t)return false;
        if(m&&!r.date.startsWith(m))return false; // date is YYYY-MM-DD, startsWith works perfectly for YYYY-MM
        return true;
      }).reverse();

      document.getElementById('tableBody').innerHTML=data.map(r=>`<tr>
        <td>${formatDate(r.date)}</td>
        <td class="text-mono">${r.id}</td>
        <td>${MockData.companyBanks.find(b=>b.id===r.bankAccountId)?.name || r.bankAccountId}</td>
        <td>${r.reference.startsWith('INV-')?`<a href="invoice-detail?id=${r.reference}">${r.reference}</a>`:r.reference}</td>
        <td>${r.description}</td>
        <td>${r.type === 'IN' ? '<span class="badge bg-success-subtle text-success">IN</span>' : '<span class="badge bg-danger-subtle text-danger">OUT</span>'}</td>
        <td class="${r.type==='IN'?'text-success fw-600':''}">${r.type==='OUT'?'- ':''}${formatRupiah(r.amount)}</td>
        <td class="fw-600">${formatRupiah(r.balance)}</td>
      </tr>`).join('')||'<tr><td colspan="8" class="text-center text-muted py-4">No transactions found</td></tr>';
    }
    
    renderBankCards();
    filterData();
</script>
@endpush
