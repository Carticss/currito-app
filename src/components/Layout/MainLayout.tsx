import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useLayout } from './hooks/useLayout';
import './Layout.css';

export const MainLayout = () => {
    const { isSidebarOpen, setIsSidebarOpen, pageTitle } = useLayout();

    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="main-content">
                <Header
                    title={pageTitle}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <Outlet />
            </div>
        </div>
    );
};
