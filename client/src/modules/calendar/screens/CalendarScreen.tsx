import React from 'react';
import { useNavigate } from 'react-router';
import { CalendarView } from '../../../../../library/components/calendarview';
import { useCalendarState } from '../hooks/useCalendarState';

export const CalendarScreen: React.FC = () => {
  const { 
    selectedDate, setSelectedDate, 
    events
  } = useCalendarState();
  const navigate = useNavigate();

  const handleDayExpand = (date: Date) => {
    setSelectedDate(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    navigate(`/calendar/day/${dateStr}`);
  };

  return (
    <div style={{ height: '100%' }}>
      <CalendarView 
        currentDate={selectedDate}
        onDateChange={setSelectedDate}
        onDayExpand={handleDayExpand}
        events={events.map(e => ({ date: e.date, label: e.title, color: e.color || 'var(--color-primary)' }))} 
        style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }} 
      />
    </div>
  );
};
