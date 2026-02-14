import React from 'react';


const Home = () => {
    return (
        <div className="row">
            <div className="col-lg-9 col-md-12 p-0 p-lg-5"> {/* Adjusted padding classes */}
                <div className="news-feed-area">
                    <div className="news-feed news-feed-form">
                        <h3 className="news-feed-title">Create New Post</h3>
                        <form>
                            <div className="form-group">
                                <textarea name="message" className="form-control" placeholder="Write something here..."></textarea>
                            </div>
                            <ul className="button-group d-flex justify-content-between align-items-center">
                                <li className="photo-btn">
                                    <button type="button"><i className="flaticon-gallery"></i> Photo</button>
                                </li>
                                <li className="video-btn">
                                    <button type="button"><i className="flaticon-video"></i> Video</button>
                                </li>
                                <li className="post-btn">
                                    <button type="submit">Post</button>
                                </li>
                            </ul>
                        </form>
                    </div>

                    <div className="news-feed news-feed-post">
                        <div className="post-header d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <div className="image">
                                    <a href="#"><img src="/src/assets/images/user/user-1.jpg" className="rounded-circle" alt="image" /></a>
                                </div>
                                <div className="info padding-left-25">
                                    <span className="name"><a href="#">Julie R. Morleyv</a></span>
                                    <span className="small-text"><a href="#">10 Mins Ago</a></span>
                                </div>
                            </div>
                            <div className="dropdown">
                                <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="flaticon-menu"></i>
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item d-flex align-items-center" href="#"><i className="flaticon-edit"></i> Edit Post</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="post-body">
                            <p>
                                Donec rutrum congue leo eget malesuada. Nulla quis lorem ut
                                libero malesuada feugiat.
                            </p>
                            <div className="post-image">
                                <img src="/src/assets/images/news-feed-post/post-1.jpg" alt="image" />
                            </div>
                            <ul className="post-meta-wrap d-flex justify-content-between align-items-center">
                                <li className="post-react">
                                    <a href="#"><i className="flaticon-like"></i><span>Like</span> <span className="number">1499 </span></a>
                                    <ul className="react-list">
                                        <li><a href="#"><img src="/src/assets/images/react/react-1.png" alt="Like" /></a></li>
                                        <li><a href="#"><img src="/src/assets/images/react/react-2.png" alt="Like" /></a></li>
                                    </ul>
                                </li>
                                <li className="post-comment">
                                    <a href="#"><i className="flaticon-comment"></i><span>Comment</span> <span className="number">599 </span></a>
                                </li>
                                <li className="post-share">
                                    <a href="#"><i className="flaticon-share"></i><span>Share</span> <span className="number">24 </span></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default Home;
