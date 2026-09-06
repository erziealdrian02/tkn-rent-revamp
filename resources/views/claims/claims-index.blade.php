@extends('layouts.app')

@section('title', 'Claims — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Claims</h2><p class="page-header-subtitle">Equipment loss and damage claims</p></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search claims..." id="searchInput" oninput="filterData()"></div>
            <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Draft</option><option>Waiting Customer Confirmation</option><option>Customer Confirmed</option><option>Claim Approved</option><option>Invoiced</option><option>Closed</option></select>
          </div></div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Claim #</th><th>Return</th><th>Project</th><th>Customer</th><th>Equipment</th><th>Qty</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody">
            @forelse($claims as $claim)
            <tr>
                <td><a href="{{ route('claims.show', $claim->id) }}" class="cell-link text-mono">{{ substr($claim->id, 0, 8) }}</a></td>
                <td><a href="{{ route('returns.show', $claim->return_id) }}" class="cell-link">{{ substr($claim->return_id, 0, 8) }}</a></td>
                <td>{{ $claim->returnRecord->rental->project->name ?? '-' }}</td>
                <td>{{ $claim->customer->name ?? '-' }}</td>
                <td>{{ $claim->type }}</td>
                <td>{{ $claim->items->count() ?? 0 }} items</td>
                <td class="fw-600">Rp {{ number_format($claim->amount, 0, ',', '.') }}</td>
                <td>
                    @if($claim->status === 'APPROVED')
                        <span class="badge bg-success-subtle text-success">Approved</span>
                    @elseif($claim->status === 'REJECTED')
                        <span class="badge bg-danger-subtle text-danger">Rejected</span>
                    @else
                        <span class="badge bg-secondary-subtle text-secondary">{{ $claim->status }}</span>
                    @endif
                </td>
                <td><a href="{{ route('claims.show', $claim->id) }}" class="btn-action"><i class="bi bi-eye"></i></a></td>
            </tr>
            @empty
            <tr><td colspan="9" class="text-center text-muted py-4">No claims found</td></tr>
            @endforelse
          </tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('claims',[{label:'Rental',href:'#'},{label:'Claims'}],'Claims');
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
