import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './modules/core/screens/Layout'
import { SettingsScreen } from './modules/settings/screens/SettingsScreen'
import { CreateCategoryScreen } from './modules/calendar/screens/CreateCategoryScreen'
import { CalendarScreen } from './modules/calendar/screens/CalendarScreen'

import { LoginScreen } from './modules/auth/screens/LoginScreen'
import { RegisterScreen } from './modules/auth/screens/RegisterScreen'
import { ProtectedRoute } from './modules/auth/components/ProtectedRoute'

const queryClient = new QueryClient()

import { CalendarProvider } from './modules/calendar/hooks/useCalendarState'

import { Navigate } from 'react-router';
import { DayViewScreen } from './modules/calendar/screens/DayViewScreen';
import { EventCreatorScreen } from './modules/calendar/screens/EventCreatorScreen';
import { EventDetailsScreen } from './modules/calendar/screens/EventDetailsScreen';
import { NotFoundScreen } from './modules/core/screens/NotFoundScreen';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <CalendarProvider>
          <Layout />
        </CalendarProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/calendar" replace />,
      },
      {
        path: "calendar",
        element: <CalendarScreen />,
      },
      {
        path: "calendar/day/:date",
        element: <DayViewScreen />,
      },
      {
        path: "events/new",
        element: <EventCreatorScreen />,
      },
      {
        path: "events/:eventId",
        element: <EventDetailsScreen />,
      },
      {
        path: "calendar/create-category",
        element: <CreateCategoryScreen />,
      },
      {
        path: "*",
        element: <NotFoundScreen />,
      },
    ],
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <CalendarProvider>
          <SettingsScreen />
        </CalendarProvider>
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
