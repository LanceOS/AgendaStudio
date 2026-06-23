import React, { type ReactNode } from 'react';
import { CalendarSidebar } from './CalendarSidebar';

interface CalendarLayoutProps {
  children: ReactNode;
}

export const CalendarLayout: React.FC<CalendarLayoutProps> = ({ children }) => {
  return (
    <div className="calendar-layout">
      <main className="calendar-main">
        {children}
      </main>
      <CalendarSidebar />
    </div>
  );
};
