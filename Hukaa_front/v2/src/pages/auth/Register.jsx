import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { validateEmail, isAtLeast16 } from '../../utily/validation';

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
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = "Register";
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
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
                setError('Please enter both first and last name.');
                return;
            }
        } else if (currentStep === 2) {
            if (!formData.birthDate) {
                setError('Please select your birth date.');
                return;
            }
            if (!isAtLeast16(formData.birthDate)) {
                setError('You must be at least 16 years old to register.');
                return;
            }
        } else if (currentStep === 3) {
            if (!data.username) {
                setError('Please enter a username.');
                return;
            }
        } else if (currentStep === 4) {
            if (!data.email) {
                setError('Please enter your email.');
                return;
            }
            if (!validateEmail(data.email)) {
                setError('Please enter a valid email address.');
                return;
            }
        }

        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        // Functional logic for API omitted as requested
        console.log('Final Form Data:', {
            ...formData,
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email
        });
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
                                if (error) setError('');
                            }}
                            dateFormat="dd/MM/yyyy"
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
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
                            className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                            value={formData.username.trim()}
                            onChange={handleChange}
                            required
                        />
                    </div>
                );
            case 4:
                return (
                    <div className="mb-6 text-left">
                        <label className="block mb-2 text-paragraph font-medium text-[15px]">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                            value={formData.email.trim()}
                            onChange={handleChange}
                            required
                        />
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
                                className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-[#F4F7FC] bg-[#1f3244] focus:border-main focus:outline-none transition duration-400"
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
                                {error && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                                        {error}
                                    </div>
                                )}

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
                                            onClick={nextStep}
                                            className="bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-main-hover transition duration-400 font-medium border-none cursor-pointer"
                                        >
                                            NEXT
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-main-hover transition duration-400 font-medium border-none cursor-pointer"
                                        >
                                            REGISTER
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
