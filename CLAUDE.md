# EquipRent Enterprise (tkn-rent-revamp)

ERP penyewaan alat: stok multi-gudang, pengiriman ke proyek (SJ), pemulangan, klaim, dan piutang.

Panduan Laravel Boost (konvensi PHP/Laravel, tools MCP, testing, Pint) ada di AGENTS.md dan wajib diikuti:

@AGENTS.md

> Boost sudah terpasang (`vendor/laravel/boost`, `boost.json`). Guideline saat ini di-generate untuk agent lain. Untuk men-generate ulang khusus Claude Code, jalankan `php artisan boost:install` lalu pilih Claude Code. Boost hanya mengganti blok `<laravel-boost-guidelines>`; isi file ini di luar blok tetap aman.

## Struktur repo

| Lokasi | Isi |
|---|---|
| `app/Models`, `database/migrations` | Laravel 13 / PHP 8.5. Model & migration awal sudah ada; controller, service, dan view belum ada. |
| `equiprent-enterprise/` | **Prototype HTML/JS = spesifikasi.** UI (Bootstrap 5) + logika bisnis + data dummy di localStorage. Saat porting, halaman `.html` menjadi Blade. |
| `equiprent-enterprise/assets/js/business-logic.js` | **Sumber aturan bisnis** (`BizLogic.*`). Port 1:1 ke Service class Laravel. |
| `equiprent-enterprise/assets/js/mock-data.js` | Data seed yang konsisten → jadikan Seeder. |
| `equiprent-enterprise/md_ai/` | Rencana migrasi lama. Sebagian **sudah usang**; jika berbeda, dokumen ini yang berlaku. |

## Glosarium

- **Gudang**: cabang/warehouse (`ms_branches`). Urutan rekap: A. Balikpapan, B. Bekasi, C. Cileungsi.
- **Proyek**: lokasi sewa milik customer. Punya **kebutuhan alat** (qty + harga satuan per bulan).
- **SJ / Surat Jalan**: dokumen fisik perpindahan. `SJK` = SJ kirim ke proyek, `SJR` = SJ pulang dari proyek.
- **Saldo Awal**, **Transit** (antar gudang), **Afkir** (alat dihapus/tidak bisa diperbaiki).
- **Bulan Sewa**: pembagi harga satuan bulanan menjadi harian (template 30).
- **Piutang**: total invoice − total pembayaran. **Cicilan**: bayar sebagian; **Lunas**: sisa tagihan menjadi 0.

## Aturan bisnis

### 1. Rekap Stok — ledger perpindahan stok

Qty **hanya** berubah lewat dokumen perpindahan (`BizLogic.StockLedger.post`). Dokumen ini adalah satu-satunya sumber kebenaran qty.

| Type | Label | Dari → Ke | Efek | Prefix no. |
|---|---|---|---|---|
| OPENING | Saldo Awal | – → gudang | + gudang | SA |
| PURCHASE | A. Pembelian / Produksi | supplier/produksi → gudang | + gudang | PB |
| TRANSFER | B. Transit Antar Gudang | gudang → gudang | − asal, + tujuan | TG |
| DELIVERY | C. Pengiriman ke Proyek | gudang → proyek | − gudang, + proyek | SJK |
| RETURN | D. Pemulangan dari Proyek | proyek → gudang | + gudang, − proyek | SJR |
| SALE | E. Penjualan ke Customer | gudang → customer | − gudang | PJ |
| LOST | Hilang di Proyek | proyek → hilang | − proyek | HL |
| DISPOSAL | Afkir | gudang → afkir | − gudang | AF |

