// ===============================
// Firebase
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ===============================
// Firebase Configuration
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyAOEX0DjEzJVMQEXWP64JS_V1i3l60CxdQ",
  authDomain: "hangman-a1562.firebaseapp.com",
  projectId: "hangman-a1562",
  storageBucket: "hangman-a1562.firebasestorage.app",
  messagingSenderId: "1025680486155",
  appId: "1:1025680486155:web:c1ddb3c5c98471b8f27c0e",
  measurementId: "G-D8TBZRZM81"
};


// เริ่มต้น Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ===============================
// Elements
// ===============================
const playGameBtn = document.getElementById("playGameBtn");

const loginBackdrop = document.getElementById("loginBackdrop");
const loginClose = document.getElementById("loginClose");

const authName = document.getElementById("authName");
const authPassword = document.getElementById("authPassword");
const confirmPassword = document.getElementById("confirmPassword");

const confirmPasswordWrap =
  document.getElementById("confirmPasswordWrap");

const emailLogin =
  document.getElementById("emailLogin");

const toggleSignup =
  document.getElementById("toggleSignup");

const loginTitle =
  document.getElementById("loginTitle");

const loginDescription =
  document.getElementById("loginDescription");

const loginStatus =
  document.getElementById("loginStatus");

const togglePassword =
  document.getElementById("togglePassword");

const toggleConfirmPassword =
  document.getElementById("toggleConfirmPassword");


// ===============================
// Mode
// ===============================
let isSignupMode = false;
let currentUser = null;


