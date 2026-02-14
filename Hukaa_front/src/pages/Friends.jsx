import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Friends = () => {
    const [activeTab, setActiveTab] = useState('friend-requests');

    return (
        <>
            <div className="page-banner-box bg-4">
                <h3>Friends</h3>
            </div>

            <div className="friends-inner-box-style d-flex justify-content-between align-items-center margin-top-25">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'friend-requests' ? 'active' : ''}`}
                            onClick={() => setActiveTab('friend-requests')}
                        >
                            Friend Requests
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'people-you-know' ? 'active' : ''}`}
                            onClick={() => setActiveTab('people-you-know')}
                        >
                            People You Know
                        </button>
                    </li>
                </ul>

                <div className="friends-search-box">
                    <form>
                        <input type="text" className="input-search" placeholder="Search friends..." />
                        <button type="submit"><i className="ri-search-line"></i></button>
                    </form>
                </div>
            </div>

            <div className="tab-content" id="myTabContent">
                <div className={`tab-pane fade ${activeTab === 'friend-requests' ? 'show active' : ''}`} id="friend-requests" role="tabpanel">
                    <div className="row justify-content-start">
                        <div className="col-lg-3 col-sm-6">
                            <div className="single-friends-card">
                                <div className="friends-image">
                                    <Link to="#">
                                        <img src="src/assets/images/friends/friends-bg-1.jpg" alt="image" />
                                    </Link>
                                    <div className="icon">
                                        <Link to="#"><i className="flaticon-user"></i></Link>
                                    </div>
                                </div>
                                <div className="friends-content">
                                    <div className="friends-info d-flex justify-content-between align-items-center">
                                        <Link to="#">
                                            <img src="src/assets/images/friends/friends-1.jpg" alt="image" />
                                        </Link>
                                        <div className="text ms-3">
                                            <h3><Link to="#">Jose Marroquin</Link></h3>
                                            <span>10 Mutual Friends</span>
                                        </div>
                                    </div>
                                    <ul className="statistics">
                                        <li>
                                            <Link to="#">
                                                <span className="item-number">862</span>
                                                <span className="item-text">Likes</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <span className="item-number">91</span>
                                                <span className="item-text">Following</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <span className="item-number">514</span>
                                                <span className="item-text">Followers</span>
                                            </Link>
                                        </li>
                                    </ul>
                                    <div className="button-group d-flex justify-content-between align-items-center">
                                        <div className="add-friend-btn">
                                            <button type="submit">Add Friend</button>
                                        </div>
                                        <div className="send-message-btn">
                                            <button type="submit">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="load-more-posts-btn">
                        <Link to="#"><i className="flaticon-loading"></i> Load More</Link>
                    </div>
                </div>

                <div className={`tab-pane fade ${activeTab === 'people-you-know' ? 'show active' : ''}`} id="people-you-know" role="tabpanel">
                    <div className="row justify-content-start">
                        <div className="col-lg-3 col-sm-6">
                            <div className="single-friends-card">
                                <div className="friends-image">
                                    <Link to="#">
                                        <img src="src/assets/images/friends/friends-bg-1.jpg" alt="image" />
                                    </Link>
                                    <div className="icon">
                                        <Link to="#"><i className="flaticon-user"></i></Link>
                                    </div>
                                </div>
                                <div className="friends-content">
                                    <div className="friends-info d-flex justify-content-between align-items-center">
                                        <Link to="#">
                                            <img src="src/assets/images/user/user-10.jpg" alt="image" />
                                        </Link>
                                        <div className="text ms-3">
                                            <h3><Link to="#">Jose Marroquin</Link></h3>
                                            <span>10 Mutual Friends</span>
                                        </div>
                                    </div>
                                    <ul className="statistics">
                                        <li>
                                            <Link to="#">
                                                <span className="item-number">862</span>
                                                <span className="item-text">Likes</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <span className="item-number">91</span>
                                                <span className="item-text">Following</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <span className="item-number">514</span>
                                                <span className="item-text">Followers</span>
                                            </Link>
                                        </li>
                                    </ul>
                                    <div className="button-group d-flex justify-content-between align-items-center">
                                        <div className="add-friend-btn">
                                            <button type="submit">Add Friend</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="load-more-posts-btn">
                        <Link to="#"><i className="flaticon-loading"></i> Load More</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Friends;
