import React, { useState } from 'react';
import { BloodGroup } from '../types';
import { BLOOD_COMPATIBILITY } from '../data/initialData';
import { Check, Info } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const BloodCompatibilityMatrix: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');
  const [mode, setMode] = useState<'CAN_GIVE' | 'CAN_RECEIVE'>('CAN_GIVE');

  const info = BLOOD_COMPATIBILITY[selectedGroup];
  const compatibleList = mode === 'CAN_GIVE' ? info.canGiveTo : info.canReceiveFrom;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Clinical Blood Group Compatibility Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Verify transfusion safety guidelines for whole blood & red cell units
          </p>
        </div>

        {/* Mode selector */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setMode('CAN_GIVE')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              mode === 'CAN_GIVE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Can Donate To
          </button>
          <button
            onClick={() => setMode('CAN_RECEIVE')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              mode === 'CAN_RECEIVE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Can Receive From
          </button>
        </div>
      </div>

      {/* Blood Group Selector */}
      <div className="mt-4">
        <p className="text-xs font-medium text-slate-600 mb-2">Select Blood Group:</p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {BLOOD_GROUPS.map(bg => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all text-center border ${
                selectedGroup === bg
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Results grid */}
      <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
          <span>
            {mode === 'CAN_GIVE' ? (
              <>
                Donors with group <strong className="font-mono text-slate-900">{selectedGroup}</strong> can donate safely to:
              </>
            ) : (
              <>
                Patients with group <strong className="font-mono text-slate-900">{selectedGroup}</strong> can receive safely from:
              </>
            )}
          </span>
          <span className="font-mono font-medium text-slate-700">
            {compatibleList.length} of 8 groups
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BLOOD_GROUPS.map(bg => {
            const isMatch = compatibleList.includes(bg);
            return (
              <div
                key={bg}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                  isMatch
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <span className="font-mono text-sm">{bg}</span>
                {isMatch ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700">
                    <Check className="w-3.5 h-3.5" /> Compatible
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Incompatible</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 pt-2 border-t border-slate-200/60">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            {selectedGroup === 'O-' && (
              <strong>O- is the Universal Red Blood Cell Donor. Critical for emergency trauma resuscitation when blood type cannot be tested in advance.</strong>
            )}
            {selectedGroup === 'AB+' && (
              <strong>AB+ is the Universal Recipient for Red Blood Cells, capable of receiving packed RBCs from any blood type.</strong>
            )}
            {selectedGroup !== 'O-' && selectedGroup !== 'AB+' && (
              <span>Cross-match compatibility testing must always be confirmed by laboratory blood bank personnel before transfusion.</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
