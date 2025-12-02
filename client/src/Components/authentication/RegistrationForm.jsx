import { useState } from "react";
import { useAuth } from "../../context/context"
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../services/api";

export const RegistrationForm = () => {
    const navigate = useNavigate()
    const { register } = useAuth();
    const [userFormData, setUserFormData] = useState({
        email: '',
        password_hash: '',
        role: 'TENANT',
        first_name: '',
        last_name: '',
        phone: '',  
        complex_id: 1,
        apartment_number: '',
        building_name: '',
        move_in_date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()

    });
    const [landlordComplexFormData, setLandLordComplexFormData] = useState({
        name: '',
        address: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()

    });
    const [errors, setErrors] = useState({});
    const { login } = useAuth()

    function handleUserChange(e) {
        const { name, value } = e.target
        setUserFormData(prev => ({
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
    function handleComplexChange(e) {
        const { name, value } = e.target
        setLandLordComplexFormData(prev => ({
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

        if (!userFormData.email.trim()) {
            newErrors.email = 'Email is required';
        }
        if (!userFormData.password_hash.trim()) {
            newErrors.password_hash = 'Password is required';
        }
        if (!userFormData.role.trim()) {
            newErrors.role = 'Role is required';
        }
        if (!userFormData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }
        if (!userFormData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }
        if (!userFormData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        }
        if (!userFormData.apartment_number.trim()) {
            newErrors.apartment_number = 'Apartment number is required';
        }
        if (!userFormData.building_name.trim()) {
            newErrors.building_name = 'Building name is required';
        }
        if (!landlordComplexFormData.name.trim() && userFormData.role !== "TENANT") {
            newErrors.name = 'Complex name is required';
        }
        if (!landlordComplexFormData.address.trim() && userFormData.role !== "TENANT") {
            newErrors.address = 'Complex address is required';
        }

        return newErrors;
    };
    async function handleSubmit(e) {
        e.preventDefault();

        console.log("Button clicked")
        const validationErrors = validate()

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        await register(userFormData)

        const locallyStoredToken = localStorage.getItem("token")

        if (!locallyStoredToken) {
            throw new Error("Token was not saved locally")
        }

        navigate("/")
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800"> Please, Register</h3>
            <form className="space-y-4">
                <select
                    id="role"
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role ? 'border-red-500' : 'border-gray-300'
                        }`}
                >
                    <option value="TENANT">Tenant</option>
                    <option value="LANDLORD">Landlord</option>
                </select>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email: </label>
                <input
                    type="text"
                    value={userFormData.email}
                    id="email"
                    name="email"
                    onChange={handleUserChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                <br />
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password: </label>
                <input
                    type="text"
                    value={userFormData.password_hash}
                    id="password_hash"
                    name="password_hash"
                    onChange={handleUserChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First name: </label>
                <input
                    type="text"
                    value={userFormData.first_name}
                    id="first_name"
                    name="first_name"
                    onChange={handleUserChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.first_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
                <br />
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last name: </label>
                <input
                    type="text"
                    value={userFormData.last_name}
                    id="last_name"
                    name="last_name"
                    onChange={handleUserChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.last_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone: </label>
                <input
                    type="text"
                    value={userFormData.phone}
                    id="phone"
                    name="phone"
                    onChange={handleUserChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
                <br />
                {userFormData.role === "TENANT"
                    ?
                    <>
                        <label htmlFor="building_name" className="block text-sm font-medium text-gray-700 mb-1">Building name: </label>
                        <input
                            type="text"
                            value={userFormData.building_name}
                            id="building_name"
                            name="building_name"
                            onChange={handleUserChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.building_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.building_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.building_name}</p>
                        )}
                        <label htmlFor="apartment_number" className="block text-sm font-medium text-gray-700 mb-1">Apartment number: </label>
                        <input
                            type="text"
                            value={userFormData.apartment_number}
                            id="apartment_number"
                            name="apartment_number"
                            onChange={handleUserChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.apartment_number ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.apartment_number && (
                            <p className="text-red-500 text-sm mt-1">{errors.apartment_number}</p>
                        )}
                    </>
                    :
                    <>
                    <h3 className="text-1x1 font-bold mb-8 text-gray-800">Optional fields</h3>
                    <label htmlFor="landlord_building_name" className="block text-sm font-medium text-gray-700 mb-1">Building name: </label>
                        <input
                            type="text"
                            value={userFormData.building_name}
                            id="landlord_building_name"
                            name="landlord_building_name"
                            onChange={handleUserChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <label htmlFor="landlord_apartment_number" className="block text-sm font-medium text-gray-700 mb-1">Apartment number: </label>
                        <input
                            type="text"
                            value={userFormData.apartment_number}
                            id="landlord_apartment_number"
                            name="landlord_apartment_number"
                            onChange={handleComplexChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <h3 className="text-1x1 font-bold mb-8 text-gray-800">Please, enter information about your apartment complex</h3>
                        <label htmlFor="complex_name" className="block text-sm font-medium text-gray-700 mb-1">Complex name: </label>
                        <input
                            type="text"
                            value={landlordComplexFormData.complex_name}
                            id="name"
                            name="name"
                            onChange={handleComplexChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Complex address: </label>
                        <input
                            type="text"
                            value={landlordComplexFormData.address}
                            id="address"
                            name="address"
                            onChange={handleComplexChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                    </>
                }
            </form>
            <div className="flex gap-3 pt-4">
                <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Register
                </button>
                <button
                    onClick={() => { navigate("/login") }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Back to login
                </button>
            </div>
        </div>
    )
}

