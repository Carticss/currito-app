import React from 'react';
import { useOrderChat } from '../../hooks/useOrderChat';

interface ChatViewProps {
    orderId: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ orderId }) => {
    const { messages, loading, error } = useOrderChat(orderId);

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="view-slide">
            <div className="view-scroll-content">
                {loading && <p className="chat-status">Cargando mensajes...</p>}
                {error && <p className="chat-status error">{error}</p>}

                {!loading && !error && (
                    <div className="chat-thread">
                        {messages.map((message) => (
                            <div
                                key={message._id}
                                className={`chat-bubble ${message.direction === 'outbound' ? 'outbound' : 'inbound'}`}
                            >
                                <div className="chat-body">{message.bodyText}</div>
                                <div className="chat-meta">
                                    <span>{formatTimestamp(message.sentAt)}</span>
                                </div>
                            </div>
                        ))}
                        {messages.length === 0 && <p>Sin mensajes.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};
