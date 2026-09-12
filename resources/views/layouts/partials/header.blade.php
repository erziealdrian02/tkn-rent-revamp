@php
    $user = Auth::user();
    $headerBreadcrumbs = $headerBreadcrumbs ?? [];
    $headerTitle = $headerTitle ?? '';
@endphp

<button class="header-toggle-btn" onclick="toggleSidebar()" id="sidebarToggle">
    <i class="bi bi-list"></i>
</button>

<div class="header-left">
    <div class="header-breadcrumb">
        <a href="{{ route('dashboard') }}"><i class="bi bi-house"></i></a>
        @foreach($headerBreadcrumbs as $bc)
            <span class="separator"><i class="bi bi-chevron-right"></i></span>
            @if(!empty($bc['href']))
                <a href="{{ $bc['href'] }}">{{ $bc['label'] }}</a>
            @else
                <span>{{ $bc['label'] }}</span>
            @endif
        @endforeach
    </div>
    <h1 class="header-title">{{ $headerTitle }}</h1>
</div>

<div class="header-right">
    <div class="header-search">
        <i class="bi bi-search header-search-icon"></i>
        <input type="text" class="header-search-input" placeholder="Search... (Ctrl+K)"
               id="globalSearchInput" onclick="openGlobalSearch()" readonly>
    </div>
    <div style="position:relative">
        <button class="header-icon-btn" onclick="toggleNotifications()" id="notifBtn">
            <i class="bi bi-bell"></i>
            <span class="badge-dot"></span>
        </button>
        <div class="notification-dropdown" id="notifDropdown">
            <div class="notification-header">
                <h6>Notifications</h6>
                <a href="#" class="fs-12" onclick="markAllRead()">Mark all read</a>
            </div>
            <div class="notification-list" id="notifList">
                <div class="notification-item text-center py-3 text-muted fs-12">
                    No new notifications
                </div>
            </div>
        </div>
    </div>
    <div class="dropdown">
        <button class="header-user-btn" data-bs-toggle="dropdown">
            <div class="header-user-avatar">{{ $user?->initials ?? 'U' }}</div>
            <span class="header-user-name">{{ $user?->name ?? 'User' }}</span>
            <i class="bi bi-chevron-down fs-11"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Profile</a></li>
            <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
            <li><hr class="dropdown-divider"></li>
            <li>
                <a class="dropdown-item" href="#" onclick="logout()">
                    <i class="bi bi-box-arrow-left me-2"></i>Logout
                </a>
            </li>
        </ul>
    </div>
</div>
