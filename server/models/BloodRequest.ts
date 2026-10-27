/**
 * Blood Request Model (Mongoose Schema)
 * Manages clinical transfusion requests, donor assignments, and triage status
 */
import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { BloodGroup } from './User';

export type EmergencyLevel = 'CRITICAL' | 'URGENT' | 'STANDARD';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'MATCHED' | 'FULFILLED' | 'REJECTED' | 'CANCELLED';

export interface IBloodRequest extends Document {
  requester: Types.ObjectId;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  unitsFulfilled: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  district: string;
  hospitalLocation: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  contactPerson: string;
  contactPhone: string;
  emergencyLevel: EmergencyLevel;
  requestStatus: RequestStatus;
  rejectionReason?: string;
  requiredBy: Date;
  medicalNotes?: string;
  assignedDonors: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const BloodRequestSchema: Schema<IBloodRequest> = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Request must be linked to a registered user'],
      index: true,
    },
    patientName: {
      type: String,
      required: [true, 'Please provide patient name'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Please specify blood group required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      index: true,
    },
    unitsRequired: {
      type: Number,
      required: [true, 'Please specify units required'],
      min: [1, 'Must require at least 1 unit'],
      max: [20, 'Cannot exceed 20 units per request batch'],
      default: 1,
    },
    unitsFulfilled: {
      type: Number,
      default: 0,
      min: 0,
    },
    hospitalName: {
      type: String,
      required: [true, 'Please provide hospital name'],
      trim: true,
    },
    hospitalAddress: {
      type: String,
      required: [true, 'Please provide hospital address / ward details'],
    },
    city: {
      type: String,
      required: true,
      default: 'Chennai',
      index: true,
    },
    district: {
      type: String,
      required: true,
      default: 'Chennai',
    },
    hospitalLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [80.2707, 13.0827], // Default Chennai Central coordinates
      },
    },
    contactPerson: {
      type: String,
      required: [true, 'Please provide emergency contact person name'],
    },
    contactPhone: {
      type: String,
      required: [true, 'Please provide contact telephone number'],
    },
    emergencyLevel: {
      type: String,
      enum: ['CRITICAL', 'URGENT', 'STANDARD'],
      default: 'URGENT',
      index: true,
    },
    requestStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'MATCHED', 'FULFILLED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    rejectionReason: String,
    requiredBy: {
      type: Date,
      required: [true, 'Please indicate time limit for blood requirement'],
    },
    medicalNotes: String,
    assignedDonors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
BloodRequestSchema.index({ hospitalLocation: '2dsphere' });
BloodRequestSchema.index({ requestStatus: 1, emergencyLevel: 1 });
BloodRequestSchema.index({ requester: 1, createdAt: -1 });

export const BloodRequest: Model<IBloodRequest> =
  mongoose.models.BloodRequest || mongoose.model<IBloodRequest>('BloodRequest', BloodRequestSchema);
export default BloodRequest;
