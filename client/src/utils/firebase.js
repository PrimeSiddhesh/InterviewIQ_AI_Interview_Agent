
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq2-b58e9.firebaseapp.com",
  projectId: "interviewiq2-b58e9",
  storageBucket: "interviewiq2-b58e9.firebasestorage.app",
  messagingSenderId: "289280506693",
  appId: "1:289280506693:web:8a10b1b349469cf2919c2c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}