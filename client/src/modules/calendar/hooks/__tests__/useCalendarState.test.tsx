import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { useCalendarState } from '../useCalendarState';
import { CalendarProvider } from '../useCalendarState';
import React from 'react';
import { apiClient } from '../../../../services/apiClient';

vi.mock('../../../../services/apiClient', () => ({
  ApiError: class ApiError extends Error {},
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApiClient = vi.mocked(apiClient);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CalendarProvider>{children}</CalendarProvider>
);

describe('useCalendarState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedApiClient.get.mockResolvedValue([]);
    mockedApiClient.post.mockResolvedValue({});
    mockedApiClient.patch.mockResolvedValue({});
    mockedApiClient.delete.mockResolvedValue({});
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useCalendarState(), { wrapper });

    expect(result.current.selectedDate).toBeInstanceOf(Date);
    expect(result.current.viewMode).toBe('month');
    expect(result.current.activeCategoryId).toBe(null);
  });

  it('should change view mode', () => {
    const { result } = renderHook(() => useCalendarState(), { wrapper });

    act(() => {
      result.current.setViewMode('day');
    });

    expect(result.current.viewMode).toBe('day');
  });

  it('should change active category', () => {
    const { result } = renderHook(() => useCalendarState(), { wrapper });

    act(() => {
      result.current.setActiveCategoryId('work');
    });

    expect(result.current.activeCategoryId).toBe('work');
  });

  it('should update selected date', () => {
    const { result } = renderHook(() => useCalendarState(), { wrapper });
    const newDate = new Date('2026-07-01T00:00:00Z');

    act(() => {
      result.current.setSelectedDate(newDate);
    });

    expect(result.current.selectedDate).toEqual(newDate);
  });

  it('loads and maps persisted events and categories', async () => {
    mockedApiClient.get
      .mockResolvedValueOnce([{
        id: 42,
        title: 'Planning',
        categoryId: 7,
        description: null,
        location: null,
        color: '#22c55e',
        isAllDay: false,
        start: '2026-07-01T10:00:00.000Z',
        end: '2026-07-01T11:00:00.000Z',
      }])
      .mockResolvedValueOnce([{ id: 7, name: 'Work', color: '#3b82f6' }]);

    const { result } = renderHook(() => useCalendarState(), { wrapper });

    await waitFor(() => expect(result.current.events).toHaveLength(1));
    expect(result.current.events[0]).toMatchObject({
      id: 42,
      title: 'Planning',
      categoryId: 7,
      color: '#22c55e',
    });
    expect(result.current.events[0].date).toEqual(new Date('2026-07-01T10:00:00.000Z'));

    await waitFor(() => expect(result.current.categories).toEqual([{ id: 7, name: 'Work', color: '#3b82f6' }]));
    expect(mockedApiClient.get).toHaveBeenNthCalledWith(1, '/api/events');
    expect(mockedApiClient.get).toHaveBeenNthCalledWith(2, '/api/categories');
  });

  it('persists an event and maps the created response', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      id: 9,
      title: 'New event',
      categoryId: 3,
      description: null,
      location: null,
      color: '#ef4444',
      isAllDay: false,
      start: '2026-07-02T10:00:00.000Z',
      end: '2026-07-02T11:00:00.000Z',
    });

    const { result } = renderHook(() => useCalendarState(), { wrapper });
    const event = {
      title: 'New event',
      date: new Date('2026-07-02T10:00:00.000Z'),
      endDate: new Date('2026-07-02T11:00:00.000Z'),
      color: '#ef4444',
      categoryId: 3,
    };

    let saved = false;
    await act(async () => {
      saved = await result.current.addEvent(event);
    });

    expect(saved).toBe(true);
    expect(mockedApiClient.post).toHaveBeenCalledWith('/api/events', {
      title: 'New event',
      categoryId: 3,
      color: '#ef4444',
      start: '2026-07-02T10:00:00.000Z',
      end: '2026-07-02T11:00:00.000Z',
    });
    expect(result.current.events[0].id).toBe(9);
  });

  it('persists event updates and deletes', async () => {
    mockedApiClient.get.mockResolvedValueOnce([{
      id: 12,
      title: 'Move me',
      categoryId: null,
      description: null,
      location: null,
      color: '#3b82f6',
      isAllDay: false,
      start: '2026-07-03T10:00:00.000Z',
      end: '2026-07-03T11:00:00.000Z',
    }]);
    mockedApiClient.patch.mockResolvedValueOnce({
      id: 12,
      title: 'Moved',
      categoryId: null,
      description: null,
      location: null,
      color: '#3b82f6',
      isAllDay: false,
      start: '2026-07-03T12:00:00.000Z',
      end: '2026-07-03T13:00:00.000Z',
    });

    const { result } = renderHook(() => useCalendarState(), { wrapper });
    await waitFor(() => expect(result.current.events).toHaveLength(1));

    await act(async () => {
      expect(await result.current.updateEvent(12, {
        title: 'Moved',
        date: new Date('2026-07-03T12:00:00.000Z'),
        endDate: new Date('2026-07-03T13:00:00.000Z'),
      })).toBe(true);
    });
    expect(mockedApiClient.patch).toHaveBeenCalledWith('/api/events/12', {
      title: 'Moved',
      start: '2026-07-03T12:00:00.000Z',
      end: '2026-07-03T13:00:00.000Z',
    });
    expect(result.current.events[0].title).toBe('Moved');

    await act(async () => {
      expect(await result.current.removeEvent(12)).toBe(true);
    });
    expect(mockedApiClient.delete).toHaveBeenCalledWith('/api/events/12');
    expect(result.current.events).toHaveLength(0);
  });

  it('exposes persistence errors without changing local state', async () => {
    mockedApiClient.post.mockRejectedValueOnce(new Error('offline'));
    const { result } = renderHook(() => useCalendarState(), { wrapper });

    let saved = true;
    await act(async () => {
      saved = await result.current.addEvent({
        title: 'Offline event',
        date: new Date('2026-07-04T10:00:00.000Z'),
        endDate: new Date('2026-07-04T11:00:00.000Z'),
        categoryId: null,
      });
    });

    expect(saved).toBe(false);
    expect(result.current.events).toHaveLength(0);
    expect(result.current.error).toBe('Unable to save event.');
  });
});
