import { ReactNode } from "react"
import { LoaderCircle } from 'lucide-react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';


interface MyComponentProps {
  children: ReactNode
}
const ProtectedRoute = ({children}:MyComponentProps) => {

    const {user ,loading} = useAuth();

    const location = useLocation();


    if(loading){
       return( <div className='h-screen flex justify-center items-center'>
            <LoaderCircle  className='animate-spin'/>
        </div>
       )
    }

    if(!user){
        return <Navigate to="/login" state={{from:location}} replace  />
    }

  return children
}

export default ProtectedRoute