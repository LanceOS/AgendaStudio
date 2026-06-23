import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { CalendarContextValue, CalendarViewMode } from '../types';

const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const contextValue = useMemo(
    () => ({
      selectedDate,
      viewMode,
      activeCategoryId,
      setSelectedDate,
      setViewMode,
      setActiveCategoryId,
    }),
    [selectedDate, viewMode, activeCategoryId]
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
