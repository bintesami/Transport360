import React from 'react';
import prisma from '@/lib/prisma';
import FuelClient from './FuelClient';


async function getFuelData() {
  const vehicles = await prisma.vehicle.findMany({ select: { id: true, regNumber: true, currentOdometer: true } });
  const pumps = await prisma.vendor.findMany({
    where: { vendorType: 'DIESEL_PUMP' },
    select: { id: true, name: true },
  });
  const trips = await prisma.trip.findMany({
    where: { status: { not: 'CLOSED' } },
    select: { id: true, tripNumber: true },
  });
  const fuelLogs = await prisma.fuelLog.findMany({
    include: {
      vehicle: true,
      fuelStation: true,
      trip: true,
    },
    orderBy: { date: 'desc' },
  });

  return { vehicles, pumps, trips, fuelLogs };
}

export default async function FuelPage() {
  const data = await getFuelData();

  return (
    <FuelClient
      vehicles={data.vehicles}
      pumps={data.pumps}
      trips={data.trips}
      initialFuelLogs={data.fuelLogs}
    />
  );
}
