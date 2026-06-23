import Database from 'better-sqlite3';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  console.log('Starting ETL migration...');

  // 1. Connect to SQLite
  const sqliteDbPath = path.resolve(__dirname, '../../../database.sqlite');
  console.log(`Reading from SQLite: ${sqliteDbPath}`);
  const sqliteDb = new Database(sqliteDbPath, { readonly: true });

  // 2. Connect to Postgres
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/agendastudio';
  console.log(`Connecting to Postgres: ${connectionString}`);
  const pgPool = new Pool({ connectionString });

  try {
    // 3. Extract data from SQLite
    console.log('Extracting events...');
    const events = sqliteDb.prepare('SELECT * FROM events').all() as any[];
    console.log(`Found ${events.length} events to migrate.`);

    // 4. Load data into Postgres
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      
      for (const event of events) {
        await client.query(
          `INSERT INTO events (id, title, start, "end") VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO NOTHING`,
          [event.id, event.title, event.start, event.end]
        );
      }

      // Reset the sequence for the SERIAL column
      if (events.length > 0) {
        const maxId = Math.max(...events.map(e => e.id));
        await client.query(`SELECT setval('events_id_seq', $1)`, [maxId]);
      }

      await client.query('COMMIT');
      console.log('Migration committed successfully!');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error during Postgres insertion, rolled back.', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    sqliteDb.close();
    await pgPool.end();
  }
}

migrate();
