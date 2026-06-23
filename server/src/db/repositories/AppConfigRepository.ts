import { DatabaseProvider } from '../provider.js';

export interface AppConfig {
  key: string;
  value: string;
  updatedAt: Date;
}

export class AppConfigRepository {
  constructor(private db: DatabaseProvider) {}

  async get(key: string): Promise<string | null> {
    const rows = await this.db.query<AppConfig>('SELECT * FROM app_configs WHERE key = $1', [key]);
    return rows[0]?.value || null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.db.query(
      `INSERT INTO app_configs (key, value, "updatedAt") 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, "updatedAt" = NOW()`,
      [key, value]
    );
  }
}
