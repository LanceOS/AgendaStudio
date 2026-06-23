import { Router } from 'express';
import { eventRepository } from '../db.js';

const router = Router();

// GET events by range
router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (start && end) {
      const events = await eventRepository.findAll(String(start), String(end));
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
    const { title, start, end } = req.body;
    
    if (!title || !start || !end) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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

export default router;
