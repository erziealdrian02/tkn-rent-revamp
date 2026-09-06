@extends('layouts.app')

@section('title', 'Goods Receipts — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Goods Receipts</h2><p class="page-header-subtitle">Record of equipment received into warehouses</p></div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search GR..." id="searchInput" oninput="filterData()"></div>
            </div>
          </div>
          <div class="er-table-wrapper">
            <table class="er-table">
              <thead><tr><th>Receipt #</th><th>Purchase Order</th><th>Vendor</th><th>Branch</th><th>Date</th><th>Received By</th><th>Actions</th></tr></thead>
              <tbody id="tableBody"></tbody>
            </table>
          </div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('goods-receipts',[{label:'Inventory',href:'#'},{label:'Goods Receipts'}],'Goods Receipts');
    function filterData(){
      const q=document.getElementById('searchInput').value.toLowerCase();
      const data=(MockData.goodsReceipts||[]).filter(r=>{
        if(q&&!r.id.toLowerCase().includes(q)&&!r.vendor.toLowerCase().includes(q)&&!r.purchaseId.toLowerCase().includes(q))return false;
        return true;
      });
      document.getElementById('tableBody').innerHTML=data.map(r=>`<tr>
        <td><a href="goods-receipt-detail?id=${r.id}" class="cell-link text-mono">${r.id}</a></td>
        <td><a href="purchase-detail?id=${r.purchaseId}">${r.purchaseId}</a></td>
        <td class="fw-500">${r.vendor}</td>
        <td>${r.branch}</td>
        <td>${formatDate(r.receiptDate)}</td>
        <td>${r.receivedBy}</td>
        <td><a href="goods-receipt-detail?id=${r.id}" class="btn-action"><i class="bi bi-eye"></i></a></td>
      </tr>`).join('')||'<tr><td colspan="7" class="text-center text-muted py-4">No goods receipts found</td></tr>';
    }
    filterData();
</script>
@endpush
