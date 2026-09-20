import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, location, remarks } = body;

    const trip = await prisma.trip.update({
      where: { id: params.id },
      data: {
        status,
        timelineEvents: {
          create: {
            status,
            location: location || null,
            remarks: remarks || null,
          },
        },
      },
    });

    return NextResponse.json({ success: true, trip });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
