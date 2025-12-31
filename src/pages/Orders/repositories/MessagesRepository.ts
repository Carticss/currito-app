import axiosInstance from '../../../config/axiosInstance';
import type { Message, MessagesResponse } from '../types/types';

export const MessagesRepository = {
    getMessages: async (orderId: string): Promise<Message[]> => {
        const response = await axiosInstance.get<MessagesResponse>(`/api/v1/orders/${orderId}/messages`);
        return response.data.messages;
    },
};
