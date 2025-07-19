import { ReactNode } from "react"
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from "@/lib/store/authStore";



interface MyComponentProps {
  children: ReactNode
}
const ProtectedRoute = ({children}:MyComponentProps) => {

    const {user} = useAuthStore();

    const location = useLocation();



    if(!user){
        return <Navigate to="/login" state={{from:location}} replace  />
    }

  return children
}

export default ProtectedRoute