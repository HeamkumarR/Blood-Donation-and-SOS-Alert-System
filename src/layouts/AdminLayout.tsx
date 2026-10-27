import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar, NavigationTab } from '../components/Sidebar';
import { NotificationToast } from '../components/NotificationToast';

interface AdminLayoutProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        onNavigateToSOS={() => onSelectTab('admin-sos')}
        onNavigateTab={onSelectTab}
      />

      {/* Main Container with Sidebar & Content */}
      <div className="flex-1 flex">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={onSelectTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>

      <NotificationToast />
    </div>
  );
};
