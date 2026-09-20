import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Navigation, Truck, Users, Clock, CheckCircle2, ChevronRight, Plus, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getTrips() {
  return await prisma.trip.findMany({
    include: {
      booking: {
        include: {
          customer: true,
        },
      },
      vehicle: true,
      driver: true,
      expenses: true,
      timelineEvents: {
        orderBy: { timestamp: 'desc' },
      },
    },
    orderBy: { startDate: 'desc' },
  });
}

export default async function TripsPage() {
  const trips = await getTrips();

  const getStatusBadge = (status: string) => {
    const map: { [k: string]: { label: string; color: string } } = {
      BOOKED: { label: 'Booked', color: 'bg-slate-100 text-slate-800' },
      LOADING: { label: 'Loading (لوڈنگ)', color: 'bg-amber-100 text-amber-800' },
      LOADED: { label: 'Loaded', color: 'bg-blue-100 text-blue-800' },
      IN_TRANSIT: { label: 'In Transit (روٹ پر)', color: 'bg-sky-100 text-sky-800' },
      ARRIVED: { label: 'Arrived (پہنچ گیا)', color: 'bg-indigo-100 text-indigo-800' },
      UNLOADING: { label: 'Unloading (ان لوڈنگ)', color: 'bg-orange-100 text-orange-800' },
      BILTY_CLEARANCE: { label: 'Bilty Clearance', color: 'bg-purple-100 text-purple-800' },
      PAYMENT_RECEIVED: { label: 'Payment Received', color: 'bg-emerald-100 text-emerald-800' },
      CLOSED: { label: 'Trip Closed (مکمل)', color: 'bg-emerald-200 text-emerald-900' },
    };
    const s = map[status] || { label: status, color: 'bg-slate-100 text-slate-800' };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.color}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Trips & Operations Timeline
            <span className="text-base font-normal text-slate-500 font-urdu">(ٹرپس و لائیو ٹائم لائن)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track multi-stage visual trip progression, route status, freight revenue, and trip profit
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Trip # (ٹرپ نمبر)</th>
                <th className="px-5 py-3">Vehicle / Driver</th>
                <th className="px-5 py-3">Customer / Route</th>
                <th className="px-5 py-3">Status (موجودہ مرحلہ)</th>
                <th className="px-5 py-3 text-right">Freight (کرایہ)</th>
                <th className="px-5 py-3 text-right">Expenses (خرچ)</th>
                <th className="px-5 py-3 text-right">Profit (منافع)</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trips.map((trip) => {
                const totalExp = trip.expenses.reduce((s, e) => s + e.amount, 0) || trip.totalExpenses;
                const profit = trip.freightRevenue - totalExp;

                return (
                  <tr key={trip.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-sky-600" />
                        <span>{trip.tripNumber}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {new Date(trip.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-800">{trip.vehicle.regNumber}</div>
                      <div className="text-[10px] text-slate-500">{trip.driver.name}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800">
                        {trip.booking?.customer?.name || 'Commercial Client'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {trip.booking ? `${trip.booking.pickupLocation} ➔ ${trip.booking.destination}` : 'Local Route'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(trip.status)}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-emerald-600 whitespace-nowrap">
                      Rs. {trip.freightRevenue.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-rose-600 whitespace-nowrap">
                      Rs. {totalExp.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md ${
                          profit >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        Rs. {profit.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Link
                        href={`/operations/trips/${trip.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-semibold transition-colors"
                      >
                        <span>Open Timeline</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
