import React, { type JSX, type ReactNode } from 'react';

interface SettingsPageLayoutProps {
  headerLeftContent?: ReactNode;
  headerRightContent?: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}

export function SettingsPageLayout({
  headerLeftContent,
  headerRightContent,
  sidebar,
  children,
}: SettingsPageLayoutProps): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-lg)',
          height: '56px',
          borderBottom: '1px solid var(--color-border-default)',
          backgroundColor: 'var(--color-surface)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>{headerLeftContent}</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>{headerRightContent}</div>
      </header>

      {/* Main Container */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <aside
          style={{
            width: '280px',
            flexShrink: 0,
            borderRight: '1px solid var(--color-border-default)',
            backgroundColor: 'var(--color-surface)',
            overflowY: 'auto',
          }}
        >
          {sidebar}
        </aside>

        {/* Content */}
        <main
          style={{
            flex: 1,
            backgroundColor: 'var(--color-background)',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
