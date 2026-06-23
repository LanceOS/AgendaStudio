import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import { RepositoryFactory } from './factories/RepositoryFactory.js';
import { createEventsRouter } from './routes/events.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Composition Root: Initialize dependencies
const repositoryFactory = new RepositoryFactory(db);
const eventRepository = repositoryFactory.createEventRepository();

// Routes
const eventsRouter = createEventsRouter(eventRepository);
app.use('/api/events', eventsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
