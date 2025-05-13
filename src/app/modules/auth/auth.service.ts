import { User, IUser } from './user.model';
import { Otp } from './otp.model';
import { IAuthResponse } from './auth.interface';
import config from '../../../config';
import bcrypt from 'bcrypt';
import { generateOtp, initializeAuth, issueToken } from 'auth-core';
import CustomError from '../../errors';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Response } from 'express';

// Initialize the auth-core with our configuration
initializeAuth({
  // JWT configuration
  jwt: {
    secret: config.jwt.accessToken.secret as string,
    expiresIn: config.jwt.accessToken.expiresIn,
    cookie: {
      enabled: true,
      options: {
        httpOnly: true,
        secure: config.server.env === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
        ...(config.server.env === 'production' && { domain: '.apano.in' }),
        ...(config.server.env === 'production' && { sameSite: 'strict' }),
      },
    },
    // Define what goes into the JWT token - keep it minimal for security and performance
    generateTokenPayload: (user: any) => ({
      id: user._id.toString(),
      role: user.role,
    }),
  },

  // Define what user data is returned to the client
  // This is separate from the JWT payload and can include more details
  serializeUser: (user: any) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  }),

  // Lookup function to find users by identifier
  findUser: async (identifier: string, context?: { strategy?: string }) => {
    if (context?.strategy === 'emailPassword') {
      return await User.findOne({ email: identifier }).select('+password');
    } else if (context?.strategy === 'phoneOtp') {
      return await User.findOne({ phone: identifier });
    } else if (context?.strategy === 'token') {
      console.log('token', identifier);
      return await User.findById(identifier);
    }
    return null;
  },

  // For OTP authentication
  onOtpRequest: async (phone: string, otp: string) => {
    // Generate the OTP
    otp = generateOtp(6, '1234567890');

    // Save to database - upsert (create or update)
    await Otp.findOneAndUpdate(
      { phone },
      {
        phone,
        otp,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
      },
      { upsert: true, new: true },
    );

    // In a real implementation, send the OTP via SMS
    console.log(`OTP for ${phone}: ${otp}`);
  },

  verifyOtp: async (phone: string, otp: string) => {
    // Find the OTP record
    const otpRecord = await Otp.findOne({
      phone,
      expiresAt: { $gt: new Date() }, // Check if not expired
    });

    // If no record found or OTP doesn't match
    if (!otpRecord || otpRecord.otp !== otp) {
      return false;
    }

    // Delete the OTP record after successful verification
    await Otp.deleteOne({ _id: otpRecord._id });

    return true;
  },
});

// Request OTP for phone login
const requestOtp = async ({ phone }: { phone: string }) => {
  if (!phone) {
    throw new CustomError.BadRequestError('Phone number is required');
  }

  // Generate OTP
  const otp = generateOtp(6, '1234567890');

  // Save to database - upsert (create or update)
  await Otp.findOneAndUpdate(
    { phone },
    {
      phone,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    },
    { upsert: true, new: true },
  );

  // In a real implementation, send the OTP via SMS
  console.log(`OTP for ${phone}: ${otp}`);

  return {
    message: 'OTP sent successfully',
  };
};

// Verify OTP and login with phone
const verifyOtpAndLogin = async ({ phone, otp }: { phone: string; otp: string }, res: Response): Promise<IAuthResponse> => {
  if (!phone || !otp) {
    throw new CustomError.BadRequestError('Phone number and OTP are required');
  }

  // Find the OTP record
  const otpRecord = await Otp.findOne({
    phone,
    expiresAt: { $gt: new Date() }, // Check if not expired
  });

  // If no record found or OTP doesn't match
  if (!otpRecord || otpRecord.otp !== otp) {
    throw new CustomError.UnAuthorizedError('Invalid or expired OTP');
  }

  // Delete the OTP record after successful verification
  await Otp.deleteOne({ _id: otpRecord._id });

  // Find user by phone
  let user = await User.findOne({ phone });

  // If user not found, create a new user
  if (!user) {
    user = await User.create({
      phone,
      role: 'user', // Default role
    });
  }

  // Use issueToken from auth-core to generate token and set cookie
  const token = issueToken(user, res);

  return {
    user: {
      id: (user._id as Types.ObjectId).toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
    message: 'Login successful',
  };
};

export const AuthService = {
  requestOtp,
  verifyOtpAndLogin,
};
