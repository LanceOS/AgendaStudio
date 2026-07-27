import { Button } from '../../../../../library/components/button';
import { TextInput } from '../../../../../library/components/textinput';

export function ProfileSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Profile Details</h3>
        <p style={{ margin: 0, fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)' }}>Update your personal information and avatar.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '400px' }}>
        <TextInput label="Full Name" placeholder="e.g. John Doe" defaultValue="Demo User" />
        <TextInput label="Email Address" placeholder="e.g. john@example.com" defaultValue="demo@example.com" />
        
        <div style={{ marginTop: 'var(--space-4)' }}>
          <Button variant="primary">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
