@extends('layouts.app')

@section('title', 'Maintenance Detail — EquipRent Enterprise')

@section('content')
<div class="er-card mb-4">
    <div class="detail-header">
        <div class="detail-header-left">
            <div class="detail-header-icon" style="background:var(--info-bg,#e0f2fe);color:var(--info,#0284c7)">
                <i class="bi bi-tools"></i>
            </div>
            <div class="detail-header-info">
                <h2>{{ substr($maintenance->id, 0, 8) }}
                    @if($maintenance->status === 'COMPLETED')
                        <span class="badge bg-success-subtle text-success">Completed</span>
                    @elseif($maintenance->status === 'IN_PROGRESS')
                        <span class="badge bg-warning-subtle text-warning">In Progress</span>
                    @else
                        <span class="badge bg-secondary-subtle text-secondary">{{ $maintenance->status }}</span>
                    @endif
                </h2>
                <div class="detail-meta">
                    <span class="detail-meta-item"><i class="bi bi-gear"></i>{{ $maintenance->equipment->name ?? '-' }}</span>
                    <span class="detail-meta-item"><i class="bi bi-building"></i>{{ $maintenance->branch->name ?? '-' }}</span>
                    <span class="detail-meta-item"><i class="bi bi-calendar"></i>{{ \Carbon\Carbon::parse($maintenance->start_date)->format('d M Y') }}</span>
                </div>
            </div>
        </div>
        <div class="detail-header-actions d-flex gap-2">
            @if($maintenance->status === 'IN_PROGRESS')
                <form action="{{ route('maintenance.complete', $maintenance->id) }}" method="POST">
                    @csrf
                    <button type="submit" class="btn btn-success btn-sm"><i class="bi bi-check-circle me-1"></i>Complete Maintenance</button>
                </form>
            @endif
        </div>
    </div>

    <div class="p-4">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        @if(session('error'))
            <div class="alert alert-danger">{{ session('error') }}</div>
        @endif

        <div class="row g-4">
            <div class="col-md-6">
                <div class="info-group">
                    <h5 class="info-group-title"><i class="bi bi-info-circle me-2"></i>Maintenance Details</h5>
                    <div class="info-row mt-3">
                        <span class="info-label">Equipment</span>
                        <span class="info-value fw-600">{{ $maintenance->equipment->name ?? '-' }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Quantity</span>
                        <span class="info-value">{{ $maintenance->quantity }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Branch</span>
                        <span class="info-value">{{ $maintenance->branch->name ?? '-' }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Type</span>
                        <span class="info-value">{{ $maintenance->type }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Start Date</span>
                        <span class="info-value">{{ \Carbon\Carbon::parse($maintenance->start_date)->format('d M Y') }}</span>
                    </div>
                    @if($maintenance->end_date)
                        <div class="info-row">
                            <span class="info-label">Completion Date</span>
                            <span class="info-value">{{ \Carbon\Carbon::parse($maintenance->end_date)->format('d M Y') }}</span>
                        </div>
                    @endif
                </div>
            </div>
            <div class="col-md-6">
                <div class="info-group">
                    <h5 class="info-group-title"><i class="bi bi-chat-text me-2"></i>Notes & Resolution</h5>
                    <div class="alert alert-secondary mt-3">
                        <h6 class="fw-600 mb-2"><i class="bi bi-info-circle me-1"></i>Initial Notes</h6>
                        <p class="mb-0 fs-14">{{ $maintenance->notes ?? 'No notes provided.' }}</p>
                    </div>
                    @if($maintenance->resolution_notes)
                        <div class="alert alert-success">
                            <h6 class="fw-600 mb-2"><i class="bi bi-check-circle me-1"></i>Resolution</h6>
                            <p class="mb-0 fs-14">{{ $maintenance->resolution_notes }}</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
