'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Truck, Plus, X, ArrowUpRight, ShieldCheck, DollarSign } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface DriversClientProps {
  initialDrivers: any[];
}

export default function DriversClient({ initialDrivers }: DriversClientProps) {
  const { isUrdu } = useLanguage();
  const [drivers, setDrivers] = useState(initialDrivers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cnic: '',
    licenseNumber: '',
    monthlySalary: '45000',
    dailyAllowanceRate: '1500',
    outstandingAdvance: '0',
    status: 'ACTIVE',
  });

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert(isUrdu ? 'براہ کرم نام اور فون نمبر درج کریں' : 'Please enter name and phone');
      return;
    }

    const newDriver = {
      id: `drv-${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      cnic: formData.cnic,
      licenseNumber: formData.licenseNumber,
      monthlySalary: Number(formData.monthlySalary) || 0,
      dailyAllowanceRate: Number(formData.dailyAllowanceRate) || 0,
      outstandingAdvance: Number(formData.outstandingAdvance) || 0,
      status: formData.status,
      assignedVehicles: [],
      trips: [],
      advances: [],
      dailyExpenses: [],
    };

    setDrivers([newDriver, ...drivers]);
    setIsModalOpen(false);
    setSuccessMessage(
      isUrdu
        ? `ڈرائیور ${newDriver.name} کامیابی سے شامل کر دیا گیا!`
        : `Driver ${newDriver.name} added successfully!`
    );

    setFormData({
      name: '',
      phone: '',
      cnic: '',
      licenseNumber: '',
      monthlySalary: '45000',
      dailyAllowanceRate: '1500',
      outstandingAdvance: '0',
      status: 'ACTIVE',
    });
  };

  const formatPKR = (num: number) =>
    new Intl.NumberFormat(isUrdu ? 'ur-PK' : 'en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(num)
      .replace('PKR', 'Rs.');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-sky-600" strokeWidth={2.5} />
            <span>{isUrdu ? 'ڈرائیورز اور سب لیجر' : 'Drivers & Sub-Ledgers'}</span>
          </h1>
          <p className="text-sm md:text-base font-semibold text-slate-500 mt-1">
            {isUrdu
              ? 'ڈرائیور پروفائلز، تنخواہ، ایڈوانس، روزانہ الاؤنس اور کھاتہ اسٹیٹمنٹس'
              : 'Manage driver profiles, salary, advances, daily allowances, and sub-ledger statements'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm md:text-base font-extrabold transition-all shadow-md shadow-sky-600/30 w-fit"
        >
          <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span>{isUrdu ? '+ نیا ڈرائیور شامل کریں' : '+ Add Driver'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-bold shadow-xs">
          <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Drivers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => {
          const totalDailyExpenses = driver.dailyExpenses?.reduce((s: number, d: any) => s + d.amount, 0) || 0;
          const totalAdvances = driver.advances?.reduce((s: number, a: any) => s + a.amount, 0) || 0;
          const assignedVehicle = driver.assignedVehicles && driver.assignedVehicles[0];

          return (
            <div
              key={driver.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{driver.name}</h3>
                  <p className="text-sm font-bold text-slate-600 mt-0.5">{driver.phone}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">CNIC: {driver.cnic || 'N/A'}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {driver.status}
                </span>
              </div>

              {/* Assigned Vehicle */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm">
                <span className="text-slate-600 font-bold flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-600" strokeWidth={2.5} />
                  <span>{isUrdu ? 'تفویض گاڑی:' : 'Assigned Vehicle:'}</span>
                </span>
                <span className="font-extrabold text-slate-900">
                  {assignedVehicle ? assignedVehicle.regNumber : (isUrdu ? 'کوئی نہیں' : 'None')}
                </span>
              </div>

              {/* Sub-Ledger Snapshot */}
              <div className="space-y-2 text-sm border-t border-b border-slate-100 py-3.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{isUrdu ? 'ماہانہ تنخواہ:' : 'Monthly Salary:'}</span>
                  <span className="font-bold text-slate-900">{formatPKR(driver.monthlySalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{isUrdu ? 'روزانہ الاؤنس:' : 'Daily Allowance:'}</span>
                  <span className="font-bold text-slate-800">Rs. {driver.dailyAllowanceRate} / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{isUrdu ? 'کل ایڈوانس:' : 'Total Advances:'}</span>
                  <span className="font-bold text-slate-800">{formatPKR(totalAdvances)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{isUrdu ? 'روزانہ اخراجات:' : 'Enroute Expenses:'}</span>
                  <span className="font-bold text-slate-800">{formatPKR(totalDailyExpenses)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-extrabold">
                  <span className="text-amber-800">{isUrdu ? 'بقایا ایڈوانس:' : 'Outstanding Advance:'}</span>
                  <span className="text-amber-700 text-base">{formatPKR(driver.outstandingAdvance)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400 font-medium">
                  {driver.trips?.length || 0} {isUrdu ? 'ٹرپس ریکارڈ' : 'Trips recorded'}
                </span>
                <Link
                  href="/fleet/vehicles"
                  className="text-sm font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                >
                  <span>{isUrdu ? 'گاڑی کی تفصیل' : 'Vehicle History'}</span>
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: + Add Driver */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Users className="w-6 h-6 text-sky-600" strokeWidth={2.5} />
                <span>{isUrdu ? 'نئے ڈرائیور کا اندراج' : 'Add New Driver'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'ڈرائیور کا نام:' : 'Driver Name:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tariq Mahmood"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'موبائل نمبر:' : 'Phone Number:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0300-1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'شناختی کارڈ (CNIC):' : 'CNIC Number:'}
                  </label>
                  <input
                    type="text"
                    placeholder="35201-xxxxxxx-x"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'ڈرائیونگ لائسنس:' : 'License Number:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LHR-HTV-9988"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'ماہانہ تنخواہ:' : 'Salary:'}
                  </label>
                  <input
                    type="number"
                    value={formData.monthlySalary}
                    onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'روزانہ الاؤنس:' : 'Allowance/Day:'}
                  </label>
                  <input
                    type="number"
                    value={formData.dailyAllowanceRate}
                    onChange={(e) => setFormData({ ...formData, dailyAllowanceRate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'ابتدائی ایڈوانس:' : 'Initial Advance:'}
                  </label>
                  <input
                    type="number"
                    value={formData.outstandingAdvance}
                    onChange={(e) => setFormData({ ...formData, outstandingAdvance: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-amber-700 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  {isUrdu ? 'منسوخ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl transition-colors shadow-md shadow-sky-600/30"
                >
                  {isUrdu ? 'ڈرائیور محفوظ کریں' : 'Save Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
