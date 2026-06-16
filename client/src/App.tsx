import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './modules/core/screens/Layout'
import { SettingsScreen } from './modules/settings/screens/SettingsScreen'
import { CreateCategoryScreen } from './modules/calendar/screens/CreateCategoryScreen'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <div><h2>Home</h2><p>Welcome to AgendaStudio</p></div>,
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
