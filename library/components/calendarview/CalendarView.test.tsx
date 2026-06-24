import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { CalendarView } from './CalendarView';

describe('CalendarView', () => {
  it('should render the current month and year correctly', () => {
    const testDate = new Date('2026-06-23T12:00:00Z');
    render(<CalendarView currentDate={testDate} />);
    
    // The heading should display "June 2026"
    expect(screen.getByText('June 2026')).toBeInTheDocument();
    
    // Day headers should be present
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });

  it('should handle prev and next month navigation', async () => {
    const user = userEvent.setup();
    const handleDateChange = vi.fn();
    const testDate = new Date('2026-06-23T12:00:00Z');
    
    render(<CalendarView currentDate={testDate} onDateChange={handleDateChange} />);
    
    const prevButton = screen.getByLabelText('Previous Month');
    const nextButton = screen.getByLabelText('Next Month');
    
    await user.click(prevButton);
    expect(handleDateChange).toHaveBeenCalledTimes(1);
    // Should call with May 1, 2026
    expect(handleDateChange.mock.calls[0][0].getMonth()).toBe(4); // 0-indexed May
    
    await user.click(nextButton);
    expect(handleDateChange).toHaveBeenCalledTimes(2);
    // Should call with July 1, 2026
    expect(handleDateChange.mock.calls[1][0].getMonth()).toBe(6); // 0-indexed July
  });

  it('should handle Today button', async () => {
    const user = userEvent.setup();
    const handleDateChange = vi.fn();
    const testDate = new Date('2026-06-23T12:00:00Z');
    
    render(<CalendarView currentDate={testDate} onDateChange={handleDateChange} />);
    
    const todayButton = screen.getByText('Today');
    await user.click(todayButton);
    
    expect(handleDateChange).toHaveBeenCalledTimes(1);
    const calledDate = handleDateChange.mock.calls[0][0];
    const actualToday = new Date();
    expect(calledDate.getMonth()).toBe(actualToday.getMonth());
    expect(calledDate.getFullYear()).toBe(actualToday.getFullYear());
  });

  it('should render events on correct days', () => {
    const testDate = new Date('2026-06-23T12:00:00Z');
    const events = [
      { date: new Date('2026-06-15T10:00:00Z'), label: 'Test Event 1' },
      { date: new Date('2026-06-23T14:00:00Z'), label: 'Meeting' }
    ];
    
    render(<CalendarView currentDate={testDate} events={events} />);
    
    expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    expect(screen.getByText('Meeting')).toBeInTheDocument();
  });

  it('should trigger onDayExpand when expand button is clicked', async () => {
    const user = userEvent.setup();
    const handleExpand = vi.fn();
    const testDate = new Date('2026-06-23T12:00:00Z');
    
    render(<CalendarView currentDate={testDate} onDayExpand={handleExpand} />);
    
    // Grab all expand buttons (one per day)
    const expandButtons = screen.getAllByLabelText('Expand day');
    expect(expandButtons.length).toBeGreaterThan(20);
    
    // Click the first one (should be June 1)
    await user.click(expandButtons[0]);
    expect(handleExpand).toHaveBeenCalledTimes(1);
    expect(handleExpand.mock.calls[0][0].getDate()).toBe(1);
  });

  describe('Year View', () => {
    it('should switch to Year view when clicking the Year toggle', async () => {
      const user = userEvent.setup();
      const handleViewModeChange = vi.fn();
      const testDate = new Date('2026-06-23T12:00:00Z');
      
      render(<CalendarView currentDate={testDate} viewMode="month" onViewModeChange={handleViewModeChange} />);
      
      const yearToggle = screen.getByText('Year', { selector: 'button' });
      await user.click(yearToggle);
      
      expect(handleViewModeChange).toHaveBeenCalledTimes(1);
      expect(handleViewModeChange).toHaveBeenCalledWith('year');
    });

    it('should render all 12 months in Year view', () => {
      const testDate = new Date('2026-06-23T12:00:00Z');
      render(<CalendarView currentDate={testDate} viewMode="year" />);
      
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      months.forEach(month => {
        expect(screen.getByText(month)).toBeInTheDocument();
      });
    });
    
    it('should navigate by year in Year view', async () => {
      const user = userEvent.setup();
      const handleDateChange = vi.fn();
      const testDate = new Date('2026-06-23T12:00:00Z');
      
      render(<CalendarView currentDate={testDate} viewMode="year" onDateChange={handleDateChange} />);
      
      const prevButton = screen.getByLabelText('Previous Year');
      const nextButton = screen.getByLabelText('Next Year');
      
      await user.click(prevButton);
      expect(handleDateChange).toHaveBeenCalledTimes(1);
      expect(handleDateChange.mock.calls[0][0].getFullYear()).toBe(2025);
      
      await user.click(nextButton);
      expect(handleDateChange).toHaveBeenCalledTimes(2);
      expect(handleDateChange.mock.calls[1][0].getFullYear()).toBe(2027);
    });
  });
});
