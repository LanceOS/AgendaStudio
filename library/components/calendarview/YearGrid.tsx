import React, { useMemo } from 'react';
import { getDaysInMonth, getFirstDayOfMonth } from '../../utilities';

export interface YearGridProps {
  currentDate: Date;
  events: Array<{ id: string; date: Date; label: string; color?: string }>;
  onDayExpand?: (date: Date) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const YearGrid: React.FC<YearGridProps> = ({ currentDate, events, onDayExpand }) => {
  const currentYear = currentDate.getFullYear();
  
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  // O(1) event lookup optimization
  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    events.forEach(evt => {
      const d = evt.date;
      dates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return dates;
  }, [events]);

  return (
    <div style={{ flex: 1, overflow: 'hidden', padding: 'var(--space-4)', backgroundColor: 'var(--color-surface-card)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridTemplateRows: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-4)', height: '100%' }}>
        {Array.from({ length: 12 }).map((_, monthIdx) => {
          const mDaysInMonth = getDaysInMonth(currentYear, monthIdx);
          const mFirstDay = getFirstDayOfMonth(currentYear, monthIdx);
          
          return (
            <div key={monthIdx} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-1)', color: 'var(--color-text-primary)' }}>
                {MONTHS[monthIdx]}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '2px' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-disabled)' }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', gap: '2px', flex: 1, minHeight: 0 }}>
                {Array.from({ length: mFirstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: mDaysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayDate = new Date(currentYear, monthIdx, day);
                  const hasEvents = eventDates.has(`${currentYear}-${monthIdx}-${day}`);
                  const isToday = todayDate === day &&
                                  todayMonth === monthIdx &&
                                  todayYear === currentYear;
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
                      <span style={{ fontSize: 'var(--space-3)', fontWeight: isToday ? 600 : 400 }}>{day}</span>
                      {hasEvents && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          width: 'var(--space-1)',
                          height: 'var(--space-1)',
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
  );
};
