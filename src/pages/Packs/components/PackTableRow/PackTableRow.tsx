import React from 'react';
import type { Pack } from '../../types/types';

interface PackTableRowProps {
    pack: Pack;
    formatPrice: (price: number) => string;
    togglePackAvailability: (packId: string) => void;
    loadingPackId: string | null;
    onEdit: (pack: Pack) => void;
    onDelete: (packId: string) => void;
    deletingPackId: string | null;
    onMobileDetailsClick: (packId: string) => void;
}

export const PackTableRow: React.FC<PackTableRowProps> = ({
    pack,
    formatPrice,
    togglePackAvailability,
    loadingPackId,
    onEdit,
    onDelete,
    deletingPackId,
    onMobileDetailsClick
}) => {
    const isToggling = loadingPackId === pack._id;
    const isDeleting = deletingPackId === pack._id;

    return (
        <tr>
            <td>
                <div className="pack-cell">
                    {pack.photoUrls && pack.photoUrls.length > 0 ? (
                        <img
                            src={pack.photoUrls[0]}
                            alt={pack.name}
                            className="pack-image"
                        />
                    ) : (
                        <div className="pack-image-placeholder">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                    )}
                    <div className="pack-info">
                        <span className="pack-name">{pack.name}</span>
                        {pack.description && (
                            <span className="pack-description">{pack.description}</span>
                        )}
                    </div>
                </div>
            </td>
            <td className="desktop-only">
                <strong>${formatPrice(pack.priceInCents)}</strong>
            </td>
            <td className="desktop-only">
                <span className="products-count">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    {pack.products.length} productos
                </span>
            </td>
            <td className="desktop-only">
                <span className={`status-badge ${pack.available ? 'available' : 'unavailable'}`}>
                    {pack.available ? 'Disponible' : 'No disponible'}
                </span>
            </td>
            <td className="desktop-only">
                <label className={`toggle-switch ${isToggling ? 'loading' : ''}`}>
                    <input
                        type="checkbox"
                        checked={pack.available}
                        onChange={() => togglePackAvailability(pack._id)}
                        disabled={isToggling}
                    />
                    <span className="toggle-slider"></span>
                </label>
            </td>
            <td className="desktop-only">
                <div className="actions-cell">
                    <button
                        className="action-btn edit"
                        onClick={() => onEdit(pack)}
                        title="Editar pack"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button
                        className="action-btn delete"
                        onClick={() => onDelete(pack._id)}
                        disabled={isDeleting}
                        title="Eliminar pack"
                    >
                        {isDeleting ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32"></circle>
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        )}
                    </button>
                </div>
            </td>
            <td className="mobile-only">
                <button
                    className="action-btn"
                    onClick={() => onMobileDetailsClick(pack._id)}
                    title="Ver detalles"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </td>
        </tr>
    );
};
