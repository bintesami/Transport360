import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createJournalEntry } from '@/lib/accounting';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        vehicle: true,
        driver: true,
      },
      orderBy: { bookingDate: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerId,
      bookingDate = new Date(),
      pickupLocation,
      destination,
      vehicleId,
      driverId,
      freightAmount,
      advanceReceived = 0,
      agentName,
      commissionAmount = 0,
      biltyNumber,
    } = body;

    const freight = Number(freightAmount) || 0;
    const advance = Number(advanceReceived) || 0;

    const count = await prisma.booking.count();
    const bookingNumber = `BK-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // 1. Create Booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId,
        bookingDate: new Date(bookingDate),
        pickupLocation,
        destination,
        vehicleId: vehicleId || null,
        driverId: driverId || null,
        freightAmount: freight,
        advanceReceived: advance,
        agentName: agentName || null,
        commissionAmount: Number(commissionAmount) || 0,
        biltyNumber,
        status: 'BOOKED',
      },
      include: {
        customer: true,
        vehicle: true,
        driver: true,
      },
    });

    // 2. Automated Double-Entry Journal:
    // Entry A: Freight booking: Dr. Customer Receivable (1100) / Cr. Freight Revenue (4001)
    const accAR = await prisma.account.findUnique({ where: { code: '1100' } });
    const accRev = await prisma.account.findUnique({ where: { code: '4001' } });
    const accCash = await prisma.account.findUnique({ where: { code: '1001' } });

    if (accAR && accRev && freight > 0) {
      await createJournalEntry({
        date: new Date(bookingDate),
        referenceType: 'INVOICE',
        referenceId: booking.id,
        narration: `Freight booked for ${booking.customer.name} (Bilty: ${biltyNumber}, ${pickupLocation} to ${destination})`,
        lines: [
          {
            accountId: accAR.id,
            debit: freight,
            credit: 0,
            description: `Freight Receivable - ${booking.customer.name}`,
            customerId,
            vehicleId: vehicleId || undefined,
          },
          {
            accountId: accRev.id,
            debit: 0,
            credit: freight,
            description: `Freight Revenue for Bilty ${biltyNumber}`,
            vehicleId: vehicleId || undefined,
          },
        ],
      });
    }

    // Entry B: Advance received: Dr. Cash (1001) / Cr. Customer Receivable (1100)
    if (accCash && accAR && advance > 0) {
      await createJournalEntry({
        date: new Date(bookingDate),
        referenceType: 'PAYMENT',
        referenceId: booking.id,
        narration: `Advance received from ${booking.customer.name} for Bilty ${biltyNumber}`,
        lines: [
          {
            accountId: accCash.id,
            debit: advance,
            credit: 0,
            description: 'Advance received at booking',
            customerId,
          },
          {
            accountId: accAR.id,
            debit: 0,
            credit: advance,
            description: `Credit advance to ${booking.customer.name}`,
            customerId,
          },
        ],
      });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
