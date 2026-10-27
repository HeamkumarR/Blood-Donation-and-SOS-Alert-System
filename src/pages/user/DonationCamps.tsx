import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DonationCamp } from '../../types';
import {
  Calendar,
  MapPin,
  Clock,
  Phone,
  Building2,
  Users,
  CheckCircle2,
  Search,
  Check,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { NavigationTab } from '../../components/Sidebar';

interface DonationCampsProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const DonationCamps: React.FC<DonationCampsProps> = ({ onNavigate }) => {
  const { donationCamps, bookCampSlot } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCamps = donationCamps.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>Voluntary Blood Donation Drive Network</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Blood Donation Camps & Drives Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover upcoming certified voluntary donation camps organized by Red Cross, National Blood Transfusion Council, and partner universities.
          </p>
        </div>

        <button
          onClick={() => onNavigate('user-map')}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span>Find Camps on Map</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by camp name, venue, or organizer..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <span className="text-xs font-mono text-slate-500 hidden sm:block">
          {filteredCamps.length} camps listed
        </span>
      </div>

      {/* Camps Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCamps.map(camp => {
          const slotsLeft = camp.totalSlots - camp.bookedSlots;
          const percentage = Math.round((camp.bookedSlots / camp.totalSlots) * 100);

          return (
            <div
              key={camp.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                camp.userBooked
                  ? 'border-emerald-400 ring-2 ring-emerald-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
                    <span>{camp.id}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      camp.status === 'Upcoming'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">
                  {camp.name}
                </h3>
                <p className="text-xs text-rose-700 font-medium mt-0.5">
                  Organized by: {camp.organizer}
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{camp.venue}, {camp.city}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono font-semibold text-slate-900">{camp.date}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 font-mono">{camp.timeRange}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${camp.contactNumber}`} className="font-mono hover:underline">
                      {camp.contactNumber}
                    </a>
                  </div>
                </div>

                {/* Slots Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Slot Capacity:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {camp.bookedSlots} / {camp.totalSlots} booked ({slotsLeft} slots remaining)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-full rounded-full bg-rose-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Slot Booking Button */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => bookCampSlot(camp.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs ${
                    camp.userBooked
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {camp.userBooked ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Slot Confirmed (Click to Cancel)</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Book Free Donor Appointment Slot</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* eRaktKosh Voluntary Donor FAQ / Checklist */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-xs text-slate-600 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Voluntary Blood Donor Guidelines (National Blood Policy & e-RaktKosh Standards)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px] text-slate-500 pt-2">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Age & Weight</strong>
            Age between 18–65 years and body weight $\ge$ 45 kg (whole blood 350ml) or $\ge$ 50 kg (450ml).
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Health & Diet</strong>
            No fasting required. Eat light meal within 4 hours prior and drink plenty of fluids.
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Interval Cycle</strong>
            Male donors can donate every 90 days (3 months); female donors every 120 days (4 months).
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">TTI Screening</strong>
            Every donated unit is mandatorily screened for HIV, HBV, HCV, Malaria, and Syphilis.
          </div>
        </div>
      </div>
    </div>
  );
};
