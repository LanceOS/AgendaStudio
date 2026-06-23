import React, { useState, useEffect } from 'react';

export interface CurrentTimeIndicatorProps {
  currentDate: Date;
  hourHeight: number;
}

export const CurrentTimeIndicator = React.memo(function CurrentTimeIndicator({ currentDate, hourHeight }: CurrentTimeIndicatorProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const isToday =
    now.getDate() === currentDate.getDate() &&
    now.getMonth() === currentDate.getMonth() &&
    now.getFullYear() === currentDate.getFullYear();

  if (!isToday) {
    return null;
  }

  const currentHour = now.getHours() + now.getMinutes() / 60;
  const topPosition = currentHour * hourHeight;

  return (
    <div
      style={{
        position: 'absolute',
        top: `${topPosition}px`,
        left: 0,
        right: 0,
        height: '2px',
        backgroundColor: 'var(--color-danger, #ef4444)',
        zIndex: 15,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Circle dot on the left side */}
      <div
        style={{
          position: 'absolute',
          left: '76px', // Aligns with the 80px border
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-danger, #ef4444)',
        }}
      />
    </div>
  );
});
