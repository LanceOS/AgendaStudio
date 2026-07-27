import { type JSX, type ReactNode } from 'react';

import { Flex } from '../../../../../library/components/flex';

interface SettingsPageLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function SettingsPageLayout({
  sidebar,
  children,
}: SettingsPageLayoutProps): JSX.Element {
  return (
    <Flex direction="column" style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Main Container */}
      <Flex style={{ flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        {sidebar}

        {/* Content */}
        <main
          style={{
            flex: 1,
            backgroundColor: 'var(--color-surface-app)',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {children}
        </main>
      </Flex>
    </Flex>
  );
}
