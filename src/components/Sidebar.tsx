import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  PlusCircle,
  AlertOctagon,
  Search,
  ClipboardList,
  History,
  User as UserIcon,
  Users,
  HeartHandshake,
  FileText,
  BarChart3,
  Settings,
  ShieldAlert,
  Power,
  Navigation,
  Map,
  Building2,
  CalendarCheck,
  LogOut,
} from 'lucide-react';

export type NavigationTab =
  // User Tabs
  | 'user-overview'
  | 'user-availability'
  | 'user-camps'
  | 'user-map'
  | 'user-find-donors'
  | 'user-request-blood'
  | 'user-sos'
  | 'user-my-requests'
  | 'user-donation-history'
  | 'user-profile'
  // Admin Tabs
  | 'admin-overview'
  | 'admin-users'
  | 'admin-donors'
  | 'admin-requests'
  | 'admin-sos'
  | 'admin-reports'
  | 'admin-settings'
  // Auth Tab
  | 'auth-switch';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const { currentUser, sosAlerts, requests, toggleDonorStatus, logout } = useApp();

  const activeSOS = sosAlerts.filter(s => s.status === 'ACTIVE').length;
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length;

  const userNavItems = [
    { id: 'user-overview' as NavigationTab, label: 'Home / Overview', icon: LayoutDashboard },
    { id: 'user-availability' as NavigationTab, label: 'Blood Availability (eRaktKosh)', icon: Building2 },
    { id: 'user-camps' as NavigationTab, label: 'Donation Camps', icon: CalendarCheck },
    { id: 'user-map' as NavigationTab, label: 'Users Map / Navigator', icon: Map },
    { id: 'user-find-donors' as NavigationTab, label: 'Find Donors', icon: Search },
    { id: 'user-request-blood' as NavigationTab, label: 'Request Blood', icon: PlusCircle, badge: pendingRequests > 0 ? pendingRequests : undefined },
    { id: 'user-sos' as NavigationTab, label: 'Nearby SOS Alerts', icon: AlertOctagon, alert: activeSOS > 0, badge: activeSOS > 0 ? `${activeSOS} Live` : undefined },
    { id: 'user-my-requests' as NavigationTab, label: 'My Requests', icon: ClipboardList },
    { id: 'user-donation-history' as NavigationTab, label: 'Donation History', icon: History },
    { id: 'user-profile' as NavigationTab, label: 'Profile', icon: UserIcon },
  ];

  const adminNavItems = [
    { id: 'admin-overview' as NavigationTab, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'admin-users' as NavigationTab, label: 'Manage Users', icon: Users },
    { id: 'admin-donors' as NavigationTab, label: 'Manage Donors', icon: HeartHandshake },
    { id: 'admin-requests' as NavigationTab, label: 'Blood Requests', icon: FileText, badge: pendingRequests > 0 ? pendingRequests : undefined },
    { id: 'admin-sos' as NavigationTab, label: 'SOS Alert Console', icon: ShieldAlert, alert: activeSOS > 0, badge: activeSOS > 0 ? `${activeSOS} Live` : undefined },
    { id: 'admin-reports' as NavigationTab, label: 'Reports / Statistics', icon: BarChart3 },
    { id: 'admin-settings' as NavigationTab, label: 'Settings', icon: Settings },
  ];

  const navItems = currentUser.role === 'ADMIN' ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-xs">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 block leading-tight">
                PulsePoint
              </span>
              <span className="text-[11px] text-slate-500 font-medium leading-tight">
                {currentUser.role === 'ADMIN' ? 'Admin Clinical Suite' : 'Emergency Blood Network'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {currentUser.role === 'ADMIN' ? 'Administration' : 'Donor & Patient Services'}
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-rose-600'
                        : item.alert
                        ? 'text-rose-500 animate-pulse'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      item.alert
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Donor Availability Quick Toggle (for users) */}
        {currentUser.role === 'USER' && (
          <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">Donor Status</p>
                <p className="text-[11px] text-slate-500">
                  {currentUser.donorAvailability ? 'Ready for emergencies' : 'Temporarily inactive'}
                </p>
              </div>
              <button
                onClick={() => toggleDonorStatus()}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  currentUser.donorAvailability ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
                aria-label="Toggle Donor Availability"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                    currentUser.donorAvailability ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Sidebar Footer with Sign Out */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
              <span>Sign Out</span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase px-1.5 py-0.5 bg-slate-100 rounded">
              {currentUser.role}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
