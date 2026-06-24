import React from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth } from '../../utilities';
import { Button } from '../button';
import { Select } from '../select';
import { getContrastColor } from '../dayview/utils';

export interface CalendarViewProps {
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
  viewMode?: 'month' | 'year';
  onViewModeChange?: (mode: 'month' | 'year') => void;
  events?: Array<{ id: string; date: Date; label: string; color?: string }>;
  onDayExpand?: (date: Date) => void;
  onEventClick?: (eventId: string) => void;
  style?: React.CSSProperties;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CalendarView({ currentDate = new Date(), onDateChange, viewMode = 'month', onViewModeChange, events = [], onDayExpand, onEventClick, style }: CalendarViewProps) {
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const handlePrevMonth = () => {
    if (onDateChange) {
      if (viewMode === 'year') {
        onDateChange(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
      } else {
        onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
      }
    }
  };

  const handleNextMonth = () => {
    if (onDateChange) {
      if (viewMode === 'year') {
        onDateChange(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
      } else {
        onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      }
    }
  };

  const handleToday = () => {
    if (onDateChange) {
      const today = new Date();
      onDateChange(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  };

  const handleMonthChange = (val: string) => {
    if (onDateChange) {
      onDateChange(new Date(currentDate.getFullYear(), parseInt(val, 10), 1));
    }
  };

  const handleYearChange = (val: string) => {
    if (onDateChange) {
      onDateChange(new Date(parseInt(val, 10), currentDate.getMonth(), 1));
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', ...style }}>
      <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-base50)', borderBottom: '1px solid var(--color-border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button variant="default" size="sm" onClick={handleToday}>
            Today
          </Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Button variant="default" size="sm" onClick={handlePrevMonth} aria-label={viewMode === 'year' ? "Previous Year" : "Previous Month"}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="default" size="sm" onClick={handleNextMonth} aria-label={viewMode === 'year' ? "Next Year" : "Next Month"}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        
        <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text-primary)' }}>
          {viewMode === 'year' ? currentDate.getFullYear() : currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
             <button
                onClick={() => onViewModeChange && onViewModeChange('month')}
                style={{
                  padding: '4px 12px',
                  fontSize: '13px',
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
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: 'none',
                  background: viewMode === 'year' ? 'var(--color-state-selected-bg)' : 'transparent',
                  color: viewMode === 'year' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease'
                }}
             >Year</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
      {viewMode === 'year' ? (
        <div style={{ flex: 1, overflow: 'hidden', padding: '16px', backgroundColor: 'var(--color-surface-card)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridTemplateRows: 'repeat(3, minmax(0, 1fr))', gap: '16px', height: '100%' }}>
            {Array.from({ length: 12 }).map((_, monthIdx) => {
              const mDaysInMonth = getDaysInMonth(currentDate.getFullYear(), monthIdx);
              const mFirstDay = getFirstDayOfMonth(currentDate.getFullYear(), monthIdx);
              return (
                <div key={monthIdx} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                    {MONTHS[monthIdx]}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '2px' }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <div key={i} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-disabled)' }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', gap: '2px', flex: 1, minHeight: 0 }}>
                    {Array.from({ length: mFirstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: mDaysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dayDate = new Date(currentDate.getFullYear(), monthIdx, day);
                      const hasEvents = events.some(evt => 
                        evt.date.getDate() === day &&
                        evt.date.getMonth() === monthIdx &&
                        evt.date.getFullYear() === currentDate.getFullYear()
                      );
                      const today = new Date();
                      const isToday = today.getDate() === day &&
                                      today.getMonth() === monthIdx &&
                                      today.getFullYear() === currentDate.getFullYear();
                      return (
                        <div
                          key={day}
                          onClick={() => onDayExpand && onDayExpand(dayDate)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: onDayExpand ? 'pointer' : 'default',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            margin: 'auto',
                            backgroundColor: isToday ? 'var(--color-primary)' : 'transparent',
                            color: isToday ? 'var(--color-text-on-accent)' : 'var(--color-text-primary)',
                            position: 'relative'
                          }}
                        >
                          <span style={{ fontSize: '12px', fontWeight: isToday ? 600 : 400 }}>{day}</span>
                          {hasEvents && (
                            <div style={{
                              position: 'absolute',
                              bottom: '2px',
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              backgroundColor: isToday ? 'var(--color-text-on-accent)' : 'var(--color-primary)'
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--color-border-default)', textAlign: 'center', backgroundColor: 'var(--color-surface-card)' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} style={{ padding: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-disabled)' }}>
                {d}
              </div>
            ))}
          </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', backgroundColor: 'var(--color-border-default)', gap: '1px', flex: 1 }}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} style={{ backgroundColor: 'var(--color-surface-card)', minHeight: '0' }} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayEvents = events.filter(
            (evt) =>
              evt.date.getDate() === day &&
              evt.date.getMonth() === currentDate.getMonth() &&
              evt.date.getFullYear() === currentDate.getFullYear()
          );

          const today = new Date();
          const isToday = today.getDate() === day &&
                          today.getMonth() === currentDate.getMonth() &&
                          today.getFullYear() === currentDate.getFullYear();

          return (
            <div
              key={day}
              style={{
                backgroundColor: 'var(--color-surface-card)',
                minHeight: '0',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                outline: isToday ? '2px solid var(--color-primary)' : 'none',
                outlineOffset: '-2px',
                position: 'relative',
                zIndex: isToday ? 1 : 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: isToday ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{day}</span>
                {onDayExpand && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDayExpand(dayDate);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      color: 'var(--color-text-disabled)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-disabled)'}
                    aria-label="Expand day"
                  >
                    <Maximize2 size={12} />
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
                {dayEvents.map((evt, eIdx) => (
                  <div
                    key={eIdx}
                    style={{
                      fontSize: '9px',
                      padding: '1px 4px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: evt.color || 'var(--color-state-selected-bg)',
                      color: getContrastColor(evt.color || 'var(--color-state-selected-bg)'),
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: onEventClick ? 'pointer' : 'default',
                    }}
                    onClick={(e) => {
                      if (onEventClick) {
                        e.stopPropagation();
                        onEventClick(evt.id);
                      }
                    }}
                  >
                    {evt.label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      </>
      )}
    </div>
  );
}
