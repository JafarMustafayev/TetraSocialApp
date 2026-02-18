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
        <div className="image-cropper-modal" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="cropper-container" style={{
                position: 'relative',
                width: '100%',
                maxWidth: '600px',
                height: '400px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteInternal}
                    onZoomChange={onZoomChange}
                />
            </div>
            <div className="cropper-controls" style={{
                marginTop: '20px',
                display: 'flex',
                gap: '10px',
                width: '100%',
                maxWidth: '600px',
                justifyContent: 'center'
            }}>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleConfirm}>Crop & Save</button>
            </div>
        </div>
    );
};

export default ImageCropper;
