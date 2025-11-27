import { useState, useCallback } from 'react';
import { OrdersRepository } from '../repositories/OrdersRepository';

export type PendingAction =
    | { type: 'add'; data: { productId: string; quantity: number; productName?: string; replacedItemId?: string; priceInCents?: number } }
    | { type: 'update'; itemId: string; data: { quantity: number } }
    | { type: 'delete'; itemId: string };

interface UseOrderEditQueueReturn {
    pendingActions: PendingAction[];
    queueAddItem: (productId: string, quantity: number, productName?: string, replacedItemId?: string, priceInCents?: number) => void;
    queueUpdateItem: (itemId: string, quantity: number) => void;
    queueDeleteItem: (itemId: string) => void;
    clearPendingActions: () => void;
    executePendingActions: (orderId: string) => Promise<{ success: boolean; error?: any }>;
    isExecuting: boolean;
}

export const useOrderEditQueue = (): UseOrderEditQueueReturn => {
    const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);

    const queueAddItem = useCallback((productId: string, quantity: number, productName?: string, replacedItemId?: string, priceInCents?: number) => {
        setPendingActions(prev => {
            // Coalescing: If adding same product multiple times before execution, merge them?
            // Requirement says: "If an item is queued for add and then update (before execution), merge updates into the add payload."
            // But here we are just adding. Let's just append for now, or merge if we want to be smart.
            // Simpler to just append, but let's check if we already have a pending add for this product?
            // Actually, the requirement "If an item is queued for add and then update" implies we need to track "virtual" IDs or just rely on the fact that 'add' doesn't have an itemId yet.
            // For simplicity and strict ordering, we just push.
            return [...prev, { type: 'add', data: { productId, quantity, productName, replacedItemId, priceInCents } }];
        });
    }, []);

    const queueUpdateItem = useCallback((itemId: string, quantity: number) => {
        setPendingActions(prev => {
            const filtered = prev.filter(a => !(a.type === 'update' && a.itemId === itemId));
            return [...filtered, { type: 'update', itemId, data: { quantity } }];
            return [...filtered, { type: 'update', itemId, data: { quantity } }];
        });
    }, []);

    const queueDeleteItem = useCallback((itemId: string) => {
        setPendingActions(prev => {
            const filtered = prev.filter(a => !(a.type === 'update' && a.itemId === itemId));
            return [...filtered, { type: 'delete', itemId }];
        });
    }, []);

    const clearPendingActions = useCallback(() => {
        setPendingActions([]);
    }, []);

    const executePendingActions = useCallback(async (orderId: string) => {
        setIsExecuting(true);
        try {
            for (const action of pendingActions) {
                if (action.type === 'add') {
                    await OrdersRepository.addOrderItems(orderId, [{
                        productId: action.data.productId,
                        quantity: action.data.quantity
                    }]);
                } else if (action.type === 'update') {
                    await OrdersRepository.updateOrderItem(orderId, action.itemId, {
                        quantity: action.data.quantity
                    });
                } else if (action.type === 'delete') {
                    await OrdersRepository.deleteOrderItem(orderId, action.itemId);
                }
            }
            setPendingActions([]);
            return { success: true };
        } catch (error) {
            console.error("Failed to execute pending actions", error);
            return { success: false, error };
        } finally {
            setIsExecuting(false);
        }
    }, [pendingActions]);

    return {
        pendingActions,
        queueAddItem,
        queueUpdateItem,
        queueDeleteItem,
        clearPendingActions,
        executePendingActions,
        isExecuting
    };
};
