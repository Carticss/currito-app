import { useState, useEffect } from 'react';
import type { Order } from '../types/types';
import { OrdersRepository } from '../repositories/OrdersRepository';

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('Todos');
    const [customDateRange, setCustomDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    const fetchOrders = async (silent: boolean = false) => {
        try {
            if (!silent) setLoading(true);
            const data = await OrdersRepository.getOrders();
            setOrders(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to fetch orders');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(false);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
                fetchOrders(true);
            }
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const filteredOrders = orders.filter(order => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (
            order.endUserId.name.toLowerCase().includes(query) ||
            order.orderNumber.toLowerCase().includes(query) ||
            order.endUserId.whatsappNumber.includes(query)
        );

        const matchesStatus = statusFilter ? order.status === statusFilter : true;

        let matchesDate = true;
        const orderDate = new Date(order.createdAt);
        const today = new Date();

        if (dateFilter !== 'Todos') {
            if (dateFilter === 'Personalizado') {
                if (customDateRange.start && customDateRange.end) {
                    const end = new Date(customDateRange.end);
                    end.setHours(23, 59, 59, 999);
                    matchesDate = orderDate >= customDateRange.start && orderDate <= end;
                }
            } else {
                const daysToSubtract = {
                    'Hoy': 0,
                    'Ultimos 3 días': 3,
                    'Ultimos 7 días': 7,
                    'Ultimos 30 días': 30,
                    'Ultimos 90 días': 90
                }[dateFilter] || 0;

                const startDate = new Date();
                startDate.setDate(today.getDate() - daysToSubtract);
                startDate.setHours(0, 0, 0, 0);

                if (dateFilter === 'Hoy') {
                    matchesDate = orderDate >= startDate;
                } else {
                    matchesDate = orderDate >= startDate;
                }
            }
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const updateOrderInList = (updatedOrder: Order) => {
        setOrders(prev => prev.map(order => 
            order._id === updatedOrder._id ? updatedOrder : order
        ));
    };

    return {
        orders: filteredOrders,
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
        updateOrderInList,
        // Expose manual refresh that shows loading state
        refreshOrders: async () => fetchOrders(false)
    };
};
