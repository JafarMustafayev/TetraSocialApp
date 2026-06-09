// src/components/widgets/BirthdayWidget.jsx
import React from 'react';


const birthdays = [
    { id: 1, name: 'Elvin Mammadov', username: 'elvin_m', birthday: '18.05' },
    { id: 2, name: 'Leyla Guliyeva', username: 'leyla_g', birthday: '19.05' },
    { id: 3, name: 'Tural Hasanov', username: 'tural_h', birthday: '20.05' },
    { id: 4, name: 'Anar Aliyev', username: 'anar_a', birthday: '21.05' },
    { id: 5, name: 'Anar Aliyev', username: 'anar_a', birthday: '22.05' },
];

const BirthdayWidget = ({ count = 10 }) => {
    return (
        <div className="bg-white dark:bg-[#161a29] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 mb-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Birthdays</h3>
                <i className="ri-cake-2-line text-main text-xl"></i>
            </div>
            {birthdays.slice(0, count).map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-2 py-1 mb-1 bg-gray-100 dark:bg-blue-900/10 rounded-2xl">
                    <div className="flex-1 min-w-0 p-1.5">
                        <p className="text-[12px] font-bold text-gray-800 dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{user.birthday}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BirthdayWidget;
