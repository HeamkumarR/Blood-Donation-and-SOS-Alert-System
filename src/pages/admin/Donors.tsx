import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup } from '../../types';
import {
  HeartHandshake,
  Search,
  Phone,
  CheckCircle2,
  Star,
  MapPin,
  Check,
  X,
  Power,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Donors: React.FC = () => {
  const { donors, toggleDonorVerification, toggleDonorAvailabilityById } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'AVAILABLE' | 'RESTING'>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Distinct cities from registered donors
  const cities = ['ALL', ...Array.from(new Set(donors.map(d => d.city).filter(Boolean)))];

  const filteredDonors = donors.filter(d => {
    const matchesGroup = selectedGroup === 'ALL' || d.bloodGroup === selectedGroup;
    const matchesAvailability =
      availabilityFilter === 'ALL' ||
      (availabilityFilter === 'AVAILABLE' ? d.available : !d.available);
    const matchesCity = cityFilter === 'ALL' || d.city === cityFilter;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery);
    return matchesGroup && matchesAvailability && matchesCity && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage) || 1;
  const paginatedDonors = filteredDonors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Donor Registry & Roster Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise registered volunteer donors, verify eligibility credentials, and toggle emergency standby availability.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
          <span>{donors.length} registered donors</span>
          <span>·</span>
          <span className="text-emerald-700">
            {donors.filter(d => d.available).length} available now
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Blood group selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {bloodGroups.map(bg => (
              <button
                key={bg}
                onClick={() => {
                  setSelectedGroup(bg);
                  setCurrentPage(1);
                }}
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

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, city, phone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Secondary Filters: Availability & Location */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Availability:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              {(['ALL', 'AVAILABLE', 'RESTING'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setAvailabilityFilter(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    availabilityFilter === tab
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab === 'AVAILABLE' ? 'Ready' : 'Resting'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Location:</span>
            <select
              value={cityFilter}
              onChange={e => {
                setCityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {cities.map(c => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Districts / Cities' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Donors Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Donor Details</th>
                <th className="px-4 py-3">Blood Group</th>
                <th className="px-4 py-3">City / Location</th>
                <th className="px-4 py-3">Donations / Rating</th>
                <th className="px-4 py-3">Availability Status</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDonors.map(donor => (
                <tr key={donor.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 font-mono font-bold text-xs flex items-center justify-center border border-rose-200 shrink-0">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900">
                            {donor.name}
                          </span>
                          {donor.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {donor.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {donor.bloodGroup}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{donor.city}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="space-y-0.5">
                      <span className="font-mono font-semibold text-slate-900">
                        {donor.totalDonations} units
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-amber-600">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span className="font-mono">{donor.rating}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleDonorAvailabilityById(donor.id)}
                      title="Click to toggle availability"
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors inline-flex items-center gap-1.5 ${
                        donor.available
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <Power className={`w-3 h-3 ${donor.available ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{donor.available ? 'Active / Ready' : 'Resting'}</span>
                    </button>
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleDonorVerification(donor.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition-colors ${
                        donor.verified
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {donor.verified ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </>
                      ) : (
                        'Unverified'
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleDonorAvailabilityById(donor.id)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded border transition-colors ${
                          donor.available
                            ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        {donor.available ? 'Set Resting' : 'Set Available'}
                      </button>
                      <a
                        href={`tel:${donor.phone}`}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>Call</span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDonors.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-slate-700">No registered donors found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {donors.length === 0
                        ? 'No volunteer donors have registered in the database yet.'
                        : 'No donors match your current filter criteria.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredDonors.length > itemsPerPage && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredDonors.length)} of {filteredDonors.length} donors
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
