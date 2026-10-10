/* ============================================================
   EquipRent Enterprise - Akuntansi & Pajak
   Mengikuti "excel/1. ALUR COA & TAX.xlsx":
   A. Jurnal atas Laporan Kas: tiap Bon Biru / Bon Merah diklasifikasikan ke akun COA
   B. Posting Buku Besar (Kas & Bank global per tanggal, biaya detail per transaksi)
   C. Kertas Kerja: Neraca 2025 (saldo awal) + Mutasi + Penyesuaian → Neraca & Laba Rugi.
      Sumber mutasi: Kas & Bank, Penjualan (AR / invoice), Pembelian & Stok
   D. Jurnal Penyesuaian manual + penyesuaian persediaan akhir dari data stok
   PAJAK: PPN & PPh 23 diambil dari akun pajak di Buku Besar → XML Coretax.
   Konvensi angka internal: net = debet − kredit.
   Butuh: mock-data.js, business-logic.js (BizLogic.CashBank, BizLogic.StockLedger).
   ============================================================ */

BizLogic.Accounting = {
  // Digit pertama kode akun = jenis akun
  TYPES: {
    '1': { label: 'Aset',                         normal: 'D', report: 'NR' },
    '2': { label: 'Liabilitas',                   normal: 'K', report: 'NR' },
    '3': { label: 'Ekuitas',                      normal: 'K', report: 'NR' },
    '4': { label: 'Pendapatan',                   normal: 'K', report: 'LR' },
    '5': { label: 'Harga Pokok Penjualan',        normal: 'D', report: 'LR' },
    '6': { label: 'Biaya',                        normal: 'D', report: 'LR' },
    '7': { label: 'Pendapatan & Biaya Lain-lain', normal: 'K', report: 'LR' }
  },

  // Bagan akun (kelompok). Akun COA menempel ke kelompok lewat field group.
  GROUPS: [
    { code: '1-1',  name: 'Aset Lancar' },
    { code: '1-11', parent: '1-1', name: 'Kas & Bank', cashBank: true },
    { code: '1-12', parent: '1-1', name: 'Investasi' },
    { code: '1-13', parent: '1-1', name: 'Piutang' },
    { code: '1-14', parent: '1-1', name: 'Pinjaman & Piutang Lain-lain' },
    { code: '1-15', parent: '1-1', name: 'Persediaan' },
    { code: '1-16', parent: '1-1', name: 'Uang Muka & Jaminan' },
    { code: '1-2',  name: 'Aset Tetap' },
    { code: '2-1',  name: 'Hutang Usaha' },
    { code: '2-2',  name: 'Hutang Pajak' },
    { code: '2-3',  name: 'Hutang Lain-lain & Pinjaman' },
    { code: '3-0',  name: 'Modal & Laba' },
    { code: '4-0',  name: 'Pendapatan Usaha' },
    { code: '5-0',  name: 'Harga Pokok Penjualan' },
    { code: '6-1',  name: 'Biaya Karyawan' },
    { code: '6-2',  name: 'Biaya Kantor & Umum' },
    { code: '6-3',  name: 'Biaya Penjualan & Pembelian' },
    { code: '6-4',  name: 'Biaya Pemeliharaan' },
    { code: '6-5',  name: 'Biaya Sewa' },
    { code: '6-6',  name: 'Biaya Proyek & Pembangunan' },
    { code: '6-7',  name: 'Biaya Penyusutan' },
    { code: '6-8',  name: 'Biaya Pajak & Kerugian' },
    { code: '6-9',  name: 'Biaya Lain-lain' },
    { code: '7-1',  name: 'Pendapatan Lain-lain', normal: 'K' },
    { code: '7-2',  name: 'Selisih Kurs', normal: 'D' }
  ],

  // Akun khusus yang dipakai jurnal otomatis
  ACC: {
    AR: '1-1301', TAX_PREPAID: '1-1304', INVENTORY: '1-1501', AP: '2-1001', PPH23: '2-2001', PPN: '2-2002',
    SALES: '4-0001', RENT: '4-0002', CLAIM: '4-0003', COGS: '5-0001', PURCHASE: '5-0002',
    OTHER_IN: '7-1001', OTHER_OUT: '6-9001', CURRENT_PL: '3-0003'
  },

  // Kategori Laporan Kas yang isinya campur-campur → sebaiknya dicek / diklasifikasikan per transaksi
  GENERIC_CATEGORIES: ['kas_out_opex', 'kas_out_payroll', 'kas_out_supplier', 'kas_in_other', 'bank_out_supplier', 'bank_out_admin'],

  SOURCES: {
    kas:         { label: 'Laporan Kas',          icon: 'bi-wallet2',        color: 'primary' },
    penjualan:   { label: 'Penjualan (AR)',       icon: 'bi-receipt',        color: 'success' },
    pembelian:   { label: 'Pembelian & Stok',     icon: 'bi-cart',           color: 'warning' },
    penyesuaian: { label: 'Jurnal Penyesuaian',   icon: 'bi-pencil-square',  color: 'danger' },
    stok:        { label: 'Persediaan Akhir',     icon: 'bi-boxes',          color: 'info' }
  },

  TAX_FLAGS: {
    PPN:           'PPN Masukan & Keluaran',
    PPH23_PAYABLE: 'PPh 23 dipotong perusahaan (Bupot)',
    PPH23_PREPAID: 'PPh 23 dipotong pelanggan (kredit pajak)'
  },

  // Kode objek pajak PPh 23 (cek ulang dengan referensi Coretax sebelum dipakai produksi)
  TAX_OBJECTS: {
    '24-100-01': 'Sewa & penghasilan lain sehubungan dengan penggunaan harta',
    '24-104-01': 'Jasa teknik',
    '24-104-02': 'Jasa manajemen',
    '24-104-03': 'Jasa konsultan'
  },

  // ---------- Tanggal ----------
  today: function() { return new Date().toISOString().split('T')[0]; },
  yearStart: function(date) { return String(date).substr(0, 4) + '-01-01'; },
  prevDay: function(date) { var d = new Date(date + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().split('T')[0]; },
  monthEnd: function(year, month) { return new Date(Date.UTC(year, month, 0)).toISOString().split('T')[0]; }, // month 1-12
  monthName: function(m) { return new Date(2000, m - 1, 1).toLocaleDateString('id-ID', { month: 'long' }); },

  // ---------- Bagan Akun ----------
  // Akun Kas & Bank dibuat otomatis dari Rekening Perusahaan (Data Master), Kas dulu lalu Bank
  cashBankAccounts: function() {
    var CB = BizLogic.CashBank;
    return MockData.accounts.slice()
      .sort(function(a, b) { return (CB.kindOf(a) === CB.kindOf(b) ? 0 : CB.kindOf(a) === 'Kas' ? -1 : 1) || a.id.localeCompare(b.id); })
      .map(function(a, i) {
        var no = a.accountNumber && a.accountNumber !== '-' ? ' ' + a.accountNumber.slice(-4) : '';
        return { id: 'CB:' + a.id, code: '1-11' + String(i + 1).padStart(2, '0'), name: a.name + no, group: '1-11', normal: 'D',
          opening: Number(a.openingBalance) || 0, cashAccountId: a.id, system: true, inactive: a.status === 'Inactive' };
      });
  },

  accounts: function() {
    return (MockData.coa || []).concat(this.cashBankAccounts())
      .sort(function(a, b) { return a.code.localeCompare(b.code, undefined, { numeric: true }); });
  },

  _index: function() {
    var map = {};
    this.accounts().forEach(function(a) { map[a.id] = a; });
    return map;
  },

  account: function(id) { return this.accounts().find(function(a) { return a.id === id; }); },
  typeOf: function(acc) { return String(acc.code).charAt(0); },
  group: function(code) { return this.GROUPS.find(function(g) { return g.code === code; }); },
  normalOf: function(acc) {
    if (acc.normal) return acc.normal;
    var g = this.group(acc.group);
    return (g && g.normal) || this.TYPES[this.typeOf(acc)].normal;
  },
  isPL: function(acc) { return this.TYPES[this.typeOf(acc)].report === 'LR'; },
  // Saldo awal tahun berjalan (= saldo akhir tahun lalu), dalam konvensi net debet − kredit
  openingNet: function(acc) { return (Number(acc.opening) || 0) * (this.normalOf(acc) === 'D' ? 1 : -1); },
  label: function(acc) { return acc ? acc.code + ' · ' + acc.name : '-'; },

  // Opsi <select> akun, dikelompokkan per kelompok bagan
  accountOptions: function(selected, opts) {
    opts = opts || {};
    var self = this, all = this.accounts().filter(function(a) { return a.id !== self.ACC.CURRENT_PL && (!opts.filter || opts.filter(a)); });
    var esc = function(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    return (opts.empty ? '<option value="">' + opts.empty + '</option>' : '') + this.GROUPS.map(function(g) {
      var list = all.filter(function(a) { return a.group === g.code; });
      if (!list.length) return '';
      return '<optgroup label="' + g.code + ' ' + esc(g.name) + '">' + list.map(function(a) {
        return '<option value="' + a.id + '"' + (a.id === selected ? ' selected' : '') + '>' + a.code + ' · ' + esc(a.name) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
  },

  // Tambah / ubah akun COA. Akun Kas & Bank dikelola di Rekening Perusahaan.
  saveAccount: function(data, editId) {
    data = data || {};
    var code = String(data.code || '').trim(), name = String(data.name || '').trim();
    if (!/^[1-7]-\d{2,4}$/.test(code)) return { success: false, error: 'Format kode akun: 1-1301 (digit pertama = jenis akun 1-7)' };
    if (!name) return { success: false, error: 'Nama akun wajib diisi' };
    var g = this.group(data.group);
    if (!g || g.cashBank) return { success: false, error: 'Pilih kelompok akun' };
    if (g.code.charAt(0) !== code.charAt(0)) return { success: false, error: 'Digit pertama kode harus sama dengan kelompok (' + g.code + ')' };
    if (this.accounts().some(function(a) { return a.code === code && a.id !== editId; })) return { success: false, error: 'Kode ' + code + ' sudah dipakai' };
    var list = MockData.coa = MockData.coa || [];
    var acc = editId ? list.find(function(a) { return a.id === editId; }) : null;
    if (editId && !acc) return { success: false, error: 'Akun tidak ditemukan / tidak bisa diubah di sini' };
    if (acc && acc.code !== code && this.isUsed(acc.id)) return { success: false, error: 'Kode akun yang sudah punya transaksi tidak bisa diganti' };
    var rec = acc || { id: code };
    rec.code = code; rec.name = name; rec.group = g.code;
    rec.opening = Math.round(Number(data.opening) || 0);
    if (data.normal === 'D' || data.normal === 'K') rec.normal = data.normal; else delete rec.normal;
    if (data.tax) rec.tax = data.tax; else delete rec.tax;
    if (!acc) list.push(rec);
    MockData.save('coa');
    BizLogic.Activity.log('Akun COA ' + code + ' ' + name + (acc ? ' diubah' : ' ditambahkan'), 'info');
    return { success: true, account: rec };
  },

  isUsed: function(accId) {
    return this.journals({ adjusted: true, noClosing: true }).some(function(j) { return j.lines.some(function(l) { return l.acc === accId; }); });
  },

  // ---------- Pemetaan Laporan Kas → COA ----------
  mapOf: function(category) { return (MockData.coaCashMap || {})[category] || null; },
  saveMap: function(category, accId) {
    if (!BizLogic.CashBank.CATEGORIES[category]) return { success: false, error: 'Kategori tidak dikenal' };
    if (!this.account(accId)) return { success: false, error: 'Akun tidak ditemukan' };
    MockData.coaCashMap = MockData.coaCashMap || {};
    MockData.coaCashMap[category] = accId;
    MockData.save('coaCashMap');
    return { success: true };
  },
  // Akun lawan untuk satu Bon: klasifikasi manual (coaId) > pemetaan kategori > lain-lain
  classify: function(e) {
    return e.coaId || this.mapOf(BizLogic.CashBank.categoryOf(e)) || (e.type === 'IN' ? this.ACC.OTHER_IN : this.ACC.OTHER_OUT);
  },
  // manual | mapped | review (kategori campuran, belum diklasifikasikan)
  classifyStatus: function(e) {
    if (e.transferId) return 'transfer';
    if (e.coaId) return 'manual';
    return this.GENERIC_CATEGORIES.indexOf(BizLogic.CashBank.categoryOf(e)) >= 0 ? 'review' : 'mapped';
  },
  setClassification: function(ledgerId, coaId, projectId) {
    var e = (MockData.ledger || []).find(function(x) { return x.id === ledgerId; });
    if (!e) return { success: false, error: 'Transaksi tidak ditemukan' };
    if (e.transferId) return { success: false, error: 'Pindah dana dijurnal otomatis antar akun Kas/Bank' };
    if (coaId) {
      var acc = this.account(coaId);
      if (!acc || acc.id === this.ACC.CURRENT_PL) return { success: false, error: 'Akun tidak valid' };
      if (acc.cashAccountId) return { success: false, error: 'Gunakan Pindah Dana untuk perpindahan antar Kas/Bank' };
    }
    if (coaId && coaId !== this.mapOf(BizLogic.CashBank.categoryOf(e))) e.coaId = coaId; else delete e.coaId;
    if (projectId !== undefined) { if (projectId) e.projectId = projectId; else delete e.projectId; }
    MockData.save('ledger');
    return { success: true };
  },

  // ---------- Nilai Persediaan (dari data stok) ----------
  // Harga perolehan per unit = harga PO terakhir; tanpa PO: tarif sewa × 10 (sama dgn nilai ganti klaim)
  unitCosts: function() {
    var costs = {};
    (MockData.purchases || []).slice().sort(function(a, b) { return (a.purchaseDate || '').localeCompare(b.purchaseDate || ''); })
      .forEach(function(po) { (po.items || []).forEach(function(it) { if (it.price) costs[it.name] = Number(it.price); }); });
    BizLogic.StockLedger.equipmentNames().forEach(function(n) {
      if (!costs[n]) costs[n] = (BizLogic.StockLedger.defaultRate(n) || 0) * 10;
    });
    return costs;
  },

  // Qty milik perusahaan per alat (gudang + lokasi proyek) s/d tanggal. Stock opname (OPENING) = saldo awal.
  stockQty: function(asOf, projectId) {
    var qty = {};
    function add(loc, eq, q) {
      if (!loc) return;
      if (projectId ? (loc.type === 'project' && loc.id === projectId) : (loc.type === 'warehouse' || loc.type === 'project')) qty[eq] = (qty[eq] || 0) + q;
    }
    (MockData.stockMutations || []).forEach(function(d) {
      if (d.type !== 'OPENING' && d.date > asOf) return;
      if (projectId && d.type === 'OPENING') return;
      d.items.forEach(function(it) { add(d.from, it.equipment, -it.qty); add(d.to, it.equipment, it.qty); });
    });
    return qty;
  },

  stockValue: function(asOf, projectId, costs) {
    costs = costs || this.unitCosts();
    var q = this.stockQty(asOf, projectId), total = 0;
    Object.keys(q).forEach(function(eq) { total += q[eq] * (costs[eq] || 0); });
    return Math.round(total);
  },

  // Rincian nilai persediaan per alat (untuk drill-down di Laba Rugi / Neraca)
  stockDetail: function(asOf) {
    var costs = this.unitCosts(), q = this.stockQty(asOf);
    return Object.keys(q).filter(function(eq) { return q[eq]; }).sort().map(function(eq) {
      return { equipment: eq, qty: q[eq], cost: costs[eq] || 0, value: Math.round(q[eq] * (costs[eq] || 0)) };
    });
  },

  // Arus persediaan di lokasi proyek: awal + masuk (SJK) − keluar (SJR) − akhir = hilang / terpakai
  projectStockFlow: function(projectId, from, to, costs) {
    costs = costs || this.unitCosts();
    var flow = { opening: this.stockValue(this.prevDay(from), projectId, costs), in: 0, out: 0, closing: this.stockValue(to, projectId, costs) };
    (MockData.stockMutations || []).forEach(function(d) {
      if (d.date < from || d.date > to) return;
      d.items.forEach(function(it) {
        var v = it.qty * (costs[it.equipment] || 0);
        if (d.type === 'DELIVERY' && d.to.type === 'project' && d.to.id === projectId) flow.in += v;
        if (d.type === 'RETURN' && d.from.type === 'project' && d.from.id === projectId) flow.out += v;
      });
    });
    flow.in = Math.round(flow.in); flow.out = Math.round(flow.out);
    return flow;
  },

  // ---------- Jurnal ----------
  // Entri: { id, no, date, source, ref, desc, party, projectId, link, adj, tax, lines: [{ acc, d, k, memo, tax }] }
  _cashJournals: function() {
    var self = this, CB = BizLogic.CashBank, ledger = MockData.ledger || [], out = [];
    CB.entries().forEach(function(e) {
      var acc = 'CB:' + e.bankAccountId, counter;
      if (e.transferId) {
        if (e.type === 'IN') return; // pasangan pindah dana sudah dijurnal dari sisi keluar
        var pair = ledger.find(function(x) { return x.transferId === e.transferId && x.id !== e.id; });
        counter = pair ? 'CB:' + pair.bankAccountId : self.classify(e);
      } else counter = self.classify(e);
      var lines = e.type === 'IN'
        ? [{ acc: acc, d: e.amount, k: 0 }, { acc: counter, d: 0, k: e.amount }]
        : [{ acc: counter, d: e.amount, k: 0 }, { acc: acc, d: 0, k: e.amount }];
      out.push({ id: 'KB-' + e.id, no: e.voucherNo, date: e.date, source: 'kas', ref: e.reference, desc: e.description, party: e.party,
        projectId: e.projectId || null, ledgerId: e.id, link: 'finance-ledger.html?account=' + e.bankAccountId, lines: lines });
    });
    return out;
  },

  _salesJournals: function() {
    var A = this.ACC;
    return (MockData.invoices || []).filter(function(inv) { return ['Shadow', 'Cancelled', 'Draft'].indexOf(inv.status) < 0; }).map(function(inv) {
      var amount = Math.round(Number(inv.amount) || 0), dpp = Math.round(Number(inv.subtotal) || amount), ppn = amount - dpp;
      var revenue = inv.type === 'Klaim' ? A.CLAIM : inv.type === 'Jual' ? A.SALES : A.RENT;
      var lines = [{ acc: A.AR, d: amount, k: 0, memo: inv.customerName }, { acc: revenue, d: 0, k: dpp }];
      if (ppn) lines.push({ acc: A.PPN, d: 0, k: ppn, tax: { kind: 'PPN_OUT', dpp: dpp, invoiceId: inv.id, customerId: inv.customerId } });
      return { id: 'PJ-' + inv.id, no: inv.id, date: inv.invoiceDate, source: 'penjualan', ref: inv.reference || '', party: inv.customerName,
        desc: ({ Klaim: 'Invoice klaim ', Jual: 'Invoice penjualan ' }[inv.type] || 'Invoice sewa ') + inv.id + ' - ' + (inv.projectName || inv.customerName || ''), projectId: inv.projectId || null,
        link: 'invoice-detail.html?id=' + inv.id, lines: lines };
    });
  },

  // Pembelian diakui saat barang diterima di gudang (dokumen PB di Perpindahan Stok), dinilai dgn harga PO.
  // Metode periodik: masuk ke akun Pembelian, lalu disesuaikan dgn persediaan akhir (lihat _stockClosing).
  _purchaseJournals: function(costs) {
    var A = this.ACC, rate = (MockData.settings && MockData.settings.taxRate) || 0.11;
    return (MockData.stockMutations || []).filter(function(d) { return ['PURCHASE', 'PRODUCTION', 'SURPLUS'].indexOf(d.type) >= 0; }).map(function(d) {
      var m = String(d.reference || '').match(/PO-\d+/), po = m && (MockData.purchases || []).find(function(p) { return p.id === m[0]; });
      var dpp = Math.round(d.items.reduce(function(s, it) {
        var pi = po && (po.items || []).find(function(x) { return x.name === it.equipment; });
        return s + it.qty * ((pi && Number(pi.price)) || costs[it.equipment] || 0);
      }, 0));
      var fromSupplier = d.type === 'PURCHASE' && d.from && d.from.type === 'supplier', party = (d.from && d.from.name) || (po && po.supplier) || '';
      var ppn = fromSupplier ? Math.round(dpp * rate) : 0;
      var lines = [{ acc: A.PURCHASE, d: dpp, k: 0 }];
      if (ppn) lines.push({ acc: A.PPN, d: ppn, k: 0, tax: { kind: 'PPN_IN', dpp: dpp, poId: po ? po.id : null } });
      // Kelebihan alat (selisih lebih stock opname) = pendapatan lain-lain; produksi sendiri = hutang biaya produksi
      if (d.type === 'SURPLUS') lines.push({ acc: A.OTHER_IN, d: 0, k: dpp, memo: 'Selisih lebih stok' });
      else lines.push({ acc: A.AP, d: 0, k: dpp + ppn, memo: party });
      return { id: 'PB-' + d.id, no: d.no, date: d.date, source: 'pembelian', ref: d.reference || '', party: party,
        desc: d.type === 'SURPLUS' ? 'Kelebihan alat (selisih lebih stok)' + (d.notes ? ' - ' + d.notes : '') : (fromSupplier ? 'Pembelian alat dari ' : 'Produksi / perakitan internal - ') + party,
        link: po ? 'purchase-detail.html?id=' + po.id : 'stock-mutations.html', lines: lines };
    });
  },

  _manualJournals: function() {
    return (MockData.journals || []).map(function(j) {
      return { id: j.id, no: j.no, date: j.date, source: 'penyesuaian', adj: true, ref: j.ref || '', desc: j.desc, party: (j.tax && j.tax.party) || j.party || '',
        projectId: j.projectId || null, tax: j.tax || null, user: j.user, manual: true,
        lines: j.lines.map(function(l) { return { acc: l.acc, d: Number(l.d) || 0, k: Number(l.k) || 0, memo: l.memo || '' }; }) };
    });
  },

  // Penyesuaian persediaan akhir (otomatis, per tanggal laporan):
  // HPP = Persediaan awal + Pembelian − Persediaan akhir (nilai stok s/d tanggal tsb)
  _stockClosing: function(to, base, costs) {
    var A = this.ACC, ys = this.yearStart(to), inv = this.account(A.INVENTORY);
    if (!inv) return null;
    var opening = this.openingNet(inv), purchases = 0;
    base.forEach(function(j) {
      if (j.date < ys || j.date > to) return;
      j.lines.forEach(function(l) { if (l.acc === A.PURCHASE) purchases += l.d - l.k; });
    });
    var closing = this.stockValue(to, null, costs), hpp = opening + purchases - closing;
    var line = function(acc, net, memo) { return net >= 0 ? { acc: acc, d: net, k: 0, memo: memo } : { acc: acc, d: 0, k: -net, memo: memo }; };
    var lines = [line(A.COGS, hpp, 'Persediaan awal + pembelian − persediaan akhir'), line(A.INVENTORY, closing - opening, 'Nilai stok akhir dari data stok'), line(A.PURCHASE, -purchases, 'Tutup akun pembelian')]
      .filter(function(l) { return l.d || l.k; });
    if (!lines.length) return null;
    return { id: 'SC-' + to, no: 'JP-STOK', date: to, source: 'stok', adj: true, ref: 'Data stok s/d ' + to, auto: true,
      desc: 'Penyesuaian persediaan akhir (stock opname sistem)', link: 'stock-report.html', lines: lines,
      stock: { opening: opening, purchases: purchases, closing: closing, hpp: hpp } };
  },

  // opts: { from, to, adjusted (default true), noClosing, source }
  journals: function(opts) {
    opts = opts || {};
    var costs = this.unitCosts();
    var base = this._cashJournals().concat(this._salesJournals(), this._purchaseJournals(costs));
    var list = base.slice();
    if (opts.adjusted !== false) {
      list = list.concat(this._manualJournals());
      if (opts.to && !opts.noClosing) { var sc = this._stockClosing(opts.to, base, costs); if (sc) list.push(sc); }
    }
    return list.filter(function(j) {
      return (!opts.from || j.date >= opts.from) && (!opts.to || j.date <= opts.to) && (!opts.source || j.source === opts.source);
    }).sort(function(a, b) { return a.date.localeCompare(b.date) || (a.adj ? 1 : 0) - (b.adj ? 1 : 0) || String(a.no).localeCompare(String(b.no)); });
  },

  // ---------- Jurnal Penyesuaian (manual) ----------
  nextJournalNo: function(date) {
    var prefix = 'JP-' + String(date).substr(2, 5).replace('-', '') + '-', max = 0;
    (MockData.journals || []).forEach(function(j) { if (j.no.indexOf(prefix) === 0) max = Math.max(max, parseInt(j.no.substr(prefix.length), 10) || 0); });
    return prefix + String(max + 1).padStart(3, '0');
  },

  // data: { date, desc, ref, projectId, lines: [{acc, d, k, memo}], tax: { party, npwp, dpp, rate, objectCode, docNo, docDate } }
  addJournal: function(data) {
    data = data || {};
    var self = this;
    if (!data.date) return { success: false, error: 'Tanggal wajib diisi' };
    if (!String(data.desc || '').trim()) return { success: false, error: 'Uraian wajib diisi' };
    var lines = (data.lines || []).map(function(l) { return { acc: l.acc, d: Math.round(Number(l.d) || 0), k: Math.round(Number(l.k) || 0), memo: String(l.memo || '').trim() }; })
      .filter(function(l) { return l.acc || l.d || l.k; });
    if (lines.length < 2) return { success: false, error: 'Minimal 2 baris akun (debet & kredit)' };
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i], acc = this.account(l.acc);
      if (!acc || acc.id === this.ACC.CURRENT_PL) return { success: false, error: 'Baris ' + (i + 1) + ': pilih akun' };
      if (l.d < 0 || l.k < 0 || (l.d && l.k) || (!l.d && !l.k)) return { success: false, error: 'Baris ' + (i + 1) + ': isi debet ATAU kredit' };
    }
    var td = lines.reduce(function(s, l) { return s + l.d; }, 0), tk = lines.reduce(function(s, l) { return s + l.k; }, 0);
    if (td !== tk) return { success: false, error: 'Jurnal tidak seimbang: debet ' + td.toLocaleString('id-ID') + ' ≠ kredit ' + tk.toLocaleString('id-ID') };
    var tax = null;
    if (lines.some(function(l) { var a = self.account(l.acc); return a.tax === 'PPH23_PAYABLE' || a.tax === 'PPH23_PREPAID'; })) {
      tax = data.tax || {};
      if (!String(tax.party || '').trim()) return { success: false, error: 'Data pajak: nama lawan transaksi wajib diisi' };
      if (this.npwp16(tax.npwp).length !== 16) return { success: false, error: 'Data pajak: NPWP harus 15 / 16 digit' };
      if (!(Number(tax.dpp) > 0)) return { success: false, error: 'Data pajak: DPP wajib diisi' };
      tax = { party: String(tax.party).trim(), npwp: this.npwp16(tax.npwp), dpp: Math.round(Number(tax.dpp)), rate: Number(tax.rate) || 2,
        objectCode: tax.objectCode || '24-100-01', docNo: String(tax.docNo || '').trim(), docDate: tax.docDate || data.date };
    }
    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    var j = { id: MockData.generateId('JRN', 'journals'), no: this.nextJournalNo(data.date), date: data.date, desc: String(data.desc).trim(),
      ref: String(data.ref || '').trim(), projectId: data.projectId || null, lines: lines, tax: tax, user: user.name || 'System', createdAt: new Date().toISOString() };
    MockData.journals = MockData.journals || [];
    MockData.journals.push(j);
    MockData.save('journals');
    BizLogic.Activity.log('Jurnal penyesuaian ' + j.no + ': ' + j.desc, 'info');
    return { success: true, journal: j };
  },

  removeJournal: function(id) {
    var j = (MockData.journals || []).find(function(x) { return x.id === id; });
    if (!j) return { success: false, error: 'Jurnal tidak ditemukan' };
    MockData.journals = MockData.journals.filter(function(x) { return x.id !== id; });
    MockData.save('journals');
    BizLogic.Activity.log('Jurnal penyesuaian ' + j.no + ' dihapus', 'danger');
    return { success: true };
  },

  // ---------- Buku Besar ----------
  // opts: { adjusted (default true) }. Saldo ditampilkan sesuai saldo normal akun.
  ledger: function(accId, from, to, opts) {
    opts = opts || {};
    var acc = this.account(accId);
    if (!acc) return null;
    var sign = this.normalOf(acc) === 'D' ? 1 : -1, ys = this.yearStart(from);
    var all = this.journals({ to: to, adjusted: opts.adjusted !== false });
    var net = this.openingNet(acc), rows = [], totalD = 0, totalK = 0;
    all.forEach(function(j) {
      if (j.date < ys) return;
      j.lines.forEach(function(l) {
        if (l.acc !== accId) return;
        if (j.date < from) { net += l.d - l.k; return; }
        rows.push({ date: j.date, no: j.no, source: j.source, desc: l.memo ? j.desc + ' — ' + l.memo : j.desc, party: j.party, d: l.d, k: l.k, link: j.link, adj: j.adj, projectId: j.projectId });
      });
    });
    var opening = net * sign || 0; // || 0: hindari -0
    rows.forEach(function(r) { net += r.d - r.k; r.bal = net * sign || 0; totalD += r.d; totalK += r.k; });
    return { account: acc, opening: opening, rows: rows, totalD: totalD, totalK: totalK, closing: net * sign || 0 };
  },

  // ---------- Kertas Kerja ----------
  // Per akun: Neraca awal (saldo akhir tahun lalu), Mutasi s/d tanggal, Penyesuaian, Neraca akhir / Laba Rugi
  worksheet: function(to) {
    var self = this, ys = this.yearStart(to), rows = {}, sources = {};
    this.accounts().forEach(function(a) {
      if (a.id === self.ACC.CURRENT_PL) return;
      var o = self.openingNet(a);
      rows[a.id] = { account: a, openD: Math.max(o, 0), openK: Math.max(-o, 0), mutD: 0, mutK: 0, adjD: 0, adjK: 0 };
    });
    this.journals({ from: ys, to: to }).forEach(function(j) {
      sources[j.source] = (sources[j.source] || 0) + 1;
      j.lines.forEach(function(l) {
        var r = rows[l.acc];
        if (!r) return;
        if (j.adj) { r.adjD += l.d; r.adjK += l.k; } else { r.mutD += l.d; r.mutK += l.k; }
      });
    });
    var list = Object.keys(rows).map(function(k) { return rows[k]; })
      .sort(function(a, b) { return a.account.code.localeCompare(b.account.code, undefined, { numeric: true }); });
    var tot = { openD: 0, openK: 0, mutD: 0, mutK: 0, adjD: 0, adjK: 0, nrD: 0, nrK: 0, lrD: 0, lrK: 0 };
    list.forEach(function(r) {
      var net = r.openD - r.openK + r.mutD - r.mutK + r.adjD - r.adjK, pl = self.isPL(r.account);
      r.nrD = !pl && net > 0 ? net : 0; r.nrK = !pl && net < 0 ? -net : 0;
      r.lrD = pl && net > 0 ? net : 0;  r.lrK = pl && net < 0 ? -net : 0;
      r.empty = !(r.openD || r.openK || r.mutD || r.mutK || r.adjD || r.adjK);
      Object.keys(tot).forEach(function(k) { tot[k] += r[k]; });
    });
    var profit = tot.lrK - tot.lrD;
    return { to: to, from: ys, rows: list, totals: tot, profit: profit, sources: sources,
      balanced: { opening: tot.openD === tot.openK, mutation: tot.mutD === tot.mutK, adjustment: tot.adjD === tot.adjK, final: tot.nrD === tot.nrK + profit } };
  },

  // Saldo akhir per akun (net debet − kredit) s/d tanggal. adjusted=false → tanpa jurnal penyesuaian & persediaan akhir
  balances: function(to, adjusted) {
    var self = this, ys = this.yearStart(to), bal = {};
    this.accounts().forEach(function(a) { bal[a.id] = self.openingNet(a); });
    this.journals({ from: ys, to: to, adjusted: adjusted !== false }).forEach(function(j) {
      j.lines.forEach(function(l) { if (bal[l.acc] !== undefined) bal[l.acc] += l.d - l.k; });
    });
    return bal;
  },

  // ---------- Laba Rugi ----------
  // Format sesuai excel: A. Pendapatan, HPP (persediaan awal + pembelian − persediaan akhir) = B, C. Laba Kotor (A−B),
  // Biaya → D. Total Biaya, Pendapatan / biaya lain-lain, E. Laba Bersih.
  // projectId: null = keseluruhan; 'PRJ-xxx' = per proyek (penjualan dari AR, persediaan dari stok proyek, biaya dari buku besar yg ditandai proyek)
  profitLoss: function(to, projectId) {
    var self = this, A = this.ACC, ys = this.yearStart(to), costs = this.unitCosts();
    var map = this._index(), amt = {};
    var journals = this.journals({ from: ys, to: to, noClosing: true });
    journals.forEach(function(j) {
      if (projectId && j.projectId !== projectId) return;
      j.lines.forEach(function(l) { amt[l.acc] = (amt[l.acc] || 0) + l.d - l.k; });
    });
    var pick = function(type, signFn) {
      return Object.keys(amt).filter(function(id) { return map[id] && self.typeOf(map[id]) === type && amt[id]; })
        .map(function(id) { return { account: map[id], amount: signFn(amt[id]) }; })
        .sort(function(a, b) { return a.account.code.localeCompare(b.account.code, undefined, { numeric: true }); });
    };
    var revenue = pick('4', function(v) { return -v; });
    var expenses = pick('6', function(v) { return v; });
    var other = pick('7', function(v) { return -v; });
    var hpp;
    if (projectId) {
      var f = this.projectStockFlow(projectId, ys, to, costs);
      hpp = { opening: f.opening, purchases: f.in - f.out, closing: f.closing, purchasesLabel: 'Barang masuk proyek (kirim − pulang)' };
    } else {
      var inv = map[A.INVENTORY];
      hpp = { opening: inv ? this.openingNet(inv) : 0, purchases: amt[A.PURCHASE] || 0, closing: this.stockValue(to, null, costs), purchasesLabel: 'Pembelian' };
    }
    hpp.available = hpp.opening + hpp.purchases;
    // akun HPP lain (retur pembelian, HPP lain) ikut menambah / mengurangi HPP
    hpp.others = pick('5', function(v) { return v; }).filter(function(r) { return r.account.id !== A.PURCHASE && r.account.id !== A.COGS; });
    hpp.total = hpp.available - hpp.closing + hpp.others.reduce(function(s, r) { return s + r.amount; }, 0);
    var sum = function(list) { return list.reduce(function(s, r) { return s + r.amount; }, 0); };
    var res = { to: to, from: ys, projectId: projectId || null, revenue: revenue, revenueTotal: sum(revenue), hpp: hpp, expenses: expenses, expenseTotal: sum(expenses), other: other, otherTotal: sum(other) };
    res.gross = res.revenueTotal - hpp.total;
    res.net = res.gross - res.expenseTotal + res.otherTotal;
    return res;
  },

  // Proyek yang punya pendapatan / biaya / stok di periode tsb
  activeProjects: function(to) {
    var ys = this.yearStart(to), ids = {};
    this.journals({ from: ys, to: to, noClosing: true }).forEach(function(j) { if (j.projectId) ids[j.projectId] = true; });
    (MockData.stockMutations || []).forEach(function(d) {
      if (d.date > to) return;
      if (d.to && d.to.type === 'project') ids[d.to.id] = true;
      if (d.from && d.from.type === 'project') ids[d.from.id] = true;
    });
    return MockData.projects.filter(function(p) { return ids[p.id]; });
  },

  // ---------- Neraca ----------
  balanceSheet: function(to, adjusted) {
    var self = this, bal = this.balances(to, adjusted), ws = null;
    var map = this._index();
    var rowsOf = function(filter, sign) {
      return self.accounts().filter(function(a) { return filter(a) && a.id !== self.ACC.CURRENT_PL && bal[a.id]; })
        .map(function(a) { return { account: a, amount: bal[a.id] * sign || 0 }; });
    };
    var plNet = 0;
    Object.keys(bal).forEach(function(id) { if (map[id] && self.isPL(map[id])) plNet += bal[id]; });
    var currentAssets = rowsOf(function(a) { return a.group.indexOf('1-1') === 0; }, 1);
    var fixedAssets = rowsOf(function(a) { return a.group === '1-2'; }, 1);
    var liabilities = rowsOf(function(a) { return self.typeOf(a) === '2'; }, -1);
    var equity = rowsOf(function(a) { return self.typeOf(a) === '3'; }, -1);
    var sum = function(list) { return list.reduce(function(s, r) { return s + r.amount; }, 0); };
    var res = { to: to, adjusted: adjusted !== false, currentAssets: currentAssets, fixedAssets: fixedAssets, liabilities: liabilities, equity: equity,
      currentProfit: -plNet };
    res.totalCurrent = sum(currentAssets); res.totalFixed = sum(fixedAssets); res.totalAssets = res.totalCurrent + res.totalFixed;
    res.totalLiabilities = sum(liabilities); res.totalEquity = sum(equity) + res.currentProfit;
    res.totalPassiva = res.totalLiabilities + res.totalEquity;
    res.difference = res.totalAssets - res.totalPassiva;
    return res;
  },

  // ---------- Pajak (terlink dari akun pajak di Buku Besar) ----------
  npwp16: function(s) {
    var d = String(s || '').replace(/\D/g, '');
    return d.length === 15 ? '0' + d : d.length === 16 ? d : '';
  },
  formatNpwp: function(s) {
    var d = this.npwp16(s);
    return d ? d.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4') : '';
  },
  idtku: function(npwp) { var d = this.npwp16(npwp); return d ? d + '000000' : ''; },

  // kind: 'PPN' | 'PPH23_PAYABLE' | 'PPH23_PREPAID'. Baris = setiap posting ke akun pajak di Buku Besar.
  taxRows: function(kind, from, to) {
    var self = this, map = this._index(), rows = [];
    this.journals({ from: from, to: to, noClosing: true }).forEach(function(j) {
      j.lines.forEach(function(l) {
        var acc = map[l.acc];
        if (!acc || acc.tax !== kind) return;
        var meta = l.tax || {}, jt = j.tax || {}, r = { journal: j, date: j.date, no: j.no, source: j.source, desc: j.desc, account: acc, d: l.d, k: l.k, amount: l.d || l.k };
        if (kind === 'PPN') {
          r.direction = l.k ? 'OUT' : 'IN'; // OUT = PPN Keluaran (kredit), IN = PPN Masukan (debet)
          r.dpp = meta.dpp || jt.dpp || 0;
          if (meta.invoiceId) {
            r.invoice = (MockData.invoices || []).find(function(i) { return i.id === meta.invoiceId; });
            r.customer = MockData.customers.find(function(c) { return c.id === meta.customerId; });
            r.party = r.customer ? r.customer.name : j.party;
            r.npwp = r.customer ? self.npwp16(r.customer.taxId) : '';
          } else { r.party = jt.party || j.party; r.npwp = self.npwp16(jt.npwp); }
        } else {
          r.direction = l.k ? (kind === 'PPH23_PAYABLE' ? 'WITHHELD' : 'CREDITED') : (kind === 'PPH23_PAYABLE' ? 'PAID' : 'WITHHELD');
          r.party = jt.party || j.party; r.npwp = self.npwp16(jt.npwp); r.dpp = jt.dpp || 0; r.rate = jt.rate || 2;
          r.objectCode = jt.objectCode || '24-100-01'; r.docNo = jt.docNo || j.ref || j.no; r.docDate = jt.docDate || j.date;
        }
        rows.push(r);
      });
    });
    return rows;
  },

  _xmlEsc: function(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); },
  _tag: function(name, val, ind) { return ind + (val === '' || val == null ? '<' + name + '/>' : '<' + name + '>' + this._xmlEsc(val) + '</' + name + '>'); },

  // XML Faktur Pajak Keluaran (impor e-Faktur Coretax). PPN 11% efektif = DPP Nilai Lain 11/12 × tarif 12% (kode transaksi 04).
  coretaxFakturXml: function(rows) {
    var self = this, seller = this.npwp16(MockData.company.taxId), I = '      ', G = '          ';
    var out = ['<?xml version="1.0" encoding="utf-8"?>', '<TaxInvoiceBulk xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="TaxInvoice.xsd">',
      this._tag('TIN', seller, '  '), '  <ListOfTaxInvoice>'];
    rows.forEach(function(r) {
      var inv = r.invoice || {}, c = r.customer || {}, buyer = self.npwp16(c.taxId);
      var items = (inv.items && inv.items.length ? inv.items : [{ desc: r.desc, amount: r.dpp }]).map(function(it) { return { name: it.desc || it.equipment || 'Jasa sewa alat', base: Math.round(Number(it.amount) || 0) }; });
      var vatLeft = r.amount;
      out.push('    <TaxInvoice>');
      [['TaxInvoiceDate', r.date], ['TaxInvoiceOpt', 'Normal'], ['TrxCode', '04'], ['AddInfo', ''], ['CustomDoc', ''], ['RefDesc', inv.id || r.no], ['FacilityStamp', ''],
       ['SellerIDTKU', self.idtku(seller)], ['BuyerTin', buyer || '0000000000000000'], ['BuyerDocument', buyer ? 'TIN' : 'Other ID'], ['BuyerCountry', 'IDN'],
       ['BuyerDocumentNumber', buyer ? '' : '-'], ['BuyerName', r.party], ['BuyerAdress', c.address || ''], ['BuyerEmail', c.email || ''], ['BuyerIDTKU', buyer ? self.idtku(buyer) : '000000']
      ].forEach(function(t) { out.push(self._tag(t[0], t[1], I)); });
      out.push(I + '<ListOfGoodService>');
      items.forEach(function(it, i) {
        var other = Math.round(it.base * 11 / 12), vat = i === items.length - 1 ? vatLeft : Math.round(other * 0.12);
        vatLeft -= vat;
        out.push(I + '  <GoodService>');
        [['Opt', 'B'], ['Code', '000000'], ['Name', it.name + (inv.reference ? ' (' + inv.reference + ')' : '')], ['Unit', 'UM.0033'], ['Price', it.base], ['Qty', 1],
         ['TotalDiscount', 0], ['TaxBase', it.base], ['OtherTaxBase', other], ['VATRate', 12], ['VAT', vat], ['STLGRate', 0], ['STLG', 0]
        ].forEach(function(t) { out.push(self._tag(t[0], t[1], G)); });
        out.push(I + '  </GoodService>');
      });
      out.push(I + '</ListOfGoodService>', '    </TaxInvoice>');
    });
    out.push('  </ListOfTaxInvoice>', '</TaxInvoiceBulk>');
    return out.join('\n');
  },

  // XML Bukti Potong PPh 23 / Unifikasi (BPPU) untuk impor Coretax
  coretaxBupotXml: function(rows) {
    var self = this, tin = this.npwp16(MockData.company.taxId), I = '      ';
    var out = ['<?xml version="1.0" encoding="utf-8"?>', '<BpuBulk xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">', this._tag('TIN', tin, '  '), '  <ListOfBpu>'];
    rows.forEach(function(r) {
      out.push('    <Bpu>');
      [['TaxPeriodMonth', Number(r.date.substr(5, 2))], ['TaxPeriodYear', r.date.substr(0, 4)], ['CounterpartTin', r.npwp],
       ['IDPlaceOfBusinessActivityOfIncomeRecipient', self.idtku(r.npwp)], ['TaxCertificate', 'N/A'], ['TaxObjectCode', r.objectCode],
       ['TaxBase', r.dpp], ['Rate', r.rate], ['Document', 'CommercialInvoice'], ['DocumentNumber', r.docNo], ['DocumentDate', r.docDate],
       ['IDPlaceOfBusinessActivity', self.idtku(tin)], ['GovTreasurerOpt', 'N/A'], ['SP2DNumber', ''], ['WithholdingDate', r.date]
      ].forEach(function(t) { out.push(self._tag(t[0], t[1], I)); });
      out.push('    </Bpu>');
    });
    out.push('  </ListOfBpu>', '</BpuBulk>');
    return out.join('\n');
  },

  // ---------- UI bersama ----------
  // Bar alur kerja akuntansi (urutan sesuai excel A → D)
  FLOW: [
    ['coa.html', '', 'Bagan Akun'],
    ['journal.html', 'A', 'Jurnal Laporan Kas'],
    ['general-ledger.html', 'B', 'Buku Besar'],
    ['worksheet.html', 'C', 'Kertas Kerja'],
    ['adjustments.html', 'D', 'Jurnal Penyesuaian'],
    ['profit-loss.html', '', 'Laba Rugi'],
    ['balance-sheet.html', '', 'Neraca']
  ],
  flowBar: function(active) {
    return '<div class="flow-steps mb-3 no-print">' + this.FLOW.map(function(f, i) {
      return (i ? '<i class="bi bi-chevron-right arrow"></i>' : '') +
        '<a href="' + f[0] + '" class="step' + (f[0] === active ? ' active' : '') + '">' + (f[1] ? '<b>' + f[1] + '.</b>' : '') + f[2] + '</a>';
    }).join('') + '</div>';
  },

  // Periode laporan: tahun buku + s/d bulan (mutasi dihitung dari 1 Januari)
  fillPeriod: function(yearSel, monthSel) {
    var now = new Date(), y = now.getFullYear(), years = [];
    for (var i = Math.min(2026, y); i <= Math.max(2026, y); i++) years.push(i);
    yearSel.innerHTML = years.map(function(v) { return '<option value="' + v + '"' + (v === y ? ' selected' : '') + '>' + v + '</option>'; }).join('');
    var self = this;
    monthSel.innerHTML = Array.from({ length: 12 }, function(_, i) { return '<option value="' + (i + 1) + '"' + (i === now.getMonth() ? ' selected' : '') + '>s/d ' + self.monthName(i + 1) + '</option>'; }).join('');
  },
  periodEnd: function(yearSel, monthSel) { return this.monthEnd(Number(yearSel.value), Number(monthSel.value)); },
  periodText: function(to) {
    var m = Number(to.substr(5, 2)), y = to.substr(0, 4);
    return 'Periode Januari' + (m > 1 ? ' – ' + this.monthName(m) : '') + ' ' + y + ' (s/d ' + formatDate(to) + ')';
  },

  download: function(filename, text, mime) {
    var blob = new Blob([text], { type: mime || 'application/xml;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1000);
  }
};
