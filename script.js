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
// FIREBASE CONFIGURATION
// ========================================

const firebaseConfig = {

    apiKey:
        "AIzaSyAOEX0DjEzJVMQEXWP64JS_V1i3l60CxdQ",

    authDomain:
        "hangman-a1562.firebaseapp.com",

    projectId:
        "hangman-a1562",

    storageBucket:
        "hangman-a1562.firebasestorage.app",

    messagingSenderId:
        "1025680486155",

    appId:
        "1:1025680486155:web:c1ddb3c5c98471b8f27c0e",

    measurementId:
        "G-D8TBZRZM81"
};


// ========================================
// INITIALIZE FIREBASE
// ========================================

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);


// ========================================
// GET ELEMENTS
// ========================================

const playGameBtn =
    document.getElementById("playGameBtn");

const loginBackdrop =
    document.getElementById("loginBackdrop");

const loginClose =
    document.getElementById("loginClose");

const loginTitle =
    document.getElementById("loginTitle");

const loginDescription =
    document.getElementById("loginDescription");

const authName =
    document.getElementById("authName");

const authPassword =
    document.getElementById("authPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

const confirmPasswordWrap =
    document.getElementById("confirmPasswordWrap");

const emailLogin =
    document.getElementById("emailLogin");

const toggleSignup =
    document.getElementById("toggleSignup");

const loginStatus =
    document.getElementById("loginStatus");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


// USER ACCOUNT

const userAccount =
    document.getElementById("userAccount");

const userName =
    document.getElementById("userName");

const logoutBtn =
    document.getElementById("logoutBtn");


// EXIT

const exitBtn =
    document.getElementById("exitBtn");

const exitBackdrop =
    document.getElementById("exitBackdrop");

const exitConfirm =
    document.getElementById("exitConfirm");

const exitCancel =
    document.getElementById("exitCancel");


// ========================================
// VARIABLES
// ========================================

let isSignupMode = false;

let currentUser = null;


// ========================================
// USERNAME → INTERNAL EMAIL
// ========================================

function usernameToEmail(username) {

    return `${username.trim().toLowerCase()}@hangman.local`;

}


// ========================================
// OPEN LOGIN MODAL
// ========================================

function openLoginModal() {

    if (!loginBackdrop) {
        return;
    }

    loginBackdrop.classList.add("is-open");

    loginStatus.textContent = "";
    loginStatus.classList.remove("error");


    authName.value = "";

    authPassword.value = "";

    confirmPassword.value = "";


    authPassword.type =
        "password";

    confirmPassword.type =
        "password";


    // Reset password eye

    if (togglePassword) {

        togglePassword.classList.remove(
            "show-password"
        );

        togglePassword.setAttribute(
            "aria-label",
            "แสดงรหัสผ่าน"
        );

    }


    // Reset confirm password eye

    if (toggleConfirmPassword) {

        toggleConfirmPassword.classList.remove(
            "show-password"
        );

        toggleConfirmPassword.setAttribute(
            "aria-label",
            "แสดงรหัสผ่าน"
        );

    }


    authName.focus();

}


// ========================================
// CLOSE LOGIN MODAL
// ========================================

function closeLoginModal() {

    if (!loginBackdrop) {
        return;
    }

    loginBackdrop.classList.remove(
        "is-open"
    );

}


// ========================================
// OPEN LOGIN WHEN CLICK PLAY
// ========================================

if (playGameBtn) {

    playGameBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            // ถ้า Login แล้ว

            if (currentUser) {

                window.location.href =
                    "categories.html";

                return;

            }


            // ถ้ายังไม่ได้ Login

            openLoginModal();

        }
    );

}


// ========================================
// CLOSE LOGIN
// ========================================

if (loginClose) {

    loginClose.addEventListener(
        "click",
        function () {

            closeLoginModal();

        }
    );

}


// ========================================
// CLICK OUTSIDE LOGIN
// ========================================

if (loginBackdrop) {

    loginBackdrop.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                loginBackdrop
            ) {

                closeLoginModal();

            }

        }
    );

}


// ========================================
// SWITCH SIGN IN / SIGN UP
// ========================================

