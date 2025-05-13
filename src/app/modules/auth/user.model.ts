import mongoose, { Document, Schema } from 'mongoose';

// User schema interface
export interface IUser extends Document {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// User schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super_admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Create and export User model
export const User = mongoose.model<IUser>('User', userSchema);
