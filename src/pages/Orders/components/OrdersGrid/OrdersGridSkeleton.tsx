import React from 'react';

export const OrdersGridSkeleton: React.FC = () => {
    const placeholders = Array.from({ length: 6 });

    return (
        <div className="orders-grid skeleton-grid">
            {placeholders.map((_, idx) => (
                <div key={idx} className="order-card skeleton-card">
                    <div className="card-header">
                        <div>
                            <div className="skeleton skeleton-text skeleton-title" />
                            <div className="skeleton skeleton-text skeleton-sub" />
                            <div className="skeleton skeleton-text skeleton-sub short" />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="skeleton skeleton-badge" />
                            <div className="skeleton skeleton-amount" />
                        </div>
                    </div>

                    <div>
                        <div className="skeleton skeleton-label" />
                        <div className="order-items">
                            <div className="skeleton skeleton-chip" />
                            <div className="skeleton skeleton-chip" />
                            <div className="skeleton skeleton-chip wide" />
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className="footer-date">
                            <div className="skeleton skeleton-icon" />
                            <div className="skeleton skeleton-text short" />
                        </div>
                        <div className="footer-actions">
                            <div className="skeleton skeleton-icon" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
