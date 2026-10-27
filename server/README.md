# Production-Ready Emergency Blood Donor & SOS Alert Architecture
### Full-Stack: React + Node.js + Express + MongoDB (Mongoose)

---

## 1. Directory Structure

```text
├── server/
│   ├── config/
│   │   └── db.ts                   # MongoDB connection with retry & 2dsphere index configuration
│   ├── models/
│   │   ├── User.ts                 # User/Donor schema with bcrypt hook & 2dsphere GeoJSON
│   │   ├── BloodRequest.ts         # Clinical requisition schema with requester ref & donor refs
│   │   ├── SOSAlert.ts             # Emergency trauma beacon schema with geospatial index
│   │   └── DonationHistory.ts      # Completed donations & certificate generation schema
│   ├── middleware/
│   │   └── auth.ts                 # JWT Bearer token authentication & RBAC authorization
│   ├── controllers/
│   │   ├── authController.ts       # Signup, login, password hashing, JWT issue, forgot password
│   │   ├── userController.ts       # User profile, availability toggle, privacy-filtered $near donor search
│   │   ├── requestController.ts    # User blood request creation, own requests tracking, cancellation
│   │   ├── sosController.ts        # Emergency SOS broadcast & automatic donor proximity notification
│   │   └── adminController.ts      # Admin triage, user/donor management, request approve/reject
│   ├── routes/
│   │   ├── authRoutes.ts           # /api/auth/*
│   │   ├── userRoutes.ts           # /api/users/*
│   │   ├── requestRoutes.ts        # /api/requests/*
│   │   ├── sosRoutes.ts            # /api/sos/*
│   │   └── adminRoutes.ts          # /api/admin/* (Protected by role === 'ADMIN')
│   ├── seed/
│   │   └── seedData.ts             # Realistic Chennai & Tamil Nadu dataset (RGGGH, Apollo, Stanley)
│   ├── server.ts                   # Express server entry point with CORS & error middleware
│   └── README.md                   # Complete architectural documentation
```

---

## 2. MongoDB Schemas & Relationships

### `User` Collection (Donors & Users)
```typescript
{
  _id: ObjectId,
  fullName: String,                // Required, trim
  email: String,                   // Required, unique, index
  password: String,                // Bcrypt hash (cost 10), select: false
  phone: String,                   // Contact number
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
  age: Number,                     // min: 18, max: 65
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say',
  city: String,                    // e.g., 'Chennai'
  district: String,                // e.g., 'Chennai', 'Coimbatore', 'Madurai'
  state: String,                   // 'Tamil Nadu'
  address: String,
  location: {
    type: 'Point',
    coordinates: [Number, Number]  // [longitude, latitude] (GeoJSON standard)
  },
  role: 'USER' | 'ADMIN',          // Default 'USER'
  isDonor: Boolean,
  isAvailable: Boolean,
  totalDonations: Number,
  verified: Boolean,
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  }
}
```
**Indexes**:
- `location: "2dsphere"` (For spatial proximity calculations: `$near`, `$geoWithin`)
- `{ bloodGroup: 1, isAvailable: 1, isDonor: 1 }` (Fast donor match)

---

### `BloodRequest` Collection
```typescript
{
  _id: ObjectId,
  requester: ObjectId -> ref: 'User',
  patientName: String,
  bloodGroup: 'O+' | 'O-' | ...,
  unitsRequired: Number,
  unitsFulfilled: Number,
  hospitalName: String,            // e.g., 'Rajiv Gandhi Govt General Hospital (RGGGH)'
  hospitalAddress: String,
  city: String,                    // 'Chennai'
  hospitalLocation: {
    type: 'Point',
    coordinates: [80.2778, 13.0805]
  },
  contactPerson: String,
  contactPhone: String,
  emergencyLevel: 'CRITICAL' | 'URGENT' | 'STANDARD',
  requestStatus: 'PENDING' | 'APPROVED' | 'MATCHED' | 'FULFILLED' | 'REJECTED' | 'CANCELLED',
  requiredBy: Date,
  medicalNotes: String,
  assignedDonors: [ObjectId -> ref: 'User']
}
```

---

### `SOSAlert` Collection
```typescript
{
  _id: ObjectId,
  user: ObjectId -> ref: 'User',
  userName: String,
  userPhone: String,
  bloodGroup: String,
  emergencyMessage: String,
  locationName: String,            // e.g. 'Anna Flyover / Gemini Circle, Chennai'
  location: {
    type: 'Point',
    coordinates: [80.2522, 13.0526]
  },
  alertStatus: 'ACTIVE' | 'DISPATCHED' | 'RESOLVED' | 'CANCELLED',
  urgency: 'CRITICAL',
  notifiedDonorsCount: Number,
  dispatchedAt: Date,
  resolvedAt: Date
}
```

---

## 3. Role-Based Access Control (RBAC) Matrix

| Endpoint | Method | Role Allowed | Description | Privacy Rules |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | Public | User / Donor signup | Hashes password with bcrypt |
| `/api/auth/login` | POST | Public | Generates JWT token | Returns 30-day bearer token |
| `/api/users/profile` | GET | `USER`, `ADMIN` | Get authenticated profile | Self only |
| `/api/users/nearby-donors` | GET | `USER`, `ADMIN` | Geolocation $near search | Phone masked, emails stripped for users |
| `/api/requests` | POST | `USER`, `ADMIN` | Submit clinical request | Auto-assigned to requester |
| `/api/requests/my-requests` | GET | `USER`, `ADMIN` | View own requests | User sees ONLY their own records |
| `/api/sos/trigger` | POST | `USER`, `ADMIN` | Emergency broadcast | Finds compatible donors in 15km |
| `/api/admin/dashboard-stats`| GET | `ADMIN` ONLY | Aggregate stats & analytics | Strict 403 for regular users |
| `/api/admin/users` | GET | `ADMIN` ONLY | Full user management | Unrestricted admin audit |
| `/api/admin/requests/:id/status`| PATCH | `ADMIN` ONLY | Approve/Reject/Assign donor | Clinical coordinator control |

---

## 4. Key MongoDB Query: Geospatial Proximity ($near)

```javascript
// Find compatible donors within 15 km in Chennai
db.users.find({
  isDonor: true,
  isAvailable: true,
  bloodGroup: { $in: ['O+', 'O-'] },
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [80.2707, 13.0827] // Chennai Longitude, Latitude
      },
      $maxDistance: 15000 // 15,000 meters
    }
  }
}).limit(20);
```
