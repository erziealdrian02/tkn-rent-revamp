@extends('layouts.app')

@section('title', 'General Ledger — EquipRent Enterprise')

@section('content')
<div class="page-header">
    <div class="page-header-left">
        <h2 class="page-header-title">General Ledger</h2>
        <p class="page-header-subtitle">Immutable cashflow log (Money In / Money Out)</p>
    </div>
    <div class="page-header-actions">
        <button class="btn btn-outline-secondary btn-sm" onclick="window.print()"><i class="bi bi-printer me-1"></i>Print Report</button>
    </div>
</div>

<div class="er-card mb-4">
    <div class="er-card-body pb-3">
        <form method="GET" action="{{ route('finance.ledger') }}" class="row g-2 align-items-center">
            <div class="col-md-auto">
                <label class="form-label mb-0 fw-500">Filter by Account:</label>
            </div>
            <div class="col-md-4">
                <select name="account_id" class="form-select form-select-sm" onchange="this.form.submit()">
                    <option value="">All Company Accounts</option>
                    @foreach($companyAccounts as $acc)
                        <option value="{{ $acc->id }}" {{ request('account_id') == $acc->id ? 'selected' : '' }}>
                            {{ $acc->bank_name }} - {{ $acc->account_number }}
                        </option>
                    @endforeach
                </select>
            </div>
        </form>
    </div>
</div>

<div class="er-card">
    <div class="er-card-body p-0">
        <div class="er-table-wrapper">
            <table class="er-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Account</th>
                        <th>Description</th>
                        <th>Amount (Rp)</th>
                        <th>Balance (Rp)</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($ledgerEntries as $entry)
                    <tr>
                        <td class="text-nowrap">{{ \Carbon\Carbon::parse($entry->transaction_date)->format('d M Y') }}</td>
                        <td>
                            @if($entry->entry_type === 'MONEY_IN')
                                <span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-arrow-down-left me-1"></i>IN</span>
                            @elseif($entry->entry_type === 'MONEY_OUT')
                                <span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="bi bi-arrow-up-right me-1"></i>OUT</span>
                            @else
                                <span class="badge bg-secondary-subtle text-secondary">{{ $entry->entry_type }}</span>
                            @endif
                        </td>
                        <td>{{ $entry->category }}</td>
                        <td>{{ $entry->companyAccount->bank_name ?? '-' }}</td>
                        <td>{{ $entry->description }}</td>
                        <td class="fw-600 {{ $entry->entry_type === 'MONEY_IN' ? 'text-success' : 'text-danger' }}">
                            {{ $entry->entry_type === 'MONEY_IN' ? '+' : '-' }} {{ number_format($entry->amount, 0, ',', '.') }}
                        </td>
                        <td class="fw-bold">
                            {{ number_format($entry->running_balance, 0, ',', '.') }}
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="text-center py-4 text-muted">No ledger entries found.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
