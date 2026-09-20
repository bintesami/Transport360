'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, Plus, Eye, Navigation, X, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface VehiclesClientProps {
  initialVehicles: any[];
  drivers: any[];
}

export default function VehiclesClient({ initialVehicles, drivers }: VehiclesClientProps) {
  const { isUrdu } = useLanguage();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    regNumber: '',
    vehicleType: '10-Wheeler Truck',
    model: 'ISUZU FTR 2022',
    chassisNumber: '',
    engineNumber: '',
    assignedDriverId: '',
    currentOdometer: '100000',
    status: 'AVAILABLE',
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.regNumber) {
      alert(isUrdu ? 'براہ کرم رجسٹریشن نمبر درج کریں' : 'Please enter registration number');
      return;
    }

    const assignedDriver = drivers.find((d) => d.id === formData.assignedDriverId);
    const newVehicle = {
      id: `veh-${Date.now()}`,
      regNumber: formData.regNumber.toUpperCase(),
      vehicleType: formData.vehicleType,
      model: formData.model,
      chassisNumber: formData.chassisNumber,
      engineNumber: formData.engineNumber,
      currentOdometer: Number(formData.currentOdometer) || 0,
      status: formData.status,
      assignedDriver: assignedDriver || null,
      trips: [],
    };

    setVehicles([newVehicle, ...vehicles]);
    setIsModalOpen(false);
    setSuccessMessage(
      isUrdu
        ? `گاڑی ${newVehicle.regNumber} کامیابی سے شامل کر دی گئی!`
        : `Vehicle ${newVehicle.regNumber} added successfully!`
    );

    setFormData({
      regNumber: '',
      vehicleType: '10-Wheeler Truck',
      model: 'ISUZU FTR 2022',
      chassisNumber: '',
      engineNumber: '',
      assignedDriverId: '',
      currentOdometer: '100000',
      status: 'AVAILABLE',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            {isUrdu ? 'دستیاب (Available)' : 'Available'}
          </span>
        );
      case 'ON_TRIP':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            {isUrdu ? 'روٹ پر (On Trip)' : 'On Trip'}
          </span>
        );
      case 'UNDER_REPAIR':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            {isUrdu ? 'ورکشاپ (Under Repair)' : 'Under Repair'}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & + Add Vehicle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <Truck className="w-8 h-8 text-sky-600" strokeWidth={2.5} />
            <span>{isUrdu ? 'گاڑیاں اور فلیٹ' : 'Vehicles Fleet'}</span>
          </h1>
          <p className="text-sm md:text-base font-semibold text-slate-500 mt-1">
            {isUrdu
              ? 'اپنے تمام ٹرکس، ٹریلرز، ڈرائیور تفویض اور انفرادی کھاتہ جات کو سنبھالیں'
              : 'Manage your trucks, trailers, assigned drivers, and individual vehicle ledgers'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm md:text-base font-extrabold transition-all shadow-md shadow-sky-600/30 w-fit"
        >
          <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span>{isUrdu ? '+ نئی گاڑی شامل کریں' : '+ Add Vehicle'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-bold shadow-xs">
          <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200 text-xs md:text-sm">
              <tr>
                <th className="px-5 py-4">{isUrdu ? 'گاڑی (Vehicle)' : 'Vehicle'}</th>
                <th className="px-5 py-4">{isUrdu ? 'قسم (Type)' : 'Type'}</th>
                <th className="px-5 py-4">{isUrdu ? 'ڈرائیور (Driver)' : 'Assigned Driver'}</th>
                <th className="px-5 py-4">{isUrdu ? 'حالت (Status)' : 'Status'}</th>
                <th className="px-5 py-4">{isUrdu ? 'موجودہ ٹرپ' : 'Current Trip'}</th>
                <th className="px-5 py-4 text-right">{isUrdu ? 'مائلیج (KM)' : 'Odometer'}</th>
                <th className="px-5 py-4 text-center">{isUrdu ? 'کارروائی' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {vehicles.map((v) => {
                const currentTrip = v.trips && v.trips[0];
                return (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                        <Truck className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div>
                        <span className="text-base font-extrabold text-slate-900">{v.regNumber}</span>
                        <p className="text-xs text-slate-500 font-medium">{v.model || 'Commercial'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-800 font-bold">{v.vehicleType}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {v.assignedDriver ? (
                        <div>
                          <p className="font-bold text-slate-900">{v.assignedDriver.name}</p>
                          <p className="text-xs text-slate-500">{v.assignedDriver.phone}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic font-normal">
                          {isUrdu ? 'کوئی ڈرائیور نہیں' : 'No Driver Assigned'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">{getStatusBadge(v.status)}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {currentTrip ? (
                        <div className="flex items-center gap-1.5 font-bold">
                          <Navigation className="w-4 h-4 text-amber-500" strokeWidth={2.5} />
                          <span className="text-slate-900">{currentTrip.tripNumber}</span>
                          <span className="text-xs text-slate-500">({currentTrip.status})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal">
                          {isUrdu ? 'کوئی فعال ٹرپ نہیں' : 'No active trip'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-slate-900 text-base">
                      {v.currentOdometer.toLocaleString()} KM
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Link
                        href={`/fleet/vehicles/${v.id}`}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 font-bold transition-all text-xs md:text-sm"
                      >
                        <Eye className="w-4 h-4" strokeWidth={2.5} />
                        <span>{isUrdu ? '7 ٹیبز دیکھیں' : 'Open 7 Tabs'}</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: + Add Vehicle */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Truck className="w-6 h-6 text-sky-600" strokeWidth={2.5} />
                <span>{isUrdu ? 'نئی گاڑی کا اندراج' : 'Add New Vehicle'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'رجسٹریشن نمبر (Reg Number):' : 'Reg Number:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LHR-9988"
                    value={formData.regNumber}
                    onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'گاڑی کی قسم (Type):' : 'Vehicle Type:'}
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:bg-white"
                  >
                    <option value="10-Wheeler Truck">10-Wheeler Truck</option>
                    <option value="Trailor (22-Wheeler)">Trailor (22-Wheeler)</option>
                    <option value="Mazda T3500">Mazda T3500</option>
                    <option value="Flatbed Container Trailor">Flatbed Container Trailor</option>
                    <option value="6-Wheeler Shehzore">6-Wheeler Shehzore</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'ماڈل / کمپنی (Model):' : 'Model / Make:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hino 500 / ISUZU"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'مائلیج (Initial KM):' : 'Initial Odometer:'}
                  </label>
                  <input
                    type="number"
                    value={formData.currentOdometer}
                    onChange={(e) => setFormData({ ...formData, currentOdometer: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'چیسس نمبر (Chassis):' : 'Chassis Number:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CH-998821"
                    value={formData.chassisNumber}
                    onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'انجن نمبر (Engine):' : 'Engine Number:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ENG-5521"
                    value={formData.engineNumber}
                    onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'ڈرائیور منتخب کریں:' : 'Assign Driver:'}
                  </label>
                  <select
                    value={formData.assignedDriverId}
                    onChange={(e) => setFormData({ ...formData, assignedDriverId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                  >
                    <option value="">{isUrdu ? 'کوئی ڈرائیور نہیں' : 'None'}</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isUrdu ? 'ابتدائی حالت (Status):' : 'Status:'}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:bg-white"
                  >
                    <option value="AVAILABLE">{isUrdu ? 'دستیاب (Available)' : 'Available'}</option>
                    <option value="ON_TRIP">{isUrdu ? 'روٹ پر (On Trip)' : 'On Trip'}</option>
                    <option value="UNDER_REPAIR">{isUrdu ? 'ورکشاپ (Under Repair)' : 'Under Repair'}</option>
                  </select>
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
                  {isUrdu ? 'گاڑی محفوظ کریں' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
