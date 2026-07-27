import { beforeEach, describe, it, expect } from 'vitest';
import { EventRepository } from './EventRepository.js';
import { db } from '../../db.js';
import { users } from '../schema.js';

describe('EventRepository', () => {
  const repo = new EventRepository(db);
  const userId = 'event-test-user';

  beforeEach(async () => {
    await db.insert(users).values({
      id: userId,
      name: 'Event Test User',
      email: 'event-test@example.com',
      emailVerified: true,
    });
  });

  it('should create an event', async () => {
    const event = await repo.create(userId, {
      title: 'Test Event',
      start: '2026-06-23T10:00:00Z',
      end: '2026-06-23T11:00:00Z',
    });
    
    expect(event).toBeDefined();
    expect(event.id).toBeDefined();
    expect(event.title).toBe('Test Event');
    // Start and end are parsed back depending on PG config, but roughly equivalent
  });

  it('should find all events', async () => {
    await repo.create(userId, { title: 'Event 1', start: '2026-06-24T10:00:00Z', end: '2026-06-24T11:00:00Z' });
    await repo.create(userId, { title: 'Event 2', start: '2026-06-25T10:00:00Z', end: '2026-06-25T11:00:00Z' });

    const events = await repo.findAll(userId);
    expect(events.length).toBeGreaterThanOrEqual(2);
  });

  it('should find events by date range', async () => {
    await repo.create(userId, { title: 'Event A', start: '2026-07-01T10:00:00Z', end: '2026-07-01T11:00:00Z' });
    await repo.create(userId, { title: 'Event B', start: '2026-07-05T10:00:00Z', end: '2026-07-05T11:00:00Z' });

    const events = await repo.findAll(userId, '2026-07-01T00:00:00Z', '2026-07-02T00:00:00Z');
    
    expect(events.some(e => e.title === 'Event A')).toBe(true);
    expect(events.some(e => e.title === 'Event B')).toBe(false);
  });

  it('should delete an event', async () => {
    const event = await repo.create(userId, { title: 'Delete Me', start: '2026-08-01T10:00:00Z', end: '2026-08-01T11:00:00Z' });

    const deleted = await repo.delete(userId, event.id);
    expect(deleted).toBe(true);

    const events = await repo.findAll(userId);
    expect(events.find(e => e.id === event.id)).toBeUndefined();
  });

  it('should isolate events and mutations by user', async () => {
    const otherUserId = 'event-test-other-user';
    await db.insert(users).values({
      id: otherUserId,
      name: 'Other Event User',
      email: 'event-test-other@example.com',
      emailVerified: true,
    });

    const otherEvent = await repo.create(otherUserId, {
      title: 'Private event',
      start: '2026-08-02T10:00:00Z',
      end: '2026-08-02T11:00:00Z',
    });

    expect(await repo.findAll(userId)).toHaveLength(0);
    expect(await repo.delete(userId, otherEvent.id)).toBe(false);
  });
});
