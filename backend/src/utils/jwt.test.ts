import { describe, expect, it, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/taskflow_test';
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret';
});

describe('jwt utils', () => {
  it('signs and verifies an access token round trip', async () => {
    const { signAccessToken, verifyAccessToken } = await import('../utils/jwt');
    const token = signAccessToken({ sub: 'user-1', email: 'admin@test.com' });
    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe('user-1');
    expect(payload.email).toBe('admin@test.com');
  });

  it('throws when verifying a tampered token', async () => {
    const { signAccessToken, verifyAccessToken } = await import('../utils/jwt');
    const token = signAccessToken({ sub: 'user-1', email: 'admin@test.com' });
    const tampered = token.slice(0, -2) + 'xx';

    expect(() => verifyAccessToken(tampered)).toThrow();
  });
});
