import { Schema, model, Document } from 'mongoose';

export interface IOtp extends Document {
  phone: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
    },
    otp: {
      type: String,
      required: [true, 'OTP is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: function () {
        // Set expiry for 5 minutes from now
        return new Date(Date.now() + 5 * 60 * 1000);
      },
    },
  },
  { timestamps: false },
);

// Create a TTL index on expiresAt to automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = model<IOtp>('Otp', otpSchema);
