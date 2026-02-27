import { getPrivacyInformation, updatePrivacySetting } from '../../api/profile';
import FormSkeleton from '../Skeleton/FormSkeleton';
import { useState, useEffect } from 'react';

const PrivacySettings = () => {
    const [privacyData, setPrivacyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        fetchPrivacyInfo();
    }, []);

    const fetchPrivacyInfo = async () => {
        setIsLoading(true);
        try {
            const response = await getPrivacyInformation();
            if (response.success) {
                setPrivacyData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch privacy settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTogglePrivacy = async () => {
        setIsUpdating(true);
        setShowConfirm(false);
        try {
            const response = await updatePrivacySetting();
            if (response.success) {
                // Refresh data after update
                await fetchPrivacyInfo();
            }
        } catch (error) {
            console.error('Failed to update privacy setting:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return <FormSkeleton rows={1} />;
    }

    const accountTypeText = privacyData?.accountType === 0 ? 'Private Account' : 'Public Account';

    return (
        <div className="space-y-8">
            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex justify-between items-center">
                <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1">Account Visibility</h4>
                    <p className="text-gray-500 text-sm">Your account is currently set to: <span className="font-bold text-main">{accountTypeText}</span></p>
                </div>
                <button
                    onClick={() => setShowConfirm(true)}
                    disabled={isUpdating}
                    className="px-6 py-2.5 bg-main text-white rounded-xl font-bold hover:bg-optional transition-all disabled:opacity-50"
                >
                    {isUpdating ? 'Updating...' : 'Toggle privacy setting'}
                </button>
            </div>

            {/* Existing hardcoded settings placeholder */}


            {/* Custom Confirmation UI */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-1001 p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="ri-shield-user-line text-4xl text-main"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Change Privacy?</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Are you sure you want to change your account to <strong>{privacyData?.accountType === 0 ? 'Public' : 'Private'}</strong>?
                                This will change how others interact with your profile.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleTogglePrivacy}
                                    className="flex-1 py-3.5 bg-main text-white rounded-xl font-bold hover:bg-optional shadow-lg shadow-blue-100 transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrivacySettings;
