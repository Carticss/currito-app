import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import './PaymentMethodModal.css';

interface CreatePaymentMethodModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const CreatePaymentMethodModal: React.FC<CreatePaymentMethodModalProps> = ({
    onClose,
    onSuccess
}) => {
    const { createPaymentMethod, uploadPaymentMethodImage, error: hookError } = usePaymentMethods();

    const [key, setKey] = useState('');
    const [valueType, setValueType] = useState<'text' | 'image'>('text');
    const [value, setValue] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!key.trim()) {
            setError('El nombre del método es requerido');
            return;
        }

        if (valueType === 'text' && !value.trim()) {
            setError('El valor es requerido para métodos de texto');
            return;
        }

        if (valueType === 'image' && !selectedFile) {
            setError('Debe seleccionar una imagen');
            return;
        }

        try {
            setSubmitting(true);

            // Create the payment method
            const newMethod = await createPaymentMethod({
                key: key.trim(),
                value: valueType === 'text' ? value.trim() : undefined,
                valueType,
                isActive
            });

            // If it's an image type, upload the image
            if (valueType === 'image' && selectedFile) {
                await uploadPaymentMethodImage(newMethod._id, selectedFile);
            }

            onSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear el método de pago';
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="payment-method-modal-overlay" onClick={onClose}>
            <div className="payment-method-modal" onClick={(e) => e.stopPropagation()}>
                <div className="payment-method-modal-header">
                    <h2>Crear Método de Pago</h2>
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
                        <label>Tipo de Valor *</label>
                        <select
                            value={valueType}
                            onChange={(e) => {
                                setValueType(e.target.value as 'text' | 'image');
                                setValue('');
                                setSelectedFile(null);
                                setPreviewUrl(null);
                            }}
                            disabled={submitting}
                        >
                            <option value="text">Texto (teléfono, cuenta, etc)</option>
                            <option value="image">Imagen (QR, código, etc)</option>
                        </select>
                    </div>

                    {valueType === 'text' ? (
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
                            <label>Imagen *</label>
                            <div className="file-input-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    disabled={submitting}
                                    id="payment-image-input"
                                />
                                <label htmlFor="payment-image-input" className="file-input-label">
                                    {selectedFile ? selectedFile.name : 'Seleccionar imagen (máx 5MB)'}
                                </label>
                            </div>
                            {previewUrl && (
                                <div className="image-preview">
                                    <img src={previewUrl} alt="Preview" />
                                </div>
                            )}
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
                            {submitting ? 'Guardando...' : 'Crear Método'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
