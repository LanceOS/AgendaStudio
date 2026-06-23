import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarItem } from './Sidebar';

describe('Sidebar Components', () => {
  it('should render the sidebar and its sections', () => {
    render(
      <Sidebar data-testid="sidebar">
        <SidebarHeader data-testid="sidebar-header">Header Content</SidebarHeader>
        <SidebarContent data-testid="sidebar-content">Main Content</SidebarContent>
        <SidebarFooter data-testid="sidebar-footer">Footer Content</SidebarFooter>
      </Sidebar>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-header')).toHaveTextContent('Header Content');
    expect(screen.getByTestId('sidebar-content')).toHaveTextContent('Main Content');
    expect(screen.getByTestId('sidebar-footer')).toHaveTextContent('Footer Content');
  });

  it('should render sidebar groups with labels', () => {
    render(
      <SidebarGroup label="Categories" data-testid="sidebar-group">
        <div>Item 1</div>
      </SidebarGroup>
    );

    expect(screen.getByTestId('sidebar-group')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('should render sidebar items and handle clicks', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <SidebarItem onClick={handleClick} active={true} data-testid="sidebar-item">
        Active Item
      </SidebarItem>
    );

    const item = screen.getByTestId('sidebar-item');
    expect(item).toBeInTheDocument();
    expect(item).toHaveTextContent('Active Item');
    expect(item).toHaveClass('active');
    expect(item).toHaveAttribute('aria-current', 'page');

    await user.click(item);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
