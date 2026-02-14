import React from 'react';
import { Link } from 'react-router-dom';

const Notifications = () => {
    return (
        <div className="all-notifications-body">
            <div className="all-notifications-header d-flex justify-content-between align-items-center">
                <h3>Notifications</h3>

                <div className="dropdown">
                    <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="flaticon-menu"></i></button>
                    <ul className="dropdown-menu">
                        <li><Link className="dropdown-item d-flex align-items-center" to="#"><i className="flaticon-trash"></i> Clean Notification</Link></li>
                    </ul>
                </div>
            </div>

            <div className="item d-flex justify-content-between align-items-center">
                <div className="figure">
                    <Link to="/profile"><img src="src/assets/images/user/user-55.jpg" className="rounded-circle" alt="image" /></Link>
                </div>
                <div className="text">
                    <h4><Link to="/profile">James Vanwin</Link></h4>
                    <span>Posted A Comment On Your Status</span>
                    <span className="main-color">20 Minites Ago</span>
                </div>
                <div className="icon">
                    <Link to="#"><i className="flaticon-x-mark"></i></Link>
                </div>
            </div>
            <div className="item d-flex justify-content-between align-items-center">
                <div className="figure">
                    <Link to="/profile"><img src="src/assets/images/user/user-45.jpg" className="rounded-circle" alt="image" /></Link>
                </div>
                <div className="text">
                    <h4><Link to="/profile">Dwight Schoolcraft</Link></h4>
                    <span>Sent You a Friend Request</span>
                    <span className="main-color">35 Minites Ago</span>
                </div>
                <div className="icon">
                    <Link to="#"><i className="flaticon-x-mark"></i></Link>
                </div>
            </div>
            <div className="item d-flex justify-content-between align-items-center">
                <div className="figure">
                    <Link to="/profile"><img src="src/assets/images/user/user-48.jpg" className="rounded-circle" alt="image" /></Link>
                </div>
                <div className="text">
                    <h4><Link to="/profile">Susan Hadden</Link></h4>
                    <span>Add a Photo in Design Group</span>
                    <span className="main-color">50 Minites Ago</span>
                </div>
                <div className="icon">
                    <Link to="#"><i className="flaticon-x-mark"></i></Link>
                </div>
            </div>
            <div className="item d-flex justify-content-between align-items-center">
                <div className="figure">
                    <Link to="/profile"><img src="src/assets/images/user/user-49.jpg" className="rounded-circle" alt="image" /></Link>
                </div>
                <div className="text">
                    <h4><Link to="/profile">Herta Smith</Link></h4>
                    <span>Posted in Graphic Design Learn</span>
                    <span className="main-color">1 Hours Ago</span>
                </div>
                <div className="icon">
                    <Link to="#"><i className="flaticon-x-mark"></i></Link>
                </div>
            </div>
            <div className="item d-flex justify-content-between align-items-center">
                <div className="figure">
                    <Link to="/profile"><img src="src/assets/images/user/user-50.jpg" className="rounded-circle" alt="image" /></Link>
                </div>
                <div className="text">
                    <h4><Link to="/profile">Francis L. Tay</Link></h4>
                    <span>Like Your Comment</span>
                    <span className="main-color">5 Hours Ago</span>
                </div>
                <div className="icon">
                    <Link to="#"><i className="flaticon-x-mark"></i></Link>
                </div>
            </div>
            <div className="item d-flex justify-content-between align-items-center">
                <div className="figure">
                    <Link to="/profile"><img src="src/assets/images/user/user-51.jpg" className="rounded-circle" alt="image" /></Link>
                </div>
                <div className="text">
                    <h4><Link to="/profile">Laura Hildebrandt</Link></h4>
                    <span>Comment On Your Status</span>
                    <span className="main-color">1 Days Ago</span>
                </div>
                <div className="icon">
                    <Link to="#"><i className="flaticon-x-mark"></i></Link>
                </div>
            </div>
            <div className="item d-flex justify-content-between align-items-center">
                <div className="figure">
                    <Link to="/profile"><img src="src/assets/images/user/user-52.jpg" className="rounded-circle" alt="image" /></Link>
                </div>
                <div className="text">
                    <h4><Link to="/profile">Martha Wilkes</Link></h4>
                    <span>Reacted To Your Comment "Happy Birthday"</span>
                    <span className="main-color">3 Days Ago</span>
                </div>
                <div className="icon">
                    <Link to="#"><i className="flaticon-x-mark"></i></Link>
                </div>
            </div>
            <div className="item d-flex justify-content-between align-items-center">
                <div className="figure">
                    <Link to="/profile"><img src="src/assets/images/user/user-53.jpg" className="rounded-circle" alt="image" /></Link>
                </div>
                <div className="text">
                    <h4><Link to="/profile">Howard Harris</Link></h4>
                    <span>Added a Photo in Graphic Design Group</span>
                    <span className="main-color">7 Days Ago</span>
                </div>
                <div className="icon">
                    <Link to="#"><i className="flaticon-x-mark"></i></Link>
                </div>
            </div>
            <div className="item d-flex justify-content-between align-items-center">
                <div className="figure">
                    <Link to="/profile"><img src="src/assets/images/user/user-54.jpg" className="rounded-circle" alt="image" /></Link>
                </div>
                <div className="text">
                    <h4><Link to="/profile">Martha Wilkes</Link></h4>
                    <span>Added a Photo in Graphic Design Group</span>
                    <span className="main-color">7 Days Ago</span>
                </div>
                <div className="icon">
                    <Link to="#"><i className="flaticon-x-mark"></i></Link>
                </div>
            </div>
            <div className="item d-flex justify-content-between align-items-center">
                <div className="figure">
                    <Link to="/profile"><img src="src/assets/images/user/user-30.jpg" className="rounded-circle" alt="image" /></Link>
                </div>
                <div className="text">
                    <h4><Link to="/profile">David Gibson</Link></h4>
                    <span>Commented on Your Newstatus</span>
                    <span className="main-color">1 Month Ago</span>
                </div>
                <div className="icon">
                    <Link to="#"><i className="flaticon-x-mark"></i></Link>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
