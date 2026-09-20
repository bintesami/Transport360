import React from 'react';
import prisma from '@/lib/prisma';
import { Building2, Phone, Mail, MapPin, DollarSign, ArrowUpRight, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCustomers() {
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
  const customers = await getCustomers();

  const formatPKR = (num: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(num)
      .replace('PKR', 'Rs.');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Customer Ledgers & Receivables
            <span className="text-base font-normal text-slate-500 font-urdu">(کسٹمر کھاتہ و بقایا جات)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accounts Receivable (AR) sub-ledger, freight billing, advances, settlements and statements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {customers.map((cust) => {
          const totalFreightBilled = cust.bookings.reduce((s, b) => s + b.freightAmount, 0);
          const totalAdvances = cust.bookings.reduce((s, b) => s + b.advanceReceived, 0);
          const outstanding = cust.balance;

          return (
            <div
              key={cust.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{cust.name}</h3>
                  <p className="text-xs text-slate-500">{cust.companyName || 'Commercial Client'}</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{cust.phone}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Credit Limit</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {formatPKR(cust.creditLimit)}
                  </span>
                </div>
              </div>

              {/* Ledger Summary Box */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Billed (کرایہ بلنگ):</span>
                  <span className="font-semibold text-slate-800">{formatPKR(totalFreightBilled)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Advance Received (بیعانہ):</span>
                  <span className="font-semibold text-emerald-600">{formatPKR(totalAdvances)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                  <span className="text-rose-800">Outstanding Balance (بقایا رقم):</span>
                  <span className="text-rose-700">{formatPKR(outstanding)}</span>
                </div>
              </div>

              {/* Customer Statement Preview */}
              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-bold text-slate-600 block">Recent Transactions:</span>
                {cust.bookings.slice(0, 3).map((b) => (
                  <div key={b.id} className="flex justify-between text-[11px] text-slate-600 py-1 border-b border-slate-50">
                    <span>{b.bookingNumber} ({b.biltyNumber || 'No Bilty'})</span>
                    <span className="font-medium text-slate-800">{formatPKR(b.freightAmount)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
