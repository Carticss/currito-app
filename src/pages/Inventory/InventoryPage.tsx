import { useState, useRef, useEffect } from 'react';
import { CreateProductModal } from './components/CreateProductModal/CreateProductModal';
import { CustomSelect } from '../../components/CustomSelect/CustomSelect';
import { useInventory } from './hooks/useInventory';
import './styles/InventoryPage.css';
import { InventoryDetailsModal } from './components/InventoryDetailsModal/InventoryDetailsModal';

export const InventoryPage = () => {
    const {
        products,
        loading,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        categories,
        formatPrice,
        toggleProductAvailability,
        loadingProductId,
        isModalOpen,
        setIsModalOpen,
        selectedProduct,
        setSelectedProduct,
        handleProductCreated,
        handleEditProduct,
        handleCloseModal
    } = useInventory();

    const [mobileDetailsProductId, setMobileDetailsProductId] = useState<string | null>(null);
    const [expandedTagsProductId, setExpandedTagsProductId] = useState<string | null>(null);
    const tagsBubbleRef = useRef<HTMLDivElement>(null);

    const mobileDetailsProduct = mobileDetailsProductId
        ? products.find(p => p._id === mobileDetailsProductId)
        : null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tagsBubbleRef.current && !tagsBubbleRef.current.contains(event.target as Node)) {
                setExpandedTagsProductId(null);
            }
        };

        if (expandedTagsProductId) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [expandedTagsProductId]);

    if (loading) {
        return <div className="inventory-container">Cargando inventario...</div>;
    }

    const categoryOptions = [
        { value: "", label: "Todas las categorías" },
        ...categories.map(category => ({
            value: category._id,
            label: category.name
        }))
    ];

    const statusOptions = [
        { value: "all", label: "Todos los estados" },
        { value: "available", label: "Disponible" },
        { value: "unavailable", label: "No disponible" }
    ];

    return (
        <div className="inventory-container">
            <header className="inventory-header">
                <div className="header-actions">
                    <button className="btn-secondary">Importar Archivo</button>
                    <button className="btn-primary" onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}>Nuevo producto</button>
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
                        placeholder="Buscar por nombre o SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <CustomSelect
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    options={categoryOptions}
                    className="filter-select-custom"
                />
                <CustomSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statusOptions}
                    className="filter-select-custom"
                />
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>PRODUCTO</th>
                            <th className="desktop-only">PRECIO $</th>
                            <th className="desktop-only">SKU</th>
                            <th className="desktop-only">CATEGORÍA</th>
                            <th className="desktop-only">MARCA</th>
                            <th className="desktop-only">ETIQUETAS</th>
                            <th className="desktop-only">ESTADO</th>
                            <th className="desktop-only">ACCIONES</th>
                            <th className="mobile-only"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
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
                                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedTagsProductId(product._id);
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
                                    <button className="action-btn" onClick={() => handleEditProduct(product)}>Editar</button>
                                </td>
                                <td className="mobile-only">
                                    <button
                                        className="mobile-details-btn"
                                        onClick={() => setMobileDetailsProductId(product._id)}
                                    >
                                        ›
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CreateProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onProductCreated={handleProductCreated}
                productToEdit={selectedProduct}
            />

            {mobileDetailsProduct && (
                <InventoryDetailsModal
                    product={mobileDetailsProduct}
                    onClose={() => setMobileDetailsProductId(null)}
                    formatPrice={formatPrice}
                    onToggleAvailability={toggleProductAvailability}
                    onEdit={(p) => {
                        setMobileDetailsProductId(null);
                        handleEditProduct(p);
                    }}
                    loadingProductId={loadingProductId}
                />
            )}
        </div>
    );
};

