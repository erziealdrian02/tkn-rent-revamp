# EquipRent Enterprise - Laravel Implementation (Phase 5)
**Tahap 5: Manajemen Pengembalian Alat, Inspeksi Kondisi, Servis & Sistem Klaim**

## 1. Tujuan Fase Ini
Menangani skenario di mana pelanggan mengembalikan alat berat. Modul ini merupakan bagian paling kritis secara fungsional karena harus bisa mendeteksi otomatis terjadinya kerusakan (Damage) atau kehilangan alat (Loss), lalu memicu tiket perbaikan (Repairs) dan tagihan ganti rugi (Claims).

## 2. Langkah Pengerjaan (Step-by-Step)

### Step 2.1: Modul Inspeksi Gudang (Return Form)
Buat halaman pengembalian di mana staf gudang memvalidasi kondisi fisik barang yang kembali. Data akan disimpan di `rnt_returns` dan rincian kuantitas setiap kondisi alat (`qty_good`, `qty_damaged`, `qty_missing`, `qty_lost`) di `rl_return_items`.

### Step 2.2: Logika Auto-Trigger (Sangat Kritis)
Di dalam *Controller* atau *Service* pengembalian, buat logika bercabang berdasarkan *input* staf gudang tadi:
- **Kondisi Baik (`qty_good`)**: Panggil `StockService` untuk mengurangi stok `on_rental_qty` dan menambah stok `available_qty`. Transaksi ini selesai dengan mulus.
- **Kondisi Rusak (`qty_damaged`)**: 
  1. Kurangi `on_rental_qty`, lalu tambahkan ke `damaged_qty`.
  2. *Auto-Generate* baris baru di tabel tiket servis (`rnt_repairs`) dengan status "Pending".
  3. *Auto-Generate* baris baru di tabel draf tagihan ganti rugi (`rnt_claims`) berjenis "Damage".
- **Kondisi Hilang (`qty_missing` atau `qty_lost`)**:
  1. Kurangi `on_rental_qty`, lalu tambahkan ke `missing_qty`.
  2. *Auto-Generate* draf tagihan ganti rugi (`rnt_claims`) berjenis "Missing/Lost". Total tagihan ganti rugi dihitung otomatis dari kolom `replacement_value` di tabel master `ms_equipment`.

### Step 2.3: Modul Servis & Reparasi (Repair & Maintenance)
- Buat halaman di mana mekanik dapat mengubah status di tabel `rnt_repairs` (misal dari "In Repair" menjadi "Fixed").
- Saat status "Fixed" ditekan, panggil `StockService` untuk mengurangi stok di kolom `damaged_qty` dan mengembalikannya ke `available_qty` agar alat tersebut dapat disewakan kembali.
- Hal ini juga berlaku untuk alat berat yang tidak disewa namun ditarik untuk inspeksi berkala (`rnt_maintenance`).

### Step 2.4: Persetujuan Klaim Ganti Rugi
Halaman ini (`claims.blade.php`) digunakan oleh pihak Manajemen dan Keuangan untuk melihat draf ganti rugi (berdasarkan *auto-trigger* sebelumnya).
- Jika pelanggan setuju untuk membayar denda atau biaya ganti rugi, tombol "Approve Claim" ditekan.
- *Trigger:* Sistem otomatis merilis data ini menjadi Faktur Tagihan nyata di tabel `rnt_invoices`.

## 3. Kriteria Penyelesaian (Definition of Done)
Fase 5 dinyatakan selesai apabila:
1. Skema pengembalian parsial maupun pengembalian tidak utuh (rusak/hilang) dapat ditangani sistem dengan baik, dan langsung mengubah angka ketersediaan di tabel `ms_equipment_stock`.
2. Semua alat yang terdeteksi rusak saat pengembalian akan secara konsisten muncul di antrean kerja mekanik (`rnt_repairs`) dan panel tagihan denda (`rnt_claims`) tanpa staf harus mengetiknya ulang secara manual.
3. Mekanik mampu mengubah status perbaikan barang sehingga status stok barang kembali "Tersedia" di gudang.
