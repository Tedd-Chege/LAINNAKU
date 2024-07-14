// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "database-6f45e.firebaseapp.com",
  projectId: "database-6f45e",
  storageBucket: "database-6f45e.appspot.com",
  messagingSenderId: "8505361566",
  appId: "1:8505361566:web:288b8dda7206324b53678f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);