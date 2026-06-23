# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Testing

The project uses [Vitest](https://vitest.dev/) for testing across the `client`, `server`, and `library` packages.

### Running Tests Locally

1. **Client & Library Tests (Frontend):**
   Frontend components and hooks are tested using Vitest + React Testing Library + JSDOM.
   ```bash
   cd client
   npm run test
   npm run test:coverage # to check coverage
   
   cd ../library
   npm run test
   ```

2. **Server Tests (Backend):**
   The server tests run against a real PostgreSQL instance to ensure accurate database queries.
   
   First, make sure you have the postgres container running:
   ```bash
   docker-compose up -d postgres
   ```
   
   Then, run the tests:
   ```bash
   cd server
   npm run test
   ```
   *Note: Running `npm run test` on the server automatically creates a separate `agendastudio_test` database and applies migrations so it does not interfere with your local development data.*
