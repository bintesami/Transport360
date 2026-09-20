'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Navigation,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Users,
  DollarSign,
  Receipt,
  Plus,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Calendar,
} from 'lucide-react';

interface TripDetailClientProps {
  initialTrip: any;
}

const TIMELINE_STEPS = [
  { id: 'BOOKED', label: 'Booked', labelUrdu: 'بکنگ' },
  { id: 'LOADING', label: 'Loading', labelUrdu: 'لوڈنگ' },
  { id: 'LOADED', label: 'Loaded', labelUrdu: 'مکمل لوڈ' },
  { id: 'IN_TRANSIT', label: 'In Transit', labelUrdu: 'روٹ پر' },
  { id: 'ARRIVED', label: 'Arrived', labelUrdu: 'پہنچ گیا' },
  { id: 'UNLOADING', label: 'Unloading', labelUrdu: 'ان لوڈنگ' },
  { id: 'BILTY_CLEARANCE', label: 'Bilty Clearance', labelUrdu: 'بلٹی کلیرنس' },
  { id: 'PAYMENT_RECEIVED', label: 'Payment Received', labelUrdu: 'ادائیگی وصول' },
  { id: 'CLOSED', label: 'Trip Closed', labelUrdu: 'ٹرپ مکمل' },
];

export default function TripDetailClient({ initialTrip }: TripDetailClientProps) {
  const [trip, setTrip] = useState(initialTrip);
  const [loading, setLoading] = useState(false);
  const [advanceStepLoading, setAdvanceStepLoading] = useState(false);

  // Add Expense State
  const [expenseForm, setExpenseForm] = useState({
    category: 'DIESEL',
    amount: '',
    paidThrough: 'CASH',
    receiptNumber: '',
    remarks: '',
  });

  const categories = [
    { id: 'DIESEL', label: 'Diesel (ڈیزل)' },
    { id: 'TOLL', label: 'Toll Tax (موٹروے ٹول)' },
    { id: 'LOADING', label: 'Loading (لوڈنگ)' },
    { id: 'UNLOADING', label: 'Unloading (ان لوڈنگ)' },
    { id: 'DRIVER', label: 'Driver Allowance (ڈرائیور)' },
    { id: 'CONDUCTOR', label: 'Conductor Allowance (کنڈکٹر)' },
    { id: 'AGENT', label: 'Agent Commission (ایجنٹ)' },
    { id: 'OTHER', label: 'Other / Misc (متفرق)' },
  ];

  // Current step index
  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.id === trip.status);

  // Calculate live financial summary
  const totalExpenses = trip.expenses.reduce((s: number, e: any) => s + e.amount, 0);
  const netProfit = trip.freightRevenue - totalExpenses;
  const profitMargin = trip.freightRevenue > 0 ? ((netProfit / trip.freightRevenue) * 100).toFixed(1) : 0;

  const handleAdvanceTimeline = () => {
    if (currentStepIndex >= TIMELINE_STEPS.length - 1) return;
    const nextStep = TIMELINE_STEPS[currentStepIndex + 1];

    setTrip({
      ...trip,
      status: nextStep.id,
      timelineEvents: [
        ...trip.timelineEvents,
        {
          id: `tl-${Date.now()}`,
          status: nextStep.id,
          location: 'Enroute Terminal',
          remarks: `Moved to ${nextStep.label}`,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amt = Number(expenseForm.amount);
    const newExpense = {
      id: `exp-${Date.now()}`,
      category: expenseForm.category,
      amount: amt,
      paidThrough: expenseForm.paidThrough,
      receiptNumber: expenseForm.receiptNumber,
      remarks: expenseForm.remarks,
    };

    setTrip({
      ...trip,
      expenses: [newExpense, ...trip.expenses],
      totalExpenses: trip.totalExpenses + amt,
      netProfit: trip.freightRevenue - (trip.totalExpenses + amt),
    });

    setExpenseForm({
      category: 'DIESEL',
      amount: '',
      paidThrough: 'CASH',
      receiptNumber: '',
      remarks: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/operations/trips"
            className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{trip.tripNumber}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-sky-100 text-sky-800 border border-sky-200">
                {trip.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer: <span className="font-semibold text-slate-700">{trip.booking?.customer?.name}</span> •
              Route: {trip.booking?.pickupLocation} ➔ {trip.booking?.destination} • Bilty:{' '}
              <span className="font-mono font-semibold text-indigo-600">{trip.booking?.biltyNumber}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentStepIndex < TIMELINE_STEPS.length - 1 && (
            <button
              onClick={handleAdvanceTimeline}
              disabled={advanceStepLoading}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              <span>{advanceStepLoading ? 'Updating...' : `Advance to: ${TIMELINE_STEPS[currentStepIndex + 1]?.label}`}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 8. VISUAL TRIP TIMELINE (STEPPER) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Trip Progress Timeline (ویژول ٹائم لائن)</span>
          </h2>
          <span className="text-xs text-slate-400">Step {currentStepIndex + 1} of {TIMELINE_STEPS.length}</span>
        </div>

        {/* Stepper Flow */}
        <div className="relative flex items-center justify-between overflow-x-auto py-4 px-2">
          {/* Connecting Track Line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
          <div
            className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
            style={{
              width: `${(Math.max(0, currentStepIndex) / (TIMELINE_STEPS.length - 1)) * 90}%`,
            }}
          />

          {TIMELINE_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center min-w-[72px] text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100 shadow-md shadow-sky-500/30 animate-pulse'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 ${
                    isCurrent ? 'text-sky-700 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[9px] text-slate-400 font-urdu">{step.labelUrdu}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 9. TRIP EXPENSES & PROFITABILITY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Summary Card */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Trip Result (مالی نتیجہ)</span>
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              Margin: {profitMargin}%
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Revenue */}
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 flex justify-between items-center">
              <div>
                <span className="text-slate-500 font-medium">Freight Revenue (کرایہ)</span>
                <p className="text-lg font-bold text-emerald-700">Rs. {trip.freightRevenue.toLocaleString()}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>

            {/* Total Expense */}
            <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-100 flex justify-between items-center">
              <div>
                <span className="text-slate-500 font-medium">Total Expenses (کل اخراجات)</span>
                <p className="text-lg font-bold text-rose-700">Rs. {totalExpenses.toLocaleString()}</p>
              </div>
              <Receipt className="w-5 h-5 text-rose-600" />
            </div>

            {/* Net Profit */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center shadow-md">
              <div>
                <span className="text-slate-400 text-[11px] font-medium">Trip Profit (خالص منافع)</span>
                <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  Rs. {netProfit.toLocaleString()}
                </p>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <span>Vehicle: {trip.vehicle.regNumber}</span>
                <p>Driver: {trip.driver.name}</p>
              </div>
            </div>
          </div>

          {/* Quick Add Trip Expense Form */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs">+ Add Trip Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Expense Category:</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Amount (Rs.):</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-rose-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Paid Through:</label>
                  <select
                    value={expenseForm.paidThrough}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paidThrough: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK">Bank</option>
                    <option value="CREDIT">Credit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Remarks:</label>
                <input
                  type="text"
                  placeholder="e.g. Crane loading or PSO diesel"
                  value={expenseForm.remarks}
                  onChange={(e) => setExpenseForm({ ...expenseForm, remarks: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{loading ? 'Adding...' : 'Add Expense to Trip'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Expenses Breakdown Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm">Trip Expense Breakdown (اخراجات کی تفصیل)</h2>
            <span className="text-xs text-slate-500 font-mono">{trip.expenses.length} Entries</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Category (قسم)</th>
                  <th className="px-4 py-2.5">Paid Through</th>
                  <th className="px-4 py-2.5 text-right">Amount (رقم)</th>
                  <th className="px-4 py-2.5">Remarks / Vendor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trip.expenses.map((exp: any) => (
                  <tr key={exp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-slate-600">{exp.paidThrough}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-rose-600 whitespace-nowrap">
                      Rs. {exp.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {exp.remarks || exp.vendor?.name || 'Enroute Expense'}
                    </td>
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