- Nomor dokumen: `PREFIX-YYMM-NNN`, berurut per prefix per bulan (contoh `SJK-2610-001`).
- Stok gudang = Σ masuk − Σ keluar per gudang. Stok proyek = Σ SJK − Σ SJR − Σ hilang. **Laporan Stok = stok gudang + stok proyek.** Barang yang terjual, hilang, atau diafkir tidak dihitung lagi.
- Kondisi di gudang (`available`, `reserved`, `damaged`, `maintenance`) adalah rincian dari stok fisik gudang. Invariant: `total = available + reserved + damaged + maintenance` = saldo ledger gudang itu.
- Perawatan & perbaikan hanya memindah kondisi (total tetap). Reservasi rental: `available → reserved`.
- Validasi: barang keluar gudang ≤ stok tersedia (pengiriman dari rental boleh memakai yang `reserved` dulu); barang keluar proyek ≤ stok di lokasi proyek; gudang asal ≠ tujuan. Validasi seluruh baris dilakukan **sebelum** ada yang diposting.
- Alur yang otomatis memposting ke ledger: pengiriman berstatus Completed → DELIVERY; inspeksi return → RETURN (barang rusak masuk kondisi `damaged`) + LOST (hilang/missing); goods receipt → PURCHASE; transfer → TRANSFER; perbaikan gagal (unrepairable) → DISPOSAL; registrasi alat baru → OPENING.
- Stok Proyek per alat: A. Kebutuhan, B. Terkirim (rincian per SJ), C. Sisa = A − B, D. Dipulangkan (rincian per SJ), Di Lokasi = B − D − hilang.

### 2. Piutang

**Rekapitulasi tagihan** (`BizLogic.Billing`), per proyek per periode:
1. Pasangkan SJ kirim dengan SJ pulang/hilang secara **FIFO** per alat: unit yang dikirim duluan dianggap pulang duluan. Hasilnya segmen `{qty, awal = tgl SJK, akhir = tgl SJR | null}`.
2. Potong segmen ke periode tagihan. Alat yang belum pulang memakai akhir = akhir periode, dan tanggal ini **boleh di-adjust** user (dibatasi antara awal dan akhir periode).
3. `Hari = Akhir − Awal + 1` (inklusif); `Total = Qty × Hari × Harga Satuan ÷ Bulan Sewa`. Pembulatan rupiah dilakukan per baris.
4. Harga satuan diambil dari kebutuhan alat proyek; fallback ke tarif alat.
5. Periode tidak boleh bertabrakan dengan invoice Sewa lain di proyek yang sama. Periode default = hari setelah tagihan terakhir s/d akhir bulan tersebut.

**Invoice**: tipe `Sewa` (dari rekap) atau `Klaim` (dari claim). `amount` = subtotal + PPN (default 11%). Jatuh tempo default 30 hari.

**Pembayaran**: setiap pembayaran adalah baris tersendiri (`Cicilan`/`Lunas`) dan tidak boleh melebihi sisa tagihan. Sisa tagihan = `amount − Σ pembayaran`. Status tersimpan: Issued / Partially Paid / Paid / Cancelled; **Overdue dihitung** saat ditampilkan (jatuh tempo < hari ini dan belum lunas). Setiap pembayaran juga membuat jurnal masuk (IN) di buku bank. Invoice yang sudah ada pembayarannya tidak bisa dibatalkan.

**Laporan Piutang**: per customer = total invoice − total pembayaran (bisa dihitung per tanggal tertentu). Umur piutang dihitung dari jatuh tempo: belum JT, 1–30, 31–60, 61–90, > 90 hari.

Setting di `MockData.settings` → pindahkan ke `config/equiprent.php`: `billing_month_days=30`, `tax_rate=0.11`, `payment_term_days=30`.

## Pemetaan ke Laravel

Konvensi skema yang sudah ada: prefix `ms_` (master), `rnt_` (header transaksi), `rl_` (detail/relasi), `log_` (log). PK UUID (`HasUuids`, `$keyType='string'`, `$incrementing=false`). Status disimpan sebagai string UPPERCASE (prototype memakai Title Case, jadi perlu dipetakan).

Yang **belum ada** di migration dan perlu dibuat (migration baru, jangan edit yang lama):

