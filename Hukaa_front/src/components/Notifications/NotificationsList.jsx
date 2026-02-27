import { useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_AVATAR } from '../../api/client';

const NotificationsList = () => {

    const [notifications, setNotifications] = useState([
        { name: 'James Vanwin', img: 'user-55.jpg', text: 'Posted A Comment On Your Status', time: '20 Minutes Ago' },
        { name: 'Dwight Schoolcraft', img: 'user-45.jpg', text: 'Sent You a Friend Request', time: '35 Minutes Ago' },
        { name: 'Susan Hadden', img: 'user-48.jpg', text: 'Add a Photo in Design Group', time: '50 Minutes Ago' },
        { name: 'Herta Smith', img: 'user-49.jpg', text: 'Posted in Graphic Design Learn', time: '1 Hour Ago' },
        { name: 'Francis L. Tay', img: 'user-50.jpg', text: 'Like Your Comment', time: '5 Hours Ago' },
        { name: 'Laura Hildebrandt', img: 'user-51.jpg', text: 'Comment On Your Status', time: '1 Day Ago' },
        { name: 'Martha Wilkes', img: 'user-52.jpg', text: 'Reacted To Your Comment "Happy Birthday"', time: '3 Days Ago' },
        { name: 'Howard Harris', img: 'user-53.jpg', text: 'Added a Photo in Graphic Design Group', time: '7 Days Ago' },
        { name: 'Martha Wilkes', img: 'user-54.jpg', text: 'Added a Photo in Graphic Design Group', time: '7 Days Ago' },
        { name: 'David Gibson', img: 'user-30.jpg', text: 'Commented on Your Newstatus', time: '1 Month Ago' }
    ]);

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[70%] lg:h-[750px] flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 shrink-0">
                <h3 className="text-lg font-bold text-gray-800 m-0">Notifications</h3>
                <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-red-500 hover:border-red-500 " type="button" onClick={clearAllNotifications}>
                    <i className="ri-delete-bin-line"></i>
                </button>
            </div>

            <div className="divide-y divide-gray-50 overflow-y-auto custom-scrollbar flex-1">
                {notifications.length > 0 ? (
                    notifications.map((notif, idx) => (
                        <div key={idx} className="p-4 flex items-center hover:bg-gray-50/50 transition-colors group">
                            <div className="shrink-0">
                                <Link to="/profile">
                                    <img src={USER_AVATAR} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="image" />
                                </Link>
                            </div>
                            <div className="ml-3 flex-1">
                                <h4 className="text-[14px] font-bold text-gray-800 hover:text-main transition-colors leading-tight">
                                    <Link to="/profile">{notif.name}</Link>
                                </h4>
                                <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-1">{notif.text}</p>
                                <span className="text-[10px] font-bold text-main uppercase mt-1 block">{notif.time}</span>
                            </div>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                <i className="ri-close-line text-xs font-bold"></i>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-40 p-10 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <i className="ri-notification-off-line text-3xl"></i>
                        </div>
                        <p className="text-sm font-medium italic">No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsList;
