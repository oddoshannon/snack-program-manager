import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
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
const signedOutPanel = document.querySelector("#signed-out-panel");
const dailyWorkflowPanel = document.querySelector("#daily-workflow-panel");
const dashboardPanel = document.querySelector("#dashboard-panel");
const referralsPanel = document.querySelector("#referrals-panel");
const clientsPanel = document.querySelector("#clients-panel");
const referralNetworkPanel = document.querySelector("#referral-network-panel");
const outreachPanel = document.querySelector("#outreach-panel");
const navDailyWorkflowButton = document.querySelector("#nav-daily-workflow");
const navCrmButton = document.querySelector("#nav-crm");
const navOutreachButton = document.querySelector("#nav-outreach");
const crmModuleTabs = document.querySelector("#crm-module-tabs");
const crmTabDashboardButton = document.querySelector("#crm-tab-dashboard");
const crmTabReferralsButton = document.querySelector("#crm-tab-referrals");
const crmTabClientsButton = document.querySelector("#crm-tab-clients");
const crmTabReferralNetworkButton = document.querySelector("#crm-tab-referral-network");
const dailyWorkflowSummary = document.querySelector("#daily-workflow-summary");
const dailyPriorityList = document.querySelector("#daily-priority-list");
const dailyAppointmentsList = document.querySelector("#daily-appointments-list");
const dailyOutreachList = document.querySelector("#daily-outreach-list");
const dailyDataList = document.querySelector("#daily-data-list");
const dashboardSummary = document.querySelector("#dashboard-summary");
const dashboardFollowups = document.querySelector("#dashboard-followups");
const dashboardNewReferrals = document.querySelector("#dashboard-new-referrals");
const dashboardScheduled = document.querySelector("#dashboard-scheduled");
const dashboardNoNext = document.querySelector("#dashboard-no-next");
const referralForm = document.querySelector("#referral-form");
const formTitle = document.querySelector("#form-title");
const saveReferralButton = document.querySelector("#save-referral");
const cancelEditButton = document.querySelector("#cancel-edit");
const newReferralButton = document.querySelector("#new-referral");
const referralsTableHead = document.querySelector("#referrals-table-head");
const referralsList = document.querySelector("#referrals-list");
const referralsStatusEl = document.querySelector("#referrals-status");
const referralSearchInput = document.querySelector("#referral-search");
const statusFilterSelect = document.querySelector("#status-filter");
const sortReferralsSelect = document.querySelector("#sort-referrals");
const referralColumnOptions = document.querySelector("#referral-column-options");
const importReferralsButton = document.querySelector("#import-referrals");
const referralCsvInput = document.querySelector("#referral-csv-input");
const referralSummary = document.querySelector("#referral-summary");
const referralDetail = document.querySelector("#referral-detail");
const referralModal = document.querySelector("#referral-modal");
const closeReferralModalButton = document.querySelector("#close-referral-modal");
const referralSourceInput = document.querySelector("#referral-source");
const referralSourceOptions = document.querySelector("#referral-source-options");
const referralImportModal = document.querySelector("#referral-import-modal");
const referralImportDetail = document.querySelector("#referral-import-detail");
const closeReferralImportButton = document.querySelector("#close-referral-import");
const confirmReferralImportButton = document.querySelector("#confirm-referral-import");
const clientsList = document.querySelector("#clients-list");
const clientsTableHead = document.querySelector("#clients-table-head");
const clientsStatusEl = document.querySelector("#clients-status");
const clientSearchInput = document.querySelector("#client-search");
const clientStatusFilterSelect = document.querySelector("#client-status-filter");
const sortClientsSelect = document.querySelector("#sort-clients");
const clientColumnOptions = document.querySelector("#client-column-options");
const importClientsButton = document.querySelector("#import-clients");
const clientCsvInput = document.querySelector("#client-csv-input");
const newClientButton = document.querySelector("#new-client");
const clientSummary = document.querySelector("#client-summary");
const clientModal = document.querySelector("#client-modal");
const clientDetail = document.querySelector("#client-detail");
const clientForm = document.querySelector("#client-form");
const clientFormTitle = document.querySelector("#client-form-title");
const saveClientButton = document.querySelector("#save-client");
const cancelClientEditButton = document.querySelector("#cancel-client-edit");
const clientReferralSourceInput = document.querySelector("#client-referral-source");
const clientImportModal = document.querySelector("#client-import-modal");
const clientImportDetail = document.querySelector("#client-import-detail");
const closeClientImportButton = document.querySelector("#close-client-import");
const confirmClientImportButton = document.querySelector("#confirm-client-import");
const networkList = document.querySelector("#network-list");
const networkStatusEl = document.querySelector("#network-status");
const networkSearchInput = document.querySelector("#network-search");
const importNetworkButton = document.querySelector("#import-network");
const networkCsvInput = document.querySelector("#network-csv-input");
const newNetworkEntryButton = document.querySelector("#new-network-entry");
const networkModal = document.querySelector("#network-modal");
const networkDetail = document.querySelector("#network-detail");
const networkForm = document.querySelector("#network-form");
const networkFormTitle = document.querySelector("#network-form-title");
const saveNetworkEntryButton = document.querySelector("#save-network-entry");
const cancelNetworkEditButton = document.querySelector("#cancel-network-edit");
const networkImportModal = document.querySelector("#network-import-modal");
const networkImportDetail = document.querySelector("#network-import-detail");
const closeNetworkImportButton = document.querySelector("#close-network-import");
const confirmNetworkImportButton = document.querySelector("#confirm-network-import");
const outreachList = document.querySelector("#outreach-list");
const outreachSummary = document.querySelector("#outreach-summary");
const outreachStatusEl = document.querySelector("#outreach-status");
const outreachSearchInput = document.querySelector("#outreach-search");
const outreachDashboardView = document.querySelector("#outreach-dashboard-view");
const outreachEventsView = document.querySelector("#outreach-events-view");
const outreachContactsView = document.querySelector("#outreach-contacts-view");
const outreachTabDashboardButton = document.querySelector("#outreach-tab-dashboard");
const outreachTabEventsButton = document.querySelector("#outreach-tab-events");
const outreachTabContactsButton = document.querySelector("#outreach-tab-contacts");
const outreachUpcomingList = document.querySelector("#outreach-upcoming-list");
const outreachContactFollowupList = document.querySelector("#outreach-contact-followup-list");
const newOutreachEventButton = document.querySelector("#new-outreach-event");
const newOutreachContactButton = document.querySelector("#new-outreach-contact");
const outreachModal = document.querySelector("#outreach-modal");
const outreachDetail = document.querySelector("#outreach-detail");
const outreachForm = document.querySelector("#outreach-form");
const outreachFormTitle = document.querySelector("#outreach-form-title");
const saveOutreachEventButton = document.querySelector("#save-outreach-event");
const cancelOutreachEditButton = document.querySelector("#cancel-outreach-edit");
const outreachContactList = document.querySelector("#outreach-contact-list");
const outreachContactStatusEl = document.querySelector("#outreach-contact-status");
const outreachContactSearchInput = document.querySelector("#outreach-contact-search");
const outreachContactModal = document.querySelector("#outreach-contact-modal");
const outreachContactDetail = document.querySelector("#outreach-contact-detail");
const outreachContactForm = document.querySelector("#outreach-contact-form");
const outreachContactFormTitle = document.querySelector("#outreach-contact-form-title");
const outreachContactEventSelect = document.querySelector("#outreach-contact-event-id");
const saveOutreachContactButton = document.querySelector("#save-outreach-contact");
const cancelOutreachContactEditButton = document.querySelector("#cancel-outreach-contact-edit");

const app = getApps()[0] || initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.addEventListener("error", (event) => {
  if (statusEl) {
    statusEl.textContent = `App startup error: ${event.message}`;
  }
});

window.addEventListener("unhandledrejection", (event) => {
  if (statusEl) {
    statusEl.textContent = `App startup error: ${event.reason?.message || event.reason || "Unknown error"}`;
  }
});

signInButton.addEventListener("click", signIn);
signOutButton.addEventListener("click", signOutUser);
refreshButton.addEventListener("click", loadMessage);
window.SNACK_MAIN_SIGNIN_READY = true;

const legacyStatusMap = {
  new: "New",
  contacted: "Texted",
  scheduled: "Scheduled",
  closed: "Closed / No Further Outreach",
  "Parent Will Call Back": "Caregiver Will Call Back",
  "Parent will Call Back": "Caregiver Will Call Back"
};
const statuses = [
  "New",
  "Texted",
  "Left Voicemail",
  "Emailed",
  "Requested Call Back",
  "Caregiver Will Call Back",
  "Scheduled",
  "Not Interested",
  "Closed / No Further Outreach"
];
const summaryGroups = [
  { key: "all", label: "Total", statuses },
  { key: "new", label: "New", statuses: ["New"] },
  {
    key: "follow-up",
    label: "Follow Up",
    statuses: ["Texted", "Left Voicemail", "Emailed", "Requested Call Back", "Caregiver Will Call Back"]
  },
  { key: "scheduled", label: "Scheduled", statuses: ["Scheduled"] },
  { key: "closed", label: "Closed", statuses: ["Not Interested", "Closed / No Further Outreach"] }
];
const clientStatuses = [
  "Scheduled",
  "Active",
  "Needs Reschedule",
  "Needs Language Support",
  "Waiting on Family",
  "Graduated",
  "Inactive",
  "Closed"
];
const clientSummaryGroups = [
  { key: "all", label: "Total", statuses: clientStatuses },
  { key: "scheduled", label: "Scheduled", statuses: ["Scheduled"] },
  { key: "active", label: "Active", statuses: ["Active", "Needs Reschedule"] },
  { key: "follow-up", label: "Follow Up", statuses: ["Needs Reschedule", "Needs Language Support"] },
  { key: "graduated", label: "Graduated", statuses: ["Graduated"] },
  { key: "closed", label: "Closed", statuses: ["Inactive", "Closed"] }
];
const zohoClientStatusMap = {
  "Appts in Progress": "Active",
  Graduated: "Graduated",
  Inactive: "Inactive",
  Interpreter: "Needs Language Support",
  "On the Way Out": "Inactive",
  "Parent Will Call When Ready": "Waiting on Family",
  "Priority Reschedule": "Needs Reschedule",
  Reschedule: "Needs Reschedule",
  Scheduled: "Scheduled",
  Sunrise: "Waiting on Family"
};
const clientStatusGroupColors = {
  Scheduled: "scheduled",
  Active: "new",
  "Needs Reschedule": "new",
  "Needs Language Support": "follow-up",
  "Waiting on Family": "contacted",
  Graduated: "new",
  Inactive: "closed",
  Closed: "closed"
};
const tableColumns = {
  referrals: [
    { key: "status", label: "Status", width: 150, render: (referral) => statusBadge(referral.status) },
    { key: "recentContact", label: "Recent Contact", width: 150, render: (referral) => formatListDate(referral.mostRecentContactDate), muted: true },
    { key: "name", label: "Name", width: 190, render: referralName, strong: true },
    { key: "phone", label: "Phone", width: 150, render: (referral) => formatPhone(referral.phone), muted: true },
    { key: "language", label: "Language", width: 130, render: (referral) => referral.preferredLanguage || "" },
    { key: "caregiver", label: "Caregiver", width: 180, render: (referral) => referral.parentName || "", muted: true },
    { key: "email", label: "Email", width: 230, render: (referral) => referral.email || "", muted: true }
  ],
  clients: [
    { key: "status", label: "Status", width: 150, render: (client) => clientStatusBadge(client.status || "Scheduled") },
    { key: "recentContact", label: "Recent Contact", width: 150, render: (client) => formatListDate(client.mostRecentContactDate), muted: true },
    { key: "lastAppointment", label: "Graduation Date", width: 160, render: (client) => formatListDate(client.lastAppointmentDate), muted: true },
    { key: "name", label: "Client Name", width: 190, render: clientName, strong: true },
    { key: "phone", label: "Phone", width: 150, render: (client) => formatPhone(client.phone), muted: true },
    { key: "language", label: "Language", width: 130, render: (client) => client.preferredLanguage || "" },
    { key: "caregiver", label: "Caregiver", width: 180, render: (client) => client.parentName || "", muted: true },
    { key: "email", label: "Email", width: 230, render: (client) => client.email || "", muted: true }
  ]
};
const clientCsvFieldMappings = [
  { key: "firstName", label: "Child First Name", source: "First Name", required: true },
  { key: "lastName", label: "Child Last Name", source: "Last Name", required: true },
  { key: "parentName", label: "Caregiver", source: "Parent Name", required: true },
  { key: "phone", label: "Phone", source: "Mobile / Home Phone", required: true },
  { key: "email", label: "Email", source: "Email" },
  { key: "dateOfBirth", label: "Date of Birth", source: "Date of Birth" },
  { key: "preferredLanguage", label: "Preferred Language", source: "Preferred Language", required: true },
  { key: "status", label: "Status", source: "Status" },
  { key: "referralSource", label: "Referral Source", source: "Referring Provider" },
  { key: "referralDate", label: "Referral Date", source: "Referral Date" },
  { key: "firstContactDate", label: "First Contact Date", source: "First Contact Date" },
  { key: "mostRecentContactDate", label: "Most Recent Contact Date", source: "Most Recent Contact Date" },
  { key: "firstAppointmentDate", label: "First Appointment Date", source: "First Appt Date" },
  { key: "lastAppointmentDate", label: "Graduation Date", source: "Last Appt Date" },
  { key: "assessmentScore", label: "Assessment Score", source: "Assessment Score" },
  { key: "willingnessScore", label: "Willingness Score", source: "Willingness Score" },
  { key: "gender", label: "Gender", source: "Gender" },
  { key: "ycco", label: "YCCO", source: "YCCO" },
  { key: "emailOptOut", label: "Email Opt Out", source: "Email Opt Out" },
  { key: "addressStreet", label: "Street Address", source: "Mailing Street" },
  { key: "addressCity", label: "City", source: "Mailing City" },
  { key: "addressState", label: "State", source: "Mailing State" },
  { key: "addressZip", label: "Zip Code", source: "Mailing Zip" },
  { key: "notes", label: "Notes", source: "Note" },
  { key: "zohoRecordId", label: "Zoho Record ID", source: "Record Id" }
];
const referralCsvFieldMappings = [
  { key: "firstName", label: "Child First Name", source: "First Name", required: true },
  { key: "lastName", label: "Child Last Name", source: "Last Name", required: true },
  { key: "parentName", label: "Caregiver", source: "Parent Name", required: true },
  { key: "phone", label: "Phone", source: "Mobile / Home Phone / Phone", required: true },
  { key: "email", label: "Email", source: "Email" },
  { key: "dateOfBirth", label: "Date of Birth", source: "Date of Birth" },
  { key: "preferredLanguage", label: "Preferred Language", source: "Preferred Language", required: true },
  { key: "status", label: "Status", source: "Referral Status / Contacted? / Status" },
  { key: "referralType", label: "Referral Type", source: "Referral CSV or Assessment CSV", required: true },
  { key: "referralSource", label: "Referral Source", source: "Referring Provider" },
  { key: "referralDate", label: "Referral Date", source: "Referral Date" },
  { key: "firstContactDate", label: "First Contact Date", source: "First Contact Date" },
  { key: "mostRecentContactDate", label: "Most Recent Contact Date", source: "Most Recent Contact Date" },
  { key: "firstAppointmentDate", label: "First Appointment Date", source: "First Appt Date" },
  { key: "lastAppointmentDate", label: "Graduation Date", source: "Last Appt Date" },
  { key: "assessmentScore", label: "Assessment Score", source: "Assessment Score" },
  { key: "willingnessScore", label: "Willingness Score", source: "Willingness Score" },
  { key: "gender", label: "Gender", source: "Gender" },
  { key: "ycco", label: "YCCO", source: "YCCO" },
  { key: "emailOptOut", label: "Email Opt Out", source: "Email Opt Out" },
  { key: "addressStreet", label: "Street Address", source: "Street" },
  { key: "addressCity", label: "City", source: "City" },
  { key: "addressState", label: "State", source: "State" },
  { key: "addressZip", label: "Zip Code", source: "Zip Code" },
  { key: "notes", label: "Notes", source: "Note" },
  { key: "zohoRecordId", label: "Zoho Record ID", source: "Record Id" }
];
const tableHeads = {
  referrals: referralsTableHead,
  clients: clientsTableHead
};
const tableLists = {
  referrals: referralsList,
  clients: clientsList
};
const columnOptionContainers = {
  referrals: referralColumnOptions,
  clients: clientColumnOptions
};

let currentUser = null;
let editingReferralId = null;
let selectedReferralId = null;
let selectedClientId = null;
let editingClientId = null;
let selectedNetworkEntryId = null;
let editingNetworkEntryId = null;
let selectedOutreachEventId = null;
let editingOutreachEventId = null;
let selectedOutreachContactId = null;
let editingOutreachContactId = null;
let loadedReferrals = [];
let loadedClients = [];
let loadedNetworkEntries = [];
let loadedOutreachEvents = [];
let loadedOutreachContacts = [];
let latestClientImportAnalysis = null;
let latestReferralImportAnalysis = null;
let latestNetworkImportAnalysis = null;
const expandedNetworkEntryIds = new Set();
let summaryFilter = "all";
let clientSummaryFilter = "all";
let activeModule = "daily-workflow";
let activeCrmView = "dashboard";
let activeOutreachView = "dashboard";

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

  statusEl.textContent = "Checking the SNACK CRM API...";
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
  return `${referral.firstName || ""} ${referral.lastName || ""}`.trim() || "Unnamed referral";
}

function clientName(client) {
  return `${client.firstName || ""} ${client.lastName || ""}`.trim() || "Unnamed client";
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatDateOnly(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium"
  }).format(date);
}

function formatListDate(value) {
  return value ? formatDateOnly(value) : "";
}

