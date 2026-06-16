import React, { useState } from 'react';
import { Sidebar as LibSidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarItem } from '@calendar/library/components/sidebar';
import { DropdownMenu } from '@calendar/library/components/dropdownmenu';
import { Avatar } from '@calendar/library/components/avatar';


export const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('calendar');

  const userMenu = (
    <div style={{ padding: '8px', minWidth: '150px' }}>
      <div style={{ padding: '4px 8px', borderBottom: '1px solid var(--color-border-default)', marginBottom: '4px' }}>
        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>User Name</strong>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>user@example.com</span>
      </div>
      <button style={{ width: '100%', textAlign: 'left', padding: '6px 8px', background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}>Profile</button>
      <button style={{ width: '100%', textAlign: 'left', padding: '6px 8px', background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}>Preferences</button>
      <div style={{ height: '1px', backgroundColor: 'var(--color-border-default)', margin: '4px 0' }} />
      <button style={{ width: '100%', textAlign: 'left', padding: '6px 8px', background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}>Sign Out</button>
    </div>
  );

  return (
    <LibSidebar>
      <SidebarHeader>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>Agenda Studio</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarItem active={activeItem === 'calendar'} onClick={() => setActiveItem('calendar')} leftIcon="📅">
          Calendar
        </SidebarItem>
        <SidebarItem active={activeItem === 'home'} onClick={() => setActiveItem('home')} leftIcon="🏠">
          Home
        </SidebarItem>
        <SidebarItem active={activeItem === 'tasks'} onClick={() => setActiveItem('tasks')} leftIcon="✓">
          Tasks
        </SidebarItem>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu trigger={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer', borderRadius: '6px' }}>
            <Avatar size="sm" fallback="U" />
            <span style={{ flex: 1, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>User Settings</span>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>▲</span>
          </div>
        }>
          {userMenu}
        </DropdownMenu>
      </SidebarFooter>
    </LibSidebar>
  );
};

