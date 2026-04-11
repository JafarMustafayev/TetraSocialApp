import { useNavigate, useEffect } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const EmailConfirmation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Email Confirmation";
    }, []);

    return (
        <div className="profile-authentication-area min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center items-center min-h-screen py-10 md:py-20">
                    <div className="w-full">
                        <div className="max-w-md mx-auto bg-transparent p-6 md:p-10">
                            <div className="text-center mb-[30px]">
                                <img
                                    src={logo}
                                    alt="Huka Logo"
                                    className="inline-block max-w-[200px] md:max-w-[240px] h-auto"
                                />
                            </div>

                            <div className="text-center">
                                <div className="px-4 py-3 rounded relative mb-4 bg-input-bg border border-input-border text-paragraph">
                                    Verifying your email...
                                </div>

                                <button
                                    type="button"
                                    className="mt-5 bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-main-hover transition duration-400 font-medium border-none cursor-pointer"
                                    onClick={() => navigate('/auth/login')}
                                >
                                    Go to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;
