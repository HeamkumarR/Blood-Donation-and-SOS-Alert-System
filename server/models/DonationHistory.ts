/**
 * Donation History Model (Mongoose Schema)
 * Records verified blood donations, issued certificate IDs, and clinical milestones
 */
import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { BloodGroup } from './User';

export type DonationStatus = 'COMPLETED' | 'VERIFIED' | 'PENDING_LAB_ANALYSIS';

export interface IDonationHistory extends Document {
  donor: Types.ObjectId;
  donorName: string;
  bloodGroup: BloodGroup;
  recipient?: Types.ObjectId;
  recipientName: string;
  hospitalName: string;
  city: string;
  unitsDonated: number;
  donationDate: Date;
  certificateId: string;
  status: DonationStatus;
  bloodBagId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationHistorySchema: Schema<IDonationHistory> = new Schema(
  {
    donor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    donorName: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    recipientName: {
      type: String,
      required: true,
      default: 'Regional Blood Bank Reserves, Chennai',
    },
    hospitalName: {
      type: String,
      required: true,
      default: 'Rajiv Gandhi Government General Hospital (RGGGH)',
    },
    city: {
      type: String,
      default: 'Chennai',
    },
    unitsDonated: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    donationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'VERIFIED', 'PENDING_LAB_ANALYSIS'],
      default: 'VERIFIED',
    },
    bloodBagId: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

DonationHistorySchema.index({ donor: 1, donationDate: -1 });

export const DonationHistory: Model<IDonationHistory> =
  mongoose.models.DonationHistory ||
  mongoose.model<IDonationHistory>('DonationHistory', DonationHistorySchema);
export default DonationHistory;
