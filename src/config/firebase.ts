
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const app: FirebaseApp = getApps().length
    ? getApps()[0]
    : initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    });

const messaging = getMessaging(app);

export const generateFirebaseToken = async (): Promise<string | null> => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        try {
            const currentToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY });
            return currentToken;
        } catch (error) {
            console.error('An error occurred while retrieving token. ', error);
            return null;
        }
    } else {
        console.warn('Notification permission not granted.');
        return null;
    }
}

export { app as firebaseApp, messaging };