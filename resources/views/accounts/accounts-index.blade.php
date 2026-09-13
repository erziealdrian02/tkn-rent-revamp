@extends('layouts.app')

@section('title', 'Accounts — EquipRent Enterprise')

@section('content')
    <div class="page-header">
        <div class="page-header-left">
            <h2 class="page-header-title">Bank Accounts</h2>
            <p class="page-header-subtitle">Manage company bank accounts for billing</p>
        </div>
        <div class="page-header-actions"><button class="btn btn-primary btn-sm" onclick="showToast('Add account','info')"><i
                    class="bi bi-plus-lg me-1"></i>Add Account</button></div>
    </div>
    <div class="er-card">
        <div class="er-card-body">
            <form action="{{ route('accounts.index') }}" method="GET" class="table-toolbar" id="filterForm">
                <div class="table-toolbar-left">
                    <div class="table-search">
                        <i class="bi bi-search"></i>
                        <input type="text" name="search" placeholder="Search accounts..." value="{{ request('search') }}" onkeypress="if(event.key === 'Enter') document.getElementById('filterForm').submit()">
                    </div>
                    <select class="filter-select" name="status" onchange="document.getElementById('filterForm').submit()">
                        <option value="">All Status</option>
                        <option value="ACTIVE" {{ request('status') === 'ACTIVE' ? 'selected' : '' }}>Active</option>
                        <option value="INACTIVE" {{ request('status') === 'INACTIVE' ? 'selected' : '' }}>Inactive</option>
                    </select>
                </div>
                <div class="table-toolbar-right">
                    <button type="submit" class="btn btn-primary btn-sm d-none">Filter</button>
                </div>
            </form>
            <div class="er-table-wrapper">
                <table class="er-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Account Name</th>
                            <th>Bank</th>
                            <th>Account Number</th>
                            <th>Holder Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    @forelse ($accounts as $account)
                        <tr>
                            <td class="text-mono">{{ $account->account_code }}</td>
                            <td><span class="fw-600">{{ $account->name }}</span></td>
                            <td>{{ $account->bank_name }}</td>
                            <td class="text-mono">{{ $account->account_number }}</td>
                            <td>{{ $account->account_name }}</td>
                            <td>
                                <span class="badge-status {{ $account->status === 'ACTIVE' ? 'available' : 'inactive' }}">
                                    {{ $account->status }}
                                </span>
                            </td>
                            <td>
                                <button type="button" class="btn-action border-0 bg-transparent"
                                    onclick="openEditAccountModal({{ json_encode($account) }})">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <form action="{{ route('accounts.destroy', $account->id) }}" method="POST"
                                    style="display:inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn-action border-0 bg-transparent"
                                        onclick="return confirm('Are you sure you want to delete {{ $account->name }}?')">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center">No accounts found</td>
                        </tr>
                    @endforelse
                </table>
            </div>
        </div>
    </div>

    <!-- Add Account Modal -->
    <div class="modal fade" id="addAccountModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="accountForm" class="needs-validation" method="POST" action="{{ route('accounts.store') }}">
                    @csrf
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Bank Account</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Account Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="name" required
                                    placeholder="e.g. BCA Operational">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Bank Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="bank_name" required placeholder="e.g. BCA">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Account Number <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control text-mono" name="account_number" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Account Holder Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="account_name" required
                                    placeholder="e.g. PT EquipRent Indonesia">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status</label>
                                <select class="form-select" name="status" required>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Account</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Account Modal -->
    <div class="modal fade" id="editAccountModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="editAccountForm" class="needs-validation" method="POST" action="">
                    @csrf
                    @method('PUT')
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Bank Account</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Account Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editAccName" name="name" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Bank Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editAccBank" name="bank_name" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Account Number <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control text-mono" id="editAccNumber"
                                    name="account_number" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Account Holder Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editAccHolder" name="account_name"
                                    required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Status</label>
                                <select class="form-select" id="editAccStatus" name="status" required>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
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
        initApp('accounts', [{
            label: 'Settings',
            href: '#'
        }, {
            label: 'Accounts'
        }], 'Bank Accounts');

        function showToast(message, type) {
            const modal = new bootstrap.Modal(document.getElementById('addAccountModal'));
            modal.show();
        }

        function openEditAccountModal(account) {
            document.getElementById('editAccountForm').action = `/accounts/${account.id}`;
            document.getElementById('editAccName').value = account.name;
            document.getElementById('editAccBank').value = account.bank_name;
            document.getElementById('editAccNumber').value = account.account_number;
            document.getElementById('editAccHolder').value = account.account_name;
            document.getElementById('editAccStatus').value = account.status;

            const modal = new bootstrap.Modal(document.getElementById('editAccountModal'));
            modal.show();
        }
    </script>
@endpush
