/* ============================================================
   EquipRent Enterprise - Mock Data (DATA BERSIH untuk uji end-to-end)
   Transaksi contoh dikosongkan. Yang tersisa hanya data awal perusahaan:
   pengguna & role, gudang, alat + stok awal, pengemudi, kendaraan,
   rekening + saldo awal, bagan akun (COA) dan kategori jurnal.
   ============================================================ */

const MockData = {
  // ---- PELANGGAN — kosong, diisi lewat menu Pelanggan ----
  customers: [],

  // ---- PROYEK — kosong, diisi lewat menu Proyek (requirements = kebutuhan alat) ----
  projects: [],

  // ---- KATEGORI ALAT (tetap) ----
  equipmentCategories: ["Generator","Cable","Ladder","Welding","Compressor","Lighting","Pump","Tools"],

  // ---- ALAT BERAT (master, semua tersedia di gudang) ----
  equipment: [
    {"id":"GEN-001","name":"Generator 50 KVA","category":"Generator","serial":"GN-2024-001","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":5000000},
    {"id":"GEN-002","name":"Generator 50 KVA","category":"Generator","serial":"GN-2024-002","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":5000000},
    {"id":"GEN-003","name":"Generator 100 KVA","category":"Generator","serial":"GN-2024-003","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":8500000},
    {"id":"GEN-004","name":"Generator 100 KVA","category":"Generator","serial":"GN-2024-004","condition":"Good","branch":"Bekasi","branchId":"BR-002","availability":"Available","project":null,"status":"Available","rate":8500000},
    {"id":"GEN-005","name":"Generator 50 KVA","category":"Generator","serial":"GN-2024-005","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":5000000},
    {"id":"CAB-001","name":"Power Cable 50m","category":"Cable","serial":"CB-2024-001","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":500000},
    {"id":"CAB-002","name":"Power Cable 50m","category":"Cable","serial":"CB-2024-002","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":500000},
    {"id":"CAB-003","name":"Power Cable 100m","category":"Cable","serial":"CB-2024-003","condition":"Good","branch":"Bekasi","branchId":"BR-002","availability":"Available","project":null,"status":"Available","rate":900000},
    {"id":"LAD-001","name":"Aluminium Ladder 6m","category":"Ladder","serial":"LD-2024-001","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":300000},
    {"id":"LAD-002","name":"Aluminium Ladder 6m","category":"Ladder","serial":"LD-2024-002","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":300000},
    {"id":"LAD-003","name":"Aluminium Ladder 8m","category":"Ladder","serial":"LD-2024-003","condition":"Good","branch":"Bekasi","branchId":"BR-002","availability":"Available","project":null,"status":"Available","rate":450000},
    {"id":"WLD-001","name":"Welding Machine 400A","category":"Welding","serial":"WL-2024-001","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":3500000},
    {"id":"WLD-002","name":"Welding Machine 400A","category":"Welding","serial":"WL-2024-002","condition":"Good","branch":"Bekasi","branchId":"BR-002","availability":"Available","project":null,"status":"Available","rate":3500000},
    {"id":"CMP-001","name":"Air Compressor 10HP","category":"Compressor","serial":"AC-2024-001","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":4000000},
    {"id":"CMP-002","name":"Air Compressor 10HP","category":"Compressor","serial":"AC-2024-002","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":4000000},
    {"id":"LGT-001","name":"Tower Light 4x1000W","category":"Lighting","serial":"TL-2024-001","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":2500000},
    {"id":"PMP-001","name":"Submersible Pump 4\"","category":"Pump","serial":"SP-2024-001","condition":"Good","branch":"Bekasi","branchId":"BR-002","availability":"Available","project":null,"status":"Available","rate":3000000},
    {"id":"PMP-002","name":"Submersible Pump 4\"","category":"Pump","serial":"SP-2024-002","condition":"Good","branch":"Cileungsi","branchId":"BR-001","availability":"Available","project":null,"status":"Available","rate":3000000},
  ],

  // ---- ORDER SEWA / REKAP PROJECT — kosong ----
  rentals: [],

  // ---- SURAT JALAN — kosong ----
  deliveries: [],

  // ---- PENGEMBALIAN — kosong ----
  returns: [],

  // ---- PENJUALAN — kosong ----
  sales: [],

  // ---- PERMINTAAN PERUBAHAN — kosong ----
  editRequests: [],

  // ---- KLAIM — kosong ----
  claims: [],

  // ---- GUDANG (master) ----
  branches: [
    {"id":"BR-001","code":"CLS","name":"Cileungsi Warehouse","address":"Jl. Raya Narogong KM 15, Cileungsi, Bogor","capacity":500,"status":"Active"},
    {"id":"BR-002","code":"BKS","name":"Bekasi Warehouse","address":"Jl. Raya Industri No. 5, Bekasi","capacity":300,"status":"Active"},
    {"id":"BR-003","code":"BPN","name":"Balikpapan Warehouse","address":"Jl. Mulawarman No. 21, Balikpapan Timur","capacity":200,"status":"Active"},
  ],

  // ---- PERPINDAHAN STOK — hanya saldo awal per gudang (SA) ----
  stockMutations: [
    {"id":"MUT-001","no":"SA-2601-001","date":"2026-01-01","type":"OPENING","from":{"type":"opening"},"to":{"type":"warehouse","id":"BR-001"},"reference":"","notes":"Saldo awal stock opname","user":"System","createdAt":"2026-01-01 08:00","items":[{"equipment":"Generator 50 KVA","qty":18},{"equipment":"Generator 100 KVA","qty":9},{"equipment":"Power Cable 50m","qty":90},{"equipment":"Power Cable 100m","qty":40},{"equipment":"Aluminium Ladder 6m","qty":22},{"equipment":"Aluminium Ladder 8m","qty":10},{"equipment":"Welding Machine 400A","qty":8},{"equipment":"Air Compressor 10HP","qty":4},{"equipment":"Tower Light 4x1000W","qty":6},{"equipment":"Submersible Pump 4\"","qty":8}]},
    {"id":"MUT-002","no":"SA-2601-002","date":"2026-01-01","type":"OPENING","from":{"type":"opening"},"to":{"type":"warehouse","id":"BR-002"},"reference":"","notes":"Saldo awal stock opname","user":"System","createdAt":"2026-01-01 08:00","items":[{"equipment":"Generator 50 KVA","qty":10},{"equipment":"Generator 100 KVA","qty":6},{"equipment":"Power Cable 50m","qty":50},{"equipment":"Power Cable 100m","qty":21},{"equipment":"Aluminium Ladder 6m","qty":13},{"equipment":"Aluminium Ladder 8m","qty":10},{"equipment":"Welding Machine 400A","qty":6},{"equipment":"Air Compressor 10HP","qty":5},{"equipment":"Tower Light 4x1000W","qty":6},{"equipment":"Submersible Pump 4\"","qty":6}]},
    {"id":"MUT-003","no":"SA-2601-003","date":"2026-01-01","type":"OPENING","from":{"type":"opening"},"to":{"type":"warehouse","id":"BR-003"},"reference":"","notes":"Saldo awal stock opname","user":"System","createdAt":"2026-01-01 08:00","items":[{"equipment":"Generator 50 KVA","qty":6},{"equipment":"Generator 100 KVA","qty":6},{"equipment":"Power Cable 50m","qty":30},{"equipment":"Power Cable 100m","qty":15},{"equipment":"Aluminium Ladder 6m","qty":10},{"equipment":"Aluminium Ladder 8m","qty":6},{"equipment":"Welding Machine 400A","qty":4},{"equipment":"Air Compressor 10HP","qty":3},{"equipment":"Tower Light 4x1000W","qty":6},{"equipment":"Submersible Pump 4\"","qty":5}]},
  ],

  // ---- STOK FISIK PER GUDANG (= saldo awal) ----
  stock: [
    {"equipment":"Generator 50 KVA","branch":"Cileungsi","total":18,"available":18,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Generator 50 KVA","branch":"Bekasi","total":10,"available":10,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Generator 50 KVA","branch":"Balikpapan","total":6,"available":6,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Generator 100 KVA","branch":"Cileungsi","total":9,"available":9,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Generator 100 KVA","branch":"Bekasi","total":6,"available":6,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Generator 100 KVA","branch":"Balikpapan","total":6,"available":6,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Power Cable 50m","branch":"Cileungsi","total":90,"available":90,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Power Cable 50m","branch":"Bekasi","total":50,"available":50,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Power Cable 50m","branch":"Balikpapan","total":30,"available":30,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Power Cable 100m","branch":"Cileungsi","total":40,"available":40,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Power Cable 100m","branch":"Bekasi","total":21,"available":21,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Power Cable 100m","branch":"Balikpapan","total":15,"available":15,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Aluminium Ladder 6m","branch":"Cileungsi","total":22,"available":22,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Aluminium Ladder 6m","branch":"Bekasi","total":13,"available":13,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Aluminium Ladder 6m","branch":"Balikpapan","total":10,"available":10,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Aluminium Ladder 8m","branch":"Cileungsi","total":10,"available":10,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Aluminium Ladder 8m","branch":"Bekasi","total":10,"available":10,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Aluminium Ladder 8m","branch":"Balikpapan","total":6,"available":6,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Welding Machine 400A","branch":"Cileungsi","total":8,"available":8,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Welding Machine 400A","branch":"Bekasi","total":6,"available":6,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Welding Machine 400A","branch":"Balikpapan","total":4,"available":4,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Air Compressor 10HP","branch":"Cileungsi","total":4,"available":4,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Air Compressor 10HP","branch":"Bekasi","total":5,"available":5,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Air Compressor 10HP","branch":"Balikpapan","total":3,"available":3,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Tower Light 4x1000W","branch":"Cileungsi","total":6,"available":6,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Tower Light 4x1000W","branch":"Bekasi","total":6,"available":6,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Tower Light 4x1000W","branch":"Balikpapan","total":6,"available":6,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Submersible Pump 4\"","branch":"Cileungsi","total":8,"available":8,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Submersible Pump 4\"","branch":"Bekasi","total":6,"available":6,"reserved":0,"damaged":0,"maintenance":0},
    {"equipment":"Submersible Pump 4\"","branch":"Balikpapan","total":5,"available":5,"reserved":0,"damaged":0,"maintenance":0},
  ],

  // ---- PENGEMUDI (master) ----
  drivers: [
    {"id":"DRV-001","name":"Budi Santoso","phone":"081234567890","licenseNumber":"SIM-A-12345","licenseExpiry":"2028-06-15","status":"Available","currentDelivery":null},
    {"id":"DRV-002","name":"Andi Pratama","phone":"081234567891","licenseNumber":"SIM-A-12346","licenseExpiry":"2027-11-20","status":"Available","currentDelivery":null},
    {"id":"DRV-003","name":"Dimas Saputra","phone":"081234567892","licenseNumber":"SIM-A-12347","licenseExpiry":"2028-03-10","status":"Available","currentDelivery":null},
    {"id":"DRV-004","name":"Rizky Fauzan","phone":"081234567893","licenseNumber":"SIM-A-12348","licenseExpiry":"2027-09-05","status":"Available","currentDelivery":null},
    {"id":"DRV-005","name":"Hendra Wijaya","phone":"081234567894","licenseNumber":"SIM-A-12349","licenseExpiry":"2026-12-01","status":"Available","currentDelivery":null},
  ],

  // ---- KENDARAAN (master) ----
  vehicles: [
    {"id":"VHC-001","plate":"B 1234 XYZ","type":"Truck","brand":"Mitsubishi Colt Diesel","capacity":"5 Ton","driverId":"DRV-001","driverName":"Budi Santoso","status":"Available","currentDelivery":null},
    {"id":"VHC-002","plate":"B 5678 ABC","type":"Truck","brand":"Hino Dutro","capacity":"3 Ton","driverId":"DRV-002","driverName":"Andi Pratama","status":"Available","currentDelivery":null},
    {"id":"VHC-003","plate":"B 9012 DEF","type":"Truck","brand":"Isuzu Elf","capacity":"4 Ton","driverId":"DRV-003","driverName":"Dimas Saputra","status":"Available","currentDelivery":null},
    {"id":"VHC-004","plate":"B 3456 GHI","type":"Pickup","brand":"Toyota Hilux","capacity":"1 Ton","driverId":null,"driverName":null,"status":"Available","currentDelivery":null},
    {"id":"VHC-005","plate":"B 7890 JKL","type":"Truck","brand":"Mitsubishi Colt Diesel","capacity":"5 Ton","driverId":null,"driverName":null,"status":"Available","currentDelivery":null},
  ],

  // ---- PURCHASE ORDER — kosong ----
  purchases: [],

  // ---- VENDOR — kosong, diisi lewat menu Vendor / Supplier ----
  vendors: [],

  // ---- PURCHASE REQUEST — kosong ----
  purchaseRequests: [],

  // ---- LOG PERGERAKAN ASET — kosong ----
  movements: [],

  // ---- INVOICE — kosong ----
  invoices: [],

  // ---- PEMBAYARAN — kosong ----
  payments: [],

  // ---- BUKU KAS & BANK — kosong (saldo awal ada di rekening) ----
  ledger: [],

  // ---- REKONSILIASI BANK — kosong ----
  reconciliations: [],

  // ---- REKENING PERUSAHAAN (master, openingBalance = saldo awal 2026) ----
  accounts: [
    {"id":"ACC-001","code":"BCA","name":"BCA Operational","kind":"Bank","bank":"BCA","accountNumber":"1234567890","accountHolder":"PT EquipRent Indonesia","type":"Operational","branch":"Cileungsi","openingBalance":500000000,"status":"Active"},
    {"id":"ACC-002","code":"MDR","name":"Mandiri Corporate","kind":"Bank","bank":"Mandiri","accountNumber":"0987654321","accountHolder":"PT EquipRent Indonesia","type":"Corporate","branch":"Cileungsi","openingBalance":250000000,"status":"Active"},
    {"id":"ACC-003","code":"BNI","name":"BNI Savings","kind":"Bank","bank":"BNI","accountNumber":"1122334455","accountHolder":"PT EquipRent Indonesia","type":"Savings","branch":"Cileungsi","openingBalance":100000000,"status":"Active"},
    {"id":"ACC-004","code":"BCB","name":"BCA Bekasi","kind":"Bank","bank":"BCA","accountNumber":"5566778899","accountHolder":"PT EquipRent Indonesia","type":"Operational","branch":"Bekasi","openingBalance":50000000,"status":"Active"},
    {"id":"ACC-005","code":"KAS","name":"Kas Kantor Cileungsi","kind":"Kas","bank":"-","accountNumber":"-","accountHolder":"Kasir Cileungsi","type":"Petty Cash","branch":"Cileungsi","openingBalance":25000000,"status":"Active"},
  ],

  // ---- BAGAN AKUN (opening = saldo awal 2026 / neraca 2025) ----
  coa: [
    {"id":"1-1201","code":"1-1201","name":"Investasi","group":"1-12"},
    {"id":"1-1301","code":"1-1301","name":"Piutang Dagang","group":"1-13"},
    {"id":"1-1302","code":"1-1302","name":"Piutang Dagang Girgant M","group":"1-13"},
    {"id":"1-1303","code":"1-1303","name":"Piutang Dagang Sumpit","group":"1-13"},
    {"id":"1-1304","code":"1-1304","name":"Piutang Pajak (PPh 23 Dibayar Dimuka)","group":"1-13","tax":"PPH23_PREPAID"},
    {"id":"1-1305","code":"1-1305","name":"Pendapatan yang Masih Harus Diterima","group":"1-13"},
    {"id":"1-1401","code":"1-1401","name":"Pinjaman Karyawan","group":"1-14","opening":3500000},
    {"id":"1-1402","code":"1-1402","name":"Pinjaman Mandor","group":"1-14"},
    {"id":"1-1403","code":"1-1403","name":"Pinjaman Proyek","group":"1-14"},
    {"id":"1-1404","code":"1-1404","name":"Pinjaman Proyek Undip","group":"1-14"},
    {"id":"1-1405","code":"1-1405","name":"Pinjaman Surabaya","group":"1-14"},
    {"id":"1-1406","code":"1-1406","name":"Pinjaman Bali","group":"1-14"},
    {"id":"1-1501","code":"1-1501","name":"Persediaan Barang Dagangan","group":"1-15","opening":7401000000},
    {"id":"1-1502","code":"1-1502","name":"Persediaan Barang Dagangan Sumpit","group":"1-15"},
    {"id":"1-1601","code":"1-1601","name":"Uang Muka Import","group":"1-16"},
    {"id":"1-1602","code":"1-1602","name":"Uang Jaminan Sewa","group":"1-16","opening":25000000},
    {"id":"1-2001","code":"1-2001","name":"Inventaris Kendaraan","group":"1-2","opening":650000000},
    {"id":"1-2002","code":"1-2002","name":"Akumulasi Penyusutan Kendaraan","group":"1-2","opening":243750000,"normal":"K"},
    {"id":"1-2003","code":"1-2003","name":"Inventaris Kantor","group":"1-2","opening":85000000},
    {"id":"1-2004","code":"1-2004","name":"Akumulasi Penyusutan Kantor","group":"1-2","opening":42500000,"normal":"K"},
    {"id":"1-2005","code":"1-2005","name":"Inventaris Mesin","group":"1-2","opening":240000000},
    {"id":"1-2006","code":"1-2006","name":"Akumulasi Penyusutan Mesin","group":"1-2","opening":96000000,"normal":"K"},
    {"id":"2-1001","code":"2-1001","name":"Hutang Dagang","group":"2-1"},
    {"id":"2-1002","code":"2-1002","name":"Hutang Dagang Girgant K","group":"2-1"},
    {"id":"2-1003","code":"2-1003","name":"Hutang Dagang Sumpit","group":"2-1"},
    {"id":"2-2001","code":"2-2001","name":"Hutang PPh 23","group":"2-2","tax":"PPH23_PAYABLE"},
    {"id":"2-2002","code":"2-2002","name":"PPN Masukan dan Keluaran","group":"2-2","tax":"PPN"},
    {"id":"2-3001","code":"2-3001","name":"Biaya yang Masih Harus Dibayar","group":"2-3"},
    {"id":"2-3002","code":"2-3002","name":"Uang Muka Masuk dan Keluar","group":"2-3"},
    {"id":"2-3003","code":"2-3003","name":"Pinjaman Pemegang Saham","group":"2-3","opening":300000000},
    {"id":"2-3004","code":"2-3004","name":"Hutang Bank","group":"2-3","opening":450000000},
    {"id":"3-0001","code":"3-0001","name":"Modal","group":"3-0","opening":5000000000},
    {"id":"3-0002","code":"3-0002","name":"Laba Ditahan","group":"3-0","opening":3197250000},
    {"id":"3-0003","code":"3-0003","name":"Laba / Rugi Berjalan","group":"3-0","system":true},
    {"id":"4-0001","code":"4-0001","name":"Penjualan","group":"4-0"},
    {"id":"4-0002","code":"4-0002","name":"Pendapatan Sewa","group":"4-0"},
    {"id":"4-0003","code":"4-0003","name":"Penjualan (Ongkir atau Ganti Rugi)","group":"4-0"},
    {"id":"4-0004","code":"4-0004","name":"Penjualan Sumpit","group":"4-0"},
    {"id":"4-0005","code":"4-0005","name":"Retur Penjualan","group":"4-0","normal":"D"},
    {"id":"5-0001","code":"5-0001","name":"HPP Persediaan Barang Dagangan","group":"5-0"},
    {"id":"5-0002","code":"5-0002","name":"Pembelian","group":"5-0"},
    {"id":"5-0003","code":"5-0003","name":"Retur Pembelian","group":"5-0","normal":"K"},
    {"id":"5-0004","code":"5-0004","name":"HPP Persediaan Barang Dagangan Sumpit","group":"5-0"},
    {"id":"6-1001","code":"6-1001","name":"Biaya Gaji","group":"6-1"},
    {"id":"6-1002","code":"6-1002","name":"Biaya Kesejahteraan Karyawan","group":"6-1"},
    {"id":"6-1003","code":"6-1003","name":"Biaya Pengobatan","group":"6-1"},
    {"id":"6-1004","code":"6-1004","name":"Biaya Perjalanan Dinas","group":"6-1"},
    {"id":"6-2001","code":"6-2001","name":"Biaya Telepon","group":"6-2"},
    {"id":"6-2002","code":"6-2002","name":"Biaya Listrik","group":"6-2"},
    {"id":"6-2003","code":"6-2003","name":"Biaya Tiki dan Materai","group":"6-2"},
    {"id":"6-2004","code":"6-2004","name":"Biaya Izin, Sumbangan dan Iuran","group":"6-2"},
    {"id":"6-2005","code":"6-2005","name":"Biaya ATK","group":"6-2"},
    {"id":"6-2006","code":"6-2006","name":"Biaya Rumah Tangga","group":"6-2"},
    {"id":"6-2007","code":"6-2007","name":"Biaya Entertainment","group":"6-2"},
    {"id":"6-2008","code":"6-2008","name":"Biaya Administrasi Bank","group":"6-2"},
    {"id":"6-2009","code":"6-2009","name":"Biaya Asuransi","group":"6-2"},
    {"id":"6-2010","code":"6-2010","name":"Biaya PPDU","group":"6-2"},
    {"id":"6-2011","code":"6-2011","name":"Biaya Administrasi","group":"6-2"},
    {"id":"6-3001","code":"6-3001","name":"Biaya Marketing","group":"6-3"},
    {"id":"6-3002","code":"6-3002","name":"Biaya Iklan","group":"6-3"},
    {"id":"6-3003","code":"6-3003","name":"Biaya Angkut Penjualan","group":"6-3"},
    {"id":"6-3004","code":"6-3004","name":"Biaya Angkut Pembelian","group":"6-3"},
    {"id":"6-3005","code":"6-3005","name":"Biaya Potongan Penjualan","group":"6-3"},
    {"id":"6-3006","code":"6-3006","name":"Biaya Potongan Pembelian","group":"6-3"},
    {"id":"6-3007","code":"6-3007","name":"Biaya Ekspedisi","group":"6-3"},
    {"id":"6-3008","code":"6-3008","name":"Biaya Komisi","group":"6-3"},
    {"id":"6-4001","code":"6-4001","name":"Biaya Pemeliharaan Kendaraan","group":"6-4"},
    {"id":"6-4002","code":"6-4002","name":"Biaya Pemeliharaan Peralatan Kantor","group":"6-4"},
    {"id":"6-4003","code":"6-4003","name":"Biaya Pemeliharaan Inventaris Mesin","group":"6-4"},
    {"id":"6-4004","code":"6-4004","name":"Biaya Pemeliharaan Gedung","group":"6-4"},
    {"id":"6-4005","code":"6-4005","name":"Biaya Pemeliharaan Gedung Baru","group":"6-4"},
    {"id":"6-5001","code":"6-5001","name":"Biaya Sewa Kendaraan","group":"6-5"},
    {"id":"6-5002","code":"6-5002","name":"Biaya Sewa Kontrakan","group":"6-5"},
    {"id":"6-5003","code":"6-5003","name":"Biaya Sewa Peralatan","group":"6-5"},
    {"id":"6-5004","code":"6-5004","name":"Biaya Sewa ATK","group":"6-5"},
    {"id":"6-5005","code":"6-5005","name":"Biaya Sewa Scaffolding","group":"6-5"},
    {"id":"6-6001","code":"6-6001","name":"Biaya Scaffolding","group":"6-6"},
    {"id":"6-6002","code":"6-6002","name":"Biaya Ringlock","group":"6-6"},
    {"id":"6-6003","code":"6-6003","name":"Biaya Hotdip","group":"6-6"},
    {"id":"6-6004","code":"6-6004","name":"Biaya Bekisting","group":"6-6"},
    {"id":"6-6005","code":"6-6005","name":"Biaya WF","group":"6-6"},
    {"id":"6-6006","code":"6-6006","name":"Biaya Cibanteng","group":"6-6"},
    {"id":"6-6007","code":"6-6007","name":"Biaya Sukawangi","group":"6-6"},
    {"id":"6-6008","code":"6-6008","name":"Biaya Cileungsi","group":"6-6"},
    {"id":"6-6009","code":"6-6009","name":"Biaya Pembangunan Gedung Mess","group":"6-6"},
    {"id":"6-6010","code":"6-6010","name":"Biaya Pembangunan Gedung Cileungsi","group":"6-6"},
    {"id":"6-6011","code":"6-6011","name":"Biaya Pembangunan Sukawangi","group":"6-6"},
    {"id":"6-6012","code":"6-6012","name":"Biaya Pembangunan Cibanteng","group":"6-6"},
    {"id":"6-7001","code":"6-7001","name":"Biaya Penyusutan Inventaris Kendaraan","group":"6-7"},
    {"id":"6-7002","code":"6-7002","name":"Biaya Penyusutan Inventaris Kantor","group":"6-7"},
    {"id":"6-7003","code":"6-7003","name":"Biaya Penyusutan Inventaris Mesin","group":"6-7"},
    {"id":"6-8001","code":"6-8001","name":"Biaya PPh dan PPN","group":"6-8"},
    {"id":"6-8002","code":"6-8002","name":"Biaya PPh 2 Persen","group":"6-8"},
    {"id":"6-8003","code":"6-8003","name":"Biaya Pajak","group":"6-8"},
    {"id":"6-8004","code":"6-8004","name":"Biaya Kerugian Penjualan","group":"6-8"},
    {"id":"6-8005","code":"6-8005","name":"Biaya Kerugian Pembelian Zinc","group":"6-8"},
    {"id":"6-8006","code":"6-8006","name":"Biaya Pembatalan Kwitansi","group":"6-8"},
    {"id":"6-8007","code":"6-8007","name":"Biaya Penghapusan Piutang","group":"6-8"},
    {"id":"6-8008","code":"6-8008","name":"Biaya Penghapusan Piutang Karyawan","group":"6-8"},
    {"id":"6-9001","code":"6-9001","name":"Biaya Lain-lain","group":"6-9"},
    {"id":"7-1001","code":"7-1001","name":"Pendapatan Lain-lain","group":"7-1"},
    {"id":"7-1002","code":"7-1002","name":"Pendapatan Bunga Investasi","group":"7-1"},
    {"id":"7-1003","code":"7-1003","name":"Pendapatan Bunga dan Jasa Giro","group":"7-1"},
    {"id":"7-1004","code":"7-1004","name":"Pendapatan Cibanteng","group":"7-1"},
    {"id":"7-1005","code":"7-1005","name":"Pendapatan Sewa (TVW)","group":"7-1"},
    {"id":"7-2001","code":"7-2001","name":"Selisih Kurs","group":"7-2"},
  ],

  // ---- PEMETAAN LAPORAN KAS → COA ----
  coaCashMap: {
    "kas_in_sale": "4-0001",
    "kas_in_ar": "1-1301",
    "kas_in_dp": "2-3002",
    "kas_in_loan": "2-3004",
    "kas_in_refund": "1-1401",
    "kas_in_other": "7-1001",
    "kas_out_opex": "6-9001",
    "kas_out_supplier": "2-1001",
    "kas_out_payroll": "6-1001",
    "kas_out_advance": "1-1401",
    "kas_out_loan": "2-3004",
    "bank_in_loan": "2-3004",
    "bank_in_ar": "1-1301",
    "bank_in_dp": "2-3002",
    "bank_in_refund": "2-1001",
    "bank_in_interest": "7-1003",
    "bank_out_supplier": "2-1001",
    "bank_out_loan": "2-3004",
    "bank_out_admin": "6-2008"
  },

  // ---- KATEGORI JURNAL (dipilih saat input transaksi kas) ----
  journalCategories: [
    {"id":"JC-001","name":"ATK & Materai","type":"OUT","acc":"6-2005","cash":{"Kas":"kas_out_opex","Bank":"bank_out_supplier"}},
    {"id":"JC-002","name":"Pakan Hewan (Anjing Jaga Gudang)","type":"OUT","acc":"6-2006","cash":{"Kas":"kas_out_opex","Bank":"bank_out_supplier"}},
    {"id":"JC-003","name":"BBM, Tol & Parkir","type":"OUT","acc":"6-3003","cash":{"Kas":"kas_out_opex","Bank":"bank_out_supplier"}},
    {"id":"JC-004","name":"Servis & Sparepart Kendaraan","type":"OUT","acc":"6-4001","cash":{"Kas":"kas_out_opex","Bank":"bank_out_supplier"}},
    {"id":"JC-005","name":"Listrik, Air & Telepon","type":"OUT","acc":"6-2002","cash":{"Kas":"kas_out_opex","Bank":"bank_out_supplier"}},
    {"id":"JC-006","name":"Konsumsi & Akomodasi Proyek","type":"OUT","acc":"6-1004","cash":{"Kas":"kas_out_opex","Bank":"bank_out_supplier"}},
    {"id":"JC-007","name":"Gaji & Upah Harian","type":"OUT","acc":"6-1001","cash":{"Kas":"kas_out_payroll","Bank":"bank_out_supplier"}},
    {"id":"JC-008","name":"Sewa Kendaraan / Truk","type":"OUT","acc":"6-5001","cash":{"Kas":"kas_out_opex","Bank":"bank_out_supplier"}},
    {"id":"JC-009","name":"Biaya Administrasi Bank","type":"OUT","acc":"6-2008","cash":{"Kas":"kas_out_opex","Bank":"bank_out_admin"}},
    {"id":"JC-010","name":"Setor Pajak","type":"OUT","acc":"2-2001","cash":{"Kas":"kas_out_payroll","Bank":"bank_out_admin"}},
    {"id":"JC-011","name":"Kasbon Karyawan","type":"OUT","acc":"1-1401","cash":{"Kas":"kas_out_advance","Bank":"bank_out_supplier"}},
    {"id":"JC-012","name":"Bayar Hutang Supplier","type":"OUT","acc":"2-1001","cash":{"Kas":"kas_out_supplier","Bank":"bank_out_supplier"}},
    {"id":"JC-013","name":"Angsuran Pinjaman Bank","type":"OUT","acc":"2-3004","cash":{"Kas":"kas_out_loan","Bank":"bank_out_loan"}},
    {"id":"JC-022","name":"Biaya Ekspedisi (PT Logistik)","type":"OUT","acc":"6-3007","cash":{"Kas":"kas_out_opex","Bank":"bank_out_supplier"}},
    {"id":"JC-014","name":"Biaya Lain-lain","type":"OUT","acc":"6-9001","cash":{"Kas":"kas_out_opex","Bank":"bank_out_supplier"}},
    {"id":"JC-015","name":"Pembayaran Piutang Customer","type":"IN","acc":"1-1301","cash":{"Kas":"kas_in_ar","Bank":"bank_in_ar"}},
    {"id":"JC-016","name":"Uang Muka Customer","type":"IN","acc":"2-3002","cash":{"Kas":"kas_in_dp","Bank":"bank_in_dp"}},
    {"id":"JC-017","name":"Penjualan Tunai / Barang Bekas","type":"IN","acc":"4-0001","cash":{"Kas":"kas_in_sale","Bank":"bank_in_ar"}},
    {"id":"JC-018","name":"Pengembalian Kasbon","type":"IN","acc":"1-1401","cash":{"Kas":"kas_in_refund","Bank":"bank_in_refund"}},
    {"id":"JC-019","name":"Bunga / Jasa Giro","type":"IN","acc":"7-1003","cash":{"Kas":"kas_in_other","Bank":"bank_in_interest"}},
    {"id":"JC-020","name":"Pendapatan Lain-lain","type":"IN","acc":"7-1001","cash":{"Kas":"kas_in_other","Bank":"bank_in_refund"}},
    {"id":"JC-021","name":"Terima Pinjaman","type":"IN","acc":"2-3004","cash":{"Kas":"kas_in_loan","Bank":"bank_in_loan"}},
  ],

  // ---- JURNAL PENYESUAIAN — kosong ----
  journals: [],

  // ---- PENGGUNA ----
  users: [
    {"id":"USR-001","name":"Ahmad Hidayat","username":"admin","email":"ahmad@equiprent.co.id","role":"Admin","branch":"All","status":"Active","lastLogin":"2026-10-09 09:15"},
    {"id":"USR-006","name":"Joko Warehouse","username":"logistik","email":"joko@equiprent.co.id","role":"Logistik","branch":"Cileungsi","status":"Active","lastLogin":"2026-10-09 07:30"},
    {"id":"USR-002","name":"Sari Dewi","username":"piutang","email":"sari@equiprent.co.id","role":"Account Receivable","branch":"Cileungsi","status":"Active","lastLogin":"2026-10-09 08:45"},
    {"id":"USR-003","name":"Maya Finance","username":"finance","email":"maya@equiprent.co.id","role":"Finance","branch":"Cileungsi","status":"Active","lastLogin":"2026-10-09 10:00"},
    {"id":"USR-004","name":"Lina Akuntan","username":"accounting","email":"lina@equiprent.co.id","role":"Accounting & Tax","branch":"Cileungsi","status":"Active","lastLogin":"2026-10-09 08:30"},
    {"id":"USR-005","name":"Rudi Purchasing","username":"purchase","email":"rudi@equiprent.co.id","role":"Purchase","branch":"Cileungsi","status":"Active","lastLogin":"2026-10-08 16:00"},
  ],

  // ---- ROLE ----
  roles: [
    {"id":"ROLE-001","name":"Admin","description":"Akses penuh. Satu-satunya yang boleh mengubah & menghapus data","usersCount":1},
    {"id":"ROLE-006","name":"Logistik","description":"Pelanggan, proyek, order sewa & jual, input kas, gudang & stok, kendaraan & pengemudi, surat jalan, estimasi, inspeksi (PT logistik)","usersCount":1},
    {"id":"ROLE-002","name":"Account Receivable","description":"Staff Piutang: ACC order sewa/jual, rekap tagihan, invoice, piutang","usersCount":1},
    {"id":"ROLE-003","name":"Finance","description":"Kas & bank, pembayaran, rekonsiliasi","usersCount":1},
    {"id":"ROLE-004","name":"Accounting & Tax","description":"Akuntansi, pajak, ACC permintaan perubahan data","usersCount":1},
    {"id":"ROLE-005","name":"Purchase","description":"Pembelian alat & supplier","usersCount":1},
  ],

  // ---- HAK AKSES PER ROLE ----
  permissions: {
    "modules": ["Dashboard","Customers","Projects","Rentals","Sales","Approvals","Deliveries","Returns","Claims","Stock","Equipment","Branches","Movements","Purchases","Drivers","Vehicles","Invoices","Payments","Accounts","Accounting","Tax","Users","Roles"],
    "actions": ["View","Create","Update","Delete","Approve"],
    "matrix": {
      "Admin": {
        "default": true
      },
      "Account Receivable": {
        "modules": {
          "Dashboard": ["View"],
          "Customers": ["View"],
          "Projects": ["View"],
          "Rentals": ["View","Approve"],
          "Sales": ["View","Approve"],
          "Approvals": ["View","Approve"],
          "Deliveries": ["View"],
          "Returns": ["View"],
          "Claims": ["View","Create","Update","Approve"],
          "Stock": ["View"],
          "Invoices": ["View","Create","Update"],
          "Payments": ["View","Create"]
        }
      },
      "Finance": {
        "modules": {
          "Dashboard": ["View"],
          "Customers": ["View"],
          "Invoices": ["View"],
          "Payments": ["View","Create","Update"],
          "Accounts": ["View","Create","Update"],
          "Purchases": ["View","Approve"],
          "Accounting": ["View"],
          "Tax": ["View"]
        }
      },
      "Accounting & Tax": {
        "modules": {
          "Dashboard": ["View"],
          "Customers": ["View"],
          "Accounting": ["View","Create","Update","Approve"],
          "Tax": ["View","Create","Update"],
          "Accounts": ["View"],
          "Invoices": ["View"],
          "Payments": ["View"],
          "Purchases": ["View"],
          "Stock": ["View"]
        }
      },
      "Purchase": {
        "modules": {
          "Dashboard": ["View"],
          "Purchases": ["View","Create","Update"],
          "Stock": ["View"],
          "Equipment": ["View"],
          "Branches": ["View"]
        }
      },
      "Logistik": {
        "modules": {
          "Dashboard": ["View"],
          "Customers": ["View","Create"],
          "Projects": ["View","Create","Update"],
          "Rentals": ["View","Create","Update"],
          "Sales": ["View","Create","Update"],
          "Claims": ["View","Create"],
          "Deliveries": ["View","Create","Update"],
          "Returns": ["View","Create","Update"],
          "Stock": ["View","Create","Update"],
          "Equipment": ["View","Create","Update"],
          "Branches": ["View","Create","Update"],
          "Movements": ["View"],
          "Purchases": ["View","Create"],
          "Drivers": ["View","Create","Update"],
          "Vehicles": ["View","Create","Update"],
          "Invoices": ["View"],
          "Accounts": ["View","Create"]
        }
      }
    }
  },

  // ---- NOTIFIKASI — kosong ----
  notifications: [],

  // ---- LOG AKTIVITAS — kosong ----
  activityLog: [],

  // ---- AKUN DEMO LOGIN (password: demo) ----
  demoUsers: [
    {"username":"admin","password":"demo","name":"Ahmad Hidayat","role":"Admin","branch":"All","initials":"AH"},
    {"username":"logistik","password":"demo","name":"Joko Warehouse","role":"Logistik","branch":"Cileungsi","initials":"JW"},
    {"username":"piutang","password":"demo","name":"Sari Dewi","role":"Account Receivable","branch":"Cileungsi","initials":"SD"},
    {"username":"finance","password":"demo","name":"Maya Finance","role":"Finance","branch":"Cileungsi","initials":"MF"},
    {"username":"accounting","password":"demo","name":"Lina Akuntan","role":"Accounting & Tax","branch":"Cileungsi","initials":"LA"},
    {"username":"purchase","password":"demo","name":"Rudi Purchasing","role":"Purchase","branch":"Cileungsi","initials":"RP"},
  ],

  // ---- PENGATURAN ----
  settings: {
    "billingMonthDays": 30,
    "taxRate": 0.11,
    "paymentTermDays": 30
  },

  // ---- PERUSAHAAN ----
  company: {
    "name": "PT EquipRent Indonesia",
    "address": "Jl. Raya Industri No. 10, Jakarta Utara 14330",
    "phone": "021-555-0100",
    "email": "info@equiprent.co.id",
    "website": "www.equiprent.co.id",
    "taxId": "01.234.567.8-012.000",
    "sjCode": "JKT",
    "logistics": {
      "name": "PT EquipRent Logistik",
      "short": "Logistik"
    }
  },

  // ---- PENERIMAAN BARANG — kosong ----
  goodsReceipts: [],

  // ---- PERPANJANGAN SEWA — kosong ----
  extensions: []
};

