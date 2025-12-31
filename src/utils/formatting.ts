export const formatCurrency = (amountInCents: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amountInCents);
};

export const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending_user_response': return 'Pendiente respuesta cliente';
        case 'awaiting_payment': return 'Pendiente de pago';
        case 'confirmed': return 'Confirmado';
        case 'completed': return 'Completado';
        case 'cancelled': return 'Cancelado';
        case 'pending_payment_confirmation': return 'Pendiente confirmación pago';
        case 'pending_order_confirmation': return 'Pendiente confirmación pedido';
        default: return status;
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending_user_response':
            return { bg: '#fff3cd', text: '#856404', border: '#ffeeba' };
        case 'confirmed':
            return { bg: '#cce5ff', text: '#004085', border: '#b8daff' };
        case 'completed':
            return { bg: '#d4edda', text: '#155724', border: '#c3e6cb' };
        case 'cancelled':
            return { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' };
        case 'pending_payment_confirmation':
            return { bg: '#fff3cd', text: '#856404', border: '#ffeeba' }; // Warning-like
        case 'pending_order_confirmation':
            return { bg: '#e2e3e5', text: '#383d41', border: '#d6d8db' }; // Secondary/Neutral
        default:
            return { bg: '#f8f9fa', text: '#212529', border: '#dae0e5' };
    }
};


export const getRandomColor = (str: string) => {
    const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6610f2'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};