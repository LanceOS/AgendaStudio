import { useNavigate } from "react-router";
import { 
  Sidebar as LibSidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarItem 
} from "../../../../../library/components/sidebar";
import { DropdownMenu } from "../../../../../library/components/dropdownmenu";
import { Avatar } from "../../../../../library/components/avatar";
import { Divider } from "../../../../../library/components/divider";

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <LibSidebar>
      <SidebarContent>
        <SidebarGroup label="Navigation">
          <SidebarItem onClick={() => navigate("/")}>Home</SidebarItem>
          <SidebarItem onClick={() => navigate("/settings")}>Settings</SidebarItem>
          <SidebarItem onClick={() => navigate("/calendar/create-category")}>Create Category</SidebarItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter style={{ padding: '8px' }}>
        <DropdownMenu 
          trigger={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-state-hover-overlay)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Avatar name="Lance" size="md" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Lance</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Guest_contributor</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-secondary)' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          }
        >
          <div style={{ minWidth: '220px', padding: '8px 0' }}>
            <div style={{ 
              padding: '4px 12px', 
              fontSize: '11px', 
              fontWeight: 600, 
              color: 'var(--color-text-disabled)', 
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Account & Settings
            </div>
            
            <Divider style={{ margin: '8px 0' }} />
            
            <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <SidebarItem onClick={() => navigate("/workspaces")} leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              }>
                Workspaces
              </SidebarItem>
              <SidebarItem onClick={() => navigate("/account-preferences")} leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              }>
                Account Preferences
              </SidebarItem>
              <SidebarItem onClick={() => navigate("/manage-projects")} leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              }>
                Manage Projects
              </SidebarItem>
              <SidebarItem onClick={() => navigate("/workspace-settings")} leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              }>
                Workspace Settings
              </SidebarItem>
            </div>

            <Divider style={{ margin: '8px 0' }} />
            
            <div style={{ padding: '0 8px' }}>
              <SidebarItem onClick={() => console.log('Logout')} leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              }>
                Log Out
              </SidebarItem>
            </div>
          </div>
        </DropdownMenu>
      </SidebarFooter>
    </LibSidebar>
  );
}
