// src/components/ui/ImageModal.jsx
import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const ImageModal = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);

  // Reset scale when image changes
  useEffect(() => {
    setScale(1);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext(e);
      if (e.key === 'ArrowLeft') handlePrev(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onClose]);

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 4)); // max zoom 4x
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 0.5)); // min zoom 0.5x
  };

  if (!images || images.length === 0) return null;

  const currentItem = images[currentIndex];
  
  // Extract URL
  const getMediaUrl = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.url || item.previewUrl;
  };

  const mediaUrl = getMediaUrl(currentItem);

  // Check if current item is a video
  const isVideo = currentItem?.isVideo || 
                  currentItem?.type?.startsWith('video/') || 
                  (typeof currentItem === 'string' && (/\.(mp4|webm|ogg|mov|quicktime)$/i.test(currentItem) || currentItem.startsWith('data:video/')));

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!mediaUrl) return;

    try {
      // If it is a local blob URL or data URL, download it directly
      if (mediaUrl.startsWith('blob:') || mediaUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = mediaUrl;
        link.download = `media-${Date.now()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // For other urls, try fetching as blob to bypass CORS/download restrictions
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `media-${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: open in new tab
      window.open(mediaUrl, '_blank');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-3 z-50">
        <button
          onClick={handleDownload}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
          title="Download"
        >
          <Download size={20} />
        </button>
        
        {!isVideo && (
          <>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
          </>
        )}
        
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-xl transition-colors ml-2 cursor-pointer"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden w-full">
        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 bg-black/50 hover:bg-black/85 text-white rounded-full transition-colors z-45 cursor-pointer border border-white/5"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Content Container */}
        <div className="w-full h-full flex items-center justify-center overflow-auto custom-scrollbar p-4 relative z-30">
          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="max-w-full max-h-[85vh] md:max-h-full object-contain rounded-lg transition-transform duration-200"
              style={{ transform: `scale(${scale})` }}
              onClick={(e) => e.stopPropagation()} // Prevent closing modal on video click
            />
          ) : (
            <img
              src={mediaUrl}
              alt={`Full screen preview ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] md:max-h-full object-contain transition-transform duration-200 select-none"
              style={{ transform: `scale(${scale})` }}
              onClick={(e) => e.stopPropagation()} // Prevent closing modal on image click
            />
          )}
        </div>

        {/* Right Arrow */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 p-3 bg-black/50 hover:bg-black/85 text-white rounded-full transition-colors z-45 cursor-pointer border border-white/5"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div
          className="h-24 bg-black/80 w-full flex items-center justify-center px-4 py-2 z-40 border-t border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2 overflow-x-auto custom-scrollbar h-full items-center px-4 max-w-full">
            {images.map((item, idx) => {
              const url = getMediaUrl(item);
              const isItemVideo = item?.isVideo || 
                                  item?.type?.startsWith('video/') || 
                                  (typeof item === 'string' && (/\.(mp4|webm|ogg|mov|quicktime)$/i.test(item) || item.startsWith('data:video/')));
              return (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-16 w-16 shrink-0 cursor-pointer rounded-md overflow-hidden transition-all duration-200 ${currentIndex === idx
                    ? 'ring-2 ring-main opacity-100 scale-110'
                    : 'opacity-50 hover:opacity-85'
                    }`}
                >
                  {isItemVideo ? (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white relative">
                      <div className="absolute inset-0 bg-black/30" />
                      <i className="ri-play-fill text-xl z-10"></i>
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageModal;
