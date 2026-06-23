import React from 'react';
import { CalendarView } from '../../../../../library/components/calendarview';
import { DayView } from '../../../../../library/components/dayview';
import { useCalendarState } from '../hooks/useCalendarState';

export const CalendarScreen: React.FC = () => {
  const { 
    selectedDate, setSelectedDate, 
    viewMode, setViewMode,
    events, addEvent, removeEvent
  } = useCalendarState();

  const handleDayExpand = (date: Date) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  const handleTimeSlotClick = (date: Date) => {
    const title = prompt('Enter task name:');
    if (title) {
      addEvent({
        title,
        date,
        categoryId: 'default',
      });
    }
  };

  return (
    <div style={{ height: '100%' }}>
      {viewMode === 'day' ? (
        <DayView
          currentDate={selectedDate}
          onDateChange={setSelectedDate}
          onClose={() => setViewMode('month')}
          events={events.map(e => ({ id: e.id, date: e.date, label: e.title, color: 'var(--color-primary)' }))}
          onTimeSlotClick={handleTimeSlotClick}
          onEventDelete={removeEvent}
          style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }}
        />
      ) : (
        <CalendarView 
          currentDate={selectedDate}
          onDateChange={setSelectedDate}
          onDayExpand={handleDayExpand}
          events={events.map(e => ({ date: e.date, label: e.title, color: 'var(--color-primary)' }))} 
          style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }} 
        />
      )}
    </div>
  );
};
