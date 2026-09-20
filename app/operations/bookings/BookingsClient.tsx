'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, FileText, Truck, Navigation, DollarSign, ShieldCheck } from 'lucide-react';

interface BookingsClientProps {
  customers: any[];
  vehicles: any[];
  drivers: any[];
  initialBookings: any[];
}

export default function BookingsClient({
  customers,
  vehicles,
  drivers,
  initialBookings,
}: BookingsClientProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    bookingDate: new Date().toISOString().split('T')[0],
    pickupLocation: 'Lahore Dry Port',
    destination: 'Karachi Port Qasim',
    vehicleId: vehicles[0]?.id || '',
    driverId: drivers[0]?.id || '',
    freightAmount: '250000',
    advanceReceived: '100000',
    agentName: 'Malik Zafar Logistics',
    commissionAmount: '7500',
    biltyNumber: `BL-${Math.floor(100000 + Math.random() * 900000)}`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/operations/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save booking');

      setSuccessMessage(
        `Booking & Bilty Created: ${data.booking.bookingNumber} | Customer Receivable Dr. Rs. ${Number(formData.freightAmount).toLocaleString()} / Freight Revenue Cr.`
      );

      setBookings([data.booking, ...bookings]);
      setFormData({
        ...formData,
        biltyNumber: `BL-${Math.floor(100000 + Math.random() * 900000)}`,
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Bookings & Bilty
            <span className="text-base font-normal text-slate-500 font-urdu">(بکنگ و بلٹی)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Freight order bookings, bilty generation, advance tracking, and seamless trip conversion
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-semibold shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold">Booking Confirmed & Accounting Entry Created!</p>
            <p className="text-[11px] font-mono text-emerald-700">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: New Booking */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-800 text-sm">New Booking (نئی بکنگ)</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Customer (کسٹمر):</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white"
                  required
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Booking Date:</label>
                <input
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Pickup (روانگی):</label>
                <input
                  type="text"
                  placeholder="e.g. Lahore Dry Port"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Destination (منزل):</label>
                <input
                  type="text"
                  placeholder="e.g. Karachi Port Qasim"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Vehicle (گاڑی):</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.regNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Driver (ڈرائیور):</label>
                <select
                  value={formData.driverId}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Freight (کل کرایہ):</label>
                <input
                  type="number"
                  placeholder="250000"
                  value={formData.freightAmount}
                  onChange={(e) => setFormData({ ...formData, freightAmount: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Advance (بیعانہ):</label>
                <input
                  type="number"
                  placeholder="100000"
                  value={formData.advanceReceived}
                  onChange={(e) => setFormData({ ...formData, advanceReceived: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Agent (ایجنٹ):</label>
                <input
                  type="text"
                  placeholder="e.g. Malik Zafar"
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Commission (کمیشن):</label>
                <input
                  type="number"
                  placeholder="7500"
                  value={formData.commissionAmount}
                  onChange={(e) => setFormData({ ...formData, commissionAmount: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Bilty No (بلٹی نمبر):</label>
              <input
                type="text"
                value={formData.biltyNumber}
                onChange={(e) => setFormData({ ...formData, biltyNumber: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-indigo-600 focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>{loading ? 'Creating Booking...' : 'Confirm Booking & Issue Bilty'}</span>
            </button>
          </form>
        </div>

        {/* Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm">Bookings & Bilty Register</h2>
            <span className="text-xs text-slate-500 font-mono">{bookings.length} Records</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Booking / Bilty</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5">Route</th>
                  <th className="px-4 py-2.5">Vehicle / Driver</th>
                  <th className="px-4 py-2.5 text-right">Freight (کرایہ)</th>
                  <th className="px-4 py-2.5 text-right">Advance</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div className="font-bold">{b.bookingNumber}</div>
                      <div className="font-mono text-[11px] text-indigo-600">Bilty: {b.biltyNumber || 'Pending'}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {b.customer?.name || 'Customer'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{b.pickupLocation}</div>
                      <div className="text-[10px] text-slate-400">➔ {b.destination}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div className="font-semibold">{b.vehicle?.regNumber || 'Not assigned'}</div>
                      <div className="text-[10px] text-slate-500">{b.driver?.name}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600 whitespace-nowrap">
                      Rs. {b.freightAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800 whitespace-nowrap">
                      Rs. {b.advanceReceived.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800">
                        {b.status}
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
