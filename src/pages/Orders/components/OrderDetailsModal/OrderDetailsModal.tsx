import React from 'react';
import { formatCurrency, getStatusLabel } from '../../../../utils/formatting';
import type { Order } from '../../types/types';
import { ExtraItemModal } from '../ExtraItemModal/ExtraItemModal';
import { useOrderDetails } from '../../hooks/useOrderDetails';
import './OrderDetailsModal.css';

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
    const {
        activeTab,
        setActiveTab,
        tabIndicatorStyle,
        tabsRef,
        pendingActions,
        isExecuting,
        isExtraItemModalOpen,
        setIsExtraItemModalOpen,
        modalMode,
        modalInitialItem,
        handleOpenAddModal,
        handleOpenExchangeModal,
        handleOpenEditQuantityModal,
        handleModalConfirm,
        handleDeleteItem,
        handleConfirmOrder,
        getPendingStatus,
        getExistingProductIds
    } = useOrderDetails(order, onClose);

    const date = new Date(order.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Pedido {order.orderNumber}</h2>
                        <div className="modal-subtitle">{order.endUserId.name} • {order.endUserId.whatsappNumber}</div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-tabs" ref={tabsRef}>
                    <button
                        className={`tab-btn details ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Detalles del Pedido
                    </button>
                    <button
                        className={`tab-btn chat ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        Chat con Cliente
                    </button>
                    <div className="tab-indicator" style={tabIndicatorStyle} />
                </div>

                <div className="modal-content-viewport">
                    <div className={`views-slider ${activeTab}`}>
                        {/* Details View */}
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
                                        {order.orderItems.map((item) => {
                                            const pendingStatus = getPendingStatus(item._id);
                                            // Disable only if THIS item has pending status
                                            const isDisabled = !!pendingStatus;

                                            return (
                                                <div key={item._id} className={`product-item-row ${pendingStatus || ''}`}>
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
                                                            {pendingStatus === 'pending-delete' && <span className="pending-badge delete">Eliminar pendiente</span>}
                                                            {pendingStatus === 'pending-update' && <span className="pending-badge update">Actualización pendiente</span>}
                                                        </div>
                                                    </div>
                                                    <div className="product-actions">
                                                        <button
                                                            className="action-btn secondary small"
                                                            onClick={() => handleOpenEditQuantityModal(item)}
                                                            disabled={isDisabled}
                                                        >
                                                            Editar Cantidad
                                                        </button>
                                                        <button
                                                            className="action-btn secondary small"
                                                            onClick={() => handleOpenExchangeModal(item._id)}
                                                            disabled={isDisabled}
                                                        >
                                                            Ofrecer Intercambio ⇄
                                                        </button>
                                                        <button
                                                            className="action-btn danger small"
                                                            onClick={() => handleDeleteItem(item._id)}
                                                            disabled={isDisabled}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {/* Render Pending Adds */}
                                        {pendingActions.filter(a => a.type === 'add').map((action, idx) => {
                                            const isReplacement = !!action.data.replacedItemId;
                                            // Find the name of the item being replaced if possible, or just show generic text
                                            // Ideally we'd look up the original item name from order.orderItems using replacedItemId
                                            const replacedItem = action.data.replacedItemId
                                                ? order.orderItems.find(i => i._id === action.data.replacedItemId)
                                                : null;

                                            return (
                                                <div key={`pending-add-${idx}`} className="product-item-row pending-add">
                                                    <div className="product-info">
                                                        <div className="product-icon new">+</div>
                                                        <div className="product-details-col">
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                {isReplacement && <span style={{ fontSize: '16px', color: '#666' }}>↳</span>}
                                                                <span className="product-name">{action.data.productName || 'Nuevo Producto'}</span>
                                                            </div>
                                                            <span className="product-qty">Cant: {action.data.quantity}</span>
                                                            {action.data.priceInCents && (
                                                                <span className="product-price">
                                                                    {formatCurrency(action.data.priceInCents)} × {action.data.quantity} = {formatCurrency(action.data.priceInCents * action.data.quantity)}
                                                                </span>
                                                            )}
                                                            <span className="pending-badge add">
                                                                {isReplacement ? 'Intercambio pendiente' : 'Agregar pendiente'}
                                                            </span>
                                                            {isReplacement && replacedItem && (
                                                                <span style={{ fontSize: '11px', color: '#888' }}>
                                                                    Reemplaza a: {replacedItem.productId.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button
                                        className="offer-product-btn"
                                        onClick={handleOpenAddModal}
                                    >
                                        Ofrecer otro producto +
                                    </button>
                                </div>

                                <div className="summary-section">
                                    <h3 className="section-title">Resumen del Pedido</h3>
                                    <div className="summary-row">
                                        <span>Precio Total</span>
                                        <span className="total-amount">{formatCurrency(order.totalAmountInCents)}</span>
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

                        {/* Chat View */}
                        <div className="view-slide">
                            <div className="view-scroll-content">
                                <div className="chat-placeholder">
                                    <p>Trabajo en progreso</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="action-btn outline">Marcar como entregado</button>
                    <button
                        className="action-btn primary"
                        onClick={handleConfirmOrder}
                        disabled={isExecuting || pendingActions.length === 0}
                    >
                        {isExecuting ? 'Procesando...' : 'Confirmar Oferta/Orden'}
                    </button>
                </div>
            </div>

            <ExtraItemModal
                isOpen={isExtraItemModalOpen}
                onClose={() => setIsExtraItemModalOpen(false)}
                onConfirm={handleModalConfirm}
                mode={modalMode}
                initialItem={modalInitialItem}
                existingProductIds={getExistingProductIds()}
            />
        </div>
    );
};
