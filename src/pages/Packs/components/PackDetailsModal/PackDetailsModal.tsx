import React from 'react';
import type { Pack } from '../../types/types';
import '../../styles/PackDetailsModal.css';

interface PackDetailsModalProps {
    pack: Pack;
    onClose: () => void;
    formatPrice: (price: number) => string;
    onToggleAvailability: (packId: string) => void;
    onEdit: (pack: Pack) => void;
    loadingPackId: string | null;
}

export const PackDetailsModal: React.FC<PackDetailsModalProps> = ({
    pack,
    onClose,
    formatPrice,
    onToggleAvailability,
    onEdit,
    loadingPackId
}) => {
    const isToggling = loadingPackId === pack._id;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="pack-details-overlay" onClick={handleOverlayClick}>
            <div className="pack-details-modal">
                <div className="pack-details-header">
                    <h3>{pack.name}</h3>
                    <button className="pack-details-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="pack-details-body">
                    <div className="pack-details-image-section">
                        {pack.photoUrls && pack.photoUrls.length > 0 ? (
                            <div className="pack-details-images">
                                {pack.photoUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`${pack.name} ${index + 1}`}
                                        className="pack-details-image"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="pack-details-no-image">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="pack-details-info">
                        <div className="pack-details-row">
                            <div>
                                <div className="pack-details-label">Precio</div>
                                <div className="pack-details-value">
                                    <strong>${formatPrice(pack.priceInCents)}</strong>
                                </div>
                            </div>
                            <div>
                                <div className="pack-details-label">Estado</div>
                                <div className="pack-details-value">
                                    <span className={`status-badge ${pack.available ? 'available' : 'unavailable'}`}>
                                        {pack.available ? 'Disponible' : 'No disponible'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {pack.description && (
                            <div>
                                <div className="pack-details-label">Descripción</div>
                                <div className="pack-details-description">{pack.description}</div>
                            </div>
                        )}

                        <div className="pack-details-products-section">
                            <div className="pack-details-products-title">
                                Productos incluidos ({pack.products.length})
                            </div>
                            <div className="pack-details-products-list">
                                {pack.products.map((product, index) => (
                                    <div key={index} className="pack-details-product-item">
                                        <span className="pack-details-product-name">
                                            Producto {index + 1}
                                        </span>
                                        <span className="pack-details-product-qty">
                                            x{product.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pack-details-footer">
                    <button
                        className={`pack-details-btn toggle ${isToggling ? 'loading' : ''}`}
                        onClick={() => onToggleAvailability(pack._id)}
                        disabled={isToggling}
                    >
                        {isToggling ? 'Cambiando...' : (pack.available ? 'Desactivar' : 'Activar')}
                    </button>
                    <button
                        className="pack-details-btn edit"
                        onClick={() => onEdit(pack)}
                    >
                        Editar Pack
                    </button>
                </div>
            </div>
        </div>
    );
};
