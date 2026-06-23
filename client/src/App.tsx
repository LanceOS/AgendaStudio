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
        path: "/",
        element: <CalendarScreen />,
      },
      {
        path: "/settings",
        element: <SettingsScreen />,
      },
      {
        path: "/calendar/create-category",
        element: <CreateCategoryScreen />,
      },
    ],
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
