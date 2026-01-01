import { useRef, useEffect } from 'react';
import type { Product } from '../../types/types';
import './ProductTableRow.css';

interface ProductTableRowProps {
    product: Product;
    formatPrice: (priceInCents: number) => string;
    toggleProductAvailability: (productId: string) => void;
    loadingProductId: string | null;
    onEdit: (product: Product) => void;
    onMobileDetailsClick: (productId: string) => void;
    expandedTagsProductId: string | null;
    onExpandTags: (productId: string) => void;
    onCollapseTags: () => void;
}

export const ProductTableRow = ({
    product,
    formatPrice,
    toggleProductAvailability,
    loadingProductId,
    onEdit,
    onMobileDetailsClick,
    expandedTagsProductId,
    onExpandTags,
    onCollapseTags
}: ProductTableRowProps) => {
    const tagsBubbleRef = useRef<HTMLDivElement>(null);
    const tagsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            event.preventDefault();
            if (
                tagsBubbleRef.current && !tagsBubbleRef.current.contains(event.target as Node) &&
                tagsContainerRef.current && !tagsContainerRef.current.contains(event.target as Node)
            ) {
                onCollapseTags();
            }
        };

        if (expandedTagsProductId === product._id) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [expandedTagsProductId, product._id, onCollapseTags]);

    return (
        <tr>
            <td>
                <div className="product-cell">
                    <img src={product.photoUrl} alt={product.name} className="product-image" />
                    <span className="product-name">{product.name}</span>
                </div>
            </td>
            <td className="desktop-only">{formatPrice(product.priceInCents)}</td>
            <td className="desktop-only">{product.sku}</td>
            <td className="desktop-only">{product.categoryId?.name || 'Sin categoría'}</td>
            <td className="desktop-only">{product.brandId?.name || 'Sin marca'}</td>
            <td className="desktop-only" style={{ position: 'relative' }}>
                <div
                    ref={tagsContainerRef}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: product.tags.filter(tag => tag !== null).length
                            > 1 ? 'pointer' : 'default'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (product.tags.filter(tag => tag !== null).length > 1) {
                            if (expandedTagsProductId !== product._id) {
                                onExpandTags(product._id);
                            } else {
                                onCollapseTags();
                            }
                        }

                    }}
                >
                    {product.tags.filter(tag => tag !== null).slice(0, 1).map(tag => (
                        <span key={tag._id} className="tag-badge">{tag.name}</span>
                    ))}
                    {product.tags.filter(tag => tag !== null).length > 1 && <span className="tag-more">...</span>}
                </div>

                {expandedTagsProductId === product._id && (
                    <div className="tags-bubble" ref={tagsBubbleRef}>
                        {product.tags.filter(tag => tag !== null).map(tag => (
                            <span key={tag._id} className="tag-badge">{tag.name}</span>
                        ))}
                    </div>
                )}
            </td>
            <td className="desktop-only">
                <div className="status-container">
                    <label className={`toggle-switch ${loadingProductId === product._id ? 'loading' : ''}`}>
                        <input
                            type="checkbox"
                            checked={product.available}
                            onChange={() => toggleProductAvailability(product._id)}
                            disabled={loadingProductId === product._id}
                        />
                        <span className="slider"></span>
                    </label>
                    <span className={`status-badge ${product.available ? 'available' : 'unavailable'}`}>
                        {product.available ? 'Disponible' : 'No disponible'}
                    </span>
                </div>
            </td>
            <td className="desktop-only">
                <button className="action-btn" onClick={() => onEdit(product)}>Editar</button>
            </td>
            <td className="mobile-only">
                <button
                    className="mobile-details-btn"
                    onClick={() => onMobileDetailsClick(product._id)}
                >
                    ›
                </button>
            </td>
        </tr>
    );
};
