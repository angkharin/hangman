// ========================================
// FIREBASE
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ========================================
// FIREBASE CONFIG
// ========================================

const firebaseConfig = {
  apiKey: "AIzaSyAOEX0DjEzJVMQEXWP64JS_V1i3l60CxdQ",
  authDomain: "hangman-a1562.firebaseapp.com",
  projectId: "hangman-a1562",
  storageBucket: "hangman-a1562.firebasestorage.app",
  messagingSenderId: "1025680486155",
  appId: "1:1025680486155:web:c1ddb3c5c98471b8f27c0e"
};


// ========================================
// INITIALIZE FIREBASE
// ========================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ========================================
// ELEMENTS
// ========================================

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

const loginStatus =
  document.getElementById("loginStatus");

const loginTitle =
  document.getElementById("loginTitle");

const loginDescription =
  document.getElementById("loginDescription");


// ========================================
// VARIABLES
// ========================================

let currentUser = null;
let signupMode = false;


// ========================================
// USERNAME → INTERNAL EMAIL
// ========================================

function usernameToEmail(username) {

  const cleanUsername =
    username.trim().toLowerCase();

  return `${cleanUsername}@hangman.local`;
}


// ========================================
// STATUS MESSAGE
// ========================================

function setStatus(message, isError = false) {

  loginStatus.textContent = message;

  loginStatus.classList.toggle(
    "error",
    isError
  );
}


// ========================================
// OPEN LOGIN
// ========================================

function openLogin() {

  setStatus("");

  loginBackdrop.classList.add(
    "is-open"
  );

  authName.focus();
}


// ========================================
// CLOSE LOGIN
// ========================================

function closeLogin() {

  loginBackdrop.classList.remove(
    "is-open"
  );

  setStatus("");

  playGameBtn.focus();
}


// ========================================
// SWITCH SIGN IN / SIGN UP
// ========================================

function setSignupMode(value) {

  signupMode = value;

  confirmPasswordWrap.classList.toggle(
    "hidden",
    !signupMode
  );

  loginTitle.textContent =
    signupMode
      ? "สร้างบัญชี"
      : "เข้าสู่ระบบ";

  loginDescription.textContent =
    signupMode
      ? "สร้างบัญชีเพื่อบันทึกข้อมูลการเล่น Hangman"
      : "เข้าสู่ระบบเพื่อเริ่มเล่นเกม Hangman";

  emailLogin.textContent =
    signupMode
      ? "SIGN UP"
      : "SIGN IN";

  toggleSignup.textContent =
    signupMode
      ? "กลับไปเข้าสู่ระบบ"
      : "สร้างบัญชี";

  authPassword.value = "";
  confirmPassword.value = "";

  setStatus("");
}


// ========================================
// PLAY GAME BUTTON
// ========================================

playGameBtn.addEventListener(
  "click",
  (event) => {

    event.preventDefault();

    // ถ้า Login แล้ว
    if (currentUser) {

      window.location.href =
        "categories.html";

    }

    // ถ้ายังไม่ได้ Login
    else {

      openLogin();

    }

  }
);


// ========================================
// CLOSE LOGIN BUTTON
// ========================================

loginClose.addEventListener(
  "click",
  closeLogin
);


// ========================================
// CLICK OUTSIDE POPUP
// ========================================

loginBackdrop.addEventListener(
  "click",
  (event) => {

    if (
      event.target === loginBackdrop
    ) {

      closeLogin();

    }

  }
);


// ========================================
// ESC KEY
// ========================================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      loginBackdrop.classList.contains(
        "is-open"
      )
    ) {

      closeLogin();

    }

  }
);


// ========================================
// SIGN UP / SIGN IN TOGGLE
// ========================================

toggleSignup.addEventListener(
  "click",
  () => {

    setSignupMode(
      !signupMode
    );

  }
);


// ========================================
// SIGN IN / SIGN UP
// ========================================

