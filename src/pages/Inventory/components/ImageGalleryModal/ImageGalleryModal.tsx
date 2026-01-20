import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ImageGalleryModal.css';

interface ImageGalleryModalProps {
    isOpen: boolean;
    images: string[];
    productName: string;
    onClose: () => void;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
    isOpen,
    images,
    productName,
    onClose,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Reset to first image when modal opens
        if (isOpen) {
            setCurrentIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            
            if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, currentIndex, images.length]);

    if (!isOpen || images.length === 0) return null;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };

    const currentImage = images[currentIndex];

    const modalContent = (
        <div className="image-gallery-modal-overlay" onClick={onClose}>
            <div className="image-gallery-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="image-gallery-header">
                    <h3>{productName}</h3>
                    <button className="gallery-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="image-gallery-main">
                    <button
                        className="gallery-nav-btn gallery-nav-prev"
                        onClick={handlePrevious}
                        disabled={images.length === 1}
                        title="Imagen anterior (←)"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    <div className="gallery-image-container">
                        <img
                            src={currentImage}
                            alt={`${productName} ${currentIndex + 1}`}
                            className="gallery-image"
                        />
                        <div className="gallery-image-counter">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>

                    <button
                        className="gallery-nav-btn gallery-nav-next"
                        onClick={handleNext}
                        disabled={images.length === 1}
                        title="Siguiente imagen (→)"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>

                {images.length > 1 && (
                    <div className="gallery-thumbnails">
                        {images.map((image, idx) => (
                            <button
                                key={idx}
                                className={`gallery-thumbnail ${idx === currentIndex ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(idx)}
                                title={`Imagen ${idx + 1}`}
                            >
                                <img src={image} alt={`Thumbnail ${idx + 1}`} />
                            </button>
                        ))}
                    </div>
                )}

                <div className="gallery-keyboard-hint">
                    <span>← → Navegar | ESC Cerrar</span>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
