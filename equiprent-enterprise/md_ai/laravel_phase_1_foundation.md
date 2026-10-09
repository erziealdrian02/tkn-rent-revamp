# EquipRent Enterprise - Laravel Implementation (Phase 1)
**Tahap 1: Fondasi, Database, dan Sistem RBAC Dinamis**

## 1. Tujuan Fase Ini
Fase ini bertujuan untuk mempersiapkan kerangka aplikasi Laravel, mengonfigurasi koneksi database, membuat seluruh struktur tabel (Migrations), dan membangun sistem autentikasi serta *Dynamic Role-Based Access Control* (RBAC) tanpa tampilan antarmuka (UI) yang kompleks terlebih dahulu.

## 2. Langkah Pengerjaan (Step-by-Step)

### Step 2.1: Instalasi & Konfigurasi Lingkungan
- Buat proyek Laravel baru (`laravel new equiprent`).
- Konfigurasikan file `.env` dengan kredensial database (MySQL/PostgreSQL).
- Atur konstanta sistem dasar (timezone ke `Asia/Jakarta`).

### Step 2.2: Implementasi Database Migrations
Tulis file `Migration` untuk membuat tabel. **PENTING: Jangan gunakan penamaan default Laravel.** Gunakan konvensi penamaan yang telah disepakati:
1. **Master Data (`ms_`)**: `ms_users`, `ms_roles`, `ms_permissions`, `ms_customers`, `ms_projects`, `ms_branches`, `ms_equipment`, `ms_equipment_stock`, `ms_drivers`, `ms_vehicles`, `ms_company_accounts`.
2. **Junction/Relations (`rl_`)**: `rl_user_roles`, `rl_role_permissions`, `rl_rental_items`, dll.
3. **Transactions (`rnt_`)**: `rnt_rentals`, `rnt_deliveries`, `rnt_returns`, `rnt_claims`, `rnt_invoices`, dll.
4. **Logs/History (`log_`)**: `log_inventory_movements`, `log_general_ledger`.

*Aturan Relasi:*
- Pastikan semua tabel relasi (`rl_`) memiliki `ON DELETE CASCADE` untuk tabel *child*, tetapi berhati-hatilah agar tidak menghapus transaksi historis (`rnt_`) jika data master dihapus (gunakan pendekatan `Soft Deletes` pada tabel master).
- Tambahkan `UNIQUE(user_id, role_id)` pada tabel `rl_user_roles` dan constraint serupa pada tabel relasi lainnya.

### Step 2.3: Pembuatan Eloquent Models
Buat *Model* untuk setiap tabel dengan menentukan nama tabel secara eksplisit (contoh: `protected $table = 'ms_users';`). 
Tuliskan relasi antar *Model*:
- `User` memiliki banyak `Role` (`belongsToMany`).
- `Role` memiliki banyak `Permission` (`belongsToMany`).

### Step 2.4: Database Seeder
Sistem tidak dapat berjalan tanpa data awal (Master Data). Buat seeder untuk:
- Mengisi tabel `ms_roles` (misal: "Super Admin", "Gudang", "Supir", "Finance").
- Mengisi tabel `ms_permissions` (misal: `rental.create`, `invoice.view`).
- Mengaitkan hak akses Super Admin ke semua *permission*.
- Membuat 1 akun User awal (misal `admin`) dan mengaitkannya dengan Role "Super Admin".
- Menambahkan beberapa data dummy untuk Cabang, Rekening Bank, dan Alat Berat.

### Step 2.5: Sistem Autentikasi (Breeze/Jetstream) & Middleware
- Pasang modul *Auth* standar Laravel.
- Buat *Middleware* khusus (contoh: `CheckPermission`) yang bertugas mencegat *request*.
- *Middleware* ini harus mengecek: Apakah `Auth::user()` memiliki relasi ke `Role` yang memiliki relasi ke `Permission` spesifik (berdasarkan tabel `ms_permissions`)? **Jangan menggunakan pengecekan string statis seperti `if(role == 'admin')`.**

## 3. Kriteria Penyelesaian (Definition of Done)
Fase 1 dinyatakan selesai apabila:
1. Perintah `php artisan migrate --seed` berhasil dijalankan tanpa *error*.
2. Semua tabel terbentuk di dalam *database* dengan relasi *Foreign Key* yang benar.
3. Fitur *Login* bawaan Laravel berfungsi, dan *Middleware* keamanan mampu menolak akses jika pengguna tidak memiliki *Permission* yang sesuai di dalam tabel *database*.
