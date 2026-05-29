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
const connectionStatusEl = document.querySelector("#connection-status");
const refreshButton = document.querySelector("#refresh");
const refreshConnectionButton = document.querySelector("#refresh-connection");
const signInButton = document.querySelector("#sign-in");
const signOutButton = document.querySelector("#sign-out");
const userEl = document.querySelector("#user");
const signedOutPanel = document.querySelector("#signed-out-panel");
const referralsPanel = document.querySelector("#referrals-panel");
const referralForm = document.querySelector("#referral-form");
const formTitle = document.querySelector("#form-title");
const saveReferralButton = document.querySelector("#save-referral");
const cancelEditButton = document.querySelector("#cancel-edit");
const newReferralButton = document.querySelector("#new-referral");
const referralsList = document.querySelector("#referrals-list");
const referralsStatusEl = document.querySelector("#referrals-status");
const referralSearchInput = document.querySelector("#referral-search");
const statusFilterSelect = document.querySelector("#status-filter");
const referralSummary = document.querySelector("#referral-summary");
const referralDetail = document.querySelector("#referral-detail");
const referralModal = document.querySelector("#referral-modal");
const closeReferralModalButton = document.querySelector("#close-referral-modal");

const app = initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const legacyStatusMap = {
  new: "New",
  contacted: "Texted",
  scheduled: "Scheduled",
  closed: "Closed / No Further Outreach"
};
const statuses = [
  "New",
  "Texted",
  "Left Voicemail",
  "Emailed",
  "Requested Call Back",
  "Parent Will Call Back",
  "Scheduled",
  "Not Interested",
  "Closed / No Further Outreach"
];
const summaryGroups = [
  { key: "all", label: "All", statuses },
  { key: "new", label: "New", statuses: ["New"] },
  { key: "contacted", label: "Contacted", statuses: ["Texted", "Left Voicemail", "Emailed"] },
  { key: "follow-up", label: "Follow Up", statuses: ["Requested Call Back", "Parent Will Call Back"] },
  { key: "scheduled", label: "Scheduled", statuses: ["Scheduled"] },
  { key: "closed", label: "Closed", statuses: ["Not Interested", "Closed / No Further Outreach"] }
];

let currentUser = null;
let editingReferralId = null;
let selectedReferralId = null;
let loadedReferrals = [];
let summaryFilter = "all";

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
    connectionStatusEl.textContent = "";
    return;
  }

  statusEl.textContent = "Checking the SNACK CRM API...";
  messageEl.textContent = "";
  connectionStatusEl.textContent = "Checking connection...";
  refreshButton.disabled = true;
  refreshConnectionButton.disabled = true;

  try {
    const response = await authedFetch("/api/message");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    messageEl.textContent = data.text;
    statusEl.textContent = `Loaded from ${data.source}.`;
    connectionStatusEl.textContent = "Connected to Firestore";
  } catch (error) {
    statusEl.textContent = "Could not load the message yet.";
    messageEl.textContent = "Check that the backend is running, then try again.";
    connectionStatusEl.textContent = "API connection needs attention";
    console.error(error);
  } finally {
    refreshButton.disabled = false;
    refreshConnectionButton.disabled = false;
  }
}

function referralName(referral) {
  return `${referral.firstName || ""} ${referral.lastName || ""}`.trim() || "Unnamed referral";
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

function formatDateOnly(value) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium"
  }).format(date);
}

function formatListDate(value) {
  return value ? formatDateOnly(value) : "";
}

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  const normalized = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (normalized.length !== 10) {
    return value || "";
  }

  return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
}

function formatContact(referral) {
  return [formatPhone(referral.phone), referral.email].filter(Boolean).join(" | ") || "No contact info yet";
}

function normalizeStatus(status) {
  return legacyStatusMap[status] || status || "New";
}

function cssToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function setReferralsLoadedStatus() {
  referralsStatusEl.textContent = `${loadedReferrals.length} referral${loadedReferrals.length === 1 ? "" : "s"} loaded.`;
}

