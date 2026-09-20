import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createJournalEntry } from '@/lib/accounting';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { category, amount, paidThrough = 'CASH', vendorId, receiptNumber, remarks } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: { vehicle: true },
    });
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    // 1. Create TripExpense
    const tripExpense = await prisma.tripExpense.create({
      data: {
        tripId: params.id,
        category,
        amount: numAmount,
        paidThrough,
        vendorId: vendorId || null,
        receiptNumber: receiptNumber || null,
        remarks: remarks || null,
      },
    });

    // 2. Update Trip Financials
    const allExpenses = await prisma.tripExpense.findMany({ where: { tripId: params.id } });
    const totalExp = allExpenses.reduce((s, e) => s + e.amount, 0);
    const netProfit = trip.freightRevenue - totalExp;

    await prisma.trip.update({
      where: { id: params.id },
      data: {
        totalExpenses: totalExp,
        netProfit,
      },
    });

    // 3. Post Double-Entry Journal
    // Map category to COA code
    const categoryMap: { [k: string]: string } = {
      DIESEL: '5001',
      TOLL: '5004',
      LOADING: '5005',
      UNLOADING: '5006',
      DRIVER: '5002',
      CONDUCTOR: '5003',
      AGENT: '5007',
      OTHER: '5012',
    };

    const expCode = categoryMap[category] || '5012';
    const crCode = paidThrough === 'CREDIT' ? '2001' : paidThrough === 'BANK' ? '1002' : '1001';

    const drAccount = await prisma.account.findUnique({ where: { code: expCode } });
    const crAccount = await prisma.account.findUnique({ where: { code: crCode } });

    if (drAccount && crAccount) {
      await createJournalEntry({
        referenceType: 'TRIP',
        referenceId: trip.id,
        narration: `Trip ${trip.tripNumber} ${category} Expense: ${remarks || ''}`,
        lines: [
          {
            accountId: drAccount.id,
            debit: numAmount,
            credit: 0,
            description: `${category} expense for Trip ${trip.tripNumber}`,
            vehicleId: trip.vehicleId,
          },
          {
            accountId: crAccount.id,
            debit: 0,
            credit: numAmount,
            description: `Paid via ${paidThrough}`,
            vehicleId: trip.vehicleId,
            vendorId: vendorId || undefined,
          },
        ],
      });
    }

    return NextResponse.json({ success: true, tripExpense });
  } catch (error: any) {
    console.error('Trip expense error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
