import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="sidemenu-area">
            <div className="responsive-burger-menu d-lg-none d-block">
                <span className="top-bar"></span>
                <span className="middle-bar"></span>
                <span className="bottom-bar"></span>
            </div>

            <div className="sidemenu-body">
                <ul className="sidemenu-nav metisMenu h-100" id="sidemenu-nav" data-simplebar="true">
                    <li className={`nav-item ${isActive('/')}`}>
                        <Link to="/" className="nav-link">
                            <span className="icon"><i className="flaticon-newspaper"></i></span>
                            <span className="menu-title">News Feed</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/notifications')}`}>
                        <Link to="/notifications" className="nav-link">
                            <span className="icon"><i className="flaticon-bell"></i></span>
                            <span className="menu-title">Notifications</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/messages')}`}>
                        <Link to="/messages" className="nav-link">
                            <span className="icon"><i className="flaticon-comment-1"></i></span>
                            <span className="menu-title">Messages</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/friends')}`}>
                        <Link to="/friends" className="nav-link">
                            <span className="icon"><i className="flaticon-friends"></i></span>
                            <span className="menu-title">Friends</span>
                        </Link>
                    </li>
                   
                    {/* Add other menu items as needed */}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
