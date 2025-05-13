import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service';
import asyncHandler from '../../../shared/asyncHandler';
import sendResponse from '../../../shared/sendResponse';
import { IAuthResponse } from './auth.interface';
import config from '../../../config';

// Request OTP for phone login
const requestOtp = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.requestOtp(req.body);

  // Send response
  sendResponse(res, {
    success: true,
    message: result.message,
    data: null,
  });
});

// Verify OTP and login
const verifyOtpAndLogin = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.verifyOtpAndLogin(req.body, res);

  sendResponse<IAuthResponse>(res, {
    success: true,
    message: result.message,
    data: result,
  });
});

// Logout
const logout = asyncHandler(async (req: Request, res: Response) => {
  // Clear the authentication cookie
  res.clearCookie('token');

  // Send response
  sendResponse(res, {
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

export const AuthController = {
  requestOtp,
  verifyOtpAndLogin,
  logout,
};
