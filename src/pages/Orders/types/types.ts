export interface EndUser {
    _id: string;
    organizationId: string;
    whatsappNumber: string;
    name: string;
    email: string;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface Conversation {
    _id: string;
    organizationId: string;
    endUserId: string;
    status: string;
    source: string;
    lastMessageAt: string;
    lastMessageId: string;
    updatedAt: string;
}

export interface Product {
    _id: string;
    organizationId: string;
    name: string;
    description: string;
    sku: string;
    priceInCents: number;
    available: boolean;
    categoryId: string;
    brandId: string;
    createdAt: string;
    updatedAt: string;
    photoUrl?: string;
    __v: number;
}

export interface OrderItem {
    _id: string;
    orderId: string;
    productId: Product;
    quantity: number;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    _id: string;
    organizationId: string;
    endUserId: EndUser;
    conversationId: Conversation;
    orderNumber: string;
    status: string;
    totalAmountInCents: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    orderItems: OrderItem[];
}

export interface OrdersResponse {
    orders: Order[];
}

export interface OrdersFilterProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    dateFilter: string;
    setDateFilter: (date: string) => void;
    onDateRangeSelect: (start: Date, end: Date) => void;
    showCalendar: boolean;
    setShowCalendar: (show: boolean) => void;
}
