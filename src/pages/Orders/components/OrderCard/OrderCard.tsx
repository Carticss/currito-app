import React from 'react';
import { formatCurrency, getRandomColor, getStatusColor, getStatusLabel } from '../../../../utils/formatting';
import type { Order } from '../../types/types';


interface OrderCardProps {
    order: Order;
    onViewDetails: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails }) => {
    const date = new Date(order.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    const statusColor = getStatusColor(order.status);

    return (
        <div className="order-card">
            <div className="card-header">
                <div>
                    <h3 className="customer-name">{order.endUserId.name}</h3>
                    <div className="order-meta">
                        <div>{order.orderNumber}</div>
                        <div>{order.endUserId.whatsappNumber}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span
                        className="status-badge"
                        style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            border: `1px solid ${statusColor.border}`
                        }}
                    >
                        {getStatusLabel(order.status)}
                    </span>
                    <div className="order-amount">
                        {order.deliveryPriceInCents !== undefined
                            ? formatCurrency(order.totalAmountInCents + order.deliveryPriceInCents)
                            : formatCurrency(order.totalAmountInCents)}
                    </div>
                </div>
            </div>


            <div>
                <div className="items-section-title">ARTÍCULOS DEL PEDIDO</div>
                <div className="order-items">
                    {order.orderItems?.map((item) => (
                        <div key={item._id} className="order-item-chip">
                            {item.productId.photoUrl ? (
                                <img src={item.productId.photoUrl} alt={item.productId.name} className="item-image" />
                            ) : (
                                <div className="item-icon" style={{ backgroundColor: getRandomColor(item.productId.name) }}>
                                    {item.productId.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span>{item.productId.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card-footer">
                <div className='footer-date'>
                    <img src="/clock-icon.svg" alt="" /> {date}
                </div>
                <div className="footer-actions">
                    <img
                        src="/eye-icon.svg"
                        alt="Ver detalles"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onViewDetails(order)}
                    />
                </div>
            </div>
        </div>
    );
};
