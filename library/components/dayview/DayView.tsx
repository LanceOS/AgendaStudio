import React, { useRef, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { useTimeSlotDrag } from './useTimeSlotDrag';
import { DayHeader } from './DayHeader';
import { DayGridBackground } from './DayGridBackground';
import { DragSelectionOverlay } from './DragSelectionOverlay';
import { processOverlappingEvents, DayEventInput } from './utils';

export interface DayViewProps {
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  onClose?: () => void;
  events?: Array<{ id: string; date: Date; endDate?: Date; label: string; color?: string }>;
  onTimeSlotSelect?: (startDate: Date, endDate: Date) => void;
  onEventDelete?: (eventId: string) => void;
  hourHeight?: number;
  style?: React.CSSProperties;
}

export function DayView({
  currentDate,
  onDateChange,
  onClose,
  events = [],
  onTimeSlotSelect,
  onEventDelete,
  hourHeight = 80,
  style,
}: DayViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { dragState, handlers } = useTimeSlotDrag(containerRef, currentDate, hourHeight, onTimeSlotSelect);

  // Filter events for the current day
  const dayEvents = useMemo(() => {
    return events.filter(
      (evt) =>
        evt.date.getDate() === currentDate.getDate() &&
        evt.date.getMonth() === currentDate.getMonth() &&
        evt.date.getFullYear() === currentDate.getFullYear()
    );
  }, [events, currentDate]);

  // Process overlapping events
  const processedEvents = useMemo(() => {
    return processOverlappingEvents(dayEvents, hourHeight);
  }, [dayEvents, hourHeight]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-surface-card)', ...style }}>
      <DayHeader currentDate={currentDate} onDateChange={onDateChange} onClose={onClose} />

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', height: `${24 * hourHeight}px` }}>
          
          <DayGridBackground hourHeight={hourHeight} />

          {/* Interactive Overlay for Events and Dragging */}
          <div 
            ref={containerRef}
            style={{ position: 'absolute', top: 0, left: '80px', right: 0, bottom: 0, cursor: 'crosshair', zIndex: 5 }}
            {...handlers}
          >
            {/* Render Processed Events */}
            {processedEvents.map(({ event: evt, top, height, left, width }) => (
              <div 
                key={evt.id} 
                style={{ 
                  position: 'absolute',
                  top: `${top}px`,
                  height: `${height}px`,
                  left: `calc(${left}% + 8px)`,
                  width: `calc(${width}% - 16px)`,
                  backgroundColor: evt.color || 'var(--color-primary)', 
                  color: 'var(--color-text-inverse)', 
                  padding: '4px 8px', 
                  borderRadius: 'var(--radius-sm)', 
                  fontSize: '12px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  cursor: 'default',
                  pointerEvents: 'auto', // Re-enable pointer events so we can click/delete them
                  border: '1px solid rgba(0,0,0,0.1)',
                  zIndex: 10,
                }}
                onMouseDown={(e) => e.stopPropagation()} // Prevent creating a new event when interacting with an existing one
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.label}</span>
                  {onEventDelete && (
                    <button 
                      onClick={() => onEventDelete(evt.id)}
                      style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px', opacity: 0.8, display: 'flex', alignItems: 'center' }}
                      aria-label="Delete Event"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '10px', opacity: 0.9 }}>
                  {evt.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} 
                  {evt.endDate ? ` - ${evt.endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : ''}
                </span>
              </div>
            ))}

            <DragSelectionOverlay dragState={dragState} />
          </div>
        </div>
      </div>
    </div>
  );
}
