import React, { useRef } from 'react';
import { useCreateProduct } from '../hooks/useCreateProduct';
import type { Product } from '../types/types';
import './CreateProductModal.css';

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductCreated: () => void;
    productToEdit?: Product | null;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose, onProductCreated, productToEdit }) => {
    const { formState, auxData, actions, uiState } = useCreateProduct(() => {
        onProductCreated();
        onClose();
    }, productToEdit);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            formState.handleImageChange(e.target.files[0]);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2> {/* Title from design, though it's "Create" logic */}
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {uiState.error && <div className="error-message">{uiState.error}</div>}

                    <div className="form-group">
                        <label>Imagen del Producto</label>
                        <div className="image-upload-container">
                            <div className="image-preview">
                                {formState.imagePreview ? (
                                    <img src={formState.imagePreview} alt="Preview" />
                                ) : (
                                    <span className="image-placeholder">IMG</span>
                                )}
                            </div>
                            <button type="button" className="upload-btn" onClick={handleFileClick}>
                                Subir nueva imagen
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Nombre del Producto <span className="required">*</span></label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Nombre del producto"
                            value={formState.name}
                            onChange={(e) => formState.setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>SKU</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="SKU del producto"
                            value={formState.sku}
                            onChange={(e) => formState.setSku(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Categoría</label>
                        <select
                            className="form-select"
                            value={formState.categoryId}
                            onChange={(e) => formState.setCategoryId(e.target.value)}
                        >
                            <option value="">Seleccionar categoría</option>
                            {auxData.categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        {!formState.isCreatingCategory ? (
                            <button type="button" className="inline-create-btn" onClick={() => formState.setIsCreatingCategory(true)}>
                                + Crear categoría
                            </button>
                        ) : (
                            <div className="inline-create-form">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Nombre de categoría"
                                    value={formState.newCategoryName}
                                    onChange={(e) => formState.setNewCategoryName(e.target.value)}
                                />
                                <div className="inline-create-actions">
                                    <button type="button" className="btn-xs" onClick={() => formState.setIsCreatingCategory(false)}>Cancelar</button>
                                    <button type="button" className="btn-xs btn-save" onClick={actions.handleCreateCategorySubmit}>Guardar</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Marca / Proveedor</label>
                        <select
                            className="form-select"
                            value={formState.brandId}
                            onChange={(e) => formState.setBrandId(e.target.value)}
                        >
                            <option value="">Seleccionar marca</option>
                            {auxData.brands.map(brand => (
                                <option key={brand._id} value={brand._id}>{brand.name}</option>
                            ))}
                        </select>
                        {!formState.isCreatingBrand ? (
                            <button type="button" className="inline-create-btn" onClick={() => formState.setIsCreatingBrand(true)}>
                                + Crear marca
                            </button>
                        ) : (
                            <div className="inline-create-form">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Nombre de marca"
                                    value={formState.newBrandName}
                                    onChange={(e) => formState.setNewBrandName(e.target.value)}
                                />
                                <div className="inline-create-actions">
                                    <button type="button" className="btn-xs" onClick={() => formState.setIsCreatingBrand(false)}>Cancelar</button>
                                    <button type="button" className="btn-xs btn-save" onClick={actions.handleCreateBrandSubmit}>Guardar</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            className="form-textarea"
                            value={formState.description}
                            onChange={(e) => formState.setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Disponibilidad</label>
                        <div className="toggle-container">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={formState.available}
                                    onChange={(e) => formState.setAvailable(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                            <span className="toggle-label">Disponible</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Precio</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>$</span>
                            <input
                                type="number"
                                className="form-input"
                                style={{ paddingLeft: '25px' }}
                                placeholder="0.00"
                                value={formState.price}
                                onChange={(e) => formState.setPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Etiquetas (opcional)</label>
                        <div className="tags-list">
                            {formState.selectedTagIds.map(tagId => {
                                const tag = auxData.tags.find(t => t._id === tagId);
                                return tag ? (
                                    <span key={tag._id} className="tag-chip">
                                        {tag.name}
                                        <span className="tag-remove" onClick={() => actions.removeTag(tag._id)}>×</span>
                                    </span>
                                ) : null;
                            })}
                        </div>
                        <div className="tags-input-container">
                            <select
                                className="form-select"
                                onChange={(e) => {
                                    actions.handleAddTag(e.target.value);
                                    e.target.value = "";
                                }}
                            >
                                <option value="">Seleccionar etiqueta...</option>
                                {auxData.tags.map(tag => (
                                    <option key={tag._id} value={tag._id}>{tag.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="tags-input-container" style={{ marginTop: '0.5rem' }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Nueva etiqueta..."
                                value={formState.newTagName}
                                onChange={(e) => formState.setNewTagName(e.target.value)}
                            />
                            <button type="button" className="btn-secondary" onClick={actions.handleCreateTagSubmit}>Crear</button>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                    <button
                        type="button"
                        className="btn-save"
                        onClick={actions.handleSubmit}
                        disabled={uiState.isLoading}
                    >
                        {uiState.isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
};
