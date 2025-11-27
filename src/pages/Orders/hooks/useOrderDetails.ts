import { useState, useRef, useEffect } from 'react';
import type { Order, Product } from '../types/types';
import { useOrderEditQueue } from './useOrderEditQueue';

export const useOrderDetails = (order: Order, onClose: () => void) => {
    const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
    const [tabIndicatorStyle, setTabIndicatorStyle] = useState({});
    const tabsRef = useRef<HTMLDivElement>(null);

    // Order Edit Queue Hook
    const {
        pendingActions,
        queueAddItem,
        queueUpdateItem,
        queueDeleteItem,
        executePendingActions,
        isExecuting
    } = useOrderEditQueue();

    // Modal State
    const [isExtraItemModalOpen, setIsExtraItemModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit_quantity'>('add');
    const [modalInitialItem, setModalInitialItem] = useState<{ product: Product; quantity: number } | undefined>(undefined);
    const [itemToExchange, setItemToExchange] = useState<string | null>(null);

    useEffect(() => {
        if (tabsRef.current) {
            const activeBtn = tabsRef.current.querySelector(`.tab-btn.${activeTab}`) as HTMLElement;
            if (activeBtn) {
                setTabIndicatorStyle({
                    left: activeBtn.offsetLeft,
                    width: activeBtn.offsetWidth
                });
            }
        }
    }, [activeTab]);

    const handleOpenAddModal = () => {
        setModalMode('add');
        setModalInitialItem(undefined);
        setItemToExchange(null);
        setIsExtraItemModalOpen(true);
    };

    const handleOpenExchangeModal = (itemId: string) => {
        setModalMode('add');
        setModalInitialItem(undefined);
        setItemToExchange(itemId);
        setIsExtraItemModalOpen(true);
    };

    const handleOpenEditQuantityModal = (item: { _id: string; productId: Product; quantity: number }) => {
        setModalMode('edit_quantity');
        setModalInitialItem({ product: item.productId, quantity: item.quantity });
        setItemToExchange(item._id);
        setIsExtraItemModalOpen(true);
    };

    const handleModalConfirm = (product: any, quantity: number) => {
        if (modalMode === 'add') {
            if (itemToExchange) {
                queueDeleteItem(itemToExchange);
                queueAddItem(product._id, quantity, product.name, itemToExchange, product.priceInCents);
            } else {
                queueAddItem(product._id, quantity, product.name, undefined, product.priceInCents);
            }
        } else if (modalMode === 'edit_quantity' && itemToExchange) {
            queueUpdateItem(itemToExchange, quantity);
        }
    };

    const handleDeleteItem = (itemId: string) => {
        queueDeleteItem(itemId);
    };

    const handleConfirmOrder = async () => {
        const result = await executePendingActions(order._id);
        if (result.success) {
            onClose();
            window.location.reload();
        } else {
            alert('Error al actualizar el pedido. Por favor intente nuevamente.');
        }
    };

    const getPendingStatus = (itemId: string) => {
        const deleteAction = pendingActions.find(a => a.type === 'delete' && a.itemId === itemId);
        if (deleteAction) return 'pending-delete';

        const updateAction = pendingActions.find(a => a.type === 'update' && a.itemId === itemId);
        if (updateAction) return 'pending-update';

        return null;
    };

    const getExistingProductIds = () => {
        // Get all product IDs from current order items
        // During exchange, we still want to prevent replacing with the same product
        const existingIds = order.orderItems.map(item => item.productId._id);
        return existingIds;
    };

    return {
        activeTab,
        setActiveTab,
        tabIndicatorStyle,
        tabsRef,
        pendingActions,
        isExecuting,
        isExtraItemModalOpen,
        setIsExtraItemModalOpen,
        modalMode,
        modalInitialItem,
        handleOpenAddModal,
        handleOpenExchangeModal,
        handleOpenEditQuantityModal,
        handleModalConfirm,
        handleDeleteItem,
        handleConfirmOrder,
        getPendingStatus,
        getExistingProductIds,
        itemToExchange
    };
};
