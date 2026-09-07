@extends('layouts.app')

@section('title', 'Deliveries — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Deliveries</h2><p class="page-header-subtitle">Monitor delivery operations</p></div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <div class="table-search"><i class="bi bi-search"></i><input type="text" placeholder="Search deliveries..." id="searchInput" oninput="filterData()"></div>
              <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Preparing</option><option>Assigned</option><option>Departed</option><option>Arrived</option><option>Completed</option></select>
              <select class="filter-select" id="driverFilter" onchange="filterData()"><option value="">All Drivers</option></select>
            </div>
          </div>
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Delivery #</th><th>Rental</th><th>Project</th><th>Customer</th><th>Driver</th><th>Vehicle</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="tableBody">
            @forelse($deliveries as $delivery)
            <tr>
                <td><a href="{{ route('deliveries.show', $delivery->id) }}" class="cell-link text-mono">{{ substr($delivery->id, 0, 8) }}</a></td>
                <td><a href="{{ route('rentals.show', $delivery->rental_id) }}" class="cell-link">{{ substr($delivery->rental_id, 0, 8) }}</a></td>
                <td>{{ $delivery->rental->project->name ?? '-' }}</td>
                <td>{{ $delivery->rental->project->customer->name ?? '-' }}</td>
                <td>{{ $delivery->driver->name ?? '<span class="text-muted">Unassigned</span>' }}</td>
                <td>{{ $delivery->vehicle->plate_number ?? '-' }}</td>
                <td>{{ \Carbon\Carbon::parse($delivery->delivery_date)->format('d M Y') }}</td>
                <td>
                    @if($delivery->status === 'COMPLETED')
                        <span class="badge bg-success-subtle text-success">Completed</span>
                    @elseif($delivery->status === 'ON_DELIVERY')
                        <span class="badge bg-info-subtle text-info">On Delivery</span>
                    @elseif($delivery->status === 'PREPARING')
                        <span class="badge bg-warning-subtle text-warning">Preparing</span>
                    @else
                        <span class="badge bg-secondary-subtle text-secondary">{{ $delivery->status }}</span>
                    @endif
                </td>
                <td><a href="{{ route('deliveries.show', $delivery->id) }}" class="btn-action"><i class="bi bi-eye"></i></a></td>
            </tr>
            @empty
            <tr><td colspan="9" class="text-center text-muted py-4">No deliveries found</td></tr>
            @endforelse
          </tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('deliveries',[{label:'Rental',href:'#'},{label:'Deliveries'}],'Deliveries');

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
