import { beforeAll, afterAll, beforeEach } from 'vitest';
import { db, pool } from '../db';
import { sql } from 'drizzle-orm';

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  // Clear tables before each test
  const tables = ['users', 'sessions', 'accounts', 'verifications', 'mcp_configs', 'app_configs', 'events'];
  for (const table of tables) {
    try {
      await db.execute(sql.raw(`TRUNCATE TABLE ${table} CASCADE;`));
    } catch(e) {
      // Ignore if table doesn't exist yet
    }
  }
});
