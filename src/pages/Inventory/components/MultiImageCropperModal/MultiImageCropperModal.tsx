import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import '../../styles/MultiImageCropperModal.css';

interface CroppableImage {
    id: string;
    src: string;
    croppedFile?: File;
    isCropped: boolean;
}

interface MultiImageCropperModalProps {
    isOpen: boolean;
    images: CroppableImage[];
    onCropComplete: (croppedImages: File[]) => void;
    onClose: () => void;
}

export const MultiImageCropperModal: React.FC<MultiImageCropperModalProps> = ({
    isOpen,
    images,
    onCropComplete,
    onClose,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedImages, setCroppedImages] = useState<Map<string, File>>(new Map());

    const currentImage = images[currentIndex];

    const onCropCompleteCallback = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', error => reject(error));
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<File> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
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

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error('Canvas is empty');
                }
                const file = new File([blob], `cropped-image-${Date.now()}.jpg`, { type: 'image/jpeg' });
                resolve(file);
            }, 'image/jpeg', 0.95);
        });
    };

    const handleCropImage = async () => {
        if (!croppedAreaPixels || !currentImage) return;

        try {
            const croppedImage = await getCroppedImg(currentImage.src, croppedAreaPixels);
            setCroppedImages(prev => new Map(prev).set(currentImage.id, croppedImage));
        } catch (e) {
            console.error('Error cropping image:', e);
        }
    };

    const handleSkipImage = () => {
        // Skip this image and move to next
        moveToNextImage();
    };

    const moveToNextImage = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            resetCropperState();
        }
    };

    const resetCropperState = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
    };

    const handleFinish = () => {
        const finalCroppedImages: File[] = [];
        
        // Add cropped images for those that were cropped
        croppedImages.forEach(file => {
            finalCroppedImages.push(file);
        });

        // Add uncropped images (if any were skipped)
        images.forEach(img => {
            if (!croppedImages.has(img.id) && img.croppedFile) {
                finalCroppedImages.push(img.croppedFile);
            }
        });

        onCropComplete(finalCroppedImages);
    };

    if (!isOpen || images.length === 0) return null;

    const progress = Math.round(((currentIndex + 1) / images.length) * 100);
    const isCroppedInSession = croppedImages.has(currentImage.id);

    return (
        <div className="multi-cropper-modal-overlay">
            <div className="multi-cropper-modal-content">
                <div className="multi-cropper-modal-header">
                    <h3>Ajustar Imágenes</h3>
                    <button className="multi-cropper-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="multi-cropper-progress">
                    <span className="progress-text">Imagen {currentIndex + 1} de {images.length}</span>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="multi-cropper-container">
                    <Cropper
                        image={currentImage.src}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropCompleteCallback}
                        onZoomChange={setZoom}
                    />
                </div>

                <div className="multi-cropper-controls">
                    <label className="multi-cropper-label">
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

                <div className="multi-cropper-modal-footer">
                    <button className="multi-cropper-btn-cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <div className="multi-cropper-btn-group">
                        <button 
                            className="multi-cropper-btn-skip" 
                            onClick={handleSkipImage}
                            disabled={currentIndex === images.length - 1}
                            title={currentIndex === images.length - 1 ? "Presiona Aplicar para continuar" : "Saltar esta imagen"}
                        >
                            Saltar
                        </button>
                        {isCroppedInSession ? (
                            <button className="multi-cropper-btn-recrop" onClick={handleCropImage}>
                                Recortar de nuevo
                            </button>
                        ) : (
                            <button className="multi-cropper-btn-crop" onClick={handleCropImage}>
                                Aplicar corte
                            </button>
                        )}
                        {currentIndex === images.length - 1 ? (
                            <button className="multi-cropper-btn-finish" onClick={handleFinish}>
                                Finalizar
                            </button>
                        ) : (
                            <button 
                                className="multi-cropper-btn-next" 
                                onClick={moveToNextImage}
                                disabled={!isCroppedInSession}
                                title={!isCroppedInSession ? "Corta la imagen primero" : "Ir a la siguiente imagen"}
                            >
                                Siguiente
                            </button>
                        )}
                    </div>
                </div>

                <div className="multi-cropper-thumbnails">
                    {images.map((img, idx) => (
                        <div
                            key={img.id}
                            className={`thumbnail ${idx === currentIndex ? 'active' : ''} ${croppedImages.has(img.id) ? 'cropped' : ''}`}
                            onClick={() => {
                                setCurrentIndex(idx);
                                resetCropperState();
                            }}
                        >
                            <img src={img.src} alt={`Preview ${idx + 1}`} />
                            {croppedImages.has(img.id) && (
                                <div className="cropped-badge">✓</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