// --- Persistence Logic ---
// Naikkan angka ini setiap struktur data seed berubah, supaya localStorage lama di-reset.
const MOCK_SCHEMA_VERSION = '13-data-bersih';

(function() {
  const STORAGE_PREFIX = 'equiprent_';
  const dataKeys = Object.keys(MockData);

  if (localStorage.getItem(STORAGE_PREFIX + '_schema') !== MOCK_SCHEMA_VERSION) {
    dataKeys.forEach(key => localStorage.removeItem(STORAGE_PREFIX + key));
    localStorage.setItem(STORAGE_PREFIX + '_schema', MOCK_SCHEMA_VERSION);
  }

  dataKeys.forEach(key => {
    const storageKey = STORAGE_PREFIX + key;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        MockData[key] = JSON.parse(stored);
      } catch(e) {
        console.error("Error parsing", storageKey);
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(MockData[key]));
    }
  });
})();

// Helper to save data back to local storage
MockData.save = function(key) {
  const storageKey = 'equiprent_' + key;
  if(MockData[key]) {
    localStorage.setItem(storageKey, JSON.stringify(MockData[key]));
  }
};

MockData.reset = function() {
  const dataKeys = Object.keys(MockData).filter(k => typeof MockData[k] !== 'function');
  dataKeys.forEach(key => {
    localStorage.removeItem('equiprent_' + key);
  });
  location.reload();
};

MockData.generateId = function(prefix, collectionKey) {
  const items = MockData[collectionKey] || [];
  let max = 0;
  items.forEach(item => {
    if (item.id && item.id.startsWith(prefix + '-')) {
      const num = parseInt(item.id.replace(prefix + '-', ''));
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return prefix + '-' + String(max + 1).padStart(3, '0');
};
