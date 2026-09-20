'use client';

import React from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Fuel,
  Wrench,
  Search,
  Bell,
  Calendar,
  DollarSign,
  Truck,
  Plus,
} from 'lucide-react';

export default function Navbar() {
  const currentDate = new Date().toLocaleDateString('en-PK', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Search & Breadcrumb info */}
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Vehicle (e.g. LHR-786), Bilty, Customer, Driver..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/expenses/daily"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-rose-600" />
          <span>+ Add Expense</span>
          <span className="text-[10px] font-urdu opacity-80">(روزانہ خرچ)</span>
        </Link>

        <Link
          href="/fleet/fuel"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors shadow-xs"
        >
          <Fuel className="w-3.5 h-3.5 text-sky-600" />
          <span>+ Fuel Log</span>
          <span className="text-[10px] font-urdu opacity-80">(ڈیزل)</span>
        </Link>

        <Link
          href="/fleet/maintenance"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors shadow-xs"
        >
          <Wrench className="w-3.5 h-3.5 text-amber-600" />
          <span>+ Repair</span>
          <span className="text-[10px] font-urdu opacity-80">(مرمت)</span>
        </Link>

        <Link
          href="/operations/bookings"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>+ New Booking</span>
          <span className="text-[10px] font-urdu opacity-80">(بکنگ)</span>
        </Link>
      </div>

      {/* Date & System Status */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{currentDate}</span>
        </div>

        <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold shadow">
            HQ
          </div>
          <div className="hidden xl:block">
            <p className="text-xs font-semibold text-slate-800 leading-none">Lahore Terminal</p>
            <p className="text-[10px] text-slate-500">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
