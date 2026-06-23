import { describe, it, expect } from 'vitest';
import { UserRepository } from './UserRepository.js';
import { db } from '../../db.js';

describe('UserRepository', () => {
  const repo = new UserRepository(db);

  it('should create a user', async () => {
    const user = await repo.create({
      id: 'test-user-1',
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: true,
      image: 'http://example.com/image.png'
    });

    expect(user).toBeDefined();
    expect(user.id).toBe('test-user-1');
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
  });

  it('should find user by id', async () => {
    await repo.create({
      id: 'test-user-2',
      name: 'Test User 2',
      email: 'test2@example.com',
      emailVerified: false,
    });

    const user = await repo.findById('test-user-2');
    expect(user).toBeDefined();
    expect(user?.name).toBe('Test User 2');
  });

  it('should find user by email', async () => {
    await repo.create({
      id: 'test-user-3',
      name: 'Test User 3',
      email: 'test3@example.com',
      emailVerified: false,
    });

    const user = await repo.findByEmail('test3@example.com');
    expect(user).toBeDefined();
    expect(user?.id).toBe('test-user-3');
  });

  it('should return null for non-existent user', async () => {
    const user1 = await repo.findById('non-existent');
    expect(user1).toBeNull();

    const user2 = await repo.findByEmail('non@existent.com');
    expect(user2).toBeNull();
  });
});
