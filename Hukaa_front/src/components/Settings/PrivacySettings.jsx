import React from 'react';

const PrivacySettings = () => {
    return (
        <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Who Can See Your Profile?</label>
                    <select className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer">
                        <option value="true">All</option>
                        <option value="false">My followers</option>
                        <option value="">No one</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Who Can Send You Follow Request?</label>
                    <select className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer">
                        <option value="true">All</option>
                        <option value="false">My followers</option>
                        <option value="">No one</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Who Can See Your Phone Number?</label>
                    <select className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer">
                        <option value="true">All</option>
                        <option value="false">My followers</option>
                        <option value="">No one</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Who Can See Your Birthday?</label>
                    <select className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer">
                        <option value="true">All</option>
                        <option value="false">My followers</option>
                        <option value="">No one</option>
                    </select>
                </div>
                <div className="md:col-span-2 pt-4 flex justify-end">
                    <button
                        type="submit"
                        className="px-10 py-3.5 bg-[#3644D9] text-white rounded-xl font-bold hover:bg-[#2E3AB8] hover:shadow-xl hover:shadow-blue-100 active:scale-[0.98] transition-all"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PrivacySettings;
