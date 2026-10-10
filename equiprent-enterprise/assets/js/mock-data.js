/* ============================================================
   EquipRent Enterprise - Mock Data
   Realistic Indonesian business data
   ============================================================ */

const MockData = {
  // ---- CUSTOMERS ----
  customers: [
    { id: 'CUS-001', code: 'PTDCI', name: 'PT Data Center Indonesia', pic: 'Ahmad Hidayat', phone: '021-5550101', email: 'ahmad@datacenter.co.id', address: 'Jl. Sudirman No. 45, Jakarta Selatan', taxId: '01.311.425.6-062.000', status: 'Active' },
    { id: 'CUS-002', code: 'PTIN', name: 'PT Infrastruktur Nusantara', pic: 'Siti Rahmawati', phone: '021-5550202', email: 'siti@infranusa.co.id', address: 'Jl. Gatot Subroto No. 12, Jakarta Selatan', taxId: '02.418.536.7-017.000', status: 'Active' },
    { id: 'CUS-003', code: 'PTMT', name: 'PT Mitra Teknologi', pic: 'Rudi Hartono', phone: '021-5550303', email: 'rudi@mitratek.co.id', address: 'Jl. TB Simatupang No. 88, Jakarta Timur', status: 'Active' },
    { id: 'CUS-004', code: 'PTKE', name: 'PT Karya Engineering', pic: 'Dewi Lestari', phone: '021-5550404', email: 'dewi@karyaeng.co.id', address: 'Jl. Raya Bekasi No. 23, Bekasi', taxId: '01.630.758.9-431.000', status: 'Active' },
    { id: 'CUS-005', code: 'PTBJ', name: 'PT Bangun Jaya Konstruksi', pic: 'Eko Prasetyo', phone: '031-5550505', email: 'eko@bangunjaya.co.id', address: 'Jl. Basuki Rahmat No. 56, Surabaya', taxId: '03.742.851.0-614.000', status: 'Inactive' },
  ],

  // ---- PROJECTS ----
  // requirements = kebutuhan alat proyek (qty + harga satuan), diinput langsung saat buat proyek
  projects: [
    { id: 'PRJ-001', name: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', startDate: '2026-07-01', endDate: '2026-12-31', totalRentals: 3, activeEquipment: 15, status: 'Active',
      requirements: [
        { equipment: 'Generator 50 KVA', qty: 4, unitPrice: 5000000 },
        { equipment: 'Power Cable 50m', qty: 15, unitPrice: 500000 },
        { equipment: 'Aluminium Ladder 6m', qty: 3, unitPrice: 300000 },
        { equipment: 'Tower Light 4x1000W', qty: 4, unitPrice: 2500000 },
        { equipment: 'Air Compressor 10HP', qty: 2, unitPrice: 4000000 },
        { equipment: 'Submersible Pump 4"', qty: 3, unitPrice: 3000000 },
        { equipment: 'Welding Machine 400A', qty: 2, unitPrice: 3500000 },
      ] },
    { id: 'PRJ-002', name: 'Project Data Center Bekasi', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', startDate: '2026-08-01', endDate: '2027-02-28', totalRentals: 2, activeEquipment: 8, status: 'Active',
      requirements: [
        { equipment: 'Generator 100 KVA', qty: 3, unitPrice: 8500000 },
        { equipment: 'Power Cable 100m', qty: 10, unitPrice: 900000 },
      ] },
    { id: 'PRJ-003', name: 'Project Infrastructure Expansion', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', startDate: '2026-06-15', endDate: '2026-11-30', totalRentals: 2, activeEquipment: 12, status: 'Active',
      requirements: [
        { equipment: 'Generator 100 KVA', qty: 2, unitPrice: 8500000 },
        { equipment: 'Aluminium Ladder 8m', qty: 5, unitPrice: 450000 },
        { equipment: 'Submersible Pump 4"', qty: 2, unitPrice: 3000000 },
        { equipment: 'Welding Machine 400A', qty: 3, unitPrice: 3500000 },
        { equipment: 'Air Compressor 10HP', qty: 1, unitPrice: 4000000 },
      ] },
    { id: 'PRJ-004', name: 'Project Warehouse Renovation', customerId: 'CUS-003', customerName: 'PT Mitra Teknologi', startDate: '2026-08-15', endDate: '2026-10-31', totalRentals: 1, activeEquipment: 5, status: 'Active',
      requirements: [
        { equipment: 'Air Compressor 10HP', qty: 2, unitPrice: 4000000 },
        { equipment: 'Welding Machine 400A', qty: 1, unitPrice: 3500000 },
        { equipment: 'Generator 50 KVA', qty: 1, unitPrice: 5000000 },
      ] },
    { id: 'PRJ-005', name: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', startDate: '2026-05-01', endDate: '2026-08-31', totalRentals: 2, activeEquipment: 0, status: 'Completed',
      requirements: [
        { equipment: 'Generator 100 KVA', qty: 1, unitPrice: 8500000 },
        { equipment: 'Power Cable 100m', qty: 5, unitPrice: 900000 },
        { equipment: 'Submersible Pump 4"', qty: 2, unitPrice: 3000000 },
        { equipment: 'Aluminium Ladder 8m', qty: 4, unitPrice: 450000 },
      ] },
    { id: 'PRJ-006', name: 'Project Office Tower', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', startDate: '2026-09-01', endDate: '2027-06-30', totalRentals: 0, activeEquipment: 0, status: 'Planning',
      requirements: [
        { equipment: 'Generator 100 KVA', qty: 4, unitPrice: 8500000 },
        { equipment: 'Tower Light 4x1000W', qty: 6, unitPrice: 2500000 },
        { equipment: 'Power Cable 100m', qty: 12, unitPrice: 900000 },
      ] },
  ],

  // ---- EQUIPMENT CATEGORIES ----
  equipmentCategories: ['Generator', 'Cable', 'Ladder', 'Welding', 'Compressor', 'Lighting', 'Pump', 'Tools'],

  // ---- EQUIPMENT ----
  equipment: [
    { id: 'GEN-001', name: 'Generator 50 KVA', category: 'Generator', serial: 'GN-2024-001', condition: 'Good', branch: 'Cileungsi', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-001', status: 'On Rental', rate: 5000000 },
    { id: 'GEN-002', name: 'Generator 50 KVA', category: 'Generator', serial: 'GN-2024-002', condition: 'Good', branch: 'Cileungsi', branchId: 'BR-001', availability: 'Available', project: null, status: 'Available', rate: 5000000 },
    { id: 'GEN-003', name: 'Generator 100 KVA', category: 'Generator', serial: 'GN-2024-003', condition: 'Good', branch: 'Cileungsi', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-003', status: 'On Rental', rate: 8500000 },
    { id: 'GEN-004', name: 'Generator 100 KVA', category: 'Generator', serial: 'GN-2024-004', condition: 'Good', branch: 'Bekasi', branchId: 'BR-002', availability: 'Available', project: null, status: 'Available', rate: 8500000 },
    { id: 'GEN-005', name: 'Generator 50 KVA', category: 'Generator', serial: 'GN-2024-005', condition: 'Maintenance', branch: 'Cileungsi', branchId: 'BR-001', availability: 'Maintenance', project: null, status: 'Maintenance', rate: 5000000 },
    { id: 'CAB-001', name: 'Power Cable 50m', category: 'Cable', serial: 'CB-2024-001', condition: 'Good', branch: 'Cileungsi', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-001', status: 'On Rental', rate: 500000 },
    { id: 'CAB-002', name: 'Power Cable 50m', category: 'Cable', serial: 'CB-2024-002', condition: 'Good', branch: 'Cileungsi', branchId: 'BR-001', availability: 'Available', project: null, status: 'Available', rate: 500000 },
    { id: 'CAB-003', name: 'Power Cable 100m', category: 'Cable', serial: 'CB-2024-003', condition: 'Good', branch: 'Bekasi', branchId: 'BR-002', availability: 'On Rental', project: 'PRJ-002', status: 'On Rental', rate: 900000 },
    { id: 'LAD-001', name: 'Aluminium Ladder 6m', category: 'Ladder', serial: 'LD-2024-001', condition: 'Good', branch: 'Cileungsi', branchId: 'BR-001', availability: 'Available', project: null, status: 'Available', rate: 300000 },
    { id: 'LAD-002', name: 'Aluminium Ladder 6m', category: 'Ladder', serial: 'LD-2024-002', condition: 'Damaged', branch: 'Cileungsi', branchId: 'BR-001', availability: 'Damaged', project: null, status: 'Damaged', rate: 300000 },
    { id: 'LAD-003', name: 'Aluminium Ladder 8m', category: 'Ladder', serial: 'LD-2024-003', condition: 'Good', branch: 'Bekasi', branchId: 'BR-002', availability: 'On Rental', project: 'PRJ-003', status: 'On Rental', rate: 450000 },
    { id: 'WLD-001', name: 'Welding Machine 400A', category: 'Welding', serial: 'WL-2024-001', condition: 'Good', branch: 'Cileungsi', branchId: 'BR-001', availability: 'Available', project: null, status: 'Available', rate: 3500000 },
    { id: 'WLD-002', name: 'Welding Machine 400A', category: 'Welding', serial: 'WL-2024-002', condition: 'Good', branch: 'Bekasi', branchId: 'BR-002', availability: 'Reserved', project: null, status: 'Reserved', rate: 3500000 },
    { id: 'CMP-001', name: 'Air Compressor 10HP', category: 'Compressor', serial: 'AC-2024-001', condition: 'Good', branch: 'Cileungsi', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-004', status: 'On Rental', rate: 4000000 },
    { id: 'CMP-002', name: 'Air Compressor 10HP', category: 'Compressor', serial: 'AC-2024-002', condition: 'Good', branch: 'Cileungsi', branchId: 'BR-001', availability: 'Available', project: null, status: 'Available', rate: 4000000 },
    { id: 'LGT-001', name: 'Tower Light 4x1000W', category: 'Lighting', serial: 'TL-2024-001', condition: 'Good', branch: 'Cileungsi', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-001', status: 'On Rental', rate: 2500000 },
    { id: 'PMP-001', name: 'Submersible Pump 4"', category: 'Pump', serial: 'SP-2024-001', condition: 'Good', branch: 'Bekasi', branchId: 'BR-002', availability: 'Available', project: null, status: 'Available', rate: 3000000 },
    { id: 'PMP-002', name: 'Submersible Pump 4"', category: 'Pump', serial: 'SP-2024-002', condition: 'Good', branch: 'Cileungsi', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-003', status: 'On Rental', rate: 3000000 },
  ],

  // ---- RENTALS ----
  rentals: [
    {
      id: 'RNT-001', poNumber: 'PO/DCI/0726/015', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta',
      rentalDate: '2026-08-01', returnDate: '2026-10-31', branch: 'Cileungsi', branchId: 'BR-001',
      totalItems: 3, deliveryStatus: 'Completed', status: 'On Rental', invoiceStatus: 'Issued',
      notes: 'Priority delivery needed',
      items: [
        { equipmentId: 'GEN-001', name: 'Generator 50 KVA', quantity: 2, rate: 5000000, duration: 3, subtotal: 30000000 },
        { equipmentId: 'CAB-001', name: 'Power Cable 50m', quantity: 10, rate: 500000, duration: 3, subtotal: 15000000 },
        { equipmentId: 'LAD-001', name: 'Aluminium Ladder 6m', quantity: 3, rate: 300000, duration: 3, subtotal: 2700000 },
      ],
      subtotal: 47700000, discount: 2700000, total: 45000000,
      createdBy: 'Admin', createdAt: '2026-07-28 09:15'
    },
    {
      id: 'RNT-002', poNumber: 'PO/DCI/0826/021', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta',
      rentalDate: '2026-08-15', returnDate: '2026-11-15', branch: 'Cileungsi', branchId: 'BR-001',
      totalItems: 2, deliveryStatus: 'Completed', status: 'On Rental', invoiceStatus: 'Paid',
      notes: '',
      items: [
        { equipmentId: 'LGT-001', name: 'Tower Light 4x1000W', quantity: 4, rate: 2500000, duration: 3, subtotal: 30000000 },
        { equipmentId: 'CMP-001', name: 'Air Compressor 10HP', quantity: 2, rate: 4000000, duration: 3, subtotal: 24000000 },
      ],
      subtotal: 54000000, discount: 0, total: 54000000,
      createdBy: 'Admin', createdAt: '2026-08-10 14:30'
    },
    {
      logisticsEstimate: { deliveryDate: '2026-10-10', returnDate: '2026-11-30', notes: 'Kirim 1 truk 5 ton, jemput akhir November', by: 'Joko Warehouse', at: '2026-09-01 10:00' },
      id: 'RNT-003', poNumber: 'PO/DCI/0826/034', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta',
      rentalDate: '2026-09-01', returnDate: '2026-11-30', branch: 'Cileungsi', branchId: 'BR-001',
      totalItems: 2, deliveryStatus: 'Preparing', status: 'Preparing', invoiceStatus: 'Draft',
      notes: 'Additional equipment for phase 2',
      items: [
        { equipmentId: 'PMP-002', name: 'Submersible Pump 4"', quantity: 3, rate: 3000000, duration: 3, subtotal: 27000000 },
        { equipmentId: 'WLD-001', name: 'Welding Machine 400A', quantity: 2, rate: 3500000, duration: 3, subtotal: 21000000 },
      ],
      subtotal: 48000000, discount: 3000000, total: 45000000,
      createdBy: 'Rental Staff', createdAt: '2026-08-28 10:00'
    },
    {
      id: 'RNT-004', poNumber: 'PO-INF-2607-08', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', projectId: 'PRJ-003', projectName: 'Project Infrastructure Expansion',
      rentalDate: '2026-07-15', returnDate: '2026-10-15', branch: 'Cileungsi', branchId: 'BR-001',
      totalItems: 3, deliveryStatus: 'Completed', status: 'On Rental', invoiceStatus: 'Partially Paid',
      notes: '',
      items: [
        { equipmentId: 'GEN-003', name: 'Generator 100 KVA', quantity: 2, rate: 8500000, duration: 3, subtotal: 51000000 },
        { equipmentId: 'LAD-003', name: 'Aluminium Ladder 8m', quantity: 5, rate: 450000, duration: 3, subtotal: 6750000 },
        { equipmentId: 'PMP-002', name: 'Submersible Pump 4"', quantity: 2, rate: 3000000, duration: 3, subtotal: 18000000 },
      ],
      subtotal: 75750000, discount: 5750000, total: 70000000,
      createdBy: 'Admin', createdAt: '2026-07-10 08:45'
    },
    {
      id: 'RNT-005', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', projectId: 'PRJ-003', projectName: 'Project Infrastructure Expansion',
      rentalDate: '2026-08-20', returnDate: '2026-11-20', branch: 'Cileungsi', branchId: 'BR-001',
      totalItems: 2, deliveryStatus: 'Preparing', status: 'Preparing', invoiceStatus: 'Issued',
      notes: 'Rush delivery',
      items: [
        { equipmentId: 'WLD-001', name: 'Welding Machine 400A', quantity: 3, rate: 3500000, duration: 3, subtotal: 31500000 },
        { equipmentId: 'CMP-002', name: 'Air Compressor 10HP', quantity: 1, rate: 4000000, duration: 3, subtotal: 12000000 },
      ],
      subtotal: 43500000, discount: 0, total: 43500000,
      createdBy: 'Rental Staff', createdAt: '2026-08-18 11:20'
    },
    {
      id: 'RNT-006', customerId: 'CUS-003', customerName: 'PT Mitra Teknologi', projectId: 'PRJ-004', projectName: 'Project Warehouse Renovation',
      rentalDate: '2026-08-20', returnDate: '2026-10-20', branch: 'Cileungsi', branchId: 'BR-001',
      totalItems: 2, deliveryStatus: 'Completed', status: 'On Rental', invoiceStatus: 'Issued',
      notes: '',
      items: [
        { equipmentId: 'CMP-001', name: 'Air Compressor 10HP', quantity: 2, rate: 4000000, duration: 2, subtotal: 16000000 },
        { equipmentId: 'WLD-001', name: 'Welding Machine 400A', quantity: 1, rate: 3500000, duration: 2, subtotal: 7000000 },
      ],
      subtotal: 23000000, discount: 0, total: 23000000,
      createdBy: 'Admin', createdAt: '2026-08-15 09:00'
    },
    {
      id: 'RNT-007', customerId: 'CUS-004', customerName: 'PT Karya Engineering', projectId: 'PRJ-005', projectName: 'Project Bridge Construction',
      rentalDate: '2026-05-15', returnDate: '2026-08-15', branch: 'Bekasi', branchId: 'BR-002',
      totalItems: 2, deliveryStatus: 'Completed', status: 'Completed', invoiceStatus: 'Paid',
      notes: '',
      items: [
        { equipmentId: 'GEN-004', name: 'Generator 100 KVA', quantity: 1, rate: 8500000, duration: 3, subtotal: 25500000 },
        { equipmentId: 'CAB-003', name: 'Power Cable 100m', quantity: 5, rate: 900000, duration: 3, subtotal: 13500000 },
      ],
      subtotal: 39000000, discount: 0, total: 39000000,
      createdBy: 'Admin', createdAt: '2026-05-10 10:30'
    },
    {
      id: 'RNT-008', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', projectId: 'PRJ-002', projectName: 'Project Data Center Bekasi',
      rentalDate: '2026-08-10', returnDate: '2026-11-10', branch: 'Bekasi', branchId: 'BR-002',
      totalItems: 2, deliveryStatus: 'Completed', status: 'On Rental', invoiceStatus: 'Issued',
      notes: '',
      items: [
        { equipmentId: 'GEN-004', name: 'Generator 100 KVA', quantity: 2, rate: 8500000, duration: 3, subtotal: 51000000 },
        { equipmentId: 'CAB-003', name: 'Power Cable 100m', quantity: 8, rate: 900000, duration: 3, subtotal: 21600000 },
      ],
      subtotal: 72600000, discount: 2600000, total: 70000000,
      createdBy: 'Admin', createdAt: '2026-08-05 13:15'
    },
    {
      id: 'RNT-009', customerId: 'CUS-003', customerName: 'PT Mitra Teknologi', projectId: 'PRJ-004', projectName: 'Project Warehouse Renovation',
      rentalDate: '2026-09-10', returnDate: '2026-10-31', branch: 'Cileungsi', branchId: 'BR-001',
      totalItems: 1, deliveryStatus: 'Pending', status: 'Pending Approval', invoiceStatus: 'Draft',
      notes: 'Waiting for manager approval',
      items: [
        { equipmentId: 'GEN-002', name: 'Generator 50 KVA', quantity: 1, rate: 5000000, duration: 2, subtotal: 10000000 },
      ],
      subtotal: 10000000, discount: 0, total: 10000000,
      createdBy: 'Rental Staff', createdAt: '2026-09-03 16:00'
    },
    {
      id: 'RNT-010', customerId: 'CUS-004', customerName: 'PT Karya Engineering', projectId: 'PRJ-005', projectName: 'Project Bridge Construction',
      rentalDate: '2026-06-01', returnDate: '2026-08-31', branch: 'Bekasi', branchId: 'BR-002',
      totalItems: 2, deliveryStatus: 'Completed', status: 'Completed', invoiceStatus: 'Paid',
      notes: '',
      items: [
        { equipmentId: 'PMP-001', name: 'Submersible Pump 4"', quantity: 2, rate: 3000000, duration: 3, subtotal: 18000000 },
        { equipmentId: 'LAD-003', name: 'Aluminium Ladder 8m', quantity: 4, rate: 450000, duration: 3, subtotal: 5400000 },
      ],
      subtotal: 23400000, discount: 400000, total: 23000000,
      createdBy: 'Admin', createdAt: '2026-05-28 09:45'
    },
  ],

  // ---- DELIVERIES (Surat Jalan) ----
  // kind: SEWA (default, dari penyewaan) | JUAL (dari penjualan) | PEMULANGAN (jemput alat dari proyek)
  // estimate = estimasi berangkat/tiba dari Logistik (wajib sebelum berangkat); tracking = update posisi manual
  deliveries: [
    { id: 'DLV-001', sjNo: 'SJK-2608-001', rentalId: 'RNT-001', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', driverId: 'DRV-001', driverName: 'Budi Santoso', vehicleId: 'VHC-001', vehiclePlate: 'B 1234 XYZ', deliveryDate: '2026-08-02', destination: 'Jl. Sudirman No. 45, Jakarta Selatan', status: 'Completed', notes: 'Gate access card needed', items: [{name:'Generator 50 KVA', qty:2},{name:'Power Cable 50m', qty:10},{name:'Aluminium Ladder 6m', qty:3}] },
    { id: 'DLV-002', sjNo: 'SJK-2608-003', rentalId: 'RNT-002', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', driverId: 'DRV-002', driverName: 'Andi Pratama', vehicleId: 'VHC-002', vehiclePlate: 'B 5678 ABC', deliveryDate: '2026-08-16', destination: 'Jl. Sudirman No. 45, Jakarta Selatan', status: 'Completed', notes: '', items: [{name:'Tower Light 4x1000W', qty:4},{name:'Air Compressor 10HP', qty:2}] },
    { id: 'DLV-003', sjNo: 'SJK-2607-001', rentalId: 'RNT-004', projectId: 'PRJ-003', projectName: 'Project Infrastructure Expansion', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', driverId: 'DRV-001', driverName: 'Budi Santoso', vehicleId: 'VHC-001', vehiclePlate: 'B 1234 XYZ', deliveryDate: '2026-07-16', destination: 'Jl. Gatot Subroto No. 12, Jakarta Selatan', status: 'Completed', notes: '', items: [{name:'Generator 100 KVA', qty:2},{name:'Aluminium Ladder 8m', qty:5},{name:'Submersible Pump 4"', qty:2}] },
    { id: 'DLV-004', sjNo: 'SJK-2608-005', rentalId: 'RNT-005', projectId: 'PRJ-003', projectName: 'Project Infrastructure Expansion', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', driverId: 'DRV-003', driverName: 'Dimas Saputra', vehicleId: 'VHC-003', vehiclePlate: 'B 9012 DEF', deliveryDate: '2026-10-10', destination: 'Jl. Gatot Subroto No. 12, Jakarta Selatan', status: 'Departed', notes: 'Rush delivery', estimate: { departAt: '2026-10-10 07:00', arriveAt: '2026-10-10 13:00', notes: 'Lewat tol dalam kota', by: 'Joko Warehouse', at: '2026-10-09 16:00' }, departedAt: '2026-10-10 07:20', tracking: [{ at: '2026-10-10 07:20', location: 'Gudang Cileungsi', note: 'Berangkat, muatan lengkap', by: 'Joko Warehouse' }, { at: '2026-10-10 09:45', location: 'Tol Jagorawi KM 12', note: 'Macet, perkiraan tetap siang (info driver via WA)', by: 'Joko Warehouse' }], items: [{name:'Welding Machine 400A', qty:3},{name:'Air Compressor 10HP', qty:1}] },
    { id: 'DLV-005', sjNo: 'SJK-2608-004', rentalId: 'RNT-006', projectId: 'PRJ-004', projectName: 'Project Warehouse Renovation', customerId: 'CUS-003', customerName: 'PT Mitra Teknologi', driverId: 'DRV-002', driverName: 'Andi Pratama', vehicleId: 'VHC-002', vehiclePlate: 'B 5678 ABC', deliveryDate: '2026-08-21', destination: 'Jl. TB Simatupang No. 88, Jakarta Timur', status: 'Completed', notes: 'Truk mogok di tol, tiba besok pagi', estimate: { departAt: '2026-08-21 07:00', arriveAt: '2026-08-21 11:00', notes: '', by: 'Joko Warehouse', at: '2026-08-20 15:00' }, departedAt: '2026-08-21 07:15', arrivedAt: '2026-08-22 09:30', completedAt: '2026-08-22 10:00', items: [{name:'Air Compressor 10HP', qty:2},{name:'Welding Machine 400A', qty:1}] },
    { id: 'DLV-006', sjNo: 'SJK-2608-002', rentalId: 'RNT-008', projectId: 'PRJ-002', projectName: 'Project Data Center Bekasi', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', driverId: 'DRV-001', driverName: 'Budi Santoso', vehicleId: 'VHC-001', vehiclePlate: 'B 1234 XYZ', deliveryDate: '2026-08-11', destination: 'Jl. Raya Industri No. 5, Bekasi', status: 'Completed', notes: '', estimate: { departAt: '2026-08-11 06:00', arriveAt: '2026-08-11 09:00', notes: '', by: 'Joko Warehouse', at: '2026-08-10 16:00' }, departedAt: '2026-08-11 06:10', arrivedAt: '2026-08-11 08:45', completedAt: '2026-08-11 09:15', items: [{name:'Generator 100 KVA', qty:2},{name:'Power Cable 100m', qty:8}] },
    { id: 'DLV-007', sjNo: 'SJK-2609-001', rentalId: 'RNT-003', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', driverId: 'DRV-001', driverName: 'Budi Santoso', vehicleId: 'VHC-001', vehiclePlate: 'B 1234 XYZ', deliveryDate: '2026-10-10', destination: 'Jl. Sudirman No. 45, Jakarta Selatan', status: 'Assigned', assignedAt: '2026-10-08 15:00', notes: 'Phase 2 equipment (kirim ulang setelah DLV-010 gagal)', estimate: { departAt: '2026-10-10 06:00', arriveAt: '2026-10-10 10:00', notes: 'Berangkat pagi sebelum jam pengecoran', by: 'Joko Warehouse', at: '2026-10-08 15:30' }, items: [{name:'Submersible Pump 4"', qty:3},{name:'Welding Machine 400A', qty:2}] },
    { id: 'DLV-010', sjNo: 'SJK-2609-002', rentalId: 'RNT-003', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', driverId: 'DRV-004', driverName: 'Rizky Fauzan', vehicleId: 'VHC-002', vehiclePlate: 'B 5678 ABC', deliveryDate: '2026-09-05', destination: 'Jl. Sudirman No. 45, Jakarta Selatan', status: 'Failed', notes: 'Phase 2 equipment', createdAt: '2026-09-04 16:00', departedAt: '2026-09-05 08:10', failedAt: '2026-09-05 11:40', failureInfo: { reason: 'Site inaccessible', notes: 'Akses jalan proyek ditutup untuk pengecoran' }, proofOfDelivery: null, items: [{name:'Submersible Pump 4"', qty:3},{name:'Welding Machine 400A', qty:2}] },
    { id: 'DLV-008', sjNo: 'SJK-2605-001', rentalId: 'RNT-007', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', driverId: 'DRV-004', driverName: 'Rizky Fauzan', vehicleId: 'VHC-001', vehiclePlate: 'B 1234 XYZ', deliveryDate: '2026-05-16', destination: 'Jl. Raya Bekasi No. 23, Bekasi', status: 'Completed', notes: '', items: [{name:'Generator 100 KVA', qty:1},{name:'Power Cable 100m', qty:5}] },
    { id: 'DLV-011', kind: 'JUAL', sjNo: 'PJ-2609-001', saleId: 'SO-001', rentalId: null, projectId: 'PRJ-004', projectName: 'Project Warehouse Renovation', customerId: 'CUS-003', customerName: 'PT Mitra Teknologi', driverId: 'DRV-002', driverName: 'Andi Pratama', vehicleId: 'VHC-004', vehiclePlate: 'B 3456 GHI', deliveryDate: '2026-09-03', destination: 'Jl. TB Simatupang No. 88, Jakarta Timur', status: 'Completed', notes: 'Unit bekas', estimate: { departAt: '2026-09-03 08:00', arriveAt: '2026-09-03 11:00', notes: '', by: 'Joko Warehouse', at: '2026-09-02 15:00' }, completedAt: '2026-09-03 11:20', proofOfDelivery: { receiverName: 'Rudi Hartono', receiverPhone: '021-5550303' }, items: [{name:'Aluminium Ladder 6m', qty:2}] },
    { id: 'DLV-009', sjNo: 'SJK-2606-001', rentalId: 'RNT-010', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', driverId: 'DRV-004', driverName: 'Rizky Fauzan', vehicleId: 'VHC-002', vehiclePlate: 'B 5678 ABC', deliveryDate: '2026-06-02', destination: 'Jl. Raya Bekasi No. 23, Bekasi', status: 'Completed', notes: '', items: [{name:'Submersible Pump 4"', qty:2},{name:'Aluminium Ladder 8m', qty:4}] },
    { id: 'DLV-013', kind: 'PEMULANGAN', sjNo: 'SJR-2608-003', rentalId: 'RNT-007', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', driverId: null, driverName: null, vehicleId: null, vehiclePlate: null, deliveryDate: '2026-08-18', destination: 'Gudang Bekasi (administratif)', status: 'Completed', administrative: true, forSaleId: 'SO-003', returnId: 'RET-004', notes: 'Dipulangkan untuk dijual ke pelanggan (SO-003) - Hilang di lokasi proyek', tracking: [], items: [{name:'Power Cable 100m', qty:1}] },
    { id: 'DLV-012', kind: 'JUAL', sjNo: 'PJ-2608-001', saleId: 'SO-003', rentalId: null, projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', driverId: null, driverName: null, vehicleId: null, vehiclePlate: null, deliveryDate: '2026-08-20', destination: 'Diserahkan di lokasi proyek (alat sudah di pelanggan)', status: 'Completed', notes: 'Alat hilang di lokasi, surat jalan jual sebagai bukti serah terima', tracking: [], items: [{name:'Power Cable 100m', qty:1}] },
  ],

  // ---- RETURNS ----
  returns: [
    {
      id: 'RET-001', sjNo: 'SJR-2608-001', rentalId: 'RNT-007', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering',
      returnDate: '2026-08-16', status: 'Completed', inspectedBy: 'Warehouse Staff',
      items: [
        { name: 'Generator 100 KVA', sent: 1, good: 1, damaged: 0 },
        { name: 'Power Cable 100m', sent: 4, good: 4, damaged: 0 },
      ]
    },
    {
      id: 'RET-002', sjNo: 'SJR-2608-002', rentalId: 'RNT-010', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering',
      returnDate: '2026-08-31', status: 'Completed', inspectedBy: 'Warehouse Staff',
      items: [
        { name: 'Submersible Pump 4"', sent: 2, good: 2, damaged: 0 },
        { name: 'Aluminium Ladder 8m', sent: 4, good: 3, damaged: 1, damageNotes: 'Bengkok di bagian tengah' },
      ]
    },
    {
      id: 'RET-003', sjNo: 'SJR-2609-001', rentalId: 'RNT-001', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia',
      returnDate: '2026-09-04', status: 'Inspection', inspectedBy: null,
      items: [
        { name: 'Generator 50 KVA', sent: 1, good: 1, damaged: 0 },
        { name: 'Power Cable 50m', sent: 8, good: 8, damaged: 0 },
        { name: 'Aluminium Ladder 6m', sent: 2, good: 2, damaged: 0 },
      ]
    },
    {
      // Pemulangan administratif: 1 kabel hilang di lokasi → dipulangkan dulu, lalu dijual ke pelanggan (SO-003)
      id: 'RET-004', sjNo: 'SJR-2608-003', pickupId: 'DLV-013', rentalId: 'RNT-007', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering',
      returnDate: '2026-08-18', status: 'Completed', inspectedBy: 'Sari Dewi', forSaleId: 'SO-003',
      items: [{ name: 'Power Cable 100m', sent: 1, good: 1, damaged: 0, damageNotes: 'Dipulangkan untuk dijual' }]
    },
  ],

  // ---- PENJUALAN (order jual alat ke customer) ----
  // Draft → Pending Approval (ACC Staff Piutang) → Approved → Partially Delivered / Delivered. Invoice tipe 'Jual'.
  sales: [
    { id: 'SO-001', customerId: 'CUS-003', customerName: 'PT Mitra Teknologi', projectId: 'PRJ-004', projectName: 'Project Warehouse Renovation', branch: 'Bekasi', branchId: 'BR-002',
      date: '2026-09-02', status: 'Delivered', deliveryStatus: 'Completed', notes: 'Penjualan unit bekas', taxRate: 0.11,
      items: [{ name: 'Aluminium Ladder 6m', qty: 2, unitPrice: 1500000, delivered: 2 }], subtotal: 3000000,
      createdBy: 'Rina Kasir', createdAt: '2026-09-02 09:00', approvedBy: 'Sari Dewi', approvedDate: '2026-09-02 11:00', invoiceId: null },
    { id: 'SO-002', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', projectId: 'PRJ-003', projectName: 'Project Infrastructure Expansion', branch: 'Cileungsi', branchId: 'BR-001',
      date: '2026-10-09', status: 'Pending Approval', deliveryStatus: 'Pending', notes: 'Kabel untuk instalasi permanen', taxRate: 0.11,
      items: [{ name: 'Power Cable 50m', qty: 10, unitPrice: 2000000 }, { name: 'Power Cable 100m', qty: 4, unitPrice: 3500000 }], subtotal: 34000000,
      createdBy: 'Rina Kasir', createdAt: '2026-10-09 14:00', submittedAt: '2026-10-09 14:05', invoiceId: null },
    { id: 'SO-003', customerId: 'CUS-004', customerName: 'PT Karya Engineering', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', branch: 'Bekasi', branchId: 'BR-002',
      date: '2026-08-18', status: 'Delivered', deliveryStatus: 'Completed', notes: 'Kabel hilang di lokasi, dibeli pelanggan', taxRate: 0,
      source: 'project', sourceReason: 'Hilang di lokasi proyek', returnSjNo: 'SJR-2608-003', returnIds: ['RET-004'],
      items: [{ name: 'Power Cable 100m', qty: 1, unitPrice: 900000, delivered: 1 }], subtotal: 900000,
      createdBy: 'Rina Kasir', createdAt: '2026-08-18 09:00', approvedBy: 'Sari Dewi', approvedDate: '2026-08-18 10:00', invoiceId: 'INV-005' },
  ],

  // ---- PERMINTAAN PERUBAHAN ----
  // Selain Admin tidak bisa mengubah/menghapus data. Ajukan → ACC Accounting → dikerjakan Admin.
  // status: Menunggu ACC | Disetujui | Ditolak | Selesai
  editRequests: [
    { id: 'ER-001', docType: 'Pelanggan', docId: 'CUS-003', docLabel: 'PT Mitra Teknologi', link: 'customer-detail.html?id=CUS-003', action: 'Ubah',
      notes: 'Mohon isi NPWP pelanggan: 03.529.647.8-009.000 (untuk faktur pajak)', requestedBy: 'Sari Dewi', requestedRole: 'Account Receivable', requestedAt: '2026-10-08 10:15', status: 'Menunggu ACC' },
    { id: 'ER-002', docType: 'Proyek', docId: 'PRJ-003', docLabel: 'Project Infrastructure Expansion', link: 'project-detail.html?id=PRJ-003', action: 'Ubah',
      notes: 'Lokasi proyek pindah ke Jl. Gatot Subroto No. 15', requestedBy: 'Rina Kasir', requestedRole: 'Kasir', requestedAt: '2026-10-07 13:20', status: 'Disetujui',
      reviewedBy: 'Lina Akuntan', reviewedAt: '2026-10-07 15:00', reviewNote: 'OK, sesuai surat customer' },
  ],

  // ---- CLAIMS ----
  claims: [
    { id: 'CLM-002', returnId: 'RET-002', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', equipment: 'Aluminium Ladder 8m', quantity: 1, reason: 'Damaged - bent middle section', customerConfirmation: 'Confirmed', claimAmount: 450000, status: 'Invoiced', invoiceId: 'INV-011', invoiceStatus: 'Issued', createdDate: '2026-09-02' },
  ],

  // ---- BRANCHES ----
  // Gudang. Angka stok tidak disimpan di sini - dihitung dari stockMutations.
  branches: [
    { id: 'BR-001', code: 'CLS', name: 'Cileungsi Warehouse', address: 'Jl. Raya Narogong KM 15, Cileungsi, Bogor', capacity: 500, status: 'Active' },
    { id: 'BR-002', code: 'BKS', name: 'Bekasi Warehouse', address: 'Jl. Raya Industri No. 5, Bekasi', capacity: 300, status: 'Active' },
    { id: 'BR-003', code: 'BPN', name: 'Balikpapan Warehouse', address: 'Jl. Mulawarman No. 21, Balikpapan Timur', capacity: 200, status: 'Active' },
  ],

  // ---- STOCK MUTATIONS (Perpindahan Stok / ledger) ----
  // Sumber kebenaran qty: stok gudang & stok proyek dihitung dari sini.
  // type: OPENING | PURCHASE | PRODUCTION | SURPLUS | TRANSFER | DELIVERY | RETURN | SALE | DISPOSAL
  // from/to: { type: 'warehouse'|'project'|'customer'|'supplier'|'production'|'opening'|'disposed', id?, name? }
  stockMutations: [
    { id: 'MUT-001', no: 'SA-2605-001', date: '2026-05-01', type: 'OPENING', from: { type: 'opening' }, to: { type: 'warehouse', id: 'BR-001' }, reference: '', notes: 'Saldo awal stock opname', user: 'Joko Warehouse',
      items: [
        { equipment: 'Generator 50 KVA', qty: 15 }, { equipment: 'Generator 100 KVA', qty: 10 }, { equipment: 'Power Cable 50m', qty: 50 },
        { equipment: 'Power Cable 100m', qty: 20 }, { equipment: 'Aluminium Ladder 6m', qty: 25 }, { equipment: 'Aluminium Ladder 8m', qty: 15 },
        { equipment: 'Welding Machine 400A', qty: 10 }, { equipment: 'Air Compressor 10HP', qty: 8 }, { equipment: 'Tower Light 4x1000W', qty: 10 },
        { equipment: 'Submersible Pump 4"', qty: 10 },
      ] },
    { id: 'MUT-002', no: 'SA-2605-002', date: '2026-05-01', type: 'OPENING', from: { type: 'opening' }, to: { type: 'warehouse', id: 'BR-002' }, reference: '', notes: 'Saldo awal stock opname', user: 'Hendra Bekasi',
      items: [
        { equipment: 'Generator 50 KVA', qty: 10 }, { equipment: 'Generator 100 KVA', qty: 8 }, { equipment: 'Power Cable 50m', qty: 50 },
        { equipment: 'Power Cable 100m', qty: 30 }, { equipment: 'Aluminium Ladder 6m', qty: 15 }, { equipment: 'Aluminium Ladder 8m', qty: 10 },
        { equipment: 'Welding Machine 400A', qty: 5 }, { equipment: 'Air Compressor 10HP', qty: 5 }, { equipment: 'Tower Light 4x1000W', qty: 6 },
        { equipment: 'Submersible Pump 4"', qty: 6 },
      ] },
    { id: 'MUT-003', no: 'SA-2605-003', date: '2026-05-01', type: 'OPENING', from: { type: 'opening' }, to: { type: 'warehouse', id: 'BR-003' }, reference: '', notes: 'Saldo awal stock opname', user: 'Joko Warehouse',
      items: [
        { equipment: 'Generator 50 KVA', qty: 6 }, { equipment: 'Generator 100 KVA', qty: 4 }, { equipment: 'Power Cable 50m', qty: 30 },
        { equipment: 'Power Cable 100m', qty: 15 }, { equipment: 'Aluminium Ladder 6m', qty: 10 }, { equipment: 'Aluminium Ladder 8m', qty: 6 },
        { equipment: 'Welding Machine 400A', qty: 4 }, { equipment: 'Air Compressor 10HP', qty: 3 }, { equipment: 'Tower Light 4x1000W', qty: 4 },
        { equipment: 'Submersible Pump 4"', qty: 5 },
      ] },
    { id: 'MUT-004', no: 'SJK-2605-001', date: '2026-05-16', type: 'DELIVERY', from: { type: 'warehouse', id: 'BR-002' }, to: { type: 'project', id: 'PRJ-005' }, reference: 'DLV-008 / RNT-007', notes: '', user: 'Rizky Fauzan',
      items: [{ equipment: 'Generator 100 KVA', qty: 1 }, { equipment: 'Power Cable 100m', qty: 5 }] },
    { id: 'MUT-005', no: 'SJK-2606-001', date: '2026-06-02', type: 'DELIVERY', from: { type: 'warehouse', id: 'BR-002' }, to: { type: 'project', id: 'PRJ-005' }, reference: 'DLV-009 / RNT-010', notes: '', user: 'Rizky Fauzan',
      items: [{ equipment: 'Submersible Pump 4"', qty: 2 }, { equipment: 'Aluminium Ladder 8m', qty: 4 }] },
    { id: 'MUT-006', no: 'PB-2607-001', date: '2026-07-05', type: 'PURCHASE', from: { type: 'supplier', name: 'PT Sumber Generator' }, to: { type: 'warehouse', id: 'BR-001' }, reference: 'PO-001 / GR-001', notes: '', user: 'Joko Warehouse',
      items: [{ equipment: 'Generator 50 KVA', qty: 5 }, { equipment: 'Generator 100 KVA', qty: 3 }] },
    { id: 'MUT-007', no: 'PB-2607-002', date: '2026-07-10', type: 'PURCHASE', from: { type: 'production', name: 'Workshop Balikpapan' }, to: { type: 'warehouse', id: 'BR-003' }, reference: 'WO-001', notes: 'Produksi / perakitan internal', user: 'Joko Warehouse',
      items: [{ equipment: 'Tower Light 4x1000W', qty: 2 }] },
    { id: 'MUT-008', no: 'SJK-2607-001', date: '2026-07-16', type: 'DELIVERY', from: { type: 'warehouse', id: 'BR-001' }, to: { type: 'project', id: 'PRJ-003' }, reference: 'DLV-003 / RNT-004', notes: '', user: 'Budi Santoso',
      items: [{ equipment: 'Generator 100 KVA', qty: 2 }, { equipment: 'Aluminium Ladder 8m', qty: 5 }, { equipment: 'Submersible Pump 4"', qty: 2 }] },
    { id: 'MUT-009', no: 'PB-2607-003', date: '2026-07-18', type: 'PURCHASE', from: { type: 'supplier', name: 'PT Kabel Nusantara' }, to: { type: 'warehouse', id: 'BR-001' }, reference: 'PO-002 / GR-002', notes: '', user: 'Joko Warehouse',
      items: [{ equipment: 'Power Cable 50m', qty: 50 }, { equipment: 'Power Cable 100m', qty: 20 }] },
    { id: 'MUT-010', no: 'SJK-2608-001', date: '2026-08-02', type: 'DELIVERY', from: { type: 'warehouse', id: 'BR-001' }, to: { type: 'project', id: 'PRJ-001' }, reference: 'DLV-001 / RNT-001', notes: 'Gate access card needed', user: 'Budi Santoso',
      items: [{ equipment: 'Generator 50 KVA', qty: 2 }, { equipment: 'Power Cable 50m', qty: 10 }, { equipment: 'Aluminium Ladder 6m', qty: 3 }] },
    { id: 'MUT-011', no: 'SJK-2608-002', date: '2026-08-11', type: 'DELIVERY', from: { type: 'warehouse', id: 'BR-002' }, to: { type: 'project', id: 'PRJ-002' }, reference: 'DLV-006 / RNT-008', notes: '', user: 'Budi Santoso',
      items: [{ equipment: 'Generator 100 KVA', qty: 2 }, { equipment: 'Power Cable 100m', qty: 8 }] },
    { id: 'MUT-012', no: 'SJK-2608-003', date: '2026-08-16', type: 'DELIVERY', from: { type: 'warehouse', id: 'BR-001' }, to: { type: 'project', id: 'PRJ-001' }, reference: 'DLV-002 / RNT-002', notes: '', user: 'Andi Pratama',
      items: [{ equipment: 'Tower Light 4x1000W', qty: 4 }, { equipment: 'Air Compressor 10HP', qty: 2 }] },
    { id: 'MUT-013', no: 'SJR-2608-001', date: '2026-08-16', type: 'RETURN', from: { type: 'project', id: 'PRJ-005' }, to: { type: 'warehouse', id: 'BR-002' }, reference: 'RET-001 / RNT-007', notes: '', user: 'Warehouse Staff',
      items: [{ equipment: 'Generator 100 KVA', qty: 1 }, { equipment: 'Power Cable 100m', qty: 4 }] },
    { id: 'MUT-014', no: 'SJR-2608-003', date: '2026-08-18', type: 'RETURN', from: { type: 'project', id: 'PRJ-005' }, to: { type: 'warehouse', id: 'BR-002' }, reference: 'SO-003 (dipulangkan untuk dijual)', notes: 'Pemulangan administratif sebelum dijual: Hilang di lokasi proyek', user: 'Sari Dewi',
      items: [{ equipment: 'Power Cable 100m', qty: 1 }] },
    { id: 'MUT-020', no: 'PJ-2608-001', date: '2026-08-20', type: 'SALE', from: { type: 'warehouse', id: 'BR-002' }, to: { type: 'customer', id: 'CUS-004' }, reference: 'DLV-012 / SO-003', notes: 'Alat hilang di lokasi dijual ke pelanggan', user: 'Joko Warehouse',
      items: [{ equipment: 'Power Cable 100m', qty: 1, unitPrice: 900000 }] },
    { id: 'MUT-015', no: 'SJK-2608-004', date: '2026-08-21', type: 'DELIVERY', from: { type: 'warehouse', id: 'BR-001' }, to: { type: 'project', id: 'PRJ-004' }, reference: 'DLV-005 / RNT-006', notes: '', user: 'Andi Pratama',
      items: [{ equipment: 'Air Compressor 10HP', qty: 2 }, { equipment: 'Welding Machine 400A', qty: 1 }] },
    { id: 'MUT-016', no: 'SJR-2608-002', date: '2026-08-31', type: 'RETURN', from: { type: 'project', id: 'PRJ-005' }, to: { type: 'warehouse', id: 'BR-002' }, reference: 'RET-002 / RNT-010', notes: '1 tangga bengkok di bagian tengah', user: 'Warehouse Staff',
      items: [{ equipment: 'Submersible Pump 4"', qty: 2 }, { equipment: 'Aluminium Ladder 8m', qty: 3 }, { equipment: 'Aluminium Ladder 8m', qty: 1, condition: 'damaged' }] },
    { id: 'MUT-017', no: 'TG-2609-001', date: '2026-09-01', type: 'TRANSFER', from: { type: 'warehouse', id: 'BR-001' }, to: { type: 'warehouse', id: 'BR-002' }, reference: 'TRF-001', notes: 'Penyeimbangan stok', user: 'Joko Warehouse',
      items: [{ equipment: 'Welding Machine 400A', qty: 1 }] },
    { id: 'MUT-018', no: 'TG-2609-002', date: '2026-09-02', type: 'TRANSFER', from: { type: 'warehouse', id: 'BR-001' }, to: { type: 'warehouse', id: 'BR-003' }, reference: '', notes: 'Persiapan proyek Kalimantan', user: 'Joko Warehouse',
      items: [{ equipment: 'Generator 100 KVA', qty: 2 }] },
    { id: 'MUT-019', no: 'PJ-2609-001', date: '2026-09-03', type: 'SALE', from: { type: 'warehouse', id: 'BR-002' }, to: { type: 'customer', id: 'CUS-003' }, reference: '', notes: 'Penjualan unit bekas', user: 'Maya Finance',
      items: [{ equipment: 'Aluminium Ladder 6m', qty: 2, unitPrice: 1500000 }] },
  ],

  // ---- STOCK (kondisi fisik per gudang) ----
  // total = qty fisik di gudang (harus sama dengan saldo ledger). available/reserved/damaged/maintenance = rinciannya.
  stock: [
    { equipment: 'Generator 50 KVA', branch: 'Cileungsi', total: 18, available: 18, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Generator 50 KVA', branch: 'Bekasi', total: 10, available: 10, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Generator 50 KVA', branch: 'Balikpapan', total: 6, available: 6, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Generator 100 KVA', branch: 'Cileungsi', total: 9, available: 9, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Generator 100 KVA', branch: 'Bekasi', total: 6, available: 6, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Generator 100 KVA', branch: 'Balikpapan', total: 6, available: 6, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Power Cable 50m', branch: 'Cileungsi', total: 90, available: 88, reserved: 0, damaged: 2, maintenance: 0 },
    { equipment: 'Power Cable 50m', branch: 'Bekasi', total: 50, available: 50, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Power Cable 50m', branch: 'Balikpapan', total: 30, available: 30, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Power Cable 100m', branch: 'Cileungsi', total: 40, available: 40, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Power Cable 100m', branch: 'Bekasi', total: 21, available: 21, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Power Cable 100m', branch: 'Balikpapan', total: 15, available: 15, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Aluminium Ladder 6m', branch: 'Cileungsi', total: 22, available: 21, reserved: 0, damaged: 1, maintenance: 0 },
    { equipment: 'Aluminium Ladder 6m', branch: 'Bekasi', total: 13, available: 13, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Aluminium Ladder 6m', branch: 'Balikpapan', total: 10, available: 10, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Aluminium Ladder 8m', branch: 'Cileungsi', total: 10, available: 10, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Aluminium Ladder 8m', branch: 'Bekasi', total: 10, available: 9, reserved: 0, damaged: 1, maintenance: 0 },
    { equipment: 'Aluminium Ladder 8m', branch: 'Balikpapan', total: 6, available: 6, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Welding Machine 400A', branch: 'Cileungsi', total: 8, available: 3, reserved: 5, damaged: 0, maintenance: 0 },
    { equipment: 'Welding Machine 400A', branch: 'Bekasi', total: 6, available: 6, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Welding Machine 400A', branch: 'Balikpapan', total: 4, available: 4, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Air Compressor 10HP', branch: 'Cileungsi', total: 4, available: 3, reserved: 1, damaged: 0, maintenance: 0 },
    { equipment: 'Air Compressor 10HP', branch: 'Bekasi', total: 5, available: 5, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Air Compressor 10HP', branch: 'Balikpapan', total: 3, available: 3, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Tower Light 4x1000W', branch: 'Cileungsi', total: 6, available: 6, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Tower Light 4x1000W', branch: 'Bekasi', total: 6, available: 6, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Tower Light 4x1000W', branch: 'Balikpapan', total: 6, available: 6, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Submersible Pump 4\"', branch: 'Cileungsi', total: 8, available: 5, reserved: 3, damaged: 0, maintenance: 0 },
    { equipment: 'Submersible Pump 4\"', branch: 'Bekasi', total: 6, available: 6, reserved: 0, damaged: 0, maintenance: 0 },
    { equipment: 'Submersible Pump 4\"', branch: 'Balikpapan', total: 5, available: 5, reserved: 0, damaged: 0, maintenance: 0 },
  ],

  // ---- DRIVERS ----
  drivers: [
    { id: 'DRV-001', name: 'Budi Santoso', phone: '081234567890', licenseNumber: 'SIM-A-12345', licenseExpiry: '2028-06-15', status: 'On Delivery', currentDelivery: 'DLV-007' },
    { id: 'DRV-002', name: 'Andi Pratama', phone: '081234567891', licenseNumber: 'SIM-A-12346', licenseExpiry: '2027-11-20', status: 'Available', currentDelivery: null },
    { id: 'DRV-003', name: 'Dimas Saputra', phone: '081234567892', licenseNumber: 'SIM-A-12347', licenseExpiry: '2028-03-10', status: 'On Delivery', currentDelivery: 'DLV-004' },
    { id: 'DRV-004', name: 'Rizky Fauzan', phone: '081234567893', licenseNumber: 'SIM-A-12348', licenseExpiry: '2027-09-05', status: 'Available', currentDelivery: null },
    { id: 'DRV-005', name: 'Hendra Wijaya', phone: '081234567894', licenseNumber: 'SIM-A-12349', licenseExpiry: '2026-12-01', status: 'Off Duty', currentDelivery: null },
  ],

  // ---- VEHICLES ----
  vehicles: [
    { id: 'VHC-001', plate: 'B 1234 XYZ', type: 'Truck', brand: 'Mitsubishi Colt Diesel', capacity: '5 Ton', driverId: 'DRV-001', driverName: 'Budi Santoso', status: 'On Delivery', currentDelivery: 'DLV-007' },
    { id: 'VHC-002', plate: 'B 5678 ABC', type: 'Truck', brand: 'Hino Dutro', capacity: '3 Ton', driverId: 'DRV-002', driverName: 'Andi Pratama', status: 'Available', currentDelivery: null },
    { id: 'VHC-003', plate: 'B 9012 DEF', type: 'Truck', brand: 'Isuzu Elf', capacity: '4 Ton', driverId: 'DRV-003', driverName: 'Dimas Saputra', status: 'On Delivery', currentDelivery: 'DLV-004' },
    { id: 'VHC-004', plate: 'B 3456 GHI', type: 'Pickup', brand: 'Toyota Hilux', capacity: '1 Ton', driverId: null, driverName: null, status: 'Available', currentDelivery: null },
    { id: 'VHC-005', plate: 'B 7890 JKL', type: 'Truck', brand: 'Mitsubishi Colt Diesel', capacity: '5 Ton', driverId: null, driverName: null, status: 'Maintenance', currentDelivery: null },
  ],

  // ---- PURCHASES ----
  // Term of payment: CASH (lunas saat barang diterima) | DP (uang muka dpPercent%, pelunasan saat diterima / tempo) | TEMPO (days hari setelah barang diterima)
  // Pembayaran = Bon Merah kategori pembayaran supplier dengan referensi no. PO (payKind: DP | Pelunasan | Cicilan)
  purchases: [
    { id: 'PO-001', prId: null, vendorId: 'VND-001', supplier: 'PT Sumber Generator', vendorAddress: 'Jl. Industri Raya No. 21, Cikarang', supplierContact: '021-555-1001', purchaseDate: '2026-07-01', expectedDate: '2026-07-05', branch: 'Cileungsi', branchId: 'BR-001', accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Completed', createdBy: 'Rudi Purchasing',
      paymentTerm: { type: 'TEMPO', days: 30 }, taxRate: 0.11, discount: 0, shipping: 0, subtotal: 950000000, tax: 104500000, totalAmount: 1054500000, totalItems: 2,
      items: [{name:'Generator 50 KVA', unit:'Unit', qty:5, received:5, price:100000000},{name:'Generator 100 KVA', unit:'Unit', qty:3, received:3, price:150000000}] },
    { id: 'PO-002', prId: null, vendorId: 'VND-002', supplier: 'PT Kabel Nusantara', vendorAddress: 'Jl. Daan Mogot KM 12, Jakarta Barat', supplierContact: '021-555-1002', purchaseDate: '2026-07-15', expectedDate: '2026-07-18', branch: 'Cileungsi', branchId: 'BR-001', accountId: 'ACC-002', accountName: 'Mandiri Corporate', status: 'Completed', createdBy: 'Rudi Purchasing',
      paymentTerm: { type: 'TEMPO', days: 30 }, taxRate: 0.11, discount: 0, shipping: 0, subtotal: 125000000, tax: 13750000, totalAmount: 138750000, totalItems: 2,
      items: [{name:'Power Cable 50m', unit:'Roll', qty:50, received:50, price:1500000},{name:'Power Cable 100m', unit:'Roll', qty:20, received:20, price:2500000}] },
    { id: 'PO-003', prId: null, vendorId: 'VND-003', supplier: 'PT Alat Berat Indonesia', vendorAddress: 'Jl. Raya Narogong KM 8, Bekasi', supplierContact: '021-555-1003', purchaseDate: '2026-08-20', expectedDate: '2026-09-25', branch: 'Bekasi', branchId: 'BR-002', accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Arrived', createdBy: 'Rudi Purchasing',
      paymentTerm: { type: 'DP', dpPercent: 30, days: 14 }, taxRate: 0.11, discount: 0, shipping: 0, subtotal: 320000000, tax: 35200000, totalAmount: 355200000, totalItems: 3,
      items: [{name:'Welding Machine 400A', unit:'Unit', qty:4, received:0, price:35000000},{name:'Air Compressor 10HP', unit:'Unit', qty:3, received:0, price:40000000},{name:'Submersible Pump 4"', unit:'Unit', qty:2, received:0, price:30000000}] },
    { id: 'PO-004', prId: null, vendorId: 'VND-001', supplier: 'PT Sumber Generator', vendorAddress: 'Jl. Industri Raya No. 21, Cikarang', supplierContact: '021-555-1001', purchaseDate: '2026-09-01', expectedDate: '2026-10-12', branch: 'Cileungsi', branchId: 'BR-001', accountId: 'ACC-001', accountName: 'BCA Operational', status: 'In Transit', createdBy: 'Rudi Purchasing',
      paymentTerm: { type: 'TEMPO', days: 45 }, taxRate: 0.11, discount: 0, shipping: 0, subtotal: 300000000, tax: 33000000, totalAmount: 333000000, totalItems: 1,
      items: [{name:'Generator 100 KVA', unit:'Unit', qty:2, received:0, price:150000000}] },
    { id: 'PO-005', prId: null, vendorId: 'VND-004', supplier: 'PT Tangga Jaya', vendorAddress: 'Jl. Pangeran Jayakarta No. 5, Jakarta Pusat', supplierContact: '021-555-1004', purchaseDate: '2026-09-03', expectedDate: '2026-10-15', branch: 'Cileungsi', branchId: 'BR-001', accountId: 'ACC-002', accountName: 'Mandiri Corporate', status: 'Ordered', createdBy: 'Rudi Purchasing',
      paymentTerm: { type: 'CASH' }, taxRate: 0, discount: 0, shipping: 0, subtotal: 22000000, tax: 0, totalAmount: 22000000, totalItems: 2,
      items: [{name:'Aluminium Ladder 6m', unit:'Unit', qty:10, received:0, price:1200000},{name:'Aluminium Ladder 8m', unit:'Unit', qty:5, received:0, price:2000000}] },
    { id: 'PO-006', prId: 'PR-001', vendorId: 'VND-005', supplier: 'CV Lampu Terang', vendorAddress: 'Jl. MT Haryono No. 88, Balikpapan', supplierContact: '0542-777-210', purchaseDate: '2026-10-06', expectedDate: '2026-10-25', branch: 'Balikpapan', branchId: 'BR-003', accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Draft', createdBy: 'Rudi Purchasing',
      paymentTerm: { type: 'TEMPO', days: 30 }, taxRate: 0.11, discount: 0, shipping: 0, subtotal: 70000000, tax: 7700000, totalAmount: 77700000, totalItems: 1,
      items: [{name:'Tower Light 4x1000W', unit:'Unit', qty:2, received:0, price:35000000}] },
  ],

  // ---- VENDOR / SUPPLIER ----
  vendors: [
    { id: 'VND-001', name: 'PT Sumber Generator', address: 'Jl. Industri Raya No. 21, Cikarang', phone: '021-555-1001', contactPerson: 'Bambang Sutrisno', email: 'sales@sumbergen.co.id', taxId: '02.111.222.3-413.000', status: 'Active' },
    { id: 'VND-002', name: 'PT Kabel Nusantara', address: 'Jl. Daan Mogot KM 12, Jakarta Barat', phone: '021-555-1002', contactPerson: 'Wati Susanti', email: 'order@kabelnusa.co.id', taxId: '02.333.444.5-034.000', status: 'Active' },
    { id: 'VND-003', name: 'PT Alat Berat Indonesia', address: 'Jl. Raya Narogong KM 8, Bekasi', phone: '021-555-1003', contactPerson: 'Hendra Gunawan', email: 'hendra@abi.co.id', taxId: '01.555.666.7-407.000', status: 'Active' },
    { id: 'VND-004', name: 'PT Tangga Jaya', address: 'Jl. Pangeran Jayakarta No. 5, Jakarta Pusat', phone: '021-555-1004', contactPerson: 'Ani Lestari', email: 'ani@tanggajaya.co.id', taxId: '', status: 'Active' },
    { id: 'VND-005', name: 'CV Lampu Terang', address: 'Jl. MT Haryono No. 88, Balikpapan', phone: '0542-777-210', contactPerson: 'Yusuf Rahman', email: 'yusuf@lamputerang.com', taxId: '03.777.888.9-721.000', status: 'Active' },
    { id: 'VND-006', name: 'CV Trans Logistik', address: 'Jl. Cakung Cilincing No. 3, Jakarta Utara', phone: '021-555-1006', contactPerson: 'Dodi Saputra', email: 'ops@translogistik.co.id', taxId: '0712345678014000', status: 'Active' },
  ],

  // ---- PURCHASE REQUEST ----
  // Draft → Diajukan → Disetujui (ACC) → Dibuat PO / Ditolak
  purchaseRequests: [
    { id: 'PR-001', date: '2026-10-03', vendorId: 'VND-005', vendorName: 'CV Lampu Terang', vendorAddress: 'Jl. MT Haryono No. 88, Balikpapan', vendorPhone: '0542-777-210', vendorContact: 'Yusuf Rahman',
      branchId: 'BR-003', items: [{ name: 'Tower Light 4x1000W', unit: 'Unit', qty: 2, price: 35000000 }], notes: 'Penerangan proyek Kalimantan', status: 'Dibuat PO', poId: 'PO-006',
      requestedBy: 'Joko Warehouse', requestedAt: '2026-10-03 09:00', approvedBy: 'Maya Finance', approvedAt: '2026-10-04 10:00' },
    { id: 'PR-002', date: '2026-10-09', vendorId: 'VND-004', vendorName: 'PT Tangga Jaya', vendorAddress: 'Jl. Pangeran Jayakarta No. 5, Jakarta Pusat', vendorPhone: '021-555-1004', vendorContact: 'Ani Lestari',
      branchId: 'BR-001', items: [{ name: 'Aluminium Ladder 6m', unit: 'Unit', qty: 20, price: 1200000 }, { name: 'Aluminium Ladder 8m', unit: 'Unit', qty: 10, price: 2000000 }], notes: 'Tambahan stok tangga, banyak permintaan sewa', status: 'Diajukan', poId: null,
      requestedBy: 'Joko Warehouse', requestedAt: '2026-10-09 11:30' },
  ],

  // ---- MOVEMENTS ----
  movements: [
    { id: 'MOV-001', date: '2026-07-05', equipment: 'Generator 50 KVA', assetId: 'GEN-001', from: 'Supplier', to: 'Cileungsi Warehouse', type: 'Purchase', reference: 'PO-001', user: 'Warehouse Staff', status: 'Completed' },
    { id: 'MOV-002', date: '2026-08-02', equipment: 'Generator 50 KVA', assetId: 'GEN-001', from: 'Cileungsi Warehouse', to: 'Project Data Center Jakarta', type: 'Rental Out', reference: 'RNT-001', user: 'Admin', status: 'Completed' },
    { id: 'MOV-003', date: '2026-08-02', equipment: 'Power Cable 50m', assetId: 'CAB-001', from: 'Cileungsi Warehouse', to: 'Project Data Center Jakarta', type: 'Rental Out', reference: 'RNT-001', user: 'Admin', status: 'Completed' },
    { id: 'MOV-004', date: '2026-08-16', equipment: 'Generator 100 KVA', assetId: 'GEN-003', from: 'Cileungsi Warehouse', to: 'Project Infrastructure Expansion', type: 'Rental Out', reference: 'RNT-004', user: 'Admin', status: 'Completed' },
    { id: 'MOV-005', date: '2026-08-16', equipment: 'Generator 100 KVA', assetId: 'GEN-004', from: 'Bekasi Warehouse', to: 'Project Bridge Construction', type: 'Return', reference: 'RET-001', user: 'Warehouse Staff', status: 'Completed' },
    { id: 'MOV-007', date: '2026-09-01', equipment: 'Welding Machine 400A', assetId: 'WLD-002', from: 'Cileungsi Warehouse', to: 'Bekasi Warehouse', type: 'Transfer', reference: 'TRF-001', user: 'Warehouse Staff', status: 'Completed' },
    { id: 'MOV-008', date: '2026-09-03', equipment: 'Aluminium Ladder 6m', assetId: 'LAD-002', from: 'Project Data Center Jakarta', to: 'Cileungsi Warehouse', type: 'Return', reference: 'RET-003', user: 'Warehouse Staff', status: 'Completed' },
    { id: 'MOV-010', date: '2026-08-20', equipment: 'Air Compressor 10HP', assetId: 'CMP-002', from: 'Supplier', to: 'Bekasi Warehouse', type: 'Purchase', reference: 'PO-003', user: 'Warehouse Staff', status: 'Completed' },
  ],

  // ---- INVOICES ----
  // Sewa: hasil rekap tagihan (qty × hari × harga satuan ÷ bulan sewa) per periode; Klaim: dari claim
  invoices: [
    {"id":"INV-001","type":"Sewa","projectId":"PRJ-005","projectName":"Project Bridge Construction","customerId":"CUS-004","customerName":"PT Karya Engineering","reference":"Sewa 2026-05-01 s/d 2026-05-31","invoiceDate":"2026-06-01","dueDate":"2026-07-01","periodStart":"2026-05-01","periodEnd":"2026-05-31","monthDays":30,"items":[{"desc":"Generator 100 KVA","equipment":"Generator 100 KVA","qty":1,"unitPrice":8500000,"startDate":"2026-05-16","endDate":"2026-05-31","days":16,"amount":4533333,"sjDelivery":"SJK-2605-001","sjReturn":null,"adjusted":false},{"desc":"Power Cable 100m","equipment":"Power Cable 100m","qty":1,"unitPrice":900000,"startDate":"2026-05-16","endDate":"2026-05-31","days":16,"amount":480000,"sjDelivery":"SJK-2605-001","sjReturn":null,"adjusted":false},{"desc":"Power Cable 100m","equipment":"Power Cable 100m","qty":4,"unitPrice":900000,"startDate":"2026-05-16","endDate":"2026-05-31","days":16,"amount":1920000,"sjDelivery":"SJK-2605-001","sjReturn":null,"adjusted":false}],"status":"Paid","notes":"","createdBy":"Maya Finance","subtotal":6933333,"taxRate":0.11,"tax":762667,"amount":7696000,"accountId":"ACC-004","accountName":"BCA Bekasi","paidDate":"2026-06-20"},
    {"id":"INV-002","type":"Sewa","projectId":"PRJ-005","projectName":"Project Bridge Construction","customerId":"CUS-004","customerName":"PT Karya Engineering","reference":"Sewa 2026-06-01 s/d 2026-06-30","invoiceDate":"2026-07-01","dueDate":"2026-07-31","periodStart":"2026-06-01","periodEnd":"2026-06-30","monthDays":30,"items":[{"desc":"Aluminium Ladder 8m","equipment":"Aluminium Ladder 8m","qty":3,"unitPrice":450000,"startDate":"2026-06-02","endDate":"2026-06-30","days":29,"amount":1305000,"sjDelivery":"SJK-2606-001","sjReturn":null,"adjusted":false},{"desc":"Aluminium Ladder 8m","equipment":"Aluminium Ladder 8m","qty":1,"unitPrice":450000,"startDate":"2026-06-02","endDate":"2026-06-30","days":29,"amount":435000,"sjDelivery":"SJK-2606-001","sjReturn":null,"adjusted":false},{"desc":"Generator 100 KVA","equipment":"Generator 100 KVA","qty":1,"unitPrice":8500000,"startDate":"2026-06-01","endDate":"2026-06-30","days":30,"amount":8500000,"sjDelivery":"SJK-2605-001","sjReturn":null,"adjusted":false},{"desc":"Power Cable 100m","equipment":"Power Cable 100m","qty":1,"unitPrice":900000,"startDate":"2026-06-01","endDate":"2026-06-30","days":30,"amount":900000,"sjDelivery":"SJK-2605-001","sjReturn":null,"adjusted":false},{"desc":"Power Cable 100m","equipment":"Power Cable 100m","qty":4,"unitPrice":900000,"startDate":"2026-06-01","endDate":"2026-06-30","days":30,"amount":3600000,"sjDelivery":"SJK-2605-001","sjReturn":null,"adjusted":false},{"desc":"Submersible Pump 4\"","equipment":"Submersible Pump 4\"","qty":2,"unitPrice":3000000,"startDate":"2026-06-02","endDate":"2026-06-30","days":29,"amount":5800000,"sjDelivery":"SJK-2606-001","sjReturn":null,"adjusted":false}],"status":"Paid","notes":"","createdBy":"Maya Finance","subtotal":20540000,"taxRate":0.11,"tax":2259400,"amount":22799400,"accountId":"ACC-004","accountName":"BCA Bekasi","paidDate":"2026-07-18"},
    {"id":"INV-003","type":"Sewa","projectId":"PRJ-003","projectName":"Project Infrastructure Expansion","customerId":"CUS-002","customerName":"PT Infrastruktur Nusantara","reference":"Sewa 2026-07-01 s/d 2026-07-31","invoiceDate":"2026-08-01","dueDate":"2026-08-31","periodStart":"2026-07-01","periodEnd":"2026-07-31","monthDays":30,"items":[{"desc":"Aluminium Ladder 8m","equipment":"Aluminium Ladder 8m","qty":5,"unitPrice":450000,"startDate":"2026-07-16","endDate":"2026-07-31","days":16,"amount":1200000,"sjDelivery":"SJK-2607-001","sjReturn":null,"adjusted":false},{"desc":"Generator 100 KVA","equipment":"Generator 100 KVA","qty":2,"unitPrice":8500000,"startDate":"2026-07-16","endDate":"2026-07-31","days":16,"amount":9066667,"sjDelivery":"SJK-2607-001","sjReturn":null,"adjusted":false},{"desc":"Submersible Pump 4\"","equipment":"Submersible Pump 4\"","qty":2,"unitPrice":3000000,"startDate":"2026-07-16","endDate":"2026-07-31","days":16,"amount":3200000,"sjDelivery":"SJK-2607-001","sjReturn":null,"adjusted":false}],"status":"Paid","notes":"","createdBy":"Maya Finance","subtotal":13466667,"taxRate":0.11,"tax":1481333,"amount":14948000,"accountId":"ACC-002","accountName":"Mandiri Corporate","paidDate":"2026-08-25"},
    {"id":"INV-004","type":"Sewa","projectId":"PRJ-005","projectName":"Project Bridge Construction","customerId":"CUS-004","customerName":"PT Karya Engineering","reference":"Sewa 2026-07-01 s/d 2026-07-31","invoiceDate":"2026-08-01","dueDate":"2026-08-31","periodStart":"2026-07-01","periodEnd":"2026-07-31","monthDays":30,"items":[{"desc":"Aluminium Ladder 8m","equipment":"Aluminium Ladder 8m","qty":3,"unitPrice":450000,"startDate":"2026-07-01","endDate":"2026-07-31","days":31,"amount":1395000,"sjDelivery":"SJK-2606-001","sjReturn":null,"adjusted":false},{"desc":"Aluminium Ladder 8m","equipment":"Aluminium Ladder 8m","qty":1,"unitPrice":450000,"startDate":"2026-07-01","endDate":"2026-07-31","days":31,"amount":465000,"sjDelivery":"SJK-2606-001","sjReturn":null,"adjusted":false},{"desc":"Generator 100 KVA","equipment":"Generator 100 KVA","qty":1,"unitPrice":8500000,"startDate":"2026-07-01","endDate":"2026-07-31","days":31,"amount":8783333,"sjDelivery":"SJK-2605-001","sjReturn":null,"adjusted":false},{"desc":"Power Cable 100m","equipment":"Power Cable 100m","qty":1,"unitPrice":900000,"startDate":"2026-07-01","endDate":"2026-07-31","days":31,"amount":930000,"sjDelivery":"SJK-2605-001","sjReturn":null,"adjusted":false},{"desc":"Power Cable 100m","equipment":"Power Cable 100m","qty":4,"unitPrice":900000,"startDate":"2026-07-01","endDate":"2026-07-31","days":31,"amount":3720000,"sjDelivery":"SJK-2605-001","sjReturn":null,"adjusted":false},{"desc":"Submersible Pump 4\"","equipment":"Submersible Pump 4\"","qty":2,"unitPrice":3000000,"startDate":"2026-07-01","endDate":"2026-07-31","days":31,"amount":6200000,"sjDelivery":"SJK-2606-001","sjReturn":null,"adjusted":false}],"status":"Paid","notes":"","createdBy":"Maya Finance","subtotal":21493333,"taxRate":0.11,"tax":2364267,"amount":23857600,"accountId":"ACC-004","accountName":"BCA Bekasi","paidDate":"2026-08-20"},
    {"id":"INV-005","type":"Jual","projectId":"PRJ-005","projectName":"Project Bridge Construction","customerId":"CUS-004","customerName":"PT Karya Engineering","reference":"SO-003","invoiceDate":"2026-08-22","dueDate":"2026-09-05","items":[{"desc":"Power Cable 100m (hilang di lokasi proyek, dibeli pelanggan)","qty":1,"unitPrice":900000,"amount":900000}],"status":"Paid","notes":"","createdBy":"System","subtotal":900000,"taxRate":0,"tax":0,"amount":900000,"accountId":"ACC-001","accountName":"BCA Operational","paidDate":"2026-09-01","saleId":"SO-003"},
    {"id":"INV-006","type":"Sewa","projectId":"PRJ-001","projectName":"Project Data Center Jakarta","customerId":"CUS-001","customerName":"PT Data Center Indonesia","reference":"Sewa 2026-08-01 s/d 2026-08-31","invoiceDate":"2026-09-01","dueDate":"2026-10-01","periodStart":"2026-08-01","periodEnd":"2026-08-31","monthDays":30,"items":[{"desc":"Air Compressor 10HP","equipment":"Air Compressor 10HP","qty":2,"unitPrice":4000000,"startDate":"2026-08-16","endDate":"2026-08-31","days":16,"amount":4266667,"sjDelivery":"SJK-2608-003","sjReturn":null,"adjusted":false},{"desc":"Aluminium Ladder 6m","equipment":"Aluminium Ladder 6m","qty":3,"unitPrice":300000,"startDate":"2026-08-02","endDate":"2026-08-31","days":30,"amount":900000,"sjDelivery":"SJK-2608-001","sjReturn":null,"adjusted":false},{"desc":"Generator 50 KVA","equipment":"Generator 50 KVA","qty":2,"unitPrice":5000000,"startDate":"2026-08-02","endDate":"2026-08-31","days":30,"amount":10000000,"sjDelivery":"SJK-2608-001","sjReturn":null,"adjusted":false},{"desc":"Power Cable 50m","equipment":"Power Cable 50m","qty":10,"unitPrice":500000,"startDate":"2026-08-02","endDate":"2026-08-31","days":30,"amount":5000000,"sjDelivery":"SJK-2608-001","sjReturn":null,"adjusted":false},{"desc":"Tower Light 4x1000W","equipment":"Tower Light 4x1000W","qty":4,"unitPrice":2500000,"startDate":"2026-08-16","endDate":"2026-08-31","days":16,"amount":5333333,"sjDelivery":"SJK-2608-003","sjReturn":null,"adjusted":false}],"status":"Paid","notes":"","createdBy":"Maya Finance","subtotal":25500000,"taxRate":0.11,"tax":2805000,"amount":28305000,"accountId":"ACC-001","accountName":"BCA Operational","paidDate":"2026-09-15"},
    {"id":"INV-007","type":"Sewa","projectId":"PRJ-002","projectName":"Project Data Center Bekasi","customerId":"CUS-001","customerName":"PT Data Center Indonesia","reference":"Sewa 2026-08-01 s/d 2026-08-31","invoiceDate":"2026-09-01","dueDate":"2026-10-01","periodStart":"2026-08-01","periodEnd":"2026-08-31","monthDays":30,"items":[{"desc":"Generator 100 KVA","equipment":"Generator 100 KVA","qty":2,"unitPrice":8500000,"startDate":"2026-08-11","endDate":"2026-08-31","days":21,"amount":11900000,"sjDelivery":"SJK-2608-002","sjReturn":null,"adjusted":false},{"desc":"Power Cable 100m","equipment":"Power Cable 100m","qty":8,"unitPrice":900000,"startDate":"2026-08-11","endDate":"2026-08-31","days":21,"amount":5040000,"sjDelivery":"SJK-2608-002","sjReturn":null,"adjusted":false}],"status":"Issued","notes":"","createdBy":"Maya Finance","subtotal":16940000,"taxRate":0.11,"tax":1863400,"amount":18803400,"accountId":"ACC-002","accountName":"Mandiri Corporate"},
    {"id":"INV-008","type":"Sewa","projectId":"PRJ-003","projectName":"Project Infrastructure Expansion","customerId":"CUS-002","customerName":"PT Infrastruktur Nusantara","reference":"Sewa 2026-08-01 s/d 2026-08-31","invoiceDate":"2026-09-01","dueDate":"2026-10-01","periodStart":"2026-08-01","periodEnd":"2026-08-31","monthDays":30,"items":[{"desc":"Aluminium Ladder 8m","equipment":"Aluminium Ladder 8m","qty":5,"unitPrice":450000,"startDate":"2026-08-01","endDate":"2026-08-31","days":31,"amount":2325000,"sjDelivery":"SJK-2607-001","sjReturn":null,"adjusted":false},{"desc":"Generator 100 KVA","equipment":"Generator 100 KVA","qty":2,"unitPrice":8500000,"startDate":"2026-08-01","endDate":"2026-08-31","days":31,"amount":17566667,"sjDelivery":"SJK-2607-001","sjReturn":null,"adjusted":false},{"desc":"Submersible Pump 4\"","equipment":"Submersible Pump 4\"","qty":2,"unitPrice":3000000,"startDate":"2026-08-01","endDate":"2026-08-31","days":31,"amount":6200000,"sjDelivery":"SJK-2607-001","sjReturn":null,"adjusted":false}],"status":"Partially Paid","notes":"","createdBy":"Maya Finance","subtotal":26091667,"taxRate":0.11,"tax":2870083,"amount":28961750,"accountId":"ACC-002","accountName":"Mandiri Corporate","paidDate":null},
    {"id":"INV-009","type":"Sewa","projectId":"PRJ-004","projectName":"Project Warehouse Renovation","customerId":"CUS-003","customerName":"PT Mitra Teknologi","reference":"Sewa 2026-08-01 s/d 2026-08-31","invoiceDate":"2026-09-01","dueDate":"2026-10-01","periodStart":"2026-08-01","periodEnd":"2026-08-31","monthDays":30,"items":[{"desc":"Air Compressor 10HP","equipment":"Air Compressor 10HP","qty":2,"unitPrice":4000000,"startDate":"2026-08-21","endDate":"2026-08-31","days":11,"amount":2933333,"sjDelivery":"SJK-2608-004","sjReturn":null,"adjusted":false},{"desc":"Welding Machine 400A","equipment":"Welding Machine 400A","qty":1,"unitPrice":3500000,"startDate":"2026-08-21","endDate":"2026-08-31","days":11,"amount":1283333,"sjDelivery":"SJK-2608-004","sjReturn":null,"adjusted":false}],"status":"Paid","notes":"","createdBy":"Maya Finance","subtotal":4216666,"taxRate":0.11,"tax":463833,"amount":4680499,"accountId":"ACC-001","accountName":"BCA Operational","paidDate":"2026-09-28"},
    {"id":"INV-010","type":"Sewa","projectId":"PRJ-005","projectName":"Project Bridge Construction","customerId":"CUS-004","customerName":"PT Karya Engineering","reference":"Sewa 2026-08-01 s/d 2026-08-31","invoiceDate":"2026-09-01","dueDate":"2026-10-01","periodStart":"2026-08-01","periodEnd":"2026-08-31","monthDays":30,"items":[{"desc":"Aluminium Ladder 8m","equipment":"Aluminium Ladder 8m","qty":3,"unitPrice":450000,"startDate":"2026-08-01","endDate":"2026-08-31","days":31,"amount":1395000,"sjDelivery":"SJK-2606-001","sjReturn":"SJR-2608-002","adjusted":false},{"desc":"Aluminium Ladder 8m","equipment":"Aluminium Ladder 8m","qty":1,"unitPrice":450000,"startDate":"2026-08-01","endDate":"2026-08-31","days":31,"amount":465000,"sjDelivery":"SJK-2606-001","sjReturn":"SJR-2608-002","adjusted":false},{"desc":"Generator 100 KVA","equipment":"Generator 100 KVA","qty":1,"unitPrice":8500000,"startDate":"2026-08-01","endDate":"2026-08-16","days":16,"amount":4533333,"sjDelivery":"SJK-2605-001","sjReturn":"SJR-2608-001","adjusted":false},{"desc":"Power Cable 100m","equipment":"Power Cable 100m","qty":1,"unitPrice":900000,"startDate":"2026-08-01","endDate":"2026-08-16","days":16,"amount":480000,"sjDelivery":"SJK-2605-001","sjReturn":"HL-2608-001","adjusted":false},{"desc":"Power Cable 100m","equipment":"Power Cable 100m","qty":4,"unitPrice":900000,"startDate":"2026-08-01","endDate":"2026-08-16","days":16,"amount":1920000,"sjDelivery":"SJK-2605-001","sjReturn":"SJR-2608-001","adjusted":false},{"desc":"Submersible Pump 4\"","equipment":"Submersible Pump 4\"","qty":2,"unitPrice":3000000,"startDate":"2026-08-01","endDate":"2026-08-31","days":31,"amount":6200000,"sjDelivery":"SJK-2606-001","sjReturn":"SJR-2608-002","adjusted":false}],"status":"Paid","notes":"","createdBy":"Maya Finance","subtotal":14993333,"taxRate":0.11,"tax":1649267,"amount":16642600,"accountId":"ACC-004","accountName":"BCA Bekasi","paidDate":"2026-09-30"},
    {"id":"INV-011","type":"Klaim","projectId":"PRJ-005","projectName":"Project Bridge Construction","customerId":"CUS-004","customerName":"PT Karya Engineering","reference":"RET-002 / CLM-002","invoiceDate":"2026-09-02","dueDate":"2026-09-16","items":[{"desc":"Klaim Damaged - bent middle section: Aluminium Ladder 8m","qty":1,"unitPrice":450000,"amount":450000}],"status":"Issued","notes":"","createdBy":"System","subtotal":450000,"taxRate":0,"tax":0,"amount":450000,"accountId":"ACC-001","accountName":"BCA Operational"},
    {"id":"INV-012","type":"Sewa","projectId":"PRJ-001","projectName":"Project Data Center Jakarta","customerId":"CUS-001","customerName":"PT Data Center Indonesia","reference":"Sewa 2026-09-01 s/d 2026-09-30","invoiceDate":"2026-10-01","dueDate":"2026-10-31","periodStart":"2026-09-01","periodEnd":"2026-09-30","monthDays":30,"items":[{"desc":"Air Compressor 10HP","equipment":"Air Compressor 10HP","qty":2,"unitPrice":4000000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":8000000,"sjDelivery":"SJK-2608-003","sjReturn":null,"adjusted":false},{"desc":"Aluminium Ladder 6m","equipment":"Aluminium Ladder 6m","qty":3,"unitPrice":300000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":900000,"sjDelivery":"SJK-2608-001","sjReturn":null,"adjusted":false},{"desc":"Generator 50 KVA","equipment":"Generator 50 KVA","qty":2,"unitPrice":5000000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":10000000,"sjDelivery":"SJK-2608-001","sjReturn":null,"adjusted":false},{"desc":"Power Cable 50m","equipment":"Power Cable 50m","qty":10,"unitPrice":500000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":5000000,"sjDelivery":"SJK-2608-001","sjReturn":null,"adjusted":false},{"desc":"Tower Light 4x1000W","equipment":"Tower Light 4x1000W","qty":4,"unitPrice":2500000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":10000000,"sjDelivery":"SJK-2608-003","sjReturn":null,"adjusted":false}],"status":"Partially Paid","notes":"","createdBy":"Maya Finance","subtotal":33900000,"taxRate":0.11,"tax":3729000,"amount":37629000,"accountId":"ACC-001","accountName":"BCA Operational","paidDate":null},
    {"id":"INV-013","type":"Sewa","projectId":"PRJ-002","projectName":"Project Data Center Bekasi","customerId":"CUS-001","customerName":"PT Data Center Indonesia","reference":"Sewa 2026-09-01 s/d 2026-09-30","invoiceDate":"2026-10-01","dueDate":"2026-10-31","periodStart":"2026-09-01","periodEnd":"2026-09-30","monthDays":30,"items":[{"desc":"Generator 100 KVA","equipment":"Generator 100 KVA","qty":2,"unitPrice":8500000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":17000000,"sjDelivery":"SJK-2608-002","sjReturn":null,"adjusted":false},{"desc":"Power Cable 100m","equipment":"Power Cable 100m","qty":8,"unitPrice":900000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":7200000,"sjDelivery":"SJK-2608-002","sjReturn":null,"adjusted":false}],"status":"Issued","notes":"","createdBy":"Maya Finance","subtotal":24200000,"taxRate":0.11,"tax":2662000,"amount":26862000,"accountId":"ACC-002","accountName":"Mandiri Corporate"},
    {"id":"INV-014","type":"Sewa","projectId":"PRJ-003","projectName":"Project Infrastructure Expansion","customerId":"CUS-002","customerName":"PT Infrastruktur Nusantara","reference":"Sewa 2026-09-01 s/d 2026-09-30","invoiceDate":"2026-10-01","dueDate":"2026-10-31","periodStart":"2026-09-01","periodEnd":"2026-09-30","monthDays":30,"items":[{"desc":"Aluminium Ladder 8m","equipment":"Aluminium Ladder 8m","qty":5,"unitPrice":450000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":2250000,"sjDelivery":"SJK-2607-001","sjReturn":null,"adjusted":false},{"desc":"Generator 100 KVA","equipment":"Generator 100 KVA","qty":2,"unitPrice":8500000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":17000000,"sjDelivery":"SJK-2607-001","sjReturn":null,"adjusted":false},{"desc":"Submersible Pump 4\"","equipment":"Submersible Pump 4\"","qty":2,"unitPrice":3000000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":6000000,"sjDelivery":"SJK-2607-001","sjReturn":null,"adjusted":false}],"status":"Issued","notes":"","createdBy":"Maya Finance","subtotal":25250000,"taxRate":0.11,"tax":2777500,"amount":28027500,"accountId":"ACC-002","accountName":"Mandiri Corporate"},
    {"id":"INV-015","type":"Sewa","projectId":"PRJ-004","projectName":"Project Warehouse Renovation","customerId":"CUS-003","customerName":"PT Mitra Teknologi","reference":"Sewa 2026-09-01 s/d 2026-09-30","invoiceDate":"2026-10-01","dueDate":"2026-10-31","periodStart":"2026-09-01","periodEnd":"2026-09-30","monthDays":30,"items":[{"desc":"Air Compressor 10HP","equipment":"Air Compressor 10HP","qty":2,"unitPrice":4000000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":8000000,"sjDelivery":"SJK-2608-004","sjReturn":null,"adjusted":false},{"desc":"Welding Machine 400A","equipment":"Welding Machine 400A","qty":1,"unitPrice":3500000,"startDate":"2026-09-01","endDate":"2026-09-30","days":30,"amount":3500000,"sjDelivery":"SJK-2608-004","sjReturn":null,"adjusted":false}],"status":"Issued","notes":"","createdBy":"Maya Finance","subtotal":11500000,"taxRate":0.11,"tax":1265000,"amount":12765000,"accountId":"ACC-001","accountName":"BCA Operational"},
  ],

  // ---- PAYMENTS ----
  // kind: Cicilan | Lunas. Sisa tagihan = invoice.amount − Σ payments
  payments: [
    {"id":"PAY-001","invoiceId":"INV-001","customerId":"CUS-004","date":"2026-06-20","amount":7696000,"kind":"Lunas","accountId":"ACC-004","method":"Transfer","reference":"TRF-20260620","notes":"","user":"Maya Finance"},
    {"id":"PAY-002","invoiceId":"INV-002","customerId":"CUS-004","date":"2026-07-18","amount":22799400,"kind":"Lunas","accountId":"ACC-004","method":"Transfer","reference":"TRF-20260718","notes":"","user":"Maya Finance"},
    {"id":"PAY-003","invoiceId":"INV-003","customerId":"CUS-002","date":"2026-08-25","amount":14948000,"kind":"Lunas","accountId":"ACC-002","method":"Transfer","reference":"TRF-20260825","notes":"","user":"Maya Finance"},
    {"id":"PAY-004","invoiceId":"INV-004","customerId":"CUS-004","date":"2026-08-20","amount":23857600,"kind":"Lunas","accountId":"ACC-004","method":"Transfer","reference":"TRF-20260820","notes":"","user":"Maya Finance"},
    {"id":"PAY-005","invoiceId":"INV-005","customerId":"CUS-004","date":"2026-09-01","amount":900000,"kind":"Lunas","accountId":"ACC-001","method":"Transfer","reference":"TRF-20260901","notes":"","user":"Maya Finance"},
    {"id":"PAY-006","invoiceId":"INV-006","customerId":"CUS-001","date":"2026-09-15","amount":28305000,"kind":"Lunas","accountId":"ACC-001","method":"Transfer","reference":"TRF-20260915","notes":"","user":"Maya Finance"},
    {"id":"PAY-007","invoiceId":"INV-009","customerId":"CUS-003","date":"2026-09-28","amount":4680499,"kind":"Lunas","accountId":"ACC-001","method":"Transfer","reference":"TRF-20260928","notes":"","user":"Maya Finance"},
    {"id":"PAY-008","invoiceId":"INV-010","customerId":"CUS-004","date":"2026-09-10","amount":8300000,"kind":"Cicilan","accountId":"ACC-004","method":"Transfer","reference":"TRF-20260910","notes":"","user":"Maya Finance"},
    {"id":"PAY-009","invoiceId":"INV-010","customerId":"CUS-004","date":"2026-09-30","amount":8342600,"kind":"Lunas","accountId":"ACC-004","method":"Transfer","reference":"TRF-20260930","notes":"","user":"Maya Finance"},
    {"id":"PAY-010","invoiceId":"INV-008","customerId":"CUS-002","date":"2026-09-20","amount":14500000,"kind":"Cicilan","accountId":"ACC-002","method":"Transfer","reference":"TRF-20260920","notes":"","user":"Maya Finance"},
    {"id":"PAY-011","invoiceId":"INV-012","customerId":"CUS-001","date":"2026-10-05","amount":15100000,"kind":"Cicilan","accountId":"ACC-001","method":"Transfer","reference":"TRF-20261005","notes":"","user":"Maya Finance"},
  ],

  // ---- BUKU KAS & BANK ----
  // type IN = Bon Biru (masuk), OUT = Bon Merah (keluar). category → BizLogic.CashBank.CATEGORIES
  ledger: [
    {"id":"TRX-001","voucherNo":"BB-2606-001","date":"2026-06-20","bankAccountId":"ACC-004","type":"IN","category":"bank_in_ar","reference":"PAY-001 / INV-001","description":"Pembayaran lunas INV-001 - PT Karya Engineering","party":"PT Karya Engineering","amount":7696000,"source":"payment","transferId":null,"reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-002","voucherNo":"BB-2607-001","date":"2026-07-18","bankAccountId":"ACC-004","type":"IN","category":"bank_in_ar","reference":"PAY-002 / INV-002","description":"Pembayaran lunas INV-002 - PT Karya Engineering","party":"PT Karya Engineering","amount":22799400,"source":"payment","transferId":null,"reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-004","voucherNo":"BB-2608-001","date":"2026-08-20","bankAccountId":"ACC-004","type":"IN","category":"bank_in_ar","reference":"PAY-004 / INV-004","description":"Pembayaran lunas INV-004 - PT Karya Engineering","party":"PT Karya Engineering","amount":23857600,"source":"payment","transferId":null,"reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-003","voucherNo":"BB-2608-002","date":"2026-08-25","bankAccountId":"ACC-002","type":"IN","category":"bank_in_ar","reference":"PAY-003 / INV-003","description":"Pembayaran lunas INV-003 - PT Infrastruktur Nusantara","party":"PT Infrastruktur Nusantara","amount":14948000,"source":"payment","transferId":null,"reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-005","voucherNo":"BB-2609-001","date":"2026-09-01","bankAccountId":"ACC-001","type":"IN","category":"bank_in_ar","reference":"PAY-005 / INV-005","description":"Pembayaran lunas INV-005 - PT Karya Engineering","party":"PT Karya Engineering","amount":900000,"source":"payment","transferId":null,"reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-012","voucherNo":"BM-2609-001","date":"2026-09-02","bankAccountId":"ACC-001","type":"OUT","category":"bank_out_cash","reference":"BB-2609-002","description":"Penarikan tunai untuk mengisi Kas Kantor","party":"Kas Kantor Cileungsi","amount":15000000,"source":"transfer","transferId":"TF-SEED-1","reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-013","voucherNo":"BB-2609-002","date":"2026-09-02","bankAccountId":"ACC-005","type":"IN","category":"kas_in_transfer","reference":"BM-2609-001","description":"Penarikan tunai untuk mengisi Kas Kantor","party":"BCA Operational","amount":15000000,"source":"transfer","transferId":"TF-SEED-1","reconciled":false,"user":"Maya Finance","method":"Cash"},
    {"id":"TRX-014","voucherNo":"BM-2609-002","date":"2026-09-05","bankAccountId":"ACC-005","type":"OUT","category":"kas_out_opex","reference":"SJK-2609","description":"BBM & tol pengiriman alat","party":"SPBU / Jasa Marga","amount":1250000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","jcat":"JC-003","method":"Cash"},
    {"id":"TRX-015","voucherNo":"BM-2609-003","date":"2026-09-08","bankAccountId":"ACC-005","type":"OUT","category":"kas_out_advance","reference":"","description":"Kasbon driver","party":"Budi Santoso","amount":2000000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","jcat":"JC-011","method":"Cash"},
    {"id":"TRX-008","voucherNo":"BB-2609-003","date":"2026-09-10","bankAccountId":"ACC-004","type":"IN","category":"bank_in_ar","reference":"PAY-008 / INV-010","description":"Pembayaran cicilan INV-010 - PT Karya Engineering","party":"PT Karya Engineering","amount":8300000,"source":"payment","transferId":null,"reconciled":true,"user":"Maya Finance","reconId":"REK-001","method":"Transfer"},
    {"id":"TRX-016","voucherNo":"BM-2609-004","date":"2026-09-12","bankAccountId":"ACC-002","type":"OUT","category":"bank_out_supplier","reference":"PO-005","description":"Pelunasan PO-005","party":"PT Tangga Jaya","payKind":"Pelunasan","amount":22000000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-006","voucherNo":"BB-2609-004","date":"2026-09-15","bankAccountId":"ACC-001","type":"IN","category":"bank_in_ar","reference":"PAY-006 / INV-006","description":"Pembayaran lunas INV-006 - PT Data Center Indonesia","party":"PT Data Center Indonesia","amount":28305000,"source":"payment","transferId":null,"reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-017","voucherNo":"BM-2609-005","date":"2026-09-18","bankAccountId":"ACC-001","type":"OUT","category":"bank_out_supplier","reference":"PO-003","description":"Uang muka (DP) PO-003","party":"PT Alat Berat Indonesia","payKind":"DP","amount":100000000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-010","voucherNo":"BB-2609-005","date":"2026-09-20","bankAccountId":"ACC-002","type":"IN","category":"bank_in_ar","reference":"PAY-010 / INV-008","description":"Pembayaran cicilan INV-008 - PT Infrastruktur Nusantara","party":"PT Infrastruktur Nusantara","amount":14500000,"source":"payment","transferId":null,"reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-018","voucherNo":"BB-2609-006","date":"2026-09-22","bankAccountId":"ACC-002","type":"IN","category":"bank_in_dp","reference":"","description":"Uang muka sewa proyek baru","party":"PT Mitra Teknologi","amount":20000000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","jcat":"JC-016","method":"Transfer"},
    {"id":"TRX-019","voucherNo":"BM-2609-006","date":"2026-09-25","bankAccountId":"ACC-005","type":"OUT","category":"kas_out_payroll","reference":"","description":"Gaji helper gudang September","party":"Karyawan harian","amount":6500000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","jcat":"JC-007","method":"Cash"},
    {"id":"TRX-007","voucherNo":"BB-2609-007","date":"2026-09-28","bankAccountId":"ACC-001","type":"IN","category":"bank_in_ar","reference":"PAY-007 / INV-009","description":"Pembayaran lunas INV-009 - PT Mitra Teknologi","party":"PT Mitra Teknologi","amount":4680499,"source":"payment","transferId":null,"reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-009","voucherNo":"BB-2609-008","date":"2026-09-30","bankAccountId":"ACC-004","type":"IN","category":"bank_in_ar","reference":"PAY-009 / INV-010","description":"Pembayaran lunas INV-010 - PT Karya Engineering","party":"PT Karya Engineering","amount":8342600,"source":"payment","transferId":null,"reconciled":true,"user":"Maya Finance","reconId":"REK-001","method":"Transfer"},
    {"id":"TRX-020","voucherNo":"BM-2609-007","date":"2026-09-30","bankAccountId":"ACC-001","type":"OUT","category":"bank_out_admin","reference":"","description":"Biaya administrasi rekening September","party":"BCA","amount":35000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","jcat":"JC-009","method":"Transfer"},
    {"id":"TRX-021","voucherNo":"BB-2609-009","date":"2026-09-30","bankAccountId":"ACC-003","type":"IN","category":"bank_in_interest","reference":"","description":"Jasa giro September","party":"BNI","amount":125000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","jcat":"JC-019","method":"Transfer"},
    {"id":"TRX-022","voucherNo":"BB-2610-001","date":"2026-10-03","bankAccountId":"ACC-005","type":"IN","category":"kas_in_refund","reference":"","description":"Pengembalian kasbon (cicilan 1)","party":"Budi Santoso","amount":500000,"source":"manual","transferId":null,"reconciled":false,"user":"Rina Kasir","jcat":"JC-018","method":"Cash","posted":false},
    {"id":"TRX-011","voucherNo":"BB-2610-002","date":"2026-10-05","bankAccountId":"ACC-001","type":"IN","category":"bank_in_ar","reference":"PAY-011 / INV-012","description":"Pembayaran cicilan INV-012 - PT Data Center Indonesia","party":"PT Data Center Indonesia","amount":15100000,"source":"payment","transferId":null,"reconciled":false,"user":"Maya Finance","method":"Transfer"},
    {"id":"TRX-023","voucherNo":"BM-2610-001","date":"2026-10-06","bankAccountId":"ACC-002","type":"OUT","category":"bank_out_loan","reference":"","description":"Angsuran pinjaman modal kerja Oktober","party":"Bank Mandiri","amount":15000000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","jcat":"JC-013","method":"Transfer"},
    {"id":"TRX-024","voucherNo":"BB-2610-003","date":"2026-10-07","bankAccountId":"ACC-005","type":"IN","category":"kas_in_sale","reference":"","description":"Penjualan tunai besi bekas","party":"Pengepul","amount":750000,"source":"manual","transferId":null,"reconciled":false,"user":"Rina Kasir","jcat":"JC-017","method":"Cash","posted":false},
    {"id":"TRX-025","voucherNo":"BM-2609-008","date":"2026-09-10","bankAccountId":"ACC-005","type":"OUT","category":"kas_out_opex","reference":"","description":"Pembelian ATK & materai","party":"Toko Sinar Jaya","amount":850000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","jcat":"JC-001","method":"Cash"},
    {"id":"TRX-026","voucherNo":"BM-2609-009","date":"2026-09-15","bankAccountId":"ACC-001","type":"OUT","category":"bank_out_supplier","reference":"INV/TL/0915","description":"Sewa truk crane mobilisasi genset (net setelah PPh 23)","party":"CV Trans Logistik","amount":9800000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","projectId":"PRJ-001","jcat":"JC-008","method":"Transfer"},
    {"id":"TRX-027","voucherNo":"BM-2609-010","date":"2026-09-20","bankAccountId":"ACC-001","type":"OUT","category":"bank_out_supplier","reference":"PLN-0826","description":"Listrik kantor & gudang Agustus","party":"PLN","amount":3200000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","jcat":"JC-005","method":"Transfer"},
    {"id":"TRX-028","voucherNo":"BM-2609-011","date":"2026-09-24","bankAccountId":"ACC-005","type":"OUT","category":"kas_out_opex","reference":"","description":"Servis truk B 9123 XY","party":"Bengkel Maju Motor","amount":1750000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","jcat":"JC-004","method":"Cash"},
    {"id":"TRX-029","voucherNo":"BM-2609-012","date":"2026-09-26","bankAccountId":"ACC-002","type":"OUT","category":"bank_out_supplier","reference":"","description":"Konsumsi & akomodasi tim pemasangan di lokasi proyek","party":"Hotel Bintang","amount":4500000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","projectId":"PRJ-003","jcat":"JC-006","method":"Transfer"},
    {"id":"TRX-030","voucherNo":"BM-2610-002","date":"2026-10-08","bankAccountId":"ACC-005","type":"OUT","category":"kas_out_payroll","reference":"NTPN-0926","description":"Setor PPh 23 masa September 2026","party":"Kas Negara","amount":200000,"source":"manual","transferId":null,"reconciled":false,"user":"Maya Finance","jcat":"JC-010","method":"Cash"},
    {"id":"TRX-031","voucherNo":"BMKAS-2610-001","date":"2026-10-09","bankAccountId":"ACC-005","type":"OUT","category":"kas_out_opex","jcat":"JC-002","method":"Cash","projectId":null,"reference":"NOTA-0910","description":"Pakan anjing jaga gudang Cileungsi (2 karung)","party":"Toko Pakan Sejahtera","amount":450000,"source":"manual","transferId":null,"reconciled":false,"user":"Rina Kasir","posted":false},
    {"id":"TRX-032","voucherNo":"BMKAS-2610-002","date":"2026-10-10","bankAccountId":"ACC-005","type":"OUT","category":"kas_out_opex","jcat":"JC-003","method":"Debit","projectId":"PRJ-001","reference":"SJK-2610","description":"Solar truk kirim alat ke Data Center Jakarta","party":"SPBU Cileungsi","amount":600000,"source":"manual","transferId":null,"reconciled":false,"user":"Rina Kasir","posted":false},
  ],

  // ---- REKONSILIASI BANK ----
  reconciliations: [
    { id: 'REK-001', accountId: 'ACC-004', accountName: 'BCA Bekasi', start: '2026-09-01', end: '2026-09-30', systemBalance: 120995600, statementBalance: 120995600, matchedCount: 2, unmatchedSystem: 0, unmatchedBank: 0, date: '2026-10-02', user: 'Maya Finance', difference: 0, status: 'Cocok' },
  ],

  // ---- COMPANY ACCOUNTS ----
  accounts: [
    { id: 'ACC-001', code: 'BCA', name: 'BCA Operational', kind: 'Bank', bank: 'BCA', accountNumber: '1234567890', accountHolder: 'PT EquipRent Indonesia', type: 'Operational', branch: 'Cileungsi', openingBalance: 500000000, status: 'Active' },
    { id: 'ACC-002', code: 'MDR', name: 'Mandiri Corporate', kind: 'Bank', bank: 'Mandiri', accountNumber: '0987654321', accountHolder: 'PT EquipRent Indonesia', type: 'Corporate', branch: 'Cileungsi', openingBalance: 250000000, status: 'Active' },
    { id: 'ACC-003', code: 'BNI', name: 'BNI Savings', kind: 'Bank', bank: 'BNI', accountNumber: '1122334455', accountHolder: 'PT EquipRent Indonesia', type: 'Savings', branch: 'Cileungsi', openingBalance: 100000000, status: 'Active' },
    { id: 'ACC-004', code: 'BCB', name: 'BCA Bekasi', kind: 'Bank', bank: 'BCA', accountNumber: '5566778899', accountHolder: 'PT EquipRent Indonesia', type: 'Operational', branch: 'Bekasi', openingBalance: 50000000, status: 'Active' },
    { id: 'ACC-005', code: 'KAS', name: 'Kas Kantor Cileungsi', kind: 'Kas', bank: '-', accountNumber: '-', accountHolder: 'Kasir Cileungsi', type: 'Petty Cash', branch: 'Cileungsi', openingBalance: 25000000, status: 'Active' },
  ],

  // ---- AKUNTANSI: BAGAN AKUN (COA) ----
  // Diambil dari sheet COA "excel/1. ALUR COA & TAX.xlsx". Akun Kas & Bank (1-11xx) dibuat otomatis dari Rekening Perusahaan.
  // opening = Saldo awal 2026 (= saldo akhir neraca 2025) sesuai saldo normal akun. tax = penanda akun pajak.
  coa: [
    { id: '1-1201', code: '1-1201', name: 'Investasi', group: '1-12' },
    { id: '1-1301', code: '1-1301', name: 'Piutang Dagang', group: '1-13' },
    { id: '1-1302', code: '1-1302', name: 'Piutang Dagang Girgant M', group: '1-13' },
    { id: '1-1303', code: '1-1303', name: 'Piutang Dagang Sumpit', group: '1-13' },
    { id: '1-1304', code: '1-1304', name: 'Piutang Pajak (PPh 23 Dibayar Dimuka)', group: '1-13', tax: 'PPH23_PREPAID' },
    { id: '1-1305', code: '1-1305', name: 'Pendapatan yang Masih Harus Diterima', group: '1-13' },
    { id: '1-1401', code: '1-1401', name: 'Pinjaman Karyawan', group: '1-14', opening: 3500000 },
    { id: '1-1402', code: '1-1402', name: 'Pinjaman Mandor', group: '1-14' },
    { id: '1-1403', code: '1-1403', name: 'Pinjaman Proyek', group: '1-14' },
    { id: '1-1404', code: '1-1404', name: 'Pinjaman Proyek Undip', group: '1-14' },
    { id: '1-1405', code: '1-1405', name: 'Pinjaman Surabaya', group: '1-14' },
    { id: '1-1406', code: '1-1406', name: 'Pinjaman Bali', group: '1-14' },
    { id: '1-1501', code: '1-1501', name: 'Persediaan Barang Dagangan', group: '1-15', opening: 9514500000 },
    { id: '1-1502', code: '1-1502', name: 'Persediaan Barang Dagangan Sumpit', group: '1-15' },
    { id: '1-1601', code: '1-1601', name: 'Uang Muka Import', group: '1-16' },
    { id: '1-1602', code: '1-1602', name: 'Uang Jaminan Sewa', group: '1-16', opening: 25000000 },
    { id: '1-2001', code: '1-2001', name: 'Inventaris Kendaraan', group: '1-2', opening: 650000000 },
    { id: '1-2002', code: '1-2002', name: 'Akumulasi Penyusutan Kendaraan', group: '1-2', opening: 243750000, normal: 'K' },
    { id: '1-2003', code: '1-2003', name: 'Inventaris Kantor', group: '1-2', opening: 85000000 },
    { id: '1-2004', code: '1-2004', name: 'Akumulasi Penyusutan Kantor', group: '1-2', opening: 42500000, normal: 'K' },
    { id: '1-2005', code: '1-2005', name: 'Inventaris Mesin', group: '1-2', opening: 240000000 },
    { id: '1-2006', code: '1-2006', name: 'Akumulasi Penyusutan Mesin', group: '1-2', opening: 96000000, normal: 'K' },
    { id: '2-1001', code: '2-1001', name: 'Hutang Dagang', group: '2-1' },
    { id: '2-1002', code: '2-1002', name: 'Hutang Dagang Girgant K', group: '2-1' },
    { id: '2-1003', code: '2-1003', name: 'Hutang Dagang Sumpit', group: '2-1' },
    { id: '2-2001', code: '2-2001', name: 'Hutang PPh 23', group: '2-2', tax: 'PPH23_PAYABLE' },
    { id: '2-2002', code: '2-2002', name: 'PPN Masukan dan Keluaran', group: '2-2', tax: 'PPN' },
    { id: '2-3001', code: '2-3001', name: 'Biaya yang Masih Harus Dibayar', group: '2-3' },
    { id: '2-3002', code: '2-3002', name: 'Uang Muka Masuk dan Keluar', group: '2-3' },
    { id: '2-3003', code: '2-3003', name: 'Pinjaman Pemegang Saham', group: '2-3', opening: 300000000 },
    { id: '2-3004', code: '2-3004', name: 'Hutang Bank', group: '2-3', opening: 450000000 },
    { id: '3-0001', code: '3-0001', name: 'Modal', group: '3-0', opening: 5000000000 },
    { id: '3-0002', code: '3-0002', name: 'Laba Ditahan', group: '3-0', opening: 5310750000 },
    { id: '3-0003', code: '3-0003', name: 'Laba / Rugi Berjalan', group: '3-0', system: true },
    { id: '4-0001', code: '4-0001', name: 'Penjualan', group: '4-0' },
    { id: '4-0002', code: '4-0002', name: 'Pendapatan Sewa', group: '4-0' },
    { id: '4-0003', code: '4-0003', name: 'Penjualan (Ongkir atau Ganti Rugi)', group: '4-0' },
    { id: '4-0004', code: '4-0004', name: 'Penjualan Sumpit', group: '4-0' },
    { id: '4-0005', code: '4-0005', name: 'Retur Penjualan', group: '4-0', normal: 'D' },
    { id: '5-0001', code: '5-0001', name: 'HPP Persediaan Barang Dagangan', group: '5-0' },
    { id: '5-0002', code: '5-0002', name: 'Pembelian', group: '5-0' },
    { id: '5-0003', code: '5-0003', name: 'Retur Pembelian', group: '5-0', normal: 'K' },
    { id: '5-0004', code: '5-0004', name: 'HPP Persediaan Barang Dagangan Sumpit', group: '5-0' },
    { id: '6-1001', code: '6-1001', name: 'Biaya Gaji', group: '6-1' },
    { id: '6-1002', code: '6-1002', name: 'Biaya Kesejahteraan Karyawan', group: '6-1' },
    { id: '6-1003', code: '6-1003', name: 'Biaya Pengobatan', group: '6-1' },
    { id: '6-1004', code: '6-1004', name: 'Biaya Perjalanan Dinas', group: '6-1' },
    { id: '6-2001', code: '6-2001', name: 'Biaya Telepon', group: '6-2' },
    { id: '6-2002', code: '6-2002', name: 'Biaya Listrik', group: '6-2' },
    { id: '6-2003', code: '6-2003', name: 'Biaya Tiki dan Materai', group: '6-2' },
    { id: '6-2004', code: '6-2004', name: 'Biaya Izin, Sumbangan dan Iuran', group: '6-2' },
    { id: '6-2005', code: '6-2005', name: 'Biaya ATK', group: '6-2' },
    { id: '6-2006', code: '6-2006', name: 'Biaya Rumah Tangga', group: '6-2' },
    { id: '6-2007', code: '6-2007', name: 'Biaya Entertainment', group: '6-2' },
    { id: '6-2008', code: '6-2008', name: 'Biaya Administrasi Bank', group: '6-2' },
    { id: '6-2009', code: '6-2009', name: 'Biaya Asuransi', group: '6-2' },
    { id: '6-2010', code: '6-2010', name: 'Biaya PPDU', group: '6-2' },
    { id: '6-2011', code: '6-2011', name: 'Biaya Administrasi', group: '6-2' },
    { id: '6-3001', code: '6-3001', name: 'Biaya Marketing', group: '6-3' },
    { id: '6-3002', code: '6-3002', name: 'Biaya Iklan', group: '6-3' },
    { id: '6-3003', code: '6-3003', name: 'Biaya Angkut Penjualan', group: '6-3' },
    { id: '6-3004', code: '6-3004', name: 'Biaya Angkut Pembelian', group: '6-3' },
    { id: '6-3005', code: '6-3005', name: 'Biaya Potongan Penjualan', group: '6-3' },
    { id: '6-3006', code: '6-3006', name: 'Biaya Potongan Pembelian', group: '6-3' },
    { id: '6-3007', code: '6-3007', name: 'Biaya Ekspedisi', group: '6-3' },
    { id: '6-3008', code: '6-3008', name: 'Biaya Komisi', group: '6-3' },
    { id: '6-4001', code: '6-4001', name: 'Biaya Pemeliharaan Kendaraan', group: '6-4' },
    { id: '6-4002', code: '6-4002', name: 'Biaya Pemeliharaan Peralatan Kantor', group: '6-4' },
    { id: '6-4003', code: '6-4003', name: 'Biaya Pemeliharaan Inventaris Mesin', group: '6-4' },
    { id: '6-4004', code: '6-4004', name: 'Biaya Pemeliharaan Gedung', group: '6-4' },
    { id: '6-4005', code: '6-4005', name: 'Biaya Pemeliharaan Gedung Baru', group: '6-4' },
    { id: '6-5001', code: '6-5001', name: 'Biaya Sewa Kendaraan', group: '6-5' },
    { id: '6-5002', code: '6-5002', name: 'Biaya Sewa Kontrakan', group: '6-5' },
    { id: '6-5003', code: '6-5003', name: 'Biaya Sewa Peralatan', group: '6-5' },
    { id: '6-5004', code: '6-5004', name: 'Biaya Sewa ATK', group: '6-5' },
    { id: '6-5005', code: '6-5005', name: 'Biaya Sewa Scaffolding', group: '6-5' },
    { id: '6-6001', code: '6-6001', name: 'Biaya Scaffolding', group: '6-6' },
    { id: '6-6002', code: '6-6002', name: 'Biaya Ringlock', group: '6-6' },
    { id: '6-6003', code: '6-6003', name: 'Biaya Hotdip', group: '6-6' },
    { id: '6-6004', code: '6-6004', name: 'Biaya Bekisting', group: '6-6' },
    { id: '6-6005', code: '6-6005', name: 'Biaya WF', group: '6-6' },
    { id: '6-6006', code: '6-6006', name: 'Biaya Cibanteng', group: '6-6' },
    { id: '6-6007', code: '6-6007', name: 'Biaya Sukawangi', group: '6-6' },
    { id: '6-6008', code: '6-6008', name: 'Biaya Cileungsi', group: '6-6' },
    { id: '6-6009', code: '6-6009', name: 'Biaya Pembangunan Gedung Mess', group: '6-6' },
    { id: '6-6010', code: '6-6010', name: 'Biaya Pembangunan Gedung Cileungsi', group: '6-6' },
    { id: '6-6011', code: '6-6011', name: 'Biaya Pembangunan Sukawangi', group: '6-6' },
    { id: '6-6012', code: '6-6012', name: 'Biaya Pembangunan Cibanteng', group: '6-6' },
    { id: '6-7001', code: '6-7001', name: 'Biaya Penyusutan Inventaris Kendaraan', group: '6-7' },
    { id: '6-7002', code: '6-7002', name: 'Biaya Penyusutan Inventaris Kantor', group: '6-7' },
    { id: '6-7003', code: '6-7003', name: 'Biaya Penyusutan Inventaris Mesin', group: '6-7' },
    { id: '6-8001', code: '6-8001', name: 'Biaya PPh dan PPN', group: '6-8' },
    { id: '6-8002', code: '6-8002', name: 'Biaya PPh 2 Persen', group: '6-8' },
    { id: '6-8003', code: '6-8003', name: 'Biaya Pajak', group: '6-8' },
    { id: '6-8004', code: '6-8004', name: 'Biaya Kerugian Penjualan', group: '6-8' },
    { id: '6-8005', code: '6-8005', name: 'Biaya Kerugian Pembelian Zinc', group: '6-8' },
    { id: '6-8006', code: '6-8006', name: 'Biaya Pembatalan Kwitansi', group: '6-8' },
    { id: '6-8007', code: '6-8007', name: 'Biaya Penghapusan Piutang', group: '6-8' },
    { id: '6-8008', code: '6-8008', name: 'Biaya Penghapusan Piutang Karyawan', group: '6-8' },
    { id: '6-9001', code: '6-9001', name: 'Biaya Lain-lain', group: '6-9' },
    { id: '7-1001', code: '7-1001', name: 'Pendapatan Lain-lain', group: '7-1' },
    { id: '7-1002', code: '7-1002', name: 'Pendapatan Bunga Investasi', group: '7-1' },
    { id: '7-1003', code: '7-1003', name: 'Pendapatan Bunga dan Jasa Giro', group: '7-1' },
    { id: '7-1004', code: '7-1004', name: 'Pendapatan Cibanteng', group: '7-1' },
    { id: '7-1005', code: '7-1005', name: 'Pendapatan Sewa (TVW)', group: '7-1' },
    { id: '7-2001', code: '7-2001', name: 'Selisih Kurs', group: '7-2' },
  ],

  // Pemetaan kategori Laporan Kas → akun COA default (diubah di Bagan Akun; per transaksi bisa diklasifikasikan ulang di Jurnal)
  coaCashMap: {
    kas_in_sale: '4-0001', kas_in_ar: '1-1301', kas_in_dp: '2-3002', kas_in_loan: '2-3004', kas_in_refund: '1-1401', kas_in_other: '7-1001',
    kas_out_opex: '6-9001', kas_out_supplier: '2-1001', kas_out_payroll: '6-1001', kas_out_advance: '1-1401', kas_out_loan: '2-3004',
    bank_in_loan: '2-3004', bank_in_ar: '1-1301', bank_in_dp: '2-3002', bank_in_refund: '2-1001', bank_in_interest: '7-1003',
    bank_out_supplier: '2-1001', bank_out_loan: '2-3004', bank_out_admin: '6-2008'
  },

  // ---- KATEGORI JURNAL ----
  // Dipilih kasir saat input transaksi kas. acc = akun COA lawan (masuk jurnal), cash = baris Laporan Kas per jenis rekening.
  journalCategories: [
    { id: 'JC-001', name: 'ATK & Materai', type: 'OUT', acc: '6-2005', cash: { Kas: 'kas_out_opex', Bank: 'bank_out_supplier' } },
    { id: 'JC-002', name: 'Pakan Hewan (Anjing Jaga Gudang)', type: 'OUT', acc: '6-2006', cash: { Kas: 'kas_out_opex', Bank: 'bank_out_supplier' } },
    { id: 'JC-003', name: 'BBM, Tol & Parkir', type: 'OUT', acc: '6-3003', cash: { Kas: 'kas_out_opex', Bank: 'bank_out_supplier' } },
    { id: 'JC-004', name: 'Servis & Sparepart Kendaraan', type: 'OUT', acc: '6-4001', cash: { Kas: 'kas_out_opex', Bank: 'bank_out_supplier' } },
    { id: 'JC-005', name: 'Listrik, Air & Telepon', type: 'OUT', acc: '6-2002', cash: { Kas: 'kas_out_opex', Bank: 'bank_out_supplier' } },
    { id: 'JC-006', name: 'Konsumsi & Akomodasi Proyek', type: 'OUT', acc: '6-1004', cash: { Kas: 'kas_out_opex', Bank: 'bank_out_supplier' } },
    { id: 'JC-007', name: 'Gaji & Upah Harian', type: 'OUT', acc: '6-1001', cash: { Kas: 'kas_out_payroll', Bank: 'bank_out_supplier' } },
    { id: 'JC-008', name: 'Sewa Kendaraan / Truk', type: 'OUT', acc: '6-5001', cash: { Kas: 'kas_out_opex', Bank: 'bank_out_supplier' } },
    { id: 'JC-009', name: 'Biaya Administrasi Bank', type: 'OUT', acc: '6-2008', cash: { Kas: 'kas_out_opex', Bank: 'bank_out_admin' } },
    { id: 'JC-010', name: 'Setor Pajak', type: 'OUT', acc: '2-2001', cash: { Kas: 'kas_out_payroll', Bank: 'bank_out_admin' } },
    { id: 'JC-011', name: 'Kasbon Karyawan', type: 'OUT', acc: '1-1401', cash: { Kas: 'kas_out_advance', Bank: 'bank_out_supplier' } },
    { id: 'JC-012', name: 'Bayar Hutang Supplier', type: 'OUT', acc: '2-1001', cash: { Kas: 'kas_out_supplier', Bank: 'bank_out_supplier' } },
    { id: 'JC-013', name: 'Angsuran Pinjaman Bank', type: 'OUT', acc: '2-3004', cash: { Kas: 'kas_out_loan', Bank: 'bank_out_loan' } },
    { id: 'JC-022', name: 'Biaya Ekspedisi (PT Logistik)', type: 'OUT', acc: '6-3007', cash: { Kas: 'kas_out_opex', Bank: 'bank_out_supplier' } },
    { id: 'JC-014', name: 'Biaya Lain-lain', type: 'OUT', acc: '6-9001', cash: { Kas: 'kas_out_opex', Bank: 'bank_out_supplier' } },
    { id: 'JC-015', name: 'Pembayaran Piutang Customer', type: 'IN', acc: '1-1301', cash: { Kas: 'kas_in_ar', Bank: 'bank_in_ar' } },
    { id: 'JC-016', name: 'Uang Muka Customer', type: 'IN', acc: '2-3002', cash: { Kas: 'kas_in_dp', Bank: 'bank_in_dp' } },
    { id: 'JC-017', name: 'Penjualan Tunai / Barang Bekas', type: 'IN', acc: '4-0001', cash: { Kas: 'kas_in_sale', Bank: 'bank_in_ar' } },
    { id: 'JC-018', name: 'Pengembalian Kasbon', type: 'IN', acc: '1-1401', cash: { Kas: 'kas_in_refund', Bank: 'bank_in_refund' } },
    { id: 'JC-019', name: 'Bunga / Jasa Giro', type: 'IN', acc: '7-1003', cash: { Kas: 'kas_in_other', Bank: 'bank_in_interest' } },
    { id: 'JC-020', name: 'Pendapatan Lain-lain', type: 'IN', acc: '7-1001', cash: { Kas: 'kas_in_other', Bank: 'bank_in_refund' } },
    { id: 'JC-021', name: 'Terima Pinjaman', type: 'IN', acc: '2-3004', cash: { Kas: 'kas_in_loan', Bank: 'bank_in_loan' } },
  ],

  // ---- JURNAL PENYESUAIAN (manual) ----
  // lines: d = debet, k = kredit. tax = data bukti potong PPh 23 (untuk XML Coretax)
  journals: [
    { id: 'JRN-001', no: 'JP-2609-001', date: '2026-09-15', desc: 'PPh 23 atas sewa truk crane CV Trans Logistik (koreksi biaya ke nilai bruto)', ref: 'BM-2609-009', projectId: 'PRJ-001', user: 'Maya Finance',
      lines: [{ acc: '6-5001', d: 200000, k: 0, memo: 'Biaya sewa bruto Rp 10.000.000' }, { acc: '2-2001', d: 0, k: 200000, memo: 'PPh 23 2% dipotong' }],
      tax: { party: 'CV Trans Logistik', npwp: '0712345678014000', dpp: 10000000, rate: 2, objectCode: '24-100-01', docNo: 'INV/TL/0915', docDate: '2026-09-15' } },
    { id: 'JRN-002', no: 'JP-2609-002', date: '2026-09-30', desc: 'Penyusutan aset tetap September 2026', ref: '', projectId: null, user: 'Maya Finance', tax: null,
      lines: [{ acc: '6-7001', d: 6770833, k: 0 }, { acc: '6-7002', d: 1770833, k: 0 }, { acc: '6-7003', d: 2500000, k: 0 },
              { acc: '1-2002', d: 0, k: 6770833 }, { acc: '1-2004', d: 0, k: 1770833 }, { acc: '1-2006', d: 0, k: 2500000 }] },
    { id: 'JRN-003', no: 'JP-2609-003', date: '2026-09-30', desc: 'Akrual listrik September (tagihan PLN belum dibayar)', ref: '', projectId: null, user: 'Maya Finance', tax: null,
      lines: [{ acc: '6-2002', d: 3450000, k: 0 }, { acc: '2-3001', d: 0, k: 3450000 }] },
  ],

  // ---- USERS ----
  users: [
    { id: 'USR-001', name: 'Ahmad Hidayat', username: 'admin', email: 'ahmad@equiprent.co.id', role: 'Admin', branch: 'All', status: 'Active', lastLogin: '2026-10-09 09:15' },
    { id: 'USR-002', name: 'Sari Dewi', username: 'piutang', email: 'sari@equiprent.co.id', role: 'Account Receivable', branch: 'Cileungsi', status: 'Active', lastLogin: '2026-10-09 08:45' },
    { id: 'USR-003', name: 'Maya Finance', username: 'finance', email: 'maya@equiprent.co.id', role: 'Finance', branch: 'Cileungsi', status: 'Active', lastLogin: '2026-10-09 10:00' },
    { id: 'USR-004', name: 'Lina Akuntan', username: 'accounting', email: 'lina@equiprent.co.id', role: 'Accounting & Tax', branch: 'Cileungsi', status: 'Active', lastLogin: '2026-10-09 08:30' },
    { id: 'USR-005', name: 'Rudi Purchasing', username: 'purchase', email: 'rudi@equiprent.co.id', role: 'Purchase', branch: 'Cileungsi', status: 'Active', lastLogin: '2026-10-08 16:00' },
    { id: 'USR-006', name: 'Joko Warehouse', username: 'logistik', email: 'joko@equiprent.co.id', role: 'Logistik', branch: 'Cileungsi', status: 'Active', lastLogin: '2026-10-09 07:30' },
    { id: 'USR-007', name: 'Rina Kasir', username: 'kasir', email: 'rina@equiprent.co.id', role: 'Kasir', branch: 'Cileungsi', status: 'Active', lastLogin: '2026-10-09 08:00' },
  ],

  // ---- ROLES ----
  roles: [
    { id: 'ROLE-001', name: 'Admin', description: 'Akses penuh. Satu-satunya yang boleh mengubah & menghapus data', usersCount: 1 },
    { id: 'ROLE-002', name: 'Account Receivable', description: 'Staff Piutang: ACC order sewa/jual, rekap tagihan, invoice, piutang', usersCount: 1 },
    { id: 'ROLE-003', name: 'Finance', description: 'Kas & bank, pembayaran, rekonsiliasi', usersCount: 1 },
    { id: 'ROLE-004', name: 'Accounting & Tax', description: 'Akuntansi, pajak, ACC permintaan perubahan data', usersCount: 1 },
    { id: 'ROLE-005', name: 'Purchase', description: 'Pembelian alat & supplier', usersCount: 1 },
    { id: 'ROLE-006', name: 'Logistik', description: 'Gudang, stok, kendaraan & pengemudi, surat jalan, estimasi & update posisi, inspeksi pengembalian (PT logistik)', usersCount: 1 },
    { id: 'ROLE-007', name: 'Kasir', description: 'Kasir: input transaksi kas (masuk jurnal setelah di-generate Accounting); input pelanggan, proyek, order sewa & jual', usersCount: 1 },
  ],

  // ---- PERMISSIONS MATRIX ----
  // Create/Update = boleh membuat & memproses dokumen. Mengubah/menghapus data yang sudah ada hanya Admin
  // (role lain lewat Permintaan Perubahan). Approve = ACC (order: Staff Piutang; perubahan data: Accounting).
  permissions: {
    modules: ['Dashboard','Customers','Projects','Rentals','Sales','Approvals','Deliveries','Returns','Claims','Stock','Equipment','Branches','Movements','Purchases','Drivers','Vehicles','Invoices','Payments','Accounts','Accounting','Tax','Users','Roles'],
    actions: ['View','Create','Update','Delete','Approve'],
    matrix: {
      'Admin': { default: true },
      'Account Receivable': { modules: {
        Dashboard: ['View'], Customers: ['View'], Projects: ['View'], Rentals: ['View','Approve'], Sales: ['View','Approve'], Approvals: ['View','Approve'],
        Deliveries: ['View'], Returns: ['View'], Claims: ['View','Create','Update','Approve'], Stock: ['View'],
        Invoices: ['View','Create','Update'], Payments: ['View','Create'] } },
      'Finance': { modules: {
        Dashboard: ['View'], Customers: ['View'], Invoices: ['View'], Payments: ['View','Create','Update'], Accounts: ['View','Create','Update'],
        Purchases: ['View','Approve'], Accounting: ['View'], Tax: ['View'] } },
      'Accounting & Tax': { modules: {
        Dashboard: ['View'], Customers: ['View'], Accounting: ['View','Create','Update','Approve'], Tax: ['View','Create','Update'],
        Accounts: ['View'], Invoices: ['View'], Payments: ['View'], Purchases: ['View'], Stock: ['View'] } },
      'Purchase': { modules: {
        Dashboard: ['View'], Purchases: ['View','Create','Update'], Stock: ['View'], Equipment: ['View'], Branches: ['View'] } },
      // Logistik = gudang + pengiriman (Ekspedisi & Driver digabung ke sini): kendaraan, pengemudi, estimasi, update posisi
      'Logistik': { modules: {
        Dashboard: ['View'], Projects: ['View'], Rentals: ['View','Update'], Sales: ['View','Update'], Deliveries: ['View','Create','Update'], Returns: ['View','Create','Update'],
        Stock: ['View','Create','Update'], Equipment: ['View','Create','Update'], Branches: ['View','Create','Update'], Movements: ['View'],
        Purchases: ['View','Create'], Drivers: ['View','Create','Update'], Vehicles: ['View','Create','Update'] } },
      'Kasir': { modules: {
        Dashboard: ['View'], Customers: ['View','Create'], Projects: ['View','Create','Update'], Rentals: ['View','Create'], Sales: ['View','Create'],
        Claims: ['View','Create'], Deliveries: ['View'], Returns: ['View'], Stock: ['View'], Equipment: ['View'], Invoices: ['View'],
        Accounts: ['View','Create'] } }, // kasir: input transaksi kas, masuk jurnal setelah di-generate Accounting
    }
  },

  // ---- NOTIFICATIONS ----
  notifications: [
    { id: 1, message: 'Delivery <strong>#DLV-004</strong> has departed', type: 'info', icon: 'bi-truck', time: '10 minutes ago', read: false, link: 'delivery-detail.html?id=DLV-004' },
    { id: 2, message: 'Return <strong>#RET-003</strong> is waiting for inspection', type: 'warning', icon: 'bi-box-arrow-in-left', time: '25 minutes ago', read: false, link: 'return-detail.html?id=RET-003' },
    { id: 3, message: 'Invoice <strong>#INV-013</strong> is approaching due date', type: 'orange', icon: 'bi-receipt', time: '1 hour ago', read: false, link: 'invoice-detail.html?id=INV-013' },
    { id: 4, message: 'Purchase <strong>#PO-003</strong> has arrived at Bekasi', type: 'green', icon: 'bi-box-seam', time: '2 hours ago', read: true, link: 'purchase-detail.html?id=PO-003' },
    { id: 5, message: 'Rental <strong>#RNT-009</strong> is waiting for approval', type: 'warning', icon: 'bi-clock-history', time: '3 hours ago', read: true, link: 'rental-detail.html?id=RNT-009' },
    { id: 6, message: '<strong>4 transaksi kas</strong> dari kasir menunggu di-generate ke jurnal', type: 'warning', icon: 'bi-journal-arrow-down', time: '4 hours ago', read: false, link: 'cash-report.html' },
    { id: 7, message: 'Stock alert: Generator 50 KVA low in Cileungsi', type: 'orange', icon: 'bi-exclamation-circle', time: '5 hours ago', read: true, link: 'stock.html' },
  ],

  // ---- ACTIVITY LOG ----
  activityLog: [
    { time: '09:12', date: '2026-09-04', action: 'Rental #RNT-009 created', user: 'Sari Dewi', type: 'info' },
    { time: '09:30', date: '2026-09-04', action: 'Return #RET-003 submitted for inspection', user: 'Joko Warehouse', type: 'warning' },
    { time: '10:15', date: '2026-09-04', action: 'Delivery #DLV-004 departed', user: 'Dimas Saputra', type: 'info' },
    { time: '10:45', date: '2026-09-04', action: 'RET-003: 4 unit tidak ikut dijemput, tetap di proyek PRJ-001', user: 'Joko Warehouse', type: 'warning' },
    { time: '11:00', date: '2026-09-04', action: 'Invoice #INV-009 issued for RNT-005', user: 'Maya Finance', type: 'success' },
    { time: '13:20', date: '2026-09-03', action: 'Purchase #PO-003 arrived at Bekasi', user: 'Warehouse Staff', type: 'success' },
    { time: '14:00', date: '2026-09-03', action: 'Equipment GEN-005 sent to maintenance', user: 'Joko Warehouse', type: 'warning' },
    { time: '15:30', date: '2026-09-03', action: 'Rental #RNT-008 delivery completed', user: 'Budi Santoso', type: 'success' },
    { time: '16:00', date: '2026-09-03', action: 'Invoice #INV-008 issued for RNT-008', user: 'Maya Finance', type: 'success' },
    { time: '09:00', date: '2026-09-02', action: 'Claim #CLM-002 invoiced', user: 'Maya Finance', type: 'info' },
  ],

  // ---- DEMO USERS FOR LOGIN ----
  demoUsers: [
    { username: 'admin', password: 'demo', name: 'Ahmad Hidayat', role: 'Admin', branch: 'All', initials: 'AH' },
    { username: 'piutang', password: 'demo', name: 'Sari Dewi', role: 'Account Receivable', branch: 'Cileungsi', initials: 'SD' },
    { username: 'finance', password: 'demo', name: 'Maya Finance', role: 'Finance', branch: 'Cileungsi', initials: 'MF' },
    { username: 'accounting', password: 'demo', name: 'Lina Akuntan', role: 'Accounting & Tax', branch: 'Cileungsi', initials: 'LA' },
    { username: 'purchase', password: 'demo', name: 'Rudi Purchasing', role: 'Purchase', branch: 'Cileungsi', initials: 'RP' },
    { username: 'logistik', password: 'demo', name: 'Joko Warehouse', role: 'Logistik', branch: 'Cileungsi', initials: 'JW' },
    { username: 'kasir', password: 'demo', name: 'Rina Kasir', role: 'Kasir', branch: 'Cileungsi', initials: 'RK' },
  ],

  // ---- SETTINGS ----
  // billingMonthDays = pembagi "Bulan Sewa" di rumus tagihan (template 30 hari)
  // taxRate = PPN efektif 11% (dihitung sebagai DPP 11/12 × PPN 12%, sesuai format Rekap Tagihan)
  // Keterlambatan SJ dari estimasi dibebankan ke Logistik: denda = harga sewa harian × hari telat × logisticsLateRate,
  // hari telat dihitung setelah toleransi logisticsLateGraceMinutes
  settings: { billingMonthDays: 30, taxRate: 0.11, paymentTermDays: 30, logisticsLateRate: 1, logisticsLateGraceMinutes: 120 },

  // ---- COMPANY INFO ----
  company: {
    name: 'PT EquipRent Indonesia',
    address: 'Jl. Raya Industri No. 10, Jakarta Utara 14330',
    phone: '021-555-0100',
    email: 'info@equiprent.co.id',
    website: 'www.equiprent.co.id',
    taxId: '01.234.567.8-012.000',
    sjCode: 'JKT', // kode di nomor surat jalan: 009/IV/26/JKT-SW
    // Perusahaan keluarga: PT penyedia alat (di atas) + PT pengirim alat. Satu aplikasi; PT logistik = role Logistik
    logistics: { name: 'PT EquipRent Logistik', short: 'Logistik' },
  },

  // ---- GOODS RECEIPTS ----
  goodsReceipts: [
    { id: 'GR-001', purchaseId: 'PO-001', vendor: 'PT Sumber Generator', branch: 'Cileungsi Warehouse', receiptDate: '2026-07-05', receivedBy: 'Joko Warehouse', notes: 'Diterima lengkap, kondisi baik', items: [{name:'Generator 50 KVA', qty:5},{name:'Generator 100 KVA', qty:3}], status: 'Completed', stockDocNo: 'PB-2607-001' },
    { id: 'GR-002', purchaseId: 'PO-002', vendor: 'PT Kabel Nusantara', branch: 'Cileungsi Warehouse', receiptDate: '2026-07-18', receivedBy: 'Joko Warehouse', notes: '', items: [{name:'Power Cable 50m', qty:50},{name:'Power Cable 100m', qty:20}], status: 'Completed', stockDocNo: 'PB-2607-003' },
  ],

  // ---- RENTAL EXTENSIONS ----
  extensions: [
    { id: 'EXT-001', rentalId: 'RNT-004', projectId: 'PRJ-003', customerName: 'PT Infrastruktur Nusantara', oldReturnDate: '2026-09-30', newReturnDate: '2026-10-15', days: 15, reason: 'Pekerjaan pondasi mundur 2 minggu', date: '2026-09-25', user: 'Sari Dewi' },
  ]
};

// --- Persistence Logic ---
// Naikkan angka ini setiap struktur data seed berubah, supaya localStorage lama di-reset.
const MOCK_SCHEMA_VERSION = '11-role-kasir';

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
