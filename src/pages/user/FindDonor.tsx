import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, Donor } from '../../types';
import {
  Search,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Award,
  MapPin,
  Send,
  Map as MapIcon,
  X,
  Lock,
  MessageSquare,
} from 'lucide-react';
import { NavigationTab } from '../../components/Sidebar';

interface FindDonorProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectDonorForRequest?: (donor: Donor) => void;
}

export const FindDonor: React.FC<FindDonorProps> = ({
  onNavigate,
  onSelectDonorForRequest,
}) => {
  const { donors, currentUser, showToast } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedDonorForContact, setSelectedDonorForContact] = useState<Donor | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);

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

  const filteredDonors = donors.filter(d => {
    const matchesGroup = selectedGroup === 'ALL' || d.bloodGroup === selectedGroup;
    const matchesAvailability = !onlyAvailable || d.available;
    const matchesQuery =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesAvailability && matchesQuery;
  });

  const handleRequestDirect = (donor: Donor) => {
    if (onSelectDonorForRequest) {
      onSelectDonorForRequest(donor);
    }
    onNavigate('user-request-blood');
  };

  const handleSendContactAlert = () => {
    setContactSuccess(true);
    showToast(`Emergency alert sent to ${selectedDonorForContact?.name}. They will call you upon acceptance.`, 'success');
    setTimeout(() => {
      setSelectedDonorForContact(null);
      setContactSuccess(false);
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>Chennai & Tamil Nadu Blood Network</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Emergency Blood Donor Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search verified volunteer donors across Chennai, Coimbatore, Madurai, and Tamil Nadu districts.
          </p>
        </div>

        {/* 1-Click Switch to GPS Map View */}
        <button
          onClick={() => onNavigate('user-map')}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs self-start sm:self-auto"
        >
          <MapIcon className="w-4 h-4 text-emerald-400" />
          <span>View on GPS Map & Navigator</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Blood group pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {bloodGroups.map(bg => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors shrink-0 ${
                  selectedGroup === bg
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          {/* Availability switch */}
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={e => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
            />
            <span>Available for emergencies now</span>
          </label>
        </div>

        {/* Search input with Tamil Nadu Localities */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search donors by name, locality (Anna Nagar, T. Nagar, Adyar, Tambaram, Coimbatore)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonors.map(donor => (
          <div
            key={donor.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 font-mono font-bold text-sm flex items-center justify-center border border-rose-200">
                    {donor.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {donor.name}
                      </h3>
                      {donor.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{donor.city}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-slate-600 font-medium">
                        {donor.distanceKm} km away
                      </span>
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    donor.available
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {donor.available ? 'Ready' : 'Resting'}
                </span>
              </div>

              {/* Donor metrics */}
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    <strong className="font-mono text-slate-900">{donor.totalDonations}</strong> donations
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">
                    Last: <span className="font-mono text-slate-700">{donor.lastDonationDate}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Privacy-Safe Contact & Request Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setSelectedDonorForContact(donor)}
                className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>Contact</span>
              </button>

              <button
                onClick={() => handleRequestDirect(donor)}
                className="flex-1 py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Send className="w-3 h-3" />
                <span>Request</span>
              </button>
            </div>
          </div>
        ))}

        {filteredDonors.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200 p-8">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">
              No matching donors found in this district
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try switching blood groups or clearing availability filters to view all volunteers in Tamil Nadu.
            </p>
          </div>
        )}
      </div>

      {/* PRIVACY-SAFE CONTACT MODAL */}
      {selectedDonorForContact && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Secure Donor Contact</h3>
              </div>
              <button
                onClick={() => setSelectedDonorForContact(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-sm">
                    {selectedDonorForContact.name}
                  </span>
                  <span className="text-slate-500">
                    {selectedDonorForContact.city} · {selectedDonorForContact.distanceKm} km away
                  </span>
                </div>
                <span className="text-base font-bold font-mono text-rose-600 px-2.5 py-1 bg-white rounded-lg border border-slate-200">
                  {selectedDonorForContact.bloodGroup}
                </span>
              </div>

              {/* Privacy Notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <strong className="block mb-0.5">Privacy Protection Enabled:</strong>
                To protect volunteer donors from spam and unsolicited calls, your emergency request is routed via the PulsePoint clinical dispatch. The donor will receive an instant notification with your patient requirement.
              </div>

              {contactSuccess ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-center font-semibold">
                  Emergency Alert Dispatched! Donor notified.
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleSendContactAlert}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Emergency Contact Request</span>
                  </button>

                  {/* Direct Call Affordance */}
                  <a
                    href={`tel:${selectedDonorForContact.phone}`}
                    className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-center"
                  >
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>Direct Call ({currentUser.role === 'ADMIN' ? selectedDonorForContact.phone : `${selectedDonorForContact.phone.slice(0, 6)}****`})</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
