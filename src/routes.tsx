// src/routes.tsx
import { createBrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import App from './App'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/Login'
import Training from './pages/Training'
import ProtectedRoute from './components/ProtectedRoute'
import AddTrainingForm from './components/AddTrainingForm'

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
