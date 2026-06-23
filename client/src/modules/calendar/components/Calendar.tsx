import React, { type ReactNode } from 'react';
import { useCalendarState } from '../hooks/useCalendarState';
import { Button } from '../../../../../library/components/button';
import { Select } from '../../../../../library/components/select';
import { CalendarView } from '../../../../../library/components/calendarview';

// --- Types ---
interface CalendarProps {
  children: ReactNode;
}

interface HeaderProps {
  title?: string;
  onPrev?: () => void;
  onNext?: () => void;
  onToday?: () => void;
}

interface BodyProps {
  children?: ReactNode;
  currentDate?: Date;
  events?: Array<{ date: Date; label: string; color?: string }>;
}

interface FooterProps {
  children?: ReactNode;
}

// --- Main Calendar Component ---
const CalendarBase: React.FC<CalendarProps> = ({ children }) => {
  return <div className="calendar-container">{children}</div>;
};

// --- Sub-components ---
const Header: React.FC<HeaderProps> = ({ title, onPrev, onNext, onToday }) => {
  const { viewMode, setViewMode } = useCalendarState();

  return (
    <div className="calendar-header">
      <div className="calendar-header-title">{title || 'Calendar'}</div>
      <div className="calendar-header-controls">
        <Button variant="ghost" onClick={onToday}>Today</Button>
        <Button variant="ghost" onClick={onPrev}>&lt;</Button>
        <Button variant="ghost" onClick={onNext}>&gt;</Button>
        <Select
          value={viewMode}
          onValueChange={(val) => setViewMode(val as any)}
          style={{ minWidth: '120px' }}
          options={[
            { value: 'month', label: 'Month' },
            { value: 'week', label: 'Week' },
            { value: 'day', label: 'Day' }
          ]}
        />
      </div>
    </div>
  );
};

const Body: React.FC<BodyProps> = ({ children, currentDate = new Date(), events = [] }) => {
  return (
    <div className="calendar-body">
      {children || <CalendarView currentDate={currentDate} events={events} style={{ border: 'none', borderRadius: 0, height: '100%' }} />}
    </div>
  );
};

const Footer: React.FC<FooterProps> = ({ children }) => {
  if (!children) return null;
  return <div className="calendar-footer">{children}</div>;
};

// --- Compound Component Export ---
export const Calendar = Object.assign(CalendarBase, {
  Header,
  Body,
  Footer,
});
