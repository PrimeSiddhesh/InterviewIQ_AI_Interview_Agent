



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-4c041.firebaseapp.com",
  projectId: "interviewiq-4c041",
  storageBucket: "interviewiq-4c041.firebasestorage.app",
  messagingSenderId: "1039297945819",
  appId: "1:1039297945819:web:8f5ad2741079e049ddacfe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };