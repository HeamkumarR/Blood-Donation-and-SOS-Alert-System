import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { activeNotification, dismissToast } = useApp();

  if (!activeNotification) return null;

  const bgStyles = {
    success: 'bg-emerald-950/90 border-emerald-800 text-emerald-100',
    danger: 'bg-rose-950/90 border-rose-800 text-rose-100',
    info: 'bg-slate-900/90 border-slate-700 text-slate-100',
  }[activeNotification.type];

  const Icon = {
    success: CheckCircle2,
    danger: AlertCircle,
    info: Info,
  }[activeNotification.type];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${bgStyles}`}
      >
        <Icon className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
        <div className="text-sm font-medium leading-relaxed flex-1">
          {activeNotification.message}
        </div>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-white transition-colors p-1"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
