import React from 'react';

const MessageBubble = ({ msg, isSender }) => {
    const renderStatusIcon = () => {
        if (!isSender) return null;
        return (
            <i className={`ri-check-double-line text-[14px] ml-1.5 ${msg.isRead ? 'text-blue-500' : 'text-gray-400'}`}></i>
        );
    };

    const renderContent = () => {
        if (msg.type === 2) {
            return <em className="text-gray-500 italic">post shared</em>;
        }
        return msg.content || msg.text;
    };

    const timeString = msg.sentAt
        ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        : '';

    return (
        <div className={`flex w-full mb-1.5 ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className={`
                relative px-3 pt-2 pb-1 bg-white dark:bg-[#202c33] 
                rounded-2xl shadow-sm max-w-[85%] md:max-w-[75%] lg:max-w-[65%]
                ${isSender
                    ? 'bg-[#dcf8c6] dark:bg-[#005c4b] rounded-tr-none ml-8 md:ml-12'
                    : 'bg-white dark:bg-[#202c33] rounded-tl-none mr-8 md:mr-12'
                }
            `}>
                <div className="text-[14.5px] leading-[1.4] text-gray-800 dark:text-gray-100 break-words break-all whitespace-pre-wrap overflow-hidden">
                    {renderContent()}
                    {/* Invisible spacer for the absolute positioned time/status */}
                    <span className="inline-block w-[60px] h-4"></span>
                </div>

                <div className="absolute bottom-1 right-2 flex items-center select-none">
                    <span className={`text-[10px] font-medium ${isSender ? 'text-gray-500/80 dark:text-gray-300/60' : 'text-gray-400 dark:text-gray-400/70'}`}>
                        {timeString}
                    </span>
                    {renderStatusIcon()}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
