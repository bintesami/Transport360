import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { postDailyExpenseEntry } from '@/lib/accounting';

export async function GET() {
  try {
    const expenses = await prisma.dailyExpense.findMany({
      include: {
        vehicle: true,
        driver: true,
        trip: true,
      },
      orderBy: { date: 'desc' },
      take: 50,
    });
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      date = new Date(),
      vehicleId,
      driverId,
      tripId,
      expenseHead,
      subHead,
      amount,
      paidFrom = 'CASH',
      location,
      receiptNumber,
      remarks,
    } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    if (!expenseHead) {
      return NextResponse.json({ error: 'Expense Head is required' }, { status: 400 });
    }

    // 1. Create Daily Expense record
    const dailyExpense = await prisma.dailyExpense.create({
      data: {
        date: new Date(date),
        vehicleId: vehicleId || null,
        driverId: driverId || null,
        tripId: tripId || null,
        expenseHead,
        subHead,
        amount: Number(amount),
        paidFrom,
        location,
        receiptNumber,
        remarks,
      },
    });

    // 2. Automate Double-Entry Journal Entry
    // Dr. Expense Head / Cr. Cash or Bank
    const jv = await postDailyExpenseEntry({
      date: new Date(date),
      expenseHeadName: expenseHead,
      amount: Number(amount),
      paidFrom: paidFrom as 'CASH' | 'BANK',
      vehicleId: vehicleId || undefined,
      driverId: driverId || undefined,
      tripId: tripId || undefined,
      remarks: remarks || `Receipt: ${receiptNumber || 'None'}`,
    });

    return NextResponse.json({ success: true, dailyExpense, journalEntry: jv });
  } catch (error: any) {
    console.error('Daily expense error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
