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
  'customers.html': 'Customers', 'customer-detail.html': 'Customers',
  'projects.html': 'Projects', 'project-create.html': 'Projects', 'project-detail.html': 'Projects',
  'rentals.html': 'Rentals', 'rental-create.html': 'Rentals', 'rental-detail.html': 'Rentals',
  'sales.html': 'Sales', 'sale-create.html': 'Sales', 'sale-detail.html': 'Sales',
  'claims.html': 'Claims', 'claim-detail.html': 'Claims',
  'approvals.html': 'Approvals',
  'billing.html': 'Invoices', 'invoices.html': 'Invoices', 'invoice-detail.html': 'Invoices', 'invoice-shadow.html': 'Invoices',
  'receivables.html': 'Invoices', 'payments.html': 'Payments',
  'deliveries.html': 'Deliveries', 'delivery-detail.html': 'Deliveries',
  'returns.html': 'Returns', 'return-detail.html': 'Returns',
  'stock.html': 'Stock', 'stock-mutations.html': 'Stock', 'stock-transfer.html': 'Stock', 'project-stock.html': 'Stock', 'stock-report.html': 'Stock',
  'equipment.html': 'Equipment', 'equipment-detail.html': 'Equipment',
  'branches.html': 'Branches', 'branch-detail.html': 'Branches',
  'movements.html': 'Movements', 'movement-detail.html': 'Movements',
  'purchases.html': 'Purchases', 'purchase-create.html': 'Purchases', 'purchase-detail.html': 'Purchases',
  'goods-receipts.html': 'Purchases', 'goods-receipt-detail.html': 'Purchases',
  'purchase-requests.html': 'Purchases', 'vendors.html': 'Purchases', 'purchase-report.html': 'Purchases', 'payables.html': 'Purchases',
  'drivers.html': 'Drivers', 'driver-detail.html': 'Drivers',
  'vehicles.html': 'Vehicles', 'vehicle-detail.html': 'Vehicles',
  'accounts.html': 'Accounts', 'finance-ledger.html': 'Accounts', 'cash-report.html': 'Accounts', 'bank-reconciliation.html': 'Accounts',
  'coa.html': 'Accounting', 'journal.html': 'Accounting', 'general-ledger.html': 'Accounting', 'worksheet.html': 'Accounting',
  'adjustments.html': 'Accounting', 'profit-loss.html': 'Accounting', 'balance-sheet.html': 'Accounting',
  'tax-ppn.html': 'Tax', 'tax-pph23.html': 'Tax',
  'users.html': 'Users', 'roles.html': 'Roles', 'role-create.html': 'Roles'
  // edit-requests.html sengaja tidak didaftarkan: semua role bisa melihat & mengajukan perubahan
};

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
  const mod = PAGE_MODULE[page];
  return !mod || canDo(mod, 'View', user);
}

function homePageFor(user) {
  const first = Object.keys(PAGE_MODULE).find(p => canAccessPage(p, user));
  return first || 'login.html';
}

// ---- PERUBAHAN DATA ----
// Hanya Admin yang boleh mengubah / menghapus data. Role lain mengajukan Permintaan Perubahan (dengan catatan)
// → di-ACC Accounting & Tax → dikerjakan Admin.
function currentUser() { return JSON.parse(sessionStorage.getItem('er_user') || 'null'); }
function isAdmin(user) { user = user || currentUser(); return !!user && user.role === 'Admin'; }

