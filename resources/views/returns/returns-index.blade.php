@extends('layouts.app')

@section('title', 'Returns — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Returns</h2><p class="page-header-subtitle">Equipment return management</p></div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search returns..." id="searchInput" oninput="filterData()"></div>
            <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Pending</option><option>Inspection</option><option>Partially Returned</option><option>Returned</option><option>Completed</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Return #</th><th>Rental</th><th>Project</th><th>Customer</th><th>Return Date</th><th>Items</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody">
            @forelse($returns as $return)
            <tr>
                <td><a href="{{ route('returns.show', $return->id) }}" class="cell-link text-mono">{{ substr($return->id, 0, 8) }}</a></td>
                <td><a href="{{ route('rentals.show', $return->rental_id) }}" class="cell-link">{{ substr($return->rental_id, 0, 8) }}</a></td>
                <td>{{ $return->rental->project->name ?? '-' }}</td>
                <td>{{ $return->rental->project->customer->name ?? '-' }}</td>
                <td>{{ \Carbon\Carbon::parse($return->return_date)->format('d M Y') }}</td>
                <td>{{ $return->items->count() ?? 0 }} types</td>
                <td>
                    @if($return->status === 'INSPECTED')
                        <span class="badge bg-success-subtle text-success">Inspected</span>
                    @else
                        <span class="badge bg-secondary-subtle text-secondary">{{ $return->status }}</span>
                    @endif
                </td>
                <td><a href="{{ route('returns.show', $return->id) }}" class="btn-action"><i class="bi bi-eye"></i></a></td>
            </tr>
            @empty
            <tr><td colspan="8" class="text-center text-muted py-4">No returns found</td></tr>
            @endforelse
          </tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('returns',[{label:'Rental',href:'#'},{label:'Returns'}],'Returns');
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
