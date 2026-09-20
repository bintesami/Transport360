'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Truck,
  Users,
  Fuel,
  Wrench,
  CalendarCheck,
  Navigation,
  FileText,
  DollarSign,
  Receipt,
  Wallet,
  Building2,
  BookOpen,
  PieChart,
  BarChart3,
  TrendingUp,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Layers,
  ClipboardList,
} from 'lucide-react';

interface MenuItem {
  title: string;
  titleUrdu: string;
  href?: string;
  icon: React.ReactNode;
  badge?: string;
  subItems?: { title: string; titleUrdu: string; href: string }[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Fleet: true,
    Operations: true,
    Expenses: true,
    Accounts: true,
    Reports: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const menuSections: { section: string; items: MenuItem[] }[] = [
    {
      section: 'Main',
      items: [
        {
          title: 'Dashboard',
          titleUrdu: 'ڈیش بورڈ',
          href: '/',
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
      ],
    },
    {
      section: 'Fleet',
      items: [
        {
          title: 'Fleet Management',
          titleUrdu: 'فلیٹ مینجمنٹ',
          icon: <Truck className="w-5 h-5 text-sky-400" />,
          subItems: [
            { title: 'Vehicles', titleUrdu: 'گاڑیاں', href: '/fleet/vehicles' },
            { title: 'Drivers', titleUrdu: 'ڈرائیورز', href: '/fleet/drivers' },
            { title: 'Fuel Management', titleUrdu: 'فیول مینجمنٹ', href: '/fleet/fuel' },
            { title: 'Repair & Maintenance', titleUrdu: 'مرمت و مینٹیننس', href: '/fleet/maintenance' },
          ],
        },
      ],
    },
    {
      section: 'Operations',
      items: [
        {
          title: 'Operations',
          titleUrdu: 'آپریشنز',
          icon: <Navigation className="w-5 h-5 text-amber-400" />,
          subItems: [
            { title: 'Customers', titleUrdu: 'کسٹمرز', href: '/operations/customers' },
            { title: 'Bookings', titleUrdu: 'بکنگز', href: '/operations/bookings' },
            { title: 'Trips & Timeline', titleUrdu: 'ٹرپس و ٹائم لائن', href: '/operations/trips' },
          ],
        },
      ],
    },
    {
      section: 'Expenses',
      items: [
        {
          title: 'Expenses',
          titleUrdu: 'اخراجات',
          icon: <Receipt className="w-5 h-5 text-rose-400" />,
          subItems: [
            { title: 'Daily Expenses', titleUrdu: 'روزانہ کے اخراجات', href: '/expenses/daily' },
            { title: 'Trip Expenses', titleUrdu: 'ٹرپ اخراجات', href: '/operations/trips' },
          ],
        },
      ],
    },
    {
      section: 'Accounts',
      items: [
        {
          title: 'Accounts & Ledger',
          titleUrdu: 'اکاؤنٹس و لیجر',
          icon: <Wallet className="w-5 h-5 text-emerald-400" />,
          subItems: [
            { title: 'Cash & Bank Book', titleUrdu: 'کیش و بینک بک', href: '/accounts/cash-bank' },
            { title: 'Customer Ledgers', titleUrdu: 'کسٹمر کھاتہ', href: '/accounts/customers' },
            { title: 'Vendor Ledgers', titleUrdu: 'وینڈر کھاتہ', href: '/accounts/vendors' },
            { title: 'General Ledger', titleUrdu: 'جنرل لیجر (JV)', href: '/accounts/general-ledger' },
            { title: 'Chart of Accounts', titleUrdu: 'چارٹ آف اکاؤنٹس', href: '/accounts/chart-of-accounts' },
          ],
        },
      ],
    },
    {
      section: 'Reports',
      items: [
        {
          title: 'Reports & Analytics',
          titleUrdu: 'رپورٹس و تجزیات',
          icon: <BarChart3 className="w-5 h-5 text-purple-400" />,
          subItems: [
            { title: 'Vehicle Profitability', titleUrdu: 'گاڑی وار منافع رپورٹ', href: '/reports/vehicle-profitability' },
            { title: 'Trial Balance', titleUrdu: 'ٹرائل بیلنس', href: '/reports/financial?tab=trial-balance' },
            { title: 'Profit & Loss', titleUrdu: 'پرافٹ اینڈ لاس', href: '/reports/financial?tab=profit-loss' },
            { title: 'Balance Sheet', titleUrdu: 'بیلنس شیٹ', href: '/reports/financial?tab=balance-sheet' },
          ],
        },
      ],
    },
    {
      section: 'Settings',
      items: [
        {
          title: 'Settings',
          titleUrdu: 'سیٹنگز',
          href: '/settings',
          icon: <Settings className="w-5 h-5 text-slate-400" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 border-r border-slate-800 select-none shadow-xl z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-600/30">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Transport<span className="text-sky-400">360</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">FLEET & ACCOUNTS ERP</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
        {menuSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            {sec.items.map((item, itemIdx) => {
              if (item.href && !item.subItems) {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-urdu">{item.titleUrdu}</span>
                  </Link>
                );
              }

              const isOpen = openSections[item.title] ?? true;
              return (
                <div key={itemIdx} className="space-y-1">
                  <button
                    onClick={() => toggleSection(item.title)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-urdu">{item.titleUrdu}</span>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {isOpen && item.subItems && (
                    <div className="pl-9 pr-2 space-y-1 border-l border-slate-800 ml-4">
                      {item.subItems.map((sub, sIdx) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sIdx}
                            href={sub.href}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                              isSubActive
                                ? 'bg-sky-500/20 text-sky-400 font-semibold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                          >
                            <span>{sub.title}</span>
                            <span className="text-[10px] text-slate-500 font-urdu">{sub.titleUrdu}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Double-Entry</span>
        </div>
        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">v1.0.0</span>
      </div>
    </aside>
  );
}
