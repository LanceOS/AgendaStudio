import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from '../ProtectedRoute';
import { MemoryRouter, Routes, Route } from 'react-router';

vi.mock('../../../../lib/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

import { useAuth } from '../../../../lib/hooks/useAuth';

describe('ProtectedRoute', () => {
  it('should render loading state when pending', () => {
    vi.mocked(useAuth).mockReturnValue({ isPending: true, data: null } as unknown as ReturnType<typeof useAuth>);
    
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login if not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ isPending: false, data: null } as unknown as ReturnType<typeof useAuth>);
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route 
            path="/protected" 
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children if authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ 
      isPending: false, 
      data: { session: { user: { id: '1' } } } 
    } as unknown as ReturnType<typeof useAuth>);
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route 
            path="/protected" 
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
