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
                debugger;
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
        <div className="profile-photos-settings">
            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-3`}>
                    {message.text}
                </div>
            )}

            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="form-group mb-3">
                        <label className="form-label d-block mb-2" style={{ fontWeight: 'bold' }}>Profile Photo</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'profile')}
                            disabled={loading}
                        />
                        <small className="text-muted">Recommended: Square image (1:1 aspect ratio)</small>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="form-group mb-3">
                        <label className="form-label d-block mb-2" style={{ fontWeight: 'bold' }}>Cover Photo</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'cover')}
                            disabled={loading}
                        />
                        <small className="text-muted">Recommended: Wide image (16:9 aspect ratio)</small>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="text-center my-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Uploading and processing image...</p>
                </div>
            )}

            {selectedImage && cropConfig && (
                <ImageCropper
                    image={selectedImage}
                    aspect={cropConfig.aspect}
                    onCropComplete={onCropComplete}
                    onCancel={onCancel}
                />
            )}
        </div>
    );
};

export default ProfilePhotos;
