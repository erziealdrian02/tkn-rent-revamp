/* ============================================================
   EquipRent Enterprise - Business Logic Engine
   Centralized state transitions, stock management, validation
   ============================================================ */

const BizLogic = {};

// ============================================================
// STATUS STATE MACHINES
// ============================================================

BizLogic.RentalStatus = {
  DRAFT: 'Draft',
  PENDING: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PREPARING: 'Preparing',
  PARTIALLY_DELIVERED: 'Partially Delivered',
  ON_RENTAL: 'On Rental',
  PARTIALLY_RETURNED: 'Partially Returned',
  RETURN_PENDING: 'Return Pending',
  OVERDUE: 'Overdue',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

BizLogic.RentalTransitions = {
  'Draft':               ['Pending Approval', 'Cancelled'],
  'Pending Approval':    ['Approved', 'Rejected', 'Cancelled'],
  'Approved':            ['Preparing', 'Cancelled'],
  'Rejected':            ['Pending Approval'],
  'Preparing':           ['Partially Delivered', 'On Rental'],
  'Partially Delivered': ['On Rental'],
  'On Rental':           ['Partially Returned', 'Return Pending', 'Overdue', 'Completed'],
  'Overdue':             ['Partially Returned', 'Return Pending', 'Completed'],
  'Partially Returned':  ['Completed'],
  'Return Pending':      ['Completed'],
  'Completed':           [],
  'Cancelled':           []
};

BizLogic.DeliveryTransitions = {
  'Preparing':   ['Assigned'],
  'Assigned':    ['Departed'],
  'Departed':    ['Arrived', 'Failed'],
  'Arrived':     ['Completed', 'Failed'],   // Failed di lokasi: mis. alat ditolak customer
  'Failed':      ['Rescheduled'],
  'Rescheduled': ['Assigned'],
  'Completed':   []
};

// Received / Partially Received diatur oleh penerimaan barang (createGoodsReceipt)
BizLogic.PurchaseTransitions = {
  'Draft':      ['Approved', 'Cancelled'],
  'Requested':  ['Approved', 'Cancelled'],
  'Approved':   ['Ordered', 'Cancelled'],
  'Ordered':    ['In Transit', 'Arrived', 'Cancelled'],
  'In Transit': ['Arrived'],
  'Arrived':    [],
  'Partially Received': [],
  'Received':   ['Completed'],
  'Completed':  [],
  'Cancelled':  []
};

BizLogic.ClaimTransitions = {
  'Draft':                          ['Pending Customer Confirmation'],
  'Pending Customer Confirmation':  ['Approved', 'Disputed'],
  'Waiting Customer Confirmation':  ['Approved', 'Disputed'],
  'Approved':                       ['Invoiced'],
  'Disputed':                       ['Approved', 'Closed'],
  'Invoiced':                       ['Paid', 'Closed'],
  'Paid':                           ['Closed'],
  'Closed':                         []
};

BizLogic.InvoiceTransitions = {
  'Draft':          ['Issued'],
  'Issued':         ['Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'],
  'Sent':           ['Partially Paid', 'Paid', 'Overdue', 'Cancelled'],
  'Partially Paid': ['Paid', 'Overdue'],
  'Paid':           [],
  'Overdue':        ['Partially Paid', 'Paid'],
  'Cancelled':      []
};

BizLogic.RepairTransitions = {
  'Pending':      ['In Repair'],
  'In Repair':    ['Completed', 'Unrepairable'],
  'Completed':    [],
  'Unrepairable': []
};

// ============================================================
// TRANSITION VALIDATOR
// ============================================================

BizLogic.canTransition = function(transitionMap, currentStatus, targetStatus) {
  const allowed = transitionMap[currentStatus];
  if (!allowed) return false;
  return allowed.includes(targetStatus);
};

BizLogic.validateTransition = function(transitionMap, currentStatus, targetStatus) {
  if (!BizLogic.canTransition(transitionMap, currentStatus, targetStatus)) {
    console.error('Invalid transition: ' + currentStatus + ' → ' + targetStatus);
    return false;
  }
  return true;
};

// ============================================================
// STOCK MANAGER - kondisi fisik per gudang (MockData.stock)
// row.total = qty fisik di gudang; available/reserved/damaged/maintenance = rinciannya.
// Jangan ubah total langsung dari halaman: gunakan BizLogic.StockLedger.post()
// supaya ledger (stockMutations) dan baris stok selalu sinkron.
// ============================================================

BizLogic.Stock = {
  branchShort: function(branch) {
    if (!branch) return '';
    var br = MockData.branches.find(function(b) { return b.id === branch; });
    return (br ? br.name : branch).replace(' Warehouse', '');
  },

  find: function(equipmentName, branch) {
    var branchNorm = this.branchShort(branch);
    return MockData.stock.find(function(s) {
      return s.equipment === equipmentName && s.branch === branchNorm;
    });
  },

  _ensure: function(equipmentName, branch) {
    var s = this.find(equipmentName, branch);
    if (!s) {
      s = { equipment: equipmentName, branch: this.branchShort(branch), total: 0, available: 0, reserved: 0, damaged: 0, maintenance: 0 };
      MockData.stock.push(s);
    }
    return s;
  },

  getAvailable: function(equipmentName, branch) {
    var s = this.find(equipmentName, branch);
    return s ? s.available : 0;
  },

  reserve: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) { console.error('Stock not found:', equipmentName, branch); return false; }
    if (s.available < quantity) {
      console.error('Insufficient available stock: ' + equipmentName + ' in ' + branch + '. Available: ' + s.available + ', Requested: ' + quantity);
      return false;
    }
    s.available -= quantity;
    s.reserved = (s.reserved || 0) + quantity;
    MockData.save('stock');
    return true;
  },

  release: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) { console.error('Stock not found:', equipmentName, branch); return false; }
    var releaseQty = Math.min(quantity, s.reserved || 0);
    s.reserved = (s.reserved || 0) - releaseQty;
    s.available += releaseQty;
    MockData.save('stock');
    return true;
  },

  // Qty yang bisa dikeluarkan dari gudang untuk sumber tertentu
  // source: 'available' | 'reserved-first' (reserved + available) | 'damaged'
  takeable: function(equipmentName, branch, source) {
    var s = this.find(equipmentName, branch);
    if (!s) return 0;
    if (source === 'damaged') return s.damaged || 0;
    if (source === 'reserved-first') return (s.reserved || 0) + s.available;
    return s.available;
  },

  // Barang keluar fisik dari gudang (dipanggil oleh StockLedger.post)
  take: function(equipmentName, branch, quantity, source) {
    var s = this.find(equipmentName, branch);
    if (!s || this.takeable(equipmentName, branch, source) < quantity) return false;
    if (source === 'damaged') {
      s.damaged -= quantity;
    } else if (source === 'reserved-first') {
      var fromReserved = Math.min(quantity, s.reserved || 0);
      s.reserved = (s.reserved || 0) - fromReserved;
      s.available -= (quantity - fromReserved);
    } else {
      s.available -= quantity;
    }
    s.total -= quantity;
    MockData.save('stock');
    return true;
  },

  // Barang masuk fisik ke gudang (dipanggil oleh StockLedger.post)
  put: function(equipmentName, branch, quantity, condition) {
    var s = this._ensure(equipmentName, branch);
    if (condition === 'damaged') s.damaged = (s.damaged || 0) + quantity;
    else s.available += quantity;
    s.total += quantity;
    MockData.save('stock');
    return true;
  },

  // Perubahan kondisi di dalam gudang (total tidak berubah)
  repairComplete: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) return false;
    var q = Math.min(quantity, s.damaged || 0);
    s.damaged -= q;
    s.available += q;
    MockData.save('stock');
    return true;
  },

  toMaintenance: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s || s.available < quantity) return false;
    s.available -= quantity;
    s.maintenance = (s.maintenance || 0) + quantity;
    MockData.save('stock');
    return true;
  },

  fromMaintenance: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) return false;
    var q = Math.min(quantity, s.maintenance || 0);
    s.maintenance -= q;
    s.available += q;
    MockData.save('stock');
    return true;
  }
};

// ============================================================
// STOCK LEDGER - Perpindahan Stok (MockData.stockMutations)
// Sumber kebenaran qty untuk Rekap Stok:
//   stok gudang  = masuk ke gudang - keluar dari gudang
//   stok proyek  = SJ kirim ke proyek - SJ pulang - hilang
//   laporan stok = stok gudang + stok proyek
// ============================================================

