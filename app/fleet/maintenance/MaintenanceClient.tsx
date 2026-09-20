'use client';

import React, { useState } from 'react';
import { Wrench, Plus, ShieldCheck, DollarSign } from 'lucide-react';

interface MaintenanceClientProps {
  vehicles: any[];
  workshops: any[];
  initialLogs: any[];
}

export default function MaintenanceClient({ vehicles, workshops, initialLogs }: MaintenanceClientProps) {
  const [logs, setLogs] = useState(initialLogs);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    vehicleId: vehicles[0]?.id || '',
    workshopVendorId: workshops[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    category: 'ENGINE',
    description: 'Engine Overhauling, Piston rings, head gasket & nozzle calibration',
    partsCost: '45000',
    labourCost: '15000',
    totalCost: '60000',
    odometer: '185600',
    paymentMethod: 'CREDIT',
  });

  const handlePartsChange = (val: string) => {
    const p = parseFloat(val) || 0;
    const l = parseFloat(formData.labourCost) || 0;
    setFormData({ ...formData, partsCost: val, totalCost: (p + l).toString() });
  };

  const handleLabourChange = (val: string) => {
    const l = parseFloat(val) || 0;
    const p = parseFloat(formData.partsCost) || 0;
    setFormData({ ...formData, labourCost: val, totalCost: (p + l).toString() });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);

    const parts = parseFloat(formData.partsCost) || 0;
    const labour = parseFloat(formData.labourCost) || 0;
    const total = parts + labour;

    const newLog = {
      id: `maint-${Date.now()}`,
      date: formData.date,
      category: formData.category,
      description: formData.description,
      partsCost: parts,
      labourCost: labour,
      totalCost: total,
      odometer: parseFloat(formData.odometer) || 0,
      paymentMethod: formData.paymentMethod,
      vehicle: vehicles.find((v) => v.id === formData.vehicleId),
      workshop: workshops.find((w) => w.id === formData.workshopVendorId),
    };

    setSuccessMessage(
      `Maintenance Posted: Repair & Maintenance Dr. Rs. ${total.toLocaleString()} | ${formData.paymentMethod === 'CREDIT' ? 'Workshop Payable' : formData.paymentMethod} Cr. Rs. ${total.toLocaleString()}`
    );

    setLogs([newLog, ...logs]);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Repair & Maintenance
            <span className="text-base font-normal text-slate-500 font-urdu">(مرمت و مینٹیننس)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track workshop jobs, parts vs labour costs, and automated Double-Entry workshop payable vouchers
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
        {/* Form: + Add Maintenance */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Wrench className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-slate-800 text-sm">+ Add Repair Entry (مرمت کا اندراج)</h2>
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
                <label className="block text-slate-600 font-medium mb-1">Category (قسم):</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                >
                  <option value="ENGINE">Engine (انجن)</option>
                  <option value="TYRES">Tyres (ٹائر)</option>
                  <option value="BRAKES">Brakes (بریک)</option>
                  <option value="SUSPENSION">Suspension (کمانی/سسپنشن)</option>
                  <option value="ELECTRICAL">Electrical (وائرنگ)</option>
                  <option value="OIL_FILTER">Oil & Filters (موبلائل)</option>
                  <option value="BODY">Body / Denting (باڈی)</option>
                  <option value="OTHER">Other / Misc</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Workshop (ورکشاپ):</label>
                <select
                  value={formData.workshopVendorId}
                  onChange={(e) => setFormData({ ...formData, workshopVendorId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                >
                  <option value="">General Workshop</option>
                  {workshops.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Description (تفصیل کام):</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white h-16"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Parts (پرزے):</label>
                <input
                  type="number"
                  value={formData.partsCost}
                  onChange={(e) => handlePartsChange(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Labour (مزدوری):</label>
                <input
                  type="number"
                  value={formData.labourCost}
                  onChange={(e) => handleLabourChange(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Total (کل بل):</label>
                <input
                  type="number"
                  value={formData.totalCost}
                  readOnly
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-rose-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Odometer (KM):</label>
                <input
                  type="number"
                  value={formData.odometer}
                  onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Payment Method:</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white"
                >
                  <option value="CREDIT">Workshop Credit (ادھار/کھاتہ)</option>
                  <option value="CASH">Cash in Hand (کیش)</option>
                  <option value="BANK">Bank Transfer (بینک)</option>
                </select>
              </div>
            </div>

            {/* Live Accounting Entry Preview */}
            <div className="p-3 bg-slate-900 text-slate-100 rounded-lg space-y-1 font-mono text-[11px]">
              <p className="text-slate-400 font-sans text-[10px] font-semibold">AUTOMATED ACCOUNTING ENTRY:</p>
              <div className="flex justify-between text-emerald-400">
                <span>Repair & Maint (5008) Dr.</span>
                <span>Rs. {Number(formData.totalCost || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sky-400 pl-4">
                <span>
                  {formData.paymentMethod === 'CREDIT'
                    ? 'Workshop Payable (2001)'
                    : formData.paymentMethod === 'BANK'
                    ? 'Bank (1002)'
                    : 'Cash in Hand (1001)'}{' '}
                  Cr.
                </span>
                <span>Rs. {Number(formData.totalCost || 0).toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Wrench className="w-4 h-4" />
              <span>{loading ? 'Saving Entry...' : 'Save & Post Entry (محفوظ کریں)'}</span>
            </button>
          </form>
        </div>

        {/* Maintenance Logs Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm">Workshop Repair History (مرمت کے ریکارڈز)</h2>
            <span className="text-xs text-slate-500 font-mono">{logs.length} Records</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Vehicle</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Workshop</th>
                  <th className="px-4 py-2.5 text-right">Parts (پرزے)</th>
                  <th className="px-4 py-2.5 text-right">Labour</th>
                  <th className="px-4 py-2.5 text-right">Total Bill</th>
                  <th className="px-4 py-2.5">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((m: any) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {new Date(m.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{m.vehicle?.regNumber}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                        {m.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{m.workshop?.name || 'Local Workshop'}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      Rs. {m.partsCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      Rs. {m.labourCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-rose-600 whitespace-nowrap">
                      Rs. {m.totalCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                        {m.paymentMethod}
                      </span>
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
