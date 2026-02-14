import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="navbar-area">
            <div className="main-responsive-nav">
                <div className="main-responsive-menu">
                    <div className="responsive-burger-menu d-lg-none d-block">
                        <span className="top-bar"></span>
                        <span className="middle-bar"></span>
                        <span className="bottom-bar"></span>
                    </div>
                </div>
            </div>

            <div className="main-navbar">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <Link to="/" className="navbar-brand d-flex align-items-center">
                        <img src="/src/assets/images/logo.png" alt="image" />
                    </Link>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <div className="search-box m-auto">
                            <form>
                                <input
                                    type="text"
                                    className="input-search"
                                    placeholder="Search..."
                                />
                                <button type="submit"><i className="ri-search-line"></i></button>
                            </form>
                        </div>

                        <div className="others-options d-flex align-items-center">
                            {/* Friend Requests */}
                            <div className="option-item">
                                <div className="dropdown friend-requests-nav-item">
                                    <a href="#" className="dropdown-bs-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <div className="friend-requests-btn">
                                            <i className="flaticon-user"></i>
                                            <span>3</span>
                                        </div>
                                    </a>
                                    <div className="dropdown-menu">
                                        <div className="friend-requests-header d-flex justify-content-between align-items-center">
                                            <h3>Friend Requests</h3>
                                            <i className="flaticon-menu"></i>
                                        </div>
                                        <div className="friend-requests-body" data-simplebar="true">
                                            {/* Static items for now */}
                                            <div className="item d-flex align-items-center">
                                                <div className="figure">
                                                    <a href="#"><img src="/src/assets/images/user/user-2.jpg" className="rounded-circle" alt="image" /></a>
                                                </div>
                                                <div className="content d-flex justify-content-between align-items-center">
                                                    <div className="text">
                                                        <h4><a href="#">Sandra Cross</a></h4>
                                                        <span>26 Friends</span>
                                                    </div>
                                                    <div className="btn-box d-flex align-items-center">
                                                        <button className="delete-btn d-inline-block me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" type="button"><i className="ri-close-line"></i></button>
                                                        <button className="confirm-btn d-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" title="Confirm" type="button"><i className="ri-check-line"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="view-all-requests-btn">
                                                <Link to="/friends" className="default-btn">View All Requests</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="option-item">
                                <div className="dropdown messages-nav-item">
                                    <a href="#" className="dropdown-bs-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <div className="messages-btn">
                                            <i className="flaticon-email"></i>
                                            <span>2</span>
                                        </div>
                                    </a>
                                    <div className="dropdown-menu">
                                        <div className="messages-header d-flex justify-content-between align-items-center">
                                            <h3>Messages</h3>
                                            <i className="flaticon-menu"></i>
                                        </div>
                                        <div className="messages-body" data-simplebar="true">
                                            {/* Static item */}
                                            <div className="item d-flex justify-content-between align-items-center">
                                                <div className="figure">
                                                    <a href="#"><img src="/src/assets/images/user/user-11.jpg" className="rounded-circle" alt="image" /></a>
                                                </div>
                                                <div className="text">
                                                    <h4><a href="#">James Vanwin</a></h4>
                                                    <span>Hello Dear I Want Talk To You</span>
                                                </div>
                                            </div>
                                            <div className="view-all-messages-btn">
                                                <Link to="/messages" className="default-btn">View All Messages</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="option-item">
                                <div className="dropdown notifications-nav-item">
                                    <a href="#" className="dropdown-bs-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <div className="notifications-btn">
                                            <i className="flaticon-bell"></i>
                                            <span>1</span>
                                        </div>
                                    </a>
                                    <div className="dropdown-menu">
                                        <div className="notifications-header d-flex justify-content-between align-items-center">
                                            <h3>Notifications</h3>
                                            <i className="flaticon-menu"></i>
                                        </div>
                                        <div className="notifications-body">
                                            {/* Static item */}
                                            <div className="item d-flex justify-content-between align-items-center">
                                                <div className="figure">
                                                    <a href="#"><img src="/src/assets/images/user/user-11.jpg" className="rounded-circle" alt="image" /></a>
                                                </div>
                                                <div className="text">
                                                    <h4><a href="#">James Vanwin</a></h4>
                                                    <span>Posted A Comment On Your Status</span>
                                                    <span className="main-color">20 Minites Ago</span>
                                                </div>
                                            </div>
                                            <div className="view-all-notifications-btn">
                                                <Link to="/notifications" className="default-btn">View All Notifications</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Language */}
                            <div className="option-item">
                                <div className="dropdown language-option">
                                    <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="flaticon-global"></i>
                                        <span className="lang-name"></span>
                                    </button>
                                    <div className="dropdown-menu language-dropdown-menu">
                                        <a className="dropdown-item" href="#">
                                            <img src="/src/assets/images/uk.png" alt="flag" />
                                            Eng
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            <img src="/src/assets/images/china.png" alt="flag" />
                                            简体中文
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            <img src="/src/assets/images/uae.png" alt="flag" />
                                            العربيّة
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Profile */}
                            <div className="option-item">
                                <div className="dropdown profile-nav-item">
                                    <a href="#" className="dropdown-bs-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <div className="menu-profile">
                                            <img src="/src/assets/images/user/user-1.jpg" className="rounded-circle" alt="image" />
                                            <span className="name">Matthew</span>
                                            <span className="status-online"></span>
                                        </div>
                                    </a>
                                    <div className="dropdown-menu">
                                        <div className="profile-header">
                                            <h3>Matthew Turner</h3>
                                            <a href="mailto:matthew507@gmail.com">matthew507@gmail.com</a>
                                        </div>
                                        <ul className="profile-body">
                                            <li><i className="flaticon-user"></i> <Link to="/profile">My Profile</Link></li>
                                            <li><i className="flaticon-settings"></i> <Link to="/settings">Setting</Link></li>
                                            <li><i className="flaticon-privacy"></i> <Link to="/settings">Privacy</Link></li>
                                            <li><i className="flaticon-information"></i> <Link to="/help">Help & Support</Link></li>
                                            <li><i className="flaticon-logout"></i> <Link to="/logout">Logout</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            <div className="others-option-for-responsive">
                <div className="container">
                    <div className="dot-menu">
                        <div className="inner">
                            <div className="circle circle-one"></div>
                            <div className="circle circle-two"></div>
                            <div className="circle circle-three"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
