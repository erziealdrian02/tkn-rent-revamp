@extends('layouts.app')

@section('title', 'Branches — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Branches</h2><p class="page-header-subtitle">Warehouse and branch management</p></div>
        <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add branch','info')"><i class="bi bi-plus-lg me-1"></i>Add Branch</button></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Code</th><th>Branch Name</th><th>Address</th><th>Capacity</th><th>Total Equipment</th><th>Available</th><th>On Rental</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            @forelse($branches as $branch)
            <tr>
              <td class="text-mono fw-600">-</td>
              <td><a href="{{ route('branches.show', $branch->id) }}" class="cell-link">{{ $branch->name }}</a></td>
              <td class="fs-12">{{ $branch->location }}</td>
              <td>-</td>
              <td>-</td>
              <td><span class="badge-status available">-</span></td>
              <td><span class="badge-status on-rental">-</span></td>
              <td>
                @if($branch->status == 'ACTIVE')
                  <span class="badge bg-success-subtle text-success border border-success-subtle">Active</span>
                @else
                  <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">{{ $branch->status }}</span>
                @endif
              </td>
              <td><a href="{{ route('branches.show', $branch->id) }}" class="btn-action"><i class="bi bi-eye"></i></a><button class="btn-action"><i class="bi bi-pencil"></i></button></td>
            </tr>
            @empty
            <tr><td colspan="9" class="text-center text-muted py-4">No branches found</td></tr>
            @endforelse
          </tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('branches',[{label:'Inventory',href:'#'},{label:'Branches'}],'Branches');

    const btnPrimary = document.querySelector('.page-header-actions .btn-primary');
    if (btnPrimary) {
        btnPrimary.setAttribute('data-bs-toggle', 'modal');
        btnPrimary.setAttribute('data-bs-target', '#addBranchModal');
        btnPrimary.removeAttribute('onclick');
    }
</script>
@endpush
