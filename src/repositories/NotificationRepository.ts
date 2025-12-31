import axiosInstance from '../config/axiosInstance';

interface NotificationTokenPayload {
    desktopToken?: string;
    mobileToken?: string;
}

export const NotificationRepository = {
    registerToken: async (payload: NotificationTokenPayload) => {
        const response = await axiosInstance.post('/api/v1/notification-tokens', payload);
        return response.data;
    },
};
