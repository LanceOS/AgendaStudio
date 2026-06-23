import React, { useState } from 'react';
import { CalendarView } from '../../../../../library/components/calendarview';
import { DayView } from '../../../../../library/components/dayview';
import { Modal } from '../../../../../library/components/modal';
import { Button } from '../../../../../library/components/button';
import { TextInput } from '../../../../../library/components/textinput';
import { useCalendarState } from '../hooks/useCalendarState';

export const CalendarScreen: React.FC = () => {
  const { 
    selectedDate, setSelectedDate, 
    viewMode, setViewMode,
    events, addEvent, removeEvent, updateEvent
  } = useCalendarState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('var(--color-primary)');

  const EVENT_COLORS = [
    'var(--color-primary)',
    '#10b981', // green
    '#f59e0b', // orange
    '#ef4444', // red
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
  ];

  const handleDayExpand = (date: Date) => {
    setSelectedDate(date);
    setViewMode('day');
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

  return (
    <div style={{ height: '100%' }}>
      {viewMode === 'day' ? (
        <DayView
          currentDate={selectedDate}
          onDateChange={setSelectedDate}
          onClose={() => setViewMode('month')}
          events={events.map(e => ({ id: e.id, date: e.date, endDate: e.endDate, label: e.title, color: e.color || 'var(--color-primary)' }))}
          onTimeSlotSelect={handleTimeSlotSelect}
          onEventDelete={removeEvent}
          onEventUpdate={updateEvent}
          style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }}
        />
      ) : (
        <CalendarView 
          currentDate={selectedDate}
          onDateChange={setSelectedDate}
          onDayExpand={handleDayExpand}
          events={events.map(e => ({ date: e.date, label: e.title, color: e.color || 'var(--color-primary)' }))} 
          style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }} 
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Event"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
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
