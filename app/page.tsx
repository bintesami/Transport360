import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Building2,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Fuel,
  Wrench,
  Navigation,
  FileSpreadsheet,
  ChevronRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  try {
    // 1. Fetch Accounts for Today & Balances
    const cashAccount = await prisma.account.findUnique({ where: { code: '1001' } });
    const bankAccountHBL = await prisma.account.findUnique({ where: { code: '1002' } });
    const bankAccountMeezan = await prisma.account.findUnique({ where: { code: '1003' } });
    const totalBankBalance = (bankAccountHBL?.balance || 0) + (bankAccountMeezan?.balance || 0);

    // Revenue & Expenses
    const freightRev = await prisma.account.findUnique({ where: { code: '4001' } });
    const otherRev = await prisma.account.findUnique({ where: { code: '4002' } });
    const totalIncome = (freightRev?.balance || 0) + (otherRev?.balance || 0);

    const expenseAccounts = await prisma.account.findMany({
      where: { type: 'EXPENSE' },
    });
    const totalExpense = expenseAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const netProfit = totalIncome - totalExpense;

    // 2. Fleet Stats
    const totalVehicles = await prisma.vehicle.count();
    const availableVehicles = await prisma.vehicle.count({ where: { status: 'AVAILABLE' } });
    const onTripVehicles = await prisma.vehicle.count({ where: { status: 'ON_TRIP' } });
    const underRepairVehicles = await prisma.vehicle.count({ where: { status: 'UNDER_REPAIR' } });

    // 3. Trips Stats
    const runningTrips = await prisma.trip.count({ where: { status: { in: ['IN_TRANSIT', 'LOADING', 'LOADED'] } } });
    const completedTrips = await prisma.trip.count({ where: { status: 'CLOSED' } });
    const pendingDelivery = await prisma.trip.count({ where: { status: { in: ['ARRIVED', 'UNLOADING'] } } });
    const pendingPayment = await prisma.trip.count({ where: { status: 'BILTY_CLEARANCE' } });

    // 4. Alerts
    const arAccount = await prisma.account.findUnique({ where: { code: '1100' } });
    const apAccount = await prisma.account.findUnique({ where: { code: '2001' } });
    const driverAdvanceAccount = await prisma.account.findUnique({ where: { code: '1200' } });

    // 5. Vehicle Profitability Summary
    const vehicles = await prisma.vehicle.findMany({
      include: {
        trips: {
          include: {
            expenses: true,
          },
        },
        fuelLogs: true,
        maintenanceLogs: true,
      },
    });

    const vehicleProfitability = vehicles.map((v) => {
      const revenue = v.trips.reduce((s, t) => s + t.freightRevenue, 0);
      const tripExp = v.trips.reduce((s, t) => s + t.totalExpenses, 0);
      const maintExp = v.maintenanceLogs.reduce((s, m) => s + m.totalCost, 0);
      const totalCost = tripExp + maintExp;
      const profit = revenue - totalCost;
      const totalKm = v.currentOdometer > 0 ? v.currentOdometer : 1250;
      
      const revPerKm = totalKm > 0 ? (revenue / totalKm) : 0;
      const fuelCost = v.fuelLogs.reduce((s, f) => s + f.total, 0);
      const fuelCostPerKm = totalKm > 0 ? (fuelCost / totalKm) : 0;
      const maintCostPerKm = totalKm > 0 ? (maintExp / totalKm) : 0;

      return {
        id: v.id,
        regNumber: v.regNumber,
        type: v.vehicleType,
        revenue,
        expense: totalCost,
        profit,
        revPerKm,
        fuelCostPerKm,
        maintCostPerKm,
      };
    });

    return {
      cashBalance: cashAccount?.balance || 0,
      bankBalance: totalBankBalance,
      totalIncome,
      totalExpense,
      netProfit,
      fleet: {
        total: totalVehicles,
        available: availableVehicles,
        onTrip: onTripVehicles,
        underRepair: underRepairVehicles,
      },
      trips: {
        running: runningTrips,
        completed: completedTrips,
        pendingDelivery,
        pendingPayment,
      },
      alerts: {
        maintenanceDue: underRepairVehicles,
        paymentReceivable: arAccount?.balance || 0,
        paymentPayable: apAccount?.balance || 0,
        driverAdvanceOutstanding: driverAdvanceAccount?.balance || 0,
      },
      vehicleProfitability,
    };
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return null;
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Loading Transport360 Dashboard...</p>
      </div>
    );
  }

  const formatPKR = (num: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(num)
      .replace('PKR', 'Rs.');

  return (
    <div className="space-y-8">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Dashboard
            <span className="text-base font-normal text-slate-500 font-urdu">(ڈیش بورڈ)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Fleet Operations & Strict Double-Entry Financial Health
          </p>
        </div>
      </div>

      {/* 1. Today & Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Income */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Income (آمدن)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">{formatPKR(data.totalIncome)}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Operational Freight</span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Expense (اخراجات)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">{formatPKR(data.totalExpense)}</p>
          <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Fuel, Maintenance & Trips</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all bg-gradient-to-br from-white to-sky-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-800">Net Profit (خالص منافع)</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-xl font-bold mt-2 ${data.netProfit >= 0 ? 'text-sky-900' : 'text-rose-600'}`}>
            {formatPKR(data.netProfit)}
          </p>
          <div className="text-[11px] text-sky-700 font-medium mt-1">
            Margin: {data.totalIncome > 0 ? ((data.netProfit / data.totalIncome) * 100).toFixed(1) : 0}%
          </div>
        </div>

        {/* Cash Balance */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cash Balance (کیش)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">{formatPKR(data.cashBalance)}</p>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Petty Cash In Hand</div>
        </div>

        {/* Bank Balance */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Bank Balance (بینک)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">{formatPKR(data.bankBalance)}</p>
          <div className="text-[11px] text-slate-500 font-medium mt-1">HBL + Meezan Accounts</div>
        </div>
      </div>

      {/* Fleet & Trips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-sky-600" />
              <h2 className="font-bold text-slate-800 text-sm">Fleet Status (گاڑیاں)</h2>
            </div>
            <span className="text-xs font-semibold bg-slate-100 px-2.5 py-1 rounded-full text-slate-600">
              Total: {data.fleet.total}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-3 text-center">
              <span className="text-[11px] font-medium text-emerald-800">Available</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{data.fleet.available}</p>
              <span className="text-[10px] text-emerald-700 font-urdu">دستیاب</span>
            </div>

            <div className="bg-sky-50/60 border border-sky-100 rounded-lg p-3 text-center">
              <span className="text-[11px] font-medium text-sky-800">On Trip</span>
              <p className="text-2xl font-bold text-sky-600 mt-1">{data.fleet.onTrip}</p>
              <span className="text-[10px] text-sky-700 font-urdu">روٹ پر</span>
            </div>

            <div className="bg-rose-50/60 border border-rose-100 rounded-lg p-3 text-center">
              <span className="text-[11px] font-medium text-rose-800">Under Repair</span>
              <p className="text-2xl font-bold text-rose-600 mt-1">{data.fleet.underRepair}</p>
              <span className="text-[10px] text-rose-700 font-urdu">ورکشاپ</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            <Link
              href="/fleet/vehicles"
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>View All Fleet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Trips Pipeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-slate-800 text-sm">Trips Pipeline (ٹرپس)</h2>
            </div>
            <Link href="/operations/trips" className="text-xs text-sky-600 hover:underline">
              Live Monitor
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-900">Running Trips</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-xl font-bold text-amber-700 mt-1">{data.trips.running}</p>
              <span className="text-[10px] text-amber-800 font-urdu">جاری ٹرپس</span>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-900">Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl font-bold text-emerald-700 mt-1">{data.trips.completed}</p>
              <span className="text-[10px] text-emerald-800 font-urdu">مکمل شدہ</span>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-900">Pending Delivery</span>
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xl font-bold text-blue-700 mt-1">{data.trips.pendingDelivery}</p>
              <span className="text-[10px] text-blue-800 font-urdu">ڈیلیوری باقی</span>
            </div>

            <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-purple-900">Pending Payment</span>
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-purple-700 mt-1">{data.trips.pendingPayment}</p>
              <span className="text-[10px] text-purple-800 font-urdu">ادائیگی باقی</span>
            </div>
          </div>
        </div>

        {/* Alerts & Reminders */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h2 className="font-bold text-slate-800 text-sm">Alerts & Actions (اطلاعات)</h2>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-xs">
              <div className="flex items-center gap-2 text-rose-800">
                <Wrench className="w-4 h-4 text-rose-600" />
                <span className="font-semibold">Maintenance Due:</span>
              </div>
              <span className="font-bold text-rose-700">{data.alerts.maintenanceDue} Vehicles</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs">
              <div className="flex items-center gap-2 text-emerald-800">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Payment Receivable:</span>
              </div>
              <span className="font-bold text-emerald-700">{formatPKR(data.alerts.paymentReceivable)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-100 text-xs">
              <div className="flex items-center gap-2 text-amber-800">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span className="font-semibold">Payment Payable:</span>
              </div>
              <span className="font-bold text-amber-700">{formatPKR(data.alerts.paymentPayable)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-50 border border-sky-100 text-xs">
              <div className="flex items-center gap-2 text-sky-800">
                <Wallet className="w-4 h-4 text-sky-600" />
                <span className="font-semibold">Driver Advance Out:</span>
              </div>
              <span className="font-bold text-sky-700">{formatPKR(data.alerts.driverAdvanceOutstanding)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 16. The Master Vehicle Profitability Report (Quick View) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Vehicle Profitability Summary
              <span className="text-xs font-normal text-slate-500 font-urdu">(گاڑی وار منافع رپورٹ)</span>
            </h2>
            <p className="text-xs text-slate-500">Live operational margins and per-KM fleet efficiency</p>
          </div>
          <Link
            href="/reports/vehicle-profitability"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Open Master Profitability Report</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 text-right">Revenue (آمدن)</th>
                <th className="px-5 py-3 text-right">Expense (خرچ)</th>
                <th className="px-5 py-3 text-right">Profit (منافع)</th>
                <th className="px-5 py-3 text-right">Revenue / KM</th>
                <th className="px-5 py-3 text-right">Fuel / KM</th>
                <th className="px-5 py-3 text-right">Maint / KM</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.vehicleProfitability.map((vp) => (
                <tr key={vp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{vp.regNumber}</td>
                  <td className="px-5 py-3.5 text-slate-600">{vp.type}</td>
                  <td className="px-5 py-3.5 text-right font-medium text-emerald-600">
                    {formatPKR(vp.revenue)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-rose-600">
                    {formatPKR(vp.expense)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                    <span
                      className={`px-2 py-1 rounded-md ${
                        vp.profit >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {formatPKR(vp.profit)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-700 font-mono">
                    Rs. {vp.revPerKm.toFixed(1)}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-700 font-mono">
                    Rs. {vp.fuelCostPerKm.toFixed(1)}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-700 font-mono">
                    Rs. {vp.maintCostPerKm.toFixed(1)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Link
                      href={`/fleet/vehicles/${vp.id}`}
                      className="text-sky-600 hover:text-sky-800 font-semibold"
                    >
                      View 7 Tabs
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
