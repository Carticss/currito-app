import React from 'react';
import '../../styles/CreateProductModal.css';
import type { Product } from '../../types/types';
import { useCreateProduct } from '../../hooks/useCreateProduct';
import { CustomSelect } from '../../../../components/CustomSelect/CustomSelect';
import { MultiImageCropperModal } from '../MultiImageCropperModal/MultiImageCropperModal';

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

    const handleImageAreaClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';
        input.onchange = (e) => {
            const event = e as any;
            const changeEvent = {
                target: {
                    files: event.target.files
                }
            } as React.ChangeEvent<HTMLInputElement>;
            actions.handleFileMultipleChange(changeEvent);
        };
        input.click();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
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
                        <label>Imágenes del Producto</label>
                        <div className="image-upload-container">
                            <div 
                                className={`image-upload-area ${formState.imagePreviews.length > 0 ? 'has-images' : ''}`}
                                onClick={handleImageAreaClick}
                            >
                                {formState.imagePreviews.length > 0 ? (
                                    <div className="image-gallery" onClick={(e) => e.stopPropagation()}>
                                        {formState.imagePreviews.map((preview, idx) => (
                                            <div key={idx} className="image-gallery-item">
                                                <img src={preview} alt={`Preview ${idx + 1}`} />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        actions.handleRemoveImage(idx);
                                                    }}
                                                    title="Eliminar imagen"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <div className="image-gallery-item add-more" onClick={handleImageAreaClick}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="image-placeholder-content">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                            <polyline points="21 15 16 10 5 21"></polyline>
                                        </svg>
                                        <span>Haz clic para subir imágenes</span>
                                    </div>
                                )}
                            </div>
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
                        <label>Las etiquetas se crearán automaticamente a partir de las fotos proporcionadas.</label>
                        <div className="tags-list">
                            {formState.selectedTagIds.map(tagId => {
                                const tag = auxData.tags.find(t => t._id === tagId);
                                return tag ? (
                                    <span key={tag._id + Math.random().toString(36).substr(2, 9)} className="tag-chip">
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

            {cropperState.tempImageSources.length > 0 && (
                <MultiImageCropperModal
                    isOpen={cropperState.isMultiCropperOpen}
                    images={cropperState.tempImageSources.map((item) => ({
                        id: item.id,
                        src: item.src,
                        isCropped: false
                    }))}
                    onCropComplete={actions.handleMultipleCropComplete}
                    onClose={actions.handleMultiCropperClose}
                />
            )}
        </div>
    );
};
