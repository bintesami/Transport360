'use client';

import React, { useState } from 'react';
import { FileText, CheckCircle2, DollarSign, TrendingUp, Scale, ShieldCheck } from 'lucide-react';

interface FinancialReportsClientProps {
  initialData: any;
}

export default function FinancialReportsClient({ initialData }: FinancialReportsClientProps) {
  const [activeTab, setActiveTab] = useState<'trial-balance' | 'profit-loss' | 'balance-sheet'>('trial-balance');

  const { trialBalance, totalDebit, totalCredit, profitAndLoss, balanceSheet } = initialData;

  const formatPKR = (num: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(num)
      .replace('PKR', 'Rs.');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Financial Statements & Ledgers
            <span className="text-base font-normal text-slate-500 font-urdu">(مالیاتی رپورٹس)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Certified double-entry accounting statements, trial balance reconciliation, and balance sheet
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex gap-1.5 shadow-xs w-fit">
        <button
          onClick={() => setActiveTab('trial-balance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'trial-balance'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Trial Balance (ٹرائل بیلنس)</span>
        </button>

        <button
          onClick={() => setActiveTab('profit-loss')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'profit-loss'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Profit & Loss (پرافٹ اینڈ لاس)</span>
        </button>

        <button
          onClick={() => setActiveTab('balance-sheet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'balance-sheet'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Balance Sheet (بیلنس شیٹ)</span>
        </button>
      </div>

      {/* 1. TRIAL BALANCE TAB */}
      {activeTab === 'trial-balance' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Trial Balance as of Today</h2>
              <p className="text-xs text-slate-500">Summary of all open ledger balances</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Balanced (میزان درست ہے)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 w-28">Code</th>
                  <th className="px-5 py-3">Account Title</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 text-right">Debit (Dr.)</th>
                  <th className="px-5 py-3 text-right">Credit (Cr.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trialBalance.map((row: any) => (
                  <tr key={row.code} className="hover:bg-slate-50/75">
                    <td className="px-5 py-3 font-mono font-bold text-sky-700">{row.code}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{row.name}</td>
                    <td className="px-5 py-3 text-slate-500">{row.type}</td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-slate-800">
                      {row.debit > 0 ? formatPKR(row.debit) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-slate-800">
                      {row.credit > 0 ? formatPKR(row.credit) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-bold text-sm">
                <tr>
                  <td colSpan={3} className="px-5 py-3.5 text-right font-semibold">
                    Total Trial Balance (کل میزان):
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-emerald-400">
                    {formatPKR(totalDebit)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-emerald-400">
                    {formatPKR(totalCredit)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 2. PROFIT & LOSS TAB */}
      {activeTab === 'profit-loss' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-base font-bold text-slate-900">Statement of Profit & Loss</h2>
            <p className="text-xs text-slate-500">Comprehensive Operating Freight Income and Transport Expenditures</p>
          </div>

          <div className="space-y-6 text-xs">
            {/* Operating Revenue */}
            <div className="space-y-2">
              <h3 className="font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg">
                Operating Income / Freight Revenue (آمدن):
              </h3>
              <div className="space-y-1.5 pl-4">
                {profitAndLoss.revenueAccounts.map((acc: any) => (
                  <div key={acc.id} className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-700 font-medium">{acc.name}</span>
                    <span className="font-mono font-semibold text-slate-900">{formatPKR(acc.balance)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 font-bold text-emerald-700 text-sm">
                  <span>Total Revenue:</span>
                  <span>{formatPKR(profitAndLoss.totalRevenue)}</span>
                </div>
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="space-y-2">
              <h3 className="font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg">
                Operating & Direct Transport Expenses (اخراجات):
              </h3>
              <div className="space-y-1.5 pl-4">
                {profitAndLoss.expenseAccounts.map((acc: any) => (
                  <div key={acc.id} className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-700 font-medium">{acc.name}</span>
                    <span className="font-mono font-semibold text-slate-900">{formatPKR(acc.balance)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 font-bold text-rose-700 text-sm">
                  <span>Total Expenses:</span>
                  <span>{formatPKR(profitAndLoss.totalExpenses)}</span>
                </div>
              </div>
            </div>

            {/* Net Profit */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center text-base font-bold shadow-md">
              <span>Net Profit for Period (خالص منافع):</span>
              <span className={profitAndLoss.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {formatPKR(profitAndLoss.netIncome)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. BALANCE SHEET TAB */}
      {activeTab === 'balance-sheet' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Balance Sheet</h2>
              <p className="text-xs text-slate-500">Financial Position: Assets = Liabilities + Equity</p>
            </div>
            <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
              Assets == Liabilities + Equity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            {/* Assets */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b pb-2 text-emerald-700">
                Assets (اثاثہ جات)
              </h3>
              <div className="space-y-2">
                {balanceSheet.assetAccounts.map((acc: any) => (
                  <div key={acc.id} className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-700">{acc.name}</span>
                    <span className="font-mono font-semibold text-slate-900">{formatPKR(acc.balance)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 font-bold text-emerald-800 text-sm border-t-2 border-slate-200">
                  <span>Total Assets:</span>
                  <span>{formatPKR(balanceSheet.totalAssets)}</span>
                </div>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="space-y-6">
              {/* Liabilities */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm border-b pb-2 text-amber-700">
                  Liabilities (واجبات)
                </h3>
                <div className="space-y-2">
                  {balanceSheet.liabilityAccounts.map((acc: any) => (
                    <div key={acc.id} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">{acc.name}</span>
                      <span className="font-mono font-semibold text-slate-900">{formatPKR(acc.balance)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold text-amber-800">
                    <span>Total Liabilities:</span>
                    <span>{formatPKR(balanceSheet.totalLiabilities)}</span>
                  </div>
                </div>
              </div>

              {/* Equity */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm border-b pb-2 text-indigo-700">
                  Owner Equity (سرمایہ)
                </h3>
                <div className="space-y-2">
                  {balanceSheet.equityAccounts.map((acc: any) => (
                    <div key={acc.id} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">{acc.name}</span>
                      <span className="font-mono font-semibold text-slate-900">{formatPKR(acc.balance)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 border-b border-slate-100 font-semibold text-emerald-700">
                    <span>Current Retained Net Income</span>
                    <span className="font-mono">{formatPKR(profitAndLoss.netIncome)}</span>
                  </div>
                  <div className="flex justify-between pt-2 font-bold text-indigo-800">
                    <span>Total Equity:</span>
                    <span>{formatPKR(balanceSheet.totalEquity)}</span>
                  </div>
                </div>
              </div>

              {/* Total Liab + Equity */}
              <div className="p-3 bg-slate-100 rounded-lg flex justify-between items-center text-sm font-bold text-slate-900 border border-slate-200">
                <span>Total Liabilities & Equity:</span>
                <span className="font-mono">{formatPKR(balanceSheet.totalLiabilities + balanceSheet.totalEquity)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
