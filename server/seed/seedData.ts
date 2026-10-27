/**
 * Seed Database Script (Chennai & Tamil Nadu Dataset)
 * Populates MongoDB with realistic donors, clinical blood banks, and requests
 */
import connectDB from '../config/db';
import { User } from '../models/User';
import { BloodRequest } from '../models/BloodRequest';
import { SOSAlert } from '../models/SOSAlert';
import { DonationHistory } from '../models/DonationHistory';

export const CHENNAI_SEED_USERS = [
  {
    fullName: 'Dr. K. Senthil Nathan',
    email: 'admin.senthil@pulsepoint.tn.gov.in',
    password: 'Password@123',
    phone: '+91 94440 12345',
    bloodGroup: 'O-',
    age: 46,
    gender: 'Male',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Rajiv Gandhi Govt General Hospital Complex, Park Town, Chennai',
    role: 'ADMIN',
    isDonor: true,
    isAvailable: true,
    location: {
      type: 'Point',
      coordinates: [80.2778, 13.0805], // RGGGH Chennai Central
    },
    verified: true,
    totalDonations: 24,
  },
  {
    fullName: 'Ananya Ramakrishnan',
    email: 'ananya.r@example.com',
    password: 'Password@123',
    phone: '+91 98401 23456',
    bloodGroup: 'O+',
    age: 26,
    gender: 'Female',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    address: '4th Avenue, Shanthi Colony, Anna Nagar, Chennai',
    role: 'USER',
    isDonor: true,
    isAvailable: true,
    location: {
      type: 'Point',
      coordinates: [80.2101, 13.085], // Anna Nagar
    },
    verified: true,
    totalDonations: 7,
  },
  {
    fullName: 'Karthik Subramanian',
    email: 'karthik.subbu@example.com',
    password: 'Password@123',
    phone: '+91 98840 34567',
    bloodGroup: 'B+',
    age: 31,
    gender: 'Male',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Pondy Bazaar, T. Nagar, Chennai',
    role: 'USER',
    isDonor: true,
    isAvailable: true,
    location: {
      type: 'Point',
      coordinates: [80.2341, 13.0418], // T. Nagar
    },
    verified: true,
    totalDonations: 12,
  },
  {
    fullName: 'Vigneshwaran Selvam',
    email: 'vicky.selvam@example.com',
    password: 'Password@123',
    phone: '+91 97910 45678',
    bloodGroup: 'A+',
    age: 28,
    gender: 'Male',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Gandhi Nagar, Adyar, Chennai',
    role: 'USER',
    isDonor: true,
    isAvailable: true,
    location: {
      type: 'Point',
      coordinates: [80.2573, 13.0067], // Adyar
    },
    verified: true,
    totalDonations: 5,
  },
  {
    fullName: 'Meenakshi Sundaram',
    email: 'meena.sundaram@example.com',
    password: 'Password@123',
    phone: '+91 94433 56789',
    bloodGroup: 'A-',
    age: 34,
    gender: 'Female',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    address: 'GST Road, Tambaram West, Chennai',
    role: 'USER',
    isDonor: true,
    isAvailable: true,
    location: {
      type: 'Point',
      coordinates: [80.1165, 12.9249], // Tambaram
    },
    verified: true,
    totalDonations: 4,
  },
  {
    fullName: 'Saravanan Muthukumar',
    email: 'saravanan.m@example.com',
    password: 'Password@123',
    phone: '+91 98422 67890',
    bloodGroup: 'AB+',
    age: 29,
    gender: 'Male',
    city: 'Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    address: 'Avinashi Road, Peelamedu, Coimbatore',
    role: 'USER',
    isDonor: true,
    isAvailable: true,
    location: {
      type: 'Point',
      coordinates: [76.9669, 11.0028], // Coimbatore
    },
    verified: true,
    totalDonations: 8,
  },
  {
    fullName: 'Lakshmi Narayanan',
    email: 'lakshmi.n@example.com',
    password: 'Password@123',
    phone: '+91 94421 78901',
    bloodGroup: 'O-',
    age: 38,
    gender: 'Male',
    city: 'Madurai',
    district: 'Madurai',
    state: 'Tamil Nadu',
    address: 'KK Nagar, Madurai',
    role: 'USER',
    isDonor: true,
    isAvailable: true,
    location: {
      type: 'Point',
      coordinates: [78.1198, 9.9252], // Madurai
    },
    verified: true,
    totalDonations: 16,
  },
];

