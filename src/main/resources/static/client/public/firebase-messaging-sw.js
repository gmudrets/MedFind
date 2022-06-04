// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: "AIzaSyCTzg6q58wI40x00qMBQVyyy9oh2u4E5S0",
    authDomain: "medfind-cbaba.firebaseapp.com",
    projectId: "medfind-cbaba",
    storageBucket: "medfind-cbaba.appspot.com",
    messagingSenderId: "1049344956166",
    appId: "1:1049344956166:web:d7ee2568609d33d4907087",
    measurementId: "G-VSSDZCWGZN"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});