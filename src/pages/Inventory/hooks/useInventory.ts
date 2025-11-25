import { useState, useEffect, useMemo } from 'react';
import type { Product, Category } from '../types/types';
import { InventoryRepository } from '../repositories/InventoryRepository';

export const useInventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await InventoryRepository.getProducts();
                setProducts(data);
            } catch (err) {
                setError('Error al cargar los productos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const formatPrice = (priceInCents: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(priceInCents / 100);
    };

    const refreshProduct = async (id: string) => {
        try {
            const updatedProduct = await InventoryRepository.getProductById(id);
            setProducts(prevProducts =>
                prevProducts.map(p => p._id === id ? updatedProduct : p)
            );
        } catch (err) {
            console.error('Error refreshing product:', err);
        }
    };

    const toggleProductAvailability = async (productId: string) => {
        try {
            const product = products.find(p => p._id === productId);
            if (!product) return;

            const updateData = {
                name: product.name,
                description: product.description,
                sku: product.sku,
                priceInCents: product.priceInCents,
                available: !product.available,
                categoryId: product.categoryId._id,
                brandId: product.brandId._id,
                tagIds: product.tags.map(tag => tag._id),
                photoUrl: product.photoUrl
            };

            await InventoryRepository.updateProduct(productId, updateData);
            await refreshProduct(productId);
        } catch (error) {
            console.error('Error toggling product availability:', error);
        }
    };

    const categories = useMemo(() => {
        const uniqueCategories = new Map<string, Category>();
        products.forEach(product => {
            if (!uniqueCategories.has(product.categoryId._id)) {
                uniqueCategories.set(product.categoryId._id, product.categoryId);
            }
        });
        return Array.from(uniqueCategories.values());
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Search filter
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase());

            // Category filter
            const matchesCategory = !categoryFilter || product.categoryId._id === categoryFilter;

            // Status filter
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'available' && product.available) ||
                (statusFilter === 'unavailable' && !product.available);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products, searchTerm, categoryFilter, statusFilter]);

    return {
        products: filteredProducts,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        categories,
        formatPrice,
        refreshProduct,
        toggleProductAvailability
    };
};
