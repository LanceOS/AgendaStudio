import React, { useState } from 'react';
import { User, Palette, Calendar } from 'lucide-react';
import { SettingsPageLayout } from '../layouts/SettingsPageLayout';
import { ProfileSection } from '../components/ProfileSection';
import { AppearanceSection } from '../components/AppearanceSection';
import { CalendarSettingsSection } from '../components/CalendarSettingsSection';

type CategoryId = 'profile' | 'appearance' | 'calendar';

const CATEGORIES: Array<{ id: CategoryId; label: string; description: string; icon: any }> = [
  {
    id: 'profile',
    label: 'Profile',
    description: 'Manage your personal details.',
    icon: User,
  },
  {
    id: 'appearance',
    label: 'Appearance',
    description: 'Customize the look and feel.',
    icon: Palette,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    description: 'Adjust calendar behaviors.',
    icon: Calendar,
  },
];

export function SettingsScreen() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('profile');

  const renderContent = () => {
    switch (activeCategory) {
      case 'profile':
        return <ProfileSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'calendar':
        return <CalendarSettingsSection />;
      default:
        return null;
    }
  };

  return (
    <SettingsPageLayout
      headerLeftContent={
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          User Settings
        </h2>
      }
      sidebar={
        <nav style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--color-surface-card)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                    {category.label}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-disabled)', marginTop: '2px' }}>
                    {category.description}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      }
    >
      <div style={{ padding: '32px', maxWidth: '800px' }}>
        {renderContent()}
      </div>
    </SettingsPageLayout>
  );
}
