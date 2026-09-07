@extends('layouts.app')

@section('title', 'Maintenance — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left">
            <h2 class="page-header-title">Equipment Maintenance</h2>
            <p class="page-header-subtitle">Schedule and track routine equipment checks and calibrations</p>
          </div>
          <div class="page-header-right">
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newMaintenanceModal"><i class="bi bi-tools me-1"></i>Start Maintenance</button>
          </div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search maintenance..." id="searchInput" oninput="filterData()"></div>
              <select class="filter-select" id="statusFilter" onchange="filterData()">
                <option value="">All Status</option><option>In Progress</option><option>Completed</option>
              </select>
            </div>
          </div>
          <div class="er-table-wrapper">
            <table class="er-table">
              <thead><tr><th>ID</th><th>Equipment</th><th>Branch</th><th>Qty</th><th>Type</th><th>Start Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="tableBody">
                @forelse($maintenance as $m)
                <tr>
                    <td><a href="{{ route('maintenance.show', $m->id) }}" class="cell-link text-mono">{{ substr($m->id, 0, 8) }}</a></td>
                    <td class="fw-500">{{ $m->equipment->name ?? '-' }}</td>
                    <td>{{ $m->branch->name ?? '-' }}</td>
                    <td>{{ $m->quantity }}</td>
                    <td>{{ $m->type }}</td>
                    <td>{{ \Carbon\Carbon::parse($m->start_date)->format('d M Y') }}</td>
                    <td>
                        @if($m->status === 'COMPLETED')
                            <span class="badge bg-success-subtle text-success">Completed</span>
                        @elseif($m->status === 'IN_PROGRESS')
                            <span class="badge bg-warning-subtle text-warning">In Progress</span>
                        @else
                            <span class="badge bg-secondary-subtle text-secondary">{{ $m->status }}</span>
                        @endif
                    </td>
                    <td><a href="{{ route('maintenance.show', $m->id) }}" class="btn-action"><i class="bi bi-eye"></i></a></td>
                </tr>
                @empty
                <tr><td colspan="8" class="text-center text-muted py-4">No maintenance records found</td></tr>
                @endforelse
              </tbody>
            </table>
          </div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('maintenance',[{label:'Equipment',href:'#'},{label:'Maintenance'}],'Maintenance');
function filterData(){
    const search = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        if(row.cells.length < 5) return;
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(search) ? '' : 'none';
    });
}
</script>
@endpush