function normalizeCsvDate(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);

  if (!match) {
    return "";
  }

  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  const month = match[1].padStart(2, "0");
  const day = match[2].padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(value) {
  if (!value) {
    return "";
  }

  const normalized = String(value).includes("T") ? String(value).slice(0, 10) : value;
  const date = new Date(`${normalized}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit"
  }).format(date);
}

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  const normalized = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (normalized.length !== 10) {
    return value || "";
  }

  return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
}

function normalizePhoneKey(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

function displayValue(value) {
  return value === null || value === undefined || value === "" ? "-" : value;
}

function displayBoolean(value) {
  return value ? "✓" : "-";
}

function formatContact(referral) {
  return [formatPhone(referral.phone), referral.email].filter(Boolean).join(" | ") || "No contact info yet";
}

function normalizeStatus(status) {
  return legacyStatusMap[status] || status || "New";
}

function statusGroupKey(status) {
  const normalized = normalizeStatus(status);
  const group = summaryGroups.find((item) => item.key !== "all" && item.statuses.includes(normalized));
  return group?.key || "new";
}

function cssToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function tablePreferenceKey(moduleName) {
  const userKey = currentUser?.email || "local";
  return `snack-crm:${userKey}:${moduleName}:columns`;
}

function defaultColumnState(moduleName) {
  const columns = tableColumns[moduleName];
  return {
    order: columns.map((column) => column.key),
    widths: Object.fromEntries(columns.map((column) => [column.key, column.width])),
    visible: Object.fromEntries(columns.map((column) => [column.key, true]))
  };
}

function columnState(moduleName) {
  const defaults = defaultColumnState(moduleName);

  try {
    const saved = JSON.parse(localStorage.getItem(tablePreferenceKey(moduleName)) || "null");
    const validKeys = new Set(defaults.order);
    const savedOrder = Array.isArray(saved?.order) ? saved.order.filter((key) => validKeys.has(key)) : [];
    const order = [...savedOrder, ...defaults.order.filter((key) => !savedOrder.includes(key))];
    const widths = { ...defaults.widths };
    const visible = { ...defaults.visible };

    for (const [key, value] of Object.entries(saved?.widths || {})) {
      if (validKeys.has(key) && Number.isFinite(Number(value))) {
        widths[key] = Math.max(70, Math.min(360, Number(value)));
      }
    }

    for (const [key, value] of Object.entries(saved?.visible || {})) {
      if (validKeys.has(key)) {
        visible[key] = Boolean(value);
      }
    }

    if (!Object.values(visible).some(Boolean)) {
      return defaults;
    }

    return { order, widths, visible };
  } catch (_error) {
    return defaults;
  }
}

function saveColumnState(moduleName, state) {
  localStorage.setItem(tablePreferenceKey(moduleName), JSON.stringify(state));
}

function orderedColumns(moduleName) {
  const columnsByKey = Object.fromEntries(tableColumns[moduleName].map((column) => [column.key, column]));
  return columnState(moduleName).order.map((key) => columnsByKey[key]).filter(Boolean);
}

function visibleColumns(moduleName) {
  const state = columnState(moduleName);
  return orderedColumns(moduleName).filter((column) => state.visible[column.key] !== false);
}

function gridTemplateFor(moduleName) {
  const state = columnState(moduleName);
  return visibleColumns(moduleName)
    .map((column) => {
      const width = state.widths[column.key] || column.width;
      return `minmax(72px, ${width}fr)`;
    })
    .join(" ");
}

function minTableWidth(moduleName) {
  return "100%";
}

function renderCell(column, record) {
  const cell = document.createElement("span");
  cell.className = "table-cell";
  cell.setAttribute("role", "cell");

  if (column.muted) {
    cell.classList.add("muted-cell");
  }

  if (column.strong) {
    cell.classList.add("referral-name-cell");
  }

  const content = column.render(record);

  if (content instanceof Node) {
    cell.append(content);
  } else {
    cell.textContent = content;
  }

  return cell;
}

function renderTableHead(moduleName) {
  const head = tableHeads[moduleName];
  const state = columnState(moduleName);
  head.innerHTML = "";
  head.style.gridTemplateColumns = gridTemplateFor(moduleName);
  head.style.minWidth = minTableWidth(moduleName);
  renderColumnOptions(moduleName);

  for (const column of visibleColumns(moduleName)) {
    const cell = document.createElement("span");
    cell.className = "table-heading-cell";
    cell.setAttribute("role", "columnheader");
    cell.draggable = true;
    cell.dataset.columnKey = column.key;

    const label = document.createElement("span");
    label.textContent = column.label;

    const handle = document.createElement("span");
    handle.className = "column-resize-handle";
    handle.setAttribute("aria-hidden", "true");

    cell.append(label, handle);
    cell.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", column.key);
      event.dataTransfer.effectAllowed = "move";
    });
    cell.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    });
    cell.addEventListener("drop", (event) => {
      event.preventDefault();
      const movedKey = event.dataTransfer.getData("text/plain");
      const targetKey = column.key;

      if (!movedKey || movedKey === targetKey) {
        return;
      }

      const nextOrder = state.order.filter((key) => key !== movedKey);
      const targetIndex = nextOrder.indexOf(targetKey);
      nextOrder.splice(targetIndex, 0, movedKey);
      saveColumnState(moduleName, { ...state, order: nextOrder });
      renderModuleTable(moduleName);
    });
    handle.addEventListener("mousedown", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth = state.widths[column.key] || column.width;

      const resize = (moveEvent) => {
        const nextWidth = Math.max(70, Math.min(360, startWidth + moveEvent.clientX - startX));
        const nextState = columnState(moduleName);
        nextState.widths[column.key] = nextWidth;
        saveColumnState(moduleName, nextState);
        renderModuleTable(moduleName);
      };

      const stopResize = () => {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
      };

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    });
    head.append(cell);
  }
}

function renderColumnOptions(moduleName) {
  const container = columnOptionContainers[moduleName];

  if (!container) {
    return;
  }

  const state = columnState(moduleName);
  container.innerHTML = "";

  for (const column of tableColumns[moduleName]) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state.visible[column.key] !== false;

    checkbox.addEventListener("change", () => {
      const nextState = columnState(moduleName);
      const visibleCount = Object.entries(nextState.visible).filter(([key, value]) => key === column.key ? checkbox.checked : value !== false).length;

      if (!visibleCount) {
        checkbox.checked = true;
        return;
      }

      nextState.visible[column.key] = checkbox.checked;
      saveColumnState(moduleName, nextState);
      renderModuleTable(moduleName);
    });

    label.append(checkbox, document.createTextNode(column.label));
    container.append(label);
  }
}

function renderModuleTable(moduleName) {
  if (moduleName === "referrals") {
    renderReferrals();
    return;
  }

  renderClients();
}

function setReferralsLoadedStatus() {
  referralsStatusEl.textContent = "";
}

function setClientsLoadedStatus() {
  clientsStatusEl.textContent = "";
}

function percentage(numerator, denominator) {
  if (!denominator) {
    return "0%";
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}

function todayDateString() {
  const date = new Date();
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function hasFutureAppointment(client) {
  const today = todayDateString();
  return [client.firstAppointmentDate].some((value) => value && value >= today);
}

function knownReferralSources() {
  return [
    ...new Set([
      ...loadedReferrals.map((referral) => referral.referralSource).filter(Boolean),
      ...loadedClients.map((client) => client.referralSource).filter(Boolean),
      ...loadedNetworkEntries.map((entry) => entry.name).filter(Boolean),
      ...loadedNetworkEntries.flatMap((entry) => (entry.providers || []).map((provider) => provider.name)).filter(Boolean)
    ])
  ]
    .sort((first, second) => first.localeCompare(second));
}

function renderReferralSourceOptions(event) {
  const input = event?.target || referralSourceInput;
  const query = input.value.trim().toLowerCase();
  const sources = knownReferralSources()
    .filter((source) => !query || source.toLowerCase().includes(query))
    .slice(0, 10);

  referralSourceOptions.innerHTML = "";

  for (const source of sources) {
    const option = document.createElement("option");
    option.value = source;
    referralSourceOptions.append(option);
  }
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

function getSelectedClient() {
  return loadedClients.find((client) => client.id === selectedClientId) || null;
}

function clientMatchesSearch(client) {
  const statusFilter = clientStatusFilterSelect.value;
  const query = clientSearchInput.value.trim().toLowerCase();
  const group = clientSummaryGroups.find((item) => item.key === clientSummaryFilter);
  const status = client.status || "Scheduled";

  if (group && group.key !== "all" && !group.statuses.includes(status)) {
    return false;
  }

  if (statusFilter !== "all" && status !== statusFilter) {
    return false;
  }

  if (!query) {
    return true;
  }

  const searchable = [
    client.firstName,
    client.lastName,
    client.phone,
    client.email,
    client.parentName,
    client.preferredLanguage,
    client.preferredContactMethod,
    client.referralType,
    client.referralSource,
    client.status,
    client.notes
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function networkEntryName(entry) {
  return entry.name || "Unnamed network entry";
}

function normalizeNetworkType(type) {
  const typeMap = {
    "Internal Clinic Referral": "Internal Clinic",
    "External Clinic Referral": "External Clinic",
    "Community Org Referral": "Community Org"
  };

  return typeMap[type] || type || "";
}

function networkProviderName(provider) {
  return provider.name || "Unnamed provider";
}

function getSelectedNetworkEntry() {
  return loadedNetworkEntries.find((entry) => entry.id === selectedNetworkEntryId) || null;
}

function availableProviderLinks(record) {
  const linked = new Set((record.providerLinks || []).map((link) => `${link.networkId}:${link.providerId}`));
  return loadedNetworkEntries.flatMap((entry) =>
    (entry.providers || []).map((provider) => ({
      networkId: entry.id,
      providerId: provider.id,
      organizationName: networkEntryName(entry),
      providerName: networkProviderName(provider),
      label: `${networkProviderName(provider)} (${networkEntryName(entry)})`
    }))
  ).filter((link) => link.providerId && !linked.has(`${link.networkId}:${link.providerId}`));
}

function networkEntryMatchesSearch(entry) {
  const query = networkSearchInput.value.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const searchable = [
    entry.name,
    entry.type,
    entry.contactName,
    entry.phone,
    entry.email,
    entry.website,
    entry.notes,
    ...(entry.providers || []).flatMap((provider) => [provider.name, provider.phone, provider.email, provider.website, provider.notes])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function outreachEventName(event) {
  return event.name || "Unnamed outreach event";
}

function getSelectedOutreachEvent() {
  return loadedOutreachEvents.find((event) => event.id === selectedOutreachEventId) || null;
}

function outreachContactName(contact) {
  return contact.contactName || contact.childName || "Unnamed contact";
}

function getSelectedOutreachContact() {
  return loadedOutreachContacts.find((contact) => contact.id === selectedOutreachContactId) || null;
}

function outreachEventLabel(eventId) {
  const event = loadedOutreachEvents.find((item) => item.id === eventId);
  return event ? outreachEventName(event) : "";
}

function outreachEventMatchesSearch(event) {
  const query = outreachSearchInput.value.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const searchable = [
    event.name,
    event.type,
    event.eventDate,
    event.repeatPattern,
    event.location,
    event.contactName,
    event.contactRole,
    event.phone,
    event.email,
    event.notes
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function outreachContactMatchesSearch(contact) {
  const query = outreachContactSearchInput.value.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const searchable = [
    contact.contactName,
    contact.childName,
    contact.phone,
    contact.email,
    contact.preferredLanguage,
    contact.interestType,
    contact.status,
    outreachEventLabel(contact.eventId),
    contact.notes
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function numberValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function dateValue(value, emptyPlacement = 1) {
  if (!value) {
    return emptyPlacement * Number.MAX_SAFE_INTEGER;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? emptyPlacement * Number.MAX_SAFE_INTEGER : date.getTime();
}

function dateTimeValue(value, emptyPlacement = 1) {
  if (!value) {
    return emptyPlacement * Number.MAX_SAFE_INTEGER;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? emptyPlacement * Number.MAX_SAFE_INTEGER : date.getTime();
}

function compareNames(firstReferral, secondReferral) {
  return referralName(firstReferral).localeCompare(referralName(secondReferral));
}

function statusSortIndex(referral) {
  const key = statusGroupKey(referral.status);
  const order = ["new", "follow-up", "scheduled", "closed"];
  const index = order.indexOf(key);
  return index === -1 ? order.length : index;
}

function clientStatusGroupKey(status = "Scheduled") {
  return clientStatusGroupColors[status] || "scheduled";
}

function clientStatusSortIndex(client) {
  const status = client.status || "Scheduled";
  const order = [
    "Needs Reschedule",
    "Scheduled",
    "Active",
    "Needs Language Support",
    "Waiting on Family",
    "Graduated",
    "Inactive",
    "Closed"
  ];
  const index = order.indexOf(status);
  return index === -1 ? order.length : index;
}

function sortReferrals(referrals) {
  const sortMode = sortReferralsSelect.value;
  const sorted = [...referrals];

  if (sortMode === "recent-contact") {
    return sorted.sort((first, second) =>
      dateValue(first.mostRecentContactDate) - dateValue(second.mostRecentContactDate) || compareNames(first, second)
    );
  }

  if (sortMode === "newest-referral") {
    return sorted.sort((first, second) =>
      dateTimeValue(second.createdAt, -1) - dateTimeValue(first.createdAt, -1) || compareNames(first, second)
    );
  }

  if (sortMode === "name") {
    return sorted.sort(compareNames);
  }

  return sorted.sort((first, second) =>
    statusSortIndex(first) - statusSortIndex(second) ||
    dateValue(first.mostRecentContactDate) - dateValue(second.mostRecentContactDate) ||
    compareNames(first, second)
  );
}

function sortClients(clients) {
  const sortMode = sortClientsSelect.value;
  const sorted = [...clients];

  if (sortMode === "last-appointment") {
    return sorted.sort((first, second) =>
      dateValue(first.lastAppointmentDate) - dateValue(second.lastAppointmentDate) ||
      clientName(first).localeCompare(clientName(second))
    );
  }

  if (sortMode === "newest-client") {
    return sorted.sort((first, second) =>
      dateTimeValue(second.createdAt, -1) - dateTimeValue(first.createdAt, -1) ||
      clientName(first).localeCompare(clientName(second))
    );
  }

  if (sortMode === "name") {
    return sorted.sort((first, second) => clientName(first).localeCompare(clientName(second)));
  }

  return sorted.sort((first, second) =>
    clientStatusSortIndex(first) - clientStatusSortIndex(second) ||
    dateValue(first.lastAppointmentDate) - dateValue(second.lastAppointmentDate) ||
    clientName(first).localeCompare(clientName(second))
  );
}

function todayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderDailyWorkflow() {
  dailyWorkflowSummary.innerHTML = "";
  dailyPriorityList.innerHTML = "";
  dailyAppointmentsList.innerHTML = "";
  dailyOutreachList.innerHTML = "";
  dailyDataList.innerHTML = "";

  const today = todayDateString();
  const newReferrals = loadedReferrals.filter((referral) => normalizeStatus(referral.status) === "New");
  const referralFollowUps = loadedReferrals.filter((referral) =>
    ["Texted", "Left Voicemail", "Emailed", "Requested Call Back", "Caregiver Will Call Back"].includes(
      normalizeStatus(referral.status)
    )
  );
  const clientFollowUps = loadedClients.filter((client) =>
    ["Needs Reschedule", "Needs Language Support"].includes(client.status || "Scheduled")
  );
  const scheduledClients = loadedClients.filter((client) => (client.status || "Scheduled") === "Scheduled");
  const upcomingOutreachEvents = loadedOutreachEvents.filter((event) => !event.eventDate || event.eventDate >= today);
  const outreachContactsToFollowUp = loadedOutreachContacts.filter((contact) =>
    ["New", "Follow Up"].includes(contact.status || "New")
  );
  const recordsNeedingCleanup = [
    ...loadedReferrals
      .filter((referral) => !referral.caregiver || !referral.phone || !referral.preferredLanguage)
      .map((referral) => ({
        type: "Referral",
        title: referralName(referral),
        detail: [
          !referral.caregiver ? "caregiver" : "",
          !referral.phone ? "phone" : "",
          !referral.preferredLanguage ? "language" : ""
        ]
          .filter(Boolean)
          .join(", "),
        date: referral.createdAt || referral.referralDate || "",
        action: () => setSelectedReferral(referral.id)
      })),
    ...loadedClients
      .filter((client) => !client.caregiver || !client.phone || !client.preferredLanguage)
      .map((client) => ({
        type: "Client",
        title: clientName(client),
        detail: [
          !client.caregiver ? "caregiver" : "",
          !client.phone ? "phone" : "",
          !client.preferredLanguage ? "language" : ""
        ]
          .filter(Boolean)
          .join(", "),
        date: client.createdAt || client.referralDate || "",
        action: () => setSelectedClient(client.id)
      }))
  ];

  const priorityItems = [
    ...newReferrals.map((referral) => ({
      type: "Referral",
      title: referralName(referral),
      detail: referral.referralSource ? `New referral from ${referral.referralSource}` : "New referral",
      date: referral.referralDate || referral.createdAt || "",
      action: () => setSelectedReferral(referral.id)
    })),
    ...clientFollowUps.map((client) => ({
      type: "Client",
      title: clientName(client),
      detail: client.status,
      date: client.mostRecentContactDate || client.firstContactDate || client.referralDate || "",
      action: () => setSelectedClient(client.id)
    })),
    ...referralFollowUps.map((referral) => ({
      type: "Referral",
      title: referralName(referral),
      detail: normalizeStatus(referral.status),
      date: referral.mostRecentContactDate || referral.referralDate || "",
      action: () => setSelectedReferral(referral.id)
    }))
  ].sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  const appointmentItems = scheduledClients
    .map((client) => ({
      type: "Client",
      title: clientName(client),
      detail: client.firstAppointmentDate ? `First appt ${formatDateOnly(client.firstAppointmentDate)}` : "Scheduled",
      date: client.firstAppointmentDate || client.createdAt || "",
      action: () => setSelectedClient(client.id)
    }))
    .sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  const outreachItems = [
    ...outreachContactsToFollowUp.map((contact) => ({
      type: "Outreach",
      title: outreachContactName(contact),
      detail: outreachEventLabel(contact.eventId) || contact.interestType || displayValue(contact.status),
      date: contact.createdAt || "",
      action: () => {
        setActiveModule("outreach");
        setOutreachView("contacts");
        setSelectedOutreachContact(contact.id);
      }
    })),
    ...upcomingOutreachEvents.map((event) => ({
      type: "Event",
      title: outreachEventName(event),
      detail: event.type || "Outreach event",
      date: event.eventDate || "",
      action: () => {
        setActiveModule("outreach");
        setOutreachView("events");
        setSelectedOutreachEvent(event.id);
      }
    }))
  ].sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  const metrics = [
    { label: "Priority Items", value: priorityItems.length },
    { label: "Appointments", value: appointmentItems.length },
    { label: "Outreach Follow Up", value: outreachContactsToFollowUp.length },
    { label: "Upcoming Events", value: upcomingOutreachEvents.length },
    { label: "Data Cleanup", value: recordsNeedingCleanup.length }
  ];

  for (const metric of metrics) {
    const item = document.createElement("div");
    item.className = "summary-item dashboard-summary-item";
    const value = document.createElement("strong");
    value.textContent = metric.value;
    const label = document.createElement("span");
    label.textContent = metric.label;
    item.append(value, label);
    dailyWorkflowSummary.append(item);
  }

  renderDashboardList(dailyPriorityList, priorityItems, "No priority follow-ups waiting.");
  renderDashboardList(dailyAppointmentsList, appointmentItems, "No scheduled clients waiting.");
  renderDashboardList(dailyOutreachList, outreachItems, "No outreach follow-ups or upcoming events.");
  renderDashboardList(dailyDataList, recordsNeedingCleanup, "No missing required values found.");
}

function renderDashboard() {
  dashboardSummary.innerHTML = "";
  dashboardFollowups.innerHTML = "";
  dashboardNewReferrals.innerHTML = "";
  dashboardScheduled.innerHTML = "";
  dashboardNoNext.innerHTML = "";

  const newReferrals = loadedReferrals.filter((referral) => normalizeStatus(referral.status) === "New");
  const referralFollowUps = loadedReferrals.filter((referral) =>
    ["Texted", "Left Voicemail", "Emailed", "Requested Call Back", "Caregiver Will Call Back"].includes(
      normalizeStatus(referral.status)
    )
  );
  const scheduledClients = loadedClients.filter((client) => (client.status || "Scheduled") === "Scheduled");
  const activeClients = loadedClients.filter((client) =>
    ["Active", "Needs Reschedule"].includes(client.status || "Scheduled")
  );
  const clientFollowUps = loadedClients.filter((client) =>
    ["Needs Reschedule", "Needs Language Support"].includes(client.status || "Scheduled")
  );
  const clientsWithoutNextAppointment = loadedClients.filter((client) =>
    ["Active", "Needs Reschedule", "Waiting on Family", "Needs Language Support"].includes(client.status || "Scheduled") &&
    !hasFutureAppointment(client)
  );
  const convertedClients = loadedClients.filter((client) => client.sourceReferralId);
  const conversionDenominator = loadedReferrals.length + convertedClients.length;

  const metrics = [
    { label: "Total Referrals", value: loadedReferrals.length },
    { label: "Active Clients", value: activeClients.length },
    { label: "Follow Up", value: referralFollowUps.length + clientFollowUps.length },
    { label: "Scheduled", value: scheduledClients.length },
    { label: "Conversion Rate", value: percentage(convertedClients.length, conversionDenominator) }
  ];

  for (const metric of metrics) {
    const item = document.createElement("div");
    item.className = "summary-item dashboard-summary-item";
    const value = document.createElement("strong");
    value.textContent = metric.value;
    const label = document.createElement("span");
    label.textContent = metric.label;
    item.append(value, label);
    dashboardSummary.append(item);
  }

  const followupItems = [
    ...referralFollowUps.map((referral) => ({
      type: "Referral",
      title: referralName(referral),
      detail: normalizeStatus(referral.status),
      date: referral.mostRecentContactDate || referral.referralDate || "",
      action: () => setSelectedReferral(referral.id)
    })),
    ...clientFollowUps.map((client) => ({
      type: "Client",
      title: clientName(client),
      detail: client.status,
      date: client.mostRecentContactDate || client.lastAppointmentDate || "",
      action: () => setSelectedClient(client.id)
    }))
  ].sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  renderDashboardList(dashboardFollowups, followupItems, "No follow-ups waiting.");

  const newReferralItems = newReferrals
    .map((referral) => ({
      type: "Referral",
      title: referralName(referral),
      detail: referral.referralSource ? `Source: ${referral.referralSource}` : displayValue(referral.referralType),
      date: referral.referralDate || referral.createdAt || "",
      action: () => setSelectedReferral(referral.id)
    }))
    .sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  renderDashboardList(dashboardNewReferrals, newReferralItems, "No new referrals waiting.");

  const scheduledItems = scheduledClients
    .map((client) => ({
      type: "Client",
      title: clientName(client),
      detail: client.firstAppointmentDate ? `First appt ${formatDateOnly(client.firstAppointmentDate)}` : "Scheduled",
      date: client.firstAppointmentDate || client.createdAt || "",
      action: () => setSelectedClient(client.id)
    }))
    .sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  renderDashboardList(dashboardScheduled, scheduledItems, "No clients currently scheduled.");

  const noNextItems = clientsWithoutNextAppointment
    .map((client) => ({
      type: "Client",
      title: clientName(client),
      detail: client.status || "Active",
      date: client.mostRecentContactDate || client.firstContactDate || client.referralDate || client.createdAt || "",
      action: () => setSelectedClient(client.id)
    }))
    .sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  renderDashboardList(dashboardNoNext, noNextItems, "No active clients missing an appointment.");
}

function renderDashboardList(container, items, emptyText) {
  container.innerHTML = "";
  const heading = container.closest(".dashboard-card")?.querySelector("h3");

  if (heading) {
    heading.querySelector(".dashboard-section-count")?.remove();
    const count = document.createElement("span");
    count.className = "dashboard-section-count";
    count.textContent = String(items.length);
    heading.append(count);
  }

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }

  for (const item of items) {
    const button = document.createElement("button");
    button.className = "dashboard-list-item";
    button.type = "button";
    button.addEventListener("click", item.action);

    const content = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = item.title;
    const detail = document.createElement("span");
    detail.textContent = item.detail;
    content.append(title, detail);

    const meta = document.createElement("span");
    meta.className = "dashboard-item-meta-wrap";
    const shortDate = formatShortDate(item.date);
    if (shortDate) {
      const date = document.createElement("span");
      date.className = "dashboard-item-date";
      date.textContent = shortDate;
      meta.append(date);
    }
    const type = document.createElement("span");
    type.className = `dashboard-item-type dashboard-item-type-${item.type.toLowerCase()}`;
    type.textContent = item.type;
    meta.append(type);

    button.append(content, meta);
    container.append(button);
  }
}

function setSelectedReferral(referralId) {
  selectedReferralId = referralId;
  referralForm.reset();
  editingReferralId = null;
  referralForm.hidden = true;
  referralDetail.hidden = false;
  syncModalCloseButton();
  openReferralModal();
  renderReferrals();
  renderReferralDetail();
}

function syncModalCloseButton() {
  closeReferralModalButton.hidden = !referralForm.hidden;
}

function openReferralModal() {
  referralModal.hidden = false;
  document.body.classList.add("modal-open");
  syncModalCloseButton();
}

function closeReferralModal() {
  referralModal.hidden = true;
  document.body.classList.remove("modal-open");
  editingReferralId = null;
  referralForm.reset();
  referralForm.hidden = true;
  referralDetail.hidden = false;
  syncModalCloseButton();
  selectedReferralId = null;
  renderReferrals();
  setReferralsLoadedStatus();
}

function setCrmView(viewName) {
  activeCrmView = viewName;
  if (activeModule !== "crm") {
    activeModule = "crm";
  }

  const showDashboard = viewName === "dashboard";
  const showReferrals = viewName === "referrals";
  const showClients = viewName === "clients";
  const showReferralNetwork = viewName === "referral-network";

  dailyWorkflowPanel.hidden = true;
  crmModuleTabs.hidden = false;
  dashboardPanel.hidden = !showDashboard;
  referralsPanel.hidden = !showReferrals;
  clientsPanel.hidden = !showClients;
  referralNetworkPanel.hidden = !showReferralNetwork;
  outreachPanel.hidden = true;

  crmTabDashboardButton.classList.toggle("active", showDashboard);
  crmTabReferralsButton.classList.toggle("active", showReferrals);
  crmTabClientsButton.classList.toggle("active", showClients);
  crmTabReferralNetworkButton.classList.toggle("active", showReferralNetwork);
  crmTabDashboardButton.setAttribute("aria-selected", String(showDashboard));
  crmTabReferralsButton.setAttribute("aria-selected", String(showReferrals));
  crmTabClientsButton.setAttribute("aria-selected", String(showClients));
  crmTabReferralNetworkButton.setAttribute("aria-selected", String(showReferralNetwork));

  closeOutreachModal();
  closeOutreachContactModal();

  if (showDashboard) {
    closeReferralModal();
    closeClientModal();
    closeNetworkModal();
    renderDashboard();
  } else if (showReferrals) {
    closeClientModal();
    closeNetworkModal();
    renderReferrals();
  } else if (showClients) {
    closeReferralModal();
    closeNetworkModal();
    renderClients();
  } else if (showReferralNetwork) {
    closeReferralModal();
    closeClientModal();
    renderReferralNetwork();
  }
}

function setActiveModule(moduleName) {
  activeModule = moduleName;
  const showDailyWorkflow = moduleName === "daily-workflow";
  const showCrm = moduleName === "crm";
  const showOutreach = moduleName === "outreach";

  navDailyWorkflowButton.classList.toggle("active", showDailyWorkflow);
  navCrmButton.classList.toggle("active", showCrm);
  navOutreachButton.classList.toggle("active", showOutreach);
  navDailyWorkflowButton.setAttribute("aria-current", showDailyWorkflow ? "page" : "false");
  navCrmButton.setAttribute("aria-current", showCrm ? "page" : "false");
  navOutreachButton.setAttribute("aria-current", showOutreach ? "page" : "false");

  if (showDailyWorkflow) {
    closeReferralModal();
    closeClientModal();
    closeNetworkModal();
    closeOutreachModal();
    closeOutreachContactModal();
    crmModuleTabs.hidden = true;
    dailyWorkflowPanel.hidden = false;
    dashboardPanel.hidden = true;
    referralsPanel.hidden = true;
    clientsPanel.hidden = true;
    referralNetworkPanel.hidden = true;
    outreachPanel.hidden = true;
    renderDailyWorkflow();
  } else if (showCrm) {
    setCrmView(activeCrmView);
  } else if (showOutreach) {
    closeReferralModal();
    closeClientModal();
    closeNetworkModal();
    crmModuleTabs.hidden = true;
    dailyWorkflowPanel.hidden = true;
    dashboardPanel.hidden = true;
    referralsPanel.hidden = true;
    clientsPanel.hidden = true;
    referralNetworkPanel.hidden = true;
    outreachPanel.hidden = false;
    setOutreachView(activeOutreachView);
  } else {
    setActiveModule("daily-workflow");
  }
}

function openClientModal() {
  clientModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeClientModal() {
  clientModal.hidden = true;
  document.body.classList.remove("modal-open");
  selectedClientId = null;
  editingClientId = null;
  clientForm.reset();
  clientForm.hidden = true;
  clientDetail.hidden = false;
  renderClients();
  setClientsLoadedStatus();
}

function setSelectedClient(clientId) {
  selectedClientId = clientId;
  editingClientId = null;
  clientForm.reset();
  clientForm.hidden = true;
  clientDetail.hidden = false;
  openClientModal();
  renderClients();
  renderClientDetail();
}

function openNetworkModal() {
  networkModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeNetworkModal() {
  networkModal.hidden = true;
  document.body.classList.remove("modal-open");
  selectedNetworkEntryId = null;
  editingNetworkEntryId = null;
  networkForm.reset();
  networkForm.hidden = true;
  networkDetail.hidden = false;
  renderReferralNetwork();
}

function setSelectedNetworkEntry(entryId) {
  selectedNetworkEntryId = entryId;
  editingNetworkEntryId = null;
  networkForm.reset();
  networkForm.hidden = true;
  networkDetail.hidden = false;
  openNetworkModal();
  renderReferralNetwork();
  renderNetworkDetail();
}

function openOutreachModal() {
  outreachModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeOutreachModal() {
  outreachModal.hidden = true;
  document.body.classList.remove("modal-open");
  selectedOutreachEventId = null;
  editingOutreachEventId = null;
  outreachForm.reset();
  outreachForm.hidden = true;
  outreachDetail.hidden = false;
  renderOutreachEvents();
}

function setSelectedOutreachEvent(eventId) {
  selectedOutreachEventId = eventId;
  editingOutreachEventId = null;
  outreachForm.reset();
  outreachForm.hidden = true;
  outreachDetail.hidden = false;
  openOutreachModal();
  renderOutreachEvents();
  renderOutreachDetail();
}

function openOutreachContactModal() {
  outreachContactModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeOutreachContactModal() {
  outreachContactModal.hidden = true;
  document.body.classList.remove("modal-open");
  selectedOutreachContactId = null;
  editingOutreachContactId = null;
  outreachContactForm.reset();
  outreachContactForm.hidden = true;
  outreachContactDetail.hidden = false;
  renderOutreachContacts();
  renderOutreachDashboard();
}

function setSelectedOutreachContact(contactId) {
  selectedOutreachContactId = contactId;
  editingOutreachContactId = null;
  outreachContactForm.reset();
  outreachContactForm.hidden = true;
  outreachContactDetail.hidden = false;
  openOutreachContactModal();
  renderOutreachContacts();
  renderOutreachContactDetail();
}

function setOutreachView(viewName) {
  activeOutreachView = viewName;
  const showDashboard = viewName === "dashboard";
  const showEvents = viewName === "events";
  const showContacts = viewName === "contacts";

  outreachDashboardView.hidden = !showDashboard;
  outreachEventsView.hidden = !showEvents;
  outreachContactsView.hidden = !showContacts;
  outreachTabDashboardButton.classList.toggle("active", showDashboard);
  outreachTabEventsButton.classList.toggle("active", showEvents);
  outreachTabContactsButton.classList.toggle("active", showContacts);
  outreachTabDashboardButton.setAttribute("aria-selected", String(showDashboard));
  outreachTabEventsButton.setAttribute("aria-selected", String(showEvents));
  outreachTabContactsButton.setAttribute("aria-selected", String(showContacts));
  newOutreachEventButton.hidden = !showEvents;
  newOutreachContactButton.hidden = !showContacts;

  renderOutreachEvents();
  renderOutreachContacts();
  renderOutreachDashboard();
}

function statusBadge(status = "New") {
  const normalized = normalizeStatus(status);
  const badge = document.createElement("span");
  badge.className = `status-badge status-${cssToken(normalized)} status-group-${statusGroupKey(normalized)}`;
  badge.textContent = normalized;
  return badge;
}

function clientStatusBadge(status = "Scheduled") {
  const badge = document.createElement("span");
  badge.className = `status-badge status-${cssToken(status)} status-group-${clientStatusGroupKey(status)}`;
  badge.textContent = status;
  return badge;
}

function applyStatusSelectColor(select, status) {
  for (const key of ["new", "contacted", "follow-up", "scheduled", "closed"]) {
    select.classList.remove(`status-group-${key}`);
  }
  select.classList.add("status-select", `status-group-${statusGroupKey(status)}`);
}

function applyClientStatusSelectColor(select, status) {
  for (const key of ["new", "contacted", "follow-up", "scheduled", "closed"]) {
    select.classList.remove(`status-group-${key}`);
  }
  select.classList.add("status-select", `status-group-${clientStatusGroupKey(status)}`);
}

function renderReferrals() {
  referralsList.innerHTML = "";
  renderTableHead("referrals");
  const referrals = sortReferrals(loadedReferrals.filter(referralMatchesFilters));
  const columns = visibleColumns("referrals");
  const gridTemplate = gridTemplateFor("referrals");
  const rowMinWidth = minTableWidth("referrals");

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
    row.style.gridTemplateColumns = gridTemplate;
    row.style.minWidth = rowMinWidth;

    if (referral.id === selectedReferralId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    row.append(...columns.map((column) => renderCell(column, referral)));
    row.addEventListener("click", () => setSelectedReferral(referral.id));
    referralsList.append(row);
  }
}

function renderClients() {
  clientsList.innerHTML = "";
  renderTableHead("clients");
  const clients = sortClients(loadedClients.filter(clientMatchesSearch));
  const columns = visibleColumns("clients");
  const gridTemplate = gridTemplateFor("clients");
  const rowMinWidth = minTableWidth("clients");

  if (selectedClientId && !clients.some((client) => client.id === selectedClientId)) {
    selectedClientId = null;
  }

  if (!clients.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedClients.length ? "No clients match the current search." : "No clients yet.";
    clientsList.append(empty);
    return;
  }

  for (const client of clients) {
    const row = document.createElement("button");
    row.className = "referral-row";
    row.type = "button";
    row.setAttribute("role", "row");
    row.setAttribute("aria-label", `Open ${clientName(client)}`);
    row.style.gridTemplateColumns = gridTemplate;
    row.style.minWidth = rowMinWidth;

    if (client.id === selectedClientId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    row.append(...columns.map((column) => renderCell(column, client)));
    row.addEventListener("click", () => setSelectedClient(client.id));
    clientsList.append(row);
  }
}

function renderReferralNetwork() {
  networkList.innerHTML = "";
  const entries = loadedNetworkEntries
    .filter(networkEntryMatchesSearch)
    .sort(
      (first, second) =>
        displayValue(normalizeNetworkType(first.type)).localeCompare(displayValue(normalizeNetworkType(second.type))) ||
        networkEntryName(first).localeCompare(networkEntryName(second))
    );

  if (selectedNetworkEntryId && !entries.some((entry) => entry.id === selectedNetworkEntryId)) {
    selectedNetworkEntryId = null;
  }

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedNetworkEntries.length ? "No network entries match the current search." : "No referral network entries yet.";
    networkList.append(empty);
    return;
  }

  let currentType = "";

  for (const entry of entries) {
    const entryType = normalizeNetworkType(entry.type) || "Not set";
    if (entryType !== currentType) {
      currentType = entryType;
      const section = document.createElement("div");
      section.className = "network-section-heading";
      section.textContent = entryType;
      networkList.append(section);
    }

    const row = document.createElement("button");
    row.className = "referral-row network-row";
    row.type = "button";
    row.setAttribute("role", "row");
    row.setAttribute("aria-label", `Open ${networkEntryName(entry)}`);
    row.style.gridTemplateColumns = "minmax(190px, 1.25fr) minmax(160px, 1fr) minmax(140px, 0.9fr)";

    if (entry.id === selectedNetworkEntryId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    const providers = entry.providers || [];
    const isExpanded = expandedNetworkEntryIds.has(entry.id);
    const nameCell = document.createElement("span");
    nameCell.className = "table-cell network-name-cell";
    nameCell.setAttribute("role", "cell");

    const expandButton = document.createElement("span");
    expandButton.className = "network-expand-button";
    expandButton.setAttribute("role", "button");
    expandButton.setAttribute("tabindex", "0");
    expandButton.setAttribute("aria-expanded", String(isExpanded));
    expandButton.setAttribute("aria-label", `${isExpanded ? "Collapse" : "Expand"} ${networkEntryName(entry)} providers`);
    expandButton.textContent = isExpanded ? "-" : "+";
    expandButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (isExpanded) {
        expandedNetworkEntryIds.delete(entry.id);
      } else {
        expandedNetworkEntryIds.add(entry.id);
      }
      renderReferralNetwork();
    });
    expandButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        expandButton.click();
      }
    });

    const nameText = document.createElement("span");
    nameText.className = "network-name-text";
    nameText.textContent = networkEntryName(entry);
    nameCell.append(expandButton, nameText);

    for (const value of [
      `${providers.length} provider${providers.length === 1 ? "" : "s"}`,
      formatPhone(entry.phone)
    ]) {
      const cell = document.createElement("span");
      cell.className = "table-cell";
      cell.setAttribute("role", "cell");
      cell.textContent = value;
      row.append(cell);
    }

    row.prepend(nameCell);
    row.addEventListener("click", () => setSelectedNetworkEntry(entry.id));
    networkList.append(row);

    if (isExpanded) {
      if (!providers.length) {
        const emptyProviderRow = document.createElement("div");
        emptyProviderRow.className = "network-provider-inline-row";
        emptyProviderRow.textContent = "No providers added yet.";
        networkList.append(emptyProviderRow);
      }

      for (const provider of providers) {
        const providerRow = document.createElement("button");
        providerRow.className = "network-provider-inline-row";
        providerRow.type = "button";
        providerRow.setAttribute("role", "row");
        providerRow.setAttribute("aria-label", `Open ${networkEntryName(entry)} provider list`);
        providerRow.addEventListener("click", () => setSelectedNetworkEntry(entry.id));

        for (const value of [
          networkProviderName(provider),
          "Provider",
          formatPhone(provider.phone)
        ]) {
          const cell = document.createElement("span");
          cell.className = "table-cell";
          cell.setAttribute("role", "cell");
          cell.textContent = value;
          providerRow.append(cell);
        }

        networkList.append(providerRow);
      }
    }
  }
}

function renderOutreachSummary() {
  outreachSummary.innerHTML = "";

  const totals = [
    { label: "Events", value: loadedOutreachEvents.length },
    { label: "Contacts", value: loadedOutreachContacts.length },
    { label: "Interactions", value: loadedOutreachEvents.reduce((sum, event) => sum + numberValue(event.interactionsCount), 0) },
    { label: "Referrals", value: loadedOutreachEvents.reduce((sum, event) => sum + numberValue(event.referralsCount), 0) },
    { label: "Participants", value: loadedOutreachEvents.reduce((sum, event) => sum + numberValue(event.participantListCount), 0) }
  ];

  for (const total of totals) {
    const item = document.createElement("div");
    item.className = "summary-item";
    const value = document.createElement("strong");
    value.textContent = total.value;
    const label = document.createElement("span");
    label.textContent = total.label;
    item.append(value, label);
    outreachSummary.append(item);
  }
}

function renderOutreachDashboard() {
  renderOutreachSummary();

  const today = todayDateString();
  const upcomingItems = loadedOutreachEvents
    .filter((event) => !event.eventDate || event.eventDate >= today)
    .map((event) => ({
      type: "Event",
      title: outreachEventName(event),
      detail: [event.type, event.location].filter(Boolean).join(" | ") || "Outreach",
      date: event.eventDate || event.createdAt || "",
      action: () => setSelectedOutreachEvent(event.id)
    }))
    .sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  const followupItems = loadedOutreachContacts
    .filter((contact) => ["New", "Follow Up", "Interested"].includes(contact.status || "New"))
    .map((contact) => ({
      type: "Contact",
      title: outreachContactName(contact),
      detail: outreachEventLabel(contact.eventId) || contact.interestType || displayValue(contact.status),
      date: contact.createdAt || "",
      action: () => setSelectedOutreachContact(contact.id)
    }))
    .sort((first, second) => dateTimeValue(first.date) - dateTimeValue(second.date) || first.title.localeCompare(second.title));

  renderDashboardList(outreachUpcomingList, upcomingItems, "No upcoming outreach events.");
  renderDashboardList(outreachContactFollowupList, followupItems, "No outreach contacts waiting.");
}

function renderOutreachEvents() {
  outreachList.innerHTML = "";
  renderOutreachSummary();

  const events = loadedOutreachEvents
    .filter(outreachEventMatchesSearch)
    .sort((first, second) => dateValue(second.eventDate, -1) - dateValue(first.eventDate, -1) || outreachEventName(first).localeCompare(outreachEventName(second)));

  if (selectedOutreachEventId && !events.some((event) => event.id === selectedOutreachEventId)) {
    selectedOutreachEventId = null;
  }

  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedOutreachEvents.length ? "No outreach events match the current search." : "No outreach events tracked yet.";
    outreachList.append(empty);
    return;
  }

  for (const event of events) {
    const row = document.createElement("button");
    row.className = "referral-row outreach-row";
    row.type = "button";
    row.setAttribute("role", "row");
    row.setAttribute("aria-label", `Open ${outreachEventName(event)}`);
    row.style.gridTemplateColumns = "minmax(220px, 1.4fr) minmax(120px, 0.8fr) minmax(170px, 1fr) minmax(90px, 0.6fr)";

    if (event.id === selectedOutreachEventId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    for (const value of [
      outreachEventName(event),
      formatListDate(event.eventDate),
      event.contactName || "-",
      String(numberValue(event.referralsCount))
    ]) {
      const cell = document.createElement("span");
      cell.className = "table-cell";
      cell.setAttribute("role", "cell");
      cell.textContent = value;
      row.append(cell);
    }

    row.addEventListener("click", () => setSelectedOutreachEvent(event.id));
    outreachList.append(row);
  }
}

function renderOutreachContacts() {
  outreachContactList.innerHTML = "";
  const contacts = loadedOutreachContacts
    .filter(outreachContactMatchesSearch)
    .sort((first, second) => dateTimeValue(second.createdAt, -1) - dateTimeValue(first.createdAt, -1) || outreachContactName(first).localeCompare(outreachContactName(second)));

  if (selectedOutreachContactId && !contacts.some((contact) => contact.id === selectedOutreachContactId)) {
    selectedOutreachContactId = null;
  }

  if (!contacts.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedOutreachContacts.length ? "No outreach contacts match the current search." : "No outreach interest contacts yet.";
    outreachContactList.append(empty);
    return;
  }

  for (const contact of contacts) {
    const row = document.createElement("button");
    row.className = "referral-row outreach-contact-row";
    row.type = "button";
    row.setAttribute("role", "row");
    row.setAttribute("aria-label", `Open ${outreachContactName(contact)}`);
    row.style.gridTemplateColumns = "minmax(200px, 1.25fr) minmax(180px, 1fr) minmax(130px, 0.75fr) minmax(140px, 0.8fr)";

    if (contact.id === selectedOutreachContactId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    for (const value of [
      outreachContactName(contact),
      outreachEventLabel(contact.eventId) || "-",
      contact.status || "New",
      formatPhone(contact.phone)
    ]) {
      const cell = document.createElement("span");
      cell.className = "table-cell";
      cell.setAttribute("role", "cell");
      cell.textContent = value;
      row.append(cell);
    }

    row.addEventListener("click", () => setSelectedOutreachContact(contact.id));
    outreachContactList.append(row);
  }
}

function renderClientSummary() {
  clientSummary.innerHTML = "";

  for (const group of clientSummaryGroups) {
    const count = loadedClients.filter((client) => group.statuses.includes(client.status || "Scheduled")).length;
    const item = document.createElement("button");
    item.className = "summary-item";
    item.type = "button";

    if (clientSummaryFilter === group.key) {
      item.classList.add("active");
    }

    const countEl = document.createElement("strong");
    countEl.textContent = count;

    const labelEl = document.createElement("span");
    labelEl.textContent = group.label;

    item.append(countEl, labelEl);
    item.addEventListener("click", () => {
      clientSummaryFilter = group.key === "all" || clientSummaryFilter === group.key ? "all" : group.key;
      clientStatusFilterSelect.value = "all";
      renderClientSummary();
      renderClients();
    });
    clientSummary.append(item);
  }
}

function clearClientFilters() {
  clientSearchInput.value = "";
  clientStatusFilterSelect.value = "all";
  clientSummaryFilter = "all";
  selectedClientId = null;
  renderClientSummary();
  renderClients();
}

function renderReferralSummary() {
  referralSummary.innerHTML = "";

  for (const group of summaryGroups) {
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
      summaryFilter = group.key === "all" || summaryFilter === group.key ? "all" : group.key;
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
      emptyDetail("Create the first referral to start building the workspace.", "New Referral", startNewReferral)
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

  actions.append(editButton, deleteButton, closeReferralModalButton);
  syncModalCloseButton();
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
    option.className = `status-group-${statusGroupKey(status)}`;
    statusSelect.append(option);
  }

  statusSelect.value = normalizeStatus(referral.status);
  applyStatusSelectColor(statusSelect, statusSelect.value);
  statusSelect.addEventListener("change", () => {
    applyStatusSelectColor(statusSelect, statusSelect.value);
    updateReferralStatus(referral, statusSelect.value);
  });
  statusLabel.append(statusSelect);

  const infoGrid = document.createElement("div");
  infoGrid.className = "detail-grid";
  const leftColumn = document.createElement("dl");
  leftColumn.className = "detail-column";
  const rightColumn = document.createElement("dl");
  rightColumn.className = "detail-column";

  addDetailField(leftColumn, "Client Name", referralName(referral));
  addInlineDateField(leftColumn, "Date of Birth", referral.dateOfBirth, referral, "referrals", "dateOfBirth");
  addDetailField(leftColumn, "Gender", displayValue(referral.gender));
  addDetailField(leftColumn, "Caregiver", displayValue(referral.parentName));
  addDetailField(leftColumn, "Email", displayValue(referral.email));
  addDetailField(leftColumn, "Mobile", displayValue(formatPhone(referral.phone)));
  addDetailField(leftColumn, "Preferred Language", displayValue(referral.preferredLanguage));
  addDetailField(leftColumn, "Referral Type", displayValue(referral.referralType));
  addDetailField(leftColumn, "Referral Source", displayValue(referral.referralSource));
  addDetailField(leftColumn, "YCCO", referral.ycco === "Yes" ? "✓" : "-");

  addDetailField(rightColumn, "Assessment Score", displayValue(referral.assessmentScore));
  addDetailField(rightColumn, "Willingness Score", displayValue(referral.willingnessScore));
  addDetailField(rightColumn, "Preferred Contact", displayValue(referral.preferredContactMethod));
  addDetailField(rightColumn, "Email Opt Out", displayBoolean(referral.emailOptOut));
  addDetailField(rightColumn, "Text Opt Out", displayBoolean(referral.textOptOut));
  addDetailField(rightColumn, "Address", formatAddress(referral));

  if (referral.convertedClientId) {
    addDetailField(rightColumn, "Conversion", "✓");
  }

  infoGrid.append(leftColumn, rightColumn);

  const trackingGrid = document.createElement("div");
  trackingGrid.className = "detail-grid detail-tracking-grid";
  const trackingLeftColumn = document.createElement("dl");
  trackingLeftColumn.className = "detail-column";
  const trackingRightColumn = document.createElement("dl");
  trackingRightColumn.className = "detail-column";

  addInlineDateField(trackingLeftColumn, "Referral Date", referral.referralDate, referral, "referrals", "referralDate");
  addDetailField(trackingLeftColumn, "Created Date", formatDateOnly((referral.createdAt || "").slice(0, 10)));
  addInlineDateField(trackingLeftColumn, "First Contact Date", referral.firstContactDate, referral, "referrals", "firstContactDate");
  addInlineDateField(trackingLeftColumn, "Most Recent Contact Date", referral.mostRecentContactDate, referral, "referrals", "mostRecentContactDate");
  addDetailField(trackingRightColumn, "Referral Type", displayValue(referral.referralType));
  addInlineDateField(trackingRightColumn, "First Appointment Date", referral.firstAppointmentDate, referral, "referrals", "firstAppointmentDate");
  addInlineDateField(trackingRightColumn, "Graduation Date", referral.lastAppointmentDate, referral, "referrals", "lastAppointmentDate");
  addDetailField(trackingRightColumn, "Most Recent Appointment", displayValue(referral.mostRecentAppointmentDate));
  trackingGrid.append(trackingLeftColumn, trackingRightColumn);

  const notes = document.createElement("section");
  notes.className = "notes-panel";
  const notesTitle = document.createElement("h4");
  notesTitle.textContent = "Notes";
  const notesText = document.createElement("p");
  notesText.textContent = referral.notes || "-";
  notes.append(notesTitle, notesText);

  const trackingTitle = document.createElement("h4");
  trackingTitle.className = "section-title";
  trackingTitle.textContent = "Data Tracking";

  referralDetail.append(
    heading,
    statusLabel,
    infoGrid,
    trackingTitle,
    trackingGrid,
    renderSiblingsSection(referral, "referrals"),
    renderLinkedProvidersSection(referral, "referrals"),
    notes
  );

  if (normalizeStatus(referral.status) === "Scheduled" && !referral.convertedClientId) {
    const convertButton = document.createElement("button");
    convertButton.type = "button";
    convertButton.textContent = "Convert to Client";
    convertButton.addEventListener("click", () => convertReferralToClient(referral));
    referralDetail.append(convertButton);
  }
}

function renderClientDetail() {
  if (!clientForm.hidden) {
    clientDetail.hidden = true;
    return;
  }

  clientDetail.hidden = false;
  clientDetail.innerHTML = "";
  const client = getSelectedClient();

  if (!loadedClients.length) {
    clientDetail.append(emptyDetail("Create the first client or convert a scheduled referral.", "New Client", startNewClient));
    return;
  }

  if (!client) {
    clientDetail.append(emptyDetail("No client matches the current list view.", "Clear filters", clearClientFilters));
    return;
  }

  const heading = document.createElement("div");
  heading.className = "detail-heading";

  const titleWrap = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Client profile";
  const title = document.createElement("h3");
  title.textContent = clientName(client);
  titleWrap.append(eyebrow, title);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  const editButton = document.createElement("button");
  editButton.className = "secondary-button";
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => startEditingClient(client));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteClient(client));

  const closeButton = document.createElement("button");
  closeButton.className = "secondary-button";
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", closeClientModal);
  actions.append(editButton, deleteButton, closeButton);
  heading.append(titleWrap, actions);

  const statusLabel = document.createElement("label");
  statusLabel.className = "status-field";
  statusLabel.textContent = "Status";

  const statusSelect = document.createElement("select");
  statusSelect.dataset.clientId = client.id;

  for (const status of clientStatuses) {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    option.className = `status-group-${clientStatusGroupKey(status)}`;
    statusSelect.append(option);
  }

  statusSelect.value = client.status || "Scheduled";
  applyClientStatusSelectColor(statusSelect, statusSelect.value);
  statusSelect.addEventListener("change", () => {
    applyClientStatusSelectColor(statusSelect, statusSelect.value);
    updateClientStatus(client, statusSelect.value);
  });
  statusLabel.append(statusSelect);

  const infoGrid = document.createElement("div");
  infoGrid.className = "detail-grid";
  const leftColumn = document.createElement("dl");
  leftColumn.className = "detail-column";
  const rightColumn = document.createElement("dl");
  rightColumn.className = "detail-column";

  addDetailField(leftColumn, "Client Name", clientName(client));
  addInlineDateField(leftColumn, "Date of Birth", client.dateOfBirth, client, "clients", "dateOfBirth");
  addDetailField(leftColumn, "Gender", displayValue(client.gender));
  addDetailField(leftColumn, "Caregiver", displayValue(client.parentName));
  addDetailField(leftColumn, "Email", displayValue(client.email));
  addDetailField(leftColumn, "Mobile", displayValue(formatPhone(client.phone)));
  addDetailField(leftColumn, "Preferred Language", displayValue(client.preferredLanguage));
  addDetailField(leftColumn, "Referral Type", displayValue(client.referralType));
  addDetailField(leftColumn, "Referral Source", displayValue(client.referralSource));
  addDetailField(leftColumn, "YCCO", client.ycco === "Yes" ? "✓" : "-");

  addDetailField(rightColumn, "Assessment Score", displayValue(client.assessmentScore));
  addDetailField(rightColumn, "Willingness Score", displayValue(client.willingnessScore));
  addDetailField(rightColumn, "Preferred Contact", displayValue(client.preferredContactMethod));
  addDetailField(rightColumn, "Email Opt Out", displayBoolean(client.emailOptOut));
  addDetailField(rightColumn, "Text Opt Out", displayBoolean(client.textOptOut));
  addDetailField(rightColumn, "Address", formatAddress(client));

  infoGrid.append(leftColumn, rightColumn);

  const trackingTitle = document.createElement("h4");
  trackingTitle.className = "section-title";
  trackingTitle.textContent = "Data Tracking";

  const trackingGrid = document.createElement("div");
  trackingGrid.className = "detail-grid detail-tracking-grid";
  const trackingLeftColumn = document.createElement("dl");
  trackingLeftColumn.className = "detail-column";
  const trackingRightColumn = document.createElement("dl");
  trackingRightColumn.className = "detail-column";

  addInlineDateField(trackingLeftColumn, "Referral Date", client.referralDate, client, "clients", "referralDate");
  addDetailField(trackingLeftColumn, "Created Date", formatDateOnly((client.createdAt || "").slice(0, 10)));
  addInlineDateField(trackingLeftColumn, "First Contact Date", client.firstContactDate, client, "clients", "firstContactDate");
  addInlineDateField(trackingLeftColumn, "Most Recent Contact Date", client.mostRecentContactDate, client, "clients", "mostRecentContactDate");
  const convertedDate = client.convertedAt || (client.sourceReferralId ? client.createdAt : "");
  addDetailField(trackingRightColumn, "Converted Date", formatDateOnly(convertedDate.slice(0, 10)));
  addDetailField(trackingRightColumn, "Referral Type", displayValue(client.referralType));
  addInlineDateField(trackingRightColumn, "First Appointment Date", client.firstAppointmentDate, client, "clients", "firstAppointmentDate");
  addInlineDateField(trackingRightColumn, "Graduation Date", client.lastAppointmentDate, client, "clients", "lastAppointmentDate");
  addDetailField(trackingRightColumn, "Most Recent Appointment", displayValue(client.mostRecentAppointmentDate));
  trackingGrid.append(trackingLeftColumn, trackingRightColumn);

  const notes = document.createElement("section");
  notes.className = "notes-panel";
  const notesTitle = document.createElement("h4");
  notesTitle.textContent = "Notes";
  const notesText = document.createElement("p");
  notesText.textContent = client.notes || "-";
  notes.append(notesTitle, notesText);

  clientDetail.append(
    heading,
    statusLabel,
    infoGrid,
    trackingTitle,
    trackingGrid,
    renderSiblingsSection(client, "clients"),
    renderLinkedProvidersSection(client, "clients"),
    notes
  );
}

function renderNetworkDetail() {
  if (!networkForm.hidden) {
    networkDetail.hidden = true;
    return;
  }

  networkDetail.hidden = false;
  networkDetail.innerHTML = "";
  const entry = getSelectedNetworkEntry();

  if (!loadedNetworkEntries.length) {
    networkDetail.append(emptyDetail("Create the first referral network entry.", "New Network Entry", startNewNetworkEntry));
    return;
  }

  if (!entry) {
    networkDetail.append(emptyDetail("No network entry matches the current list view.", null, null));
    return;
  }

  const heading = document.createElement("div");
  heading.className = "detail-heading";

  const titleWrap = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Referral Network";
  const title = document.createElement("h3");
  title.textContent = networkEntryName(entry);
  titleWrap.append(eyebrow, title);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  const editButton = document.createElement("button");
  editButton.className = "secondary-button";
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => startEditingNetworkEntry(entry));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteNetworkEntry(entry));

  const closeButton = document.createElement("button");
  closeButton.className = "secondary-button";
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", closeNetworkModal);
  actions.append(editButton, deleteButton, closeButton);
  heading.append(titleWrap, actions);

  const infoGrid = document.createElement("div");
  infoGrid.className = "detail-grid";
  const leftColumn = document.createElement("dl");
  leftColumn.className = "detail-column";
  const rightColumn = document.createElement("dl");
  rightColumn.className = "detail-column";

  addDetailField(leftColumn, "Organization", networkEntryName(entry));
  addDetailField(leftColumn, "Referral Type", displayValue(normalizeNetworkType(entry.type)));
  addDetailField(leftColumn, "Main Contact", displayValue(entry.contactName));
  addDetailField(leftColumn, "Phone", displayValue(formatPhone(entry.phone)));
  addDetailField(rightColumn, "Email", displayValue(entry.email));
  addDetailField(rightColumn, "Website", displayValue(entry.website));
  addDetailField(rightColumn, "Created Date", formatDateOnly((entry.createdAt || "").slice(0, 10)));
  infoGrid.append(leftColumn, rightColumn);

  const providersSection = renderNetworkProvidersSection(entry);

  const notes = document.createElement("section");
  notes.className = "notes-panel";
  const notesTitle = document.createElement("h4");
  notesTitle.textContent = "Notes";
  const notesText = document.createElement("p");
  notesText.textContent = entry.notes || "-";
  notes.append(notesTitle, notesText);

  networkDetail.append(heading, infoGrid, providersSection, notes);
}

function renderNetworkProvidersSection(entry) {
  const section = document.createElement("section");
  section.className = "network-providers-panel";
  const title = document.createElement("h4");
  title.textContent = "Providers";
  section.append(title);

  const providers = Array.isArray(entry.providers) ? entry.providers : [];

  if (!providers.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No providers added yet.";
    section.append(empty);
  } else {
    const list = document.createElement("div");
    list.className = "network-provider-list";

    for (const provider of providers) {
      const item = document.createElement("div");
      item.className = "network-provider-item";
      const details = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = networkProviderName(provider);
      const contact = document.createElement("span");
      contact.textContent = [formatPhone(provider.phone), provider.email].filter(Boolean).join(" | ") || "-";
      details.append(name, contact);

      const remove = document.createElement("button");
      remove.className = "secondary-button compact-button";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => removeNetworkProvider(entry, provider.id));
      item.append(details, remove);
      list.append(item);
    }

    section.append(list);
  }

  const form = document.createElement("form");
  form.className = "network-provider-form";
  form.innerHTML = `
    <label>
      Provider
      <input name="name" required>
    </label>
    <label>
      Phone
      <input name="phone" autocomplete="tel">
    </label>
    <label>
      Email
      <input name="email" type="email" autocomplete="email">
    </label>
    <button type="submit">Add Provider</button>
  `;
  form.addEventListener("submit", (event) => addNetworkProvider(event, entry));
  section.append(form);

  return section;
}

function renderOutreachDetail() {
  if (!outreachForm.hidden) {
    outreachDetail.hidden = true;
    return;
  }

  outreachDetail.hidden = false;
  outreachDetail.innerHTML = "";
  const event = getSelectedOutreachEvent();

  if (!loadedOutreachEvents.length) {
    outreachDetail.append(emptyDetail("Create the first outreach event or hosted class.", "New Event", startNewOutreachEvent));
    return;
  }

  if (!event) {
    outreachDetail.append(emptyDetail("No outreach event matches the current list view.", null, null));
    return;
  }

  const heading = document.createElement("div");
  heading.className = "detail-heading";

  const titleWrap = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = event.type || "Outreach";
  const title = document.createElement("h3");
  title.textContent = outreachEventName(event);
  titleWrap.append(eyebrow, title);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  const editButton = document.createElement("button");
  editButton.className = "secondary-button";
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => startEditingOutreachEvent(event));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteOutreachEvent(event));

  const closeButton = document.createElement("button");
  closeButton.className = "secondary-button";
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", closeOutreachModal);
  actions.append(editButton, deleteButton, closeButton);
  heading.append(titleWrap, actions);

  const infoGrid = document.createElement("div");
  infoGrid.className = "detail-grid";
  const leftColumn = document.createElement("dl");
  leftColumn.className = "detail-column";
  const rightColumn = document.createElement("dl");
  rightColumn.className = "detail-column";

  addDetailField(leftColumn, "Date", formatDateOnly(event.eventDate));
  addDetailField(leftColumn, "Repeats", displayValue(event.repeatPattern || "One-time"));
  addDetailField(leftColumn, "Location", displayValue(event.location));
  addDetailField(leftColumn, "Event Contact", displayValue(event.contactName));
  addDetailField(leftColumn, "Contact Role", displayValue(event.contactRole));
  addDetailField(leftColumn, "Phone", displayValue(formatPhone(event.phone)));
  addDetailField(leftColumn, "Email", displayValue(event.email));
  addDetailField(rightColumn, "People Interacted With", numberValue(event.interactionsCount));
  addDetailField(rightColumn, "Referrals Collected", numberValue(event.referralsCount));
  addDetailField(rightColumn, "Interest List Count", numberValue(event.interestListCount));
  addDetailField(rightColumn, "Participant List Count", numberValue(event.participantListCount));
  addDetailField(rightColumn, "Created Date", formatDateOnly((event.createdAt || "").slice(0, 10)));
  infoGrid.append(leftColumn, rightColumn);

  const notes = document.createElement("section");
  notes.className = "notes-panel";
  const notesTitle = document.createElement("h4");
  notesTitle.textContent = "Notes";
  const notesText = document.createElement("p");
  notesText.textContent = event.notes || "-";
  notes.append(notesTitle, notesText);

  outreachDetail.append(heading, infoGrid, notes);
}

function renderOutreachEventOptions(selectedEventId = "") {
  outreachContactEventSelect.innerHTML = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "Not linked";
  outreachContactEventSelect.append(empty);

  for (const event of loadedOutreachEvents.sort((first, second) => outreachEventName(first).localeCompare(outreachEventName(second)))) {
    const option = document.createElement("option");
    option.value = event.id;
    option.textContent = outreachEventName(event);
    outreachContactEventSelect.append(option);
  }

  outreachContactEventSelect.value = selectedEventId || "";
}

function renderOutreachContactDetail() {
  if (!outreachContactForm.hidden) {
    outreachContactDetail.hidden = true;
    return;
  }

  outreachContactDetail.hidden = false;
  outreachContactDetail.innerHTML = "";
  const contact = getSelectedOutreachContact();

  if (!loadedOutreachContacts.length) {
    outreachContactDetail.append(emptyDetail("Create the first interest contact from an outreach event.", "New Contact", startNewOutreachContact));
    return;
  }

  if (!contact) {
    outreachContactDetail.append(emptyDetail("No outreach contact matches the current list view.", null, null));
    return;
  }

  const heading = document.createElement("div");
  heading.className = "detail-heading";

  const titleWrap = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = contact.status || "Outreach Contact";
  const title = document.createElement("h3");
  title.textContent = outreachContactName(contact);
  titleWrap.append(eyebrow, title);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  const editButton = document.createElement("button");
  editButton.className = "secondary-button";
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => startEditingOutreachContact(contact));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteOutreachContact(contact));

  const closeButton = document.createElement("button");
  closeButton.className = "secondary-button";
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", closeOutreachContactModal);
  actions.append(editButton, deleteButton, closeButton);
  heading.append(titleWrap, actions);

  const infoGrid = document.createElement("div");
  infoGrid.className = "detail-grid";
  const leftColumn = document.createElement("dl");
  leftColumn.className = "detail-column";
  const rightColumn = document.createElement("dl");
  rightColumn.className = "detail-column";

  addDetailField(leftColumn, "Event/Class", displayValue(outreachEventLabel(contact.eventId)));
  addDetailField(leftColumn, "Contact Name", displayValue(contact.contactName));
  addDetailField(leftColumn, "Child Name", displayValue(contact.childName));
  addDetailField(leftColumn, "Phone", displayValue(formatPhone(contact.phone)));
  addDetailField(leftColumn, "Email", displayValue(contact.email));
  addDetailField(rightColumn, "Status", displayValue(contact.status));
  addDetailField(rightColumn, "Interest Type", displayValue(contact.interestType));
  addDetailField(rightColumn, "Preferred Language", displayValue(contact.preferredLanguage));
  addDetailField(rightColumn, "Created Date", formatDateOnly((contact.createdAt || "").slice(0, 10)));
  infoGrid.append(leftColumn, rightColumn);

  const notes = document.createElement("section");
  notes.className = "notes-panel";
  const notesTitle = document.createElement("h4");
  notesTitle.textContent = "Notes";
  const notesText = document.createElement("p");
  notesText.textContent = contact.notes || "-";
  notes.append(notesTitle, notesText);

  outreachContactDetail.append(heading, infoGrid, notes);
}

function renderSiblingsSection(record, moduleName) {
  const records = moduleName === "clients" ? loadedClients : loadedReferrals;
  const getName = moduleName === "clients" ? clientName : referralName;
  const selectRecord = moduleName === "clients" ? setSelectedClient : setSelectedReferral;
  const label = moduleName === "clients" ? "clients" : "referrals";
  const siblingIds = Array.isArray(record.siblingIds) ? record.siblingIds : [];
  const siblings = siblingIds.map((id) => records.find((item) => item.id === id)).filter(Boolean);
  const linkedIds = new Set([record.id, ...siblingIds]);
  const candidates = records
    .filter((item) => !linkedIds.has(item.id))
    .sort((first, second) => getName(first).localeCompare(getName(second)));

  const section = document.createElement("section");
  section.className = "siblings-panel";

  const header = document.createElement("div");
  header.className = "siblings-header";
  const title = document.createElement("h4");
  title.textContent = "Siblings";
  header.append(title);

  const list = document.createElement("div");
  list.className = "sibling-list";

  if (!siblings.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "-";
    list.append(empty);
  }

  for (const sibling of siblings) {
    const item = document.createElement("div");
    item.className = "sibling-item";

    const openButton = document.createElement("button");
    openButton.className = "link-button";
    openButton.type = "button";
    openButton.textContent = getName(sibling);
    openButton.addEventListener("click", () => selectRecord(sibling.id));

    const removeButton = document.createElement("button");
    removeButton.className = "secondary-button compact-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeSibling(moduleName, record.id, sibling.id));

    item.append(openButton, removeButton);
    list.append(item);
  }

  const form = document.createElement("form");
  form.className = "sibling-form";

  const select = document.createElement("select");
  select.setAttribute("aria-label", "Add sibling");

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = candidates.length ? "Add sibling" : `No ${label} available`;
  select.append(placeholder);

  for (const candidate of candidates) {
    const option = document.createElement("option");
    option.value = candidate.id;
    option.textContent = getName(candidate);
    select.append(option);
  }

  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Add";
  addButton.disabled = !candidates.length;

  form.append(select, addButton);
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (select.value) {
      addSibling(moduleName, record.id, select.value);
    }
  });

  section.append(header, list, form);
  return section;
}

function renderLinkedProvidersSection(record, moduleName) {
  const section = document.createElement("section");
  section.className = "linked-providers-panel";

  const title = document.createElement("h4");
  title.textContent = "Providers";
  section.append(title);

  const links = Array.isArray(record.providerLinks) ? record.providerLinks : [];

  if (!links.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No providers linked yet.";
    section.append(empty);
  } else {
    const list = document.createElement("div");
    list.className = "sibling-list";

    for (const link of links) {
      const item = document.createElement("div");
      item.className = "sibling-item";
      const name = document.createElement("span");
      name.textContent = `${link.providerName} (${link.organizationName})`;
      const remove = document.createElement("button");
      remove.className = "secondary-button compact-button";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => removeProviderLink(record, moduleName, link));
      item.append(name, remove);
      list.append(item);
    }

    section.append(list);
  }

  const options = availableProviderLinks(record);
  const form = document.createElement("form");
  form.className = "sibling-form";
  const select = document.createElement("select");
  select.setAttribute("aria-label", "Add provider");

  if (!options.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = loadedNetworkEntries.length ? "No providers available" : "Add providers in Referral Network first";
    select.append(option);
    select.disabled = true;
  } else {
    for (const optionLink of options) {
      const option = document.createElement("option");
      option.value = `${optionLink.networkId}:${optionLink.providerId}`;
      option.textContent = optionLink.label;
      select.append(option);
    }
  }

  const add = document.createElement("button");
  add.type = "submit";
  add.textContent = "Add";
  add.disabled = !options.length;
  form.append(select, add);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = options.find((option) => `${option.networkId}:${option.providerId}` === select.value);

    if (selected) {
      addProviderLink(record, moduleName, selected);
    }
  });
  section.append(form);

  return section;
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
    .join(", ") || "-";
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

function addInlineDateField(container, label, value, record, moduleName, fieldName) {
  const group = document.createElement("div");
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  const input = document.createElement("input");
  input.className = "inline-date-input";
  input.type = "date";
  input.value = value || "";
  input.setAttribute("aria-label", label);
  input.addEventListener("change", () => updateInlineDate(record, moduleName, fieldName, input.value));
  description.append(input);
  group.append(term, description);
  container.append(group);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === "\"") {
      if (inQuotes && nextChar === "\"") {
        cell += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== "")) {
    rows.push(row);
  }

  return rows;
}

function csvValue(row, columnName) {
  return String(row[columnName] || "").trim();
}

function normalizeZohoClientStatus(status) {
  return zohoClientStatusMap[status] || status || "";
}

function normalizeZohoReferralStatus(status) {
  return legacyStatusMap[status] || status || "New";
}

function mapZohoClientRow(row) {
  const phone = csvValue(row, "Mobile") || csvValue(row, "Home Phone");
  return {
    firstName: csvValue(row, "First Name"),
    lastName: csvValue(row, "Last Name"),
    parentName: csvValue(row, "Parent Name"),
    phone,
    email: csvValue(row, "Email"),
    dateOfBirth: normalizeCsvDate(csvValue(row, "Date of Birth")),
    preferredLanguage: csvValue(row, "Preferred Language"),
    status: normalizeZohoClientStatus(csvValue(row, "Status")),
    referralSource: csvValue(row, "Referring Provider"),
    referralDate: normalizeCsvDate(csvValue(row, "Referral Date")),
    firstContactDate: normalizeCsvDate(csvValue(row, "First Contact Date")),
    mostRecentContactDate: normalizeCsvDate(csvValue(row, "Most Recent Contact Date")),
    firstAppointmentDate: normalizeCsvDate(csvValue(row, "First Appt Date")),
    lastAppointmentDate: normalizeCsvDate(csvValue(row, "Last Appt Date")),
    assessmentScore: csvValue(row, "Assessment Score"),
    willingnessScore: csvValue(row, "Willingness Score"),
    gender: csvValue(row, "Gender") || "Unspecified",
    ycco: csvValue(row, "YCCO"),
    emailOptOut: /^true|yes|1$/i.test(csvValue(row, "Email Opt Out")),
    addressStreet: csvValue(row, "Mailing Street"),
    addressCity: csvValue(row, "Mailing City"),
    addressState: csvValue(row, "Mailing State"),
    addressZip: csvValue(row, "Mailing Zip"),
    notes: csvValue(row, "Note"),
    zohoRecordId: csvValue(row, "Record Id"),
    rawStatus: csvValue(row, "Status")
  };
}

function isAssessmentCsv(columns) {
  return columns.includes("Assessment Score") && columns.includes("Contacted?") && !columns.includes("Referral Status");
}

function mapZohoReferralRow(row, sourceType) {
  const isAssessment = sourceType === "assessment";
  const phone = csvValue(row, "Mobile") || csvValue(row, "Home Phone") || csvValue(row, "Phone");
  const rawStatus = isAssessment ? csvValue(row, "Status") : csvValue(row, "Referral Status");
  const contacted = /^true|yes|1$/i.test(csvValue(row, "Contacted?"));
  const status = isAssessment
    ? (rawStatus === "Not Interested" ? "Not Interested" : (contacted ? "Texted" : "New"))
    : normalizeZohoReferralStatus(rawStatus);
  const notes = [csvValue(row, "Note"), isAssessment && rawStatus ? `Assessment source status: ${rawStatus}` : ""]
    .filter(Boolean)
    .join("\n");

  return {
    firstName: csvValue(row, "First Name"),
    lastName: csvValue(row, "Last Name"),
    parentName: csvValue(row, "Parent Name"),
    phone,
    email: csvValue(row, "Email"),
    dateOfBirth: normalizeCsvDate(csvValue(row, "Date of Birth")),
    preferredLanguage: csvValue(row, "Preferred Language"),
    status,
    referralType: isAssessment ? "Nutrition Assessment" : "Internal Clinic Referral",
    referralSource: csvValue(row, "Referring Provider"),
    referralDate: normalizeCsvDate(csvValue(row, "Referral Date")),
    firstContactDate: normalizeCsvDate(csvValue(row, "First Contact Date")),
    mostRecentContactDate: normalizeCsvDate(csvValue(row, "Most Recent Contact Date")),
    firstAppointmentDate: normalizeCsvDate(csvValue(row, "First Appt Date")),
    lastAppointmentDate: normalizeCsvDate(csvValue(row, "Last Appt Date")),
    assessmentScore: csvValue(row, "Assessment Score"),
    willingnessScore: csvValue(row, "Willingness Score"),
    gender: csvValue(row, "Gender") || "Unspecified",
    ycco: csvValue(row, "YCCO"),
    emailOptOut: /^true|yes|1$/i.test(csvValue(row, "Email Opt Out")),
    addressStreet: csvValue(row, "Street"),
    addressCity: csvValue(row, "City"),
    addressState: csvValue(row, "State"),
    addressZip: csvValue(row, "Zip Code"),
    notes,
    zohoRecordId: csvValue(row, "Record Id"),
    importSource: isAssessment ? "Zoho Assessment CSV" : "Zoho Referral CSV",
    rawStatus
  };
}

function normalizeImportedNetworkName(name) {
  const cleaned = String(name || "").trim();
  const lower = cleaned.toLowerCase();

  if (lower === "pmc") {
    return "Physicians' Medical Center";
  }

  if (lower === "virginia garcia") {
    return "Virginia Garcia";
  }

  if (lower === "sunrise") {
    return "Sunrise Family Clinic";
  }

  return cleaned;
}

function inferNetworkType(name) {
  const lower = String(name || "").toLowerCase();

  if (lower.includes("ycco") || lower.includes("self referral")) {
    return "Community Org";
  }

  if (lower.includes("pmc") || lower.includes("physicians") || lower.includes("sunrise") || lower.includes("virginia garcia")) {
    return "Internal Clinic";
  }

  return "External Clinic";
}

function mapProviderImportRows(rows) {
  const groups = new Map();
  const missingRequired = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const providerName = csvValue(row, "Provider Name");
    const rawOrganization = csvValue(row, "Referring Organization") || csvValue(row, "Tag") || providerName;
    const organizationName = normalizeImportedNetworkName(rawOrganization);

    if (!organizationName) {
      missingRequired.push({
        rowNumber,
        name: providerName || "Unnamed provider",
        missing: ["Organization"]
      });
      return;
    }

    if (!groups.has(organizationName)) {
      groups.set(organizationName, {
        name: organizationName,
        type: inferNetworkType(rawOrganization || organizationName),
        contactName: "",
        phone: csvValue(row, "Phone"),
        email: "",
        website: "",
        notes: "",
        providers: []
      });
    }

    const group = groups.get(organizationName);
    if (!group.phone && csvValue(row, "Phone")) {
      group.phone = csvValue(row, "Phone");
    }

    if (!group.website && csvValue(row, "Website")) {
      group.website = csvValue(row, "Website");
    }

    if (providerName) {
      group.providers.push({
        name: providerName,
        phone: csvValue(row, "Phone"),
        email: csvValue(row, "Email"),
        website: csvValue(row, "Website"),
        notes: csvValue(row, "Tag")
      });
    }
  });

  return {
    entries: [...groups.values()],
    missingRequired
  };
}

function clientIdentityKeys(client) {
  return {
    email: client.email ? client.email.toLowerCase() : "",
    phone: normalizePhoneKey(client.phone).length >= 7 ? normalizePhoneKey(client.phone) : "",
    nameDob: client.firstName && client.lastName && client.dateOfBirth
      ? `${client.firstName.toLowerCase()}|${client.lastName.toLowerCase()}|${client.dateOfBirth}`
      : ""
  };
}

function addImportWarning(warnings, seenWarnings, warning) {
  const key = `${warning.rowNumber}|${warning.name}|${warning.reason}`;

  if (seenWarnings.has(key)) {
    return;
  }

  seenWarnings.add(key);
  warnings.push(warning);
}

function analyzeClientImport(rows, columns) {
  const mappedClients = rows.map(mapZohoClientRow);
  const missingRequired = [];
  const duplicateWarnings = [];
  const householdWarnings = [];
  const existingDuplicateKeys = new Map();
  const existingEmailKeys = new Map();
  const existingPhoneKeys = new Map();
  const csvDuplicateKeys = new Map();
  const csvEmailKeys = new Map();
  const csvPhoneKeys = new Map();
  const seenDuplicateWarnings = new Set();
  const seenHouseholdWarnings = new Set();
  const requiredMappings = clientCsvFieldMappings.filter((mapping) => mapping.required);

  for (const client of loadedClients) {
    const keys = clientIdentityKeys(client);

    if (keys.email && !existingEmailKeys.has(keys.email)) {
      existingEmailKeys.set(keys.email, clientName(client));
    }

    if (keys.nameDob && !existingDuplicateKeys.has(`name-dob:${keys.nameDob}`)) {
      existingDuplicateKeys.set(`name-dob:${keys.nameDob}`, clientName(client));
    }

    if (keys.phone && !existingPhoneKeys.has(keys.phone)) {
      existingPhoneKeys.set(keys.phone, clientName(client));
    }
  }

  mappedClients.forEach((client, index) => {
    const rowNumber = index + 2;
    const missing = requiredMappings
      .filter((mapping) => !client[mapping.key])
      .map((mapping) => mapping.label);

    if (missing.length) {
      missingRequired.push({
        rowNumber,
        name: clientName(client),
        missing
      });
    }

    const keys = clientIdentityKeys(client);
    const duplicateKeys = [
      keys.nameDob ? { key: `name-dob:${keys.nameDob}`, label: "same name and date of birth" } : null
    ].filter(Boolean);

    for (const { key, label } of duplicateKeys) {
      if (existingDuplicateKeys.has(key)) {
        addImportWarning(duplicateWarnings, seenDuplicateWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Possible duplicate of existing client ${existingDuplicateKeys.get(key)} (${label})`
        });
      }

      if (csvDuplicateKeys.has(key)) {
        addImportWarning(duplicateWarnings, seenDuplicateWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Possible duplicate of CSV row ${csvDuplicateKeys.get(key)} (${label})`
        });
      } else {
        csvDuplicateKeys.set(key, rowNumber);
      }
    }

    if (keys.email) {
      if (existingEmailKeys.has(keys.email)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Shares email with existing client ${existingEmailKeys.get(keys.email)}`
        });
      }

      if (csvEmailKeys.has(keys.email)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Shares email with CSV row ${csvEmailKeys.get(keys.email)}`
        });
      } else {
        csvEmailKeys.set(keys.email, rowNumber);
      }
    }

    if (keys.phone) {
      if (existingPhoneKeys.has(keys.phone)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Shares phone with existing client ${existingPhoneKeys.get(keys.phone)}`
        });
      }

      if (csvPhoneKeys.has(keys.phone)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Shares phone with CSV row ${csvPhoneKeys.get(keys.phone)}`
        });
      } else {
        csvPhoneKeys.set(keys.phone, rowNumber);
      }
    }
  });

  return {
    columns,
    rows,
    mappedClients,
    missingRequired,
    duplicateWarnings,
    householdWarnings
  };
}

function analyzeReferralImport(rows, columns) {
  const sourceType = isAssessmentCsv(columns) ? "assessment" : "referral";
  const mappedReferrals = rows.map((row) => mapZohoReferralRow(row, sourceType));
  const missingRequired = [];
  const duplicateWarnings = [];
  const householdWarnings = [];
  const existingDuplicateKeys = new Map();
  const existingEmailKeys = new Map();
  const existingPhoneKeys = new Map();
  const csvDuplicateKeys = new Map();
  const csvEmailKeys = new Map();
  const csvPhoneKeys = new Map();
  const seenDuplicateWarnings = new Set();
  const seenHouseholdWarnings = new Set();
  const requiredMappings = referralCsvFieldMappings.filter((mapping) => mapping.required);

  for (const record of [...loadedReferrals, ...loadedClients]) {
    const keys = clientIdentityKeys(record);
    const existingName = record.id && loadedClients.some((client) => client.id === record.id) ? clientName(record) : referralName(record);

    if (keys.email && !existingEmailKeys.has(keys.email)) {
      existingEmailKeys.set(keys.email, existingName);
    }

    if (keys.nameDob && !existingDuplicateKeys.has(`name-dob:${keys.nameDob}`)) {
      existingDuplicateKeys.set(`name-dob:${keys.nameDob}`, existingName);
    }

    if (keys.phone && !existingPhoneKeys.has(keys.phone)) {
      existingPhoneKeys.set(keys.phone, existingName);
    }
  }

  mappedReferrals.forEach((referral, index) => {
    const rowNumber = index + 2;
    const missing = requiredMappings
      .filter((mapping) => !referral[mapping.key])
      .map((mapping) => mapping.label);

    if (missing.length) {
      missingRequired.push({
        rowNumber,
        name: referralName(referral),
        missing
      });
    }

    const keys = clientIdentityKeys(referral);
    if (keys.nameDob) {
      const key = `name-dob:${keys.nameDob}`;
      if (existingDuplicateKeys.has(key)) {
        addImportWarning(duplicateWarnings, seenDuplicateWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Possible duplicate of existing record ${existingDuplicateKeys.get(key)} (same name and date of birth)`
        });
      }

      if (csvDuplicateKeys.has(key)) {
        addImportWarning(duplicateWarnings, seenDuplicateWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Possible duplicate of CSV row ${csvDuplicateKeys.get(key)} (same name and date of birth)`
        });
      } else {
        csvDuplicateKeys.set(key, rowNumber);
      }
    }

    if (keys.email) {
      if (existingEmailKeys.has(keys.email)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Shares email with existing record ${existingEmailKeys.get(keys.email)}`
        });
      }

      if (csvEmailKeys.has(keys.email)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Shares email with CSV row ${csvEmailKeys.get(keys.email)}`
        });
      } else {
        csvEmailKeys.set(keys.email, rowNumber);
      }
    }

    if (keys.phone) {
      if (existingPhoneKeys.has(keys.phone)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Shares phone with existing record ${existingPhoneKeys.get(keys.phone)}`
        });
      }

      if (csvPhoneKeys.has(keys.phone)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Shares phone with CSV row ${csvPhoneKeys.get(keys.phone)}`
        });
      } else {
        csvPhoneKeys.set(keys.phone, rowNumber);
      }
    }
  });

  return {
    columns,
    rows,
    sourceType,
    mappedReferrals,
    missingRequired,
    duplicateWarnings,
    householdWarnings
  };
}

function analyzeNetworkImport(rows, columns) {
  const mapped = mapProviderImportRows(rows);
  return {
    columns,
    rows,
    entries: mapped.entries,
    missingRequired: mapped.missingRequired
  };
}

function appendImportSection(parent, titleText) {
  const section = document.createElement("section");
  section.className = "import-preview-section";
  const title = document.createElement("h4");
  title.textContent = titleText;
  section.append(title);
  parent.append(section);
  return section;
}

function appendSimpleList(parent, items, emptyText) {
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = emptyText;
    parent.append(empty);
    return;
  }

  const list = document.createElement("ul");
  list.className = "import-warning-list";
  for (const item of items) {
    const row = document.createElement("li");
    row.textContent = item;
    list.append(row);
  }
  parent.append(list);
}

function renderClientImportPreview(analysis, fileName) {
  clientImportDetail.innerHTML = "";
  const missingRowNumbers = new Set(analysis.missingRequired.map((warning) => warning.rowNumber));
  const importableClients = analysis.mappedClients.filter((_, index) => !missingRowNumbers.has(index + 2));
  confirmClientImportButton.hidden = false;
  confirmClientImportButton.disabled = !importableClients.length;
  confirmClientImportButton.textContent = `Import ${importableClients.length} Clients`;

  const summary = document.createElement("div");
  summary.className = "import-summary-grid";
  for (const [label, value] of [
    ["File", fileName],
    ["Total rows found", analysis.rows.length],
    ["Ready to import", importableClients.length],
    ["Columns detected", analysis.columns.length],
    ["Missing required rows", analysis.missingRequired.length],
    ["Duplicate warnings", analysis.duplicateWarnings.length],
    ["Shared contact warnings", analysis.householdWarnings.length]
  ]) {
    const item = document.createElement("div");
    item.className = "summary-item import-summary-item";
    const valueEl = document.createElement("strong");
    valueEl.textContent = value;
    const labelEl = document.createElement("span");
    labelEl.textContent = label;
    item.append(valueEl, labelEl);
    summary.append(item);
  }
  clientImportDetail.append(summary);

  const columnsSection = appendImportSection(clientImportDetail, "Columns Detected");
  appendSimpleList(columnsSection, analysis.columns, "No columns detected.");

  const mappingSection = appendImportSection(clientImportDetail, "Field Mapping Summary");
  const mappingGrid = document.createElement("div");
  mappingGrid.className = "import-mapping-grid";
  for (const header of ["CRM Field", "Zoho Column", "Requirement"]) {
    const cell = document.createElement("strong");
    cell.textContent = header;
    mappingGrid.append(cell);
  }
  for (const mapping of clientCsvFieldMappings) {
    const appField = document.createElement("span");
    appField.textContent = mapping.label;
    const sourceField = document.createElement("span");
    sourceField.textContent = mapping.source;
    const requirement = document.createElement("span");
    requirement.textContent = mapping.required ? "Required" : "Optional";
    mappingGrid.append(appField, sourceField, requirement);
  }
  mappingSection.append(mappingGrid);

  const missingSection = appendImportSection(clientImportDetail, "Rows With Missing Required Values");
  appendSimpleList(
    missingSection,
    analysis.missingRequired.map((warning) => `Row ${warning.rowNumber}: ${warning.name} missing ${warning.missing.join(", ")}`),
    "No missing required values found."
  );

  const duplicateSection = appendImportSection(clientImportDetail, "Duplicate Warnings");
  appendSimpleList(
    duplicateSection,
    analysis.duplicateWarnings.map((warning) => `Row ${warning.rowNumber}: ${warning.name} - ${warning.reason}`),
    "No duplicate warnings found."
  );

  const householdSection = appendImportSection(clientImportDetail, "Shared Contact / Household Warnings");
  appendSimpleList(
    householdSection,
    analysis.householdWarnings.map((warning) => `Row ${warning.rowNumber}: ${warning.name} - ${warning.reason}`),
    "No shared contact warnings found."
  );

  const previewSection = appendImportSection(clientImportDetail, "Preview of First 10 Clients");
  const previewTable = document.createElement("div");
  previewTable.className = "import-preview-table";
  for (const header of ["Name", "Status", "Phone", "Caregiver", "Language", "Referral Source"]) {
    const cell = document.createElement("strong");
    cell.textContent = header;
    previewTable.append(cell);
  }
  for (const client of analysis.mappedClients.slice(0, 10)) {
    for (const value of [
      clientName(client),
      displayValue(client.status),
      displayValue(formatPhone(client.phone)),
      displayValue(client.parentName),
      displayValue(client.preferredLanguage),
      displayValue(client.referralSource)
    ]) {
      const cell = document.createElement("span");
      cell.textContent = value;
      previewTable.append(cell);
    }
  }
  previewSection.append(previewTable);
}

function renderReferralImportPreview(analysis, fileName) {
  referralImportDetail.innerHTML = "";
  const missingRowNumbers = new Set(analysis.missingRequired.map((warning) => warning.rowNumber));
  const importableReferrals = analysis.mappedReferrals.filter((_, index) => !missingRowNumbers.has(index + 2));
  confirmReferralImportButton.hidden = false;
  confirmReferralImportButton.disabled = !importableReferrals.length;
  confirmReferralImportButton.textContent = `Import ${importableReferrals.length} Referrals`;

  const summary = document.createElement("div");
  summary.className = "import-summary-grid";
  for (const [label, value] of [
    ["File", fileName],
    ["Import type", analysis.sourceType === "assessment" ? "Assessments as referrals" : "Referrals"],
    ["Total rows found", analysis.rows.length],
    ["Ready to import", importableReferrals.length],
    ["Columns detected", analysis.columns.length],
    ["Missing required rows", analysis.missingRequired.length],
    ["Duplicate warnings", analysis.duplicateWarnings.length],
    ["Shared contact warnings", analysis.householdWarnings.length]
  ]) {
    const item = document.createElement("div");
    item.className = "summary-item import-summary-item";
    const valueEl = document.createElement("strong");
    valueEl.textContent = value;
    const labelEl = document.createElement("span");
    labelEl.textContent = label;
    item.append(valueEl, labelEl);
    summary.append(item);
  }
  referralImportDetail.append(summary);

  const columnsSection = appendImportSection(referralImportDetail, "Columns Detected");
  appendSimpleList(columnsSection, analysis.columns, "No columns detected.");

  const mappingSection = appendImportSection(referralImportDetail, "Field Mapping Summary");
  const mappingGrid = document.createElement("div");
  mappingGrid.className = "import-mapping-grid";
  for (const header of ["CRM Field", "Zoho Column", "Requirement"]) {
    const cell = document.createElement("strong");
    cell.textContent = header;
    mappingGrid.append(cell);
  }
  for (const mapping of referralCsvFieldMappings) {
    const appField = document.createElement("span");
    appField.textContent = mapping.label;
    const sourceField = document.createElement("span");
    sourceField.textContent = mapping.source;
    const requirement = document.createElement("span");
    requirement.textContent = mapping.required ? "Required" : "Optional";
    mappingGrid.append(appField, sourceField, requirement);
  }
  mappingSection.append(mappingGrid);

  const missingSection = appendImportSection(referralImportDetail, "Rows With Missing Required Values");
  appendSimpleList(
    missingSection,
    analysis.missingRequired.map((warning) => `Row ${warning.rowNumber}: ${warning.name} missing ${warning.missing.join(", ")}`),
    "No missing required values found."
  );

  const duplicateSection = appendImportSection(referralImportDetail, "Duplicate Warnings");
  appendSimpleList(
    duplicateSection,
    analysis.duplicateWarnings.map((warning) => `Row ${warning.rowNumber}: ${warning.name} - ${warning.reason}`),
    "No duplicate warnings found."
  );

  const householdSection = appendImportSection(referralImportDetail, "Shared Contact / Household Warnings");
  appendSimpleList(
    householdSection,
    analysis.householdWarnings.map((warning) => `Row ${warning.rowNumber}: ${warning.name} - ${warning.reason}`),
    "No shared contact warnings found."
  );

  const previewSection = appendImportSection(referralImportDetail, "Preview of First 10 Referrals");
  const previewTable = document.createElement("div");
  previewTable.className = "import-preview-table";
  for (const header of ["Name", "Status", "Type", "Phone", "Caregiver", "Language"]) {
    const cell = document.createElement("strong");
    cell.textContent = header;
    previewTable.append(cell);
  }
  for (const referral of analysis.mappedReferrals.slice(0, 10)) {
    for (const value of [
      referralName(referral),
      displayValue(referral.status),
      displayValue(referral.referralType),
      displayValue(formatPhone(referral.phone)),
      displayValue(referral.parentName),
      displayValue(referral.preferredLanguage)
    ]) {
      const cell = document.createElement("span");
      cell.textContent = value;
      previewTable.append(cell);
    }
  }
  previewSection.append(previewTable);
}

function renderNetworkImportPreview(analysis, fileName) {
  networkImportDetail.innerHTML = "";
  confirmNetworkImportButton.hidden = false;
  confirmNetworkImportButton.disabled = !analysis.entries.length;
  confirmNetworkImportButton.textContent = `Import ${analysis.entries.length} Organizations`;
  const providerCount = analysis.entries.reduce((total, entry) => total + entry.providers.length, 0);

  const summary = document.createElement("div");
  summary.className = "import-summary-grid";
  for (const [label, value] of [
    ["File", fileName],
    ["Total rows found", analysis.rows.length],
    ["Organizations ready", analysis.entries.length],
    ["Providers ready", providerCount],
    ["Columns detected", analysis.columns.length],
    ["Missing required rows", analysis.missingRequired.length]
  ]) {
    const item = document.createElement("div");
    item.className = "summary-item import-summary-item";
    const valueEl = document.createElement("strong");
    valueEl.textContent = value;
    const labelEl = document.createElement("span");
    labelEl.textContent = label;
    item.append(valueEl, labelEl);
    summary.append(item);
  }
  networkImportDetail.append(summary);

  const columnsSection = appendImportSection(networkImportDetail, "Columns Detected");
  appendSimpleList(columnsSection, analysis.columns, "No columns detected.");

  const missingSection = appendImportSection(networkImportDetail, "Rows With Missing Required Values");
  appendSimpleList(
    missingSection,
    analysis.missingRequired.map((warning) => `Row ${warning.rowNumber}: ${warning.name} missing ${warning.missing.join(", ")}`),
    "No missing required values found."
  );

  const previewSection = appendImportSection(networkImportDetail, "Preview of Organizations");
  const previewTable = document.createElement("div");
  previewTable.className = "import-preview-table";
  for (const header of ["Organization", "Type", "Providers", "Phone", "Website"]) {
    const cell = document.createElement("strong");
    cell.textContent = header;
    previewTable.append(cell);
  }
  for (const entry of analysis.entries.slice(0, 10)) {
    for (const value of [
      networkEntryName(entry),
      displayValue(entry.type),
      `${entry.providers.length}`,
      displayValue(formatPhone(entry.phone)),
      displayValue(entry.website)
    ]) {
      const cell = document.createElement("span");
      cell.textContent = value;
      previewTable.append(cell);
    }
  }
  previewSection.append(previewTable);
}

function openClientImportModal() {
  clientImportModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeClientImportModal() {
  clientImportModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function openReferralImportModal() {
  referralImportModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeReferralImportModal() {
  referralImportModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function openNetworkImportModal() {
  networkImportModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeNetworkImportModal() {
  networkImportModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function importableClientsFromAnalysis(analysis) {
  const missingRowNumbers = new Set(analysis.missingRequired.map((warning) => warning.rowNumber));
  return analysis.mappedClients
    .map((client, index) => ({
      ...client,
      rowNumber: index + 2
    }))
    .filter((_, index) => !missingRowNumbers.has(index + 2));
}

function importableReferralsFromAnalysis(analysis) {
  const missingRowNumbers = new Set(analysis.missingRequired.map((warning) => warning.rowNumber));
  return analysis.mappedReferrals
    .map((referral, index) => ({
      ...referral,
      rowNumber: index + 2
    }))
    .filter((_, index) => !missingRowNumbers.has(index + 2));
}

async function importPreviewedClients() {
  if (!latestClientImportAnalysis) {
    clientsStatusEl.textContent = "Preview a CSV before importing clients.";
    return;
  }

  const clientsToImport = importableClientsFromAnalysis(latestClientImportAnalysis);

  if (!clientsToImport.length) {
    clientsStatusEl.textContent = "No valid client rows are ready to import.";
    return;
  }

  const confirmed = window.confirm(
    `Import ${clientsToImport.length} clients now? ` +
    `${latestClientImportAnalysis.duplicateWarnings.length} duplicate warning(s) and ` +
    `${latestClientImportAnalysis.householdWarnings.length} shared contact warning(s) will not block the import.`
  );

  if (!confirmed) {
    return;
  }

  confirmClientImportButton.disabled = true;
  clientsStatusEl.textContent = "Importing clients...";

  try {
    const response = await authedFetch("/api/clients/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ clients: clientsToImport })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const result = await response.json();
    clientsStatusEl.textContent = `Imported ${result.importedCount} clients${result.skipped?.length ? `; skipped ${result.skipped.length}` : ""}.`;
    latestClientImportAnalysis = null;
    confirmClientImportButton.hidden = true;
    await loadClients();
    closeClientImportModal();
  } catch (error) {
    clientsStatusEl.textContent = error.message || "Could not import clients yet.";
    console.error(error);
  } finally {
    confirmClientImportButton.disabled = false;
  }
}

async function previewClientCsv(file) {
  if (!file) {
    return;
  }

  clientsStatusEl.textContent = `Previewing ${file.name}...`;

  try {
    const text = await file.text();
    const parsed = parseCsv(text);

    if (parsed.length < 2) {
      throw new Error("The CSV does not contain any client rows.");
    }

    const columns = parsed[0].map((column) => column.trim());
    const rows = parsed.slice(1).map((values) =>
      Object.fromEntries(columns.map((column, index) => [column, values[index] || ""]))
    );
    const analysis = analyzeClientImport(rows, columns);
    latestClientImportAnalysis = analysis;
    renderClientImportPreview(analysis, file.name);
    openClientImportModal();
    clientsStatusEl.textContent = "Client import preview ready.";
  } catch (error) {
    latestClientImportAnalysis = null;
    confirmClientImportButton.hidden = true;
    clientsStatusEl.textContent = error.message || "Could not preview this CSV.";
    clientImportDetail.innerHTML = "";
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = error.message || "Could not preview this CSV.";
    clientImportDetail.append(message);
    openClientImportModal();
    console.error(error);
  } finally {
    clientCsvInput.value = "";
  }
}

async function importPreviewedReferrals() {
  if (!latestReferralImportAnalysis) {
    referralsStatusEl.textContent = "Preview a CSV before importing referrals.";
    return;
  }

  const referralsToImport = importableReferralsFromAnalysis(latestReferralImportAnalysis);

  if (!referralsToImport.length) {
    referralsStatusEl.textContent = "No valid referral rows are ready to import.";
    return;
  }

  const confirmed = window.confirm(
    `Import ${referralsToImport.length} referrals now? ` +
    `${latestReferralImportAnalysis.duplicateWarnings.length} duplicate warning(s) and ` +
    `${latestReferralImportAnalysis.householdWarnings.length} shared contact warning(s) will not block the import.`
  );

  if (!confirmed) {
    return;
  }

  confirmReferralImportButton.disabled = true;
  referralsStatusEl.textContent = "Importing referrals...";

  try {
    const response = await authedFetch("/api/referrals/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ referrals: referralsToImport })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const result = await response.json();
    referralsStatusEl.textContent = `Imported ${result.importedCount} referrals${result.skipped?.length ? `; skipped ${result.skipped.length}` : ""}.`;
    latestReferralImportAnalysis = null;
    confirmReferralImportButton.hidden = true;
    await loadReferrals();
    closeReferralImportModal();
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not import referrals yet.";
    console.error(error);
  } finally {
    confirmReferralImportButton.disabled = false;
  }
}

async function previewReferralCsv(file) {
  if (!file) {
    return;
  }

  referralsStatusEl.textContent = `Previewing ${file.name}...`;

  try {
    const text = await file.text();
    const parsed = parseCsv(text);

    if (parsed.length < 2) {
      throw new Error("The CSV does not contain any referral rows.");
    }

    const columns = parsed[0].map((column) => column.trim());
    const rows = parsed.slice(1).map((values) =>
      Object.fromEntries(columns.map((column, index) => [column, values[index] || ""]))
    );
    const analysis = analyzeReferralImport(rows, columns);
    latestReferralImportAnalysis = analysis;
    renderReferralImportPreview(analysis, file.name);
    openReferralImportModal();
    referralsStatusEl.textContent = "Referral import preview ready.";
  } catch (error) {
    latestReferralImportAnalysis = null;
    confirmReferralImportButton.hidden = true;
    referralsStatusEl.textContent = error.message || "Could not preview this CSV.";
    referralImportDetail.innerHTML = "";
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = error.message || "Could not preview this CSV.";
    referralImportDetail.append(message);
    openReferralImportModal();
    console.error(error);
  } finally {
    referralCsvInput.value = "";
  }
}

async function importPreviewedNetworkEntries() {
  if (!latestNetworkImportAnalysis) {
    networkStatusEl.textContent = "Preview a CSV before importing providers.";
    return;
  }

  if (!latestNetworkImportAnalysis.entries.length) {
    networkStatusEl.textContent = "No valid provider rows are ready to import.";
    return;
  }

  const providerCount = latestNetworkImportAnalysis.entries.reduce((total, entry) => total + entry.providers.length, 0);
  const confirmed = window.confirm(
    `Import ${latestNetworkImportAnalysis.entries.length} organizations and ${providerCount} providers now? Existing organizations with the same name will be updated.`
  );

  if (!confirmed) {
    return;
  }

  confirmNetworkImportButton.disabled = true;
  networkStatusEl.textContent = "Importing providers...";

  try {
    const response = await authedFetch("/api/referral-network/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ entries: latestNetworkImportAnalysis.entries })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const result = await response.json();
    networkStatusEl.textContent = `Imported ${result.createdCount} organizations, updated ${result.updatedCount}, and added ${result.providerCount} providers.`;
    latestNetworkImportAnalysis = null;
    confirmNetworkImportButton.hidden = true;
    await loadReferralNetwork();
    closeNetworkImportModal();
  } catch (error) {
    networkStatusEl.textContent = error.message || "Could not import providers yet.";
    console.error(error);
  } finally {
    confirmNetworkImportButton.disabled = false;
  }
}

async function previewNetworkCsv(file) {
  if (!file) {
    return;
  }

  networkStatusEl.textContent = `Previewing ${file.name}...`;

  try {
    const text = await file.text();
    const parsed = parseCsv(text);

    if (parsed.length < 2) {
      throw new Error("The CSV does not contain any provider rows.");
    }

    const columns = parsed[0].map((column) => column.trim());
    const rows = parsed.slice(1).map((values) =>
      Object.fromEntries(columns.map((column, index) => [column, values[index] || ""]))
    );
    const analysis = analyzeNetworkImport(rows, columns);
    latestNetworkImportAnalysis = analysis;
    renderNetworkImportPreview(analysis, file.name);
    openNetworkImportModal();
    networkStatusEl.textContent = "Provider import preview ready.";
  } catch (error) {
    latestNetworkImportAnalysis = null;
    confirmNetworkImportButton.hidden = true;
    networkStatusEl.textContent = error.message || "Could not preview this CSV.";
    networkImportDetail.innerHTML = "";
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = error.message || "Could not preview this CSV.";
    networkImportDetail.append(message);
    openNetworkImportModal();
    console.error(error);
  } finally {
    networkCsvInput.value = "";
  }
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
    loadedReferrals = data.referrals.filter((referral) => !referral.convertedClientId);
    renderReferralSummary();
    renderReferrals();
    renderDashboard();
    renderDailyWorkflow();
    renderReferralSourceOptions();
    if (!referralModal.hidden && selectedReferralId) {
      renderReferralDetail();
    }
    setReferralsLoadedStatus();
  } catch (error) {
    referralsStatusEl.textContent = "Could not load referrals yet.";
    console.error(error);
  }
}

async function loadClients() {
  if (!currentUser) {
    clientsStatusEl.textContent = "";
    clientsList.innerHTML = "";
    clientDetail.innerHTML = "";
    return;
  }

  clientsStatusEl.textContent = "Loading clients...";

  try {
    const response = await authedFetch("/api/clients");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedClients = data.clients;
    renderClientSummary();
    renderClients();
    renderDashboard();
    renderDailyWorkflow();
    if (!clientModal.hidden && selectedClientId) {
      renderClientDetail();
    }
    setClientsLoadedStatus();
  } catch (error) {
    clientsStatusEl.textContent = "Could not load clients yet.";
    console.error(error);
  }
}

async function loadReferralNetwork() {
  if (!currentUser) {
    networkStatusEl.textContent = "";
    networkList.innerHTML = "";
    networkDetail.innerHTML = "";
    return;
  }

  networkStatusEl.textContent = "Loading referral network...";

  try {
    const response = await authedFetch("/api/referral-network");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedNetworkEntries = data.entries;
    renderReferralNetwork();
    renderReferralSourceOptions();
    if (!networkModal.hidden && selectedNetworkEntryId) {
      renderNetworkDetail();
    }
    networkStatusEl.textContent = "";
  } catch (error) {
    networkStatusEl.textContent = "Could not load referral network yet.";
    console.error(error);
  }
}

async function loadOutreachEvents() {
  if (!currentUser) {
    outreachStatusEl.textContent = "";
    outreachList.innerHTML = "";
    outreachDetail.innerHTML = "";
    outreachSummary.innerHTML = "";
    return;
  }

  outreachStatusEl.textContent = "Loading outreach events...";

  try {
    const response = await authedFetch("/api/outreach-events");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedOutreachEvents = data.events;
    renderOutreachEvents();
    renderOutreachEventOptions(outreachContactEventSelect.value);
    renderOutreachDashboard();
    renderDailyWorkflow();
    if (!outreachModal.hidden && selectedOutreachEventId) {
      renderOutreachDetail();
    }
    outreachStatusEl.textContent = "";
  } catch (error) {
    outreachStatusEl.textContent = "Could not load outreach events yet.";
    console.error(error);
  }
}

async function loadOutreachContacts() {
  if (!currentUser) {
    outreachContactStatusEl.textContent = "";
    outreachContactList.innerHTML = "";
    outreachContactDetail.innerHTML = "";
    return;
  }

  outreachContactStatusEl.textContent = "Loading outreach contacts...";

  try {
    const response = await authedFetch("/api/outreach-contacts");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedOutreachContacts = data.contacts;
    renderOutreachContacts();
    renderOutreachDashboard();
    renderDailyWorkflow();
    if (!outreachContactModal.hidden && selectedOutreachContactId) {
      renderOutreachContactDetail();
    }
    outreachContactStatusEl.textContent = "";
  } catch (error) {
    outreachContactStatusEl.textContent = "Could not load outreach contacts yet.";
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
    syncModalCloseButton();
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
  renderReferralSourceOptions();
  formTitle.textContent = "New Referral";
  saveReferralButton.textContent = "Save referral";
  cancelEditButton.hidden = false;
  referralForm.hidden = false;
  referralDetail.hidden = true;
  syncModalCloseButton();
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
  referralForm.elements.status.value = normalizeStatus(referral.status);
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
  renderReferralSourceOptions();
  formTitle.textContent = `Edit ${referralName(referral)}`;
  saveReferralButton.textContent = "Update referral";
  cancelEditButton.hidden = false;
  referralForm.hidden = false;
  referralDetail.hidden = true;
  syncModalCloseButton();
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
  syncModalCloseButton();
  renderReferralDetail();
}

function setClientFormValues(client = {}) {
  clientForm.elements.firstName.value = client.firstName || "";
  clientForm.elements.lastName.value = client.lastName || "";
  clientForm.elements.parentName.value = client.parentName || "";
  clientForm.elements.phone.value = client.phone || "";
  clientForm.elements.email.value = client.email || "";
  clientForm.elements.preferredLanguage.value = client.preferredLanguage || "English";
  clientForm.elements.status.value = client.status || "Scheduled";
  clientForm.elements.preferredContactMethod.value = client.preferredContactMethod || "";
  clientForm.elements.referralType.value = client.referralType || "";
  clientForm.elements.referralSource.value = client.referralSource || "";
  clientForm.elements.dateOfBirth.value = client.dateOfBirth || "";
  clientForm.elements.gender.value = client.gender || "Unspecified";
  clientForm.elements.ycco.value = client.ycco || "";
  clientForm.elements.assessmentScore.value = client.assessmentScore ?? "";
  clientForm.elements.willingnessScore.value = client.willingnessScore ?? "";
  clientForm.elements.referralDate.value = client.referralDate || "";
  clientForm.elements.firstContactDate.value = client.firstContactDate || "";
  clientForm.elements.mostRecentContactDate.value = client.mostRecentContactDate || "";
  clientForm.elements.firstAppointmentDate.value = client.firstAppointmentDate || "";
  clientForm.elements.lastAppointmentDate.value = client.lastAppointmentDate || "";
  clientForm.elements.addressStreet.value = client.addressStreet || "";
  clientForm.elements.addressCity.value = client.addressCity || "";
  clientForm.elements.addressState.value = client.addressState || "";
  clientForm.elements.addressZip.value = client.addressZip || "";
  clientForm.elements.emailOptOut.checked = Boolean(client.emailOptOut);
  clientForm.elements.textOptOut.checked = Boolean(client.textOptOut);
  clientForm.elements.notes.value = client.notes || "";
}

async function saveClient(event) {
  event.preventDefault();

  if (!currentUser) {
    clientsStatusEl.textContent = "Sign in before saving a client.";
    return;
  }

  const formData = new FormData(clientForm);
  const client = Object.fromEntries(formData.entries());
  client.emailOptOut = clientForm.elements.emailOptOut.checked;
  client.textOptOut = clientForm.elements.textOptOut.checked;
  const isEditing = Boolean(editingClientId);

  clientsStatusEl.textContent = isEditing ? "Updating client..." : "Saving client...";
  saveClientButton.disabled = true;

  try {
    const path = isEditing ? `/api/clients/${encodeURIComponent(editingClientId)}` : "/api/clients";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(client)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedClientId = data.client?.id || editingClientId;
    editingClientId = null;
    clientForm.reset();
    clientsStatusEl.textContent = isEditing ? "Client updated." : "Client saved.";
    await loadClients();
    clientForm.hidden = true;
    clientDetail.hidden = false;
    renderClientDetail();
  } catch (error) {
    clientsStatusEl.textContent = error.message || "Could not save client yet.";
    console.error(error);
  } finally {
    saveClientButton.disabled = false;
  }
}

async function saveNetworkEntry(event) {
  event.preventDefault();

  if (!currentUser) {
    networkStatusEl.textContent = "Sign in before saving a network entry.";
    return;
  }

  const formData = new FormData(networkForm);
  const entry = Object.fromEntries(formData.entries());
  entry.type = normalizeNetworkType(entry.type);
  const isEditing = Boolean(editingNetworkEntryId);

  networkStatusEl.textContent = isEditing ? "Updating network entry..." : "Saving network entry...";
  saveNetworkEntryButton.disabled = true;

  try {
    const path = isEditing ? `/api/referral-network/${encodeURIComponent(editingNetworkEntryId)}` : "/api/referral-network";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedNetworkEntryId = data.entry?.id || editingNetworkEntryId;
    networkForm.reset();
    networkStatusEl.textContent = isEditing ? "Network entry updated." : "Network entry saved.";
    await loadReferralNetwork();
    networkForm.hidden = true;
    networkDetail.hidden = false;
    renderNetworkDetail();
  } catch (error) {
    networkStatusEl.textContent = error.message || "Could not save network entry yet.";
    console.error(error);
  } finally {
    saveNetworkEntryButton.disabled = false;
  }
}

async function saveOutreachEvent(event) {
  event.preventDefault();

  if (!currentUser) {
    outreachStatusEl.textContent = "Sign in before saving an outreach event.";
    return;
  }

  const formData = new FormData(outreachForm);
  const outreachEvent = Object.fromEntries(formData.entries());
  const isEditing = Boolean(editingOutreachEventId);

  outreachStatusEl.textContent = isEditing ? "Updating outreach event..." : "Saving outreach event...";
  saveOutreachEventButton.disabled = true;

  try {
    const path = isEditing ? `/api/outreach-events/${encodeURIComponent(editingOutreachEventId)}` : "/api/outreach-events";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(outreachEvent)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedOutreachEventId = data.event?.id || editingOutreachEventId;
    editingOutreachEventId = null;
    outreachForm.reset();
    outreachStatusEl.textContent = isEditing ? "Outreach event updated." : "Outreach event saved.";
    await loadOutreachEvents();
    outreachForm.hidden = true;
    outreachDetail.hidden = false;
    renderOutreachDetail();
  } catch (error) {
    outreachStatusEl.textContent = error.message || "Could not save outreach event yet.";
    console.error(error);
  } finally {
    saveOutreachEventButton.disabled = false;
  }
}

async function saveOutreachContact(event) {
  event.preventDefault();

  if (!currentUser) {
    outreachContactStatusEl.textContent = "Sign in before saving an outreach contact.";
    return;
  }

  const formData = new FormData(outreachContactForm);
  const contact = Object.fromEntries(formData.entries());
  const isEditing = Boolean(editingOutreachContactId);

  outreachContactStatusEl.textContent = isEditing ? "Updating outreach contact..." : "Saving outreach contact...";
  saveOutreachContactButton.disabled = true;

  try {
    const path = isEditing ? `/api/outreach-contacts/${encodeURIComponent(editingOutreachContactId)}` : "/api/outreach-contacts";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contact)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedOutreachContactId = data.contact?.id || editingOutreachContactId;
    editingOutreachContactId = null;
    outreachContactForm.reset();
    outreachContactStatusEl.textContent = isEditing ? "Outreach contact updated." : "Outreach contact saved.";
    await loadOutreachContacts();
    outreachContactForm.hidden = true;
    outreachContactDetail.hidden = false;
    renderOutreachContactDetail();
  } catch (error) {
    outreachContactStatusEl.textContent = error.message || "Could not save outreach contact yet.";
    console.error(error);
  } finally {
    saveOutreachContactButton.disabled = false;
  }
}

async function saveNetworkProviders(entry, providers) {
  networkStatusEl.textContent = "Updating providers...";

  try {
    const response = await authedFetch(`/api/referral-network/${encodeURIComponent(entry.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ providers })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedNetworkEntryId = entry.id;
    networkStatusEl.textContent = "Providers updated.";
    await loadReferralNetwork();
    renderNetworkDetail();
  } catch (error) {
    networkStatusEl.textContent = error.message || "Could not update providers yet.";
    console.error(error);
    await loadReferralNetwork();
  }
}

