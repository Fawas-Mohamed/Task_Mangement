import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError';

export function validateRequest(req: Request, _res: Response, next: NextFunction) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((e) => ({
      field: e.type === 'field' ? e.path : undefined,
      message: e.msg,
    }));
    return next(AppError.badRequest('Validation failed', errors));
  }

  next();
}
