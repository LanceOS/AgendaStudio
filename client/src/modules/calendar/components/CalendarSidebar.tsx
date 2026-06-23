import React from 'react';
import { useCalendarState } from '../hooks/useCalendarState';
import type { Category } from '../types';

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Personal', color: '#3b82f6' }, // Blue
  { id: '2', name: 'Work', color: '#10b981' }, // Green
  { id: '3', name: 'Holidays', color: '#f59e0b' }, // Yellow
  { id: '4', name: 'Events', color: '#8b5cf6' }, // Purple
];

export const CalendarSidebar: React.FC = () => {
  const { activeCategoryId, setActiveCategoryId } = useCalendarState();

  const handleCategoryClick = (id: string) => {
    // Toggle off if already active
    if (activeCategoryId === id) {
      setActiveCategoryId(null);
    } else {
      setActiveCategoryId(id);
    }
  };

  return (
    <aside className="calendar-sidebar">
      <h3 className="calendar-sidebar-title">Categories</h3>
      <div className="category-list">
        {MOCK_CATEGORIES.map((category) => (
          <div
            key={category.id}
            className={`category-item ${activeCategoryId === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div
              className="category-color"
              style={{ backgroundColor: category.color }}
            />
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};
