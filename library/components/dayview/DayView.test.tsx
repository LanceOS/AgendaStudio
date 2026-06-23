import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { DayView } from './DayView';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { DayEvent } from './DayEvent';

describe('DayView', () => {
  const testDate = new Date('2026-06-23T12:00:00Z');

  it('should render the day view with correct date', () => {
    render(<DayView currentDate={testDate} onClose={vi.fn()} />);
    
    // Check if the time grid exists by checking for time labels (e.g. 12 PM)
    expect(screen.getByText('12 PM')).toBeInTheDocument();
  });

  it('should render events', () => {
    const events = [
      { id: '1', label: 'Morning Standup', date: new Date('2026-06-23T09:00:00Z'), endDate: new Date('2026-06-23T09:30:00Z') },
      { id: '2', label: 'Lunch', date: new Date('2026-06-23T12:00:00Z'), endDate: new Date('2026-06-23T13:00:00Z') },
    ];
    
    render(<DayView currentDate={testDate} events={events} onClose={vi.fn()} />);
    
    expect(screen.getByText('Morning Standup')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });

  it('grid container should have flex-shrink: 0 to prevent squishing interaction bounds', () => {
    const { container } = render(<DayView currentDate={testDate} />);
    // Find the relative wrapper that contains the 24-hour grid. It's the first child of the scrollContainer
    const scrollContainer = container.querySelector('[style*="overflow-y: auto"]');
    const gridContainer = scrollContainer?.firstChild as HTMLElement;
    expect(gridContainer).toHaveStyle({ flexShrink: '0' });
  });
});

describe('CurrentTimeIndicator', () => {
  it('should have pointer-events: none and high z-index to not block clicks but remain visible', () => {
    const { container } = render(<CurrentTimeIndicator currentDate={new Date()} hourHeight={120} />);
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveStyle({ pointerEvents: 'none', zIndex: '100' });
  });
});

describe('DayEvent', () => {
  it('should reserve a 36px clickable margin on the right to allow background clicking', () => {
    const event = { id: '1', label: 'Test Event', date: new Date() };
    const { container } = render(<DayEvent event={event} top={0} height={120} left={0} width={100} hourHeight={120} />);
    const eventEl = container.firstChild as HTMLElement;
    expect(eventEl).toHaveStyle({ width: 'calc(100% - 36px)' });
  });
});
