import React from 'react';
import prisma from '@/lib/prisma';
import VendorsClient from './VendorsClient';

async function getVendorsData() {
  return await prisma.vendor.findMany({
    include: {
      fuelLogs: true,
      maintenanceLogs: true,
      tripExpenses: true,
    },
    orderBy: { name: 'asc' },
  });
}

export default async function VendorAccountsPage() {
  const vendors = await getVendorsData();

  return <VendorsClient initialVendors={vendors} />;
}
