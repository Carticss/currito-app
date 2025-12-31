import React, { useEffect, useState } from 'react';
import { HiTrash, HiPencil, HiPlus } from 'react-icons/hi';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import type { PaymentMethod } from '../../repository/PaymentMethodsRepository';
import { EditPaymentMethodModal } from './EditPaymentMethodModal';
import { CreatePaymentMethodModal } from './CreatePaymentMethodModal';
import './PaymentMethods.css';

export const PaymentMethods: React.FC = () => {
    const {
        paymentMethods,
        loading,
        error,
        fetchPaymentMethods,
        deletePaymentMethod
    } = usePaymentMethods();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    const handleDeletePaymentMethod = async (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar este método de pago?')) {
            setDeleting(id);
            try {
                await deletePaymentMethod(id);
            } finally {
                setDeleting(null);
            }
        }
    };

    const handleEditClick = (method: PaymentMethod) => {
        setSelectedMethod(method);
        setShowEditModal(true);
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        fetchPaymentMethods();
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        setSelectedMethod(null);
        fetchPaymentMethods();
    };

    if (loading) {
        return <div className="payment-methods-loading">Cargando métodos de pago...</div>;
    }

    // Ensure paymentMethods is always an array
    const methods = Array.isArray(paymentMethods) ? paymentMethods : [];

    return (
        <div className="payment-methods-container">
            <div className="payment-methods-header">
                <h2 className="payment-methods-title">Métodos de Pago</h2>
                <button
                    className="payment-methods-add-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    <HiPlus /> Agregar Método
                </button>
            </div>

            {error && <div className="payment-methods-error">{error}</div>}

            {methods.length === 0 ? (
                <div className="payment-methods-empty">
                    <p>No hay métodos de pago configurados</p>
                    <button
                        className="payment-methods-empty-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Crear el primer método
                    </button>
                </div>
            ) : (
                <div className="payment-methods-list">
                    {methods.map((method) => (
                        <div key={method._id} className="payment-method-card">
                            <div className="payment-method-content">
                                <div className="payment-method-info">
                                    <h3 className="payment-method-key">{method.key}</h3>
                                    <p className="payment-method-type">
                                        Tipo: {method.valueType === 'text' ? 'Texto' : 'Imagen'}
                                    </p>
                                    {method.valueType === 'text' && method.value && (
                                        <p className="payment-method-value">{method.value}</p>
                                    )}
                                    {method.valueType === 'image' && method.value && (
                                        <img
                                            src={method.value}
                                            alt={method.key}
                                            className="payment-method-image"
                                        />
                                    )}
                                </div>
                                <div className="payment-method-status">
                                    <span className={`status-badge ${method.isActive ? 'active' : 'inactive'}`}>
                                        {method.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>

                            <div className="payment-method-actions">
                                <button
                                    className="payment-method-edit-btn"
                                    onClick={() => handleEditClick(method)}
                                    title="Editar"
                                >
                                    <HiPencil />
                                </button>
                                <button
                                    className="payment-method-delete-btn"
                                    onClick={() => handleDeletePaymentMethod(method._id)}
                                    disabled={deleting === method._id}
                                    title="Eliminar"
                                >
                                    <HiTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <CreatePaymentMethodModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}

            {showEditModal && selectedMethod && (
                <EditPaymentMethodModal
                    paymentMethod={selectedMethod}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedMethod(null);
                    }}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};
