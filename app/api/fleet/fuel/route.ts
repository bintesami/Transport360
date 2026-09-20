import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { postFuelExpenseEntry } from '@/lib/accounting';

export async function GET() {
  try {
    const fuelLogs = await prisma.fuelLog.findMany({
      include: {
        vehicle: true,
        fuelStation: true,
        trip: true,
      },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(fuelLogs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      vehicleId,
      tripId,
      date = new Date(),
      location,
      litres,
      rate,
      total,
      odometer,
      fuelStationVendorId,
      paymentMethod = 'CASH',
    } = body;

    if (!vehicleId || !litres || !total) {
      return NextResponse.json({ error: 'Vehicle, litres, and total are required' }, { status: 400 });
    }

    const numLitres = Number(litres);
    const numRate = Number(rate) || Number(total) / numLitres;
    const numTotal = Number(total);
    const numOdometer = Number(odometer) || 0;

    // Fetch previous fuel log to calculate KM/L and Cost/KM
    const previousLog = await prisma.fuelLog.findFirst({
      where: { vehicleId },
      orderBy: { odometer: 'desc' },
    });

    let kmPerLitre: number | null = null;
    let fuelCostPerKM: number | null = null;

    if (previousLog && numOdometer > previousLog.odometer) {
      const deltaKM = numOdometer - previousLog.odometer;
      if (numLitres > 0) kmPerLitre = deltaKM / numLitres;
      if (deltaKM > 0) fuelCostPerKM = numTotal / deltaKM;
    }

    // Update vehicle's current odometer if new reading is higher
    if (numOdometer > 0) {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { currentOdometer: numOdometer },
      });
    }

    // 1. Create FuelLog record
    const fuelLog = await prisma.fuelLog.create({
      data: {
        vehicleId,
        tripId: tripId || null,
        date: new Date(date),
        location,
        litres: numLitres,
        rate: numRate,
        total: numTotal,
        odometer: numOdometer,
        fuelStationVendorId: fuelStationVendorId || null,
        paymentMethod,
        kmPerLitre,
        fuelCostPerKM,
      },
    });

    // 2. Post Automated Double-Entry Journal Entry
    // Dr. Diesel Expense (5001) / Cr. Cash (1001) or Vendor Payable (2001)
    const jv = await postFuelExpenseEntry({
      date: new Date(date),
      amount: numTotal,
      vehicleId,
      tripId: tripId || undefined,
      litres: numLitres,
      paymentMethod: paymentMethod as 'CASH' | 'BANK' | 'CREDIT',
      vendorId: fuelStationVendorId || undefined,
    });

    return NextResponse.json({ success: true, fuelLog, journalEntry: jv });
  } catch (error: any) {
    console.error('Fuel log error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
