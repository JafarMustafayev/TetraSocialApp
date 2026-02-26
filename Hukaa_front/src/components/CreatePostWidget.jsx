import React, { useState, useRef } from 'react';
import { IMAGE_BASE_URL } from '../api/client';
import { createPost } from '../api/post';

const CreatePostWidget = ({ profileData, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const maxChars = 1000;

    const handleTextChange = (e) => {
        const text = e.target.value;
        if (text.length <= maxChars) {
            setContent(text);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);

        if (selectedFiles.length + files.length > 10) {
            alert('You can only upload up to 10 files.');
            return;
        }

        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);

        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('video') ? 'video' : 'image',
            name: file.name
        }));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeFile = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index].url);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handlePost = async () => {
        const trimmedContent = content.trim();
        if (!trimmedContent && selectedFiles.length === 0) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('content', trimmedContent);

        selectedFiles.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await createPost(formData);

            if (response.success) {
                // Clear form
                setContent('');
                setSelectedFiles([]);
                setPreviews([]);

                // Notify parent
                if (onPostCreated) {
                    onPostCreated(response.data.post);
                }
            } else {
                alert('Failed to create post: ' + (response.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const errorMsg = Object.values(errors).flat().join('\n');
                alert(errorMsg);
            } else {
                alert('Error creating post. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm mb-6 border border-gray-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-gray-100/50">
            <div className="p-6">
                <div className="flex items-start space-x-4">

                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={handleTextChange}
                            placeholder="What's on your mind?..."
                            className="w-full bg-gray-50/50 border-none ring-1 ring-gray-100 focus:ring-4 focus:ring-blue-100 focus:bg-white text-gray-700 resize-none rounded-2xl p-4 min-h-[120px] transition-all placeholder:text-gray-400 font-medium text-[15px] outline-none"
                        ></textarea>

                        <div className="flex justify-end mt-2">
                            <span className={`text-[10px] font-bold tracking-widest uppercase ${content.length >= maxChars ? 'text-red-500' : 'text-gray-400'}`}>
                                {content.length} / {maxChars}
                            </span>
                        </div>
                    </div>
                </div>

                {previews.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-5 p-4 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative w-24 h-24 group">
                                {preview.type === 'video' ? (
                                    <div className="w-full h-full bg-slate-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                                        <i className="ri-vidicon-fill text-slate-400 text-2xl"></i>
                                    </div>
                                ) : (
                                    <img src={preview.url} className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm" alt="preview" />
                                )}
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 z-10 scale-0 group-hover:scale-100 transition-transform border-[3px] border-white active:scale-90"
                                >
                                    <i className="ri-close-line text-sm font-bold"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-gray-50 text-gray-500 rounded-xl font-bold text-sm hover:bg-blue-50 hover:text-[#3644D9] transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:bg-[#3644D9] group-hover:text-white transition-all">
                                <i className="ri-image-add-line text-lg"></i>
                            </div>
                            <span>Photo / Video</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                        />
                    </div>

                    <button
                        onClick={handlePost}
                        disabled={isLoading || (!content.trim() && selectedFiles.length === 0)}
                        className={`px-10 py-3.5 rounded-2xl font-bold transition-all shadow-xl active:scale-95 flex items-center ${(isLoading || (!content.trim() && selectedFiles.length === 0)) ? 'bg-gray-100 text-gray-400 shadow-none' : 'bg-[#3644D9] text-white hover:bg-[#2E3AB8] shadow-blue-100'}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Posting...
                            </>
                        ) : 'Post Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostWidget;
