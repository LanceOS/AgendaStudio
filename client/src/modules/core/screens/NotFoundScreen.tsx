import React from 'react';
import { EmptyState } from '../../../../../library/components/emptystate';
import { Button } from '../../../../../library/components/button';
import { useNavigate } from 'react-router';

export function NotFoundScreen() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      padding: '40px',
      boxSizing: 'border-box'
    }}>
      <EmptyState
        title="404 - Coming Soon"
        description="This feature is not yet available. Please check back later."
        action={
          <Button onClick={() => navigate('/calendar')} variant="primary">
            Back to Calendar
          </Button>
        }
        style={{ maxWidth: '400px', width: '100%' }}
      />
    </div>
  );
}
