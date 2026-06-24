import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '../../../../../library/components/button';
import { TextInput } from '../../../../../library/components/textinput';
import { useCalendarState } from '../hooks/useCalendarState';

import { Stack } from '../../../../../library/components/stack';
import { Flex } from '../../../../../library/components/flex';

const EVENT_COLORS = [
  'var(--color-primary)',
  'var(--color-event-green)',
  'var(--color-event-orange)',
  'var(--color-event-red)',
  'var(--color-event-blue)',
  'var(--color-event-purple)',
  'var(--color-event-pink)',
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
  const initialStart = searchParams.get('start');
  const initialEnd = searchParams.get('end');

  const [startDate, setStartDate] = useState<string>(() => {
    if (initialStart) return formatDateTimeForInput(new Date(initialStart));
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    return formatDateTimeForInput(now);
  });

  const [endDate, setEndDate] = useState<string>(() => {
    if (initialEnd) return formatDateTimeForInput(new Date(initialEnd));
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 2);
    return formatDateTimeForInput(now);
  });

  const [selectedColor, setSelectedColor] = useState(EVENT_COLORS[0]);

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
      
      <Stack gap="20px">
        <TextInput
          label="Event Name"
          placeholder="Enter event name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <Flex gap="16px">
          <Stack gap="8px" style={{ flex: 1 }}>
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
          </Stack>
          <Stack gap="8px" style={{ flex: 1 }}>
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
          </Stack>
        </Flex>

        <Stack gap="8px">
          <label style={{ color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '13px' }}>Color</label>
          <Flex gap="12px">
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
          </Flex>
        </Stack>

        <Flex gap="12px" style={{ marginTop: '16px' }}>
          <Button variant="secondary" onClick={() => navigate('/calendar')} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} style={{ flex: 1 }} disabled={!title.trim() || !startDate || !endDate}>
            Save Event
          </Button>
        </Flex>
      </Stack>
    </div>
  );
};
