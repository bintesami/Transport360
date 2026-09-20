import React from 'react';
import prisma from '@/lib/prisma';
import MaintenanceClient from './MaintenanceClient';


async function getMaintenanceData() {
  const vehicles = await prisma.vehicle.findMany({ select: { id: true, regNumber: true, currentOdometer: true } });
  const workshops = await prisma.vendor.findMany({
    where: { vendorType: { in: ['WORKSHOP', 'TYRE_SHOP', 'SPARE_PARTS'] } },
    select: { id: true, name: true, vendorType: true },
  });
  const maintenanceLogs = await prisma.maintenanceLog.findMany({
    include: {
      vehicle: true,
      workshop: true,
    },
    orderBy: { date: 'desc' },
  });

  return { vehicles, workshops, maintenanceLogs };
}

export default async function MaintenancePage() {
  const data = await getMaintenanceData();

  return (
    <MaintenanceClient
      vehicles={data.vehicles}
      workshops={data.workshops}
      initialLogs={data.maintenanceLogs}
    />
  );
}
