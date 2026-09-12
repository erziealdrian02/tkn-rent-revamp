@extends('layouts.app')

@section('title', 'Equipment — EquipRent Enterprise')

@section('content')
    <div class="page-header">
        <div class="page-header-left">
            <h2 class="page-header-title">Equipment</h2>
            <p class="page-header-subtitle">Manage equipment assets</p>
        </div>
        <div class="page-header-actions">
            <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-upload me-1"></i>Import</button>
            <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-download me-1"></i>Export</button>
            <button class="btn btn-primary btn-sm" onclick="showToast('Add equipment form','info')"><i
                    class="bi bi-plus-lg me-1"></i>Add Equipment</button>
        </div>
    </div>
    <div class="er-card">
        <div class="er-card-body">
            <div class="table-toolbar">
                <div class="table-toolbar-left">
                    <div class="table-search"><i class="bi bi-search"></i><input type="text"
                            placeholder="Search equipment..." id="searchInput" oninput="filterData()"></div>
                    <select class="filter-select" id="categoryFilter" onchange="filterData()">
                        <option value="">All Categories</option>
                    </select>
                    <select class="filter-select" id="branchFilter" onchange="filterData()">
                        <option value="">All Branches</option>
                        <option>Jakarta</option>
                        <option>Bekasi</option>
                    </select>
                    <select class="filter-select" id="statusFilter" onchange="filterData()">
                        <option value="">All Status</option>
                        <option>Available</option>
                        <option>Reserved</option>
                        <option>On Rental</option>
                        <option>Maintenance</option>
                        <option>Damaged</option>
                        <option>Lost</option>
                    </select>
                </div>
            </div>
            <div class="er-table-wrapper">
                <table class="er-table">
                    <thead>
                        <tr>
                            <th>Asset ID</th>
                            <th>Equipment Name</th>
                            <th>Category</th>
                            <th>Rate</th>
                            <th>Replacement Value</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        @forelse($equipment as $eq)
                            <tr>
                                <td><a href="{{ route('equipment.show', $eq->id) }}"
                                        class="cell-link text-mono">{{ substr($eq->id, 0, 8) }}</a></td>
                                <td class="fw-500">{{ $eq->name }}</td>
                                <td><span class="badge bg-light text-dark border">{{ $eq->category ?? '-' }}</span></td>
                                <td>Rp {{ number_format($eq->daily_rate, 0, ',', '.') }} / day</td>
                                <td>Rp {{ number_format($eq->replacement_value, 0, ',', '.') }}</td>
                                <td>
                                    @if ($eq->status === 'ACTIVE')
                                        <span class="badge bg-success-subtle text-success">Active</span>
                                    @elseif($eq->status === 'MAINTENANCE')
                                        <span class="badge bg-warning-subtle text-warning">Maintenance</span>
                                    @else
                                        <span class="badge bg-secondary-subtle text-secondary">Inactive</span>
                                    @endif
                                </td>
                                <td>
                                    <a href="{{ route('equipment.show', $eq->id) }}" class="btn-action"><i
                                            class="bi bi-eye"></i></a>
                                    <button type="button" class="btn-action border-0 bg-transparent" onclick="openEditEquipmentModal({{ json_encode($eq) }})"><i
                                            class="bi bi-pencil"></i></button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="text-center text-muted py-4">No equipment found</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <div class="er-card-footer" id="pagination"></div>
        </div>
    </div>

    <!-- Add Equipment Modal -->
    <div class="modal fade" id="addEquipmentModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form id="equipmentForm" class="needs-validation" method="POST" action="{{ route('equipment.store') }}">
                    @csrf
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Equipment</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label form-label-er">Equipment Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Category</label>
                                <input type="text" class="form-control" name="category">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status <span class="text-danger">*</span></label>
                                <select class="form-select" name="status" required>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Daily Rate (Rp) <span
                                        class="text-danger">*</span></label>
                                <input type="number" class="form-control" name="daily_rate" required min="0" value="0">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Replacement Value (Rp) <span
                                        class="text-danger">*</span></label>
                                <input type="number" class="form-control" name="replacement_value" required min="0" value="0">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Equipment</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Equipment Modal -->
    <div class="modal fade" id="editEquipmentModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form id="editEquipmentForm" class="needs-validation" method="POST" action="">
                    @csrf
                    @method('PUT')
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Equipment</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label form-label-er">Equipment Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editEqName" name="name" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Category</label>
                                <input type="text" class="form-control" id="editEqCategory" name="category">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status <span class="text-danger">*</span></label>
                                <select class="form-select" id="editEqStatus" name="status" required>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Daily Rate (Rp) <span
                                        class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="editEqDailyRate" name="daily_rate" required min="0" value="0">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Replacement Value (Rp) <span
                                        class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="editEqReplacementValue" name="replacement_value" required min="0" value="0">
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
        initApp('equipment', [{
            label: 'Inventory',
            href: '#'
        }, {
            label: 'Equipment'
        }], 'Equipment');

        function filterData() {
            const q = document.getElementById('searchInput').value.toLowerCase();
            const s = document.getElementById('statusFilter').value.toLowerCase();
            const rows = document.querySelectorAll('#tableBody tr');

            rows.forEach(row => {
                if (row.cells.length < 6) return;
                const text = row.innerText.toLowerCase();
                const statusCell = row.cells[5].innerText.toLowerCase().trim();
                
                const matchQ = text.includes(q);
                const matchS = s === '' || statusCell === s;
                
                row.style.display = (matchQ && matchS) ? '' : 'none';
            });
        }

        function showToast(message, type) {
            const modal = new bootstrap.Modal(document.getElementById('addEquipmentModal'));
            modal.show();
        }

        function openEditEquipmentModal(eq) {
            document.getElementById('editEquipmentForm').action = `/equipment/${eq.id}`;
            document.getElementById('editEqName').value = eq.name;
            document.getElementById('editEqCategory').value = eq.category || '';
            document.getElementById('editEqStatus').value = eq.status;
            document.getElementById('editEqDailyRate').value = eq.daily_rate;
            document.getElementById('editEqReplacementValue').value = eq.replacement_value;
            
            const modal = new bootstrap.Modal(document.getElementById('editEquipmentModal'));
            modal.show();
        }
    </script>
@endpush
