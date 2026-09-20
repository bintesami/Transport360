import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Users, Truck, DollarSign, Wallet, Plus, ArrowUpRight, History } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDrivers() {
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
  const drivers = await getDrivers();

  const formatPKR = (num: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(num)
      .replace('PKR', 'Rs.');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Drivers & Sub-Ledgers
            <span className="text-base font-normal text-slate-500 font-urdu">(ڈرائیورز کھاتہ)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage driver profiles, salary, advances, daily allowances, and sub-ledger statements
          </p>
        </div>
      </div>

      {/* Drivers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => {
          const totalDailyExpenses = driver.dailyExpenses.reduce((s, d) => s + d.amount, 0);
          const totalAdvances = driver.advances.reduce((s, a) => s + a.amount, 0);
          const assignedVehicle = driver.assignedVehicles[0];

          return (
            <div
              key={driver.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{driver.name}</h3>
                  <p className="text-xs text-slate-500">Phone: {driver.phone}</p>
                  <p className="text-[11px] text-slate-400 font-mono">CNIC: {driver.cnic || 'N/A'}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {driver.status}
                </span>
              </div>

              {/* Assigned Vehicle */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Assigned Vehicle:</span>
                </span>
                <span className="font-bold text-slate-800">
                  {assignedVehicle ? assignedVehicle.regNumber : 'None'}
                </span>
              </div>

              {/* Sub-Ledger Snapshot */}
              <div className="space-y-2 text-xs border-t border-b border-slate-100 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Salary (ماہانہ تنخواہ):</span>
                  <span className="font-semibold text-slate-800">{formatPKR(driver.monthlySalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Allowance Rate:</span>
                  <span className="font-medium text-slate-800">Rs. {driver.dailyAllowanceRate} / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Advances Taken:</span>
                  <span className="font-medium text-slate-800">{formatPKR(totalAdvances)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Enroute Daily Expenses:</span>
                  <span className="font-medium text-slate-800">{formatPKR(totalDailyExpenses)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 font-bold">
                  <span className="text-amber-800">Outstanding Advance (بقایا ایڈوانس):</span>
                  <span className="text-amber-700">{formatPKR(driver.outstandingAdvance)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  {driver.trips.length} Trips recorded
                </span>
                <Link
                  href={`/fleet/vehicles`}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                >
                  <span>Vehicle History</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
