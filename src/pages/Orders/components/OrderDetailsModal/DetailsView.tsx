import React from 'react';
import { formatCurrency, getStatusLabel } from '../../../../utils/formatting';
import type { Order } from '../../types/types';
import type { LocalOrderItem } from '../../hooks/useOrderDetails';

interface DetailsViewProps {
    order: Order;
    visibleItems: LocalOrderItem[];
    deletedItems: LocalOrderItem[];
    handleOpenEditQuantityModal: (item: LocalOrderItem) => void;
    handleOpenExchangeModal: (itemId: string) => void;
    handleDeleteItem: (itemId: string) => void;
    handleRestoreItem: (itemId: string) => void;
    handleOpenAddModal: () => void;
    isOrderCompleted?: boolean;
}

export const DetailsView: React.FC<DetailsViewProps> = ({
    order,
    visibleItems,
    deletedItems,
    handleOpenEditQuantityModal,
    handleOpenExchangeModal,
    handleDeleteItem,
    handleRestoreItem,
    handleOpenAddModal,
    isOrderCompleted = false,
}) => {
    const date = new Date(order.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // Calculate total from visible items
    const calculatedTotal = visibleItems.reduce(
        (sum, item) => sum + (item.productId.priceInCents * item.quantity),
        0
    );

    return (
        <div className="view-slide">
            <div className="view-scroll-content">
                <div className="info-section">
                    <h3 className="section-title">Información del Cliente</h3>
                    <div className="info-grid">
                        <div>
                            <div className="info-label">Nombre</div>
                            <div className="info-value">{order.endUserId.name}</div>
                        </div>
                        <div>
                            <div className="info-label">Teléfono (WhatsApp)</div>
                            <div className="info-value">{order.endUserId.whatsappNumber}</div>
                        </div>
                        <div>
                            <div className="info-label">Fecha de Creación</div>
                            <div className="info-value">{date}</div>
                        </div>
                    </div>
                </div>

                <div className="products-section">
                    <h3 className="section-title">Productos del Pedido</h3>
                    <div className="products-list">
                        {visibleItems.map((item) => {
                            const statusClass = item.isNew ? 'new-item' : item.isModified ? 'modified-item' : '';

                            return (
                                <div key={item._id} className={`product-item-row ${statusClass}`}>
                                    <div className="product-info">
                                        <div className="product-icon">
                                            {item.productId.photoUrl ? (
                                                <img src={item.productId.photoUrl} alt={item.productId.name} />
                                            ) : (
                                                item.productId.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="product-details-col">
                                            <span className="product-name">{item.productId.name}</span>
                                            <span className="product-qty">Cant: {item.quantity}</span>
                                            <span className="product-price">
                                                {formatCurrency(item.productId.priceInCents)} × {item.quantity} = {formatCurrency(item.productId.priceInCents * item.quantity)}
                                            </span>
                                            {item.isNew && <span className="pending-badge add">Nuevo</span>}
                                            {item.isModified && <span className="pending-badge update">Modificado</span>}
                                        </div>
                                    </div>
                                    <div className="product-actions">
                                        {!isOrderCompleted && (
                                            <>
                                                <button
                                                    className="action-btn secondary small"
                                                    onClick={() => handleOpenEditQuantityModal(item)}
                                                >
                                                    Editar Cantidad
                                                </button>
                                                <button
                                                    className="action-btn secondary small"
                                                    onClick={() => handleOpenExchangeModal(item._id)}
                                                >
                                                    Ofrecer Intercambio ⇄
                                                </button>
                                                <button
                                                    className="action-btn danger small"
                                                    onClick={() => handleDeleteItem(item._id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Show deleted items with restore option */}
                        {deletedItems.map((item) => (
                            <div key={item._id} className="product-item-row pending-delete">
                                <div className="product-info">
                                    <div className="product-icon deleted">
                                        {item.productId.photoUrl ? (
                                            <img src={item.productId.photoUrl} alt={item.productId.name} style={{ opacity: 0.5 }} />
                                        ) : (
                                            item.productId.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="product-details-col">
                                        <span className="product-name" style={{ textDecoration: 'line-through', opacity: 0.6 }}>
                                            {item.productId.name}
                                        </span>
                                        <span className="product-qty" style={{ opacity: 0.6 }}>Cant: {item.quantity}</span>
                                        <span className="pending-badge delete">Marcado para eliminar</span>
                                    </div>
                                </div>
                                <div className="product-actions">
                                    {!isOrderCompleted && (
                                        <button
                                            className="action-btn secondary small"
                                            onClick={() => handleRestoreItem(item._id)}
                                        >
                                            Restaurar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {!isOrderCompleted && (
                        <button
                            className="offer-product-btn"
                            onClick={handleOpenAddModal}
                        >
                            Ofrecer otro producto +
                        </button>
                    )}
                </div>

                <div className="summary-section">
                    <h3 className="section-title">Resumen del Pedido</h3>
                    <div className="summary-row">
                        <span>Precio Total</span>
                        <span className="total-amount">{formatCurrency(calculatedTotal)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Estado Actual</span>
                        <span className={`status-badge-inline status-${order.status}`}>
                            {getStatusLabel(order.status)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
