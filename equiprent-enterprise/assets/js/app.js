/* ============================================================
   EquipRent Enterprise - Shared Application Logic
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

// ---- HAK AKSES (MockData.permissions.matrix) ----
// Halaman → modul di matriks hak akses. Halaman yang tidak terdaftar boleh dibuka semua role.
const PAGE_MODULE = {
  'dashboard.html': 'Dashboard',
  'rentals.html': 'Rentals', 'rental-create.html': 'Rentals', 'rental-detail.html': 'Rentals',
  'projects.html': 'Projects', 'project-create.html': 'Projects', 'project-detail.html': 'Projects',
  'claims.html': 'Claims', 'claim-detail.html': 'Claims',
  'deliveries.html': 'Deliveries', 'delivery-detail.html': 'Deliveries',
  'returns.html': 'Returns', 'return-detail.html': 'Returns',
  'stock.html': 'Stock', 'stock-mutations.html': 'Stock', 'stock-transfer.html': 'Stock', 'project-stock.html': 'Stock', 'stock-report.html': 'Stock',
  'equipment.html': 'Equipment', 'equipment-detail.html': 'Equipment', 'repairs.html': 'Equipment', 'repair-detail.html': 'Equipment',
  'maintenance.html': 'Equipment', 'maintenance-detail.html': 'Equipment',
  'branches.html': 'Branches', 'branch-detail.html': 'Branches',
  'movements.html': 'Movements', 'movement-detail.html': 'Movements',
  'purchases.html': 'Purchases', 'purchase-create.html': 'Purchases', 'purchase-detail.html': 'Purchases',
  'goods-receipts.html': 'Purchases', 'goods-receipt-detail.html': 'Purchases',
  'customers.html': 'Customers', 'customer-detail.html': 'Customers',
  'drivers.html': 'Drivers', 'driver-detail.html': 'Drivers',
  'vehicles.html': 'Vehicles', 'vehicle-detail.html': 'Vehicles',
  'accounts.html': 'Accounts', 'finance-ledger.html': 'Accounts', 'cash-report.html': 'Accounts', 'bank-reconciliation.html': 'Accounts',
  'billing.html': 'Invoices', 'invoices.html': 'Invoices', 'invoice-detail.html': 'Invoices', 'invoice-shadow.html': 'Invoices',
  'payments.html': 'Invoices', 'receivables.html': 'Invoices',
  'coa.html': 'Accounting', 'journal.html': 'Accounting', 'general-ledger.html': 'Accounting', 'worksheet.html': 'Accounting',
  'adjustments.html': 'Accounting', 'profit-loss.html': 'Accounting', 'balance-sheet.html': 'Accounting',
  'tax-ppn.html': 'Tax', 'tax-pph23.html': 'Tax',
  'users.html': 'Users', 'roles.html': 'Roles', 'role-create.html': 'Roles'
};
const DRIVER_PAGES = ['driver-dashboard.html', 'driver-deliveries.html', 'driver-delivery-detail.html'];

function roleRule(role) {
  const m = (typeof MockData !== 'undefined' && MockData.permissions && MockData.permissions.matrix) || {};
  return m[role] || { allowed: ['Dashboard'], actions: ['View'] };
}

// Aksi yang boleh untuk modul tsb ([] = tidak punya akses)
function roleActions(role, module) {
  const r = roleRule(role);
  const all = ['View', 'Create', 'Update', 'Delete', 'Approve'];
  if (r.default === true) return (r.exceptions && r.exceptions[module]) || all;
  if (r.modules) return r.modules[module] || [];
  return (r.allowed || []).indexOf(module) >= 0 ? (r.actions || ['View']) : [];
}

function canDo(module, action, user) {
  user = user || JSON.parse(sessionStorage.getItem('er_user') || 'null');
  return !!user && roleActions(user.role, module).indexOf(action || 'View') >= 0;
}

function canAccessPage(page, user) {
  user = user || JSON.parse(sessionStorage.getItem('er_user') || 'null');
  if (!user) return false;
  if (user.role === 'Driver') return DRIVER_PAGES.indexOf(page) >= 0;
  if (DRIVER_PAGES.indexOf(page) >= 0) return canDo('Deliveries', 'View', user);
  const mod = PAGE_MODULE[page];
  return !mod || canDo(mod, 'View', user);
}

// Data pengemudi milik user login (role Driver) — dicocokkan lewat driverId atau nama
function currentDriver(user) {
  user = user || JSON.parse(sessionStorage.getItem('er_user') || 'null');
  if (!user || typeof MockData === 'undefined') return null;
  return MockData.drivers.find(d => d.id === user.driverId) || MockData.drivers.find(d => d.name === user.name) || null;
}

// Pengiriman untuk portal driver: driver hanya lihat tugasnya; admin yang membuka portal lihat semua yang sudah ada driver
function myDeliveries(user) {
  user = user || JSON.parse(sessionStorage.getItem('er_user') || 'null');
  if (user && user.role === 'Driver') {
    const drv = currentDriver(user);
    return drv ? MockData.deliveries.filter(d => d.driverId === drv.id) : [];
  }
  return MockData.deliveries.filter(d => d.driverId);
}

function homePageFor(user) {
  if (user.role === 'Driver') return 'driver-dashboard.html';
  const first = Object.keys(PAGE_MODULE).find(p => canAccessPage(p, user));
  return first || 'login.html';
}

// Tampilkan pesan kalau sebelumnya ditolak masuk ke halaman tertentu
function showDeniedNotice() {
  const denied = getUrlParam('denied');
  if (denied) setTimeout(() => showToast('Role Anda tidak punya akses ke halaman ' + denied, 'warning'), 300);
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
  if (typeof I18n !== 'undefined') return renderSidebarI18n(user, activePage);
  const isDriver = user.role === 'Driver';
  let html = '';
  html += `
    <div class="sidebar-brand">
      <div class="sidebar-brand-icon"><i class="bi bi-gear-wide-connected"></i></div>
      <div class="sidebar-brand-text">EquipRent<small>Enterprise v1.0</small></div>
    </div>`;
  html += '<nav class="sidebar-nav">';
  if (isDriver) {
    html += sidebarLink('driver-dashboard.html', 'bi-speedometer2', 'Dashboard', activePage);
    html += sidebarLink('driver-deliveries.html', 'bi-truck', 'My Deliveries', activePage);
    html += sidebarLink('#', 'bi-person', 'Profile', activePage);
  } else {
    html += sidebarLink('dashboard.html', 'bi-speedometer2', 'Dashboard', activePage);
    html += sidebarSection('RENTAL');
    html += sidebarLink('rentals.html', 'bi-file-earmark-text', 'Rentals', activePage);
    html += sidebarLink('projects.html', 'bi-folder', 'Projects', activePage);
    html += sidebarLink('claims.html', 'bi-exclamation-triangle', 'Claims', activePage);
    html += sidebarSection('STOCK RECAP');
    html += sidebarLink('deliveries.html', 'bi-truck', 'Deliveries', activePage);
    html += sidebarLink('returns.html', 'bi-box-arrow-in-left', 'Returns', activePage);
    html += sidebarLink('stock.html', 'bi-boxes', 'Warehouse Stock', activePage);
    html += sidebarLink('stock-mutations.html', 'bi-arrow-left-right', 'Stock Movements', activePage);
    html += sidebarLink('project-stock.html', 'bi-folder-check', 'Project Stock', activePage);
    html += sidebarLink('stock-report.html', 'bi-clipboard-data', 'Stock Report', activePage);
    html += sidebarSection('INVENTORY');
    html += sidebarLink('equipment.html', 'bi-tools', 'Equipment', activePage);
    html += sidebarLink('branches.html', 'bi-building', 'Warehouses', activePage);
    html += sidebarLink('movements.html', 'bi-clock-history', 'Asset Log', activePage);
    html += sidebarLink('purchases.html', 'bi-cart', 'Purchases', activePage);
    html += sidebarLink('goods-receipts.html', 'bi-box-seam', 'Goods Receipts', activePage);
    html += sidebarLink('repairs.html', 'bi-tools', 'Repairs', activePage);
    html += sidebarLink('maintenance.html', 'bi-wrench-adjustable', 'Maintenance', activePage);
    html += sidebarSection('MASTER DATA');
    html += sidebarLink('customers.html', 'bi-people', 'Customers', activePage);
    html += sidebarLink('drivers.html', 'bi-person-badge', 'Drivers', activePage);
    html += sidebarLink('vehicles.html', 'bi-truck-front', 'Vehicles', activePage);
    html += sidebarLink('accounts.html', 'bi-bank', 'Company Accounts', activePage);
    html += sidebarSection('RECEIVABLES');
    html += sidebarLink('billing.html', 'bi-calculator', 'Billing Recap', activePage);
    html += sidebarLink('invoices.html', 'bi-receipt', 'Invoices', activePage);
    html += sidebarLink('payments.html', 'bi-cash-coin', 'Payments', activePage);
    html += sidebarLink('receivables.html', 'bi-journal-text', 'Receivables Report', activePage);
    html += sidebarLink('finance-ledger.html', 'bi-wallet2', 'Bank Ledger', activePage);
    html += sidebarLink('cash-report.html', 'bi-file-earmark-bar-graph', 'Cash Report', activePage);
    html += sidebarLink('bank-reconciliation.html', 'bi-check2-square', 'Bank Reconciliation', activePage);
    html += sidebarSection('ACCOUNTING');
    html += sidebarLink('coa.html', 'bi-diagram-3', 'Chart of Accounts', activePage);
    html += sidebarLink('journal.html', 'bi-journal-bookmark', 'Journal', activePage);
    html += sidebarLink('general-ledger.html', 'bi-book', 'General Ledger', activePage);
    html += sidebarLink('worksheet.html', 'bi-table', 'Worksheet', activePage);
    html += sidebarLink('adjustments.html', 'bi-pencil-square', 'Adjusting Entries', activePage);
    html += sidebarLink('profit-loss.html', 'bi-graph-up-arrow', 'Profit & Loss', activePage);
    html += sidebarLink('balance-sheet.html', 'bi-columns-gap', 'Balance Sheet', activePage);
    html += sidebarSection('TAX');
    html += sidebarLink('tax-ppn.html', 'bi-percent', 'VAT (PPN)', activePage);
    html += sidebarLink('tax-pph23.html', 'bi-file-earmark-ruled', 'Withholding Tax (PPh 23)', activePage);
    html += sidebarSection('ADMINISTRATION');
    html += sidebarLink('users.html', 'bi-person-gear', 'Users', activePage);
    html += sidebarLink('roles.html', 'bi-shield-lock', 'Roles', activePage);
  }
  html += '</nav>';
  html = pruneEmptySections(html);
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
  if (href !== '#' && !canAccessPage(fileName)) return '';
  const isActive = activePage === fileName || activePage === label.toLowerCase();
  return `<a href="${href}" class="sidebar-link ${isActive ? 'active' : ''}"><i class="bi ${icon}"></i>${label}</a>`;
}

// ---- SIDEBAR i18n ----
function renderSidebarI18n(user, activePage) {
  const isDriver = user.role === 'Driver';
  let html = '';
  html += `
    <div class="sidebar-brand">
      <div class="sidebar-brand-icon"><i class="bi bi-gear-wide-connected"></i></div>
      <div class="sidebar-brand-text">EquipRent<small>Enterprise v1.0</small></div>
    </div>`;
  html += '<nav class="sidebar-nav">';
  if (isDriver) {
    html += sidebarLinkI18n('driver-dashboard.html', 'bi-speedometer2', t('dashboard'), activePage, 'driver-dashboard.html');
    html += sidebarLinkI18n('driver-deliveries.html', 'bi-truck', t('my_deliveries'), activePage, 'driver-deliveries.html');
    html += sidebarLinkI18n('#', 'bi-person', t('profile'), activePage, '#');
  } else {
    html += sidebarLinkI18n('dashboard.html', 'bi-speedometer2', t('dashboard'), activePage, 'dashboard.html');
    html += sidebarSectionI18n(t('rental_section'));
    html += sidebarLinkI18n('rentals.html', 'bi-file-earmark-text', t('rentals'), activePage, 'rentals.html');
    html += sidebarLinkI18n('projects.html', 'bi-folder', t('projects'), activePage, 'projects.html');
    html += sidebarLinkI18n('claims.html', 'bi-exclamation-triangle', t('claims'), activePage, 'claims.html');
    html += sidebarSectionI18n(t('stock_recap_section'));
    html += sidebarLinkI18n('deliveries.html', 'bi-truck', t('deliveries'), activePage, 'deliveries.html');
    html += sidebarLinkI18n('returns.html', 'bi-box-arrow-in-left', t('returns'), activePage, 'returns.html');
    html += sidebarLinkI18n('stock.html', 'bi-boxes', t('warehouse_stock'), activePage, 'stock.html');
    html += sidebarLinkI18n('stock-mutations.html', 'bi-arrow-left-right', t('stock_mutations'), activePage, 'stock-mutations.html');
    html += sidebarLinkI18n('project-stock.html', 'bi-folder-check', t('project_stock'), activePage, 'project-stock.html');
    html += sidebarLinkI18n('stock-report.html', 'bi-clipboard-data', t('stock_report'), activePage, 'stock-report.html');
    html += sidebarSectionI18n(t('inventory'));
    html += sidebarLinkI18n('equipment.html', 'bi-tools', t('equipment'), activePage, 'equipment.html');
    html += sidebarLinkI18n('branches.html', 'bi-building', t('branches'), activePage, 'branches.html');
    html += sidebarLinkI18n('movements.html', 'bi-clock-history', t('movements'), activePage, 'movements.html');
    html += sidebarLinkI18n('purchases.html', 'bi-cart', t('purchases'), activePage, 'purchases.html');
    html += sidebarLinkI18n('goods-receipts.html', 'bi-box-seam', t('goods_receipts'), activePage, 'goods-receipts.html');
    html += sidebarLinkI18n('repairs.html', 'bi-tools', t('repairs'), activePage, 'repairs.html');
    html += sidebarLinkI18n('maintenance.html', 'bi-wrench-adjustable', t('maintenance'), activePage, 'maintenance.html');
    html += sidebarSectionI18n(t('master_data'));
    html += sidebarLinkI18n('customers.html', 'bi-people', t('customers'), activePage, 'customers.html');
    html += sidebarLinkI18n('drivers.html', 'bi-person-badge', t('drivers'), activePage, 'drivers.html');
    html += sidebarLinkI18n('vehicles.html', 'bi-truck-front', t('vehicles'), activePage, 'vehicles.html');
    html += sidebarLinkI18n('accounts.html', 'bi-bank', t('company_accounts'), activePage, 'accounts.html');
    html += sidebarSectionI18n(t('finance_billing'));
    html += sidebarLinkI18n('billing.html', 'bi-calculator', t('billing_recap'), activePage, 'billing.html');
    html += sidebarLinkI18n('invoices.html', 'bi-receipt', t('invoices'), activePage, 'invoices.html');
    html += sidebarLinkI18n('payments.html', 'bi-cash-coin', t('payments'), activePage, 'payments.html');
    html += sidebarLinkI18n('receivables.html', 'bi-journal-text', t('receivables_report'), activePage, 'receivables.html');
    html += sidebarLinkI18n('finance-ledger.html', 'bi-wallet2', t('bank_ledger'), activePage, 'finance-ledger.html');
    html += sidebarLinkI18n('cash-report.html', 'bi-file-earmark-bar-graph', t('cash_report'), activePage, 'cash-report.html');
    html += sidebarLinkI18n('bank-reconciliation.html', 'bi-check2-square', t('bank_reconciliation'), activePage, 'bank-reconciliation.html');
    html += sidebarSectionI18n(t('accounting_section'));
    html += sidebarLinkI18n('coa.html', 'bi-diagram-3', t('coa'), activePage, 'coa.html');
    html += sidebarLinkI18n('journal.html', 'bi-journal-bookmark', t('journal'), activePage, 'journal.html');
    html += sidebarLinkI18n('general-ledger.html', 'bi-book', t('general_ledger'), activePage, 'general-ledger.html');
    html += sidebarLinkI18n('worksheet.html', 'bi-table', t('worksheet'), activePage, 'worksheet.html');
    html += sidebarLinkI18n('adjustments.html', 'bi-pencil-square', t('adjustments'), activePage, 'adjustments.html');
    html += sidebarLinkI18n('profit-loss.html', 'bi-graph-up-arrow', t('profit_loss'), activePage, 'profit-loss.html');
    html += sidebarLinkI18n('balance-sheet.html', 'bi-columns-gap', t('balance_sheet'), activePage, 'balance-sheet.html');
    html += sidebarSectionI18n(t('tax_section'));
    html += sidebarLinkI18n('tax-ppn.html', 'bi-percent', t('tax_ppn'), activePage, 'tax-ppn.html');
    html += sidebarLinkI18n('tax-pph23.html', 'bi-file-earmark-ruled', t('tax_pph23'), activePage, 'tax-pph23.html');
    html += sidebarSectionI18n(t('administration'));
    html += sidebarLinkI18n('users.html', 'bi-person-gear', t('users'), activePage, 'users.html');
    html += sidebarLinkI18n('roles.html', 'bi-shield-lock', t('roles'), activePage, 'roles.html');
  }
  html += '</nav>';
  html = pruneEmptySections(html);
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const themeLabel = theme === 'dark' ? t('light_mode') : t('dark_mode');
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
        <button class="sidebar-footer-btn" onclick="toggleTheme()" title="${t('toggle_theme')}">
          <i class="bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}" id="themeIcon"></i>
          <span>${themeLabel}</span>
        </button>
        <button class="sidebar-footer-btn ms-auto" onclick="logout()" title="${t('logout')}">
          <i class="bi bi-box-arrow-left"></i>
          <span>${t('logout')}</span>
        </button>
      </div>
    </div>`;
  return html;
}

function sidebarSectionI18n(title) {
  return `<div class="sidebar-section"><div class="sidebar-section-title">${title}</div></div>`;
}

// Buang judul grup sidebar yang semua menunya tersembunyi karena hak akses
function pruneEmptySections(html) {
  return html.replace(/<div class="sidebar-section"><div class="sidebar-section-title">[^<]*<\/div><\/div>(?=<div class="sidebar-section">|<\/nav>)/g, '');
}

function sidebarLinkI18n(href, icon, label, activePage, pageFile) {
  if (href !== '#' && !canAccessPage(pageFile)) return '';
  const isActive = activePage === pageFile;
  return `<a href="${href}" class="sidebar-link ${isActive ? 'active' : ''}"><i class="bi ${icon}"></i>${label}</a>`;
}

// ---- HEADER ----
function renderHeader(breadcrumbs, title) {
  const user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
  const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'id';
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
  const searchPlaceholder = (typeof t !== 'undefined') ? t('search_placeholder') : 'Search... (Ctrl+K)';
  const notifTitle = (typeof t !== 'undefined') ? t('notifications') : 'Notifikasi';
  const markReadLabel = (typeof t !== 'undefined') ? t('mark_all_read') : 'Tandai semua dibaca';
  const profileLabel = (typeof t !== 'undefined') ? t('profile') : 'Profil';
  const settingsLabel = (typeof t !== 'undefined') ? t('settings') : 'Pengaturan';
  const logoutLabel = (typeof t !== 'undefined') ? t('logout') : 'Keluar';
  const langLabel = (typeof t !== 'undefined') ? t('change_language') : 'Ganti Bahasa';
  const idLabel = (typeof t !== 'undefined') ? t('indonesian') : 'Bahasa Indonesia';
  const enLabel = (typeof t !== 'undefined') ? t('english') : 'English';

  return `
    <button class="header-toggle-btn" onclick="toggleSidebar()" id="sidebarToggle"><i class="bi bi-list"></i></button>
    <div class="header-left">
      <div class="header-breadcrumb">${bcHtml}</div>
      <h1 class="header-title">${title || ''}</h1>
    </div>
    <div class="header-right">
      <div class="header-search">
        <i class="bi bi-search header-search-icon"></i>
        <input type="text" class="header-search-input" placeholder="${searchPlaceholder}" id="globalSearchInput" onclick="openGlobalSearch()" readonly>
      </div>
      <div style="position:relative">
        <button class="header-icon-btn" onclick="toggleNotifications()" id="notifBtn">
          <i class="bi bi-bell"></i>
          <span class="badge-dot"></span>
        </button>
        <div class="notification-dropdown" id="notifDropdown">
          <div class="notification-header">
            <h6>${notifTitle}</h6>
            <a href="#" class="fs-12" onclick="markAllRead()">${markReadLabel}</a>
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
          <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>${profileLabel}</a></li>
          <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>${settingsLabel}</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><span class="dropdown-item-text px-3 py-1" style="display:block;font-size:11px;font-weight:600;color:#64748b;letter-spacing:.5px;"><i class="bi bi-translate me-2"></i>${langLabel}</span></li>
          <li>
            <a class="dropdown-item ps-4 ${lang === 'id' ? 'fw-semibold text-primary' : ''}" href="#" onclick="switchLanguage('id');return false;">
              ${lang === 'id' ? '<i class="bi bi-check2 me-1 text-primary"></i>' : '<span style="width:1.2rem;display:inline-block"></span>'}${idLabel}
            </a>
          </li>
          <li>
            <a class="dropdown-item ps-4 ${lang === 'en' ? 'fw-semibold text-primary' : ''}" href="#" onclick="switchLanguage('en');return false;">
              ${lang === 'en' ? '<i class="bi bi-check2 me-1 text-primary"></i>' : '<span style="width:1.2rem;display:inline-block"></span>'}${enLabel}
            </a>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" onclick="logout()"><i class="bi bi-box-arrow-left me-2"></i>${logoutLabel}</a></li>
        </ul>
      </div>
    </div>`;
}

// Language switcher function
function switchLanguage(lang) {
  if (typeof I18n !== 'undefined') {
    I18n.setLang(lang);
  }
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
  const searchPh = (typeof t !== 'undefined') ? t('enter_search') : 'Type to search across the system';
  const searchAll = (typeof t !== 'undefined') ? t('search_all') : 'Search...';
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'globalSearchOverlay';
    overlay.innerHTML = `
      <div class="search-modal">
        <div style="position:relative">
          <i class="bi bi-search search-modal-icon"></i>
          <input type="text" class="search-modal-input" placeholder="${searchAll}" id="globalSearchField" oninput="performGlobalSearch(this.value)">
        </div>
        <div class="search-results" id="globalSearchResults">
          <div class="empty-state py-4"><i class="bi bi-search"></i><p class="mb-0">${searchPh}</p></div>
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
  const searchPh = (typeof t !== 'undefined') ? t('enter_search') : 'Type to search across the system';
  const noResultsTxt = (typeof t !== 'undefined') ? t('no_results') : 'No results found';
  if (!query || query.length < 2) {
    results.innerHTML = `<div class="empty-state py-4"><i class="bi bi-search"></i><p class="mb-0">${searchPh}</p></div>`;
    return;
  }
  const q = query.toLowerCase();
  let html = '';

  const grpRentals = (typeof t !== 'undefined') ? t('search_rentals_group') : 'Penyewaan';
  const grpProjects = (typeof t !== 'undefined') ? t('search_projects_group') : 'Proyek';
  const grpEquipment = (typeof t !== 'undefined') ? t('search_equipment_group') : 'Alat Berat';
  const grpCustomers = (typeof t !== 'undefined') ? t('search_customers_group') : 'Pelanggan';
  const grpInvoices = (typeof t !== 'undefined') ? t('search_invoices_group') : 'Faktur';
  const grpDeliveries = (typeof t !== 'undefined') ? t('search_deliveries_group') : 'Pengiriman';
  const unassignedTxt = (typeof t !== 'undefined') ? t('unassigned') : 'Tidak Ditugaskan';

  const rentals = MockData.rentals.filter(r => r.id.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.projectName.toLowerCase().includes(q));
  if (rentals.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">${grpRentals}</div>`;
    rentals.slice(0, 5).forEach(r => {
      html += `<a href="rental-detail.html?id=${r.id}" class="search-result-item"><i class="bi bi-file-earmark-text"></i><div><strong>${r.id}</strong> - ${r.customerName}<br><span class="text-muted fs-11">${r.projectName}</span></div></a>`;
    });
    html += '</div>';
  }

  const projects = MockData.projects.filter(p => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.customerName.toLowerCase().includes(q));
  if (projects.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">${grpProjects}</div>`;
    projects.slice(0, 5).forEach(p => {
      html += `<a href="project-detail.html?id=${p.id}" class="search-result-item"><i class="bi bi-folder"></i><div><strong>${p.id}</strong> - ${p.name}<br><span class="text-muted fs-11">${p.customerName}</span></div></a>`;
    });
    html += '</div>';
  }

  const equip = MockData.equipment.filter(e => e.id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q) || e.serial.toLowerCase().includes(q));
  if (equip.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">${grpEquipment}</div>`;
    equip.slice(0, 5).forEach(e => {
      html += `<a href="equipment-detail.html?id=${e.id}" class="search-result-item"><i class="bi bi-tools"></i><div><strong>${e.id}</strong> - ${e.name}<br><span class="text-muted fs-11">${e.serial}</span></div></a>`;
    });
    html += '</div>';
  }

  const customers = MockData.customers.filter(c => c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  if (customers.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">${grpCustomers}</div>`;
    customers.slice(0, 5).forEach(c => {
      html += `<a href="customer-detail.html?id=${c.id}" class="search-result-item"><i class="bi bi-people"></i><div><strong>${c.code}</strong> - ${c.name}<br><span class="text-muted fs-11">${c.pic}</span></div></a>`;
    });
    html += '</div>';
  }

  const invoices = MockData.invoices.filter(i => i.id.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q));
  if (invoices.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">${grpInvoices}</div>`;
    invoices.slice(0, 5).forEach(i => {
      html += `<a href="invoice-detail.html?id=${i.id}" class="search-result-item"><i class="bi bi-receipt"></i><div><strong>${i.id}</strong> - ${i.customerName}<br><span class="text-muted fs-11">${formatRupiah(i.amount)}</span></div></a>`;
    });
    html += '</div>';
  }

  const deliveries = MockData.deliveries.filter(d => d.id.toLowerCase().includes(q) || d.customerName.toLowerCase().includes(q) || (d.driverName && d.driverName.toLowerCase().includes(q)));
  if (deliveries.length) {
    html += `<div class="search-result-group"><div class="search-result-group-title">${grpDeliveries}</div>`;
    deliveries.slice(0, 5).forEach(d => {
      html += `<a href="delivery-detail.html?id=${d.id}" class="search-result-item"><i class="bi bi-truck"></i><div><strong>${d.id}</strong> - ${d.customerName}<br><span class="text-muted fs-11">${d.driverName || unassignedTxt}</span></div></a>`;
    });
    html += '</div>';
  }

  if (!html) {
    html = `<div class="empty-state py-4"><i class="bi bi-search"></i><p class="mb-0">${noResultsTxt}</p></div>`;
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
  const showingTxt = (typeof t !== 'undefined') ? t('showing') : 'Menampilkan';
  const toTxt = (typeof t !== 'undefined') ? t('to') : 'hingga';
  const ofTxt = (typeof t !== 'undefined') ? t('of') : 'dari';
  const entriesTxt = (typeof t !== 'undefined') ? t('entries') : 'entri';

  if (totalPages <= 1) return `<div class="d-flex justify-content-between align-items-center"><span class="fs-12 text-muted">${showingTxt} ${totalItems} ${ofTxt} ${totalItems} ${entriesTxt}</span></div>`;

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
      <span class="fs-12 text-muted">${showingTxt} ${start} ${toTxt} ${end} ${ofTxt} ${totalItems} ${entriesTxt}</span>
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
  const noActivityTxt = (typeof t !== 'undefined') ? t('no_activity') : 'Belum ada aktivitas';
  if (!activities || !activities.length) return `<div class="empty-state"><i class="bi bi-clock-history"></i><p>${noActivityTxt}</p></div>`;
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

  // Halaman yang tidak boleh dibuka role ini → arahkan ke halaman awal role tsb
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (!canAccessPage(currentPage, user)) {
    window.location.replace(homePageFor(user) + '?denied=' + encodeURIComponent(currentPage));
    throw new Error('Akses ditolak: ' + currentPage); // hentikan script halaman
  }
  showDeniedNotice();

  initTheme();

  // Render sidebar (with i18n if available)
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) {
    const renderFn = (typeof I18n !== 'undefined') ? renderSidebarI18n : renderSidebar;
    sidebar.innerHTML = renderFn(user, pageName);
  }

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

// ---- CSV EXPORT ----
// rows: array of arrays (baris pertama = header)
function downloadCSV(filename, rows) {
  const esc = v => {
    const s = v == null ? '' : String(v);
    return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const csv = '﻿' + rows.map(r => r.map(esc).join(';')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
}

// ---- INVOICE STATUS (label Indonesia) ----
const INVOICE_STATUS_LABEL = { 'Shadow': 'Bayangan', 'Issued': 'Belum Dibayar', 'Partially Paid': 'Dibayar Sebagian', 'Overdue': 'Jatuh Tempo', 'Paid': 'Lunas', 'Cancelled': 'Dibatalkan' };
function invoiceStatusBadge(status) {
  return statusBadge(status).replace('>' + status + '<', '>' + (INVOICE_STATUS_LABEL[status] || status) + '<');
}
