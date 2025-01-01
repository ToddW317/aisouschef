import { initializeApp } from '@react-native-firebase/app';
import { getFirestore } from '@react-native-firebase/firestore';

const firebaseConfig = {
  // Your Firebase config here
  // Get this from Firebase Console -> Project Settings -> General -> Your apps
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 