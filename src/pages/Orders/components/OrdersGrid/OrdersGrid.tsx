import React from 'react';
import type { Order } from '../../types/types';
import { OrderCard } from '../OrderCard/OrderCard';
import { OrdersGridSkeleton } from './OrdersGridSkeleton';

interface OrdersGridProps {
    orders: Order[];
    loading: boolean;
    error: string | null;
    onViewDetails: (order: Order) => void;
}

export const OrdersGrid: React.FC<OrdersGridProps> = ({ orders, loading, error, onViewDetails }) => {
    if (loading) return <OrdersGridSkeleton />;
    if (error) return <div>Error: {error}</div>;
    if (orders.length === 0) return <div>No se encontraron pedidos.</div>;

    return (
        <div className="orders-grid">
            {orders.map(order => (
                <OrderCard key={order._id} order={order} onViewDetails={onViewDetails} />
            ))}
        </div>
    );
};
