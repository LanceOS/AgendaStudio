import { Router } from 'express';
import { EventRepository } from '../db/repositories/EventRepository.js';
import { CreateEventSchema, QueryEventsSchema } from '../schemas/event.schema.js';

export function createEventsRouter(eventRepository: EventRepository) {
  const router = Router();

  // GET events by range
  router.get('/', async (req, res) => {
    try {
      const parseResult = QueryEventsSchema.safeParse(req.query);
      if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters', details: parseResult.error.errors });
      }

      const { start, end } = parseResult.data;
      
      if (start && end) {
        const events = await eventRepository.findAll(start, end);
        res.json(events);
      } else {
        const events = await eventRepository.findAll();
        res.json(events);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  // POST create event
  router.post('/', async (req, res) => {
    try {
      const parseResult = CreateEventSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: 'Validation failed', details: parseResult.error.errors });
      }

      const { title, start, end } = parseResult.data;

      const event = await eventRepository.create(title, start, end);
      
      res.status(201).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  });

  // DELETE event
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const success = await eventRepository.delete(id);
      
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  });

  return router;
}
