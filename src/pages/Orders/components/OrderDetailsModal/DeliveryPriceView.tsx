import React from 'react';
import { formatCurrency, formatNumberDisplay } from '../../../../utils/formatting';
import type { Order } from '../../types/types';

interface DeliveryPriceViewProps {
    order: Order;
    deliveryPrice: string;
    onDeliveryPriceChange: (price: string) => void;
    onDeliveryPriceSubmit: () => void;
    isLoading: boolean;
}

export const DeliveryPriceView: React.FC<DeliveryPriceViewProps> = ({
    order,
    deliveryPrice,
    onDeliveryPriceChange,
    onDeliveryPriceSubmit,
    isLoading
}) => {
    return (
        <div className="delivery-price-view">
            <div className="delivery-section">
                <h3 className="section-title">Información de Entrega</h3>
                
                {order.deliveryInfo && (
                    <div className="delivery-info-card">
                        <div className="delivery-info-row">
                            <span className="delivery-label">Nombre:</span>
                            <span className="delivery-value">{order.deliveryInfo.fullName}</span>
                        </div>
                        <div className="delivery-info-row">
                            <span className="delivery-label">Dirección:</span>
                            <span className="delivery-value">{order.deliveryInfo.address}</span>
                        </div>
                        <div className="delivery-info-row">
                            <span className="delivery-label">Ciudad:</span>
                            <span className="delivery-value">{order.deliveryInfo.city}</span>
                        </div>
                        <div className="delivery-info-row">
                            <span className="delivery-label">Teléfono:</span>
                            <span className="delivery-value">{order.deliveryInfo.phone}</span>
                        </div>
                    </div>
                )}

                <div className="price-input-section">
                    <h3 className="section-title">Precio de Entrega</h3>
                    <label htmlFor="delivery-price" className="price-label">
                        Ingresa el precio de entrega en COP:
                    </label>
                    <div className="price-input-group">
                        <span className="currency-symbol">$</span>
                        <input
                            id="delivery-price"
                            type="text"
                            min="0"
                            step="0.01"
                            value={formatNumberDisplay(deliveryPrice)}
                            onChange={(e) => onDeliveryPriceChange(e.target.value.replace(/[^\d.]/g, ''))}
                            placeholder="0.00"
                            className="price-input"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="order-summary">
                    <div className="summary-row">
                        <span className="summary-label">Monto del Pedido:</span>
                        <span className="summary-value">{formatCurrency(order.totalAmountInCents)}</span>
                    </div>
                    {deliveryPrice && !isNaN(parseFloat(deliveryPrice)) && (
                        <div className="summary-row total">
                            <span className="summary-label">Total (con envío):</span>
                            <span className="summary-value">
                                {formatCurrency(order.totalAmountInCents + Math.round(parseFloat(deliveryPrice) * 100))}
                            </span>
                        </div>
                    )}
                </div>

                <button
                    className="submit-btn"
                    onClick={onDeliveryPriceSubmit}
                    disabled={isLoading || !deliveryPrice || isNaN(parseFloat(deliveryPrice))}
                >
                    {isLoading ? 'Guardando...' : 'Guardar Precio de Entrega'}
                </button>
            </div>
        </div>
    );
};
