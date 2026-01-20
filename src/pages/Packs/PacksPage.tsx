import { useState } from 'react';
import { CreatePackModal } from './components/CreatePackModal/CreatePackModal';
import { CustomSelect } from '../../components/CustomSelect/CustomSelect';
import { usePacks } from './hooks/usePacks';
import './styles/PacksPage.css';
import { PackDetailsModal } from './components/PackDetailsModal/PackDetailsModal';
import { PackTableRow } from './components/PackTableRow/PackTableRow';
import { PackTableSkeleton } from './components/PackTableSkeleton/PackTableSkeleton';

export const PacksPage = () => {
    const {
        packs,
        loading,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        formatPrice,
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
    } = usePacks();

    const [mobileDetailsPackId, setMobileDetailsPackId] = useState<string | null>(null);

    const mobileDetailsPack = mobileDetailsPackId
        ? packs.find(p => p._id === mobileDetailsPackId)
        : null;

    const statusOptions = [
        { value: "all", label: "Todos los estados" },
        { value: "available", label: "Disponible" },
        { value: "unavailable", label: "No disponible" }
    ];

    const handleDeletePack = (packId: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este pack?')) {
            deletePack(packId);
        }
    };

    return (
        <div className="packs-container">
            <header className="packs-header">
                <div className="header-actions">
                    <button
                        className="btn-primary"
                        onClick={() => { setSelectedPack(null); setIsModalOpen(true); }}
                    >
                        Nuevo pack
                    </button>
                </div>
            </header>

            <div className="filters-bar">
                <div className="search-container">
                    <span className="search-icon">
                        <img src="search-icon.svg" alt="Search" />
                    </span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <CustomSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statusOptions}
                    className="filter-select-custom"
                />
            </div>

            <div className="packs-table-container">
                <table className="packs-table">
                    <thead>
                        <tr>
                            <th>PACK</th>
                            <th className="desktop-only">PRECIO $</th>
                            <th className="desktop-only">PRODUCTOS</th>
                            <th className="desktop-only">ESTADO</th>
                            <th className="desktop-only">DISPONIBLE</th>
                            <th className="desktop-only">ACCIONES</th>
                            <th className="mobile-only"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <PackTableSkeleton rows={8} />
                        ) : packs.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <div className="empty-state">
                                        <div className="empty-state-icon">
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                            </svg>
                                        </div>
                                        <h3>No hay packs creados</h3>
                                        <p>Crea tu primer pack de productos para comenzar</p>
                                        <button
                                            className="btn-primary"
                                            onClick={() => { setSelectedPack(null); setIsModalOpen(true); }}
                                        >
                                            Crear primer pack
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            packs.map((pack) => (
                                <PackTableRow
                                    key={pack._id}
                                    pack={pack}
                                    formatPrice={formatPrice}
                                    togglePackAvailability={togglePackAvailability}
                                    loadingPackId={loadingPackId}
                                    onEdit={handleEditPack}
                                    onDelete={handleDeletePack}
                                    deletingPackId={deletingPackId}
                                    onMobileDetailsClick={setMobileDetailsPackId}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <CreatePackModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onPackCreated={handlePackCreated}
                packToEdit={selectedPack}
            />

            {mobileDetailsPack && (
                <PackDetailsModal
                    pack={mobileDetailsPack}
                    onClose={() => setMobileDetailsPackId(null)}
                    formatPrice={formatPrice}
                    onToggleAvailability={togglePackAvailability}
                    onEdit={(p) => {
                        setMobileDetailsPackId(null);
                        handleEditPack(p);
                    }}
                    loadingPackId={loadingPackId}
                />
            )}
        </div>
    );
};
