import { useState } from "react";
import { useAuth } from "../../context/context"

export const LoginForm = () => {
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

    function handleSubmit(formData){
        e.prevent.default();

        login(formData)
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800"> Please, Log In</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
        </div>
    )
}

