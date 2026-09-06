@extends('layouts.app')

@section('title', 'Vehicles — EquipRent Enterprise')

@section('content')
<div class="page-header"><div class="page-header-left"><h2 class="page-header-title">Vehicles</h2><p class="page-header-subtitle">Delivery vehicle fleet management</p></div>
        <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add vehicle','info')"><i class="bi bi-plus-lg me-1"></i>Add Vehicle</button></div></div>
        <div class="er-card"><div class="er-card-body">
          <div class="table-toolbar"><div class="table-toolbar-left">
            <select class="filter-select" id="statusFilter" onchange="filterData()"><option value="">All Status</option><option>Available</option><option>On Delivery</option><option>Maintenance</option></select>
          </div></div>
          <tbody>
            @forelse($vehicles as $vehicle)
            <tr>
              <td class="text-mono">{{ explode('-', $vehicle->id)[0] ?? $vehicle->id }}</td>
              <td><a href="{{ route('vehicles.show', $vehicle->id) }}" class="cell-link fw-600">{{ $vehicle->plate_number }}</a></td>
              <td>{{ $vehicle->type }}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>
                @if($vehicle->status == 'ACTIVE')
                  <span class="badge bg-success-subtle text-success border border-success-subtle">Active</span>
                @else
                  <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">{{ $vehicle->status }}</span>
                @endif
              </td>
              <td><a href="{{ route('vehicles.show', $vehicle->id) }}" class="btn-action"><i class="bi bi-eye"></i></a><button class="btn-action"><i class="bi bi-pencil"></i></button></td>
            </tr>
            @empty
            <tr><td colspan="8" class="text-center text-muted py-4">No vehicles found</td></tr>
            @endforelse
          </tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('vehicles',[{label:'Master Data',href:'#'},{label:'Vehicles'}],'Vehicles');

    const btnPrimary = document.querySelector('.page-header-actions .btn-primary');
    if (btnPrimary) {
        btnPrimary.setAttribute('data-bs-toggle', 'modal');
        btnPrimary.setAttribute('data-bs-target', '#addVehicleModal');
        btnPrimary.removeAttribute('onclick');
    }
</script>
@endpush