BizLogic.StockLedger = {
  TYPES: {
    OPENING:  { label: 'Saldo Awal',             prefix: 'SA',  icon: 'bi-flag',              color: 'draft',      effect: '+ Stok gudang' },
    PURCHASE: { label: 'Pembelian / Produksi',   prefix: 'PB',  icon: 'bi-cart-plus',         color: 'available',  effect: '+ Stok gudang', code: 'A' },
    TRANSFER: { label: 'Transit Antar Gudang',   prefix: 'TG',  icon: 'bi-arrow-left-right',  color: 'in-transit', effect: '− Gudang asal, + Gudang tujuan', code: 'B' },
    DELIVERY: { label: 'Pengiriman ke Proyek',   prefix: 'SJK', icon: 'bi-truck',             color: 'on-rental',  effect: '− Stok gudang', code: 'C' },
    RETURN:   { label: 'Pemulangan dari Proyek', prefix: 'SJR', icon: 'bi-box-arrow-in-left', color: 'returned',   effect: '+ Stok gudang', code: 'D' },
    SALE:     { label: 'Penjualan ke Customer',  prefix: 'PJ',  icon: 'bi-bag-check',         color: 'overdue',    effect: '− Stok gudang', code: 'E' },
    LOST:     { label: 'Hilang di Proyek',       prefix: 'HL',  icon: 'bi-question-octagon',  color: 'lost',       effect: '− Stok proyek' },
    DISPOSAL: { label: 'Afkir / Dihapus',        prefix: 'AF',  icon: 'bi-trash',             color: 'damaged',    effect: '− Stok gudang' }
  },

  // Urutan sesuai rekap: A. Balikpapan, B. Bekasi, C. Cileungsi
  warehouses: function() {
    return MockData.branches
      .filter(function(b) { return b.status !== 'Inactive'; })
      .slice()
      .sort(function(a, b) { return a.name.localeCompare(b.name); });
  },

  warehouseShort: function(wh) {
    return wh.name.replace(' Warehouse', '');
  },

  // Terima id ('BR-001'), nama ('Cileungsi Warehouse') atau nama pendek ('Cileungsi')
  warehouseIdOf: function(branch) {
    var b = MockData.branches.find(function(x) {
      return x.id === branch || x.name === branch || x.name.replace(' Warehouse', '') === branch;
    });
    return b ? b.id : null;
  },

  docs: function(asOf) {
    var list = MockData.stockMutations || [];
    if (asOf) list = list.filter(function(d) { return d.date <= asOf; });
    return list;
  },

  // Daftar semua nama alat yang dikenal sistem
  equipmentNames: function() {
    var set = {};
    (MockData.stock || []).forEach(function(s) { set[s.equipment] = true; });
    (MockData.stockMutations || []).forEach(function(d) { d.items.forEach(function(i) { set[i.equipment] = true; }); });
    (MockData.projects || []).forEach(function(p) { (p.requirements || []).forEach(function(r) { set[r.equipment] = true; }); });
    (MockData.equipment || []).forEach(function(e) { set[e.name] = true; });
    return Object.keys(set).sort();
  },

  defaultRate: function(equipmentName) {
    var eq = MockData.equipment.find(function(e) { return e.name === equipmentName; });
    return eq ? eq.rate : 0;
  },

  locName: function(loc) {
    if (!loc) return '-';
    if (loc.type === 'warehouse') {
      var b = MockData.branches.find(function(x) { return x.id === loc.id; });
      return b ? b.name : loc.id;
    }
    if (loc.type === 'project') {
      var p = MockData.projects.find(function(x) { return x.id === loc.id; });
      return p ? p.name : loc.id;
    }
    if (loc.type === 'customer') {
      var c = MockData.customers.find(function(x) { return x.id === loc.id; });
      return c ? c.name : loc.id;
    }
    if (loc.type === 'opening') return 'Saldo Awal';
    if (loc.type === 'lost') return 'Hilang';
    if (loc.type === 'disposed') return 'Afkir';
    return loc.name || '-';
  },

  locIcon: function(loc) {
    var map = { warehouse: 'bi-building', project: 'bi-folder', customer: 'bi-people', supplier: 'bi-shop', production: 'bi-gear', opening: 'bi-flag', lost: 'bi-question-octagon', disposed: 'bi-trash' };
    return map[loc && loc.type] || 'bi-geo';
  },

  // Saldo semua lokasi: { 'warehouse:BR-001': { 'Generator 50 KVA': 10, ... }, 'project:PRJ-001': {...} }
  balances: function(asOf) {
    var bal = {};
    function add(loc, eq, qty) {
      if (!loc || (loc.type !== 'warehouse' && loc.type !== 'project')) return;
      var key = loc.type + ':' + loc.id;
      bal[key] = bal[key] || {};
      bal[key][eq] = (bal[key][eq] || 0) + qty;
    }
    this.docs(asOf).forEach(function(d) {
      d.items.forEach(function(it) {
        add(d.from, it.equipment, -it.qty);
        add(d.to, it.equipment, it.qty);
      });
    });
    return bal;
  },

  warehouseBalance: function(equipmentName, warehouseId, asOf) {
    var b = this.balances(asOf)['warehouse:' + warehouseId] || {};
    return b[equipmentName] || 0;
  },

  projectBalance: function(equipmentName, projectId, asOf) {
    var b = this.balances(asOf)['project:' + projectId] || {};
    return b[equipmentName] || 0;
  },

  // Rekap stok proyek per alat: kebutuhan (A), terkirim (B), sisa (A-B), dipulangkan (D), hilang, di lokasi
  projectSummary: function(projectId, asOf) {
    var project = MockData.projects.find(function(p) { return p.id === projectId; });
    var rows = {};
    function row(eq) {
      if (!rows[eq]) rows[eq] = { equipment: eq, required: 0, unitPrice: 0, delivered: 0, returned: 0, lost: 0 };
      return rows[eq];
    }
    ((project && project.requirements) || []).forEach(function(r) {
      var x = row(r.equipment);
      x.required += Number(r.qty) || 0;
      x.unitPrice = Number(r.unitPrice) || 0;
    });
    this.docs(asOf).forEach(function(d) {
      d.items.forEach(function(it) {
        if (d.type === 'DELIVERY' && d.to.type === 'project' && d.to.id === projectId) row(it.equipment).delivered += it.qty;
        if (d.type === 'RETURN' && d.from.type === 'project' && d.from.id === projectId) row(it.equipment).returned += it.qty;
        if (d.type === 'LOST' && d.from.type === 'project' && d.from.id === projectId) row(it.equipment).lost += it.qty;
      });
    });
    return Object.keys(rows).map(function(k) {
      var x = rows[k];
      x.remaining = x.required - x.delivered;
      x.onSite = x.delivered - x.returned - x.lost;
      return x;
    });
  },

  projectDocs: function(projectId, type) {
    return (MockData.stockMutations || []).filter(function(d) {
      if (type && d.type !== type) return false;
      return (d.to.type === 'project' && d.to.id === projectId) || (d.from.type === 'project' && d.from.id === projectId);
    }).sort(function(a, b) { return a.date.localeCompare(b.date) || a.no.localeCompare(b.no); });
  },

  nextNo: function(type, date) {
    var t = this.TYPES[type];
    var d = (date || new Date().toISOString().split('T')[0]);
    var base = t.prefix + '-' + d.substring(2, 4) + d.substring(5, 7) + '-';
    var used = {};
    (MockData.stockMutations || []).forEach(function(m) { used[m.no] = true; });
    (MockData.deliveries || []).forEach(function(m) { if (m.sjNo) used[m.sjNo] = true; });
    (MockData.returns || []).forEach(function(m) { if (m.sjNo) used[m.sjNo] = true; });
    var seq = 1;
    while (used[base + String(seq).padStart(3, '0')]) seq++;
    return base + String(seq).padStart(3, '0');
  },

  // Validasi + posting dokumen perpindahan.
  // doc: { type, date, from, to, items:[{equipment, qty, condition?, unitPrice?}], reference?, notes?, no? }
  // opts.source: sumber stok gudang saat keluar ('available' | 'reserved-first' | 'damaged')
  post: function(doc, opts) {
    opts = opts || {};
    var self = this;
    var type = this.TYPES[doc.type];
    if (!type) return { success: false, error: 'Jenis perpindahan tidak dikenal: ' + doc.type };

    var items = (doc.items || [])
      .map(function(i) { return Object.assign({}, i, { qty: Number(i.qty) || 0 }); })
      .filter(function(i) { return i.equipment && i.qty > 0; });
    if (!items.length) return { success: false, error: 'Minimal satu alat dengan qty > 0' };

    if (doc.from.type === 'warehouse' && doc.to.type === 'warehouse' && doc.from.id === doc.to.id) {
      return { success: false, error: 'Gudang asal dan tujuan tidak boleh sama' };
    }

    // Jumlahkan per alat untuk validasi
    var need = {};
    items.forEach(function(i) { need[i.equipment] = (need[i.equipment] || 0) + i.qty; });
    var errors = [];
    var source = opts.source || 'available';
    Object.keys(need).forEach(function(eq) {
      if (doc.from.type === 'warehouse') {
        var avail = BizLogic.Stock.takeable(eq, doc.from.id, source);
        if (avail < need[eq]) errors.push(eq + ': butuh ' + need[eq] + ', tersedia di ' + self.locName(doc.from) + ' hanya ' + avail);
      }
      if (doc.from.type === 'project') {
        var onSite = self.projectBalance(eq, doc.from.id);
        if (onSite < need[eq]) errors.push(eq + ': butuh ' + need[eq] + ', di lokasi proyek hanya ' + onSite);
      }
    });
    if (errors.length) return { success: false, error: errors.join('\n') };

    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    var date = doc.date || new Date().toISOString().split('T')[0];
    var mut = {
      id: MockData.generateId('MUT', 'stockMutations'),
      no: doc.no || this.nextNo(doc.type, date),
      date: date,
      type: doc.type,
      from: doc.from,
      to: doc.to,
      reference: doc.reference || '',
      notes: doc.notes || '',
      user: user.name || 'System',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      items: items
    };

    items.forEach(function(it) {
      if (doc.from.type === 'warehouse') BizLogic.Stock.take(it.equipment, doc.from.id, it.qty, source);
      if (doc.to.type === 'warehouse') BizLogic.Stock.put(it.equipment, doc.to.id, it.qty, it.condition);
    });

    MockData.stockMutations.push(mut);
    MockData.save('stockMutations');

    var totalQty = items.reduce(function(s, i) { return s + i.qty; }, 0);
    BizLogic.Activity.log(type.label + ' ' + mut.no + ' (' + totalQty + ' unit): ' + this.locName(doc.from) + ' → ' + this.locName(doc.to), 'info');

    return { success: true, mutation: mut };
  }
};

// ============================================================
// MOVEMENT LOG
// ============================================================

BizLogic.Movement = {
  create: function(type, equipment, quantity, from, to, reference, user) {
    var mov = {
      id: MockData.generateId('MOV', 'movements'),
      date: new Date().toISOString().split('T')[0],
      equipment: equipment,
      quantity: quantity,
      from: from,
      to: to,
      type: type,
      reference: reference,
      user: user || (JSON.parse(sessionStorage.getItem('er_user') || '{}').name || 'System'),
      status: 'Completed'
    };
    MockData.movements.push(mov);
    MockData.save('movements');
    return mov;
  }
};

// ============================================================
// NOTIFICATION MANAGER
// ============================================================

BizLogic.Notification = {
  add: function(message, type, icon, link) {
    var notif = {
      id: Date.now(),
      message: message,
      type: type || 'info',
      icon: icon || 'bi-info-circle',
      time: 'Just now',
      read: false,
      link: link || '#'
    };
    MockData.notifications.unshift(notif);
    if (MockData.notifications.length > 20) {
      MockData.notifications = MockData.notifications.slice(0, 20);
    }
    MockData.save('notifications');
    return notif;
  }
};

// ============================================================
// ACTIVITY LOG
// ============================================================

BizLogic.Activity = {
  log: function(action, type) {
    var now = new Date();
    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    var entry = {
      time: now.toTimeString().substring(0, 5),
      date: now.toISOString().split('T')[0],
      action: action,
      user: user.name || 'System',
      type: type || 'info'
    };
    MockData.activityLog.unshift(entry);
    if (MockData.activityLog.length > 50) {
      MockData.activityLog = MockData.activityLog.slice(0, 50);
    }
    MockData.save('activityLog');
    return entry;
  }
};

// ============================================================
// RENTAL OPERATIONS
// ============================================================

BizLogic.Rental = {
  submit: function(rentalId) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    if (!BizLogic.validateTransition(BizLogic.RentalTransitions, rental.status, 'Pending Approval')) {
      return { success: false, error: 'Cannot submit from status: ' + rental.status };
    }

    rental.status = 'Pending Approval';
    rental.submittedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    MockData.save('rentals');

    BizLogic.Activity.log('Rental ' + rentalId + ' submitted for approval', 'info');
    BizLogic.Notification.add(
      'Rental <strong>' + rentalId + '</strong> is waiting for approval',
      'warning', 'bi-clock-history',
      'rental-detail.html?id=' + rentalId
    );

    return { success: true };
  },

  approve: function(rentalId, approverNotes) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    var currentStatus = rental.status;
    // Allow approve from Pending Approval or Waiting Approval (legacy)
    if (currentStatus !== 'Pending Approval' && currentStatus !== 'Waiting Approval') {
      return { success: false, error: 'Cannot approve from status: ' + currentStatus };
    }

    var branch = rental.branch ? rental.branch.replace(' Warehouse', '') : 'Cileungsi';
    var reservationErrors = [];

    rental.items.forEach(function(item) {
      var available = BizLogic.Stock.getAvailable(item.name, branch);
      if (available < item.quantity) {
        reservationErrors.push(item.name + ': need ' + item.quantity + ', only ' + available + ' available');
      }
    });

    if (reservationErrors.length > 0) {
      return { success: false, error: 'Insufficient stock:\n' + reservationErrors.join('\n') };
    }

    // Reserve all items
    rental.items.forEach(function(item) {
      BizLogic.Stock.reserve(item.name, branch, item.quantity);
      BizLogic.Movement.create('Reservation', item.name, item.quantity, branch + ' Warehouse', 'Reserved for ' + rentalId, rentalId);
    });

    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    rental.status = 'Approved';
    rental.approvedBy = user.name || 'Manager';
    rental.approvedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
    rental.approvalNotes = approverNotes || '';
    rental.deliveryStatus = 'Pending';
    MockData.save('rentals');

    BizLogic.Activity.log('Rental ' + rentalId + ' approved by ' + rental.approvedBy, 'success');
    BizLogic.Notification.add(
      'Rental <strong>' + rentalId + '</strong> has been approved',
      'green', 'bi-check-circle',
      'rental-detail.html?id=' + rentalId
    );

    return { success: true };
  },

  reject: function(rentalId, reason) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    if (rental.status !== 'Pending Approval' && rental.status !== 'Waiting Approval') {
      return { success: false, error: 'Cannot reject from status: ' + rental.status };
    }

    // Penyewaan Pending belum memesan stok (stok baru dipesan saat disetujui), jadi tidak ada yang dilepas.
    // Melepas di sini dulu bisa ikut melepas pesanan penyewaan lain di gudang yang sama.
    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    rental.status = 'Rejected';
    rental.rejectedBy = user.name || 'Manager';
    rental.rejectedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
    rental.rejectionReason = reason || 'No reason provided';
    MockData.save('rentals');

    BizLogic.Activity.log('Rental ' + rentalId + ' rejected: ' + reason, 'danger');
    BizLogic.Notification.add(
      'Rental <strong>' + rentalId + '</strong> has been rejected',
      'red', 'bi-x-circle',
      'rental-detail.html?id=' + rentalId
    );

    return { success: true };
  },

  cancel: function(rentalId, reason) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    var cancellableStatuses = ['Draft', 'Pending Approval', 'Waiting Approval', 'Approved'];
    if (cancellableStatuses.indexOf(rental.status) === -1) {
      return { success: false, error: 'Cannot cancel from status: ' + rental.status + '. Only Draft, Pending Approval, or Approved rentals can be cancelled.' };
    }

    // Release any existing reservations if approved
    var branch = rental.branch ? rental.branch.replace(' Warehouse', '') : 'Cileungsi';
    if (rental.status === 'Approved') {
      rental.items.forEach(function(item) {
        BizLogic.Stock.release(item.name, branch, item.quantity);
        BizLogic.Movement.create('Reservation Release', item.name, item.quantity, 'Reserved for ' + rentalId, branch + ' Warehouse', rentalId);
      });
    }

    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    rental.status = 'Cancelled';
    rental.cancelledBy = user.name || 'Admin';
    rental.cancelledDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
    rental.cancellationReason = reason || 'No reason provided';
    MockData.save('rentals');

    BizLogic.Activity.log('Rental ' + rentalId + ' cancelled: ' + reason, 'danger');
    BizLogic.Notification.add(
      'Rental <strong>' + rentalId + '</strong> has been cancelled',
      'red', 'bi-x-circle',
      'rental-detail.html?id=' + rentalId
    );

    return { success: true };
  },

  resubmit: function(rentalId) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    if (rental.status !== 'Rejected') {
      return { success: false, error: 'Only rejected rentals can be resubmitted' };
    }

    rental.status = 'Pending Approval';
    rental.rejectedBy = null;
    rental.rejectedDate = null;
    rental.rejectionReason = null;
    rental.resubmittedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    MockData.save('rentals');

    BizLogic.Activity.log('Rental ' + rentalId + ' resubmitted for approval', 'info');
    BizLogic.Notification.add(
      'Rental <strong>' + rentalId + '</strong> has been resubmitted for approval',
      'warning', 'bi-arrow-repeat',
      'rental-detail.html?id=' + rentalId
    );

    return { success: true };
  },

  // Perpanjangan sewa: ubah Tanggal Kembali (tagihan tetap dihitung dari SJ kirim/pulang)
  extend: function(rentalId, newDate, reason) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };
    var allowed = ['Approved', 'Preparing', 'Partially Delivered', 'On Rental', 'Partially Returned', 'Overdue'];
    if (allowed.indexOf(rental.status) === -1) return { success: false, error: 'Penyewaan berstatus ' + rental.status + ' tidak bisa diperpanjang' };
    if (!newDate) return { success: false, error: 'Isi tanggal kembali yang baru' };
    if (newDate <= rental.returnDate) return { success: false, error: 'Tanggal baru harus setelah tanggal kembali sekarang (' + rental.returnDate + ')' };
    if (!String(reason || '').trim()) return { success: false, error: 'Alasan perpanjangan wajib diisi' };

    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    if (!MockData.extensions) MockData.extensions = [];
    var ext = {
      id: MockData.generateId('EXT', 'extensions'),
      rentalId: rental.id, projectId: rental.projectId, customerName: rental.customerName,
      oldReturnDate: rental.returnDate, newReturnDate: newDate,
      days: BizLogic.Billing.days(rental.returnDate, newDate) - 1,
      reason: String(reason).trim(), date: new Date().toISOString().split('T')[0], user: user.name || 'Admin'
    };
    MockData.extensions.push(ext);
    rental.returnDate = newDate;
    MockData.save('extensions');
    MockData.save('rentals');
    BizLogic.Activity.log('Rental ' + rental.id + ' diperpanjang s/d ' + newDate + ' (' + ext.days + ' hari)', 'info');
    return { success: true, extension: ext };
  },

  isOverdue: function(rental) {
    if (['Completed', 'Cancelled', 'Rejected', 'Draft'].includes(rental.status)) return false;
    if (!rental.returnDate) return false;
    var today = new Date();
    today.setHours(0,0,0,0);
    var returnDate = new Date(rental.returnDate);
    returnDate.setHours(0,0,0,0);
    return today > returnDate && ['On Rental', 'Partially Returned', 'Overdue', 'Partially Delivered'].includes(rental.status);
  },

  getOverdueDays: function(rental) {
    if (!this.isOverdue(rental)) return 0;
    var today = new Date();
    today.setHours(0,0,0,0);
    var returnDate = new Date(rental.returnDate);
    returnDate.setHours(0,0,0,0);
    return Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24));
  }
};

