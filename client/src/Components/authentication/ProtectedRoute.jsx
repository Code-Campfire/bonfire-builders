import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/context"

export const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    const locallyStoredToken = localStorage.getItem("token")

    if(!token && !locallyStoredToken){
        return <Navigate to="/login" replace />
    }

    return children
}   