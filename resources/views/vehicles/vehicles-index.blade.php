@extends('layouts.app')

@section('title', 'Vehicles — EquipRent Enterprise')

@section('content')
    <div class="page-header">
        <div class="page-header-left">
            <h2 class="page-header-title">Vehicles</h2>
            <p class="page-header-subtitle">Delivery vehicle fleet management</p>
        </div>
        <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add vehicle','info')"><i
                    class="bi bi-plus-lg me-1"></i>Add Vehicle</button></div>
    </div>
    <div class="er-card">
        <div class="er-card-body">
            <form action="{{ route('vehicles.index') }}" method="GET" class="table-toolbar" id="filterForm">
                <div class="table-toolbar-left">
                    <div class="table-search">
                        <i class="bi bi-search"></i>
                        <input type="text" name="search" placeholder="Search vehicles..."
                            value="{{ request('search') }}"
                            onkeypress="if(event.key === 'Enter') document.getElementById('filterForm').submit()">
                    </div>
                    <select class="filter-select" name="status" onchange="document.getElementById('filterForm').submit()">
                        <option value="">All Status</option>
                        <option value="Available" {{ request('status') === 'Available' ? 'selected' : '' }}>Available
                        </option>
                        <option value="Maintenance" {{ request('status') === 'Maintenance' ? 'selected' : '' }}>Maintenance
                        </option>
                        <option value="INACTIVE" {{ request('status') === 'INACTIVE' ? 'selected' : '' }}>Inactive</option>
                    </select>
                </div>
            </form>
            <div class="er-table-wrapper">
                <table class="er-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>License Plate</th>
                            <th>Type</th>
                            <th>Brand</th>
                            <th>Tax Expiry</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        @forelse ($vehicles as $vehicle)
                            <tr>
                                <td class="text-mono">{{ $vehicle->vehicle_code }}</td>
                                <td><a href="{{ route('vehicles.show', $vehicle) }}"
                                        class="cell-link fw-600">{{ $vehicle->plate_number }}</a></td>
                                <td>{{ $vehicle->type }}</td>
                                <td>{{ $vehicle->brand }}</td>
                                <td>{{ $vehicle->tax_expiry ? $vehicle->tax_expiry->format('Y-m-d') : '-' }}</td>
                                <td>
                                    <span
                                        class="badge-status {{ $vehicle->status === 'Available' ? 'available' : ($vehicle->status === 'Maintenance' ? 'draft' : 'inactive') }}">
                                        {{ $vehicle->status }}
                                    </span>
                                </td>
                                <td>
                                    <a href="{{ route('vehicles.show', $vehicle) }}" class="btn-action"><i
                                            class="bi bi-eye"></i></a>
                                    <button type="button" class="btn-action border-0 bg-transparent"
                                        onclick="openEditVehicleModal({{ json_encode($vehicle) }})">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <form action="{{ route('vehicles.destroy', $vehicle->id) }}" method="POST"
                                        style="display:inline;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn-action border-0 bg-transparent"
                                            onclick="return confirm('Are you sure you want to delete {{ $vehicle->plate_number }}?')">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="text-center text-muted py-4">No vehicles found</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Add Vehicle Modal -->
    <div class="modal fade" id="addVehicleModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="vehicleForm" class="needs-validation" method="POST" action="{{ route('vehicles.store') }}">
                    @csrf
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Vehicle</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label form-label-er">License Plate <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control text-uppercase" name="plate_number" required
                                    placeholder="e.g. B 1234 XYZ">
                                <div class="invalid-feedback">License plate is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status</label>
                                <select class="form-select" name="status" required>
                                    <option value="Available">Available</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Vehicle Type <span
                                        class="text-danger">*</span></label>
                                <select class="form-select" name="type" required>
                                    <option value="Truck">Truck</option>
                                    <option value="Pickup">Pickup</option>
                                    <option value="Van">Van</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Capacity (Kg)<span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="capacity" required placeholder="e.g. 100">
                            </div>
                            <div class="col-md-12">
                                <label class="form-label form-label-er">Tax Expiry Date <span
                                        class="text-danger">*</span></label>
                                <input type="date" class="form-control" name="tax_expiry" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label form-label-er">Brand & Model <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="brand" required
                                    placeholder="e.g. Mitsubishi Colt Diesel">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Vehicle</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Vehicle Modal -->
    <div class="modal fade" id="editVehicleModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="editVehicleForm" class="needs-validation" method="POST" action="">
                    @csrf
                    @method('PUT')
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Vehicle</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label form-label-er">License Plate <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control text-uppercase" id="editVhcPlate"
                                    name="plate_number" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status</label>
                                <select class="form-select" id="editVhcStatus" name="status" required>
                                    <option value="Available">Available</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Vehicle Type <span
                                        class="text-danger">*</span></label>
                                <select class="form-select" id="editVhcType" name="type" required>
                                    <option value="Truck">Truck</option>
                                    <option value="Pickup">Pickup</option>
                                    <option value="Van">Van</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Tax Expiry Date <span
                                        class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="editVhcTax" name="tax_expiry" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label form-label-er">Brand & Model <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editVhcBrand" name="brand" required>
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
        initApp('vehicles', [{
            label: 'Master Data',
            href: '#'
        }, {
            label: 'Vehicles'
        }], 'Vehicles');

        function showToast(message, type) {
            const modal = new bootstrap.Modal(document.getElementById('addVehicleModal'));
            modal.show();
        }

        function openEditVehicleModal(vehicle) {
            document.getElementById('editVehicleForm').action = `/vehicles/${vehicle.id}`;
            document.getElementById('editVhcPlate').value = vehicle.plate_number;
            document.getElementById('editVhcStatus').value = vehicle.status;
            document.getElementById('editVhcType').value = vehicle.type;

            // Format date for date input
            if (vehicle.tax_expiry) {
                const dateObj = new Date(vehicle.tax_expiry);
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                document.getElementById('editVhcTax').value = `${year}-${month}-${day}`;
            } else {
                document.getElementById('editVhcTax').value = '';
            }

            document.getElementById('editVhcBrand').value = vehicle.brand;

            const modal = new bootstrap.Modal(document.getElementById('editVehicleModal'));
            modal.show();
        }
    </script>
@endpush
