import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { getDatabase, ref, set, get, child, remove, onValue, push, update } from "firebase/database"; // Add 'update' here
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import authentication

const firebaseConfig = {
  apiKey: "AIzaSyDQVsDQSDseqAODi1bPVv_8n9PuaJTh9zg",
  authDomain: "sethu-sbp.firebaseapp.com",
  databaseURL: "https://sethu-sbp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sethu-sbp",
  storageBucket: "sethu-sbp.appspot.com",
  messagingSenderId: "816384006008",
  appId: "1:816384006008:web:1ce0c8a45f9f756058da8d",
  measurementId: "G-M7EJ6MH5VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); 
const database = getDatabase(app); 
const db = getFirestore(app); 
const auth = getAuth(app); // Initialize auth

// Export all the necessary Firebase services
export { db, storage, database, storageRef, uploadBytes, getDownloadURL, deleteObject, listAll, ref, set, get, child, remove, onValue, push, update, auth }; // Export 'update'
