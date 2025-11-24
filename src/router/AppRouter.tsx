import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/Login/LoginPage';
import { OrdersPage } from '../pages/Orders/OrdersPage';
import { InventoryPage } from '../pages/Inventory/InventoryPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { MainLayout } from '../components/Layout/MainLayout';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/orders" replace />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};
