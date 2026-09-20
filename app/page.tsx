import React from 'react';
import prisma from '@/lib/prisma';
import DashboardClient, { DashboardData } from '@/components/DashboardClient';

async function getDashboardData(): Promise<DashboardData | null> {
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

  return <DashboardClient data={data} />;
}

