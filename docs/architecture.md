# AgendaStudio Architecture

AgendaStudio is built as a monolithic repository containing three core packages: `client`, `server`, and a shared component `library`. This architecture ensures clear separation of concerns while allowing seamless type sharing and UI consistency across the application.

## 1. Repository Structure

The project root contains three primary workspaces:

- **`/client`**: The frontend React application built with Vite. It handles user interactions, rendering views, and communicating with the backend API.
- **`/server`**: The backend Node.js application built with Express and Drizzle ORM. It manages the database, authentication logic, and API endpoints.
- **`/library`**: A robust, shared UI component library built with React. It implements the design system and provides foundational building blocks (like Buttons, Modals, and Calendar components) to the client application.

## 2. Technology Stack

### Frontend (Client)
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with comprehensive CSS Variables for theming (supporting dark/light modes and custom accents).
- **Authentication**: Better-Auth React client SDK for managing session state.
- **Routing**: React Router for single-page application navigation.

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via local Docker container or cloud provider).
- **ORM**: Drizzle ORM for type-safe database interactions and migrations.
- **Authentication**: Better-Auth server configuration for robust session management, password hashing, and cookie handling.
- **Validation**: Zod for request schema validation.

### Shared (Library)
- **Design System**: A custom-built component library tailored for AgendaStudio. It utilizes compound component patterns to provide flexibility (e.g., `<CalendarView>`).
- **Icons**: Lucide React for consistent vector iconography.

## 3. Database Schema

The PostgreSQL database is managed via Drizzle ORM (`server/src/db/schema.ts`) and consists of the following core tables:

- **`users`**: Stores user profiles (ID, name, email, verification status).
- **`sessions`**: Tracks active user sessions managed by Better-Auth.
- **`accounts` & `verifications`**: Better-Auth internal tables for OAuth and email verification.
- **`events`**: The core data entity for the calendar. Stores `id`, `title`, `start`, and `end` timestamps.
- **`mcp_configs` & `app_configs`**: Stores dynamic application configuration settings and integrations.

## 4. Design Patterns

### Compound Components
The UI library leverages compound components to allow maximum flexibility without prop-drilling. For example, the `Sidebar` is composed of `SidebarHeader`, `SidebarContent`, `SidebarGroup`, and `SidebarItem`, allowing the `client` to assemble the layout declaratively.

### Repository Pattern
The backend abstracts database operations into Repository classes (e.g., `EventRepository`, `UserRepository`). This isolates the ORM layer from the route handlers, making the codebase easier to test and maintain.

### Zod Middleware Validation
API endpoints use a custom Express middleware (`validate.ts`) to validate incoming `body`, `query`, and `params` against Zod schemas. This ensures that the route handlers always receive strictly typed and sanitized data.