const EditRequest = {
  list: function() { return (MockData.editRequests = MockData.editRequests || []); },
  canReview: function(user) { return canDo('Accounting', 'Approve', user); },
  // Jumlah yang perlu ditindaklanjuti user ini (Accounting: menunggu ACC; Admin: sudah di-ACC, tinggal dikerjakan)
  todo: function(user) {
    user = user || currentUser();
    if (!user) return 0;
    return this.list().filter(r => (r.status === 'Menunggu ACC' && this.canReview(user) && !isAdmin(user)) || (r.status === 'Disetujui' && isAdmin(user))).length;
  },
  openFor: function(docType, docId) { return this.list().filter(r => r.docType === docType && r.docId === docId && (r.status === 'Menunggu ACC' || r.status === 'Disetujui')); },
  create: function(d) {
    const user = currentUser() || {};
    if (!String(d.notes || '').trim()) return { success: false, error: 'Tulis catatan perubahan yang diminta' };
    const r = { id: MockData.generateId('ER', 'editRequests'), docType: d.docType, docId: d.docId, docLabel: d.docLabel || d.docId, link: d.link || '',
      action: d.action || 'Ubah', notes: String(d.notes).trim(), requestedBy: user.name || 'User', requestedRole: user.role || '',
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16), status: 'Menunggu ACC' };
    this.list().unshift(r);
    MockData.save('editRequests');
    if (typeof BizLogic !== 'undefined' && BizLogic.Notification) BizLogic.Notification.add('Permintaan ' + r.action.toLowerCase() + ' <strong>' + r.docType + ' ' + r.docId + '</strong> menunggu ACC Accounting', 'warning', 'bi-pencil-square', 'edit-requests.html');
    return { success: true, request: r };
  },
  review: function(id, approve, note) {
    const r = this.list().find(x => x.id === id), user = currentUser() || {};
    if (!r) return { success: false, error: 'Permintaan tidak ditemukan' };
    if (!this.canReview(user)) return { success: false, error: 'Hanya Accounting & Tax yang bisa ACC permintaan perubahan' };
    if (r.status !== 'Menunggu ACC') return { success: false, error: 'Permintaan sudah diproses' };
    if (!approve && !String(note || '').trim()) return { success: false, error: 'Tulis alasan penolakan' };
    r.status = approve ? 'Disetujui' : 'Ditolak';
    r.reviewedBy = user.name; r.reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 16); r.reviewNote = String(note || '').trim();
    MockData.save('editRequests');
    return { success: true, request: r };
  },
  complete: function(id, note) {
    const r = this.list().find(x => x.id === id), user = currentUser() || {};
    if (!r) return { success: false, error: 'Permintaan tidak ditemukan' };
    if (!isAdmin(user)) return { success: false, error: 'Perubahan dikerjakan oleh Admin' };
    if (r.status !== 'Disetujui') return { success: false, error: 'Permintaan belum di-ACC Accounting' };
    r.status = 'Selesai'; r.doneBy = user.name; r.doneAt = new Date().toISOString().replace('T', ' ').substring(0, 16); r.doneNote = String(note || '').trim();
    MockData.save('editRequests');
    return { success: true, request: r };
  }
};

// Tombol ubah / hapus. Admin → tombol aslinya (adminHtml). Role lain → tombol "Ajukan Perubahan".
// doc: { docType, docId, docLabel, link }   opts: { action: 'Ubah'|'Hapus', label: teks tombol (kalau mau tombol besar) }
window.__editDocs = [];
function editButton(doc, adminHtml, opts) {
  opts = opts || {};
  if (isAdmin()) return adminHtml;
  const i = window.__editDocs.push(Object.assign({ action: opts.action || 'Ubah' }, doc)) - 1;
  const pending = EditRequest.openFor(doc.docType, doc.docId).length;
  const title = 'Ajukan permintaan ' + (opts.action || 'ubah').toLowerCase() + ' ke Admin (ACC Accounting)';
  return opts.label
    ? `<button class="btn btn-outline-secondary btn-sm" onclick="openEditRequest(${i})" title="${title}"><i class="bi bi-pencil-square me-1"></i>${opts.label}${pending ? ` <span class="badge bg-warning text-dark ms-1">${pending}</span>` : ''}</button>`
    : `<button class="btn-action" onclick="openEditRequest(${i})" title="${title}"><i class="bi bi-pencil-square"></i></button>`;
}

function openEditRequest(i) {
  const d = window.__editDocs[i];
  let el = document.getElementById('editReqModal');
  if (!el) {
    el = document.createElement('div');
    el.className = 'modal fade'; el.id = 'editReqModal'; el.tabIndex = -1;
    el.innerHTML = `<div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Ajukan Permintaan Perubahan</h5><button class="btn-close" data-bs-dismiss="modal"></button></div>
      <div class="modal-body">
        <div class="alert alert-light border py-2 fs-13">Data hanya bisa diubah oleh <strong>Admin</strong>. Permintaan ini di-ACC dulu oleh <strong>Accounting</strong>, lalu dikerjakan Admin.</div>
        <div class="mb-2 fs-13"><span class="text-muted">Data:</span> <strong id="erDoc"></strong></div>
        <div class="mb-3"><label class="form-label form-label-er">Jenis</label><select class="form-select" id="erAction"><option>Ubah</option><option>Hapus</option><option>Batalkan</option></select></div>
        <div id="erPending" class="mb-3"></div>
        <label class="form-label form-label-er">Catatan perubahan *</label>
        <textarea class="form-control" id="erNotes" rows="3" placeholder="Apa yang perlu diubah, nilai lama → nilai baru, dan alasannya"></textarea>
      </div>
      <div class="modal-footer"><a href="edit-requests.html" class="btn btn-link me-auto">Lihat semua permintaan</a>
        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
        <button class="btn btn-primary" id="erSubmit"><i class="bi bi-send me-1"></i>Ajukan</button></div>
    </div></div>`;
    document.body.appendChild(el);
  }
  el.querySelector('#erDoc').textContent = d.docType + ' ' + d.docId + (d.docLabel && d.docLabel !== d.docId ? ' — ' + d.docLabel : '');
  el.querySelector('#erAction').value = d.action || 'Ubah';
  el.querySelector('#erNotes').value = '';
  const open = EditRequest.openFor(d.docType, d.docId);
  el.querySelector('#erPending').innerHTML = open.length ? `<div class="alert alert-warning py-2 fs-12 mb-0"><i class="bi bi-hourglass-split me-1"></i>Sudah ada ${open.length} permintaan untuk data ini (${open.map(r => r.id + ': ' + r.status).join(', ')})</div>` : '';
  el.querySelector('#erSubmit').onclick = function() {
    const r = EditRequest.create(Object.assign({}, d, { action: el.querySelector('#erAction').value, notes: el.querySelector('#erNotes').value }));
    if (!r.success) { showToast(r.error, 'error'); return; }
    bootstrap.Modal.getInstance(el).hide();
    showToast('Permintaan ' + r.request.id + ' diajukan, menunggu ACC Accounting', 'success');
  };
  bootstrap.Modal.getOrCreateInstance(el).show();
}

