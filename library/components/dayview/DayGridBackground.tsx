import React from 'react';

export interface DayGridBackgroundProps {
  hourHeight: number;
}

export const DayGridBackground = React.memo(function DayGridBackground({ hourHeight }: DayGridBackgroundProps) {
  const hours = Array.from({ length: 24 }).map((_, i) => i);

  return (
    <>
      {hours.map((hour) => (
        <div 
          key={hour} 
          style={{ 
            position: 'absolute', 
            top: `${hour * hourHeight}px`, 
            left: 0, 
            right: 0, 
            height: `${hourHeight}px`, 
            display: 'flex', 
            borderTop: hour > 0 ? '1px solid var(--color-border-default)' : 'none' 
          }}
        >
          <div style={{ 
            width: '80px', 
            position: 'relative', 
            borderRight: '1px solid var(--color-border-default)', 
            color: 'var(--color-text-secondary)', 
            fontSize: '12px', 
            textAlign: 'right', 
            fontWeight: 500, 
            backgroundColor: 'var(--color-surface-card)' 
          }}>
            {hour > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-9px', 
                right: '12px', 
                backgroundColor: 'var(--color-surface-card)', 
                padding: '0 4px' 
              }}>
                {hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </span>
            )}
          </div>
          <div style={{ flex: 1 }} />
        </div>
      ))}
    </>
  );
});
