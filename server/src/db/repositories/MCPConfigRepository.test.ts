import { describe, it, expect } from 'vitest';
import { MCPConfigRepository } from './MCPConfigRepository.js';
import { db } from '../../db.js';

describe('MCPConfigRepository', () => {
  const repo = new MCPConfigRepository(db);

  it('should create an MCP config', async () => {
    const config = await repo.create({
      name: 'Test MCP',
      url: 'http://localhost:8080',
      apiKey: 'test-api-key'
    });

    expect(config).toBeDefined();
    expect(config.id).toBeDefined();
    expect(config.name).toBe('Test MCP');
    expect(config.url).toBe('http://localhost:8080');
    expect(config.apiKey).toBe('test-api-key');
  });

  it('should find all MCP configs', async () => {
    await repo.create({
      name: 'Test MCP 1',
      url: 'http://localhost:8081',
    });

    await repo.create({
      name: 'Test MCP 2',
      url: 'http://localhost:8082',
    });

    const configs = await repo.findAll();
    expect(configs.length).toBeGreaterThanOrEqual(2);
    expect(configs.find(c => c.name === 'Test MCP 1')).toBeDefined();
    expect(configs.find(c => c.name === 'Test MCP 2')).toBeDefined();
  });

  it('should delete an MCP config', async () => {
    const config = await repo.create({
      name: 'Test MCP 3',
      url: 'http://localhost:8083',
    });

    const deleted = await repo.delete(config.id);
    expect(deleted).toBe(true);

    const configs = await repo.findAll();
    expect(configs.find(c => c.id === config.id)).toBeUndefined();
  });

  it('should return false when deleting non-existent config', async () => {
    // Generate a random UUID
    const randomUuid = '123e4567-e89b-12d3-a456-426614174000';
    const deleted = await repo.delete(randomUuid);
    expect(deleted).toBe(false);
  });
});
