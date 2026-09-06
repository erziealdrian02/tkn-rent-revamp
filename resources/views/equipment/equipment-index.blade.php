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
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Asset ID</th><th>Equipment Name</th><th>Category</th><th>Rate</th><th>Replacement Value</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody">
            @forelse($equipment as $eq)
            <tr>
              <td><a href="{{ route('equipment.show', $eq->id) }}" class="cell-link text-mono">{{ substr($eq->id, 0, 8) }}</a></td>
              <td class="fw-500">{{ $eq->name }}</td>
              <td><span class="badge bg-light text-dark border">{{ $eq->category ?? '-' }}</span></td>
              <td>Rp {{ number_format($eq->daily_rate, 0, ',', '.') }} / day</td>
              <td>Rp {{ number_format($eq->replacement_value, 0, ',', '.') }}</td>
              <td>
                    @if($eq->status === 'ACTIVE')
                        <span class="badge bg-success-subtle text-success">Active</span>
                    @elseif($eq->status === 'MAINTENANCE')
                        <span class="badge bg-warning-subtle text-warning">Maintenance</span>
                    @else
                        <span class="badge bg-secondary-subtle text-secondary">Inactive</span>
                    @endif
              </td>
              <td>
                <a href="{{ route('equipment.show', $eq->id) }}" class="btn-action"><i class="bi bi-eye"></i></a>
                <a href="{{ route('equipment.edit', $eq->id) }}" class="btn-action"><i class="bi bi-pencil"></i></a>
              </td>
            </tr>
            @empty
              <tr><td colspan="7" class="text-center text-muted py-4">No equipment found</td></tr>
            @endforelse
          </tbody></table></div>
          <div class="er-card-footer" id="pagination"></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('equipment',[{label:'Inventory',href:'#'},{label:'Equipment'}],'Equipment');
function filterData() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        if (row.cells.length < 5) return;
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
    });
}
</script>
@endpush
