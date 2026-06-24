import React from 'react';
import type { DragState } from './useTimeSlotDrag';

export interface DragSelectionOverlayProps {
  dragState: DragState;
}

export const DragSelectionOverlay = React.memo(function DragSelectionOverlay({ dragState }: DragSelectionOverlayProps) {
  if (!dragState.isDragging || dragState.startOffset === null || dragState.currentOffset === null) {
    return null;
  }

  const top = Math.min(dragState.startOffset, dragState.currentOffset);
  const height = Math.max(Math.abs(dragState.currentOffset - dragState.startOffset), 2);

  return (
    <div 
      style={{
        position: 'absolute',
        top: `${top}px`,
        height: `${height}px`,
        left: 'var(--space-2)',
        right: 'var(--space-4)',
        backgroundColor: 'var(--color-primary)',
        opacity: 0.3,
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-primary)',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    />
  );
});
