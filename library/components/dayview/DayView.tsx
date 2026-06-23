import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Minimize2, Trash2 } from 'lucide-react';
import { Button } from '../button';

export interface DayViewProps {
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  onClose?: () => void;
  events?: Array<{ id: string; date: Date; endDate?: Date; label: string; color?: string }>;
  onTimeSlotSelect?: (startDate: Date, endDate: Date) => void;
  onEventDelete?: (eventId: string) => void;
  style?: React.CSSProperties;
}

const HOUR_HEIGHT = 80;

export function DayView({
  currentDate,
  onDateChange,
  onClose,
  events = [],
  onTimeSlotSelect,
  onEventDelete,
  style,
}: DayViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStartOffset, setDragStartOffset] = useState<number | null>(null);
  const [dragCurrentOffset, setDragCurrentOffset] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const getOffsetY = (clientY: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(clientY - rect.top, rect.height));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    const y = getOffsetY(e.clientY);
    setDragStartOffset(y);
    setDragCurrentOffset(y);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setDragCurrentOffset(getOffsetY(e.clientY));
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || dragStartOffset === null) return;
    
    let startY = dragStartOffset;
    let endY = getOffsetY(e.clientY);

    if (startY > endY) {
      const temp = startY;
      startY = endY;
      endY = temp;
    }

    const startHour = startY / HOUR_HEIGHT;
    const endHour = endY / HOUR_HEIGHT;

    const startDate = new Date(currentDate);
    startDate.setHours(Math.floor(startHour), Math.floor((startHour % 1) * 60), 0, 0);

    let endDate = new Date(currentDate);
    
    // If it's a very small drag (less than 5 pixels), treat it as a click and make a 10 min entry
    if (endY - startY < 5) {
      endDate = new Date(startDate.getTime() + 10 * 60000);
    } else {
      endDate.setHours(Math.floor(endHour), Math.floor((endHour % 1) * 60), 0, 0);
    }

    onTimeSlotSelect?.(startDate, endDate);
    
    setIsDragging(false);
    setDragStartOffset(null);
    setDragCurrentOffset(null);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragStartOffset(null);
      setDragCurrentOffset(null);
    }
  };

  const hours = Array.from({ length: 24 }).map((_, i) => i);

  // Filter events for the current day
  const dayEvents = events.filter(
    (evt) =>
      evt.date.getDate() === currentDate.getDate() &&
      evt.date.getMonth() === currentDate.getMonth() &&
      evt.date.getFullYear() === currentDate.getFullYear()
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-surface-card)', ...style }}>
      {/* Header */}
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

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', height: `${24 * HOUR_HEIGHT}px` }}>
          
          {/* Background Grid Lines */}
          {hours.map((hour) => (
            <div key={hour} style={{ position: 'absolute', top: `${hour * HOUR_HEIGHT}px`, left: 0, right: 0, height: `${HOUR_HEIGHT}px`, display: 'flex', borderTop: hour > 0 ? '1px solid var(--color-border-default)' : 'none' }}>
              <div style={{ width: '80px', position: 'relative', borderRight: '1px solid var(--color-border-default)', color: 'var(--color-text-secondary)', fontSize: '12px', textAlign: 'right', fontWeight: 500, backgroundColor: 'var(--color-surface-card)' }}>
                {hour > 0 && (
                  <span style={{ position: 'absolute', top: '-9px', right: '12px', backgroundColor: 'var(--color-surface-card)', padding: '0 4px' }}>
                    {hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </span>
                )}
              </div>
              <div style={{ flex: 1 }} />
            </div>
          ))}

          {/* Interactive Overlay for Events and Dragging */}
          <div 
            ref={containerRef}
            style={{ position: 'absolute', top: 0, left: '80px', right: 0, bottom: 0, cursor: 'crosshair', zIndex: 5 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {/* Render Existing Events */}
            {dayEvents.map((evt) => {
              const startHour = evt.date.getHours() + evt.date.getMinutes() / 60;
              const durationHours = evt.endDate ? (evt.endDate.getTime() - evt.date.getTime()) / (1000 * 60 * 60) : (10 / 60);
              
              return (
                <div 
                  key={evt.id} 
                  style={{ 
                    position: 'absolute',
                    top: `${startHour * HOUR_HEIGHT}px`,
                    height: `${Math.max(durationHours * HOUR_HEIGHT, 24)}px`, // Min height to be visible
                    left: '8px',
                    right: '16px',
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
                    pointerEvents: 'auto', // Re-enable pointer events so we can delete them
                    border: '1px solid rgba(0,0,0,0.1)'
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
              );
            })}

            {/* Render Drag Selection Ghost */}
            {isDragging && dragStartOffset !== null && dragCurrentOffset !== null && (
              <div 
                style={{
                  position: 'absolute',
                  top: `${Math.min(dragStartOffset, dragCurrentOffset)}px`,
                  height: `${Math.max(Math.abs(dragCurrentOffset - dragStartOffset), 2)}px`,
                  left: '8px',
                  right: '16px',
                  backgroundColor: 'var(--color-primary)',
                  opacity: 0.3,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-primary)',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