function referralMatchesFilters(referral) {
  const statusFilter = statusFilterSelect.value;
  const query = referralSearchInput.value.trim().toLowerCase();
  const group = summaryGroups.find((item) => item.key === summaryFilter);
  const normalizedStatus = normalizeStatus(referral.status);

  if (group && group.key !== "all" && !group.statuses.includes(normalizedStatus)) {
    return false;
  }

  if (statusFilter !== "all" && normalizedStatus !== statusFilter) {
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
    referral.parentName,
    referral.preferredLanguage,
    referral.preferredContactMethod,
    referral.referralType,
    referral.referralSource,
    referral.notes
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function getSelectedReferral() {
  return loadedReferrals.find((referral) => referral.id === selectedReferralId) || null;
}

function setSelectedReferral(referralId) {
  selectedReferralId = referralId;
  referralForm.reset();
  editingReferralId = null;
  referralForm.hidden = true;
  referralDetail.hidden = false;
  openReferralModal();
  renderReferrals();
  renderReferralDetail();
}

function openReferralModal() {
  referralModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeReferralModal() {
  referralModal.hidden = true;
  document.body.classList.remove("modal-open");
  editingReferralId = null;
  referralForm.reset();
  referralForm.hidden = true;
  referralDetail.hidden = false;
  selectedReferralId = null;
  renderReferrals();
  setReferralsLoadedStatus();
}

function statusBadge(status = "New") {
  const normalized = normalizeStatus(status);
  const badge = document.createElement("span");
  badge.className = `status-badge status-${cssToken(normalized)}`;
  badge.textContent = normalized;
  return badge;
}

function renderReferrals() {
  referralsList.innerHTML = "";
  const referrals = loadedReferrals.filter(referralMatchesFilters);

  if (selectedReferralId && !referrals.some((referral) => referral.id === selectedReferralId)) {
    selectedReferralId = null;
  }

  if (!referrals.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedReferrals.length ? "No referrals match the current filters." : "No referrals yet.";
    referralsList.append(empty);
    return;
  }

  for (const referral of referrals) {
    const row = document.createElement("button");
    row.className = "referral-row";
    row.type = "button";
    row.setAttribute("role", "row");
    row.setAttribute("aria-label", `Open ${referralName(referral)}`);

    if (referral.id === selectedReferralId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    const nameCell = document.createElement("span");
    nameCell.className = "table-cell referral-name-cell";
    nameCell.setAttribute("role", "cell");
    nameCell.textContent = referralName(referral);

    const statusCell = document.createElement("span");
    statusCell.className = "table-cell";
    statusCell.setAttribute("role", "cell");
    statusCell.append(statusBadge(referral.status));

    const recentContactCell = document.createElement("span");
    recentContactCell.className = "table-cell muted-cell";
    recentContactCell.setAttribute("role", "cell");
    recentContactCell.textContent = formatListDate(referral.mostRecentContactDate);

    const phoneCell = document.createElement("span");
    phoneCell.className = "table-cell muted-cell";
    phoneCell.setAttribute("role", "cell");
    phoneCell.textContent = formatPhone(referral.phone);

    const languageCell = document.createElement("span");
    languageCell.className = "table-cell";
    languageCell.setAttribute("role", "cell");
    languageCell.textContent = referral.preferredLanguage || "";

    const parentCell = document.createElement("span");
    parentCell.className = "table-cell muted-cell";
    parentCell.setAttribute("role", "cell");
    parentCell.textContent = referral.parentName || "";

    const emailCell = document.createElement("span");
    emailCell.className = "table-cell muted-cell";
    emailCell.setAttribute("role", "cell");
    emailCell.textContent = referral.email || "";

    row.append(statusCell, recentContactCell, nameCell, phoneCell, languageCell, parentCell, emailCell);
    row.addEventListener("click", () => setSelectedReferral(referral.id));
    referralsList.append(row);
  }
}

function renderReferralSummary() {
  referralSummary.innerHTML = "";

  for (const group of summaryGroups.filter((item) => item.key !== "all")) {
    const count = loadedReferrals.filter((referral) => group.statuses.includes(normalizeStatus(referral.status))).length;
    const item = document.createElement("button");
    item.className = "summary-item";
    item.type = "button";

    if (summaryFilter === group.key) {
      item.classList.add("active");
    }

    const countEl = document.createElement("strong");
    countEl.textContent = count;

    const labelEl = document.createElement("span");
    labelEl.textContent = group.label;

    item.append(countEl, labelEl);
    item.addEventListener("click", () => {
      summaryFilter = summaryFilter === group.key ? "all" : group.key;
      statusFilterSelect.value = "all";
      renderReferralSummary();
      renderReferrals();
    });
    referralSummary.append(item);
  }
}

function renderReferralDetail() {
  if (!referralForm.hidden) {
    referralDetail.hidden = true;
    return;
  }

  referralDetail.hidden = false;
  referralDetail.innerHTML = "";

  const referral = getSelectedReferral();

  if (!loadedReferrals.length) {
    referralDetail.append(
      emptyDetail("Create the first referral to start building the workspace.", "New referral", startNewReferral)
    );
    return;
  }

  if (!referral) {
    referralDetail.append(
      emptyDetail("No referral matches the current list view.", "Clear filters", clearReferralFilters)
    );
    return;
  }

  const heading = document.createElement("div");
  heading.className = "detail-heading";

  const titleWrap = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Referral profile";
  const title = document.createElement("h3");
  title.textContent = referralName(referral);
  titleWrap.append(eyebrow, title);

  const actions = document.createElement("div");
  actions.className = "detail-actions";

  const editButton = document.createElement("button");
  editButton.className = "secondary-button";
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => startEditingReferral(referral));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteReferral(referral));

  actions.append(editButton, deleteButton);
  heading.append(titleWrap, actions);

  const statusLabel = document.createElement("label");
  statusLabel.className = "status-field";
  statusLabel.textContent = "Status";

  const statusSelect = document.createElement("select");
  statusSelect.dataset.referralId = referral.id;

  for (const status of statuses) {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    statusSelect.append(option);
  }

  statusSelect.value = normalizeStatus(referral.status);
  statusSelect.addEventListener("change", () => updateReferralStatus(referral, statusSelect.value));
  statusLabel.append(statusSelect);

  const infoGrid = document.createElement("dl");
  infoGrid.className = "detail-grid";
  addDetailField(infoGrid, "Parent", referral.parentName || "Not provided");
  addDetailField(infoGrid, "Phone", formatPhone(referral.phone) || "Not provided");
  addDetailField(infoGrid, "Email", referral.email || "Not provided");
  addDetailField(infoGrid, "Referral Type", referral.referralType || "Not set");
  addDetailField(infoGrid, "Preferred Language", referral.preferredLanguage || "Not set");
  addDetailField(infoGrid, "Preferred Contact", referral.preferredContactMethod || "Not set");
  addDetailField(infoGrid, "Source", referral.referralSource || "No source yet");
  addDetailField(infoGrid, "Date of Birth", formatDateOnly(referral.dateOfBirth));
  addDetailField(infoGrid, "Gender", referral.gender || "Unspecified");
  addDetailField(infoGrid, "YCCO", referral.ycco || "Unknown");
  addDetailField(infoGrid, "Assessment Score", referral.assessmentScore ?? "Not set");
  addDetailField(infoGrid, "Willingness Score", referral.willingnessScore ?? "Not set");
  addDetailField(infoGrid, "Referral Date", formatDateOnly(referral.referralDate));
  addDetailField(infoGrid, "First Contact Date", formatDateOnly(referral.firstContactDate));
  addDetailField(infoGrid, "Most Recent Contact Date", formatDateOnly(referral.mostRecentContactDate));
  addDetailField(infoGrid, "First Appointment Date", formatDateOnly(referral.firstAppointmentDate));
  addDetailField(infoGrid, "Last Appointment Date", formatDateOnly(referral.lastAppointmentDate));
  addDetailField(infoGrid, "Address", formatAddress(referral));
  addDetailField(infoGrid, "Email Opt Out", referral.emailOptOut ? "Yes" : "No");
  addDetailField(infoGrid, "Text Opt Out", referral.textOptOut ? "Yes" : "No");
  addDetailField(infoGrid, "Created", formatDate(referral.createdAt));

  if (referral.convertedClientId) {
    addDetailField(infoGrid, "Conversion", "Converted to client");
  }

  const notes = document.createElement("section");
  notes.className = "notes-panel";
  const notesTitle = document.createElement("h4");
  notesTitle.textContent = "Notes";
  const notesText = document.createElement("p");
  notesText.textContent = referral.notes || "No notes yet.";
  notes.append(notesTitle, notesText);

  referralDetail.append(heading, statusLabel, infoGrid, notes);

  if (normalizeStatus(referral.status) === "Scheduled" && !referral.convertedClientId) {
    const convertButton = document.createElement("button");
    convertButton.type = "button";
    convertButton.textContent = "Convert to Client";
    convertButton.addEventListener("click", () => convertReferralToClient(referral));
    referralDetail.append(convertButton);
  }
}

function emptyDetail(text, actionLabel, action) {
  const empty = document.createElement("div");
  empty.className = "detail-empty";
  const title = document.createElement("h3");
  title.textContent = "No profile selected";
  const copy = document.createElement("p");
  copy.textContent = text;
  empty.append(title, copy);

  if (actionLabel && action) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = actionLabel;
    button.addEventListener("click", action);
    empty.append(button);
  }

  return empty;
}

function clearReferralFilters() {
  referralSearchInput.value = "";
  statusFilterSelect.value = "all";
  summaryFilter = "all";
  selectedReferralId = null;
  renderReferralSummary();
  renderReferrals();
}

function formatAddress(referral) {
  return [referral.addressStreet, referral.addressCity, referral.addressState, referral.addressZip]
    .filter(Boolean)
    .join(", ") || "Not set";
}

function addDetailField(container, label, value) {
  const group = document.createElement("div");
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  description.textContent = value;
  group.append(term, description);
  container.append(group);
}

async function loadReferrals() {
  if (!currentUser) {
    referralsStatusEl.textContent = "";
    referralsList.innerHTML = "";
    referralDetail.innerHTML = "";
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
    if (!referralModal.hidden && selectedReferralId) {
      renderReferralDetail();
    }
    setReferralsLoadedStatus();
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
  referral.emailOptOut = referralForm.elements.emailOptOut.checked;
  referral.textOptOut = referralForm.elements.textOptOut.checked;
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

    const data = await response.json();
    selectedReferralId = data.referral?.id || editingReferralId;
    referralForm.reset();
    referralsStatusEl.textContent = isEditing ? "Referral updated." : "Referral saved.";
    await loadReferrals();
    referralForm.hidden = true;
    referralDetail.hidden = false;
    renderReferralDetail();
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not save referral yet.";
    console.error(error);
  } finally {
    saveReferralButton.disabled = false;
  }
}

function startNewReferral() {
  editingReferralId = null;
  selectedReferralId = null;
  referralForm.reset();
  formTitle.textContent = "New Referral";
  saveReferralButton.textContent = "Save referral";
  cancelEditButton.hidden = false;
  referralForm.hidden = false;
  referralDetail.hidden = true;
  openReferralModal();
  referralsStatusEl.textContent = "Creating a new referral.";
}

function startEditingReferral(referral) {
  editingReferralId = referral.id;
  selectedReferralId = referral.id;
  referralForm.elements.firstName.value = referral.firstName || "";
  referralForm.elements.lastName.value = referral.lastName || "";
  referralForm.elements.parentName.value = referral.parentName || "";
  referralForm.elements.phone.value = referral.phone || "";
  referralForm.elements.email.value = referral.email || "";
  referralForm.elements.preferredLanguage.value = referral.preferredLanguage || "English";
  referralForm.elements.preferredContactMethod.value = referral.preferredContactMethod || "";
  referralForm.elements.referralType.value = referral.referralType || "Internal Clinic Referral";
  referralForm.elements.referralSource.value = referral.referralSource || "";
  referralForm.elements.dateOfBirth.value = referral.dateOfBirth || "";
  referralForm.elements.gender.value = referral.gender || "Unspecified";
  referralForm.elements.ycco.value = referral.ycco || "";
  referralForm.elements.assessmentScore.value = referral.assessmentScore ?? "";
  referralForm.elements.willingnessScore.value = referral.willingnessScore ?? "";
  referralForm.elements.referralDate.value = referral.referralDate || "";
  referralForm.elements.firstContactDate.value = referral.firstContactDate || "";
  referralForm.elements.mostRecentContactDate.value = referral.mostRecentContactDate || "";
  referralForm.elements.firstAppointmentDate.value = referral.firstAppointmentDate || "";
  referralForm.elements.lastAppointmentDate.value = referral.lastAppointmentDate || "";
  referralForm.elements.addressStreet.value = referral.addressStreet || "";
  referralForm.elements.addressCity.value = referral.addressCity || "";
  referralForm.elements.addressState.value = referral.addressState || "";
  referralForm.elements.addressZip.value = referral.addressZip || "";
  referralForm.elements.emailOptOut.checked = Boolean(referral.emailOptOut);
  referralForm.elements.textOptOut.checked = Boolean(referral.textOptOut);
  referralForm.elements.notes.value = referral.notes || "";
  formTitle.textContent = `Edit ${referralName(referral)}`;
  saveReferralButton.textContent = "Update referral";
  cancelEditButton.hidden = false;
  referralForm.hidden = false;
  referralDetail.hidden = true;
  openReferralModal();
  referralsStatusEl.textContent = `Editing ${referralName(referral)}.`;
}

function stopEditingReferral() {
  editingReferralId = null;
  formTitle.textContent = "New Referral";
  saveReferralButton.textContent = "Save referral";
  cancelEditButton.hidden = true;
  referralForm.hidden = true;
  referralDetail.hidden = false;
  renderReferralDetail();
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

    if (selectedReferralId === referral.id) {
      selectedReferralId = null;
    }

    await loadReferrals();
    closeReferralModal();
    referralsStatusEl.textContent = "Referral deleted.";
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

    const data = await response.json();
    selectedReferralId = referral.id;

    if (status === "Scheduled" && !data.referral?.convertedClientId) {
      const shouldConvert = window.confirm("This referral is now scheduled. Convert this referral to a client?");

      if (shouldConvert) {
        await convertReferralToClient(data.referral);
        return;
      }
    }

    referralsStatusEl.textContent = "Referral status updated.";
    await loadReferrals();
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not update referral status yet.";
    console.error(error);
    await loadReferrals();
  }
}

