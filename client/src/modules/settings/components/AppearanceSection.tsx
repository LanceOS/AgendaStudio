import { useState } from 'react';
import { Select } from '../../../../../library/components/select';
import { applyThemePreference, getStoredThemePreference, type ThemePreference } from '../../../../../library/utilities/themeEngine';

import { Stack } from '../../../../../library/components/stack';

const THEME_OPTIONS = [
  { value: 'system', label: 'System Default' },
  { value: 'marble-blue', label: 'Marble Blue' },
  { value: 'noir', label: 'Noir (Dark)' },
  { value: 'coal-black', label: 'Coal Black (Dark)' },
  { value: 'coffee', label: 'Coffee (Dark)' },
];

export function AppearanceSection() {
  const [themePref, setThemePref] = useState<ThemePreference>(getStoredThemePreference());

  const handleThemeChange = (value: string) => {
    // Map 'noir' back to 'dark' for compatibility if needed, 
    // actually our themeEngine uses 'dark', 'coal-black', 'coffee', 'marble-blue', 'system'
    const newPref = value === 'noir' ? 'dark' : (value as ThemePreference);
    setThemePref(newPref);
    applyThemePreference(newPref);
  };

  // Convert 'dark' back to 'noir' for the select option matching
  const selectValue = themePref === 'dark' ? 'noir' : themePref;

  return (
    <Stack gap="var(--space-6)">
      <Stack gap="var(--space-2)">
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Appearance</h3>
        <p style={{ margin: 0, fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)' }}>Customize how AgendaStudio looks on your device.</p>
      </Stack>

      <Stack gap="var(--space-6)" style={{ maxWidth: '400px' }}>
        <Stack gap="var(--space-2)">
          <label style={{ fontWeight: 500, color: 'var(--color-text-primary)', fontSize: 'var(--font-size-md)' }}>Theme Preference</label>
          <div style={{ fontSize: 'var(--space-3)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
            Choose your preferred color theme or sync with your system settings.
          </div>
          <Select 
            options={THEME_OPTIONS} 
            value={selectValue}
            onValueChange={handleThemeChange}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
