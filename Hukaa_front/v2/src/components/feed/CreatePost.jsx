// src/components/feed/CreatePost.jsx
import React, { useState, useRef, useEffect } from 'react';
import { USER_AVATAR, API_BASE_URL } from '../../api/apiConfig';
import MediaPreviews from './MediaPreviews';
import { Paperclip } from 'lucide-react';


const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]); // { id, file, previewUrl, type }
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
        const validFiles = files.filter(file => validTypes.includes(file.type));
        const filesToAddCount = Math.min(10 - mediaFiles.length, validFiles.length);
        const filesToAdd = validFiles.slice(0, filesToAddCount);

        const newMedia = filesToAdd.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            previewUrl: URL.createObjectURL(file),
            type: file.type
        }));

        setMediaFiles(prev => [...prev, ...newMedia]);
        e.target.value = null;
    };

    const removeMediaFile = (idToRemove) => {
        setMediaFiles(prev => {
            const filtered = prev.filter(m => m.id !== idToRemove);
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
            Media: mediaFiles.map(m => ({ url: m.previewUrl, type: m.type }))
        };

        onPostCreated(newPost);
        setContent('');
        if (textareaRef.current) {
            textareaRef.current.style.height = '40px';
        }
        mediaFiles.forEach(m => URL.revokeObjectURL(m.previewUrl));
        setMediaFiles([]);
    };

    const handleTextareaInput = (e) => {
        setContent(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div className="bg-white dark:bg-[#09090b] p-4 flex gap-3 transition-colors">
            {/* Avatar */}
            <div className="shrink-0 pt-1">
                <img
                    src={user.ProfilePhoto ? `${API_BASE_URL}/${user.ProfilePhoto}` : USER_AVATAR}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-800"
                    alt="User avatar"
                />
            </div>

            <div className="flex-1 min-w-0">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleTextareaInput}
                    placeholder="What is happening?!"
                    className="w-full bg-transparent border-none text-[17px] text-gray-900 dark:text-white placeholder-gray-500 outline-none resize-none min-h-[40px] pt-2 max-h-[220px] sm:max-h-[320px] overflow-y-auto custom-scrollbar"
                />

                <MediaPreviews
                    files={mediaFiles}
                    onRemove={removeMediaFile}
                    onAddClick={() => fileInputRef.current.click()}
                />

                <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.gif"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-[#1f1f1f]">
                    <div className="flex items-center gap-1">
                        <button onClick={() => fileInputRef.current.click()} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-main/10 transition-colors text-main">
                            <Paperclip size={20} />
                        </button>

                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!content.trim() && mediaFiles.length === 0}
                        className="bg-main text-white px-4 py-1.5 rounded-full text-[15px] font-bold hover:bg-main-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
