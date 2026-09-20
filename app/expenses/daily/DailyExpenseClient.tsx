'use client';

import React, { useState } from 'react';
import { Plus, Receipt, DollarSign, CheckCircle2, ArrowRight, ShieldCheck, Calendar, MapPin, Tag, Truck, Users } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

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
  const { isUrdu } = useLanguage();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mobile view mode toggle: 'form' or 'list'
  const [activeMobileTab, setActiveMobileTab] = useState<'form' | 'list'>('form');

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vehicleId: initialVehicles[0]?.id || '',
    driverId: initialDrivers[0]?.id || '',
    tripId: initialTrips[0]?.id || '',
    expenseHead: isUrdu ? 'کھانا و چائے (Dinner / Meal)' : 'Dinner Expense',
    subHead: '',
    amount: '',
    paidFrom: 'CASH',
    location: 'Lahore',
    receiptNumber: '',
    remarks: '',
  });

  const expenseHeads = [
    { ur: 'کھانا و چائے (Dinner / Meal)', en: 'Dinner / Meal Expense' },
    { ur: 'موٹروے ٹول ٹیکس (Toll Tax)', en: 'Toll Tax' },
    { ur: 'پولیس و روٹ متفرق (Police / Enroute)', en: 'Police / Enroute Misc' },
    { ur: 'ٹائر پنکچر و ہوا (Tyre Air/Puncture)', en: 'Tyre Air / Puncture' },
    { ur: 'لوڈنگ لیبر (Loading Labour)', en: 'Loading Labour' },
    { ur: 'ان لوڈنگ لیبر (Unloading Labour)', en: 'Unloading Labour' },
    { ur: 'کنڈا پرچی (Weight Bridge)', en: 'Weight Bridge Slip' },
    { ur: 'دفتر و انتظامی خرچ (Office Admin)', en: 'Office Expense' },
    { ur: 'متفرق اخراجات (Miscellaneous)', en: 'Miscellaneous Expense' },
  ];

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      alert(isUrdu ? 'براہ کرم درست رقم درج کریں' : 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    setSuccessMessage(null);

    const newExpense = {
      id: `exp-${Date.now()}`,
      date: formData.date,
      expenseHead: formData.expenseHead,
      subHead: formData.subHead,
      amount: Number(formData.amount),
      paidFrom: formData.paidFrom,
      location: formData.location,
      receiptNumber: formData.receiptNumber,
      remarks: formData.remarks,
      vehicle: initialVehicles.find((v) => v.id === formData.vehicleId),
      driver: initialDrivers.find((d) => d.id === formData.driverId),
    };

    setSuccessMessage(
      isUrdu
        ? `اکاؤنٹنگ انٹری درج ہو گئی: ${formData.expenseHead} Dr. Rs. ${Number(formData.amount).toLocaleString()} | ${formData.paidFrom} Cr. Rs. ${Number(formData.amount).toLocaleString()}`
        : `Accounting Entry Posted: ${formData.expenseHead} Dr. Rs. ${Number(formData.amount).toLocaleString()} | ${formData.paidFrom} Cr. Rs. ${Number(formData.amount).toLocaleString()}`
    );

    setExpenses([newExpense, ...expenses]);
    setFormData({
      ...formData,
      amount: '',
      receiptNumber: '',
      remarks: '',
    });
    setLoading(false);
  };

  const formatPKR = (num: number) =>
    new Intl.NumberFormat(isUrdu ? 'ur-PK' : 'en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(num)
      .replace('PKR', 'Rs.');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <Receipt className="w-7 h-7 text-rose-600" strokeWidth={2.5} />
            <span>{isUrdu ? 'روزانہ کے اخراجات کا اندراج' : 'Daily Expense Entry'}</span>
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 mt-0.5">
            {isUrdu
              ? 'موبائل اور لیپ ٹاپ دونوں کے لیے فوری اور آسان خرچ کا اندراج مع خودکار ڈبل انٹری'
              : 'Fast, touch-friendly mobile expense logging with automated Double-Entry journal posting'}
          </p>
        </div>

        {/* Mobile Segmented Toggle (Visible only on mobile screens) */}
        <div className="flex lg:hidden bg-slate-200/80 p-1 rounded-xl w-full">
          <button
            onClick={() => setActiveMobileTab('form')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeMobileTab === 'form'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>{isUrdu ? 'نیا خرچ درج کریں' : '+ Add Expense'}</span>
          </button>
          <button
            onClick={() => setActiveMobileTab('list')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeMobileTab === 'list'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" strokeWidth={2.5} />
            <span>{isUrdu ? `حالیہ اخراجات (${expenses.length})` : `History (${expenses.length})`}</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs md:text-sm font-bold shadow-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
          <div className="flex-1">
            <p className="font-extrabold">{isUrdu ? 'انٹری کامیابی سے محفوظ اور پوسٹ ہو گئی!' : 'Entry Saved & Posted to General Ledger!'}</p>
            <p className="text-xs font-mono text-emerald-700 mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: + Add Expense (Prominently displayed on desktop or when active on mobile) */}
        <div
          className={`lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4 ${
            activeMobileTab === 'form' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h2 className="font-extrabold text-slate-900 text-base md:text-lg">
              {isUrdu ? 'نیا خرچ شامل کریں' : '+ Add Expense'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {/* Amount Field (BIG & BOLD FOR MOBILE TOUCH) */}
            <div>
              <label className="block text-slate-800 font-extrabold mb-1 text-sm md:text-base">
                {isUrdu ? 'خرچ کی رقم:' : 'Expense Amount:'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-600 font-extrabold text-base">
                  Rs.
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="500"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-12 pr-4 h-13 bg-rose-50/40 border-2 border-rose-300 rounded-xl text-xl font-black text-rose-700 focus:bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-200 outline-none transition-all font-mono"
                  dir="ltr"
                  required
                />
              </div>

              {/* Quick Amount Buttons for 1-Tap entry on mobile */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: amt.toString() })}
                    className="px-3 py-1.5 text-xs font-black rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 border border-slate-200 transition-colors whitespace-nowrap active:scale-95"
                  >
                    +{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Expense Head */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {isUrdu ? 'خرچ کی مد:' : 'Expense Category:'}
              </label>
              <select
                value={formData.expenseHead}
                onChange={(e) => setFormData({ ...formData, expenseHead: e.target.value })}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
              >
                {expenseHeads.map((h, i) => (
                  <option key={i} value={isUrdu ? h.ur : h.en}>
                    {isUrdu ? h.ur : h.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle & Driver */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isUrdu ? 'گاڑی نمبر:' : 'Vehicle:'}
                </label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:bg-white"
                >
                  <option value="">{isUrdu ? 'عام خرچ / کوئی گاڑی نہیں' : 'General / None'}</option>
                  {initialVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.regNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isUrdu ? 'ڈرائیور کا نام:' : 'Driver:'}
                </label>
                <select
                  value={formData.driverId}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:bg-white"
                >
                  <option value="">{isUrdu ? 'کوئی نہیں' : 'None'}</option>
                  {initialDrivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isUrdu ? 'تاریخ:' : 'Date:'}
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isUrdu ? 'ادائیگی بذریعہ:' : 'Paid From:'}
                </label>
                <select
                  value={formData.paidFrom}
                  onChange={(e) => setFormData({ ...formData, paidFrom: e.target.value })}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                >
                  <option value="CASH">{isUrdu ? 'کیش ان ہینڈ (Cash)' : 'Cash in Hand'}</option>
                  <option value="BANK">{isUrdu ? 'بینک اکاؤنٹ (Bank)' : 'Bank Account'}</option>
                </select>
              </div>
            </div>

            {/* Location & Receipt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isUrdu ? 'مقام یا اسٹیشن:' : 'Location:'}
                </label>
                <input
                  type="text"
                  placeholder={isUrdu ? 'مثلاً لاہور / سکھر' : 'e.g. Lahore / Sukkur'}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isUrdu ? 'رسید نمبر:' : 'Receipt No:'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. REC-102"
                  value={formData.receiptNumber}
                  onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {isUrdu ? 'تفصیل و ریمارکس:' : 'Remarks:'}
              </label>
              <textarea
                placeholder={isUrdu ? 'ڈرائیور کا کھانا یا دیگر متفرق خرچ کی تفصیل...' : 'Dinner for Driver & Conductor enroute...'}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white h-20"
              />
            </div>


            {/* Live Accounting Entry Preview */}
            <div className="p-3.5 bg-slate-950 text-white rounded-xl space-y-1.5 font-mono text-xs shadow-inner">
              <p className="text-slate-400 font-sans text-[11px] font-bold">
                {isUrdu ? 'خودکار اکاؤنٹنگ انٹری (Double Entry):' : 'AUTOMATED ACCOUNTING ENTRY:'}
              </p>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>{formData.expenseHead || 'Expense'} Dr.</span>
                <span>Rs. {Number(formData.amount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sky-400 font-bold pl-4">
                <span>{formData.paidFrom === 'BANK' ? 'Bank Account' : 'Cash in Hand'} Cr.</span>
                <span>Rs. {Number(formData.amount || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Big Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-base md:text-lg font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <Receipt className="w-5 h-5" strokeWidth={2.5} />
              <span>
                {loading
                  ? (isUrdu ? 'پوسٹ ہو رہا ہے...' : 'Posting Entry...')
                  : (isUrdu ? 'خرچ محفوظ کریں اور پوسٹ کریں' : 'Save & Post Entry')}
              </span>
            </button>
          </form>
        </div>

        {/* Expenses List / Table (Visible on desktop or when active on mobile) */}
        <div
          className={`lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${
            activeMobileTab === 'list' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h2 className="font-extrabold text-slate-900 text-base md:text-lg">
              {isUrdu ? 'حالیہ روزانہ اخراجات کی تفصیل' : 'Recent Daily Expenses'}
            </h2>
            <span className="text-xs md:text-sm font-bold bg-slate-200 text-slate-800 px-3 py-1 rounded-full font-mono">
              {expenses.length} Records
            </span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200 text-xs md:text-sm">
                <tr>
                  <th className="px-4 py-3.5">{isUrdu ? 'تاریخ' : 'Date'}</th>
                  <th className="px-4 py-3.5">{isUrdu ? 'گاڑی' : 'Vehicle'}</th>
                  <th className="px-4 py-3.5">{isUrdu ? 'مد (Head)' : 'Head'}</th>
                  <th className="px-4 py-3.5">{isUrdu ? 'مقام' : 'Location'}</th>
                  <th className="px-4 py-3.5">{isUrdu ? 'ادائیگی' : 'Paid From'}</th>
                  <th className="px-4 py-3.5 text-right">{isUrdu ? 'رقم (PKR)' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {expenses.map((exp: any) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-slate-900">
                      {exp.vehicle?.regNumber || 'General'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 font-bold">{exp.expenseHead}</td>
                    <td className="px-4 py-3.5 text-slate-600">{exp.location || '-'}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-slate-100 text-slate-700">
                        {exp.paidFrom}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-black text-rose-600 text-base whitespace-nowrap">
                      Rs. {exp.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (Clean touch-friendly cards for phone screens) */}
          <div className="sm:hidden divide-y divide-slate-100">
            {expenses.map((exp: any) => (
              <div key={exp.id} className="p-4 space-y-2 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-base">{exp.expenseHead}</span>
                  <span className="font-black text-rose-600 text-lg">Rs. {exp.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{exp.vehicle?.regNumber || 'General Vehicle'}</span>
                  <span>{new Date(exp.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">{exp.location || 'Terminal'}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold font-mono">
                    {exp.paidFrom}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
