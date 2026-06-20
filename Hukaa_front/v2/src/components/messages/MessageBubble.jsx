// src/components/messages/MessageBubble.jsx
import React, { useState } from 'react';
import { Check, CheckCheck, FileText, Download, Copy, Check as CheckIcon } from 'lucide-react';
import { formatMessageTime } from '../../utils/dateFormatter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageBubble = ({ message, isFirstInGroup, onImageClick }) => {
  const timeStr = formatMessageTime(message.createdAt);
  const [copiedCode, setCopiedCode] = useState(null);

  const renderStatus = () => {
    if (!message.isMine) return null;
    if (message.status === 'read') {
      return <CheckCheck size={14} className="text-[#34B7F1] ml-1" />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck size={14} className="text-gray-400 ml-1" />;
    }
    return <Check size={14} className="text-gray-400 ml-1" />;
  };

  const tailClass = isFirstInGroup
    ? (message.isMine ? "rounded-tr-sm" : "rounded-tl-sm")
    : "";

  const attachments = message.attachments || [];
  const legacyImages = message.imageUrls ? message.imageUrls.map(url => ({ type: 'image', previewUrl: url })) : [];
  const allAttachments = [...legacyImages, ...attachments];

  const images = allAttachments.filter(a => a.type === 'image');
  const documents = allAttachments.filter(a => a.type === 'document');

  const handleImageClick = (index) => {
    if (onImageClick) {
      onImageClick(images, index);
    }
  };

  const renderImageGrid = () => {
    if (images.length === 0) return null;

    if (images.length === 1) {
      return (
        <img
          src={images[0].previewUrl}
          alt="Attachment"
          onClick={() => handleImageClick(0)}
          className="w-full h-auto rounded-lg object-cover cursor-pointer max-h-[300px] mb-1"
        />
      );
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 mb-1">
          {images.map((img, idx) => (
            <img
              key={idx}
              onClick={() => handleImageClick(idx)}
              src={img.previewUrl}
              alt="Attachment"
              className="w-full h-32 object-cover rounded-lg cursor-pointer"
            />
          ))}
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="flex flex-col gap-1 mb-1">
          <img
            onClick={() => handleImageClick(0)}
            src={images[0].previewUrl}
            alt="Attachment"
            className="w-full h-40 object-cover rounded-lg cursor-pointer"
          />
          <div className="grid grid-cols-2 gap-1">
            <img
              onClick={() => handleImageClick(1)}
              src={images[1].previewUrl}
              alt="Attachment"
              className="w-full h-24 object-cover rounded-lg cursor-pointer"
            />
            <img
              onClick={() => handleImageClick(2)}
              src={images[2].previewUrl}
              alt="Attachment"
              className="w-full h-24 object-cover rounded-lg cursor-pointer"
            />
          </div>
        </div>
      );
    }

    // 4 or more images
    const extraCount = images.length - 4;
    return (
      <div className="grid grid-cols-2 gap-1 mb-1">
        {images.slice(0, 4).map((img, idx) => (
          <div
            key={idx}
            className="relative w-full h-24 cursor-pointer"
            onClick={() => handleImageClick(idx)}
          >
            <img src={img.previewUrl} alt="Attachment" className="w-full h-full object-cover rounded-lg" />
            {idx === 3 && extraCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg hover:bg-black/40 transition-colors">
                <span className="text-white text-xl font-semibold">+{extraCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderDocuments = () => {
    if (documents.length === 0) return null;

    return (
      <div className="flex flex-col gap-1.5 mb-2 w-full">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${message.isMine
              ? 'bg-black/10 border-transparent hover:bg-black/20'
              : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            <div className={`p-2 rounded-full mr-3 ${message.isMine ? 'bg-white/20 text-white' : 'bg-main/10 text-main'}`}>
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-sm font-semibold truncate leading-tight mb-0.5">
                {doc.name}
              </h4>
              <p className={`text-[11px] uppercase ${message.isMine ? 'text-white/80' : 'text-gray-500'}`}>
                {doc.size || 'DOCUMENT'}
              </p>
            </div>
            <div className={`p-1.5 rounded-full ${message.isMine ? 'hover:bg-white/20' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
              <Download size={16} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderFormattedText = () => {
    if (!message.text) return null;

    return (
      <div className="relative text-[15px] leading-snug break-words [overflow-wrap:anywhere] [word-break:break-word] after:content-[''] after:inline-block after:w-[50px] after:h-[15px] [&>span:last-child]:inline">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => (
              <span className="block mb-1" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
            ),
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              if (inline) {
                return (
                  <code className="rounded bg-black/10 dark:bg-white/10 px-1 py-0.5 text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <div className="my-2 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-700/50 shadow-sm min-w-0 max-w-full block">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#2d2d2d] border-b border-gray-700/50">
                    <span className="text-xs text-gray-400 uppercase font-mono">{match?.[1] || "text"}</span>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar text-[13px]">
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match?.[1] || "text"}
                      PreTag="div"
                      customStyle={{ margin: 0, padding: "12px", background: "transparent" }}
                      wrapLongLines={false}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            },
          }}
        >
          {message.text}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col w-full mb-1 ${message.isMine ? 'items-end' : 'items-start'} ${isFirstInGroup ? 'mt-2' : ''}`}
    >
      <div
        className={`relative flex flex-col max-w-[85%] md:max-w-[65%] px-2 pt-2 pb-1.5 rounded-2xl ${tailClass} ${message.isMine
          ? 'bg-main text-white'
          : 'bg-white dark:bg-[#202327] text-gray-900 dark:text-gray-100'
          } shadow-sm`}
      >
        {/* Render Grid Images */}
        {renderImageGrid()}

        {/* Render Documents */}
        {renderDocuments()}

        {/* Render Formatted Text (with Code Blocks) */}
        {message.text && (
          <div className="px-1.5 pb-1">
            {renderFormattedText()}
          </div>
        )}

        {/* If no text but there is a grid or doc, we still need space for time */}
        {!message.text && (images.length > 0 || documents.length > 0) && (
          <div className="h-4 w-12" />
        )}

        {/* Metadata (Time & Status) */}
        <div className="absolute bottom-1.5 right-2 flex items-center h-[16px] bg-transparent rounded-full px-1">
          <span
            className={`text-[11px] ${message.isMine
              ? 'text-white/90'
              : 'text-gray-500 dark:text-gray-400'
              }`}
            style={{
              textShadow: (images.length > 0 && !message.text && !documents.length) ? '0px 0px 4px rgba(0,0,0,0.5)' : 'none',
              color: (images.length > 0 && !message.text && !documents.length) ? '#ffffff' : undefined
            }}
          >
            {timeStr}
          </span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
