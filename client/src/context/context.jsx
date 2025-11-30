import { createContext, useContext, useState } from "react";
import { userAPI } from "../services/api";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)

    async function login(userCredentials) {
        const user = await userAPI.loginUser(userCredentials)
        setToken(user.token)

        localStorage.setItem("token", user.token)
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