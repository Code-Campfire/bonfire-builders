import { createContext, useContext, useDeferredValue, useEffect, useState } from "react";
import { userAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const navigate = useNavigate();

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

    async function register(userCredentials) {
        try {

            // Receives API response
            const response = await userAPI.registerUser(userCredentials)
            
            // Sets context state with API response
            setToken(response.token)
            setUser(response.user)
            localStorage.setItem("token", response.token)

            // Console out, process step
            console.log("User successfully retrieved")

            // Returns registered user to registration form component
            return response.user
        } catch (error) {
            console.error("Error retrieving user: ", error)
            throw error
        }
        
    }

    function updateUser(updatedUser) {
        setUser(updatedUser)
    }

    function logout() {
        localStorage.removeItem("token")
        setToken(null)
        navigate("/login")
    }

    return (
        <AuthContext.Provider value={{token, user, updateUser, register, login, logout}}>
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