import React from 'react';
import prisma from '@/lib/prisma';
import DailyExpenseClient from './DailyExpenseClient';

export const dynamic = 'force-dynamic';

async function getData() {
  const vehicles = await prisma.vehicle.findMany({ select: { id: true, regNumber: true } });
  const drivers = await prisma.driver.findMany({ select: { id: true, name: true } });
  const trips = await prisma.trip.findMany({
    where: { status: { not: 'CLOSED' } },
    select: { id: true, tripNumber: true },
  });
  const expenses = await prisma.dailyExpense.findMany({
    include: {
      vehicle: true,
      driver: true,
      trip: true,
    },
    orderBy: { date: 'desc' },
    take: 50,
  });

  return { vehicles, drivers, trips, expenses };
}

export default async function DailyExpensesPage() {
  const data = await getData();

  return (
    <DailyExpenseClient
      initialVehicles={data.vehicles}
      initialDrivers={data.drivers}
      initialTrips={data.trips}
      initialExpenses={data.expenses}
    />
  );
}
