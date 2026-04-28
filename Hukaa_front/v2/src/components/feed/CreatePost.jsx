// src/components/feed/CreatePost.jsx
import React, { useState, useRef } from 'react';
import { USER_AVATAR, API_BASE_URL } from '../../api/api-config';
import MediaPreviews from './MediaPreviews';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]); // { id, file, previewUrl, type }
    const fileInputRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        // Check file types and limits
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

        // Filter valid files
        const validFiles = files.filter(file => validTypes.includes(file.type));

        // Ensure we don't exceed 12 files
        const filesToAddCount = Math.min(10 - mediaFiles.length, validFiles.length);
        const filesToAdd = validFiles.slice(0, filesToAddCount);

        const newMedia = filesToAdd.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            previewUrl: URL.createObjectURL(file),
            type: file.type
        }));

        setMediaFiles(prev => [...prev, ...newMedia]);

        // Reset input
        e.target.value = null;
    };

    const removeMediaFile = (idToRemove) => {
        setMediaFiles(prev => {
            const filtered = prev.filter(m => m.id !== idToRemove);
            // Cleanup object URL
            const removedItem = prev.find(m => m.id === idToRemove);
            if (removedItem) {
                URL.revokeObjectURL(removedItem.previewUrl);
            }
            return filtered;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim() && mediaFiles.length === 0) return;

        const newPost = {
            Id: Date.now(),
            ByUserName: user.FirstName ? `${user.FirstName} ${user.LastName}` : 'New User',
            Content: content,
            UserProfileImageUrl: user.ProfilePhoto || null,
            // Assuming the backend will handle media, we can just pass the previewURLs or names for mock purposes
            Media: mediaFiles.map(m => m.previewUrl)
        };

        onPostCreated(newPost);

        // Cleanup
        setContent('');
        mediaFiles.forEach(m => URL.revokeObjectURL(m.previewUrl));
        setMediaFiles([]);
    };

    return (
        <div className="bg-white dark:bg-[#161a29] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 mb-5">
            <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`What's on your mind, ${user.FirstName || 'User'}?`}
                        className="w-full bg-gray-50 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm focus:ring-2 transition-all min-h-[100px] text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none"
                        style={{
                            minHeight: "100px",
                            maxHeight: "400px",
                            resize: "vertical",
                        }}
                    />

                    {/* Media Previews Component */}
                    <MediaPreviews
                        files={mediaFiles}
                        onRemove={removeMediaFile}
                        onAddClick={() => fileInputRef.current.click()}
                    />

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.gif"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-2">
                            {mediaFiles.length === 0 && (
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all"
                                >
                                    <i className="ri-image-line text-lg text-green-500"></i>
                                    <span className="text-xs font-bold uppercase tracking-wider">Photo / Video</span>
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() && mediaFiles.length === 0}
                            className="bg-main text-white px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100 dark:shadow-none shrink-0"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