if (toggleSignup) {

    toggleSignup.addEventListener(
        "click",
        function () {

            isSignupMode =
                !isSignupMode;


            loginStatus.textContent = "";

            loginStatus.classList.remove(
                "error"
            );


            if (isSignupMode) {

                // ==============================
                // SIGN UP MODE
                // ==============================

                loginTitle.textContent =
                    "สร้างบัญชี";

                loginDescription.textContent =
                    "สร้างบัญชีเพื่อเริ่มเล่นเกม Hangman";

                emailLogin.textContent =
                    "SIGN UP";

                toggleSignup.textContent =
                    "มีบัญชีแล้ว? เข้าสู่ระบบ";


                confirmPasswordWrap.classList.remove(
                    "hidden"
                );


                authPassword.autocomplete =
                    "new-password";


                confirmPassword.autocomplete =
                    "new-password";


            } else {

                // ==============================
                // SIGN IN MODE
                // ==============================

                loginTitle.textContent =
                    "เข้าสู่ระบบ";

                loginDescription.textContent =
                    "เข้าสู่ระบบเพื่อเริ่มเล่นเกม Hangman";

                emailLogin.textContent =
                    "SIGN IN";

                toggleSignup.textContent =
                    "ยังไม่มีบัญชี? สร้างบัญชี";


                confirmPasswordWrap.classList.add(
                    "hidden"
                );


                authPassword.autocomplete =
                    "current-password";

            }

        }
    );

}


// ========================================
// SHOW / HIDE PASSWORD
// ========================================

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (
                authPassword.type ===
                "password"
            ) {

                // แสดง

                authPassword.type =
                    "text";

                togglePassword.classList.add(
                    "show-password"
                );

                togglePassword.setAttribute(
                    "aria-label",
                    "ซ่อนรหัสผ่าน"
                );


            } else {

                // ซ่อน

                authPassword.type =
                    "password";

                togglePassword.classList.remove(
                    "show-password"
                );

                togglePassword.setAttribute(
                    "aria-label",
                    "แสดงรหัสผ่าน"
                );

            }

        }
    );

}


// ========================================
// SHOW / HIDE CONFIRM PASSWORD
// ========================================

if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener(
        "click",
        function () {

            if (
                confirmPassword.type ===
                "password"
            ) {

                // แสดง

                confirmPassword.type =
                    "text";

                toggleConfirmPassword.classList.add(
                    "show-password"
                );

                toggleConfirmPassword.setAttribute(
                    "aria-label",
                    "ซ่อนรหัสผ่าน"
                );


            } else {

                // ซ่อน

                confirmPassword.type =
                    "password";

                toggleConfirmPassword.classList.remove(
                    "show-password"
                );

                toggleConfirmPassword.setAttribute(
                    "aria-label",
                    "แสดงรหัสผ่าน"
                );

            }

        }
    );

}


// ========================================
// FIREBASE ERROR MESSAGE
// ========================================

function showFirebaseError(error) {

    console.error(
        "Firebase Error:",
        error
    );


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

            return "กรุณาเปิด Email/Password ใน Firebase Authentication";


        case "auth/configuration-not-found":

            return "Firebase Authentication ยังไม่ได้ตั้งค่า";


        case "auth/too-many-requests":

            return "มีการเข้าสู่ระบบผิดหลายครั้ง กรุณาลองใหม่ภายหลัง";


        case "auth/network-request-failed":

            return "ไม่สามารถเชื่อมต่อ Firebase ได้ กรุณาตรวจสอบอินเทอร์เน็ต";


        default:

            return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";

    }

}


// ========================================
// SIGN IN / SIGN UP
// ========================================

