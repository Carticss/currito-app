import { CreateProductModal } from './components/CreateProductModal/CreateProductModal';
import { CustomSelect } from '../../components/CustomSelect/CustomSelect';
import { useInventory } from './hooks/useInventory';
import './styles/InventoryPage.css';

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
                                <td>{product.categoryId?.name || 'Sin categoría'}</td>
                                <td>{product.brandId?.name || 'Sin marca'}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {product.tags.filter(tag => tag !== null).slice(0, 1).map(tag => (
                                            <span key={tag._id} className="tag-badge">{tag.name}</span>
                                        ))}
                                        {product.tags.filter(tag => tag !== null).length > 1 && <span className="tag-more">...</span>}
                                    </div>
                                </td>
                                <td>
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

