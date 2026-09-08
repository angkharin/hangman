const firebaseConfig = {
  apiKey: "AIzaSyAOEX0DjEzJVMQEXWP64JS_V1i3l60CxdQ",
  authDomain: "hangman-a1562.firebaseapp.com",
  projectId: "hangman-a1562",
  storageBucket: "hangman-a1562.firebasestorage.app",
  messagingSenderId: "1025680486155",
  appId: "1:1025680486155:web:c1ddb3c5c98471b8f27c0e"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

document.getElementById("googleLogin").addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    window.location.href = "categories.html";
  } catch (error) {
    console.error(error);
    alert("เข้าสู่ระบบ Google ไม่สำเร็จ: " + error.message);
  }
});

document.getElementById("facebookLogin").addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, facebookProvider);
    window.location.href = "categories.html";
  } catch (error) {
    console.error(error);
    alert("เข้าสู่ระบบ Facebook ไม่สำเร็จ: " + error.message);
  }
});