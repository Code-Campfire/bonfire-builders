import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/context"

export const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();

    if(!token){
        return <Navigate to="/login" replace />
    }

    return children
}   