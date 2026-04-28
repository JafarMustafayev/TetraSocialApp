import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import USER_AVATAR from '../../assets/images/user_avatar.png';
import COVER_IMAGE from '../../assets/images/cover_image.png';

import getCroppedImg from '../../utils/cropImage';

const ProfilePictures = () => {
    const navigate = useNavigate();

    const [profileImage, setProfileImage] = useState(USER_AVATAR);
    const [coverImage, setCoverImage] = useState(COVER_IMAGE);

    // Cropping states
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [cropType, setCropType] = useState('profile'); // 'profile' or 'cover'

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageToCrop(reader.result);
                setCropType(type);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setCropModalOpen(true);
            });
            reader.readAsDataURL(file);
        }
        // Reset input so the same file can be selected again
        e.target.value = null;
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropConfirm = async () => {
        try {
            const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
            if (cropType === 'profile') {
                setProfileImage(croppedImage);
            } else {
                setCoverImage(croppedImage);
            }
            setCropModalOpen(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleRemove = (type) => {
        if (type === 'profile') setProfileImage(USER_AVATAR);
        else setCoverImage(COVER_IMAGE);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Hidden inputs */}
            <input
                type="file"
                accept="image/*"
                ref={profileInputRef}
                onChange={(e) => handleFileChange(e, 'profile')}
                className="hidden"
            />
            <input
                type="file"
                accept="image/*"
                ref={coverInputRef}
                onChange={(e) => handleFileChange(e, 'cover')}
                className="hidden"
            />

            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => navigate('/settings/edit-account')} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-main hover:text-white transition-all">
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profile & Cover Pictures</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your public images</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#161a29] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">

                {/* Profile Picture */}
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Profile Picture</h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div
                            onClick={() => profileInputRef.current.click()}
                            className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-[#161a29] shadow-md flex items-center justify-center overflow-hidden shrink-0 relative group cursor-pointer"
                        >
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <i className="ri-camera-line text-white text-2xl"></i>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Upload a new profile picture. Recommended size is 256x256px.</p>
                            <div className="flex gap-3">

                                <button
                                    onClick={() => handleRemove('profile')}
                                    className="bg-red-50 dark:bg-red-900/10 text-red-500 px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100 dark:border-gray-800" />

                {/* Cover Picture */}
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Cover Picture</h3>
                    <div
                        onClick={() => coverInputRef.current.click()}
                        className="w-full h-32 md:h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4 border-2 border-transparent relative overflow-hidden group cursor-pointer"
                    >
                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                            <i className="ri-camera-line text-white text-3xl mb-2"></i>
                            <span className="text-white text-sm font-bold">Change Cover</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleRemove('cover')}
                            className="bg-red-50 dark:bg-red-900/10 text-red-500 px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                        >
                            Remove
                        </button>
                    </div>
                </div>

            </div>

            {/* Crop Modal */}
            {cropModalOpen && (
                <div className="fixed inset-0 z-1000 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#161a29] w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 dark:text-white text-lg">Crop {cropType === 'profile' ? 'Profile Picture' : 'Cover Picture'}</h3>
                            <button onClick={() => setCropModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="relative w-full h-[400px] bg-black">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={cropType === 'profile' ? 1 : 16 / 5}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape={cropType === 'profile' ? 'round' : 'rect'}
                                showGrid={false}
                            />
                        </div>

                        <div className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-4 mb-6">
                                <i className="ri-zoom-out-line text-gray-500 dark:text-gray-400 text-xl"></i>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-main"
                                />
                                <i className="ri-zoom-in-line text-gray-500 dark:text-gray-400 text-xl"></i>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setCropModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCropConfirm}
                                    className="bg-main text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none"
                                >
                                    Apply Crop
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePictures;
