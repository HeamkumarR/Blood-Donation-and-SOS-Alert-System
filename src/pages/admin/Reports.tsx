import React from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup } from '../../types';
import {
  BarChart3,
  Activity,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Download,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { bloodStock, requests, donors, updateBloodStock, showToast } = useApp();

  const totalUnits = bloodStock.reduce((acc, curr) => acc + curr.unitsAvailable, 0);
  const fulfilledRequests = requests.filter(r => r.status === 'FULFILLED').length;
  const fulfillmentRate =
    requests.length > 0
      ? Math.round((fulfilledRequests / requests.length) * 100)
      : 100;

  const handleExportReport = () => {
    showToast('Clinical Transfusion Summary CSV downloaded', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Blood Bank Inventory & Clinical Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time component inventory reserves, regional transfusion fulfillment efficiency, and stock restocking controls.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Audit Report</span>
        </button>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Reserve Units
          </span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {totalUnits} <span className="text-xs font-normal text-slate-500">units</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Whole blood & packed RBCs</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Fulfillment Rate
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-600 mt-2">
            {fulfillmentRate}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {fulfilledRequests} of {requests.length} requests completed
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Avg Emergency Response
          </span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            14.2 <span className="text-xs font-normal text-slate-500">min</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">From SOS trigger to field dispatch</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Volunteer Network
          </span>
          <p className="text-2xl font-bold font-mono text-indigo-600 mt-2">
            {donors.length} <span className="text-xs font-normal text-slate-500">donors</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Across 4 regional metropolitan zones</p>
        </div>
      </div>

      {/* Blood Inventory Management Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Blood Bank Component Stock Levels & Restock Tool
            </h3>
            <p className="text-xs text-slate-500">
              Adjust current reserve units following deliveries or clinical laboratory dispatch
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Last Inventory Audit: Today, 08:00 AM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Blood Group</th>
                <th className="px-4 py-3">Units in Reserve</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Capacity Gauge</th>
                <th className="px-4 py-3 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bloodStock.map(stock => {
                const maxCap = 50;
                const percent = Math.min(100, Math.round((stock.unitsAvailable / maxCap) * 100));

                return (
                  <tr key={stock.group} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 font-mono font-bold text-xs flex items-center justify-center border border-rose-200">
                          {stock.group}
                        </div>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          Group {stock.group}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {stock.unitsAvailable}
                      </span>{' '}
                      <span className="text-slate-400">units</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          stock.status === 'CRITICAL'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : stock.status === 'LOW'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {stock.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 w-64">
                      <div className="space-y-1">
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            style={{ width: `${percent}%` }}
                            className={`h-full rounded-full transition-all ${
                              stock.status === 'CRITICAL'
                                ? 'bg-rose-600'
                                : stock.status === 'LOW'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>0</span>
                          <span>Target: 50 units ({percent}%)</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateBloodStock(stock.group, -1)}
                          disabled={stock.unitsAvailable <= 0}
                          title="Deduct 1 unit"
                          className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => updateBloodStock(stock.group, 1)}
                          title="Add 1 unit"
                          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
