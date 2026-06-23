import { Pool, PoolClient, PoolConfig } from 'pg';

export interface DatabaseProvider {
  query<T = any>(text: string, params?: any[]): Promise<T[]>;
  transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

export class PgPoolProvider implements DatabaseProvider {
  private pool: Pool;

  constructor(config?: PoolConfig) {
    this.pool = new Pool(config);
  }

  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(text, params);
    return result.rows;
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
