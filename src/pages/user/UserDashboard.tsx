import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { BloodCompatibilityMatrix } from '../../components/BloodCompatibilityMatrix';
import {
  AlertOctagon,
  PlusCircle,
  Search,
  Heart,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { NavigationTab } from '../../components/Sidebar';

interface UserDashboardProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const { currentUser, donors, requests, sosAlerts, donationHistory } = useApp();

  const myRequests = requests.filter(r => r.requesterId === currentUser.id);
  const activeSOS = sosAlerts.find(s => s.status === 'ACTIVE');
  const availableDonorsCount = donors.filter(d => d.available).length;
  const myDonationCount = donationHistory.filter(d => d.donorId === currentUser.id).length;

  return (
    <div className="space-y-6">
      {/* Critical SOS Active Alert Banner if any SOS is ongoing */}
      {activeSOS && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center animate-ping">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-700 bg-rose-200/80 px-2 py-0.5 rounded">
                  LIVE SOS #{activeSOS.id}
                </span>
                <span className="text-xs font-semibold text-rose-950">
                  {activeSOS.bloodGroup} Blood Needed Urgently
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5">
                Location: {activeSOS.location} · {activeSOS.respondersCount} medical responders alerted
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('user-sos')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <span>View Emergency Dispatch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Welcome & 3-Action Ribbon */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span>{currentUser.city} Network</span>
              <span>·</span>
              <span>Blood Group: <strong className="font-mono text-slate-900">{currentUser.bloodGroup}</strong></span>
              {currentUser.verified && (
                <>
                  <span>·</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Verified Donor
                  </span>
                </>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Access emergency blood donor dispatch, initiate instant SOS broadcasts, or manage pending clinical requests across verified regional hospitals.
            </p>
          </div>

          {/* Core Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('user-map')}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs group"
            >
              <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span>Users Map & Navigator</span>
            </button>

            <button
              onClick={() => onNavigate('user-find-donors')}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-slate-600" />
              <span>Find Donors</span>
            </button>

            <button
              onClick={() => onNavigate('user-request-blood')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-rose-600" />
              <span>Request Blood</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clean Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Available Donors"
          value={availableDonorsCount}
          sublabel="Within regional radius ready to respond"
          icon={Heart}
          trend="+3 today"
          onClick={() => onNavigate('user-find-donors')}
        />
        <StatCard
          label="My Requests"
          value={myRequests.length}
          sublabel={`${myRequests.filter(r => r.status === 'MATCHED' || r.status === 'APPROVED').length} currently in clinical triage`}
          icon={Activity}
          onClick={() => onNavigate('user-my-requests')}
        />
        <StatCard
          label="Lives Impacted"
          value={myDonationCount * 3}
          sublabel={`${myDonationCount} personal whole blood donations logged`}
          icon={ShieldCheck}
          onClick={() => onNavigate('user-donation-history')}
        />
        <StatCard
          label="Active SOS Alerts"
          value={sosAlerts.filter(s => s.status === 'ACTIVE').length}
          sublabel="Urgent local emergency trauma events"
          icon={AlertOctagon}
          urgent={sosAlerts.some(s => s.status === 'ACTIVE')}
          onClick={() => onNavigate('user-sos')}
        />
      </div>

      {/* Main Grid: My Active Requests & Quick Proximity Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Requests Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  My Active Transfusion Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Track real-time clinical verification, donor match, and hospital delivery
                </p>
              </div>
              <button
                onClick={() => onNavigate('user-my-requests')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myRequests.length === 0 ? (
              <div className="py-10 text-center">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">No active blood requests</p>
                <p className="text-xs text-slate-400 mt-1">
                  Need whole blood or platelets? Submit an urgent hospital request in under 60 seconds.
                </p>
                <button
                  onClick={() => onNavigate('user-request-blood')}
                  className="mt-4 px-3 py-1.5 bg-rose-600 text-white text-xs font-medium rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Create Request
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myRequests.slice(0, 3).map(req => {
                  const statusColors: Record<string, string> = {
                    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
                    APPROVED: 'bg-blue-50 text-blue-700 border-blue-200',
                    MATCHED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    FULFILLED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
                  };

                  return (
                    <div key={req.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold text-xs flex items-center justify-center border border-slate-200">
                          {req.bloodGroup}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-900">
                              {req.patientName}
                            </span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs font-mono text-slate-500">
                              {req.unitsFulfilled}/{req.unitsNeeded} units
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {req.hospitalName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                            statusColors[req.status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {req.status}
                        </span>
                        <button
                          onClick={() => onNavigate('user-my-requests')}
                          className="text-xs text-slate-400 hover:text-slate-700"
                        >
                          Details →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Blood Compatibility Guide */}
          <BloodCompatibilityMatrix />
        </div>

        {/* Right 1 Col: Nearby Donors Spotlight */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Nearby Ready Donors
                </h3>
              </div>
              <button
                onClick={() => onNavigate('user-find-donors')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Radar View
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {donors.filter(d => d.available).length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">No active donors registered yet</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    New registered donors in Chennai & Tamil Nadu will appear on this radar.
                  </p>
                </div>
              ) : (
                donors
                  .filter(d => d.available)
                  .slice(0, 5)
                  .map(donor => (
                    <div
                      key={donor.id}
                      className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-800">
                          {donor.bloodGroup}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold text-slate-900">
                              {donor.name}
                            </p>
                            {donor.verified && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {donor.distanceKm} km away · {donor.city}
                          </p>
                        </div>
                      </div>

                      <a
                        href={`tel:${donor.phone}`}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                      >
                        Call
                      </a>
                    </div>
                  ))
              )}
            </div>

            <button
              onClick={() => onNavigate('user-find-donors')}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors text-center"
            >
              Open Full Proximity Radar Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
