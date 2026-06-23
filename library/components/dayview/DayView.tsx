import React from 'react';
import { ChevronLeft, ChevronRight, Minimize2, Trash2 } from 'lucide-react';
import { Button } from '../button';

export interface DayViewProps {
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  onClose?: () => void;
  events?: Array<{ id: string; date: Date; label: string; color?: string }>;
  onTimeSlotClick?: (date: Date) => void;
  onEventDelete?: (eventId: string) => void;
  style?: React.CSSProperties;
}

export function DayView({
  currentDate,
  onDateChange,
  onClose,
  events = [],
  onTimeSlotClick,
  onEventDelete,
  style,
}: DayViewProps) {
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

  const hours = Array.from({ length: 24 }).map((_, i) => i);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-surface-base)', ...style }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-base50)', borderBottom: '1px solid var(--color-border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {hours.map((hour) => {
          const slotDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour, 0, 0, 0);

          const slotEvents = events.filter(
            (evt) =>
              evt.date.getDate() === currentDate.getDate() &&
              evt.date.getMonth() === currentDate.getMonth() &&
              evt.date.getFullYear() === currentDate.getFullYear() &&
              evt.date.getHours() === hour
          );

          return (
            <div key={hour} style={{ display: 'flex', borderBottom: '1px solid var(--color-border-default)', minHeight: '80px' }}>
              <div style={{ width: '80px', padding: '12px', borderRight: '1px solid var(--color-border-default)', color: 'var(--color-text-secondary)', fontSize: '12px', textAlign: 'right', fontWeight: 500, backgroundColor: 'var(--color-surface-card)' }}>
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              <div 
                style={{ flex: 1, padding: '4px', position: 'relative', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
                onClick={() => onTimeSlotClick?.(slotDate)}
              >
                {slotEvents.map((evt) => (
                  <div 
                    key={evt.id} 
                    style={{ 
                      backgroundColor: evt.color || 'var(--color-primary)', 
                      color: 'var(--color-text-inverse)', 
                      padding: '6px 8px', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '13px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span style={{ fontWeight: 500 }}>{evt.label}</span>
                    {onEventDelete && (
                      <button 
                        onClick={() => onEventDelete(evt.id)}
                        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0 4px', opacity: 0.8, display: 'flex', alignItems: 'center' }}
                        aria-label="Delete Event"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