function addNetworkProvider(event, entry) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const provider = Object.fromEntries(formData.entries());
  const providers = [...(entry.providers || []), provider];
  event.currentTarget.reset();
  saveNetworkProviders(entry, providers);
}

function removeNetworkProvider(entry, providerId) {
  const providers = (entry.providers || []).filter((provider) => provider.id !== providerId);
  saveNetworkProviders(entry, providers);
}

function startNewNetworkEntry() {
  editingNetworkEntryId = null;
  selectedNetworkEntryId = null;
  networkForm.reset();
  networkFormTitle.textContent = "New Organization";
  saveNetworkEntryButton.textContent = "Save entry";
  cancelNetworkEditButton.hidden = false;
  networkForm.hidden = false;
  networkDetail.hidden = true;
  openNetworkModal();
  networkStatusEl.textContent = "Creating a new network entry.";
}

function startEditingNetworkEntry(entry) {
  editingNetworkEntryId = entry.id;
  selectedNetworkEntryId = entry.id;
  networkForm.elements.name.value = entry.name || "";
  networkForm.elements.type.value = normalizeNetworkType(entry.type);
  networkForm.elements.contactName.value = entry.contactName || "";
  networkForm.elements.phone.value = entry.phone || "";
  networkForm.elements.email.value = entry.email || "";
  networkForm.elements.website.value = entry.website || "";
  networkForm.elements.notes.value = entry.notes || "";
  networkFormTitle.textContent = `Edit ${networkEntryName(entry)}`;
  saveNetworkEntryButton.textContent = "Update entry";
  cancelNetworkEditButton.hidden = false;
  networkForm.hidden = false;
  networkDetail.hidden = true;
  openNetworkModal();
  networkStatusEl.textContent = `Editing ${networkEntryName(entry)}.`;
}

