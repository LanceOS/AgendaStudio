import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createEventsRouter } from './events.js';
import { EventRepository } from '../db/repositories/EventRepository.js';
import { db } from '../db.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const app = express();
app.use(express.json());
const repo = new EventRepository(db);
app.use('/api/events', createEventsRouter(repo));
app.use(errorHandler);

describe('Events API', () => {
  it('should create an event', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({
        title: 'API Test Event',
        start: '2026-06-23T10:00:00Z',
        end: '2026-06-23T11:00:00Z'
      });
      
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('API Test Event');
    expect(res.body.id).toBeDefined();
  });

  it('should fail to create event with invalid data', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({
        title: '', // empty title not allowed
      });
      
    expect(res.status).toBe(400); // validation error
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
});