| Kebutuhan | Usulan |
|---|---|
| Ledger stok | `rnt_stock_mutations` (`number` unique, `type`, `mutation_date`, `from_type`, `from_id` nullable, `from_name` nullable, `to_type`, `to_id`, `to_name`, `reference`, `notes`, `created_by`) + `rl_stock_mutation_items` (`stock_mutation_id`, `equipment_id`, `qty`, `condition` nullable, `unit_price` nullable). `from/to_type` ∈ warehouse, project, customer, supplier, production, opening, lost, disposed. |
| Kebutuhan alat proyek | `ms_project_requirements` (`project_id`, `equipment_id`, `qty`, `unit_price` per bulan; unique project+equipment) |
| Proyek | `ms_projects` + `start_date`, `end_date` |
| Gudang | `ms_branches` + `code`, `capacity` |
| Nomor SJ | `rnt_deliveries.sj_number`, `rnt_returns.sj_number` (sama dengan `rnt_stock_mutations.number`) |
| Invoice sewa | `rnt_invoices` + `project_id`, `period_start`, `period_end`, `month_days`, `subtotal`, `tax_rate`, `tax_amount`, `company_account_id`, `notes`; `paid_amount` dijadikan cache yang disinkronkan dari pembayaran |
| Baris invoice | `rl_invoice_items` + `equipment_id` nullable, `qty`, `unit_price`, `start_date`, `end_date`, `days`, `sj_delivery_number`, `sj_return_number`, `is_adjusted` |
| Pembayaran | `rnt_payments` + `kind` (CICILAN/LUNAS), `notes`, `created_by` |

Catatan skema lama:
- `ms_equipment_stock.on_rental_qty`, `lost_qty`, `missing_qty` sudah usang, karena stok proyek dan hilang kini dihitung dari ledger. Kolom yang dipakai: `total_qty`, `available_qty`, `reserved_qty`, `damaged_qty`, `maintenance_qty`.
- `log_inventory_movements` hanya log audit, **bukan** sumber qty.
- `ms_equipment.daily_rate`: prototype memakai harga **per bulan** (lihat rumus). Perlakukan sebagai tarif default bulanan atau rename melalui migration baru.

Usulan Service (port dari `business-logic.js`, letakkan di `app/Services`; minta persetujuan karena ini folder baru):
- `StockLedgerService::post()`: `DB::transaction` + `lockForUpdate` pada baris `ms_equipment_stock`; validasi dulu, baru tulis mutasi + item + update kondisi gudang.
- `BillingService::recap(Project, from, to, monthDays, endOverrides)`, `InvoiceService::createFromRecap()` / `createForClaim()`, `PaymentService::record()` (sekaligus menulis `log_general_ledger` IN).
- Enum `StockMutationType` (key TitleCase, sesuai AGENTS.md). Tes feature wajib mencakup: invariant total kondisi = saldo ledger; validasi stok kurang/gudang sama; FIFO kirim–pulang; contoh rumus 01/10–30/10 = 30 hari; anti-tumpang-tindih periode; pembayaran melebihi sisa ditolak.

## Konvensi prototype (`equiprent-enterprise/`)

- Jangan mengubah `MockData.stock` atau qty langsung dari halaman; selalu lewat `BizLogic.*`.
- Setiap struktur seed di `mock-data.js` berubah, naikkan `MOCK_SCHEMA_VERSION` (localStorage pengguna akan di-reset).
- Halaman yang memakai `BizLogic` wajib memuat `assets/js/business-logic.js` sebelum `app.js`.
- Menu sidebar ada di dua tempat di `app.js` (`renderSidebar` dan `renderSidebarI18n`) + key di `i18n.js` (id & en).
- Verifikasi: logika bisa diuji dengan Node (load `mock-data.js` + `business-logic.js` di `vm` dengan stub localStorage/sessionStorage); halaman bisa dicek dengan Chrome headless (tersedia di mesin dev).