// Banner untuk Admin di halaman detail: permintaan perubahan yang sudah di-ACC untuk data ini
function editRequestBanner(docType, docId) {
  const list = EditRequest.openFor(docType, docId);
  if (!list.length) return '';
  return `<div class="alert ${isAdmin() ? 'alert-warning' : 'alert-light border'} py-2 fs-13 mb-3"><i class="bi bi-pencil-square me-1"></i>${list.map(r =>
    `<strong>${r.id}</strong> (${r.status === 'Disetujui' ? 'sudah di-ACC, menunggu dikerjakan Admin' : 'menunggu ACC Accounting'}): ${r.notes} <span class="text-muted">— ${r.requestedBy}</span>`).join('<br>')}
    <a href="edit-requests.html" class="ms-1">Buka</a></div>`;
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
    'delivered': 'completed',
    'on-progress': 'in-transit',
    'menunggu-acc': 'waiting', 'disetujui': 'approved', 'ditolak': 'rejected', 'selesai': 'completed',
    'lunas': 'paid', 'uang-muka': 'waiting', 'sebagian': 'partial', 'belum-dibayar': 'issued', 'diajukan': 'waiting', 'dibuat-po': 'completed', 'requested': 'waiting',
  };
  const badgeCls = map[cls] || cls;
  return `<span class="badge-status ${badgeCls}">${status}</span>`;
}

// ---- SIDEBAR ----
function renderSidebar(user, activePage) {
  return renderSidebarI18n(user, activePage);
}

