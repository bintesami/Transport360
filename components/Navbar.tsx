'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Fuel,
  Wrench,
  Search,
  Calendar,
  Languages,
  Menu,
  Plus,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
}

export default function Navbar({ onToggleMobileSidebar }: NavbarProps) {
  const { language, setLanguage, t, isUrdu } = useLanguage();
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format Live Time (HH:MM:SS AM/PM)
      setTime(
        now.toLocaleTimeString(isUrdu ? 'ur-PK' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      // Format Date
      setDateStr(
        now.toLocaleDateString(isUrdu ? 'ur-PK' : 'en-PK', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isUrdu]);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Row: Brand / Hamburger, Live Clock, Language Switcher */}
      <div className="px-3 md:px-6 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-xl md:hidden transition-colors border border-slate-200"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" strokeWidth={2.5} />
            </button>
          )}

          {/* BRAND TITLE (Mobile visible) */}
          <Link href="/" className="md:hidden flex items-center gap-1 font-black text-slate-900 text-lg">
            <span>Transport</span><span className="text-sky-600">360</span>
          </Link>
        </div>

        {/* ⏰ LIVE REAL-TIME CLOCK (PROMINENT ON BOTH MOBILE & LAPTOP) */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <Clock className="w-4 h-4 text-sky-600 flex-shrink-0" strokeWidth={2.5} />
          <div className="flex items-center gap-1.5">
            <span className="text-xs md:text-sm font-black font-mono text-slate-900 tracking-tight" dir="ltr">
              {time || 'Loading...'}
            </span>
            <span className="hidden sm:inline-block text-[11px] font-bold text-slate-500 border-l border-slate-300 pl-2">
              {dateStr}
            </span>
          </div>
        </div>

        {/* Language Switcher Button */}
        <button
          onClick={() => setLanguage(language === 'ur' ? 'en' : 'ur')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-extrabold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm whitespace-nowrap active:scale-95"
          title="Switch Language"
        >
          <Languages className="w-4 h-4 text-white" strokeWidth={2.5} />
          <span>{language === 'ur' ? 'English' : 'اردو'}</span>
        </button>
      </div>

      {/* Quick Action Shortcuts (Scrollable bar on mobile, integrated on desktop) */}
      <div className="px-3 md:px-6 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <Link
          href="/expenses/daily"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-all whitespace-nowrap shadow-xs active:scale-95 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>{t('addExpense')}</span>
        </Link>

        <Link
          href="/operations/bookings"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all whitespace-nowrap shadow-xs active:scale-95 flex-shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>{t('newBooking')}</span>
        </Link>

        <Link
          href="/fleet/fuel"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl bg-sky-600 text-white hover:bg-sky-700 transition-all whitespace-nowrap shadow-xs active:scale-95 flex-shrink-0"
        >
          <Fuel className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>{t('fuelLog')}</span>
        </Link>

        <Link
          href="/fleet/maintenance"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-all whitespace-nowrap shadow-xs active:scale-95 flex-shrink-0"
        >
          <Wrench className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>{t('repair')}</span>
        </Link>
      </div>
    </header>
  );
}

