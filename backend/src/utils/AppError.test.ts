import { describe, expect, it } from 'vitest';
import { AppError } from './AppError';

describe('AppError', () => {
  it('builds a 404 via notFound()', () => {
    const err = AppError.notFound('Task not found');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Task not found');
    expect(err.isOperational).toBe(true);
  });

  it('builds a 400 with details via badRequest()', () => {
    const details = [{ field: 'title', message: 'Title is required' }];
    const err = AppError.badRequest('Validation failed', details);
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual(details);
  });

  it('defaults unauthorized() to a sensible message', () => {
    const err = AppError.unauthorized();
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Not authenticated');
  });
});
