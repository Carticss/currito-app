import React from 'react';

interface PackTableSkeletonProps {
    rows?: number;
}

export const PackTableSkeleton: React.FC<PackTableSkeletonProps> = ({ rows = 5 }) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, index) => (
                <tr key={index}>
                    <td>
                        <div className="pack-cell">
                            <div className="skeleton skeleton-image"></div>
                            <div className="pack-info">
                                <div className="skeleton skeleton-text long"></div>
                                <div className="skeleton skeleton-text short" style={{ marginTop: '4px' }}></div>
                            </div>
                        </div>
                    </td>
                    <td className="desktop-only">
                        <div className="skeleton skeleton-text short"></div>
                    </td>
                    <td className="desktop-only">
                        <div className="skeleton skeleton-text short"></div>
                    </td>
                    <td className="desktop-only">
                        <div className="skeleton skeleton-badge"></div>
                    </td>
                    <td className="desktop-only">
                        <div className="skeleton skeleton-toggle"></div>
                    </td>
                    <td className="desktop-only">
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '4px' }}></div>
                            <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '4px' }}></div>
                        </div>
                    </td>
                    <td className="mobile-only">
                        <div className="skeleton" style={{ width: '24px', height: '24px' }}></div>
                    </td>
                </tr>
            ))}
        </>
    );
};
