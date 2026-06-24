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
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <h2>Event not found</h2>
        <Button variant="primary" onClick={() => navigate('/calendar')} style={{ marginTop: '16px' }}>
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      <Button 
        variant="secondary" 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <ArrowLeft size={16} /> Back
      </Button>

      <div style={{ 
        backgroundColor: 'var(--color-surface, var(--bg))', 
        padding: '32px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            borderRadius: '50%', 
            backgroundColor: event.color || 'var(--color-primary)' 
          }} />
          <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--color-text-primary)' }}>
            {event.title}
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--color-text-secondary)' }}>
            <Calendar size={20} style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '4px' }}>Date</div>
              <div>{formatDate(event.date)}</div>
              {event.endDate && event.date.toDateString() !== event.endDate.toDateString() && (
                <div>to {formatDate(event.endDate)}</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--color-text-secondary)' }}>
            <Clock size={20} style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '4px' }}>Time</div>
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
