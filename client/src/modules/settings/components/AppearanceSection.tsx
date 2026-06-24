import React from 'react';
import { Switch } from '../../../../../library/components/switch';

export function AppearanceSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Appearance</h3>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>Customize how AgendaStudio looks on your device.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Dark Mode</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Toggle dark mode theme</div>
          </div>
          <Switch checked={false} onChange={() => {}} />
        </div>
      </div>
    </div>
  );
}
