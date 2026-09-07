@extends('layouts.app')

@section('title', 'Dashboard — EquipRent Enterprise')

@section('content')
        <!-- KPI Cards -->
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
                    <thead><tr><th>Rental</th><th>Customer</th><th>Status</th></tr></thead>
                    <tbody>
                        @forelse($recentRentals as $rental)
                        <tr>
                            <td><a href="{{ route('rentals.show', $rental->id) }}" class="cell-link text-mono">{{ substr($rental->id, 0, 8) }}</a></td>
                            <td>{{ $rental->project->customer->name ?? '-' }}</td>
                            <td><span class="badge bg-secondary">{{ $rental->status }}</span></td>
                        </tr>
                        @empty
                        <tr><td colspan="3" class="text-center text-muted">No recent rentals</td></tr>
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
                    <thead><tr><th>Invoice</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                        @forelse($recentInvoices as $invoice)
                        <tr>
                            <td><a href="{{ route('invoices.show', $invoice->id) }}" class="cell-link text-mono">{{ $invoice->invoice_number }}</a></td>
                            <td>{{ $invoice->customer->name ?? '-' }}</td>
                            <td>Rp {{ number_format($invoice->total_amount, 0, ',', '.') }}</td>
                            <td><span class="badge bg-secondary">{{ $invoice->status }}</span></td>
                        </tr>
                        @empty
                        <tr><td colspan="4" class="text-center text-muted">No recent invoices</td></tr>
                        @endforelse
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
@endsection
