import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './db/schema.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/agendastudio';

export const pool = new pg.Pool({ connectionString });
export const db = drizzle(pool, { schema });

export type Db = typeof db;
