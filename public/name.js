import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBxBYo8cjZ4Hy9CRtlY9y_vtCCk6EvFJZA",
  authDomain: "ranboom-71afe.firebaseapp.com",
  projectId: "ranboom-71afe",
  storageBucket: "ranboom-71afe.appspot.com", // ✅ esto es solo para Firestore/Storage
  messagingSenderId: "823309590446",
  appId: "1:823309590446:web:ef0f3b8831c9b2faa0f23f",
  databaseURL: "https://ranboom-71afe-default-rtdb.europe-west1.firebasedatabase.app" // ✅ Agrega esto
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const dbRef = ref(db);
export const localUserId = localStorage.getItem("userId");
const thebutton = document.getElementById("thebutton");
async function checkUser() {
  if (localUserId) {
    const snapshot = await get(child(dbRef, `users/${localUserId}`));
    if (snapshot.exists()) {
      thebutton.classList.remove("hidden");
    }
  }
}
checkUser();


export async function isDeleted() {
  const snapshot = await get(child(dbRef, `deleted`));
  if (snapshot.exists()) {
    const data = snapshot.val();
    if (data === true) {
      const thecontent = document.getElementById("thecontent");
      thecontent.classList.remove("hidden");
      thetext.textContent = `KABOOM! (cuando sienta el boom) the website has been deleted!`;
      const thebutton = document.getElementById("thebutton");
      thebutton.style.display = "none";
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const enterButton = document.querySelector('button[type="submit"]');
  const Button = document.getElementById('thebutton');
  const nameInput = /** @type {HTMLInputElement} */ (document.getElementById("username"));
  const thecounter = document.getElementById("thecounter");
  const theusertext = document.getElementById("theusertext");
  isDeleted();
  enterButton?.addEventListener("click", async () => {
    const name = nameInput?.value?.trim();
    if (!name) {
      alert("Please enter a name.");
      return;
    }
    const counter = 0;
    thecounter.textContent = `Clicks: ${counter}`;
    theusertext.textContent = `Username: ${name}`;
    await writeToFirebase(name, counter);
    alert("Name submitted to Firebase!");
    Button.classList.remove("hidden");
  });
});
async function writeToFirebase(name, counter) {
  try {
    if (localUserId) {
      const snapshot = await get(child(dbRef, `users/${localUserId}`));
      if (snapshot.exists()) {
        alert("User already exists.");
        return;
      }
    }
    await createNewUser(name, counter);
  } catch (error) {
    alert("Oh uh! Report this to Lucas11:", error);
    console.log(error);
  }
}


async function createNewUser(name = "", counter = 0) {
  const userRef = push(ref(db, "users"));
  const newUserId = userRef.key;

  localStorage.setItem("userId", newUserId);

  await set(userRef, { name, counter });
}
async function getUserName() {
  if (!localUserId) return null;
  const snapshot = await get(child(dbRef, `users/${localUserId}`));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return data.name;
  }
  return null;
}

async function displayUserName() {
  const theusertext = document.getElementById("theusertext");
  const userName = await getUserName();
  theusertext.textContent = `Username: ${userName || "Unknown"}`;
}


async function getCounter() {
  const localUserId = localStorage.getItem("userId");
  if (!localUserId) return null;
  const snapshot = await get(child(dbRef, `users/${localUserId}`));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return data.counter;
  }
  return null;
}

async function displayCounter() {
  const thecounter = document.getElementById("thecounter");
  const count = await getCounter();
  thecounter.textContent = `Clicks: ${count || "0"}`;
}

export async function addCounter(counter = 0) {
  const localUserId = localStorage.getItem("userId");
  if (!localUserId) {
    alert("User not found.");
    return;
  }

  try {
    const snapshot = await get(child(dbRef, `users/${localUserId}`));
    if (snapshot.exists()) {
      // Update the counter in Firebase
      await set(ref(db, `users/${localUserId}/counter`), counter);
      counter = snapshot.val().counter      // Update the counter in the UI
    } else {
      alert("User data not found.");
    }
  } catch (error) {
    console.error("Error updating counter:", error);
    alert("Failed to update counter. Please try again.");
  }
}

export async function deleteWebsite() {
  const localUserId = localStorage.getItem("userId");
  if (!localUserId) return null;
  const snapshot = await get(child(dbRef, "deleted"));
  if (snapshot.exists()) {
    await set(ref(db, `deleted`), true);
  }
}

displayUserName();
displayCounter();