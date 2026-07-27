import React from 'react';

export interface NavbarProps {
  brand: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Navbar({ brand, actions, children, style }: NavbarProps) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        backgroundColor: 'var(--color-surface-card)',
        borderBottom: '1px solid var(--color-border-default)',
        width: '100%',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>{brand}</div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>{children}</nav>
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>{actions}</div>}
    </header>
  );
}