// ---- SIDEBAR i18n ----
function renderSidebarI18n(user, activePage) {
  let html = '';
  html += `
    <div class="sidebar-brand">
      <div class="sidebar-brand-icon"><i class="bi bi-gear-wide-connected"></i></div>
      <div class="sidebar-brand-text">EquipRent<small>Enterprise v1.0</small></div>
    </div>`;
  html += '<nav class="sidebar-nav">';
  const L = (href, icon, key, badge) => sidebarLinkI18n(href, icon, t(key), activePage, href, badge);
  const pendingOrders = (MockData.rentals || []).filter(r => r.status === 'Pending Approval' || r.status === 'Waiting Approval').length +
    (MockData.sales || []).filter(s => s.status === 'Pending Approval').length;
  html += L('dashboard.html', 'bi-speedometer2', 'dashboard');
  html += sidebarSectionI18n(t('rental_section'));
  html += L('customers.html', 'bi-people', 'customers');
  html += L('projects.html', 'bi-folder', 'projects');
  html += L('rentals.html', 'bi-file-earmark-text', 'rentals');
  html += L('sales.html', 'bi-bag-check', 'sales');
  html += L('claims.html', 'bi-exclamation-triangle', 'claims');
  html += sidebarSectionI18n(t('receivables_section'));
  html += L('approvals.html', 'bi-check2-circle', 'approvals', canDo('Approvals', 'Approve') ? pendingOrders : 0);
  html += L('billing.html', 'bi-calculator', 'billing_recap');
  html += L('invoices.html', 'bi-receipt', 'invoices');
  html += L('payments.html', 'bi-cash-coin', 'payments');
  html += L('receivables.html', 'bi-journal-text', 'receivables_report');
  html += sidebarSectionI18n(t('stock_recap_section'));
  html += L('deliveries.html', 'bi-truck', 'deliveries');
  html += L('returns.html', 'bi-box-arrow-in-left', 'returns');
  html += L('stock.html', 'bi-boxes', 'warehouse_stock');
  html += L('stock-mutations.html', 'bi-arrow-left-right', 'stock_mutations');
  html += L('project-stock.html', 'bi-folder-check', 'project_stock');
  html += L('stock-report.html', 'bi-clipboard-data', 'stock_report');
  html += L('vehicles.html', 'bi-truck-front', 'vehicles');
  html += L('drivers.html', 'bi-person-badge', 'drivers');
  html += sidebarSectionI18n(t('inventory'));
  html += L('equipment.html', 'bi-tools', 'equipment');
  html += L('branches.html', 'bi-building', 'branches');
  html += L('movements.html', 'bi-clock-history', 'movements');
  html += sidebarSectionI18n(t('purchasing_section'));
  html += L('purchase-requests.html', 'bi-file-earmark-text', 'purchase_requests', canDo('Purchases', 'Approve') ? (MockData.purchaseRequests || []).filter(r => r.status === 'Diajukan').length : 0);
  html += L('purchases.html', 'bi-cart', 'purchase_orders');
  html += L('goods-receipts.html', 'bi-box-seam', 'goods_receipts');
  html += L('vendors.html', 'bi-shop', 'vendors');
  html += L('purchase-report.html', 'bi-clipboard-data', 'purchase_report');
  html += L('payables.html', 'bi-journal-minus', 'payables_report');
  html += sidebarSectionI18n(t('master_data'));
  html += L('accounts.html', 'bi-bank', 'company_accounts');
  html += sidebarSectionI18n(t('finance_billing'));
  html += L('finance-ledger.html', 'bi-wallet2', 'bank_ledger');
  html += L('cash-report.html', 'bi-file-earmark-bar-graph', 'cash_report');
  html += L('bank-reconciliation.html', 'bi-check2-square', 'bank_reconciliation');
  html += sidebarSectionI18n(t('accounting_section'));
  html += L('coa.html', 'bi-diagram-3', 'coa');
  html += L('journal.html', 'bi-journal-bookmark', 'journal');
  html += L('general-ledger.html', 'bi-book', 'general_ledger');
  html += L('worksheet.html', 'bi-table', 'worksheet');
  html += L('adjustments.html', 'bi-pencil-square', 'adjustments');
  html += L('profit-loss.html', 'bi-graph-up-arrow', 'profit_loss');
  html += L('balance-sheet.html', 'bi-columns-gap', 'balance_sheet');
  html += sidebarSectionI18n(t('tax_section'));
  html += L('tax-ppn.html', 'bi-percent', 'tax_ppn');
  html += L('tax-pph23.html', 'bi-file-earmark-ruled', 'tax_pph23');
  html += sidebarSectionI18n(t('administration'));
  html += L('edit-requests.html', 'bi-pencil-square', 'edit_requests', EditRequest.todo(user));
  html += L('users.html', 'bi-person-gear', 'users');
  html += L('roles.html', 'bi-shield-lock', 'roles');
  html += '</nav>';
  html = pruneEmptySections(html);
  return html + sidebarFooter(user);
}

function sidebarFooter(user) {
  let html = '';
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

function sidebarLinkI18n(href, icon, label, activePage, pageFile, badge) {
  if (href !== '#' && !canAccessPage(pageFile)) return '';
  const isActive = activePage === pageFile;
  const b = badge ? `<span class="badge rounded-pill bg-danger ms-auto">${badge}</span>` : '';
  return `<a href="${href}" class="sidebar-link ${isActive ? 'active' : ''}"><i class="bi ${icon}"></i>${label}${b}</a>`;
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
      html += `<a href="customer-detail.html?id=${c.id}" class="search-result-item"><i class="bi bi-people"></i><div><strong>${c.code}</strong> - ${c.name}<br><span class="text-muted fs-11">PM: ${c.pic}</span></div></a>`;
    });
    html += '</div>';
  }

  const sales = (MockData.sales || []).filter(s => s.id.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q));
  if (sales.length && canAccessPage('sale-detail.html')) {
    html += `<div class="search-result-group"><div class="search-result-group-title">Penjualan</div>`;
    sales.slice(0, 5).forEach(s => {
      html += `<a href="sale-detail.html?id=${s.id}" class="search-result-item"><i class="bi bi-bag-check"></i><div><strong>${s.id}</strong> - ${s.customerName}<br><span class="text-muted fs-11">${s.status}</span></div></a>`;
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
