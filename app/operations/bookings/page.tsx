import React from 'react';
import prisma from '@/lib/prisma';
import BookingsClient from './BookingsClient';


async function getBookingsData() {
  const customers = await prisma.customer.findMany({ select: { id: true, name: true, companyName: true } });
  const vehicles = await prisma.vehicle.findMany({ select: { id: true, regNumber: true } });
  const drivers = await prisma.driver.findMany({ select: { id: true, name: true } });
  const bookings = await prisma.booking.findMany({
    include: {
      customer: true,
      vehicle: true,
      driver: true,
      trip: true,
    },
    orderBy: { bookingDate: 'desc' },
  });

  return { customers, vehicles, drivers, bookings };
}

export default async function BookingsPage() {
  const data = await getBookingsData();

  return (
    <BookingsClient
      customers={data.customers}
      vehicles={data.vehicles}
      drivers={data.drivers}
      initialBookings={data.bookings}
    />
  );
}
