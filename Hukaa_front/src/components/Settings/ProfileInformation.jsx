import { getProfileSettings, updateProfileInformation } from '../../api/profile';
import FormSkeleton from '../Skeleton/FormSkeleton';
import { useState, useEffect } from 'react';

const ProfileInformation = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        birthDay: '',
        gender: 1,
        phoneNumber: '',
        relationshipStatus: 1
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getProfileSettings();
                if (response.success && response.data) {
                    const data = response.data;
                    setFormData({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        bio: data.bio || '',
                        birthDay: data.birthDay ? data.birthDay.split('T')[0] : '',
                        gender: data.gender || 1,
                        phoneNumber: data.phoneNumber || '',
                        relationshipStatus: data.relationshipStatus || 1
                    });
                }
            } catch (error) {
                console.error('Error fetching profile settings:', error);
                setMessage({ type: 'error', text: 'Failed to load profile information.' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'gender' || name === 'relationshipStatus' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Adjust birthday to ISO format if it exists
            const submitData = {
                ...formData,
                birthDay: formData.birthDay ? new Date(formData.birthDay).toISOString() : null
            };

            const response = await updateProfileInformation(submitData);
            if (response.success) {
                setMessage({ type: 'success', text: 'Profile information updated successfully!' });
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to update profile information.' });
            }
        } catch (error) {
            console.error('Error updating profile information:', error);
            setMessage({ type: 'error', text: 'An error occurred while saving.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <FormSkeleton rows={3} />;
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {message.text && (
                <div className={`p-4 rounded-xl text-sm font-medium animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">First Name</label>
                    <input
                        type="text"
                        className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400"
                        placeholder="First name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Last Name</label>
                    <input
                        type="text"
                        className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400"
                        placeholder="Last name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Bio</label>
                    <textarea
                        className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400 resize-none"
                        placeholder="Write something about yourself..."
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Date of Birth</label>
                    <input
                        type="date"
                        className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                        name="birthDay"
                        value={formData.birthDay}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                    <input
                        type="text"
                        className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400"
                        placeholder="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Gender</label>
                    <select
                        className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="1">Men</option>
                        <option value="2">Women</option>
                        <option value="3">Other</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Relationship Status</label>
                    <select
                        className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer"
                        name="relationshipStatus"
                        value={formData.relationshipStatus}
                        onChange={handleChange}
                    >
                        <option value="1">Single</option>
                        <option value="2">Married</option>
                        <option value="3">In Relationship</option>
                    </select>
                </div>

                <div className="md:col-span-2 pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-10 py-3.5 bg-[#3644D9] text-white rounded-xl font-bold hover:bg-[#2E3AB8] hover:shadow-xl hover:shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProfileInformation;
