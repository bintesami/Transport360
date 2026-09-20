import React from 'react';
import prisma from '@/lib/prisma';
import CustomersClient from './CustomersClient';

async function getCustomersData() {
  return await prisma.customer.findMany({
    include: {
      bookings: {
        include: { trip: true },
        orderBy: { bookingDate: 'desc' },
      },
      journalLines: {
        include: { journalEntry: true },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export default async function CustomerAccountsPage() {
  const customers = await getCustomersData();

  return <CustomersClient initialCustomers={customers} />;
}
