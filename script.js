const firebaseConfig = {
  apiKey: "ค่าจริง",
  authDomain: "ค่าจริง",
  projectId: "ค่าจริง",
  storageBucket: "ค่าจริง",
  messagingSenderId: "ค่าจริง",
  appId: "ค่าจริง"
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