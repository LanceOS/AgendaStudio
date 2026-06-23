import React, { useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { DayEventInput } from './utils';

export interface DayEventProps {
  event: DayEventInput;
  top: number;
  height: number;
  left: number;
  width: number;
  hourHeight: number;
  snapMinutes?: number;
  onDelete?: (eventId: string) => void;
  onUpdate?: (eventId: string, updates: Partial<DayEventInput>) => void;
}

export const DayEvent = React.memo(function DayEvent({
  event,
  top,
  height,
  left,
  width,
  hourHeight,
  snapMinutes = 15,
  onDelete,
  onUpdate,
}: DayEventProps) {
  const [dragState, setDragState] = useState<{
    type: 'move' | 'resize' | null;
    startY: number;
    initialTop: number;
    initialHeight: number;
    currentY: number;
  }>({
    type: null,
    startY: 0,
    initialTop: 0,
    initialHeight: 0,
    currentY: 0,
  });

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize') => {
    e.stopPropagation(); // prevent DayView background selection
    if (e.button !== 0) return;
    
    setDragState({
      type,
      startY: e.clientY,
      initialTop: top,
      initialHeight: height,
      currentY: e.clientY,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragState.type) {
      setDragState(prev => ({ ...prev, currentY: e.clientY }));
    }
  }, [dragState.type]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!dragState.type) return;

    const deltaY = e.clientY - dragState.startY;
    const snapPixels = (snapMinutes / 60) * hourHeight;
    const snappedDelta = Math.round(deltaY / snapPixels) * snapPixels;

    if (snappedDelta !== 0 && onUpdate) {
      const deltaHours = snappedDelta / hourHeight;
      const deltaMs = deltaHours * 60 * 60 * 1000;

      if (dragState.type === 'move') {
        const newStartDate = new Date(event.date.getTime() + deltaMs);
        const newEndDate = event.endDate ? new Date(event.endDate.getTime() + deltaMs) : undefined;
        onUpdate(event.id, { date: newStartDate, endDate: newEndDate });
      } else if (dragState.type === 'resize') {
        const currentEndDate = event.endDate || new Date(event.date.getTime() + 10 * 60000);
        const newEndDate = new Date(currentEndDate.getTime() + deltaMs);
        // Ensure end date doesn't go before start date
        if (newEndDate > event.date) {
          onUpdate(event.id, { endDate: newEndDate });
        }
      }
    }

    setDragState({ type: null, startY: 0, initialTop: 0, initialHeight: 0, currentY: 0 });
  }, [dragState, event, hourHeight, snapMinutes, onUpdate]);

  useEffect(() => {
    if (dragState.type) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.type, handleMouseMove, handleMouseUp]);

  // Visual calculation for dragging/resizing state
  let currentTop = top;
  let currentHeight = height;

  if (dragState.type) {
    const deltaY = dragState.currentY - dragState.startY;
    const snapPixels = (snapMinutes / 60) * hourHeight;
    const snappedDelta = Math.round(deltaY / snapPixels) * snapPixels;

    if (dragState.type === 'move') {
      currentTop = dragState.initialTop + snappedDelta;
    } else if (dragState.type === 'resize') {
      currentHeight = Math.max(24, dragState.initialHeight + snappedDelta);
    }
  }

  return (
    <div
      onMouseDown={(e) => handleMouseDown(e, 'move')}
      style={{
        position: 'absolute',
        top: `${currentTop}px`,
        height: `${currentHeight}px`,
        left: `calc(${left}% + 8px)`,
        width: `calc(${width}% - 16px)`,
        backgroundColor: event.color || 'var(--color-primary)',
        color: 'var(--color-text-inverse)',
        padding: '4px 8px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '12px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: dragState.type ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        overflow: 'hidden',
        cursor: dragState.type === 'move' ? 'grabbing' : 'grab',
        pointerEvents: 'auto',
        border: dragState.type ? '2px solid var(--color-text-inverse)' : '1px solid rgba(0,0,0,0.1)',
        zIndex: dragState.type ? 50 : 10,
        opacity: dragState.type ? 0.9 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.label}</span>
        {onDelete && (
          <button
            onMouseDown={(e) => e.stopPropagation()} // Prevent drag start when clicking delete
            onClick={() => onDelete(event.id)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px', opacity: 0.8, display: 'flex', alignItems: 'center' }}
            aria-label="Delete Event"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <span style={{ fontSize: '10px', opacity: 0.9 }}>
        {event.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        {event.endDate ? ` - ${event.endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : ''}
      </span>

      {/* Resize Handle */}
      {onUpdate && (
        <div
          onMouseDown={(e) => handleMouseDown(e, 'resize')}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            cursor: 'ns-resize',
          }}
        />
      )}
    </div>
  );
});
