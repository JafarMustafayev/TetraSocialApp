import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('timeline');

    return (
        <div className="content-page-box-area">
            <div className="my-profile-inner-box">
                <div className="profile-cover-image">
                    <Link to="#">
                        <img src="src/assets/images/my-profile-bg.jpg" alt="image" />
                    </Link>
                    <Link to="#" className="edit-cover-btn">Edit Cover</Link>
                </div>

                <div className="profile-info-box">
                    <div className="inner-info-box d-flex justify-content-between align-items-center">
                        <div className="info-image">
                            <Link to="#">
                                <img src="src/assets/images/my-profile.jpg" alt="image" />
                            </Link>
                            <div className="icon">
                                <Link to="#"><i className="flaticon-photo-camera"></i></Link>
                            </div>
                        </div>
                        <div className="info-text ms-3">
                            <h3><Link to="#">Matthew Turner</Link></h3>
                            <span><a href="mailto:matthew@gmail.com">matthew@gmail.com</a></span>
                        </div>
                        <ul className="statistics">
                            <li>
                                <Link to="#">
                                    <span className="item-number">59862</span>
                                    <span className="item-text">Likes</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="#">
                                    <span className="item-number">8591</span>
                                    <span className="item-text">Following</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="#">
                                    <span className="item-number">784514</span>
                                    <span className="item-text">Followers</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="profile-list-tabs">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'timeline' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('timeline')}
                                >
                                    Timeline
                                </button>
                            </li>

                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('about')}
                                >
                                    About
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="tab-content" id="myTabContent">
                <div className={`tab-pane fade ${activeTab === 'timeline' ? 'show active' : ''}`} id="timeline" role="tabpanel">
                    <div className="row">
                        <div className="col-lg-9 col-md-12">
                            <div className="news-feed-area">
                                <div className="news-feed news-feed-form">
                                    <h3 className="news-feed-title">Create New Post</h3>

                                    <form>
                                        <div className="form-group">
                                            <textarea name="message" className="form-control" placeholder="Write something here..."></textarea>
                                        </div>
                                        <ul className="button-group d-flex justify-content-between align-items-center">
                                            <li className="photo-btn">
                                                <button type="submit"><i className="flaticon-gallery"></i> Photo</button>
                                            </li>
                                            <li className="video-btn">
                                                <button type="submit"><i className="flaticon-video"></i> Video</button>
                                            </li>
                                            <li className="tag-btn">
                                                <button type="submit"><i className="flaticon-tag"></i> Tag Friends</button>
                                            </li>
                                            <li className="post-btn">
                                                <button type="submit">Post</button>
                                            </li>
                                        </ul>
                                    </form>
                                </div>

                                <div className="news-feed news-feed-post">
                                    <div className="post-header d-flex justify-content-between align-items-center">
                                        <div className="image">
                                            <Link to="/profile"><img src="src/assets/images/user/user-32.jpg" className="rounded-circle" alt="image" /></Link>
                                        </div>
                                        <div className="info ms-3">
                                            <span className="name"><Link to="/profile">Julie R. Morleyv</Link></span>
                                            <span className="small-text"><Link to="#">10 Mins Ago</Link></span>
                                        </div>
                                        <div className="dropdown">
                                            <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="flaticon-menu"></i></button>
                                            <ul className="dropdown-menu">
                                                <li><Link className="dropdown-item d-flex align-items-center" to="#"><i className="flaticon-edit"></i> Edit Post</Link></li>
                                                <li><Link className="dropdown-item d-flex align-items-center" to="#"><i className="flaticon-private"></i> Hide Post</Link></li>
                                                <li><Link className="dropdown-item d-flex align-items-center" to="#"><i className="flaticon-trash"></i> Delete Post</Link></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="post-body">
                                        <p>Donec rutrum congue leo eget malesuada. Nulla quis lorem ut libero malesuada feugiat. Donec rutrum congue leo eget malesuada. Donec rutrum congue leo eget malesuada. Praesent sapien massa convallis a pellentesque nec egestas non nisi. Curabitur non nulla sit amet nisl tempus convallis quis.</p>
                                        <div className="post-image">
                                            <img src="src/assets/images/news-feed-post/post-1.jpg" alt="image" />
                                        </div>
                                        <ul className="post-meta-wrap d-flex justify-content-between align-items-center">
                                            <li className="post-react">
                                                <Link to="#"><i className="flaticon-like"></i><span>Like</span> <span className="number">1499 </span></Link>

                                                <ul className="react-list">
                                                    <li><Link to="#"><img src="src/assets/images/react/react-1.png" alt="Like" /></Link></li>
                                                    <li><Link to="#"><img src="src/assets/images/react/react-2.png" alt="Like" /></Link></li>
                                                    <li><Link to="#"><img src="src/assets/images/react/react-3.png" alt="Like" /></Link></li>
                                                    <li><Link to="#"><img src="src/assets/images/react/react-4.png" alt="Like" /></Link></li>
                                                </ul>
                                            </li>
                                            <li className="post-comment">
                                                <Link to="#"><i className="flaticon-comment"></i><span>Comment</span> <span className="number">599 </span></Link>
                                            </li>
                                            <li className="post-share">
                                                <Link to="#"><i className="flaticon-share"></i><span>Share</span> <span className="number">24 </span></Link>
                                            </li>
                                        </ul>
                                        <div className="post-comment-list">
                                            <div className="comment-list">
                                                <div className="comment-image">
                                                    <Link to="/profile"><img src="src/assets/images/user/user-14.jpg" className="rounded-circle" alt="image" /></Link>
                                                </div>
                                                <div className="comment-info">
                                                    <h3><Link to="/profile">David Moore</Link></h3>
                                                    <span>5 Mins Ago</span>
                                                    <p>Donec rutrum congue leo eget malesuada nulla quis lorem ut libero malesuada feugiat.</p>
                                                    <ul className="comment-react">
                                                        <li><Link to="#" className="like">Like(2)</Link></li>
                                                        <li><Link to="#">Reply</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <form className="post-footer">
                                            <div className="footer-image">
                                                <Link to="#"><img src="src/assets/images/user/user-1.jpg" className="rounded-circle" alt="image" /></Link>
                                            </div>
                                            <div className="form-group">
                                                <textarea name="message" className="form-control" placeholder="Write a comment..."></textarea>
                                                <label><Link to="#"><i className="flaticon-photo-camera"></i></Link></label>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="load-more-posts-btn">
                                    <Link to="#"><i className="flaticon-loading"></i> Load More Posts</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-12">
                            <aside className="widget-area">
                                <div className="widget widget-birthday">
                                    <div className="birthday-title d-flex justify-content-between align-items-center">
                                        <h3>Today Birthdays</h3>
                                        <span><Link to="#">See All</Link></span>
                                    </div>
                                    <article className="item">
                                        <Link to="#" className="thumb">
                                            <span className="fullimage bg1" role="img"></span>
                                        </Link>
                                        <div className="info">
                                            <h4 className="title"><Link to="#">Earline Benally</Link></h4>
                                            <span>Today</span>
                                        </div>
                                    </article>
                                    <article className="item">
                                        <Link to="#" className="thumb">
                                            <span className="fullimage bg2" role="img"></span>
                                        </Link>
                                        <div className="info">
                                            <h4 className="title"><Link to="#">Jack Gulley</Link></h4>
                                            <span>Today</span>
                                        </div>
                                    </article>

                                    <div className="birthday-title d-flex justify-content-between align-items-center">
                                        <h3>Recent Birthdays</h3>
                                        <span><Link to="#">See All</Link></span>
                                    </div>
                                    <article className="item">
                                        <Link to="#" className="thumb">
                                            <span className="fullimage bg3" role="img"></span>
                                        </Link>
                                        <div className="info">
                                            <h4 className="title"><Link to="#">Lolita Benally</Link></h4>
                                            <span>May 18</span>
                                        </div>
                                    </article>
                                </div>
                                <div className="widget widget-who-following">
                                    <h3 className="widget-title">Who's Following</h3>
                                    <div className="following-item d-flex justify-content-between align-items-center">
                                        <Link to="#"><img src="src/assets/images/user/user-42.jpg" className="rounded-circle" alt="image" /></Link>
                                        <span className="name"><Link to="#">Shawn Lynch</Link></span>
                                        <span className="add-friend"><Link to="#">Add</Link></span>
                                    </div>
                                    <div className="following-item d-flex justify-content-between align-items-center">
                                        <Link to="#"><img src="src/assets/images/user/user-43.jpg" className="rounded-circle" alt="image" /></Link>
                                        <span className="name"><Link to="#">Kenneth Perry</Link></span>
                                        <span className="add-friend"><Link to="#">Add</Link></span>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>

                <div className={`tab-pane fade ${activeTab === 'about' ? 'show active' : ''}`} id="about" role="tabpanel">
                    <div className="row">
                        <div className="col-lg-3 col-md-12">
                            <div className="about-personal-information">
                                <div className="about-header d-flex justify-content-between align-items-center">
                                    <div className="title">Personal Information</div>
                                    <div className="dropdown">
                                        <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="flaticon-menu"></i></button>
                                        <ul className="dropdown-menu">
                                            <li><Link className="dropdown-item d-flex align-items-center" to="#"><i className="flaticon-edit"></i> Edit Information</Link></li>
                                            <li><Link className="dropdown-item d-flex align-items-center" to="#"><i className="flaticon-private"></i> Hide Information</Link></li>
                                            <li><Link className="dropdown-item d-flex align-items-center" to="#"><i className="flaticon-trash"></i> Delete Information</Link></li>
                                        </ul>
                                    </div>
                                </div>

                                <ul className="information-list">
                                    <li><span>Birthday:</span> May 07, 1984</li>
                                    <li><span>Birthplace:</span> 4988 Woodland Terrace Citrus Heights, CA 95610</li>
                                    <li><span>Phone:</span> <a href="tel:916-879-7755">916-879-7755</a></li>
                                    <li><span>Gender:</span> Men</li>
                                    <li><span>Relationship Status:</span> Single</li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-9 col-md-12">
                            <div className="about-details-information">
                                <div className="information-box-content">
                                    <div className="information-header d-flex justify-content-between align-items-center">
                                        <div className="title">About Me!</div>
                                        <div className="dropdown">
                                            <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="flaticon-menu"></i></button>
                                            <ul className="dropdown-menu">
                                                <li><Link className="dropdown-item d-flex align-items-center" to="#"><i className="flaticon-edit"></i> Edit Information</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="content">
                                        <p>Curabitur aliquet quam id dui posuere blandit. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.</p>
                                    </div>
                                </div>

                                <div className="information-box-content">
                                    <div className="information-header d-flex justify-content-between align-items-center">
                                        <div className="title">Education & Work</div>
                                    </div>
                                    <div className="box-content">
                                        <p className="designation">Master of Computer Science <span>(2018 - 2020)</span></p>
                                        <span className="title">University of Stanford</span>
                                    </div>
                                    <div className="box-content">
                                        <p className="designation">Bachelor of Computer Science <span>(2014 - 2018)</span></p>
                                        <span className="title">Massachusetts Institute of Technology</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
