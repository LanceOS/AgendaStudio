/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, type ReactNode } from 'react';
import type { CalendarContextValue, CalendarViewMode, CalendarEvent, Category } from '../types';
import { apiClient, ApiError } from '../../../services/apiClient';

const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

interface CalendarProviderProps {
  children: ReactNode;
}

interface ApiEvent {
  id: number;
  title: string;
  categoryId: number | null;
  description: string | null;
  location: string | null;
  color: string | null;
  isAllDay: boolean;
  start: string;
  end: string;
}

interface ApiCategory {
  id: number;
  name: string;
  color: string;
}

const fromApiEvent = (event: ApiEvent): CalendarEvent => ({
  id: event.id,
  title: event.title,
  categoryId: event.categoryId,
  description: event.description,
  location: event.location,
  color: event.color ?? undefined,
  isAllDay: event.isAllDay,
  date: new Date(event.start),
  endDate: new Date(event.end),
});

const toApiEvent = (event: Partial<CalendarEvent>) => ({
  ...(event.title !== undefined && { title: event.title }),
  ...(event.categoryId !== undefined && {
    categoryId: typeof event.categoryId === 'number' ? event.categoryId : null,
  }),
  ...(event.description !== undefined && { description: event.description }),
  ...(event.location !== undefined && { location: event.location }),
  ...(event.color !== undefined && { color: event.color }),
  ...(event.isAllDay !== undefined && { isAllDay: event.isAllDay }),
  ...(event.date !== undefined && { start: event.date.toISOString() }),
  ...(event.endDate !== undefined && { end: event.endDate.toISOString() }),
});

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [activeCategoryId, setActiveCategoryId] = useState<string | number | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (cause: unknown, fallback: string) => (
    cause instanceof ApiError ? cause.message : fallback
  );

  useEffect(() => {
    let active = true;
    void apiClient.get<ApiEvent[]>('/api/events')
      .then((remoteEvents) => {
        if (active) setEvents(remoteEvents.map(fromApiEvent));
      })
      .catch((cause) => {
        if (active) setError(getErrorMessage(cause, 'Unable to load events.'));
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void apiClient.get<ApiCategory[]>('/api/categories')
      .then((remoteCategories) => {
        if (active) setCategories(remoteCategories);
      })
      .catch((cause) => {
        if (active) setError(getErrorMessage(cause, 'Unable to load categories.'));
      });

    return () => {
      active = false;
    };
  }, []);

  const addEvent = useCallback(async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const createdEvent = await apiClient.post<ApiEvent>('/api/events', toApiEvent(event));
      setEvents((prev) => [...prev, fromApiEvent(createdEvent)]);
      setError(null);
      return true;
    } catch (cause) {
      setError(getErrorMessage(cause, 'Unable to save event.'));
      return false;
    }
  }, []);

  const addCategory = useCallback(async (category: Omit<Category, 'id'>) => {
    try {
      const createdCategory = await apiClient.post<ApiCategory>('/api/categories', category);
      setCategories((prev) => [...prev, createdCategory]);
      setError(null);
      return true;
    } catch (cause) {
      setError(getErrorMessage(cause, 'Unable to save category.'));
      return false;
    }
  }, []);

  const removeEvent = useCallback(async (id: string | number) => {
    try {
      await apiClient.delete(`/api/events/${encodeURIComponent(String(id))}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setError(null);
      return true;
    } catch (cause) {
      setError(getErrorMessage(cause, 'Unable to delete event.'));
      return false;
    }
  }, []);

  const updateEvent = useCallback(async (id: string | number, updates: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = await apiClient.patch<ApiEvent>(
        `/api/events/${encodeURIComponent(String(id))}`,
        toApiEvent(updates),
      );
      setEvents((prev) => prev.map((event) => (
        event.id === id ? fromApiEvent(updatedEvent) : event
      )));
      setError(null);
      return true;
    } catch (cause) {
      setError(getErrorMessage(cause, 'Unable to update event.'));
      return false;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      selectedDate,
      viewMode,
      activeCategoryId,
      setSelectedDate,
      setViewMode,
      setActiveCategoryId,
      events,
      categories,
      error,
      addEvent,
      addCategory,
      updateEvent,
      removeEvent,
    }),
    [selectedDate, viewMode, activeCategoryId, events, categories, error, addEvent, addCategory, updateEvent, removeEvent]
  );

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarState = (): CalendarContextValue => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarState must be used within a CalendarProvider');
  }
  return context;
};
