import React, { useState } from 'react';
import './InventoryDetailsModal.css';
import type { Product } from '../../types/types';

interface InventoryDetailsModalProps {
    product: Product;
    onClose: () => void;
    formatPrice: (price: number) => string;
    onToggleAvailability: (id: string) => void;
    onEdit: (product: Product) => void;
    loadingProductId: string | null;
}

export const InventoryDetailsModal: React.FC<InventoryDetailsModalProps> = ({
    product,
    onClose,
    formatPrice,
    onToggleAvailability,
    onEdit,
    loadingProductId
}) => {
    const [showAllTags, setShowAllTags] = useState(false);
    const validTags = product.tags.filter(tag => tag !== null);
    const displayedTags = showAllTags ? validTags : validTags.slice(0, 1);
    const hasMoreTags = validTags.length > 1;

    return (
        <div className="inventory-modal-overlay" onClick={onClose}>
            <div className="inventory-modal-content" onClick={e => e.stopPropagation()}>
                <div className="inventory-modal-header">
                    <div className="inventory-modal-header-cols">
                        <span className="header-label">PRECIO $</span>
                        <span className="header-label">SKU</span>
                        <span className="header-label">CATEGORÍA</span>
                    </div>
                    <div className="inventory-modal-header-values">
                        <span className="header-value">{formatPrice(product.priceInCents)}</span>
                        <span className="header-value">{product.sku}</span>
                        <span className="header-value">{product.categoryId?.name || 'Sin categoría'}</span>
                    </div>
                </div>

                <div className="inventory-modal-section">
                    <div className="inventory-modal-row">
                        <div className="inventory-modal-col">
                            <span className="section-label">MARCA</span>
                            <span className="section-value">{product.brandId?.name || 'Sin marca'}</span>
                        </div>
                        <div className="inventory-modal-col right">
                            <span className="section-label">ETIQUETAS</span>
                            <div
                                className="tags-container"
                                onClick={() => hasMoreTags && setShowAllTags(!showAllTags)}
                                style={{ cursor: hasMoreTags ? 'pointer' : 'default' }}
                            >
                                {displayedTags.map(tag => (
                                    <span key={tag._id} className="modal-tag-badge">{tag.name}</span>
                                ))}
                                {!showAllTags && hasMoreTags && <span className="modal-tag-more">...</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inventory-modal-footer">
                    <div className="inventory-modal-col">
                        <span className="section-label">ESTADO</span>
                        <div className="status-container-modal">
                            <label className={`toggle-switch ${loadingProductId === product._id ? 'loading' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={product.available}
                                    onChange={() => onToggleAvailability(product._id)}
                                    disabled={loadingProductId === product._id}
                                />
                                <span className="slider"></span>
                            </label>
                            <span className={`status-text ${product.available ? 'available' : 'unavailable'}`}>
                                {product.available ? 'Disponible' : 'No disponible'}
                            </span>
                        </div>
                    </div>
                    <div className="inventory-modal-col right">
                        <span className="section-label">ACCIONES</span>
                        <button className="modal-edit-btn" onClick={() => onEdit(product)}>
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
