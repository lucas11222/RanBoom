// /public/scripts/firebase-handler.js

import { app } from "@/firebase/client";
import { getDatabase, ref, set, push, get, child } from "firebase/database";
const db = getDatabase(app);

window.addEventListener("DOMContentLoaded", () => {
  const enterButton = document.querySelector('button[type="submit"]');
  const nameInput = document.getElementById("username");

  enterButton?.addEventListener("click", async () => {
    const name = (nameInput as HTMLInputElement)?.value?.trim();
    if (!name) {
      alert("Please enter a name.");
      return;
    }

    await writeToFirebase(name);
    alert("Name submitted to Firebase!");
  });
});

async function writeToFirebase(name = "") {
  const dbRef = ref(db);
  const localUserId = localStorage.getItem("userId");

  try {
    if (localUserId) {
      const snapshot = await get(child(dbRef, `users/${localUserId}`));
      if (snapshot.exists()) {
        console.log("User already exists.");
        return;
      }
    }

    await createNewUser(name);
  } catch (error) {
    console.error("Firebase error:", error);
  }
}

async function createNewUser(name = "") {
  const userRef = push(ref(db, "users"));
  const newUserId = userRef.key;

  localStorage.setItem("userId", newUserId);

  await set(userRef, { name });
}
