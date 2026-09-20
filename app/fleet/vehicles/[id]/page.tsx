import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import {
  Truck,
  Calendar,
  Fuel,
  Wrench,
  DollarSign,
  FileText,
  Navigation,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  FileCheck,
} from 'lucide-react';
import VehicleDetailClient from './VehicleDetailClient';

export async function generateStaticParams() {
  const vehicles = await prisma.vehicle.findMany({ select: { id: true } });
  return vehicles.map((v) => ({ id: v.id }));
}

async function getVehicleData(id: string) {
  return await prisma.vehicle.findUnique({
    where: { id },
    include: {
      assignedDriver: true,
      trips: {
        include: {
          expenses: true,
          timelineEvents: true,
        },
        orderBy: { startDate: 'desc' },
      },
      fuelLogs: {
        include: { fuelStation: true },
        orderBy: { date: 'desc' },
      },
      maintenanceLogs: {
        include: { workshop: true },
        orderBy: { date: 'desc' },
      },
      dailyExpenses: {
        orderBy: { date: 'desc' },
      },
      documents: true,
    },
  });
}

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicleData(params.id);

  if (!vehicle) {
    notFound();
  }

  // Financial calculations for this specific vehicle
  const totalRevenue = vehicle.trips.reduce((s, t) => s + t.freightRevenue, 0);
  const totalTripExpenses = vehicle.trips.reduce((s, t) => s + t.totalExpenses, 0);
  const totalFuelCost = vehicle.fuelLogs.reduce((s, f) => s + f.total, 0);
  const totalRepairCost = vehicle.maintenanceLogs.reduce((s, m) => s + m.totalCost, 0);
  const totalDailyExpenses = vehicle.dailyExpenses.reduce((s, d) => s + d.amount, 0);
  const totalExpenses = totalTripExpenses + totalRepairCost + totalDailyExpenses;
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/fleet/vehicles"
            className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{vehicle.regNumber}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                {vehicle.vehicleType}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {vehicle.model || 'Commercial Vehicle'} • Chassis: {vehicle.chassisNumber || 'N/A'} • Engine:{' '}
              {vehicle.engineNumber || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Assigned Driver:</span>
          <span className="text-xs font-bold text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            {vehicle.assignedDriver?.name || 'Unassigned'}
          </span>
        </div>
      </div>

      {/* Financial Health Ribbon: Revenue -> Expense -> Repair -> Fuel -> Trip -> Profit */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs text-slate-500 font-semibold">
          <span>VEHICLE FINANCIAL SUMMARY (گاڑی کا مالیاتی خلاصہ)</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
            {vehicle.currentOdometer.toLocaleString()} Total KM
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500">Revenue (آمدن)</span>
            <p className="text-base font-bold text-emerald-600 mt-1">Rs. {totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500">Total Expense (کل خرچ)</span>
            <p className="text-base font-bold text-rose-600 mt-1">Rs. {totalExpenses.toLocaleString()}</p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500">Repair (مرمت)</span>
            <p className="text-base font-bold text-amber-600 mt-1">Rs. {totalRepairCost.toLocaleString()}</p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500">Fuel (ڈیزل)</span>
            <p className="text-base font-bold text-sky-600 mt-1">Rs. {totalFuelCost.toLocaleString()}</p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500">Trip Expenses</span>
            <p className="text-base font-bold text-indigo-600 mt-1">Rs. {totalTripExpenses.toLocaleString()}</p>
          </div>

          <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800">Net Profit (خالص منافع)</span>
            <p className="text-base font-bold text-emerald-700 mt-1">Rs. {netProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 7 Tabs Component */}
      <VehicleDetailClient
        vehicle={vehicle}
        financials={{
          totalRevenue,
          totalExpenses,
          totalRepairCost,
          totalFuelCost,
          totalTripExpenses,
          netProfit,
        }}
      />
    </div>
  );
}
