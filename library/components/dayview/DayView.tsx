import React, { useRef, useMemo, useEffect } from 'react';
import { useTimeSlotDrag } from './useTimeSlotDrag';
import { DayHeader } from './DayHeader';
import { DayGridBackground } from './DayGridBackground';
import { DragSelectionOverlay } from './DragSelectionOverlay';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { DayEvent } from './DayEvent';
import { processOverlappingEvents, DayEventInput } from './utils';

export interface DayViewProps {
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  onClose?: () => void;
  events?: Array<{ id: string; date: Date; endDate?: Date; label: string; color?: string }>;
  onTimeSlotSelect?: (startDate: Date, endDate: Date) => void;
  onEventDelete?: (eventId: string) => void;
  onEventUpdate?: (eventId: string, updates: Partial<DayEventInput>) => void;
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
  onEventUpdate,
  hourHeight = 120,
  style,
}: DayViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const now = new Date();
      if (now.getDate() === currentDate.getDate() && now.getMonth() === currentDate.getMonth()) {
        const currentHour = now.getHours() + now.getMinutes() / 60;
        // Scroll so the current time is vertically centered
        const containerHeight = scrollContainerRef.current.clientHeight;
        const scrollTarget = Math.max(0, currentHour * hourHeight - containerHeight / 2);
        scrollContainerRef.current.scrollTop = scrollTarget;
      }
    }
  }, [currentDate, hourHeight]);

  const { dragState, handlers } = useTimeSlotDrag(containerRef, currentDate, hourHeight, 15, onTimeSlotSelect);

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
      <div ref={scrollContainerRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', height: `${24 * hourHeight}px`, flexShrink: 0 }}>
          
          <DayGridBackground hourHeight={hourHeight} />
          <CurrentTimeIndicator currentDate={currentDate} hourHeight={hourHeight} />

          {/* Interactive Overlay for Events and Dragging */}
          <div 
            ref={containerRef}
            style={{ position: 'absolute', top: 0, left: '80px', right: 0, bottom: 0, cursor: 'crosshair', zIndex: 5 }}
            {...handlers}
          >
            {/* Render Processed Events */}
            {processedEvents.map(({ event: evt, top, height, left, width }) => (
              <DayEvent
                key={evt.id}
                event={evt}
                top={top}
                height={height}
                left={left}
                width={width}
                hourHeight={hourHeight}
                snapMinutes={15}
                onDelete={onEventDelete}
                onUpdate={onEventUpdate}
              />
            ))}

            <DragSelectionOverlay dragState={dragState} />
          </div>

          {/* Time Column Hit Area: Allows users to start dragging from the time labels or the red dot */}
          <div
            style={{ position: 'absolute', top: 0, left: 0, width: '80px', bottom: 0, cursor: 'crosshair', zIndex: 5 }}
            {...handlers}
          />
        </div>
      </div>
    </div>
  );
}
