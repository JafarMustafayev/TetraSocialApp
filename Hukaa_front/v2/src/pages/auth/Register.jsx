import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { validateEmail, isAtLeast16 } from '../../utily/validation';
import { checkUsername, checkEmail } from '../../api/account.api';
import { register } from '../../api/auth.api';
import { toast } from 'react-hot-toast';

const Register = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: null,
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [availability, setAvailability] = useState({
        username: { isAvailable: true, message: '', checking: false },
        email: { isAvailable: true, message: '', checking: false }
    });

    useEffect(() => {
        document.title = "Register";
    }, []);

    useEffect(() => {
        if (currentStep !== 3 || !formData.username.trim()) return;

        setAvailability(prev => ({ ...prev, username: { ...prev.username, checking: true, isAvailable: true, message: '' } }));

        const timer = setTimeout(async () => {
            const result = await checkUsername(formData.username.trim());
            if (result.success || result.Success) {
                const isAvailable = result.data?.isAvailable ?? result.Data?.isAvailable ?? true;
                setAvailability(prev => ({
                    ...prev,
                    username: {
                        isAvailable: isAvailable,
                        message: isAvailable ? '' : 'This username is already taken.',
                        checking: false
                    }
                }));
            } else {
                setAvailability(prev => ({
                    ...prev,
                    username: { isAvailable: false, message: result.message || result.Message || 'Error checking username.', checking: false }
                }));
            }
        }, 750);

        return () => clearTimeout(timer);
    }, [formData.username, currentStep]);

    useEffect(() => {
        if (currentStep !== 4 || !formData.email.trim() || !validateEmail(formData.email)) return;

        setAvailability(prev => ({ ...prev, email: { ...prev.email, checking: true, isAvailable: true, message: '' } }));

        const timer = setTimeout(async () => {
            const result = await checkEmail(formData.email.trim());
            if (result.success || result.Success) {
                const isAvailable = result.data?.isAvailable ?? result.Data?.isAvailable ?? true;
                setAvailability(prev => ({
                    ...prev,
                    email: {
                        isAvailable: isAvailable,
                        message: isAvailable ? '' : 'This email is already registered.',
                        checking: false
                    }
                }));
            } else {
                setAvailability(prev => ({
                    ...prev,
                    email: { isAvailable: false, message: result.message || result.Message || 'Error checking email.', checking: false }
                }));
            }
        }, 750);

        return () => clearTimeout(timer);
    }, [formData.email, currentStep]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        const data = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            username: formData.username.trim(),
            email: formData.email.trim(),
        };

        if (currentStep === 1) {
            if (!data.firstName || !data.lastName) {
                toast.error('Please enter both first and last name.');
                return;
            }
        } else if (currentStep === 2) {
            if (!formData.birthDate) {
                toast.error('Please select your birth date.');
                return;
            }
            if (!isAtLeast16(formData.birthDate)) {
                toast.error('You must be at least 16 years old to register.');
                return;
            }
        } else if (currentStep === 3) {
            if (!data.username) {
                toast.error('Please enter a username.');
                return;
            }
            if (!availability.username.isAvailable) {
                toast.error(availability.username.message || 'This username is not available.');
                return;
            }
            if (availability.username.checking) {
                toast.error('Please wait while we check username availability.');
                return;
            }
        } else if (currentStep === 4) {
            if (!data.email) {
                toast.error('Please enter your email.');
                return;
            }
            if (!validateEmail(data.email)) {
                toast.error('Please enter a valid email address.');
                return;
            }
            if (!availability.email.isAvailable) {
                toast.error(availability.email.message || 'This email is already in use.');
                return;
            }
            if (availability.email.checking) {
                toast.error('Please wait while we check email availability.');
                return;
            }
        }

        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        const payload = {
            UserName: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            DateOfBirth: formData.birthDate ? formData.birthDate.toISOString() : null,
            FirstName: formData.firstName.trim(),
            LastName: formData.lastName.trim()
        };

        setIsLoading(true);
        try {
            const result = await register(payload);

            if (result.success || result.Success) {
                toast.success(result.message || result.Message || 'Successfully registered.');

            }
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <div className="mb-6 text-left">
                            <label className="block mb-2 text-paragraph font-medium text-[15px]">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                                value={formData.firstName.trim()}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-6 text-left">
                            <label className="block mb-2 text-paragraph font-medium text-[15px]">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                                value={formData.lastName.trim()}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                );
            case 2:
                return (
                    <div className="mb-6 text-left relative">
                        <label className="block mb-2 text-paragraph font-medium text-[15px]">Birth Date</label>
                        <DatePicker
                            selected={formData.birthDate}
                            onChange={(date) => {
                                setFormData(prev => ({ ...prev, birthDate: date }));
                            }}
                            dateFormat="dd/MM/yyyy"
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                            autoComplete='on'
                            placeholderText="DD/MM/YYYY"
                            className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                            wrapperClassName="w-full"
                            required
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="mb-6 text-left">
                        <label className="block mb-2 text-paragraph font-medium text-[15px]">Username</label>
                        <input
                            type="text"
                            name="username"
                            className={`h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border ${!availability.username.isAvailable ? 'border-red-500' : 'border-input-border'} bg-input-bg focus:border-main focus:outline-none transition duration-400`}
                            value={formData.username.trim()}
                            onChange={handleChange}
                            required
                        />
                        {!availability.username.isAvailable && (
                            <span className="text-red-500 text-xs mt-1 block font-light">
                                {availability.username.message}
                            </span>
                        )}
                    </div>
                );
            case 4:
                return (
                    <div className="mb-6 text-left">
                        <label className="block mb-2 text-paragraph font-medium text-[15px]">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className={`h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border ${!availability.email.isAvailable ? 'border-red-500' : 'border-input-border'} bg-input-bg focus:border-main focus:outline-none transition duration-400`}
                            value={formData.email.trim()}
                            onChange={handleChange}
                            required
                        />
                        {!availability.email.isAvailable && (
                            <span className="text-red-500 text-xs mt-1 block font-light">
                                {availability.email.message}
                            </span>
                        )}
                    </div>
                );
            case 5:
                return (
                    <>
                        <div className="mb-6 text-left">
                            <label className="block mb-2 text-paragraph font-medium text-[15px]">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                                value={formData.password.trim()}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-6 text-left">
                            <label className="block mb-2 text-paragraph font-medium text-[15px]">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                                value={formData.confirmPassword.trim()}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="profile-authentication-area min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center items-center py-10 md:py-20 min-h-screen">
                    <div className="w-full">
                        <div className="max-w-md mx-auto bg-transparent p-6 md:p-10">
                            <div className="text-center mb-[30px]">
                                <img
                                    src={logo}
                                    alt="Huka Logo"
                                    className="inline-block max-w-[200px] md:max-w-[240px] h-auto"
                                />
                            </div>

                            <form onSubmit={handleSubmit} className="w-full">

                                {renderStep()}

                                <div className="flex gap-4 mt-8">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="bg-gray-600 text-white p-[15px] w-full rounded-[5px] hover:bg-gray-700 transition duration-400 font-medium border-none cursor-pointer"
                                        >
                                            BACK
                                        </button>
                                    )}

                                    {currentStep < 5 ? (
                                        <button
                                            type="button"
                                            disabled={
                                                (currentStep === 3 && (!availability.username.isAvailable || availability.username.checking))
                                                || (currentStep === 4 && (!availability.email.isAvailable || availability.email.checking))

                                            }
                                            onClick={nextStep}
                                            className="bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-main-hover transition duration-400 font-medium border-none cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
                                        >
                                            NEXT
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-main-hover transition duration-400 font-medium border-none cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'REGISTERING...' : 'REGISTER'}
                                        </button>
                                    )}
                                </div>

                                <div className="my-[15px] text-center">
                                    <span className="text-paragraph text-[15px]">Already have an account?</span>
                                </div>

                                <button type="button" className="bg-[#0090d2] text-white w-full rounded-[5px] hover:bg-main-hover transition duration-400 border-none cursor-pointer p-0">
                                    <Link to="/auth/login" className="block w-full h-full p-[15px] text-white hover:text-white"> LOGIN </Link>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
