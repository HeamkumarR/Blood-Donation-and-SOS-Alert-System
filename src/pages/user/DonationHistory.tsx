import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DonationRecord } from '../../types';
import {
  Award,
  Calendar,
  Building2,
  Heart,
  PlusCircle,
  FileCheck,
  ShieldCheck,
  Clock,
  X,
} from 'lucide-react';

export const DonationHistory: React.FC = () => {
  const { currentUser, donationHistory, addDonationRecord } = useApp();
  const [selectedCert, setSelectedCert] = useState<DonationRecord | null>(null);
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);

  // Form states
  const [hospital, setHospital] = useState('St. Jude Metropolitan Trauma Center');
  const [recipient, setRecipient] = useState('Metro Blood Bank Reserves');
  const [units, setUnits] = useState(1);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const userDonations = donationHistory.filter(d => d.donorId === currentUser.id);

  // Calculate next eligible donation date
  // Standard interval: 56 days for whole blood
  const lastDonation = userDonations[0];
  let daysUntilEligible = 0;
  let nextEligibleDate = 'Eligible Now';

  if (lastDonation) {
    const lastDate = new Date(lastDonation.date);
    const eligibleDate = new Date(lastDate);
    eligibleDate.setDate(lastDate.getDate() + 56);
    const today = new Date();
    const diffTime = eligibleDate.getTime() - today.getTime();
    daysUntilEligible = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysUntilEligible > 0) {
      nextEligibleDate = eligibleDate.toISOString().split('T')[0];
    } else {
      nextEligibleDate = 'Eligible to Donate Today';
    }
  }

  const handleLogDonation = (e: React.FormEvent) => {
    e.preventDefault();
    addDonationRecord({
      donorId: currentUser.id,
      donorName: currentUser.name,
      bloodGroup: currentUser.bloodGroup,
      recipientName: recipient,
      hospital,
      date,
      units: Number(units),
    });
    setIsLoggingModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Donation Records & Impact History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official record of verified clinical blood donations, health eligibility, and digital appreciation certificates.
          </p>
        </div>

        <button
          onClick={() => setIsLoggingModalOpen(true)}
          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Verified Donation</span>
        </button>
      </div>

      {/* Summary Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Donations</span>
            <Heart className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900">
            {userDonations.length}
          </span>
          <p className="text-xs text-slate-500 mt-1">Whole blood & component sessions</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Lives Saved</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900">
            {userDonations.length * 3}
          </span>
          <p className="text-xs text-slate-500 mt-1">Up to 3 patients helped per unit</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Next Eligibility</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-base font-bold font-mono text-slate-900 block truncate">
            {nextEligibleDate}
          </span>
          <p className="text-xs text-slate-500 mt-1">
            {daysUntilEligible > 0
              ? `${daysUntilEligible} days remaining for cellular recovery`
              : 'Medical rest cycle complete'}
          </p>
        </div>
      </div>

      {/* Donations List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Certified Donation Sessions ({userDonations.length})
          </h3>
          <span className="text-xs text-slate-500">
            All records verified by regional hospital blood banks
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {userDonations.map(record => (
            <div
              key={record.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 font-mono font-bold text-xs flex items-center justify-center border border-rose-200 shrink-0">
                  {record.bloodGroup}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {record.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-slate-900">
                      {record.units} Unit ({record.bloodGroup})
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {record.date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{record.hospital}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Recipient / Beneficiary: {record.recipientName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCert(record)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>View Certificate</span>
              </button>
            </div>
          ))}

          {userDonations.length === 0 && (
            <div className="py-12 text-center p-6">
              <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                No past donations recorded yet
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Completed a donation at a hospital or mobile drive? Log your verified session to earn your digital donor credentials.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CERTIFICATE MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Frame */}
            <div className="border-4 border-double border-rose-200 p-6 rounded-xl text-center space-y-4 bg-gradient-to-b from-rose-50/20 to-white">
              <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-rose-700">
                  PulsePoint Health & Transfusion Services
                </p>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  Certificate of Appreciation
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {selectedCert.certificateId}
                </p>
              </div>

              <div className="py-3 border-y border-rose-100 text-xs text-slate-700 leading-relaxed">
                This certifies that{' '}
                <strong className="text-slate-900 font-semibold">{selectedCert.donorName}</strong>{' '}
                has generously donated{' '}
                <strong className="text-rose-700 font-mono font-bold">
                  {selectedCert.units} Unit of {selectedCert.bloodGroup} Blood
                </strong>{' '}
                at {selectedCert.hospital} on {selectedCert.date}, aiding life-saving critical care.
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 font-mono">
                <div>
                  <span className="block text-[10px] text-slate-400">Date Logged</span>
                  <span>{selectedCert.date}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400">Clinical Seal</span>
                  <span className="text-emerald-700 font-semibold">VERIFIED</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCert(null)}
              className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}

      {/* LOG DONATION MODAL */}
      {isLoggingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsLoggingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Log Completed Blood Donation
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your clinical receipt details to record donation impact.
            </p>

            <form onSubmit={handleLogDonation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital / Blood Bank Center *
                </label>
                <input
                  type="text"
                  required
                  value={hospital}
                  onChange={e => setHospital(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient or Department
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder="e.g. Metro Blood Bank Reserves"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Units Donated
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={units}
                    onChange={e => setUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Donation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors mt-4"
              >
                Save Record & Generate Certificate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
