import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile-information');

    return (
        <div className="content-page-box-area">
            <div className="page-banner-box">
                <h3>Account Setting</h3>
            </div>

            <div className="account-setting-list-tabs">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'profile-information' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile-information')}
                        >
                            Profile Information
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'privacy' ? 'active' : ''}`}
                            onClick={() => setActiveTab('privacy')}
                        >
                            Privacy
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'close-account' ? 'active' : ''}`}
                            onClick={() => setActiveTab('close-account')}
                        >
                            Close Account
                        </button>
                    </li>
                </ul>
            </div>

            <div className="tab-content" id="myTabContent">
                <div className={`tab-pane fade ${activeTab === 'profile-information' ? 'show active' : ''}`} id="profile-information" role="tabpanel">
                    <form className="account-setting-form">
                        <h3>Profile Information</h3>

                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" className="form-control" placeholder="First name" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" className="form-control" placeholder="Last name" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" placeholder="Email" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Username</label>
                                    <input type="text" className="form-control" placeholder="Username" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input type="text" className="form-control" placeholder="Date of birth" id="datepicker" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Phone No:</label>
                                    <input type="number" className="form-control" placeholder="Phone no" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select className="form-select">
                                        <option defaultValue="1">Gender</option>
                                        <option value="2">Male</option>
                                        <option value="3">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Relation Status</label>
                                    <select className="form-select">
                                        <option defaultValue="1">Relation Status</option>
                                        <option value="2">Married</option>
                                        <option value="3">Unmarried</option>
                                        <option value="4">Single</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>City</label>
                                    <select className="form-select">
                                        <option defaultValue="1">City</option>
                                        <option value="2">Canada</option>
                                        <option value="3">Germany</option>
                                        <option value="4">Switzerland</option>
                                        <option value="5">Australia</option>
                                        <option value="6">United States</option>
                                        <option value="7">New Zealand</option>
                                        <option value="8">United Kingdom</option>
                                        <option value="9">Netherlands</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Country</label>
                                    <select className="form-select">
                                        <option defaultValue="1">Country</option>
                                        <option value="2">Canada</option>
                                        <option value="3">Germany</option>
                                        <option value="4">Switzerland</option>
                                        <option value="5">Australia</option>
                                        <option value="6">United States</option>
                                        <option value="7">New Zealand</option>
                                        <option value="8">United Kingdom</option>
                                        <option value="9">Netherlands</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                                <button type="submit" className="default-btn">Save</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className={`tab-pane fade ${activeTab === 'privacy' ? 'show active' : ''}`} id="privacy" role="tabpanel">
                    <form className="account-setting-form">
                        <h3>Privacy Settings</h3>

                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Who Can See Your Profile?</label>
                                    <select className="form-select">
                                        <option value="true">All</option>
                                        <option value="false">My followers</option>
                                        <option value="">No one</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Who Can Send You Follow Request?</label>
                                    <select className="form-select">
                                        <option value="true">All</option>
                                        <option value="false">My followers</option>
                                        <option value="">No one</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Who Can See Your Phone Number?</label>
                                    <select className="form-select">
                                        <option value="true">All</option>
                                        <option value="false">My followers</option>
                                        <option value="">No one</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Who Can See Your Birthday?</label>
                                    <select className="form-select">
                                        <option value="true">All</option>
                                        <option value="false">My followers</option>
                                        <option value="">No one</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                                <button type="submit" className="default-btn">Save Change</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className={`tab-pane fade ${activeTab === 'close-account' ? 'show active' : ''}`} id="close-account" role="tabpanel">
                    <form className="account-setting-form">
                        <div className="title">
                            <h3>Close Account</h3>
                            <p><span>Warning:</span> If you close your account, all your followers and friends will be unsubscribed and you will lose access forever.(30 days after)</p>
                        </div>

                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Your Email Address</label>
                                    <input type="email" className="form-control" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Your Password</label>
                                    <input type="password" className="form-control" />
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                                <button type="submit" className="default-btn">Delate Account</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
