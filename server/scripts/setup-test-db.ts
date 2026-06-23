import pg from 'pg';
import { execSync } from 'child_process';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres'
});

async function setup() {
  try {
    await pool.query('CREATE DATABASE agendastudio_test');
    console.log('Created agendastudio_test database');
  } catch (e: any) {
    if (e.code === '42P04') {
      console.log('Database agendastudio_test already exists');
    } else {
      console.error('Error creating database:', e);
      process.exit(1);
    }
  } finally {
    await pool.end();
  }

  console.log('Running migrations on agendastudio_test...');
  execSync('npx drizzle-kit push', {
    env: { ...process.env, DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/agendastudio_test' },
    stdio: 'inherit'
  });
  console.log('Test database setup complete.');
}

setup();
