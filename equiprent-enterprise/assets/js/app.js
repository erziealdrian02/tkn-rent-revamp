/* ============================================================
   EquipRent Enterprise — Shared Application Logic
   ============================================================ */

// ---- AUTH ----
function checkAuth() {
  const user = JSON.parse(sessionStorage.getItem('er_user') || 'null');
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

function logout() {
  sessionStorage.removeItem('er_user');
  window.location.href = 'login.html';
}

// ---- THEME ----
function initTheme() {
  const saved = localStorage.getItem('er_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  return saved;
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('er_theme', next);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.className = next === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
}

// ---- CURRENCY ----
function formatRupiah(num) {
  if (num == null) return '-';
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function formatNumber(num) {
  if (num == null) return '0';
  return Number(num).toLocaleString('id-ID');
}

// ---- DATE ----
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  if (dateStr.includes(' ')) {
    const [date, time] = dateStr.split(' ');
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + time;
  }
  return formatDate(dateStr);
}

// ---- BADGE ----
function statusBadge(status) {
  if (!status) return '';
  const cls = status.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  // map common multi-word statuses
  const map = {
    'waiting-approval': 'waiting',
    'pending-approval': 'waiting',
    'on-rental': 'on-rental',
    'ready-to-ship': 'ready',
    'in-transit': 'in-transit',
    'partially-paid': 'partial',
    'partially-returned': 'partial',
    'partially-delivered': 'partial',
    'partially-received': 'partial',
    'return-pending': 'waiting',
    'waiting-customer-confirmation': 'waiting',
    'pending-customer-confirmation': 'waiting',
    'customer-confirmed': 'approved',
    'customer-rejected': 'rejected',
    'claim-approved': 'approved',
    'off-duty': 'maintenance',
    'on-delivery': 'shipped',
    'in-repair': 'maintenance',
    'unrepairable': 'rejected',
    'rescheduled': 'waiting',
    'overdue': 'overdue',
    'failed': 'rejected',
    'disposed': 'rejected',
    'maintenance-due': 'warning',
    'in-maintenance': 'maintenance',
  };
  const badgeCls = map[cls] || cls;
  return `<span class="badge-status ${badgeCls}">${status}</span>`;
}

// ---- SIDEBAR ----
function renderSidebar(user, activePage) {
  const isDriver = user.role === 'Driver';
  let html = '';

  // Brand
  html += `
    <div class="sidebar-brand">
      <div class="sidebar-brand-icon"><i class="bi bi-gear-wide-connected"></i></div>
      <div class="sidebar-brand-text">EquipRent<small>Enterprise v1.0</small></div>
    </div>`;

  html += '<nav class="sidebar-nav">';

  if (isDriver) {
    // Driver Portal
    html += sidebarLink('driver-dashboard.html', 'bi-speedometer2', 'Dashboard', activePage);
    html += sidebarLink('driver-deliveries.html', 'bi-truck', 'My Deliveries', activePage);
    html += sidebarLink('#', 'bi-person', 'Profile', activePage);
  } else {
    // Full sidebar
    html += sidebarLink('dashboard.html', 'bi-speedometer2', 'Dashboard', activePage);

    html += sidebarSection('RENTAL');
    html += sidebarLink('rentals.html', 'bi-file-earmark-text', 'Rentals', activePage);
    html += sidebarLink('projects.html', 'bi-folder', 'Projects', activePage);
    html += sidebarLink('deliveries.html', 'bi-truck', 'Deliveries', activePage);
    html += sidebarLink('returns.html', 'bi-box-arrow-in-left', 'Returns', activePage);
    html += sidebarLink('claims.html', 'bi-exclamation-triangle', 'Claims', activePage);

    html += sidebarSection('INVENTORY');
    html += sidebarLink('equipment.html', 'bi-tools', 'Equipment', activePage);
    html += sidebarLink('branches.html', 'bi-building', 'Branches', activePage);
    html += sidebarLink('stock.html', 'bi-boxes', 'Stock', activePage);
    html += sidebarLink('stock-transfer.html', 'bi-arrow-left-right', 'Stock Transfer', activePage);
    html += sidebarLink('movements.html', 'bi-arrow-left-right', 'Movements', activePage);
    html += sidebarLink('purchases.html', 'bi-cart', 'Purchases', activePage);
    html += sidebarLink('goods-receipts.html', 'bi-box-seam', 'Goods Receipts', activePage);
    html += sidebarLink('repairs.html', 'bi-tools', 'Repairs', activePage);
    html += sidebarLink('maintenance.html', 'bi-wrench-adjustable', 'Maintenance', activePage);

    html += sidebarSection('MASTER DATA');
    html += sidebarLink('customers.html', 'bi-people', 'Customers', activePage);
    html += sidebarLink('drivers.html', 'bi-person-badge', 'Drivers', activePage);
    html += sidebarLink('vehicles.html', 'bi-truck-front', 'Vehicles', activePage);
    html += sidebarLink('accounts.html', 'bi-bank', 'Company Accounts', activePage);

    html += sidebarSection('FINANCE & BILLING');
    html += sidebarLink('invoices.html', 'bi-receipt', 'Invoices', activePage);
    html += sidebarLink('finance-ledger.html', 'bi-wallet2', 'Bank Ledger', activePage);

    html += sidebarSection('ADMINISTRATION');
    html += sidebarLink('users.html', 'bi-person-gear', 'Users', activePage);
    html += sidebarLink('roles.html', 'bi-shield-lock', 'Roles', activePage);
  }

  html += '</nav>';

  // Footer
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  html += `
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="sidebar-user-avatar">${user.initials}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${user.name}</div>
          <div class="sidebar-user-role">${user.role}</div>
        </div>
      </div>
      <div class="sidebar-footer-actions">
        <button class="sidebar-footer-btn" onclick="toggleTheme()" title="Toggle Theme">
          <i class="bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}" id="themeIcon"></i>
          <span>${theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </button>
        <button class="sidebar-footer-btn ms-auto" onclick="logout()" title="Logout">
          <i class="bi bi-box-arrow-left"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>`;

  return html;
}

function sidebarSection(title) {
  return `<div class="sidebar-section"><div class="sidebar-section-title">${title}</div></div>`;
}

function sidebarLink(href, icon, label, activePage) {
  const fileName = href.split('/').pop().split('?')[0];
  const isActive = activePage === fileName || activePage === label.toLowerCase();
  return `<a href="${href}" class="sidebar-link ${isActive ? 'active' : ''}"><i class="bi ${icon}"></i>${label}</a>`;
}

// ---- HEADER ----
function renderHeader(breadcrumbs, title) {
  const user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
  let bcHtml = '<a href="dashboard.html"><i class="bi bi-house"></i></a>';
  if (breadcrumbs && breadcrumbs.length) {
    breadcrumbs.forEach(bc => {
      bcHtml += `<span class="separator"><i class="bi bi-chevron-right"></i></span>`;
      if (bc.href) {
        bcHtml += `<a href="${bc.href}">${bc.label}</a>`;
      } else {
        bcHtml += `<span>${bc.label}</span>`;
      }
    });
  }

  return `
    <button class="header-toggle-btn" onclick="toggleSidebar()" id="sidebarToggle"><i class="bi bi-list"></i></button>
    <div class="header-left">
      <div class="header-breadcrumb">${bcHtml}</div>
      <h1 class="header-title">${title || ''}</h1>
    </div>
    <div class="header-right">
      <div class="header-search">
        <i class="bi bi-search header-search-icon"></i>
        <input type="text" class="header-search-input" placeholder="Search... (Ctrl+K)" id="globalSearchInput" onclick="openGlobalSearch()" readonly>
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
          <div class="notification-list" id="notifList"></div>
        </div>
      </div>
      <div class="dropdown">
        <button class="header-user-btn" data-bs-toggle="dropdown">
          <div class="header-user-avatar">${user.initials || 'U'}</div>
          <span class="header-user-name">${user.name || 'User'}</span>
          <i class="bi bi-chevron-down fs-11"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Profile</a></li>
          <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" onclick="logout()"><i class="bi bi-box-arrow-left me-2"></i>Logout</a></li>
        </ul>
      </div>
    </div>`;
}

// ---- SIDEBAR TOGGLE ----
function toggleSidebar() {
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}

function closeSidebar() {
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

// ---- NOTIFICATIONS ----
function renderNotifications() {
  const list = document.getElementById('notifList');
  if (!list) return;
  const colorMap = { info: 'blue', warning: 'orange', green: 'green', red: 'red', orange: 'orange' };
  list.innerHTML = MockData.notifications.map(n => `
    <a href="${n.link}" class="notification-item ${n.read ? '' : 'unread'}">
      <div class="notification-icon-wrap ${colorMap[n.type] || 'blue'}"><i class="bi ${n.icon}"></i></div>
      <div>
        <div class="notification-text">${n.message}</div>
        <div class="notification-time">${n.time}</div>
      </div>
    </a>
  `).join('');
}

function toggleNotifications() {
  const dd = document.getElementById('notifDropdown');
  dd.classList.toggle('show');
}

function markAllRead() {
  MockData.notifications.forEach(n => n.read = true);
  renderNotifications();
  const dot = document.querySelector('.badge-dot');
  if (dot) dot.style.display = 'none';
}

// Close notification dropdown on outside click
document.addEventListener('click', function(e) {
  const dd = document.getElementById('notifDropdown');
  const btn = document.getElementById('notifBtn');
  if (dd && !dd.contains(e.target) && btn && !btn.contains(e.target)) {
    dd.classList.remove('show');
  }
});

// ---- GLOBAL SEARCH ----
function openGlobalSearch() {
  let overlay = document.getElementById('globalSearchOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'globalSearchOverlay';
    overlay.innerHTML = `
      <div class="search-modal">
        <div style="position:relative">
          <i class="bi bi-search search-modal-icon"></i>
          <input type="text" class="search-modal-input" placeholder="Search rentals, projects, equipment, customers..." id="globalSearchField" oninput="performGlobalSearch(this.value)">
        </div>
        <div class="search-results" id="globalSearchResults">
          <div class="empty-state py-4"><i class="bi bi-search"></i><p class="mb-0">Type to search across the system</p></div>
        </div>
      </div>`;
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeGlobalSearch();
    });
    document.body.appendChild(overlay);
  }
  overlay.classList.add('show');
  setTimeout(() => document.getElementById('globalSearchField').focus(), 100);
}

function closeGlobalSearch() {
  const overlay = document.getElementById('globalSearchOverlay');
  if (overlay) overlay.classList.remove('show');
}

function performGlobalSearch(query) {
  const results = document.getElementById('globalSearchResults');
  if (!query || query.length < 2) {
    results.innerHTML = '<div class="empty-state py-4"><i class="bi bi-search"></i><p class="mb-0">Type to search across the system</p></div>';
    return;
  }
  const q = query.toLowerCase();
  let html = '';

  // Search rentals
  const rentals = MockData.rentals.filter(r => r.id.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.projectName.toLowerCase().includes(q));
  if (rentals.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">Rentals</div>`;
    rentals.slice(0, 5).forEach(r => {
      html += `<a href="rental-detail.html?id=${r.id}" class="search-result-item"><i class="bi bi-file-earmark-text"></i><div><strong>${r.id}</strong> — ${r.customerName}<br><span class="text-muted fs-11">${r.projectName}</span></div></a>`;
    });
    html += '</div>';
  }

  // Search projects
  const projects = MockData.projects.filter(p => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.customerName.toLowerCase().includes(q));
  if (projects.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">Projects</div>`;
    projects.slice(0, 5).forEach(p => {
      html += `<a href="project-detail.html?id=${p.id}" class="search-result-item"><i class="bi bi-folder"></i><div><strong>${p.id}</strong> — ${p.name}<br><span class="text-muted fs-11">${p.customerName}</span></div></a>`;
    });
    html += '</div>';
  }

  // Search equipment
  const equip = MockData.equipment.filter(e => e.id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q) || e.serial.toLowerCase().includes(q));
  if (equip.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">Equipment</div>`;
    equip.slice(0, 5).forEach(e => {
      html += `<a href="equipment-detail.html?id=${e.id}" class="search-result-item"><i class="bi bi-tools"></i><div><strong>${e.id}</strong> — ${e.name}<br><span class="text-muted fs-11">${e.serial}</span></div></a>`;
    });
    html += '</div>';
  }

  // Search customers
  const customers = MockData.customers.filter(c => c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  if (customers.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">Customers</div>`;
    customers.slice(0, 5).forEach(c => {
      html += `<a href="customer-detail.html?id=${c.id}" class="search-result-item"><i class="bi bi-people"></i><div><strong>${c.code}</strong> — ${c.name}<br><span class="text-muted fs-11">${c.pic}</span></div></a>`;
    });
    html += '</div>';
  }

  // Search invoices
  const invoices = MockData.invoices.filter(i => i.id.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q));
  if (invoices.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">Invoices</div>`;
    invoices.slice(0, 5).forEach(i => {
      html += `<a href="invoice-detail.html?id=${i.id}" class="search-result-item"><i class="bi bi-receipt"></i><div><strong>${i.id}</strong> — ${i.customerName}<br><span class="text-muted fs-11">${formatRupiah(i.amount)}</span></div></a>`;
    });
    html += '</div>';
  }

  // Search deliveries
  const deliveries = MockData.deliveries.filter(d => d.id.toLowerCase().includes(q) || d.customerName.toLowerCase().includes(q) || (d.driverName && d.driverName.toLowerCase().includes(q)));
  if (deliveries.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">Deliveries</div>`;
    deliveries.slice(0, 5).forEach(d => {
      html += `<a href="delivery-detail.html?id=${d.id}" class="search-result-item"><i class="bi bi-truck"></i><div><strong>${d.id}</strong> — ${d.customerName}<br><span class="text-muted fs-11">${d.driverName || 'Unassigned'}</span></div></a>`;
    });
    html += '</div>';
  }

  if (!html) {
    html = '<div class="empty-state py-4"><i class="bi bi-search"></i><p class="mb-0">No results found</p></div>';
  }

  results.innerHTML = html;
}

