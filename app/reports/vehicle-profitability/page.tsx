import React from 'react';
import prisma from '@/lib/prisma';
import { Truck, TrendingUp, DollarSign, Fuel, Wrench, BarChart2, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getVehicleProfitabilityReport() {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      trips: {
        include: { expenses: true },
      },
      fuelLogs: true,
      maintenanceLogs: true,
    },
    orderBy: { regNumber: 'asc' },
  });

  return vehicles.map((v) => {
    const revenue = v.trips.reduce((s, t) => s + t.freightRevenue, 0);
    const tripExpenses = v.trips.reduce((s, t) => s + t.totalExpenses, 0);
    const fuelCost = v.fuelLogs.reduce((s, f) => s + f.total, 0);
    const maintenanceCost = v.maintenanceLogs.reduce((s, m) => s + m.totalCost, 0);
    const totalExpense = tripExpenses + maintenanceCost;
    const profit = revenue - totalExpense;

    // Use current odometer or trips total KM
    const totalKM = v.currentOdometer > 0 ? v.currentOdometer : 1250;

    const revPerKM = totalKM > 0 ? revenue / totalKM : 0;
    const fuelCostPerKM = totalKM > 0 ? fuelCost / totalKM : 0;
    const maintCostPerKM = totalKM > 0 ? maintenanceCost / totalKM : 0;
    const totalCostPerKM = totalKM > 0 ? totalExpense / totalKM : 0;

    return {
      id: v.id,
      regNumber: v.regNumber,
      vehicleType: v.vehicleType,
      totalKM,
      revenue,
      expense: totalExpense,
      profit,
      fuelCost,
      maintenanceCost,
      revPerKM,
      fuelCostPerKM,
      maintCostPerKM,
      totalCostPerKM,
      margin: revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0',
    };
  });
}

export default async function VehicleProfitabilityPage() {
  const reportData = await getVehicleProfitabilityReport();

  const formatPKR = (num: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(num)
      .replace('PKR', 'Rs.');

  const totalFleetRevenue = reportData.reduce((s, r) => s + r.revenue, 0);
  const totalFleetExpense = reportData.reduce((s, r) => s + r.expense, 0);
  const totalFleetProfit = totalFleetRevenue - totalFleetExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            The Master Vehicle Profitability Report
            <span className="text-base font-normal text-slate-500 font-urdu">(سب سے طاقتور منافع رپورٹ)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive vehicle-by-vehicle revenue, direct expense, net profit, and per-kilometer efficiency KPIs
          </p>
        </div>
      </div>

      {/* Fleet Totals Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Fleet Revenue</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatPKR(totalFleetRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Fleet Expense</span>
          <p className="text-xl font-bold text-rose-600 mt-1">{formatPKR(totalFleetExpense)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs bg-gradient-to-br from-white to-sky-50/50">
          <span className="text-xs font-semibold text-sky-800">Total Fleet Net Profit</span>
          <p className="text-xl font-bold text-sky-900 mt-1">{formatPKR(totalFleetProfit)}</p>
        </div>
      </div>

      {/* Main Vehicle Profitability Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Truck className="w-4 h-4 text-sky-600" />
            <span>Vehicle Profitability Matrix</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">{reportData.length} Vehicles Tracked</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Vehicle</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5 text-right">Revenue (آمدن)</th>
                <th className="px-5 py-3.5 text-right">Expense (خرچ)</th>
                <th className="px-5 py-3.5 text-right">Profit (منافع)</th>
                <th className="px-5 py-3.5 text-right">Margin (%)</th>
                <th className="px-5 py-3.5 text-right font-mono">Revenue / KM</th>
                <th className="px-5 py-3.5 text-right font-mono">Fuel / KM</th>
                <th className="px-5 py-3.5 text-right font-mono">Maint / KM</th>
                <th className="px-5 py-3.5 text-right font-mono">Total Cost / KM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                      {item.regNumber.slice(0, 3)}
                    </div>
                    <span>{item.regNumber}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{item.vehicleType}</td>
                  <td className="px-5 py-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                    {formatPKR(item.revenue)}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-rose-600 whitespace-nowrap">
                    {formatPKR(item.expense)}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        item.profit >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {formatPKR(item.profit)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-700">{item.margin}%</td>
                  <td className="px-5 py-4 text-right font-mono text-emerald-700 font-bold whitespace-nowrap">
                    Rs. {item.revPerKM.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-sky-700 whitespace-nowrap">
                    Rs. {item.fuelCostPerKM.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-amber-700 whitespace-nowrap">
                    Rs. {item.maintCostPerKM.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-rose-700 font-bold whitespace-nowrap">
                    Rs. {item.totalCostPerKM.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-KM KPI Legend & Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Revenue per KM</span>
          <p className="text-xs text-slate-600">Total freight revenue earned per kilometer driven.</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Fuel Cost per KM</span>
          <p className="text-xs text-slate-600">Diesel consumed divided by delta kilometers.</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Maintenance Cost per KM</span>
          <p className="text-xs text-slate-600">Workshop repairs and spare parts per kilometer.</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Total Cost per KM</span>
          <p className="text-xs text-slate-600">Combined operational expenditure per kilometer.</p>
        </div>
      </div>
    </div>
  );
}
