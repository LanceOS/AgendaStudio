import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useCalendarState } from '../hooks/useCalendarState';
import { Button } from '../../../../../library/components/button';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

export const EventDetailsScreen: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events } = useCalendarState();

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <h2>Event not found</h2>
        <Button variant="primary" onClick={() => navigate('/calendar')} style={{ marginTop: 'var(--space-4)' }}>
          Back to Calendar
        </Button>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-6)' }}>
      <Button 
        variant="secondary" 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
      >
        <ArrowLeft size={16} /> Back
      </Button>

      <div style={{ 
        backgroundColor: 'var(--color-surface, var(--color-surface-app))', 
        padding: '32px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div style={{ 
            width: 'var(--space-6)', 
            height: 'var(--space-6)', 
            borderRadius: '50%', 
            backgroundColor: event.color || 'var(--color-primary)' 
          }} />
          <h1 style={{ margin: 0, fontSize: 'var(--space-6)', color: 'var(--color-text-primary)' }}>
            {event.title}
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>
            <Calendar size={20} style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>Date</div>
              <div>{formatDate(event.date)}</div>
              {event.endDate && event.date.toDateString() !== event.endDate.toDateString() && (
                <div>to {formatDate(event.endDate)}</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>
            <Clock size={20} style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>Time</div>
              <div>
                {formatTime(event.date)}
                {event.endDate ? ` - ${formatTime(event.endDate)}` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
