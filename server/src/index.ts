import 'express-async-errors'; // MUST BE IMPORTED BEFORE EXPRESS
import express from 'express';
import cors from 'cors';
import { env } from './env.js';
import { db } from './db.js';
import { RepositoryFactory } from './factories/RepositoryFactory.js';
import { createEventsRouter } from './routes/events.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const port = env.PORT;

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

// Centralized Error Handling Middleware MUST be the last middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
