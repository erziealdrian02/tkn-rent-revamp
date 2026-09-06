@extends('layouts.app')

@section('title', 'Stock — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Stock Monitoring</h2><p class="page-header-subtitle">Equipment stock levels across branches</p></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <select class="filter-select" id="branchFilter" onchange="filterData()"><option value="">All Branches</option><option>Jakarta</option><option>Bekasi</option></select>
            <select class="filter-select" id="equipFilter" onchange="filterData()"><option value="">All Equipment</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Equipment</th><th>Branch</th><th>Total</th><th>Available</th><th>Reserved</th><th>On Rental</th><th>Damaged</th><th>Maintenance</th><th>Lost</th></tr></thead>
          <tbody id="tableBody">
            @forelse($stocks as $stock)
            <tr>
                <td class="fw-600">{{ $stock->equipment->name ?? 'Unknown' }}</td>
                <td>{{ $stock->branch->name ?? 'Unknown' }}</td>
                <td class="fw-600">{{ $stock->total_qty }}</td>
                <td><span class="badge-status available">{{ $stock->available_qty }}</span></td>
                <td>{{ $stock->reserved_qty }}</td>
                <td><span class="badge-status on-rental">{{ $stock->on_rental_qty }}</span></td>
                <td>
                    @if($stock->damaged_qty > 0)
                        <span class="badge-status damaged">{{ $stock->damaged_qty }}</span>
                    @else
                        0
                    @endif
                </td>
                <td>{{ $stock->maintenance_qty }}</td>
                <td>
                    @if($stock->lost_qty > 0)
                        <span class="badge-status lost">{{ $stock->lost_qty }}</span>
                    @else
                        0
                    @endif
                </td>
            </tr>
            @empty
              <tr><td colspan="9" class="text-center text-muted py-4">No stock data available</td></tr>
            @endforelse
          </tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('stock',[{label:'Inventory',href:'#'},{label:'Stock'}],'Stock Monitoring');

function filterData() {
    const b = document.getElementById('branchFilter').value.toLowerCase();
    const e = document.getElementById('equipFilter').value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        if (row.cells.length < 5) return;
        const equip = row.cells[0].innerText.toLowerCase();
        const branch = row.cells[1].innerText.toLowerCase();
        
        const matchBranch = b === '' || branch.includes(b);
        const matchEquip = e === '' || equip.includes(e);
        
        row.style.display = (matchBranch && matchEquip) ? '' : 'none';
    });
}
</script>
@endpush
