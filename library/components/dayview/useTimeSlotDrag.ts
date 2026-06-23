import { useState, useCallback } from 'react';

export interface DragState {
  isDragging: boolean;
  startOffset: number | null;
  currentOffset: number | null;
}

export function useTimeSlotDrag(
  containerRef: React.RefObject<HTMLDivElement>,
  currentDate: Date,
  hourHeight: number,
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
      return Math.max(0, Math.min(clientY - rect.top, rect.height));
    },
    [containerRef]
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
    (e: React.MouseEvent) => {
      if (dragState.isDragging) {
        setDragState((prev) => ({ ...prev, currentOffset: getOffsetY(e.clientY) }));
      }
    },
    [dragState.isDragging, getOffsetY]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
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

  const handleMouseLeave = useCallback(() => {
    if (dragState.isDragging) {
      setDragState({
        isDragging: false,
        startOffset: null,
        currentOffset: null,
      });
    }
  }, [dragState.isDragging]);

  return {
    dragState,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
  };
}
