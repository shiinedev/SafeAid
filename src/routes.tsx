// src/routes.tsx
import { createBrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import App from './App'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/Login'
import Training from './pages/Training'
import ProtectedRoute from './components/ProtectedRoute'
import AddTrainingForm from './components/training/AddTrainingForm'
import TrainingDetails from './components/training/TrainingDetails'
import UsersPage from './pages/dashboard/Users'
import BeneficiariesPage from './pages/dashboard/Beneficiaries'
import SettingsPage from './pages/dashboard/Setting'
import AddBeneficiariesForm from './components/AddBeneficiariesForm'
import AddUsersForm from './components/AddUserForm'
import SyncPage from './pages/dashboard/SyncPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/training",
        element: <Training />
      },
      {
        path: "/training/:id",
        element: <TrainingDetails />
      },
      {
        path: "/training/edit/:id",
        element: <AddTrainingForm />
      },
      {
        path: "/training/new",
        element: <AddTrainingForm />
      },
      {
        path: "/users",
        element: <ProtectedRoute>
          <UsersPage />
        </ProtectedRoute>
      },
      {
        path: "/users/new",
        element: <ProtectedRoute>
          <AddUsersForm />
        </ProtectedRoute>
      },
      {
        path: "/sync",
        element: <ProtectedRoute>
          <SyncPage />
        </ProtectedRoute>
      },
      {
        path: "/beneficiaries",
        element: <ProtectedRoute>
          <BeneficiariesPage />
        </ProtectedRoute>

      },
      {
        path: "/beneficiaries/new",
        element: <ProtectedRoute>
          <AddBeneficiariesForm />
        </ProtectedRoute>

      },
      {
        path: "/beneficiaries/:id/edit",
        element: <ProtectedRoute>
          <AddBeneficiariesForm />
        </ProtectedRoute>

      },
      {
        path: "/settings",
        element: <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>

      },

      {
        path: '/dashboard',
        element: <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>,
      },
    ],
  },
])

export default router
