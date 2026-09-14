@extends('layouts.app')

@section('title', 'Create Purchase Order — EquipRent Enterprise')

@section('content')
    <div class="page-header">
        <div class="page-header-left">
            <h2 class="page-header-title">Create Purchase Order</h2>
            <p class="page-header-subtitle">Procure new equipment from vendor</p>
        </div>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form id="purchaseForm" class="needs-validation" method="POST" action="{{ route('purchases.store') }}" novalidate>
        <!-- Workflow Diagram -->
        <div class="er-card mb-4">
            <div class="er-card-body pb-2">
                <div class="workflow-timeline">
                    <div class="workflow-step active">
                        <div class="workflow-icon"><i class="bi bi-file-earmark-plus"></i></div>
                        <div class="workflow-label">Purchase<br>Created</div>
                    </div>
                    <div class="workflow-step">
                        <div class="workflow-icon"><i class="bi bi-person-check"></i></div>
                        <div class="workflow-label">Approval</div>
                    </div>
                    <div class="workflow-step">
                        <div class="workflow-icon"><i class="bi bi-cart-check"></i></div>
                        <div class="workflow-label">Ordered</div>
                    </div>
                    <div class="workflow-step">
                        <div class="workflow-icon"><i class="bi bi-truck"></i></div>
                        <div class="workflow-label">In Transit</div>
                    </div>
                    <div class="workflow-step">
                        <div class="workflow-icon"><i class="bi bi-box-seam"></i></div>
                        <div class="workflow-label">Goods<br>Arrived</div>
                    </div>
                    <div class="workflow-step">
                        <div class="workflow-icon"><i class="bi bi-graph-up"></i></div>
                        <div class="workflow-label">Stock<br>Increased</div>
                    </div>
                    <div class="workflow-step">
                        <div class="workflow-icon"><i class="bi bi-check-circle"></i></div>
                        <div class="workflow-label">Completed</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-lg-8">
                <div class="er-card mb-4">
                    <div class="er-card-header">
                        <h5 class="er-card-title">1. Purchase Information</h5>
                    </div>
                    <div class="er-card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label form-label-er">Purchase Number</label>
                                <input type="text" class="form-control bg-light text-mono" id="poId" readonly>
                            </div>
                            <div class="col-md-8">
                                <label class="form-label form-label-er">Supplier Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" name="vendor_name" class="form-control" id="supplierName" required
                                    placeholder="e.g. PT Sumber Generator">
                                <div class="invalid-feedback">Supplier name is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Supplier Contact</label>
                                <input type="text" class="form-control" id="supplierContact">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Destination Branch <span
                                        class="text-danger">*</span></label>
                                <select class="form-select" name="branch_id" id="destBranch" required>
                                    <option value="">Select branch...</option>
                                    @foreach ($branches as $branch)
                                        <option value="{{ $branch->id }}">{{ $branch->name }}</option>
                                    @endforeach
                                </select>
                                <div class="invalid-feedback">Destination branch is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Purchase Date <span
                                        class="text-danger">*</span></label>
                                <input type="date" name="order_date" class="form-control" id="poDate" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label form-label-er">Expected Arrival Date</label>
                                <input type="date" name="arrival_date" class="form-control" id="expectedDate">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="er-card mb-4">
                    <div class="er-card-header d-flex justify-content-between align-items-center">
                        <h5 class="er-card-title mb-0">2. Purchase Items</h5>
                        <button type="button" class="btn btn-outline-primary btn-sm" onclick="addItem()"><i
                                class="bi bi-plus-lg me-1"></i>Add Item</button>
                    </div>
                    <div class="er-card-body p-0">
                        <div class="er-table-wrapper">
                            <table class="er-table" id="itemsTable">
                                <thead>
                                    <tr>
                                        <th>Equipment / Description</th>
                                        <th style="width:100px">Qty</th>
                                        <th style="width:200px">Unit Price (Rp)</th>
                                        <th style="width:200px">Subtotal (Rp)</th>
                                        <th style="width:50px"></th>
                                    </tr>
                                </thead>
                                <tbody id="itemsBody">
                                    <!-- Items injected here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="er-card mb-4" style="position: sticky; top: 80px;">
                    <div class="er-card-header">
                        <h5 class="er-card-title">3. Financial Summary</h5>
                    </div>
                    <div class="er-card-body">
                        <div class="row g-3 mb-4">
                            <div class="col-12">
                                <label class="form-label form-label-er">Payment Account <span
                                        class="text-danger">*</span></label>
                                <select class="form-select" id="payAccount" required>
                                    <option value="">Select company account...</option>
                                </select>
                                <div class="invalid-feedback">Payment account is required.</div>
                            </div>
                            <div class="col-12">
                                <label class="form-label form-label-er">Purchase Status</label>
                                <select class="form-select" id="poStatus">
                                    <option value="Draft">Draft</option>
                                    <option value="Requested">Requested</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Ordered">Ordered</option>
                                </select>
                            </div>
                        </div>

                        <div class="info-grid mb-4" style="grid-template-columns: 1fr;">
                            <div class="info-item d-flex justify-content-between align-items-center">
                                <span class="info-label mb-0">Subtotal</span>
                                <span class="info-value text-end" id="sumSubtotal">Rp 0</span>
                            </div>
                            <div class="info-item">
                                <label class="info-label w-100 mb-1">Discount</label>
                                <input type="number" class="form-control form-control-sm text-end" id="discount"
                                    value="0" oninput="calculateTotals()">
                            </div>
                            <div class="info-item">
                                <label class="info-label w-100 mb-1">Tax</label>
                                <input type="number" class="form-control form-control-sm text-end" id="tax"
                                    value="0" oninput="calculateTotals()">
                            </div>
                            <div class="info-item">
                                <label class="info-label w-100 mb-1">Shipping Cost</label>
                                <input type="number" class="form-control form-control-sm text-end" id="shipping"
                                    value="0" oninput="calculateTotals()">
                            </div>
                            <hr class="my-2">
                            <div class="info-item d-flex justify-content-between align-items-center">
                                <span class="info-label mb-0 fw-600 text-dark">Grand Total</span>
                                <span class="info-value text-end fs-18 fw-700 text-primary" id="sumGrandTotal">Rp 0</span>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-outline-secondary"
                                onclick="cancelCreate()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Create Purchase</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>

    {{-- <form method="POST" action="{{ route('purchases.store') }}">
        @csrf
        <div class="er-card mb-4">
            <div class="er-card-body">
                <h5 class="fw-bold mb-4"><i class="bi bi-cart me-2"></i>PO Details</h5>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label form-label-er">Vendor Name *</label>
                        <input type="text" name="vendor_name" class="form-control" value="{{ old('vendor_name') }}"
                            required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label form-label-er">Expected Delivery</label>
                        <input type="date" name="expected_delivery" class="form-control"
                            value="{{ old('expected_delivery') }}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label form-label-er">Equipment *</label>
                        <select name="equipment_id" class="form-select" required>
                            <option value="">Select Equipment</option>
                            @foreach ($equipment as $eq)
                                <option value="{{ $eq->id }}" {{ old('equipment_id') == $eq->id ? 'selected' : '' }}>
                                    {{ $eq->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label form-label-er">Quantity *</label>
                        <input type="number" name="qty_ordered" class="form-control" min="1"
                            value="{{ old('qty_ordered', 1) }}" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label form-label-er">Unit Price (Rp) *</label>
                        <input type="number" name="unit_price" class="form-control" min="0"
                            value="{{ old('unit_price', 0) }}" required>
                    </div>
                    <div class="col-12">
                        <label class="form-label form-label-er">Notes</label>
                        <textarea name="notes" class="form-control" rows="3">{{ old('notes') }}</textarea>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-between">
            <a href="{{ route('purchases.index') }}" class="btn btn-outline-secondary"><i
                    class="bi bi-arrow-left me-1"></i>Back</a>
            <button type="submit" class="btn btn-primary"><i class="bi bi-save me-1"></i>Create PO</button>
        </div>
    </form> --}}
@endsection

@push('scripts')
    <script>
        initApp('purchase-create', [{
            label: 'Inventory',
            href: '#'
        }, {
            label: 'Purchases',
            href: "{{ route('purchases.index') }}"
        }, {
            label: 'New Purchase'
        }], 'Create New Purchase');

        // Set default date
        document.getElementById('poDate').value = new Date().toISOString().split('T')[0];

        let formDirty = false;
        document.getElementById('purchaseForm').addEventListener('input', () => formDirty = true);

        const equipmentList = @json($equipment);
        let items = [];
        let itemCounter = 0;

        function addItem() {
            const id = itemCounter++;
            items.push({
                id,
                equipment_id: '',
                qty: 1,
                price: 0
            });
            renderItems();
            formDirty = true;
        }

        function removeItem(id) {
            items = items.filter(i => i.id !== id);
            renderItems();
            calculateTotals();
        }

        function updateItem(id, field, value) {
            const item = items.find(i => i.id === id);
            if (item) {
                if (field === 'qty' || field === 'price') {
                    item[field] = parseFloat(value) || 0;
                } else {
                    item[field] = value;
                }
                calculateTotals();
            }
        }

        function renderItems() {
            const tbody = document.getElementById('itemsBody');
            if (items.length === 0) {
                tbody.innerHTML =
                    '<tr><td colspan="5" class="text-center py-4 text-muted">No items added. Click "Add Item" to begin.</td></tr>';
                return;
            }
            tbody.innerHTML = items.map((item, index) => {
                let options = '<option value="">Select Equipment...</option>';
                equipmentList.forEach(eq => {
                    options +=
                        `<option value="${eq.id}" ${item.equipment_id === eq.id ? 'selected' : ''}>${eq.name}</option>`;
                });

                return `
        <tr>
          <td>
            <select class="form-select form-select-sm" name="items[${index}][equipment_id]" onchange="updateItem(${item.id}, 'equipment_id', this.value)" required>
                ${options}
            </select>
          </td>
          <td><input type="number" name="items[${index}][qty_ordered]" class="form-control form-control-sm text-center" value="${item.qty}" min="1" oninput="updateItem(${item.id}, 'qty', this.value)" required></td>
          <td><input type="number" name="items[${index}][unit_price]" class="form-control form-control-sm text-end" value="${item.price}" min="0" oninput="updateItem(${item.id}, 'price', this.value)" required></td>
          <td class="text-end fw-600 align-middle">Rp ${(item.qty * item.price).toLocaleString('id-ID')}</td>
          <td class="text-center align-middle"><button type="button" class="btn-action text-danger" onclick="removeItem(${item.id})"><i class="bi bi-trash"></i></button></td>
        </tr>
      `
            }).join('');
        }

        function calculateTotals() {
            const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
            const discount = parseFloat(document.getElementById('discount').value) || 0;
            const tax = parseFloat(document.getElementById('tax').value) || 0;
            const shipping = parseFloat(document.getElementById('shipping').value) || 0;

            const grandTotal = subtotal - discount + tax + shipping;

            document.getElementById('sumSubtotal').textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
            document.getElementById('sumGrandTotal').textContent = 'Rp ' + grandTotal.toLocaleString('id-ID');
        }

        function cancelCreate() {
            if (formDirty && !confirm("Are you sure you want to leave? Your unsaved changes will be lost.")) {
                return;
            }
            window.location.href = "{{ route('purchases.index') }}";
        }

        document.getElementById('purchaseForm').addEventListener('submit', function(e) {
            if (!this.checkValidity() || items.length === 0) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.add('was-validated');
                if (items.length === 0) alert('Please add at least one item.');
                return;
            }
            // Allow default form submission to Laravel Backend
            formDirty = false;
        });

        window.addEventListener('beforeunload', function(e) {
            if (formDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        });

        // Initialize one empty item
        addItem();
    </script>
@endpush
