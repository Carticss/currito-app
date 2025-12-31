import axiosInstance from '../../../config/axiosInstance';

export interface PaymentMethod {
    _id: string;
    organizationId: string;
    key: string;
    value?: string;
    valueType: 'text' | 'image';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePaymentMethodDTO {
    key: string;
    value?: string;
    valueType: 'text' | 'image';
    isActive?: boolean;
}

export interface UpdatePaymentMethodDTO {
    key?: string;
    value?: string;
    valueType?: 'text' | 'image';
    isActive?: boolean;
}

export const PaymentMethodsRepository = {
    createPaymentMethod: async (data: CreatePaymentMethodDTO): Promise<PaymentMethod> => {
        const response = await axiosInstance.post('/api/v1/payment-methods', data);
        const result = response.data;
        if (result.paymentMethod) {
            return result.paymentMethod;
        }
        return result;
    },

    getPaymentMethods: async (activeOnly: boolean = false): Promise<PaymentMethod[]> => {
        const params = activeOnly ? { activeOnly: true } : {};
        const response = await axiosInstance.get('/api/v1/payment-methods', { params });
        // Handle the response structure { paymentMethods: [...] }
        const result = response.data;
        if (Array.isArray(result)) {
            return result;
        }
        if (result.paymentMethods && Array.isArray(result.paymentMethods)) {
            return result.paymentMethods;
        }
        if (result.data && Array.isArray(result.data)) {
            return result.data;
        }
        return [];
    },

    getPaymentMethodById: async (id: string): Promise<PaymentMethod> => {
        const response = await axiosInstance.get(`/api/v1/payment-methods/${id}`);
        const result = response.data;
        if (result.paymentMethod) {
            return result.paymentMethod;
        }
        return result;
    },

    updatePaymentMethod: async (id: string, data: UpdatePaymentMethodDTO): Promise<PaymentMethod> => {
        const response = await axiosInstance.put(`/api/v1/payment-methods/${id}`, data);
        const result = response.data;
        if (result.paymentMethod) {
            return result.paymentMethod;
        }
        return result;
    },

    deletePaymentMethod: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/api/v1/payment-methods/${id}`);
    },

    uploadPaymentMethodImage: async (id: string, file: File): Promise<PaymentMethod> => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axiosInstance.post(`/api/v1/payment-methods/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        const result = response.data;
        if (result.paymentMethod) {
            return result.paymentMethod;
        }
        return result;
    },

    deletePaymentMethodImage: async (id: string): Promise<PaymentMethod> => {
        const response = await axiosInstance.delete(`/api/v1/payment-methods/${id}/image`);
        const result = response.data;
        if (result.paymentMethod) {
            return result.paymentMethod;
        }
        return result;
    }
};
