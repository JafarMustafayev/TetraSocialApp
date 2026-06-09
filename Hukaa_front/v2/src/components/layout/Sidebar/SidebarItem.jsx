// src/components/layout/Sidebar/SidebarItem.jsx
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ item }) => {
    const location = useLocation();
    const isActive = location.pathname === item.path;

    return (
        <li>
            <Link
                to={item.path}
                className={`relative flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300 group
                ${isActive
                        ? 'bg-[#2E40B7] text-white'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-[#2E40B7]'}`}
            >
                <i className={`${item.icon} text-2xl mb-2 transition-transform duration-300 group-hover:scale-110`}></i>
                <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>

                {item.count > 0 && (
                    <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {item.count > 9 ? '9+' : item.count}
                    </span>
                )}
            </Link>
        </li>
    );
};

export default SidebarItem;
