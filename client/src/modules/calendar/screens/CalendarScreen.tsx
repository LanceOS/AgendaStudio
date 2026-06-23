import React from 'react';
import { CalendarView } from '../../../../../library/components/calendarview';
import { useCalendarState } from '../hooks/useCalendarState';

export const CalendarScreen: React.FC = () => {
  const { selectedDate, setSelectedDate } = useCalendarState();

  return (
    <div style={{ height: '100%' }}>
      <CalendarView 
        currentDate={selectedDate}
        onDateChange={setSelectedDate}
        events={[]} 
        style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }} 
      />
    </div>
  );
};
