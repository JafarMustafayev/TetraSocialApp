import { useEffect } from 'react';

const Home = () => {
    useEffect(() => {
        document.title = "Home | Hukaa";
    }, []);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="container mx-auto px-4 py-10 md:py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Welcome back, <span className="text-[#0072d2]">{user.userName || 'User'}</span>!
            </h1>
            <p className="text-paragraph text-lg md:text-xl max-w-2xl mx-auto">
                This is your personalized home dashboard. Only authenticated users can see this content.
            </p>
            
            <div className="mt-10">
                <button 
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        window.location.href = '/auth/login';
                    }}
                    className="bg-red-600 text-white px-8 py-3 rounded-[5px] hover:bg-red-700 transition duration-400 font-medium border-none cursor-pointer"
                >
                    LOGOUT
                </button>
            </div>
        </div>
    );
};

export default Home;
