import { DatabaseProvider } from '../provider.js';

export interface MCPConfig {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MCPConfigRepository {
  constructor(private db: DatabaseProvider) {}

  async findAll(): Promise<MCPConfig[]> {
    return this.db.query<MCPConfig>('SELECT * FROM mcp_configs ORDER BY name ASC');
  }

  async create(config: Omit<MCPConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<MCPConfig> {
    const rows = await this.db.query<MCPConfig>(
      `INSERT INTO mcp_configs (name, url, "apiKey", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
      [config.name, config.url, config.apiKey]
    );
    return rows[0];
  }

  async delete(id: string): Promise<boolean> {
    const rows = await this.db.query<{ id: string }>(
      'DELETE FROM mcp_configs WHERE id = $1 RETURNING id',
      [id]
    );
    return rows.length > 0;
  }
}
