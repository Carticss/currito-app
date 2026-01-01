import { useState } from 'react';
import { CreateProductModal } from './components/CreateProductModal/CreateProductModal';
import { CustomSelect } from '../../components/CustomSelect/CustomSelect';
import { useInventory } from './hooks/useInventory';
import './styles/InventoryPage.css';
import { InventoryDetailsModal } from './components/InventoryDetailsModal/InventoryDetailsModal';
import { ProductTableRow } from './components/ProductTableRow/ProductTableRow';
import { ProductTableSkeleton } from './components/ProductTableSkeleton/ProductTableSkeleton';

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

    const mobileDetailsProduct = mobileDetailsProductId
        ? products.find(p => p._id === mobileDetailsProductId)
        : null;

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
                        {loading ? (
                            <ProductTableSkeleton rows={8} />
                        ) : (
                            products.map((product) => (
                                <ProductTableRow
                                    key={product._id}
                                    product={product}
                                    formatPrice={formatPrice}
                                    toggleProductAvailability={toggleProductAvailability}
                                    loadingProductId={loadingProductId}
                                    onEdit={handleEditProduct}
                                    onMobileDetailsClick={setMobileDetailsProductId}
                                    expandedTagsProductId={expandedTagsProductId}
                                    onExpandTags={setExpandedTagsProductId}
                                    onCollapseTags={() => setExpandedTagsProductId(null)}
                                />
                            ))
                        )}
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

