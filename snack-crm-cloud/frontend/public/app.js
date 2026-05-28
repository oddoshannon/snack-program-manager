import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const statusEl = document.querySelector("#status");
const messageEl = document.querySelector("#message");
const refreshButton = document.querySelector("#refresh");
const signInButton = document.querySelector("#sign-in");
const signOutButton = document.querySelector("#sign-out");
const userEl = document.querySelector("#user");

const app = initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentUser = null;

async function loadMessage() {
  const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL;

  if (!currentUser) {
    statusEl.textContent = "Sign in to load the database message.";
    messageEl.textContent = "";
    return;
  }

  statusEl.textContent = "Loading from the SNACK CRM API...";
  messageEl.textContent = "";
  refreshButton.disabled = true;

  try {
    const token = await currentUser.getIdToken();
    const response = await fetch(`${apiBaseUrl}/api/message`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    messageEl.textContent = data.text;
    statusEl.textContent = `Loaded from ${data.source}.`;
  } catch (error) {
    statusEl.textContent = "Could not load the message yet.";
    messageEl.textContent = "Check that the backend is running, then try again.";
    console.error(error);
  } finally {
    refreshButton.disabled = false;
  }
}

async function signIn() {
  try {
    statusEl.textContent = "Opening Google sign-in...";
    await signInWithPopup(auth, provider);
  } catch (error) {
    statusEl.textContent = "Sign-in did not finish.";
    messageEl.textContent = "Check that Google sign-in is enabled in Firebase Authentication.";
    console.error(error);
  }
}

async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    statusEl.textContent = "Could not sign out yet.";
    console.error(error);
  }
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  const signedIn = Boolean(user);

  signInButton.hidden = signedIn;
  signOutButton.hidden = !signedIn;
  refreshButton.disabled = !signedIn;
  userEl.textContent = signedIn ? `Signed in as ${user.email}` : "Please sign in with your SNACK Google account.";

  if (signedIn) {
    loadMessage();
  } else {
    messageEl.textContent = "";
    statusEl.textContent = "Sign in to load the database message.";
  }
});

signInButton.addEventListener("click", signIn);
signOutButton.addEventListener("click", signOutUser);
refreshButton.addEventListener("click", loadMessage);
