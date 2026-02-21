import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (error) => reject(error));
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            const file = new File([blob], 'cropped-image.png', { type: 'image/png' });
            resolve(file);
        }, 'image/png');
    });
};

const ImageCropper = ({ image, aspect, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = useCallback((crop) => {
        setCrop(crop);
    }, []);

    const onZoomChange = useCallback((zoom) => {
        setZoom(zoom);
    }, []);

    const onCropCompleteInternal = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        try {
            const croppedFile = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(croppedFile);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up mt-96">
            <div className="relative w-full h-[300px] md:h-[450px] bg-gray-900">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteInternal}
                    onZoomChange={onZoomChange}
                    classes={{
                        containerClassName: "rounded-t-3xl",
                    }}
                />
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 w-full space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span>Zoom</span>
                            <span>{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => onZoomChange(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#3644D9]"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            type="button"
                            className="flex-1 md:flex-none px-8 py-3 bg-gray-50 text-gray-500 rounded-xl font-bold hover:bg-gray-100 hover:text-gray-700 transition-all border border-gray-100"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="flex-1 md:flex-none px-10 py-3 bg-[#3644D9] text-white rounded-xl font-bold hover:bg-[#2E3AB8] hover:shadow-xl hover:shadow-blue-100 active:scale-[0.98] transition-all"
                            onClick={handleConfirm}
                        >
                            Crop & Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
