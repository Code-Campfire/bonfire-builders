import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/context"
import { useEffect } from "react";

export const ProtectedRoute = ({ children }) => {
    const { token, restoreToken } = useAuth();
    const locallyStoredToken = localStorage.getItem("token") 
    
    // User has not authenticated
    // JWT has expired
    if(!token && !locallyStoredToken){
        return <Navigate to="/login" replace />
    }

    useEffect(() => {
        restoreToken(locallyStoredToken)
    }, [token])
    return children
}   