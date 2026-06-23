import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { DayView } from './DayView';

describe('DayView', () => {
  const testDate = new Date('2026-06-23T12:00:00Z');

  it('should render the day view with correct date', () => {
    render(<DayView date={testDate} onClose={vi.fn()} />);
    
    // The date is formatted nicely in the header, usually something like "Tue June 23, 2026" or similar
    expect(screen.getByText(/23/)).toBeInTheDocument();
    
    // Check if the time grid exists by checking for time labels (e.g. 12 PM)
    expect(screen.getByText('12 PM')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<DayView date={testDate} onClose={handleClose} />);
    
    const closeButton = screen.getByLabelText('Close day view');
    await user.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should render events', () => {
    const events = [
      { id: '1', title: 'Morning Standup', start: '09:00', end: '09:30' },
      { id: '2', title: 'Lunch', start: '12:00', end: '13:00' },
    ];
    
    render(<DayView date={testDate} events={events} onClose={vi.fn()} />);
    
    expect(screen.getByText('Morning Standup')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });
});
