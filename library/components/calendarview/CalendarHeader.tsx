import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../button';
import { Select } from '../select';

export interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: 'month' | 'year';
  onDateChange: (date: Date) => void;
  onViewModeChange?: (mode: 'month' | 'year') => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, viewMode, onDateChange, onViewModeChange }) => {
  const handlePrev = () => {
    if (viewMode === 'year') {
      onDateChange(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    } else {
      onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'year') {
      onDateChange(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    } else {
      onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  const handleToday = () => {
    const today = new Date();
    onDateChange(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleMonthChange = (val: string) => {
    onDateChange(new Date(currentDate.getFullYear(), parseInt(val, 10), 1));
  };

  const handleYearChange = (val: string) => {
    onDateChange(new Date(parseInt(val, 10), currentDate.getMonth(), 1));
  };

  const baseYear = new Date().getFullYear();
  const currentYear = currentDate.getFullYear();
  let startYear = baseYear - 10;
  let endYear = baseYear + 10;
  if (currentYear < startYear) startYear = currentYear;
  if (currentYear > endYear) endYear = currentYear;

  const yearOptions = [];
  for (let y = startYear; y <= endYear; y++) {
    yearOptions.push({ value: y.toString(), label: y.toString() });
  }

  const monthOptions = MONTHS.map((m, i) => ({ value: i.toString(), label: m }));

  return (
    <div style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-base50)', borderBottom: '1px solid var(--color-border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Button variant="default" size="sm" onClick={handleToday}>
          Today
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <Button variant="default" size="sm" onClick={handlePrev} aria-label={viewMode === 'year' ? "Previous Year" : "Previous Month"}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="default" size="sm" onClick={handleNext} aria-label={viewMode === 'year' ? "Next Year" : "Next Month"}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>
        {viewMode === 'year' ? currentDate.getFullYear() : currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <button
              onClick={() => onViewModeChange && onViewModeChange('month')}
              style={{
                padding: '4px 12px',
                fontSize: 'var(--font-size-base)',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: viewMode === 'month' ? 'var(--color-state-selected-bg)' : 'transparent',
                color: viewMode === 'month' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                transition: 'all 0.2s ease'
              }}
            >Month</button>
            <button
              onClick={() => onViewModeChange && onViewModeChange('year')}
              style={{
                padding: '4px 12px',
                fontSize: 'var(--font-size-base)',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: viewMode === 'year' ? 'var(--color-state-selected-bg)' : 'transparent',
                color: viewMode === 'year' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                transition: 'all 0.2s ease'
              }}
            >Year</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {viewMode === 'month' && (
            <Select
              value={currentDate.getMonth().toString()}
              options={monthOptions}
              onValueChange={handleMonthChange}
              size="sm"
              style={{ width: '130px' }}
            />
          )}
          <Select
            value={currentDate.getFullYear().toString()}
            options={yearOptions}
            onValueChange={handleYearChange}
            size="sm"
            style={{ width: '100px' }}
          />
        </div>
      </div>
    </div>
  );
};
