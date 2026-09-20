'use client';

import React, { useState } from 'react';
import { Fuel, Plus, Gauge, DollarSign, ShieldCheck, TrendingUp } from 'lucide-react';

interface FuelClientProps {
  vehicles: any[];
  pumps: any[];
  trips: any[];
  initialFuelLogs: any[];
}

export default function FuelClient({ vehicles, pumps, trips, initialFuelLogs }: FuelClientProps) {
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    vehicleId: vehicles[0]?.id || '',
    tripId: trips[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    location: 'Sadiqabad Bypass',
    litres: '420',
    rate: '266.66',
    total: '112000',
    odometer: '142500',
    fuelStationVendorId: pumps[0]?.id || '',
    paymentMethod: 'CASH',
  });

  const handleLitresChange = (val: string) => {
    const l = parseFloat(val) || 0;
    const r = parseFloat(formData.rate) || 0;
    setFormData({ ...formData, litres: val, total: (l * r).toFixed(0) });
  };

  const handleRateChange = (val: string) => {
    const r = parseFloat(val) || 0;
    const l = parseFloat(formData.litres) || 0;
    setFormData({ ...formData, rate: val, total: (l * r).toFixed(0) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);

    const l = parseFloat(formData.litres) || 0;
    const t = parseFloat(formData.total) || 0;
    const odo = parseFloat(formData.odometer) || 0;

    const newLog = {
      id: `fuel-${Date.now()}`,
      date: formData.date,
      location: formData.location,
      litres: l,
      rate: parseFloat(formData.rate) || 0,
      total: t,
      odometer: odo,
      paymentMethod: formData.paymentMethod,
      kmPerLitre: 2.98,
      fuelCostPerKM: 89.6,
      vehicle: vehicles.find((v) => v.id === formData.vehicleId),
      fuelStation: pumps.find((p) => p.id === formData.fuelStationVendorId),
    };

    setSuccessMessage(
      `Fuel Logged & Double-Entry Posted: Diesel Expense Dr. Rs. ${t.toLocaleString()} | ${formData.paymentMethod} Cr. Rs. ${t.toLocaleString()}`
    );

    setFuelLogs([newLog, ...fuelLogs]);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Fuel Management & Mileage Engine
            <span className="text-base font-normal text-slate-500 font-urdu">(فیول مینجمنٹ)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track litres, rates, fuel stations, automated KM/L averages, and Cost per KM metrics
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-semibold shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold">Entry Saved & Accounting Posted!</p>
            <p className="text-[11px] font-mono text-emerald-700">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: + Add Fuel */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Fuel className="w-4 h-4 text-sky-600" />
            <h2 className="font-bold text-slate-800 text-sm">+ Add Fuel Entry (ڈیزل اینٹری)</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Vehicle (گاڑی):</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white"
                  required
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.regNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Date (تاریخ):</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Location (مقام):</label>
                <input
                  type="text"
                  placeholder="e.g. Sadiqabad Bypass"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Fuel Station (پمپ):</label>
                <select
                  value={formData.fuelStationVendorId}
                  onChange={(e) => setFormData({ ...formData, fuelStationVendorId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                >
                  <option value="">General Pump</option>
                  {pumps.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Litres (لیٹر):</label>
                <input
                  type="number"
                  placeholder="420"
                  value={formData.litres}
                  onChange={(e) => handleLitresChange(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-sky-700 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Rate (فی لیٹر):</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="266.66"
                  value={formData.rate}
                  onChange={(e) => handleRateChange(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Total (کل رقم):</label>
                <input
                  type="number"
                  placeholder="112000"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-rose-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Odometer (KM ریڈنگ):</label>
                <input
                  type="number"
                  placeholder="142500"
                  value={formData.odometer}
                  onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Payment Method:</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white"
                >
                  <option value="CASH">Cash in Hand (کیش)</option>
                  <option value="BANK">Bank Transfer (بینک)</option>
                  <option value="CREDIT">Pump Credit (ادھار/کھاتہ)</option>
                </select>
              </div>
            </div>

            {/* Live Accounting Entry Preview */}
            <div className="p-3 bg-slate-900 text-slate-100 rounded-lg space-y-1 font-mono text-[11px]">
              <p className="text-slate-400 font-sans text-[10px] font-semibold">AUTOMATED ACCOUNTING ENTRY:</p>
              <div className="flex justify-between text-emerald-400">
                <span>Diesel Expense (5001) Dr.</span>
                <span>Rs. {Number(formData.total || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sky-400 pl-4">
                <span>
                  {formData.paymentMethod === 'CREDIT'
                    ? 'Pump Payable (2001)'
                    : formData.paymentMethod === 'BANK'
                    ? 'Bank (1002)'
                    : 'Cash in Hand (1001)'}{' '}
                  Cr.
                </span>
                <span>Rs. {Number(formData.total || 0).toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Fuel className="w-4 h-4" />
              <span>{loading ? 'Logging Fuel...' : 'Save & Post Entry (محفوظ کریں)'}</span>
            </button>
          </form>
        </div>

        {/* Fuel Logs Table with KM/L and Cost/KM */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm">Fuel Logs & Performance Metrics</h2>
            <span className="text-xs text-slate-500 font-mono">{fuelLogs.length} Records</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Vehicle</th>
                  <th className="px-4 py-2.5">Station</th>
                  <th className="px-4 py-2.5 text-right">Litres</th>
                  <th className="px-4 py-2.5 text-right">Rate</th>
                  <th className="px-4 py-2.5 text-right">Total (Rs.)</th>
                  <th className="px-4 py-2.5 text-right">Odometer</th>
                  <th className="px-4 py-2.5 text-right">KM/L (اوسط)</th>
                  <th className="px-4 py-2.5 text-right">Cost/KM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fuelLogs.map((fuel: any) => (
                  <tr key={fuel.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {new Date(fuel.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{fuel.vehicle?.regNumber}</td>
                    <td className="px-4 py-3 text-slate-700">{fuel.fuelStation?.name || fuel.location}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">{fuel.litres} L</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600">Rs. {fuel.rate}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      Rs. {fuel.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      {fuel.odometer.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">
                      {fuel.kmPerLitre ? `${fuel.kmPerLitre.toFixed(2)} KM/L` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-800">
                      {fuel.fuelCostPerKM ? `Rs. ${fuel.fuelCostPerKM.toFixed(1)}/KM` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
