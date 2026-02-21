import React, { useState } from 'react';
import { updateProfilePhoto, updateCoverPhoto } from '../../api/profile';
import ImageCropper from './ImageCropper';
import { useAuth } from '../../context/AuthContext';

const ProfilePhotos = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [cropConfig, setCropConfig] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const { updateProfile } = useAuth();

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
                setCropConfig({
                    type,
                    aspect: type === 'profile' ? 1 : 16 / 9
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = async (croppedFile) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            let response;
            if (cropConfig.type === 'profile') {
                response = await updateProfilePhoto(croppedFile);
            } else {
                response = await updateCoverPhoto(croppedFile);
            }

            if (response.success) {
                setMessage({ type: 'success', text: `${cropConfig.type === 'profile' ? 'Profile' : 'Cover'} photo updated successfully!` });
                updateProfile(); // Trigger Navbar update
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to update photo.' });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: 'An error occurred during upload.' });
        } finally {
            setLoading(false);
            setSelectedImage(null);
            setCropConfig(null);
        }
    };

    const onCancel = () => {
        setSelectedImage(null);
        setCropConfig(null);
    };

    return (
        <div className="space-y-8">
            {message.text && (
                <div className={`p-4 rounded-xl text-sm font-medium animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Profile Photo</label>
                    <div className="relative group">
                        <input
                            type="file"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#3644D9] file:text-white hover:file:bg-[#2E3AB8] transition-all cursor-pointer border border-gray-200 rounded-xl p-2 bg-gray-50/50"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'profile')}
                            disabled={loading}
                        />
                    </div>
                    <p className="text-[11px] text-gray-400 font-bold italic ml-1 flex items-center gap-1">
                        <i className="ri-information-line"></i> Square image recommended (1:1 aspect ratio)
                    </p>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Cover Photo</label>
                    <div className="relative group">
                        <input
                            type="file"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#3644D9] file:text-white hover:file:bg-[#2E3AB8] transition-all cursor-pointer border border-gray-200 rounded-xl p-2 bg-gray-50/50"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'cover')}
                            disabled={loading}
                        />
                    </div>
                    <p className="text-[11px] text-gray-400 font-bold italic ml-1 flex items-center gap-1">
                        <i className="ri-information-line"></i> Wide image recommended (16:9 aspect ratio)
                    </p>
                </div>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 animate-pulse">
                    <svg className="animate-spin h-10 w-10 text-[#3644D9] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Uploading and processing image...</p>
                </div>
            )}

            {selectedImage && cropConfig && (
                <div className="fixed inset-0 z-2000 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-2xl transform transition-all">
                        <ImageCropper
                            image={selectedImage}
                            aspect={cropConfig.aspect}
                            onCropComplete={onCropComplete}
                            onCancel={onCancel}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotos;
