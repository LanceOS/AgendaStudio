import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createEventsRouter } from './events.js';
import { EventRepository } from '../db/repositories/EventRepository.js';
import { CategoryRepository } from '../db/repositories/CategoryRepository.js';
import { db } from '../db.js';
import { users } from '../db/schema.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const app = express();
app.use(express.json());
const repo = new EventRepository(db);
const categoryRepository = new CategoryRepository(db);
const userId = 'events-route-test-user';
app.use('/api/events', (req, _res, next) => {
  (req as any).user = { id: userId };
  next();
});
app.use('/api/events', createEventsRouter(repo, categoryRepository));
app.use(errorHandler);

beforeEach(async () => {
  await db.insert(users).values({
    id: userId,
    name: 'Events Route Test User',
    email: 'events-route-test@example.com',
    emailVerified: true,
  });
});

describe('Events API', () => {
  it('should create an event', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({
        title: 'API Test Event',
        color: '#22c55e',
        start: '2026-06-23T10:00:00Z',
        end: '2026-06-23T11:00:00Z'
      });
      
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('API Test Event');
    expect(res.body.color).toBe('#22c55e');
    expect(res.body.id).toBeDefined();
  });

  it('should update an event', async () => {
    const createRes = await request(app)
      .post('/api/events')
      .send({
        title: 'Update Me',
        color: '#3b82f6',
        start: '2026-06-23T10:00:00Z',
        end: '2026-06-23T11:00:00Z',
      });

    const updateRes = await request(app)
      .patch(`/api/events/${createRes.body.id}`)
      .send({ title: 'Updated', color: '#ef4444' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.title).toBe('Updated');
    expect(updateRes.body.color).toBe('#ef4444');
  });

  it('should fail to create event with invalid data', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({
        title: '', // empty title not allowed
      });
      
    expect(res.status).toBe(400); // validation error
  });

  it('should reject a category owned by another user', async () => {
    const otherUserId = 'events-route-other-user';
    await db.insert(users).values({
      id: otherUserId,
      name: 'Other User',
      email: 'events-route-other@example.com',
      emailVerified: true,
    });
    const category = await categoryRepository.create(otherUserId, 'Private', '#000000');

    const res = await request(app)
      .post('/api/events')
      .send({
        title: 'Invalid Category Event',
        categoryId: category.id,
        start: '2026-06-23T10:00:00Z',
        end: '2026-06-23T11:00:00Z',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Category not found');
  });

  it('should get events', async () => {
    await request(app)
      .post('/api/events')
      .send({
        title: 'Fetch Me',
        start: '2026-06-24T10:00:00Z',
        end: '2026-06-24T11:00:00Z'
      });

    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((e: any) => e.title === 'Fetch Me')).toBe(true);
  });

  it('should get events by range', async () => {
    await request(app)
      .post('/api/events')
      .send({
        title: 'Range Event',
        start: '2026-07-15T10:00:00Z',
        end: '2026-07-15T11:00:00Z'
      });

    const res = await request(app)
      .get('/api/events')
      .query({ start: '2026-07-14T00:00:00Z', end: '2026-07-16T00:00:00Z' });
      
    expect(res.status).toBe(200);
    expect(res.body.some((e: any) => e.title === 'Range Event')).toBe(true);
  });

  it('should delete an event', async () => {
    const createRes = await request(app)
      .post('/api/events')
      .send({
        title: 'To Delete',
        start: '2026-08-01T10:00:00Z',
        end: '2026-08-01T11:00:00Z'
      });
      
    const id = createRes.body.id;

    const deleteRes = await request(app).delete(`/api/events/${id}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    // Verify it's deleted
    const notFoundRes = await request(app).delete(`/api/events/${id}`);
    expect(notFoundRes.status).toBe(404);
  });

  it('should reject malformed event IDs', async () => {
    const res = await request(app).delete('/api/events/not-an-id');
    expect(res.status).toBe(400);
  });
});
