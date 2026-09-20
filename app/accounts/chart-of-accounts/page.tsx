import React from 'react';
import prisma from '@/lib/prisma';
import { Layers, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';


async function getChartOfAccounts() {
  return await prisma.account.findMany({
    orderBy: { code: 'asc' },
  });
}

export default async function ChartOfAccountsPage() {
  const accounts = await getChartOfAccounts();

  const formatPKR = (num: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(num)
      .replace('PKR', 'Rs.');

  const typeCategories = [
    { type: 'ASSET', label: 'Assets (اثاثہ جات)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { type: 'LIABILITY', label: 'Liabilities (واجبات)', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { type: 'EQUITY', label: 'Equity (سرمایہ)', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { type: 'REVENUE', label: 'Income / Revenue (آمدن)', color: 'bg-sky-50 text-sky-800 border-sky-200' },
    { type: 'EXPENSE', label: 'Expenses (اخراجات)', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Chart of Accounts (COA)
            <span className="text-base font-normal text-slate-500 font-urdu">(چارٹ آف اکاؤنٹس)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            The structural backbone of the Transport360 Double-Entry Accounting System
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {typeCategories.map((cat) => {
          const accs = accounts.filter((a) => a.type === cat.type);
          const totalCategoryBalance = accs.reduce((s, a) => s + a.balance, 0);

          return (
            <div key={cat.type} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${cat.color}`}>
                    {cat.type}
                  </span>
                  <h2 className="font-bold text-slate-800 text-sm">{cat.label}</h2>
                </div>
                <div className="text-xs font-bold text-slate-900 font-mono">
                  Total: {formatPKR(totalCategoryBalance)}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-2.5 w-24">Code</th>
                      <th className="px-5 py-2.5">Account Name</th>
                      <th className="px-5 py-2.5">Sub-Category</th>
                      <th className="px-5 py-2.5 text-right">Current Balance</th>
                      <th className="px-5 py-2.5 text-center w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accs.map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3 font-mono font-bold text-sky-700">{acc.code}</td>
                        <td className="px-5 py-3 font-semibold text-slate-900">{acc.name}</td>
                        <td className="px-5 py-3 text-slate-500 font-mono text-[11px]">{acc.subType || '-'}</td>
                        <td className="px-5 py-3 text-right font-mono font-bold text-slate-800">
                          {formatPKR(acc.balance)}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
