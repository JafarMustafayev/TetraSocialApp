import React, { useState, useEffect } from 'react';
import { getProfileSettings, updateProfileInformation } from '../../api/profile';

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
        return <div className="p-3 text-center">Loading settings...</div>;
    }

    return (
        <form className="account-setting-form" onSubmit={handleSubmit}>

            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-3`}>
                    {message.text}
                </div>
            )}

            <div className="row">
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            className="form-control "
                            placeholder="First name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Last name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            className="form-control"
                            placeholder="Write something about yourself..."
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label className="block mb-1.5 font-bold text-[#515355] text-sm">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full h-[45px] px-4 rounded-lg border outline-none transition-all"
                            name="birthDay"
                            value={formData.birthDay}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            className="form-select"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="1">Men</option>
                            <option value="2">Women</option>
                            <option value="3">Other</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Relation Status</label>
                        <select
                            className="form-select"
                            name="relationshipStatus"
                            value={formData.relationshipStatus}
                            onChange={handleChange}
                        >
                            <option value="1">Single</option>
                            <option value="2">Married</option>
                            <option value="3">In Relationship</option>
                        </select>
                    </div>
                </div>

                <div className="col-lg-12 col-md-12 text-end">
                    <button type="submit" className="h-[45px] px-6 rounded-lg font-bold text-[#515355] border border-gray-200 hover:bg-white hover:shadow-sm transition-all btn-primary mt-2" disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProfileInformation;
