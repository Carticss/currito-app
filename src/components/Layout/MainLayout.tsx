import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import './Layout.css';

export const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const getPageTitle = (pathname: string) => {
        switch (pathname) {
            case '/orders':
                return 'Ordenes';
            case '/inventory':
                return 'Inventario';
            case '/settings':
                return 'Configuraciones';
            default:
                return 'Sistema';
        }
    };

    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="main-content">
                <Header
                    title={getPageTitle(location.pathname)}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <Outlet />
            </div>
        </div>
    );
};
