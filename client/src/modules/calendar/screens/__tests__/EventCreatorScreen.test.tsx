import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { EventCreatorScreen } from '../EventCreatorScreen';
import { useCalendarState } from '../../hooks/useCalendarState';

vi.mock('../../../../../../library/components/textinput', () => ({
  TextInput: ({ label, ...props }: { label: string } & Record<string, unknown>) => (
    <label>{label}<input aria-label={label} {...props} /></label>
  ),
}));
vi.mock('../../../../../../library/components/button', () => ({
  Button: ({ children, ...props }: { children: ReactNode } & Record<string, unknown>) => (
    <button {...props}>{children}</button>
  ),
}));
vi.mock('../../../../../../library/components/stack', () => ({
  Stack: ({ children, ...props }: { children: ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
}));
vi.mock('../../../../../../library/components/flex', () => ({
  Flex: ({ children, ...props }: { children: ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
}));

vi.mock('../../hooks/useCalendarState', () => ({
  useCalendarState: vi.fn(),
}));

const mockedUseCalendarState = vi.mocked(useCalendarState);

describe('EventCreatorScreen', () => {
  beforeEach(() => {
    mockedUseCalendarState.mockReturnValue({
      categories: [{ id: 7, name: 'Work', color: '#3b82f6' }],
      error: null,
      addEvent: vi.fn().mockResolvedValue(true),
    } as unknown as ReturnType<typeof useCalendarState>);
  });

  it('persists the selected event fields and navigates after saving', async () => {
    const addEvent = vi.fn().mockResolvedValue(true);
    mockedUseCalendarState.mockReturnValue({
      categories: [{ id: 7, name: 'Work', color: '#3b82f6' }],
      error: null,
      addEvent,
    } as unknown as ReturnType<typeof useCalendarState>);

    render(
      <MemoryRouter initialEntries={['/events/new']}>
        <Routes>
          <Route path="/events/new" element={<EventCreatorScreen />} />
          <Route path="/calendar" element={<div>Calendar</div>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Event Name'), { target: { value: 'Planning' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: '7' } });
    fireEvent.change(screen.getByLabelText('Start'), { target: { value: '2026-07-01T10:00' } });
    fireEvent.change(screen.getByLabelText('End'), { target: { value: '2026-07-01T11:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Select color var(--color-event-red)' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save Event' }));

    await waitFor(() => expect(addEvent).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Planning',
      categoryId: 7,
      color: 'var(--color-event-red)',
    })));
    await waitFor(() => expect(screen.getByText('Calendar')).toBeInTheDocument());
  });

  it('keeps the form open and shows persistence errors', async () => {
    const addEvent = vi.fn().mockResolvedValue(false);
    mockedUseCalendarState.mockReturnValue({
      categories: [],
      error: 'Unable to save event.',
      addEvent,
    } as unknown as ReturnType<typeof useCalendarState>);

    render(
      <MemoryRouter initialEntries={['/events/new']}>
        <Routes><Route path="/events/new" element={<EventCreatorScreen />} /></Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Event Name'), { target: { value: 'Planning' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Event' }));

    await waitFor(() => expect(addEvent).toHaveBeenCalled());
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to save event.');
    expect(screen.queryByText('Calendar')).not.toBeInTheDocument();
  });
});
