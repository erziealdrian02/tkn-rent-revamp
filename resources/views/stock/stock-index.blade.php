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
          <tbody>
            @forelse($stocks as $stock)
            <tr>
              <td class="fw-600">{{ $stock->equipment->name ?? '-' }}</td>
              <td>{{ $stock->branch->name ?? '-' }}</td>
              <td class="fw-600">{{ $stock->total_qty }}</td>
              <td><span class="badge-status available">{{ $stock->available_qty }}</span></td>
              <td>{{ $stock->reserved_qty }}</td>
              <td><span class="badge-status on-rental">{{ $stock->on_rental_qty }}</span></td>
              <td>{!! $stock->damaged_qty ? '<span class="badge-status damaged">'.$stock->damaged_qty.'</span>' : 0 !!}</td>
              <td>{{ $stock->maintenance_qty }}</td>
              <td>{!! $stock->lost_qty ? '<span class="badge-status lost">'.$stock->lost_qty.'</span>' : 0 !!}</td>
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
</script>
@endpush
