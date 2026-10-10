# Flow Aplikasi EquipRent (TKN Rent)

Dokumen ini menjelaskan alur aplikasi dari awal sampai akhir: halaman yang dibuka, tombol yang diklik, cabang kalau-begini-kalau-begitu (rusak, hilang, gagal kirim, stok kurang, dll.), sampai uang masuk & keluar di Buku Kas & Bank serta Laporan Kas.

Semua isi diambil dari kode prototype saat ini (`*.html` + `assets/js/business-logic.js`), bukan rencana.

> **Update catatan user (Okt 2026, batch 3)** — lihat [bagian 13](#13-rekap-project-jual-alat-di-proyek--kasir--jurnal--coa):
> menu **Penyewaan** sekarang bernama **Rekap Project**; PIC pelanggan jadi **PM**; fitur **Hilang** dihapus
> (alat hilang dipulangkan administratif lalu dijual); Buku Kas jadi form **kasir** → **Generate** (Accounting) → Jurnal → **COA per bulan** dengan pie chart.
> Diagram lama di bagian 2–4 & 9 masih memakai istilah lama; aturan di bagian 13 yang berlaku.
>
> **Update DATA TKN.xlsx (Okt 2026, batch 4)** — lihat [bagian 14](#14-data-tknxlsx-logistik-rekap-tagihan-rekap-stock--lapkeu):
> role **Ekspedisi & Driver dihapus**, digabung ke **Logistik** (termasuk kendaraan & pengemudi). Keterlambatan dari estimasi
> **dibebankan ke Logistik**, bukan customer. Semua penyebutan "Ekspedisi" / portal driver di diagram lama = Logistik.

## Cara melihat diagram

1. Buka **https://sequencediagram.org**
2. Hapus semua teks contoh di kotak sebelah kiri.
3. Pilih salah satu diagram di bawah. Copy **seluruh isi kotak abu-abu**-nya: dari baris `title ...` sampai baris terakhir di kotak itu.
4. Paste ke kotak kiri. Diagram muncul di kanan.
5. Untuk diagram lain, hapus lagi lalu paste kotak berikutnya. **Satu kotak = satu diagram**, jangan digabung.

Cara baca diagram:
- Panah tebal `→` = aksi / klik tombol; panah putus-putus = balasan / pesan error.
- Kotak **alt / else** = pilihan "kalau ... / kalau tidak ...".
- Kotak **opt** = langkah opsional.
- Kotak **loop** = diulang.
- Teks dalam tanda kutip, mis. `"Create Delivery"`, = label tombol persis seperti di layar.
- Teks **tebal** = status baru.

## Daftar Diagram

| No | Diagram | Isi singkat |
|---|---|---|
| 0 | [Gambaran Besar](#0-gambaran-besar) | Alur utuh dari customer sampai uang masuk |
| 1 | [Login, Pelanggan & Proyek](#1-login-pelanggan--proyek) | Login per role, tambah pelanggan, buat proyek + kebutuhan alat |
| 2 | [Penyewaan & Persetujuan](#2-penyewaan--persetujuan) | Buat sewa, submit, setujui / tolak / resubmit / batal |
| 3 | [Pengiriman](#3-pengiriman-sjk) | DLV, driver, serah terima, gagal kirim, SJK manual |
| 4 | [Pengembalian & Klaim](#4-pengembalian-inspeksi--klaim) | Inspeksi Baik / Rusak / Lost / Missing, klaim ke customer |
| 5 | ~~Perbaikan & Perawatan~~ | **Dihapus** (catatan user Okt 2026). Alat rusak tetap di stok "rusak" → "Sudah baik" di Stok Gudang / Afkir |
| 6 | [Rekap Tagihan & Invoice](#6-rekap-tagihan--invoice) | Hitung tagihan sewa, invoice bayangan, batal |
| 7 | [Pembayaran & Piutang](#7-pembayaran-piutang--arus-kas) | Cicilan / lunas, laporan piutang |
| 8 | [Pembelian & Stok](#8-pembelian--perpindahan-stok) | Alat baru, PO, penerimaan, perpindahan stok |
| 9 | [Kas & Bank](#9-kas--bank-laporan-kas--rekonsiliasi-bank) | Bon Biru / Bon Merah, pindah dana, Laporan Kas, Rekonsiliasi Bank |
| 10 | [Akuntansi & Pajak](#10-akuntansi--pajak) | COA, jurnal Laporan Kas, buku besar, kertas kerja, penyesuaian, laba rugi, neraca, PPN & PPh 23 (XML Coretax) |
| 11 | [Role, ACC Piutang, Penjualan, Ekspedisi & Permintaan Perubahan](#11-role-acc-piutang-penjualan-ekspedisi--permintaan-perubahan) | Alur terbaru dari catatan user Okt 2026 |
| 12 | [Purchasing](#12-purchasing-purchase-request-purchase-order-pembayaran-laporan) | Purchase Request, Purchase Order (term & tax), uang muka / pelunasan / tempo, laporan pembelian & hutang dagang |
| 13 | [Rekap Project, Jual Alat di Proyek & Kasir → Jurnal → COA](#13-rekap-project-jual-alat-di-proyek--kasir--jurnal--coa) | Catatan user batch 3: rekap per proyek + persentase, hapus Hilang, kasir, generate, kategori jurnal, COA bulanan |
| 14 | [DATA TKN.xlsx: Logistik, Rekap Tagihan, Rekap Stock & LAPKEU](#14-data-tknxlsx-logistik-rekap-tagihan-rekap-stock--lapkeu) | Gabung role ke Logistik, denda telat ke Logistik, format rekap tagihan (PO, DPP 11/12, PPN 12%), matriks rekap stock, nomor SJ, kode transaksi |

---

## Ringkasan alur (versi teks)

1. **Siapkan data**: Pelanggan → Proyek. Kebutuhan alat + **Harga Satuan per bulan** diisi di proyek, dan harga ini yang dipakai saat menagih.
2. **Penyewaan**: buat sewa → *Submit for Approval* → Manager *Setujui*. Stok gudang jadi **dipesan**.
3. **Pengiriman**: *Create Delivery* → Depart → Arrive → *Complete Handover (PoD)*. Stok pindah gudang → proyek (SJK). **Sewa mulai dihitung dari tanggal ini.**
4. **Tagihan**: tiap periode buka *Rekap Tagihan* → *Buat Invoice*.
5. **Pembayaran**: *Catat Pembayaran* (cicilan / lunas). Otomatis jadi **Bon Biru** (uang masuk) di Buku Kas & Bank.
   - Pengeluaran (bayar supplier, gaji, biaya operasional, dll.) dicatat sebagai **Bon Merah**; semuanya terangkum di **Laporan Kas** dan dicocokkan dengan rekening koran lewat **Rekonsiliasi Bank**.
6. **Pengembalian**: *Buat Pengembalian* → isi kondisi → *Complete Inspection*. **Sewa berhenti dihitung dari tanggal ini.**
   - Baik → stok tersedia lagi
   - Rusak → stok rusak + Perbaikan otomatis
   - Lost / Missing → dihapus dari stok (HL), bisa diklaim ke customer
7. **Klaim** (opsional): *Create Claim* → konfirmasi customer → *Generate Invoice* → dibayar.
8. Rekap & tagih periode terakhir. Semua barang kembali → Penyewaan **Completed**.

---

## 0. Gambaran Besar

Halaman: semua modul utama.

```
title 00 - Gambaran Besar: dari Customer sampai Uang Masuk

actor Admin
participant "Master Data\n(Pelanggan, Proyek)" as Master
participant "Penyewaan\n(rental-detail)" as Rental
participant "Pengiriman\n(delivery-detail)" as Kirim
participant "Stok\n(Gudang & Proyek)" as Stok
participant "Pengembalian\n(return-detail)" as Pulang
participant "Klaim & Perbaikan" as Klaim
participant "Tagihan\n(Rekap & Invoice)" as Tagihan
participant "Kas & Bank\n(Buku Kas & Bank)" as Kas

Admin->Master:1. "Tambah Pelanggan" lalu "New Project"\n(isi Kebutuhan Alat + **Harga Satuan**)  [file 01]
Admin->Rental:2. "Penyewaan Baru" → "Submit for Approval"  [file 02]
Rental->Stok:3. Manager klik "Setujui"\nstok gudang jadi **DIPESAN**
Admin->Kirim:4. "Create Delivery" → DLV + nomor SJK  [file 03]
Kirim->Stok:5. "Complete Handover (PoD)"\nposting SJK: gudang → proyek
note over Stok,Tagihan:Tanggal SJK = **MULAI** dihitung sewa

loop tiap periode (biasanya per bulan)
  Admin->Tagihan:6. Rekap Tagihan → "Buat Invoice"  [file 06]
  Tagihan->Kas:7. "Catat Pembayaran" (Cicilan / Lunas)\nBon Biru otomatis: uang **MASUK**  [file 07]
end

Admin->Pulang:8. "Buat Pengembalian" → isi Baik / Rusak / Lost / Missing\n→ "Complete Inspection"  [file 04]
Pulang->Stok:9. SJR (baik & rusak → gudang)\nHL (hilang → dihapus dari stok proyek)
note over Stok,Tagihan:Tanggal inspeksi = **BERHENTI** dihitung sewa

opt ada barang Rusak
  Pulang->Klaim:Perbaikan (REP) dibuat otomatis  [file 05]
end
opt Rusak / Hilang ditagihkan ke customer
  Pulang->Klaim:"Create Claim" → konfirmasi customer → "Generate Invoice"
  Klaim->Tagihan:Invoice tipe Klaim → dibayar seperti invoice biasa
end

Admin->Tagihan:10. Rekap periode terakhir → invoice → bayar
note over Rental:Semua barang kembali → status Penyewaan **Completed**

note over Master,Kas:Pembelian alat & perpindahan stok antar gudang ada di file 08.\nBon Biru / Bon Merah, Laporan Kas & Rekonsiliasi Bank ada di file 09.
```

---

## 1. Login, Pelanggan & Proyek

Halaman: `login.html` → `customers.html` → `projects.html` → `project-create.html` → `project-stock.html` / `project-detail.html`

```
title 01 - Login, Pelanggan & Proyek

actor User
participant "login.html" as Login
participant "customers.html" as Cust
participant "projects.html\nproject-create.html" as Proj
participant "project-stock.html\n(Stok Proyek)" as PS
database "Data\n(localStorage)" as DB

==LOGIN==
User->Login:isi Username & Password (semua demo password "demo")\natau pilih "Masuk sebagai (Demo)" → "Masuk"
alt username & password cocok
  Login->DB:simpan user yang login
  alt role Driver
    Login-->User:buka driver-dashboard.html (menu driver saja)
  else role lain (Super Admin, Admin, Rental, Warehouse, Finance, Manager)
    Login-->User:buka dashboard.html (menu sidebar sesuai hak akses role)
  end
else salah
  Login-->User:"Invalid credentials"
end
note over Login,DB:Hak akses mengikuti matriks di menu Peran (roles.html).\nMenu yang tidak boleh disembunyikan; buka URL langsung → dialihkan ke Dasbor\n+ pesan "Role Anda tidak punya akses". Tombol Setujui (Penyewaan, PO, Force Approve klaim)\nhanya untuk role yang punya hak Approve (Super Admin, Admin, Manager).

==PELANGGAN==
User->Cust:sidebar DATA MASTER → Pelanggan → "Tambah Pelanggan"
User->Cust:isi Nama Perusahaan*, Kode Perusahaan*, Nama PIC*, Nomor Telepon*,\nEmail, Alamat → "Simpan Pelanggan"
alt ada field wajib kosong
  Cust-->User:pesan merah, mis. "Nama perusahaan wajib diisi."
else valid
  Cust->DB:simpan CUS-xxx
  Cust-->User:"Customer berhasil ditambahkan."
end

==PROYEK==
User->Proj:sidebar PENYEWAAN → Proyek → "New Project"
User->Proj:isi Project Name*, Customer*, Start Date*, Target Completion, Status
loop tiap alat yang dibutuhkan
  User->Proj:"Tambah Alat" → Nama Alat, Qty, Harga Satuan
end
note right of Proj:Harga Satuan terisi otomatis dari tarif alat.\nHarga INI yang dipakai saat Rekap Tagihan.
User->Proj:"Create Project"
alt field wajib kosong
  Proj-->User:"Project name is required." / "Please select a customer."\n/ "Start date is required."
else alat yang sama diinput 2 kali
  Proj-->User:"Ada alat yang diinput lebih dari sekali di kebutuhan alat"
else valid
  Proj->DB:simpan PRJ-xxx + kebutuhan alat
  Proj-->User:"Project PRJ-xxx successfully created." → kembali ke projects.html
end

opt ubah kebutuhan alat nanti
  User->PS:Stok Proyek → pilih proyek → "Ubah Kebutuhan" → "Simpan Kebutuhan"
end
opt lihat progres proyek
  User->Proj:project-detail.html → tab "Kebutuhan & Stok Alat" → "Kelola Stok Proyek"
end
```

---

## 2. Penyewaan & Persetujuan

Halaman: `rentals.html` → `rental-create.html` → `rental-detail.html`

```
title 02 - Penyewaan (Rental) & Persetujuan

actor Admin
actor Manager
participant "rental-create.html" as RC
participant "rental-detail.html" as RD
participant "Sistem" as Sys
participant "Stok Gudang\n(tersedia / dipesan)" as Stok
database Data

==BUAT PENYEWAAN==
Admin->RC:sidebar Penyewaan → "Penyewaan Baru"
Admin->RC:Customer* (hanya yang aktif), Project* (milik customer tsb),\nRental Start Date, Expected Return Date, Branch (gudang)
loop tiap alat
  Admin->RC:"Tambah Alat Berat" → pilih alat, Qty, Duration
end
alt customer / project kosong
  RC-->Admin:"Please select a customer and project"
else tidak ada alat
  RC-->Admin:"Please add at least one item"
else klik "Save Draft"
  RC->Data:RNT-xxx status **Draft**
  opt diajukan nanti
    Admin->RD:rental-detail → "Ajukan Persetujuan" → **Pending Approval**
  end
else klik "Submit for Approval"
  RC->Sys:ajukan
  Sys->Data:status **Pending Approval**
  Sys->Data:notifikasi lonceng "Rental RNT-xxx is waiting for approval"
end
RC-->Admin:"Rental RNT-xxx saved!" → rentals.html

==PERSETUJUAN==
Manager->RD:buka dari notifikasi / daftar Penyewaan
note right of RD:Tombol Setujui / Tolak hanya muncul untuk role dengan hak Approve.\nRole lain melihat "Menunggu persetujuan Manager".
alt "Setujui" → "Approve"
  Sys->Stok:cek stok TERSEDIA di gudang (Branch) yang dipilih
  alt stok kurang
    Sys-->Manager:"Insufficient stock: <alat>: need X, only Y available"\n(status tetap Pending Approval)
  else stok cukup
    Sys->Stok:pesan stok (tersedia → dipesan)
    Sys->Data:status **Approved**
    Sys-->Manager:"Rental approved and stock reserved"
  end
else "Tolak" → isi Rejection Reason* → "Reject"
  Sys->Data:status **Rejected** + alasan
  opt diajukan ulang
    Admin->RD:"Resubmit" (data sama, belum bisa diedit)
    Sys->Data:status **Pending Approval** lagi
  end
end

==BATAL==
opt batal sebelum barang dikirim (status Draft / Pending Approval / Approved)
  Admin->RD:"Batal" → isi Cancellation Reason* → "Cancel Rental"
  opt tadinya sudah Approved
    Sys->Stok:lepas pesanan (dipesan → tersedia)
  end
  Sys->Data:status **Cancelled** (final)
end

==PERPANJANGAN SEWA==
opt customer minta tambah waktu (status Approved s/d Overdue)
  Admin->RD:"Perpanjang Sewa" → Tanggal Kembali Baru*, Alasan* → "Perpanjang"
  alt tanggal tidak setelah tanggal kembali sekarang
    Sys-->Admin:"Tanggal baru harus setelah tanggal kembali sekarang (...)"
  else ok
    Sys->Data:simpan EXT-xxx, Tanggal Kembali diganti (status Overdue hilang)
    note right of RD:Tagihan tetap dari SJ kirim/pulang, perpanjangan hanya jadwal.\nRiwayatnya tampil di tab Overview.
  end
end

note over RD,Data:Setelah Approved → "Create Delivery" (file 03).\nStatus Penyewaan berubah OTOMATIS:\nApproved → Preparing (DLV pertama dibuat)\n→ Partially Delivered / On Rental (DLV selesai serah terima)\n→ Partially Returned / Completed (inspeksi pengembalian)\nOverdue = tampil otomatis kalau lewat Expected Return Date
```

---

## 3. Pengiriman (SJK)

Halaman: `rental-detail.html` → `delivery-detail.html` (admin) / `driver-dashboard.html` → `driver-delivery-detail.html` (driver). Jalur manual: `project-stock.html` / `stock-mutations.html`

```
title 03 - Pengiriman Alat ke Proyek (Surat Jalan Kirim / SJK)

actor Admin
actor Driver
participant "rental-detail.html" as RD
participant "delivery-detail.html" as DD
participant "driver-delivery-detail.html" as DRV
participant "Sistem" as Sys
participant "Stok\n(Gudang & Proyek)" as Stok
database Data

==JALUR A - dari Penyewaan (utama)==
Admin->RD:"Create Delivery" (status Approved / Preparing /\nPartially Delivered / On Rental)
Admin->RD:Delivery Date, Driver (opsional), Vehicle (opsional),\nDestination, Deliver Qty per alat → "Create Delivery"
alt semua qty kosong
  RD-->Admin:"Please specify at least one item to deliver"
else qty melebihi sisa
  Sys-->Admin:"<alat>: cannot deliver X, only Y remaining"
else ok
  Sys->Data:buat DLV-xxx + nomor SJK-YYMM-NNN
  Sys->Data:Penyewaan Approved → **Preparing**
  alt driver dipilih
    Sys->Data:DLV **Assigned**, driver & kendaraan jadi "On Delivery"
  else tanpa driver
    Sys->Data:DLV **Preparing**
    Admin->DD:nanti: "Tugaskan Driver" → Driver, Kendaraan, Tanggal → **Assigned**
  end
  note over Stok:Stok BELUM keluar gudang (masih dipesan)
end

==PERJALANAN==
alt dikerjakan admin
  Admin->DD:"Depart" → **Departed**
  Admin->DD:"Arrive at Site" → **Arrived**
else dikerjakan driver (login role Driver, hanya melihat tugasnya sendiri)
  Driver->DRV:"Pengiriman Saya" → "Detail" → "BERANGKAT" → **Departed**
  Driver->DRV:"SAMPAI" → waktu, foto, catatan → "Confirm Arrival" → **Arrived**
  note right of DRV:Foto & catatan kedatangan tersimpan dan tampil di delivery-detail.\nSerah terima (PoD) tetap dicatat admin.
end

==SERAH TERIMA / GAGAL==
alt serah terima (status Arrived)
  Admin->DD:"Complete Handover (PoD)" → Receiver Name* → "Confirm Delivery"
  alt nama penerima kosong
    DD-->Admin:"Receiver name is required"
  else stok gudang kurang
    Sys-->Admin:"<alat>: butuh X, tersedia di <Gudang> hanya Y"\nDLV tetap Arrived
  else berhasil
    Sys->Stok:posting SJK: gudang → proyek (ambil dari stok dipesan dulu)
    Sys->Data:DLV **Completed**, driver & kendaraan kembali "Available"
    alt semua qty sewa sudah terkirim
      Sys->Data:Penyewaan **On Rental**
    else baru sebagian
      Sys->Data:Penyewaan **Partially Delivered** (buat DLV lagi untuk sisanya)
    end
    note over Stok:Tanggal posting SJK = mulai dihitung sewa di Rekap Tagihan
  end
else gagal (status Departed, atau Arrived tapi alat ditolak di lokasi)
  Admin->DD:"Report Issue" → alasan (Customer not on site / Site inaccessible /\nEquipment rejected by customer / Vehicle breakdown / Other) → "Report Failure"
  Sys->Data:DLV **Failed**, driver & kendaraan "Available", stok tidak berubah
  opt jadwal ulang
    Admin->DD:"Reschedule" → tanggal baru → **Rescheduled**
    Admin->DD:"Tugaskan Driver" → **Assigned** → lanjut perjalanan lagi
  end
end
opt cetak dokumen
  Admin->DD:"Cetak Surat Jalan" → SJ dengan kolom tanda tangan Gudang / Driver / Penerima
end

==JALUR B - SJK manual tanpa Penyewaan==
Admin->Stok:Stok Proyek → "Kirim Alat (SJ)"  atau\nPerpindahan Stok → "Buat Perpindahan" → "C. Pengiriman ke Proyek"
Admin->Stok:Tanggal, Gudang Asal, Proyek Tujuan, alat & qty → "Simpan & Posting"
alt stok tersedia kurang
  Stok-->Admin:"<alat>: butuh X, tersedia di <Gudang> hanya Y"
else ok
  Stok->Data:SJK langsung diposting (stok langsung pindah ke proyek)
  note right of Stok:Tanpa DLV, tanpa driver, status Penyewaan tidak berubah.\nTetap ikut dihitung di Rekap Tagihan proyek.
end
```

---

## 4. Pengembalian, Inspeksi & Klaim

Halaman: `rental-detail.html` → `return-detail.html` → `claims.html` → `claim-detail.html` → `invoice-detail.html`

```
title 04 - Pengembalian, Inspeksi Kondisi & Klaim

actor Admin
actor Customer
participant "rental-detail.html" as RD
participant "return-detail.html" as RT
participant "claim-detail.html" as CL
participant "Sistem" as Sys
participant "Stok" as Stok
database Data

==A. BUAT PENGEMBALIAN==
Admin->RD:"Buat Pengembalian" (status On Rental / Partially Delivered /\nPartially Returned / Overdue)
alt tidak ada sisa barang (atau masih ada RET yang belum diinspeksi)
  RD-->Admin:"No items remaining for return"
else ada
  Sys->Data:RET-xxx status **Inspection**\n(qty = SEMUA barang terkirim yang belum kembali)
  RD-->Admin:pindah ke return-detail.html
end

==B. INSPEKSI KONDISI==
Admin->RT:per alat isi Baik / Rusak / Lost / Missing + Notes
alt jumlah 4 kolom ≠ qty dikirim
  RT-->Admin:"Total classified (X) does not match sent quantity (Y)"
end
Admin->RT:"Complete Inspection"
alt stok di proyek lebih kecil dari yang dipulangkan
  Sys-->Admin:"<alat>: stok di proyek hanya X, tidak bisa dipulangkan Y"
else ok
  Sys->Stok:SJR (Surat Jalan Pulang): proyek → gudang
  alt Baik
    Sys->Stok:masuk stok TERSEDIA gudang (bisa disewa lagi)
  else Rusak
    Sys->Stok:masuk stok RUSAK gudang
    Sys->Data:buat Perbaikan REP-xxx status Pending (file 05)
  else Lost / Missing
    Sys->Stok:dokumen HL (Hilang): keluar dari stok proyek,\ntidak masuk gudang (dihapus)
  end
  Sys->Data:RET **Completed**
  alt semua qty sewa sudah kembali (rusak & hilang ikut dihitung)
    Sys->Data:Penyewaan **Completed**
  else sebagian
    Sys->Data:Penyewaan **Partially Returned**
  end
  note over Stok:Tanggal inspeksi = BERHENTI dihitung sewa\n(termasuk barang rusak & hilang)
end

==C. KLAIM KE CUSTOMER (untuk Rusak / Lost / Missing)==
Admin->RT:"Create Claim" (muncul setelah inspeksi selesai, jika ada rusak/lost/missing & belum ada klaim)
Sys->Data:1 klaim per alat, status **Draft**, alasan otomatis (mis. "Rusak 1 (lampu pecah), Hilang 1")\nnilai default: hilang = harga sewa/bulan × 10 per unit, rusak = 30% dari itu
RT-->Admin:pindah ke claim-detail (1 klaim) / claims.html (lebih dari 1)
opt nilai perlu disesuaikan (status Draft / Pending / Disputed)
  Admin->CL:"Ubah Nilai Klaim" → nilai baru + catatan (riwayat perubahan tersimpan)
end
Admin->CL:"Request Confirmation" → **Pending Customer Confirmation**
Admin->Customer:minta konfirmasi nilai klaim (di luar sistem)
alt customer setuju
  Admin->CL:"Customer Approved" → **Approved**
else customer menolak
  Admin->CL:"Customer Disputed" → isi alasan → **Disputed**
  alt manager memutuskan tetap ditagih
    Admin->CL:"Force Approve (Manager)" → **Approved** (hanya role dengan hak Approve)
  else klaim dibatalkan
    Admin->CL:"Tutup Klaim" → alasan → **Closed**
  end
end
Admin->CL:"Generate Invoice" (status Approved)
Sys->Data:Invoice tipe **Klaim**, langsung "Belum Dibayar",\njatuh tempo +14 hari, tanpa PPN → masuk piutang
CL-->Admin:pindah ke invoice-detail.html (pembayaran: file 07)
Sys->Data:invoice klaim lunas → klaim otomatis **Paid**
opt arsipkan
  Admin->CL:"Tutup Klaim" → **Closed**
end

==D. PULANG MANUAL TANPA INSPEKSI==
Admin->Stok:Stok Proyek → "Pulangkan Alat (SJ)"  atau\nPerpindahan Stok → "D. Pemulangan dari Proyek"\nKondisi per baris Baik / Rusak → "Simpan & Posting"
note right of Stok:Langsung posting SJR. Tanpa RET, tanpa perbaikan,\ntanpa klaim, tanpa pilihan hilang,\nstatus Penyewaan tidak berubah.
```

---

## 5. Perbaikan & Perawatan

> **Dihapus** sesuai catatan user (Okt 2026). Halaman `repairs.html`, `repair-detail.html`, `maintenance.html`, `maintenance-detail.html` tidak ada lagi dan inspeksi pengembalian tidak membuat data perbaikan. Alat rusak masuk stok kondisi *rusak*; kalau sudah dibetulkan klik **"Sudah baik"** di Stok Gudang, kalau tidak bisa → **Afkir** di Perpindahan Stok. Diagram di bawah hanya arsip.

Halaman: `repairs.html` → `repair-detail.html`, `maintenance.html` → `maintenance-detail.html`

```
title 05 - Perbaikan (Repair) & Perawatan (Maintenance)

actor Teknisi
participant "repairs.html\nrepair-detail.html" as RP
participant "maintenance.html\nmaintenance-detail.html" as MT
participant "Sistem" as Sys
participant "Stok Gudang\n(tersedia / rusak / perawatan)" as Stok

==PERBAIKAN (dari barang Rusak saat inspeksi)==
note over RP:REP dibuat otomatis oleh "Complete Inspection" (file 04).\nTidak ada tombol buat perbaikan manual.
Teknisi->RP:sidebar Perbaikan → buka REP → "Start Repair" → **In Repair**
alt berhasil diperbaiki
  Teknisi->RP:"Complete Repair" → isi catatan → **Completed**
  Sys->Stok:stok RUSAK → TERSEDIA (bisa disewa lagi)
else tidak bisa diperbaiki
  Teknisi->RP:"Mark Unrepairable" → isi alasan → **Unrepairable**
  Sys->Stok:dokumen AF (Afkir): dihapus dari stok rusak & total stok
end
note over RP,Stok:Belum ada biaya perbaikan / pengeluaran kas

==PERAWATAN RUTIN (manual)==
Teknisi->MT:"Start Maintenance" → Equipment, Branch,\nMaintenance Type (Routine Check / Calibration / Overhaul / Cleaning),\nQuantity, Notes → "Start"
alt qty melebihi stok tersedia
  Sys-->Teknisi:"Insufficient available stock for maintenance in <gudang>"
else ok
  Sys->Stok:TERSEDIA → PERAWATAN (tidak bisa disewa / dikirim)
  Sys-->Teknisi:status **In Progress** → maintenance-detail.html
end
Teknisi->MT:"Complete Maintenance" → isi hasil → "Mark Completed" → **Completed**
Sys->Stok:PERAWATAN → TERSEDIA
note over MT:Riwayat perawatan & perbaikan juga tampil di equipment-detail → tab Maintenance
```

---

## 6. Rekap Tagihan & Invoice

Halaman: `billing.html` → `invoice-detail.html`, `invoices.html` → `invoice-shadow.html`

```
title 06 - Rekap Tagihan & Invoice (termasuk Invoice Bayangan)

actor Finance
participant "billing.html\n(Rekap Tagihan)" as BL
participant "invoice-shadow.html" as SH
participant "invoices.html\ninvoice-detail.html" as INV
participant "Sistem" as Sys
database Data

==A. INVOICE SEWA DARI REKAP (normal)==
Finance->BL:sidebar Piutang → Rekap Tagihan
BL-->Finance:tabel "Belum Ditagih (s/d hari ini)" → klik "Rekap" pada proyek
note right of BL:Periode otomatis: sehari setelah invoice terakhir\n(atau tanggal SJK pertama) s/d akhir bulan itu
Sys->BL:1 baris = 1 SJ Kirim × alat\nAwal = tgl SJK atau awal periode\nAkhir = tgl SJR/HL atau akhir periode\nTotal = Qty × Hari × Harga Satuan proyek ÷ Bulan Sewa (30)
opt alat belum pulang tapi mau dihitung sampai tanggal tertentu
  Finance->BL:ubah tanggal di kolom "B. Akhir"
end
Finance->BL:PPN, Tgl Invoice, Jatuh Tempo (hari, default 30), Rekening → "Buat Invoice"
alt periode bentrok dengan invoice lain
  BL-->Finance:"Periode ini sudah ditagih di INV-xxx" (tombol tidak aktif)
else tidak ada alat disewa di periode itu
  BL-->Finance:"Tidak ada alat yang disewa pada periode ini"
else ok
  Sys->Data:INV-xxx tipe Sewa, status **Belum Dibayar** → masuk piutang
  BL-->Finance:pindah ke invoice-detail.html
end

==B. INVOICE BAYANGAN (data belum lengkap)==
Finance->INV:invoices.html → "Invoice Bayangan"
Finance->SH:Customer* (satu-satunya yang wajib), Proyek, Tipe (Sewa / Klaim), Periode, PPN
loop tiap barang (boleh kosong dulu)
  Finance->SH:"Tambah Barang" / "Ambil dari Kebutuhan Proyek"\n(nama, qty, harga, awal, akhir)
end
Finance->SH:"Simpan Bayangan"
Sys->Data:INV-xxx status **Bayangan**\n(TIDAK masuk piutang, TIDAK bisa dibayar)
opt barang berubah
  Finance->INV:"Ubah Barang" → edit → "Simpan Bayangan"
end
alt terbitkan apa adanya
  Finance->INV:"Terbitkan" → Tgl Invoice, Jatuh Tempo, PPN → "Terbitkan"
  alt belum ada barang
    INV-->Finance:"Tambahkan barang dulu lewat Ubah Barang"
  else ok
    Sys->Data:status **Belum Dibayar** (ada label "eks-bayangan")
  end
else data SJ sudah lengkap
  Finance->BL:"Terbitkan dari Rekap" → "Terbitkan INV-xxx"
  Sys->Data:barang diganti hasil rekap SJ, nomor invoice tetap sama
end

==C. INVOICE KLAIM==
note over INV:Dibuat dari claim-detail "Generate Invoice" (file 04).\nLangsung Belum Dibayar, jatuh tempo 14 hari, tanpa PPN.

==D. STATUS & PEMBATALAN==
note over INV:Bayangan → Belum Dibayar → Dibayar Sebagian → Lunas\nJatuh Tempo = otomatis jika lewat tgl jatuh tempo & belum lunas
opt batalkan invoice
  Finance->INV:"Batalkan" → isi alasan
  alt sudah ada pembayaran
    Sys-->Finance:"Invoice yang sudah ada pembayaran tidak bisa dibatalkan"
  else ok
    Sys->Data:status **Dibatalkan** (periodenya bisa direkap ulang)
  end
end
```

---

## 7. Pembayaran, Piutang & Arus Kas

Halaman: `invoice-detail.html` / `payments.html` / `receivables.html` → `finance-ledger.html`

```
title 07 - Pembayaran, Piutang & Arus Kas

actor Customer
actor Finance
participant "invoice-detail.html\npayments.html" as PAY
participant "receivables.html\n(Laporan Piutang)" as AR
participant "finance-ledger.html\n(Buku Kas & Bank)" as LED
participant "Sistem" as Sys
database Data

==CATAT PEMBAYARAN==
Customer->Finance:bayar (transfer / giro / tunai)
note right of Finance:Metode "Tunai" → otomatis masuk ke akun Kas.\nTransfer / Giro → rekening bank invoice.
alt dari detail invoice
  Finance->PAY:invoice-detail → "Catat Pembayaran"
else dari menu Pembayaran Tagihan
  Finance->PAY:payments.html → "Catat Pembayaran" → pilih Invoice
else dari Laporan Piutang
  Finance->AR:klik baris customer → ikon "Catat pembayaran" pada invoice
  AR->PAY:buka payments.html dengan invoice terpilih
end
Finance->PAY:Jenis "Lunas" (otomatis = sisa) / "Cicilan" (isi jumlah),\nTanggal Bayar, Masuk ke Rekening, Metode, No. Referensi → "Simpan Pembayaran"
alt invoice masih Bayangan
  Sys-->Finance:"Invoice bayangan harus diterbitkan dulu sebelum dibayar"
else invoice Dibatalkan
  Sys-->Finance:"Invoice sudah dibatalkan"
else jumlah 0 / kosong
  Sys-->Finance:"Jumlah pembayaran tidak valid"
else jumlah melebihi sisa
  Sys-->Finance:"Jumlah melebihi sisa tagihan (...)"
else ok
  Sys->Data:PAY-xxx (Lunas jika jumlah = sisa, selain itu Cicilan)
  alt total dibayar = total invoice
    Sys->Data:invoice **Lunas**
  else belum
    Sys->Data:invoice **Dibayar Sebagian**
  end
  alt akun Kas
    Sys->LED:**Bon Biru** otomatis, kategori "Pembayaran Piutang Tunai"
  else akun Bank
    Sys->LED:**Bon Biru** otomatis, kategori "Terima Pembayaran Piutang"
  end
end

==LAPORAN PIUTANG==
Finance->AR:Laporan Piutang → pilih "Per tanggal"
AR-->Finance:sisa piutang per customer + umur:\nBelum JT / 1-30 / 31-60 / 61-90 / >90 hari

note over PAY,Data:Uang masuk/keluar lainnya (Bon Biru / Bon Merah manual),\nPindah Dana, Laporan Kas & Rekonsiliasi Bank → diagram 9
```

---

## 8. Pembelian & Perpindahan Stok

Halaman: `equipment.html`, `purchases.html` → `purchase-create.html` → `purchase-detail.html` → `goods-receipt-detail.html`, `stock-mutations.html`, `stock.html`, `project-stock.html`, `stock-report.html`

```
title 08 - Alat Baru, Pembelian, Penerimaan & Perpindahan Stok

actor Admin
participant "equipment.html" as EQ
participant "purchase-create.html\npurchase-detail.html" as PO
participant "goods-receipt-detail.html" as GR
participant "stock-mutations.html\n(Perpindahan Stok)" as MUT
participant "Stok\n(Gudang & Proyek)" as Stok

==A. DAFTAR ALAT BARU (saldo awal)==
Admin->EQ:"Tambah Alat Berat" → Nama*, Kategori*, Serial / Jumlah Awal,\nHarga, Cabang* → "Simpan Alat Berat"
EQ->Stok:dokumen SA (Saldo Awal): + stok tersedia gudang

==B. PEMBELIAN (PO)==
Admin->PO:Pembelian → "New Purchase" → Supplier*, Destination Branch*,\nalat (qty, harga), Payment Account*, Status (Draft / Requested) → "Create Purchase"
alt tidak ada item
  PO-->Admin:"Please add at least one item."
else ok
  PO->PO:PO-xxx **Draft / Requested** (stok belum berubah)
end
Admin->PO:Manager: "Setujui PO" → **Approved**  (role lain: "Menunggu persetujuan Manager")
Admin->PO:"Pesan ke Supplier" → **Ordered**
opt status pengiriman supplier
  Admin->PO:"Dalam Pengiriman" → **In Transit** → "Barang Tiba" → **Arrived**
end
opt batal (Draft / Requested / Approved / Ordered, belum ada barang diterima)
  Admin->PO:"Batalkan" → alasan → **Cancelled**
end
loop sampai semua barang diterima
  Admin->PO:"Receive Items" (status Ordered / In Transit / Arrived / Partially Received)\n→ Receipt Date, Target Branch (default gudang PO), Terima Sekarang (≤ sisa), Notes → "Confirm Receipt"
  alt qty kosong / melebihi sisa pesanan
    PO-->Admin:"Isi jumlah barang yang diterima" / "<alat>: diterima X, sisa pesanan hanya Y"
  else ok
    PO->GR:buat GR-xxx
    GR->Stok:dokumen PB: + stok tersedia gudang
    alt semua item diterima
      PO->PO:status **Received**
    else sebagian
      PO->PO:status **Partially Received** (terima sisanya lewat "Receive Items" lagi)
    end
  end
end
Admin->PO:"Selesaikan PO" → **Completed**
opt bayar ke supplier
  Admin->PO:"Bayar Supplier" → Bon Merah terisi otomatis (akun PO, kategori\n"Pembayaran Supplier", referensi PO-xxx, jumlah = sisa hutang) → "Simpan Bon"
  note right of PO:purchase-detail menampilkan Sudah Dibayar, Sisa Hutang Supplier\n& riwayat pembayarannya  [diagram 9]
end

==C. PERPINDAHAN STOK MANUAL==
Admin->MUT:"Buat Perpindahan" → pilih jenis → Tanggal, Dari, Ke, alat & qty → "Simpan & Posting"
alt stok tidak cukup
  MUT-->Admin:"<alat>: butuh X, tersedia di <Gudang> hanya Y"
else gudang asal = tujuan
  MUT-->Admin:"Gudang asal dan tujuan tidak boleh sama"
else ok
  alt A. Pembelian / Produksi
    MUT->Stok:supplier / produksi → gudang (+)
  else B. Transit Antar Gudang
    MUT->Stok:gudang asal (−) → gudang tujuan (+), langsung tanpa status di jalan
  else C. Pengiriman ke Proyek
    MUT->Stok:gudang (−) → proyek (+)  [file 03 jalur B]
  else D. Pemulangan dari Proyek
    MUT->Stok:proyek (−) → gudang (+), kondisi Baik / Rusak  [file 04 bagian D]
  else E. Penjualan ke Customer
    MUT->Stok:gudang (−) → customer (keluar permanen)
  end
end

==D. LAPORAN STOK==
note over Stok:Stok Gudang = per gudang (tersedia / dipesan / rusak / perawatan)\nStok Proyek = Kebutuhan vs Terkirim vs Dipulangkan vs Hilang vs Di Lokasi\nLaporan Stok = Gudang + Proyek per tanggal\nBelum ada stock opname / penyesuaian stok
```

---

## 9. Kas & Bank, Laporan Kas & Rekonsiliasi Bank

Halaman: `finance-ledger.html` (Buku Kas & Bank) → `cash-report.html` (Laporan Kas) → `bank-reconciliation.html` (Rekonsiliasi Bank). Akun Kas / Bank diatur di `accounts.html` (Rekening Perusahaan).

```
title 09 - Kas & Bank: Bon Biru, Bon Merah, Pindah Dana, Laporan Kas, Rekonsiliasi

actor Finance
participant "accounts.html\n(Rekening Perusahaan)" as ACC
participant "finance-ledger.html\n(Buku Kas & Bank)" as LED
participant "cash-report.html\n(Laporan Kas)" as REP
participant "bank-reconciliation.html\n(Rekonsiliasi Bank)" as REK
participant "Sistem" as Sys

==A. SIAPKAN AKUN==
Finance->ACC:"Tambah Akun" → Jenis Akun (Bank / Kas), Saldo Awal, nama,\n(Bank: nama bank & no. rekening) → "Simpan Akun"
note right of ACC:Contoh: Kas Kantor Cileungsi (Kas),\nBCA Operational / Mandiri Corporate (Bank)

==B. BON BIRU (MASUK = MENAMBAH SALDO)==
Finance->LED:"Bon Biru (Masuk)" → Tanggal, Akun, Kategori, Jumlah,\nDiterima dari, Referensi, Keterangan* → "Simpan Bon"
alt akun Kas
  note right of LED:Penjualan Tunai / Pembayaran Piutang Tunai /\nUang Muka Customer / Terima Pinjaman /\nPengembalian dari Supplier, Koreksi Biaya, Pengembalian Kasbon /\nPendapatan Lain-lain
else akun Bank
  note right of LED:Penerimaan Pinjaman / Terima Pembayaran Piutang /\nUang Muka dari Customer / Pengembalian dari Supplier /\nBunga, Jasa Giro
end
Sys->LED:nomor BB-YYMM-NNN, saldo akun bertambah

==C. BON MERAH (KELUAR = MENGURANGI SALDO)==
Finance->LED:"Bon Merah (Keluar)" → Tanggal, Akun, Kategori, Jumlah,\nDibayar kepada, Referensi, Keterangan* → "Simpan Bon"
alt akun Kas
  note right of LED:Biaya Operasional / Pembayaran Hutang Supplier /\nGaji, Sewa & Pajak / Kasbon Karyawan / Bayar Pinjaman
else akun Bank
  note right of LED:Pembayaran Supplier (barang / jasa / aset) /\nPembayaran Pinjaman / Biaya Admin & Pajak Bank
end
alt saldo akun tidak cukup
  Sys-->Finance:"Saldo <akun> tidak cukup (saldo Rp ...)"
else kategori tidak cocok / keterangan kosong / jumlah 0
  Sys-->Finance:"Pilih kategori yang sesuai" / "Keterangan wajib diisi" /\n"Jumlah harus lebih dari 0"
else ok
  Sys->LED:nomor BM-YYMM-NNN, saldo akun berkurang
end

==D. PINDAH DANA==
Finance->LED:"Pindah Dana" → Dari (Bank), Ke (Kas / Bank lain), Tanggal, Jumlah → "Pindahkan"
alt Bank → Kas
  Sys->LED:Bon Merah "Penarikan Tunai untuk Mengisi Kas"\n+ Bon Biru "Terima Pemindahan dari Bank ke Tunai"
else Bank → Bank lain perusahaan
  Sys->LED:Bon Merah "Pindah Dana ke Bank Lain"\n+ Bon Biru "Terima Pindah Dana dari Bank Lain Perusahaan"
end
opt salah input
  Finance->LED:ikon hapus (entri manual / pindah dana, belum direkonsiliasi)
  note right of LED:Entri dari pembayaran invoice & yang sudah\ndirekonsiliasi tidak bisa dihapus
end

==E. LAPORAN KAS==
Finance->REP:pilih Periode (dari s/d) & Akun (semua / satu akun)
REP-->Finance:I. CASH ACCOUNT: Saldo Awal Kas, A. Kas Masuk per kategori,\nB. Kas Keluar per kategori, Saldo Akhir Kas
REP-->Finance:II. BANK ACCOUNT: Saldo Awal Bank, A. Bank Masuk,\nB. Bank Keluar, Saldo Akhir Bank (+ rincian per rekening)
REP-->Finance:III. REKONSILIASI BANK: status per rekening → tombol "Rekonsiliasi"
opt lihat rincian
  Finance->REP:klik nama kategori
  REP->LED:Buku Kas & Bank terfilter kategori & periode tsb
end

==F. REKONSILIASI BANK==
Finance->REK:pilih Rekening Bank, periode, isi Saldo Akhir menurut Rekening Koran*
opt punya file mutasi bank
  Finance->REK:tempel / "Pilih File" CSV (tanggal;keterangan;debit;kredit)\n→ "Baca & Cocokkan"  (atau "Contoh Mutasi" untuk mencoba)
  Sys->REK:cocok otomatis: jumlah & arah sama, tanggal selisih ≤ 3 hari
end
Finance->REK:centang manual transaksi sistem yang sudah muncul di rekening koran
opt mutasi bank belum ada di sistem (biaya admin, bunga, dll.)
  Finance->REK:"Catat ke Sistem" → pilih kategori → "Catat" (jadi Bon Biru / Bon Merah)
end
REK-->Finance:Saldo Rek. Koran ± transaksi sistem yang belum muncul di bank\nvs Saldo Sistem ± mutasi bank yang belum dicatat
alt selisih = 0
  Finance->REK:"Simpan Rekonsiliasi" → status **Cocok**
else masih ada selisih
  Finance->REK:"Simpan Rekonsiliasi" → konfirmasi → status **Ada Selisih**
end
Sys->LED:transaksi yang dicentang diberi tanda ✓ (sudah direkonsiliasi, terkunci)
```

---

## 10. Akuntansi & Pajak

Mengikuti file `excel/1. ALUR COA & TAX.xlsx`. Halaman: `coa.html` (Bagan Akun) → `journal.html` (A. Jurnal) → `general-ledger.html` (B. Buku Besar) → `worksheet.html` (C. Kertas Kerja) → `adjustments.html` (D. Jurnal Penyesuaian) → `profit-loss.html` (Laba Rugi) & `balance-sheet.html` (Neraca). Pajak: `tax-ppn.html` & `tax-pph23.html`. Logika di `assets/js/accounting.js`.

Prinsip:
- **COA = pengelompokan Laporan Kas.** Tiap kategori Bon Biru / Bon Merah punya akun COA default (Bagan Akun › Pemetaan Laporan Kas → COA). Akun Kas & Bank (1-11xx) dibuat otomatis dari Rekening Perusahaan.
- **Saldo awal 2026 = saldo akhir neraca 2025**, diisi per akun di Bagan Akun (harus seimbang debet = kredit).
- Jurnal **otomatis** dari: Laporan Kas (setiap bon), Penjualan / AR (setiap invoice: Piutang / Pendapatan Sewa / PPN Keluaran), Pembelian & Stok (setiap penerimaan barang PB: Pembelian / PPN Masukan / Hutang Dagang). Yang manual hanya **Jurnal Penyesuaian**.
- **Persediaan** dinilai dari data stok (qty gudang + lokasi proyek × harga PO terakhir). HPP = persediaan awal + pembelian − persediaan akhir, dibuat otomatis sebagai penyesuaian per tanggal laporan.
- **Pajak** ditarik dari akun bertanda pajak di Buku Besar: 2-2002 PPN Masukan & Keluaran, 2-2001 Hutang PPh 23, 1-1304 Piutang Pajak.

```
title 10 - Akuntansi & Pajak

actor Finance
participant "coa.html\n(Bagan Akun)" as COA
participant "journal.html\n(Jurnal)" as JR
participant "general-ledger.html\n(Buku Besar)" as GL
participant "worksheet.html\n(Kertas Kerja)" as WS
participant "adjustments.html\n(Jurnal Penyesuaian)" as ADJ
participant "profit-loss.html /\nbalance-sheet.html" as RPT
participant "tax-ppn.html /\ntax-pph23.html" as TAX

==SIAPKAN==
Finance->COA:cek saldo awal 2026 (= saldo akhir 2025) → "Neraca Awal Seimbang"
Finance->COA:tab "Pemetaan Laporan Kas → COA" → pilih akun default per kategori

==A. JURNAL ATAS LAPORAN KAS==
note right of JR:Bon Biru / Bon Merah dari Buku Kas & Bank\notomatis muncul di sini
Finance->JR:filter "Perlu dicek (kategori campuran)"
Finance->JR:per baris pilih "Nama Akun (COA)" + "Proyek"
note right of JR:Tanggal - Nama Akun - Uraian - Debet - Kredit - Saldo
JR->GL:diposting otomatis (+ jurnal invoice & pembelian)

==B. BUKU BESAR==
Finance->GL:pilih akun
alt akun Kas / Bank
  GL-->Finance:global per tanggal (Tanggal - Debet - Kredit - Saldo)
else akun biaya / lainnya
  GL-->Finance:rinci per transaksi (Tanggal - Keterangan - Debet - Kredit - Saldo)
end

==C. KERTAS KERJA==
Finance->WS:pilih tahun buku + s/d bulan
WS-->Finance:Neraca 2025 | Mutasi | Adjustment | Neraca | Laba Rugi + cek seimbang

==D. JURNAL PENYESUAIAN==
Finance->ADJ:"Tambah Jurnal Penyesuaian" (template: penyusutan, akrual, PPh 23, koreksi akun)
alt debet ≠ kredit
  ADJ-->Finance:"Jurnal tidak seimbang"
else ada akun Hutang PPh 23 / Piutang Pajak
  ADJ-->Finance:wajib isi lawan transaksi, NPWP, DPP (untuk bukti potong)
else ok
  ADJ->GL:terlink ke Buku Besar, Kertas Kerja & Neraca
end
note right of ADJ:Penyesuaian persediaan akhir dari data stok\ndibuat otomatis (tidak perlu input)

==LAPORAN==
Finance->RPT:Laba Rugi: Keseluruhan / Per proyek / Perbandingan antar proyek
Finance->RPT:Neraca: sebelum / setelah penyesuaian → "Total Aktiva = Total Pasiva"

==PAJAK==
Finance->TAX:PPN: pilih masa → centang faktur → "Export XML Coretax"
alt NPWP pelanggan kosong
  TAX-->Finance:peringatan "Belum diisi" (isi di Pelanggan)
end
Finance->TAX:PPh 23: pilih masa → "Export XML Coretax" (bukti potong)
```

---

## 11. Role, ACC Piutang, Penjualan, Ekspedisi & Permintaan Perubahan

Dari catatan user (Okt 2026). Halaman baru: `approvals.html` (Persetujuan Order), `sales.html` / `sale-create.html` / `sale-detail.html` (Penjualan), `edit-requests.html` (Permintaan Perubahan).

**Role**: Admin · Account Receivable (Staff Piutang) · Finance · Accounting & Tax · Purchase · Logistik · Administrasi · Ekspedisi · Driver (portal driver). Demo login: `admin`, `piutang`, `finance`, `accounting`, `purchase`, `logistik`, `administrasi`, `ekspedisi`, `driver` (password `demo`).

Prinsip:
- **Customer = master.** Halaman pelanggan langsung menampilkan proyek, sewa aktif, penjualan dan piutang. Satu customer bisa banyak proyek, satu proyek bisa banyak sewa / jual.
- **Order sewa & jual di-ACC Staff Piutang** (bukan Manager) di *Persetujuan Order*, sambil melihat piutang & yang lewat jatuh tempo. Setelah ACC stok dipesan dan Logistik boleh membuat surat jalan.
- **Surat jalan 3 jenis**: Sewa (SJK), Jual (PJ), Pemulangan (SJR). Pemulangan = jemput alat dari proyek; tiba di gudang → otomatis jadi Pengembalian untuk diinspeksi.
- **Ekspedisi** (internal, koordinasi driver): mengisi *estimasi kirim & kembali* saat penyewaan dibuat, mengisi *estimasi berangkat/tiba* di tiap surat jalan, dan *update posisi* manual dari info driver (WA). **Surat jalan tidak bisa dicetak / berangkat sebelum ada estimasi.**
- **Biaya keterlambatan ke customer**: alat yang pulang (SJR) melewati estimasi kembali dikenai biaya per hari = tarif sewa harian × `settings.lateFeeRate` (default 1), muncul sebagai baris terpisah di Rekap Tagihan (bisa dimatikan).
- **Rekap Tagihan 2 mode**: *Dari Stok (SJ)* otomatis, atau *Manual* (tarik dari stok / kebutuhan proyek lalu edit bebas, tambah baris).
- **Invoice**: Sewa (dari rekap), **Jual** (tinggal tarik dari order jual), Klaim.
- **Tenggat proyek** wajib saat buat proyek, bisa diubah di detail proyek dengan alasan (riwayat tersimpan).
- **Stok masuk**: A. Pembelian, **F. Produksi / Rakit Sendiri**, **G. Kelebihan Alat** (selisih lebih stock opname → pendapatan lain-lain).
- **Ubah / hapus data hanya Admin.** Role lain klik *Ajukan Perubahan* + catatan → **ACC Accounting** → Admin mengubah & menandai selesai.

```
title 11 - ACC Piutang, Penjualan, Ekspedisi & Permintaan Perubahan

actor Administrasi
actor "Staff Piutang" as AR
actor Ekspedisi
actor Logistik
actor Accounting
actor Admin
participant "Sistem" as Sys

==ORDER==
Administrasi->Sys:Pelanggan → Proyek (tenggat) → Penyewaan / Penjualan → "Ajukan ACC"
Ekspedisi->Sys:Penyewaan: "Isi Estimasi Ekspedisi" (kirim & jemput)
AR->Sys:Persetujuan Order: cek piutang customer → "ACC" / "Tolak"
Sys-->Logistik:stok dipesan, boleh buat surat jalan

==SURAT JALAN (SEWA / JUAL / PEMULANGAN)==
Logistik->Sys:"Surat Jalan Kirim" / "Surat Jalan Jual" / "Surat Jalan Pemulangan"
Ekspedisi->Sys:"Isi Estimasi" (berangkat & tiba)
alt belum ada estimasi
  Sys-->Logistik:tidak bisa "Cetak Surat Jalan" / "Berangkat"
end
Ekspedisi->Sys:"Update Posisi" (dari WA driver)
Logistik->Sys:Berangkat → Sampai → "Serah Terima" / "Terima di Gudang & Inspeksi"
alt pemulangan
  Sys->Logistik:Pengembalian dibuat → inspeksi (baik / rusak / hilang) → SJR
end

==TAGIHAN==
AR->Sys:Rekap Tagihan (Dari Stok / Manual) → Buat Invoice
note right of Sys:lewat estimasi kembali → baris biaya keterlambatan
AR->Sys:Penjualan → "Buat Invoice Jual"

==PERUBAHAN DATA==
Logistik->Sys:"Ajukan Perubahan" + catatan
Accounting->Sys:Permintaan Perubahan → "ACC" / "Tolak"
Admin->Sys:ubah datanya → "Selesai"
```

---

## 12. Purchasing: Purchase Request, Purchase Order, Pembayaran, Laporan

Dari catatan user (Okt 2026). Grup menu **PEMBELIAN**: `purchase-requests.html`, `purchases.html` / `purchase-create.html` / `purchase-detail.html`, `goods-receipts.html`, `vendors.html`, `purchase-report.html`, `payables.html`.

| Bagian | Isi |
|---|---|
| Vendor (master) | Nama vendor, alamat, no. telepon, contact person (+ email, NPWP) |
| 1. Purchase Request | Vendor (alamat, telp, contact person otomatis dari master), nama barang, satuan, qty, harga. Draft → Diajukan → ACC (Finance / Admin) → **Buat PO** / Ditolak |
| 2. Purchase Order | Vendor + alamat, nama barang, satuan, harga, **term of payment** (Cash / Uang Muka % + pelunasan / Tempo N hari), **tax** (PPN 11% / tanpa), diskon, ongkir. Bisa ditarik dari PR. Cetak PO |
| 3. Payment | Di detail PO: **Uang Muka (DP)**, **Pelunasan**, Cicilan → otomatis Bon Merah. **Tempo**: jatuh tempo = tanggal barang diterima + hari tempo |
| 4. Laporan Pembelian | Per periode: per PO, per vendor, per barang (subtotal, PPN, total, diterima, dibayar) |
| 5. Laporan Hutang Dagang | Per vendor: tagihan (barang diterima) − dibayar = sisa hutang, umur dari jatuh tempo (Belum JT, 1-30, 31-60, 61-90, >90), uang muka yang belum terpakai, rincian per PO |

```
title 12 - Purchasing

actor Purchase
actor Finance
actor Logistik
participant "Sistem" as Sys

Purchase->Sys:Vendor (nama, alamat, telp, contact person)
Purchase->Sys:Purchase Request: vendor + barang, satuan, harga → "Ajukan"
Finance->Sys:"ACC" / "Tolak"
Purchase->Sys:"Buat Purchase Order" → term of payment + tax → "Ajukan ACC"
Finance->Sys:"Setujui PO" → "Pesan ke Supplier"
opt term Uang Muka
  Finance->Sys:"Bayar Supplier" → Uang Muka (DP) → Bon Merah
end
Logistik->Sys:"Receive Items" (Penerimaan Barang) → stok + hutang dagang
note right of Sys:jatuh tempo = tanggal terima + tempo
Finance->Sys:"Bayar Supplier" → Pelunasan / Cicilan → Bon Merah
Finance->Sys:Laporan Hutang Dagang (umur hutang) · Laporan Pembelian
```

---

## 13. Rekap Project, Jual Alat di Proyek & Kasir → Jurnal → COA

Dari catatan user (Okt 2026, batch 3).

### A. Rekap Project (dulu "Penyewaan")

| Catatan user | Di prototype |
|---|---|
| PIC di pelanggan ganti PM | Label **PM (Project Manager)** di form & detail pelanggan, proyek, invoice (field data tetap `pic`) |
| Penyewaan ganti jadi Rekap Project | Menu `rentals.html` = **Rekap Project**. Tombol buat = **Order Sewa Baru** (tetap di-ACC Staff Piutang) |
| Periode awal & akhir sewa, kebutuhan & kepulangan | Kolom **Periode Awal Sewa**, **Akhir Sewa**, **Kebutuhan**, **Terkirim**, **Kepulangan**, **Di Proyek** di daftar & detail |
| Persentase di detail | **% Terkirim** = terkirim ÷ kebutuhan, **% Kepulangan** = kepulangan ÷ terkirim (per alat & total, dengan progress bar) |
| On Progress kalau masih di jalan | Status **On Progress** selama ada surat jalan kirim / pemulangan berstatus Departed / Arrived |
| Proyek ditambah pengiriman & pemulangan | Detail proyek: tombol **Pengiriman (SJ Kirim)** & **Pemulangan (SJ Pulang)** (pilih rekap), tab **Pengiriman** & **Pemulangan**, ringkasan % |

Kepulangan menghitung alat yang sudah tiba di gudang (termasuk yang masih menunggu inspeksi).

### B. Jual alat yang ada di proyek (hapus fitur Hilang)

- Inspeksi pengembalian hanya **Baik / Rusak**. Kalau ada alat yang tidak ikut kembali, qty pemulangan dikurangi otomatis dan sisanya tetap tercatat di proyek.
- Alat hilang / dibeli pelanggan di lokasi: **Penjualan → Sumber Alat: lokasi proyek** (tombol **Jual Alat di Proyek** di Rekap Project / Proyek / Inspeksi).
- Aturan "harus dipulangin dulu baru bisa dijual": saat order jual di-ACC Staff Piutang, sistem membuat **Surat Jalan Pemulangan (administratif)** proyek → gudang (SJR), mencatat kepulangan di Rekap Project (sewa berhenti dihitung), lalu stok dipesan untuk **Surat Jalan Jual** seperti biasa.
- Klaim sekarang hanya untuk **alat rusak**. Dokumen stok HL (Hilang) tidak dipakai lagi; data contoh lama sudah dikonversi (SO-003, SJR-2608-003, PJ-2608-001, INV-005 jadi invoice Jual).

### C. Kasir → Generate → Jurnal → COA

| Catatan user | Di prototype |
|---|---|
| Muaranya dari kasir, form: tanggal, proyek, kode transaksi dari rekening, notes, cash / debit, nominal debet / kredit | **Buku Kas & Bank → Input Transaksi Kas**. Kode transaksi otomatis `BB/BM + KODE REKENING-YYMM-NNN` (mis. `BMKAS-2610-001`, lihat bagian 14). Kode rekening diisi di Rekening Perusahaan |
| Jurnal ada kategori (pakan hewan, ATK, dll.) | Master **Kategori Jurnal** (COA → tab Kategori Jurnal). Kategori menentukan **akun COA** di jurnal dan **baris Laporan Kas** |
| Kas bisa koreksi atau tambah sendiri | Belum di-generate → **Ubah / Hapus** langsung. Sudah masuk jurnal → **Koreksi** (bon pembalik + transaksi pengganti, jejak tetap ada) |
| Laporan kas masuk accounting setelah di-generate, lalu ke COA | **Laporan Kas → Generate ke Jurnal** (Accounting). Sebelum generate, transaksi kasir belum masuk Jurnal / Buku Besar / COA |
| Finance langsung masuk jurnal | Input oleh role **Finance** / **Accounting & Tax** langsung berstatus *Masuk jurnal* |
| COA periode per bulan, total semua, pie chart | **COA**: pilih bulan & tahun → saldo awal bulan, debet, kredit, saldo akhir per akun & kelompok, tabel total per jenis akun, pie **biaya per kelompok akun** & **biaya per kategori jurnal** |

Kasir = role **Kasir** (dulu Administrasi; hak akses Rekening/Kas: lihat & input).

```
title 13 - Kasir → Generate → Jurnal → COA

actor Kasir
actor Finance
actor Accounting
participant "Buku Kas & Bank" as Kas
participant "Laporan Kas" as LK
participant "Jurnal → Buku Besar" as J
participant "COA (per bulan)" as COA

Kasir->Kas:"Input Transaksi Kas"
tanggal, rekening (kode otomatis), proyek,
kategori, cash/debit, debet ATAU kredit, notes
Kas-->Kasir:status **Menunggu generate** (saldo kas langsung berubah)
opt salah input
  Kasir->Kas:"Ubah" / "Hapus" (selama belum di-generate)
end
Finance->Kas:"Input Transaksi Kas"
Kas->J:langsung **Masuk jurnal**
Accounting->LK:cek Laporan Kas → "Generate N transaksi"
LK->J:transaksi kasir **Masuk jurnal** (batch GEN-YYMM-NNN)
akun lawan = akun dari kategori jurnal
J->COA:saldo awal bulan, debet, kredit, saldo akhir
+ total per jenis akun + pie chart
opt koreksi setelah masuk jurnal
  Kasir->Kas:"Koreksi" + alasan
  Kas->J:bon pembalik + transaksi pengganti
end
```

---

## 14. DATA TKN.xlsx: Logistik, Rekap Tagihan, Rekap Stock & LAPKEU

Dari file `excel/DATA TKN.xlsx` + catatan user (Okt 2026, batch 4).

### A. Logistik (Ekspedisi & Driver digabung)

- Perusahaan keluarga: **PT penyedia alat** (`company.name`) + **PT pengirim alat** (`company.logistics.name`). Tetap **satu aplikasi / satu proyek**; PT pengirim = role **Logistik**.
- Role **Ekspedisi** dan **Driver** (beserta portal driver) dihapus. **Logistik** sekarang: gudang & stok, **kendaraan & pengemudi** (menu pindah ke LOGISTIK & STOK), surat jalan, **estimasi** kirim / jemput, **update posisi**, inspeksi.
- Pengemudi tetap jadi data master (nama di surat jalan), tapi tidak login.
- **Keterlambatan dari estimasi dibebankan ke Logistik**, bukan customer. Biaya keterlambatan di Rekap Tagihan dihapus; customer bayar sewa sesuai tanggal SJ.
- **Surat Jalan → tab Denda Logistik**: SJ yang tiba lewat estimasi (toleransi `logisticsLateGraceMinutes`, default 2 jam). Denda = qty × harga sewa ÷ 30 × hari telat × `logisticsLateRate` (default 1). Cetak surat jalan mencantumkan PT pengangkut.

### B. Rekap Tagihan (sheet REKAP TAGIHAN)

- Header: **Kepada Yth** (pelanggan), **Proyek**, **Periode Sewa**.
- Baris dikelompokkan per **No. PO customer** (field baru di Order Sewa), lalu per alat & per SJ.
- Kolom: Nama Barang · Periode Sewa Awal / Akhir · **Hari (D)** · **Bulan (M)** · **Qty (Q)** · **Harga (P)** · **Jumlah (D×Q×P)/M**.
- Footer: **TOTAL → DPP 11/12 → PPN 12% → TOTAL TAGIHAN** (efektif 11%). Invoice menyimpan DPP nilai lain; XML Coretax sudah memakai DPP 11/12 & tarif 12%.
- Hari = Akhir − Awal **+ 1** (aturan sheet DATA). Catatan: rumus di sheet REKAP TAGIHAN `=D−C` tanpa +1; perlu dikonfirmasi ke user.

### C. Rekap Stock (sheet REKAP STOCK)

- **Stok Proyek → tab Format Rekap Stock**: baris = surat jalan (tanggal + nomor), kolom = alat. TOTAL PENGIRIMAN, SISA PO / KEBUTUHAN, baris pemulangan, TOTAL PEMULANGAN, **SISA ALAT DI PROYEK**. Bisa export CSV.
- Nomor surat jalan baru mengikuti format user: `NNN/BULAN ROMAWI/YY/JKT-SW` (kirim), `…/JKT-KBL` (pemulangan), `…/JKT-JL` (jual). Kode `JKT` di `company.sjCode`. Data lama tetap `SJK-/SJR-/PJ-`.

### D. LAPKEU

- Kode transaksi kas mengikuti contoh `BMBCA01`: **BB/BM + kode rekening + periode + urut**, mis. `BMBCA-2610-001`, `BBKAS-2610-002`.
- Buku Kas & Export CSV memakai urutan kolom **Kode Transaksi · Tanggal · Source · Nama Transaksi · Jurnal · Debet · Kredit**.
- Akun baru dari format Laba Rugi: 6-3007 Biaya Ekspedisi, 6-3008 Biaya Komisi, 6-2011 Biaya Administrasi, 7-1005 Pendapatan Sewa (TVW). Kategori jurnal baru: *Biaya Ekspedisi (PT Logistik)*.
- Kertas kerja (Neraca 2025 · Mutasi · Adjustment · Neraca · Laba Rugi), laba rugi per proyek & keseluruhan, neraca per rekening, PPN & PPh 23 → XML Coretax: sudah ada sebelumnya.

---

## Lampiran A - Peta Menu Sidebar

| Grup | Menu | File |
|---|---|---|
| - | Dasbor | `dashboard.html` |
| PELANGGAN & ORDER | Pelanggan (master) | `customers.html`, `customer-detail.html` |
| | Proyek | `projects.html`, `project-create.html`, `project-detail.html` |
| | Rekap Project (order sewa) | `rentals.html`, `rental-create.html`, `rental-detail.html` |
| | Penjualan | `sales.html`, `sale-create.html`, `sale-detail.html` |
| | Klaim | `claims.html`, `claim-detail.html` |
| PIUTANG | Persetujuan Order | `approvals.html` |
| | Rekap Tagihan | `billing.html` |
| | Invoice | `invoices.html`, `invoice-detail.html`, `invoice-shadow.html` |
| | Pembayaran Tagihan | `payments.html` |
| | Laporan Piutang | `receivables.html` |
| LOGISTIK & STOK | Surat Jalan & Pengiriman | `deliveries.html`, `delivery-detail.html` |
| | Pengembalian (Inspeksi) | `returns.html`, `return-detail.html` |
| | Stok Gudang | `stock.html` |
| | Perpindahan Stok | `stock-mutations.html` |
| | Stok Proyek | `project-stock.html` |
| | Laporan Stok | `stock-report.html` |
| | Kendaraan / Pengemudi (dikelola Logistik) | `vehicles.html`, `vehicle-detail.html`, `drivers.html`, `driver-detail.html` |
| INVENTARIS | Alat Berat | `equipment.html`, `equipment-detail.html` |
| | Gudang | `branches.html`, `branch-detail.html` |
| | Log Pergerakan Aset | `movements.html`, `movement-detail.html` |
| PEMBELIAN | Purchase Request | `purchase-requests.html` |
| | Purchase Order | `purchases.html`, `purchase-create.html`, `purchase-detail.html` |
| | Penerimaan Barang | `goods-receipts.html`, `goods-receipt-detail.html` |
| | Vendor / Supplier | `vendors.html` |
| | Laporan Pembelian | `purchase-report.html` |
| | Laporan Hutang Dagang | `payables.html` |
| DATA MASTER | Rekening Perusahaan | `accounts.html` |
| KEUANGAN | Buku Kas & Bank | `finance-ledger.html` |
| | Laporan Kas | `cash-report.html` |
| | Rekonsiliasi Bank | `bank-reconciliation.html` |
| AKUNTANSI | Bagan Akun (COA) | `coa.html` |
| | Jurnal | `journal.html` |
| | Buku Besar | `general-ledger.html` |
| | Kertas Kerja | `worksheet.html` |
| | Jurnal Penyesuaian | `adjustments.html` |
| | Laba Rugi | `profit-loss.html` |
| | Neraca | `balance-sheet.html` |
| PAJAK | PPN | `tax-ppn.html` |
| | PPh 23 | `tax-pph23.html` |
| ADMINISTRASI | Permintaan Perubahan | `edit-requests.html` |
| | Pengguna / Peran | `users.html`, `roles.html`, `role-create.html` |
| ~~Portal Driver~~ | **Dihapus** (batch 4): role Driver digabung ke Logistik | - |

## Lampiran B - Daftar Status

| Dokumen | Urutan status |
|---|---|
| Rekap Project (order sewa) | Draft → Pending Approval → Approved → Preparing → Partially Delivered → On Rental → Partially Returned → Completed. Cabang: Rejected (→ Resubmit), Cancelled. **On Progress** (ada SJ di jalan) & Overdue tampil otomatis. |
| Pengiriman (DLV) | Preparing / Assigned → Departed → Arrived → Completed. Cabang: Departed → Failed → Rescheduled |
| Pengembalian (RET) | Inspection → Completed |
| Klaim | Draft → Pending Customer Confirmation → Approved → Invoiced → Paid (otomatis saat invoice lunas) → Closed. Cabang: Disputed → (Force Approve) Approved / Closed |
| Perbaikan (REP) | Pending → In Repair → Completed / Unrepairable |
| Perawatan (MT) | In Progress → Completed |
| Invoice | Bayangan → Belum Dibayar → Dibayar Sebagian → Lunas. Jatuh Tempo tampil otomatis. Cabang: Dibatalkan |
| Pembelian (PO) | Draft / Requested → Approved → Ordered → (In Transit → Arrived) → Partially Received → Received → Completed. Cabang: Cancelled (sebelum ada barang diterima) |
| Transaksi Kas / Bank | Menunggu generate (input kasir) → Masuk jurnal (generate Accounting / input Finance). Koreksi: bon pembalik + pengganti. Rekonsiliasi ✓ khusus akun Bank |
| Rekonsiliasi Bank (REK) | Cocok (selisih 0) / Ada Selisih |

## Lampiran C - Kode Dokumen Stok

| Kode | Arti | Efek |
|---|---|---|
| SA | Saldo Awal | + stok gudang (saat daftar alat baru) |
| PB | Pembelian (supplier) | + stok gudang |
| PR | Produksi / Rakit Sendiri | + stok gudang |
| LB | Kelebihan Alat (selisih lebih) | + stok gudang |
| TG | Transit Antar Gudang | − gudang asal, + gudang tujuan |
| SJK | Surat Jalan Kirim | gudang → proyek (**mulai sewa**) |
| SJR | Surat Jalan Pulang | proyek → gudang (**berhenti sewa**). Juga dibuat otomatis (administratif) sebelum alat di proyek dijual |
| AF | Afkir | − stok gudang rusak |
| PJ | Penjualan ke Customer | − stok gudang |

## Lampiran C2 - Kode Dokumen Keuangan

| Kode | Arti | Dibuat dari |
|---|---|---|
| INV | Invoice (Sewa / Klaim / Bayangan) | Rekap Tagihan, Invoice Bayangan, Klaim "Generate Invoice" |
| PAY | Pembayaran invoice | "Catat Pembayaran" |
| BB | **Bon Biru**: kas / bank masuk (menambah saldo) | "Bon Biru (Masuk)", pembayaran invoice (otomatis), sisi tujuan "Pindah Dana" |
| BM | **Bon Merah**: kas / bank keluar (mengurangi saldo) | "Bon Merah (Keluar)", "Bayar Supplier", sisi asal "Pindah Dana" |
| REK | Rekonsiliasi Bank | "Simpan Rekonsiliasi" |
| JP | Jurnal Penyesuaian | "Tambah Jurnal Penyesuaian" (`JP-YYMM-NNN`); `JP-STOK` = penyesuaian persediaan otomatis |

Format kode transaksi baru (LAPKEU): `BB` / `BM` + kode rekening + `-YYMM-NNN` (mis. `BMKAS-2610-001`, `BBBCA-2610-003`), urut per rekening per bulan. Data lama tetap `BB-YYMM-NNN` / `BM-YYMM-NNN`.

| GEN | Batch generate Laporan Kas ke jurnal | "Generate" di Laporan Kas (Accounting) |

## Lampiran D - Batasan Prototype

Ini bukan bagian dari flow. Bug yang ditemukan saat memetakan flow sudah diperbaiki. Yang tersisa di bawah ini adalah **batasan / aturan sengaja** yang perlu diketahui saat mencoba.

**Uang / kas**
- Uang keluar dicatat **manual** lewat Bon Merah (pembayaran supplier sudah ada tombol "Bayar Supplier" di detail PO). Biaya perbaikan, perawatan, dan ongkos kirim belum otomatis membuat Bon Merah.
- "Pindah Dana" hanya bisa **dari akun Bank** (ke Kas atau Bank lain), sesuai catatan Laporan Kas. Setor tunai dari Kas ke Bank belum ada.
- Bon Merah ditolak kalau saldo akun tidak cukup.
- Bon yang berasal dari pembayaran invoice tidak bisa dihapus dari Buku Kas & Bank, dan pembayaran invoice belum bisa dibatalkan.
- Rekonsiliasi hanya melihat transaksi **di dalam periode** yang dipilih. Transaksi periode sebelumnya yang belum cocok tidak ikut terbawa.
- Nilai klaim (alat rusak) default = 30% × harga sewa/bulan × 10, belum dari harga beli alat. Nilainya bisa diubah di detail klaim.
- Generate Laporan Kas memproses semua transaksi kasir sampai tanggal akhir periode yang dipilih (belum bisa pilih per transaksi).

**Akuntansi & pajak**
- Pembelian diakui saat barang diterima (dokumen PB), dinilai harga PO + PPN Masukan 11% (produksi internal tanpa PPN). Nilai persediaan memakai harga PO terakhir per alat.
- Tahun buku contoh hanya 2026; saldo awal tahun berikutnya belum otomatis ditutup dari tahun sebelumnya.
- PPh 23 dicatat lewat Jurnal Penyesuaian (Bon Merah dicatat neto, penyesuaian menambah biaya ke bruto + Hutang PPh 23).
- Format XML Coretax mengikuti template impor (Faktur: `TaxInvoiceBulk`, Bupot: `BpuBulk`). Kode barang/jasa, satuan (`UM.0033`) dan kode objek pajak perlu dicocokkan dengan referensi Coretax sebelum dipakai sungguhan.

**Hak akses**
- Hak akses berlaku per **halaman** (menu & URL) dan untuk tombol **Setujui**. Tombol lain (buat, ubah, hapus) belum dibatasi per aksi.
- Peran Super Admin & Driver tidak bisa diubah dari menu Peran.

**Lainnya**
- Data disimpan di browser (localStorage). Setiap kali versi data contoh dinaikkan, data uji coba di browser ter-reset.
