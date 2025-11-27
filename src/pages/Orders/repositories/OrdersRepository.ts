import axiosInstance from '../../../api/axiosInstance';
import type { OrdersResponse, Order } from '../types/types';

export const OrdersRepository = {
    getOrders: async (): Promise<Order[]> => {
        const response = await axiosInstance.get<OrdersResponse>('/api/v1/orders');
        return response.data.orders;
    }
};
