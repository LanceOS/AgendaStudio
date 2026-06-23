import React from 'react';
import { CalendarView } from '../../../../../library/components/calendarview';

export const CalendarScreen: React.FC = () => {
  return (
    <div style={{ height: '100%' }}>
      <CalendarView 
        currentDate={new Date(2026, 5, 1)} 
        events={[]} 
        style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }} 
      />
    </div>
  );
};