// Ctrl+K shortcut
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openGlobalSearch();
  }
  if (e.key === 'Escape') {
    closeGlobalSearch();
  }
});

// ---- TOAST ----
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
  const toast = document.createElement('div');
  toast.className = `er-toast ${type}`;
  toast.innerHTML = `<i class="bi ${icons[type] || icons.success}"></i><span>${message}</span><button class="er-toast-close" onclick="this.parentElement.remove()"><i class="bi bi-x"></i></button>`;
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
}

// ---- TABLES ----
function renderPagination(totalItems, currentPage, pageSize, onPageChange) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return `<div class="d-flex justify-content-between align-items-center"><span class="fs-12 text-muted">Showing ${totalItems} of ${totalItems} entries</span></div>`;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  let pages = '';
  pages += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" onclick="${onPageChange}(${currentPage - 1});return false;">&laquo;</a></li>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="${onPageChange}(${i});return false;">${i}</a></li>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pages += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }
  pages += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" onclick="${onPageChange}(${currentPage + 1});return false;">&raquo;</a></li>`;

  return `
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
      <span class="fs-12 text-muted">Showing ${start} to ${end} of ${totalItems} entries</span>
      <nav><ul class="pagination pagination-sm mb-0">${pages}</ul></nav>
    </div>`;
}

