import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { CreateCategoryScreen } from '../CreateCategoryScreen';
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

vi.mock('../../hooks/useCalendarState', () => ({
  useCalendarState: vi.fn(),
}));

const mockedUseCalendarState = vi.mocked(useCalendarState);

describe('CreateCategoryScreen', () => {
  beforeEach(() => {
    mockedUseCalendarState.mockReturnValue({
      error: null,
      addCategory: vi.fn().mockResolvedValue(true),
    } as unknown as ReturnType<typeof useCalendarState>);
  });

  it('persists a category and returns to the calendar', async () => {
    const addCategory = vi.fn().mockResolvedValue(true);
    mockedUseCalendarState.mockReturnValue({ error: null, addCategory } as unknown as ReturnType<typeof useCalendarState>);

    render(
      <MemoryRouter initialEntries={['/calendar/create-category']}>
        <Routes>
          <Route path="/calendar/create-category" element={<CreateCategoryScreen />} />
          <Route path="/calendar" element={<div>Calendar</div>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Work' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => expect(addCategory).toHaveBeenCalledWith({ name: 'Work', color: '#3b82f6' }));
    await waitFor(() => expect(screen.getByText('Calendar')).toBeInTheDocument());
  });
});
