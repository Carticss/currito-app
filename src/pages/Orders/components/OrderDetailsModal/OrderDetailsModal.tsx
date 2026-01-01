import React from 'react';
import type { Order } from '../../types/types';
import { ExtraItemModal } from '../ExtraItemModal/ExtraItemModal';
import { useOrderDetails } from '../../hooks/useOrderDetails';
import { DetailsView } from './DetailsView';
import { ChatView } from './ChatView';
import './OrderDetailsModal.css';

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
    const {
        activeTab,
        setActiveTab,
        tabIndicatorStyle,
        tabsRef,
        pendingActions,
        isExecuting,
        isExtraItemModalOpen,
        setIsExtraItemModalOpen,
        modalMode,
        modalInitialItem,
        handleOpenAddModal,
        handleOpenExchangeModal,
        handleOpenEditQuantityModal,
        handleModalConfirm,
        handleDeleteItem,
        handleConfirmOrder,
        getPendingStatus,
        getExistingProductIds,
        getConfirmButtonLabel
    } = useOrderDetails(order, onClose);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Pedido {order.orderNumber}</h2>
                        <div className="modal-subtitle">{order.endUserId.name} • {order.endUserId.whatsappNumber}</div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-tabs" ref={tabsRef}>
                    <button
                        className={`tab-btn details ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Detalles del Pedido
                    </button>
                    <button
                        className={`tab-btn chat ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        Chat con Cliente
                    </button>
                    <div className="tab-indicator" style={tabIndicatorStyle} />
                </div>

                <div className="modal-content-viewport">
                    <div className={`views-slider ${activeTab}`}>
                        <DetailsView
                            order={order}
                            pendingActions={pendingActions}
                            getPendingStatus={getPendingStatus}
                            handleOpenEditQuantityModal={handleOpenEditQuantityModal}
                            handleOpenExchangeModal={handleOpenExchangeModal}
                            handleDeleteItem={handleDeleteItem}
                            handleOpenAddModal={handleOpenAddModal}
                            isOrderCompleted={order.status === 'completed'}
                        />

                        <ChatView orderId={order._id} />
                    </div>
                </div>

                {order.status !== 'completed' && (
                    <div className="modal-footer">
                        <button
                            className="action-btn primary"
                            onClick={handleConfirmOrder}
                            disabled={isExecuting}
                        >
                            {getConfirmButtonLabel()}
                        </button>
                    </div>
                )}
            </div>

            <ExtraItemModal
                isOpen={isExtraItemModalOpen}
                onClose={() => setIsExtraItemModalOpen(false)}
                onConfirm={handleModalConfirm}
                mode={modalMode}
                initialItem={modalInitialItem}
                existingProductIds={getExistingProductIds()}
            />
        </div>
    );
};
