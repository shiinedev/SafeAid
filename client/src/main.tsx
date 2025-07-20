import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RouterProvider } from 'react-router-dom'
import router from './routes.tsx'
import { AuthProvider } from './hooks/useAuth.tsx'
import { TrainingProvider } from './hooks/useTraining.tsx'
import { BeneficiariesProvider } from './hooks/useBeneficiaries.tsx'
import { UsersProvider } from './hooks/useUsers'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UsersProvider>
        <AuthProvider>
          <BeneficiariesProvider>
            <TrainingProvider>
              <RouterProvider router={router} />
              <App />
            </TrainingProvider>
          </BeneficiariesProvider>
        </AuthProvider>
      </UsersProvider>
    </QueryClientProvider>
  </StrictMode>,
)