// ============================================================
// DELIVERY OPERATIONS
// ============================================================

BizLogic.Delivery = {
  create: function(rentalId, items, details) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    var allowedStatuses = ['Approved', 'Preparing', 'Partially Delivered', 'On Rental'];
    if (allowedStatuses.indexOf(rental.status) === -1) {
      return { success: false, error: 'Cannot create delivery for rental in status: ' + rental.status };
    }

    if (!items || items.length === 0) {
      return { success: false, error: 'At least one item is required' };
    }

    // Validate quantities against remaining delivery quantity
    var existingDeliveries = MockData.deliveries.filter(function(d) {
      return d.rentalId === rentalId && d.status !== 'Failed';
    });

    for (var idx = 0; idx < items.length; idx++) {
      var item = items[idx];
      var rentalItem = rental.items.find(function(ri) { return ri.name === item.name; });
      if (!rentalItem) return { success: false, error: 'Item ' + item.name + ' not found in rental' };

      var alreadyDelivered = existingDeliveries.reduce(function(sum, d) {
        var di = d.items.find(function(i) { return i.name === item.name; });
        return sum + (di ? di.qty : 0);
      }, 0);

      var remaining = rentalItem.quantity - alreadyDelivered;
      if (item.qty > remaining) {
        return { success: false, error: item.name + ': cannot deliver ' + item.qty + ', only ' + remaining + ' remaining' };
      }
    }

    var deliveryDate = details.deliveryDate || new Date().toISOString().split('T')[0];
    var delivery = {
      id: MockData.generateId('DLV', 'deliveries'),
      sjNo: BizLogic.StockLedger.nextNo('DELIVERY', deliveryDate),
      rentalId: rentalId,
      projectId: rental.projectId,
      projectName: rental.projectName,
      customerId: rental.customerId,
      customerName: rental.customerName,
      driverId: details.driverId || null,
      driverName: details.driverName || null,
      vehicleId: details.vehicleId || null,
      vehiclePlate: details.vehiclePlate || null,
      deliveryDate: details.deliveryDate || new Date().toISOString().split('T')[0],
      destination: details.destination || '',
      status: details.driverId ? 'Assigned' : 'Preparing',
      notes: details.notes || '',
      items: items,
      proofOfDelivery: null,
      failureInfo: null
    };

    MockData.deliveries.push(delivery);
    MockData.save('deliveries');

    // Update rental status
    if (rental.status === 'Approved') {
      rental.status = 'Preparing';
      rental.deliveryStatus = 'Preparing';
      MockData.save('rentals');
    }

    // Update driver status if assigned
    if (details.driverId) {
      var driver = MockData.drivers.find(function(d) { return d.id === details.driverId; });
      if (driver) {
        driver.status = 'On Delivery';
        driver.currentDelivery = delivery.id;
        MockData.save('drivers');
      }
    }

    // Update vehicle status if assigned
    if (details.vehicleId) {
      var vehicle = MockData.vehicles.find(function(v) { return v.id === details.vehicleId; });
      if (vehicle) {
        vehicle.status = 'On Delivery';
        vehicle.currentDelivery = delivery.id;
        MockData.save('vehicles');
      }
    }

    BizLogic.Activity.log('Delivery ' + delivery.id + ' created for ' + rentalId, 'info');
    BizLogic.Notification.add(
      'Delivery <strong>' + delivery.id + '</strong> created for rental ' + rentalId,
      'info', 'bi-truck',
      'delivery-detail.html?id=' + delivery.id
    );

    return { success: true, delivery: delivery };
  },

  updateStatus: function(deliveryId, newStatus, extraData) {
    var delivery = MockData.deliveries.find(function(d) { return d.id === deliveryId; });
    if (!delivery) return { success: false, error: 'Delivery not found' };

    if (!BizLogic.validateTransition(BizLogic.DeliveryTransitions, delivery.status, newStatus)) {
      return { success: false, error: 'Cannot transition from ' + delivery.status + ' to ' + newStatus };
    }

    delivery.status = newStatus;

    if (newStatus === 'Departed') {
      delivery.departedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    }

    if (newStatus === 'Arrived') {
      delivery.arrivedAt = (extraData && extraData.arrivedAt) || new Date().toISOString().replace('T', ' ').substring(0, 16);
      if (extraData && extraData.proofOfDelivery) {
        delivery.proofOfDelivery = extraData.proofOfDelivery;
      }
      if (extraData && extraData.arrivalPhoto) delivery.arrivalPhoto = extraData.arrivalPhoto;
      if (extraData && extraData.arrivalNotes) delivery.arrivalNotes = extraData.arrivalNotes;
    }

    if (newStatus === 'Completed') {
      delivery.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

      // Surat Jalan kirim: stok gudang (reserved dulu) → stok proyek
      var rental = MockData.rentals.find(function(r) { return r.id === delivery.rentalId; });
      if (rental) {
        var branch = rental.branch ? rental.branch.replace(' Warehouse', '') : 'Cileungsi';
        var posted = BizLogic.StockLedger.post({
          type: 'DELIVERY',
          no: delivery.sjNo,
          date: new Date().toISOString().split('T')[0],
          from: { type: 'warehouse', id: rental.branchId || BizLogic.StockLedger.warehouseIdOf(branch) },
          to: { type: 'project', id: delivery.projectId },
          reference: delivery.id + ' / ' + rental.id,
          items: delivery.items.map(function(i) { return { equipment: i.name, qty: i.qty }; })
        }, { source: 'reserved-first' });
        if (!posted.success) {
          delivery.status = 'Arrived';
          delivery.completedAt = null;
          return { success: false, error: posted.error };
        }
        delivery.sjNo = posted.mutation.no;
        delivery.items.forEach(function(item) {
          BizLogic.Movement.create('Rental Out', item.name, item.qty, branch + ' Warehouse', delivery.destination || rental.projectName, delivery.sjNo);
        });

        // Check if all items delivered
        BizLogic.Delivery._updateRentalDeliveryStatus(rental);
      }

      // Release driver and vehicle
      BizLogic.Delivery._releaseDriverVehicle(delivery);
    }

    if (newStatus === 'Failed') {
      delivery.failureInfo = extraData || {};
      delivery.failedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      BizLogic.Delivery._releaseDriverVehicle(delivery);

      BizLogic.Notification.add(
        'Delivery <strong>' + deliveryId + '</strong> has failed: ' + ((extraData && extraData.reason) || 'Unknown'),
        'red', 'bi-exclamation-triangle',
        'delivery-detail.html?id=' + deliveryId
      );
    }

    if (newStatus === 'Rescheduled') {
      delivery.rescheduledAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      if (extraData && extraData.newDate) {
        delivery.deliveryDate = extraData.newDate;
      }
    }

    MockData.save('deliveries');
    BizLogic.Activity.log('Delivery ' + deliveryId + ' status changed to ' + newStatus, newStatus === 'Failed' ? 'danger' : 'info');

    return { success: true };
  },

  // Tugaskan driver & kendaraan ke DLV yang belum punya driver (Preparing) atau dijadwal ulang (Rescheduled)
  assign: function(deliveryId, data) {
    data = data || {};
    var delivery = MockData.deliveries.find(function(d) { return d.id === deliveryId; });
    if (!delivery) return { success: false, error: 'Delivery not found' };
    if (delivery.status !== 'Preparing' && delivery.status !== 'Rescheduled') {
      return { success: false, error: 'Driver hanya bisa ditugaskan saat status Preparing / Rescheduled' };
    }
    var driver = MockData.drivers.find(function(d) { return d.id === data.driverId; });
    if (!driver) return { success: false, error: 'Pilih driver' };
    if (driver.status !== 'Available') return { success: false, error: 'Driver ' + driver.name + ' sedang ' + driver.status };
    var vehicle = data.vehicleId ? MockData.vehicles.find(function(v) { return v.id === data.vehicleId; }) : null;
    if (data.vehicleId && (!vehicle || vehicle.status !== 'Available')) return { success: false, error: 'Kendaraan tidak tersedia' };

    if (data.deliveryDate) delivery.deliveryDate = data.deliveryDate;
    delivery.driverId = driver.id; delivery.driverName = driver.name;
    driver.status = 'On Delivery'; driver.currentDelivery = delivery.id;
    if (vehicle) {
      delivery.vehicleId = vehicle.id; delivery.vehiclePlate = vehicle.plate;
      vehicle.status = 'On Delivery'; vehicle.currentDelivery = delivery.id;
    }
    delivery.status = 'Assigned';
    delivery.assignedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    MockData.save('deliveries'); MockData.save('drivers'); MockData.save('vehicles');
    BizLogic.Activity.log('Delivery ' + delivery.id + ' ditugaskan ke ' + driver.name, 'info');
    return { success: true };
  },

  _releaseDriverVehicle: function(delivery) {
    if (delivery.driverId) {
      var driver = MockData.drivers.find(function(d) { return d.id === delivery.driverId; });
      if (driver) {
        driver.status = 'Available';
        driver.currentDelivery = null;
        MockData.save('drivers');
      }
    }
    if (delivery.vehicleId) {
      var vehicle = MockData.vehicles.find(function(v) { return v.id === delivery.vehicleId; });
      if (vehicle) {
        vehicle.status = 'Available';
        vehicle.currentDelivery = null;
        MockData.save('vehicles');
      }
    }
  },

  _updateRentalDeliveryStatus: function(rental) {
    var deliveries = MockData.deliveries.filter(function(d) {
      return d.rentalId === rental.id && ['Completed','Arrived'].indexOf(d.status) === -1 ? false : true;
    }).filter(function(d) { return d.status === 'Completed' || d.status === 'Arrived'; });

    var completedDeliveries = MockData.deliveries.filter(function(d) {
      return d.rentalId === rental.id && d.status === 'Completed';
    });

    rental.items.forEach(function(rentalItem) {
      var totalDelivered = completedDeliveries.reduce(function(sum, d) {
        var di = d.items.find(function(i) { return i.name === rentalItem.name; });
        return sum + (di ? di.qty : 0);
      }, 0);
      rentalItem.delivered = totalDelivered;
    });

    var allDelivered = rental.items.every(function(i) { return (i.delivered || 0) >= i.quantity; });
    var someDelivered = rental.items.some(function(i) { return (i.delivered || 0) > 0; });

    if (allDelivered) {
      rental.status = 'On Rental';
      rental.deliveryStatus = 'Completed';
    } else if (someDelivered) {
      rental.status = 'Partially Delivered';
      rental.deliveryStatus = 'Partial';
    }

    MockData.save('rentals');
  }
};

