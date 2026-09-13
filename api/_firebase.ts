import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyC_NADbpFf8BLNvdMxECOrHTUxcqpeuZkY',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'foods-90f69.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'foods-90f69',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'foods-90f69.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '445594432394',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:445594432394:web:30354062c14cfebf0b8e73',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
