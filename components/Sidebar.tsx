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
  Navigation,
  FileText,
  DollarSign,
  Receipt,
  Wallet,
  Building2,
  BookOpen,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface MenuItem {
  title: string;
  href?: string;
  icon: React.ReactNode;
  subItems?: { title: string; href: string }[];
}

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { t, isUrdu } = useLanguage();

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
          title: t('dashboard'),
          href: '/',
          icon: <LayoutDashboard className="w-5 h-5 text-sky-400" strokeWidth={2.5} />,
        },
      ],
    },
    {
      section: 'Fleet',
      items: [
        {
          title: t('fleet'),
          icon: <Truck className="w-5 h-5 text-sky-400" strokeWidth={2.5} />,
          subItems: [
            { title: t('vehicles'), href: '/fleet/vehicles' },
            { title: t('drivers'), href: '/fleet/drivers' },
            { title: t('fuelManagement'), href: '/fleet/fuel' },
            { title: t('repairMaintenance'), href: '/fleet/maintenance' },
          ],
        },
      ],
    },
    {
      section: 'Operations',
      items: [
        {
          title: t('operations'),
          icon: <Navigation className="w-5 h-5 text-amber-400" strokeWidth={2.5} />,
          subItems: [
            { title: t('customers'), href: '/operations/customers' },
            { title: t('bookings'), href: '/operations/bookings' },
            { title: t('tripsTimeline'), href: '/operations/trips' },
          ],
        },
      ],
    },
    {
      section: 'Expenses',
      items: [
        {
          title: t('expenses'),
          icon: <Receipt className="w-5 h-5 text-rose-400" strokeWidth={2.5} />,
          subItems: [
            { title: t('dailyExpenses'), href: '/expenses/daily' },
            { title: t('tripExpenses'), href: '/operations/trips' },
          ],
        },
      ],
    },
    {
      section: 'Accounts',
      items: [
        {
          title: t('accountsLedger'),
          icon: <Wallet className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />,
          subItems: [
            { title: t('cashBankBook'), href: '/accounts/cash-bank' },
            { title: t('customerLedgers'), href: '/accounts/customers' },
            { title: t('vendorLedgers'), href: '/accounts/vendors' },
            { title: t('generalLedger'), href: '/accounts/general-ledger' },
            { title: t('chartOfAccounts'), href: '/accounts/chart-of-accounts' },
          ],
        },
      ],
    },
    {
      section: 'Reports',
      items: [
        {
          title: t('reportsAnalytics'),
          icon: <BarChart3 className="w-5 h-5 text-purple-400" strokeWidth={2.5} />,
          subItems: [
            { title: t('vehicleProfitability'), href: '/reports/vehicle-profitability' },
            { title: t('trialBalance'), href: '/reports/financial?tab=trial-balance' },
            { title: t('profitLoss'), href: '/reports/financial?tab=profit-loss' },
            { title: t('balanceSheet'), href: '/reports/financial?tab=balance-sheet' },
          ],
        },
      ],
    },
    {
      section: 'Settings',
      items: [
        {
          title: t('settings'),
          href: '/settings',
          icon: <Settings className="w-5 h-5 text-slate-400" strokeWidth={2.5} />,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`w-72 bg-slate-900 text-slate-100 flex flex-col h-screen fixed md:sticky top-0 z-50 border-r border-slate-800 shadow-2xl transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Truck className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Transport<span className="text-sky-400">360</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">FLEET & ACCOUNTS ERP</p>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg md:hidden"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
          {menuSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {sec.items.map((item, itemIdx) => {
                if (item.href && !item.subItems) {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                    </Link>
                  );
                }

                const isOpen = openSections[item.title] ?? true;
                return (
                  <div key={itemIdx} className="space-y-1">
                    <button
                      onClick={() => toggleSection(item.title)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                      )}
                    </button>

                    {isOpen && item.subItems && (
                      <div className="pl-9 pr-2 space-y-1 border-l-2 border-slate-800 ml-4 my-1">
                        {item.subItems.map((sub, sIdx) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              onClick={onCloseMobile}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                                isSubActive
                                  ? 'bg-sky-500/20 text-sky-400 font-extrabold'
                                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                              }`}
                            >
                              <span>{sub.title}</span>
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
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 text-xs font-bold text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Double-Entry ERP</span>
          </div>
          <span className="text-[11px] bg-slate-800 px-2.5 py-0.5 rounded font-mono text-slate-200">v1.2</span>
        </div>
      </aside>
    </>
  );
}
