'use client';

import React, { useState } from 'react';
import { Building2, Phone, Plus, X, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface CustomersClientProps {
  initialCustomers: any[];
}

export default function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const { isUrdu } = useLanguage();
  const [customers, setCustomers] = useState(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    address: 'Lahore',
    creditLimit: '500000',
    balance: '0',
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert(isUrdu ? 'براہ کرم کسٹمر کا نام اور فون درج کریں' : 'Please enter customer name and phone');
      return;
    }

    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: formData.name,
      companyName: formData.companyName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      creditLimit: Number(formData.creditLimit) || 0,
      balance: Number(formData.balance) || 0,
      bookings: [],
      journalLines: [],
    };

    setCustomers([newCustomer, ...customers]);
    setIsModalOpen(false);
    setSuccessMessage(
      isUrdu
        ? `کسٹمر ${newCustomer.name} کامیابی سے شامل کر دیا گیا!`
        : `Customer ${newCustomer.name} added successfully!`
    );

    setFormData({
      name: '',
      companyName: '',
      phone: '',
      email: '',
      address: 'Lahore',
      creditLimit: '500000',
      balance: '0',
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
            <Building2 className="w-8 h-8 text-sky-600" strokeWidth={2.5} />
            <span>{isUrdu ? 'کسٹمر لیجرز اور بقایا جات' : 'Customer Ledgers & Receivables'}</span>
          </h1>
          <p className="text-sm md:text-base font-semibold text-slate-500 mt-1">
            {isUrdu
              ? 'کسٹمر کھاتہ، کرایہ بلنگ، ایڈوانس کٹوتی اور بقایا بیلنس'
              : 'Accounts Receivable (AR) sub-ledger, freight billing, advances, and statements'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm md:text-base font-extrabold transition-all shadow-md shadow-sky-600/30 w-fit"
        >
          <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span>{isUrdu ? '+ نیا کسٹمر شامل کریں' : '+ Add Customer'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-bold shadow-xs">
          <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((cust) => {
          const totalFreightBilled = cust.bookings?.reduce((s: number, b: any) => s + b.freightAmount, 0) || 0;
          const totalAdvances = cust.bookings?.reduce((s: number, b: any) => s + b.advanceReceived, 0) || 0;
          const outstanding = cust.balance;

          return (
            <div
              key={cust.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{cust.name}</h3>
                  <p className="text-sm font-bold text-slate-600 mt-0.5">{cust.companyName || 'Commercial Client'}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>{cust.phone}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-bold block">{isUrdu ? 'کریڈٹ لمٹ' : 'Credit Limit'}</span>
                  <span className="text-sm font-extrabold text-slate-700">
                    {formatPKR(cust.creditLimit)}
                  </span>
                </div>
              </div>

              {/* Ledger Summary Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{isUrdu ? 'کل بلنگ (Billed):' : 'Total Billed:'}</span>
                  <span className="font-bold text-slate-900">{formatPKR(totalFreightBilled)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{isUrdu ? 'بیعانہ (Advance):' : 'Advance Received:'}</span>
                  <span className="font-bold text-emerald-600">{formatPKR(totalAdvances)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-extrabold">
                  <span className="text-rose-800">{isUrdu ? 'واجب الوصول (Receivable):' : 'Outstanding Balance:'}</span>
                  <span className="text-rose-700 text-base">{formatPKR(outstanding)}</span>
                </div>
              </div>

              {/* Recent Bilty Preview */}
              <div className="space-y-1.5 text-xs">
                <span className="text-xs font-bold text-slate-700 block">{isUrdu ? 'حالیہ بلٹی ریکارڈ:' : 'Recent Bookings:'}</span>
                {cust.bookings?.slice(0, 2).map((b: any) => (
                  <div key={b.id} className="flex justify-between text-slate-600 py-1 border-b border-slate-100 font-medium">
                    <span>{b.bookingNumber} ({b.biltyNumber || 'Pending'})</span>
                    <span className="font-bold text-slate-900">{formatPKR(b.freightAmount)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: + Add Customer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Building2 className="w-6 h-6 text-sky-600" strokeWidth={2.5} />
                <span>{isUrdu ? 'نئے کسٹمر کا اندراج' : 'Add New Customer'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'کسٹمر کا نام:' : 'Customer Name:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABC Traders"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'کمپنی کا نام:' : 'Company Name:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABC Commercial Pvt Ltd"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'موبائل / فون:' : 'Phone Number:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 042-35889900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'ای میل (Email):' : 'Email Address:'}
                  </label>
                  <input
                    type="email"
                    placeholder="logistics@company.pk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isUrdu ? 'پتہ / شہر (City / Address):' : 'Address:'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Badami Bagh, Lahore"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'کریڈٹ لمٹ (PKR):' : 'Credit Limit:'}
                  </label>
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'ابتدائی بقایا رقم:' : 'Opening Balance:'}
                  </label>
                  <input
                    type="number"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-rose-600 focus:bg-white"
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
                  {isUrdu ? 'کسٹمر محفوظ کریں' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
