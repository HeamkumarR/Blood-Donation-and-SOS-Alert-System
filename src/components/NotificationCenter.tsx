import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';
import {
  Bell,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Info,
  CheckCheck,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';
import { NavigationTab } from './Sidebar';

interface NotificationCenterProps {
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onNavigateTab }) => {
  const {
    currentUser,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter notifications relevant to current user or ALL
  const userNotifications = notifications.filter(
    n => n.userId === currentUser.id || n.userId === 'ALL' || currentUser.role === 'ADMIN'
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.linkTab && onNavigateTab) {
      onNavigateTab(notif.linkTab as NavigationTab);
      setIsOpen(false);
    }
  };

  const getIcon = (type: AppNotification['type'], severity: AppNotification['severity']) => {
    if (type === 'NEARBY_SOS') return <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />;
    if (severity === 'success') return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    if (severity === 'warning') return <Clock className="w-4 h-4 text-amber-500" />;
    return <Info className="w-4 h-4 text-blue-500" />;
  };

  const formatTimeAgo = (isoString: string) => {
    const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono font-bold text-[10px] flex items-center justify-center animate-pulse">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live Notifications
              </span>
              {unreadNotificationsCount > 0 && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                  {unreadNotificationsCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadNotificationsCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  title="Mark all as read"
                  className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors text-xs flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Mark read</span>
                </button>
              )}
              <button
                onClick={clearNotifications}
                title="Clear all"
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {userNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 transition-colors cursor-pointer text-left flex items-start gap-3 ${
                  notif.read ? 'bg-white hover:bg-slate-50/80' : 'bg-rose-50/40 hover:bg-rose-50/80'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {getIcon(notif.type, notif.severity)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs truncate ${notif.read ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {formatTimeAgo(notif.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>

                  {notif.linkTab && (
                    <span className="mt-1 text-[11px] font-medium text-rose-600 hover:underline inline-flex items-center gap-1">
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                )}
              </div>
            ))}

            {userNotifications.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No notifications right now
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
