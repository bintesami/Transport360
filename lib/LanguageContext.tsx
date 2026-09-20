'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isUrdu: boolean;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  dashboard: { en: 'Dashboard', ur: 'ڈیش بورڈ' },
  fleet: { en: 'Fleet Management', ur: 'فلیٹ مینجمنٹ' },
  vehicles: { en: 'Vehicles', ur: 'گاڑیاں' },
  drivers: { en: 'Drivers', ur: 'ڈرائیورز' },
  fuelManagement: { en: 'Fuel Management', ur: 'فیول مینجمنٹ' },
  repairMaintenance: { en: 'Repair & Maintenance', ur: 'مرمت و مینٹیننس' },
  operations: { en: 'Operations', ur: 'آپریشنز' },
  customers: { en: 'Customers', ur: 'کسٹمرز' },
  bookings: { en: 'Bookings', ur: 'بکنگز' },
  tripsTimeline: { en: 'Trips & Timeline', ur: 'ٹرپس و ٹائم لائن' },
  expenses: { en: 'Expenses', ur: 'اخراجات' },
  dailyExpenses: { en: 'Daily Expenses', ur: 'روزانہ کے اخراجات' },
  tripExpenses: { en: 'Trip Expenses', ur: 'ٹرپ اخراجات' },
  accountsLedger: { en: 'Accounts & Ledger', ur: 'اکاؤنٹس و لیجر' },
  cashBankBook: { en: 'Cash & Bank Book', ur: 'روکڑ و بینک بک' },
  customerLedgers: { en: 'Customer Ledgers', ur: 'کسٹمر کھاتہ' },
  vendorLedgers: { en: 'Vendor Ledgers', ur: 'وینڈر کھاتہ' },
  generalLedger: { en: 'General Ledger (JV)', ur: 'جنرل لیجر (JV)' },
  chartOfAccounts: { en: 'Chart of Accounts', ur: 'چارٹ آف اکاؤنٹس' },
  reportsAnalytics: { en: 'Reports & Analytics', ur: 'رپورٹس و تجزیات' },
  vehicleProfitability: { en: 'Vehicle Profitability', ur: 'گاڑی وار منافع رپورٹ' },
  trialBalance: { en: 'Trial Balance', ur: 'ٹرائل بیلنس' },
  profitLoss: { en: 'Profit & Loss', ur: 'پرافٹ اینڈ لاس' },
  balanceSheet: { en: 'Balance Sheet', ur: 'بیلنس شیٹ' },
  settings: { en: 'Settings', ur: 'سیٹنگز' },

  // Action Buttons
  addVehicle: { en: '+ Add Vehicle', ur: '+ نئی گاڑی شامل کریں' },
  addDriver: { en: '+ Add Driver', ur: '+ نیا ڈرائیور شامل کریں' },
  addCustomer: { en: '+ Add Customer', ur: '+ نیا کسٹمر شامل کریں' },
  addVendor: { en: '+ Add Vendor', ur: '+ نیا وینڈر شامل کریں' },
  addExpense: { en: '+ Add Expense', ur: '+ نیا خرچ' },
  fuelLog: { en: '+ Fuel Log', ur: '+ ڈیزل لاگ' },
  repair: { en: '+ Repair', ur: '+ مرمت' },
  newBooking: { en: '+ New Booking', ur: '+ نئی بکنگ' },
  save: { en: 'Save & Submit', ur: 'محفوظ کریں' },
  cancel: { en: 'Cancel', ur: 'منسوخ' },
  searchPlaceholder: { en: 'Search Vehicle, Bilty, Customer, Driver...', ur: 'گاڑی، بلٹی، کسٹمر یا ڈرائیور تلاش کریں...' },

  // Headers
  totalIncome: { en: 'Total Income', ur: 'کل آمدن' },
  totalExpense: { en: 'Total Expense', ur: 'کل اخراجات' },
  netProfit: { en: 'Net Profit', ur: 'خالص منافع' },
  cashBalance: { en: 'Cash Balance', ur: 'کیش بیلنس' },
  bankBalance: { en: 'Bank Balance', ur: 'بینک بیلنس' },
  fleetStatus: { en: 'Fleet Status', ur: 'فلیٹ کی صورتحال' },
  available: { en: 'Available', ur: 'دستیاب' },
  onTrip: { en: 'On Trip', ur: 'روٹ پر' },
  underRepair: { en: 'Under Repair', ur: 'ورکشاپ' },
  runningTrips: { en: 'Running Trips', ur: 'جاری ٹرپس' },
  completed: { en: 'Completed', ur: 'مکمل شدہ' },
  pendingDelivery: { en: 'Pending Delivery', ur: 'ڈیلیوری باقی' },
  pendingPayment: { en: 'Pending Payment', ur: 'ادائیگی باقی' },
  alerts: { en: 'Alerts & Actions', ur: 'اطلاعات و ضروری کام' },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'ur',
  setLanguage: () => {},
  t: (key: string) => key,
  isUrdu: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ur'); // Default to Urdu per user request, toggleable to en

  useEffect(() => {
    const saved = localStorage.getItem('transport360_lang') as Language;
    if (saved && (saved === 'en' || saved === 'ur')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('transport360_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isUrdu: language === 'ur',
      }}
    >
      <div className={language === 'ur' ? 'font-urdu' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
