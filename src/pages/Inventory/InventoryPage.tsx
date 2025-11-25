import { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import { CreateProductModal } from './components/CreateProductModal';
import type { Product } from './types/types';
import './InventoryPage.css';

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
        toggleProductAvailability
    } = useInventory();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleProductCreated = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        window.location.reload();
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    if (loading) {
        return <div className="inventory-container">Cargando inventario...</div>;
    }

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
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por nombre o SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">Todas las categorías</option>
                    {categories.map(category => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Todos los estados</option>
                    <option value="available">Disponible</option>
                    <option value="unavailable">No disponible</option>
                </select>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>PRODUCTO</th>
                            <th>PRECIO $</th>
                            <th>SKU</th>
                            <th>CATEGORÍA</th>
                            <th>MARCA</th>
                            <th>ETIQUETAS</th>
                            <th>ESTADO</th>
                            <th>ACCIONES</th>
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
                                <td>{formatPrice(product.priceInCents)}</td>
                                <td>{product.sku}</td>
                                <td>{product.categoryId.name}</td>
                                <td>{product.brandId.name}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {product.tags.slice(0, 1).map(tag => (
                                            <span key={tag._id} className="tag-badge">{tag.name}</span>
                                        ))}
                                        {product.tags.length > 1 && <span className="tag-more">...</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="status-container">
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={product.available}
                                                onChange={() => toggleProductAvailability(product._id)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                        <span className={`status - badge ${product.available ? 'available' : 'unavailable'} `}>
                                            {product.available ? 'Disponible' : 'No disponible'}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <button className="action-btn" onClick={() => handleEditProduct(product)}>Editar</button>
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
        </div>
    );
};

