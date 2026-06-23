import { Db } from '../../db.js';
import { appConfigs } from '../schema.js';
import { eq } from 'drizzle-orm';

export interface AppConfig {
  key: string;
  value: string;
  updatedAt: Date;
}

export class AppConfigRepository {
  constructor(private db: Db) {}

  async get(key: string): Promise<string | null> {
    const [config] = await this.db.select().from(appConfigs).where(eq(appConfigs.key, key));
    return config?.value || null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.db.insert(appConfigs)
      .values({ key, value })
      .onConflictDoUpdate({
        target: appConfigs.key,
        set: { value, updatedAt: new Date() }
      });
  }
}
