import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { postMaintenanceExpenseEntry } from '@/lib/accounting';

export async function GET() {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      include: {
        vehicle: true,
        workshop: true,
      },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      vehicleId,
      workshopVendorId,
      date = new Date(),
      category = 'ENGINE',
      description,
      partsCost = 0,
      labourCost = 0,
      totalCost,
      odometer,
      paymentMethod = 'CASH',
    } = body;

    const parts = Number(partsCost) || 0;
    const labour = Number(labourCost) || 0;
    const total = Number(totalCost) || parts + labour;

    if (!vehicleId || total <= 0) {
      return NextResponse.json({ error: 'Vehicle and a valid total cost are required' }, { status: 400 });
    }

    // 1. Create MaintenanceLog record
    const log = await prisma.maintenanceLog.create({
      data: {
        vehicleId,
        workshopVendorId: workshopVendorId || null,
        date: new Date(date),
        category,
        description: description || `${category} Repair`,
        partsCost: parts,
        labourCost: labour,
        totalCost: total,
        odometer: Number(odometer) || null,
        paymentMethod,
      },
    });

    // 2. Post Automated Double-Entry Journal Entry
    // Dr. Repair & Maintenance (5008) / Cr. Cash (1001) or Workshop Payable (2001)
    const jv = await postMaintenanceExpenseEntry({
      date: new Date(date),
      totalCost: total,
      partsCost: parts,
      labourCost: labour,
      vehicleId,
      vendorId: workshopVendorId || undefined,
      paymentMethod: paymentMethod as 'CASH' | 'BANK' | 'CREDIT',
      description: description || `${category} Repair`,
    });

    return NextResponse.json({ success: true, maintenanceLog: log, journalEntry: jv });
  } catch (error: any) {
    console.error('Maintenance log error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
