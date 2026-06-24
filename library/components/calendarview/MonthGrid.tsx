import React, { useMemo } from 'react';
import { Maximize2 } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth } from '../../utilities';
import { getContrastColor } from '../dayview/utils';

export interface MonthGridProps {
  currentDate: Date;
  events: Array<{ id: string; date: Date; label: string; color?: string }>;
  onDayExpand?: (date: Date) => void;
  onEventClick?: (eventId: string) => void;
}

export const MonthGrid: React.FC<MonthGridProps> = ({ currentDate, events, onDayExpand, onEventClick }) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const eventMap = useMemo(() => {
    const map = new Map<string, typeof events>();
    events.forEach(evt => {
      const d = evt.date;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(evt);
    });
    return map;
  }, [events]);

  return (
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
          const dayDate = new Date(currentYear, currentMonth, day);
          const dayEvents = eventMap.get(`${currentYear}-${currentMonth}-${day}`) || [];
          
          const isToday = todayDate === day &&
                          todayMonth === currentMonth &&
                          todayYear === currentYear;

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
  );
};
