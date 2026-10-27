import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import {
  Users,
  HeartHandshake,
  AlertOctagon,
  FileText,
  Activity,
  ArrowRight,
  CheckCircle,
  XCircle,
  Ambulance,
  Building2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { NavigationTab } from '../../components/Sidebar';

interface AdminDashboardProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    donors,
    requests,
    sosAlerts,
    bloodStock,
    approveRequest,
    dispatchSOSResponder,
    resolveSOS,
  } = useApp();

  const activeSOS = sosAlerts.filter(s => s.status === 'ACTIVE');
  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const criticalStock = bloodStock.filter(s => s.status === 'CRITICAL');
  const availableDonors = donors.filter(d => d.available).length;

  return (
    <div className="space-y-6">
      {/* Critical Alert Bar if live SOS active */}
      {activeSOS.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-400 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-700 bg-rose-200 px-2 py-0.5 rounded">
                  {activeSOS.length} EMERGENCY SOS INCIDENTS LIVE
                </span>
                <span className="text-xs font-semibold text-rose-900">
                  Immediate Dispatch Required
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5">
                {activeSOS[0].userName} · {activeSOS[0].bloodGroup} Needed at {activeSOS[0].location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatchSOSResponder(activeSOS[0].id)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Ambulance className="w-3.5 h-3.5" />
              <span>Dispatch Medical Unit</span>
            </button>
            <button
              onClick={() => onNavigate('admin-sos')}
              className="px-3 py-1.5 bg-white border border-rose-300 text-rose-800 text-xs font-semibold rounded-lg hover:bg-rose-100 transition-colors"
            >
              Triage Console
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Clinical Triage & Administration Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time regional blood transfusion coordination, active emergency SOS incidents, and donor pool supervision.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('admin-requests')}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Review Blood Requests ({pendingRequests.length})</span>
          </button>
        </div>
      </div>

      {/* Operational Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Registered Donors"
          value={donors.length}
          sublabel={`${availableDonors} currently active & ready`}
          icon={HeartHandshake}
          onClick={() => onNavigate('admin-donors')}
        />
        <StatCard
          label="Pending Triage"
          value={pendingRequests.length}
          sublabel="Requires clinical approval & matching"
          icon={FileText}
          urgent={pendingRequests.length > 0}
          onClick={() => onNavigate('admin-requests')}
        />
        <StatCard
          label="Live SOS Alerts"
          value={activeSOS.length}
          sublabel="High priority red trauma calls"
          icon={AlertOctagon}
          urgent={activeSOS.length > 0}
          onClick={() => onNavigate('admin-sos')}
        />
        <StatCard
          label="Critical Blood Reserves"
          value={criticalStock.length}
          sublabel={`${criticalStock.map(s => s.group).join(', ') || 'All Optimal'} under 8 units`}
          icon={Activity}
          urgent={criticalStock.length > 0}
          onClick={() => onNavigate('admin-reports')}
        />
      </div>

      {/* Main Grid: Urgent Triage Requests + Blood Inventory Quick Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pending Blood Requests Triage Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Urgent Transfusion Triage Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Patient requests pending approval or donor cross-matching
                </p>
              </div>
              <button
                onClick={() => onNavigate('admin-requests')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <span>View all ({requests.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">
                  Triage queue is clear
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  All submitted transfusion requests have been reviewed by coordinators.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingRequests.slice(0, 4).map(req => (
                  <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 font-mono font-bold text-xs flex items-center justify-center border border-rose-200 shrink-0">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700">
                            {req.id}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs font-semibold text-slate-900">
                            {req.patientName}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              req.urgency === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {req.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {req.unitsNeeded} Units needed at {req.hospitalName} ({req.city})
                        </p>
                        {req.notes && (
                          <p className="text-[11px] text-slate-400 italic mt-0.5">
                            "{req.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => approveRequest(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => onNavigate('admin-requests')}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active SOS Tracker Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Real-Time SOS Incident Monitor
                </h3>
              </div>
              <button
                onClick={() => onNavigate('admin-sos')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Manage Incidents →
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {sosAlerts.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <p className="font-semibold text-slate-700">No active SOS incidents</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Emergency response network is active and clear.
                  </p>
                </div>
              ) : (
                sosAlerts.slice(0, 3).map(sos => (
                  <div
                    key={sos.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      sos.status === 'ACTIVE'
                        ? 'bg-rose-50/70 border-rose-300'
                        : sos.status === 'RESPONDER_DISPATCHED'
                        ? 'bg-blue-50/60 border-blue-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {sos.id}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-bold font-mono text-rose-700">
                          {sos.bloodGroup} Blood
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-semibold text-slate-800">
                          {sos.userName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {sos.location} · {sos.respondersCount} Units Assigned
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {sos.status === 'ACTIVE' && (
                        <button
                          onClick={() => dispatchSOSResponder(sos.id)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Ambulance className="w-3.5 h-3.5" />
                          <span>Dispatch Unit</span>
                        </button>
                      )}
                      {sos.status === 'RESPONDER_DISPATCHED' && (
                        <button
                          onClick={() => resolveSOS(sos.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Resolve</span>
                        </button>
                      )}
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          sos.status === 'ACTIVE'
                            ? 'bg-rose-600 text-white'
                            : sos.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {sos.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Regional Blood Reserves Status */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Blood Reserves Inventory
              </h3>
              <button
                onClick={() => onNavigate('admin-reports')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Restock →
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {bloodStock.map(stock => {
                const maxCap = 50;
                const percentage = Math.min(100, Math.round((stock.unitsAvailable / maxCap) * 100));

                return (
                  <div key={stock.group} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-800">
                        {stock.group}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-900">
                          {stock.unitsAvailable} units
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            stock.status === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-700'
                              : stock.status === 'LOW'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {stock.status}
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full rounded-full transition-all ${
                          stock.status === 'CRITICAL'
                            ? 'bg-rose-600'
                            : stock.status === 'LOW'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Total Units in Reserve:</span>
              <strong className="font-mono text-slate-900 text-sm">
                {bloodStock.reduce((acc, curr) => acc + curr.unitsAvailable, 0)} Units
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
