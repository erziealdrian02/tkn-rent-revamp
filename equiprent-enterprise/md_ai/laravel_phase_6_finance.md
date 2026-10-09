# EquipRent Enterprise - Laravel Implementation (Phase 6)
**Tahap 6: Pembelian Logistik, Siklus Keuangan & Finalisasi Dashboard**

## 1. Tujuan Fase Ini
Menyelesaikan siklus bisnis ujung-ke-ujung (End-to-End) dengan mengelola pengadaan alat baru (Purchasing), pencetakan tagihan (Invoicing), penerimaan uang kas perusahaan (General Ledger), dan menyinkronkan seluruh data tersebut ke *Dashboard* pimpinan secara aktual (*real-time*).

## 2. Langkah Pengerjaan (Step-by-Step)

### Step 2.1: Modul Pembelian (Purchasing) & Penerimaan Barang
Perusahaan rental pasti akan membeli alat baru.
- Buat halaman `Purchase Order` (PO) dan simpan transaksinya di `rnt_purchases`. 
- Ingat, pembuatan PO **TIDAK BOLEH** menambah stok gudang.
- Buat alur `Goods Receipt` (`rnt_goods_receipts`) yang terikat dengan nomor PO. Staf gudang mengecek barang fisik yang tiba dari vendor.
- **Auto-Trigger**: Saat form *Goods Receipt* disimpan, sistem memanggil `StockService::stockIn()` untuk benar-benar menambah stok fisik di tabel `ms_equipment_stock` dan membuat jejak audit (Stock In) di `log_inventory_movements`.

### Step 2.2: Modul Tagihan (Invoicing)
Sistem tagihan `rnt_invoices` memiliki dua pintu masuk sumber data:
1. **Invoice Sewa**: Dibangkitkan secara manual/otomatis setiap bulan atau saat awal kontrak ditandatangani (`rnt_rentals`).
2. **Invoice Klaim Denda**: Dibangkitkan otomatis setelah draf klaim (`rnt_claims`) disetujui akibat barang rusak atau hilang.
- Buat *Controller* untuk mencetak dokumen (PDF/Print view) berdasarkan relasi tabel ini.

### Step 2.3: Kas & Buku Besar (Bank Ledger)
- Buat antarmuka Perekaman Pembayaran (`rnt_payments`). Pengguna *Finance* memilih nomor tagihan (Invoice) dan mengetik nominal pembayaran. (Pastikan sistem mengakomodir cicilan / pembayaran parsial).
- **Auto-Trigger (The Ledger System)**: Saat pembayaran direkam, secara otomatis tulis *satu* baris transaksi masuk (*Money IN*) ke dalam tabel `log_general_ledger` pada akun bank perusahaan yang dipilih (`ms_company_accounts`).
- Sistem Buku Besar (`finance-ledger.blade.php`) hanya perlu me-*render* data dari tabel ini secara berurutan dan menjumlahkan (*Running Balance*) dari setiap transaksi masuk/keluar.

### Step 2.4: Pengecoran Data Dashboard (The Final Polish)
Ganti data statistik, *Chart.js*, dan grafik pada halaman `dashboard.blade.php` (yang pada Tahap 2 dibuat statis) menjadi angka aktual.
- Gunakan fitur *Laravel Eloquent Queries* seperti `count()`, `sum()`, dan klausa `where('status', 'Overdue')` untuk menghasilkan statistik langsung dari *database*.
- Buat rangkuman nilai stok (*Total Asset Value*) dan laporan kesehatan keuangan bisnis di atas Dashboard.

## 3. Kriteria Penyelesaian (Definition of Done)
Fase 6 dinyatakan selesai (dan aplikasi Laravel EquipRent Enterprise mencapai penyelesaian 100%) apabila:
1. Alat berat baru bisa dibeli dan ditambahkan ke inventaris melalui prosedur *Goods Receipt* secara terukur (tercatat di log).
2. Sistem keuangan mampu mengelola cicilan *Invoice* dan memetakan kas (*cashflow*) harian di laporan Buku Besar (Ledger) perusahaan secara seimbang.
3. *Dashboard* secara instan dan tanpa eror menyajikan visualisasi data yang diambil dari transaksi harian. Aplikasi sudah siap di *deploy* (Go-Live)!
