import { getPrivacyInformation, updatePrivacySetting } from '../../api/profile';
import FormSkeleton from '../Skeleton/FormSkeleton';
import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

const PrivacySettings = () => {
    const [privacyData, setPrivacyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { showToast, showConfirm } = useToast();

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
            showToast('Failed to fetch privacy settings.', 'error', 3000, 'top-left');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTogglePrivacy = async () => {
        setIsUpdating(true);
        try {
            const response = await updatePrivacySetting();
            if (response.success) {
                showToast('Privacy settings updated successfully!', 'success', 3000, 'top-left');
                // Refresh data after update
                await fetchPrivacyInfo();
            } else {
                showToast(response.message || 'Failed to update privacy setting.', 'error', 3000, 'top-left');
            }
        } catch (error) {
            console.error('Failed to update privacy setting:', error);
            showToast('An error occurred while updating privacy setting.', 'error', 3000, 'top-left');
        } finally {
            setIsUpdating(false);
        }
    };

    const triggerConfirm = () => {
        const nextType = privacyData?.accountType === 0 ? 'Public' : 'Private';
        showConfirm(
            'Change Privacy?',
            `Are you sure you want to change your account to ${nextType}? This will change how others interact with your profile.`,
            handleTogglePrivacy
        );
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
                    onClick={triggerConfirm}
                    disabled={isUpdating}
                    className="px-6 py-2.5 bg-main text-white rounded-xl font-bold hover:bg-optional transition-all disabled:opacity-50"
                >
                    {isUpdating ? 'Updating...' : 'Toggle privacy setting'}
                </button>
            </div>
        </div>
    );
};

export default PrivacySettings;
