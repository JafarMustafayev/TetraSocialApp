// src/components/feed/post-content.jsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ImageModal from '../ui/ImageModal';

const PostContent = ({ content, media, expanded = true, isLongText = false, setExpanded }) => {
    const [galleryData, setGalleryData] = useState(null);

    const processText = (text) => {
        if (!text) return '';
        return text
            .replace(/(^|\s)@(\w+)/g, '$1[@$2](mention:$2)')
            .replace(/(^|\s)#(\w+)/g, '$1[#$2](hashtag:$2)');
    };

    const renderMedia = (mediaItems) => {
        if (!mediaItems || mediaItems.length === 0) return null;

        const getMediaInfo = (item) => {
            if (typeof item === 'string') {
                const isVideo = /\.(mp4|webm|ogg|mov|quicktime)$/i.test(item) || item.startsWith('data:video/');
                return { url: item, isVideo };
            }
            return {
                url: item.url || item.previewUrl,
                isVideo: item.type?.startsWith('video/')
            };
        };

        if (mediaItems.length === 1) {
            const { url, isVideo } = getMediaInfo(mediaItems[0]);
            return (
                <div 
                    className="mt-3 overflow-hidden rounded-xl border border-gray-150 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/40 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setGalleryData({ images: mediaItems, index: 0 });
                    }}
                >
                    {isVideo ? (
                        <video src={url} className="w-full max-h-[450px] object-cover pointer-events-none" />
                    ) : (
                        <img src={url} alt="Post media" className="w-full max-h-[500px] object-cover" />
                    )}
                </div>
            );
        }

        if (mediaItems.length === 2) {
            return (
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl overflow-hidden border border-gray-150 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/40">
                    {mediaItems.map((item, idx) => {
                        const { url, isVideo } = getMediaInfo(item);
                        return (
                            <div 
                                key={idx} 
                                className="relative aspect-video overflow-hidden cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setGalleryData({ images: mediaItems, index: idx });
                                }}
                            >
                                {isVideo ? (
                                    <video src={url} className="w-full h-full object-cover pointer-events-none" />
                                ) : (
                                    <img src={url} alt="Post media" className="w-full h-full object-cover" />
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (mediaItems.length === 3) {
            const item0 = getMediaInfo(mediaItems[0]);
            const item1 = getMediaInfo(mediaItems[1]);
            const item2 = getMediaInfo(mediaItems[2]);
            return (
                <div className="mt-3 grid grid-cols-2 gap-2 h-[280px] rounded-xl overflow-hidden border border-gray-150 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/40">
                    <div 
                        className="relative h-full overflow-hidden cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setGalleryData({ images: mediaItems, index: 0 });
                        }}
                    >
                        {item0.isVideo ? (
                            <video src={item0.url} className="w-full h-full object-cover pointer-events-none" />
                        ) : (
                            <img src={item0.url} alt="Post media" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="grid grid-rows-2 gap-2 h-full">
                        <div 
                            className="relative h-full overflow-hidden cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setGalleryData({ images: mediaItems, index: 1 });
                            }}
                        >
                            {item1.isVideo ? (
                                <video src={item1.url} className="w-full h-full object-cover pointer-events-none" />
                            ) : (
                                <img src={item1.url} alt="Post media" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div 
                            className="relative h-full overflow-hidden cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setGalleryData({ images: mediaItems, index: 2 });
                            }}
                        >
                            {item2.isVideo ? (
                                <video src={item2.url} className="w-full h-full object-cover pointer-events-none" />
                            ) : (
                                <img src={item2.url} alt="Post media" className="w-full h-full object-cover" />
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        const visibleItems = mediaItems.slice(0, 4);
        const extraCount = mediaItems.length - 4;

        return (
            <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-2 h-[320px] rounded-xl overflow-hidden border border-gray-150 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/40">
                {visibleItems.map((item, idx) => {
                    const { url, isVideo } = getMediaInfo(item);
                    return (
                        <div 
                            key={idx} 
                            className="relative h-full overflow-hidden cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setGalleryData({ images: mediaItems, index: idx });
                            }}
                        >
                            {isVideo ? (
                                <video src={url} className="w-full h-full object-cover pointer-events-none" />
                            ) : (
                                <img src={url} alt="Post media" className="w-full h-full object-cover" />
                            )}
                            {idx === 3 && extraCount > 0 && (
                                <div className="absolute inset-0 bg-black/60 hover:bg-black/50 transition-colors flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="text-white text-2xl font-black">+{extraCount}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="text-[15px] text-gray-900 dark:text-white leading-normal break-words [overflow-wrap:anywhere] [word-break:break-word]">
            {content && (
                <div className={(!expanded && isLongText) ? 'max-h-[160px] overflow-hidden relative' : 'relative'}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ node, ...props }) => (
                                <p className="mb-2 last:mb-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word]" {...props} />
                            ),
                            a: ({ href, children, ...props }) => {
                                if (href && (href.startsWith('mention:') || href.startsWith('hashtag:'))) {
                                    return (
                                        <span className="text-main hover:underline cursor-pointer font-medium break-words">
                                            {children}
                                        </span>
                                    );
                                }
                                return (
                                    <a className="text-main hover:underline break-all" target="_blank" rel="noopener noreferrer" href={href} {...props}>
                                        {children}
                                    </a>
                                );
                            },
                            code({ inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "");
                                const isInline = inline || !match;
                                if (isInline) {
                                    return (
                                        <code className="rounded bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[14px] font-mono text-main dark:text-main break-all break-words whitespace-pre-wrap" {...props}>
                                            {children}
                                        </code>
                                    );
                                }

                                return (
                                    <div className="my-3 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-800 shadow-md min-w-0 max-w-full block">
                                        <div className="flex items-center justify-between px-3 py-1.5 bg-[#2d2d2d] border-b border-gray-850">
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
                        {processText(content)}
                    </ReactMarkdown>
                    {!expanded && isLongText && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-[#09090b] to-transparent pointer-events-none" />
                    )}
                </div>
            )}

            {isLongText && setExpanded && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                    className="text-main hover:underline mt-1 text-[15px] font-medium block"
                >
                    {expanded ? 'Show less' : 'Show more'}
                </button>
            )}

            {renderMedia(media)}

            {/* Image/Video Modal */}
            {galleryData && (
                <ImageModal
                    images={galleryData.images}
                    initialIndex={galleryData.index}
                    onClose={() => setGalleryData(null)}
                />
            )}
        </div>
    );
};

export default PostContent;
