'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Calendar,
  Fuel,
  Wrench,
  DollarSign,
  FileText,
  Navigation,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface VehicleDetailClientProps {
  vehicle: any;
  financials: {
    totalRevenue: number;
    totalExpenses: number;
    totalRepairCost: number;
    totalFuelCost: number;
    totalTripExpenses: number;
    netProfit: number;
  };
}

export default function VehicleDetailClient({ vehicle, financials }: VehicleDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Trips' | 'Expenses' | 'Fuel' | 'Maintenance' | 'Accounts' | 'Documents'>('Overview');

  const tabs = [
    { id: 'Overview', label: 'Overview', labelUrdu: 'خلاصہ', icon: <Truck className="w-4 h-4" /> },
    { id: 'Trips', label: 'Trips', labelUrdu: 'ٹرپس', icon: <Navigation className="w-4 h-4" /> },
    { id: 'Expenses', label: 'Expenses', labelUrdu: 'اخراجات', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'Fuel', label: 'Fuel', labelUrdu: 'ڈیزل', icon: <Fuel className="w-4 h-4" /> },
    { id: 'Maintenance', label: 'Maintenance', labelUrdu: 'مینٹیننس', icon: <Wrench className="w-4 h-4" /> },
    { id: 'Accounts', label: 'Accounts', labelUrdu: 'اکاؤنٹس P&L', icon: <FileText className="w-4 h-4" /> },
    { id: 'Documents', label: 'Documents', labelUrdu: 'دستاویزات', icon: <FileCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 7 Tabs Header */}
      <div className="flex items-center border-b border-slate-200 overflow-x-auto bg-slate-50/75 px-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-sky-600 text-sky-600 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75 font-urdu">({tab.labelUrdu})</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Vehicle Specifications</h3>
                <dl className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-slate-500">Registration Number</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">{vehicle.regNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Vehicle Type</dt>
                    <dd className="font-semibold text-slate-900 mt-0.5">{vehicle.vehicleType}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Chassis Number</dt>
                    <dd className="font-mono text-slate-800 mt-0.5">{vehicle.chassisNumber || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Engine Number</dt>
                    <dd className="font-mono text-slate-800 mt-0.5">{vehicle.engineNumber || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Current Odometer</dt>
                    <dd className="font-bold text-sky-700 mt-0.5">{vehicle.currentOdometer.toLocaleString()} KM</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Current Status</dt>
                    <dd className="font-semibold text-slate-900 mt-0.5">{vehicle.status}</dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Assigned Driver & Operations</h3>
                {vehicle.assignedDriver ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Driver Name:</span>
                      <span className="font-bold text-slate-900">{vehicle.assignedDriver.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-mono text-slate-800">{vehicle.assignedDriver.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">CNIC:</span>
                      <span className="font-mono text-slate-800">{vehicle.assignedDriver.cnic || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Salary:</span>
                      <span className="font-semibold text-slate-800">Rs. {vehicle.assignedDriver.monthlySalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Outstanding Advance:</span>
                      <span className="font-bold text-amber-600">Rs. {vehicle.assignedDriver.outstandingAdvance.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No driver assigned to this vehicle yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRIPS */}
        {activeTab === 'Trips' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Trip History for {vehicle.regNumber}</h3>
            {vehicle.trips.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No trips recorded for this vehicle.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-4 py-2.5">Trip Number</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">Start Date</th>
                      <th className="px-4 py-2.5 text-right">Freight Revenue</th>
                      <th className="px-4 py-2.5 text-right">Trip Expenses</th>
                      <th className="px-4 py-2.5 text-right">Net Profit</th>
                      <th className="px-4 py-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehicle.trips.map((trip: any) => (
                      <tr key={trip.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-900">{trip.tripNumber}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800">
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(trip.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-emerald-600">
                          Rs. {trip.freightRevenue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-rose-600">
                          Rs. {trip.totalExpenses.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          Rs. {trip.netProfit.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            href={`/operations/trips/${trip.id}`}
                            className="text-sky-600 hover:underline font-semibold"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EXPENSES */}
        {activeTab === 'Expenses' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Daily & Misc Expenses for {vehicle.regNumber}</h3>
            {vehicle.dailyExpenses.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No daily expenses logged for this vehicle.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">Expense Head</th>
                      <th className="px-4 py-2.5">Location</th>
                      <th className="px-4 py-2.5">Paid From</th>
                      <th className="px-4 py-2.5 text-right">Amount (رقم)</th>
                      <th className="px-4 py-2.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehicle.dailyExpenses.map((exp: any) => (
                      <tr key={exp.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600">{new Date(exp.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{exp.expenseHead}</td>
                        <td className="px-4 py-3 text-slate-600">{exp.location || '-'}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                            {exp.paidFrom}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-rose-600">
                          Rs. {exp.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{exp.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FUEL */}
        {activeTab === 'Fuel' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Fuel Entries & KM/L Average</h3>
              <span className="text-xs text-slate-500">
                Total Diesel: {vehicle.fuelLogs.reduce((s: number, f: any) => s + f.litres, 0)} Litres
              </span>
            </div>

            {vehicle.fuelLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No fuel records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">Station / Pump</th>
                      <th className="px-4 py-2.5 text-right">Litres</th>
                      <th className="px-4 py-2.5 text-right">Rate</th>
                      <th className="px-4 py-2.5 text-right">Total (Rs.)</th>
                      <th className="px-4 py-2.5 text-right">Odometer</th>
                      <th className="px-4 py-2.5 text-right">KM/L (اوسط)</th>
                      <th className="px-4 py-2.5 text-right">Cost/KM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehicle.fuelLogs.map((fuel: any) => (
                      <tr key={fuel.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600">{new Date(fuel.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{fuel.fuelStation?.name || fuel.location}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold">{fuel.litres} L</td>
                        <td className="px-4 py-3 text-right font-mono">Rs. {fuel.rate}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          Rs. {fuel.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">{fuel.odometer.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">
                          {fuel.kmPerLitre ? `${fuel.kmPerLitre.toFixed(2)} KM/L` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-700">
                          {fuel.costPerKM ? `Rs. ${fuel.costPerKM.toFixed(1)}/KM` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MAINTENANCE */}
        {activeTab === 'Maintenance' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Workshop Repairs & Parts History</h3>
            {vehicle.maintenanceLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No maintenance records logged.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5">Workshop</th>
                      <th className="px-4 py-2.5">Description</th>
                      <th className="px-4 py-2.5 text-right">Parts (پرزے)</th>
                      <th className="px-4 py-2.5 text-right">Labour (مزدوری)</th>
                      <th className="px-4 py-2.5 text-right">Total Bill</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehicle.maintenanceLogs.map((m: any) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600">{new Date(m.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                            {m.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">{m.workshop?.name || 'Local Workshop'}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{m.description}</td>
                        <td className="px-4 py-3 text-right font-mono">Rs. {m.partsCost.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-mono">Rs. {m.labourCost.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold text-rose-600">
                          Rs. {m.totalCost.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ACCOUNTS (P&L for this Vehicle) */}
        {activeTab === 'Accounts' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Vehicle Ledger & Dedicated Profit & Loss Statement
              </h3>
              <p className="text-xs text-slate-500">Comprehensive breakdown of all revenue and expense flows</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-emerald-800 pb-1 border-b border-slate-200">
                  <span>Gross Operating Freight Revenue</span>
                  <span>Rs. {financials.totalRevenue.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700">Direct Vehicle Expenses:</span>
                <div className="flex justify-between text-xs text-slate-600 pl-4">
                  <span>Diesel & Fuel Expense</span>
                  <span>- Rs. {financials.totalFuelCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 pl-4">
                  <span>Maintenance, Workshop & Parts</span>
                  <span>- Rs. {financials.totalRepairCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 pl-4">
                  <span>Trip Enroute Expenses (Toll, Loading, Labour)</span>
                  <span>- Rs. {financials.totalTripExpenses.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-slate-300 pt-3 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-900">Vehicle Net Operational Profit (خالص منافع):</span>
                <span className={financials.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  Rs. {financials.netProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DOCUMENTS */}
        {activeTab === 'Documents' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Compliance & Legal Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Route Permit</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Valid</span>
                </div>
                <p className="text-slate-500">Permit # RP-2024-9981 • All Pakistan Route</p>
                <p className="text-[11px] text-slate-400">Expires: Dec 31, 2026</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Fitness Certificate</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Valid</span>
                </div>
                <p className="text-slate-500">Cert # FC-LHR-8821</p>
                <p className="text-[11px] text-slate-400">Expires: Oct 15, 2026</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Token Tax</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Paid</span>
                </div>
                <p className="text-slate-500">Excise & Taxation Punjab</p>
                <p className="text-[11px] text-slate-400">Lifetime Paid</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Commercial Insurance</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Active</span>
                </div>
                <p className="text-slate-500">EFU General Insurance • Policy # EFU-TR-9021</p>
                <p className="text-[11px] text-slate-400">Expires: Nov 30, 2026</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
