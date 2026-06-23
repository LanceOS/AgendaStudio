import { describe, it, expect } from 'vitest';
import { EventRepository } from './EventRepository.js';
import { db } from '../../db.js';

describe('EventRepository', () => {
  const repo = new EventRepository(db);

  it('should create an event', async () => {
    const event = await repo.create('Test Event', '2026-06-23T10:00:00Z', '2026-06-23T11:00:00Z');
    
    expect(event).toBeDefined();
    expect(event.id).toBeDefined();
    expect(event.title).toBe('Test Event');
    // Start and end are parsed back depending on PG config, but roughly equivalent
  });

  it('should find all events', async () => {
    await repo.create('Event 1', '2026-06-24T10:00:00Z', '2026-06-24T11:00:00Z');
    await repo.create('Event 2', '2026-06-25T10:00:00Z', '2026-06-25T11:00:00Z');

    const events = await repo.findAll();
    expect(events.length).toBeGreaterThanOrEqual(2);
  });

  it('should find events by date range', async () => {
    await repo.create('Event A', '2026-07-01T10:00:00Z', '2026-07-01T11:00:00Z');
    await repo.create('Event B', '2026-07-05T10:00:00Z', '2026-07-05T11:00:00Z');

    const events = await repo.findAll('2026-07-01T00:00:00Z', '2026-07-02T00:00:00Z');
    
    expect(events.some(e => e.title === 'Event A')).toBe(true);
    expect(events.some(e => e.title === 'Event B')).toBe(false);
  });

  it('should delete an event', async () => {
    const event = await repo.create('Delete Me', '2026-08-01T10:00:00Z', '2026-08-01T11:00:00Z');

    const deleted = await repo.delete(event.id);
    expect(deleted).toBe(true);

    const events = await repo.findAll();
    expect(events.find(e => e.id === event.id)).toBeUndefined();
  });
});
