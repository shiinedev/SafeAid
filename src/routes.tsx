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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index:true,
        element: <Home />,
      },
      {
        path:"/login",
        element:<Login />
      },
      {
        path:"/training",
        element:<Training />
      },
      {
         path:"/training/:id",
        element:<TrainingDetails />
      },
      {
         path:"/training/edit/:id",
        element:<AddTrainingForm />
      },
      {
        path:"/training/new",
        element:<AddTrainingForm />
      },
      {
        path: '/dashboard',
        element:<ProtectedRoute><Dashboard /></ProtectedRoute>
      },
    ],
  },
])

export default router
