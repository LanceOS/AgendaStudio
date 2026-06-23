# AgendaStudio Core Flows

This document maps out the sequence of events and data flow for the primary user interactions within AgendaStudio.

## 1. Authentication Flow

AgendaStudio uses Better-Auth to handle secure login and registration.

1. **User Action:** The user navigates to the `/login` or `/register` route in the React client.
2. **Client Request:** The user submits their credentials via the Auth component forms. The `authClient` (from `@better-auth/react`) sends a POST request to the server's authentication endpoints.
3. **Server Processing:** 
   - The Express server receives the request.
   - Better-Auth validates the credentials (checking password hashes or generating new ones).
   - If successful, it creates a new record in the `sessions` PostgreSQL table via Drizzle ORM.
   - The server responds with a secure, HTTP-only cookie containing the session token.
4. **Client State Update:** The `useSession()` hook in the React app detects the active session, updating the global state.
5. **Route Protection:** The `<ProtectedRoute>` component wrapping the main application routes validates the presence of the session. Upon success, it grants access to the dashboard and calendar.

## 2. Event Creation & Retrieval Flow

How calendar events are fetched and created.

### Fetching Events
1. **Component Mount:** The `CalendarScreen` (or `DayView`) mounts and triggers a `fetch` request (or React Query hook) to the `/api/events` endpoint.
2. **Server Routing:** The Express router (`routes/events.ts`) catches the GET request.
3. **Validation:** The `validate` middleware checks the query parameters (e.g., `start` and `end` dates) against the Zod schema.
4. **Database Query:** The `EventRepository` executes a `SELECT` statement via Drizzle ORM to fetch events falling within the requested date range.
5. **Client Rendering:** The server returns a JSON array of events. The React client maps these events to specific day cells in the `CalendarView` or time slots in the `DayView`.

### Creating an Event
1. **User Action:** The user clicks a specific day to open the `DayView`, then clicks and drags on the time grid to select a duration (utilizing the `useTimeSlotDrag` hook).
2. **Form Submission:** A modal prompts the user for an event title. Upon submission, the client sends a POST request to `/api/events` with the `title`, `start`, and `end` data.
3. **Server Validation:** The `validate` middleware ensures the payload matches the `CreateEventSchema`.
4. **Database Insertion:** The `EventRepository` inserts the new event into the `events` table and returns the newly created record.
5. **UI Update:** The client receives the 201 Created response, updates its local state (or invalidates the query cache), and immediately renders the new event badge on the calendar UI.

## 3. UI Navigation Flow

How the application layout and routing are managed.

1. **Root Layout:** The `App.tsx` defines the main structure: a persistent `Sidebar` on the left and a main content area on the right.
2. **React Router:** Clicking an item in the `Sidebar` (e.g., "Calendar" or "Settings") updates the browser URL via React Router's `<Link>` or `useNavigate`.
3. **View Switching:** The `<Routes>` component detects the URL change and renders the appropriate Screen component (e.g., `CalendarScreen`) into the main content area, while the `Sidebar` remains mounted, ensuring a seamless SPA experience.
