import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBDziugRF2JZvEHZQFPdTKbuM0HXMBrwFQ",
  authDomain: "aarogya-sarthak.firebaseapp.com",
  projectId: "aarogya-sarthak",
  storageBucket: "aarogya-sarthak.firebasestorage.app",
  messagingSenderId: "118041090870",
  appId: "1:118041090870:web:2cbf98812065a710d27197",
  measurementId: "G-8NL14GW7FM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
// Configure Google provider for better UX
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Test Firebase connection
console.log('Firebase initialized successfully');

export default app;
