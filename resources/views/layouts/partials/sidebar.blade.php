@php
    $user = Auth::user();
    $role = $user?->roles?->first()?->name ?? 'Admin';
    $isDriver = $role === 'Driver';
@endphp

<div class="sidebar-brand">
    <div class="sidebar-brand-icon"><i class="bi bi-gear-wide-connected"></i></div>
    <div class="sidebar-brand-text">EquipRent<small>Enterprise v1.0</small></div>
</div>

<nav class="sidebar-nav">
    @if($isDriver)
        <a href="{{ route('driver.dashboard') }}"
           class="sidebar-link {{ request()->routeIs('driver.dashboard') ? 'active' : '' }}">
            <i class="bi bi-speedometer2"></i>Dashboard
        </a>
        <a href="{{ route('driver.deliveries.index') }}"
           class="sidebar-link {{ request()->routeIs('driver.deliveries.*') ? 'active' : '' }}">
            <i class="bi bi-truck"></i>My Deliveries
        </a>
    @else
        <a href="{{ route('dashboard') }}"
           class="sidebar-link {{ request()->routeIs('dashboard') ? 'active' : '' }}">
            <i class="bi bi-speedometer2"></i>Dashboard
        </a>

        <div class="sidebar-section"><div class="sidebar-section-title">RENTAL</div></div>
        <a href="{{ route('rentals.index') }}"
           class="sidebar-link {{ request()->routeIs('rentals.*') ? 'active' : '' }}">
            <i class="bi bi-file-earmark-text"></i>Rentals
        </a>
        <a href="{{ route('projects.index') }}"
           class="sidebar-link {{ request()->routeIs('projects.*') ? 'active' : '' }}">
            <i class="bi bi-folder"></i>Projects
        </a>
        <a href="{{ route('deliveries.index') }}"
           class="sidebar-link {{ request()->routeIs('deliveries.*') ? 'active' : '' }}">
            <i class="bi bi-truck"></i>Deliveries
        </a>
        <a href="{{ route('returns.index') }}"
           class="sidebar-link {{ request()->routeIs('returns.*') ? 'active' : '' }}">
            <i class="bi bi-box-arrow-in-left"></i>Returns
        </a>
        <a href="{{ route('claims.index') }}"
           class="sidebar-link {{ request()->routeIs('claims.*') ? 'active' : '' }}">
            <i class="bi bi-exclamation-triangle"></i>Claims
        </a>

        <div class="sidebar-section"><div class="sidebar-section-title">INVENTORY</div></div>
        <a href="{{ route('equipment.index') }}"
           class="sidebar-link {{ request()->routeIs('equipment.*') ? 'active' : '' }}">
            <i class="bi bi-tools"></i>Equipment
        </a>
        <a href="{{ route('branches.index') }}"
           class="sidebar-link {{ request()->routeIs('branches.*') ? 'active' : '' }}">
            <i class="bi bi-building"></i>Branches
        </a>
        <a href="{{ route('stock.index') }}"
           class="sidebar-link {{ request()->routeIs('stock.index') ? 'active' : '' }}">
            <i class="bi bi-boxes"></i>Stock
        </a>
        <a href="{{ route('stock.transfer') }}"
           class="sidebar-link {{ request()->routeIs('stock.transfer*') ? 'active' : '' }}">
            <i class="bi bi-arrow-left-right"></i>Stock Transfer
        </a>
        <a href="{{ route('movements.index') }}"
           class="sidebar-link {{ request()->routeIs('movements.*') ? 'active' : '' }}">
            <i class="bi bi-arrow-left-right"></i>Movements
        </a>
        <a href="{{ route('purchases.index') }}"
           class="sidebar-link {{ request()->routeIs('purchases.*') ? 'active' : '' }}">
            <i class="bi bi-cart"></i>Purchases
        </a>
        <a href="{{ route('goods-receipts.index') }}"
           class="sidebar-link {{ request()->routeIs('goods-receipts.*') ? 'active' : '' }}">
            <i class="bi bi-box-seam"></i>Goods Receipts
        </a>
        <a href="{{ route('repairs.index') }}"
           class="sidebar-link {{ request()->routeIs('repairs.*') ? 'active' : '' }}">
            <i class="bi bi-tools"></i>Repairs
        </a>
        <a href="{{ route('maintenance.index') }}"
           class="sidebar-link {{ request()->routeIs('maintenance.*') ? 'active' : '' }}">
            <i class="bi bi-wrench-adjustable"></i>Maintenance
        </a>

        <div class="sidebar-section"><div class="sidebar-section-title">MASTER DATA</div></div>
        <a href="{{ route('customers.index') }}"
           class="sidebar-link {{ request()->routeIs('customers.*') ? 'active' : '' }}">
            <i class="bi bi-people"></i>Customers
        </a>
        <a href="{{ route('drivers.index') }}"
           class="sidebar-link {{ request()->routeIs('drivers.*') ? 'active' : '' }}">
            <i class="bi bi-person-badge"></i>Drivers
        </a>
        <a href="{{ route('vehicles.index') }}"
           class="sidebar-link {{ request()->routeIs('vehicles.*') ? 'active' : '' }}">
            <i class="bi bi-truck-front"></i>Vehicles
        </a>
        <a href="{{ route('accounts.index') }}"
           class="sidebar-link {{ request()->routeIs('accounts.*') ? 'active' : '' }}">
            <i class="bi bi-bank"></i>Company Accounts
        </a>

        <div class="sidebar-section"><div class="sidebar-section-title">FINANCE &amp; BILLING</div></div>
        <a href="{{ route('invoices.index') }}"
           class="sidebar-link {{ request()->routeIs('invoices.*') ? 'active' : '' }}">
            <i class="bi bi-receipt"></i>Invoices
        </a>
        <a href="{{ route('finance.ledger') }}"
           class="sidebar-link {{ request()->routeIs('finance.ledger') ? 'active' : '' }}">
            <i class="bi bi-wallet2"></i>Bank Ledger
        </a>

        <div class="sidebar-section"><div class="sidebar-section-title">ADMINISTRATION</div></div>
        <a href="{{ route('admin.users') }}"
           class="sidebar-link {{ request()->routeIs('admin.users') ? 'active' : '' }}">
            <i class="bi bi-person-gear"></i>Users
        </a>
        <a href="{{ route('admin.roles') }}"
           class="sidebar-link {{ request()->routeIs('admin.roles*') ? 'active' : '' }}">
            <i class="bi bi-shield-lock"></i>Roles
        </a>
    @endif
</nav>

<div class="sidebar-footer">
    <div class="sidebar-user">
        <div class="sidebar-user-avatar">{{ $user?->initials ?? 'U' }}</div>
        <div class="sidebar-user-info">
            <div class="sidebar-user-name">{{ $user?->name ?? 'User' }}</div>
            <div class="sidebar-user-role">{{ $role }}</div>
        </div>
    </div>
    <div class="sidebar-footer-actions">
        <button class="sidebar-footer-btn" onclick="toggleTheme()" title="Toggle Theme">
            <i class="bi bi-moon" id="themeIcon"></i>
            <span id="themeLabel">Dark Mode</span>
        </button>
        <button class="sidebar-footer-btn ms-auto" onclick="logout()" title="Logout">
            <i class="bi bi-box-arrow-left"></i>
            <span>Logout</span>
        </button>
    </div>
</div>
