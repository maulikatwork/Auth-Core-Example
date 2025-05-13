import express, { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import requestValidator from '../../middlewares/requestValidator';
import { otpVerificationSchema, phoneOtpRequestSchema } from './auth.validator';
import authentication from '../../middlewares/authorization';
import { authMiddleware } from 'auth-core';

const router = express.Router();

// Public routes
// Phone OTP routes
router.post('/request-otp', requestValidator(phoneOtpRequestSchema), AuthController.requestOtp);

router.post('/login-phone', requestValidator(otpVerificationSchema), AuthController.verifyOtpAndLogin);

// Logout route
router.post('/logout', AuthController.logout);

// Protected routes examples
// Any authenticated user can access this route - using auth-core directly
router.get('/me', ...authMiddleware({ include: ['user'] }), (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'User data retrieved successfully',
    data: {
      user: req.user,
    },
  });
});

// Any authenticated user can access this route - using our wrapper
router.get('/profile', authentication(), (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Profile data retrieved successfully',
    data: {
      user: req.user,
    },
  });
});

// Only admin users can access this route
router.get('/admin-dashboard', authentication('admin'), (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Admin dashboard data retrieved successfully',
    data: {
      adminStats: {
        totalUsers: 100,
        activeUsers: 75,
      },
    },
  });
});

// Multiple roles can access this route
router.get('/management', authentication('admin', 'super_admin'), (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Management data retrieved successfully',
    data: {
      managementData: {
        systemStatus: 'operational',
      },
    },
  });
});

export default router;
