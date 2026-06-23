import { Db } from '../../db.js';
import { mcpConfigs } from '../schema.js';
import { eq } from 'drizzle-orm';

export interface MCPConfig {
  id: string;
  name: string;
  url: string;
  apiKey?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class MCPConfigRepository {
  constructor(private db: Db) {}

  async findAll(): Promise<MCPConfig[]> {
    return this.db.select().from(mcpConfigs);
  }

  async create(config: Omit<MCPConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<MCPConfig> {
    const [newConfig] = await this.db.insert(mcpConfigs).values({
      name: config.name,
      url: config.url,
      apiKey: config.apiKey,
    }).returning();
    return newConfig;
  }

  async delete(id: string): Promise<boolean> {
    const [deleted] = await this.db.delete(mcpConfigs).where(eq(mcpConfigs.id, id)).returning({ id: mcpConfigs.id });
    return !!deleted;
  }
}
