import React from 'react';
import { CalendarProvider } from '../hooks/useCalendarState';
import { CalendarLayout } from '../components/CalendarLayout';
import { Calendar } from '../components/Calendar';
import '../styles/calendar.css';

export const CalendarScreen: React.FC = () => {
  return (
    <CalendarLayout>
      <Calendar>
        <Calendar.Header title="June 2026" />
        <Calendar.Body />
      </Calendar>
    </CalendarLayout>
  );
};
