import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '../../../../../library/components/button';
import { TextInput } from '../../../../../library/components/textinput';
import { useCalendarState } from '../hooks/useCalendarState';

const EVENT_COLORS = [
  'var(--color-primary)',
  '#10b981', // green
  '#f59e0b', // orange
  '#ef4444', // red
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
];

// Helper to format date for datetime-local input
const formatDateTimeForInput = (d: Date | null) => {
  if (!d) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const EventCreatorScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addEvent } = useCalendarState();

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState(EVENT_COLORS[0]);

  useEffect(() => {
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');
    
    if (startParam) {
      setStartDate(formatDateTimeForInput(new Date(startParam)));
    } else {
      // Default to next hour if no start param
      const now = new Date();
      now.setMinutes(0, 0, 0);
      now.setHours(now.getHours() + 1);
      setStartDate(formatDateTimeForInput(now));
    }

    if (endParam) {
      setEndDate(formatDateTimeForInput(new Date(endParam)));
    } else {
      // Default to 1 hour after start
      const now = new Date();
      now.setMinutes(0, 0, 0);
      now.setHours(now.getHours() + 2);
      setEndDate(formatDateTimeForInput(now));
    }
  }, [searchParams]);

  const handleSave = () => {
    if (!title.trim() || !startDate || !endDate) return;

    addEvent({
      title: title.trim(),
      date: new Date(startDate),
      endDate: new Date(endDate),
      color: selectedColor,
      categoryId: 'default',
    });

    navigate('/calendar');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '24px' }}>
        Create Event
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <TextInput
          label="Event Name"
          placeholder="Enter event name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '13px' }}>Start</label>
            <input 
              type="datetime-local" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-default)',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-sans)',
                fontSize: '14px',
                outline: 'none',
                transition: 'all var(--transition-fast)'
              }}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '13px' }}>End</label>
            <input 
              type="datetime-local" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-default)',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-sans)',
                fontSize: '14px',
                outline: 'none',
                transition: 'all var(--transition-fast)'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '13px' }}>Color</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {EVENT_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: selectedColor === color ? '2px solid var(--color-text-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'transform 0.1s',
                  transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
                }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <Button variant="secondary" onClick={() => navigate('/calendar')} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} style={{ flex: 1 }} disabled={!title.trim() || !startDate || !endDate}>
            Save Event
          </Button>
        </div>
      </div>
    </div>
  );
};
