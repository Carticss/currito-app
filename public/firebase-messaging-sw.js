importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCTNrDsykdBGRarVfubGdmC3JnmJETd4AE",
    authDomain: "moti-notifications.firebaseapp.com",
    projectId: "moti-notifications",
    storageBucket: "moti-notifications.firebasestorage.app",
    messagingSenderId: "344504214896",
    appId: "1:344504214896:web:19c07a5d0b16c9b6b25bb5",
    measurementId: "G-L9QT1F31N2"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/moti-plus-icon.svg"
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

