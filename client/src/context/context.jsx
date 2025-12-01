import { createContext, useContext, useDeferredValue, useState } from "react";
import { userAPI } from "../services/api";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)

    async function login(userCredentials) {
        try {

            const response = await userAPI.loginUser(userCredentials)
            
            setToken(response.token)
            setUser(response.user)
            localStorage.setItem("token", response.token)

            console.log("User successfully retrieved")

            return response
        } catch (error) {
            console.error("Error retrieving user: ", error)
            throw error
        }

        
    }

    function logout() {
        localStorage.removeItem("token")
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{token, login, logout}}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}