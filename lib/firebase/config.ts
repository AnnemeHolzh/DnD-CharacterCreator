import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCpCu3kOoUJC_JSR3QbuYNtba-4GjUnNvc',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dndcharactercollector.firebaseapp.com',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://dndcharactercollector-default-rtdb.firebaseio.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dndcharactercollector',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dndcharactercollector.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '545639440265',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:545639440265:web:5dc203731c5d900e5c0b58'
}

// Note: Using fallback values since environment variables are not loading
// Firebase is working with hardcoded configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database
export const database = getDatabase(app)

export default app 