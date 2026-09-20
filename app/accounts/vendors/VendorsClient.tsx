'use client';

import React, { useState } from 'react';
import { Building2, Phone, Plus, X, ShieldCheck, Fuel, Wrench, Disc } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface VendorsClientProps {
  initialVendors: any[];
}

export default function VendorsClient({ initialVendors }: VendorsClientProps) {
  const { isUrdu } = useLanguage();
  const [vendors, setVendors] = useState(initialVendors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    vendorType: 'DIESEL_PUMP',
    phone: '',
    address: 'Highway Station',
    balance: '0',
  });

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert(isUrdu ? 'براہ کرم وینڈر کا نام درج کریں' : 'Please enter vendor name');
      return;
    }

    const newVendor = {
      id: `vnd-${Date.now()}`,
      name: formData.name,
      vendorType: formData.vendorType,
      phone: formData.phone,
      address: formData.address,
      balance: Number(formData.balance) || 0,
      fuelLogs: [],
      maintenanceLogs: [],
      tripExpenses: [],
    };

    setVendors([newVendor, ...vendors]);
    setIsModalOpen(false);
    setSuccessMessage(
      isUrdu
        ? `وینڈر ${newVendor.name} کامیابی سے شامل کر دیا گیا!`
        : `Vendor ${newVendor.name} added successfully!`
    );

    setFormData({
      name: '',
      vendorType: 'DIESEL_PUMP',
      phone: '',
      address: 'Highway Station',
      balance: '0',
    });
  };

  const getVendorIcon = (type: string) => {
    switch (type) {
      case 'DIESEL_PUMP':
        return <Fuel className="w-5 h-5 text-sky-600" strokeWidth={2.5} />;
      case 'WORKSHOP':
        return <Wrench className="w-5 h-5 text-amber-600" strokeWidth={2.5} />;
      case 'TYRE_SHOP':
        return <Disc className="w-5 h-5 text-purple-600" strokeWidth={2.5} />;
      default:
        return <Building2 className="w-5 h-5 text-slate-600" strokeWidth={2.5} />;
    }
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
            <span>{isUrdu ? 'وینڈر و سپلائر اکاؤنٹس' : 'Vendor & Supplier Accounts'}</span>
          </h1>
          <p className="text-sm md:text-base font-semibold text-slate-500 mt-1">
            {isUrdu
              ? 'ڈیزل پمپ، ورکشاپس، ٹائر شاپس اور سروس ٹھیکیداروں کے اکاؤنٹس پی ایبل'
              : 'Accounts Payable (AP) sub-ledger for Diesel Pumps, Workshops, Tyre Shops, and Service Contractors'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm md:text-base font-extrabold transition-all shadow-md shadow-sky-600/30 w-fit"
        >
          <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span>{isUrdu ? '+ نیا وینڈر شامل کریں' : '+ Add Vendor'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-bold shadow-xs">
          <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Vendors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => {
          const fuelBills = vendor.fuelLogs?.reduce((s: number, f: any) => s + f.total, 0) || 0;
          const repairBills = vendor.maintenanceLogs?.reduce((s: number, m: any) => s + m.totalCost, 0) || 0;
          const otherExpenses = vendor.tripExpenses?.reduce((s: number, e: any) => s + e.amount, 0) || 0;
          const totalBilled = fuelBills + repairBills + otherExpenses;

          return (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    {getVendorIcon(vendor.vendorType)}
                    <h3 className="font-extrabold text-slate-900 text-lg">{vendor.name}</h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 mt-1.5 inline-block">
                    {vendor.vendorType.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>{vendor.phone || 'N/A'}</span>
                  </p>
                </div>
              </div>

              {/* Vendor Ledger Summary */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{isUrdu ? 'کل بلنگ تاریخ:' : 'Total Billed:'}</span>
                  <span className="font-bold text-slate-900">{formatPKR(totalBilled)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-extrabold">
                  <span className="text-amber-800">{isUrdu ? 'واجب الادا (Payable):' : 'Current Payable:'}</span>
                  <span className="text-amber-700 text-base">{formatPKR(vendor.balance)}</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center justify-between font-medium">
                <span>{(vendor.maintenanceLogs?.length || 0) + (vendor.fuelLogs?.length || 0)} {isUrdu ? 'واؤچرز منسلک' : 'Vouchers linked'}</span>
                <span className="text-sky-600 font-bold cursor-pointer hover:underline">
                  {isUrdu ? 'کھاتہ اسٹیٹمنٹ' : 'View Statement'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: + Add Vendor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Building2 className="w-6 h-6 text-sky-600" strokeWidth={2.5} />
                <span>{isUrdu ? 'نئے وینڈر کا اندراج' : 'Add New Vendor'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleAddVendor} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isUrdu ? 'وینڈر کا نام (Vendor Name):' : 'Vendor Name:'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shell Expressway Station / Master Tyres"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'وینڈر کی قسم (Type):' : 'Vendor Type:'}
                  </label>
                  <select
                    value={formData.vendorType}
                    onChange={(e) => setFormData({ ...formData, vendorType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:bg-white"
                  >
                    <option value="DIESEL_PUMP">{isUrdu ? 'ڈیزل پمپ (Fuel Pump)' : 'Diesel Pump'}</option>
                    <option value="WORKSHOP">{isUrdu ? 'ورکشاپ (Workshop)' : 'Workshop'}</option>
                    <option value="TYRE_SHOP">{isUrdu ? 'ٹائر شاپ (Tyre Shop)' : 'Tyre Shop'}</option>
                    <option value="SPARE_PARTS">{isUrdu ? 'سپیئر پارٹس (Spare Parts)' : 'Spare Parts'}</option>
                    <option value="AGENT">{isUrdu ? 'ایجنٹ (Logistics Agent)' : 'Agent'}</option>
                    <option value="LOADING_CONTRACTOR">{isUrdu ? 'لوڈنگ ٹھیکیدار (Labour)' : 'Loading Contractor'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'موبائل / فون:' : 'Phone Number:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0321-4447788"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isUrdu ? 'پتہ / مقام (Location / Address):' : 'Address:'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. N-5 Highway Bypass"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isUrdu ? 'ابتدائی واجب الادا رقم (Opening Payable PKR):' : 'Opening Payable:'}
                </label>
                <input
                  type="number"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-amber-700 focus:bg-white"
                />
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
                  {isUrdu ? 'وینڈر محفوظ کریں' : 'Save Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
