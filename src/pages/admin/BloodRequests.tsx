import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, BloodRequest, RequestStatus, UrgencyLevel } from '../../types';
import {
  FileText,
  Search,
  CheckCircle,
  XCircle,
  UserCheck,
  Building2,
  Calendar,
  AlertTriangle,
  X,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const BloodRequests: React.FC = () => {
  const {
    requests,
    donors,
    approveRequest,
    rejectRequest,
    matchDonorToRequest,
    fulfillRequest,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | RequestStatus>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<'ALL' | UrgencyLevel>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Insufficient clinical cross-match data');
  const [matchingRequestId, setMatchingRequestId] = useState<string | null>(null);

  const filteredRequests = requests.filter(r => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'ALL' || r.urgency === urgencyFilter;
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesUrgency && matchesSearch;
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

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRequestId) return;
    rejectRequest(rejectingRequestId, rejectionReason);
    setRejectingRequestId(null);
  };

  const activeRequestForMatching = requests.find(r => r.id === matchingRequestId);
  const compatibleDonorsForMatching = activeRequestForMatching
    ? donors.filter(d => d.bloodGroup === activeRequestForMatching.bloodGroup && d.available)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Transfusion Requests & Clinical Triage
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review hospital blood requests, authorize clinical transfers, and assign available regional donors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
          <span>{requests.length} total</span>
          <span>·</span>
          <span className="text-amber-700">
            {requests.filter(r => r.status === 'PENDING').length} pending
          </span>
          <span>·</span>
          <span className="text-emerald-700">
            {requests.filter(r => r.status === 'FULFILLED').length} fulfilled
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'PENDING', 'APPROVED', 'MATCHED', 'FULFILLED', 'REJECTED'] as const).map(
              s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                    statusFilter === s
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              )
            )}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ID, hospital, patient..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Request ID & Patient</th>
                <th className="px-4 py-3">Blood Group</th>
                <th className="px-4 py-3">Units Needed</th>
                <th className="px-4 py-3">Hospital Facility</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-800">
                          {req.id}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="font-semibold text-slate-900">
                          {req.patientName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Requester: {req.requesterName} ({req.requesterPhone})
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-sm">
                      {req.bloodGroup}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-mono font-semibold text-slate-900">
                      {req.unitsFulfilled} / {req.unitsNeeded} units
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div>
                      <span className="font-medium text-slate-800">
                        {req.hospitalName}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {req.hospitalAddress} · {req.city}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        req.urgency === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : req.urgency === 'URGENT'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {req.urgency}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {req.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => approveRequest(req.id)}
                            title="Approve Request"
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md border border-emerald-300 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setRejectingRequestId(req.id)}
                            title="Reject Request"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md border border-rose-300 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {(req.status === 'APPROVED' || req.status === 'MATCHED') && (
                        <>
                          <button
                            onClick={() => setMatchingRequestId(req.id)}
                            className="px-2.5 py-1 text-[11px] font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded transition-colors"
                          >
                            Assign Donor
                          </button>
                          <button
                            onClick={() => fulfillRequest(req.id)}
                            className="px-2.5 py-1 text-[11px] font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors shadow-xs"
                          >
                            Fulfill
                          </button>
                        </>
                      )}

                      {req.status === 'FULFILLED' && (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                          <CheckCircle className="w-3.5 h-3.5" /> Transfused
                        </span>
                      )}

                      {req.status === 'REJECTED' && (
                        <span className="text-[11px] text-slate-400">Rejected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No requests found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MATCH DONOR MODAL */}
      {matchingRequestId && activeRequestForMatching && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 shadow-2xl relative">
            <button
              onClick={() => setMatchingRequestId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Match Volunteer Donor to {activeRequestForMatching.id}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Patient: <strong>{activeRequestForMatching.patientName}</strong> · Group required:{' '}
              <strong className="font-mono text-rose-700">
                {activeRequestForMatching.bloodGroup}
              </strong>
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {compatibleDonorsForMatching.map(donor => (
                <div
                  key={donor.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">{donor.name}</span>
                      {donor.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-slate-500 font-mono text-[11px]">
                      {donor.phone} · {donor.distanceKm} km away · {donor.totalDonations} donations
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      matchDonorToRequest(activeRequestForMatching.id, donor.id);
                      setMatchingRequestId(null);
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors text-xs"
                  >
                    Assign
                  </button>
                </div>
              ))}

              {compatibleDonorsForMatching.length === 0 && (
                <p className="py-6 text-center text-xs text-slate-500">
                  No active {activeRequestForMatching.bloodGroup} donors available in current radius.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECT REQUEST MODAL */}
      {rejectingRequestId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 shadow-2xl relative">
            <button
              onClick={() => setRejectingRequestId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Decline Blood Transfusion Request
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Specify the clinical or administrative reason for declining this request.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Rejection *
                </label>
                <select
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Insufficient clinical cross-match data">
                    Insufficient clinical cross-match data
                  </option>
                  <option value="Hospital inventory fulfilled via central supply">
                    Hospital inventory fulfilled via central supply
                  </option>
                  <option value="Invalid clinical facility credentials">
                    Invalid clinical facility credentials
                  </option>
                  <option value="Duplicate emergency request submission">
                    Duplicate emergency request submission
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingRequestId(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
