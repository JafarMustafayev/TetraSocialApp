import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_AVATAR, COVER_IMAGE } from '../api/client';

const Friends = () => {
    const [activeTab, setActiveTab] = useState('friend-requests');

    return (
        <div className="animate-fade-in-up">
            <div className="bg-[#3644D9] p-10 rounded-3xl mb-6 flex items-center justify-center text-white shadow-xl shadow-blue-100">
                <h3 className="text-3xl font-bold m-0 uppercase tracking-tight">Friends</h3>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <ul className="flex border-b border-gray-200 w-full md:w-auto">
                    <li className="mr-6">
                        <button
                            className={`py-4 font-bold text-[15px] border-b-2 transition-all ${activeTab === 'friend-requests' ? 'border-[#3644D9] text-[#3644D9]' : 'border-transparent text-gray-500 hover:text-[#3644D9]'}`}
                            onClick={() => setActiveTab('friend-requests')}
                        >
                            Friend Requests
                        </button>
                    </li>
                    <li>
                        <button
                            className={`py-4 font-bold text-[15px] border-b-2 transition-all ${activeTab === 'people-you-know' ? 'border-[#3644D9] text-[#3644D9]' : 'border-transparent text-gray-500 hover:text-[#3644D9]'}`}
                            onClick={() => setActiveTab('people-you-know')}
                        >
                            People You Know
                        </button>
                    </li>
                </ul>

                <div className="relative w-full md:w-64">
                    <form className="relative">
                        <input type="text" className="w-full h-12 bg-white border border-gray-200 rounded-full pl-5 pr-12 text-sm focus:border-[#3644D9] outline-none transition-all" placeholder="Search friends..." />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3644D9]"><i className="ri-search-line text-lg"></i></button>
                    </form>
                </div>
            </div>

            <div className="tab-content">
                <div className={`${activeTab === 'friend-requests' ? 'block' : 'hidden'} animate-fade-in`}>
                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full sm:w-1/2 lg:w-1/4 px-3 mb-6">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-100/50 transition-all">
                                <div className="relative h-32 overflow-hidden">
                                    <Link to="#">
                                        <img src={COVER_IMAGE} alt="image" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    </Link>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center mb-6">
                                        <Link to="#" className="shrink-0 -mt-12 relative z-10">
                                            <img src={USER_AVATAR} alt="image" className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover" />
                                        </Link>
                                        <div className="ml-3 pt-2">
                                            <h3 className="text-[17px] font-bold text-gray-800 hover:text-[#3644D9] transition-colors leading-tight"><Link to="#">Jose Marroquin</Link></h3>
                                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">10 Mutual Friends</span>
                                        </div>
                                    </div>
                                    <ul className="flex justify-between border-y border-gray-50 py-4 mb-6">
                                        <li className="text-center">
                                            <Link to="#" className="block">
                                                <span className="block text-base font-bold text-gray-800 leading-none">862</span>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase mt-1 block">Likes</span>
                                            </Link>
                                        </li>
                                        <li className="text-center">
                                            <Link to="#" className="block">
                                                <span className="block text-base font-bold text-gray-800 leading-none">91</span>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase mt-1 block">Following</span>
                                            </Link>
                                        </li>
                                        <li className="text-center">
                                            <Link to="#" className="block">
                                                <span className="block text-base font-bold text-gray-800 leading-none">514</span>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase mt-1 block">Followers</span>
                                            </Link>
                                        </li>
                                    </ul>
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-2.5 bg-[#3644D9] text-white text-[13px] font-bold rounded-xl hover:bg-[#2E3AB8] transition-all shadow-lg shadow-blue-100">Add Friend</button>
                                        <button className="flex-1 py-2.5 bg-gray-50 text-gray-600 text-[13px] font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center py-6">
                        <Link to="#" className="inline-flex items-center text-[#3644D9] font-bold hover:underline font-heading tracking-wide uppercase text-xs"><i className="ri-loader-4-line mr-2 animate-spin"></i> Load More</Link>
                    </div>
                </div>

                <div className={`${activeTab === 'people-you-know' ? 'block' : 'hidden'} animate-fade-in`}>
                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full sm:w-1/2 lg:w-1/4 px-3 mb-6">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-100/50 transition-all">
                                <div className="relative h-32 overflow-hidden">
                                    <Link to="#">
                                        <img src={COVER_IMAGE} alt="image" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    </Link>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center mb-6">
                                        <Link to="#" className="shrink-0 -mt-12 relative z-10">
                                            <img src={USER_AVATAR} alt="image" className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover" />
                                        </Link>
                                        <div className="ml-3 pt-2">
                                            <h3 className="text-[17px] font-bold text-gray-800 hover:text-[#3644D9] transition-colors leading-tight"><Link to="#">Jose Marroquin</Link></h3>
                                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">10 Mutual Friends</span>
                                        </div>
                                    </div>
                                    <ul className="flex justify-between border-y border-gray-50 py-4 mb-6">
                                        <li className="text-center">
                                            <Link to="#" className="block">
                                                <span className="block text-base font-bold text-gray-800 leading-none">862</span>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase mt-1 block">Likes</span>
                                            </Link>
                                        </li>
                                        <li className="text-center">
                                            <Link to="#" className="block">
                                                <span className="block text-base font-bold text-gray-800 leading-none">91</span>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase mt-1 block">Following</span>
                                            </Link>
                                        </li>
                                        <li className="text-center">
                                            <Link to="#" className="block">
                                                <span className="block text-base font-bold text-gray-800 leading-none">514</span>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase mt-1 block">Followers</span>
                                            </Link>
                                        </li>
                                    </ul>
                                    <button className="w-full py-2.5 bg-[#3644D9] text-white text-[13px] font-bold rounded-xl hover:bg-[#2E3AB8] transition-all shadow-lg shadow-blue-100">Add Friend</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center py-6">
                        <Link to="#" className="inline-flex items-center text-[#3644D9] font-bold hover:underline font-heading tracking-wide uppercase text-xs"><i className="ri-loader-4-line mr-2 animate-spin"></i> Load More</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Friends;
