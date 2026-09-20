'use client';

import React, { useState } from 'react';
import { Plus, Receipt, DollarSign, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface DailyExpenseClientProps {
  initialVehicles: any[];
  initialDrivers: any[];
  initialTrips: any[];
  initialExpenses: any[];
}

export default function DailyExpenseClient({
  initialVehicles,
  initialDrivers,
  initialTrips,
  initialExpenses,
}: DailyExpenseClientProps) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vehicleId: initialVehicles[0]?.id || '',
    driverId: initialDrivers[0]?.id || '',
    tripId: initialTrips[0]?.id || '',
    expenseHead: 'Dinner Expense',
    subHead: '',
    amount: '',
    paidFrom: 'CASH',
    location: 'Lahore',
    receiptNumber: '',
    remarks: '',
  });

  const expenseHeads = [
    'Dinner Expense',
    'Lunch / Tea Expense',
    'Toll Tax (موٹروے ٹول)',
    'Police / Enroute Misc',
    'Tyre Puncture / Air',
    'Loading Labour (مزدوری)',
    'Unloading Labour',
    'Weight Bridge (کنڈا پرچی)',
    'Office Expense',
    'Miscellaneous Expense',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/expenses/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save expense');

      setSuccessMessage(
        `Accounting Entry Posted: ${formData.expenseHead} Dr. Rs. ${Number(formData.amount).toLocaleString()} | ${formData.paidFrom} Cr. Rs. ${Number(formData.amount).toLocaleString()}`
      );

      // Refresh list
      setExpenses([data.dailyExpense, ...expenses]);
      setFormData({
        ...formData,
        amount: '',
        receiptNumber: '',
        remarks: '',
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Daily Expense Entry
            <span className="text-base font-normal text-slate-500 font-urdu">(روزانہ کے اخراجات)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quick expense logger with automatic real-time Double-Entry Journal Voucher (Dr. / Cr.) creation
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-semibold shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold">Entry Saved & Posted to General Ledger!</p>
            <p className="text-[11px] font-mono text-emerald-700">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: + Add Expense */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Plus className="w-4 h-4 text-sky-600" />
            <h2 className="font-bold text-slate-800 text-sm">+ Add Expense (نیا خرچ شامل کریں)</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Date (تاریخ):</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Vehicle (گاڑی):</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                >
                  <option value="">None / General</option>
                  {initialVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.regNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Driver (ڈرائیور):</label>
                <select
                  value={formData.driverId}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                >
                  <option value="">None</option>
                  {initialDrivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Trip (ٹرپ - اگر ہو):</label>
              <select
                value={formData.tripId}
                onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
              >
                <option value="">None / Out of Trip</option>
                {initialTrips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tripNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Expense Head (مد):</label>
                <select
                  value={formData.expenseHead}
                  onChange={(e) => setFormData({ ...formData, expenseHead: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                >
                  {expenseHeads.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Sub Head:</label>
                <input
                  type="text"
                  placeholder="e.g. Enroute Meal"
                  value={formData.subHead}
                  onChange={(e) => setFormData({ ...formData, subHead: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Amount (رقم - PKR):</label>
                <input
                  type="number"
                  placeholder="500"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-rose-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Paid From (ادائیگی):</label>
                <select
                  value={formData.paidFrom}
                  onChange={(e) => setFormData({ ...formData, paidFrom: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white"
                >
                  <option value="CASH">Cash in Hand (کیش)</option>
                  <option value="BANK">Bank Account (بینک)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Location (مقام):</label>
                <input
                  type="text"
                  placeholder="e.g. Karachi / Sukkur"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Receipt No (رسید):</label>
                <input
                  type="text"
                  placeholder="e.g. REC-102"
                  value={formData.receiptNumber}
                  onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Remarks (تفصیل):</label>
              <textarea
                placeholder="Dinner for Driver & Conductor enroute"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white h-16"
              />
            </div>

            {/* Live Accounting Entry Preview */}
            <div className="p-3 bg-slate-900 text-slate-100 rounded-lg space-y-1 font-mono text-[11px]">
              <p className="text-slate-400 font-sans text-[10px] font-semibold">AUTOMATED ACCOUNTING ENTRY:</p>
              <div className="flex justify-between text-emerald-400">
                <span>{formData.expenseHead || 'Expense'} Dr.</span>
                <span>Rs. {Number(formData.amount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sky-400 pl-4">
                <span>{formData.paidFrom === 'BANK' ? 'Bank Account' : 'Cash in Hand'} Cr.</span>
                <span>Rs. {Number(formData.amount || 0).toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Receipt className="w-4 h-4" />
              <span>{loading ? 'Posting Entry...' : 'Save & Post Entry (محفوظ کریں)'}</span>
            </button>
          </form>
        </div>

        {/* Expenses Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm">Recent Daily Expenses (حالیہ روزانہ اخراجات)</h2>
            <span className="text-xs text-slate-500 font-mono">{expenses.length} Records</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Vehicle</th>
                  <th className="px-4 py-2.5">Head</th>
                  <th className="px-4 py-2.5">Location</th>
                  <th className="px-4 py-2.5">Paid From</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((exp: any) => (
                  <tr key={exp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {exp.vehicle?.regNumber || 'General'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{exp.expenseHead}</td>
                    <td className="px-4 py-3 text-slate-600">{exp.location || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                        {exp.paidFrom}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-rose-600 whitespace-nowrap">
                      Rs. {exp.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{exp.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
