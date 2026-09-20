'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Building2,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
  Navigation,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  Coins,
  Receipt,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export interface DashboardData {
  cashBalance: number;
  bankBalance: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  fleet: {
    total: number;
    available: number;
    onTrip: number;
    underRepair: number;
  };
  trips: {
    running: number;
    completed: number;
    pendingDelivery: number;
    pendingPayment: number;
  };
  alerts: {
    maintenanceDue: number;
    paymentReceivable: number;
    paymentPayable: number;
    driverAdvanceOutstanding: number;
  };
  vehicleProfitability: Array<{
    id: string;
    regNumber: string;
    type: string;
    revenue: number;
    expense: number;
    profit: number;
    revPerKm: number;
    fuelCostPerKm: number;
    maintCostPerKm: number;
  }>;
}

interface DashboardClientProps {
  data: DashboardData;
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const { isUrdu } = useLanguage();

  const formatAmount = (num: number) => {
    const formatted = new Intl.NumberFormat('en-PK').format(num);
    return isUrdu ? `${formatted} روپے` : `Rs ${formatted}`;
  };

  const profitMargin =
    data.totalIncome > 0
      ? ((data.netProfit / data.totalIncome) * 100).toFixed(1)
      : '0.0';

  return (
    <div className={`space-y-8 ${isUrdu ? 'text-right font-urdu' : 'text-left'}`}>
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <span>{isUrdu ? 'ڈیش بورڈ — فلیٹ و فنانشل سمری' : 'Dashboard — Fleet & Financial Summary'}</span>
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 mt-1">
            {isUrdu
              ? 'فلیٹ کے براہِ راست آپریشنز اور ڈبل انٹری اکاؤنٹنگ کی تازہ ترین صورتحال'
              : 'Real-time Fleet Operations & Strict Double-Entry Financial Health'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/expenses/daily"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Receipt className="w-4 h-4" strokeWidth={2.5} />
            <span>{isUrdu ? '+ نیا روزانہ خرچ درج کریں' : '+ Quick Expense Entry'}</span>
          </Link>
          <Link
            href="/operations/bookings"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Truck className="w-4 h-4" strokeWidth={2.5} />
            <span>{isUrdu ? '+ نئی بکنگ شامل کریں' : '+ New Booking'}</span>
          </Link>
        </div>
      </div>

      {/* 1. Five Main Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Income */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-bold text-slate-600">
              {isUrdu ? 'کل آمدن (Income)' : 'Total Income'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight font-mono" dir="ltr">
              {formatAmount(data.totalIncome)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-2 bg-emerald-50/80 px-2.5 py-1 rounded-lg w-fit">
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>{isUrdu ? 'آپریشنل فریٹ ریونیو' : 'Operational Freight'}</span>
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-bold text-slate-600">
              {isUrdu ? 'کل اخراجات (Expense)' : 'Total Expense'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 flex-shrink-0">
              <TrendingDown className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight font-mono" dir="ltr">
              {formatAmount(data.totalExpense)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-rose-700 font-bold mt-2 bg-rose-50/80 px-2.5 py-1 rounded-lg w-fit">
              <ArrowDownRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>{isUrdu ? 'ڈیزل، مرمت و ٹرپس' : 'Fuel, Maintenance & Trips'}</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-gradient-to-br from-sky-50/60 via-white to-white rounded-2xl p-5 border border-sky-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-bold text-sky-900">
              {isUrdu ? 'خالص منافع (Net Profit)' : 'Net Profit'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200 flex-shrink-0">
              <DollarSign className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-3">
            <p
              className={`text-2xl font-black tracking-tight font-mono ${
                data.netProfit >= 0 ? 'text-sky-900' : 'text-rose-600'
              }`}
              dir="ltr"
            >
              {formatAmount(data.netProfit)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-sky-800 font-bold mt-2 bg-sky-100/70 px-2.5 py-1 rounded-lg w-fit">
              <span>{isUrdu ? `منافع مارجن: ${profitMargin}%` : `Margin: ${profitMargin}%`}</span>
            </div>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-bold text-slate-600">
              {isUrdu ? 'کیش بیلنس (روکڑ)' : 'Cash Balance'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 flex-shrink-0">
              <Wallet className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight font-mono" dir="ltr">
              {formatAmount(data.cashBalance)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold mt-2 bg-amber-50/80 px-2.5 py-1 rounded-lg w-fit">
              <span>{isUrdu ? 'دفتر میں کیش (Petty Cash)' : 'Petty Cash In Hand'}</span>
            </div>
          </div>
        </div>

        {/* Bank Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-bold text-slate-600">
              {isUrdu ? 'بینک بیلنس (اکاؤنٹس)' : 'Bank Balance'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0">
              <Building2 className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight font-mono" dir="ltr">
              {formatAmount(data.bankBalance)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-bold mt-2 bg-indigo-50/80 px-2.5 py-1 rounded-lg w-fit">
              <span>{isUrdu ? 'HBL اور میزان اکاؤنٹس' : 'HBL + Meezan Accounts'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Alerts, Trips Pipeline, Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts & Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">
                  {isUrdu ? 'اطلاعات و ضروری الرٹس' : 'Alerts & Actions'}
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold">
                  {isUrdu ? 'فوری توجہ کے متقاضی امور' : 'Critical operational reminders'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-100">
              {isUrdu ? 'اہم انتباہ' : 'Action Required'}
            </span>
          </div>

          <div className="space-y-3">
            {/* Maintenance Due */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 transition-all hover:bg-rose-50">
              <div className="flex items-center gap-2.5 text-rose-900">
                <Wrench className="w-4 h-4 text-rose-600 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-xs md:text-sm font-bold">
                  {isUrdu ? 'مینٹیننس کی ضرورت' : 'Maintenance Due'}
                </span>
              </div>
              <span className="font-mono font-extrabold text-xs md:text-sm text-rose-800 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
                {isUrdu ? `${data.alerts.maintenanceDue} گاڑیاں` : `${data.alerts.maintenanceDue} Vehicles`}
              </span>
            </div>

            {/* Payment Receivable (AR) */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 transition-all hover:bg-emerald-50">
              <div className="flex items-center gap-2.5 text-emerald-900">
                <Coins className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-xs md:text-sm font-bold">
                  {isUrdu ? 'کسٹمر سے واجب الوصول (AR)' : 'Payment Receivable (AR)'}
                </span>
              </div>
              <span className="font-mono font-extrabold text-xs md:text-sm text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs" dir="ltr">
                {formatAmount(data.alerts.paymentReceivable)}
              </span>
            </div>

            {/* Payment Payable (AP) */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 transition-all hover:bg-amber-50">
              <div className="flex items-center gap-2.5 text-amber-900">
                <Building2 className="w-4 h-4 text-amber-600 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-xs md:text-sm font-bold">
                  {isUrdu ? 'وینڈرز کو واجب الادا (AP)' : 'Payment Payable (AP)'}
                </span>
              </div>
              <span className="font-mono font-extrabold text-xs md:text-sm text-amber-800 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs" dir="ltr">
                {formatAmount(data.alerts.paymentPayable)}
              </span>
            </div>

            {/* Driver Advance Out */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 transition-all hover:bg-sky-50">
              <div className="flex items-center gap-2.5 text-sky-900">
                <Wallet className="w-4 h-4 text-sky-600 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-xs md:text-sm font-bold">
                  {isUrdu ? 'ڈرائیورز بقایا پیشگی رقم' : 'Driver Advance Outstanding'}
                </span>
              </div>
              <span className="font-mono font-extrabold text-xs md:text-sm text-sky-800 bg-white px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs" dir="ltr">
                {formatAmount(data.alerts.driverAdvanceOutstanding)}
              </span>
            </div>
          </div>
        </div>

        {/* Trips Pipeline */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Navigation className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">
                  {isUrdu ? 'ٹرپس پائپ لائن' : 'Trips Pipeline'}
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold">
                  {isUrdu ? 'ٹرانزٹ، ڈیلیوری اور کلیئرنس' : 'Live transit and delivery stage'}
                </p>
              </div>
            </div>
            <Link
              href="/operations/trips"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 transition-colors"
            >
              {isUrdu ? 'تمام ٹرپس دیکھیں' : 'Live Monitor'}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Running Trips */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-xs md:text-sm font-bold">{isUrdu ? 'جاری ٹرپس' : 'Running Trips'}</span>
                <Clock className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
              </div>
              <p className="text-3xl font-black text-amber-900 font-mono">{data.trips.running}</p>
              <p className="text-xs text-amber-700 font-bold">{isUrdu ? 'گاڑیاں روٹ پر' : 'Enroute Vehicles'}</p>
            </div>

            {/* Completed Trips */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-xs md:text-sm font-bold">{isUrdu ? 'مکمل شدہ' : 'Completed'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
              </div>
              <p className="text-3xl font-black text-emerald-900 font-mono">{data.trips.completed}</p>
              <p className="text-xs text-emerald-700 font-bold">{isUrdu ? 'کامیاب ڈیلیوری' : 'Delivered & Closed'}</p>
            </div>

            {/* Pending Delivery */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between text-blue-800">
                <span className="text-xs md:text-sm font-bold">{isUrdu ? 'ڈیلیوری باقی' : 'Pending Delivery'}</span>
                <Truck className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
              </div>
              <p className="text-3xl font-black text-blue-900 font-mono">{data.trips.pendingDelivery}</p>
              <p className="text-xs text-blue-700 font-bold">{isUrdu ? 'ان لوڈنگ کے منتظر' : 'Awaiting Unload'}</p>
            </div>

            {/* Pending Payment */}
            <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between text-purple-800">
                <span className="text-xs md:text-sm font-bold">{isUrdu ? 'ادائیگی باقی' : 'Pending Payment'}</span>
                <DollarSign className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              </div>
              <p className="text-3xl font-black text-purple-900 font-mono">{data.trips.pendingPayment}</p>
              <p className="text-xs text-purple-700 font-bold">{isUrdu ? 'بلٹی کلیئرنس' : 'Bilty Clearance'}</p>
            </div>
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Truck className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">
                  {isUrdu ? 'فلیٹ کی صورتحال' : 'Fleet Status'}
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold">
                  {isUrdu ? 'تمام رجسٹرڈ گاڑیوں کا اسٹیٹس' : 'Active vehicle distribution'}
                </p>
              </div>
            </div>
            <span className="text-xs font-black bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200">
              {isUrdu ? `کل گاڑیاں: ${data.fleet.total}` : `Total: ${data.fleet.total}`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Available */}
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3.5 text-center space-y-1.5">
              <p className="text-xs md:text-sm font-extrabold text-emerald-900">{isUrdu ? 'دستیاب' : 'Available'}</p>
              <p className="text-3xl font-black text-emerald-700 font-mono">{data.fleet.available}</p>
              <span className="inline-block text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                {isUrdu ? 'فری' : 'Ready'}
              </span>
            </div>

            {/* On Trip */}
            <div className="bg-sky-50/90 border border-sky-200 rounded-xl p-3.5 text-center space-y-1.5">
              <p className="text-xs md:text-sm font-extrabold text-sky-900">{isUrdu ? 'روٹ پر' : 'On Trip'}</p>
              <p className="text-3xl font-black text-sky-700 font-mono">{data.fleet.onTrip}</p>
              <span className="inline-block text-[11px] font-bold text-sky-800 bg-white px-2 py-0.5 rounded-md border border-sky-200 shadow-2xs">
                {isUrdu ? 'سفر پر' : 'Active'}
              </span>
            </div>

            {/* Under Repair */}
            <div className="bg-rose-50/90 border border-rose-200 rounded-xl p-3.5 text-center space-y-1.5">
              <p className="text-xs md:text-sm font-extrabold text-rose-900">{isUrdu ? 'ورکشاپ' : 'Under Repair'}</p>
              <p className="text-3xl font-black text-rose-700 font-mono">{data.fleet.underRepair}</p>
              <span className="inline-block text-[11px] font-bold text-rose-800 bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs">
                {isUrdu ? 'مرمت' : 'In Shop'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <Link
              href="/fleet/vehicles"
              className="text-xs font-extrabold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1.5 transition-all"
            >
              <span>{isUrdu ? 'تمام گاڑیوں کی تفصیل دیکھیں' : 'View All Fleet Vehicles'}</span>
              {isUrdu ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Master Vehicle Profitability Report (Bottom Table) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70">
          <div>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-sky-600" strokeWidth={2.5} />
              <span>{isUrdu ? 'گاڑی وار منافع و اخراجات کی سمری' : 'Vehicle Profitability Summary'}</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold text-slate-500 mt-0.5">
              {isUrdu
                ? 'ہر گاڑی کا ریونیو، ڈیزل خرچ، مرمت لاگت اور فی کلومیٹر کارکردگی'
                : 'Live operational margins and per-KM fleet efficiency'}
            </p>
          </div>

          <Link
            href="/reports/vehicle-profitability"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-sky-700 font-bold text-xs md:text-sm px-4 py-2 rounded-xl border border-slate-300 shadow-2xs transition-all w-fit"
          >
            <span>{isUrdu ? 'مکمل ماسٹر رپورٹ کھولیں' : 'Open Master Report'}</span>
            {isUrdu ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th className={`px-5 py-3.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
                  {isUrdu ? 'گاڑی نمبر' : 'Vehicle'}
                </th>
                <th className={`px-5 py-3.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
                  {isUrdu ? 'گاڑی کی قسم' : 'Type'}
                </th>
                <th className="px-5 py-3.5 text-right">{isUrdu ? 'آمدن (Revenue)' : 'Revenue'}</th>
                <th className="px-5 py-3.5 text-right">{isUrdu ? 'اخراجات (Expense)' : 'Expense'}</th>
                <th className="px-5 py-3.5 text-right">{isUrdu ? 'خالص منافع' : 'Profit'}</th>
                <th className="px-5 py-3.5 text-right">{isUrdu ? 'آمدن / KM' : 'Rev / KM'}</th>
                <th className="px-5 py-3.5 text-right">{isUrdu ? 'ڈیزل / KM' : 'Fuel / KM'}</th>
                <th className="px-5 py-3.5 text-right">{isUrdu ? 'مینٹیننس / KM' : 'Maint / KM'}</th>
                <th className="px-5 py-3.5 text-center">{isUrdu ? 'ایکشن' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {data.vehicleProfitability.map((vp) => (
                <tr key={vp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className={`px-5 py-4 font-black text-slate-900 ${isUrdu ? 'text-right' : 'text-left'}`}>
                    <span className="font-mono text-sm">{vp.regNumber}</span>
                  </td>
                  <td className={`px-5 py-4 font-semibold text-slate-600 ${isUrdu ? 'text-right' : 'text-left'}`}>
                    {vp.type}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-emerald-700 font-mono" dir="ltr">
                    {formatAmount(vp.revenue)}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-rose-700 font-mono" dir="ltr">
                    {formatAmount(vp.expense)}
                  </td>
                  <td className="px-5 py-4 text-right font-black font-mono">
                    <span
                      className={`px-3 py-1 rounded-lg inline-block border ${
                        vp.profit >= 0
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                      dir="ltr"
                    >
                      {formatAmount(vp.profit)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-slate-700 font-mono font-bold" dir="ltr">
                    Rs {vp.revPerKm.toFixed(1)}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-700 font-mono font-bold" dir="ltr">
                    Rs {vp.fuelCostPerKm.toFixed(1)}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-700 font-mono font-bold" dir="ltr">
                    Rs {vp.maintCostPerKm.toFixed(1)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link
                      href={`/fleet/vehicles/${vp.id}`}
                      className="inline-flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold px-3 py-1 rounded-lg border border-sky-200 transition-colors text-xs"
                    >
                      <span>{isUrdu ? '7 ٹیبز دیکھیں' : 'View 7 Tabs'}</span>
                    </Link>
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
