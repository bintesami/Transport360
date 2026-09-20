import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Truck, Plus, Eye, Fuel, Wrench, Navigation, CheckCircle, Clock } from 'lucide-react';


async function getVehicles() {
  return await prisma.vehicle.findMany({
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
}

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Available (دستیاب)</span>;
      case 'ON_TRIP':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">On Trip (روٹ پر)</span>;
      case 'UNDER_REPAIR':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">Under Repair (ورکشاپ)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Vehicles Fleet
            <span className="text-base font-normal text-slate-500 font-urdu">(گاڑیاں)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your trucks, trailers, assigned drivers, and individual vehicle ledgers
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Vehicle (گاڑی)</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Assigned Driver (ڈرائیور)</th>
                <th className="px-5 py-3">Status (حالت)</th>
                <th className="px-5 py-3">Current Trip (موجودہ ٹرپ)</th>
                <th className="px-5 py-3 text-right">Odometer (KM)</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {vehicles.map((v) => {
                const currentTrip = v.trips[0];
                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm">{v.regNumber}</span>
                        <p className="text-[10px] text-slate-500 font-normal">{v.model || 'Commercial'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">{v.vehicleType}</td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {v.assignedDriver ? (
                        <div>
                          <p className="font-semibold text-slate-800">{v.assignedDriver.name}</p>
                          <p className="text-[10px] text-slate-500">{v.assignedDriver.phone}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No Driver Assigned</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(v.status)}</td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {currentTrip ? (
                        <div className="flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-medium text-slate-900">{currentTrip.tripNumber}</span>
                          <span className="text-[10px] text-slate-500">({currentTrip.status})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">No active trip</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-medium text-slate-800">
                      {v.currentOdometer.toLocaleString()} KM
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Link
                        href={`/fleet/vehicles/${v.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open 7 Tabs</span>
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
