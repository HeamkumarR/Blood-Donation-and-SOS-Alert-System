import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, Donor, UrgencyLevel } from '../../types';
import {
  PlusCircle,
  AlertTriangle,
  Building2,
  Calendar,
  ShieldCheck,
  CheckCircle,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { NavigationTab } from '../../components/Sidebar';

interface RequestBloodProps {
  onNavigate: (tab: NavigationTab) => void;
  preselectedDonor?: Donor | null;
}

export const RequestBlood: React.FC<RequestBloodProps> = ({
  onNavigate,
  preselectedDonor,
}) => {
  const { currentUser, donors, createBloodRequest } = useApp();

  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(
    preselectedDonor ? preselectedDonor.bloodGroup : 'O+'
  );
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('URGENT');
  const [hospitalName, setHospitalName] = useState('Rajiv Gandhi Government General Hospital (RGGGH)');
  const [hospitalAddress, setHospitalAddress] = useState('EVR Periyar Salai, Park Town, Chennai');
  const [city, setCity] = useState(currentUser.city || 'Chennai');
  const [requiredBy, setRequiredBy] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 6);
    return d.toISOString().slice(0, 16);
  });
  const [notes, setNotes] = useState('');

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  // Potential compatible donors nearby
  const matchingDonors = donors.filter(
    d => d.bloodGroup === bloodGroup && d.available
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !hospitalName.trim()) return;

    createBloodRequest({
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterPhone: currentUser.phone,
      patientName,
      bloodGroup,
      unitsNeeded: Number(unitsNeeded),
      hospitalName,
      hospitalAddress,
      city,
      urgency,
      requiredBy: new Date(requiredBy).toISOString(),
      notes,
      assignedDonorIds: preselectedDonor ? [preselectedDonor.id] : [],
    });

    onNavigate('user-my-requests');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          Emergency Blood Transfusion Request
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Submit hospital-verified transfusion requests. Requests are immediately relayed to clinical coordinators and compatible nearby donors.
        </p>
      </div>

      {preselectedDonor && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-rose-900">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>
              Targeted Request for Donor: <strong>{preselectedDonor.name}</strong> ({preselectedDonor.bloodGroup}, {preselectedDonor.distanceKm}km away)
            </span>
          </div>
          <span className="font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-semibold">
            Assigned
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="e.g. Anthony Vance"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Blood Group *
                </label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono font-semibold"
                >
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Units Needed (Pints / Units) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  required
                  value={unitsNeeded}
                  onChange={e => setUnitsNeeded(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>
            </div>

            {/* Urgency Level Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['STANDARD', 'URGENT', 'CRITICAL'] as UrgencyLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setUrgency(lvl)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                      urgency === lvl
                        ? lvl === 'CRITICAL'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : lvl === 'URGENT'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Hospital Information */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital / Clinical Facility *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={e => setHospitalName(e.target.value)}
                    placeholder="e.g. City General Trauma Center"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department / Ward / Room
                  </label>
                  <input
                    type="text"
                    value={hospitalAddress}
                    onChange={e => setHospitalAddress(e.target.value)}
                    placeholder="e.g. Level 3 ICU, Bed 12"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / District
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transfusion Required By (Date & Time) *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="datetime-local"
                    required
                    value={requiredBy}
                    onChange={e => setRequiredBy(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Notes / Surgery Reason
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Emergency bypass procedure scheduled. Cross-match test completed."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs mt-4"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Broadcast Blood Request</span>
            </button>
          </form>
        </div>

        {/* Right 1 Col: Match Preview & Guidelines */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Compatible Donors Ready
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              We found <strong className="font-mono text-slate-900">{matchingDonors.length}</strong> active{' '}
              <strong className="font-mono text-rose-600">{bloodGroup}</strong> donors within your region.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {matchingDonors.map(donor => (
                <div
                  key={donor.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{donor.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {donor.distanceKm} km · {donor.city}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>
              ))}

              {matchingDonors.length === 0 && (
                <p className="text-xs text-slate-400 py-3 text-center">
                  No active {bloodGroup} donors found right now. Broadcast will ping blood bank reserves and regional emergency standby units.
                </p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Transfusion Protocol:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500">
              <li>Direct requests are triaged by the Blood Bank Coordinator.</li>
              <li>Matched donors receive instant SMS and push alert dispatches.</li>
              <li>Recipient identity is protected under clinical confidentiality.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
