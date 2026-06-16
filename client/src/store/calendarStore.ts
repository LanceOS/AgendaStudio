import { create } from 'zustand';

export interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
}

interface CalendarState {
  events: CalendarEvent[];
  fetchEvents: (start: string, end: string) => Promise<void>;
  addEvent: (title: string, start: string, end: string) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  fetchEvents: async (start, end) => {
    try {
      const response = await fetch(`/api/events?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
      if (response.ok) {
        const fetchedEvents: CalendarEvent[] = await response.json();
        set({ events: fetchedEvents });
      }
    } catch (error) {
      console.error('Failed to fetch events', error);
    }
  },
  addEvent: async (title, start, end) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, start, end })
      });
      if (response.ok) {
        const newEvent: CalendarEvent = await response.json();
        set((state) => ({ events: [...state.events, newEvent] }));
      }
    } catch (error) {
      console.error('Failed to create event', error);
    }
  },
  deleteEvent: async (id) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          set((state) => ({ events: state.events.filter((e) => e.id !== Number(id)) }));
        }
      }
    } catch (error) {
      console.error('Failed to delete event', error);
    }
  },
}));
