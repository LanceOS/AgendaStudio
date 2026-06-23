# AgendaStudio Features

AgendaStudio offers a comprehensive suite of features designed to manage schedules, authenticate users, and provide a polished user experience through a robust design system.

## 1. Authentication & Security

The platform utilizes **Better-Auth** to provide a secure and modern authentication experience.
- **Session Management:** Secure, HTTP-only cookies handle session persistence across the client and server.
- **Protected Routes:** React components (`<ProtectedRoute>`) automatically intercept unauthorized users and redirect them to the login flow.
- **API Security:** The Express server validates active sessions before processing protected endpoint requests, ensuring data privacy.

## 2. Calendar & Scheduling System

The core of AgendaStudio is its dynamic calendar interface, built using custom compound components.

### Monthly Calendar View
- **Grid Layout:** Displays a responsive monthly grid.
- **Navigation Controls:** Users can quickly navigate between months and years using intuitive dropdowns and previous/next buttons. A "Today" button instantly snaps the view back to the current date.
- **Event Visualization:** Events are rendered within their respective day cells as color-coded badges, providing an at-a-glance overview of the month's schedule.

### Full-Screen Day View
- **Expandable Days:** Clicking the expand icon on any day in the monthly calendar opens a detailed, full-screen day view.
- **Time Grid:** A vertical timeline (e.g., 12 AM to 11 PM) visualizes the specific time slots for the day.
- **Current Time Indicator:** A dynamic red line and timestamp indicate the exact current time relative to the day's timeline.
- **Event Management:** (In Progress) Users can click and drag to select time slots, establishing a foundation for an intuitive event-creation experience.

## 3. UI & Design System

AgendaStudio does not rely on heavy frameworks like Tailwind; instead, it uses a bespoke component library (`/library`) and CSS variable theming.

- **Dynamic Theming:** The entire application responds to CSS variables defined in `index.css`. This enables effortless switching between Light and Dark modes, and allows for custom accent colors.
- **Component Library:** A rich set of reusable UI elements:
  - **Sidebar:** A collapsible, structured navigation menu with group labels, icons, and nested items.
  - **Forms & Inputs:** Standardized Buttons, Text Inputs, Select dropdowns, and Checkboxes ensure a consistent data-entry experience.
  - **Overlays & Modals:** Support for dialogs, popovers, and context menus for contextual interactions without leaving the page.
- **Responsiveness:** Components are built with flexbox and CSS grid to ensure they adapt gracefully to various screen sizes.

## 4. Testing & Reliability

- **Comprehensive Test Suite:** The codebase is thoroughly tested using **Vitest**.
- **Isolated Database Tests:** Backend repositories are tested against a real, isolated PostgreSQL test database (`agendastudio_test`) to guarantee data integrity without polluting development data.
- **CI/CD Integration:** GitHub Actions automatically runs the test suite on every push and pull request, enforcing a minimum code coverage threshold.
