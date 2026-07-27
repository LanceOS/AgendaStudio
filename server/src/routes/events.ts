import { Router } from 'express';
import { EventRepository } from '../db/repositories/EventRepository.js';
import { CategoryRepository } from '../db/repositories/CategoryRepository.js';
import { CreateEventSchema, QueryEventsSchema, UpdateEventSchema } from '../schemas/event.schema.js';
import { validate } from '../middlewares/validate.js';

export function createEventsRouter(eventRepository: EventRepository, categoryRepository: CategoryRepository) {
  const router = Router();

  // GET events by range
  router.get('/', validate({ query: QueryEventsSchema }), async (req, res) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // The query is guaranteed to be valid and type-safe here because of the middleware
    const { start, end } = req.query as any;
    
    if (start && end) {
      const events = await eventRepository.findAll(String(userId), String(start), String(end));
      res.json(events);
    } else {
      const events = await eventRepository.findAll(String(userId));
      res.json(events);
    }
  });

  // POST create event
  router.post('/', validate({ body: CreateEventSchema }), async (req, res) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // req.body is guaranteed valid and safe
    const eventData = req.body;

    if (eventData.categoryId !== undefined && eventData.categoryId !== null) {
      const category = await categoryRepository.findById(eventData.categoryId, String(userId));
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    const event = await eventRepository.create(String(userId), eventData);
    res.status(201).json(event);
  });

  // PATCH update event
  router.patch('/:id', validate({ body: UpdateEventSchema }), async (req, res) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const eventData = req.body;
    if (eventData.categoryId !== undefined && eventData.categoryId !== null) {
      const category = await categoryRepository.findById(eventData.categoryId, String(userId));
      if (!category) return res.status(400).json({ error: 'Category not found' });
    }

    const event = await eventRepository.update(String(userId), id, eventData);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  });

  // DELETE event
  router.delete('/:id', async (req, res) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    
    const success = await eventRepository.delete(String(userId), id);
    
    if (success) {
      res.json({ success: true });
    } else {
      // Throwing an error automatically propagates it to the errorHandler middleware
      const err = new Error('Event not found');
      (err as any).statusCode = 404;
      throw err;
    }
  });

  return router;
}
