# PulsePoint: Emergency Blood Donor & SOS Alert System
### Chennai & Tamil Nadu Production-Grade Healthcare Emergency Platform
Built with **React (TypeScript) + Vite + Tailwind CSS + Node.js + Express + MongoDB (Mongoose) + Google Maps Platform**

---

## 🚀 Quick Start in VS Code (Run in 3 Steps)

### Step 1: Open in VS Code
Open your terminal and navigate to the project directory:
```bash
cd pulsepoint-blood-emergency
code .
```

### Step 2: Install Dependencies
Open the integrated terminal in VS Code (`Ctrl + ~` or `Cmd + ~`) and run:
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(The preconfigured Google Maps API key is already bundled in `.env.example` for instant interactive map rendering!)*

---

## 💻 Running the Application

### Option A: Run Frontend (Client App)
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
- Interactive Google Maps GPS Navigator centered on Chennai & Tamil Nadu
- Real-time SOS Alert broadcasts (Admin-restricted)
- e-RaktKosh certified blood bank stock search
- Voluntary donation camp slot bookings
- Donor proximity locator with distance filters

### Option B: Run Full-Stack Express + MongoDB Backend
Make sure MongoDB is running locally (`mongod`) or provide a remote MongoDB URI in `.env`:
```bash
# Seed initial Chennai & Tamil Nadu dataset (RGGGH, Apollo, Stanley, etc.)
npm run seed

# Start the Express API server
npm run server
```
The REST API will start on **[http://localhost:5000](http://localhost:5000)**:
- Health Check: `GET http://localhost:5000/api/health`
- Auth Routes: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- User & Donor Proximity: `/api/users/nearby-donors`, `/api/users/profile`
- Blood Requests: `/api/requests`
- Emergency SOS Beacon: `/api/sos/broadcast`
- Admin Clinical Management: `/api/admin/overview`, `/api/admin/users`, `/api/admin/requests`

---

## 📁 Project Architecture & Folder Structure

```text
├── src/                               # Frontend (React 19 + TypeScript + Tailwind)
│   ├── components/                    # UI Components
│   │   ├── GoogleMapsGPS.tsx          # Google Maps Platform GPS Navigator (Pins, Routes, ETA)
│   │   ├── Navbar.tsx                 # Header with Admin SOS Broadcast, Role Switcher & Reset
│   │   ├── Sidebar.tsx                # Role-Based Navigation Menu
│   │   ├── NotificationCenter.tsx     # Real-time alert notifications dropdown
│   │   ├── BloodCompatibilityMatrix.tsx# Blood transfusion compatibility chart
│   │   └── StatCard.tsx               # Analytics metric widgets
│   ├── context/
│   │   └── AppContext.tsx             # Global state, RBAC, Toast alerts, LocalStorage sync
│   ├── data/
│   │   └── initialData.ts             # Chennai & Tamil Nadu donors, hospitals & blood banks
│   ├── pages/
│   │   ├── user/                      # User-Facing Views (Privacy-Protected)
│   │   │   ├── UserDashboard.tsx      # Welcome overview & quick emergency actions
│   │   │   ├── UsersMap.tsx           # Google Maps Live GPS Radar & Directions
│   │   │   ├── FindDonor.tsx          # Geospatial donor search (Privacy masked)
│   │   │   ├── RequestBlood.tsx       # Clinical requisition form
│   │   │   ├── SOS.tsx                # Nearby SOS alert incident monitor
│   │   │   ├── BloodAvailabilitySearch.tsx # e-RaktKosh live blood bank stock finder
│   │   │   ├── DonationCamps.tsx      # Upcoming blood drives & slot booking
│   │   │   ├── MyRequests.tsx         # User's own requisition tracking
│   │   │   ├── DonationHistory.tsx    # Certificates & donation records
│   │   │   └── Profile.tsx            # Personal credentials & emergency contacts
│   │   └── admin/                     # Clinical Administration Views (Protected)
│   │       ├── AdminDashboard.tsx     # System statistics, active alerts & triage
│   │       ├── BloodRequests.tsx      # Approve, match, and fulfill requests
│   │       ├── SOSRequests.tsx        # SOS emergency console & responder dispatch
│   │       ├── Donors.tsx             # Manage & verify registered donors
│   │       ├── Users.tsx              # User role management & audit
│   │       ├── Reports.tsx            # Inventory health & analytics charts
│   │       └── Settings.tsx           # Proximity thresholds & system reset
│   ├── types/                         # TypeScript interfaces and domain types
│   ├── App.tsx                        # Main application container & view router
│   ├── main.tsx                       # React root entry point
│   └── index.css                      # Tailwind CSS v4 styles
│
├── server/                            # Backend (Node.js + Express + TypeScript + Mongoose)
│   ├── config/
│   │   └── db.ts                      # MongoDB connection & index configuration
│   ├── models/
│   │   ├── User.ts                    # User/Donor schema with bcrypt & 2dsphere index
│   │   ├── BloodRequest.ts            # Clinical request schema with relationships
│   │   ├── SOSAlert.ts                # Emergency beacon with geolocation coordinates
│   │   └── DonationHistory.ts         # Verified donation records & certificates
│   ├── middleware/
│   │   └── auth.ts                    # JWT verification & RBAC authorization
│   ├── controllers/
│   │   ├── authController.ts          # Signup, login, password reset, JWT
│   │   ├── userController.ts          # Profile & privacy-filtered donor search
│   │   ├── requestController.ts       # Requisitions, matching, cancellation
│   │   ├── sosController.ts           # Emergency broadcast & notifications
│   │   └── adminController.ts         # Admin overview, users, requests management
│   ├── routes/
│   │   ├── authRoutes.ts              # /api/auth
│   │   ├── userRoutes.ts              # /api/users
│   │   ├── requestRoutes.ts           # /api/requests
│   │   ├── sosRoutes.ts               # /api/sos
│   │   └── adminRoutes.ts             # /api/admin
│   ├── seed/
│   │   └── seedData.ts                # Realistic Chennai & TN database seed script
│   └── server.ts                      # Express API entry point
│
├── .env.example                       # Environment configuration template
├── package.json                       # NPM dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
└── vite.config.ts                     # Vite build configuration
```

---

## 🔒 Role-Based Access Control (RBAC) & Privacy

| Feature | Standard User | Clinical Administrator |
|---|:---:|:---:|
| **Find Donors Nearby** | ✅ (Contact Masked) | ✅ (Full Unrestricted Access) |
| **Request Blood** | ✅ | ✅ |
| **View Own Requisitions** | ✅ (Only own) | ✅ (All system-wide) |
| **Broadcast SOS Alert** | ❌ (Read-only incident view) | ✅ (Full broadcast authority) |
| **Approve / Reject Requests**| ❌ | ✅ |
| **Dispatch Responders** | ❌ | ✅ |
| **Verify Donors** | ❌ | ✅ |
| **System Analytics & Audit** | ❌ | ✅ |

---

## 🗺️ Chennai & Tamil Nadu Emergency Coverage

The application is preloaded with real healthcare coordinates and hospitals across Tamil Nadu:
- **Rajiv Gandhi Government General Hospital (RGGGH)**, Chennai
- **Apollo Hospitals**, Greams Road, Chennai
- **Govt Stanley Medical College Hospital**, Royapuram
- **Govt Kilpauk Medical College Hospital**, Kilpauk
- **Fortis Malar Hospital**, Adyar
- **Indian Red Cross Society**, Egmore
- **Coimbatore Medical College Hospital (CMCH)**, Coimbatore
- **Govt Rajaji Hospital (GRH)**, Madurai

---

## 🛠️ Available NPM Scripts

- `npm run dev`: Starts the Vite client dev server at port 3000
- `npm run build`: Bundles the React application for production
- `npm run server`: Launches the Express Node.js backend on port 5000
- `npm run seed`: Seeds MongoDB with realistic Chennai & Tamil Nadu records
- `npm run lint`: Validates TypeScript types across the entire project
