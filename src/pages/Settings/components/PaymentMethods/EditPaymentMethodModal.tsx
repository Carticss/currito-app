import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import type { PaymentMethod } from '../../repository/PaymentMethodsRepository';
import './PaymentMethodModal.css';

interface EditPaymentMethodModalProps {
    paymentMethod: PaymentMethod;
    onClose: () => void;
    onSuccess: () => void;
}

export const EditPaymentMethodModal: React.FC<EditPaymentMethodModalProps> = ({
    paymentMethod,
    onClose,
    onSuccess
}) => {
    const { updatePaymentMethod, uploadPaymentMethodImage, deletePaymentMethodImage, error: hookError } = usePaymentMethods();

    const [key, setKey] = useState(paymentMethod.key);
    const [value, setValue] = useState(paymentMethod.value || '');
    const [isActive, setIsActive] = useState(paymentMethod.isActive);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(paymentMethod.valueType === 'image' ? paymentMethod.value || null : null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('El archivo no debe superar 5MB');
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleDeleteImage = async () => {
        if (window.confirm('¿Desea eliminar esta imagen?')) {
            try {
                setSubmitting(true);
                await deletePaymentMethodImage(paymentMethod._id);
                setPreviewUrl(null);
                setSelectedFile(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la imagen';
                setError(errorMessage);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!key.trim()) {
            setError('El nombre del método es requerido');
            return;
        }

        if (paymentMethod.valueType === 'text' && !value.trim()) {
            setError('El valor es requerido');
            return;
        }

        try {
            setSubmitting(true);

            // Update the payment method
            await updatePaymentMethod(paymentMethod._id, {
                key: key.trim(),
                value: paymentMethod.valueType === 'text' ? value.trim() : value,
                isActive
            });

            // If a new image was selected, upload it
            if (paymentMethod.valueType === 'image' && selectedFile) {
                await uploadPaymentMethodImage(paymentMethod._id, selectedFile);
            }

            onSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el método de pago';
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="payment-method-modal-overlay" onClick={onClose}>
            <div className="payment-method-modal" onClick={(e) => e.stopPropagation()}>
                <div className="payment-method-modal-header">
                    <h2>Editar Método de Pago</h2>
                    <button
                        className="payment-method-modal-close"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        <HiX />
                    </button>
                </div>

                {(error || hookError) && (
                    <div className="payment-method-modal-error">
                        {error || hookError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="payment-method-form">
                    <div className="form-group">
                        <label>Nombre del Método *</label>
                        <input
                            type="text"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="ej: Nequi, PayPal, Transferencia"
                            disabled={submitting}
                            maxLength={100}
                        />
                        <span className="char-count">{key.length}/100</span>
                    </div>

                    <div className="form-group">
                        <label>Tipo de Valor</label>
                        <input
                            type="text"
                            value={paymentMethod.valueType === 'text' ? 'Texto' : 'Imagen'}
                            disabled
                            className="disabled-input"
                        />
                        <p className="help-text">El tipo de valor no puede ser modificado</p>
                    </div>

                    {paymentMethod.valueType === 'text' ? (
                        <div className="form-group">
                            <label>Valor *</label>
                            <textarea
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Ingrese el valor (teléfono, número de cuenta, etc)"
                                disabled={submitting}
                                maxLength={500}
                                rows={3}
                            />
                            <span className="char-count">{value.length}/500</span>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>Imagen</label>
                            {previewUrl && (
                                <div className="image-preview-container">
                                    <div className="image-preview">
                                        <img src={previewUrl} alt="Preview" />
                                    </div>
                                    {paymentMethod.value === previewUrl && (
                                        <button
                                            type="button"
                                            className="btn-delete-image"
                                            onClick={handleDeleteImage}
                                            disabled={submitting}
                                        >
                                            Eliminar Imagen Actual
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="file-input-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    disabled={submitting}
                                    id="payment-image-input"
                                />
                                <label htmlFor="payment-image-input" className="file-input-label">
                                    {selectedFile ? selectedFile.name : 'Seleccionar nueva imagen (máx 5MB)'}
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="form-group checkbox">
                        <input
                            type="checkbox"
                            id="is-active"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            disabled={submitting}
                        />
                        <label htmlFor="is-active">Activo</label>
                    </div>

                    <div className="payment-method-modal-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
