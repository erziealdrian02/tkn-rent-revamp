# EquipRent Enterprise - Laravel Implementation (Phase 4)
**Tahap 4: Mesin Transaksi Sewa & Modul Logistik (Pengiriman)**

## 1. Tujuan Fase Ini
Mengimplementasikan siklus bisnis utama: pembuatan kontrak penyewaan alat berat ke proyek pelanggan dan pelacakan pengiriman alat ke lokasi proyek melalui Portal Supir.

## 2. Langkah Pengerjaan (Step-by-Step)

### Step 2.1: Rental Service & Pembuatan Kontrak
Buat `app/Services/RentalService.php` dan `RentalController.php`.
- **Create**: Pengguna membuat draf sewa. Data akan direkam di tabel `rnt_rentals` dan detail peralatannya di `rl_rental_items`. Status saat ini = "Pending Approval".
- **Approval**: Ketika manajer menyetujui (*Approve*) sewa tersebut:
  1. Ubah status rental menjadi "Approved".
  2. Panggil `StockService::reserveStock()` untuk memotong stok `available` dan memindahkannya ke `reserved`. Ini mencegah alat yang sama disewa oleh orang lain.
- **Cancellation**: Jika dibatalkan sebelum jalan, panggil `StockService::releaseReservation()`.

### Step 2.2: Modul Pengiriman (Delivery Logistics)
Alur pengiriman dipisahkan dari penyewaan untuk memudahkan skenario pengiriman parsial (dikirim sebagian) atau perubahan supir.
- **Pembuatan Surat Jalan**: Buat entri di `rnt_deliveries` yang merujuk pada `rental_id`. Tentukan armada kendaraan (`vehicle_id`) dan supir (`driver_id`). Masukkan detail barang yang akan dimuat ke tabel `rl_delivery_items`. Status = "Preparing".
- **Dispatch**: Gudang menekan tombol "Depart". Status pengiriman berubah menjadi "On Delivery".

### Step 2.3: Driver Portal (Akses Khusus Supir)
- Terapkan validasi `middleware` sehingga pengguna dengan peran (Role) "Driver" hanya dapat mengakses halaman `driver-deliveries.blade.php`.
- Saat berada di proyek pelanggan, supir menekan tombol **"Arrive & Capture PoD (Proof of Delivery)"**.
- Sistem harus:
  1. Mengunggah/Menyimpan tanda tangan elektronik atau foto bukti.
  2. Mengubah status `rnt_deliveries` menjadi "Completed".
  3. Mengubah status `rnt_rentals` menjadi "On Rental".
  4. Panggil `StockService::stockOut()` untuk mengurangi stok `reserved_qty` dan menambah `on_rental_qty`. (Catat juga hal ini di *inventory movement log*).

## 3. Kriteria Penyelesaian (Definition of Done)
Fase 4 dinyatakan selesai apabila:
1. Kontrak sewa dapat dibuat, disetujui, dan secara akurat "mengkarantina/reservasi" ketersediaan stok alat di gudang.
2. Surat jalan pengiriman dapat dibuat dan ditugaskan ke akun Supir.
3. Supir dapat *login* dari layar ponsel mereka, menyelesaikan pengiriman, dan sistem berhasil memperbarui status alat menjadi sedang disewakan (On Rental).
