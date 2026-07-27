/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, type ReactNode } from 'react';
import type { CalendarContextValue, CalendarViewMode, CalendarEvent, Category } from '../types';
import { apiClient } from '../../../services/apiClient';

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

  useEffect(() => {
    let active = true;
    void apiClient.get<ApiEvent[]>('/api/events')
      .then((remoteEvents) => {
        if (active) setEvents(remoteEvents.map(fromApiEvent));
      })
      .catch(() => {
        // The calendar remains usable if the initial request fails.
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
      .catch(() => {
        // Category creation remains available when the initial request fails.
      });

    return () => {
      active = false;
    };
  }, []);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    void apiClient.post<ApiEvent>('/api/events', toApiEvent(event))
      .then((createdEvent) => setEvents((prev) => [...prev, fromApiEvent(createdEvent)]))
      .catch(() => {
        // Do not add an event locally when persistence fails.
      });
  }, []);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    void apiClient.post<ApiCategory>('/api/categories', category)
      .then((createdCategory) => setCategories((prev) => [...prev, createdCategory]))
      .catch(() => {
        // Do not add a category locally when persistence fails.
      });
  }, []);

  const removeEvent = useCallback((id: string | number) => {
    void apiClient.delete(`/api/events/${encodeURIComponent(String(id))}`)
      .then(() => setEvents((prev) => prev.filter((e) => e.id !== id)))
      .catch(() => {
        // Keep the event visible when persistence fails.
      });
  }, []);

  const updateEvent = useCallback((id: string | number, updates: Partial<CalendarEvent>) => {
    void apiClient.patch<ApiEvent>(`/api/events/${encodeURIComponent(String(id))}`, toApiEvent(updates))
      .then((updatedEvent) => {
        setEvents((prev) => prev.map((event) => (
          event.id === id ? fromApiEvent(updatedEvent) : event
        )));
      })
      .catch(() => {
        // Keep the existing event unchanged when persistence fails.
      });
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
      addEvent,
      addCategory,
      updateEvent,
      removeEvent,
    }),
    [selectedDate, viewMode, activeCategoryId, events, categories, addEvent, addCategory, updateEvent, removeEvent]
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
