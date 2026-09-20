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
  Languages,
  Menu,
  Plus,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
}

export default function Navbar({ onToggleMobileSidebar }: NavbarProps) {
  const { language, setLanguage, t, isUrdu } = useLanguage();

  const currentDate = new Date().toLocaleDateString(isUrdu ? 'ur-PK' : 'en-PK', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Mobile Menu & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-6 h-6" strokeWidth={2.5} />
          </button>
        )}

        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2.5} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-4 py-1.5 text-xs md:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Quick Action Shortcuts (Scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        <Link
          href="/expenses/daily"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all whitespace-nowrap shadow-2xs"
        >
          <Plus className="w-4 h-4 text-rose-600" strokeWidth={2.5} />
          <span>{t('addExpense')}</span>
        </Link>

        <Link
          href="/fleet/fuel"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-bold rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-all whitespace-nowrap shadow-2xs"
        >
          <Fuel className="w-4 h-4 text-sky-600" strokeWidth={2.5} />
          <span>{t('fuelLog')}</span>
        </Link>

        <Link
          href="/fleet/maintenance"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all whitespace-nowrap shadow-2xs"
        >
          <Wrench className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
          <span>{t('repair')}</span>
        </Link>

        <Link
          href="/operations/bookings"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all whitespace-nowrap shadow-2xs"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
          <span>{t('newBooking')}</span>
        </Link>
      </div>

      {/* Language Switcher & Date */}
      <div className="flex items-center gap-3 pl-2">
        {/* Language Toggle Button */}
        <button
          onClick={() => setLanguage(language === 'ur' ? 'en' : 'ur')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-extrabold rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs"
          title="Switch Language"
        >
          <Languages className="w-4 h-4 text-indigo-600" strokeWidth={2.5} />
          <span>{language === 'ur' ? 'English' : 'اردو'}</span>
        </button>

        <div className="hidden xl:flex items-center gap-2 text-xs md:text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-4 h-4 text-slate-600" strokeWidth={2.5} />
          <span>{currentDate}</span>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-md">
            HQ
          </div>
        </div>
      </div>
    </header>
  );
}
