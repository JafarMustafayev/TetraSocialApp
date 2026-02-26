import React, { useState, useEffect } from 'react';
import ProfileInformation from '../components/Settings/ProfileInformation';
import WorkExperience from '../components/Settings/WorkExperience';
import ChangeUsername from '../components/Settings/ChangeUsername';
import PrivacySettings from '../components/Settings/PrivacySettings';
import ChangePassword from '../components/Settings/ChangePassword';
import ProfilePhotos from '../components/Settings/ProfilePhotos';
import { Link, useSearchParams } from 'react-router-dom';

const Settings = () => {
    const [searchParams] = useSearchParams();
    const activeSection = searchParams.get('section') || 'profile-information';

    const renderSection = () => {
        switch (activeSection) {
            case 'profile-information': return <ProfileInformation />;
            case 'profile-photos': return <ProfilePhotos />;
            case 'work-experience': return <WorkExperience />;
            case 'change-username': return <ChangeUsername />;
            case 'privacy': return <PrivacySettings />;
            case 'change-password': return <ChangePassword />;
            default: return <ProfileInformation />;
        }
    };

    const getSectionTitle = () => {
        switch (activeSection) {
            case 'profile-information': return 'Profile Information';
            case 'profile-photos': return 'Profile Photos';
            case 'work-experience': return 'Work Experience';
            case 'change-username': return 'Change Username';
            case 'privacy': return 'Privacy Settings';
            case 'change-password': return 'Change Password';
            default: return 'Account Settings';
        }
    };

    return (
        <div className="animate-fade-in-up ml-10">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-50 px-8 py-5 bg-gray-50/30 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 m-0">{getSectionTitle()}</h3>
                </div>
                <div className="p-8">
                    {renderSection()}
                </div>
            </div>
        </div>
    );
};


export default Settings;
