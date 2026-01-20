import { useState, useEffect, useMemo } from 'react';
import type { Pack } from '../types/types';
import { PacksRepository } from '../repositories/PacksRepository';

export const usePacks = () => {
    const [packs, setPacks] = useState<Pack[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
    const [loadingPackId, setLoadingPackId] = useState<string | null>(null);
    const [deletingPackId, setDeletingPackId] = useState<string | null>(null);

    const handlePackCreated = () => {
        setIsModalOpen(false);
        setSelectedPack(null);
        fetchPacks();
    };

    const handleEditPack = (pack: Pack) => {
        setSelectedPack(pack);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPack(null);
    };

    const fetchPacks = async () => {
        try {
            setLoading(true);
            const data = await PacksRepository.getPacks();
            setPacks(data);
        } catch (err) {
            setError('Error al cargar los packs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPacks();
    }, []);

    const formatPrice = (priceInCents: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(priceInCents / 100);
    };

    const refreshPack = async (id: string) => {
        try {
            const updatedPack = await PacksRepository.getPackById(id);
            setPacks(prevPacks =>
                prevPacks.map(p => p._id === id ? updatedPack : p)
            );
        } catch (err) {
            console.error('Error refreshing pack:', err);
        }
    };

    const togglePackAvailability = async (packId: string) => {
        try {
            setLoadingPackId(packId);
            const pack = packs.find(p => p._id === packId);
            if (!pack) return;

            const updateData = {
                available: !pack.available
            };

            await PacksRepository.updatePack(packId, updateData);
            await refreshPack(packId);
        } catch (error) {
            console.error('Error toggling pack availability:', error);
        } finally {
            setLoadingPackId(null);
        }
    };

    const deletePack = async (packId: string) => {
        try {
            setDeletingPackId(packId);
            await PacksRepository.deletePack(packId);
            setPacks(prevPacks => prevPacks.filter(p => p._id !== packId));
        } catch (error) {
            console.error('Error deleting pack:', error);
            setError('Error al eliminar el pack');
        } finally {
            setDeletingPackId(null);
        }
    };

    const filteredPacks = useMemo(() => {
        return packs.filter(pack => {
            // Search filter
            const matchesSearch = pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (pack.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

            // Status filter
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'available' && pack.available) ||
                (statusFilter === 'unavailable' && !pack.available);

            return matchesSearch && matchesStatus;
        });
    }, [packs, searchTerm, statusFilter]);

    return {
        packs: filteredPacks,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        formatPrice,
        refreshPack,
        togglePackAvailability,
        loadingPackId,
        deletePack,
        deletingPackId,
        isModalOpen,
        setIsModalOpen,
        selectedPack,
        setSelectedPack,
        handlePackCreated,
        handleEditPack,
        handleCloseModal
    };
};
