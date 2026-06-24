import React, { type JSX, type ReactNode } from 'react';

interface SettingsPageLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function SettingsPageLayout({
  sidebar,
  children,
}: SettingsPageLayoutProps): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      {/* Main Container */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        {sidebar}

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
