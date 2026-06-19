// src/components/settings/forms/EditProfileForm.jsx
import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import SettingsInput from '../SettingsInput.jsx';
import SettingsButton from '../SettingsButton.jsx';
import { EditProfileSkeleton } from '../../skeletons/index.js';
import { useAuth } from '../../../context/AuthContext';
import coverPlaceholder from '../../../assets/images/cover_image.png';
import avatarPlaceholder from '../../../assets/images/user_avatar.png';

// Crop Helper: Create image from URL
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

// Crop Helper: Get cropped image using canvas drawing
const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
};

const EditProfileForm = ({ onBack }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({
        name: "Jafar Mustafayev",
        bio: "",
        website: ""
    });

    // Image States
    const [coverImage, setCoverImage] = useState(coverPlaceholder);
    const [avatarImage, setAvatarImage] = useState(avatarPlaceholder);

    // Cropping States
    const [imageToCrop, setImageToCrop] = useState(null);
    const [cropType, setCropType] = useState('avatar'); // 'avatar' or 'cover'
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Simulated network loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 750);
        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result);
            setCropType(type);
            setZoom(1);
            setCrop({ x: 0, y: 0 });
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // Reset input selection
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = async () => {
        try {
            if (!imageToCrop || !croppedAreaPixels) return;
            const croppedImageBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels);
            if (cropType === 'avatar') {
                setAvatarImage(croppedImageBase64);
            } else {
                setCoverImage(croppedImageBase64);
            }
            setImageToCrop(null);
        } catch (e) {
            console.error("Error cropping image:", e);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Backend integration placeholder
    };

    if (isLoading) {
        return <EditProfileSkeleton onBack={onBack} />;
    }

    // Get initials fallback (Username first letter)
    const usernameLetter = user?.username?.[0]?.toUpperCase() || form.name?.[0]?.toUpperCase() || 'U';

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-[#09090b]">
            {/* Header/title area */}
            <div className="px-4 pt-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit profile</h2>
            </div>

            <div className="p-4 md:px-6 md:py-2 max-w-[600px] space-y-6">
                {/* Section title */}
                <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-6">Profile</h3>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Hidden File Inputs */}
                    <input
                        type="file"
                        id="cover-upload"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'cover')}
                        className="hidden"
                    />
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'avatar')}
                        className="hidden"
                    />

                    {/* Cover photo block */}
                    <div className="space-y-3">
                        <label className="block text-[15px] font-bold text-gray-900 dark:text-white">
                            Cover photo
                        </label>
                        <div className="relative w-full h-40 bg-gray-100 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 aspect-[3/1]">
                            {coverImage ? (
                                <img
                                    src={coverImage}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-main/40 via-gray-100 dark:via-zinc-800 to-gray-250 dark:to-zinc-900" />
                            )}
                        </div>
                        <div className="flex gap-2">
                            <SettingsButton
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('cover-upload').click()}
                            >
                                Change cover
                            </SettingsButton>
                            {coverImage && (
                                <SettingsButton
                                    type="button"
                                    variant="danger"
                                    onClick={() => setCoverImage(null)}
                                >
                                    Remove
                                </SettingsButton>
                            )}
                        </div>
                    </div>

                    {/* Profile photo block */}
                    <div className="space-y-3 pt-2">
                        <label className="block text-[15px] font-bold text-gray-900 dark:text-white">
                            Profile photo
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 dark:border-neutral-850 bg-gray-100 dark:bg-[#16181c] shrink-0 flex items-center justify-center">
                                {avatarImage ? (
                                    <img
                                        src={avatarImage}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full text-3xl select-none  bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-main ">
                                        {usernameLetter}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <SettingsButton
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('avatar-upload').click()}
                                >
                                    Change photo
                                </SettingsButton>
                                {avatarImage && (
                                    <SettingsButton
                                        type="button"
                                        variant="danger"
                                        onClick={() => setAvatarImage(null)}
                                    >
                                        Remove
                                    </SettingsButton>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Name input */}
                    <SettingsInput
                        label="Name"
                        value={form.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />

                    {/* Bio textarea */}
                    <div className="mb-5">
                        <label className="block text-[15px] font-bold text-gray-900 dark:text-white mb-2">
                            Bio
                        </label>
                        <textarea
                            className="w-full min-h-[100px] p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:border-main focus:ring-main focus:ring-1 transition-colors text-[15px] resize-y"
                            value={form.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            placeholder="Write something about yourself..."
                        />
                    </div>

                    {/* Website input */}
                    <SettingsInput
                        label="Website"
                        value={form.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://"
                    />

                    {/* Save button */}
                    <div className="flex justify-end pt-2">
                        <SettingsButton
                            type="submit"
                            variant="primary"
                            className='bg-main! hover:bg-main-hover!'>
                            Save
                        </SettingsButton>
                    </div>
                </form>
            </div>

            {/* Cropping Modal */}
            {imageToCrop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative bg-white dark:bg-[#18181b] border border-gray-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-150 dark:border-neutral-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Crop {cropType === 'avatar' ? 'Profile Photo' : 'Cover Photo'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setImageToCrop(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="relative w-full h-80 bg-neutral-950">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={cropType === 'avatar' ? 1 : 3}
                                cropShape={cropType === 'avatar' ? 'round' : 'rect'}
                                showGrid={true}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div className="p-5 border-t border-gray-150 dark:border-neutral-800 space-y-4 bg-gray-50/50 dark:bg-[#16181c]/30">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-zinc-400">
                                    <span>Zoom</span>
                                    <span>{zoom.toFixed(1)}x</span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full accent-main cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <SettingsButton variant="outline" type="button" onClick={() => setImageToCrop(null)}>
                                    Cancel
                                </SettingsButton>
                                <SettingsButton variant="primary" type="button" className="bg-main! hover:bg-main-hover! text-white!" onClick={handleCropSave}>
                                    Apply Crop
                                </SettingsButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfileForm;
