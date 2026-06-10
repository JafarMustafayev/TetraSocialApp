import React from 'react';
import { upcomingBirthdays } from '../../utils/mockData';

const BirthdayWidget = () => {
    // Filter logic for upcoming 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = upcomingBirthdays.filter(user => {
        if (!user.birthday) return false;
        const bdate = new Date(user.birthday);
        let bdayThisYear = new Date(today.getFullYear(), bdate.getMonth(), bdate.getDate());
        
        if (bdayThisYear < today) {
            bdayThisYear.setFullYear(today.getFullYear() + 1);
        }
        
        const diffTime = bdayThisYear - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Attach diffDays to user for rendering
        user.diffDays = diffDays;
        
        return diffDays >= 0 && diffDays <= 7;
    }).sort((a, b) => a.diffDays - b.diffDays);

    const getDayLabel = (diffDays) => {
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `In ${diffDays} days`;
    };

    return (
        <div className="bg-white dark:bg-[#09090b] rounded-2xl border border-gray-100 dark:border-[#1f1f1f] p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white uppercase tracking-wide">Birthdays</h3>
                <i className="ri-cake-2-line text-main text-xl"></i>
            </div>
            
            {upcoming.length > 0 ? (
                <div className="space-y-2">
                    {upcoming.map((user) => (
                        <div key={user.id} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-[#16181c] rounded-xl transition-colors border border-gray-100 dark:border-[#1f1f1f]">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="min-w-0">
                                    <h4 className="text-[14px] font-bold text-gray-900 dark:text-white truncate">{user.name}</h4>
                                    <p className="text-[12px] text-gray-500 truncate">{getDayLabel(user.diffDays)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500 text-[13px]">
                    No birthdays in the next 7 days.
                </div>
            )}
        </div>
    );
};

export default BirthdayWidget;
