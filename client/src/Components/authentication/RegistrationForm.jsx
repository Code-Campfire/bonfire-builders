import { useState, useEffect } from "react";
import { useAuth } from "../../context/context"
import { useNavigate } from "react-router-dom";
import { complexAPI, userAPI } from "../../services/api";
import { EyeOff, Eye } from "lucide-react";
import { getButtonClasses, getInputClasses, labelBase, errorText, cardVariants, cardPadding, typography } from "../../styles";

export const RegistrationForm = () => {
    const navigate = useNavigate()
    const { register, user, updateUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [userFormData, setUserFormData] = useState({
        email: '',
        password_hash: '',
        role: 'TENANT',
        first_name: '',
        last_name: '',
        phone: '',  
        complex_id: 1, // Temporary default - will be updated for landlords after complex creation
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
    const [complexes, setComplexes] = useState([]);
    const [loadingComplexes, setLoadingComplexes] = useState(true);
    const { login } = useAuth()

    useEffect(() => {
        fetchComplexes();
    }, []);

    async function fetchComplexes() {
        try {
            setLoadingComplexes(true);
            const data = await complexAPI.getAllComplexes();
            setComplexes(data);
        } catch (error) {
            console.error('Failed to fetch complexes:', error);
        } finally {
            setLoadingComplexes(false);
        }
    }

    function handleUserChange(e) {
        const { name, value } = e.target
        setUserFormData(prev => ({
            ...prev,
            [name]: name === 'complex_id' ? parseInt(value) || 1 : value
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
        if (!userFormData.apartment_number.trim() && userFormData.role !== "LANDLORD") {
            newErrors.apartment_number = 'Apartment number is required';
        }

        // Validate complex_id for tenants
        if (userFormData.role === "TENANT" && (!userFormData.complex_id || userFormData.complex_id === "")) {
            newErrors.complex_id = 'Please select a property/complex';
        }

        // building_name is now optional for all users
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

        try {
            const validationErrors = validate()

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            // Sends userFormData to context file before API call
            // Returns registered user information
            const registeredUser = await register(userFormData)

            // Only in the case of registering a landlord
            if(userFormData.role === "LANDLORD") {

                // Creates complex associated with registering landlord
                const createdComplex = await complexAPI.createComplex(landlordComplexFormData)

                // Updates default complex_id value on registered landlord
                registeredUser.complex_id = createdComplex.id

                // Sends apartment complex form data to API for creation
                const response = await userAPI.updateUser(registeredUser)
                
                // Updates landlord user -> apartment complex reference
                updateUser(response.user)

                // Console out process step
                console.log("User successfully updated!")
            }

            const locallyStoredToken = localStorage.getItem("token")
            
            // Error handling, that API generated token was stored locally
            if (!locallyStoredToken) {
                throw new Error("Token was not saved locally")
            }

            // Navigate authenticated user to home route
            navigate("/")
        } catch (error) {
            console.error("Registration error:", error);
            console.error("Error response:", error.response?.data);
            alert(`Registration failed: ${error.response?.data?.error || error.message}`);
        }
    }

    return (
        <div className={`${cardVariants.default} ${cardPadding.md} max-w-2xl mx-auto`}>
            <h3 className={`${typography.h3} mb-6`}> Please, Register</h3>
            <form className="space-y-4">
                <select
                    id="role"
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserChange}
                    className={getInputClasses(!!errors.role)}
                >
                    <option value="TENANT">Tenant</option>
                    <option value="LANDLORD">Landlord</option>
                </select>
                <label htmlFor="email" className={labelBase}>Email: </label>
                <input
                    type="text"
                    value={userFormData.email}
                    id="email"
                    name="email"
                    onChange={handleUserChange}
                    className={getInputClasses(!!errors.email)}
                />
                {errors.email && (
                    <p className={errorText}>{errors.email}</p>
                )}
                <br />
                <label htmlFor="password" className={labelBase}>Password: </label>
                <div className="flex flex-row">
                <input
                    type={showPassword ? "text" : "password"}
                    value={userFormData.password_hash}
                    id="password_hash"
                    name="password_hash"
                    onChange={handleUserChange}
                    className={getInputClasses(!!errors.password_hash)}
                />
                <button type="button" className="m-2" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button>
                </div>
                {errors.password_hash && (
                    <p className={errorText}>{errors.password_hash}</p>
                )}
                <label htmlFor="first_name" className={labelBase}>First name: </label>
                <input
                    type="text"
                    value={userFormData.first_name}
                    id="first_name"
                    name="first_name"
                    onChange={handleUserChange}
                    className={getInputClasses(!!errors.first_name)}
                />
                {errors.first_name && (
                    <p className={errorText}>{errors.first_name}</p>
                )}
                <br />
                <label htmlFor="last_name" className={labelBase}>Last name: </label>
                <input
                    type="text"
                    value={userFormData.last_name}
                    id="last_name"
                    name="last_name"
                    onChange={handleUserChange}
                    className={getInputClasses(!!errors.last_name)}
                />
                {errors.last_name && (
                    <p className={errorText}>{errors.last_name}</p>
                )}
                <label htmlFor="phone" className={labelBase}>Phone: </label>
                <input
                    type="text"
                    value={userFormData.phone}
                    id="phone"
                    name="phone"
                    onChange={handleUserChange}
                    className={getInputClasses(!!errors.phone)}
                />
                {errors.phone && (
                    <p className={errorText}>{errors.phone}</p>
                )}
                <br />
                {userFormData.role === "TENANT"
                    ?
                    <>
                        <label htmlFor="complex_id" className={labelBase}>Property/Complex: <span className="text-destructive">*</span></label>
                        <select
                            value={userFormData.complex_id}
                            id="complex_id"
                            name="complex_id"
                            onChange={handleUserChange}
                            className={getInputClasses(!!errors.complex_id)}
                        >
                            <option value="">Select a property...</option>
                            {loadingComplexes ? (
                                <option disabled>Loading properties...</option>
                            ) : complexes.length === 0 ? (
                                <option disabled>No properties available</option>
                            ) : (
                                complexes.map(complex => (
                                    <option key={complex.id} value={complex.id}>
                                        {complex.name} - {complex.address}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.complex_id && (
                            <p className={errorText}>{errors.complex_id}</p>
                        )}
                        <label htmlFor="building_name" className={`${labelBase} mt-4`}>Building name: <span className="text-muted-foreground text-xs">(optional)</span></label>
                        <input
                            type="text"
                            value={userFormData.building_name}
                            id="building_name"
                            name="building_name"
                            onChange={handleUserChange}
                            placeholder="e.g., Building A, North Tower (optional)"
                            className={getInputClasses(!!errors.building_name)}
                        />
                        {errors.building_name && (
                            <p className={errorText}>{errors.building_name}</p>
                        )}
                        <label htmlFor="apartment_number" className={labelBase}>Apartment number: </label>
                        <input
                            type="text"
                            value={userFormData.apartment_number}
                            id="apartment_number"
                            name="apartment_number"
                            onChange={handleUserChange}
                            className={getInputClasses(!!errors.apartment_number)}
                        />
                        {errors.apartment_number && (
                            <p className={errorText}>{errors.apartment_number}</p>
                        )}
                    </>
                    :
                    <>
                    <h3 className={`${typography.h4} mb-8`}>Optional fields</h3>
                    <label htmlFor="building_name" className={labelBase}>Building name: <span className="text-muted-foreground text-xs">(optional)</span></label>
                        <input
                            type="text"
                            value={userFormData.building_name}
                            id="building_name"
                            name="building_name"
                            onChange={handleUserChange}
                            placeholder="e.g., Building A, North Tower (optional)"
                            className={getInputClasses(false)}
                        />
                        <label htmlFor="apartment_number" className={labelBase}>Apartment number: </label>
                        <input
                            type="text"
                            value={userFormData.apartment_number}
                            id="apartment_number"
                            name="apartment_number"
                            onChange={handleUserChange}
                            className={getInputClasses(false)}
                        />
                        <h3 className={`${typography.h4} mb-8`}>Please, enter information about your apartment complex</h3>
                        <label htmlFor="complex_name" className={labelBase}>Complex name: </label>
                        <input
                            type="text"
                            value={landlordComplexFormData.name}
                            id="name"
                            name="name"
                            onChange={handleComplexChange}
                            className={getInputClasses(!!errors.name)}
                        />
                        {errors.name && (
                            <p className={errorText}>{errors.name}</p>
                        )}
                        <label htmlFor="address" className={labelBase}>Complex address: </label>
                        <input
                            type="text"
                            value={landlordComplexFormData.address}
                            id="address"
                            name="address"
                            onChange={handleComplexChange}
                            className={getInputClasses(!!errors.address)}
                        />
                        {errors.address && (
                            <p className={errorText}>{errors.address}</p>
                        )}
                    </>
                }
            </form>
            <div className="flex gap-3 pt-4">
                <button
                    onClick={handleSubmit}
                    className={getButtonClasses('primary', 'md', 'flex-1')}
                >
                    Register
                </button>
                <button
                    onClick={() => { navigate("/login") }}
                    className={getButtonClasses('primary', 'md', 'flex-1')}
                >
                    Back to login
                </button>
            </div>
        </div>
    )
}
