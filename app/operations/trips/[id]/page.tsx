import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import TripDetailClient from './TripDetailClient';

export async function generateStaticParams() {
  const trips = await prisma.trip.findMany({ select: { id: true } });
  return trips.map((t) => ({ id: t.id }));
}

async function getTripData(id: string) {
  return await prisma.trip.findUnique({
    where: { id },
    include: {
      booking: {
        include: {
          customer: true,
        },
      },
      vehicle: true,
      driver: true,
      conductor: true,
      expenses: {
        include: {
          vendor: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      timelineEvents: {
        orderBy: { timestamp: 'asc' },
      },
    },
  });
}

export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const trip = await getTripData(params.id);

  if (!trip) {
    notFound();
  }

  return <TripDetailClient initialTrip={trip} />;
}