if (emailLogin) {

    emailLogin.addEventListener(
        "click",
        async function () {

            const username =
                authName.value.trim();

            const password =
                authPassword.value;

            const confirm =
                confirmPassword.value;


            // ==============================
            // CHECK USERNAME
            // ==============================

            if (!username) {

                loginStatus.textContent =
                    "กรุณากรอกชื่อผู้ใช้";

                loginStatus.classList.add(
                    "error"
                );

                authName.focus();

                return;

            }


            // ==============================
            // USERNAME FORMAT
            // ==============================

            if (
                !/^[a-zA-Z0-9._-]{3,30}$/.test(
                    username
                )
            ) {

                loginStatus.textContent =
                    "ชื่อผู้ใช้ต้องมี 3-30 ตัว และใช้ A-Z, a-z, 0-9, . _ -";

                loginStatus.classList.add(
                    "error"
                );

                authName.focus();

                return;

            }


            // ==============================
            // CHECK PASSWORD
            // ==============================

            if (!password) {

                loginStatus.textContent =
                    "กรุณากรอกรหัสผ่าน";

                loginStatus.classList.add(
                    "error"
                );

                authPassword.focus();

                return;

            }


            // ==============================
            // PASSWORD LENGTH
            // ==============================

            if (password.length < 8) {

                loginStatus.textContent =
                    "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";

                loginStatus.classList.add(
                    "error"
                );

                authPassword.focus();

                return;

            }


            // ==============================
            // SIGN UP
            // ==============================

            if (isSignupMode) {


                // CHECK CONFIRM

                if (!confirm) {

                    loginStatus.textContent =
                        "กรุณายืนยันรหัสผ่าน";

                    loginStatus.classList.add(
                        "error"
                    );

                    confirmPassword.focus();

                    return;

                }


                // PASSWORD MATCH

                if (
                    password !==
                    confirm
                ) {

                    loginStatus.textContent =
                        "รหัสผ่านไม่ตรงกัน";

                    loginStatus.classList.add(
                        "error"
                    );

                    confirmPassword.focus();

                    return;

                }


                loginStatus.classList.remove(
                    "error"
                );

                loginStatus.textContent =
                    "กำลังสร้างบัญชี...";


                emailLogin.disabled =
                    true;


                try {

                    const email =
                        usernameToEmail(
                            username
                        );


                    // สร้าง Firebase Account

                    const userCredential =
                        await createUserWithEmailAndPassword(
                            auth,
                            email,
                            password
                        );


                    const user =
                        userCredential.user;


                    // บันทึกชื่อผู้ใช้

                    await updateProfile(
                        user,
                        {
                            displayName:
                                username
                        }
                    );


                    // อัปเดตตัวแปรทันที

                    currentUser =
                        user;


                    loginStatus.textContent =
                        "สร้างบัญชีสำเร็จ!";


                    // ไปหน้าเลือกหมวดหมู่

                    setTimeout(
                        function () {

                            window.location.href =
                                "categories.html";

                        },
                        500
                    );


                } catch (error) {

                    loginStatus.textContent =
                        showFirebaseError(
                            error
                        );

                    loginStatus.classList.add(
                        "error"
                    );

                } finally {

                    emailLogin.disabled =
                        false;

                }


                return;

            }


            // ==============================
            // SIGN IN
            // ==============================

            loginStatus.classList.remove(
                "error"
            );

            loginStatus.textContent =
                "กำลังเข้าสู่ระบบ...";


            emailLogin.disabled =
                true;


            try {

                const email =
                    usernameToEmail(
                        username
                    );


                // Firebase Login

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                currentUser =
                    userCredential.user;


                loginStatus.textContent =
                    "เข้าสู่ระบบสำเร็จ!";


                // ไปหน้าเลือกหมวดหมู่

                setTimeout(
                    function () {

                        window.location.href =
                            "categories.html";

                    },
                    500
                );


            } catch (error) {

                loginStatus.textContent =
                    showFirebaseError(
                        error
                    );

                loginStatus.classList.add(
                    "error"
                );

            } finally {

                emailLogin.disabled =
                    false;

            }

        }
    );

}


// ========================================
// FIREBASE AUTH STATE
// ========================================

onAuthStateChanged(
    auth,
    function (user) {

        currentUser =
            user;


        if (user) {

            // ==============================
            // USER LOGIN
            // ==============================

            console.log(
                "เข้าสู่ระบบแล้ว:",
                user.displayName ||
                user.email
            );


            // แสดงชื่อผู้ใช้

            if (userAccount) {

                userAccount.classList.add(
                    "show"
                );

            }


            if (userName) {

                userName.textContent =
                    "👤 " +
                    (
                        user.displayName ||
                        user.email
                    );

            }


        } else {

            // ==============================
            // USER LOGOUT
            // ==============================

            console.log(
                "ยังไม่ได้เข้าสู่ระบบ"
            );


            if (userAccount) {

                userAccount.classList.remove(
                    "show"
                );

            }

        }

    }
);


// ========================================
// LOGOUT ACCOUNT
// ========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            try {

                await signOut(auth);


                // กลับสถานะหน้าแรก

                currentUser =
                    null;


                if (userAccount) {

                    userAccount.classList.remove(
                        "show"
                    );

                }


                // รีโหลดหน้า

                window.location.reload();


            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );

                alert(
                    "ไม่สามารถออกจากบัญชีได้"
                );

            }

        }
    );

}


// ========================================
// EXIT GAME
// ========================================

if (
    exitBtn &&
    exitBackdrop
) {

    exitBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            exitBackdrop.classList.add(
                "is-open"
            );

        }
    );

}


// ========================================
// CANCEL EXIT
// ========================================

if (
    exitCancel &&
    exitBackdrop
) {

    exitCancel.addEventListener(
        "click",
        function () {

            exitBackdrop.classList.remove(
                "is-open"
            );

        }
    );

}


// ========================================
// CLICK OUTSIDE EXIT
// ========================================

if (exitBackdrop) {

    exitBackdrop.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                exitBackdrop
            ) {

                exitBackdrop.classList.remove(
                    "is-open"
                );

            }

        }
    );

}


// ========================================
// CONFIRM EXIT
// ========================================

if (exitConfirm) {

    exitConfirm.addEventListener(
        "click",
        async function () {

            try {

                // Logout Firebase

                if (currentUser) {

                    await signOut(
                        auth
                    );

                }

            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );

            }


            // พยายามปิดหน้าต่าง

            window.close();


            // ถ้า Browser ไม่ยอมปิด
            // ให้กลับไปหน้าแรก

            setTimeout(
                function () {

                    window.location.href =
                        "about:blank";

                },
                300
            );

        }
    );

}