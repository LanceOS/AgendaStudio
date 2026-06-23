import { describe, it, expect, beforeEach } from 'vitest';
import { SessionRepository } from './SessionRepository.js';
import { UserRepository } from './UserRepository.js';
import { db } from '../../db.js';

describe('SessionRepository', () => {
  const repo = new SessionRepository(db);
  const userRepo = new UserRepository(db);

  beforeEach(async () => {
    await userRepo.create({
      id: 'session-test-user',
      name: 'Session Test User',
      email: 'session@example.com',
      emailVerified: true
    });
  });

  it('should create a session', async () => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    const session = await repo.create({
      id: 'session-1',
      userId: 'session-test-user',
      token: 'test-token-1',
      expiresAt
    });

    expect(session).toBeDefined();
    expect(session.id).toBe('session-1');
    expect(session.userId).toBe('session-test-user');
    expect(session.token).toBe('test-token-1');
  });

  it('should find session by token', async () => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    await repo.create({
      id: 'session-2',
      userId: 'session-test-user',
      token: 'test-token-2',
      expiresAt
    });

    const session = await repo.findByToken('test-token-2');
    expect(session).toBeDefined();
    expect(session?.id).toBe('session-2');
  });

  it('should return null for invalid token', async () => {
    const session = await repo.findByToken('invalid-token');
    expect(session).toBeNull();
  });

  it('should delete session by token', async () => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    await repo.create({
      id: 'session-3',
      userId: 'session-test-user',
      token: 'test-token-3',
      expiresAt
    });

    const deleted = await repo.deleteByToken('test-token-3');
    expect(deleted).toBe(true);

    const session = await repo.findByToken('test-token-3');
    expect(session).toBeNull();
  });

  it('should return false when deleting non-existent session', async () => {
    const deleted = await repo.deleteByToken('non-existent-token');
    expect(deleted).toBe(false);
  });
});
