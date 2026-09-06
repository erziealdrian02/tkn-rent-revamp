@extends('layouts.app')

@section('title', 'Equipment — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Equipment</h2><p class="page-header-subtitle">Manage equipment assets</p></div>
          <div class="page-header-actions">
            <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-upload me-1"></i>Import</button>
            <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-download me-1"></i>Export</button>
            <button class="btn btn-primary btn-sm" onclick="showToast('Add equipment form','info')"><i class="bi bi-plus-lg me-1"></i>Add Equipment</button>
          </div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search equipment..." id="searchInput" oninput="filterData()"></div>
            <select class="filter-select" id="categoryFilter" onchange="filterData()"><option value="">All Categories</option></select>
            <select class="filter-select" id="branchFilter" onchange="filterData()"><option value="">All Branches</option><option>Jakarta</option><option>Bekasi</option></select>
            <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Available</option><option>Reserved</option><option>On Rental</option><option>Maintenance</option><option>Damaged</option><option>Lost</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Asset ID</th><th>Equipment Name</th><th>Category</th><th>Serial #</th><th>Condition</th><th>Branch</th><th>Availability</th><th>Project</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            @forelse($equipment as $item)
            <tr>
              <td class="text-mono"><a href="{{ route('equipment.show', $item->id) }}" class="cell-link">{{ explode('-', $item->id)[0] ?? $item->id }}</a></td>
              <td>{{ $item->name }}</td>
              <td>{{ $item->category }}</td>
              <td class="text-mono fs-12">-</td>
              <td>-</td>
              <td>-</td>
              <td>{{ statusBadge($item->status) ?? $item->status }}</td>
              <td>-</td>
              <td>
                @if($item->status == 'ACTIVE')
                  <span class="badge bg-success-subtle text-success border border-success-subtle">Active</span>
                @else
                  <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">{{ $item->status }}</span>
                @endif
              </td>
              <td><a href="{{ route('equipment.show', $item->id) }}" class="btn-action"><i class="bi bi-eye"></i></a><button class="btn-action"><i class="bi bi-pencil"></i></button></td>
            </tr>
            @empty
            <tr><td colspan="10" class="text-center text-muted py-4">No equipment found</td></tr>
            @endforelse
          </tbody></table></div>
          <div class="er-card-footer" id="pagination"></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('equipment',[{label:'Inventory',href:'#'},{label:'Equipment'}],'Equipment');
    // Update main buttons
    const btnPrimary = document.querySelector('.page-header-actions .btn-primary');
    if (btnPrimary) {
        btnPrimary.setAttribute('data-bs-toggle', 'modal');
        btnPrimary.setAttribute('data-bs-target', '#addEquipmentModal');
        btnPrimary.removeAttribute('onclick');
    }
</script>
@endpush
