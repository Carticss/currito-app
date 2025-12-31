import { useState, useCallback } from 'react';
import { PaymentMethodsRepository, type PaymentMethod, type CreatePaymentMethodDTO, type UpdatePaymentMethodDTO } from '../repository/PaymentMethodsRepository';

export const usePaymentMethods = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPaymentMethods = useCallback(async (activeOnly: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            const data = await PaymentMethodsRepository.getPaymentMethods(activeOnly);
            setPaymentMethods(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error loading payment methods';
            setError(errorMessage);
            console.error('Error loading payment methods:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createPaymentMethod = useCallback(async (data: CreatePaymentMethodDTO) => {
        setError(null);
        try {
            const newMethod = await PaymentMethodsRepository.createPaymentMethod(data);
            setPaymentMethods(prev => [...prev, newMethod]);
            return newMethod;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error creating payment method';
            setError(errorMessage);
            console.error('Error creating payment method:', err);
            throw err;
        }
    }, []);

    const updatePaymentMethod = useCallback(async (id: string, data: UpdatePaymentMethodDTO) => {
        setError(null);
        try {
            const updatedMethod = await PaymentMethodsRepository.updatePaymentMethod(id, data);
            setPaymentMethods(prev => prev.map(m => m._id === id ? updatedMethod : m));
            return updatedMethod;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error updating payment method';
            setError(errorMessage);
            console.error('Error updating payment method:', err);
            throw err;
        }
    }, []);

    const deletePaymentMethod = useCallback(async (id: string) => {
        setError(null);
        try {
            await PaymentMethodsRepository.deletePaymentMethod(id);
            setPaymentMethods(prev => prev.filter(m => m._id !== id));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error deleting payment method';
            setError(errorMessage);
            console.error('Error deleting payment method:', err);
            throw err;
        }
    }, []);

    const uploadPaymentMethodImage = useCallback(async (id: string, file: File) => {
        setError(null);
        try {
            const updatedMethod = await PaymentMethodsRepository.uploadPaymentMethodImage(id, file);
            setPaymentMethods(prev => prev.map(m => m._id === id ? updatedMethod : m));
            return updatedMethod;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error uploading image';
            setError(errorMessage);
            console.error('Error uploading image:', err);
            throw err;
        }
    }, []);

    const deletePaymentMethodImage = useCallback(async (id: string) => {
        setError(null);
        try {
            const updatedMethod = await PaymentMethodsRepository.deletePaymentMethodImage(id);
            setPaymentMethods(prev => prev.map(m => m._id === id ? updatedMethod : m));
            return updatedMethod;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error deleting image';
            setError(errorMessage);
            console.error('Error deleting image:', err);
            throw err;
        }
    }, []);

    return {
        paymentMethods,
        loading,
        error,
        fetchPaymentMethods,
        createPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        uploadPaymentMethodImage,
        deletePaymentMethodImage
    };
};
