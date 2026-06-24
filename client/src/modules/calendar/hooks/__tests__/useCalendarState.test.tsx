import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCalendarState } from '../useCalendarState';
import { CalendarProvider } from '../useCalendarState';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CalendarProvider>{children}</CalendarProvider>
);

describe('useCalendarState', () => {
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
});
