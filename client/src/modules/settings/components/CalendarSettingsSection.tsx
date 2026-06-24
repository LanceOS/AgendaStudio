import React from 'react';
import { Select } from '../../../../../library/components/select';
import { Switch } from '../../../../../library/components/switch';

export function CalendarSettingsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Calendar Preferences</h3>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>Configure how your agenda is displayed.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Default View</div>
          <Select 
            value="month"
            options={[
              { label: 'Month View', value: 'month' },
              { label: 'Week View', value: 'week' },
              { label: 'Day View', value: 'day' }
            ]}
            onValueChange={() => {}}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>24-Hour Time Format</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Use 24-hour clock instead of AM/PM</div>
          </div>
          <Switch checked={false} onChange={() => {}} />
        </div>

      </div>
    </div>
  );
}
