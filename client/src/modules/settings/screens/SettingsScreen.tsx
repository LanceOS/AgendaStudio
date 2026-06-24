import React, { useState } from 'react';
import { Stack } from '../../../../../library/components/stack';
import { useNavigate } from 'react-router';
import { User, Palette, Calendar, ArrowLeft } from 'lucide-react';
import { SettingsPageLayout } from '../layouts/SettingsPageLayout';
import { ProfileSection } from '../components/ProfileSection';
import { AppearanceSection } from '../components/AppearanceSection';
import { CalendarSettingsSection } from '../components/CalendarSettingsSection';
import { Sidebar as LibSidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarItem } from '../../../../../library/components/sidebar';
import { Button } from '../../../../../library/components/button';

type CategoryId = 'profile' | 'appearance' | 'calendar';

const CATEGORIES: Array<{ id: CategoryId; label: string; description: string; icon: React.ElementType }> = [
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
  const navigate = useNavigate();

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
      sidebar={
        <LibSidebar>
          <SidebarHeader style={{ padding: '16px', borderBottom: '1px solid var(--color-border-default)' }}>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/calendar')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}
            >
              <ArrowLeft size={16} /> Back to Calendar
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label="PREFERENCES">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;

                return (
                  <SidebarItem
                    key={category.id}
                    active={isActive}
                    onClick={() => setActiveCategory(category.id)}
                    leftIcon={<Icon size={16} style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} />}
                    style={{ padding: '8px 10px', height: 'auto', alignItems: 'flex-start' }}
                  >
                    <Stack gap="2px" style={{ paddingTop: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.2 }}>
                        {category.label}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-disabled)', lineHeight: 1.2 }}>
                        {category.description}
                      </span>
                    </Stack>
                  </SidebarItem>
                );
              })}
            </SidebarGroup>
          </SidebarContent>
        </LibSidebar>
      }
    >
      <div style={{ padding: '32px', maxWidth: '800px' }}>
        {renderContent()}
      </div>
    </SettingsPageLayout>
  );
}
