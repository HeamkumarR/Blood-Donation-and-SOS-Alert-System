import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, Donor } from '../../types';
import { GoogleMapsGPS } from '../../components/GoogleMapsGPS';
import {
  MapPin,
  Crosshair,
  Navigation,
  Phone,
  ShieldCheck,
  Building2,
  AlertOctagon,
  Heart,
  Layers,
  Send,
  Compass,
  ArrowRight,
  Car,
  CheckCircle2,
  CalendarCheck,
  ExternalLink,
  Info,
} from 'lucide-react';
import { NavigationTab } from '../../components/Sidebar';

interface UsersMapProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectDonorForRequest?: (donor: Donor) => void;
}

export const UsersMap: React.FC<UsersMapProps> = ({
  onNavigate,
  onSelectDonorForRequest,
}) => {
  const { currentUser, donors, sosAlerts, bloodBanks } = useApp();

  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(15);
  const [showHospitals, setShowHospitals] = useState<boolean>(true);
  const [showSOS, setShowSOS] = useState<boolean>(true);
  const [mapEngine, setMapEngine] = useState<'GOOGLE_MAPS' | 'TACTICAL_RADAR'>('GOOGLE_MAPS');

  // Active Selected Entity & Route State
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  const bloodGroups: (BloodGroup | 'ALL')[] = [
    'ALL',
    'O-',
    'O+',
    'A-',
    'A+',
    'B-',
    'B+',
    'AB-',
    'AB+',
  ];

  // Filtered Donors based on selection & distance
  const filteredDonors = useMemo(() => {
    return donors.filter(d => {
      const matchGroup = selectedGroup === 'ALL' || d.bloodGroup === selectedGroup;
      const matchRadius = d.distanceKm <= maxRadiusKm;
      return matchGroup && matchRadius;
    });
  }, [donors, selectedGroup, maxRadiusKm]);

  // Find Nearest Compatible Donor
  const nearestDonor = useMemo(() => {
    const available = filteredDonors.filter(d => d.available);
    if (available.length === 0) return null;
    return available.reduce((prev, curr) => (curr.distanceKm < prev.distanceKm ? curr : prev));
  }, [filteredDonors]);

  const handleFindNearestDonor = () => {
    if (nearestDonor) {
      setSelectedDonor(nearestDonor);
      setIsNavigating(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>e-RaktKosh GPS Telemetry & Donor Proximity</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Interactive GPS Donor Map & Navigator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time geolocation tracking to discover the closest blood donors, certified blood centers, and live emergency incidents.
          </p>
        </div>

        {/* 1-Click Find Nearest Donor Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleFindNearestDonor}
            disabled={!nearestDonor}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-rose-600/20 active:scale-98"
          >
            <Navigation className="w-4 h-4 animate-bounce" />
            <span>Find Nearest Donor</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Blood group selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">Blood:</span>
            {bloodGroups.map(bg => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors shrink-0 ${
                  selectedGroup === bg
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          {/* Map Engine Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setMapEngine('GOOGLE_MAPS')}
              className={`px-3 py-1 rounded-md transition-colors ${
                mapEngine === 'GOOGLE_MAPS'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Google Maps GPS
            </button>
            <button
              onClick={() => setMapEngine('TACTICAL_RADAR')}
              className={`px-3 py-1 rounded-md transition-colors ${
                mapEngine === 'TACTICAL_RADAR'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tactical Grid
            </button>
          </div>
        </div>

        {/* Distance Range & Filter Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span>Radius Range:</span>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={maxRadiusKm}
              onChange={e => setMaxRadiusKm(Number(e.target.value))}
              className="w-32 accent-rose-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-slate-800">{maxRadiusKm} km</span>
            <span className="text-slate-400">({filteredDonors.length} donors in range)</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showHospitals}
                onChange={e => setShowHospitals(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
              />
              <span>Blood Centers</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showSOS}
                onChange={e => setShowSOS(e.target.checked)}
                className="w-3.5 h-3.5 text-rose-600 rounded border-slate-300"
              />
              <span>Emergency SOS</span>
            </label>
          </div>
        </div>
      </div>

      {/* MAP VIEWPORT */}
      {mapEngine === 'GOOGLE_MAPS' ? (
        <GoogleMapsGPS
          donors={filteredDonors}
          bloodBanks={showHospitals ? bloodBanks : []}
          sosAlerts={showSOS ? sosAlerts : []}
          selectedGroup={selectedGroup}
          selectedDonor={selectedDonor}
          onSelectDonor={donor => {
            setSelectedDonor(donor);
            setIsNavigating(true);
          }}
          onRequestFromDonor={donor => {
            if (onSelectDonorForRequest) onSelectDonorForRequest(donor);
            onNavigate('user-request-blood');
          }}
        />
      ) : (
        <div className="relative h-[480px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md select-none bg-slate-900">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-36 h-36 rounded-full border border-rose-500/20 animate-ping opacity-30" />
            <div className="absolute w-64 h-64 rounded-full border border-slate-700/50" />
            <div className="absolute w-96 h-96 rounded-full border border-slate-800/60" />
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center">
              <Heart className="w-3 h-3 text-white fill-white" />
            </div>
            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/95 border border-slate-700 text-[11px] font-semibold text-white whitespace-nowrap shadow-md">
              You ({currentUser.city})
            </div>
          </div>

          {filteredDonors.slice(0, 8).map((donor, idx) => {
            const angle = (idx * (360 / 8)) * (Math.PI / 180);
            const dist = 30 + (idx % 3) * 12;
            const left = 50 + dist * Math.cos(angle);
            const top = 50 + dist * Math.sin(angle);

            return (
              <button
                key={donor.id}
                onClick={() => {
                  setSelectedDonor(donor);
                  setIsNavigating(true);
                }}
                style={{ left: `${left}%`, top: `${top}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all hover:scale-110"
              >
                <div className={`px-2 py-0.5 rounded-lg text-xs font-bold shadow-md border ${
                  selectedDonor?.id === donor.id
                    ? 'bg-rose-600 text-white border-white ring-2 ring-rose-400'
                    : donor.available
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-slate-700 text-slate-300 border-slate-600'
                }`}>
                  {donor.bloodGroup} · {donor.distanceKm}km
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* SELECTED DONOR ROUTE & NAVIGATION CARD */}
      {selectedDonor && isNavigating && (
        <div className="bg-white rounded-2xl border-2 border-rose-400 p-5 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 font-mono font-bold text-lg flex items-center justify-center border border-rose-200 shrink-0">
                {selectedDonor.bloodGroup}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedDonor.name}
                  </h3>
                  {selectedDonor.verified && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Donor
                    </span>
                  )}
                  {nearestDonor?.id === selectedDonor.id && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Nearest Compatible
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">
                  {selectedDonor.phone} · {selectedDonor.city} · {selectedDonor.totalDonations} completed donations
                </p>
              </div>
            </div>

            {/* Travel Time & Road Distance Preview */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Distance</span>
                <span className="text-sm font-bold text-slate-900">
                  {selectedDonor.distanceKm} km
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 block uppercase flex items-center gap-1">
                  <Car className="w-3 h-3 text-slate-500" /> Drive ETA
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {Math.max(2, Math.round(selectedDonor.distanceKm * 2.5))} mins
                </span>
              </div>
            </div>
          </div>

          {/* Turn-by-Turn Navigation Steps */}
          <div className="py-3 text-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-rose-600" />
              <span>Turn-by-Turn GPS Guidance:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                <span className="font-mono text-slate-400 block text-[10px]">Step 1</span>
                <span>Head toward nearest arterial corridor (0.4 km)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                <span className="font-mono text-slate-400 block text-[10px]">Step 2</span>
                <span>Follow directions toward {selectedDonor.city} trauma perimeter</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                <span className="font-mono text-slate-400 block text-[10px]">Step 3</span>
                <span>Arrive at donor coordinates / rendezvous clinical point</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <a
                href={`tel:${selectedDonor.phone}`}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>Call ({selectedDonor.phone})</span>
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDonor.latitude},${selectedDonor.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Google Maps App</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onSelectDonorForRequest) onSelectDonorForRequest(selectedDonor);
                  onNavigate('user-request-blood');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Blood Transfusion</span>
              </button>
              <button
                onClick={() => {
                  setSelectedDonor(null);
                  setIsNavigating(false);
                }}
                className="px-3 py-2 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
