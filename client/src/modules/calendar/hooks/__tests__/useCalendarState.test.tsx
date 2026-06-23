import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCalendarState } from '../useCalendarState';

describe('useCalendarState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useCalendarState());

    expect(result.current.selectedDate).toBeInstanceOf(Date);
    expect(result.current.viewMode).toBe('month');
    expect(result.current.activeCategory).toBe('all');
  });

  it('should change view mode', () => {
    const { result } = renderHook(() => useCalendarState());

    act(() => {
      result.current.setViewMode('day');
    });

    expect(result.current.viewMode).toBe('day');
  });

  it('should change active category', () => {
    const { result } = renderHook(() => useCalendarState());

    act(() => {
      result.current.setActiveCategory('work');
    });

    expect(result.current.activeCategory).toBe('work');
  });

  it('should update selected date', () => {
    const { result } = renderHook(() => useCalendarState());
    const newDate = new Date('2026-07-01T00:00:00Z');

    act(() => {
      result.current.setSelectedDate(newDate);
    });

    expect(result.current.selectedDate).toEqual(newDate);
  });
});
