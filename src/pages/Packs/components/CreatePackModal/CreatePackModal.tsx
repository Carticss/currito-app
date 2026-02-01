import React from 'react';
import '../../styles/CreatePackModal.css';
import type { Pack } from '../../types/types';
import { useCreatePack } from '../../hooks/useCreatePack';
import { MultiImageCropperModal } from '../../../Inventory/components/MultiImageCropperModal/MultiImageCropperModal';
import { formatNumberDisplay } from '../../../../utils/formatting';

interface CreatePackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPackCreated: () => void;
    packToEdit?: Pack | null;
}

export const CreatePackModal: React.FC<CreatePackModalProps> = ({
    isOpen,
    onClose,
    onPackCreated,
    packToEdit
}) => {
    const { formState, cropperState, auxData, actions, uiState } = useCreatePack(() => {
        onPackCreated();
        onClose();
    }, packToEdit);

    if (!isOpen) return null;

    const handleDragStart = (e: React.DragEvent, productId: string) => {
        e.dataTransfer.setData('productId', productId);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const productId = e.dataTransfer.getData('productId');
        if (productId) {
            actions.handleAddProductById(productId);
        }
    };

    const handleImageAreaClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';
        input.onchange = (e) => {
            const event = e as any;
            const changeEvent = {
                target: {
                    files: event.target.files
                }
            } as React.ChangeEvent<HTMLInputElement>;
            actions.handleFileMultipleChange(changeEvent);
        };
        input.click();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{packToEdit ? 'Editar Pack' : 'Nuevo Pack'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {uiState.error && <div className="error-message">{uiState.error}</div>}

                    <div className="form-group">
                        <label>Imágenes del Pack</label>
                        <div className="image-upload-container">
                            <div
                                className={`image-upload-area ${formState.imagePreviews.length > 0 ? 'has-images' : ''}`}
                                onClick={handleImageAreaClick}
                            >
                                {formState.imagePreviews.length > 0 ? (
                                    <div className="image-gallery" onClick={(e) => e.stopPropagation()}>
                                        {formState.imagePreviews.map((preview, idx) => (
                                            <div key={idx} className="image-gallery-item">
                                                <img src={preview} alt={`Preview ${idx + 1}`} />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        actions.handleRemoveImage(idx);
                                                    }}
                                                    title="Eliminar imagen"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <div className="image-gallery-item add-more" onClick={handleImageAreaClick}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="image-placeholder-content">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                            <polyline points="21 15 16 10 5 21"></polyline>
                                        </svg>
                                        <span>Haz clic para subir imágenes</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Nombre del Pack <span className="required">*</span></label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ej: Pack Familiar"
                            value={formState.name}
                            onChange={(e) => formState.setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Descripción del pack..."
                            value={formState.description}
                            onChange={(e) => formState.setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Precio <span className="required">*</span></label>
                        <div className="price-input-group">
                            <span className="currency-symbol">$</span>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="0"
                                value={formatNumberDisplay(formState.price)}
                                onChange={(e) => formState.setPrice(e.target.value.replace(/[^\d.]/g, ''))}
                                min="0"
                                step="1"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Productos del Pack <span className="required">*</span></label>
                        <div className="products-selection">
                            <div className="available-products-section">
                                <span className="section-subtitle">Arrastra productos al pack</span>
                                <div className="available-products-list">
                                    {auxData.areProductsLoading ? (
                                        <div className="products-loading">Cargando productos...</div>
                                    ) : auxData.availableProducts.length === 0 ? (
                                        <div className="no-products">No hay productos disponibles</div>
                                    ) : (
                                        auxData.availableProducts.map((product) => (
                                            <div
                                                key={product._id}
                                                className="draggable-product"
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, product._id)}
                                            >
                                                {product.photoUrl || (product.photoUrls && product.photoUrls.length > 0) ? (
                                                    <img
                                                        src={product.photoUrl || product.photoUrls?.[0]}
                                                        alt={product.name}
                                                        className="draggable-product-image"
                                                    />
                                                ) : (
                                                    <div className="draggable-product-placeholder">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                            <polyline points="21 15 16 10 5 21"></polyline>
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="draggable-product-info">
                                                    <span className="draggable-product-name">{product.name}</span>
                                                    <span className="draggable-product-price">${(product.priceInCents / 100).toFixed(0)}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div
                                className={`drop-zone ${formState.selectedProducts.length > 0 ? 'has-products' : ''}`}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                {formState.selectedProducts.length > 0 ? (
                                    <div className="selected-products-list">
                                        {formState.selectedProducts.map((product) => (
                                            <div key={product.productId} className="selected-product-item">
                                                <div className="selected-product-info">
                                                    {(() => {
                                                        const fullProduct = auxData.availableProducts.find(p => p._id === product.productId);
                                                        return fullProduct?.photoUrl || (fullProduct?.photoUrls && fullProduct.photoUrls.length > 0) ? (
                                                            <img
                                                                src={fullProduct.photoUrl || fullProduct.photoUrls?.[0]}
                                                                alt={product.productName}
                                                                className="selected-product-image"
                                                            />
                                                        ) : (
                                                            <div className="selected-product-placeholder">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                                </svg>
                                                            </div>
                                                        );
                                                    })()}
                                                    <span className="selected-product-name">{product.productName}</span>
                                                </div>
                                                <div className="selected-product-controls">
                                                    <div className="quantity-control">
                                                        <button
                                                            type="button"
                                                            className="quantity-btn"
                                                            onClick={() => actions.handleUpdateProductQuantity(
                                                                product.productId,
                                                                product.quantity - 1
                                                            )}
                                                            disabled={product.quantity <= 1}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="quantity-display">{product.quantity}</span>
                                                        <button
                                                            type="button"
                                                            className="quantity-btn"
                                                            onClick={() => actions.handleUpdateProductQuantity(
                                                                product.productId,
                                                                product.quantity + 1
                                                            )}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="remove-product-btn"
                                                        onClick={() => actions.handleRemoveProduct(product.productId)}
                                                        title="Eliminar producto"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="drop-zone-placeholder">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                        </svg>
                                        <span>Arrastra productos aquí</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="toggle-container">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={formState.available}
                                    onChange={(e) => formState.setAvailable(e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                            <span className="toggle-label">
                                Pack {formState.available ? 'disponible' : 'no disponible'} para la venta
                            </span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn-save"
                        onClick={actions.handleSubmit}
                        disabled={uiState.isLoading}
                    >
                        {uiState.isLoading ? 'Guardando...' : (packToEdit ? 'Guardar cambios' : 'Crear Pack')}
                    </button>
                </div>
            </div>

            {cropperState.isMultiCropperOpen && cropperState.tempImageSources.length > 0 && (
                <MultiImageCropperModal
                    isOpen={cropperState.isMultiCropperOpen}
                    images={cropperState.tempImageSources.map(source => ({
                        ...source,
                        isCropped: false
                    }))}
                    onCropComplete={actions.handleMultiCropComplete}
                    onClose={actions.handleMultiCropperClose}
                />
            )}
        </div>
    );
};
