import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  trend?: string;
  urgent?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  icon: Icon,
  trend,
  urgent = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-xl border transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm' : ''
      } ${
        urgent
          ? 'bg-rose-50/70 border-rose-200'
          : 'bg-white border-slate-200/90'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <div
          className={`p-2 rounded-lg ${
            urgent ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span
          className={`text-2xl font-bold tracking-tight font-mono tabular-nums ${
            urgent ? 'text-rose-900' : 'text-slate-900'
          }`}
        >
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-emerald-600">
            {trend}
          </span>
        )}
      </div>
      {sublabel && (
        <p className="mt-1 text-xs text-slate-500 leading-normal">
          {sublabel}
        </p>
      )}
    </div>
  );
};