emailLogin.addEventListener(
  "click",
  async () => {

    const username =
      authName.value.trim();

    const password =
      authPassword.value;


    // -----------------------------
    // CHECK USERNAME
    // -----------------------------

    if (!username) {

      setStatus(
        "กรุณากรอกชื่อผู้ใช้",
        true
      );

      authName.focus();

      return;
    }


    // -----------------------------
    // CHECK USERNAME FORMAT
    // -----------------------------

    if (
      !/^[a-zA-Z0-9._-]{3,30}$/.test(
        username
      )
    ) {

      setStatus(
        "ชื่อผู้ใช้ใช้ได้เฉพาะ A-Z, 0-9, จุด, _ และ - (3-30 ตัว)",
        true
      );

      authName.focus();

      return;
    }


    // -----------------------------
    // CHECK PASSWORD
    // -----------------------------

    if (password.length < 6) {

      setStatus(
        "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
        true
      );

      authPassword.focus();

      return;
    }


    // -----------------------------
    // CHECK CONFIRM PASSWORD
    // -----------------------------

    if (
      signupMode &&
      password !== confirmPassword.value
    ) {

      setStatus(
        "รหัสผ่านไม่ตรงกัน",
        true
      );

      confirmPassword.focus();

      return;
    }


    emailLogin.disabled = true;
    toggleSignup.disabled = true;


    try {

      const email =
        usernameToEmail(username);


      // =================================
      // SIGN UP
      // =================================

      if (signupMode) {

        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


        // บันทึกชื่อผู้ใช้
        await updateProfile(
          credential.user,
          {
            displayName: username
          }
        );


        currentUser =
          credential.user;


        setStatus(
          "สร้างบัญชีสำเร็จ กำลังเข้าเกม..."
        );

      }


      // =================================
      // SIGN IN
      // =================================

      else {

        const credential =
          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );


        currentUser =
          credential.user;


        setStatus(
          "เข้าสู่ระบบสำเร็จ กำลังเข้าเกม..."
        );

      }


      // =================================
      // GO TO CATEGORY
      // =================================

      setTimeout(
        () => {

          window.location.href =
            "categories.html";

        },
        700
      );


    }

    catch (error) {

      console.error(
        "Firebase Error:",
        error
      );


      const messages = {

        "auth/email-already-in-use":
          "ชื่อผู้ใช้นี้ถูกใช้แล้ว",

        "auth/invalid-credential":
          "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",

        "auth/invalid-login-credentials":
          "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",

        "auth/user-not-found":
          "ไม่พบบัญชีนี้",

        "auth/wrong-password":
          "รหัสผ่านไม่ถูกต้อง",

        "auth/weak-password":
          "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",

        "auth/too-many-requests":
          "มีการลองเข้าสู่ระบบมากเกินไป กรุณารอสักครู่",

        "auth/network-request-failed":
          "ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้",

        "auth/operation-not-allowed":
          "ยังไม่ได้เปิด Email/Password ใน Firebase Authentication",

        "auth/configuration-not-found":
          "ยังไม่ได้ตั้งค่า Email/Password ใน Firebase Authentication"

      };


      setStatus(
        messages[error.code] ||
        `เกิดข้อผิดพลาด: ${error.code}`,
        true
      );

    }


    finally {

      emailLogin.disabled = false;

      toggleSignup.disabled = false;

    }

  }
);


// ========================================
// CHECK LOGIN STATUS
// ========================================

onAuthStateChanged(
  auth,
  (user) => {

    currentUser = user;


    if (user) {

      console.log(
        "Login แล้ว:",
        user.displayName ||
        user.email
      );

    }

    else {

      console.log(
        "ยังไม่ได้ Login"
      );

    }

  }
);


// ========================================
// EXIT GAME
// ========================================

const exitBtn =
  document.getElementById("exitBtn");

const exitBackdrop =
  document.getElementById(
    "exitBackdrop"
  );

const exitConfirm =
  document.getElementById(
    "exitConfirm"
  );

const exitCancel =
  document.getElementById(
    "exitCancel"
  );


// เปิดหน้าต่างออกจากเกม
function openExitDialog(event) {

  event.preventDefault();

  exitBackdrop.classList.add(
    "is-open"
  );

  exitCancel.focus();
}


// ปิดหน้าต่าง
function closeExitDialog() {

  exitBackdrop.classList.remove(
    "is-open"
  );

  exitBtn.focus();
}


// ปุ่มออกจากเกม
exitBtn.addEventListener(
  "click",
  openExitDialog
);


// ปุ่มยกเลิก
exitCancel.addEventListener(
  "click",
  closeExitDialog
);


// คลิกพื้นที่ด้านนอก
exitBackdrop.addEventListener(
  "click",
  (event) => {

    if (
      event.target === exitBackdrop
    ) {

      closeExitDialog();

    }

  }
);


// ESC
document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      exitBackdrop.classList.contains(
        "is-open"
      )
    ) {

      closeExitDialog();

    }

  }
);


// ========================================
// CONFIRM EXIT
// ========================================

exitConfirm.addEventListener(
  "click",
  async () => {

    exitConfirm.disabled = true;
    exitCancel.disabled = true;

    exitConfirm.textContent =
      "กำลังออก...";


    // Logout Firebase
    try {

      await signOut(auth);

    }

    catch (error) {

      console.error(
        "Sign out error:",
        error
      );

    }


    setTimeout(
      () => {

        window.close();


        setTimeout(
          () => {

            exitConfirm.textContent =
              "ปิดแท็บนี้ได้เลย";

            exitConfirm.disabled =
              false;

            exitCancel.disabled =
              false;

          },
          400
        );

      },
      500
    );

  }
);