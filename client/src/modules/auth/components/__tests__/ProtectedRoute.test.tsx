import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from '../ProtectedRoute';
import { MemoryRouter, Routes, Route } from 'react-router';

// Mock the authClient
vi.mock('../../../../lib/auth', () => ({
  authClient: {
    useSession: vi.fn()
  }
}));

import { authClient } from '../../../../lib/auth';

describe('ProtectedRoute', () => {
  it('should render loading state when pending', () => {
    (authClient.useSession as any).mockReturnValue({ isPending: true, data: null });
    
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
    (authClient.useSession as any).mockReturnValue({ isPending: false, data: null });
    
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
    (authClient.useSession as any).mockReturnValue({ 
      isPending: false, 
      data: { session: { user: { id: '1' } } } 
    });
    
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
