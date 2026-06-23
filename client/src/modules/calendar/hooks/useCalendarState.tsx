import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { CalendarContextValue, CalendarViewMode, CalendarEvent } from '../types';

const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    setEvents((prev) => [
      ...prev,
      {
        ...event,
        id: crypto.randomUUID(),
      },
    ]);
  };

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const contextValue = useMemo(
    () => ({
      selectedDate,
      viewMode,
      activeCategoryId,
      setSelectedDate,
      setViewMode,
      setActiveCategoryId,
      events,
      addEvent,
      removeEvent,
    }),
    [selectedDate, viewMode, activeCategoryId, events]
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
