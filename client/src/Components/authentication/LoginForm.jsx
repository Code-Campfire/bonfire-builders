import { useState } from "react";
import { useAuth } from "../../context/context"
import { Navigate, useNavigate } from "react-router-dom";

export const LoginForm = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { login } = useAuth()

    function handleChange(e) {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();

        await login(formData)

        const locallyStoredToken = localStorage.getItem("token")

        if(!locallyStoredToken) {
           throw new Error("Token was not saved locally")  
        }

        navigate("/")
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800"> Please, Log In</h3>
            <form className="space-y-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email: </label>
                <input
                    type="text"
                    value={formData.email}
                    id="email"
                    name="email"
                    onChange={handleChange}
                    className={"w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}
                />
                <br />
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password: </label>
                <input
                    type="text"
                    value={formData.password}
                    id="password"
                    name="password"
                    onChange={handleChange}
                    className={"w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}
                />
            </form>
            <div className="flex gap-3 pt-4">
                <button
                onClick={handleSubmit} 
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Login
                </button>
                <button
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Register
                </button>
            </div>
        </div>
    )
}

