import React from 'react';
import { CalendarHeader } from './CalendarHeader';
import { MonthGrid } from './MonthGrid';
import { YearGrid } from './YearGrid';

export interface CalendarViewProps {
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
  viewMode?: 'month' | 'year';
  onViewModeChange?: (mode: 'month' | 'year') => void;
  events?: Array<{ id: string; date: Date; label: string; color?: string }>;
  onDayExpand?: (date: Date) => void;
  onEventClick?: (eventId: string) => void;
  style?: React.CSSProperties;
}

export function CalendarView({
  currentDate = new Date(),
  onDateChange = () => {},
  viewMode = 'month',
  onViewModeChange,
  events = [],
  onDayExpand,
  onEventClick,
  style
}: CalendarViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', ...style }}>
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onDateChange={onDateChange}
        onViewModeChange={onViewModeChange}
      />
      {viewMode === 'year' ? (
        <YearGrid
          currentDate={currentDate}
          events={events}
          onDayExpand={onDayExpand}
        />
      ) : (
        <MonthGrid
          currentDate={currentDate}
          events={events}
          onDayExpand={onDayExpand}
          onEventClick={onEventClick}
        />
      )}
    </div>
  );
}
