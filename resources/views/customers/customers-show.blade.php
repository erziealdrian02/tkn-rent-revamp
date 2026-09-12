@extends('layouts.app')

@section('title', 'Customer Detail — EquipRent Enterprise')

@section('content')
    <div class="er-card mb-4">
        <div class="detail-header">
            <div class="detail-header-left">
                <div class="detail-header-icon"><i class="bi bi-building"></i></div>
                <div class="detail-header-info">
                    <h2>{{ $customer->name }} 
                        @if ($customer->status === 'ACTIVE')
                            <span class="badge bg-success-subtle text-success">Active</span>
                        @else
                            <span class="badge bg-secondary-subtle text-secondary">Inactive</span>
                        @endif
                    </h2>
                    <div class="detail-meta">
                        <span class="detail-meta-item"><i class="bi bi-hash"></i>{{ substr($customer->id, 0, 8) }}</span>
                        <span class="detail-meta-item"><i class="bi bi-person"></i>{{ $customer->pic_name ?? '-' }}</span>
                        <span class="detail-meta-item"><i class="bi bi-telephone"></i>{{ $customer->contact ?? '-' }}</span>
                    </div>
                </div>
            </div>
            <div class="detail-header-actions">
                <button class="btn btn-outline-secondary btn-sm" onclick="window.location='{{ route('customers.index') }}'"><i class="bi bi-arrow-left me-1"></i>Back</button>
            </div>
        </div>
        
        <div class="er-tabs">
            <button class="er-tab active" data-tab="profile" onclick="switchTab('profile')">Profile</button>
            <button class="er-tab" data-tab="projects" onclick="switchTab('projects')">Projects <span class="er-tab-count">{{ $customer->projects->count() ?? 0 }}</span></button>
            <button class="er-tab" data-tab="rentals" onclick="switchTab('rentals')">Rentals</button>
        </div>
        
        <div id="tabContents">
            <div class="er-tab-content active" id="tab-profile">
                <div class="info-grid">
                    <div class="info-item"><span class="info-label">Customer ID</span><span class="info-value text-mono">{{ substr($customer->id, 0, 8) }}</span></div>
                    <div class="info-item"><span class="info-label">Company Name</span><span class="info-value fw-600">{{ $customer->name }}</span></div>
                    <div class="info-item"><span class="info-label">Person In Charge (PIC)</span><span class="info-value">{{ $customer->pic_name ?? '-' }}</span></div>
                    <div class="info-item"><span class="info-label">Phone</span><span class="info-value">{{ $customer->contact ?? '-' }}</span></div>
                    <div class="info-item"><span class="info-label">Email</span><span class="info-value"><a href="mailto:{{ $customer->email }}">{{ $customer->email ?? '-' }}</a></span></div>
                    <div class="info-item" style="grid-column:1/-1"><span class="info-label">Address</span><span class="info-value">{{ $customer->address ?? '-' }}</span></div>
                </div>
            </div>
            
            <div class="er-tab-content" id="tab-projects">
                <div class="er-table-wrapper">
                    <table class="er-table">
                        <thead>
                            <tr>
                                <th>Project #</th>
                                <th>Project Name</th>
                                <th>Dates</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($customer->projects as $p)
                                <tr>
                                    <td><a href="{{ route('projects.show', $p->id) }}" class="cell-link text-mono">{{ substr($p->id, 0, 8) }}</a></td>
                                    <td>{{ $p->name }}</td>
                                    <td>{{ $p->start_date }} - {{ $p->end_date ?? 'Present' }}</td>
                                    <td>
                                        @if ($p->status === 'ACTIVE')
                                            <span class="badge bg-success-subtle text-success">Active</span>
                                        @elseif($p->status === 'COMPLETED')
                                            <span class="badge bg-secondary-subtle text-secondary">Completed</span>
                                        @else
                                            <span class="badge bg-warning-subtle text-warning">{{ $p->status }}</span>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr><td colspan="4" class="text-center text-muted py-4">No projects</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="er-tab-content" id="tab-rentals">
                <div class="er-table-wrapper">
                    <table class="er-table">
                        <thead>
                            <tr>
                                <th>Rental #</th>
                                <th>Project</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @php
                                $rentals = $customer->projects->flatMap->rentals;
                            @endphp
                            @forelse($rentals as $r)
                                <tr>
                                    <td><a href="{{ route('rentals.show', $r->id) }}" class="cell-link text-mono">{{ substr($r->id, 0, 8) }}</a></td>
                                    <td><a href="{{ route('projects.show', $r->project_id) }}" class="cell-link">{{ $r->project->name ?? '-' }}</a></td>
                                    <td>{{ $r->start_date }}</td>
                                    <td>
                                        @if ($r->status === 'ON_RENTAL' || $r->status === 'COMPLETED')
                                            <span class="badge bg-success-subtle text-success">{{ $r->status }}</span>
                                        @else
                                            <span class="badge bg-secondary-subtle text-secondary">{{ $r->status }}</span>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr><td colspan="4" class="text-center text-muted py-4">No rentals</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
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
            label: 'Customers',
            href: '{{ route('customers.index') }}'
        }, {
            label: '{{ $customer->name }}'
        }], '{{ $customer->name }}');
    </script>
@endpush