export const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await BloodRequest.deleteMany({});
    await SOSAlert.deleteMany({});
    await DonationHistory.deleteMany({});

    console.log('[Seed] Inserting Chennai & Tamil Nadu Users and Donors...');
    const createdUsers: any[] = await User.insertMany(CHENNAI_SEED_USERS);

    const admin = createdUsers.find((u: any) => u.role === 'ADMIN')!;
    const user1 = createdUsers.find((u: any) => u.email === 'ananya.r@example.com')!;
    const user2 = createdUsers.find((u: any) => u.email === 'karthik.subbu@example.com')!;

    console.log('[Seed] Inserting Sample Tamil Nadu Blood Requests...');
    await BloodRequest.create([
      {
        requester: user1._id,
        patientName: 'R. Balasubramanian',
        bloodGroup: 'O+',
        unitsRequired: 2,
        unitsFulfilled: 1,
        hospitalName: 'Rajiv Gandhi Government General Hospital (RGGGH)',
        hospitalAddress: 'EVR Periyar Salai, Park Town, Chennai',
        city: 'Chennai',
        district: 'Chennai',
        hospitalLocation: {
          type: 'Point',
          coordinates: [80.2778, 13.0805],
        },
        contactPerson: 'Ananya Ramakrishnan',
        contactPhone: '+91 98401 23456',
        emergencyLevel: 'CRITICAL',
        requestStatus: 'MATCHED',
        requiredBy: new Date(Date.now() + 6 * 60 * 60 * 1000),
        medicalNotes: 'Emergency cardiac bypass surgery in Ward 4. Immediate blood cross-match ready.',
        assignedDonors: [user2._id],
      },
      {
        requester: user2._id,
        patientName: 'Kavitha S.',
        bloodGroup: 'A+',
        unitsRequired: 3,
        unitsFulfilled: 0,
        hospitalName: 'Apollo Hospitals (Greams Road)',
        hospitalAddress: '21 Greams Lane, Thousand Lights, Chennai',
        city: 'Chennai',
        district: 'Chennai',
        hospitalLocation: {
          type: 'Point',
          coordinates: [80.2514, 13.0604],
        },
        contactPerson: 'Karthik Subramanian',
        contactPhone: '+91 98840 34567',
        emergencyLevel: 'URGENT',
        requestStatus: 'APPROVED',
        requiredBy: new Date(Date.now() + 18 * 60 * 60 * 1000),
        medicalNotes: 'Dengue-induced acute thrombocytopenia. Platelet concentrate requisitioned.',
      },
    ]);

    console.log('[Seed] Inserting Active Emergency SOS Alert in Chennai...');
    await SOSAlert.create([
      {
        user: admin._id,
        userName: 'Clinical Trauma Triage (RGGGH Chennai)',
        userPhone: '+91 94440 12345',
        bloodGroup: 'O-',
        emergencyMessage: 'CRITICAL: Multiple collision trauma admission near Anna Flyover, Chennai. Immediate O- / O+ units needed.',
        locationName: 'Anna Flyover / Gemini Circle, Mount Road, Chennai',
        location: {
          type: 'Point',
          coordinates: [80.2522, 13.0526],
        },
        alertStatus: 'ACTIVE',
        urgency: 'CRITICAL',
        notifiedDonorsCount: 18,
      },
    ]);

    console.log('[Seed] Seeding completed successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
};