// ===============================
// Username → Firebase Email
// ===============================
function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@hangman.local`;
}


// ===============================
// Login Modal
// ===============================
function openLoginModal() {
  if (!loginBackdrop) return;

  loginBackdrop.classList.add("show");

  authName.value = "";
  authPassword.value = "";
  confirmPassword.value = "";

  loginStatus.textContent = "";

  authPassword.type = "password";
  confirmPassword.type = "password";

  if (togglePassword) {
    togglePassword.textContent = "👁";
  }

  if (toggleConfirmPassword) {
    toggleConfirmPassword.textContent = "👁";
  }

  authName.focus();
}


function closeLoginModal() {
  if (!loginBackdrop) return;

  loginBackdrop.classList.remove("show");
}


// ===============================
// เล่นเกม
// ===============================
if (playGameBtn) {
  playGameBtn.addEventListener("click", (event) => {

    event.preventDefault();

    if (currentUser) {

      // มีบัญชีแล้ว → ไปหน้าเลือกหมวดหมู่
      window.location.href = "categories.html";

    } else {

      // ยังไม่ได้ Login → เปิดหน้าต่าง Login
      openLoginModal();

    }

  });
}


// ===============================
// ปิด Login
// ===============================
if (loginClose) {
  loginClose.addEventListener("click", closeLoginModal);
}


if (loginBackdrop) {
  loginBackdrop.addEventListener("click", (event) => {

    if (event.target === loginBackdrop) {
      closeLoginModal();
    }

  });
}


// ===============================
// เปลี่ยน Login / Sign Up
// ===============================
if (toggleSignup) {

  toggleSignup.addEventListener("click", () => {

    isSignupMode = !isSignupMode;

    loginStatus.textContent = "";

    if (isSignupMode) {

      // =========================
      // Sign Up
      // =========================

      loginTitle.textContent = "สร้างบัญชี";

      loginDescription.textContent =
        "สร้างบัญชีเพื่อเริ่มเล่นเกม Hangman";

      emailLogin.textContent = "SIGN UP";

      toggleSignup.textContent =
        "มีบัญชีแล้ว? เข้าสู่ระบบ";

      confirmPasswordWrap.classList.remove("hidden");

      authPassword.autocomplete = "new-password";

    } else {

      // =========================
      // Sign In
      // =========================

      loginTitle.textContent = "เข้าสู่ระบบ";

      loginDescription.textContent =
        "เข้าสู่ระบบเพื่อเริ่มเล่นเกม Hangman";

      emailLogin.textContent = "SIGN IN";

      toggleSignup.textContent =
        "ยังไม่มีบัญชี? สร้างบัญชี";

      confirmPasswordWrap.classList.add("hidden");

      authPassword.autocomplete = "current-password";

    }

  });

}


// ===============================
// แสดง / ซ่อน Password
// ===============================
if (togglePassword) {

  togglePassword.addEventListener("click", () => {

    if (authPassword.type === "password") {

      authPassword.type = "text";

      togglePassword.textContent = "🙈";

      togglePassword.setAttribute(
        "aria-label",
        "ซ่อนรหัสผ่าน"
      );

    } else {

      authPassword.type = "password";

      togglePassword.textContent = "👁";

      togglePassword.setAttribute(
        "aria-label",
        "แสดงรหัสผ่าน"
      );

    }

  });

}


// ===============================
// แสดง / ซ่อน Confirm Password
// ===============================
if (toggleConfirmPassword) {

  toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPassword.type === "password") {

      confirmPassword.type = "text";

      toggleConfirmPassword.textContent = "🙈";

      toggleConfirmPassword.setAttribute(
        "aria-label",
        "ซ่อนรหัสผ่าน"
      );

    } else {

      confirmPassword.type = "password";

      toggleConfirmPassword.textContent = "👁";

      toggleConfirmPassword.setAttribute(
        "aria-label",
        "แสดงรหัสผ่าน"
      );

    }

  });

}


// ===============================
// Firebase Error
// ===============================
function showFirebaseError(error) {

  console.error(error);

  switch (error.code) {

    case "auth/email-already-in-use":
      return "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว";

    case "auth/invalid-email":
      return "ชื่อผู้ใช้ไม่ถูกต้อง";

    case "auth/weak-password":
      return "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";

    case "auth/user-not-found":
      return "ไม่พบบัญชีนี้";

    case "auth/wrong-password":
      return "รหัสผ่านไม่ถูกต้อง";

    case "auth/invalid-credential":
      return "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";

    case "auth/operation-not-allowed":
      return "ยังไม่ได้เปิด Email/Password ใน Firebase Authentication";

    case "auth/configuration-not-found":
      return "Firebase Authentication ยังไม่ได้ตั้งค่า";

    case "auth/too-many-requests":
      return "มีการเข้าสู่ระบบผิดหลายครั้ง กรุณาลองใหม่ภายหลัง";

    default:
      return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";

  }

}


// ===============================
// SIGN IN / SIGN UP
// ===============================
if (emailLogin) {

  emailLogin.addEventListener("click", async () => {

    const username =
      authName.value.trim();

    const password =
      authPassword.value;

    const confirm =
      confirmPassword.value;


    // =========================
    // ตรวจชื่อผู้ใช้
    // =========================
    if (!username) {

      loginStatus.textContent =
        "กรุณากรอกชื่อผู้ใช้";

      authName.focus();

      return;
    }


    // ชื่อผู้ใช้ 3–30 ตัว
    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) {

      loginStatus.textContent =
        "ชื่อผู้ใช้ใช้ได้เฉพาะ A-Z, a-z, 0-9, . , _ และ -";

      authName.focus();

      return;
    }


    // =========================
    // ตรวจ Password
    // =========================
    if (!password) {

      loginStatus.textContent =
        "กรุณากรอกรหัสผ่าน";

      authPassword.focus();

      return;
    }


    if (password.length < 8) {

      loginStatus.textContent =
        "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";

      authPassword.focus();

      return;
    }


    // =========================
    // SIGN UP
    // =========================
    if (isSignupMode) {

      if (!confirm) {

        loginStatus.textContent =
          "กรุณายืนยันรหัสผ่าน";

        confirmPassword.focus();

        return;
      }


      if (password !== confirm) {

        loginStatus.textContent =
          "รหัสผ่านไม่ตรงกัน";

        confirmPassword.focus();

        return;
      }


      loginStatus.textContent =
        "กำลังสร้างบัญชี...";

      emailLogin.disabled = true;


      try {

        const email =
          usernameToEmail(username);


        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


        const user =
          userCredential.user;


        // บันทึกชื่อผู้ใช้ใน Firebase
        await updateProfile(user, {
          displayName: username
        });


        loginStatus.textContent =
          "สร้างบัญชีสำเร็จ!";


        // ไปหน้าเลือกหมวดหมู่
        setTimeout(() => {

          window.location.href =
            "categories.html";

        }, 500);


      } catch (error) {

        loginStatus.textContent =
          showFirebaseError(error);

      } finally {

        emailLogin.disabled = false;

      }


      return;
    }


    // =========================
    // SIGN IN
    // =========================
    loginStatus.textContent =
      "กำลังเข้าสู่ระบบ...";

    emailLogin.disabled = true;


    try {

      const email =
        usernameToEmail(username);


      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );


      loginStatus.textContent =
        "เข้าสู่ระบบสำเร็จ!";


      // ไปหน้าเลือกหมวดหมู่
      setTimeout(() => {

        window.location.href =
          "categories.html";

      }, 500);


    } catch (error) {

      loginStatus.textContent =
        showFirebaseError(error);

    } finally {

      emailLogin.disabled = false;

    }

  });

}


// ===============================
// ตรวจสอบสถานะ Login
// ===============================
onAuthStateChanged(auth, (user) => {

  currentUser = user;

  if (user) {

    console.log(
      "เข้าสู่ระบบแล้ว:",
      user.displayName || user.email
    );

  } else {

    console.log(
      "ยังไม่ได้เข้าสู่ระบบ"
    );

  }

});


// ===============================
// ปุ่มออกจากเกม
// ===============================
const exitBtn =
  document.getElementById("exitBtn");

const exitBackdrop =
  document.getElementById("exitBackdrop");

const exitConfirm =
  document.getElementById("exitConfirm");

const exitCancel =
  document.getElementById("exitCancel");


if (exitBtn && exitBackdrop) {

  exitBtn.addEventListener("click", (event) => {

    event.preventDefault();

    exitBackdrop.classList.add("show");

  });

}


if (exitCancel && exitBackdrop) {

  exitCancel.addEventListener("click", () => {

    exitBackdrop.classList.remove("show");

  });

}


if (exitBackdrop) {

  exitBackdrop.addEventListener("click", (event) => {

    if (event.target === exitBackdrop) {

      exitBackdrop.classList.remove("show");

    }

  });

}


if (exitConfirm) {

  exitConfirm.addEventListener("click", async () => {

    try {

      if (currentUser) {
        await signOut(auth);
      }

    } catch (error) {

      console.error(error);

    }

    // พยายามปิดหน้าเว็บ
    window.close();

  });

}