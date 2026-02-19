import React, { useEffect, useState } from 'react';

const ImageGalleryPopup = ({ isOpen, onClose, media = [], initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') nextMedia();
            if (e.key === 'ArrowLeft') prevMedia();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, currentIndex, onClose]);

    if (!isOpen || media.length === 0) return null;

    const nextMedia = () => setCurrentIndex((prev) => (prev + 1) % media.length);
    const prevMedia = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);

    const currentItem = media[currentIndex];

    return (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xl z-2000 flex flex-col items-center justify-center animate-fade-in">
            {/* Header / Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                <div className="text-white/90 font-bold bg-white/10 px-5 py-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl tracking-wide text-sm">
                    {currentIndex + 1} <span className="text-white/40 mx-1">/</span> {media.length}
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onClose}
                        className="w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-red-500/20 text-white rounded-xl transition-all border border-white/10 backdrop-blur-md group hover:border-red-500/30"
                    >
                        <i className="ri-close-line text-2xl group-hover:scale-110 transition-transform"></i>
                    </button>
                </div>
            </div>

            {/* Media Container */}
            <div className="relative w-full h-[calc(100%-180px)] flex items-center justify-center px-4 md:px-20">
                {/* Navigation Buttons */}
                {media.length > 1 && (
                    <>
                        <button
                            onClick={prevMedia}
                            className="absolute left-6 md:left-10 w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-2xl  transition-all border backdrop-blur-sm z-50 hover:scale-105 active:scale-95 group"
                        >
                            <i className="ri-arrow-left-s-line text-3xl group-hover:-translate-x-1 transition-transform"></i>
                        </button>
                        <button
                            onClick={nextMedia}
                            className="absolute right-6 md:right-10 w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all  backdrop-blur-sm z-50 hover:scale-105 active:scale-95 group"
                        >
                            <i className="ri-arrow-right-s-line text-3xl group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    </>
                )}

                <div className="max-w-7xl h-full flex items-center justify-center animate-zoom-in">
                    {currentItem.type === 'video' ? (
                        <video
                            //src={currentItem.url} 
                            src={`"C:/Users/quliy/Pictures/WhatsApp Video 2026-02-19 at 9.50.08 PM.mp4"`}
                            className="max-w-full max-h-full shadow-2xl rounded-2xl border border-white/10"
                            controls
                            autoPlay
                        />
                    ) : (
                        <img
                            //src={currentItem.url} 
                            src={`https://localhost:7124/posts/images/0efe2d7e-9b1b-4a5f-826d-1e229c2f58fe.jpg`}
                            alt={`Gallery item ${currentIndex}`}
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl border border-white/10"
                        />
                    )}
                </div>
            </div>

            {/* Thumbnails Feed */}
            {media.length > 1 && (
                <div className="h-24 mt-8 mb-4 flex items-center justify-center px-4 w-full">
                    <div className="flex space-x-3 p-3 bg-white/5 rounded-[24px] backdrop-blur-md border border-white/5 overflow-x-auto max-w-full no-scrollbar">
                        {media.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 relative group ${idx === currentIndex ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/30' : 'border-transparent opacity-40 hover:opacity-100'}`}
                            >
                                {item.type === 'video' ? (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                        <i className="ri-play-fill text-white text-xs"></i>
                                    </div>
                                ) : (
                                    <img src={item.url} className="w-full h-full object-cover" alt="thumbnail" />
                                )}
                                {idx === currentIndex && (
                                    <div className="absolute inset-0 bg-blue-500/10"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGalleryPopup;
