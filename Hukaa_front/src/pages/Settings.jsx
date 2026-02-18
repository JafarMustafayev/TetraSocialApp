import React, { useState } from 'react';
import ProfileInformation from '../components/Settings/ProfileInformation';
import WorkExperience from '../components/Settings/WorkExperience';
import ChangeUsername from '../components/Settings/ChangeUsername';
import PrivacySettings from '../components/Settings/PrivacySettings';
import ChangePassword from '../components/Settings/ChangePassword';
import ProfilePhotos from '../components/Settings/ProfilePhotos';
import { Link } from 'react-router-dom';

const Settings = () => {
    // Initial state is null so no section is expanded by default
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        if (activeSection === section) {
            setActiveSection(null); // Collapse if already open
        } else {
            setActiveSection(section); // Expand clicked section
        }
    };

    return (
        <div className="content-page-box-area">

            <div className="d-flex align-items-center">
                <div className="page-banner-box mb-3 mr-3">
                    <Link to="/profile">
                        <i className="ri-arrow-left-s-line fs-2"></i>
                    </Link>
                </div>
                <div className="page-banner-box mb-3">
                    <h3>Account Setting</h3>
                </div>
            </div>

            <div className="account-setting-list">
                {/* Profile Information Section */}
                <div className="setting-section mb-3">
                    <button
                        className={`btn btn-block w-100 text-start d-flex justify-content-between align-items-center p-3 border rounded ${activeSection === 'profile-information' ? 'bg-light text-primary' : 'bg-white'}`}
                        onClick={() => toggleSection('profile-information')}
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        <span>Profile Information</span>
                        <i className={`ri-arrow-${activeSection === 'profile-information' ? 'up' : 'down'}-s-line`}></i>
                    </button>
                    {activeSection === 'profile-information' && (
                        <div className="p-3 border border-top-0 rounded-bottom">
                            <ProfileInformation />
                        </div>
                    )}
                </div>

                {/* Profile Photos Section */}
                <div className="setting-section mb-3">
                    <button
                        className={`btn btn-block w-100 text-start d-flex justify-content-between align-items-center p-3 border rounded ${activeSection === 'profile-photos' ? 'bg-light text-primary' : 'bg-white'}`}
                        onClick={() => toggleSection('profile-photos')}
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        <span>Profile Photos</span>
                        <i className={`ri-arrow-${activeSection === 'profile-photos' ? 'up' : 'down'}-s-line`}></i>
                    </button>
                    {activeSection === 'profile-photos' && (
                        <div className="p-3 border border-top-0 rounded-bottom">
                            <ProfilePhotos />
                        </div>
                    )}
                </div>

                {/* Work Experience Section */}
                <div className="setting-section mb-3">
                    <button
                        className={`btn btn-block w-100 text-start d-flex justify-content-between align-items-center p-3 border rounded ${activeSection === 'work-experience' ? 'bg-light text-primary' : 'bg-white'}`}
                        onClick={() => toggleSection('work-experience')}
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        <span>Work Experience</span>
                        <i className={`ri-arrow-${activeSection === 'work-experience' ? 'up' : 'down'}-s-line`}></i>
                    </button>
                    {activeSection === 'work-experience' && (
                        <div className="p-3 border border-top-0 rounded-bottom">
                            <WorkExperience />
                        </div>
                    )}
                </div>

                {/* Change Username Section */}
                <div className="setting-section mb-3">
                    <button
                        className={`btn btn-block w-100 text-start d-flex justify-content-between align-items-center p-3 border rounded ${activeSection === 'change-username' ? 'bg-light text-primary' : 'bg-white'}`}
                        onClick={() => toggleSection('change-username')}
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        <span>Change Username</span>
                        <i className={`ri-arrow-${activeSection === 'change-username' ? 'up' : 'down'}-s-line`}></i>
                    </button>
                    {activeSection === 'change-username' && (
                        <div className="p-3 border border-top-0 rounded-bottom">
                            <ChangeUsername />
                        </div>
                    )}
                </div>

                {/* Privacy Settings Section */}
                <div className="setting-section mb-3">
                    <button
                        className={`btn btn-block w-100 text-start d-flex justify-content-between align-items-center p-3 border rounded ${activeSection === 'privacy' ? 'bg-light text-primary' : 'bg-white'}`}
                        onClick={() => toggleSection('privacy')}
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        <span>Privacy</span>
                        <i className={`ri-arrow-${activeSection === 'privacy' ? 'up' : 'down'}-s-line`}></i>
                    </button>
                    {activeSection === 'privacy' && (
                        <div className="p-3 border border-top-0 rounded-bottom">
                            <PrivacySettings />
                        </div>
                    )}
                </div>

                {/* Change Password Section */}
                <div className="setting-section mb-3">
                    <button
                        className={`btn btn-block w-100 text-start d-flex justify-content-between align-items-center p-3 border rounded ${activeSection === 'change-password' ? 'bg-light text-primary' : 'bg-white'}`}
                        onClick={() => toggleSection('change-password')}
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        <span>Change Password</span>
                        <i className={`ri-arrow-${activeSection === 'change-password' ? 'up' : 'down'}-s-line`}></i>
                    </button>
                    {activeSection === 'change-password' && (
                        <div className="p-3 border border-top-0 rounded-bottom">
                            <ChangePassword />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
