import React from 'react';
import { User, ChevronLeft, ChevronRight, Folder, File, ChevronDown } from 'lucide-react';

export interface TimelineEvent {
  time: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface TimelineProps {
  events: TimelineEvent[];
  style?: React.CSSProperties;
}

export function Timeline({ events, style }: TimelineProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'relative', paddingLeft: 'var(--space-5)', ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 'var(--space-1)',
          top: 'var(--space-1)',
          bottom: 'var(--space-1)',
          width: '2px',
          backgroundColor: 'var(--color-border-default)',
        }}
      />
      {events.map((evt, idx) => (
        <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <div
            style={{
              position: 'absolute',
              left: '-20px',
              top: 'var(--space-1)',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              border: '2px solid var(--color-surface-card)',
            }}
          />
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-disabled)', fontWeight: 500 }}>{evt.time}</div>
          <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{evt.title}</div>
          {evt.description && <div style={{ fontSize: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>{evt.description}</div>}
        </div>
      ))}
    </div>
  );
}
