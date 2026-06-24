import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { CalendarView } from '../../../../../library/components/calendarview';
import { useCalendarState } from '../hooks/useCalendarState';

export const CalendarScreen: React.FC = () => {
  const { 
    selectedDate, setSelectedDate, 
    events, viewMode, setViewMode
  } = useCalendarState();
  const navigate = useNavigate();

  const mappedEvents = useMemo(() => {
    return events.map(e => ({ id: e.id, date: e.date, label: e.title, color: e.color || 'var(--color-primary)' }));
  }, [events]);

  const handleDayExpand = (date: Date) => {
    setSelectedDate(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    navigate(`/calendar/day/${dateStr}`);
  };

  return (
    <div className="lib-h-full">
      <CalendarView 
        currentDate={selectedDate}
        onDateChange={setSelectedDate}
        viewMode={viewMode as 'month' | 'year'}
        onViewModeChange={(mode) => setViewMode(mode)}
        onDayExpand={handleDayExpand}
        onEventClick={(eventId) => navigate(`/events/${eventId}`)}
        events={mappedEvents} 
        style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }} 
      />
    </div>
  );
};
