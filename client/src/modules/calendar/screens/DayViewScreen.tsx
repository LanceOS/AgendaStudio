import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DayView } from '../../../../../library/components/dayview';
import { Modal } from '../../../../../library/components/modal';
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

export const DayViewScreen: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { events, removeEvent, updateEvent, addEvent } = useCalendarState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(EVENT_COLORS[0]);

  const currentDate = useMemo(() => {
    if (!date) return new Date();
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [date]);

  const handleDateChange = (newDate: Date) => {
    // Format as YYYY-MM-DD
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${newDate.getFullYear()}-${pad(newDate.getMonth() + 1)}-${pad(newDate.getDate())}`;
    navigate(`/calendar/day/${dateStr}`);
  };

  const handleClose = () => {
    navigate('/calendar');
  };

  const handleTimeSlotSelect = (startDate: Date, endDate: Date) => {
    setSelectedStartTime(startDate);
    setSelectedEndTime(endDate);
    setNewTaskTitle('');
    setSelectedColor(EVENT_COLORS[0]);
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (newTaskTitle.trim() && selectedStartTime && selectedEndTime) {
      addEvent({
        title: newTaskTitle.trim(),
        date: selectedStartTime,
        endDate: selectedEndTime,
        color: selectedColor,
        categoryId: 'default',
      });
    }
    setIsModalOpen(false);
  };

  const dayEvents = events.map(e => ({ 
    id: e.id, 
    date: e.date, 
    endDate: e.endDate, 
    label: e.title, 
    color: e.color || 'var(--color-primary)' 
  }));

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <DayView
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onClose={handleClose}
        events={dayEvents}
        onTimeSlotSelect={handleTimeSlotSelect}
        onEventDelete={removeEvent}
        onEventUpdate={updateEvent}
        style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Event"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveTask}>Save</Button>
          </>
        }
      >
        <div style={{ padding: '8px 0' }}>
          <TextInput
            label="Event Name"
            placeholder="Enter event name..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveTask();
              }
            }}
          />
        </div>
        <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Color</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {EVENT_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: selectedColor === color ? '2px solid var(--color-text-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
