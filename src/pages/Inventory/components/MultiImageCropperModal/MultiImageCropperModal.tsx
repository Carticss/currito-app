import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
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

export const MultiImageCropperModal: React.FC<MultiImageCropperModalProps> = ({
    isOpen,
    images,
    onCropComplete,
    onClose,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [zoom, setZoom] = useState(1);
    const [croppedImages, setCroppedImages] = useState<Map<string, File>>(new Map());
    const [baseDimensions, setBaseDimensions] = useState<{ width: number; height: number }>();

    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentImage = images[currentIndex];

    // Reset when switching images or opening modal
    useEffect(() => {
        if (isOpen) {
            resetCropperState();
        }
    }, [isOpen, currentIndex, images]);

    const resetCropperState = () => {
        setZoom(1);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setBaseDimensions(undefined);
    };

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const img = e.currentTarget;
        const { naturalWidth, naturalHeight } = img;

        if (containerRef.current) {
            const { clientWidth, clientHeight } = containerRef.current;
            const padding = 20;
            const availableWidth = clientWidth - padding;
            const availableHeight = clientHeight - padding;

            const scale = Math.min(
                availableWidth / naturalWidth,
                availableHeight / naturalHeight
            );

            // Ensure scale doesn't stretch small images unnecessarily if we want default "contain" behavior
            // But usually we DO want to fit to container for better visibility
            setBaseDimensions({
                width: naturalWidth * scale,
                height: naturalHeight * scale
            });

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

    const handleCropImage = async () => {
        if (!completedCrop || !currentImage || !imgRef.current) return;

        try {
            const croppedImage = await getCroppedImg(
                imgRef.current,
                completedCrop,
                `cropped-image-${Date.now()}.jpg`
            );
            setCroppedImages(prev => new Map(prev).set(currentImage.id, croppedImage));
        } catch (e) {
            console.error('Error cropping image:', e);
        }
    };

    const handleSkipImage = () => {
        moveToNextImage();
    };

    const moveToNextImage = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleFinish = () => {
        const finalCroppedImages: File[] = [];
        croppedImages.forEach(file => finalCroppedImages.push(file));
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

    // Check for cached images or race conditions where onLoad might be missed or container not ready
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete && baseDimensions === undefined) {
            // Force a "load" event essentially
            const fakeEvent = { currentTarget: imgRef.current } as React.SyntheticEvent<HTMLImageElement>;
            onImageLoad(fakeEvent);
        }
    }, [currentIndex, isOpen, zoom]); // Check when image index changes or modal opens

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

                <div className="multi-cropper-container" ref={containerRef}>
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={undefined}
                        style={{
                            maxWidth: baseDimensions ? 'none' : '100%',
                            maxHeight: baseDimensions ? 'none' : '100%'
                        }}
                    >
                        <img
                            ref={imgRef}
                            src={currentImage.src}
                            alt={`Preview ${currentIndex + 1}`}
                            style={{
                                width: baseDimensions ? baseDimensions.width * zoom : undefined,
                                height: baseDimensions ? baseDimensions.height * zoom : undefined,
                                maxWidth: baseDimensions ? 'none' : '100%',
                                maxHeight: baseDimensions ? 'none' : '100%',
                                objectFit: 'contain'
                            }}
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                </div>

                {/* <div className="multi-cropper-controls">
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
                </div> */}

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
