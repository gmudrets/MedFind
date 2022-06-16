import admin from 'firebase-admin';



var serviceAccount = require("./medfind-cbaba-firebase-adminsdk-f3o9k-318ea3d778.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


export const messagingAdmin = admin.messaging();