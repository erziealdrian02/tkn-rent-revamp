@extends('layouts.app')

@section('title', 'Drivers — EquipRent Enterprise')

@section('content')
    <div class="page-header">
        <div class="page-header-left">
            <h2 class="page-header-title">Drivers</h2>
            <p class="page-header-subtitle">Manage driver personnel</p>
        </div>
        <div class="page-header-actions"><button class="btn btn-primary btn-sm"
                onclick="showToast('Add driver form','info')"><i class="bi bi-plus-lg me-1"></i>Add Driver</button></div>
    </div>
    <div class="er-card">
        <div class="er-card-body">
            <div class="er-table-wrapper">
                <table class="er-table">
                    <thead>
                        <tr>
                            <th>Driver ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>License #</th>
                            <th>License Expiry</th>
                            <th>Status</th>
                            <th>Current Delivery</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($drivers as $d)
                            <tr>
                                <td class="text-mono">{{ $d->driver_code }}</td>
                                <td><a href="{{ route('drivers.show', $d->id) }}"
                                        class="cell-link">{{ $d->user->name ?? '-' }}</a></td>
                                <td>{{ $d->user->phone ?? '-' }}</td>
                                <td>{{ $d->license_number }}</td>
                                <td>
                                    {{ $d->license_exp }}
                                </td>
                                <td>
                                    <span
                                        class="badge-status {{ $d->status === 'ACTIVE' ? 'available' : 'inactive' }}">{{ $d->status }}</span>
                                </td>
                                <td>

                                </td>
                                <td>
                                    <a href="{{ route('drivers.show', $d->id) }}" class="btn-action"><i
                                            class="bi bi-eye"></i></a>
                                    <button type="button" class="btn-action border-0 bg-transparent"
                                        onclick="openEditDriverModal({{ json_encode($d) }}, {{ json_encode($d->user) }})">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <form action="{{ route('drivers.destroy', $d->id) }}" method="POST"
                                        style="display:inline;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn-action border-0 bg-transparent"
                                            onclick="return confirm('Are you sure you want to delete {{ $d->user->name ?? 'this driver' }}?')">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="text-center text-muted py-4">No drivers found</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Add Driver Modal -->
    <div class="modal fade" id="addDriverModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="driverForm" class="needs-validation" method="POST" action="{{ route('drivers.store') }}">
                    @csrf
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Driver</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Driver Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="name" required
                                    placeholder="e.g. Budi Santoso">
                                <div class="invalid-feedback">Driver name is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status</label>
                                <select class="form-select" name="status" required>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Phone Number <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="phone" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">License Number (SIM) <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="license_number" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">License Expiry Date <span
                                        class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="editDrvExpiry" name="license_exp" required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Driver</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Driver Modal -->
    <div class="modal fade" id="editDriverModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="editDriverForm" class="needs-validation" method="POST" action="">
                    @csrf
                    @method('PUT')
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Driver</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Driver Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editDrvName" name="name" required>
                                <div class="invalid-feedback">Driver name is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status</label>
                                <select class="form-select" id="editDrvStatus" name="status" required>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Phone Number <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editDrvPhone" name="phone" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">License Number (SIM) <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editDrvLicense" name="license_number"
                                    required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        initApp('drivers', [{
            label: 'Master Data',
            href: '#'
        }, {
            label: 'Drivers'
        }], 'Drivers');

        function showToast(message, type) {
            const modal = new bootstrap.Modal(document.getElementById('addDriverModal'));
            modal.show();
        }

        function openEditDriverModal(driver, user) {
            document.getElementById('editDriverForm').action = `/drivers/${driver.id}`;
            document.getElementById('editDrvName').value = user ? user.name : '';
            document.getElementById('editDrvPhone').value = user ? user.phone : '';
            document.getElementById('editDrvLicense').value = driver.license_number || '';
            document.getElementById('editDrvExpiry').value = driver.license_exp || '';
            document.getElementById('editDrvStatus').value = driver.status;

            const modal = new bootstrap.Modal(document.getElementById('editDriverModal'));
            modal.show();
        }
    </script>
@endpush
