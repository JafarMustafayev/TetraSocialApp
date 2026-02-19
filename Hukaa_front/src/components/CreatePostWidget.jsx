import React, { useState, useRef } from 'react';
import { IMAGE_BASE_URL } from '../api/client';

const CreatePostWidget = ({ profileData }) => {
    const [content, setContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
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

    return (
        <div className="bg-white rounded-2xl shadow-sm mb-6 border border-gray-100 overflow-hidden">
            <div className="p-5">
                <div className="flex items-start space-x-4">

                    <div className="flex-1  ">
                        <textarea
                            value={content}
                            onChange={handleTextChange}
                            placeholder="What's on your mind?..."
                            className="w-full bg-gray-50/50 border-none ring-2 ring-gray-400  text-gray-600 resize-none rounded-xl p-3 min-h-[150px] transition-all"
                        ></textarea>

                        {/* Progress/Counter */}
                        <div className="flex justify-end mt-1 px-1">
                            <span className={`text-[10px] font-bold tracking-tight ${content.length >= maxChars ? 'text-red-500' : 'text-gray-400'}`}>
                                {content.length} / {maxChars}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Previews */}

                <div className="mt-2 flex flex-wrap gap-3">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative w-20 group h-[50px]">
                            {preview.type === 'video' ? (
                                <div className="w-full h-full bg-slate-100 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                                    <i className="ri-vidicon-fill text-slate-400 text-xl"></i>
                                </div>
                            ) : (
                                <img src={preview.url} className="w-max-[50px] h-max-[50px] object-cover rounded-xl border border-gray-100 shadow-sm" alt="preview" />
                            )}
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white  flex items-center justify-center shadow-lg hover:bg-red-600 z-10 scale-0 border-4    group-hover:scale-100 transition-transform"
                            >
                                <i className="ri-close-line text-sm"></i>
                            </button>
                        </div>
                    ))}
                    {previews.length < 10 && (
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500 transition-all"
                        >
                            <i className="ri-add-line text-2xl"></i>
                            <span className="text-[10px] font-bold">ADD</span>
                        </button>
                    )}
                </div>


                <div className=" border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-1">

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
                        disabled={!content.trim() && selectedFiles.length === 0}
                        className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${(!content.trim() && selectedFiles.length === 0) ? 'bg-gray-100 text-gray-400 shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:-translate-y-0.5'}`}
                    >
                        Post Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostWidget;
