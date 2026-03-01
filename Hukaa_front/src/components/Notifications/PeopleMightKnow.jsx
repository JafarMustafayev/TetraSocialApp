import React from 'react';
import { Link } from 'react-router-dom';
import { USER_AVATAR } from '../../api/client';

const PeopleMightKnow = () => {
    const suggestions = [
        { id: 1, name: 'Theresa Webb', profession: 'Graphic Designer', img: 'user-5.jpg' },
        { id: 2, name: 'Kathryn Murphy', profession: 'Product Designer', img: 'user-6.jpg' },
        { id: 3, name: 'Jerome Bell', profession: 'Software Engineer', img: 'user-7.jpg' },
        { id: 4, name: 'Eleanor Pena', profession: 'Web Developer', img: 'user-8.jpg' },
        { id: 5, name: 'Albert Flores', profession: 'UX Researcher', img: 'user-9.jpg' },
        { id: 6, name: 'Courtney Henry', profession: '5 Mutual Friends', img: 'user-3.jpg' },
        { id: 7, name: 'Arlene McCoy', profession: '3 Mutual Friends', img: 'user-4.jpg' },
        { id: 8, name: 'Courtney Henry', profession: '5 Mutual Friends', img: 'user-3.jpg' },
        { id: 9, name: 'Arlene McCoy', profession: '3 Mutual Friends', img: 'user-4.jpg' },
        { id: 10, name: 'Courtney Henry', profession: '5 Mutual Friends', img: 'user-3.jpg' },
        { id: 11, name: 'Arlene McCoy', profession: '3 Mutual Friends', img: 'user-4.jpg' },
        { id: 12, name: 'Courtney Henry', profession: '5 Mutual Friends', img: 'user-3.jpg' },
        { id: 13, name: 'Arlene McCoy', profession: '3 Mutual Friends', img: 'user-4.jpg' },
    ];

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:h-[805px] flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 shrink-0">
                <h3 className="text-lg font-bold text-gray-800 m-0">Suggestions</h3>
                <button className="text-main hover:rotate-180 transition-transform duration-500">
                    <i className="ri-refresh-line"></i>
                </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1">
                {suggestions.map((person) => (
                    <div key={person.id} className="p-4 flex items-center hover:bg-gray-50/50 transition-colors group">
                        <div className="shrink-0">
                            <Link to={`/profile/${person.id}`}>
                                <img src={USER_AVATAR} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="image" />
                            </Link>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                            <h4 className="text-[14px] font-bold text-gray-800 hover:text-main transition-colors truncate">
                                <Link to={`/profile/${person.id}`}>{person.name}</Link>
                            </h4>
                            <p className="text-[12px] text-gray-400 truncate">{person.profession}</p>
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 text-main hover:bg-main hover:text-white transition-all">
                            <i className="ri-user-add-line"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PeopleMightKnow;
