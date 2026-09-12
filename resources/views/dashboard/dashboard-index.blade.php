@extends('layouts.app')

@section('title', 'Dashboard — EquipRent Enterprise')

@section('content')

    {{-- KPI Cards --}}
    <div class="kpi-grid">
        <div class="kpi-card">
            <div class="kpi-icon blue"><i class="bi bi-file-earmark-text"></i></div>
            <div class="kpi-content">
                <div class="kpi-value">{{ $activeRentals }}</div>
                <div class="kpi-label">Active Rentals</div>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-icon purple"><i class="bi bi-tools"></i></div>
            <div class="kpi-content">
                <div class="kpi-value">{{ $totalEquipment }}</div>
                <div class="kpi-label">Equipment Types</div>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-icon warning"><i class="bi bi-cash-coin"></i></div>
            <div class="kpi-content">
                <div class="kpi-value fs-5">Rp {{ number_format($outstandingInvoices, 0, ',', '.') }}</div>
                <div class="kpi-label">Outstanding Invoices</div>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-icon success"><i class="bi bi-graph-up-arrow"></i></div>
            <div class="kpi-content">
                <div class="kpi-value text-success fw-bold fs-5">Rp {{ number_format($monthlyRevenue, 0, ',', '.') }}</div>
                <div class="kpi-label">Monthly Revenue</div>
            </div>
        </div>
    </div>

    {{-- Charts Row --}}
    <div class="row g-3 mb-4 mt-2">
        <div class="col-lg-4">
            <div class="er-card">
                <div class="er-card-header">
                    <h5 class="er-card-title">Rental Status</h5>
                </div>
                <div class="er-card-body" style="height:260px;display:flex;align-items:center;justify-content:center;">
                    <canvas id="rentalStatusChart"></canvas>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="er-card">
                <div class="er-card-header">
                    <h5 class="er-card-title">Equipment Utilization</h5>
                </div>
                <div class="er-card-body" style="height:260px;display:flex;align-items:center;justify-content:center;">
                    <canvas id="equipUtilChart"></canvas>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="er-card">
                <div class="er-card-header">
                    <h5 class="er-card-title">Invoice Summary</h5>
                </div>
                <div class="er-card-body" style="height:260px;display:flex;align-items:center;justify-content:center;">
                    <canvas id="invoiceChart"></canvas>
                </div>
            </div>
        </div>
    </div>

    {{-- Recent Tables --}}
    <div class="row g-3 mb-4 mt-2">
        <div class="col-lg-6">
            <div class="er-card">
                <div class="er-card-header">
                    <h5 class="er-card-title"><i class="bi bi-clock-history me-1"></i> Recent Rentals</h5>
                    <a href="{{ route('rentals.index') }}" class="fs-12">View All</a>
                </div>
                <div class="er-card-body p-0">
                    <div class="er-table-wrapper">
                        <table class="er-table">
                            <thead>
                                <tr>
                                    <th>Rental</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($recentRentals as $rental)
                                    <tr>
                                        <td><a href="{{ route('rentals.show', $rental->id) }}"
                                                class="cell-link text-mono">{{ substr($rental->id, 0, 8) }}</a></td>
                                        <td>{{ $rental->project?->customer?->name ?? '-' }}</td>
                                        <td><span class="badge bg-secondary">{{ $rental->status }}</span></td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="3" class="text-center text-muted py-3">No recent rentals</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="er-card">
                <div class="er-card-header">
                    <h5 class="er-card-title"><i class="bi bi-receipt me-1"></i> Recent Invoices</h5>
                    <a href="{{ route('invoices.index') }}" class="fs-12">View All</a>
                </div>
                <div class="er-card-body p-0">
                    <div class="er-table-wrapper">
                        <table class="er-table">
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($recentInvoices as $invoice)
                                    <tr>
                                        <td><a href="{{ route('invoices.show', $invoice->id) }}"
                                                class="cell-link text-mono">{{ $invoice->invoice_number }}</a></td>
                                        <td>{{ $invoice->customer?->name ?? '-' }}</td>
                                        <td>Rp {{ number_format($invoice->total_amount, 0, ',', '.') }}</td>
                                        <td><span class="badge bg-secondary">{{ $invoice->status }}</span></td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="text-center text-muted py-3">No recent invoices</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@push('scripts')
    <script>
        const chartFontColor = () => getComputedStyle(document.documentElement)
            .getPropertyValue('--text-secondary')
            .trim() || '#475569';

        const gridColor = () => getComputedStyle(document.documentElement)
            .getPropertyValue('--border-color')
            .trim() || '#e2e8f0';

        // =========================================================
        // Rental Status
        // =========================================================
        @php
            $rentalStatusData = $rentalStatusData ?? [
                'DRAFT' => 0,
                'APPROVED' => 0,
                'ON_RENTAL' => 0,
                'COMPLETED' => 0,
                'CANCELLED' => 0,
            ];
        @endphp

        const rentalData = @json($rentalStatusData);

        new Chart(document.getElementById('rentalStatusChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(rentalData),
                datasets: [{
                    data: Object.values(rentalData),
                    backgroundColor: [
                        '#94a3b8',
                        '#2563eb',
                        '#7c3aed',
                        '#16a34a',
                        '#dc2626'
                    ],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 8,
                            font: {
                                size: 11
                            },
                            color: chartFontColor()
                        }
                    }
                }
            }
        });

        // =========================================================
        // Equipment Utilization
        // =========================================================
        const equipData = @json($equipUtilData ?? []);

        if (Object.keys(equipData).length > 0) {
            new Chart(document.getElementById('equipUtilChart'), {
                type: 'bar',
                data: {
                    labels: Object.keys(equipData),
                    datasets: [{
                            label: 'Available',
                            data: Object.values(equipData).map(d => d.available || 0),
                            backgroundColor: '#16a34a'
                        },
                        {
                            label: 'On Rental',
                            data: Object.values(equipData).map(d => d.on_rental || 0),
                            backgroundColor: '#7c3aed'
                        },
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true,
                            ticks: {
                                font: {
                                    size: 10
                                },
                                color: chartFontColor()
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            stacked: true,
                            ticks: {
                                font: {
                                    size: 10
                                },
                                color: chartFontColor()
                            },
                            grid: {
                                color: gridColor()
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                padding: 8,
                                font: {
                                    size: 11
                                },
                                color: chartFontColor()
                            }
                        }
                    }
                }
            });
        } else {
            document.getElementById('equipUtilChart').closest('.er-card-body').innerHTML =
                '<div class="empty-state py-4"><i class="bi bi-bar-chart"></i><p class="mb-0 mt-2 fs-12 text-muted">No equipment data</p></div>';
        }

        // =========================================================
        // Invoice Summary
        // =========================================================
        @php
            $invoiceStatusData = $invoiceStatusData ?? [
                'DRAFT' => 0,
                'ISSUED' => 0,
                'PARTIAL' => 0,
                'PAID' => 0,
                'CANCELLED' => 0,
            ];
        @endphp

        const invoiceData = @json($invoiceStatusData);

        new Chart(document.getElementById('invoiceChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(invoiceData),
                datasets: [{
                    data: Object.values(invoiceData),
                    backgroundColor: [
                        '#94a3b8',
                        '#2563eb',
                        '#d97706',
                        '#16a34a',
                        '#dc2626'
                    ],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 8,
                            font: {
                                size: 11
                            },
                            color: chartFontColor()
                        }
                    }
                }
            }
        });
    </script>
@endpush
