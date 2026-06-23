import { Router } from 'express';
import { EventRepository } from '../db/repositories/EventRepository.js';
import { CreateEventSchema, QueryEventsSchema } from '../schemas/event.schema.js';
import { validate } from '../middlewares/validate.js';

export function createEventsRouter(eventRepository: EventRepository) {
  const router = Router();

  // GET events by range
  router.get('/', validate({ query: QueryEventsSchema }), async (req, res) => {
    // The query is guaranteed to be valid and type-safe here because of the middleware
    const { start, end } = req.query as any;
    
    if (start && end) {
      const events = await eventRepository.findAll(String(start), String(end));
      res.json(events);
    } else {
      const events = await eventRepository.findAll();
      res.json(events);
    }
  });

  // POST create event
  router.post('/', validate({ body: CreateEventSchema }), async (req, res) => {
    // req.body is guaranteed valid and safe
    const { title, start, end } = req.body;

    const event = await eventRepository.create(title, start, end);
    res.status(201).json(event);
  });

  // DELETE event
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    const success = await eventRepository.delete(id);
    
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
