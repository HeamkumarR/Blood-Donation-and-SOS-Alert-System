/**
 * SOS Alert Model (Mongoose Schema)
 * Real-time emergency beacon broadcast with 2dsphere geolocation
 */
import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { BloodGroup } from './User';

export type SOSStatus = 'ACTIVE' | 'DISPATCHED' | 'RESOLVED' | 'CANCELLED';

export interface ISOSAlert extends Document {
  user: Types.ObjectId;
  userName: string;
  userPhone: string;
  bloodGroup: BloodGroup;
  emergencyMessage: string;
  locationName: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  alertStatus: SOSStatus;
  urgency: 'CRITICAL';
  notifiedDonorsCount: number;
  dispatchedAt?: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SOSAlertSchema: Schema<ISOSAlert> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      index: true,
    },
    emergencyMessage: {
      type: String,
      required: [true, 'Please provide emergency situational message'],
      default: 'CRITICAL: Severe blood loss trauma. Immediate compatible transfusion needed.',
    },
    locationName: {
      type: String,
      required: [true, 'Please provide landmark / street location name'],
      default: 'Chennai Metropolitan Corridor',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [80.2707, 13.0827], // Chennai
      },
    },
    alertStatus: {
      type: String,
      enum: ['ACTIVE', 'DISPATCHED', 'RESOLVED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
    urgency: {
      type: String,
      enum: ['CRITICAL'],
      default: 'CRITICAL',
    },
    notifiedDonorsCount: {
      type: Number,
      default: 0,
    },
    dispatchedAt: Date,
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

SOSAlertSchema.index({ location: '2dsphere' });
SOSAlertSchema.index({ alertStatus: 1, createdAt: -1 });

export const SOSAlert: Model<ISOSAlert> =
  mongoose.models.SOSAlert || mongoose.model<ISOSAlert>('SOSAlert', SOSAlertSchema);
export default SOSAlert;