// ============================================================
// RETURN OPERATIONS
// ============================================================

BizLogic.Return = {
  completeInspection: function(returnId, classifiedItems) {
    var ret = MockData.returns.find(function(r) { return r.id === returnId; });
    if (!ret) return { success: false, error: 'Return not found' };

    if (ret.status === 'Completed') {
      return { success: false, error: 'Return is already completed' };
    }

    var rental = MockData.rentals.find(function(r) { return r.id === ret.rentalId; });
    var branch = rental ? (rental.branch ? rental.branch.replace(' Warehouse', '') : 'Cileungsi') : 'Cileungsi';
    var warehouseId = (rental && rental.branchId) || BizLogic.StockLedger.warehouseIdOf(branch);

    // Validasi dulu semua baris sebelum ada stok yang berubah
    var backItems = [], lostItems = [];
    for (var v = 0; v < ret.items.length; v++) {
      var c = classifiedItems[v];
      var sum = c.good + c.damaged + c.lost + c.missing;
      if (sum !== ret.items[v].sent) {
        return { success: false, error: ret.items[v].name + ': classified total (' + sum + ') does not match sent (' + ret.items[v].sent + ')' };
      }
      var onSite = BizLogic.StockLedger.projectBalance(ret.items[v].name, ret.projectId);
      if (ret.projectId && onSite < sum) {
        return { success: false, error: ret.items[v].name + ': stok di proyek hanya ' + onSite + ', tidak bisa dipulangkan ' + sum };
      }
      if (c.good > 0) backItems.push({ equipment: ret.items[v].name, qty: c.good });
      if (c.damaged > 0) backItems.push({ equipment: ret.items[v].name, qty: c.damaged, condition: 'damaged' });
      if (c.lost + c.missing > 0) lostItems.push({ equipment: ret.items[v].name, qty: c.lost + c.missing });
    }

    // Surat Jalan pulang: stok proyek → stok gudang (rusak masuk ke kondisi "rusak")
    var today = new Date().toISOString().split('T')[0];
    if (ret.projectId && backItems.length) {
      var back = BizLogic.StockLedger.post({
        type: 'RETURN', no: ret.sjNo, date: today,
        from: { type: 'project', id: ret.projectId },
        to: { type: 'warehouse', id: warehouseId },
        reference: ret.id + ' / ' + ret.rentalId,
        items: backItems
      });
      if (!back.success) return back;
      ret.sjNo = back.mutation.no;
    }
    if (ret.projectId && lostItems.length) {
      BizLogic.StockLedger.post({
        type: 'LOST', date: today,
        from: { type: 'project', id: ret.projectId },
        to: { type: 'lost' },
        reference: ret.id,
        notes: 'Hilang / belum kembali saat inspeksi pengembalian',
        items: lostItems
      });
    }

    for (var i = 0; i < ret.items.length; i++) {
      var item = ret.items[i];
      var classified = classifiedItems[i];

      item.good = classified.good;
      item.damaged = classified.damaged;
      item.lost = classified.lost;
      item.missing = classified.missing;
      item.damageNotes = classified.damageNotes || '';

      if (classified.good > 0) {
        BizLogic.Movement.create('Return', item.name, classified.good, ret.projectName || 'Project', branch + ' Warehouse', ret.id);
      }
      if (classified.damaged > 0) {
        BizLogic.Movement.create('Return (Damaged)', item.name, classified.damaged, ret.projectName || 'Project', branch + ' Warehouse (Damaged)', ret.id);

        // Create repair record
        if (!MockData.repairs) MockData.repairs = [];
        var repair = {
          id: MockData.generateId('REP', 'repairs'),
          equipmentName: item.name,
          quantity: classified.damaged,
          sourceReturn: ret.id,
          sourceRental: ret.rentalId,
          branch: branch,
          problem: classified.damageNotes || 'Damage reported during return inspection',
          status: 'Pending',
          startDate: null,
          completionDate: null,
          notes: '',
          createdDate: new Date().toISOString().split('T')[0]
        };
        MockData.repairs.push(repair);
        MockData.save('repairs');
      }
      if (classified.lost > 0) {
        BizLogic.Movement.create('Lost', item.name, classified.lost, ret.projectName || 'Project', 'Lost', ret.id);
      }
    }

    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    ret.status = 'Completed';
    ret.inspectedBy = user.name || 'Warehouse Staff';
    ret.completedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
    MockData.save('returns');

    // Check if rental should be completed
    if (rental) {
      BizLogic.Return._updateRentalReturnStatus(rental);
    }

    BizLogic.Activity.log('Return ' + returnId + ' inspection completed', 'success');

    return { success: true };
  },

  _updateRentalReturnStatus: function(rental) {
    var returns = MockData.returns.filter(function(r) {
      return r.rentalId === rental.id && r.status === 'Completed';
    });

    rental.items.forEach(function(rentalItem) {
      var totalReturned = returns.reduce(function(sum, r) {
        return sum + r.items.reduce(function(isum, ri) {
          if (ri.name === rentalItem.name) {
            return isum + ri.sent;
          }
          return isum;
        }, 0);
      }, 0);
      rentalItem.returned = totalReturned;
    });

    var allReturned = rental.items.every(function(i) { return (i.returned || 0) >= i.quantity; });
    var someReturned = rental.items.some(function(i) { return (i.returned || 0) > 0; });

    if (allReturned) {
      rental.status = 'Completed';
    } else if (someReturned) {
      rental.status = 'Partially Returned';
    }

    MockData.save('rentals');
  }
};

// ============================================================
// REUSABLE CONFIRMATION MODAL
// ============================================================

