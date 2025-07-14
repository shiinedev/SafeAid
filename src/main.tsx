import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RouterProvider } from 'react-router-dom'
import router from './routes.tsx'
import { AuthProvider } from './hooks/useAuth.tsx'
import { TrainingProvider } from './hooks/useTraining.tsx'
import { BeneficiariesProvider } from './hooks/useBeneficiaries.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   
    <AuthProvider>
      <BeneficiariesProvider>
      <TrainingProvider>
       <RouterProvider router={router} />
      <App />
    </TrainingProvider>
    </BeneficiariesProvider>
  </AuthProvider>
  </StrictMode>,
)
