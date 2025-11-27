import { useState, useEffect } from 'react';
import { InventoryRepository } from '../../Inventory/repositories/InventoryRepository';
import type { Product as InventoryProduct } from '../../Inventory/types/types';
import type { Product as OrderProduct } from '../../Orders/types/types';

export type ModalProduct = InventoryProduct | OrderProduct;

interface UseExtraItemModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit_quantity';
    initialItem?: { product: ModalProduct; quantity: number };
    existingProductIds?: string[];
    onConfirm: (product: ModalProduct, quantity: number) => void;
    onClose: () => void;
}

export const useExtraItemModal = ({
    isOpen,
    mode,
    initialItem,
    existingProductIds = [],
    onConfirm,
    onClose
}: UseExtraItemModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<InventoryProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<InventoryProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ModalProduct | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'add') {
                loadProducts();
                setSelectedProduct(null);
                setQuantity(1);
                setSearchQuery('');
            } else if (mode === 'edit_quantity' && initialItem) {
                setSelectedProduct(initialItem.product);
                setQuantity(initialItem.quantity);
            }
        }
    }, [isOpen, mode, initialItem]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await InventoryRepository.getProducts();
            // Filter to only show available products
            const availableProducts = data.filter(p => p.available);
            setProducts(availableProducts);
            setFilteredProducts(availableProducts);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mode === 'add') {
            const lowerQuery = searchQuery.toLowerCase();
            setFilteredProducts(
                products.filter(p =>
                    p.name.toLowerCase().includes(lowerQuery) ||
                    p.sku.toLowerCase().includes(lowerQuery)
                )
            );
        }
    }, [searchQuery, products, mode]);

    const handleConfirm = () => {
        if (selectedProduct) {
            onConfirm(selectedProduct, quantity);
            onClose();
        }
    };

    const increaseQuantity = () => setQuantity(q => q + 1);
    const decreaseQuantity = () => setQuantity(q => Math.max(1, q - 1));
    const handleQuantityChange = (val: number) => setQuantity(val || 1);

    const isProductDisabled = (productId: string) => {
        return existingProductIds.includes(productId);
    };

    return {
        searchQuery,
        setSearchQuery,
        filteredProducts,
        selectedProduct,
        setSelectedProduct,
        quantity,
        increaseQuantity,
        decreaseQuantity,
        handleQuantityChange,
        loading,
        handleConfirm,
        isProductDisabled
    };
};
