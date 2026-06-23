import React, { type ReactNode } from 'react';
import { useCalendarState } from '../hooks/useCalendarState';

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
        <button className="calendar-btn" onClick={onToday}>Today</button>
        <button className="calendar-btn" onClick={onPrev}>&lt;</button>
        <button className="calendar-btn" onClick={onNext}>&gt;</button>
        <select 
          className="calendar-btn" 
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as any)}
        >
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </select>
      </div>
    </div>
  );
};

const Body: React.FC<BodyProps> = ({ children }) => {
  // A helper function to generate days in a month for the grid
  const renderGrid = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const cells = Array.from({ length: 35 }).map((_, i) => i); // simplified 5-week grid for UI shell

    return (
      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {cells.map((_, i) => (
          <div key={i} className={`calendar-cell ${i < 5 || i > 31 ? 'other-month' : ''}`}>
            <span className="calendar-cell-date">{i < 5 ? 26 + i : i > 31 ? i - 31 : i - 4}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-body">
      {children || renderGrid()}
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
