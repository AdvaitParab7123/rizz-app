import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// TODO: Replace with your actual Firebase project configuration
// Get this from Firebase Console > Project Settings > General > Your apps > Web app
const firebaseConfig = {
  apiKey: 'AIzaSyB9DEIi42o786-cX0uymyALTD6bz7h70XE',
  authDomain: 'rizz-app-ef452.firebaseapp.com',
  projectId: 'rizz-app-ef452',
  storageBucket: 'rizz-app-ef452.firebasestorage.app',
  messagingSenderId: '522746955812',
  appId: '1:522746955812:web:31c78a468f88e4145830b1',
};

// Debug: Log the config to make sure it's loading correctly
console.log('Firebase Config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db: Firestore = getFirestore(app);

console.log('Firebase initialized successfully'); 