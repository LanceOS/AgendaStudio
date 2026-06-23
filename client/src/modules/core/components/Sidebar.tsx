import { useState } from "react";
import { useNavigate } from "react-router";
import { authClient } from "../../../lib/auth";
import { useCalendarState } from "../../calendar/hooks/useCalendarState";
import { 
  Sidebar as LibSidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarItem 
} from "../../../../../library/components/sidebar";
import { ClickAwayListener } from "../../../../../library/utilities/clickawaylistener";
import { Avatar } from "../../../../../library/components/avatar";
import { Divider } from "../../../../../library/components/divider";

export function Sidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isWorkOpen, setIsWorkOpen] = useState(true);
  const navigate = useNavigate();
  const { data } = authClient.useSession();
  const { activeCategoryId, setActiveCategoryId } = useCalendarState();
  


  const handleCategoryClick = (id: string) => {
    setActiveCategoryId(activeCategoryId === id ? null : id);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/login");
  };

  return (
    <LibSidebar>
      <SidebarContent>
        <SidebarGroup label="Navigation">
          <SidebarItem onClick={() => navigate("/calendar/create-category")}>Create Category</SidebarItem>
          <SidebarItem onClick={() => navigate("/calendar/entries")}>All Entries</SidebarItem>
        </SidebarGroup>
        
        <SidebarGroup label="CATEGORIES">
          {/* Active Category */}
          <SidebarItem 
            active
            onClick={() => setIsWorkOpen(!isWorkOpen)}
            leftIcon={
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  style={{ 
                    color: 'var(--color-text-secondary)', 
                    transform: isWorkOpen ? 'rotate(0deg)' : 'rotate(-90deg)', 
                    transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6', flexShrink: 0 }} />
              </div>
            }
          >
            Work
          </SidebarItem>
          
          <div className={`sidebar-collapsible-wrapper ${isWorkOpen ? 'open' : ''}`}>
            <div className="sidebar-collapsible-inner">
              <div style={{ marginLeft: '14px', paddingLeft: '10px', borderLeft: '1px solid var(--color-border-subtle, rgba(0, 0, 0, 0.08))', display: 'flex', flexDirection: 'column', marginTop: '2px', marginBottom: '8px' }}>
                <SidebarGroup label="ENTRIES" style={{ marginTop: '4px' }}>
                  <SidebarItem nested leftIcon={
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  } rightElement={
                    <div style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.04)', 
                      color: 'var(--color-text-secondary)', 
                      fontSize: '10px', 
                      padding: '1px 5px', 
                      borderRadius: '4px', 
                      fontWeight: 500,
                      minWidth: '14px',
                      textAlign: 'center'
                    }}>
                      0
                    </div>
                  }>All Entries</SidebarItem>
                </SidebarGroup>
                
                <SidebarGroup label="LABELS" style={{ marginTop: '6px' }}>
                  <div style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--color-text-disabled)', fontStyle: 'italic' }}>No labels yet</div>
                </SidebarGroup>
              </div>
            </div>
          </div>


          {/* Inactive Category */}
          <SidebarItem 
            onClick={() => setIsWorkOpen(!isWorkOpen)}
            leftIcon={
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  style={{ 
                    color: 'var(--color-text-secondary)', 
                    transform: 'rotate(-90deg)', 
                    transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', flexShrink: 0 }} />
              </div>
            }
          >
            Personal
          </SidebarItem>
        </SidebarGroup>      </SidebarContent>
      <SidebarFooter style={{ padding: '8px', position: 'relative' }}>
        <ClickAwayListener onClickAway={() => setIsDropdownOpen(false)}>
          <div style={{ width: '100%' }}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background 0.1s',
                width: '100%',
                boxSizing: 'border-box',
                background: isDropdownOpen ? 'var(--color-state-hover-overlay)' : 'transparent',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-state-hover-overlay)'}
              onMouseLeave={(e) => e.currentTarget.style.background = isDropdownOpen ? 'var(--color-state-hover-overlay)' : 'transparent'}
            >
              <Avatar name={data?.user?.name || "User"} size="md" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontWeight: 500, 
                  fontSize: '13px', 
                  fontFamily: 'var(--sans)',
                  color: 'var(--color-text-primary)' 
                }}>{data?.user?.name || "User"}</div>
                <div style={{ 
                  fontWeight: 400, 
                  fontSize: '12px', 
                  fontFamily: 'var(--sans)',
                  color: 'var(--color-text-secondary)', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis' 
                }}>{data?.user?.email || ""}</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-secondary)', transition: 'transform 0.1s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            
            {isDropdownOpen && (
              <div style={{ 
                position: 'absolute', 
                bottom: 'calc(100% + 4px)', 
                left: '8px',
                right: '8px',
                backgroundColor: 'var(--color-surface-card)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 1000
              }}>
                <div style={{ 
                  padding: '4px 12px', 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  fontFamily: 'var(--sans)',
                  color: 'var(--color-text-disabled)', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  Account & Settings
                </div>
                
                <Divider style={{ margin: '4px 0' }} />
                
                <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <SidebarItem onClick={() => { setIsDropdownOpen(false); navigate("/account-preferences"); }} leftIcon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  }>
                    Preferences
                  </SidebarItem>
                  <SidebarItem onClick={() => { setIsDropdownOpen(false); navigate("/connect-external-ai"); }} leftIcon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="12" r="3"></circle><line x1="9" y1="12" x2="15" y2="12"></line></svg>
                  }>
                    Connect External AI
                  </SidebarItem>
                </div>

                <Divider style={{ margin: '4px 0' }} />
                
                <div style={{ padding: '0 4px' }}>
                  <SidebarItem onClick={() => { setIsDropdownOpen(false); handleLogout(); }} leftIcon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  }>
                    Log Out
                  </SidebarItem>
                </div>
              </div>
            )}
          </div>
        </ClickAwayListener>
      </SidebarFooter>
    </LibSidebar>
  );
}
