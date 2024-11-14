// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDB77qxld6knhme3qpiXO8OxCZs4XJY5_I",
    authDomain: "car-numbers.firebaseapp.com",
    projectId: "car-numbers",
    storageBucket: "car-numbers.firebasestorage.app",
    messagingSenderId: "296277530001",
    appId: "1:296277530001:web:c22935dfbc4fd2f905f630",
    measurementId: "G-KQDB3ZD0G5"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
