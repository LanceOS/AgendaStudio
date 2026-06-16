import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import eventsRouter from './routes/events.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
