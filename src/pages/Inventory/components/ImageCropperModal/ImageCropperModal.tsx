import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import '../../styles/ImageCropperModal.css';

interface ImageCropperModalProps {
    isOpen: boolean;
    imageSrc: string;
    onCropComplete: (croppedImage: File) => void;
    onClose: () => void;
}

// Helper to center the crop initially
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect?: number) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 50,
            },
            aspect || 16 / 9,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ isOpen, imageSrc, onCropComplete, onClose }) => {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [zoom, setZoom] = useState(1);
    const [baseDimensions, setBaseDimensions] = useState<{ width: number; height: number }>();
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset state when opening new image
    useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setCrop(undefined);
            setCompletedCrop(undefined);
            setBaseDimensions(undefined);
        }
    }, [isOpen, imageSrc]);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const img = e.currentTarget;
        const { naturalWidth, naturalHeight } = img;

        // Calculate containment within the container
        if (containerRef.current) {
            const { clientWidth, clientHeight } = containerRef.current;
            // Add some padding to not touch edges exactly if desired, or 0 for full fit
            const padding = 20;
            const availableWidth = clientWidth - padding;
            const availableHeight = clientHeight - padding;

            const scale = Math.min(
                availableWidth / naturalWidth,
                availableHeight / naturalHeight
            );

            setBaseDimensions({
                width: naturalWidth * scale,
                height: naturalHeight * scale
            });

            // Initial crop
            const initialCrop = centerAspectCrop(naturalWidth * scale, naturalHeight * scale, undefined);
            setCrop(initialCrop);
        }
    }

    const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop, fileName: string): Promise<File> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const pixelRatio = window.devicePixelRatio;
        canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        const cropX = crop.x * scaleX;
        const cropY = crop.y * scaleY;

        ctx.save();

        // Move the crop origin to the canvas origin (0,0)
        ctx.translate(-cropX, -cropY);

        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
        );

        ctx.restore();

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                const file = new File([blob], fileName, { type: 'image/png' });
                resolve(file);
            }, 'image/png');
        });
    };

    const handleCrop = async () => {
        if (!completedCrop || !imgRef.current) return;

        try {
            const croppedImage = await getCroppedImg(
                imgRef.current,
                completedCrop,
                'cropped-image.jpg'
            );
            onCropComplete(croppedImage);
        } catch (e) {
            console.error('Error cropping image:', e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="cropper-modal-overlay">
            <div className="cropper-modal-content">
                <div className="cropper-modal-header">
                    <h3>Ajustar Imagen</h3>
                    <button className="cropper-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="cropper-container" ref={containerRef}>
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={undefined} // Free form
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop me"
                            style={{
                                width: baseDimensions ? baseDimensions.width * zoom : '100%',
                                height: baseDimensions ? baseDimensions.height * zoom : 'auto',
                                maxWidth: 'none', // Ensure it can grow
                                maxHeight: 'none'
                            }}
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                </div>

                <div className="cropper-controls">
                    <label className="cropper-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                        Zoom
                    </label>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="zoom-slider"
                    />
                </div>

                <div className="cropper-modal-footer">
                    <button className="cropper-btn-cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="cropper-btn-save" onClick={handleCrop}>
                        Aplicar
                    </button>
                </div>
            </div>
        </div>
    );
};
