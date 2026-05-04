import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCn5QngLKLTXBV7xJFAuQZg4h-OgdsMWMs",
  authDomain: "ai-resume-bullider.firebaseapp.com",
  projectId: "ai-resume-bullider",
  storageBucket: "ai-resume-bullider.appspot.com",
  messagingSenderId: "877026107626",
  appId: "1:877026107626:web:c9fd83bd8fd7c9c5da3793",
  measurementId: "G-Q09FPWEBYM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
