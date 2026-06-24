
import { Select } from '../../../../../library/components/select';
import { Switch } from '../../../../../library/components/switch';

export function CalendarSettingsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Calendar Preferences</h3>
        <p style={{ margin: 0, fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)' }}>Configure how your agenda is displayed.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '400px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
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
            <div style={{ fontSize: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>Use 24-hour clock instead of AM/PM</div>
          </div>
          <Switch checked={false} onCheckedChange={() => {}} label="Enable 24-hour time formatting" />
        </div>

      </div>
    </div>
  );
}
