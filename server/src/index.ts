import 'express-async-errors'; // MUST BE IMPORTED BEFORE EXPRESS
import express from 'express';
import cors from 'cors';
import { env } from './env.js';
import { db } from './db.js';
import { RepositoryFactory } from './factories/RepositoryFactory.js';
import { createEventsRouter } from './routes/events.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { auth } from './auth.js';
import { toNodeHandler } from 'better-auth/node';
import { requireAuth } from './middlewares/auth.js';

const app = express();
const port = env.PORT;

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
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

app.all('/api/auth/*', toNodeHandler(auth));

app.get('/api/auth-check', requireAuth, (req, res) => {
  res.json({ status: 'authenticated', user: (req as any).user });
});

// Centralized Error Handling Middleware MUST be the last middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
