import { beforeEach, describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';
import { createCategoriesRouter } from './categories.js';
import { CategoryRepository } from '../db/repositories/CategoryRepository.js';
import { db } from '../db.js';
import { users } from '../db/schema.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const app = express();
app.use(express.json());
const userId = 'categories-route-test-user';
const categoryRepository = new CategoryRepository(db);
app.use('/api/categories', (req, _res, next) => {
  (req as any).user = { id: userId };
  next();
});
app.use('/api/categories', createCategoriesRouter(categoryRepository));
app.use(errorHandler);

beforeEach(async () => {
  await db.insert(users).values({
    id: userId,
    name: 'Categories Route Test User',
    email: 'categories-route-test@example.com',
    emailVerified: true,
  });
});

describe('Categories API', () => {
  it('should create and list categories for the authenticated user', async () => {
    const createRes = await request(app)
      .post('/api/categories')
      .send({ name: 'Work', color: '#3b82f6' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe('Work');
    expect(createRes.body.color).toBe('#3b82f6');

    const listRes = await request(app).get('/api/categories');
    expect(listRes.status).toBe(200);
    expect(listRes.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: createRes.body.id, name: 'Work' }),
    ]));
  });

  it('should reject malformed category IDs', async () => {
    const res = await request(app).delete('/api/categories/not-an-id');
    expect(res.status).toBe(400);
  });
});
