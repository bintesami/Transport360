import React from 'react';
import prisma from '@/lib/prisma';
import { Building2, Phone, MapPin, Wrench, Fuel, Disc, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getVendors() {
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
  const vendors = await getVendors();

  const formatPKR = (num: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(num)
      .replace('PKR', 'Rs.');

  const getVendorIcon = (type: string) => {
    switch (type) {
      case 'DIESEL_PUMP':
        return <Fuel className="w-4 h-4 text-sky-600" />;
      case 'WORKSHOP':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'TYRE_SHOP':
        return <Disc className="w-4 h-4 text-purple-600" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Vendor & Supplier Accounts
            <span className="text-base font-normal text-slate-500 font-urdu">(وینڈرز کھاتہ و واجبات)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accounts Payable (AP) sub-ledger for Diesel Pumps, Workshops, Tyre Shops, and Service Contractors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => {
          const fuelBills = vendor.fuelLogs.reduce((s, f) => s + f.total, 0);
          const repairBills = vendor.maintenanceLogs.reduce((s, m) => s + m.totalCost, 0);
          const otherExpenses = vendor.tripExpenses.reduce((s, e) => s + e.amount, 0);
          const totalBilled = fuelBills + repairBills + otherExpenses;

          return (
            <div
              key={vendor.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {getVendorIcon(vendor.vendorType)}
                    <h3 className="font-bold text-slate-900 text-base">{vendor.name}</h3>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 mt-1 inline-block">
                    {vendor.vendorType.replace('_', ' ')}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{vendor.phone || 'N/A'}</span>
                  </p>
                </div>
              </div>

              {/* Vendor Ledger Summary */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Billed History:</span>
                  <span className="font-semibold text-slate-800">{formatPKR(totalBilled)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                  <span className="text-amber-800">Current Payable (واجب الادا):</span>
                  <span className="text-amber-700">{formatPKR(vendor.balance)}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{vendor.maintenanceLogs.length + vendor.fuelLogs.length} Vouchers linked</span>
                <span className="text-sky-600 font-medium cursor-pointer hover:underline">
                  View Full Statement
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
