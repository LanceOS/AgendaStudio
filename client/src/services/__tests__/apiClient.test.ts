import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('includes cookies and sends JSON requests', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));

    await apiClient.post('/api/events', { title: 'Test' });

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/events', expect.objectContaining({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ title: 'Test' }),
    }));
  });

  it('uses the server error field when a request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(
      JSON.stringify({ error: 'Category not found' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    ));

    await expect(apiClient.get('/api/categories')).rejects.toMatchObject({
      status: 400,
      message: 'Category not found',
    });
  });
});
