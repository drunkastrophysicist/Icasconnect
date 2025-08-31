// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-afz8FYMBw9M_ah0fCLpMJSW8CHjOXZs",
  authDomain: "icasconnect.firebaseapp.com",
  projectId: "icasconnect",
  storageBucket: "icasconnect.firebasestorage.app",
  messagingSenderId: "806538188194",
  appId: "1:806538188194:web:5ed6a656ef0806315e4efb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export default app;