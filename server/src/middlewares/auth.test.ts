import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { requireAuth } from './auth.js';
import { auth } from '../auth.js';

vi.mock('../auth.js', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

const getSession = vi.mocked(auth.api.getSession);

const createResponse = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as Response;
  vi.mocked(response.status).mockReturnValue(response);
  return response;
};

describe('requireAuth', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rejects requests without a session', async () => {
    getSession.mockResolvedValue(null);
    const req = { headers: {} } as Request;
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches the authenticated user and session', async () => {
    const session = {
      user: { id: 'user-1', email: 'user@example.com' },
      session: { id: 'session-1' },
    };
    getSession.mockResolvedValue(session as never);
    const req = { headers: {} } as Request & { user?: unknown; session?: unknown };
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(req.user).toEqual(session.user);
    expect(req.session).toEqual(session.session);
    expect(next).toHaveBeenCalledOnce();
  });
});
