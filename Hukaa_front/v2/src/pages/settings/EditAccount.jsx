import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditAccount = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => navigate('/settings')} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-main hover:text-white transition-all">
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Account</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Update your personal information</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#161a29] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-6">
                <div 
                    onClick={() => navigate('/settings/edit-account/pictures')}
                    className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#111420] transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-main">
                            <i className="ri-image-edit-line text-2xl"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-white text-base">Profile & Cover Pictures</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Change your profile photo and cover image</p>
                        </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-300 dark:text-gray-600 text-2xl"></i>
                </div>
            </div>

            <div className="bg-white dark:bg-[#161a29] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                            <input type="text" className="w-full bg-gray-50 dark:bg-[#0b0f1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-main focus:border-transparent outline-none transition-all text-gray-800 dark:text-white" placeholder="First Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                            <input type="text" className="w-full bg-gray-50 dark:bg-[#0b0f1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-main focus:border-transparent outline-none transition-all text-gray-800 dark:text-white" placeholder="Last Name" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                        <textarea className="w-full bg-gray-50 dark:bg-[#0b0f1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-main focus:border-transparent outline-none transition-all resize-y min-h-[120px] text-gray-800 dark:text-white" placeholder="Tell us about yourself..."></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="button" className="bg-main text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAccount;
