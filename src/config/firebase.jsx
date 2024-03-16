import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZM0URWOBtk_xl8Thmq5hctClfhVmlWCk",
  authDomain: "fir-course-c67a0.firebaseapp.com",
  projectId: "fir-course-c67a0",
  storageBucket: "fir-course-c67a0.appspot.com",
  messagingSenderId: "339296091094",
  appId: "1:339296091094:web:74cd8ed7ac72c501a60277",
  measurementId: "G-KFGS5S34RG",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
