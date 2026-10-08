# EquipRent Enterprise - Laravel Implementation (Phase 2)
**Tahap 2: Slicing UI, Integrasi Blade & Frontend Migration**

## 1. Tujuan Fase Ini
Mengonversi seluruh prototipe berbasis *HTML/CSS/Vanilla JS* yang sudah disetujui klien ke dalam ekosistem **Laravel Blade Templates**.

## 2. Langkah Pengerjaan (Step-by-Step)

### Step 2.1: Migrasi Aset Statis
- Pindahkan seluruh isi folder `assets/` dari prototipe (termasuk CSS, gambar, dan ikon) ke dalam direktori `public/assets/` pada struktur proyek Laravel.
- Di dalam file HTML yang nanti dikonversi, perbarui semua path referensi (*link rel*, *script src*, *img src*) menggunakan *helper* Laravel: `{{ asset('assets/css/style.css') }}`.

### Step 2.2: Slicing Master Layout
Jangan biarkan kode HTML redundan (berulang) di setiap halaman. Pecah struktur HTML utama menjadi komponen Blade yang dapat digunakan kembali:
- Buat direktori `resources/views/layouts/`.
- Buat file `app.blade.php` sebagai kerangka utama.
- Pisahkan menu navigasi samping ke dalam `resources/views/components/sidebar.blade.php`.
- Pisahkan bilah atas ke dalam `resources/views/components/header.blade.php`.
- Gunakan `@yield('content')` untuk menyuntikkan isi halaman spesifik.

### Step 2.3: Konversi Halaman (Routing Base)
Pindahkan logika file `.html` menjadi rute dan tampilan Laravel:
1. `login.html` -> `resources/views/auth/login.blade.php`.
2. `dashboard.html` -> `resources/views/dashboard/index.blade.php`.
3. Tautkan semuanya melalui `routes/web.php` (sementara kembalikan view statis dulu, data dinamis dikerjakan di Tahap 3).

### Step 2.4: Mengganti Rendering JS Statis (Deprecation of MockData)
Pada prototipe asli, baris kode seperti tabel dirender menggunakan JavaScript statis (berbasis `MockData.js`). 
Di ekosistem Laravel:
- Matikan/hapus skrip yang merender tabel dari JS.
- Gunakan perulangan *Blade* (`@foreach($items as $item) ... @endforeach`) untuk merender HTML secara langsung di sisi server (Server-Side Rendering).

## 3. Kriteria Penyelesaian (Definition of Done)
Fase 2 dinyatakan selesai apabila:
1. Aplikasi dapat diakses via `php artisan serve` dengan antarmuka yang persis sama (100% *pixel perfect*) dengan prototipe HTML asli.
2. Semua tautan navigasi di *Sidebar* mengarah ke *Route* yang benar di Laravel.
3. Halaman dapat berpindah tanpa mengalami *broken layout* atau *broken image*.
