import {
  BloodGroup,
  BloodRequest,
  BloodStock,
  DonationRecord,
  Donor,
  SOSAlert,
  User,
  BloodBankCenter,
  DonationCamp,
} from '../types';

// Default system administrator account for clinical review
export const INITIAL_USERS: User[] = [
  {
    id: 'admin_sys',
    name: 'Clinical Administrator',
    email: 'admin@pulsepoint.org',
    phone: '+91 94440 12345',
    role: 'ADMIN',
    bloodGroup: 'O-',
    city: 'Chennai',
    isDonor: false,
    donorAvailability: false,
    verified: true,
    authProvider: 'manual',
    emergencyContact: {
      name: 'Emergency Central Dispatch',
      relationship: 'Department',
      phone: '108',
    },
  },
];

// CLEAN INITIAL STATE: Zero demo donors, zero fake requests, zero fake alerts
export const INITIAL_DONORS: Donor[] = [];

export const INITIAL_REQUESTS: BloodRequest[] = [];

export const INITIAL_SOS_ALERTS: SOSAlert[] = [];

export const INITIAL_DONATION_HISTORY: DonationRecord[] = [];

// Clinical Blood Compatibility Matrix (Red Blood Cells)
export const BLOOD_COMPATIBILITY: Record<
  BloodGroup,
  {
    canGiveTo: BloodGroup[];
    canReceiveFrom: BloodGroup[];
  }
> = {
  'O-': {
    canGiveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
  },
  'O+': {
    canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+'],
  },
  'A-': {
    canGiveTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-'],
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+'],
  },
  'B-': {
    canGiveTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'B-'],
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'B-', 'B+'],
  },
  'AB-': {
    canGiveTo: ['AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'],
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  },
};

export const INITIAL_BLOOD_STOCK: BloodStock[] = [
  { group: 'A+', unitsAvailable: 15, status: 'OPTIMAL' },
  { group: 'A-', unitsAvailable: 6, status: 'LOW' },
  { group: 'B+', unitsAvailable: 18, status: 'OPTIMAL' },
  { group: 'B-', unitsAvailable: 5, status: 'LOW' },
  { group: 'AB+', unitsAvailable: 9, status: 'OPTIMAL' },
  { group: 'AB-', unitsAvailable: 2, status: 'CRITICAL' },
  { group: 'O+', unitsAvailable: 22, status: 'OPTIMAL' },
  { group: 'O-', unitsAvailable: 3, status: 'CRITICAL' },
];

// Tamil Nadu Blood Bank Centers Directory
export const INITIAL_BLOOD_BANKS: BloodBankCenter[] = [
  {
    id: 'BB-01',
    name: 'Rajiv Gandhi Govt General Hospital (RGGGH) Blood Bank',
    category: 'Government',
    address: 'EVR Periyar Salai, Park Town',
    city: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91 44 2530 5000',
    email: 'bloodbank.rgggh@tn.gov.in',
    distanceKm: 2.1,
    latitude: 13.0805,
    longitude: 80.2785,
    licensedNumber: 'TN-BB-CH-001',
    operatingHours: '24 Hours / 7 Days',
    componentAvailability: {
      'O+': 24,
      'O-': 4,
      'A+': 18,
      'A-': 5,
      'B+': 20,
      'B-': 3,
      'AB+': 8,
      'AB-': 2,
    },
  },
  {
    id: 'BB-02',
    name: 'Tamil Nadu State Blood Transfusion Council (TNSBTC)',
    category: 'Government',
    address: 'DMS Compound, Anna Salai, Teynampet',
    city: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91 44 2432 1534',
    email: 'tnsbtc@tn.gov.in',
    distanceKm: 3.8,
    latitude: 13.0418,
    longitude: 80.2507,
    licensedNumber: 'TN-BB-CH-002',
    operatingHours: '08:00 AM - 08:00 PM',
    componentAvailability: {
      'O+': 32,
      'O-': 6,
      'A+': 15,
      'A-': 4,
      'B+': 25,
      'B-': 5,
      'AB+': 10,
      'AB-': 3,
    },
  },
  {
    id: 'BB-03',
    name: 'Apollo Main Hospital Blood Bank',
    category: 'Private',
    address: '21 Greams Lane, Thousand Lights',
    city: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91 44 2829 0200',
    email: 'bloodbank_chennai@apollohospitals.com',
    distanceKm: 2.5,
    latitude: 13.0604,
    longitude: 80.2505,
    licensedNumber: 'TN-BB-CH-012',
    operatingHours: '24 Hours / 7 Days',
    componentAvailability: {
      'O+': 40,
      'O-': 8,
      'A+': 25,
      'A-': 7,
      'B+': 30,
      'B-': 6,
      'AB+': 12,
      'AB-': 4,
    },
  },
  {
    id: 'BB-04',
    name: 'Government Stanley Medical College Blood Bank',
    category: 'Government',
    address: 'Old Jail Road, Royapuram',
    city: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91 44 2528 1351',
    email: 'bloodbank.stanley@tn.gov.in',
    distanceKm: 4.2,
    latitude: 13.1067,
    longitude: 80.2872,
    licensedNumber: 'TN-BB-CH-005',
    operatingHours: '24 Hours / 7 Days',
    componentAvailability: {
      'O+': 19,
      'O-': 3,
      'A+': 14,
      'A-': 2,
      'B+': 16,
      'B-': 4,
      'AB+': 7,
      'AB-': 1,
    },
  },
];

// Scheduled Donation Camps in Tamil Nadu
export const INITIAL_DONATION_CAMPS: DonationCamp[] = [
  {
    id: 'CAMP-TN-01',
    name: 'Chennai Central Railway Station Red Cross Blood Drive',
    organizer: 'Indian Red Cross Society, Tamil Nadu Branch',
    venue: 'Concourse Hall, Central Railway Station, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    date: '2026-10-18',
    timeRange: '09:00 AM - 04:30 PM',
    contactNumber: '+91 94441 55667',
    totalSlots: 150,
    bookedSlots: 42,
    status: 'Upcoming',
    latitude: 13.0827,
    longitude: 80.2755,
  },
  {
    id: 'CAMP-TN-02',
    name: 'Anna University Tech Campus Rotary Voluntary Camp',
    organizer: 'Rotary Club of Madras East & NSS Anna University',
    venue: 'Vivekananda Auditorium, CEG Campus, Guindy',
    city: 'Chennai',
    state: 'Tamil Nadu',
    date: '2026-10-22',
    timeRange: '08:30 AM - 03:00 PM',
    contactNumber: '+91 98402 77889',
    totalSlots: 250,
    bookedSlots: 88,
    status: 'Upcoming',
    latitude: 13.0102,
    longitude: 80.2355,
  },
];
