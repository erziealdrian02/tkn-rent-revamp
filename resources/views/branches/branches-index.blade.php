@extends('layouts.app')

@section('title', 'Branches — EquipRent Enterprise')

@section('content')
    <div class="page-header">
        <div class="page-header-left">
            <h2 class="page-header-title">Branches</h2>
            <p class="page-header-subtitle">Warehouse and branch management</p>
        </div>
        <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add branch','info')"><i
                    class="bi bi-plus-lg me-1"></i>Add Branch</button></div>
    </div>
    <div class="er-card">
        <div class="er-card-body">
            <div class="er-table-wrapper">
                <table class="er-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Branch Name</th>
                            <th>Address</th>
                            <th>Capacity</th>
                            <th>Total Equipment</th>
                            <th>Available</th>
                            <th>On Rental</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($branches as $b)
                            <tr>
                                <td class="text-mono fw-600">{{ $b->branches_code }}</td>
                                <td><a href="branch-detail?id={{ $b->id }}" class="cell-link">{{ $b->name }}</a>
                                </td>
                                <td class="fs-12">{{ $b->location }}</td>
                                <td>{{ $b->capacity }}</td>
                                <td>{{ $b->totalEquipment }}</td>
                                <td><span class="badge-status available">{{ $b->available }}</span></td>
                                <td><span class="badge-status on-rental">{{ $b->onRental }}</span></td>
                                <td
                                    class="{{ $b->status == 'ACTIVE' ? 'badge-status active' : 'badge-status inactive' }} p-2 mt-3">
                                    {{ $b->status }}</td>
                                <td>
                                    <a href="{{ route('branches.show', $b->id) }}" class="btn-action"><i
                                            class="bi bi-eye"></i></a>
                                    <button type="button" class="btn-action border-0 bg-transparent"
                                        onclick="openEditBranchModal({{ json_encode($b) }})"><i
                                            class="bi bi-pencil"></i></button>
                                    <form action="{{ route('branches.destroy', $b->id) }}" method="POST"
                                        style="display:inline;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn-action border-0 bg-transparent"
                                            onclick="return confirm('Are you sure you want to delete {{ $b->name }}? This action cannot be undone.')">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="9" class="text-center text-muted py-4">No branches</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="modal fade" id="addBranchModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="branchForm" class="needs-validation" method="POST" action="{{ route('branches.store') }}">
                    @csrf
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Branch</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status <span class="text-danger">*</span></label>
                                <select class="form-select" name="status" required>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label form-label-er">Branch Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="name" required
                                    placeholder="e.g. Jakarta Warehouse">
                                <div class="invalid-feedback">Branch name is required.</div>
                            </div>
                            <div class="col-12">
                                <label class="form-label form-label-er">Capacity (Items) <span
                                        class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="brCapacity" name="capacity" required
                                    min="1" value="500">
                                <div class="invalid-feedback">Capacity is required.</div>
                            </div>
                            <div class="col-12">
                                <label class="form-label form-label-er">Location</label>
                                <textarea class="form-control" name="location" rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Branch</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Branch Modal -->
    <div class="modal fade" id="editBranchModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="editBranchForm" class="needs-validation" method="POST" action="">
                    @csrf
                    @method('PUT')
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Branch</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status <span class="text-danger">*</span></label>
                                <select class="form-select" id="editBrStatus" name="status" required>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label form-label-er">Branch Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editBrName" name="name" required>
                                <div class="invalid-feedback">Branch name is required.</div>
                            </div>
                            <div class="col-12">
                                <label class="form-label form-label-er">Capacity (Items) <span
                                        class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="editBrCapacity" name="capacity" required
                                    min="1" value="500">
                                <div class="invalid-feedback">Capacity is required.</div>
                            </div>
                            <div class="col-12">
                                <label class="form-label form-label-er">Location</label>
                                <textarea class="form-control" id="editBrLocation" name="location" rows="2"></textarea>
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
        initApp('branches', [{
            label: 'Inventory',
            href: '#'
        }, {
            label: 'Branches'
        }], 'Branches');

        function showToast(message, type) {
            const modal = new bootstrap.Modal(document.getElementById('addBranchModal'));
            modal.show();
        }

        function openEditBranchModal(branch) {
            document.getElementById('editBranchForm').action = `/branches/${branch.id}`;
            document.getElementById('editBrName').value = branch.name;
            document.getElementById('editBrCapacity').value = branch.capacity || 500;
            document.getElementById('editBrLocation').value = branch.location || '';
            document.getElementById('editBrStatus').value = branch.status;

            const modal = new bootstrap.Modal(document.getElementById('editBranchModal'));
            modal.show();
        }
    </script>
@endpush
