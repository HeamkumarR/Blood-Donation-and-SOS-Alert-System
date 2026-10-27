/**
 * User & Donor Model (Mongoose Schema)
 * Supports Geolocation 2dsphere Indexing for Proximity Search
 */
import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UserRole = 'USER' | 'ADMIN';
export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude] as per GeoJSON specification
  addressText?: string;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: Gender;
  city: string;
  district: string;
  state: string;
  address: string;
  profilePhoto?: string;
  location: ILocation;
  role: UserRole;
  isDonor: boolean;
  isAvailable: boolean;
  totalDonations: number;
  lastDonationDate?: Date;
  verified: boolean;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Hidden by default from queries for privacy and security
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Please select blood group'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      index: true,
    },
    age: {
      type: Number,
      required: [true, 'Please specify age'],
      min: [18, 'Donors must be at least 18 years old'],
      max: [65, 'Donors must be under 65 years old'],
    },
    gender: {
      type: String,
      required: [true, 'Please specify gender'],
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    },
    city: {
      type: String,
      required: [true, 'Please specify city (e.g. Chennai)'],
      trim: true,
      default: 'Chennai',
      index: true,
    },
    district: {
      type: String,
      required: [true, 'Please specify district in Tamil Nadu'],
      default: 'Chennai',
      index: true,
    },
    state: {
      type: String,
      default: 'Tamil Nadu',
    },
    address: {
      type: String,
      required: [true, 'Please provide street / locality address'],
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Please provide [longitude, latitude] coordinates'],
        default: [80.2707, 13.0827], // Default Chennai Central
      },
      addressText: String,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
      index: true,
    },
    isDonor: {
      type: Boolean,
      default: true,
      index: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    totalDonations: {
      type: Number,
      default: 0,
    },
    lastDonationDate: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: Record<string, any>) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        return ret;
      },
    },
  }
);

// Indexes: 2dsphere for geospatial proximity ($near, $geoWithin) queries
UserSchema.index({ location: '2dsphere' });

// Compound indexes for rapid matching of available donors by blood group & city
UserSchema.index({ bloodGroup: 1, isAvailable: 1, isDonor: 1 });
UserSchema.index({ district: 1, bloodGroup: 1, isAvailable: 1 });

// Pre-save hook: Hash password before saving
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: Verify candidate password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
