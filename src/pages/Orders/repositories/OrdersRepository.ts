import axiosInstance from '../../../config/axiosInstance';
import type { OrdersResponse, Order } from '../types/types';

export const OrdersRepository = {
    getOrders: async (): Promise<Order[]> => {
        const response = await axiosInstance.get<OrdersResponse>('/api/v1/orders');
        return response.data.orders;
    },

    addOrderItems: async (orderId: string, items: { productId: string; quantity: number }[]): Promise<Order> => {
        const response = await axiosInstance.post<{ order: Order }>(`/api/v1/orders/${orderId}/items`, { items });
        return response.data.order;
    },

    updateOrderItem: async (orderId: string, itemId: string, body: { quantity: number }): Promise<Order> => {
        const response = await axiosInstance.put<{ order: Order }>(`/api/v1/orders/${orderId}/items/${itemId}`, body);
        return response.data.order;
    },

    deleteOrderItem: async (orderId: string, itemId: string): Promise<Order> => {
        const response = await axiosInstance.delete<{ order: Order }>(`/api/v1/orders/${orderId}/items/${itemId}`);
        return response.data.order;
    },

    updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
        const response = await axiosInstance.put<{ order: Order }>(`/api/v1/orders/${orderId}`, { status });
        return response.data.order;
    },

    syncOrderItems: async (orderId: string, items: { productId: string; quantity: number }[]): Promise<Order> => {
        const response = await axiosInstance.put<{ order: Order; orderItems: Order['orderItems'] }>(
            `/api/v1/orders/${orderId}/items/sync`, 
            { items }
        );
        return {
            ...response.data.order,
            orderItems: response.data.orderItems
        };
    }
};
