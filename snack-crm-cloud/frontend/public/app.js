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
const referralsPanel = document.querySelector("#referrals-panel");
const referralForm = document.querySelector("#referral-form");
const saveReferralButton = document.querySelector("#save-referral");
const cancelEditButton = document.querySelector("#cancel-edit");
const referralsList = document.querySelector("#referrals-list");
const referralsStatusEl = document.querySelector("#referrals-status");
const referralSearchInput = document.querySelector("#referral-search");
const statusFilterSelect = document.querySelector("#status-filter");
const referralSummary = document.querySelector("#referral-summary");

const app = initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentUser = null;
let editingReferralId = null;
let loadedReferrals = [];

async function authedFetch(path, options = {}) {
  const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL;
  const token = await currentUser.getIdToken();

  return fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });
}

async function loadMessage() {
  if (!currentUser) {
    statusEl.textContent = "Sign in to load the database message.";
    messageEl.textContent = "";
    return;
  }

  statusEl.textContent = "Loading from the SNACK CRM API...";
  messageEl.textContent = "";
  refreshButton.disabled = true;

  try {
    const response = await authedFetch("/api/message");

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

function referralName(referral) {
  return `${referral.firstName} ${referral.lastName}`.trim();
}

function formatDate(value) {
  if (!value) {
    return "Date not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function referralMatchesFilters(referral) {
  const statusFilter = statusFilterSelect.value;
  const query = referralSearchInput.value.trim().toLowerCase();

  if (statusFilter !== "all" && referral.status !== statusFilter) {
    return false;
  }

  if (!query) {
    return true;
  }

  const searchable = [
    referral.firstName,
    referral.lastName,
    referral.phone,
    referral.email,
    referral.referralSource,
    referral.notes
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function renderReferrals() {
  referralsList.innerHTML = "";
  const referrals = loadedReferrals.filter(referralMatchesFilters);

  if (!referrals.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedReferrals.length ? "No referrals match the current filters." : "No referrals yet.";
    referralsList.append(empty);
    return;
  }

  for (const referral of referrals) {
    const item = document.createElement("article");
    item.className = "referral-item";

    const title = document.createElement("h4");
    title.textContent = referralName(referral);

    const details = document.createElement("p");
    const contact = [referral.phone, referral.email].filter(Boolean).join(" | ");
    details.textContent = contact || "No contact info yet.";

    const meta = document.createElement("p");
    meta.className = "referral-meta";
    meta.textContent = referral.referralSource ? `Source: ${referral.referralSource}` : "No referral source yet.";

    const created = document.createElement("p");
    created.className = "referral-meta";
    created.textContent = `Created ${formatDate(referral.createdAt)}`;

    const statusLabel = document.createElement("label");
    statusLabel.className = "status-field";
    statusLabel.textContent = "Status";

    const statusSelect = document.createElement("select");
    statusSelect.value = referral.status;
    statusSelect.dataset.referralId = referral.id;

    for (const status of ["new", "contacted", "scheduled", "closed"]) {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      statusSelect.append(option);
    }

    statusSelect.addEventListener("change", () => updateReferralStatus(referral, statusSelect.value));
    statusLabel.append(statusSelect);

    const deleteButton = document.createElement("button");
    deleteButton.className = "secondary-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteReferral(referral));

    const editButton = document.createElement("button");
    editButton.className = "secondary-button";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => startEditingReferral(referral));

    const actions = document.createElement("div");
    actions.className = "card-actions";
    actions.append(editButton, deleteButton);

    item.append(title, details, meta, created, statusLabel);

    if (referral.notes) {
      const notes = document.createElement("p");
      notes.textContent = referral.notes;
      item.append(notes);
    }

    item.append(actions);
    referralsList.append(item);
  }
}

function renderReferralSummary() {
  referralSummary.innerHTML = "";
  const statuses = ["new", "contacted", "scheduled", "closed"];

  for (const status of statuses) {
    const count = loadedReferrals.filter((referral) => referral.status === status).length;
    const item = document.createElement("button");
    item.className = "summary-item";
    item.type = "button";
    item.textContent = `${count} ${status}`;
    item.addEventListener("click", () => {
      statusFilterSelect.value = status;
      renderReferrals();
    });
    referralSummary.append(item);
  }
}

async function loadReferrals() {
  if (!currentUser) {
    referralsStatusEl.textContent = "";
    referralsList.innerHTML = "";
    return;
  }

  referralsStatusEl.textContent = "Loading referrals...";

  try {
    const response = await authedFetch("/api/referrals");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedReferrals = data.referrals;
    renderReferralSummary();
    renderReferrals();
    referralsStatusEl.textContent = `${loadedReferrals.length} referral${loadedReferrals.length === 1 ? "" : "s"} loaded.`;
  } catch (error) {
    referralsStatusEl.textContent = "Could not load referrals yet.";
    console.error(error);
  }
}

async function saveReferral(event) {
  event.preventDefault();

  if (!currentUser) {
    referralsStatusEl.textContent = "Sign in before saving a referral.";
    return;
  }

  const formData = new FormData(referralForm);
  const referral = Object.fromEntries(formData.entries());
  const isEditing = Boolean(editingReferralId);

  referralsStatusEl.textContent = isEditing ? "Updating referral..." : "Saving referral...";
  saveReferralButton.disabled = true;

  try {
    const path = isEditing ? `/api/referrals/${encodeURIComponent(editingReferralId)}` : "/api/referrals";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(referral)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    referralForm.reset();
    stopEditingReferral();
    referralsStatusEl.textContent = isEditing ? "Referral updated." : "Referral saved.";
    await loadReferrals();
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not save referral yet.";
    console.error(error);
  } finally {
    saveReferralButton.disabled = false;
  }
}

function startEditingReferral(referral) {
  editingReferralId = referral.id;
  referralForm.elements.firstName.value = referral.firstName || "";
  referralForm.elements.lastName.value = referral.lastName || "";
  referralForm.elements.phone.value = referral.phone || "";
  referralForm.elements.email.value = referral.email || "";
  referralForm.elements.referralSource.value = referral.referralSource || "";
  referralForm.elements.notes.value = referral.notes || "";
  saveReferralButton.textContent = "Update referral";
  cancelEditButton.hidden = false;
  referralsStatusEl.textContent = `Editing ${referralName(referral)}.`;
  referralForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function stopEditingReferral() {
  editingReferralId = null;
  saveReferralButton.textContent = "Save referral";
  cancelEditButton.hidden = true;
}

async function deleteReferral(referral) {
  const name = referralName(referral);
  const confirmed = window.confirm(`Delete referral for ${name}?`);

  if (!confirmed) {
    return;
  }

  referralsStatusEl.textContent = "Deleting referral...";

  try {
    const response = await authedFetch(`/api/referrals/${encodeURIComponent(referral.id)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    referralsStatusEl.textContent = "Referral deleted.";
    await loadReferrals();
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not delete referral yet.";
    console.error(error);
  }
}

async function updateReferralStatus(referral, status) {
  referralsStatusEl.textContent = "Updating referral status...";

  try {
    const response = await authedFetch(`/api/referrals/${encodeURIComponent(referral.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    referralsStatusEl.textContent = "Referral status updated.";
    await loadReferrals();
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not update referral status yet.";
    console.error(error);
    await loadReferrals();
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
  referralsPanel.hidden = !signedIn;
  userEl.textContent = signedIn ? `Signed in as ${user.email}` : "Please sign in with your SNACK Google account.";

  if (signedIn) {
    loadMessage();
    loadReferrals();
  } else {
    messageEl.textContent = "";
    statusEl.textContent = "Sign in to load the database message.";
    referralsStatusEl.textContent = "";
    referralsList.innerHTML = "";
    referralSummary.innerHTML = "";
    loadedReferrals = [];
    referralForm.reset();
    stopEditingReferral();
  }
});

signInButton.addEventListener("click", signIn);
signOutButton.addEventListener("click", signOutUser);
refreshButton.addEventListener("click", loadMessage);
referralForm.addEventListener("submit", saveReferral);
referralSearchInput.addEventListener("input", renderReferrals);
statusFilterSelect.addEventListener("change", renderReferrals);
cancelEditButton.addEventListener("click", () => {
  referralForm.reset();
  stopEditingReferral();
  referralsStatusEl.textContent = "Edit canceled.";
});
