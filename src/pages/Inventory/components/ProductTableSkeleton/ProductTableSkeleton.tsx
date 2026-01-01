import './ProductTableSkeleton.css';

interface ProductTableSkeletonProps {
    rows?: number;
}

export const ProductTableSkeleton = ({ rows = 8 }: ProductTableSkeletonProps) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, index) => (
                <tr key={index} className="skeleton-row">
                    <td>
                        <div className="product-cell">
                            <div className="skeleton skeleton-image"></div>
                            <div className="skeleton skeleton-text skeleton-product-name"></div>
                        </div>
                    </td>
                    <td className="desktop-only">
                        <div className="skeleton skeleton-text"></div>
                    </td>
                    <td className="desktop-only">
                        <div className="skeleton skeleton-text"></div>
                    </td>
                    <td className="desktop-only">
                        <div className="skeleton skeleton-text"></div>
                    </td>
                    <td className="desktop-only">
                        <div className="skeleton skeleton-text"></div>
                    </td>
                    <td className="desktop-only">
                        <div className="skeleton skeleton-tag"></div>
                    </td>
                    <td className="desktop-only">
                        <div className="status-container">
                            <div className="skeleton skeleton-toggle"></div>
                            <div className="skeleton skeleton-badge"></div>
                        </div>
                    </td>
                    <td className="desktop-only">
                        <div className="skeleton skeleton-button"></div>
                    </td>
                    <td className="mobile-only">
                        <div className="skeleton skeleton-mobile-btn"></div>
                    </td>
                </tr>
            ))}
        </>
    );
};
