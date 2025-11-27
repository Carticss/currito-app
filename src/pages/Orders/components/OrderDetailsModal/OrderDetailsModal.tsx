import React, { useState, useRef, useEffect } from 'react';
import { formatCurrency, getStatusLabel } from '../../../../utils/formatting';
import type { Order } from '../../types/types';


interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
    const [tabIndicatorStyle, setTabIndicatorStyle] = useState({});
    const tabsRef = useRef<HTMLDivElement>(null);

    const date = new Date(order.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    useEffect(() => {
        if (tabsRef.current) {
            const activeBtn = tabsRef.current.querySelector(`.tab-btn.${activeTab}`) as HTMLElement;
            if (activeBtn) {
                setTabIndicatorStyle({
                    left: activeBtn.offsetLeft,
                    width: activeBtn.offsetWidth
                });
            }
        }
    }, [activeTab]);

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
                                        {order.orderItems.map((item) => (
                                            <div key={item._id} className="product-item-row">
                                                <div className="product-info">
                                                    <div className="product-icon">
                                                        {item.productId.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="product-name">{item.productId.name}</span>
                                                </div>
                                                <button className="action-btn secondary small">
                                                    Ofrecer Intercambio ⇄
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="offer-product-btn">
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
                    <button className="action-btn primary">Confirmar Oferta/Orden</button>
                </div>
            </div>
        </div>
    );
};
