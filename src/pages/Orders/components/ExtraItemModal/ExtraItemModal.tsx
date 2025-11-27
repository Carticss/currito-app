import React from 'react';
import { useExtraItemModal, type ModalProduct } from '../../hooks/useExtraItemModal';
import { formatCurrency } from '../../../../utils/formatting';
import './ExtraItemModal.css';

interface ExtraItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (product: ModalProduct, quantity: number) => void;
    mode: 'add' | 'edit_quantity';
    initialItem?: { product: ModalProduct; quantity: number };
    existingProductIds?: string[];
}

export const ExtraItemModal: React.FC<ExtraItemModalProps> = (props) => {
    const {
        searchQuery,
        setSearchQuery,
        filteredProducts,
        selectedProduct,
        setSelectedProduct,
        quantity,
        increaseQuantity,
        decreaseQuantity,
        handleQuantityChange,
        loading,
        handleConfirm,
        isProductDisabled
    } = useExtraItemModal(props);

    const { isOpen, onClose, mode } = props;

    if (!isOpen) return null;

    return (
        <div className="extra-item-modal-overlay" onClick={onClose}>
            <div className="extra-item-modal-container" onClick={e => e.stopPropagation()}>
                <div className="extra-item-modal-header">
                    <h3>{mode === 'add' ? 'Agregar Producto' : 'Editar Cantidad'}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="extra-item-modal-content">
                    {mode === 'add' && (
                        <div className="search-section">
                            <input
                                type="text"
                                placeholder="Buscar producto..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="search-input"
                                autoFocus
                            />
                        </div>
                    )}

                    {mode === 'add' && (
                        <div className="products-grid">
                            {loading ? (
                                <div className="loading-state">Cargando productos...</div>
                            ) : (
                                filteredProducts.map(product => {
                                    const disabled = isProductDisabled(product._id);
                                    return (
                                        <div
                                            key={product._id}
                                            className={`product-card ${selectedProduct?._id === product._id ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                                            onClick={() => !disabled && setSelectedProduct(product)}
                                        >
                                            <div className="product-icon-placeholder">
                                                {product.photoUrl ? (
                                                    <img src={product.photoUrl} alt={product.name} />
                                                ) : (
                                                    product.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="product-details">
                                                <div className="product-name">{product.name}</div>
                                                <div className="product-sku">{product.sku}</div>
                                                <div className="product-price">{formatCurrency(product.priceInCents)}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {selectedProduct && (
                        <div className="quantity-section">
                            <div className="selected-product-summary">
                                <div className="product-icon-placeholder">
                                    {selectedProduct.photoUrl ? (
                                        <img src={selectedProduct.photoUrl} alt={selectedProduct.name} />
                                    ) : (
                                        selectedProduct.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="product-info">
                                    <div className="product-name">{selectedProduct.name}</div>
                                    <div className="product-sku">{selectedProduct.sku}</div>
                                    <div className="product-price">
                                        {formatCurrency(selectedProduct.priceInCents)} × {quantity} = {formatCurrency(selectedProduct.priceInCents * quantity)}
                                    </div>
                                </div>
                            </div>
                            <div className="quantity-control">
                                <label>Cantidad:</label>
                                <div className="quantity-inputs">
                                    <button onClick={decreaseQuantity}>-</button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={e => handleQuantityChange(parseInt(e.target.value))}
                                    />
                                    <button onClick={increaseQuantity}>+</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="extra-item-modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancelar</button>
                    <button
                        className="confirm-btn"
                        onClick={handleConfirm}
                        disabled={!selectedProduct}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};