BizLogic.showConfirmModal = function(title, message, confirmText, confirmClass, onConfirm, extraFields) {
  var existing = document.getElementById('bizConfirmModal');
  if (existing) existing.remove();

  var fieldsHtml = '';
  if (extraFields) {
    extraFields.forEach(function(f) {
      if (f.type === 'textarea') {
        fieldsHtml += '<div class="mb-3"><label class="form-label form-label-er">' + f.label + (f.required ? ' <span class="text-danger">*</span>' : '') + '</label><textarea class="form-control" id="confirmField_' + f.id + '" rows="' + (f.rows || 2) + '" placeholder="' + (f.placeholder || '') + '"' + (f.required ? ' required' : '') + '></textarea></div>';
      } else if (f.type === 'select') {
        var opts = f.options.map(function(o) { return '<option value="' + o.value + '">' + o.label + '</option>'; }).join('');
        fieldsHtml += '<div class="mb-3"><label class="form-label form-label-er">' + f.label + '</label><select class="form-select" id="confirmField_' + f.id + '">' + opts + '</select></div>';
      } else if (f.type === 'date') {
        fieldsHtml += '<div class="mb-3"><label class="form-label form-label-er">' + f.label + '</label><input type="date" class="form-control" id="confirmField_' + f.id + '" value="' + (f.value || new Date().toISOString().split('T')[0]) + '"></div>';
      } else {
        fieldsHtml += '<div class="mb-3"><label class="form-label form-label-er">' + f.label + '</label><input type="' + (f.type || 'text') + '" class="form-control" id="confirmField_' + f.id + '" value="' + (f.value || '') + '" placeholder="' + (f.placeholder || '') + '"></div>';
      }
    });
  }

  var modalHtml = '<div class="modal fade" id="bizConfirmModal" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">' + title + '</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><p>' + message + '</p>' + fieldsHtml + '</div><div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" class="btn ' + (confirmClass || 'btn-primary') + '" id="bizConfirmBtn">' + (confirmText || 'Confirm') + '</button></div></div></div></div>';

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  var modal = new bootstrap.Modal(document.getElementById('bizConfirmModal'));

  document.getElementById('bizConfirmBtn').addEventListener('click', function() {
    var fieldValues = {};
    if (extraFields) {
      var isValid = true;
      extraFields.forEach(function(f) {
        var el = document.getElementById('confirmField_' + f.id);
        fieldValues[f.id] = el ? el.value : '';
        if (f.required && !fieldValues[f.id].trim()) {
          el.classList.add('is-invalid');
          isValid = false;
        }
      });
      if (!isValid) return;
    }
    modal.hide();
    if (onConfirm) onConfirm(fieldValues);
  });

  document.getElementById('bizConfirmModal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });

  modal.show();
};
// ============================================================
// REPAIR OPERATIONS
// ============================================================

BizLogic.Repair = {
  updateStatus: function(repairId, newStatus, extraData) {
    var repair = MockData.repairs.find(function(r) { return r.id === repairId; });
    if (!repair) return { success: false, error: 'Repair not found' };

    if (!BizLogic.validateTransition(BizLogic.RepairTransitions, repair.status, newStatus)) {
      return { success: false, error: 'Cannot transition from ' + repair.status + ' to ' + newStatus };
    }

    repair.status = newStatus;
    
    if (newStatus === 'In Repair') {
      repair.startDate = new Date().toISOString().split('T')[0];
    }
    
    if (newStatus === 'Completed' || newStatus === 'Unrepairable') {
      repair.completionDate = new Date().toISOString().split('T')[0];
      if (extraData && extraData.notes) {
        repair.notes = extraData.notes;
      }
    }

    if (newStatus === 'Completed') {
      BizLogic.Stock.repairComplete(repair.equipmentName, repair.branch, repair.quantity);
      BizLogic.Movement.create('Repair Completed', repair.equipmentName, repair.quantity, repair.branch + ' Warehouse (Damaged)', repair.branch + ' Warehouse', repair.id);
    }
    
    if (newStatus === 'Unrepairable') {
      // Afkir: keluar dari stok gudang (kondisi rusak)
      var disposed = BizLogic.StockLedger.post({
        type: 'DISPOSAL',
        from: { type: 'warehouse', id: BizLogic.StockLedger.warehouseIdOf(repair.branch) },
        to: { type: 'disposed' },
        reference: repair.id,
        notes: (extraData && extraData.notes) || 'Tidak dapat diperbaiki',
        items: [{ equipment: repair.equipmentName, qty: repair.quantity }]
      }, { source: 'damaged' });
      if (!disposed.success) {
        repair.status = 'In Repair';
        repair.completionDate = null;
        return { success: false, error: disposed.error };
      }
      repair.disposalNo = disposed.mutation.no;
      BizLogic.Movement.create('Disposal', repair.equipmentName, repair.quantity, repair.branch + ' Warehouse (Damaged)', 'Disposed', repair.id);
    }

    MockData.save('repairs');
    BizLogic.Activity.log('Repair ' + repair.id + ' status changed to ' + newStatus, newStatus === 'Unrepairable' ? 'danger' : 'info');
    return { success: true };
  }
};

// ============================================================
// CLAIM OPERATIONS
// ============================================================

BizLogic.Claim = {
  updateStatus: function(claimId, newStatus, extraData) {
    var claim = MockData.claims.find(function(c) { return c.id === claimId; });
    if (!claim) return { success: false, error: 'Claim not found' };

    if (!BizLogic.validateTransition(BizLogic.ClaimTransitions, claim.status, newStatus)) {
      return { success: false, error: 'Cannot transition from ' + claim.status + ' to ' + newStatus };
    }

    claim.status = newStatus;
    
    if (newStatus === 'Disputed') {
      claim.disputeReason = (extraData && extraData.reason) || 'Customer disputed claim amount';
    }
    
    if (newStatus === 'Invoiced') {
      // Invoice klaim masuk ke piutang
      var invoice = BizLogic.Invoice.createForClaim(claim);
      claim.invoiceId = invoice.id;
      claim.invoiceStatus = invoice.status;
    }
    if (newStatus === 'Closed') {
      claim.closedDate = new Date().toISOString().split('T')[0];
      if (extraData && extraData.reason) claim.closeReason = extraData.reason;
    }

    MockData.save('claims');
    BizLogic.Activity.log('Claim ' + claim.id + ' status changed to ' + newStatus, 'warning');
    return { success: true };
  },

  // Nilai klaim default per unit: hilang = nilai ganti (harga sewa/bulan × 10), rusak = 30% nilai ganti (biaya perbaikan).
  // Nilai bisa diubah di claim-detail sebelum invoice dibuat.
  REPLACEMENT_FACTOR: 10,
  DAMAGE_RATE: 0.3,
  unitValues: function(projectId, equipment) {
    var replace = BizLogic.Billing.unitPrice(projectId, equipment) * this.REPLACEMENT_FACTOR;
    return { lost: replace, damaged: Math.round(replace * this.DAMAGE_RATE) };
  },

  // Buat klaim dari hasil inspeksi pengembalian (1 klaim per alat yang rusak / hilang / missing)
  createFromReturn: function(returnId) {
    var ret = MockData.returns.find(function(r) { return r.id === returnId; });
    if (!ret) return { success: false, error: 'Return not found' };
    if (ret.status !== 'Completed') return { success: false, error: 'Selesaikan inspeksi dulu sebelum membuat klaim' };
    if (MockData.claims.some(function(c) { return c.returnId === ret.id; })) return { success: false, error: 'Klaim untuk ' + ret.id + ' sudah dibuat' };
    var self = this, created = [];
    ret.items.forEach(function(item) {
      var lost = (item.lost || 0) + (item.missing || 0), dmg = item.damaged || 0;
      if (!lost && !dmg) return;
      var v = self.unitValues(ret.projectId, item.name);
      var parts = [];
      if (dmg) parts.push('Rusak ' + dmg + (item.damageNotes ? ' (' + item.damageNotes + ')' : ''));
      if (item.lost) parts.push('Hilang ' + item.lost);
      if (item.missing) parts.push('Missing ' + item.missing);
      var claim = {
        id: MockData.generateId('CLM', 'claims'),
        returnId: ret.id, rentalId: ret.rentalId,
        projectId: ret.projectId, projectName: ret.projectName,
        customerId: ret.customerId, customerName: ret.customerName,
        equipment: item.name, quantity: lost + dmg,
        damagedQty: dmg, lostQty: lost,
        reason: parts.join(', '),
        claimAmount: dmg * v.damaged + lost * v.lost,
        customerConfirmation: 'Waiting', status: 'Draft', invoiceId: null, invoiceStatus: null,
        createdDate: new Date().toISOString().split('T')[0]
      };
      MockData.claims.push(claim);
      created.push(claim);
      BizLogic.Activity.log('Claim ' + claim.id + ' created for ' + item.name, 'warning');
    });
    if (!created.length) return { success: false, error: 'Tidak ada barang rusak / hilang untuk diklaim' };
    MockData.save('claims');
    return { success: true, claims: created };
  },

  // Ubah nilai klaim (sebelum diterbitkan invoice)
  setAmount: function(claimId, amount, note) {
    var claim = MockData.claims.find(function(c) { return c.id === claimId; });
    if (!claim) return { success: false, error: 'Claim not found' };
    if (['Draft', 'Pending Customer Confirmation', 'Waiting Customer Confirmation', 'Disputed'].indexOf(claim.status) === -1) {
      return { success: false, error: 'Nilai klaim tidak bisa diubah setelah disetujui / ditagihkan' };
    }
    var amt = Math.round(Number(amount));
    if (isNaN(amt) || amt <= 0) return { success: false, error: 'Nilai klaim harus lebih dari 0' };
    claim.amountHistory = (claim.amountHistory || []).concat([{ from: claim.claimAmount, to: amt, note: note || '', date: new Date().toISOString().split('T')[0] }]);
    claim.claimAmount = amt;
    MockData.save('claims');
    BizLogic.Activity.log('Nilai klaim ' + claim.id + ' diubah jadi Rp ' + amt.toLocaleString('id-ID'), 'info');
    return { success: true };
  },

  // Dipanggil setelah pembayaran: klaim yang invoicenya lunas → Paid
  syncFromInvoice: function(inv) {
    if (inv.type !== 'Klaim') return;
    var changed = false;
    MockData.claims.forEach(function(c) {
      if (c.invoiceId !== inv.id) return;
      c.invoiceStatus = inv.status;
      if (inv.status === 'Paid' && c.status === 'Invoiced') { c.status = 'Paid'; c.paidDate = inv.paidDate; }
      changed = true;
    });
    if (changed) MockData.save('claims');
  }
};

// ============================================================
// PURCHASE & GOODS RECEIPT OPERATIONS
// ============================================================

BizLogic.Purchase = {
  RECEIVABLE: ['Ordered', 'In Transit', 'Arrived', 'Partially Received'],

  // Draft/Requested → Approved → Ordered → In Transit → Arrived; Cancelled sebelum ada barang diterima
  updateStatus: function(purchaseId, newStatus, extraData) {
    var po = MockData.purchases.find(function(p) { return p.id === purchaseId; });
    if (!po) return { success: false, error: 'Purchase Order not found' };
    if (!BizLogic.validateTransition(BizLogic.PurchaseTransitions, po.status, newStatus)) {
      return { success: false, error: 'Tidak bisa mengubah status ' + po.status + ' → ' + newStatus };
    }
    if (newStatus === 'Cancelled' && po.items.some(function(i) { return (i.received || 0) > 0; })) {
      return { success: false, error: 'PO yang sudah ada barang diterima tidak bisa dibatalkan' };
    }
    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    var now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    po.status = newStatus;
    po.history = (po.history || []).concat([{ status: newStatus, date: now, user: user.name || 'Admin', notes: (extraData && extraData.notes) || '' }]);
    if (newStatus === 'Approved') { po.approvedBy = user.name || 'Manager'; po.approvedDate = now; }
    if (newStatus === 'Cancelled') po.cancelReason = (extraData && extraData.notes) || '';
    MockData.save('purchases');
    BizLogic.Activity.log('PO ' + po.id + ' → ' + newStatus, newStatus === 'Cancelled' ? 'danger' : 'info');
    return { success: true };
  },

  createGoodsReceipt: function(purchaseId, receivedItems, details) {
    details = details || {};
    var po = MockData.purchases.find(function(p) { return p.id === purchaseId; });
    if (!po) return { success: false, error: 'Purchase Order not found' };

    if (this.RECEIVABLE.indexOf(po.status) === -1) {
      return { success: false, error: 'Cannot receive items for PO in status: ' + po.status };
    }
    receivedItems = (receivedItems || []).filter(function(ri) { return Number(ri.qty) > 0; });
    if (!receivedItems.length) return { success: false, error: 'Isi jumlah barang yang diterima' };
    for (var i = 0; i < receivedItems.length; i++) {
      var ri = receivedItems[i];
      var pi = po.items.find(function(x) { return x.name === ri.name; });
      var rest = pi ? pi.qty - (pi.received || 0) : 0;
      if (!pi) return { success: false, error: ri.name + ' tidak ada di PO' };
      if (ri.qty > rest) return { success: false, error: ri.name + ': diterima ' + ri.qty + ', sisa pesanan hanya ' + rest };
    }

    var gr = {
      id: MockData.generateId('GR', 'goodsReceipts'),
      purchaseId: po.id,
      vendor: po.vendor || po.supplier,
      branch: details.branch || ((po.branch || 'Cileungsi').replace(' Warehouse', '') + ' Warehouse'),
      receiptDate: details.receiptDate || new Date().toISOString().split('T')[0],
      receivedBy: details.receivedBy || JSON.parse(sessionStorage.getItem('er_user') || '{}').name || 'Warehouse Staff',
      notes: details.notes || '',
      items: receivedItems,
      status: 'Completed'
    };

    if (!MockData.goodsReceipts) MockData.goodsReceipts = [];
    MockData.goodsReceipts.push(gr);
    MockData.save('goodsReceipts');

    // Update PO and Stock
    var allReceived = true;
    var anyReceived = false;

    po.items.forEach(function(poItem) {
      var recvItem = receivedItems.find(function(ri) { return ri.name === poItem.name; });
      if (recvItem && recvItem.qty > 0) {
        poItem.received = (poItem.received || 0) + recvItem.qty;
        BizLogic.Movement.create('Goods Receipt', poItem.name, recvItem.qty, gr.vendor, gr.branch, gr.id);
        anyReceived = true;
      }
      if ((poItem.received || 0) < poItem.qty) {
        allReceived = false;
      }
    });

    // Pembelian: + stok gudang
    var posted = BizLogic.StockLedger.post({
      type: 'PURCHASE',
      date: gr.receiptDate,
      from: { type: 'supplier', name: gr.vendor || 'Supplier' },
      to: { type: 'warehouse', id: BizLogic.StockLedger.warehouseIdOf(gr.branch) },
      reference: po.id + ' / ' + gr.id,
      items: receivedItems.map(function(ri) { return { equipment: ri.name, qty: ri.qty }; })
    });
    if (posted.success) { gr.stockDocNo = posted.mutation.no; MockData.save('goodsReceipts'); }

    if (allReceived) {
      po.status = 'Received';
    } else if (anyReceived) {
      po.status = 'Partially Received';
    }
    po.history = (po.history || []).concat([{ status: po.status, date: gr.receiptDate, user: gr.receivedBy, notes: gr.id }]);

    MockData.save('purchases');
    BizLogic.Activity.log('Goods Receipt ' + gr.id + ' created for PO ' + po.id, 'success');

    return { success: true, goodsReceipt: gr };
  }
};

// ============================================================
// BILLING - Rekapitulasi Tagihan sewa (Piutang)
// Periode sewa per alat ditarik dari ledger perpindahan stok:
//   awal  = tanggal SJ kirim ke proyek
//   akhir = tanggal SJ pulang / hilang (FIFO: unit yang dikirim duluan dianggap pulang duluan)
//           jika belum pulang → tanggal akhir periode tagihan (bisa di-adjust)
//   hari  = akhir − awal + 1
//   total = qty × hari × harga satuan ÷ bulan sewa (default 30)
// Harga satuan = harga per bulan dari kebutuhan alat proyek (project.requirements).
// ============================================================

BizLogic.Billing = {
  monthDays: function() {
    return (MockData.settings && MockData.settings.billingMonthDays) || 30;
  },

  // Selisih hari inklusif antara dua tanggal ISO (YYYY-MM-DD)
  days: function(start, end) {
    var a = Date.UTC(+start.substr(0, 4), +start.substr(5, 2) - 1, +start.substr(8, 2));
    var b = Date.UTC(+end.substr(0, 4), +end.substr(5, 2) - 1, +end.substr(8, 2));
    return Math.round((b - a) / 86400000) + 1;
  },

  addDays: function(date, n) {
    var d = new Date(date + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().split('T')[0];
  },

  endOfMonth: function(date) {
    var d = new Date(Date.UTC(+date.substr(0, 4), +date.substr(5, 2), 0));
    return d.toISOString().split('T')[0];
  },

  unitPrice: function(projectId, equipment) {
    var p = MockData.projects.find(function(x) { return x.id === projectId; });
    var req = p && (p.requirements || []).find(function(r) { return r.equipment === equipment; });
    return req ? Number(req.unitPrice) || 0 : BizLogic.StockLedger.defaultRate(equipment);
  },

  // Segmen sewa (tanpa batas periode): tiap batch SJ kirim dipasangkan FIFO dengan SJ pulang/hilang
  segments: function(projectId) {
    var docs = BizLogic.StockLedger.projectDocs(projectId);
    var byEq = {};
    docs.forEach(function(d) {
      d.items.forEach(function(it) {
        var e = byEq[it.equipment] = byEq[it.equipment] || { ins: [], outs: [] };
        if (d.type === 'DELIVERY' && d.to.type === 'project') e.ins.push({ date: d.date, qty: it.qty, no: d.no });
        if ((d.type === 'RETURN' || d.type === 'LOST') && d.from.type === 'project') e.outs.push({ date: d.date, qty: it.qty, no: d.no, type: d.type });
      });
    });
    var segs = [];
    Object.keys(byEq).forEach(function(eq) {
      var queue = byEq[eq].ins.map(function(b) { return { date: b.date, qty: b.qty, no: b.no }; });
      byEq[eq].outs.forEach(function(out) {
        var left = out.qty;
        while (left > 0 && queue.length) {
          var b = queue[0];
          var q = Math.min(left, b.qty);
          segs.push({ equipment: eq, qty: q, start: b.date, end: out.date, sjDelivery: b.no, sjReturn: out.no, endType: out.type });
          b.qty -= q; left -= q;
          if (!b.qty) queue.shift();
        }
      });
      queue.forEach(function(b) {
        segs.push({ equipment: eq, qty: b.qty, start: b.date, end: null, sjDelivery: b.no, sjReturn: null, endType: null });
      });
    });
    segs.forEach(function(s) { s.key = [s.sjDelivery, s.equipment, s.sjReturn || 'open'].join('|'); });
    return segs;
  },

  // Rekap tagihan untuk satu periode.
  // opts: { monthDays, endOverrides: { [line.key]: 'YYYY-MM-DD' } } - override hanya untuk alat yang belum pulang
  recap: function(projectId, periodStart, periodEnd, opts) {
    opts = opts || {};
    var self = this;
    var monthDays = Number(opts.monthDays) || this.monthDays();
    var overrides = opts.endOverrides || {};
    var lines = [];
    this.segments(projectId).forEach(function(s) {
      var start = s.start > periodStart ? s.start : periodStart;
      var returnedInPeriod = s.end && s.end <= periodEnd;
      var end = returnedInPeriod ? s.end : periodEnd;
      var adjustable = !returnedInPeriod;
      if (adjustable && overrides[s.key]) {
        var o = overrides[s.key];
        end = o < start ? start : (o > periodEnd ? periodEnd : o);
      }
      if (start > periodEnd || end < periodStart || end < start) return;
      var days = self.days(start, end);
      var unitPrice = self.unitPrice(projectId, s.equipment);
      lines.push({
        key: s.key, equipment: s.equipment, qty: s.qty, unitPrice: unitPrice,
        start: start, end: end, days: days, monthDays: monthDays,
        amount: Math.round(s.qty * days * unitPrice / monthDays),
        sjDelivery: s.sjDelivery, sjReturn: returnedInPeriod ? s.sjReturn : null,
        endType: returnedInPeriod ? s.endType : null,
        adjustable: adjustable, adjusted: adjustable && !!overrides[s.key]
      });
    });
    lines.sort(function(a, b) { return a.equipment.localeCompare(b.equipment) || a.start.localeCompare(b.start); });
    return lines;
  },

  rentInvoices: function(projectId) {
    return MockData.invoices.filter(function(i) {
      return i.type === 'Sewa' && i.projectId === projectId && i.status !== 'Cancelled' && i.status !== 'Shadow';
    });
  },

  overlaps: function(projectId, periodStart, periodEnd) {
    return this.rentInvoices(projectId).filter(function(i) {
      return i.periodStart <= periodEnd && i.periodEnd >= periodStart;
    });
  },

  lastBilledEnd: function(projectId) {
    return this.rentInvoices(projectId).reduce(function(m, i) { return i.periodEnd > m ? i.periodEnd : m; }, '');
  },

  // Periode default: hari setelah tagihan terakhir (atau SJ kirim pertama) s/d akhir bulan tsb
  suggestPeriod: function(projectId) {
    var last = this.lastBilledEnd(projectId);
    var start = last ? this.addDays(last, 1) : null;
    if (!start) {
      var first = BizLogic.StockLedger.projectDocs(projectId, 'DELIVERY')[0];
      start = first ? first.date : new Date().toISOString().split('T')[0];
    }
    return { start: start, end: this.endOfMonth(start) };
  }
};

// ============================================================
// INVOICE - tagihan (Sewa dari rekap, Klaim dari claim)
// Status disimpan: Shadow | Issued | Partially Paid | Paid | Cancelled. "Overdue" dihitung saat tampil.
// Shadow = invoice bayangan: dicatat dulu walau datanya belum lengkap, belum masuk piutang
// sampai diterbitkan (status → Issued). Flag fromShadow tetap menempel setelah diterbitkan.
// ============================================================

BizLogic.Invoice = {
  payments: function(invoiceId) {
    return (MockData.payments || []).filter(function(p) { return p.invoiceId === invoiceId; })
      .sort(function(a, b) { return a.date.localeCompare(b.date); });
  },

  paidAmount: function(inv, asOf) {
    return this.payments(inv.id)
      .filter(function(p) { return !asOf || p.date <= asOf; })
      .reduce(function(s, p) { return s + p.amount; }, 0);
  },

  outstanding: function(inv, asOf) {
    if (inv.status === 'Cancelled' || inv.status === 'Shadow') return 0;
    return Math.max(0, inv.amount - this.paidAmount(inv, asOf));
  },

  statusOf: function(inv, asOf) {
    if (inv.status === 'Cancelled' || inv.status === 'Shadow') return inv.status;
    var today = asOf || new Date().toISOString().split('T')[0];
    var paid = this.paidAmount(inv, asOf);
    if (paid >= inv.amount) return 'Paid';
    if (inv.dueDate && inv.dueDate < today) return 'Overdue';
    return paid > 0 ? 'Partially Paid' : 'Issued';
  },

  // Umur piutang dari jatuh tempo
  agingBucket: function(inv, asOf) {
    var today = asOf || new Date().toISOString().split('T')[0];
    if (!inv.dueDate || inv.dueDate >= today) return 'current';
    var late = BizLogic.Billing.days(inv.dueDate, today) - 1;
    if (late <= 30) return 'd30';
    if (late <= 60) return 'd60';
    if (late <= 90) return 'd90';
    return 'd90plus';
  },

  _syncStatus: function(inv) {
    if (inv.status === 'Cancelled' || inv.status === 'Shadow') return;
    var paid = this.paidAmount(inv);
    inv.status = paid >= inv.amount ? 'Paid' : paid > 0 ? 'Partially Paid' : 'Issued';
    inv.paidDate = inv.status === 'Paid' ? this.payments(inv.id).slice(-1)[0].date : null;
  },

  _totals: function(subtotal, taxRate) {
    var tax = Math.round(subtotal * (taxRate || 0));
    return { subtotal: subtotal, taxRate: taxRate || 0, tax: tax, amount: subtotal + tax };
  },

  _account: function(accountId) {
    var acc = MockData.accounts.find(function(a) { return a.id === accountId; }) || MockData.accounts[0];
    return { accountId: acc.id, accountName: acc.name };
  },

  // opts: { monthDays, endOverrides, taxRate, invoiceDate, dueDays, accountId, notes }
  createFromRecap: function(projectId, periodStart, periodEnd, opts) {
    opts = opts || {};
    var project = MockData.projects.find(function(p) { return p.id === projectId; });
    if (!project) return { success: false, error: 'Proyek tidak ditemukan' };
    if (periodEnd < periodStart) return { success: false, error: 'Tanggal akhir periode sebelum tanggal awal' };

    var clash = BizLogic.Billing.overlaps(projectId, periodStart, periodEnd);
    if (clash.length) {
      return { success: false, error: 'Periode bertabrakan dengan invoice ' + clash.map(function(i) { return i.id + ' (' + i.periodStart + ' s/d ' + i.periodEnd + ')'; }).join(', ') };
    }

    var shadow = null;
    if (opts.shadowId) {
      shadow = MockData.invoices.find(function(i) { return i.id === opts.shadowId && i.status === 'Shadow'; });
      if (!shadow) return { success: false, error: 'Invoice bayangan ' + opts.shadowId + ' tidak ditemukan / sudah diterbitkan' };
    }

    var lines = BizLogic.Billing.recap(projectId, periodStart, periodEnd, opts);
    if (!lines.length) return { success: false, error: 'Tidak ada alat yang disewa pada periode ini' };

    var invoiceDate = opts.invoiceDate || new Date().toISOString().split('T')[0];
    var dueDays = opts.dueDays != null ? Number(opts.dueDays) : ((MockData.settings && MockData.settings.paymentTermDays) || 30);
    var subtotal = lines.reduce(function(s, l) { return s + l.amount; }, 0);
    var taxRate = opts.taxRate != null ? Number(opts.taxRate) : ((MockData.settings && MockData.settings.taxRate) || 0);
    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');

    var inv = Object.assign({
      id: shadow ? shadow.id : MockData.generateId('INV', 'invoices'),
      type: 'Sewa',
      projectId: project.id, projectName: project.name,
      customerId: project.customerId, customerName: project.customerName,
      reference: 'Sewa ' + periodStart + ' s/d ' + periodEnd,
      invoiceDate: invoiceDate,
      dueDate: BizLogic.Billing.addDays(invoiceDate, dueDays),
      periodStart: periodStart, periodEnd: periodEnd,
      monthDays: lines[0].monthDays,
      items: lines.map(function(l) {
        return {
          desc: l.equipment, equipment: l.equipment, qty: l.qty, unitPrice: l.unitPrice,
          startDate: l.start, endDate: l.end, days: l.days, amount: l.amount,
          sjDelivery: l.sjDelivery, sjReturn: l.sjReturn, adjusted: l.adjusted
        };
      }),
      status: 'Issued',
      notes: opts.notes || (shadow && shadow.notes) || '',
      createdBy: user.name || 'System'
    }, this._totals(subtotal, taxRate), this._account(opts.accountId));

    if (shadow) {
      Object.assign(inv, { fromShadow: true, shadowEstimate: shadow.amount });
      MockData.invoices[MockData.invoices.indexOf(shadow)] = inv;
    } else {
      MockData.invoices.push(inv);
    }
    MockData.save('invoices');
    BizLogic.Activity.log('Invoice ' + inv.id + ' diterbitkan untuk ' + project.name + ' (' + periodStart + ' s/d ' + periodEnd + ')' + (shadow ? ' dari invoice bayangan' : ''), 'success');
    return { success: true, invoice: inv };
  },

  createForClaim: function(claim) {
    var invoiceDate = new Date().toISOString().split('T')[0];
    var inv = Object.assign({
      id: MockData.generateId('INV', 'invoices'),
      type: 'Klaim',
      projectId: claim.projectId, projectName: claim.projectName,
      customerId: claim.customerId, customerName: claim.customerName,
      reference: claim.returnId + ' / ' + claim.id,
      invoiceDate: invoiceDate,
      dueDate: BizLogic.Billing.addDays(invoiceDate, 14),
      items: [{ desc: 'Klaim ' + claim.reason + ': ' + claim.equipment, qty: claim.quantity, unitPrice: Math.round(claim.claimAmount / (claim.quantity || 1)), amount: claim.claimAmount }],
      status: 'Issued', notes: '', createdBy: 'System'
    }, this._totals(claim.claimAmount, 0), this._account());
    MockData.invoices.push(inv);
    MockData.save('invoices');
    return inv;
  },

  // Hitung ulang baris barang invoice bayangan (diisi manual).
  // Sewa: Total = Qty × Hari × Harga Satuan ÷ Bulan Sewa (sama dgn rekap). Klaim/lainnya: Qty × Harga Satuan.
  shadowItems: function(type, items, monthDays) {
    var Bill = BizLogic.Billing;
    var out = [], error = null;
    (items || []).forEach(function(it, n) {
      var desc = String(it.desc || '').trim();
      if (!desc) return; // baris kosong diabaikan
      var qty = Number(it.qty) || 0, unitPrice = Math.round(Number(it.unitPrice) || 0);
      if (qty <= 0 && !error) error = 'Qty "' + desc + '" harus lebih dari 0';
      if (type === 'Sewa') {
        var start = it.startDate || null, end = it.endDate || null;
        if (start && end && end < start && !error) error = 'Tanggal akhir "' + desc + '" sebelum tanggal awal';
        var days = start && end && end >= start ? Bill.days(start, end) : 0;
        out.push({
          desc: desc, equipment: desc, qty: qty, unitPrice: unitPrice,
          startDate: start, endDate: end, days: days,
          amount: Math.round(qty * days * unitPrice / monthDays),
          sjDelivery: null, sjReturn: null, adjusted: false, manual: true
        });
      } else {
        out.push({ desc: desc, qty: qty, unitPrice: unitPrice, amount: Math.round(qty * unitPrice), manual: true });
      }
    });
    return { items: out, error: error };
  },

  // Buat / ubah invoice bayangan - semua field opsional kecuali customer; barang ditambah manual.
  // data: { customerId, projectId, type, periodStart, periodEnd, monthDays, items[], invoiceDate, dueDays, taxRate, accountId, notes }
  saveShadow: function(data, invoiceId) {
    data = data || {};
    var existing = null;
    if (invoiceId) {
      existing = MockData.invoices.find(function(i) { return i.id === invoiceId; });
      if (!existing) return { success: false, error: 'Invoice tidak ditemukan' };
      if (existing.status !== 'Shadow') return { success: false, error: 'Invoice ini sudah diterbitkan, tidak bisa diubah' };
    }
    var customer = MockData.customers.find(function(c) { return c.id === data.customerId; });
    if (!customer) return { success: false, error: 'Pilih customer' };
    var project = data.projectId ? MockData.projects.find(function(p) { return p.id === data.projectId; }) : null;
    if (project && project.customerId !== customer.id) return { success: false, error: 'Proyek bukan milik customer ini' };
    if (data.periodStart && data.periodEnd && data.periodEnd < data.periodStart) return { success: false, error: 'Tanggal akhir periode sebelum tanggal awal' };

    var type = data.type === 'Klaim' ? 'Klaim' : 'Sewa';
    var monthDays = Number(data.monthDays) || BizLogic.Billing.monthDays();
    var calc = this.shadowItems(type, data.items, monthDays);
    if (calc.error) return { success: false, error: calc.error };
    var subtotal = calc.items.reduce(function(s, l) { return s + l.amount; }, 0);

    var invoiceDate = data.invoiceDate || new Date().toISOString().split('T')[0];
    var dueDays = data.dueDays != null && data.dueDays !== '' ? Number(data.dueDays) : ((MockData.settings && MockData.settings.paymentTermDays) || 30);
    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');

    var inv = Object.assign(existing || {
      id: MockData.generateId('INV', 'invoices'),
      status: 'Shadow',
      fromShadow: true,
      createdBy: user.name || 'System'
    }, {
      type: type,
      projectId: project ? project.id : null, projectName: project ? project.name : null,
      customerId: customer.id, customerName: customer.name,
      reference: data.periodStart ? 'Sewa ' + data.periodStart + ' s/d ' + (data.periodEnd || '?') : 'Invoice bayangan',
      invoiceDate: invoiceDate,
      dueDate: BizLogic.Billing.addDays(invoiceDate, dueDays),
      periodStart: data.periodStart || null, periodEnd: data.periodEnd || null,
      monthDays: type === 'Sewa' ? monthDays : undefined,
      items: calc.items,
      notes: data.notes || ''
    }, this._totals(subtotal, Number(data.taxRate) || 0), this._account(data.accountId));

    if (!existing) MockData.invoices.push(inv);
    MockData.save('invoices');
    BizLogic.Activity.log('Invoice bayangan ' + inv.id + (existing ? ' diubah' : ' dibuat untuk ' + customer.name), 'info');
    return { success: true, invoice: inv };
  },

  // Terbitkan invoice bayangan apa adanya (barang manual). data: { invoiceDate, dueDays, taxRate, accountId }
  issueShadow: function(invoiceId, data) {
    data = data || {};
    var inv = MockData.invoices.find(function(i) { return i.id === invoiceId; });
    if (!inv) return { success: false, error: 'Invoice tidak ditemukan' };
    if (inv.status !== 'Shadow') return { success: false, error: 'Invoice ini bukan invoice bayangan' };
    if (!inv.items.length || inv.subtotal <= 0) return { success: false, error: 'Tambahkan barang dengan total lebih dari 0 sebelum menerbitkan' };

    var invoiceDate = data.invoiceDate || new Date().toISOString().split('T')[0];
    var dueDays = data.dueDays != null && data.dueDays !== '' ? Number(data.dueDays) : ((MockData.settings && MockData.settings.paymentTermDays) || 30);
    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');

    Object.assign(inv, {
      invoiceDate: invoiceDate,
      dueDate: BizLogic.Billing.addDays(invoiceDate, dueDays),
      status: 'Issued',
      issuedBy: user.name || 'System'
    }, this._totals(inv.subtotal, data.taxRate != null ? Number(data.taxRate) : inv.taxRate), this._account(data.accountId || inv.accountId));
    MockData.save('invoices');
    BizLogic.Activity.log('Invoice bayangan ' + inv.id + ' diterbitkan (' + inv.customerName + ')', 'success');
    return { success: true, invoice: inv };
  },

  cancel: function(invoiceId, reason) {
    var inv = MockData.invoices.find(function(i) { return i.id === invoiceId; });
    if (!inv) return { success: false, error: 'Invoice tidak ditemukan' };
    if (this.paidAmount(inv) > 0) return { success: false, error: 'Invoice yang sudah ada pembayaran tidak bisa dibatalkan' };
    inv.status = 'Cancelled';
    inv.cancelReason = reason || '';
    MockData.save('invoices');
    BizLogic.Activity.log('Invoice ' + inv.id + ' dibatalkan', 'danger');
    return { success: true };
  },

  // Kompatibilitas dengan pemanggil lama
  recordPayment: function(invoiceId, paymentAmount, paymentMethod, bankAccountId, notes) {
    return BizLogic.Payment.record(invoiceId, { amount: paymentAmount, method: paymentMethod, accountId: bankAccountId, notes: notes });
  }
};

// ============================================================
// PAYMENT - pembayaran tagihan (cicilan / lunas) + jurnal buku bank
// ============================================================

BizLogic.Payment = {
  // data: { date, amount, accountId, method, reference, notes }
  record: function(invoiceId, data) {
    var inv = MockData.invoices.find(function(i) { return i.id === invoiceId; });
    if (!inv) return { success: false, error: 'Invoice tidak ditemukan' };
    if (inv.status === 'Cancelled') return { success: false, error: 'Invoice sudah dibatalkan' };
    if (inv.status === 'Shadow') return { success: false, error: 'Invoice bayangan harus diterbitkan dulu sebelum dibayar' };

    var amt = Math.round(Number(data.amount));
    if (isNaN(amt) || amt <= 0) return { success: false, error: 'Jumlah pembayaran tidak valid' };
    var remaining = BizLogic.Invoice.outstanding(inv);
    if (amt > remaining) return { success: false, error: 'Jumlah melebihi sisa tagihan (' + remaining.toLocaleString('id-ID') + ')' };

    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    var acc = MockData.accounts.find(function(a) { return a.id === data.accountId; }) || MockData.accounts[0];
    if (!MockData.payments) MockData.payments = [];
    var pay = {
      id: MockData.generateId('PAY', 'payments'),
      invoiceId: inv.id,
      customerId: inv.customerId,
      date: data.date || new Date().toISOString().split('T')[0],
      amount: amt,
      kind: amt === remaining ? 'Lunas' : 'Cicilan',
      accountId: acc.id,
      method: data.method || 'Transfer',
      reference: data.reference || '',
      notes: data.notes || '',
      user: user.name || 'System'
    };
    MockData.payments.push(pay);
    MockData.save('payments');

    BizLogic.Invoice._syncStatus(inv);
    MockData.save('invoices');
    BizLogic.Claim.syncFromInvoice(inv);

    // Bon Biru otomatis: piutang tunai (akun Kas) atau terima pembayaran piutang (akun Bank)
    BizLogic.CashBank._push({
      date: pay.date, accountId: acc.id, type: 'IN',
      category: BizLogic.CashBank.kindOf(acc) === 'Kas' ? 'kas_in_ar' : 'bank_in_ar',
      reference: pay.id + ' / ' + inv.id,
      description: 'Pembayaran ' + pay.kind.toLowerCase() + ' ' + inv.id + ' - ' + inv.customerName,
      amount: amt, source: 'payment'
    });
    MockData.save('ledger');

    BizLogic.Activity.log('Pembayaran ' + pay.id + ' (' + pay.kind + ') untuk ' + inv.id + ': Rp ' + amt.toLocaleString('id-ID'), 'success');
    return { success: true, payment: pay };
  }
};

// ============================================================
// KAS & BANK - Buku Kas/Bank, Bon Biru (masuk) / Bon Merah (keluar), pindah dana,
// Laporan Kas, Rekonsiliasi Bank.
// Entri ledger: { id TRX, voucherNo BB-/BM-YYMM-NNN, date, bankAccountId, type IN|OUT, category,
//   reference, description, party, amount, source manual|payment|transfer, transferId, reconciled, reconId }
// ============================================================

BizLogic.CashBank = {
  // Kategori mengikuti format Laporan Kas. transferOnly = hanya dibuat lewat "Pindah Dana".
  CATEGORIES: {
    // I. CASH ACCOUNT - A. Kas Masuk (Bon Biru)
    kas_in_transfer:   { kind: 'Kas',  type: 'IN',  label: 'Terima Pemindahan / Penarikan dari Saldo Bank ke Tunai', transferOnly: true },
    kas_in_sale:       { kind: 'Kas',  type: 'IN',  label: 'Penjualan Tunai' },
    kas_in_ar:         { kind: 'Kas',  type: 'IN',  label: 'Pembayaran Piutang Tunai' },
    kas_in_dp:         { kind: 'Kas',  type: 'IN',  label: 'Penerimaan Uang Muka Customer' },
    kas_in_loan:       { kind: 'Kas',  type: 'IN',  label: 'Terima Pinjaman' },
    kas_in_refund:     { kind: 'Kas',  type: 'IN',  label: 'Pengembalian Uang dari Supplier / Koreksi Biaya / Pengembalian Pinjaman Karyawan' },
    kas_in_other:      { kind: 'Kas',  type: 'IN',  label: 'Pendapatan Lain-lain' },
    // I. CASH ACCOUNT - B. Kas Keluar (Bon Merah)
    kas_out_opex:      { kind: 'Kas',  type: 'OUT', label: 'Biaya-biaya Operasional' },
    kas_out_supplier:  { kind: 'Kas',  type: 'OUT', label: 'Pembayaran Hutang Supplier' },
    kas_out_payroll:   { kind: 'Kas',  type: 'OUT', label: 'Pembayaran Gaji, Sewa dan Pajak' },
    kas_out_advance:   { kind: 'Kas',  type: 'OUT', label: 'Pemberian Kasbon Karyawan' },
    kas_out_loan:      { kind: 'Kas',  type: 'OUT', label: 'Bayar Pinjaman' },
    // II. BANK ACCOUNT - A. Bank Masuk (Bon Biru)
    bank_in_loan:      { kind: 'Bank', type: 'IN',  label: 'Penerimaan Pinjaman' },
    bank_in_ar:        { kind: 'Bank', type: 'IN',  label: 'Terima Pembayaran Piutang' },
    bank_in_dp:        { kind: 'Bank', type: 'IN',  label: 'Penerimaan Uang Muka dari Customer' },
    bank_in_refund:    { kind: 'Bank', type: 'IN',  label: 'Pengembalian dari Supplier' },
    bank_in_transfer:  { kind: 'Bank', type: 'IN',  label: 'Terima Pindah Dana dari Bank Lain Perusahaan', transferOnly: true },
    bank_in_interest:  { kind: 'Bank', type: 'IN',  label: 'Bunga / Jasa Giro' },
    // II. BANK ACCOUNT - B. Bank Keluar (Bon Merah)
    bank_out_cash:     { kind: 'Bank', type: 'OUT', label: 'Penarikan Tunai dari Saldo Bank untuk Mengisi Kas', transferOnly: true },
    bank_out_supplier: { kind: 'Bank', type: 'OUT', label: 'Pembayaran Supplier (Pembelian Barang / Jasa / Aset)' },
    bank_out_loan:     { kind: 'Bank', type: 'OUT', label: 'Pembayaran Pinjaman' },
    bank_out_admin:    { kind: 'Bank', type: 'OUT', label: 'Biaya Administrasi Bank dan Pajak Bank' },
    bank_out_transfer: { kind: 'Bank', type: 'OUT', label: 'Pindah Dana ke Bank Lain Perusahaan', transferOnly: true }
  },

  kindOf: function(acc) { return acc && acc.kind === 'Kas' ? 'Kas' : 'Bank'; },
  account: function(id) { return MockData.accounts.find(function(a) { return a.id === id; }); },
  categoryLabel: function(key) { var c = this.CATEGORIES[key]; return c ? c.label : (key || '-'); },

  // Kategori untuk dropdown Bon: sesuai jenis akun & arah, tanpa yang khusus pindah dana
  categoriesFor: function(kind, type, includeTransfer) {
    var C = this.CATEGORIES;
    return Object.keys(C).filter(function(k) {
      return C[k].kind === kind && C[k].type === type && (includeTransfer || !C[k].transferOnly);
    });
  },

  // Entri lama tanpa kategori: anggap pembayaran piutang
  categoryOf: function(e) {
    if (e.category) return e.category;
    var kind = this.kindOf(this.account(e.bankAccountId));
    return e.type === 'IN' ? (kind === 'Kas' ? 'kas_in_ar' : 'bank_in_ar') : (kind === 'Kas' ? 'kas_out_opex' : 'bank_out_admin');
  },

  entries: function(accountId) {
    return (MockData.ledger || []).filter(function(e) { return !accountId || e.bankAccountId === accountId; })
      .slice().sort(function(a, b) { return a.date.localeCompare(b.date) || a.id.localeCompare(b.id); });
  },

  // Saldo s/d tanggal (inklusif). before=true → sebelum tanggal tsb (saldo awal periode)
  balance: function(accountId, date, before) {
    var acc = this.account(accountId);
    var bal = (acc && Number(acc.openingBalance)) || 0;
    (MockData.ledger || []).forEach(function(e) {
      if (e.bankAccountId !== accountId) return;
      if (date && (before ? e.date >= date : e.date > date)) return;
      bal += e.type === 'IN' ? e.amount : -e.amount;
    });
    return bal;
  },

  nextVoucher: function(type, date) {
    var prefix = (type === 'IN' ? 'BB' : 'BM') + '-' + (date || new Date().toISOString().split('T')[0]).substr(2, 5).replace('-', '') + '-';
    var max = 0;
    (MockData.ledger || []).forEach(function(e) {
      if (e.voucherNo && e.voucherNo.indexOf(prefix) === 0) max = Math.max(max, parseInt(e.voucherNo.substr(prefix.length), 10) || 0);
    });
    return prefix + String(max + 1).padStart(3, '0');
  },

  _push: function(d) {
    if (!MockData.ledger) MockData.ledger = [];
    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    var e = {
      id: MockData.generateId('TRX', 'ledger'),
      voucherNo: this.nextVoucher(d.type, d.date),
      date: d.date, bankAccountId: d.accountId, type: d.type, category: d.category,
      reference: d.reference || '', description: d.description || '', party: d.party || '',
      amount: d.amount, source: d.source || 'manual', transferId: d.transferId || null,
      reconciled: false, user: user.name || 'System', createdAt: new Date().toISOString()
    };
    MockData.ledger.push(e);
    return e;
  },

  _checkFunds: function(acc, amount, date) {
    var bal = this.balance(acc.id);
    var balAt = this.balance(acc.id, date);
    var min = Math.min(bal, balAt);
    if (amount > min) return 'Saldo ' + acc.name + ' tidak cukup (saldo Rp ' + min.toLocaleString('id-ID') + ')';
    return null;
  },

  // Bon Biru / Bon Merah manual. data: { type, date, accountId, category, amount, reference, description, party }
  addEntry: function(data) {
    data = data || {};
    var acc = this.account(data.accountId);
    if (!acc) return { success: false, error: 'Pilih akun kas / bank' };
    var type = data.type === 'OUT' ? 'OUT' : 'IN';
    var cat = this.CATEGORIES[data.category];
    if (!cat || cat.kind !== this.kindOf(acc) || cat.type !== type) return { success: false, error: 'Pilih kategori yang sesuai' };
    if (cat.transferOnly) return { success: false, error: 'Kategori ini dicatat lewat "Pindah Dana"' };
    var amt = Math.round(Number(data.amount));
    if (isNaN(amt) || amt <= 0) return { success: false, error: 'Jumlah harus lebih dari 0' };
    if (!String(data.description || '').trim()) return { success: false, error: 'Keterangan wajib diisi' };
    var date = data.date || new Date().toISOString().split('T')[0];
    if (type === 'OUT') { var err = this._checkFunds(acc, amt, date); if (err) return { success: false, error: err }; }

    var e = this._push({ date: date, accountId: acc.id, type: type, category: data.category, amount: amt,
      reference: String(data.reference || '').trim(), description: String(data.description).trim(), party: String(data.party || '').trim() });
    MockData.save('ledger');
    BizLogic.Activity.log((type === 'IN' ? 'Bon Biru ' : 'Bon Merah ') + e.voucherNo + ' - ' + acc.name + ': Rp ' + amt.toLocaleString('id-ID'), type === 'IN' ? 'success' : 'warning');
    return { success: true, entry: e };
  },

  // Pindah dana: Bank → Kas (penarikan tunai) atau Bank → Bank lain perusahaan
  transfer: function(data) {
    data = data || {};
    var from = this.account(data.fromId), to = this.account(data.toId);
    if (!from || !to) return { success: false, error: 'Pilih akun asal dan tujuan' };
    if (from.id === to.id) return { success: false, error: 'Akun asal dan tujuan tidak boleh sama' };
    if (this.kindOf(from) !== 'Bank') return { success: false, error: 'Pindah dana hanya dari akun Bank (ke Kas atau Bank lain)' };
    var amt = Math.round(Number(data.amount));
    if (isNaN(amt) || amt <= 0) return { success: false, error: 'Jumlah harus lebih dari 0' };
    var date = data.date || new Date().toISOString().split('T')[0];
    var err = this._checkFunds(from, amt, date); if (err) return { success: false, error: err };

    var toKas = this.kindOf(to) === 'Kas';
    var tid = 'TF-' + Date.now();
    var desc = String(data.description || '').trim() || (toKas ? 'Penarikan tunai untuk mengisi ' + to.name : 'Pindah dana ke ' + to.name);
    var out = this._push({ date: date, accountId: from.id, type: 'OUT', category: toKas ? 'bank_out_cash' : 'bank_out_transfer',
      amount: amt, reference: data.reference || '', description: desc, party: to.name, source: 'transfer', transferId: tid });
    var inn = this._push({ date: date, accountId: to.id, type: 'IN', category: toKas ? 'kas_in_transfer' : 'bank_in_transfer',
      amount: amt, reference: out.voucherNo, description: desc, party: from.name, source: 'transfer', transferId: tid });
    out.reference = out.reference || inn.voucherNo;
    MockData.save('ledger');
    BizLogic.Activity.log('Pindah dana ' + from.name + ' → ' + to.name + ': Rp ' + amt.toLocaleString('id-ID'), 'info');
    return { success: true, out: out, in: inn };
  },

  // Hapus entri manual / pindah dana (keduanya). Entri dari pembayaran invoice & yang sudah direkonsiliasi tidak bisa.
  remove: function(entryId) {
    var e = (MockData.ledger || []).find(function(x) { return x.id === entryId; });
    if (!e) return { success: false, error: 'Transaksi tidak ditemukan' };
    if (e.source === 'payment') return { success: false, error: 'Transaksi dari pembayaran invoice tidak bisa dihapus di sini' };
    var group = e.transferId ? MockData.ledger.filter(function(x) { return x.transferId === e.transferId; }) : [e];
    if (group.some(function(x) { return x.reconciled; })) return { success: false, error: 'Transaksi sudah direkonsiliasi, tidak bisa dihapus' };
    MockData.ledger = MockData.ledger.filter(function(x) { return group.indexOf(x) < 0; });
    MockData.save('ledger');
    BizLogic.Activity.log('Transaksi ' + group.map(function(x) { return x.voucherNo; }).join(' & ') + ' dihapus', 'danger');
    return { success: true };
  },

  // Laporan Kas: per jenis akun (Kas / Bank), saldo awal, masuk & keluar per kategori, saldo akhir
  report: function(start, end, accountId) {
    var self = this;
    var out = {};
    ['Kas', 'Bank'].forEach(function(kind) {
      var accs = MockData.accounts.filter(function(a) { return self.kindOf(a) === kind && (!accountId || a.id === accountId); });
      var ids = accs.map(function(a) { return a.id; });
      var sec = { kind: kind, accounts: accs, opening: 0, closing: 0, totalIn: 0, totalOut: 0, rows: {} };
      self.categoriesFor(kind, 'IN', true).concat(self.categoriesFor(kind, 'OUT', true)).forEach(function(k) { sec.rows[k] = { amount: 0, count: 0 }; });
      accs.forEach(function(a) { sec.opening += self.balance(a.id, start, true); });
      (MockData.ledger || []).forEach(function(e) {
        if (ids.indexOf(e.bankAccountId) < 0 || e.date < start || e.date > end) return;
        var k = self.categoryOf(e);
        var r = sec.rows[k] = sec.rows[k] || { amount: 0, count: 0 };
        r.amount += e.amount; r.count++;
        if (e.type === 'IN') sec.totalIn += e.amount; else sec.totalOut += e.amount;
      });
      sec.closing = sec.opening + sec.totalIn - sec.totalOut;
      out[kind] = sec;
    });
    return out;
  },

  // ---------- Rekonsiliasi Bank ----------
  // Parse mutasi rekening koran (CSV: tanggal;keterangan;debit;kredit ATAU tanggal;keterangan;jumlah(+/-)).
  // Sudut pandang rekening koran: kredit = uang masuk, debit = uang keluar.
  parseStatement: function(text) {
    var rows = [], errors = [];
    String(text || '').split(/\r?\n/).forEach(function(line, n) {
      if (!line.trim()) return;
      var c = line.split(/[;,\t]/).map(function(s) { return s.trim().replace(/^"|"$/g, ''); });
      var m = c[0].match(/^(\d{4})-(\d{2})-(\d{2})$/) || c[0].match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) { if (n > 0) errors.push('Baris ' + (n + 1) + ': tanggal tidak dikenali'); return; } // baris judul dilewati
      var date = m[0].indexOf('/') > 0 ? m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2) : m[0];
      var num = function(s) { return Math.round(Number(String(s || '0').replace(/[^\d\-]/g, '')) || 0); };
      var amount, type;
      if (c.length >= 4) { var db = num(c[2]), cr = num(c[3]); type = cr > 0 ? 'IN' : 'OUT'; amount = cr > 0 ? cr : db; }
      else { var v = num(c[2]); type = v >= 0 ? 'IN' : 'OUT'; amount = Math.abs(v); }
      if (!amount) { errors.push('Baris ' + (n + 1) + ': jumlah kosong'); return; }
      rows.push({ idx: rows.length, date: date, description: c[1] || '', type: type, amount: amount });
    });
    return { rows: rows, errors: errors };
  },

  // Cocokkan otomatis: jumlah & arah sama, tanggal selisih ≤ 3 hari, entri sistem yang terdekat
  autoMatch: function(sysEntries, bankRows) {
    var used = {}, pairs = {};
    bankRows.forEach(function(b) {
      var best = null, bestGap = 99;
      sysEntries.forEach(function(e) {
        if (used[e.id] || e.type !== b.type || e.amount !== b.amount) return;
        var gap = Math.abs((new Date(e.date) - new Date(b.date)) / 864e5);
        if (gap <= 3 && gap < bestGap) { best = e; bestGap = gap; }
      });
      if (best) { used[best.id] = true; pairs[b.idx] = best.id; }
    });
    return pairs; // { bankRowIdx: ledgerEntryId }
  },

  // Simpan rekonsiliasi. data: { accountId, start, end, statementBalance, matchedIds[], unmatchedSystemIds[], unmatchedBank[], difference }
  saveReconciliation: function(data) {
    var acc = this.account(data.accountId);
    if (!acc || this.kindOf(acc) !== 'Bank') return { success: false, error: 'Pilih rekening bank' };
    var stmt = Math.round(Number(data.statementBalance));
    if (data.statementBalance === '' || isNaN(stmt)) return { success: false, error: 'Isi saldo akhir menurut rekening koran' };
    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    if (!MockData.reconciliations) MockData.reconciliations = [];
    var rec = {
      id: MockData.generateId('REK', 'reconciliations'),
      accountId: acc.id, accountName: acc.name, start: data.start, end: data.end,
      systemBalance: this.balance(acc.id, data.end), statementBalance: stmt,
      matchedCount: (data.matchedIds || []).length,
      unmatchedSystem: (data.unmatchedSystemIds || []).length,
      unmatchedBank: (data.unmatchedBank || []).length,
      date: new Date().toISOString().split('T')[0], user: user.name || 'System'
    };
    // Selisih setelah memperhitungkan transaksi yang belum cocok (dihitung halaman); default: saldo koran − saldo sistem
    rec.difference = data.difference != null ? Math.round(Number(data.difference)) : rec.statementBalance - rec.systemBalance;
    rec.status = rec.difference === 0 ? 'Cocok' : 'Ada Selisih';
    (MockData.ledger || []).forEach(function(e) {
      if ((data.matchedIds || []).indexOf(e.id) >= 0) { e.reconciled = true; e.reconId = rec.id; }
    });
    MockData.reconciliations.push(rec);
    MockData.save('ledger');
    MockData.save('reconciliations');
    BizLogic.Activity.log('Rekonsiliasi ' + acc.name + ' ' + data.start + ' s/d ' + data.end + ': ' + rec.status, rec.difference === 0 ? 'success' : 'warning');
    return { success: true, reconciliation: rec };
  }
};

