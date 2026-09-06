# EquipRent Enterprise - Laravel Implementation (Phase 3)
**Tahap 3: Master Data, CRUD, & Sistem Inventaris (StockService)**

## 1. Tujuan Fase Ini
Menghidupkan fungsi sistem dasar dengan membuat aplikasi mampu menyimpan, membaca, memperbarui, dan menghapus (CRUD) Master Data, serta membangun kelas *Service* khusus untuk manajemen stok alat berat yang konsisten.

## 2. Langkah Pengerjaan (Step-by-Step)

### Step 2.1: Pembuatan CRUD Master Data
Buat *Controller* standar (lengkap dengan *Form Requests* untuk validasi data) untuk entitas berikut:
- **Pelanggan (`CustomerController`)**: CRUD tabel `ms_customers` dan manajemen Proyek (`ms_projects`).
- **Logistik (`VehicleController` & `DriverController`)**: Mengelola data supir (`ms_drivers`) yang terikat ke `ms_users`, serta armada kendaraan (`ms_vehicles`).
- **Gudang (`BranchController`)**: Manajemen cabang (`ms_branches`).

### Step 2.2: Modul Manajemen Alat Berat
- **`EquipmentController`**: Mengelola daftar jenis alat (`ms_equipment`), termasuk pengaturan tarif sewa (`daily_rate`) dan nilai penggantian barang jika hilang (`replacement_value`).
- Halaman antarmuka (View) harus mengambil daftar ini menggunakan metode `Eloquent::all()` (atau *pagination*) dan menampilkannya dalam perulangan Blade.

### Step 2.3: Pembangunan `StockService` (Sangat Kritis)
Alur pergerakan stok sangat kompleks (melibatkan kolom `available_qty`, `reserved_qty`, `on_rental_qty`, dll). **Jangan menulis logika stok di dalam Controller.**
- Buat sebuah file khusus: `app/Services/StockService.php`.
- Buat fungsi mutasi standar:
  - `stockIn(equipmentId, branchId, quantity, type)`
  - `stockOut(equipmentId, branchId, quantity, type)`
  - `reserveStock(equipmentId, branchId, quantity)`
  - `releaseReservation(equipmentId, branchId, quantity)`
  - `moveToMaintenance(equipmentId, branchId, quantity)`
  - `moveToDamaged(equipmentId, branchId, quantity)`
- **Pencatatan Jejak (Audit Trail):** Di setiap fungsi mutasi di atas, *Service* wajib menyisipkan catatan baru ke dalam tabel `log_inventory_movements`. Hal ini menjamin bahwa tidak ada stok yang berpindah secara "gaib" tanpa rekam jejak.

### Step 2.4: Antarmuka Stok Real-Time
Implementasikan halaman `stock.blade.php`. Halaman ini harus menampilkan rekap dari tabel `ms_equipment_stock` dengan akurat (Stok Total, Tersedia, Disewa, Rusak, dll), tanpa harus menggunakan perintah `SUM()` yang membebani kinerja *database*.

## 3. Kriteria Penyelesaian (Definition of Done)
Fase 3 dinyatakan selesai apabila:
1. Administrator dapat menambahkan Pelanggan, Proyek, Cabang, dan Alat Berat baru melalui antarmuka web dan data tersimpan dengan benar di *database*.
2. Fungsi perpindahan stok awal (seperti transfer barang antar cabang melalui `rnt_stock_transfers`) berfungsi dengan baik, memanggil `StockService`, serta memperbarui kolom ketersediaan dan membuat entri *log movement*.
