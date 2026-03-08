
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBpUvFNIB9GDcKQlxto7AxxfwICYOjsJSQ",
  authDomain: "otama-57e4d.firebaseapp.com",
  projectId: "otama-57e4d",
  storageBucket: "otama-57e4d.firebasestorage.app",
  messagingSenderId: "529922884704",
  appId: "1:529922884704:web:813cedb7fbad28145aef05",
  measurementId: "G-FWLY8XF5S0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;
