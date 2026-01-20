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
            if (!isMounted) return;
            try {
                const data = await MessagesRepository.getMessages(orderId);
                if (!isMounted) return;
                setMessages(data);
                setError(null);
            } catch (err: any) {
                if (!isMounted) return;
                setError(err.response?.data?.message || 'No se pudieron cargar los mensajes.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchMessages();

        // Refetch messages every 10 seconds
        const intervalId = setInterval(fetchMessages, 10000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [orderId]);

    return { messages, loading, error };
};
