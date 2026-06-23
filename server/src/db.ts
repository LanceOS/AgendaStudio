import 'dotenv/config';
import { PgPoolProvider } from './db/provider.js';
import {
  EventRepository,
  UserRepository,
  SessionRepository,
  MCPConfigRepository,
  AppConfigRepository,
} from './db/repositories/index.js';

export const dbProvider = new PgPoolProvider({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/agendastudio',
});

export const eventRepository = new EventRepository(dbProvider);
export const userRepository = new UserRepository(dbProvider);
export const sessionRepository = new SessionRepository(dbProvider);
export const mcpConfigRepository = new MCPConfigRepository(dbProvider);
export const appConfigRepository = new AppConfigRepository(dbProvider);
