import { useEffect, useState } from 'react';
import type { Message } from '../types/types';
import { MessagesRepository } from '../repositories/MessagesRepository';

interface UseOrderChatReturn {
    messages: Message[];
    loading: boolean;
    error: string | null;
}

export const useOrderChat = (orderId: string): UseOrderChatReturn => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchMessages = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await MessagesRepository.getMessages(orderId);
                if (!isMounted) return;
                setMessages(data);
            } catch (err: any) {
                if (!isMounted) return;
                setError(err.response?.data?.message || 'No se pudieron cargar los mensajes.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchMessages();

        return () => {
            isMounted = false;
        };
    }, [orderId]);

    return { messages, loading, error };
};
