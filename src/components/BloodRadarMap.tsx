import React, { useState, useEffect } from 'react';
import { Donor, BloodGroup } from '../types';
import {
  MapPin,
  Crosshair,
  Phone,
  ShieldCheck,
  Compass,
  Heart,
  Navigation,
} from 'lucide-react';

interface BloodRadarMapProps {
  donors: Donor[];
  selectedGroup: BloodGroup | 'ALL';
  onSelectDonor?: (donor: Donor) => void;
  onRequestFromDonor?: (donor: Donor) => void;
}

export const BloodRadarMap: React.FC<BloodRadarMapProps> = ({
  donors,
  selectedGroup,
  onSelectDonor,
  onRequestFromDonor,
}) => {
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(10);
  const [activeDonor, setActiveDonor] = useState<Donor | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string }>({
    lat: 37.7749,
    lng: -122.4194,
    label: 'Downtown Center (Current Location)',
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Filter donors by blood group and radius
  const filteredDonors = donors.filter(d => {
    const matchesGroup = selectedGroup === 'ALL' || d.bloodGroup === selectedGroup;
    const matchesRadius = d.distanceKm <= maxRadiusKm;
    return matchesGroup && matchesRadius;
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Current Detected Coordinates',
        });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Radar Map Header Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-100 text-rose-700 rounded-md">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Emergency Donor Proximity Radar
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredDonors.length} compatible donors within{' '}
              <span className="font-mono font-medium">{maxRadiusKm} km</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Radius:</span>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={maxRadiusKm}
              onChange={e => setMaxRadiusKm(Number(e.target.value))}
              className="w-28 accent-rose-600 cursor-pointer"
            />
            <span className="font-mono font-semibold text-slate-800 w-10 text-right">
              {maxRadiusKm} km
            </span>
          </div>

          <button
            onClick={detectLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'GPS Center'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Surface */}
      <div className="relative h-96 w-full bg-slate-950 overflow-hidden select-none">
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

        {/* Concentric Radar Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 rounded-full border border-rose-500/20 animate-ping opacity-40" />
          <div className="absolute w-40 h-40 rounded-full border border-slate-700/60" />
          <div className="absolute w-64 h-64 rounded-full border border-slate-800/80" />
          <div className="absolute w-88 h-88 rounded-full border border-slate-800/60" />
          <div className="absolute w-full h-[1px] bg-slate-800/50" />
          <div className="absolute h-full w-[1px] bg-slate-800/50" />
        </div>

        {/* User Location Center Marker */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center">
            <Heart className="w-2.5 h-2.5 text-white fill-white" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] text-white whitespace-nowrap shadow-sm">
            You ({userLocation.label})
          </div>
        </div>

        {/* Plotted Donors */}
        {filteredDonors.map(donor => {
          // Normalize coordinate offsets based on distanceKm and maxRadiusKm
          // We project donors around center with angle seeded by latitude/longitude
          const angle = (donor.latitude * 1000 + donor.longitude * 1000) % (2 * Math.PI);
          const normalizedDistRatio = Math.min(1, donor.distanceKm / maxRadiusKm) * 0.42;
          const leftPercent = 50 + Math.cos(angle) * normalizedDistRatio * 100;
          const topPercent = 50 + Math.sin(angle) * normalizedDistRatio * 100;

          const isSelected = activeDonor?.id === donor.id;

          return (
            <button
              key={donor.id}
              onClick={() => {
                setActiveDonor(donor);
                if (onSelectDonor) onSelectDonor(donor);
              }}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-150 hover:scale-125 focus:outline-none`}
            >
              <div
                className={`relative px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-md border ${
                  donor.available
                    ? isSelected
                      ? 'bg-rose-500 text-white border-white scale-110'
                      : 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-slate-700 text-slate-300 border-slate-600'
                }`}
              >
                <span>{donor.bloodGroup}</span>
                <span className="text-[10px] opacity-80 font-mono">
                  {donor.distanceKm}km
                </span>
                {donor.verified && <ShieldCheck className="w-3 h-3 text-emerald-200" />}
              </div>
            </button>
          );
        })}

        {/* Empty state overlay inside map if no donors */}
        {filteredDonors.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 z-30">
            <div className="text-center p-6 max-w-xs">
              <Navigation className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">
                No donors found within {maxRadiusKm} km
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Expand the radius slider or select another blood group to locate emergency volunteers.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Donor Quick Action Card */}
      {activeDonor && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center font-mono text-sm border border-rose-200">
              {activeDonor.bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-900">
                  {activeDonor.name}
                </h4>
                {activeDonor.verified && (
                  <span className="text-xs text-emerald-700 font-medium">Verified</span>
                )}
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-mono">
                  {activeDonor.distanceKm} km away
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {activeDonor.city} · {activeDonor.totalDonations} donations completed ·{' '}
                <span className={activeDonor.available ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                  {activeDonor.available ? 'Available Now' : 'Resting / Busy'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${activeDonor.phone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>Direct Call</span>
            </a>

            {onRequestFromDonor && (
              <button
                onClick={() => onRequestFromDonor(activeDonor)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-xs"
              >
                <span>Request Transfusion</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
