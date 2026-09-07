@extends('layouts.app')

@section('title', 'Rentals — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left">
            <h2 class="page-header-title">Rentals</h2>
            <p class="page-header-subtitle">Manage equipment rental transactions</p>
          </div>
          <div class="page-header-actions">
            <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-download me-1"></i>Export</button>
            <a href="{{ url('rental-create') }}" class="btn btn-primary btn-sm"><i class="bi bi-plus-lg me-1"></i>New Rental</a>
          </div>
        </div>

        <div class="er-card">
          <div class="er-card-body">
            <div class="table-toolbar">
              <div class="table-toolbar-left">
                <div class="table-search">
                  <i class="bi bi-search"></i>
                  <input type="text" placeholder="Search rentals..." id="searchInput" oninput="filterRentals()">
                </div>
                <select class="filter-select" id="statusFilter" onchange="filterRentals()">
                  <option value="">All Status</option>
                  <option>Draft</option><option>Pending Approval</option><option>Approved</option><option>Rejected</option>
                  <option>Preparing</option><option>Partially Delivered</option><option>On Rental</option>
                  <option>Partially Returned</option><option>Overdue</option><option>Completed</option><option>Cancelled</option>
                </select>
                <select class="filter-select" id="customerFilter" onchange="filterRentals()">
                  <option value="">All Customers</option>
                </select>
              </div>
            </div>

            <div class="er-table-wrapper">
              <table class="er-table">
                <thead>
                  <tr>
                    <th>Rental #</th><th>Customer</th><th>Project</th><th>Rental Date</th>
                    <th>Return Date</th><th>Items</th><th>Delivery</th><th>Status</th>
                    <th>Invoice</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody id="rentalTableBody">
                  @forelse($rentals as $rental)
                  <tr>
                    <td><a href="{{ route('rentals.show', $rental->id) }}" class="cell-link text-mono">{{ substr($rental->id, 0, 8) }}</a></td>
                    <td>{{ $rental->project->customer->name ?? '-' }}</td>
                    <td><a href="{{ route('projects.show', $rental->project_id) }}" class="cell-link">{{ $rental->project->name ?? '-' }}</a></td>
                    <td>{{ \Carbon\Carbon::parse($rental->start_date)->format('d M Y') }}</td>
                    <td>{{ \Carbon\Carbon::parse($rental->return_date)->format('d M Y') }}</td>
                    <td><span class="badge bg-light text-dark border">{{ $rental->items->count() ?? 0 }}</span></td>
                    <td>
                      @if($rental->status === 'ON_RENTAL' || $rental->status === 'COMPLETED')
                          <span class="badge bg-success-subtle text-success">Delivered</span>
                      @else
                          <span class="badge bg-secondary-subtle text-secondary">Pending</span>
                      @endif
                    </td>
                    <td>
                      @if($rental->status === 'APPROVED')
                          <span class="badge bg-primary-subtle text-primary">Approved</span>
                      @elseif($rental->status === 'PENDING_APPROVAL')
                          <span class="badge bg-warning-subtle text-warning">Pending Approval</span>
                      @elseif($rental->status === 'ON_RENTAL')
                          <span class="badge bg-info-subtle text-info">On Rental</span>
                      @elseif($rental->status === 'COMPLETED')
                          <span class="badge bg-success-subtle text-success">Completed</span>
                      @elseif($rental->status === 'CANCELLED')
                          <span class="badge bg-danger-subtle text-danger">Cancelled</span>
                      @else
                          <span class="badge bg-secondary-subtle text-secondary">{{ $rental->status }}</span>
                      @endif
                    </td>
                    <td><span class="badge bg-secondary-subtle text-secondary">Unpaid</span></td>
                    <td>
                      <a href="{{ route('rentals.show', $rental->id) }}" class="btn-action" title="View"><i class="bi bi-eye"></i></a>
                    </td>
                  </tr>
                  @empty
                  <tr><td colspan="10" class="text-center text-muted py-4">No rentals found</td></tr>
                  @endforelse
                </tbody>
              </table>
            </div>
          </div>
        </div>
@endsection

@push('scripts')
<script>
const user = initApp('rentals', [{label:'Rental',href:'#'},{label:'Rentals'}], 'Rentals');

function filterRentals() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#rentalTableBody tr');
    
    rows.forEach(row => {
        if(row.cells.length < 5) return;
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(search) ? '' : 'none';
    });
}
</script>
@endpush
