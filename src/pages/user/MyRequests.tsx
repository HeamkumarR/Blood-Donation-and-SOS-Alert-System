import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodRequest, RequestStatus } from '../../types';
import {
  ClipboardList,
  PlusCircle,
  Building2,
  Calendar,
  Phone,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { NavigationTab } from '../../components/Sidebar';

interface MyRequestsProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const MyRequests: React.FC<MyRequestsProps> = ({ onNavigate }) => {
  const { currentUser, requests, donors } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'FULFILLED'>('ALL');

  const myRequests = requests.filter(r => r.requesterId === currentUser.id);

  const filtered = myRequests.filter(r => {
    if (filter === 'ACTIVE') return r.status === 'PENDING' || r.status === 'APPROVED' || r.status === 'MATCHED' || r.status === 'DISPATCHED';
    if (filter === 'FULFILLED') return r.status === 'FULFILLED';
    return true;
  });

  const getStatusBadge = (status: RequestStatus) => {
    const map = {
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
      APPROVED: 'bg-blue-50 text-blue-700 border-blue-200',
      MATCHED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      DISPATCHED: 'bg-purple-50 text-purple-700 border-purple-200',
      FULFILLED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return map[status] || 'bg-slate-100 text-slate-700';
  };

  const stages: RequestStatus[] = ['PENDING', 'APPROVED', 'MATCHED', 'FULFILLED'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            My Transfusion Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time clinical triage, donor cross-matching, and hospital blood delivery progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({myRequests.length})
            </button>
            <button
              onClick={() => setFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === 'ACTIVE'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('FULFILLED')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === 'FULFILLED'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fulfilled
            </button>
          </div>

          <button
            onClick={() => onNavigate('user-request-blood')}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filtered.map(req => {
          const assignedDonorsList = (req.assignedDonorIds || [])
            .map(id => donors.find(d => d.id === id))
            .filter(Boolean);

          const currentStageIndex = stages.indexOf(req.status as RequestStatus);

          return (
            <div
              key={req.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 font-mono font-bold text-sm flex items-center justify-center border border-rose-200">
                    {req.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {req.id}
                      </span>
                      <span className="text-slate-300">·</span>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {req.patientName}
                      </h3>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.hospitalName} ({req.hospitalAddress})</span>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500 block">Units Fulfillment</span>
                  <p className="text-base font-bold font-mono text-slate-900">
                    {req.unitsFulfilled} / {req.unitsNeeded}{' '}
                    <span className="text-xs font-normal text-slate-500">units</span>
                  </p>
                </div>
              </div>

              {/* Progress Stage Tracker */}
              <div className="pt-1 pb-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Clinical Dispatch Pipeline
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {stages.map((stage, idx) => {
                    const isPassed = req.status === 'FULFILLED' || (currentStageIndex >= 0 && idx <= currentStageIndex);
                    const isCurrent = req.status === stage;

                    return (
                      <div
                        key={stage}
                        className={`p-2 rounded-lg border text-center transition-colors ${
                          isCurrent
                            ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold'
                            : isPassed
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] block font-mono">{`0${idx + 1}`}</span>
                        <span className="text-xs">{stage}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rejection notice if any */}
              {req.status === 'REJECTED' && req.rejectionReason && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <strong>Triage Coordinator Note:</strong> {req.rejectionReason}
                  </div>
                </div>
              )}

              {/* Assigned Donors Section */}
              {assignedDonorsList.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Matched Donors:
                  </p>
                  <div className="space-y-1.5">
                    {assignedDonorsList.map(donor => (
                      <div
                        key={donor?.id}
                        className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-medium text-slate-900">{donor?.name}</span>
                          <span className="text-slate-400 font-mono">({donor?.distanceKm} km away)</span>
                        </div>
                        <a
                          href={`tel:${donor?.phone}`}
                          className="px-2 py-0.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{donor?.phone}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>
                  Requested: {new Date(req.requestedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </span>
                <span>
                  Required by: <strong className="text-slate-600">{new Date(req.requiredBy).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</strong>
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-8">
            <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">
              No transfusion requests found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You currently do not have any requests in this category. Submit a request if you or a family member require clinical donor matching.
            </p>
            <button
              onClick={() => onNavigate('user-request-blood')}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Create New Blood Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
