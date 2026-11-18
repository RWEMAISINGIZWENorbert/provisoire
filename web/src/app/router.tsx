import { createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/app/shell/AppShell'
import { ProtectedRoute } from '@/app/shell/ProtectedRoute'
import TokensPreview from '@/dev/TokensPreview'
import ComponentsPreview from '@/dev/ComponentsPreview'
import UtilsPreview from '@/dev/UtilsPreview'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import LearnPage from '@/features/learn/LearnPage'
import TopicPage from '@/features/learn/TopicPage'
import PracticePage from '@/features/practice/PracticePage'
import NotFoundPage from '@/pages/NotFoundPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import ProfilePage from '@/features/profile/ProfilePage'
// import { MOCK_QUESTIONS, MOCK_TOPICS } from '@/lib/mock'


export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  {
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/learn',
        element: <LearnPage />,
      },
      {
        path: '/learn/:topicId',
        element: <TopicPage />,
      },
      {
        path: '/practice',
        element: <PracticePage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },

  { path: '/dev/tokens', element: <TokensPreview /> },
  { path: '/dev/components', element: <ComponentsPreview /> },
  { path: '/dev/utils', element: <UtilsPreview /> },
  { path: '*', element: <NotFoundPage /> },
])