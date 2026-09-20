'use client';

import React, { useState } from 'react';
import { Settings, Users, Shield, Tag, MapPin, Truck, CreditCard, Sliders, Plus, Check } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function SettingsClient() {
  const { isUrdu } = useLanguage();

  const [sections, setSections] = useState([
    {
      id: 'heads',
      title: isUrdu ? 'خرچ کی مدات (Expense Heads)' : 'Expense Heads',
      description: isUrdu ? 'اخراجات کی کیٹیگریز اور ڈیفالٹ کوڈز' : 'Manage expense categories and default chart of accounts',
      icon: <Tag className="w-6 h-6 text-rose-600" strokeWidth={2.5} />,
      items: [
        isUrdu ? 'کھانا و چائے (Meal/Dinner)' : 'Meal & Dinner',
        isUrdu ? 'موٹروے ٹول ٹیکس (Toll Tax)' : 'Toll Tax',
        isUrdu ? 'لوڈنگ لیبر (Loading)' : 'Loading Labour',
        isUrdu ? 'ان لوڈنگ لیبر (Unloading)' : 'Unloading Labour',
        isUrdu ? 'پولیس و متفرق (Police/Misc)' : 'Police & Enroute Misc',
        isUrdu ? 'دفتر و انتظامی (Office Admin)' : 'Office & Administration',
      ],
    },
    {
      id: 'vehicles',
      title: isUrdu ? 'گاڑیوں کی اقسام (Vehicle Types)' : 'Vehicle Types',
      description: isUrdu ? 'فلیٹ کیٹیگریز اور ایکسل کی قسم' : 'Configure fleet vehicle classes and axle configurations',
      icon: <Truck className="w-6 h-6 text-sky-600" strokeWidth={2.5} />,
      items: [
        'Trailor (22-Wheeler)',
        '10-Wheeler Truck',
        'Mazda T3500',
        'Flatbed Container Trailor',
        '6-Wheeler Shehzore',
      ],
    },
    {
      id: 'locations',
      title: isUrdu ? 'اسٹیشنز و ٹرمینلز (Locations)' : 'Locations & Terminals',
      description: isUrdu ? 'روٹ کے اہم اسٹیشنز اور ڈرائی پورٹس' : 'Hubs, dry ports, and transit stations across Pakistan',
      icon: <MapPin className="w-6 h-6 text-emerald-600" strokeWidth={2.5} />,
      items: [
        isUrdu ? 'لاہور ڈرائی پورٹ (Lahore Dry Port)' : 'Lahore Dry Port',
        isUrdu ? 'کراچی پورٹ قاسم (Karachi Port Qasim)' : 'Karachi Port Qasim',
        isUrdu ? 'فیصل آباد ٹیکسٹائل ہب' : 'Faisalabad Textile Hub',
        isUrdu ? 'ملتان ٹرمینل (Multan)' : 'Multan Terminal',
        isUrdu ? 'سکھر بائی پاس (Sukkur)' : 'Sukkur Bypass',
      ],
    },
    {
      id: 'payment',
      title: isUrdu ? 'ادائیگی کے ذرائع (Payment Methods)' : 'Payment Methods & Banks',
      description: isUrdu ? 'کیش ان ہینڈ اور بینکس کی ترتیبات' : 'Cash in hand registers, bank accounts, and fuel cards',
      icon: <CreditCard className="w-6 h-6 text-indigo-600" strokeWidth={2.5} />,
      items: [
        'Petty Cash (Cash in Hand)',
        'HBL Main Operating A/C',
        'Meezan Islamic Fleet A/C',
        'PSO Fleet Fuel Card',
      ],
    },
    {
      id: 'users',
      title: isUrdu ? 'صارفین اور اختیارات (Users & Roles)' : 'Users & Permissions',
      description: isUrdu ? 'ایڈمن، اکاؤنٹنٹ اور آپریٹرز کے اختیارات' : 'Manage system administrators, accountants, and dispatchers',
      icon: <Users className="w-6 h-6 text-purple-600" strokeWidth={2.5} />,
      items: [
        'Super Admin (مکمل کنٹرول)',
        'Senior Accountant (فنانس و اکاؤنٹنگ)',
        'Operations Dispatcher (بکنگ و ٹرپس)',
        'Gate Officer (چیک پوسٹ و انٹری)',
      ],
    },
    {
      id: 'fiscal',
      title: isUrdu ? 'مالیاتی ترتیبات (Fiscal Settings)' : 'Accounting & Policies',
      description: isUrdu ? 'مالی سال، خودکار نمبرنگ اور لاک تاریخ' : 'Fiscal year dates, auto-JV numbering, and lock dates',
      icon: <Sliders className="w-6 h-6 text-amber-600" strokeWidth={2.5} />,
      items: [
        isUrdu ? 'مالی سال: 1 جولائی تا 30 جون' : 'Fiscal Year: July 1 - June 30',
        isUrdu ? 'خودکار واؤچر نمبرنگ: فعال' : 'Auto-JV Numbering: Enabled',
        isUrdu ? 'ڈبل انٹری بیلنسنگ: سختی سے نافذ' : 'Strict Double-Entry: Enforced',
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <Settings className="w-7 h-7 text-slate-700" strokeWidth={2.5} />
            <span>{isUrdu ? 'سسٹم سیٹنگز و ماسٹر ڈیٹا' : 'System Settings & Master Data'}</span>
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 mt-1">
            {isUrdu
              ? 'موبائل اور ڈیسک ٹاپ کے لیے مکمل کنٹرول، مدات، اسٹیشنز، اور اکاؤنٹس کی ترتیبات'
              : 'Configure expense heads, stations, vehicle classifications, payment modes, and financial policies'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                {sec.icon}
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base md:text-lg">{sec.title}</h2>
                <p className="text-xs text-slate-500 font-medium leading-snug">{sec.description}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              {sec.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="text-xs md:text-sm font-bold text-slate-800 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100 flex items-center justify-between"
                >
                  <span>{item}</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                    <Check className="w-3 h-3" strokeWidth={2.5} />
                    <span>Active</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
