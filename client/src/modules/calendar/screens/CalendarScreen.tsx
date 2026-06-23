import React from 'react';
import { CalendarView } from '../../../../../library/components/calendarview';

export const CalendarScreen: React.FC = () => {
  const mockEvents = [
    { date: new Date(2026, 5, 21), label: 'Workspace ...', color: 'var(--color-error-light)' },
    { date: new Date(2026, 5, 24), label: 'Sprint Revie...', color: 'var(--color-primary-light)' },
    { date: new Date(2026, 5, 27), label: 'Release Pla...', color: 'var(--color-success-light)' },
  ];

  return (
    <div style={{ height: '100%' }}>
      <CalendarView 
        currentDate={new Date(2026, 5, 1)} 
        events={mockEvents} 
        style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }} 
      />
    </div>
  );
};
