import React from 'react';
import prisma from '@/lib/prisma';
import DriversClient from './DriversClient';

async function getDriversData() {
  return await prisma.driver.findMany({
    include: {
      assignedVehicles: true,
      trips: {
        orderBy: { startDate: 'desc' },
        take: 3,
      },
      advances: true,
      dailyExpenses: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function DriversPage() {
  const drivers = await getDriversData();

  return <DriversClient initialDrivers={drivers} />;
}
