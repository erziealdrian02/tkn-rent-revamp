@extends('layouts.app')

@section('title', 'Repairs — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Equipment Repairs</h2><p class="page-header-subtitle">Manage damaged equipment and repair workflows</p></div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search repairs..." id="searchInput" oninput="filterData()"></div>
              <select class="filter-select" id="statusFilter" onchange="filterData()">
                <option value="">All Status</option><option>Pending</option><option>In Repair</option><option>Completed</option><option>Unrepairable</option>
              </select>
            </div>
          </div>
          <div class="er-table-wrapper">
            <table class="er-table">
              <thead><tr><th>Repair #</th><th>Equipment</th><th>Qty</th><th>Source Return</th><th>Branch</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="tableBody">
                @forelse($repairs as $repair)
                <tr>
                    <td><a href="{{ route('repairs.show', $repair->id) }}" class="cell-link text-mono">{{ substr($repair->id, 0, 8) }}</a></td>
                    <td class="fw-500">{{ $repair->equipment->name ?? '-' }}</td>
                    <td>{{ $repair->quantity }}</td>
                    <td>
                        @if($repair->returnItem)
                            <a href="{{ route('returns.show', $repair->returnItem->returnRecord->id) }}">{{ substr($repair->returnItem->returnRecord->id, 0, 8) }}</a>
                        @else
                            -
                        @endif
                    </td>
                    <td>{{ $repair->branch->name ?? '-' }}</td>
                    <td>{{ \Carbon\Carbon::parse($repair->created_at)->format('d M Y') }}</td>
                    <td>
                        @if($repair->status === 'FIXED')
                            <span class="badge bg-success-subtle text-success">Fixed</span>
                        @elseif($repair->status === 'PENDING')
                            <span class="badge bg-warning-subtle text-warning">Pending</span>
                        @else
                            <span class="badge bg-secondary-subtle text-secondary">{{ $repair->status }}</span>
                        @endif
                    </td>
                    <td><a href="{{ route('repairs.show', $repair->id) }}" class="btn-action"><i class="bi bi-eye"></i></a></td>
                </tr>
                @empty
                <tr><td colspan="8" class="text-center text-muted py-4">No repair records found</td></tr>
                @endforelse
              </tbody>
            </table>
          </div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('repairs',[{label:'Equipment',href:'#'},{label:'Repairs'}],'Repairs');
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