async function convertReferralToClient(referral) {
  referralsStatusEl.textContent = "Converting referral to client...";

  try {
    const response = await authedFetch(`/api/referrals/${encodeURIComponent(referral.id)}/convert`, {
      method: "POST"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedReferralId = data.referral?.id || referral.id;
    referralsStatusEl.textContent = "Referral converted to client.";
    await loadReferrals();
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not convert referral yet.";
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
  signedOutPanel.hidden = signedIn;
  referralsPanel.hidden = !signedIn;
  userEl.textContent = signedIn ? `Signed in as ${user.email}` : "Please sign in with your SNACK Google account.";

  if (signedIn) {
    loadMessage();
    loadReferrals();
  } else {
    messageEl.textContent = "";
    statusEl.textContent = "Sign in to load the database message.";
    connectionStatusEl.textContent = "";
    referralsStatusEl.textContent = "";
    referralsList.innerHTML = "";
    referralSummary.innerHTML = "";
    referralDetail.innerHTML = "";
    selectedReferralId = null;
    loadedReferrals = [];
    referralForm.reset();
    closeReferralModal();
  }
});

signInButton.addEventListener("click", signIn);
signOutButton.addEventListener("click", signOutUser);
refreshButton.addEventListener("click", loadMessage);
refreshConnectionButton.addEventListener("click", loadMessage);
newReferralButton.addEventListener("click", startNewReferral);
referralForm.addEventListener("submit", saveReferral);
referralSearchInput.addEventListener("input", () => {
  renderReferralSummary();
  renderReferrals();
});
statusFilterSelect.addEventListener("change", () => {
  summaryFilter = "all";
  renderReferralSummary();
  renderReferrals();
});
cancelEditButton.addEventListener("click", () => {
  referralForm.reset();
  if (selectedReferralId) {
    stopEditingReferral();
    setReferralsLoadedStatus();
    return;
  }
  closeReferralModal();
});
closeReferralModalButton.addEventListener("click", closeReferralModal);
referralModal.addEventListener("click", (event) => {
  if (event.target === referralModal) {
    closeReferralModal();
  }
});
