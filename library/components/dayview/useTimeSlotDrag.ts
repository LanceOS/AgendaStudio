import React, { useState, useCallback } from 'react';

export interface DragState {
  isDragging: boolean;
  startOffset: number | null;
  currentOffset: number | null;
}

export function useTimeSlotDrag(
  containerRef: React.RefObject<HTMLDivElement>,
  currentDate: Date,
  hourHeight: number,
  snapMinutes: number = 15,
  onTimeSlotSelect?: (startDate: Date, endDate: Date) => void
) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startOffset: null,
    currentOffset: null,
  });

  const getOffsetY = useCallback(
    (clientY: number) => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const rawY = Math.max(0, Math.min(clientY - rect.top, rect.height));
      const snapPixels = (snapMinutes / 60) * hourHeight;
      return Math.round(rawY / snapPixels) * snapPixels;
    },
    [containerRef, snapMinutes, hourHeight]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left click
      const y = getOffsetY(e.clientY);
      setDragState({
        isDragging: true,
        startOffset: y,
        currentOffset: y,
      });
    },
    [getOffsetY]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragState.isDragging) {
        setDragState((prev) => ({ ...prev, currentOffset: getOffsetY(e.clientY) }));
      }
    },
    [dragState.isDragging, getOffsetY]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || dragState.startOffset === null) return;

      let startY = dragState.startOffset;
      let endY = getOffsetY(e.clientY);

      if (startY > endY) {
        const temp = startY;
        startY = endY;
        endY = temp;
      }

      const startHour = startY / hourHeight;
      const endHour = endY / hourHeight;

      const startDate = new Date(currentDate);
      startDate.setHours(Math.floor(startHour), Math.floor((startHour % 1) * 60), 0, 0);

      let endDate = new Date(currentDate);

      if (endY - startY < 5) {
        endDate = new Date(startDate.getTime() + 10 * 60000);
      } else {
        endDate.setHours(Math.floor(endHour), Math.floor((endHour % 1) * 60), 0, 0);
      }

      onTimeSlotSelect?.(startDate, endDate);

      setDragState({
        isDragging: false,
        startOffset: null,
        currentOffset: null,
      });
    },
    [dragState, getOffsetY, hourHeight, currentDate, onTimeSlotSelect]
  );

  React.useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  return {
    dragState,
    handlers: {
      onMouseDown: handleMouseDown,
    },
  };
}
