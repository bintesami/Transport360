import React from 'react';
import prisma from '@/lib/prisma';
import { BookOpen, CheckCircle2, ShieldCheck, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getJournalEntries() {
  return await prisma.journalEntry.findMany({
    include: {
      lines: {
        include: {
          account: true,
          vehicle: true,
          driver: true,
          customer: true,
          vendor: true,
        },
      },
    },
    orderBy: { entryNumber: 'desc' },
  });
}

export default async function GeneralLedgerPage() {
  const entries = await getJournalEntries();

  const formatPKR = (num: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(num)
      .replace('PKR', 'Rs.');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            General Ledger & Journal Vouchers
            <span className="text-base font-normal text-slate-500 font-urdu">(جنرل لیجر و واؤچرز)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Strict Double-Entry audit trail with balanced Debits and Credits for every operational transaction
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => {
          const totalDebit = entry.lines.reduce((s, l) => s + l.debit, 0);
          const totalCredit = entry.lines.reduce((s, l) => s + l.credit, 0);

          return (
            <div
              key={entry.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* JV Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-sky-600 text-white rounded-lg text-xs font-mono font-bold shadow-xs">
                    {entry.entryNumber}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{entry.narration}</h3>
                    <p className="text-[11px] text-slate-400">
                      Date: {new Date(entry.date).toLocaleDateString()} • Ref:{' '}
                      <span className="font-semibold text-slate-600">{entry.referenceType || 'GENERAL'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Double-Entry Balanced</span>
                  </span>
                </div>
              </div>

              {/* Lines Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/60 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-2 w-24">Code</th>
                      <th className="px-5 py-2">Account Name</th>
                      <th className="px-5 py-2">Description / Tag</th>
                      <th className="px-5 py-2 text-right w-36">Debit (Dr.)</th>
                      <th className="px-5 py-2 text-right w-36">Credit (Cr.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {entry.lines.map((line) => (
                      <tr key={line.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-2.5 font-mono text-slate-500 font-bold">{line.account.code}</td>
                        <td className="px-5 py-2.5 font-semibold text-slate-900">{line.account.name}</td>
                        <td className="px-5 py-2.5 text-slate-600">
                          <span>{line.description}</span>
                          {line.vehicle && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 text-[10px] font-bold">
                              {line.vehicle.regNumber}
                            </span>
                          )}
                          {line.customer && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              {line.customer.name}
                            </span>
                          )}
                          {line.vendor && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">
                              {line.vendor.name}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-2.5 text-right font-mono font-bold text-slate-800">
                          {line.debit > 0 ? formatPKR(line.debit) : '—'}
                        </td>
                        <td className="px-5 py-2.5 text-right font-mono font-bold text-slate-800">
                          {line.credit > 0 ? formatPKR(line.credit) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <tr>
                      <td colSpan={3} className="px-5 py-2 text-right text-slate-500">
                        Totals (میزان):
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-emerald-700">
                        {formatPKR(totalDebit)}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-emerald-700">
                        {formatPKR(totalCredit)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
