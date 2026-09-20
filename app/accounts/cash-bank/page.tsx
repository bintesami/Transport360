import React from 'react';
import prisma from '@/lib/prisma';
import { Wallet, Building2, ArrowDownLeft, ArrowUpRight, DollarSign, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCashBankData() {
  const cashAccount = await prisma.account.findUnique({
    where: { code: '1001' },
    include: {
      journalLines: {
        include: { journalEntry: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  const bankAccountHBL = await prisma.account.findUnique({
    where: { code: '1002' },
    include: {
      journalLines: {
        include: { journalEntry: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  const bankAccountMeezan = await prisma.account.findUnique({
    where: { code: '1003' },
    include: {
      journalLines: {
        include: { journalEntry: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return { cashAccount, bankAccountHBL, bankAccountMeezan };
}

export default async function CashBankPage() {
  const { cashAccount, bankAccountHBL, bankAccountMeezan } = await getCashBankData();

  const formatPKR = (num: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(num)
      .replace('PKR', 'Rs.');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Cash & Bank Books
            <span className="text-base font-normal text-slate-500 font-urdu">(روکڑ و بینک کھاتہ)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Cash Book, Bank Ledger balances, incoming collections, and outgoing disbursements
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cash in Hand */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Cash in Hand</h3>
                <span className="text-[10px] text-slate-400 font-mono">Code: 1001</span>
              </div>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">{formatPKR(cashAccount?.balance || 0)}</p>
          <span className="text-[11px] text-slate-500">Petty Cash & Enroute Float</span>
        </div>

        {/* HBL Bank */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">HBL Main Operating</h3>
                <span className="text-[10px] text-slate-400 font-mono">Code: 1002</span>
              </div>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">{formatPKR(bankAccountHBL?.balance || 0)}</p>
          <span className="text-[11px] text-slate-500">Main Commercial Clearing Account</span>
        </div>

        {/* Meezan Bank */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Meezan Islamic Bank</h3>
                <span className="text-[10px] text-slate-400 font-mono">Code: 1003</span>
              </div>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">{formatPKR(bankAccountMeezan?.balance || 0)}</p>
          <span className="text-[11px] text-slate-500">Islamic Fleet Reserve Account</span>
        </div>
      </div>

      {/* Cash Book Transaction Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Wallet className="w-4 h-4 text-amber-600" />
            <span>Cash Book Entries (روکڑ بہی)</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">{cashAccount?.journalLines.length || 0} Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">JV Number</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Description / Narration</th>
                <th className="px-5 py-3 text-right">Cash Received (Dr.)</th>
                <th className="px-5 py-3 text-right">Cash Paid (Cr.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cashAccount?.journalLines.map((line) => (
                <tr key={line.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-sky-700">
                    {line.journalEntry.entryNumber}
                  </td>
                  <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                    {new Date(line.journalEntry.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-slate-800">
                    <p className="font-medium">{line.journalEntry.narration}</p>
                    <p className="text-[10px] text-slate-400">{line.description}</p>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-emerald-600 whitespace-nowrap">
                    {line.debit > 0 ? formatPKR(line.debit) : '—'}
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-rose-600 whitespace-nowrap">
                    {line.credit > 0 ? formatPKR(line.credit) : '—'}
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
