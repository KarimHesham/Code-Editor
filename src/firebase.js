import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJqkCo3dfnp6Sh-47jC7N_TnDhAsIezdY",
  authDomain: "arab-editor.firebaseapp.com",
  projectId: "arab-editor",
  storageBucket: "arab-editor.appspot.com",
  messagingSenderId: "1057009099463",
  appId: "1:1057009099463:web:a2e1dd649714d6173114e2",
};

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth();

const provider = new GoogleAuthProvider();

export { app, db, auth, provider };
