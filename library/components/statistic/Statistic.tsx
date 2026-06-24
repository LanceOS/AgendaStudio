import React from 'react';
import { User, ChevronLeft, ChevronRight, Folder, File, ChevronDown } from 'lucide-react';

export interface StatisticProps {
  title: string;
  value: string | number;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Statistic({ title, value, suffix, style }: StatisticProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', ...style }}>
      <div className="label">{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: 'var(--space-5)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</span>
        {suffix && <span style={{ fontSize: 'var(--space-3)', color: 'var(--color-text-disabled)' }}>{suffix}</span>}
      </div>
    </div>
  );
}
