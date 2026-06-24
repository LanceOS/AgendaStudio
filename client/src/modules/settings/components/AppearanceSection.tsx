import React, { useState } from 'react';
import { Select } from '../../../../../library/components/select';
import { applyThemePreference, getStoredThemePreference, type ThemePreference } from '../../../../../library/utilities/themeEngine';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Appearance</h3>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>Customize how AgendaStudio looks on your device.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 500, color: 'var(--color-text-primary)', fontSize: '14px' }}>Theme Preference</label>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            Choose your preferred color theme or sync with your system settings.
          </div>
          <Select 
            options={THEME_OPTIONS} 
            value={selectValue}
            onValueChange={handleThemeChange}
          />
        </div>
      </div>
    </div>
  );
}
