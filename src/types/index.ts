export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'CRITICAL' | 'URGENT' | 'STANDARD';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'MATCHED' | 'DISPATCHED' | 'FULFILLED' | 'REJECTED';

export type SOSStatus = 'ACTIVE' | 'RESPONDER_DISPATCHED' | 'RESOLVED' | 'CANCELLED';

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  bloodGroup: BloodGroup;
  city: string;
  isDonor: boolean;
  donorAvailability: boolean;
  lastDonationDate?: string;
  verified: boolean;
  avatar?: string;
  authProvider?: 'google' | 'manual';
  password?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  phone: string;
  city: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  available: boolean;
  totalDonations: number;
  lastDonationDate: string;
  verified: boolean;
  rating: number;
}

export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  unitsFulfilled: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  requestedAt: string;
  requiredBy: string;
  notes?: string;
  assignedDonorIds?: string[];
  rejectionReason?: string;
}

export interface SOSAlert {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  bloodGroup: BloodGroup;
  location: string;
  latitude: number;
  longitude: number;
  status: SOSStatus;
  urgency: UrgencyLevel;
  dispatchedAt?: string;
  resolvedAt?: string;
  timestamp: string;
  notes?: string;
  respondersCount: number;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donorName: string;
  bloodGroup: BloodGroup;
  recipientName: string;
  hospital: string;
  date: string;
  units: number;
  certificateId: string;
}

export interface BloodStock {
  group: BloodGroup;
  unitsAvailable: number;
  status: 'OPTIMAL' | 'LOW' | 'CRITICAL';
  lastUpdated?: string;
}

export interface AppNotification {
  id: string;
  userId: string; // recipient userId, or 'ALL' for broadcast
  title: string;
  message: string;
  type: 'REQUEST_STATUS' | 'NEARBY_SOS' | 'DONATION' | 'SYSTEM';
  severity: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  linkTab?: string;
  metadata?: {
    requestId?: string;
    sosId?: string;
    newStatus?: RequestStatus;
    distanceKm?: number;
    bloodGroup?: BloodGroup;
  };
}

export type BloodComponent =
  | 'Whole Blood'
  | 'Packed Red Blood Cells (PRBC)'
  | 'Platelet Concentrate (RDP)'
  | 'Fresh Frozen Plasma (FFP)'
  | 'Cryoprecipitate';

export interface BloodBankCenter {
  id: string;
  name: string;
  category: 'Government' | 'Red Cross' | 'Charitable' | 'Private';
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  licensedNumber: string;
  operatingHours: string;
  componentAvailability: Record<BloodGroup, number>;
}

export interface DonationCamp {
  id: string;
  name: string;
  organizer: string;
  venue: string;
  city: string;
  state: string;
  date: string;
  timeRange: string;
  contactNumber: string;
  totalSlots: number;
  bookedSlots: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  userBooked?: boolean;
  latitude?: number;
  longitude?: number;
}

