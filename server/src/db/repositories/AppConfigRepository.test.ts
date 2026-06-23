import { describe, it, expect } from 'vitest';
import { AppConfigRepository } from './AppConfigRepository.js';
import { db } from '../../db.js';

describe('AppConfigRepository', () => {
  const repo = new AppConfigRepository(db);

  it('should set and get a config value', async () => {
    await repo.set('test_key', 'test_value');
    
    const value = await repo.get('test_key');
    expect(value).toBe('test_value');
  });

  it('should return null for non-existent key', async () => {
    const value = await repo.get('non_existent_key');
    expect(value).toBeNull();
  });

  it('should update an existing config value', async () => {
    await repo.set('update_key', 'initial_value');
    let value = await repo.get('update_key');
    expect(value).toBe('initial_value');

    await repo.set('update_key', 'new_value');
    value = await repo.get('update_key');
    expect(value).toBe('new_value');
  });
});
