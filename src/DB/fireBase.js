

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCu21RrPZ4qoBBaz1PdPRvSruLmi34MP2g",
  authDomain: "farmaciarealtime.firebaseapp.com",
  databaseURL: "https://farmaciarealtime-default-rtdb.firebaseio.com",
  projectId: "farmaciarealtime",
  storageBucket: "farmaciarealtime.firebasestorage.app",
  messagingSenderId: "606255859981",
  appId: "1:606255859981:web:39eb6b85eb714e4d6c8844",
  measurementId: "G-ZRY8FXHNFW"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const database = getDatabase(app)
const auth = getAuth(app)
const firestore = getFirestore(app)

export {database, auth, firestore}
