import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBirthdays } from '../../api/profile';
import { IMAGE_BASE_URL, USER_AVATAR } from '../../api/client';
import UserSkeleton from '../Skeleton/UserSkeleton';

const BirthdayWidget = () => {
    const [birthdays, setBirthdays] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBirthdays = async () => {
        setIsLoading(true);
        try {
            const response = await getBirthdays();
            if (response && response.success) {
                setBirthdays(response.data);
            }
        } catch (err) {
            console.error('Error fetching birthdays:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBirthdays();
    }, []);

    const handleInviteToChat = (user) => {
        const message = `Happy Birthday, ${user.userName}! 🎉 Wishing you a great day!`;
        navigate(`/messages?userId=${user.id}&message=${encodeURIComponent(message)}`);
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center mr-3">
                        <i className="ri-cake-2-line text-pink-500 text-lg"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 m-0">Birthdays {birthdays.length > 0 ? `(${birthdays.length})` : ''}</h3>
                </div>
                <button
                    onClick={fetchBirthdays}
                    disabled={isLoading}
                    className="group w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-main hover:border-main transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                    <i className={`group-hover:rotate-180 transition-transform duration-500 ri-refresh-line ${isLoading ? 'animate-spin' : ''}`}></i>
                </button>
            </div>
            <div className="space-y-5">
                {isLoading ? (
                    <UserSkeleton count={3} />
                ) : birthdays.length > 0 ? (
                    birthdays.map((user) => (
                        <div key={user.id} className="flex items-center group cursor-pointer" onClick={() => handleInviteToChat(user)}>
                            <div className="relative shrink-0">
                                <img
                                    src={user.profileImageUrl ? `${IMAGE_BASE_URL}/${user.profileImageUrl}` : USER_AVATAR}
                                    className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-50 group-hover:ring-pink-100 transition-all"
                                    alt={user.userName}
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <i className="ri-cake-fill text-[10px] text-white"></i>
                                </div>
                            </div>
                            <div className="ml-3 min-w-0">
                                <span className="block text-[15px] font-bold text-gray-700 group-hover:text-pink-600 transition-colors leading-tight truncate">{user.userName}</span>
                                <span className="text-[11px] font-semibold text-gray-400">Having a birthday today!</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center opacity-40 py-4 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                            <i className="ri-cake-2-line text-2xl text-gray-400"></i>
                        </div>
                        <p className="text-xs font-medium italic">No birthdays today</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BirthdayWidget;
