import React from 'react';
import '../../styles/CreateProductModal.css';
import type { Product } from '../../types/types';
import { useCreateProduct } from '../../hooks/useCreateProduct';
import { CustomSelect } from '../../../../components/CustomSelect/CustomSelect';
import { ImageCropperModal } from '../ImageCropperModal/ImageCropperModal';

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductCreated: () => void;
    productToEdit?: Product | null;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose, onProductCreated, productToEdit }) => {
    const { formState, cropperState, auxData, actions, uiState } = useCreateProduct(() => {
        onProductCreated();
        onClose();
    }, productToEdit);

    if (!isOpen) return null;

    const categoryOptions = [
        { value: "", label: "Seleccionar categoría" },
        ...auxData.categories.map(cat => ({ value: cat._id, label: cat.name }))
    ];

    const brandOptions = [
        { value: "", label: "Seleccionar marca" },
        ...auxData.brands.map(brand => ({ value: brand._id, label: brand.name }))
    ];

    const tagOptions = auxData.tags.map(tag => ({ value: tag._id, label: tag.name }));

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
                            <button type="button" className="upload-btn" onClick={actions.handleFileClick}>
                                Subir nueva imagen
                            </button>
                            <input
                                type="file"
                                ref={cropperState.fileInputRef}
                                onChange={actions.handleFileChange}
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
                        <CustomSelect
                            value={formState.categoryId}
                            onChange={formState.setCategoryId}
                            options={categoryOptions}
                            className="form-select-custom"
                            placeholder="Seleccionar categoría"
                        />
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
                        <CustomSelect
                            value={formState.brandId}
                            onChange={formState.setBrandId}
                            options={brandOptions}
                            className="form-select-custom"
                            placeholder="Seleccionar marca"
                        />
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
                            <CustomSelect
                                value=""
                                onChange={actions.handleAddTag}
                                options={tagOptions}
                                className="form-select-custom"
                                placeholder="Seleccionar etiqueta..."
                            />
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

            {cropperState.tempImageSrc && (
                <ImageCropperModal
                    isOpen={cropperState.isCropperOpen}
                    imageSrc={cropperState.tempImageSrc}
                    onCropComplete={actions.handleCropComplete}
                    onClose={actions.handleCropperClose}
                />
            )}
        </div>
    );
};
