import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  Radio,
  Bell,
  Phone,
  Shield,
  RotateCcw,
  Save,
  CheckCircle2,
  Download,
  Terminal,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { showToast } = useApp();

  const [smsBroadcast, setSmsBroadcast] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [sirenSound, setSirenSound] = useState(false);
  const [hospitalDispatchSync, setHospitalDispatchSync] = useState(true);
  const [criticalThreshold, setCriticalThreshold] = useState(8);
  const [proximityRadius, setProximityRadius] = useState(15);
  const [hotline, setHotline] = useState('1-800-BLOOD-SOS');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('System configuration & dispatch thresholds updated', 'success');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all platform data to the initial demonstration records?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          System Configuration & Emergency Policies
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure real-time automated emergency broadcast pipelines, clinical thresholds, and dispatch network routing.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Broadcast Channels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-600" />
            <span>1. Automated SOS Dispatch Channels</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  SMS Broadcast to Compatible Donors
                </p>
                <p className="text-[11px] text-slate-500">
                  Trigger automated high-priority SMS messages to registered donors within proximity radius
                </p>
              </div>
              <input
                type="checkbox"
                checked={smsBroadcast}
                onChange={e => setSmsBroadcast(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Hospital ER Central Dispatch Sync
                </p>
                <p className="text-[11px] text-slate-500">
                  Relay active SOS incidents to local trauma centers via regional healthcare emergency API
                </p>
              </div>
              <input
                type="checkbox"
                checked={hospitalDispatchSync}
                onChange={e => setHospitalDispatchSync(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Instant Mobile Push Alerts
                </p>
                <p className="text-[11px] text-slate-500">
                  Send immediate push notifications to donor mobile devices within range
                </p>
              </div>
              <input
                type="checkbox"
                checked={pushAlerts}
                onChange={e => setPushAlerts(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Audio Siren on Admin Console
                </p>
                <p className="text-[11px] text-slate-500">
                  Sound urgent acoustic siren chime in the administration tab upon incoming red alerts
                </p>
              </div>
              <input
                type="checkbox"
                checked={sirenSound}
                onChange={e => setSirenSound(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
            </label>
          </div>
        </div>

        {/* Operational Thresholds */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-600" />
            <span>2. Clinical Thresholds & Proximity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Critical Inventory Reserve Level (Units)
              </label>
              <input
                type="number"
                min="2"
                max="20"
                value={criticalThreshold}
                onChange={e => setCriticalThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Blood groups with stock below this number are flagged as CRITICAL.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default SOS Broadcast Radius (km)
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={proximityRadius}
                onChange={e => setProximityRadius(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Initial radius for automatic donor notification ping.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Platform Emergency Dispatch Hotline
            </label>
            <input
              type="text"
              value={hotline}
              onChange={e => setHotline(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </form>

      {/* VS Code Local Export Card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Terminal className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-white">
                Export Complete Project for VS Code
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Download the complete full-stack web application source code as an offline package.
            </p>
          </div>
          <a
            href="/pulsepoint-vscode.zip"
            download="pulsepoint-vscode-project.zip"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Download Project ZIP</span>
          </a>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1">
          <p className="text-slate-500"># 1. Unzip and open in VS Code:</p>
          <p className="text-emerald-400">unzip pulsepoint-vscode-project.zip && cd pulsepoint-app && code .</p>
          <p className="text-slate-500 mt-2"># 2. Install dependencies & run:</p>
          <p className="text-emerald-400">npm install && npm run dev</p>
          <p className="text-slate-500 mt-2"># 3. (Optional) Run backend server:</p>
          <p className="text-emerald-400">npm run server</p>
        </div>
      </div>

      {/* Danger Zone / Reset State */}
      <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-1">
          Database & Storage Clean Slate
        </h3>
        <p className="text-xs text-rose-700 mb-4">
          Clear all donors, users, active blood requests, and SOS alerts back to a pristine zero-record state.
        </p>
        <button
          type="button"
          onClick={handleResetData}
          className="px-4 py-2 bg-white border border-rose-300 hover:bg-rose-100 text-rose-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear All Data & Reset Session</span>
        </button>
      </div>
    </div>
  );
};
