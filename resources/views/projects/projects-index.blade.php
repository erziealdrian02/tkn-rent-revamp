@extends('layouts.app')

@section('title', 'Projects — EquipRent Enterprise')

@section('content')
    <div class="page-header">
        <div class="page-header-left">
            <h2 class="page-header-title">Projects</h2>
            <p class="page-header-subtitle">Manage rental projects</p>
        </div>
        <div class="page-header-actions">
            <a href="{{ route('projects.create') }}" class="btn btn-primary btn-sm">
                <i class="bi bi-plus-lg me-1"></i>New Project
            </a>
        </div>
    </div>

    <div class="er-card">
        <div class="er-card-body">
            <div class="table-toolbar">
                <div class="table-toolbar-left">
                    <div class="table-search">
                        <i class="bi bi-search"></i>
                        <input type="text" placeholder="Search projects..." id="searchInput" oninput="filterData()">
                    </div>
                    <select class="filter-select" id="statusFilter" onchange="filterData()">
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PLANNING">Planning</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
            </div>

            <div class="er-table-wrapper">
                <table class="er-table">
                    <thead>
                        <tr>
                            <th>Project #</th>
                            <th>Project Name</th>
                            <th>Customer</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Rentals</th>
                            <th>Equipment</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody"></tbody>
                    @forelse ($projects as $project)
                        <tr>
                            <td>{{ $project->id }}</td>
                            <td>{{ $project->name }}</td>
                            <td>{{ $project->customer->name }}</td>
                            <td>{{ $project->start_date }}</td>
                            <td>{{ $project->end_date }}</td>
                            <td>{{ $project->rentals->count() }}</td>
                            <td>{{ $project->equipments->count() }}</td>
                            <td>{{ $project->status }}</td>
                            <td>
                                <a href="{{ route('projects.show', $project->id) }}">View</a>
                                <a href="{{ route('projects.edit', $project->id) }}">Edit</a>
                                <a href="{{ route('projects.destroy', $project->id) }}">Delete</a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="9" class="text-center">No projects found</td>
                        </tr>
                    @endforelse
                </table>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        initApp('projects', [{
            label: 'Rental',
            href: '#'
        }, {
            label: 'Projects'
        }], 'Projects');

        function filterData() {
            const q = document.getElementById('searchInput').value.toLowerCase();
            const s = document.getElementById('statusFilter').value;
            const data = MockData.projects.filter(p => {
                if (q && !p.id.toLowerCase().includes(q) && !p.name.toLowerCase().includes(q) && !p.customerName
                    .toLowerCase().includes(q)) return false;
                if (s && p.status !== s) return false;
                return true;
            });
            document.getElementById('tableBody').innerHTML = data.map(p => `<tr>
    <td><a href="project-detail?id=${p.id}" class="cell-link text-mono">${p.id}</a></td>
    <td><a href="project-detail?id=${p.id}" class="cell-link">${p.name}</a></td>
    <td>${p.customerName}</td><td>${formatDate(p.startDate)}</td><td>${formatDate(p.endDate)}</td>
    <td>${p.totalRentals}</td><td>${p.activeEquipment}</td><td>${statusBadge(p.status)}</td>
    <td><a href="project-detail?id=${p.id}" class="btn-action"><i class="bi bi-eye"></i></a></td>
  </tr>`).join('') || '<tr><td colspan="9" class="text-center text-muted py-4">No projects found</td></tr>';
        }
        filterData();
    </script>
@endpush
