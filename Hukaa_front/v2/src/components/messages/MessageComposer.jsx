// src/components/messages/MessageComposer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, X, FileText } from 'lucide-react';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const MessageComposer = ({ onSend }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState([]); // { file, previewUrl, type, name, size }
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() || attachments.length > 0) {
      onSend(text.trim(), attachments.length > 0 ? attachments : null);
      setText('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newAttachments = files.map(file => {
        const isImage = file.type.startsWith('image/');
        return {
          file,
          previewUrl: isImage ? URL.createObjectURL(file) : null,
          type: isImage ? 'image' : 'document',
          name: file.name,
          size: formatFileSize(file.size)
        };
      });
      setAttachments(prev => [...prev, ...newAttachments]);
    }
    e.target.value = '';
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      if (newAttachments[indexToRemove].previewUrl) {
        URL.revokeObjectURL(newAttachments[indexToRemove].previewUrl);
      }
      newAttachments.splice(indexToRemove, 1);
      return newAttachments;
    });
  };

  return (
    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      {/* Attachments Preview Area */}
      {attachments.length > 0 && (
        <div className="mb-3 flex gap-2 overflow-x-auto custom-scrollbar pb-2">
          {attachments.map((att, index) => (
            <div key={index} className="relative inline-block shrink-0">
              {att.type === 'image' ? (
                <img
                  src={att.previewUrl}
                  alt={`Preview ${index}`}
                  className="h-20 w-auto rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="h-20 w-32 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                  <FileText size={24} className="text-gray-500 mb-1" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300 truncate w-full text-center">
                    {att.name}
                  </span>
                  <span className="text-[9px] text-gray-500">
                    {att.size}
                  </span>
                </div>
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-900 transition-colors z-10"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end bg-gray-100 dark:bg-[#202327] rounded-2xl p-2 min-h-[48px]">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
        />

        {/* Actions */}
        <div className="flex items-center space-x-1 pb-1 px-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-main hover:bg-main/10 rounded-full transition-colors"
          >
            <Paperclip size={20} />
          </button>

        </div>

        {/* Input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          className="flex-1 max-h-[120px] bg-transparent resize-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 py-2.5 px-3 custom-scrollbar min-h-[40px] leading-5"
          rows={1}
        />

        {/* Send Button */}
        <div className="pb-1 pr-1 pl-2">
          <button
            onClick={handleSend}
            disabled={!text.trim() && attachments.length === 0}
            className={`p-2 rounded-full flex items-center justify-center transition-colors ${(text.trim() || attachments.length > 0)
              ? 'bg-main text-white hover:bg-main/80'
              : 'bg-main/50 text-white/70 cursor-not-allowed'
              }`}
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
