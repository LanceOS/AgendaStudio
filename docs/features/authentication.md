# Authentication & Security

The platform utilizes **Better-Auth** to provide a secure and modern authentication experience.

- **Session Management:** Secure, HTTP-only cookies handle session persistence across the client and server.
- **Protected Routes:** React components (`<ProtectedRoute>`) automatically intercept unauthorized users and redirect them to the login flow.
- **API Security:** The Express server validates active sessions before processing protected endpoint requests, ensuring data privacy.
