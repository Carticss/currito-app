import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { onMessage } from 'firebase/messaging';
import { generateFirebaseToken, messaging } from '../../../config/firebase';
import { NotificationRepository } from '../../../repositories/NotificationRepository';
import { useAuth } from '../../../context/AuthContext';

export const useLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const isMobileSession = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    useEffect(() => {
        const initializeFirebase = async () => {
            try {
                const token = await generateFirebaseToken();
                if (token) {
                    console.log('Firebase token generated:', token);

                    if (isAuthenticated) {
                        const payload = isMobileSession()
                            ? { mobileToken: token }
                            : { desktopToken: token };

                        try {
                            await NotificationRepository.registerToken(payload);
                        } catch (registerError) {
                            console.error('Failed to register notification token:', registerError);
                        }
                    }
                }
            } catch (error) {
                console.error('Error generating Firebase token:', error);
            }
        };

        initializeFirebase();

        onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
        });
    }, [isAuthenticated]);

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

    return {
        isSidebarOpen,
        setIsSidebarOpen,
        pageTitle: getPageTitle(location.pathname),
    };
};
