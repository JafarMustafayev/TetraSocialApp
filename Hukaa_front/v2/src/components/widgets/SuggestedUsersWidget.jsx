// src/components/widgets/SuggestedUsersWidget.jsx
import { USER_AVATAR } from '../../api/apiConfig';
import { suggestedUsers } from '../../utils/mockData';

const SuggestedUsersWidget = ({ count = 5 }) => {
    return (
        <div className="bg-white dark:bg-[#09090b] rounded-2xl border border-gray-100 dark:border-[#1f1f1f] p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white uppercase tracking-wide">Who to follow</h3>
                {suggestedUsers.length > count && (
                    <button className="text-[12px] font-bold text-main uppercase hover:underline">View All</button>
                )}
            </div>
            <div className="space-y-4">
                {suggestedUsers.slice(0, count).map((user) => (
                    <div key={user.id} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <img src={user.avatar || USER_AVATAR} className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-800" alt={user.name} />
                            <div className="min-w-0">
                                <h4 className="text-[14px] font-bold text-gray-900 dark:text-white truncate group-hover:underline">{user.name}</h4>
                                <p className="text-[13px] text-gray-500 truncate">@{user.username}</p>
                            </div>
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-700 text-main hover:bg-main hover:text-white hover:border-main transition-colors">
                            <i className="ri-user-add-line text-[15px]"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedUsersWidget;
