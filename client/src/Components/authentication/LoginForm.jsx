import { useState } from "react";
import { useAuth } from "../../context/context"
import { useNavigate } from "react-router-dom";
import { EyeOff, Eye } from "lucide-react";

export const LoginForm = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password_hash: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth()

    function handleChange(e) {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }
        if (!formData.password_hash.trim()) {
            newErrors.password_hash = 'Password is required';
        }

        return newErrors;
    };
    async function handleSubmit(e) {
        e.preventDefault();

        const validationErrors = validate()

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        if (!formData.email.trim() || !formData.password_hash.trim()) {
            throw new Error("Fields are required!")
        }

        await login(formData)

        const locallyStoredToken = localStorage.getItem("token")

        if (!locallyStoredToken) {
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                <br />
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password: </label>
                <div className="flex flex-row">
                <input
                    type={showPassword ? 'text': 'password'}
                    value={formData.password_hash}
                    id="password_hash"
                    name="password_hash"
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password_hash ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                <button type="button" className="m-2" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button>
                </div>
                {errors.password_hash && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_hash}</p>
                )}
            </form>
            <div className="flex gap-3 pt-4">
                <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Login
                </button>
                <button
                    onClick={() => {navigate("/register")}}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Register
                </button>
            </div>
        </div>
    )
}
