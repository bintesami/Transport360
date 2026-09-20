import React from 'react';
import { Settings, Users, Shield, Tag, MapPin, Truck, CreditCard, Sliders } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    {
      title: 'Expense Heads (مدات)',
      description: 'Manage expense categories, sub-heads, and default chart of account codes',
      icon: <Tag className="w-5 h-5 text-rose-600" />,
      items: ['Dinner Expense', 'Toll Tax', 'Loading Labour', 'Unloading Labour', 'Police / Enroute Misc', 'Office Admin'],
    },
    {
      title: 'Vehicle Types (گاڑیوں کی اقسام)',
      description: 'Configure fleet vehicle classes, axle limits, and weight tolerances',
      icon: <Truck className="w-5 h-5 text-sky-600" />,
      items: ['Trailor (22-Wheeler)', '10-Wheeler Truck', 'Mazda T3500', 'Flatbed Container Trailor', '6-Wheeler Shehzore'],
    },
    {
      title: 'Locations & Terminals (اسٹیشنز و مقامات)',
      description: 'Hubs, dry ports, and transit stations across Pakistan',
      icon: <MapPin className="w-5 h-5 text-emerald-600" />,
      items: ['Lahore Dry Port', 'Karachi Port Qasim', 'Karachi Keamari', 'Faisalabad Textile Hub', 'Multan Terminal', 'Sukkur Bypass'],
    },
    {
      title: 'Payment Methods & Bank Accounts',
      description: 'Configure cash in hand registers, company bank accounts, and merchant pumps',
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
      items: ['Petty Cash (Lahore)', 'HBL Operating A/C', 'Meezan Islamic A/C', 'PSO Fleet Fuel Card'],
    },
    {
      title: 'Users & Roles (صارفین و اختیارات)',
      description: 'Manage system administrators, accountants, dispatchers, and gate officers',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      items: ['Super Admin', 'Senior Accountant', 'Operations Dispatcher', 'Gate Clerk'],
    },
    {
      title: 'Accounting & Fiscal Year Settings',
      description: 'Fiscal calendar dates, auto-numbering prefixes for JVs, and lock dates',
      icon: <Sliders className="w-5 h-5 text-amber-600" />,
      items: ['Fiscal Year: July 1 - June 30', 'Auto-JV Numbering: Enabled', 'Double-Entry Strict Validation: Enforced'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            System Settings & Master Data
            <span className="text-base font-normal text-slate-500 font-urdu">(سیٹنگز و ماسٹر ڈیٹا)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure expense heads, stations, vehicle classifications, payment modes, and financial policies
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                {sec.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{sec.title}</h3>
                <p className="text-[11px] text-slate-500">{sec.description}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              {sec.items.map((item, iIdx) => (
                <div key={iIdx} className="text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-md flex items-center justify-between">
                  <span>{item}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Active</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
