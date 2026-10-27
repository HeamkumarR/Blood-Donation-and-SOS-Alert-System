import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, SOSStatus } from '../../types';
import {
  ShieldAlert,
  AlertOctagon,
  Ambulance,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Radio,
  PlusCircle,
  X,
  Crosshair,
} from 'lucide-react';

export const SOSRequests: React.FC = () => {
  const { sosAlerts, dispatchSOSResponder, resolveSOS, cancelSOS, triggerSOS } = useApp();
  const [filter, setFilter] = useState<'ALL' | SOSStatus>('ALL');

  // Admin Broadcast Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [location, setLocation] = useState('Anna Flyover / Gemini Circle, Mount Road, Chennai');
  const [notes, setNotes] = useState('');
  const [latitude, setLatitude] = useState(13.0526);
  const [longitude, setLongitude] = useState(80.2522);
  const [isLocating, setIsLocating] = useState(false);

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const filteredSOS = sosAlerts.filter(s => filter === 'ALL' || s.status === filter);

  const getStatusBadge = (status: SOSStatus) => {
    const map = {
      ACTIVE: 'bg-rose-600 text-white animate-pulse',
      RESPONDER_DISPATCHED: 'bg-blue-600 text-white',
      RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      CANCELLED: 'bg-slate-100 text-slate-500 border-slate-300',
    };
    return map[status] || 'bg-slate-100 text-slate-700';
  };

  const handleAdminBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSOS({
      bloodGroup,
      location,
      notes: notes || 'Emergency high-priority blood dispatch requested by central triage.',
      latitude,
      longitude,
    });
    setIsModalOpen(false);
    setNotes('');
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocation(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Admin Coordinates)`);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { timeout: 7000 }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Emergency SOS Alert Console & Dispatch
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authorize and broadcast regional red alerts, dispatch mobile ambulance delivery, and manage active incident triage.
          </p>
        </div>

        {/* Admin Broadcast Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-98 animate-pulse"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Broadcast Regional SOS</span>
          </button>
        </div>
      </div>

      {/* Filter and stats row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-500">
          <span>Total Incidents: {sosAlerts.length}</span>
          <span>·</span>
          <span className="text-rose-600 font-bold">
            {sosAlerts.filter(s => s.status === 'ACTIVE').length} Live Active
          </span>
        </div>

        {/* Filter pills */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium overflow-x-auto">
          {(['ALL', 'ACTIVE', 'RESPONDER_DISPATCHED', 'RESOLVED', 'CANCELLED'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                filter === s
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Cards List */}
      <div className="space-y-4">
        {filteredSOS.map(sos => {
          const isActive = sos.status === 'ACTIVE';

          return (
            <div
              key={sos.id}
              className={`rounded-2xl border p-5 transition-all shadow-xs ${
                isActive
                  ? 'bg-rose-50/50 border-rose-400 ring-1 ring-rose-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${
                      isActive ? 'bg-rose-600 animate-ping' : 'bg-slate-800'
                    }`}
                  >
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {sos.id}
                      </span>
                      <span className="text-slate-300">·</span>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {sos.userName}
                      </h3>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${getStatusBadge(
                          sos.status
                        )}`}
                      >
                        {sos.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Contact: {sos.userPhone} · Reported:{' '}
                      {new Date(sos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="px-3 py-1 bg-rose-100 border border-rose-200 rounded-lg text-rose-800 text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider block">
                      Target Group
                    </span>
                    <span className="font-mono font-extrabold text-base">
                      {sos.bloodGroup}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details & Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Location</span>
                    <p className="font-semibold text-slate-800">{sos.location}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      GPS: {sos.latitude.toFixed(4)}, {sos.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
                  <Ambulance className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Emergency Response</span>
                    <p className="font-semibold text-slate-800">
                      {sos.respondersCount} Units Dispatched
                    </p>
                    {sos.dispatchedAt && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Dispatched: {new Date(sos.dispatchedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Triage Dispatch Notes</span>
                    <p className="text-slate-700 italic">
                      "{sos.notes || 'Emergency blood support required on-site.'}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`tel:${sos.userPhone}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call Emergency Line</span>
                </a>

                <div className="flex items-center gap-2">
                  {sos.status === 'ACTIVE' && (
                    <button
                      onClick={() => dispatchSOSResponder(sos.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Ambulance className="w-3.5 h-3.5" />
                      <span>Dispatch Responder Unit</span>
                    </button>
                  )}

                  {(sos.status === 'ACTIVE' || sos.status === 'RESPONDER_DISPATCHED') && (
                    <>
                      <button
                        onClick={() => resolveSOS(sos.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Resolve Emergency</span>
                      </button>

                      <button
                        onClick={() => cancelSOS(sos.id)}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {sos.status === 'RESOLVED' && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Incident Successfully Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredSOS.length === 0 && (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-8">
            <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">
              No incidents in this status
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select another filter tab or use the broadcast button above to issue a verified emergency alert.
            </p>
          </div>
        )}
      </div>

      {/* ADMIN BROADCAST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Authorize & Broadcast Regional Emergency SOS
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              This initiates an official red alert broadcast to all compatible donors within a 15 km radius and alerts emergency ambulances.
            </p>

            <form onSubmit={handleAdminBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  1. Required Blood Group *
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {bloodGroups.map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 rounded-lg text-xs font-bold font-mono transition-all border ${
                        bloodGroup === bg
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    2. Trauma / Emergency Location *
                  </label>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <Crosshair className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Acquiring...' : 'Auto-fill GPS'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. St. Jude Emergency Bay / Highway 101 Mile 14"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  3. Clinical Urgency & Trauma Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Critical trauma resuscitation. 3 units packed RBCs required on-site immediately."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Confirm & Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
