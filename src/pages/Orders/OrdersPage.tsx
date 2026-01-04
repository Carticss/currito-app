import React from 'react';
import { useOrders } from './hooks/useOrders';
import { OrdersGrid } from './components/OrdersGrid/OrdersGrid';
import { OrderDetailsModal } from './components/OrderDetailsModal/OrderDetailsModal';
import './styles/Orders.css'
import { OrdersFilter } from './components/OrdersFilter/OrdersFilter';
import type { Order } from './types/types';

export const OrdersPage: React.FC = () => {
    const {
        orders,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        dateFilter,
        setDateFilter,
        setCustomDateRange,
        selectedOrder,
        setSelectedOrder,
        showCalendar,
        setShowCalendar,
        updateOrderInList
    } = useOrders();

    const handleOrderUpdate = (updatedOrder: Order) => {
        // Update the order in the list
        updateOrderInList(updatedOrder);
        // Also update the selected order
        setSelectedOrder(updatedOrder);
    };

    return (
        <div className="orders-page">

            <OrdersFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                onDateRangeSelect={(start, end) => setCustomDateRange({ start, end })}
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
            />

            <OrdersGrid
                orders={orders}
                loading={loading}
                error={error}
                onViewDetails={(order) => setSelectedOrder(order)}
            />

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onOrderUpdate={handleOrderUpdate}
                />
            )}
        </div>
    );
};
