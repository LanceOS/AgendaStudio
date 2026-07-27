export type CalendarViewMode = 'year' | 'month' | 'week' | 'day';

export interface Category {
  id: string | number;
  name: string;
  color: string;
}

export interface CalendarEvent {
  id: string | number;
  title: string;
  date: Date;
  endDate?: Date;
  color?: string;
  categoryId: string | number | null;
  description?: string | null;
  location?: string | null;
  isAllDay?: boolean;
}

export interface CalendarState {
  selectedDate: Date;
  viewMode: CalendarViewMode;
  activeCategoryId: string | number | null;
}

export interface CalendarContextValue extends CalendarState {
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setActiveCategoryId: (id: string | number | null) => void;
  events: CalendarEvent[];
  categories: Category[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateEvent: (id: string | number, event: Partial<CalendarEvent>) => void;
  removeEvent: (id: string | number) => void;
}
