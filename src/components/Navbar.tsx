import React from 'react';
import { useApp } from '../context/AppContext';
import { NotificationCenter } from './NotificationCenter';
import { NavigationTab } from './Sidebar';
import {
  Activity,
  AlertTriangle,
  PhoneCall,
  UserCheck,
  Shield,
  Menu,
  AlertOctagon,
  RotateCcw,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onNavigateToSOS?: () => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onNavigateToSOS,
  onNavigateTab,
}) => {
  const { currentUser, sosAlerts, resetAllData, logout } = useApp();

  const activeSOSCount = sosAlerts.filter(s => s.status === 'ACTIVE').length;

  return (
    <header className="h-16 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <a href="#/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-xs">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors whitespace-nowrap">
            PulsePoint SOS
          </span>
        </a>
      </div>

      {/* Zone 2: Navigation & Status Indicators */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        {activeSOSCount > 0 && (
          <button
            onClick={onNavigateToSOS}
            className="flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{activeSOSCount} Active SOS Emergency Alerts</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
          <span>Emergency Line:</span>
          <a
            href="tel:180025663"
            className="font-mono font-semibold text-slate-700 hover:underline"
          >
            1-800-BLOOD-SOS
          </a>
        </div>
      </div>

      {/* Zone 3: Primary Actions & User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Real-time Notification Bell */}
        <NotificationCenter onNavigateTab={onNavigateTab} />

        {/* ADMIN-ONLY SOS ALERT BROADCAST BUTTON */}
        {currentUser.role === 'ADMIN' && (
          <button
            onClick={onNavigateToSOS}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap animate-pulse"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Broadcast SOS Alert</span>
          </button>
        )}

        {/* Quick Reset Data Button */}
        <button
          onClick={() => {
            if (window.confirm('Clear all data and start with a fresh clean state?')) {
              resetAllData();
            }
          }}
          title="Clear all records & reset"
          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[11px] font-medium">Clear Data</span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
            {currentUser.bloodGroup}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-none truncate max-w-[110px]">
              {currentUser.name}
            </p>
            <p className="text-[11px] text-slate-500 leading-tight flex items-center gap-1">
              {currentUser.role === 'ADMIN' ? (
                <Shield className="w-3 h-3 text-indigo-600" />
              ) : (
                <UserCheck className="w-3 h-3 text-emerald-600" />
              )}
              <span>{currentUser.role}</span>
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign out of account"
          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs border border-slate-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
};

