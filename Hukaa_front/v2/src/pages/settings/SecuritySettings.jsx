import React from 'react';
import { useNavigate } from 'react-router-dom';

const SecuritySettings = () => {
    const navigate = useNavigate();

    const items = [
        { id: 'passkeys', title: 'Passkeys', description: 'Use your fingerprint, face, or screen lock to sign in.' },
        { id: '2sv', title: 'Two-step verification', description: 'Add an extra layer of security to your account.' },
        { id: 'email', title: 'Email address', description: 'Manage the email address associated with your account.' },
        { id: 'password', title: 'Change password', description: 'Update your password regularly to keep your account secure.' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => navigate('/settings')} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-main hover:text-white transition-all">
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Security Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account security</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#161a29] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                {items.map((item, index) => (
                    <div key={item.id} className={`p-6 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-[#111420] transition-all cursor-pointer ${index !== items.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-white text-base">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-300 dark:text-gray-600 text-2xl"></i>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SecuritySettings;
