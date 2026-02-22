import React from 'react';
import { Link } from 'react-router-dom';
import { USER_AVATAR } from '../../api/client';

const FollowerRequests = () => {
    const requests = [
        { id: 1, name: 'Marvin McKinney', mutual: '8 Mutual Friends', img: 'user-1.jpg' },
        { id: 2, name: 'Bessie Cooper', mutual: '12 Mutual Friends', img: 'user-2.jpg' },
        { id: 3, name: 'Courtney Henry', mutual: '5 Mutual Friends', img: 'user-3.jpg' },
        { id: 4, name: 'Arlene McCoy', mutual: '3 Mutual Friends', img: 'user-4.jpg' },
        { id: 5, name: 'Courtney Henry', mutual: '5 Mutual Friends', img: 'user-3.jpg' },
        { id: 6, name: 'Arlene McCoy', mutual: '3 Mutual Friends', img: 'user-4.jpg' },
        { id: 7, name: 'Courtney Henry', mutual: '5 Mutual Friends', img: 'user-3.jpg' },
        { id: 8, name: 'Arlene McCoy', mutual: '3 Mutual Friends', img: 'user-4.jpg' },
        { id: 9, name: 'Courtney Henry', mutual: '5 Mutual Friends', img: 'user-3.jpg' },
        { id: 10, name: 'Arlene McCoy', mutual: '3 Mutual Friends', img: 'user-4.jpg' },
        { id: 11, name: 'Courtney Henry', mutual: '5 Mutual Friends', img: 'user-3.jpg' },
        { id: 12, name: 'Arlene McCoy', mutual: '3 Mutual Friends', img: 'user-4.jpg' },
    ];

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[800px] flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 shrink-0">
                <h3 className="text-lg font-bold text-gray-800 m-0">Follower Requests</h3>
            </div>

            <div className="divide-y divide-gray-50 overflow-y-auto custom-scrollbar h-[735px]">
                {requests.map((req) => (
                    <div key={req.id} className="p-4 flex flex-col hover:bg-gray-50/50 transition-colors group">
                        <div className="flex items-center mb-3">
                            <div className="shrink-0">
                                <Link to={`/profile/${req.id}`}>
                                    <img src={USER_AVATAR} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="image" />
                                </Link>
                            </div>
                            <div className="ml-3 flex-1">
                                <h4 className="text-[14px] font-bold text-gray-800 hover:text-main transition-colors leading-tight">
                                    <Link to={`/profile/${req.id}`}>{req.name}</Link>
                                </h4>
                                <p className="text-[12px] text-gray-500 mt-0.5">{req.mutual}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 px-3 bg-main text-white text-[12px] font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-100">
                                Confirm
                            </button>
                            <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-600 text-[12px] font-bold rounded-xl hover:bg-gray-200 transition-all">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FollowerRequests;