function stopEditingNetworkEntry() {
  editingNetworkEntryId = null;
  networkForm.reset();
  networkForm.hidden = true;
  networkDetail.hidden = false;
  renderNetworkDetail();
}

async function deleteNetworkEntry(entry) {
  const confirmed = window.confirm(`Delete ${networkEntryName(entry)}? This cannot be undone.`);

  if (!confirmed) {
    return;
  }

  networkStatusEl.textContent = "Deleting network entry...";

  try {
    const response = await authedFetch(`/api/referral-network/${encodeURIComponent(entry.id)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedNetworkEntryId = null;
    closeNetworkModal();
    networkStatusEl.textContent = "Network entry deleted.";
    await loadReferralNetwork();
  } catch (error) {
    networkStatusEl.textContent = error.message || "Could not delete network entry yet.";
    console.error(error);
  }
}

function setOutreachFormValues(event = {}) {
  outreachForm.elements.name.value = event.name || "";
  outreachForm.elements.type.value = event.type || "Outreach Event";
  outreachForm.elements.eventDate.value = event.eventDate || "";
  outreachForm.elements.repeatPattern.value = event.repeatPattern || "";
  outreachForm.elements.location.value = event.location || "";
  outreachForm.elements.contactName.value = event.contactName || "";
  outreachForm.elements.contactRole.value = event.contactRole || "";
  outreachForm.elements.phone.value = event.phone || "";
  outreachForm.elements.email.value = event.email || "";
  outreachForm.elements.interactionsCount.value = event.interactionsCount ?? "";
  outreachForm.elements.referralsCount.value = event.referralsCount ?? "";
  outreachForm.elements.interestListCount.value = event.interestListCount ?? "";
  outreachForm.elements.participantListCount.value = event.participantListCount ?? "";
  outreachForm.elements.notes.value = event.notes || "";
}

function startNewOutreachEvent() {
  editingOutreachEventId = null;
  selectedOutreachEventId = null;
  outreachForm.reset();
  setOutreachFormValues({ type: "Outreach Event" });
  outreachFormTitle.textContent = "New Event";
  saveOutreachEventButton.textContent = "Save event";
  cancelOutreachEditButton.hidden = false;
  outreachForm.hidden = false;
  outreachDetail.hidden = true;
  openOutreachModal();
  outreachStatusEl.textContent = "Creating a new outreach event.";
}

function startEditingOutreachEvent(event) {
  editingOutreachEventId = event.id;
  selectedOutreachEventId = event.id;
  setOutreachFormValues(event);
  outreachFormTitle.textContent = `Edit ${outreachEventName(event)}`;
  saveOutreachEventButton.textContent = "Update event";
  cancelOutreachEditButton.hidden = false;
  outreachForm.hidden = false;
  outreachDetail.hidden = true;
  openOutreachModal();
  outreachStatusEl.textContent = `Editing ${outreachEventName(event)}.`;
}

function stopEditingOutreachEvent() {
  editingOutreachEventId = null;
  outreachFormTitle.textContent = "New Event";
  saveOutreachEventButton.textContent = "Save event";
  cancelOutreachEditButton.hidden = true;
  outreachForm.hidden = true;
  outreachDetail.hidden = false;
  renderOutreachDetail();
}

async function deleteOutreachEvent(event) {
  const confirmed = window.confirm(`Delete ${outreachEventName(event)}? This cannot be undone.`);

  if (!confirmed) {
    return;
  }

  outreachStatusEl.textContent = "Deleting outreach event...";

  try {
    const response = await authedFetch(`/api/outreach-events/${encodeURIComponent(event.id)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedOutreachEventId = null;
    closeOutreachModal();
    outreachStatusEl.textContent = "Outreach event deleted.";
    await loadOutreachEvents();
  } catch (error) {
    outreachStatusEl.textContent = error.message || "Could not delete outreach event yet.";
    console.error(error);
  }
}

function setOutreachContactFormValues(contact = {}) {
  renderOutreachEventOptions(contact.eventId || "");
  outreachContactForm.elements.eventId.value = contact.eventId || "";
  outreachContactForm.elements.contactName.value = contact.contactName || "";
  outreachContactForm.elements.childName.value = contact.childName || "";
  outreachContactForm.elements.phone.value = contact.phone || "";
  outreachContactForm.elements.email.value = contact.email || "";
  outreachContactForm.elements.preferredLanguage.value = contact.preferredLanguage || "";
  outreachContactForm.elements.interestType.value = contact.interestType || "";
  outreachContactForm.elements.status.value = contact.status || "New";
  outreachContactForm.elements.notes.value = contact.notes || "";
}

function startNewOutreachContact() {
  editingOutreachContactId = null;
  selectedOutreachContactId = null;
  outreachContactForm.reset();
  setOutreachContactFormValues({ status: "New", eventId: selectedOutreachEventId || "" });
  outreachContactFormTitle.textContent = "New Contact";
  saveOutreachContactButton.textContent = "Save contact";
  cancelOutreachContactEditButton.hidden = false;
  outreachContactForm.hidden = false;
  outreachContactDetail.hidden = true;
  openOutreachContactModal();
  outreachContactStatusEl.textContent = "Creating a new outreach contact.";
}

function startEditingOutreachContact(contact) {
  editingOutreachContactId = contact.id;
  selectedOutreachContactId = contact.id;
  setOutreachContactFormValues(contact);
  outreachContactFormTitle.textContent = `Edit ${outreachContactName(contact)}`;
  saveOutreachContactButton.textContent = "Update contact";
  cancelOutreachContactEditButton.hidden = false;
  outreachContactForm.hidden = false;
  outreachContactDetail.hidden = true;
  openOutreachContactModal();
  outreachContactStatusEl.textContent = `Editing ${outreachContactName(contact)}.`;
}

function stopEditingOutreachContact() {
  editingOutreachContactId = null;
  outreachContactFormTitle.textContent = "New Contact";
  saveOutreachContactButton.textContent = "Save contact";
  cancelOutreachContactEditButton.hidden = true;
  outreachContactForm.hidden = true;
  outreachContactDetail.hidden = false;
  renderOutreachContactDetail();
}

async function deleteOutreachContact(contact) {
  const confirmed = window.confirm(`Delete ${outreachContactName(contact)}? This cannot be undone.`);

  if (!confirmed) {
    return;
  }

  outreachContactStatusEl.textContent = "Deleting outreach contact...";

  try {
    const response = await authedFetch(`/api/outreach-contacts/${encodeURIComponent(contact.id)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedOutreachContactId = null;
    closeOutreachContactModal();
    outreachContactStatusEl.textContent = "Outreach contact deleted.";
    await loadOutreachContacts();
  } catch (error) {
    outreachContactStatusEl.textContent = error.message || "Could not delete outreach contact yet.";
    console.error(error);
  }
}

function startNewClient() {
  editingClientId = null;
  selectedClientId = null;
  clientForm.reset();
  setClientFormValues({ status: "Scheduled", preferredLanguage: "English", gender: "Unspecified" });
  clientFormTitle.textContent = "New Client";
  saveClientButton.textContent = "Save client";
  cancelClientEditButton.hidden = false;
  clientForm.hidden = false;
  clientDetail.hidden = true;
  openClientModal();
  clientsStatusEl.textContent = "Creating a new client.";
}

function startEditingClient(client) {
  editingClientId = client.id;
  selectedClientId = client.id;
  setClientFormValues(client);
  clientFormTitle.textContent = `Edit ${clientName(client)}`;
  saveClientButton.textContent = "Update client";
  cancelClientEditButton.hidden = false;
  clientForm.hidden = false;
  clientDetail.hidden = true;
  openClientModal();
  clientsStatusEl.textContent = `Editing ${clientName(client)}.`;
}

function stopEditingClient() {
  editingClientId = null;
  clientFormTitle.textContent = "New Client";
  saveClientButton.textContent = "Save client";
  cancelClientEditButton.hidden = true;
  clientForm.hidden = true;
  clientDetail.hidden = false;
  renderClientDetail();
}

async function deleteClient(client) {
  const name = clientName(client);
  const confirmed = window.confirm(`Delete client ${name}?`);

  if (!confirmed) {
    return;
  }

  clientsStatusEl.textContent = "Deleting client...";

  try {
    const response = await authedFetch(`/api/clients/${encodeURIComponent(client.id)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    if (selectedClientId === client.id) {
      selectedClientId = null;
    }

    await loadClients();
    closeClientModal();
    clientsStatusEl.textContent = "Client deleted.";
  } catch (error) {
    clientsStatusEl.textContent = error.message || "Could not delete client yet.";
    console.error(error);
  }
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
      const shouldConvert = window.confirm("This referral is now Scheduled. Convert this referral to a Client now?");

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

async function updateClientStatus(client, status) {
  clientsStatusEl.textContent = "Updating client status...";

  try {
    const response = await authedFetch(`/api/clients/${encodeURIComponent(client.id)}`, {
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

    selectedClientId = client.id;
    clientsStatusEl.textContent = "Client status updated.";
    await loadClients();
  } catch (error) {
    clientsStatusEl.textContent = error.message || "Could not update client status yet.";
    console.error(error);
    await loadClients();
  }
}

async function updateInlineDate(record, moduleName, fieldName, value) {
  const isClient = moduleName === "clients";
  const statusElement = isClient ? clientsStatusEl : referralsStatusEl;
  statusElement.textContent = "Updating date...";

  try {
    const response = await authedFetch(`/api/${moduleName}/${encodeURIComponent(record.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ [fieldName]: value })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    if (isClient) {
      selectedClientId = record.id;
      statusElement.textContent = "Client date updated.";
      await loadClients();
      return;
    }

    selectedReferralId = record.id;
    statusElement.textContent = "Referral date updated.";
    await loadReferrals();
  } catch (error) {
    statusElement.textContent = error.message || "Could not update date yet.";
    console.error(error);

    if (isClient) {
      await loadClients();
      return;
    }

    await loadReferrals();
  }
}

async function saveProviderLinks(record, moduleName, providerLinks) {
  const isClient = moduleName === "clients";
  const statusElement = isClient ? clientsStatusEl : referralsStatusEl;
  statusElement.textContent = "Updating providers...";

  try {
    const response = await authedFetch(`/api/${moduleName}/${encodeURIComponent(record.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ providerLinks })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    if (isClient) {
      selectedClientId = record.id;
      statusElement.textContent = "Providers updated.";
      await loadClients();
      return;
    }

    selectedReferralId = record.id;
    statusElement.textContent = "Providers updated.";
    await loadReferrals();
  } catch (error) {
    statusElement.textContent = error.message || "Could not update providers yet.";
    console.error(error);
    if (isClient) {
      await loadClients();
      return;
    }
    await loadReferrals();
  }
}

function addProviderLink(record, moduleName, link) {
  saveProviderLinks(record, moduleName, [...(record.providerLinks || []), link]);
}

function removeProviderLink(record, moduleName, link) {
  const providerLinks = (record.providerLinks || []).filter(
    (item) => item.networkId !== link.networkId || item.providerId !== link.providerId
  );
  saveProviderLinks(record, moduleName, providerLinks);
}

async function addSibling(moduleName, recordId, siblingId) {
  const statusElement = moduleName === "clients" ? clientsStatusEl : referralsStatusEl;
  statusElement.textContent = "Linking siblings...";

  try {
    const response = await authedFetch(`/api/${moduleName}/${encodeURIComponent(recordId)}/siblings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ siblingId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    statusElement.textContent = "Sibling linked.";

    if (moduleName === "clients") {
      selectedClientId = recordId;
      await loadClients();
      renderClientDetail();
    } else {
      selectedReferralId = recordId;
      await loadReferrals();
      renderReferralDetail();
    }
  } catch (error) {
    statusElement.textContent = error.message || "Could not link siblings yet.";
    console.error(error);
  }
}

async function removeSibling(moduleName, recordId, siblingId) {
  const statusElement = moduleName === "clients" ? clientsStatusEl : referralsStatusEl;
  statusElement.textContent = "Removing sibling link...";

  try {
    const response = await authedFetch(
      `/api/${moduleName}/${encodeURIComponent(recordId)}/siblings/${encodeURIComponent(siblingId)}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    statusElement.textContent = "Sibling link removed.";

    if (moduleName === "clients") {
      selectedClientId = recordId;
      await loadClients();
      renderClientDetail();
    } else {
      selectedReferralId = recordId;
      await loadReferrals();
      renderReferralDetail();
    }
  } catch (error) {
    statusElement.textContent = error.message || "Could not remove sibling link yet.";
    console.error(error);
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
    selectedReferralId = null;
    selectedClientId = data.client?.id || null;
    referralsStatusEl.textContent = "Referral converted to client.";
    await loadReferrals();
    await loadClients();
    closeReferralModal();
    activeCrmView = "clients";
    setActiveModule("crm");

    if (selectedClientId) {
      openClientModal();
      renderClientDetail();
    }
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
  dailyWorkflowPanel.hidden = !signedIn;
  dashboardPanel.hidden = true;
  referralsPanel.hidden = true;
  clientsPanel.hidden = true;
  referralNetworkPanel.hidden = true;
  outreachPanel.hidden = true;
  crmModuleTabs.hidden = true;
  userEl.textContent = signedIn ? `Signed in as ${user.email}` : "Please sign in with your SNACK Google account.";

  if (signedIn) {
    setActiveModule(activeModule);
    loadMessage();
    loadReferrals();
    loadClients();
    loadReferralNetwork();
    loadOutreachEvents();
    loadOutreachContacts();
  } else {
    messageEl.textContent = "";
    statusEl.textContent = "Sign in to load the database message.";
    referralsStatusEl.textContent = "";
    clientsStatusEl.textContent = "";
    networkStatusEl.textContent = "";
    outreachStatusEl.textContent = "";
    outreachContactStatusEl.textContent = "";
    referralsList.innerHTML = "";
    clientsList.innerHTML = "";
    networkList.innerHTML = "";
    outreachList.innerHTML = "";
    outreachContactList.innerHTML = "";
    dailyWorkflowSummary.innerHTML = "";
    dailyPriorityList.innerHTML = "";
    dailyAppointmentsList.innerHTML = "";
    dailyOutreachList.innerHTML = "";
    dailyDataList.innerHTML = "";
    dashboardSummary.innerHTML = "";
    dashboardFollowups.innerHTML = "";
    dashboardNewReferrals.innerHTML = "";
    dashboardScheduled.innerHTML = "";
    dashboardNoNext.innerHTML = "";
    referralSummary.innerHTML = "";
    clientSummary.innerHTML = "";
    referralDetail.innerHTML = "";
    clientDetail.innerHTML = "";
    networkDetail.innerHTML = "";
    outreachDetail.innerHTML = "";
    outreachContactDetail.innerHTML = "";
    outreachSummary.innerHTML = "";
    selectedReferralId = null;
    selectedClientId = null;
    selectedNetworkEntryId = null;
    selectedOutreachEventId = null;
    selectedOutreachContactId = null;
    loadedReferrals = [];
    loadedClients = [];
    loadedNetworkEntries = [];
    loadedOutreachEvents = [];
    loadedOutreachContacts = [];
    referralForm.reset();
    closeReferralModal();
    closeReferralImportModal();
    closeClientModal();
    closeNetworkImportModal();
    closeNetworkModal();
    closeOutreachModal();
    closeOutreachContactModal();
  }
});

navDailyWorkflowButton.addEventListener("click", () => setActiveModule("daily-workflow"));
navCrmButton.addEventListener("click", () => setActiveModule("crm"));
navOutreachButton.addEventListener("click", () => setActiveModule("outreach"));
crmTabDashboardButton.addEventListener("click", () => setCrmView("dashboard"));
crmTabReferralsButton.addEventListener("click", () => setCrmView("referrals"));
crmTabClientsButton.addEventListener("click", () => setCrmView("clients"));
crmTabReferralNetworkButton.addEventListener("click", () => setCrmView("referral-network"));
outreachTabDashboardButton.addEventListener("click", () => setOutreachView("dashboard"));
outreachTabEventsButton.addEventListener("click", () => setOutreachView("events"));
outreachTabContactsButton.addEventListener("click", () => setOutreachView("contacts"));
newReferralButton.addEventListener("click", startNewReferral);
newClientButton.addEventListener("click", startNewClient);
importReferralsButton.addEventListener("click", () => referralCsvInput.click());
referralCsvInput.addEventListener("change", () => previewReferralCsv(referralCsvInput.files?.[0]));
confirmReferralImportButton.addEventListener("click", importPreviewedReferrals);
importClientsButton.addEventListener("click", () => clientCsvInput.click());
clientCsvInput.addEventListener("change", () => previewClientCsv(clientCsvInput.files?.[0]));
confirmClientImportButton.addEventListener("click", importPreviewedClients);
importNetworkButton.addEventListener("click", () => networkCsvInput.click());
networkCsvInput.addEventListener("change", () => previewNetworkCsv(networkCsvInput.files?.[0]));
confirmNetworkImportButton.addEventListener("click", importPreviewedNetworkEntries);
newNetworkEntryButton.addEventListener("click", startNewNetworkEntry);
newOutreachEventButton.addEventListener("click", startNewOutreachEvent);
newOutreachContactButton.addEventListener("click", startNewOutreachContact);
referralForm.addEventListener("submit", saveReferral);
clientForm.addEventListener("submit", saveClient);
networkForm.addEventListener("submit", saveNetworkEntry);
outreachForm.addEventListener("submit", saveOutreachEvent);
outreachContactForm.addEventListener("submit", saveOutreachContact);
referralSourceInput.addEventListener("focus", renderReferralSourceOptions);
referralSourceInput.addEventListener("input", renderReferralSourceOptions);
clientReferralSourceInput.addEventListener("focus", renderReferralSourceOptions);
clientReferralSourceInput.addEventListener("input", renderReferralSourceOptions);
referralSearchInput.addEventListener("input", () => {
  renderReferralSummary();
  renderReferrals();
});
statusFilterSelect.addEventListener("change", () => {
  summaryFilter = "all";
  renderReferralSummary();
  renderReferrals();
});
sortReferralsSelect.addEventListener("change", renderReferrals);
clientSearchInput.addEventListener("input", () => {
  renderClientSummary();
  renderClients();
});
clientStatusFilterSelect.addEventListener("change", () => {
  clientSummaryFilter = "all";
  renderClientSummary();
  renderClients();
});
sortClientsSelect.addEventListener("change", renderClients);
networkSearchInput.addEventListener("input", renderReferralNetwork);
outreachSearchInput.addEventListener("input", renderOutreachEvents);
outreachContactSearchInput.addEventListener("input", renderOutreachContacts);
cancelEditButton.addEventListener("click", () => {
  referralForm.reset();
  if (selectedReferralId) {
    stopEditingReferral();
    setReferralsLoadedStatus();
    return;
  }
  closeReferralModal();
});
cancelClientEditButton.addEventListener("click", () => {
  clientForm.reset();
  if (selectedClientId) {
    stopEditingClient();
    setClientsLoadedStatus();
    return;
  }
  closeClientModal();
});
cancelNetworkEditButton.addEventListener("click", () => {
  networkForm.reset();
  if (selectedNetworkEntryId) {
    stopEditingNetworkEntry();
    networkStatusEl.textContent = "";
    return;
  }
  closeNetworkModal();
});
cancelOutreachEditButton.addEventListener("click", () => {
  outreachForm.reset();
  if (selectedOutreachEventId) {
    stopEditingOutreachEvent();
    outreachStatusEl.textContent = "";
    return;
  }
  closeOutreachModal();
});
cancelOutreachContactEditButton.addEventListener("click", () => {
  outreachContactForm.reset();
  if (selectedOutreachContactId) {
    stopEditingOutreachContact();
    outreachContactStatusEl.textContent = "";
    return;
  }
  closeOutreachContactModal();
});
closeReferralModalButton.addEventListener("click", closeReferralModal);
closeReferralImportButton.addEventListener("click", closeReferralImportModal);
closeClientImportButton.addEventListener("click", closeClientImportModal);
closeNetworkImportButton.addEventListener("click", closeNetworkImportModal);
referralModal.addEventListener("click", (event) => {
  if (event.target === referralModal) {
    closeReferralModal();
  }
});
clientModal.addEventListener("click", (event) => {
  if (event.target === clientModal) {
    closeClientModal();
  }
});
clientImportModal.addEventListener("click", (event) => {
  if (event.target === clientImportModal) {
    closeClientImportModal();
  }
});
referralImportModal.addEventListener("click", (event) => {
  if (event.target === referralImportModal) {
    closeReferralImportModal();
  }
});
networkImportModal.addEventListener("click", (event) => {
  if (event.target === networkImportModal) {
    closeNetworkImportModal();
  }
});
networkModal.addEventListener("click", (event) => {
  if (event.target === networkModal) {
    closeNetworkModal();
  }
});
outreachModal.addEventListener("click", (event) => {
  if (event.target === outreachModal) {
    closeOutreachModal();
  }
});
outreachContactModal.addEventListener("click", (event) => {
  if (event.target === outreachContactModal) {
    closeOutreachContactModal();
  }
});
document.addEventListener("click", (event) => {
  for (const menu of document.querySelectorAll(".columns-menu[open]")) {
    if (!menu.contains(event.target)) {
      menu.open = false;
    }
  }
});
