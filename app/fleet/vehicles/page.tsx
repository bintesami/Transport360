import React from 'react';
import prisma from '@/lib/prisma';
import VehiclesClient from './VehiclesClient';

async function getVehiclesData() {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      assignedDriver: true,
      trips: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      fuelLogs: true,
      maintenanceLogs: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const drivers = await prisma.driver.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, name: true, phone: true },
  });

  return { vehicles, drivers };
}

export default async function VehiclesPage() {
  const { vehicles, drivers } = await getVehiclesData();

  return <VehiclesClient initialVehicles={vehicles} drivers={drivers} />;
}