// ============================================================
// STOCK TRANSFER OPERATIONS
// ============================================================

BizLogic.StockTransfer = {
  create: function(sourceBranch, destBranch, equipmentName, qty, notes) {
    if (sourceBranch === destBranch) {
      return { success: false, error: 'Source and destination branches must be different' };
    }
    var q = Number(qty);
    if (isNaN(q) || q <= 0) return { success: false, error: 'Invalid quantity' };

    // Transit antar gudang: − gudang asal, + gudang tujuan
    var res = BizLogic.StockLedger.post({
      type: 'TRANSFER',
      from: { type: 'warehouse', id: BizLogic.StockLedger.warehouseIdOf(sourceBranch) },
      to: { type: 'warehouse', id: BizLogic.StockLedger.warehouseIdOf(destBranch) },
      notes: notes || '',
      items: [{ equipment: equipmentName, qty: q }]
    });
    if (!res.success) return res;

    return { success: true, transferId: res.mutation.no };
  }
};

// ============================================================
// MAINTENANCE OPERATIONS
// ============================================================

BizLogic.Maintenance = {
  create: function(equipmentName, branch, qty, type, notes) {
    var q = Number(qty);
    if (isNaN(q) || q <= 0) return { success: false, error: 'Invalid quantity' };

    var stock = BizLogic.Stock.find(equipmentName, branch);
    if (!stock || stock.available < q) {
      return { success: false, error: 'Insufficient available stock for maintenance in ' + branch };
    }

    // Pindah kondisi: tersedia → perawatan (masih di gudang, total tidak berubah)
    BizLogic.Stock.toMaintenance(equipmentName, branch, q);

    var mt = {
      id: MockData.generateId('MT', 'maintenance'),
      equipment: equipmentName,
      branch: branch,
      quantity: q,
      type: type || 'Routine Check',
      status: 'In Progress',
      startDate: new Date().toISOString().split('T')[0],
      completionDate: null,
      notes: notes || '',
      technician: JSON.parse(sessionStorage.getItem('er_user') || '{}').name || 'Technician'
    };

    if (!MockData.maintenance) MockData.maintenance = [];
    MockData.maintenance.push(mt);
    MockData.save('maintenance');

    BizLogic.Movement.create('Maintenance In', equipmentName, q, branch, 'Maintenance Lab', mt.id);
    BizLogic.Activity.log('Started ' + mt.type + ' maintenance for ' + q + 'x ' + equipmentName, 'warning');

    return { success: true, maintenance: mt };
  },

  complete: function(maintenanceId, resolutionNotes) {
    if (!MockData.maintenance) return { success: false, error: 'No maintenance records' };
    var mt = MockData.maintenance.find(function(m) { return m.id === maintenanceId; });
    if (!mt) return { success: false, error: 'Maintenance record not found' };
    if (mt.status === 'Completed') return { success: false, error: 'Already completed' };

    mt.status = 'Completed';
    mt.completionDate = new Date().toISOString().split('T')[0];
    mt.resolution = resolutionNotes || 'Maintenance completed successfully';

    // Move back to available stock
    BizLogic.Stock.fromMaintenance(mt.equipment, mt.branch, mt.quantity);

    MockData.save('maintenance');

    BizLogic.Movement.create('Maintenance Out', mt.equipment, mt.quantity, 'Maintenance Lab', mt.branch, mt.id);
    BizLogic.Activity.log('Completed maintenance for ' + mt.equipment, 'success');

    return { success: true };
  }
};
