@extends('layouts.app')

@section('title', 'Drivers — EquipRent Enterprise')

@section('content')
<div class="page-header">
          <div class="page-header-left"><h2 class="page-header-title">Drivers</h2><p class="page-header-subtitle">Manage driver personnel</p></div>
          <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add driver form','info')"><i class="bi bi-plus-lg me-1"></i>Add Driver</button></div>
        </div>
        <div class="er-card"><div class="er-card-body">
          <tbody>
            @forelse($drivers as $driver)
            <tr>
              <td class="text-mono">{{ explode('-', $driver->id)[0] ?? $driver->id }}</td>
              <td><a href="{{ route('drivers.show', $driver->id) }}" class="cell-link">{{ $driver->user->name ?? 'Unknown User' }}</a></td>
              <td>{{ $driver->user->phone ?? '-' }}</td>
              <td>{{ $driver->license_number }}</td>
              <td>-</td>
              <td>
                @if($driver->status == 'ACTIVE')
                  <span class="badge bg-success-subtle text-success border border-success-subtle">Active</span>
                @else
                  <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">{{ $driver->status }}</span>
                @endif
              </td>
              <td>-</td>
              <td><a href="{{ route('drivers.show', $driver->id) }}" class="btn-action"><i class="bi bi-eye"></i></a><button class="btn-action"><i class="bi bi-pencil"></i></button></td>
            </tr>
            @empty
            <tr><td colspan="8" class="text-center text-muted py-4">No drivers found</td></tr>
            @endforelse
          </tbody></table></div>
        </div></div>
@endsection

@push('scripts')
<script>
initApp('drivers',[{label:'Master Data',href:'#'},{label:'Drivers'}],'Drivers');

    const btnPrimary = document.querySelector('.page-header-actions .btn-primary');
    if (btnPrimary) {
        btnPrimary.setAttribute('data-bs-toggle', 'modal');
        btnPrimary.setAttribute('data-bs-target', '#addDriverModal');
        btnPrimary.removeAttribute('onclick');
    }
</script>
@endpush
