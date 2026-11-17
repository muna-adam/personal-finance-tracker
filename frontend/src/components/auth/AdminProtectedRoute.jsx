import { useEffect } from 'react';
import { useLocation, Navigate }  from 'react-router'
import { Loader } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import  useAuthStore  from '../../lib/store/authStore'
import api from "../../lib/api/apiClient";



export const AdminProtectedRoute = ({ children }) => {

const { user, setAuth, clearAuth, token } = useAuthStore();
    const location = useLocation();

    const { data, error, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await api.get('/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`}
               
            });
            return response.data
        },
        retry: 1
    })

    // error case

    useEffect(() => {

        if (error) {
            clearAuth();
        }

    }, [isError, error, clearAuth]);

    // success case
    useEffect(() => {
        if (isSuccess && data) {
            setAuth(data, token)
        }

    }, [isSuccess, data, setAuth, token])


    if (isLoading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <Loader className='animate-spin' />
            </div>
        )
    }


    if (isError) {
        console.log("error here", error);
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (!user) {
        console.log("user not found", user);
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (user.role !== 'admin') {
        console.log("user is not an admin", user);
        return <Navigate to="/dashboard" state={{ from: location }} replace />
    }


    
  return children
}
