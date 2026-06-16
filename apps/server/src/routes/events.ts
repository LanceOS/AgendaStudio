import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET events by range
router.get('/', (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (start && end) {
      const stmt = db.prepare('SELECT * FROM events WHERE start >= ? AND end <= ?');
      const events = stmt.all(start, end);
      res.json(events);
    } else {
      const stmt = db.prepare('SELECT * FROM events');
      const events = stmt.all();
      res.json(events);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST create event
router.post('/', (req, res) => {
  try {
    const { title, start, end } = req.body;
    
    if (!title || !start || !end) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare('INSERT INTO events (title, start, end) VALUES (?, ?, ?)');
    const info = stmt.run(title, start, end);
    
    res.status(201).json({
      id: info.lastInsertRowid,
      title,
      start,
      end
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// DELETE event
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const info = stmt.run(id);
    
    if (info.changes > 0) {
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
