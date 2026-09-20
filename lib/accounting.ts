import prisma from './prisma';

export interface JournalLineInput {
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
  vehicleId?: string;
  driverId?: string;
  customerId?: string;
  vendorId?: string;
}

export interface CreateJournalEntryInput {
  date?: Date;
  referenceType?: 'TRIP' | 'FUEL' | 'MAINTENANCE' | 'DAILY_EXPENSE' | 'INVOICE' | 'PAYMENT' | 'ADVANCE' | 'SALARY';
  referenceId?: string;
  narration: string;
  lines: JournalLineInput[];
}

/**
 * Strict Double-Entry Journal Entry Engine
 * Validates Debit == Credit and updates Account balances in an atomic transaction
 */
export async function createJournalEntry(input: CreateJournalEntryInput) {
  const { date = new Date(), referenceType, referenceId, narration, lines } = input;

  if (!lines || lines.length < 2) {
    throw new Error('A journal entry must contain at least two lines (one debit and one credit).');
  }

  const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);

  // Precision check up to 2 decimal places
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error(
      `Double-Entry Violation: Total Debit (${totalDebit.toFixed(2)}) must equal Total Credit (${totalCredit.toFixed(2)}).`
    );
  }

  return await prisma.$transaction(async (tx) => {
    // Generate sequential entry number
    const count = await tx.journalEntry.count();
    const entryNumber = `JV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const entry = await tx.journalEntry.create({
      data: {
        entryNumber,
        date,
        referenceType,
        referenceId,
        narration,
        status: 'POSTED',
        lines: {
          create: lines.map((l) => ({
            accountId: l.accountId,
            debit: l.debit || 0,
            credit: l.credit || 0,
            description: l.description,
            vehicleId: l.vehicleId,
            driverId: l.driverId,
            customerId: l.customerId,
            vendorId: l.vendorId,
          })),
        },
      },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    });

    // Update account balances
    for (const line of lines) {
      const account = await tx.account.findUnique({ where: { id: line.accountId } });
      if (account) {
        // ASSET and EXPENSE increase with Debit, decrease with Credit
        // LIABILITY, EQUITY, REVENUE increase with Credit, decrease with Debit
        let netChange = 0;
        if (account.type === 'ASSET' || account.type === 'EXPENSE') {
          netChange = (line.debit || 0) - (line.credit || 0);
        } else {
          netChange = (line.credit || 0) - (line.debit || 0);
        }

        await tx.account.update({
          where: { id: line.accountId },
          data: {
            balance: {
              increment: netChange,
            },
          },
        });
      }
    }

    return entry;
  });
}

/**
 * Helper to record Daily Expense:
 * Dr. Expense Account
 * Cr. Cash / Bank Account
 */
export async function postDailyExpenseEntry(params: {
  date: Date;
  expenseHeadName: string;
  amount: number;
  paidFrom: 'CASH' | 'BANK';
  vehicleId?: string;
  driverId?: string;
  tripId?: string;
  remarks?: string;
}) {
  const expenseCode = '5011'; // Daily Food & Misc Expense
  const cashCode = params.paidFrom === 'BANK' ? '1002' : '1001';

  const expAcc = await prisma.account.findUnique({ where: { code: expenseCode } });
  const cashAcc = await prisma.account.findUnique({ where: { code: cashCode } });

  if (!expAcc || !cashAcc) throw new Error('Default accounting heads not found for daily expense.');

  return await createJournalEntry({
    date: params.date,
    referenceType: 'DAILY_EXPENSE',
    narration: `${params.expenseHeadName} - ${params.remarks || 'Daily enroute expense'}`,
    lines: [
      {
        accountId: expAcc.id,
        debit: params.amount,
        credit: 0,
        description: `${params.expenseHeadName} (${params.remarks || ''})`,
        vehicleId: params.vehicleId,
        driverId: params.driverId,
      },
      {
        accountId: cashAcc.id,
        debit: 0,
        credit: params.amount,
        description: `Paid via ${params.paidFrom}`,
        vehicleId: params.vehicleId,
        driverId: params.driverId,
      },
    ],
  });
}

/**
 * Helper to record Fuel Purchase:
 * Dr. Diesel Expense (5001)
 * Cr. Cash (1001) or Vendor Payable (2001)
 */
export async function postFuelExpenseEntry(params: {
  date: Date;
  amount: number;
  vehicleId: string;
  tripId?: string;
  litres: number;
  paymentMethod: 'CASH' | 'BANK' | 'CREDIT';
  vendorId?: string;
  fuelStationName?: string;
}) {
  const dieselAcc = await prisma.account.findUnique({ where: { code: '5001' } });
  let crAccCode = '1001';
  if (params.paymentMethod === 'BANK') crAccCode = '1002';
  if (params.paymentMethod === 'CREDIT') crAccCode = '2001';

  const creditAcc = await prisma.account.findUnique({ where: { code: crAccCode } });
  if (!dieselAcc || !creditAcc) throw new Error('Accounting heads not found for fuel entry.');

  return await createJournalEntry({
    date: params.date,
    referenceType: 'FUEL',
    narration: `Diesel ${params.litres}L purchase for vehicle ${params.fuelStationName ? `at ${params.fuelStationName}` : ''}`,
    lines: [
      {
        accountId: dieselAcc.id,
        debit: params.amount,
        credit: 0,
        description: `Diesel ${params.litres}L`,
        vehicleId: params.vehicleId,
      },
      {
        accountId: creditAcc.id,
        debit: 0,
        credit: params.amount,
        description: params.paymentMethod === 'CREDIT' ? 'Payable to fuel station' : `Paid via ${params.paymentMethod}`,
        vehicleId: params.vehicleId,
        vendorId: params.vendorId,
      },
    ],
  });
}

/**
 * Helper to record Repair & Maintenance:
 * Dr. Repair & Maintenance Expense (5008)
 * Cr. Cash (1001) or Workshop Payable (2001)
 */
export async function postMaintenanceExpenseEntry(params: {
  date: Date;
  totalCost: number;
  partsCost: number;
  labourCost: number;
  vehicleId: string;
  workshopName?: string;
  vendorId?: string;
  paymentMethod: 'CASH' | 'BANK' | 'CREDIT';
  description: string;
}) {
  const maintAcc = await prisma.account.findUnique({ where: { code: '5008' } });
  const crAccCode = params.paymentMethod === 'CREDIT' ? '2001' : (params.paymentMethod === 'BANK' ? '1002' : '1001');
  const creditAcc = await prisma.account.findUnique({ where: { code: crAccCode } });

  if (!maintAcc || !creditAcc) throw new Error('Accounting heads not found for maintenance entry.');

  return await createJournalEntry({
    date: params.date,
    referenceType: 'MAINTENANCE',
    narration: `Maintenance & Repair: ${params.description} (Parts: ${params.partsCost}, Labour: ${params.labourCost})`,
    lines: [
      {
        accountId: maintAcc.id,
        debit: params.totalCost,
        credit: 0,
        description: `Repair Parts (${params.partsCost}) + Labour (${params.labourCost})`,
        vehicleId: params.vehicleId,
        vendorId: params.vendorId,
      },
      {
        accountId: creditAcc.id,
        debit: 0,
        credit: params.totalCost,
        description: params.paymentMethod === 'CREDIT' ? 'Workshop Payable' : `Paid via ${params.paymentMethod}`,
        vehicleId: params.vehicleId,
        vendorId: params.vendorId,
      },
    ],
  });
}
