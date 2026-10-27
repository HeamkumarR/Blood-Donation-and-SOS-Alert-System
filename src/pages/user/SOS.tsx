import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  Radio,
  MapPin,
  Ambulance,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Heart,
  Navigation,
} from 'lucide-react';
import { NavigationTab } from '../../components/Sidebar';

interface SOSProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const SOS: React.FC<SOSProps> = ({ onNavigate }) => {
  const { currentUser, sosAlerts, showToast } = useApp();

  const activeSOSList = sosAlerts.filter(s => s.status === 'ACTIVE' || s.status === 'RESPONDER_DISPATCHED');

  const handleRespondToSOS = (sosId: string, bloodGroup: string) => {
    showToast(`Thank you! Your availability has been transmitted to the trauma coordinator for incident #${sosId}.`, 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-600/20">
          <AlertOctagon className="w-7 h-7" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Regional Emergency SOS Broadcasts
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Real-time high-priority trauma and blood shortage emergency calls broadcasted by regional hospital dispatchers.
        </p>
      </div>

      {/* Admin Privilege Notification Banner */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-slate-800">
            Administrative SOS Dispatch Authority
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
            In accordance with regional emergency medical protocols, broadcasting official SOS red alerts is reserved strictly for authenticated Clinical Administrators and Blood Bank coordinators. Registered donors and patients can review ongoing emergency calls below to volunteer or respond.
          </p>
          {currentUser.role === 'ADMIN' && onNavigate && (
            <button
              onClick={() => onNavigate('admin-sos')}
              className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>Switch to Admin SOS Dispatcher</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Incidents List */}
      <div className="space-y-4">
        {activeSOSList.map(sos => {
          const isCompatible = currentUser.bloodGroup === sos.bloodGroup || currentUser.bloodGroup === 'O-';

          return (
            <div
              key={sos.id}
              className={`p-6 rounded-2xl border-2 transition-all shadow-md ${
                isCompatible
                  ? 'bg-rose-50/70 border-rose-500 ring-1 ring-rose-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center animate-pulse">
                    <Radio className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                        ACTIVE SOS #{sos.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {sos.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Urgent Transfusion Needed at {sos.location}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-2xl font-black font-mono text-rose-600">
                    {sos.bloodGroup}
                  </span>
                  <p className="text-xs text-slate-500">Required Blood Group</p>
                </div>
              </div>

              {/* Incident Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 text-xs">
                <div className="p-3 bg-white/90 rounded-xl border border-slate-200 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Incident Location</span>
                    <p className="font-semibold text-slate-900">{sos.location}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      GPS: {sos.latitude.toFixed(4)}, {sos.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white/90 rounded-xl border border-slate-200 flex items-start gap-2">
                  <Ambulance className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Dispatch Status</span>
                    <p className="font-semibold text-slate-900">
                      {sos.respondersCount} Mobile Units Alerted
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Reported: {new Date(sos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {sos.notes && (
                <div className="p-3 bg-white/90 rounded-xl border border-slate-200 text-xs text-slate-700 mb-4">
                  <span className="font-semibold text-slate-800">Dispatch Coordinator Note:</span>{' '}
                  <span className="italic">"{sos.notes}"</span>
                </div>
              )}

              {/* Action Buttons for Volunteer Donors */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {isCompatible ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                      <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                      <span>Your blood group ({currentUser.bloodGroup}) matches this emergency!</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Target group is {sos.bloodGroup} (Your group: {currentUser.bloodGroup})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('user-map')}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>View on Navigator Map</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleRespondToSOS(sos.id, sos.bloodGroup)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Can Donate & Respond</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {activeSOSList.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">
              No Active Red Emergency Alerts
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All regional trauma centers and mobile ambulance channels are operating within standard parameters. You will receive an instant notification if an emergency SOS occurs nearby.
            </p>
          </div>
        )}
      </div>

      {/* Emergency Hotlines Quick Access */}
      <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
          Emergency Clinical Hotline Numbers:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="tel:911"
            className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between hover:border-rose-400 transition-colors"
          >
            <div>
              <p className="text-xs font-bold text-slate-900">National Emergency</p>
              <p className="text-[11px] text-slate-500">Paramedic & Police</p>
            </div>
            <span className="font-mono font-bold text-rose-600 text-base">911</span>
          </a>

          <a
            href="tel:180025663"
            className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between hover:border-rose-400 transition-colors"
          >
            <div>
              <p className="text-xs font-bold text-slate-900">PulsePoint Operations</p>
              <p className="text-[11px] text-slate-500">Blood Bank Hotline</p>
            </div>
            <span className="font-mono font-bold text-rose-600 text-xs">1-800-BLOOD</span>
          </a>

          <a
            href="tel:112"
            className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between hover:border-rose-400 transition-colors"
          >
            <div>
              <p className="text-xs font-bold text-slate-900">Mobile Paramedics</p>
              <p className="text-[11px] text-slate-500">Direct Trauma Line</p>
            </div>
            <span className="font-mono font-bold text-rose-600 text-base">112</span>
          </a>
        </div>
      </div>
    </div>
  );
};
