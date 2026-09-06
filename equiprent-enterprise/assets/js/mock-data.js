/* ============================================================
   EquipRent Enterprise — Mock Data
   Realistic Indonesian business data
   ============================================================ */

const MockData = {
  // ---- CUSTOMERS ----
  customers: [
    { id: 'CUS-001', code: 'PTDCI', name: 'PT Data Center Indonesia', pic: 'Ahmad Hidayat', phone: '021-5550101', email: 'ahmad@datacenter.co.id', address: 'Jl. Sudirman No. 45, Jakarta Selatan', status: 'Active' },
    { id: 'CUS-002', code: 'PTIN', name: 'PT Infrastruktur Nusantara', pic: 'Siti Rahmawati', phone: '021-5550202', email: 'siti@infranusa.co.id', address: 'Jl. Gatot Subroto No. 12, Jakarta Selatan', status: 'Active' },
    { id: 'CUS-003', code: 'PTMT', name: 'PT Mitra Teknologi', pic: 'Rudi Hartono', phone: '021-5550303', email: 'rudi@mitratek.co.id', address: 'Jl. TB Simatupang No. 88, Jakarta Timur', status: 'Active' },
    { id: 'CUS-004', code: 'PTKE', name: 'PT Karya Engineering', pic: 'Dewi Lestari', phone: '021-5550404', email: 'dewi@karyaeng.co.id', address: 'Jl. Raya Bekasi No. 23, Bekasi', status: 'Active' },
    { id: 'CUS-005', code: 'PTBJ', name: 'PT Bangun Jaya Konstruksi', pic: 'Eko Prasetyo', phone: '031-5550505', email: 'eko@bangunjaya.co.id', address: 'Jl. Basuki Rahmat No. 56, Surabaya', status: 'Inactive' },
  ],

  // ---- PROJECTS ----
  projects: [
    { id: 'PRJ-001', name: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', startDate: '2026-07-01', endDate: '2026-12-31', totalRentals: 3, activeEquipment: 15, status: 'Active' },
    { id: 'PRJ-002', name: 'Project Data Center Bekasi', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', startDate: '2026-08-01', endDate: '2027-02-28', totalRentals: 2, activeEquipment: 8, status: 'Active' },
    { id: 'PRJ-003', name: 'Project Infrastructure Expansion', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', startDate: '2026-06-15', endDate: '2026-11-30', totalRentals: 2, activeEquipment: 12, status: 'Active' },
    { id: 'PRJ-004', name: 'Project Warehouse Renovation', customerId: 'CUS-003', customerName: 'PT Mitra Teknologi', startDate: '2026-08-15', endDate: '2026-10-31', totalRentals: 1, activeEquipment: 5, status: 'Active' },
    { id: 'PRJ-005', name: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', startDate: '2026-05-01', endDate: '2026-08-31', totalRentals: 2, activeEquipment: 0, status: 'Completed' },
    { id: 'PRJ-006', name: 'Project Office Tower', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', startDate: '2026-09-01', endDate: '2027-06-30', totalRentals: 0, activeEquipment: 0, status: 'Planning' },
  ],

  // ---- EQUIPMENT CATEGORIES ----
  equipmentCategories: ['Generator', 'Cable', 'Ladder', 'Welding', 'Compressor', 'Lighting', 'Pump', 'Tools'],

  // ---- EQUIPMENT ----
  equipment: [
    { id: 'GEN-001', name: 'Generator 50 KVA', category: 'Generator', serial: 'GN-2024-001', condition: 'Good', branch: 'Jakarta', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-001', status: 'On Rental', rate: 5000000 },
    { id: 'GEN-002', name: 'Generator 50 KVA', category: 'Generator', serial: 'GN-2024-002', condition: 'Good', branch: 'Jakarta', branchId: 'BR-001', availability: 'Available', project: null, status: 'Available', rate: 5000000 },
    { id: 'GEN-003', name: 'Generator 100 KVA', category: 'Generator', serial: 'GN-2024-003', condition: 'Good', branch: 'Jakarta', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-003', status: 'On Rental', rate: 8500000 },
    { id: 'GEN-004', name: 'Generator 100 KVA', category: 'Generator', serial: 'GN-2024-004', condition: 'Good', branch: 'Bekasi', branchId: 'BR-002', availability: 'Available', project: null, status: 'Available', rate: 8500000 },
    { id: 'GEN-005', name: 'Generator 50 KVA', category: 'Generator', serial: 'GN-2024-005', condition: 'Maintenance', branch: 'Jakarta', branchId: 'BR-001', availability: 'Maintenance', project: null, status: 'Maintenance', rate: 5000000 },
    { id: 'CAB-001', name: 'Power Cable 50m', category: 'Cable', serial: 'CB-2024-001', condition: 'Good', branch: 'Jakarta', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-001', status: 'On Rental', rate: 500000 },
    { id: 'CAB-002', name: 'Power Cable 50m', category: 'Cable', serial: 'CB-2024-002', condition: 'Good', branch: 'Jakarta', branchId: 'BR-001', availability: 'Available', project: null, status: 'Available', rate: 500000 },
    { id: 'CAB-003', name: 'Power Cable 100m', category: 'Cable', serial: 'CB-2024-003', condition: 'Good', branch: 'Bekasi', branchId: 'BR-002', availability: 'On Rental', project: 'PRJ-002', status: 'On Rental', rate: 900000 },
    { id: 'LAD-001', name: 'Aluminium Ladder 6m', category: 'Ladder', serial: 'LD-2024-001', condition: 'Good', branch: 'Jakarta', branchId: 'BR-001', availability: 'Available', project: null, status: 'Available', rate: 300000 },
    { id: 'LAD-002', name: 'Aluminium Ladder 6m', category: 'Ladder', serial: 'LD-2024-002', condition: 'Damaged', branch: 'Jakarta', branchId: 'BR-001', availability: 'Damaged', project: null, status: 'Damaged', rate: 300000 },
    { id: 'LAD-003', name: 'Aluminium Ladder 8m', category: 'Ladder', serial: 'LD-2024-003', condition: 'Good', branch: 'Bekasi', branchId: 'BR-002', availability: 'On Rental', project: 'PRJ-003', status: 'On Rental', rate: 450000 },
    { id: 'WLD-001', name: 'Welding Machine 400A', category: 'Welding', serial: 'WL-2024-001', condition: 'Good', branch: 'Jakarta', branchId: 'BR-001', availability: 'Available', project: null, status: 'Available', rate: 3500000 },
    { id: 'WLD-002', name: 'Welding Machine 400A', category: 'Welding', serial: 'WL-2024-002', condition: 'Good', branch: 'Bekasi', branchId: 'BR-002', availability: 'Reserved', project: null, status: 'Reserved', rate: 3500000 },
    { id: 'CMP-001', name: 'Air Compressor 10HP', category: 'Compressor', serial: 'AC-2024-001', condition: 'Good', branch: 'Jakarta', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-004', status: 'On Rental', rate: 4000000 },
    { id: 'CMP-002', name: 'Air Compressor 10HP', category: 'Compressor', serial: 'AC-2024-002', condition: 'Good', branch: 'Jakarta', branchId: 'BR-001', availability: 'Available', project: null, status: 'Available', rate: 4000000 },
    { id: 'LGT-001', name: 'Tower Light 4x1000W', category: 'Lighting', serial: 'TL-2024-001', condition: 'Good', branch: 'Jakarta', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-001', status: 'On Rental', rate: 2500000 },
    { id: 'PMP-001', name: 'Submersible Pump 4"', category: 'Pump', serial: 'SP-2024-001', condition: 'Good', branch: 'Bekasi', branchId: 'BR-002', availability: 'Available', project: null, status: 'Available', rate: 3000000 },
    { id: 'PMP-002', name: 'Submersible Pump 4"', category: 'Pump', serial: 'SP-2024-002', condition: 'Good', branch: 'Jakarta', branchId: 'BR-001', availability: 'On Rental', project: 'PRJ-003', status: 'On Rental', rate: 3000000 },
  ],

  // ---- RENTALS ----
  rentals: [
    {
      id: 'RNT-001', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta',
      rentalDate: '2026-08-01', returnDate: '2026-10-31', branch: 'Jakarta', branchId: 'BR-001',
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
      id: 'RNT-002', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta',
      rentalDate: '2026-08-15', returnDate: '2026-11-15', branch: 'Jakarta', branchId: 'BR-001',
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
      id: 'RNT-003', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta',
      rentalDate: '2026-09-01', returnDate: '2026-11-30', branch: 'Jakarta', branchId: 'BR-001',
      totalItems: 2, deliveryStatus: 'Preparing', status: 'Approved', invoiceStatus: 'Draft',
      notes: 'Additional equipment for phase 2',
      items: [
        { equipmentId: 'PMP-002', name: 'Submersible Pump 4"', quantity: 3, rate: 3000000, duration: 3, subtotal: 27000000 },
        { equipmentId: 'WLD-001', name: 'Welding Machine 400A', quantity: 2, rate: 3500000, duration: 3, subtotal: 21000000 },
      ],
      subtotal: 48000000, discount: 3000000, total: 45000000,
      createdBy: 'Rental Staff', createdAt: '2026-08-28 10:00'
    },
    {
      id: 'RNT-004', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', projectId: 'PRJ-003', projectName: 'Project Infrastructure Expansion',
      rentalDate: '2026-07-15', returnDate: '2026-10-15', branch: 'Jakarta', branchId: 'BR-001',
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
      rentalDate: '2026-08-20', returnDate: '2026-11-20', branch: 'Jakarta', branchId: 'BR-001',
      totalItems: 2, deliveryStatus: 'Shipped', status: 'Shipped', invoiceStatus: 'Issued',
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
      rentalDate: '2026-08-20', returnDate: '2026-10-20', branch: 'Jakarta', branchId: 'BR-001',
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
      totalItems: 2, deliveryStatus: 'Completed', status: 'Returned', invoiceStatus: 'Paid',
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
      rentalDate: '2026-09-10', returnDate: '2026-10-31', branch: 'Jakarta', branchId: 'BR-001',
      totalItems: 1, deliveryStatus: 'Pending', status: 'Waiting Approval', invoiceStatus: 'Draft',
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

  // ---- DELIVERIES ----
  deliveries: [
    { id: 'DLV-001', rentalId: 'RNT-001', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', driverId: 'DRV-001', driverName: 'Budi Santoso', vehicleId: 'VHC-001', vehiclePlate: 'B 1234 XYZ', deliveryDate: '2026-08-02', destination: 'Jl. Sudirman No. 45, Jakarta Selatan', status: 'Completed', notes: 'Gate access card needed', items: [{name:'Generator 50 KVA', qty:2},{name:'Power Cable 50m', qty:10},{name:'Aluminium Ladder 6m', qty:3}] },
    { id: 'DLV-002', rentalId: 'RNT-002', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', driverId: 'DRV-002', driverName: 'Andi Pratama', vehicleId: 'VHC-002', vehiclePlate: 'B 5678 ABC', deliveryDate: '2026-08-16', destination: 'Jl. Sudirman No. 45, Jakarta Selatan', status: 'Completed', notes: '', items: [{name:'Tower Light 4x1000W', qty:4},{name:'Air Compressor 10HP', qty:2}] },
    { id: 'DLV-003', rentalId: 'RNT-004', projectId: 'PRJ-003', projectName: 'Project Infrastructure Expansion', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', driverId: 'DRV-001', driverName: 'Budi Santoso', vehicleId: 'VHC-001', vehiclePlate: 'B 1234 XYZ', deliveryDate: '2026-07-16', destination: 'Jl. Gatot Subroto No. 12, Jakarta Selatan', status: 'Completed', notes: '', items: [{name:'Generator 100 KVA', qty:2},{name:'Aluminium Ladder 8m', qty:5},{name:'Submersible Pump 4"', qty:2}] },
    { id: 'DLV-004', rentalId: 'RNT-005', projectId: 'PRJ-003', projectName: 'Project Infrastructure Expansion', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', driverId: 'DRV-003', driverName: 'Dimas Saputra', vehicleId: 'VHC-003', vehiclePlate: 'B 9012 DEF', deliveryDate: '2026-08-21', destination: 'Jl. Gatot Subroto No. 12, Jakarta Selatan', status: 'Departed', notes: 'Rush delivery', items: [{name:'Welding Machine 400A', qty:3},{name:'Air Compressor 10HP', qty:1}] },
    { id: 'DLV-005', rentalId: 'RNT-006', projectId: 'PRJ-004', projectName: 'Project Warehouse Renovation', customerId: 'CUS-003', customerName: 'PT Mitra Teknologi', driverId: 'DRV-002', driverName: 'Andi Pratama', vehicleId: 'VHC-002', vehiclePlate: 'B 5678 ABC', deliveryDate: '2026-08-21', destination: 'Jl. TB Simatupang No. 88, Jakarta Timur', status: 'Completed', notes: '', items: [{name:'Air Compressor 10HP', qty:2},{name:'Welding Machine 400A', qty:1}] },
    { id: 'DLV-006', rentalId: 'RNT-008', projectId: 'PRJ-002', projectName: 'Project Data Center Bekasi', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', driverId: 'DRV-001', driverName: 'Budi Santoso', vehicleId: 'VHC-001', vehiclePlate: 'B 1234 XYZ', deliveryDate: '2026-08-11', destination: 'Jl. Raya Industri No. 5, Bekasi', status: 'Completed', notes: '', items: [{name:'Generator 100 KVA', qty:2},{name:'Power Cable 100m', qty:8}] },
    { id: 'DLV-007', rentalId: 'RNT-003', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', driverId: null, driverName: null, vehicleId: null, vehiclePlate: null, deliveryDate: '2026-09-05', destination: 'Jl. Sudirman No. 45, Jakarta Selatan', status: 'Preparing', notes: 'Phase 2 equipment', items: [{name:'Submersible Pump 4"', qty:3},{name:'Welding Machine 400A', qty:2}] },
  ],

  // ---- RETURNS ----
  returns: [
    {
      id: 'RET-001', rentalId: 'RNT-007', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering',
      returnDate: '2026-08-16', status: 'Completed', inspectedBy: 'Warehouse Staff',
      items: [
        { name: 'Generator 100 KVA', sent: 1, good: 1, damaged: 0, lost: 0, missing: 0 },
        { name: 'Power Cable 100m', sent: 5, good: 4, damaged: 0, lost: 1, missing: 0 },
      ]
    },
    {
      id: 'RET-002', rentalId: 'RNT-010', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering',
      returnDate: '2026-08-31', status: 'Completed', inspectedBy: 'Warehouse Staff',
      items: [
        { name: 'Submersible Pump 4"', sent: 2, good: 2, damaged: 0, lost: 0, missing: 0 },
        { name: 'Aluminium Ladder 8m', sent: 4, good: 3, damaged: 1, lost: 0, missing: 0, damageNotes: 'Bent middle section' },
      ]
    },
    {
      id: 'RET-003', rentalId: 'RNT-001', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia',
      returnDate: '2026-09-04', status: 'Inspection', inspectedBy: null,
      items: [
        { name: 'Generator 50 KVA', sent: 2, good: 1, damaged: 0, lost: 0, missing: 1 },
        { name: 'Power Cable 50m', sent: 10, good: 8, damaged: 0, lost: 2, missing: 0 },
        { name: 'Aluminium Ladder 6m', sent: 3, good: 2, damaged: 0, lost: 1, missing: 0 },
      ]
    },
  ],

  // ---- CLAIMS ----
  claims: [
    { id: 'CLM-001', returnId: 'RET-001', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', equipment: 'Power Cable 100m', quantity: 1, reason: 'Lost during project', customerConfirmation: 'Confirmed', claimAmount: 900000, status: 'Invoiced', invoiceId: 'INV-005', invoiceStatus: 'Paid', createdDate: '2026-08-18' },
    { id: 'CLM-002', returnId: 'RET-002', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', equipment: 'Aluminium Ladder 8m', quantity: 1, reason: 'Damaged - bent middle section', customerConfirmation: 'Confirmed', claimAmount: 450000, status: 'Invoiced', invoiceId: 'INV-006', invoiceStatus: 'Issued', createdDate: '2026-09-02' },
    { id: 'CLM-003', returnId: 'RET-003', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', equipment: 'Generator 50 KVA', quantity: 1, reason: 'Missing from project site', customerConfirmation: 'Waiting', claimAmount: 25000000, status: 'Waiting Customer Confirmation', invoiceId: null, invoiceStatus: null, createdDate: '2026-09-04' },
    { id: 'CLM-004', returnId: 'RET-003', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', equipment: 'Power Cable 50m', quantity: 2, reason: 'Lost - cannot be located', customerConfirmation: 'Waiting', claimAmount: 1000000, status: 'Waiting Customer Confirmation', invoiceId: null, invoiceStatus: null, createdDate: '2026-09-04' },
  ],

  // ---- BRANCHES ----
  branches: [
    { id: 'BR-001', code: 'JKT', name: 'Jakarta Warehouse', address: 'Jl. Raya Industri No. 10, Jakarta Utara', capacity: 500, totalEquipment: 120, available: 65, onRental: 45, status: 'Active' },
    { id: 'BR-002', code: 'BKS', name: 'Bekasi Warehouse', address: 'Jl. Raya Industri No. 5, Bekasi', capacity: 300, totalEquipment: 80, available: 50, onRental: 25, status: 'Active' },
    { id: 'BR-003', code: 'SBY', name: 'Surabaya Warehouse', address: 'Jl. Rungkut Industri No. 22, Surabaya', capacity: 200, totalEquipment: 45, available: 35, onRental: 8, status: 'Active' },
  ],

  // ---- STOCK ----
  stock: [
    { equipment: 'Generator 50 KVA', branch: 'Jakarta', total: 20, available: 12, reserved: 2, onRental: 4, damaged: 1, maintenance: 1, lost: 0, missing: 0 },
    { equipment: 'Generator 50 KVA', branch: 'Bekasi', total: 10, available: 7, reserved: 1, onRental: 2, damaged: 0, maintenance: 0, lost: 0, missing: 0 },
    { equipment: 'Generator 100 KVA', branch: 'Jakarta', total: 15, available: 8, reserved: 1, onRental: 5, damaged: 0, maintenance: 1, lost: 0, missing: 0 },
    { equipment: 'Generator 100 KVA', branch: 'Bekasi', total: 8, available: 4, reserved: 1, onRental: 3, damaged: 0, maintenance: 0, lost: 0, missing: 0 },
    { equipment: 'Power Cable 50m', branch: 'Jakarta', total: 100, available: 55, reserved: 5, onRental: 35, damaged: 3, maintenance: 0, lost: 2, missing: 0 },
    { equipment: 'Power Cable 50m', branch: 'Bekasi', total: 50, available: 30, reserved: 5, onRental: 15, damaged: 0, maintenance: 0, lost: 0, missing: 0 },
    { equipment: 'Power Cable 100m', branch: 'Jakarta', total: 40, available: 22, reserved: 3, onRental: 15, damaged: 0, maintenance: 0, lost: 0, missing: 0 },
    { equipment: 'Power Cable 100m', branch: 'Bekasi', total: 30, available: 14, reserved: 2, onRental: 12, damaged: 1, maintenance: 0, lost: 1, missing: 0 },
    { equipment: 'Aluminium Ladder 6m', branch: 'Jakarta', total: 30, available: 18, reserved: 2, onRental: 8, damaged: 2, maintenance: 0, lost: 0, missing: 0 },
    { equipment: 'Aluminium Ladder 6m', branch: 'Bekasi', total: 15, available: 10, reserved: 1, onRental: 4, damaged: 0, maintenance: 0, lost: 0, missing: 0 },
    { equipment: 'Aluminium Ladder 8m', branch: 'Jakarta', total: 20, available: 12, reserved: 0, onRental: 6, damaged: 1, maintenance: 1, lost: 0, missing: 0 },
    { equipment: 'Aluminium Ladder 8m', branch: 'Bekasi', total: 10, available: 5, reserved: 1, onRental: 4, damaged: 0, maintenance: 0, lost: 0, missing: 0 },
    { equipment: 'Welding Machine 400A', branch: 'Jakarta', total: 10, available: 5, reserved: 1, onRental: 3, damaged: 0, maintenance: 1, lost: 0, missing: 0 },
    { equipment: 'Welding Machine 400A', branch: 'Bekasi', total: 6, available: 3, reserved: 1, onRental: 2, damaged: 0, maintenance: 0, lost: 0, missing: 0 },
    { equipment: 'Air Compressor 10HP', branch: 'Jakarta', total: 8, available: 3, reserved: 1, onRental: 3, damaged: 0, maintenance: 1, lost: 0, missing: 0 },
    { equipment: 'Air Compressor 10HP', branch: 'Bekasi', total: 5, available: 3, reserved: 0, onRental: 2, damaged: 0, maintenance: 0, lost: 0, missing: 0 },
    { equipment: 'Tower Light 4x1000W', branch: 'Jakarta', total: 12, available: 5, reserved: 1, onRental: 5, damaged: 0, maintenance: 1, lost: 0, missing: 0 },
    { equipment: 'Tower Light 4x1000W', branch: 'Bekasi', total: 6, available: 4, reserved: 0, onRental: 2, damaged: 0, maintenance: 0, lost: 0, missing: 0 },
    { equipment: 'Submersible Pump 4"', branch: 'Jakarta', total: 10, available: 4, reserved: 1, onRental: 4, damaged: 0, maintenance: 1, lost: 0, missing: 0 },
    { equipment: 'Submersible Pump 4"', branch: 'Bekasi', total: 6, available: 3, reserved: 1, onRental: 2, damaged: 0, maintenance: 0, lost: 0, missing: 0 },
  ],

  // ---- DRIVERS ----
  drivers: [
    { id: 'DRV-001', name: 'Budi Santoso', phone: '081234567890', licenseNumber: 'SIM-A-12345', licenseExpiry: '2028-06-15', status: 'Available', currentDelivery: null },
    { id: 'DRV-002', name: 'Andi Pratama', phone: '081234567891', licenseNumber: 'SIM-A-12346', licenseExpiry: '2027-11-20', status: 'Available', currentDelivery: null },
    { id: 'DRV-003', name: 'Dimas Saputra', phone: '081234567892', licenseNumber: 'SIM-A-12347', licenseExpiry: '2028-03-10', status: 'On Delivery', currentDelivery: 'DLV-004' },
    { id: 'DRV-004', name: 'Rizky Fauzan', phone: '081234567893', licenseNumber: 'SIM-A-12348', licenseExpiry: '2027-09-05', status: 'Available', currentDelivery: null },
    { id: 'DRV-005', name: 'Hendra Wijaya', phone: '081234567894', licenseNumber: 'SIM-A-12349', licenseExpiry: '2026-12-01', status: 'Off Duty', currentDelivery: null },
  ],

  // ---- VEHICLES ----
  vehicles: [
    { id: 'VHC-001', plate: 'B 1234 XYZ', type: 'Truck', brand: 'Mitsubishi Colt Diesel', capacity: '5 Ton', driverId: 'DRV-001', driverName: 'Budi Santoso', status: 'Available', currentDelivery: null },
    { id: 'VHC-002', plate: 'B 5678 ABC', type: 'Truck', brand: 'Hino Dutro', capacity: '3 Ton', driverId: 'DRV-002', driverName: 'Andi Pratama', status: 'Available', currentDelivery: null },
    { id: 'VHC-003', plate: 'B 9012 DEF', type: 'Truck', brand: 'Isuzu Elf', capacity: '4 Ton', driverId: 'DRV-003', driverName: 'Dimas Saputra', status: 'On Delivery', currentDelivery: 'DLV-004' },
    { id: 'VHC-004', plate: 'B 3456 GHI', type: 'Pickup', brand: 'Toyota Hilux', capacity: '1 Ton', driverId: null, driverName: null, status: 'Available', currentDelivery: null },
    { id: 'VHC-005', plate: 'B 7890 JKL', type: 'Truck', brand: 'Mitsubishi Colt Diesel', capacity: '5 Ton', driverId: null, driverName: null, status: 'Maintenance', currentDelivery: null },
  ],

  // ---- PURCHASES ----
  purchases: [
    { id: 'PO-001', supplier: 'PT Sumber Generator', purchaseDate: '2026-07-01', branch: 'Jakarta', branchId: 'BR-001', totalItems: 2, totalAmount: 750000000, accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Completed', items: [{name:'Generator 50 KVA', qty:5, price:100000000},{name:'Generator 100 KVA', qty:3, price:150000000}] },
    { id: 'PO-002', supplier: 'PT Kabel Nusantara', purchaseDate: '2026-07-15', branch: 'Jakarta', branchId: 'BR-001', totalItems: 2, totalAmount: 125000000, accountId: 'ACC-002', accountName: 'Mandiri Corporate', status: 'Completed', items: [{name:'Power Cable 50m', qty:50, price:1500000},{name:'Power Cable 100m', qty:20, price:2500000}] },
    { id: 'PO-003', supplier: 'PT Alat Berat Indonesia', purchaseDate: '2026-08-20', branch: 'Bekasi', branchId: 'BR-002', totalItems: 3, totalAmount: 245000000, accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Arrived', items: [{name:'Welding Machine 400A', qty:4, price:35000000},{name:'Air Compressor 10HP', qty:3, price:40000000},{name:'Submersible Pump 4"', qty:2, price:30000000}] },
    { id: 'PO-004', supplier: 'PT Sumber Generator', purchaseDate: '2026-09-01', branch: 'Jakarta', branchId: 'BR-001', totalItems: 1, totalAmount: 150000000, accountId: 'ACC-001', accountName: 'BCA Operational', status: 'In Transit', items: [{name:'Generator 100 KVA', qty:2, price:150000000}] },
    { id: 'PO-005', supplier: 'PT Tangga Jaya', purchaseDate: '2026-09-03', branch: 'Jakarta', branchId: 'BR-001', totalItems: 2, totalAmount: 22000000, accountId: 'ACC-002', accountName: 'Mandiri Corporate', status: 'Ordered', items: [{name:'Aluminium Ladder 6m', qty:10, price:1200000},{name:'Aluminium Ladder 8m', qty:5, price:2000000}] },
  ],

  // ---- MOVEMENTS ----
  movements: [
    { id: 'MOV-001', date: '2026-07-05', equipment: 'Generator 50 KVA', assetId: 'GEN-001', from: 'Supplier', to: 'Jakarta Warehouse', type: 'Purchase', reference: 'PO-001', user: 'Warehouse Staff', status: 'Completed' },
    { id: 'MOV-002', date: '2026-08-02', equipment: 'Generator 50 KVA', assetId: 'GEN-001', from: 'Jakarta Warehouse', to: 'Project Data Center Jakarta', type: 'Rental Out', reference: 'RNT-001', user: 'Admin', status: 'Completed' },
    { id: 'MOV-003', date: '2026-08-02', equipment: 'Power Cable 50m', assetId: 'CAB-001', from: 'Jakarta Warehouse', to: 'Project Data Center Jakarta', type: 'Rental Out', reference: 'RNT-001', user: 'Admin', status: 'Completed' },
    { id: 'MOV-004', date: '2026-08-16', equipment: 'Generator 100 KVA', assetId: 'GEN-003', from: 'Jakarta Warehouse', to: 'Project Infrastructure Expansion', type: 'Rental Out', reference: 'RNT-004', user: 'Admin', status: 'Completed' },
    { id: 'MOV-005', date: '2026-08-16', equipment: 'Generator 100 KVA', assetId: 'GEN-004', from: 'Bekasi Warehouse', to: 'Project Bridge Construction', type: 'Return', reference: 'RET-001', user: 'Warehouse Staff', status: 'Completed' },
    { id: 'MOV-006', date: '2026-08-25', equipment: 'Generator 50 KVA', assetId: 'GEN-005', from: 'Jakarta Warehouse', to: 'Maintenance', type: 'Maintenance', reference: 'MNT-001', user: 'Warehouse Staff', status: 'In Progress' },
    { id: 'MOV-007', date: '2026-09-01', equipment: 'Welding Machine 400A', assetId: 'WLD-002', from: 'Jakarta Warehouse', to: 'Bekasi Warehouse', type: 'Transfer', reference: 'TRF-001', user: 'Warehouse Staff', status: 'Completed' },
    { id: 'MOV-008', date: '2026-09-03', equipment: 'Aluminium Ladder 6m', assetId: 'LAD-002', from: 'Project Data Center Jakarta', to: 'Jakarta Warehouse', type: 'Return', reference: 'RET-003', user: 'Warehouse Staff', status: 'Completed' },
    { id: 'MOV-009', date: '2026-09-04', equipment: 'Power Cable 50m', assetId: 'CAB-001', from: 'Project Data Center Jakarta', to: 'Lost', type: 'Lost', reference: 'RET-003', user: 'Warehouse Staff', status: 'Completed' },
    { id: 'MOV-010', date: '2026-08-20', equipment: 'Air Compressor 10HP', assetId: 'CMP-002', from: 'Supplier', to: 'Bekasi Warehouse', type: 'Purchase', reference: 'PO-003', user: 'Warehouse Staff', status: 'Completed' },
  ],

  // ---- INVOICES ----
  invoices: [
    { id: 'INV-001', type: 'Delivery', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', reference: 'RNT-001', invoiceDate: '2026-08-05', dueDate: '2026-09-05', amount: 45000000, accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Issued', items: [{desc:'Generator 50 KVA × 2 (3 months)', qty:1, price:30000000},{desc:'Power Cable 50m × 10 (3 months)', qty:1, price:15000000},{desc:'Aluminium Ladder 6m × 3 (3 months)', qty:1, price:2700000},{desc:'Discount', qty:1, price:-2700000}] },
    { id: 'INV-002', type: 'Delivery', projectId: 'PRJ-001', projectName: 'Project Data Center Jakarta', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', reference: 'RNT-002', invoiceDate: '2026-08-18', dueDate: '2026-09-18', amount: 54000000, accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Paid', paidDate: '2026-09-01', items: [{desc:'Tower Light 4x1000W × 4 (3 months)', qty:1, price:30000000},{desc:'Air Compressor 10HP × 2 (3 months)', qty:1, price:24000000}] },
    { id: 'INV-003', type: 'Delivery', projectId: 'PRJ-003', projectName: 'Project Infrastructure Expansion', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', reference: 'RNT-004', invoiceDate: '2026-07-20', dueDate: '2026-08-20', amount: 70000000, accountId: 'ACC-002', accountName: 'Mandiri Corporate', status: 'Partially Paid', items: [{desc:'Generator 100 KVA × 2 (3 months)', qty:1, price:51000000},{desc:'Aluminium Ladder 8m × 5 (3 months)', qty:1, price:6750000},{desc:'Submersible Pump 4" × 2 (3 months)', qty:1, price:18000000},{desc:'Discount', qty:1, price:-5750000}] },
    { id: 'INV-004', type: 'Delivery', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', reference: 'RNT-007', invoiceDate: '2026-05-20', dueDate: '2026-06-20', amount: 39000000, accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Paid', paidDate: '2026-06-15', items: [{desc:'Generator 100 KVA × 1 (3 months)', qty:1, price:25500000},{desc:'Power Cable 100m × 5 (3 months)', qty:1, price:13500000}] },
    { id: 'INV-005', type: 'Return', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', reference: 'RET-001 / CLM-001', invoiceDate: '2026-08-22', dueDate: '2026-09-22', amount: 900000, accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Paid', paidDate: '2026-09-01', items: [{desc:'Lost: Power Cable 100m × 1', qty:1, price:900000}] },
    { id: 'INV-006', type: 'Return', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', reference: 'RET-002 / CLM-002', invoiceDate: '2026-09-02', dueDate: '2026-10-02', amount: 450000, accountId: 'ACC-002', accountName: 'Mandiri Corporate', status: 'Issued', items: [{desc:'Damaged: Aluminium Ladder 8m × 1', qty:1, price:450000}] },
    { id: 'INV-007', type: 'Delivery', projectId: 'PRJ-004', projectName: 'Project Warehouse Renovation', customerId: 'CUS-003', customerName: 'PT Mitra Teknologi', reference: 'RNT-006', invoiceDate: '2026-08-25', dueDate: '2026-09-25', amount: 23000000, accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Issued', items: [{desc:'Air Compressor 10HP × 2 (2 months)', qty:1, price:16000000},{desc:'Welding Machine 400A × 1 (2 months)', qty:1, price:7000000}] },
    { id: 'INV-008', type: 'Delivery', projectId: 'PRJ-002', projectName: 'Project Data Center Bekasi', customerId: 'CUS-001', customerName: 'PT Data Center Indonesia', reference: 'RNT-008', invoiceDate: '2026-08-12', dueDate: '2026-09-12', amount: 70000000, accountId: 'ACC-002', accountName: 'Mandiri Corporate', status: 'Issued', items: [{desc:'Generator 100 KVA × 2 (3 months)', qty:1, price:51000000},{desc:'Power Cable 100m × 8 (3 months)', qty:1, price:21600000},{desc:'Discount', qty:1, price:-2600000}] },
    { id: 'INV-009', type: 'Delivery', projectId: 'PRJ-003', projectName: 'Project Infrastructure Expansion', customerId: 'CUS-002', customerName: 'PT Infrastruktur Nusantara', reference: 'RNT-005', invoiceDate: '2026-08-22', dueDate: '2026-09-22', amount: 43500000, accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Issued', items: [{desc:'Welding Machine 400A × 3 (3 months)', qty:1, price:31500000},{desc:'Air Compressor 10HP × 1 (3 months)', qty:1, price:12000000}] },
    { id: 'INV-010', type: 'Delivery', projectId: 'PRJ-005', projectName: 'Project Bridge Construction', customerId: 'CUS-004', customerName: 'PT Karya Engineering', reference: 'RNT-010', invoiceDate: '2026-06-05', dueDate: '2026-07-05', amount: 23000000, accountId: 'ACC-001', accountName: 'BCA Operational', status: 'Paid', paidDate: '2026-07-01', items: [{desc:'Submersible Pump 4" × 2 (3 months)', qty:1, price:18000000},{desc:'Aluminium Ladder 8m × 4 (3 months)', qty:1, price:5400000},{desc:'Discount', qty:1, price:-400000}] },
  ],

  // ---- COMPANY ACCOUNTS ----
  accounts: [
    { id: 'ACC-001', name: 'BCA Operational', bank: 'BCA', accountNumber: '1234567890', accountHolder: 'PT EquipRent Indonesia', type: 'Operational', branch: 'Jakarta', status: 'Active' },
    { id: 'ACC-002', name: 'Mandiri Corporate', bank: 'Mandiri', accountNumber: '0987654321', accountHolder: 'PT EquipRent Indonesia', type: 'Corporate', branch: 'Jakarta', status: 'Active' },
    { id: 'ACC-003', name: 'BNI Savings', bank: 'BNI', accountNumber: '1122334455', accountHolder: 'PT EquipRent Indonesia', type: 'Savings', branch: 'Jakarta', status: 'Active' },
    { id: 'ACC-004', name: 'BCA Bekasi', bank: 'BCA', accountNumber: '5566778899', accountHolder: 'PT EquipRent Indonesia', type: 'Operational', branch: 'Bekasi', status: 'Active' },
  ],

  // ---- USERS ----
  users: [
    { id: 'USR-001', name: 'Super Administrator', username: 'superadmin', email: 'superadmin@equiprent.co.id', role: 'Super Admin', branch: 'All', status: 'Active', lastLogin: '2026-09-04 08:30' },
    { id: 'USR-002', name: 'Ahmad Hidayat', username: 'ahmad.admin', email: 'ahmad@equiprent.co.id', role: 'Admin', branch: 'Jakarta', status: 'Active', lastLogin: '2026-09-04 09:15' },
    { id: 'USR-003', name: 'Sari Dewi', username: 'sari.rental', email: 'sari@equiprent.co.id', role: 'Rental Staff', branch: 'Jakarta', status: 'Active', lastLogin: '2026-09-04 08:45' },
    { id: 'USR-004', name: 'Joko Warehouse', username: 'joko.wh', email: 'joko@equiprent.co.id', role: 'Warehouse Staff', branch: 'Jakarta', status: 'Active', lastLogin: '2026-09-03 17:00' },
    { id: 'USR-005', name: 'Maya Finance', username: 'maya.fin', email: 'maya@equiprent.co.id', role: 'Finance', branch: 'Jakarta', status: 'Active', lastLogin: '2026-09-04 10:00' },
    { id: 'USR-006', name: 'Rina Manager', username: 'rina.mgr', email: 'rina@equiprent.co.id', role: 'Manager', branch: 'Jakarta', status: 'Active', lastLogin: '2026-09-04 07:30' },
    { id: 'USR-007', name: 'Budi Santoso', username: 'budi.driver', email: 'budi@equiprent.co.id', role: 'Driver', branch: 'Jakarta', status: 'Active', lastLogin: '2026-09-04 06:00' },
    { id: 'USR-008', name: 'Andi Pratama', username: 'andi.driver', email: 'andi@equiprent.co.id', role: 'Driver', branch: 'Jakarta', status: 'Active', lastLogin: '2026-09-03 06:15' },
    { id: 'USR-009', name: 'Dimas Saputra', username: 'dimas.driver', email: 'dimas@equiprent.co.id', role: 'Driver', branch: 'Jakarta', status: 'Active', lastLogin: '2026-09-04 05:45' },
    { id: 'USR-010', name: 'Hendra Bekasi', username: 'hendra.admin', email: 'hendra@equiprent.co.id', role: 'Admin', branch: 'Bekasi', status: 'Active', lastLogin: '2026-09-03 14:20' },
  ],

  // ---- ROLES ----
  roles: [
    { id: 'ROLE-001', name: 'Super Admin', description: 'Full system access', usersCount: 1 },
    { id: 'ROLE-002', name: 'Admin', description: 'Administrative access', usersCount: 2 },
    { id: 'ROLE-003', name: 'Rental Staff', description: 'Rental operations', usersCount: 1 },
    { id: 'ROLE-004', name: 'Warehouse Staff', description: 'Warehouse & stock management', usersCount: 1 },
    { id: 'ROLE-005', name: 'Finance', description: 'Financial operations', usersCount: 1 },
    { id: 'ROLE-006', name: 'Manager', description: 'Approval & oversight', usersCount: 1 },
    { id: 'ROLE-007', name: 'Driver', description: 'Delivery operations', usersCount: 3 },
    { id: 'ROLE-008', name: 'Viewer', description: 'Read-only access', usersCount: 0 },
  ],

  // ---- PERMISSIONS MATRIX ----
  permissions: {
    modules: ['Dashboard','Rentals','Projects','Deliveries','Returns','Claims','Equipment','Branches','Stock','Movements','Purchases','Customers','Drivers','Vehicles','Accounts','Invoices','Users','Roles'],
    actions: ['View','Create','Update','Delete','Approve'],
    matrix: {
      'Super Admin': { default: true },
      'Admin': { default: true, exceptions: { 'Users': ['View','Create','Update'], 'Roles': ['View'] } },
      'Rental Staff': { allowed: ['Dashboard','Rentals','Projects','Deliveries','Returns','Claims','Equipment','Customers'], actions: ['View','Create','Update'] },
      'Warehouse Staff': { allowed: ['Dashboard','Equipment','Branches','Stock','Movements','Purchases','Returns'], actions: ['View','Create','Update'] },
      'Finance': { allowed: ['Dashboard','Invoices','Accounts','Customers','Rentals','Returns','Claims','Purchases'], actions: ['View','Create','Update'] },
      'Manager': { allowed: ['Dashboard','Rentals','Projects','Deliveries','Returns','Claims','Equipment','Invoices','Customers','Purchases'], actions: ['View','Approve'] },
      'Driver': { allowed: ['Dashboard','Deliveries'], actions: ['View','Update'] },
      'Viewer': { default: false, allowed: ['Dashboard','Rentals','Projects','Equipment','Customers','Invoices'], actions: ['View'] },
    }
  },

  // ---- NOTIFICATIONS ----
  notifications: [
    { id: 1, message: 'Delivery <strong>#DLV-004</strong> has departed', type: 'info', icon: 'bi-truck', time: '10 minutes ago', read: false, link: 'delivery-detail.html' },
    { id: 2, message: 'Return <strong>#RET-003</strong> is waiting for inspection', type: 'warning', icon: 'bi-box-arrow-in-left', time: '25 minutes ago', read: false, link: 'return-detail.html' },
    { id: 3, message: 'Invoice <strong>#INV-001</strong> is approaching due date', type: 'orange', icon: 'bi-receipt', time: '1 hour ago', read: false, link: 'invoice-detail.html' },
    { id: 4, message: 'Purchase <strong>#PO-003</strong> has arrived at Bekasi', type: 'green', icon: 'bi-box-seam', time: '2 hours ago', read: true, link: 'purchase-detail.html' },
    { id: 5, message: 'Rental <strong>#RNT-009</strong> is waiting for approval', type: 'warning', icon: 'bi-clock-history', time: '3 hours ago', read: true, link: 'rental-detail.html?id=RNT-009' },
    { id: 6, message: 'Claim <strong>#CLM-003</strong> needs customer confirmation', type: 'red', icon: 'bi-exclamation-triangle', time: '4 hours ago', read: true, link: 'claim-detail.html' },
    { id: 7, message: 'Stock alert: Generator 50 KVA low in Jakarta', type: 'orange', icon: 'bi-exclamation-circle', time: '5 hours ago', read: true, link: 'stock.html' },
  ],

  // ---- ACTIVITY LOG ----
  activityLog: [
    { time: '09:12', date: '2026-09-04', action: 'Rental #RNT-009 created', user: 'Sari Dewi', type: 'info' },
    { time: '09:30', date: '2026-09-04', action: 'Return #RET-003 submitted for inspection', user: 'Joko Warehouse', type: 'warning' },
    { time: '10:15', date: '2026-09-04', action: 'Delivery #DLV-004 departed', user: 'Dimas Saputra', type: 'info' },
    { time: '10:45', date: '2026-09-04', action: 'Claim #CLM-003 created from RET-003', user: 'Admin', type: 'danger' },
    { time: '11:00', date: '2026-09-04', action: 'Invoice #INV-009 issued for RNT-005', user: 'Maya Finance', type: 'success' },
    { time: '13:20', date: '2026-09-03', action: 'Purchase #PO-003 arrived at Bekasi', user: 'Warehouse Staff', type: 'success' },
    { time: '14:00', date: '2026-09-03', action: 'Equipment GEN-005 sent to maintenance', user: 'Joko Warehouse', type: 'warning' },
    { time: '15:30', date: '2026-09-03', action: 'Rental #RNT-008 delivery completed', user: 'Budi Santoso', type: 'success' },
    { time: '16:00', date: '2026-09-03', action: 'Invoice #INV-008 issued for RNT-008', user: 'Maya Finance', type: 'success' },
    { time: '09:00', date: '2026-09-02', action: 'Claim #CLM-002 invoiced', user: 'Maya Finance', type: 'info' },
  ],

  // ---- DEMO USERS FOR LOGIN ----
  demoUsers: [
    { username: 'superadmin', password: 'demo', name: 'Super Administrator', role: 'Super Admin', branch: 'All', initials: 'SA' },
    { username: 'admin', password: 'demo', name: 'Ahmad Hidayat', role: 'Admin', branch: 'Jakarta', initials: 'AH' },
    { username: 'rental', password: 'demo', name: 'Sari Dewi', role: 'Rental Staff', branch: 'Jakarta', initials: 'SD' },
    { username: 'warehouse', password: 'demo', name: 'Joko Warehouse', role: 'Warehouse Staff', branch: 'Jakarta', initials: 'JW' },
    { username: 'finance', password: 'demo', name: 'Maya Finance', role: 'Finance', branch: 'Jakarta', initials: 'MF' },
    { username: 'manager', password: 'demo', name: 'Rina Manager', role: 'Manager', branch: 'Jakarta', initials: 'RM' },
    { username: 'driver', password: 'demo', name: 'Budi Santoso', role: 'Driver', branch: 'Jakarta', initials: 'BS' },
  ],

  // ---- COMPANY INFO ----
  company: {
    name: 'PT EquipRent Indonesia',
    address: 'Jl. Raya Industri No. 10, Jakarta Utara 14330',
    phone: '021-555-0100',
    email: 'info@equiprent.co.id',
    website: 'www.equiprent.co.id',
    taxId: '01.234.567.8-012.000',
  },

  // ---- REPAIRS ----
  repairs: [],

  // ---- GOODS RECEIPTS ----
  goodsReceipts: [],

  // ---- RENTAL EXTENSIONS ----
  extensions: []
};

// --- Persistence Logic ---
(function() {
  const STORAGE_PREFIX = 'equiprent_';
  const dataKeys = Object.keys(MockData);
  
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
