// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4myieR63Nr3WRwx_ZU8Nc5KgtKFH8wQU",
  authDomain: "busybuy-6439a.firebaseapp.com",
  projectId: "busybuy-6439a",
  storageBucket: "busybuy-6439a.appspot.com",
  messagingSenderId: "848647675398",
  appId: "1:848647675398:web:fb7f643139a81ed0e5ad87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
setPersistence(auth, browserLocalPersistence);
export { db };