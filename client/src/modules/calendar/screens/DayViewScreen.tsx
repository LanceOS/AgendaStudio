import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DayView } from '../../../../../library/components/dayview';
import { useCalendarState } from '../hooks/useCalendarState';

export const DayViewScreen: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { events, removeEvent, updateEvent } = useCalendarState();

  const currentDate = useMemo(() => {
    if (!date) return new Date();
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [date]);

  const handleDateChange = (newDate: Date) => {
    // Format as YYYY-MM-DD
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${newDate.getFullYear()}-${pad(newDate.getMonth() + 1)}-${pad(newDate.getDate())}`;
    navigate(`/calendar/day/${dateStr}`);
  };

  const handleClose = () => {
    navigate('/calendar');
  };

  const handleTimeSlotSelect = (startDate: Date, endDate: Date) => {
    navigate(`/events/new?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
  };

  const dayEvents = events.map(e => ({ 
    id: e.id, 
    date: e.date, 
    endDate: e.endDate, 
    label: e.title, 
    color: e.color || 'var(--color-primary)' 
  }));

  return (
    <div style={{ height: '100%' }}>
      <DayView
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onClose={handleClose}
        events={dayEvents}
        onTimeSlotSelect={handleTimeSlotSelect}
        onEventDelete={removeEvent}
        onEventUpdate={updateEvent}
        style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }}
      />
    </div>
  );
};
