import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BloodGroup,
  BloodRequest,
  BloodStock,
  DonationRecord,
  Donor,
  SOSAlert,
  User,
  UserRole,
  AppNotification,
  BloodBankCenter,
  DonationCamp,
} from '../types';
import {
  INITIAL_BLOOD_STOCK,
  INITIAL_DONATION_HISTORY,
  INITIAL_DONORS,
  INITIAL_REQUESTS,
  INITIAL_SOS_ALERTS,
  INITIAL_USERS,
  INITIAL_BLOOD_BANKS,
  INITIAL_DONATION_CAMPS,
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  users: User[];
  donors: Donor[];
  requests: BloodRequest[];
  sosAlerts: SOSAlert[];
  donationHistory: DonationRecord[];
  bloodStock: BloodStock[];
  bloodBanks: BloodBankCenter[];
  donationCamps: DonationCamp[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  activeNotification: { message: string; type: 'success' | 'danger' | 'info' } | null;
  
  // Auth & Roles
  isAuthenticated: boolean;
  setCurrentUser: (user: User) => void;
  loginWithGoogle: (googleData: {
    name: string;
    email: string;
    phone: string;
    bloodGroup: BloodGroup;
    city: string;
    role: UserRole;
    isDonor: boolean;
    avatar?: string;
  }) => void;
  loginWithEmail: (emailOrPhone: string, password?: string) => { success: boolean; error?: string };
  registerWithVerification: (userData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    bloodGroup: BloodGroup;
    city: string;
    role: UserRole;
    isDonor: boolean;
  }) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  loginAs: (userId: string) => void;
  registerUser: (userData: Partial<User>) => void;
  updateUserProfile: (userData: Partial<User>) => void;
  toggleDonorStatus: (available?: boolean) => void;

  // Camps & Blood Banks
  bookCampSlot: (campId: string) => void;

  // Requests
  createBloodRequest: (req: Omit<BloodRequest, 'id' | 'requestedAt' | 'unitsFulfilled' | 'status'>) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  matchDonorToRequest: (requestId: string, donorId: string) => void;
  fulfillRequest: (requestId: string) => void;

  // SOS (ADMIN ONLY for triggering)
  triggerSOS: (sosData: { bloodGroup: BloodGroup; location: string; notes?: string; latitude?: number; longitude?: number }) => string | null;
  dispatchSOSResponder: (sosId: string) => void;
  resolveSOS: (sosId: string) => void;
  cancelSOS: (sosId: string) => void;

  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Donors & Users Management
  toggleDonorVerification: (donorId: string) => void;
  toggleDonorAvailabilityById: (donorId: string) => void;
  toggleUserVerification: (userId: string) => void;
  toggleUserRole: (userId: string) => void;
  updateBloodStock: (group: BloodGroup, delta: number) => void;
  addDonationRecord: (record: Omit<DonationRecord, 'id' | 'certificateId'>) => void;

  // Helpers
  showToast: (message: string, type?: 'success' | 'danger' | 'info') => void;
  dismissToast: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'pulsepoint_clean_verified_v1';

export const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest User',
  email: '',
  phone: '',
  role: 'USER',
  bloodGroup: 'O+',
  city: 'Chennai',
  isDonor: false,
  donorAvailability: false,
  verified: false,
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.id !== 'guest') {
          return parsed;
        }
      } catch {
        // ignore
      }
    }
    return GUEST_USER;
  });

  const isAuthenticated = currentUser.id !== 'guest';

  const [donors, setDonors] = useState<Donor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_donors`);
    return saved ? JSON.parse(saved) : INITIAL_DONORS;
  });

  const [requests, setRequests] = useState<BloodRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sos`);
    return saved ? JSON.parse(saved) : INITIAL_SOS_ALERTS;
  });

  const [donationHistory, setDonationHistory] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_donations`);
    return saved ? JSON.parse(saved) : INITIAL_DONATION_HISTORY;
  });

  const [bloodStock, setBloodStock] = useState<BloodStock[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_stock`);
    return saved ? JSON.parse(saved) : INITIAL_BLOOD_STOCK;
  });

  const [bloodBanks, setBloodBanks] = useState<BloodBankCenter[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bloodbanks`);
    return saved ? JSON.parse(saved) : INITIAL_BLOOD_BANKS;
  });

  const [donationCamps, setDonationCamps] = useState<DonationCamp[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_camps`);
    return saved ? JSON.parse(saved) : INITIAL_DONATION_CAMPS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeNotification, setActiveNotification] = useState<{
    message: string;
    type: 'success' | 'danger' | 'info';
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_donors`, JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sos`, JSON.stringify(sosAlerts));
  }, [sosAlerts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_donations`, JSON.stringify(donationHistory));
  }, [donationHistory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_stock`, JSON.stringify(bloodStock));
  }, [bloodStock]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bloodbanks`, JSON.stringify(bloodBanks));
  }, [bloodBanks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_camps`, JSON.stringify(donationCamps));
  }, [donationCamps]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  const bookCampSlot = (campId: string) => {
    setDonationCamps(prev =>
      prev.map(c => {
        if (c.id === campId) {
          const isBooked = !c.userBooked;
          return {
            ...c,
            userBooked: isBooked,
            bookedSlots: isBooked ? c.bookedSlots + 1 : Math.max(0, c.bookedSlots - 1),
          };
        }
        return c;
      })
    );
    showToast('Blood donation appointment slot confirmed! SMS pass issued.', 'success');
  };

  const showToast = (message: string, type: 'success' | 'danger' | 'info' = 'info') => {
    setActiveNotification({ message, type });
    setTimeout(() => {
      setActiveNotification(prev => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const dismissToast = () => setActiveNotification(null);

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadNotificationsCount = notifications.filter(
    n => !n.read && (n.userId === currentUser.id || n.userId === 'ALL' || currentUser.role === 'ADMIN')
  ).length;

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(n =>
        n.userId === currentUser.id || n.userId === 'ALL' || currentUser.role === 'ADMIN'
          ? { ...n, read: true }
          : n
      )
    );
    showToast('All notifications marked as read', 'info');
  };

  const clearNotifications = () => {
    setNotifications(prev =>
      prev.filter(n => n.userId !== currentUser.id && n.userId !== 'ALL')
    );
    showToast('Notification inbox cleared', 'info');
  };

  const logout = () => {
    setCurrentUser(GUEST_USER);
    localStorage.removeItem(`${STORAGE_KEY}_current_user`);
    showToast('You have been logged out safely.', 'info');
  };

  const loginWithGoogle = (googleData: {
    name: string;
    email: string;
    phone: string;
    bloodGroup: BloodGroup;
    city: string;
    role: UserRole;
    isDonor: boolean;
    avatar?: string;
  }) => {
    const existing = users.find(u => u.email.toLowerCase() === googleData.email.toLowerCase());
    let userToSet: User;

    if (existing) {
      userToSet = {
        ...existing,
        name: googleData.name || existing.name,
        phone: googleData.phone || existing.phone,
        bloodGroup: googleData.bloodGroup || existing.bloodGroup,
        city: googleData.city || existing.city,
        role: googleData.role || existing.role,
        isDonor: googleData.isDonor,
        donorAvailability: googleData.isDonor,
        verified: true,
        authProvider: 'google',
        avatar: googleData.avatar || existing.avatar,
      };
      setUsers(prev => prev.map(u => (u.id === userToSet.id ? userToSet : u)));
    } else {
      userToSet = {
        id: `user_g_${Date.now()}`,
        name: googleData.name,
        email: googleData.email,
        phone: googleData.phone,
        role: googleData.role,
        bloodGroup: googleData.bloodGroup,
        city: googleData.city,
        isDonor: googleData.isDonor,
        donorAvailability: googleData.isDonor,
        verified: true,
        authProvider: 'google',
        avatar: googleData.avatar,
      };
      setUsers(prev => [userToSet, ...prev]);
    }

    if (userToSet.isDonor) {
      setDonors(prev => {
        const filtered = prev.filter(d => d.phone !== userToSet.phone && d.name !== userToSet.name);
        const newDonor: Donor = {
          id: `donor_${Date.now()}`,
          name: userToSet.name,
          bloodGroup: userToSet.bloodGroup,
          phone: userToSet.phone,
          city: userToSet.city,
          distanceKm: 1.2,
          latitude: 13.0827 + (Math.random() * 0.04 - 0.02),
          longitude: 80.2707 + (Math.random() * 0.04 - 0.02),
          available: true,
          totalDonations: 0,
          lastDonationDate: new Date().toISOString().split('T')[0],
          verified: true,
          rating: 5.0,
        };
        return [newDonor, ...filtered];
      });
    }

    setCurrentUser(userToSet);
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(userToSet));
    showToast(`Google Authentication Verified! Welcome, ${userToSet.name}.`, 'success');
  };

  const loginWithEmail = (emailOrPhone: string, password?: string): { success: boolean; error?: string } => {
    const cleanInput = emailOrPhone.trim().toLowerCase();

    // Check system clinical admin login
    if (cleanInput === 'admin@pulsepoint.org' || cleanInput === 'admin') {
      const admin = users.find(u => u.role === 'ADMIN') || INITIAL_USERS[0];
      setCurrentUser(admin);
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(admin));
      showToast(`Welcome back, ${admin.name}! (Clinical Administrator)`, 'success');
      return { success: true };
    }

    const matched = users.find(
      u => u.email.toLowerCase() === cleanInput || u.phone.replace(/[\s-+]/g, '') === cleanInput.replace(/[\s-+]/g, '')
    );

    if (matched) {
      setCurrentUser(matched);
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(matched));
      showToast(`Welcome back, ${matched.name}!`, 'success');
      return { success: true };
    }

    return {
      success: false,
      error: 'Account not found. Please create a new verified account or continue with Google.',
    };
  };

  const registerWithVerification = (userData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    bloodGroup: BloodGroup;
    city: string;
    role: UserRole;
    isDonor: boolean;
  }) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role,
      bloodGroup: userData.bloodGroup,
      city: userData.city,
      isDonor: userData.isDonor,
      donorAvailability: userData.isDonor,
      verified: true,
      authProvider: 'manual',
    };

    setUsers(prev => [newUser, ...prev]);

    if (newUser.isDonor) {
      const newDonor: Donor = {
        id: `donor_${Date.now()}`,
        name: newUser.name,
        bloodGroup: newUser.bloodGroup,
        phone: newUser.phone,
        city: newUser.city,
        distanceKm: 1.4,
        latitude: 13.0827 + (Math.random() * 0.04 - 0.02),
        longitude: 80.2707 + (Math.random() * 0.04 - 0.02),
        available: true,
        totalDonations: 0,
        lastDonationDate: new Date().toISOString().split('T')[0],
        verified: true,
        rating: 5.0,
      };
      setDonors(prev => [newDonor, ...prev]);
    }

    setCurrentUser(newUser);
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(newUser));
    showToast(`Verification Successful! Your account has been activated, ${newUser.name}.`, 'success');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'ADMIN') {
      const admin = users.find(u => u.role === 'ADMIN') || INITIAL_USERS[1];
      setCurrentUser(admin);
      showToast(`Switched workspace to Admin mode (${admin.name})`, 'info');
    } else {
      const user = users.find(u => u.role === 'USER') || INITIAL_USERS[0];
      setCurrentUser(user);
      showToast(`Switched workspace to Donor / User mode (${user.name})`, 'info');
    }
  };

  const loginAs = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showToast(`Logged in as ${found.name} (${found.role})`, 'success');
    }
  };

  const registerUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name || 'New Member',
      email: userData.email || 'user@example.com',
      phone: userData.phone || '+1 (555) 000-0000',
      role: userData.role || 'USER',
      bloodGroup: userData.bloodGroup || 'O+',
      city: userData.city || 'Metro City',
      isDonor: userData.isDonor ?? true,
      donorAvailability: userData.donorAvailability ?? true,
      verified: true,
    };
    setUsers(prev => [newUser, ...prev]);
    if (newUser.isDonor) {
      const newDonor: Donor = {
        id: `donor_${Date.now()}`,
        name: newUser.name,
        bloodGroup: newUser.bloodGroup,
        phone: newUser.phone,
        city: newUser.city,
        distanceKm: 2.1,
        latitude: 37.7749 + (Math.random() * 0.04 - 0.02),
        longitude: -122.4194 + (Math.random() * 0.04 - 0.02),
        available: newUser.donorAvailability,
        totalDonations: 0,
        lastDonationDate: new Date().toISOString().split('T')[0],
        verified: true,
        rating: 5.0,
      };
      setDonors(prev => [newDonor, ...prev]);
    }
    setCurrentUser(newUser);
    showToast(`Account registered successfully. Welcome, ${newUser.name}!`, 'success');
  };

  const updateUserProfile = (userData: Partial<User>) => {
    const updated = { ...currentUser, ...userData };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    if (updated.isDonor) {
      setDonors(prev =>
        prev.map(d =>
          d.name === currentUser.name || d.phone === currentUser.phone
            ? { ...d, name: updated.name, phone: updated.phone, city: updated.city, bloodGroup: updated.bloodGroup }
            : d
        )
      );
    }
    showToast('Profile credentials saved successfully', 'success');
  };

  const toggleDonorStatus = (available?: boolean) => {
    const newStatus = available !== undefined ? available : !currentUser.donorAvailability;
    const updated = { ...currentUser, donorAvailability: newStatus, isDonor: true };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    setDonors(prev =>
      prev.map(d =>
        d.phone === currentUser.phone || d.name === currentUser.name
          ? { ...d, available: newStatus }
          : d
      )
    );
    showToast(
      newStatus ? 'You are marked as AVAILABLE for emergency donations' : 'You are marked as UNAVAILABLE',
      newStatus ? 'success' : 'info'
    );
  };

  const createBloodRequest = (
    req: Omit<BloodRequest, 'id' | 'requestedAt' | 'unitsFulfilled' | 'status'>
  ) => {
    const newReq: BloodRequest = {
      ...req,
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      requestedAt: new Date().toISOString(),
      unitsFulfilled: 0,
      status: 'PENDING',
    };
    setRequests(prev => [newReq, ...prev]);
    showToast(`Blood request ${newReq.id} submitted for clinical triage`, 'success');
  };

  // REAL-TIME NOTIFICATIONS TRIGGERED ON REQUEST STATUS CHANGES:
  const approveRequest = (requestId: string) => {
    const target = requests.find(r => r.id === requestId);
    setRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'APPROVED' } : r))
    );
    showToast(`Blood Request ${requestId} APPROVED by Blood Bank Triage`, 'success');

    if (target) {
      addNotification({
        userId: target.requesterId,
        title: `Blood Request ${target.id} Approved`,
        message: `Your transfusion request for ${target.patientName} (${target.bloodGroup}, ${target.unitsNeeded} units) has been officially approved by clinical triage. Matching nearby volunteer donors now.`,
        type: 'REQUEST_STATUS',
        severity: 'success',
        linkTab: 'user-my-requests',
        metadata: { requestId: target.id, newStatus: 'APPROVED' },
      });
    }
  };

  const rejectRequest = (requestId: string, reason: string) => {
    const target = requests.find(r => r.id === requestId);
    setRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'REJECTED', rejectionReason: reason } : r))
    );
    showToast(`Blood Request ${requestId} marked as rejected`, 'danger');

    if (target) {
      addNotification({
        userId: target.requesterId,
        title: `Blood Request ${target.id} Declined`,
        message: `Your request for ${target.patientName} was declined: "${reason}". Please contact the blood bank coordinator for emergency alternatives.`,
        type: 'REQUEST_STATUS',
        severity: 'warning',
        linkTab: 'user-my-requests',
        metadata: { requestId: target.id, newStatus: 'REJECTED' },
      });
    }
  };

  const matchDonorToRequest = (requestId: string, donorId: string) => {
    const target = requests.find(r => r.id === requestId);
    const donor = donors.find(d => d.id === donorId);
    let updatedUnits = 1;

    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          const assigned = r.assignedDonorIds ? [...r.assignedDonorIds, donorId] : [donorId];
          updatedUnits = Math.min(r.unitsNeeded, r.unitsFulfilled + 1);
          return {
            ...r,
            status: updatedUnits >= r.unitsNeeded ? 'FULFILLED' : 'MATCHED',
            assignedDonorIds: assigned,
            unitsFulfilled: updatedUnits,
          };
        }
        return r;
      })
    );
    showToast(`Donor ${donor?.name || donorId} assigned to ${requestId}`, 'success');

    if (target) {
      addNotification({
        userId: target.requesterId,
        title: `Donor Matched: ${donor?.name || 'Verified Volunteer'}`,
        message: `A compatible ${target.bloodGroup} donor (${donor?.name}, ${donor?.distanceKm} km away) has been assigned to request ${target.id}. Units ready: ${updatedUnits}/${target.unitsNeeded}.`,
        type: 'REQUEST_STATUS',
        severity: 'info',
        linkTab: 'user-my-requests',
        metadata: { requestId: target.id, newStatus: 'MATCHED' },
      });
    }
  };

  const fulfillRequest = (requestId: string) => {
    const target = requests.find(r => r.id === requestId);
    if (!target) return;
    setRequests(prev =>
      prev.map(r =>
        r.id === requestId ? { ...r, status: 'FULFILLED', unitsFulfilled: r.unitsNeeded } : r
      )
    );
    updateBloodStock(target.bloodGroup, -target.unitsNeeded);
    showToast(`Blood Request ${requestId} completed & marked FULFILLED`, 'success');

    addNotification({
      userId: target.requesterId,
      title: `Blood Transfusion ${target.id} Fulfilled!`,
      message: `All required units (${target.unitsNeeded} units of ${target.bloodGroup}) for ${target.patientName} at ${target.hospitalName} have been delivered and transfused.`,
      type: 'REQUEST_STATUS',
      severity: 'success',
      linkTab: 'user-my-requests',
      metadata: { requestId: target.id, newStatus: 'FULFILLED' },
    });
  };

  // SOS (STRICTLY RESTRICTED TO ADMIN / CLINICAL DISPATCHERS)
  const triggerSOS = (sosData: {
    bloodGroup: BloodGroup;
    location: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    if (currentUser.role !== 'ADMIN') {
      showToast('Permission Denied: Only Admin / Clinical Dispatchers can broadcast an official SOS.', 'danger');
      return null;
    }

    const sosId = `SOS-${Math.floor(100 + Math.random() * 900)}`;
    const newSOS: SOSAlert = {
      id: sosId,
      userId: currentUser.id,
      userName: `Clinical Dispatch (${currentUser.name})`,
      userPhone: currentUser.phone,
      bloodGroup: sosData.bloodGroup,
      location: sosData.location || 'Metro City - Central Zone',
      latitude: sosData.latitude || 37.7749 + (Math.random() * 0.02 - 0.01),
      longitude: sosData.longitude || -122.4194 + (Math.random() * 0.02 - 0.01),
      status: 'ACTIVE',
      urgency: 'CRITICAL',
      timestamp: new Date().toISOString(),
      notes: sosData.notes || 'Emergency high-priority blood dispatch requested via PulsePoint SOS.',
      respondersCount: 2,
    };
    setSosAlerts(prev => [newSOS, ...prev]);
    showToast(`EMERGENCY SOS ${sosId} BROADCASTED TO NEARBY DONORS & CLINICS`, 'danger');

    // REAL-TIME BROADCAST NOTIFICATION TO ALL NEARBY USERS & DONORS:
    addNotification({
      userId: 'ALL',
      title: `URGENT SOS ALERT: ${newSOS.bloodGroup} Needed Nearby!`,
      message: `CRITICAL: Active emergency at ${newSOS.location}. Compatible donors (${newSOS.bloodGroup}) within 15 km are requested to respond immediately.`,
      type: 'NEARBY_SOS',
      severity: 'critical',
      linkTab: 'user-map',
      metadata: {
        sosId,
        bloodGroup: newSOS.bloodGroup,
        distanceKm: 2.3,
      },
    });

    return sosId;
  };

  const dispatchSOSResponder = (sosId: string) => {
    setSosAlerts(prev =>
      prev.map(s =>
        s.id === sosId
          ? {
              ...s,
              status: 'RESPONDER_DISPATCHED',
              dispatchedAt: new Date().toISOString(),
              respondersCount: s.respondersCount + 1,
            }
          : s
      )
    );
    showToast(`Emergency Medical Responder Dispatched for ${sosId}`, 'info');
  };

  const resolveSOS = (sosId: string) => {
    setSosAlerts(prev =>
      prev.map(s =>
        s.id === sosId
          ? { ...s, status: 'RESOLVED', resolvedAt: new Date().toISOString() }
          : s
      )
    );
    showToast(`Emergency SOS ${sosId} marked as RESOLVED`, 'success');
  };

  const cancelSOS = (sosId: string) => {
    setSosAlerts(prev =>
      prev.map(s => (s.id === sosId ? { ...s, status: 'CANCELLED' } : s))
    );
    showToast(`Emergency SOS ${sosId} cancelled`, 'info');
  };

  const toggleDonorVerification = (donorId: string) => {
    setDonors(prev =>
      prev.map(d => (d.id === donorId ? { ...d, verified: !d.verified } : d))
    );
    showToast('Donor verification status updated', 'info');
  };

  const toggleDonorAvailabilityById = (donorId: string) => {
    setDonors(prev =>
      prev.map(d => {
        if (d.id === donorId) {
          const nextAvail = !d.available;
          showToast(`Donor ${d.name} marked as ${nextAvail ? 'AVAILABLE' : 'RESTING'}`, 'info');
          return { ...d, available: nextAvail };
        }
        return d;
      })
    );
  };

  const toggleUserVerification = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, verified: !u.verified } : u))
    );
    showToast('User credentials verified', 'info');
  };

  const toggleUserRole = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const nextRole: UserRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
    showToast('User role updated', 'info');
  };

  const updateBloodStock = (group: BloodGroup, delta: number) => {
    setBloodStock(prev =>
      prev.map(item => {
        if (item.group === group) {
          const units = Math.max(0, item.unitsAvailable + delta);
          let status: 'OPTIMAL' | 'LOW' | 'CRITICAL' = 'OPTIMAL';
          if (units <= 8) status = 'CRITICAL';
          else if (units <= 16) status = 'LOW';
          return { ...item, unitsAvailable: units, status };
        }
        return item;
      })
    );
  };

  const addDonationRecord = (record: Omit<DonationRecord, 'id' | 'certificateId'>) => {
    const newRecord: DonationRecord = {
      ...record,
      id: `DON-${Math.floor(1000 + Math.random() * 9000)}`,
      certificateId: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setDonationHistory(prev => [newRecord, ...prev]);
    updateBloodStock(record.bloodGroup, record.units);
    showToast(`Donation logged successfully! Certificate ${newRecord.certificateId} generated.`, 'success');
  };

  const resetAllData = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('pulsepoint') || key.includes('pulsepoint'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch {
      // ignore
    }
    setUsers([...INITIAL_USERS]);
    setCurrentUser(GUEST_USER);
    setDonors([...INITIAL_DONORS]);
    setRequests([...INITIAL_REQUESTS]);
    setSosAlerts([...INITIAL_SOS_ALERTS]);
    setDonationHistory([...INITIAL_DONATION_HISTORY]);
    setBloodStock([...INITIAL_BLOOD_STOCK]);
    setBloodBanks([...INITIAL_BLOOD_BANKS]);
    setDonationCamps([...INITIAL_DONATION_CAMPS]);
    setNotifications([...INITIAL_NOTIFICATIONS]);
    showToast('All previous demo data cleared! Please create an account or sign in.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        users,
        donors,
        requests,
        sosAlerts,
        donationHistory,
        bloodStock,
        bloodBanks,
        donationCamps,
        notifications,
        unreadNotificationsCount,
        activeNotification,
        bookCampSlot,
        setCurrentUser,
        loginWithGoogle,
        loginWithEmail,
        registerWithVerification,
        logout,
        switchRole,
        loginAs,
        registerUser,
        updateUserProfile,
        toggleDonorStatus,
        createBloodRequest,
        approveRequest,
        rejectRequest,
        matchDonorToRequest,
        fulfillRequest,
        triggerSOS,
        dispatchSOSResponder,
        resolveSOS,
        cancelSOS,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        toggleDonorVerification,
        toggleDonorAvailabilityById,
        toggleUserVerification,
        toggleUserRole,
        updateBloodStock,
        addDonationRecord,
        showToast,
        dismissToast,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
