// src/components/messages/ImageModal.jsx
import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-4 z-50">
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={24} />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={24} />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-full transition-colors ml-4"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden w-full">
        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-40"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* Image Container */}
        <div className="w-full h-full flex items-center justify-center overflow-auto custom-scrollbar p-4 relative z-30">
          <img
            src={currentImage.previewUrl || currentImage}
            alt={`Full screen preview ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${scale})` }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
          />
        </div>

        {/* Right Arrow */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-40"
          >
            <ChevronRight size={32} />
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
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-16 w-16 shrink-0 cursor-pointer rounded-md overflow-hidden transition-all duration-200 ${currentIndex === idx
                  ? 'ring-2 ring-main opacity-100 scale-110'
                  : 'opacity-50 hover:opacity-80'
                  }`}
              >
                <img
                  src={img.previewUrl || img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageModal;
