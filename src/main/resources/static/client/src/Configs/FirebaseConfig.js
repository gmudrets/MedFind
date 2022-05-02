import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

// To add consts into .env file
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
export const auth = getAuth(app);
export const db = getFirestore(app);
