@extends('layouts.app')

@section('title', 'Customers — EquipRent Enterprise')

@section('content')
    <div class="page-header">
        <div class="page-header-left">
            <h2 class="page-header-title">Customers</h2>
            <p class="page-header-subtitle">Manage customer database and relations</p>
        </div>
        <div class="page-header-actions">
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addCustomerModal">
                <i class="bi bi-plus-lg me-1"></i>Add Customer
            </button>
        </div>
    </div>
    <div class="er-card">
        <div class="er-card-body">
            <div class="table-toolbar">
                <div class="table-toolbar-left">
                    <div class="table-search"><i class="bi bi-search"></i><input type="text"
                            placeholder="Search customers..." id="searchInput" oninput="filterData()"></div>
                    <select class="filter-select" id="statusFilter" onchange="filterData()">
                        <option value="">All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>
            <div class="er-table-wrapper">
                <table class="er-table">
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>PIC</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        @forelse($customers as $c)
                            <tr>
                                <td><a href="{{ route('customers.show', $c->id) }}"
                                        class="cell-link text-mono">{{ $c->name }}</a></td>
                                <td>{{ $c->pic_name ?? '-' }}</td>
                                <td>
                                    <div class="fs-13"><i
                                            class="bi bi-telephone text-muted me-1"></i>{{ $c->contact ?? '-' }}<br><i
                                            class="bi bi-envelope text-muted me-1"></i>{{ $c->email ?? '-' }}</div>
                                </td>
                                <td>
                                    @if ($c->status === 'ACTIVE')
                                        <span class="badge bg-success-subtle text-success">Active</span>
                                    @else
                                        <span class="badge bg-secondary-subtle text-secondary">Inactive</span>
                                    @endif
                                </td>
                                <td>
                                    <a href="{{ route('customers.show', $c->id) }}" class="btn-action"><i
                                            class="bi bi-eye"></i></a>
                                    <button type="button" class="btn-action border-0 bg-transparent"
                                        onclick="openEditCustomerModal({{ json_encode($c) }})"><i
                                            class="bi bi-pencil"></i></button>
                                    <form action="{{ route('customers.destroy', $c->id) }}" method="POST"
                                        style="display:inline;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn-action border-0 bg-transparent"
                                            onclick="return confirm('Are you sure you want to delete {{ $c->name }}? This action cannot be undone.')">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center text-muted py-4">No customers found</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>


    <!-- Add Customer Modal -->
    <div class="modal fade" id="addCustomerModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form id="customerForm" method="POST" action="{{ route('customers.store') }}" class="needs-validation">
                    @csrf
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Customer</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Customer ID</label>
                                <input type="text" class="form-control bg-light text-mono" id="cusId" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status</label>
                                <select class="form-select" id="cusStatus" name="status">
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            <div class="col-md-8">
                                <label class="form-label form-label-er">Company Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="cusName" name="name" required
                                    placeholder="e.g. PT Maju Jaya">
                                <div class="invalid-feedback">Company name is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">PIC Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="cusPic" name="pic_name" required>
                                <div class="invalid-feedback">PIC is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Phone Number <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="cusPhone" name="contact" required>
                                <div class="invalid-feedback">Phone is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Email Address</label>
                                <input type="email" class="form-control" id="cusEmail" name="email">
                            </div>
                            <div class="col-12">
                                <label class="form-label form-label-er">Full Address</label>
                                <textarea class="form-control" id="cusAddress" name="address" rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Customer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Edit Customer Modal -->
    <div class="modal fade" id="editCustomerModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form id="editCustomerForm" method="POST" action="" class="needs-validation">
                    @csrf
                    @method('PUT')
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Customer</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Customer ID</label>
                                <input type="text" class="form-control bg-light text-mono" id="editCusId" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status</label>
                                <select class="form-select" id="editCusStatus" name="status">
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            <div class="col-md-8">
                                <label class="form-label form-label-er">Company Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editCusName" name="name" required>
                                <div class="invalid-feedback">Company name is required.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label form-label-er">Company Code</label>
                                <input type="text" class="form-control text-uppercase" id="editCusCode" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">PIC Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editCusPic" name="pic_name" required>
                                <div class="invalid-feedback">PIC is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Phone Number <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editCusPhone" name="contact" required>
                                <div class="invalid-feedback">Phone is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Email Address</label>
                                <input type="email" class="form-control" id="editCusEmail" name="email">
                            </div>
                            <div class="col-12">
                                <label class="form-label form-label-er">Full Address</label>
                                <textarea class="form-control" id="editCusAddress" name="address" rows="2"></textarea>
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
        initApp('customers', [{
            label: 'Master Data',
            href: '#'
        }, {
            label: 'Customers'
        }], 'Customers');

        function filterData() {
            const q = document.getElementById('searchInput').value.toLowerCase();
            const s = document.getElementById('statusFilter').value.toLowerCase();
            const rows = document.querySelectorAll('#tableBody tr');

            rows.forEach(row => {
                if (row.cells.length < 5) return; // skip empty state row

                const text = row.innerText.toLowerCase();
                const statusCell = row.cells[3].innerText.toLowerCase().trim();

                const matchQ = text.includes(q);
                const matchS = s === '' || statusCell === s;

                row.style.display = (matchQ && matchS) ? '' : 'none';
            });
        }

        function openAddCustomerModal() {
            document.getElementById('customerForm').reset();
            document.getElementById('customerForm').classList.remove('was-validated');
            document.getElementById('cusId').value = 'CUS-' + Date.now(); // atau generate dari server
            const modal = new bootstrap.Modal(document.getElementById('addCustomerModal'));
            modal.show();
        }

        function openEditCustomerModal(customer) {
            document.getElementById('editCustomerForm').action = `/customers/${customer.id}`;
            document.getElementById('editCusId').value = customer.id.substring(0, 8);
            document.getElementById('editCusStatus').value = customer.status;
            document.getElementById('editCusName').value = customer.name;
            document.getElementById('editCusPic').value = customer.pic_name || '';
            document.getElementById('editCusPhone').value = customer.contact || '';
            document.getElementById('editCusEmail').value = customer.email || '';
            document.getElementById('editCusAddress').value = customer.address || '';

            const modal = new bootstrap.Modal(document.getElementById('editCustomerModal'));
            modal.show();
        }
    </script>
@endpush
