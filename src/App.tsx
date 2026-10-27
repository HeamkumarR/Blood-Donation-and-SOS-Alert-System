import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NavigationTab } from './components/Sidebar';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Auth
import { Login } from './pages/auth/Login';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { BloodAvailabilitySearch } from './pages/user/BloodAvailabilitySearch';
import { DonationCamps } from './pages/user/DonationCamps';
import { UsersMap } from './pages/user/UsersMap';
import { FindDonor } from './pages/user/FindDonor';
import { RequestBlood } from './pages/user/RequestBlood';
import { SOS } from './pages/user/SOS';
import { MyRequests } from './pages/user/MyRequests';
import { DonationHistory } from './pages/user/DonationHistory';
import { Profile } from './pages/user/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Users } from './pages/admin/Users';
import { Donors } from './pages/admin/Donors';
import { BloodRequests } from './pages/admin/BloodRequests';
import { SOSRequests } from './pages/admin/SOSRequests';
import { Reports } from './pages/admin/Reports';
import { Settings } from './pages/admin/Settings';
import { Donor } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, isAuthenticated } = useApp();
  const [currentTab, setCurrentTab] = useState<NavigationTab>(() =>
    currentUser.role === 'ADMIN' ? 'admin-overview' : 'user-overview'
  );
  const [selectedDonorForRequest, setSelectedDonorForRequest] = useState<Donor | null>(null);
  const [isGmpQuotaExceeded, setIsGmpQuotaExceeded] = useState<boolean>(false);

  // Google Maps Platform Quota Exceeded Event Listener
  useEffect(() => {
    const handleQuotaExceeded = () => {
      setIsGmpQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  // When user signs in, sync tab to their role
  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser.role === 'ADMIN') {
        setCurrentTab('admin-overview');
      } else {
        setCurrentTab('user-overview');
      }
    }
  }, [isAuthenticated, currentUser.id, currentUser.role]);

  // If not authenticated or guest, require login / Google authentication
  if (!isAuthenticated || currentUser.id === 'guest') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        {isGmpQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center fixed top-0 left-0 right-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}
        <Login
          onSuccess={() => {
            setCurrentTab(currentUser.role === 'ADMIN' ? 'admin-overview' : 'user-overview');
          }}
        />
      </div>
    );
  }

  // Render for Admin Role
  if (currentUser.role === 'ADMIN') {
    return (
      <>
        {isGmpQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}
        <AdminLayout currentTab={currentTab} onSelectTab={setCurrentTab}>
          {currentTab === 'admin-overview' && <AdminDashboard onNavigate={setCurrentTab} />}
          {currentTab === 'admin-users' && <Users />}
          {currentTab === 'admin-donors' && <Donors />}
          {currentTab === 'admin-requests' && <BloodRequests />}
          {currentTab === 'admin-sos' && <SOSRequests />}
          {currentTab === 'admin-reports' && <Reports />}
          {currentTab === 'admin-settings' && <Settings />}
        </AdminLayout>
      </>
    );
  }

  // Render for User / Donor Role
  return (
    <>
      {isGmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <UserLayout currentTab={currentTab} onSelectTab={setCurrentTab}>
        {currentTab === 'user-overview' && <UserDashboard onNavigate={setCurrentTab} />}
        {currentTab === 'user-availability' && <BloodAvailabilitySearch onNavigate={setCurrentTab} />}
        {currentTab === 'user-camps' && <DonationCamps onNavigate={setCurrentTab} />}
        {currentTab === 'user-map' && (
          <UsersMap
            onNavigate={setCurrentTab}
            onSelectDonorForRequest={donor => {
              setSelectedDonorForRequest(donor);
              setCurrentTab('user-request-blood');
            }}
          />
        )}
        {currentTab === 'user-find-donors' && (
          <FindDonor
            onNavigate={setCurrentTab}
            onSelectDonorForRequest={donor => {
              setSelectedDonorForRequest(donor);
              setCurrentTab('user-request-blood');
            }}
          />
        )}
        {currentTab === 'user-request-blood' && (
          <RequestBlood
            onNavigate={setCurrentTab}
            preselectedDonor={selectedDonorForRequest}
          />
        )}
        {currentTab === 'user-sos' && <SOS onNavigate={setCurrentTab} />}
        {currentTab === 'user-my-requests' && <MyRequests onNavigate={setCurrentTab} />}
        {currentTab === 'user-donation-history' && <DonationHistory />}
        {currentTab === 'user-profile' && <Profile />}
      </UserLayout>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
