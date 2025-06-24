import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
console.log("Script cargado correctamente.");
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxBYo8cjZ4Hy9CRtlY9y_vtCCk6EvFJZA",
  authDomain: "ranboom-71afe.firebaseapp.com",
  projectId: "ranboom-71afe",
  storageBucket: "ranboom-71afe.appspot.com", // ✅ esto es solo para Firestore/Storage
  messagingSenderId: "823309590446",
  appId: "1:823309590446:web:ef0f3b8831c9b2faa0f23f",
  databaseURL: "https://ranboom-71afe-default-rtdb.europe-west1.firebasedatabase.app" // ✅ Agrega esto
};

export const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const dbRef = ref(db);
const localUserId = localStorage.getItem("userId");
const Button = document.getElementById('thebutton');

async function checkUser() {
  if (localUserId) {
    const snapshot = await get(child(dbRef, `users/${localUserId}`));
    if (snapshot.exists()) {
      Button.classList.remove("hidden");
    }
  }
}
checkUser();


window.addEventListener("DOMContentLoaded", () => {
  const enterButton = document.querySelector('button[type="submit"]');
  const Button = document.getElementById('thebutton');
  const nameInput = /** @type {HTMLInputElement} */ (document.getElementById("username"));  enterButton?.addEventListener("click", async () => {
    const name = nameInput?.value?.trim();
    if (!name) {
      alert("Please enter a name.");
      return;
    }
    await writeToFirebase(name);
    alert("Name submitted to Firebase!");
    Button.classList.remove("hidden")
  });
});

async function writeToFirebase(name = "") {
  const dbRef = ref(db);
  const localUserId = localStorage.getItem("userId");

  try {
    if (localUserId) {
      const snapshot = await get(child(dbRef, `users/${localUserId}`));
      if (snapshot.exists()) {
        alert("User already exists.");
        return;
      }
    }

    await createNewUser(name);
  } catch (error) {
    alert("Oh uh! Report this to Lucas11:", error);
  }
}

async function createNewUser(name = "") {
  const userRef = push(ref(db, "users"));
  const newUserId = userRef.key;

  localStorage.setItem("userId", newUserId);

  await set(userRef, { name });
}
