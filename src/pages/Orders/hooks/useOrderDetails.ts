import { useState, useRef, useEffect } from 'react';
import type { Order, Product } from '../types/types';
import { OrdersRepository } from '../repositories/OrdersRepository';

export interface LocalOrderItem {
    _id: string;
    productId: Product;
    quantity: number;
    isNew?: boolean; // Flag to identify newly added items
    isModified?: boolean; // Flag to identify items with changed quantity
    isDeleted?: boolean; // Flag to identify items marked for deletion
}

export const useOrderDetails = (
    order: Order,
    _onClose: () => void,
    onOrderUpdate?: (updatedOrder: Order) => void
) => {
    const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
    const [tabIndicatorStyle, setTabIndicatorStyle] = useState({});
    const tabsRef = useRef<HTMLDivElement>(null);
    const [isExecuting, setIsExecuting] = useState(false);

    // Current order state - can be updated after sync
    const [currentOrder, setCurrentOrder] = useState<Order>(order);

    // Delivery price state
    const [deliveryPrice, setDeliveryPrice] = useState<string>('');

    // Local items state - initialized from order items
    const [localItems, setLocalItems] = useState<LocalOrderItem[]>(() =>
        order.orderItems.map(item => ({
            _id: item._id,
            productId: item.productId,
            quantity: item.quantity,
            isNew: false,
            isModified: false,
            isDeleted: false
        }))
    );

    // Modal State
    const [isExtraItemModalOpen, setIsExtraItemModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit_quantity'>('add');
    const [modalInitialItem, setModalInitialItem] = useState<{ product: Product; quantity: number } | undefined>(undefined);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

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
        setEditingItemId(null);
        setIsExtraItemModalOpen(true);
    };

    const handleOpenExchangeModal = (itemId: string) => {
        // For exchange, we mark the item as deleted and open add modal
        setLocalItems(prev => prev.map(item =>
            item._id === itemId ? { ...item, isDeleted: true } : item
        ));
        setModalMode('add');
        setModalInitialItem(undefined);
        setEditingItemId(null);
        setIsExtraItemModalOpen(true);
    };

    const handleOpenEditQuantityModal = (item: LocalOrderItem) => {
        setModalMode('edit_quantity');
        setModalInitialItem({ product: item.productId, quantity: item.quantity });
        setEditingItemId(item._id);
        setIsExtraItemModalOpen(true);
    };

    const handleModalConfirm = (product: any, quantity: number) => {
        if (modalMode === 'add') {
            // Check if product already exists in local items (non-deleted)
            const existingItem = localItems.find(
                item => item.productId._id === product._id && !item.isDeleted
            );

            if (existingItem) {
                // Update quantity of existing item
                setLocalItems(prev => prev.map(item =>
                    item._id === existingItem._id
                        ? { ...item, quantity: item.quantity + quantity, isModified: true }
                        : item
                ));
            } else {
                // Add new item with a temporary ID
                const newItem: LocalOrderItem = {
                    _id: `temp-${Date.now()}`,
                    productId: product,
                    quantity,
                    isNew: true,
                    isModified: false,
                    isDeleted: false
                };
                setLocalItems(prev => [...prev, newItem]);
            }
        } else if (modalMode === 'edit_quantity' && editingItemId) {
            // Update quantity of existing item
            setLocalItems(prev => prev.map(item =>
                item._id === editingItemId
                    ? { ...item, quantity, isModified: !item.isNew }
                    : item
            ));
        }
    };

    const handleDeleteItem = (itemId: string) => {
        setLocalItems(prev => {
            const item = prev.find(i => i._id === itemId);
            if (item?.isNew) {
                // Remove newly added items completely
                return prev.filter(i => i._id !== itemId);
            }
            // Mark existing items as deleted
            return prev.map(i =>
                i._id === itemId ? { ...i, isDeleted: true } : i
            );
        });
    };

    const handleRestoreItem = (itemId: string) => {
        setLocalItems(prev => prev.map(item =>
            item._id === itemId ? { ...item, isDeleted: false } : item
        ));
    };

    const hasChanges = () => {
        return localItems.some(item => item.isNew || item.isModified || item.isDeleted);
    };

    const resetLocalItemsFromOrder = (updatedOrder: Order) => {
        setLocalItems(
            updatedOrder.orderItems.map(item => ({
                _id: item._id,
                productId: item.productId,
                quantity: item.quantity,
                isNew: false,
                isModified: false,
                isDeleted: false
            }))
        );
    };

    const handleConfirmOrder = async () => {
        if (hasChanges()) {
            setIsExecuting(true);
            try {
                // Build the items array for sync
                // Include all non-deleted items with their quantities
                // Items with quantity 0 will be deleted by the backend
                const itemsToSync = localItems
                    .filter(item => !item.isDeleted)
                    .map(item => ({
                        productId: item.productId._id,
                        quantity: item.quantity
                    }));

                // Add deleted items with quantity 0 (only original items, not new ones)
                const deletedItems = localItems
                    .filter(item => item.isDeleted && !item.isNew)
                    .map(item => ({
                        productId: item.productId._id,
                        quantity: 0
                    }));

                const allItems = [...itemsToSync, ...deletedItems];

                // syncOrderItems returns the updated order with orderItems
                const updatedOrder = await OrdersRepository.syncOrderItems(currentOrder._id, allItems);

                // Update local state with fresh data
                setCurrentOrder(updatedOrder);
                resetLocalItemsFromOrder(updatedOrder);

                // Notify parent component
                if (onOrderUpdate) {
                    onOrderUpdate(updatedOrder);
                }
            } catch (error) {
                console.error('Error syncing order items:', error);
                alert('Error al actualizar el pedido. Por favor intente nuevamente.');
            } finally {
                setIsExecuting(false);
            }
        } else {
            // If no changes, update status based on current order status
            setIsExecuting(true);
            try {
                let nextStatus = 'pending_delivery_info';
                if (currentOrder.status === 'pending_order_confirmation') {
                    nextStatus = 'pending_delivery_info';
                } else if (currentOrder.status === 'pending_payment_confirmation') {
                    nextStatus = 'completed';
                }
                const updatedOrderData = await OrdersRepository.updateOrderStatus(currentOrder._id, nextStatus);

                // Combine updated order data with current orderItems (status change doesn't affect items)
                const updatedOrder = {
                    ...updatedOrderData,
                    orderItems: currentOrder.orderItems
                };

                // Update local state
                setCurrentOrder(updatedOrder);

                // Notify parent component
                if (onOrderUpdate) {
                    onOrderUpdate(updatedOrder);
                }
            } catch (error) {
                alert('Error al procesar el pedido. Por favor intente nuevamente.');
            } finally {
                setIsExecuting(false);
            }
        }
    };

    const getExistingProductIds = () => {
        // Get all product IDs from current local items that are not deleted
        return localItems
            .filter(item => !item.isDeleted)
            .map(item => item.productId._id);
    };

    const getConfirmButtonLabel = () => {
        if (isExecuting) return 'Procesando...';
        if (hasChanges()) return 'Confirmar Cambios';
        if (currentOrder.status === 'pending_order_confirmation') return 'Aceptar Orden';
        if (currentOrder.status === 'pending_payment_confirmation') return 'Confirmar Pago';
        return 'Aceptar Orden';
    };

    const getVisibleItems = () => localItems.filter(item => !item.isDeleted);

    const getDeletedItems = () => localItems.filter(item => item.isDeleted && !item.isNew);

    const handleDeliveryPriceSubmit = async () => {
        if (!deliveryPrice || isNaN(parseFloat(deliveryPrice))) {
            alert('Por favor ingresa un precio válido');
            return;
        }

        setIsExecuting(true);
        try {
            const priceInCents = Math.round(parseFloat(deliveryPrice) * 100);
            const updatedOrder = await OrdersRepository.updateDeliveryPrice(currentOrder._id, priceInCents);
            
            setCurrentOrder(updatedOrder);
            setDeliveryPrice('');

            if (onOrderUpdate) {
                onOrderUpdate(updatedOrder);
            }
        } catch (error) {
            console.error('Error updating delivery price:', error);
            alert('Error al actualizar el precio de entrega. Por favor intenta nuevamente.');
        } finally {
            setIsExecuting(false);
        }
    };

    return {
        activeTab,
        setActiveTab,
        tabIndicatorStyle,
        tabsRef,
        localItems,
        currentOrder,
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
        handleRestoreItem,
        handleConfirmOrder,
        getExistingProductIds,
        getConfirmButtonLabel,
        getVisibleItems,
        getDeletedItems,
        hasChanges,
        deliveryPrice,
        setDeliveryPrice,
        handleDeliveryPriceSubmit
    };
};
