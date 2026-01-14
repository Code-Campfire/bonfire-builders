import { useState } from "react";
import { useAuth } from "../../context/context"
import { useNavigate } from "react-router-dom";
import { EyeOff, Eye } from "lucide-react";
import { getButtonClasses, getInputClasses, labelBase, errorText, cardVariants, cardPadding, typography } from "../../styles";

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
        <div className={`${cardVariants.default} ${cardPadding.md} max-w-2xl mx-auto`}>
            <h3 className={`${typography.h3} mb-6`}> Please, Log In</h3>
            <form className="space-y-4">
                <label htmlFor="email" className={labelBase}>Email: </label>
                <input
                    type="text"
                    value={formData.email}
                    id="email"
                    name="email"
                    onChange={handleChange}
                    className={getInputClasses(!!errors.email)}
                />
                {errors.email && (
                    <p className={errorText}>{errors.email}</p>
                )}
                <br />
                <label htmlFor="password" className={labelBase}>Password: </label>
                <div className="flex flex-row">
                <input
                    type={showPassword ? 'text': 'password'}
                    value={formData.password_hash}
                    id="password_hash"
                    name="password_hash"
                    onChange={handleChange}
                    className={getInputClasses(!!errors.password_hash)}
                />
                <button type="button" className="m-2" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button>
                </div>
                {errors.password_hash && (
                    <p className={errorText}>{errors.password_hash}</p>
                )}
            </form>
            <div className="flex gap-3 pt-4">
                <button
                    onClick={handleSubmit}
                    className={getButtonClasses('primary', 'md', 'flex-1')}
                >
                    Login
                </button>
                <button
                    onClick={() => {navigate("/register")}}
                    className={getButtonClasses('primary', 'md', 'flex-1')}
                >
                    Register
                </button>
            </div>
        </div>
    )
}
