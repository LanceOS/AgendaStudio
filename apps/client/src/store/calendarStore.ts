import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

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
      const fetchedEvents: CalendarEvent[] = await invoke('get_events_by_range', { start, end });
      set({ events: fetchedEvents });
    } catch (error) {
      console.error('Failed to fetch events', error);
    }
  },
  addEvent: async (title, start, end) => {
    try {
      const newEvent: CalendarEvent = await invoke('create_event', { title, start, end });
      set((state) => ({ events: [...state.events, newEvent] }));
    } catch (error) {
      console.error('Failed to create event', error);
    }
  },
  deleteEvent: async (id) => {
    try {
      const success: boolean = await invoke('delete_event', { id });
      if (success) {
        set((state) => ({ events: state.events.filter((e) => e.id !== id) }));
      }
    } catch (error) {
      console.error('Failed to delete event', error);
    }
  },
}));
