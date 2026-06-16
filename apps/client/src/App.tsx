import React, { useEffect, useState } from 'react';
import { useCalendarStore } from './store/calendarStore';
import './App.css';

function App() {
  const { events, fetchEvents, addEvent, deleteEvent } = useCalendarStore();
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    // Fetch events for the current month roughly
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    
    fetchEvents(startOfMonth, endOfMonth);
  }, [fetchEvents]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !start || !end) return;
    await addEvent(title, new Date(start).toISOString(), new Date(end).toISOString());
    setTitle('');
    setStart('');
    setEnd('');
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <h1>Local Calendar</h1>
      </header>
      
      <main className="calendar-main">
        <section className="add-event-section">
          <h2>Add Event</h2>
          <form onSubmit={handleAddEvent} className="add-event-form">
            <input
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
            <button type="submit">Save Event</button>
          </form>
        </section>

        <section className="events-list-section">
          <h2>Upcoming Events</h2>
          {events.length === 0 ? (
            <p>No events scheduled.</p>
          ) : (
            <ul className="events-list">
              {events.map((event) => (
                <li key={event.id} className="event-item">
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p>
                      {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => deleteEvent(event.id)} className="delete-btn">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
