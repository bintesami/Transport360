const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Transport360 Database...');

  // Clean existing records to allow clean re-seeding
  await prisma.journalLine.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.tripExpense.deleteMany();
  await prisma.tripTimeline.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.dailyExpense.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.driverAdvance.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.conductor.deleteMany();
  await prisma.vehicleDocument.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.account.deleteMany();

  // 1. Seed Chart of Accounts
  const accountsData = [
    // Assets (1000s)
    { code: '1001', name: 'Cash in Hand (Petty Cash)', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 145000 },
    { code: '1002', name: 'HBL Main Operating Bank', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 850000 },
    { code: '1003', name: 'Meezan Islamic Bank', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 320000 },
    { code: '1100', name: 'Accounts Receivable (Customers)', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 450000 },
    { code: '1200', name: 'Driver Advances Receivable', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 35000 },
    { code: '1501', name: 'Vehicles Fleet Asset', type: 'ASSET', subType: 'FIXED_ASSET', balance: 18500000 },
    { code: '1502', name: 'Spare Parts & Tyre Inventory', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 280000 },

    // Liabilities (2000s)
    { code: '2001', name: 'Accounts Payable (Vendors/Workshops/Pumps)', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 180000 },
    { code: '2002', name: 'Driver Salary Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 90000 },
    { code: '2100', name: 'Bank Loans / Vehicle Leases', type: 'LIABILITY', subType: 'LONG_TERM_LIABILITY', balance: 2500000 },

    // Equity (3000s)
    { code: '3001', name: 'Owner Capital', type: 'EQUITY', subType: 'EQUITY', balance: 15000000 },
    { code: '3002', name: 'Drawings', type: 'EQUITY', subType: 'EQUITY', balance: 0 },
    { code: '3003', name: 'Retained Earnings / Profit', type: 'EQUITY', subType: 'EQUITY', balance: 2980000 },

    // Revenue (4000s)
    { code: '4001', name: 'Freight Revenue', type: 'REVENUE', subType: 'OPERATING_REVENUE', balance: 4920000 },
    { code: '4002', name: 'Demurrage & Other Transport Income', type: 'REVENUE', subType: 'OTHER_INCOME', balance: 65000 },

    // Direct & Operating Expenses (5000s)
    { code: '5001', name: 'Diesel & Fuel Expense', type: 'EXPENSE', subType: 'DIRECT_EXPENSE', balance: 1680000 },
    { code: '5002', name: 'Driver Allowance & Per Diem', type: 'EXPENSE', subType: 'DIRECT_EXPENSE', balance: 185000 },
    { code: '5003', name: 'Conductor Allowance', type: 'EXPENSE', subType: 'DIRECT_EXPENSE', balance: 95000 },
    { code: '5004', name: 'Toll Tax & Motorway Charges', type: 'EXPENSE', subType: 'DIRECT_EXPENSE', balance: 145000 },
    { code: '5005', name: 'Loading & Labour Charges', type: 'EXPENSE', subType: 'DIRECT_EXPENSE', balance: 78000 },
    { code: '5006', name: 'Unloading Charges', type: 'EXPENSE', subType: 'DIRECT_EXPENSE', balance: 62000 },
    { code: '5007', name: 'Agent Commission Expense', type: 'EXPENSE', subType: 'DIRECT_EXPENSE', balance: 115000 },
    { code: '5008', name: 'Vehicle Repair & Maintenance', type: 'EXPENSE', subType: 'DIRECT_EXPENSE', balance: 390000 },
    { code: '5009', name: 'Tyre Replacement & Maintenance', type: 'EXPENSE', subType: 'DIRECT_EXPENSE', balance: 220000 },
    { code: '5010', name: 'Driver & Staff Salaries', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 360000 },
    { code: '5011', name: 'Daily Food & Enroute Expense', type: 'EXPENSE', subType: 'DIRECT_EXPENSE', balance: 48000 },
    { code: '5012', name: 'Police & Chalan / Enroute Misc', type: 'EXPENSE', subType: 'DIRECT_EXPENSE', balance: 26000 },
    { code: '5013', name: 'Office & Administrative Expense', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 75000 },
  ];

  for (const acc of accountsData) {
    await prisma.account.upsert({
      where: { code: acc.code },
      update: acc,
      create: acc,
    });
  }

  // 2. Seed Drivers & Conductors
  const driverAli = await prisma.driver.upsert({
    where: { cnic: '35201-1234567-1' },
    update: {},
    create: {
      name: 'Muhammad Ali',
      cnic: '35201-1234567-1',
      phone: '0300-1234567',
      licenseNumber: 'LHR-HTV-8842',
      monthlySalary: 45000,
      dailyAllowanceRate: 1500,
      outstandingAdvance: 10000,
      status: 'ACTIVE',
    },
  });

  const driverTariq = await prisma.driver.upsert({
    where: { cnic: '35202-7654321-3' },
    update: {},
    create: {
      name: 'Tariq Mahmood',
      cnic: '35202-7654321-3',
      phone: '0321-9876543',
      licenseNumber: 'LHR-HTV-9912',
      monthlySalary: 42000,
      dailyAllowanceRate: 1400,
      outstandingAdvance: 5000,
      status: 'ACTIVE',
    },
  });

  const driverRehman = await prisma.driver.upsert({
    where: { cnic: '35203-4567890-5' },
    update: {},
    create: {
      name: 'Abdul Rehman',
      cnic: '35203-4567890-5',
      phone: '0345-5554321',
      licenseNumber: 'FSD-HTV-5512',
      monthlySalary: 40000,
      dailyAllowanceRate: 1300,
      outstandingAdvance: 0,
      status: 'ACTIVE',
    },
  });

  const conductorHamza = await prisma.conductor.create({
    data: {
      name: 'Hamza Rafiq',
      phone: '0312-3334455',
      dailyAllowance: 800,
      status: 'ACTIVE',
    },
  });

  // 3. Seed Vehicles
  const vehicle1 = await prisma.vehicle.upsert({
    where: { regNumber: 'LHR-786' },
    update: { currentOdometer: 142500, status: 'ON_TRIP' },
    create: {
      regNumber: 'LHR-786',
      vehicleType: 'Trailor (22-Wheeler)',
      model: 'Hino 500 Super Dolphin 2021',
      chassisNumber: 'HINO-500-98214',
      engineNumber: 'J08E-78912',
      status: 'ON_TRIP',
      currentOdometer: 142500,
      assignedDriverId: driverAli.id,
    },
  });

  const vehicle2 = await prisma.vehicle.upsert({
    where: { regNumber: 'LHR-451' },
    update: { currentOdometer: 98400, status: 'AVAILABLE' },
    create: {
      regNumber: 'LHR-451',
      vehicleType: '10-Wheeler Truck',
      model: 'ISUZU FTR 2020',
      chassisNumber: 'ISZ-FTR-45190',
      engineNumber: '6HK1-55214',
      status: 'AVAILABLE',
      currentOdometer: 98400,
      assignedDriverId: driverTariq.id,
    },
  });

  const vehicle3 = await prisma.vehicle.upsert({
    where: { regNumber: 'LHR-921' },
    update: { currentOdometer: 185600, status: 'UNDER_REPAIR' },
    create: {
      regNumber: 'LHR-921',
      vehicleType: 'Mazda T3500',
      model: 'Master Foton 2019',
      chassisNumber: 'FTN-3500-1123',
      engineNumber: '4JB1-99812',
      status: 'UNDER_REPAIR',
      currentOdometer: 185600,
      assignedDriverId: driverRehman.id,
    },
  });

  // 4. Seed Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'ABC Traders',
      companyName: 'ABC Commercial Traders Pvt Ltd',
      phone: '042-35889900',
      email: 'logistics@abctraders.pk',
      address: 'Badami Bagh, Lahore',
      creditLimit: 500000,
      balance: 100000, // 100,000 receivable
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Al-Karam Textiles',
      companyName: 'Al-Karam Textile Mills Karachi',
      phone: '021-34567890',
      email: 'dispatch@alkaram.com',
      address: 'SITE Industrial Area, Karachi',
      creditLimit: 1000000,
      balance: 250000,
    },
  });

  // 5. Seed Vendors
  const vendorPSO = await prisma.vendor.create({
    data: {
      name: 'PSO National Highway Station',
      vendorType: 'DIESEL_PUMP',
      phone: '0300-8889911',
      address: 'Sadiqabad Bypass, N-5 Highway',
      balance: 45000, // 45,000 payable
    },
  });

  const vendorWorkshop = await prisma.vendor.create({
    data: {
      name: 'ABC Workshop & Engineering',
      vendorType: 'WORKSHOP',
      phone: '0321-4447788',
      address: 'Truck Stand, Band Road Lahore',
      balance: 20000, // 20,000 payable
    },
  });

  const vendorTyre = await prisma.vendor.create({
    data: {
      name: 'Master Tyre Center',
      vendorType: 'TYRE_SHOP',
      phone: '0333-5551234',
      address: 'General Bus Stand, Rawalpindi',
      balance: 30000,
    },
  });

  // 6. Seed Sample Booking & Trip with Timeline
  const booking1 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2026-001',
      customerId: customer1.id,
      pickupLocation: 'Lahore Dry Port',
      destination: 'Karachi Port Qasim',
      vehicleId: vehicle1.id,
      driverId: driverAli.id,
      freightAmount: 250000,
      advanceReceived: 100000,
      agentName: 'Malik Zafar Logistics Agent',
      commissionAmount: 7500,
      biltyNumber: 'BL-982341',
      status: 'CONVERTED_TO_TRIP',
    },
  });

  const trip1 = await prisma.trip.create({
    data: {
      tripNumber: 'TR-2026-001',
      bookingId: booking1.id,
      vehicleId: vehicle1.id,
      driverId: driverAli.id,
      conductorId: conductorHamza.id,
      status: 'IN_TRANSIT',
      startOdometer: 141250,
      totalKM: 1250,
      freightRevenue: 250000,
      totalExpenses: 125500,
      netProfit: 124500,
      timelineEvents: {
        create: [
          { status: 'BOOKED', location: 'Lahore Office', remarks: 'Freight agreed at 250,000, advance 100,000 received' },
          { status: 'LOADING', location: 'Lahore Dry Port', remarks: 'Loaded 32 metric tons containers' },
          { status: 'LOADED', location: 'Lahore Dry Port', remarks: 'Weight slip verified, bilty stamped' },
          { status: 'IN_TRANSIT', location: 'Rahim Yar Khan Bypass', remarks: 'Vehicle moving smoothly towards Karachi' },
        ],
      },
      expenses: {
        create: [
          { category: 'DIESEL', amount: 85000, paidThrough: 'CASH', remarks: '420 Litres PSO Sadiqabad' },
          { category: 'TOLL', amount: 12000, paidThrough: 'CASH', remarks: 'M-5 & N-5 Motorway Toll' },
          { category: 'LOADING', amount: 5000, paidThrough: 'CASH', remarks: 'Dry Port crane labour' },
          { category: 'UNLOADING', amount: 4000, paidThrough: 'CASH', remarks: 'Labour advance' },
          { category: 'DRIVER', amount: 6000, paidThrough: 'CASH', remarks: 'Muhammad Ali en-route allowance' },
          { category: 'CONDUCTOR', amount: 4000, paidThrough: 'CASH', remarks: 'Hamza en-route allowance' },
          { category: 'AGENT', amount: 7500, paidThrough: 'BANK', remarks: 'Malik Zafar Agent commission' },
          { category: 'OTHER', amount: 2000, paidThrough: 'CASH', remarks: 'Weight bridge and police misc' },
        ],
      },
    },
  });

  // 7. Seed Fuel Log (demonstrating KM/L and Cost/KM)
  await prisma.fuelLog.create({
    data: {
      vehicleId: vehicle1.id,
      tripId: trip1.id,
      location: 'PSO Sadiqabad Bypass',
      litres: 420,
      rate: 266.66,
      total: 112000,
      odometer: 142500,
      fuelStationVendorId: vendorPSO.id,
      paymentMethod: 'CASH',
      kmPerLitre: 2.98, // 1,250 KM / 420 Litres
      fuelCostPerKM: 89.6,   // 112,000 / 1,250 KM
    },
  });

  // 8. Seed Maintenance Log (Parts: 45,000, Labour: 15,000, Total: 60,000)
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: vehicle3.id,
      workshopVendorId: vendorWorkshop.id,
      category: 'ENGINE',
      description: 'Engine Overhauling, Piston rings, head gasket & nozzle calibration',
      partsCost: 45000,
      labourCost: 15000,
      totalCost: 60000,
      odometer: 185600,
      paymentMethod: 'PAYABLE',
    },
  });

  // 9. Seed Daily Expense (e.g. Dinner Rs. 500)
  await prisma.dailyExpense.create({
    data: {
      vehicleId: vehicle1.id,
      driverId: driverAli.id,
      tripId: trip1.id,
      expenseHead: 'Dinner Expense',
      subHead: 'Driver & Conductor Enroute Meal',
      amount: 500,
      paidFrom: 'CASH',
      location: 'Karachi Highway Hotel',
      receiptNumber: 'REC-9011',
      remarks: 'Dinner enroute to Karachi',
    },
  });

  // 10. Seed Double-Entry Journal Entries
  // Entry 1: Freight Booking on Credit
  // Customer Receivable Dr. 250,000 / Freight Revenue Cr. 250,000
  const accAR = await prisma.account.findUnique({ where: { code: '1100' } });
  const accRev = await prisma.account.findUnique({ where: { code: '4001' } });
  const accCash = await prisma.account.findUnique({ where: { code: '1001' } });
  const accDiesel = await prisma.account.findUnique({ where: { code: '5001' } });
  const accMaint = await prisma.account.findUnique({ where: { code: '5008' } });
  const accAP = await prisma.account.findUnique({ where: { code: '2001' } });
  const accMeal = await prisma.account.findUnique({ where: { code: '5011' } });

  const jv1 = await prisma.journalEntry.create({
    data: {
      entryNumber: 'JV-2026-0001',
      referenceType: 'INVOICE',
      referenceId: booking1.id,
      narration: 'Freight booked for Customer ABC Traders (BL-982341, Lahore to Karachi)',
      lines: {
        create: [
          { accountId: accAR.id, debit: 250000, credit: 0, description: 'Customer ABC Traders Receivable', customerId: customer1.id, vehicleId: vehicle1.id },
          { accountId: accRev.id, debit: 0, credit: 250000, description: 'Freight Revenue for Trip TR-2026-001', vehicleId: vehicle1.id },
        ],
      },
    },
  });

  // Entry 2: Advance received from Customer
  // Cash Dr. 100,000 / Customer Receivable Cr. 100,000
  await prisma.journalEntry.create({
    data: {
      entryNumber: 'JV-2026-0002',
      referenceType: 'PAYMENT',
      referenceId: booking1.id,
      narration: 'Advance received from ABC Traders for Trip TR-2026-001',
      lines: {
        create: [
          { accountId: accCash.id, debit: 100000, credit: 0, description: 'Cash received at booking', customerId: customer1.id },
          { accountId: accAR.id, debit: 0, credit: 100000, description: 'Credit to ABC Traders account', customerId: customer1.id },
        ],
      },
    },
  });

  // Entry 3: Diesel Purchase Cash
  // Diesel Expense Dr. 20,000 / Cash Cr. 20,000
  await prisma.journalEntry.create({
    data: {
      entryNumber: 'JV-2026-0003',
      referenceType: 'FUEL',
      narration: 'Diesel filled for LHR-786 at PSO Highway Station',
      lines: {
        create: [
          { accountId: accDiesel.id, debit: 20000, credit: 0, description: 'Diesel Expense LHR-786', vehicleId: vehicle1.id },
          { accountId: accCash.id, debit: 0, credit: 20000, description: 'Paid via Petty Cash', vehicleId: vehicle1.id },
        ],
      },
    },
  });

  // Entry 4: Workshop Repair on Credit
  // Repair & Maintenance Dr. 60,000 / Workshop Payable Cr. 60,000
  await prisma.journalEntry.create({
    data: {
      entryNumber: 'JV-2026-0004',
      referenceType: 'MAINTENANCE',
      narration: 'Engine Repair of LHR-921 at ABC Workshop',
      lines: {
        create: [
          { accountId: accMaint.id, debit: 60000, credit: 0, description: 'Engine Repair Parts (45k) + Labour (15k)', vehicleId: vehicle3.id },
          { accountId: accAP.id, debit: 0, credit: 60000, description: 'ABC Workshop Payable', vendorId: vendorWorkshop.id, vehicleId: vehicle3.id },
        ],
      },
    },
  });

  // Entry 5: Daily Dinner Expense
  // Dinner Expense Dr. 500 / Cash Cr. 500
  await prisma.journalEntry.create({
    data: {
      entryNumber: 'JV-2026-0005',
      referenceType: 'DAILY_EXPENSE',
      narration: 'Dinner expense for LHR-786 at Karachi Highway',
      lines: {
        create: [
          { accountId: accMeal.id, debit: 500, credit: 0, description: 'Enroute dinner LHR-786', vehicleId: vehicle1.id, driverId: driverAli.id },
          { accountId: accCash.id, debit: 0, credit: 500, description: 'Paid from Petty Cash', vehicleId: vehicle1.id },
        ],
      },
    },
  });

  console.log('✅ Transport360 Database seeded successfully with full double-entry accounting data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
