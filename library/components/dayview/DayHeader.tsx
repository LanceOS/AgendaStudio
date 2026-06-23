import React from 'react';
import { ChevronLeft, ChevronRight, Minimize2 } from 'lucide-react';
import { Button } from '../button';

export interface DayHeaderProps {
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  onClose?: () => void;
}

export function DayHeader({ currentDate, onDateChange, onClose }: DayHeaderProps) {
  const handlePrevDay = () => {
    if (onDateChange) {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      onDateChange(newDate);
    }
  };

  const handleNextDay = () => {
    if (onDateChange) {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      onDateChange(newDate);
    }
  };

  const handleToday = () => {
    if (onDateChange) {
      const today = new Date();
      onDateChange(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    }
  };

  return (
    <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-base50)', borderBottom: '1px solid var(--color-border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button variant="default" size="sm" onClick={handleToday}>
          Today
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Button variant="default" size="sm" onClick={handlePrevDay} aria-label="Previous Day">
            <ChevronLeft size={16} />
          </Button>
          <Button variant="default" size="sm" onClick={handleNextDay} aria-label="Next Day">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text-primary)' }}>
        {currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </div>

      <div>
        <Button variant="default" size="sm" onClick={onClose} aria-label="Collapse view">
          <Minimize2 size={16} />
        </Button>
      </div>
    </div>
  );
}
