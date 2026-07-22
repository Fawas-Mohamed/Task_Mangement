import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authService } from '../services/auth.service';
import { AppError } from '../utils/AppError';

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: result,
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw AppError.badRequest('Refresh token is required');
    }

    const result = await authService.refresh(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: result,
    });
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    // JWTs are stateless, so there is nothing to invalidate server-side by default.
    // The client is responsible for discarding the tokens; this endpoint exists so
    // the frontend has a single, explicit call to make on logout.
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }),
};
