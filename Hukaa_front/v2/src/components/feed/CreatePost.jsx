// src/components/feed/CreatePost.jsx
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Paperclip } from 'lucide-react';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]); // { id, file, previewUrl, type }
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const codeTextareaRef = useRef(null);

    // Code Editor States
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const [codeText, setCodeText] = useState('');
    const [codeLanguage, setCodeLanguage] = useState('javascript');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Detect ``` + Shift+Enter to trigger Code Editor
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            const cursorPosition = e.target.selectionStart;
            const textBeforeCursor = content.substring(0, cursorPosition);

            if (textBeforeCursor.endsWith('```')) {
                e.preventDefault();
                setShowCodeEditor(true);

                // Remove the 3 backticks
                const textAfterCursor = content.substring(cursorPosition);
                const newContent = textBeforeCursor.slice(0, -3) + textAfterCursor;
                setContent(newContent);

                toast.success('Code section created!');
            }
        }
    };

    // Auto-focus code editor when opened
    useEffect(() => {
        if (showCodeEditor && codeTextareaRef.current) {
            codeTextareaRef.current.focus();
        }
    }, [showCodeEditor]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const validFiles = files.filter(file => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            return isImage || isVideo;
        });

        if (validFiles.length !== files.length) {
            toast.error('Only image and video formats are supported!');
        }

        // Check total files limit (max 10)
        if (mediaFiles.length >= 10) {
            toast.error('You can upload a maximum of 10 files!');
            e.target.value = null;
            return;
        }

        const allowedNewCount = 10 - mediaFiles.length;
        const filesToProcess = validFiles.slice(0, allowedNewCount);

        const newMedia = filesToProcess.map(file => ({
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
            if (removedItem && removedItem.previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(removedItem.previewUrl);
            }
            return filtered;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim() && !codeText.trim() && mediaFiles.length === 0) return;

        // Compile content with Markdown codeblock representation if present
        let finalContent = content.trim();
        if (showCodeEditor && codeText.trim()) {
            finalContent = `${finalContent}\n\n\`\`\`${codeLanguage}\n${codeText.trim()}\n\`\`\``;
        }

        const newPost = {
            Id: Date.now(),
            ByUserName: user.FirstName ? `${user.FirstName} ${user.LastName}` : 'New User',
            Content: finalContent,
            UserProfileImageUrl: user.ProfilePhoto || null,
            Media: mediaFiles.map(m => ({ url: m.previewUrl, type: m.type }))
        };

        onPostCreated(newPost);
        setContent('');
        setCodeText('');
        setShowCodeEditor(false);
        if (textareaRef.current) {
            textareaRef.current.style.height = '80px';
        }
        mediaFiles.forEach(m => {
            if (m.previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(m.previewUrl);
            }
        });
        setMediaFiles([]);
    };

    const handleTextareaInput = (e) => {
        setContent(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    // Helper to highlight hashtags and mentions inline
    const getHighlightedContent = () => {
        if (!content) return '';
        // Escape HTML entities to prevent XSS
        const escaped = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Match #hashtag and @mention
        return escaped.replace(/(^|\s)(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g, (match, space, tag) => {
            return `${space}<span class="text-main font-semibold">${tag}</span>`;
        }) + '<br />';
    };

    return (
        <div className="bg-white dark:bg-[#09090b]  border border-gray-100 dark:border-[#1f1f1f] p-4 flex gap-4 transition-colors">


            <div className="flex-1 min-w-0 flex flex-col">

                {/* Code Block Editor Section */}
                {showCodeEditor && (
                    <div className="bg-[#1e1e2e] dark:bg-black border border-[#313244] dark:border-zinc-850 rounded-xl p-3.5 mb-3 relative flex flex-col gap-2">
                        <div className="flex items-center justify-between pb-2 border-b border-[#313244] dark:border-zinc-900">
                            <div className="flex items-center gap-2 text-gray-300">
                                <i className="ri-code-s-slash-line text-base text-main"></i>
                                <span className="text-[12px] font-bold uppercase tracking-wider">Code Section</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={codeLanguage}
                                    onChange={(e) => setCodeLanguage(e.target.value)}
                                    className="bg-[#313244] dark:bg-[#18181b] text-gray-200 border border-[#45475a] dark:border-zinc-700 rounded-md px-2 py-1 text-xs outline-none cursor-pointer font-semibold"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="csharp">C#</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                    <option value="html">HTML</option>
                                    <option value="css">CSS</option>
                                    <option value="go">Go</option>
                                    <option value="rust">Rust</option>
                                </select>
                                <button
                                    onClick={() => {
                                        setShowCodeEditor(false);
                                        setCodeText('');
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                    title="Remove code block"
                                >
                                    <i className="ri-close-line text-lg"></i>
                                </button>
                            </div>
                        </div>
                        <textarea
                            ref={codeTextareaRef}
                            value={codeText}
                            onChange={(e) => setCodeText(e.target.value)}
                            placeholder="Write your code here..."
                            className="w-full bg-transparent border-none text-[13px] font-mono text-[#cdd6f4] placeholder-gray-500 outline-none resize-y min-h-[90px] overflow-y-auto leading-relaxed"
                        />
                    </div>
                )}

                {/* Main Text Input with Interactive Tag Highlighting */}
                <div className="relative w-full min-h-[80px]">
                    {/* Background Highlight overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-[16px] text-gray-900 dark:text-white font-sans leading-relaxed pt-1 pb-1 pr-3 select-none z-0 overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: getHighlightedContent() }}
                    />

                    {/* Overlay Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleTextareaInput}
                        onKeyDown={handleKeyDown}
                        placeholder="What is happening?!"
                        className="w-full bg-transparent border-none text-[16px] text-transparent caret-gray-900 dark:caret-white placeholder-gray-500 outline-none resize-none min-h-[80px] pt-1 pb-1 pr-3 font-sans leading-relaxed z-10 relative overflow-y-auto custom-scrollbar"
                    />
                </div>

                {/* Media Thumbnails Preview */}
                {mediaFiles.length > 0 && (
                    <div className="flex flex-wrap gap-5 mt-4 p-1.5 bg-gray-50/50 dark:bg-zinc-900/5 rounded-xl border border-gray-100/50 dark:border-neutral-900/50">
                        {mediaFiles.map((media) => (
                            <div
                                key={media.id}
                                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden group border border-gray-100 dark:border-neutral-850 shadow-sm shrink-0"
                            >
                                {media.type.startsWith('video/') ? (
                                    <video src={media.previewUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={media.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                )}

                                {/* Remove button overlay */}
                                <button
                                    onClick={() => removeMediaFile(media.id)}
                                    className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 hover:bg-red-500 text-white transition-colors cursor-pointer shadow-md"
                                    type="button"
                                    title="Delete file"
                                >
                                    <i className="ri-close-line text-sm font-bold"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* File input supporting multiple file choices up to 10 */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                />

                {/* Footer Controls - Exactly two buttons */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-[#1f1f1f]">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        disabled={mediaFiles.length >= 10}
                        className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-main dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#16181c] rounded-full transition-all cursor-pointer font-bold text-sm disabled:opacity-40 disabled:pointer-events-none"
                    >
                        <Paperclip size={20} />
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!content.trim() && !codeText.trim() && mediaFiles.length === 0}
                        className="bg-main text-white hover:bg-main-hover px-6 py-2 rounded-full font-bold text-[14px] shadow-sm hover:shadow-main/20 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
