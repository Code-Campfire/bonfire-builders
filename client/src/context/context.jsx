import { createContext, useContext, useDeferredValue, useEffect, useState } from "react";
import { userAPI } from "../services/api";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const locallyStoredToken = localStorage.getItem("token")
        decodeJwtForUser(locallyStoredToken)
    }, [])

    function decodeJwtForUser(token) {
        try {
            // Parses encoded, locally stored token
            // from base64 to human-readable
            // decodes user data incorporated encoded at JWT generation
            const payload = JSON.parse(atob(token.split('.')[1]))
            setUser(payload)
        } catch(error) {
            return null
        }
    }

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

    function restoreToken(locallyStoredToken) {
        setToken(locallyStoredToken)
    }

    return (
        <AuthContext.Provider value={{token, restoreToken, login, logout}}>
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