// ---- TAB SWITCHING ----
function switchTab(tabId) {
  document.querySelectorAll('.er-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.er-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.er-tab[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ---- ACTIVITY TIMELINE ----
function renderActivityTimeline(activities) {
  if (!activities || !activities.length) return '<div class="empty-state"><i class="bi bi-clock-history"></i><p>No activity yet</p></div>';
  return '<div class="activity-timeline">' + activities.map(a => {
    const dotClass = a.type === 'success' ? 'success' : a.type === 'danger' ? 'danger' : a.type === 'warning' ? 'warning' : 'info';
    return `
      <div class="timeline-item">
        <div class="timeline-dot ${dotClass}"></div>
        <div class="timeline-content">${a.action}</div>
        <div class="timeline-time"><span class="timeline-user">${a.user}</span> · ${a.time} ${a.date || ''}</div>
      </div>`;
  }).join('') + '</div>';
}

// ---- INIT APP ----
function initApp(pageName, breadcrumbs, title) {
  const user = checkAuth();
  if (!user) return null;

  initTheme();

  // Render sidebar
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) sidebar.innerHTML = renderSidebar(user, pageName);

  // Render header
  const header = document.getElementById('appHeader');
  if (header) header.innerHTML = renderHeader(breadcrumbs, title);

  // Render notifications
  renderNotifications();

  return user;
}

// ---- URL PARAMS ----
function getUrlParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

// ---- CONFIRM DIALOG ----
function confirmAction(message) {
  return confirm(message);
}
