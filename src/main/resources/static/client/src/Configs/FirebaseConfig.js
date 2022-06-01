import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import {getMessaging, getToken,onMessage} from "firebase/messaging";

// To add consts into .env file
const GENERATED_MESSAGING_KEY = "BLnqijghBzcwuO0l_vHQcb5ktCLWXMusw4hS2-Lda-CTyr8XG8XzlVh6bCOF9ohAmLTEZ4mxS_zVZC1bqi1LB5Y"
const firebaseConfig = {
    apiKey: "AIzaSyCTzg6q58wI40x00qMBQVyyy9oh2u4E5S0",
    authDomain: "medfind-cbaba.firebaseapp.com",
    projectId: "medfind-cbaba",
    storageBucket: "medfind-cbaba.appspot.com",
    messagingSenderId: "1049344956166",
    appId: "1:1049344956166:web:d7ee2568609d33d4907087",
    measurementId: "G-VSSDZCWGZN"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const myGetToken = (setTokenFound) => {
    return getToken(messaging, {vapidKey: GENERATED_MESSAGING_KEY}).then((currentToken) => {
        if (currentToken) {
            console.log('current token for client: ', currentToken);
            setTokenFound(true);
            // Track the token -> client mapping, by sending to backend server
            // show on the UI that permission is secured
        } else {
            console.log('No registration token available. Request permission to generate one.');
            setTokenFound(false);
            // shows on the UI that permission is required
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // catch error while creating client token
    });
}
