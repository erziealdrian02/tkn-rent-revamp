# laravel-kit — Prototype HTML → Laravel Blade

Kit ini memindahkan 71 halaman prototype (yang sekarang semua ada di root) ke struktur Laravel yang rapi per modul, cukup dengan **satu perintah**. Prototype aslinya tidak diubah.

Ini adalah **Tahap 2 (slicing UI)** di `md_ai/laravel_phase_2_ui_integration.md`. Hasilnya tampil 100% sama dengan prototype karena JS prototype masih dipakai apa adanya. Data dinamis dari database dikerjakan di tahap berikutnya.

## Isi folder

| File | Fungsi |
|---|---|
| `page-map.json` | **Skema halaman**: HTML → view Blade (folder) → URI → nama route, grup menu, layout, modul hak akses |
| `convert.php` | Executor: membaca skema, lalu menulis view, layout, route & aset ke project Laravel |
| `stubs/layouts/app.blade.php` | Kerangka utama (head, sidebar, header, `@yield('content')`, `@stack('scripts')`) |
| `stubs/components/sidebar.blade.php`, `header.blade.php` | Komponen sidebar & header |

Folder ini boleh ditaruh di mana saja. Kalau dipindah keluar dari repo prototype, tambahkan `--from=<folder prototype>`.

## Cara pakai

```bash
# 1. Lihat dulu peta halamannya
php laravel-kit/convert.php --list

# 2. Simulasi tanpa menulis file
php laravel-kit/convert.php --to=../equiprent-laravel --dry-run

# 3. Eksekusi + daftarkan route di routes/web.php
php laravel-kit/convert.php --to=../equiprent-laravel --register

# 4. Jalankan
cd ../equiprent-laravel && php artisan serve    # buka http://127.0.0.1:8000/login
```

Opsi lain: `--from=<folder prototype>` (default: folder induk `laravel-kit`), `--force` (timpa view/layout yang sudah ada), `--help`.

Aman dijalankan ulang. Tanpa `--force`, view & layout yang sudah diedit di Laravel **tidak ditimpa**. Yang selalu diperbarui hanya `public/assets/**` dan `routes/prototype.php`.

## Hasil di project Laravel

```
public/assets/                      ← css, js, images dari prototype
routes/prototype.php                ← Route::view per halaman (otomatis dari page-map.json)
routes/web.php                      ← + require __DIR__.'/prototype.php';  (dengan --register)
resources/views/
├── layouts/app.blade.php
├── components/{sidebar,header}.blade.php
├── home.blade.php                  auth/login.blade.php        dashboard/index.blade.php
├── customers/{index,show}          projects/{index,create,show}
├── rentals/{index,create,show}     sales/{index,create,show}   claims/{index,show}
├── receivables/{approvals,billing,payments,report}             receivables/invoices/{index,show,shadow}
├── deliveries/{index,show}         returns/{index,show}
├── stock/{index,mutations,transfer,project,report}
├── equipment/{index,show}          branches/{index,show}       movements/{index,show}
├── purchasing/{requests,vendors,report,payables}               purchasing/orders/{index,create,show}
├── purchasing/goods-receipts/{index,show}
├── master/{drivers,vehicles}/{index,show}                      master/accounts/index
├── finance/{cash-bank-ledger,cash-report,bank-reconciliation}
├── accounting/{coa,journal,general-ledger,worksheet,adjustments,profit-loss,balance-sheet}
├── tax/{ppn,pph23}
├── admin/edit-requests             admin/users/index           admin/roles/{index,create}
└── driver/dashboard                driver/deliveries/{index,show}
```

Peta lengkap per halaman: `php laravel-kit/convert.php --list`.

## Yang dilakukan convert.php per halaman

- Mengambil isi `<div class="app-content">` → `@section('content')`, modal → `@section('modals')`, semua `<script>` (urutan sama seperti di prototype) → `@push('scripts')`, dan `<style>` tambahan di head → `@push('head')`.
- `login`, `index` (redirect awal) dan `stock-transfer` (redirect) dikonversi utuh tanpa layout (`"layout": "standalone"`).
- Path `assets/...` diganti `{{ asset('assets/...') }}`.
- Link `xxx.html` (di HTML, JS halaman, dan `public/assets/js/*.js`) diganti `xxx`. URL lama `/xxx.html` tetap jalan karena di-redirect ke `/xxx`.
- Teks yang kebetulan mirip sintaks Blade (`{{`, `@if`, dst.) di-escape supaya tidak dieksekusi Blade.
- Ada peringatan bila ada file HTML yang belum terdaftar di skema, atau ada kerangka halaman yang tidak standar.

## Aturan mengubah skema (`page-map.json`)

- **Pindah folder / ganti nama view** → ubah `"view"` (mis. `"finance.billing"` → `resources/views/finance/billing.blade.php`). Aman.
- **Ganti nama route** → ubah `"route"`. Aman.
- **Jangan ubah `"uri"` dulu.** `assets/js/app.js` (hak akses & menu aktif) mengenali halaman dari segmen URL terakhir yang sama dengan nama file. URI baru bisa dirapikan (mis. `/accounting/coa`) setelah sidebar & hak akses pindah ke Blade/middleware.
- **Halaman baru di prototype** → tambahkan entri di grup yang sesuai, lalu jalankan ulang.
- `"permission"` = modul hak akses dari prototype (`PAGE_MODULE` di `app.js`), untuk acuan middleware / `@can` nanti.

## Sudah diuji

Di project Laravel 13 baru: halaman terkonversi, `php artisan view:cache` sukses, dan semua halaman dibuka di browser sebagai Super Admin, Finance & Driver tanpa error JS. Tampilannya identik dengan prototype, dan hak akses per role tetap berjalan.

## Tahap berikutnya (di luar kit ini)

1. Pindahkan menu sidebar dari `app.js` ke `components/sidebar.blade.php` dan pakai `route()`. Setelah itu URI boleh dikelompokkan.
2. Ganti `Route::view` dengan controller per modul. Nama route sudah siap dipakai.
3. Ganti render tabel dari `mock-data.js` dengan `@foreach` data database (lihat `md_ai/laravel_phase_3…6`).
