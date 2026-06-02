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
const signedOutPanel = document.querySelector("#signed-out-panel");
const dashboardPanel = document.querySelector("#dashboard-panel");
const referralsPanel = document.querySelector("#referrals-panel");
const clientsPanel = document.querySelector("#clients-panel");
const navDashboardButton = document.querySelector("#nav-dashboard");
const navReferralsButton = document.querySelector("#nav-referrals");
const navClientsButton = document.querySelector("#nav-clients");
const dashboardSummary = document.querySelector("#dashboard-summary");
const dashboardFollowups = document.querySelector("#dashboard-followups");
const dashboardNewReferrals = document.querySelector("#dashboard-new-referrals");
const dashboardScheduled = document.querySelector("#dashboard-scheduled");
const dashboardNoNext = document.querySelector("#dashboard-no-next");
const dashboardOldestFollowups = document.querySelector("#dashboard-oldest-followups");
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
const referralSummary = document.querySelector("#referral-summary");
const referralDetail = document.querySelector("#referral-detail");
const referralModal = document.querySelector("#referral-modal");
const closeReferralModalButton = document.querySelector("#close-referral-modal");
const referralSourceInput = document.querySelector("#referral-source");
const referralSourceOptions = document.querySelector("#referral-source-options");
const clientsList = document.querySelector("#clients-list");
const clientsTableHead = document.querySelector("#clients-table-head");
const clientsStatusEl = document.querySelector("#clients-status");
const clientSearchInput = document.querySelector("#client-search");
const clientStatusFilterSelect = document.querySelector("#client-status-filter");
const sortClientsSelect = document.querySelector("#sort-clients");
const clientColumnOptions = document.querySelector("#client-column-options");
const newClientButton = document.querySelector("#new-client");
const clientSummary = document.querySelector("#client-summary");
const clientModal = document.querySelector("#client-modal");
const clientDetail = document.querySelector("#client-detail");
const clientForm = document.querySelector("#client-form");
const clientFormTitle = document.querySelector("#client-form-title");
const saveClientButton = document.querySelector("#save-client");
const cancelClientEditButton = document.querySelector("#cancel-client-edit");

const app = initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
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
  { key: "follow-up", label: "Follow Up", statuses: ["Needs Reschedule", "Needs Language Support", "Waiting on Family"] },
  { key: "graduated", label: "Graduated", statuses: ["Graduated"] },
  { key: "closed", label: "Closed", statuses: ["Inactive", "Closed"] }
];
const clientStatusGroupColors = {
  Scheduled: "scheduled",
  Active: "new",
  "Needs Reschedule": "new",
  "Needs Language Support": "follow-up",
  "Waiting on Family": "follow-up",
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
    { key: "lastAppointment", label: "Last Appointment", width: 160, render: (client) => formatListDate(client.lastAppointmentDate), muted: true },
    { key: "name", label: "Client Name", width: 190, render: clientName, strong: true },
    { key: "phone", label: "Phone", width: 150, render: (client) => formatPhone(client.phone), muted: true },
    { key: "language", label: "Language", width: 130, render: (client) => client.preferredLanguage || "" },
    { key: "caregiver", label: "Caregiver", width: 180, render: (client) => client.parentName || "", muted: true },
    { key: "email", label: "Email", width: 230, render: (client) => client.email || "", muted: true }
  ]
};
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
let loadedReferrals = [];
let loadedClients = [];
let summaryFilter = "all";
let clientSummaryFilter = "all";
let activeModule = "dashboard";

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

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  const normalized = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (normalized.length !== 10) {
    return value || "";
  }

  return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
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
  return [client.firstAppointmentDate, client.lastAppointmentDate].some((value) => value && value >= today);
}

function knownReferralSources() {
  return [...new Set(loadedReferrals.map((referral) => referral.referralSource).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second));
}

function renderReferralSourceOptions() {
  const query = referralSourceInput.value.trim().toLowerCase();
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
    "Scheduled",
    "Active",
    "Needs Reschedule",
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

function renderDashboard() {
  dashboardSummary.innerHTML = "";
  dashboardFollowups.innerHTML = "";
  dashboardNewReferrals.innerHTML = "";
  dashboardScheduled.innerHTML = "";
  dashboardNoNext.innerHTML = "";
  dashboardOldestFollowups.innerHTML = "";

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
    ["Needs Reschedule", "Needs Language Support", "Waiting on Family"].includes(client.status || "Scheduled")
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

  renderDashboardList(dashboardFollowups, followupItems.slice(0, 6), "No follow-ups waiting.");

  const newReferralItems = newReferrals
    .map((referral) => ({
      type: "Referral",
      title: referralName(referral),
      detail: referral.referralSource ? `Source: ${referral.referralSource}` : displayValue(referral.referralType),
      date: referral.referralDate || referral.createdAt || "",
      action: () => setSelectedReferral(referral.id)
    }))
    .sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  renderDashboardList(dashboardNewReferrals, newReferralItems.slice(0, 6), "No new referrals waiting.");

  const scheduledItems = scheduledClients
    .map((client) => ({
      type: "Client",
      title: clientName(client),
      detail: client.firstAppointmentDate ? `First appt ${formatDateOnly(client.firstAppointmentDate)}` : "Scheduled",
      date: client.firstAppointmentDate || client.createdAt || "",
      action: () => setSelectedClient(client.id)
    }))
    .sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  renderDashboardList(dashboardScheduled, scheduledItems.slice(0, 6), "No clients currently scheduled.");

  const noNextItems = clientsWithoutNextAppointment
    .map((client) => ({
      type: "Client",
      title: clientName(client),
      detail: client.lastAppointmentDate ? `Last appt ${formatDateOnly(client.lastAppointmentDate)}` : client.status || "Active",
      date: client.lastAppointmentDate || client.firstAppointmentDate || client.createdAt || "",
      action: () => setSelectedClient(client.id)
    }))
    .sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  renderDashboardList(dashboardNoNext, noNextItems.slice(0, 6), "No active clients missing an appointment.");

  renderDashboardList(dashboardOldestFollowups, followupItems.slice(0, 6), "No follow-ups waiting.");
}

function renderDashboardList(container, items, emptyText) {
  container.innerHTML = "";

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
    meta.className = "dashboard-item-meta";
    meta.textContent = item.type;

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

function setActiveModule(moduleName) {
  activeModule = moduleName;
  const showDashboard = moduleName === "dashboard";
  const showReferrals = moduleName === "referrals";
  const showClients = moduleName === "clients";
  dashboardPanel.hidden = !showDashboard;
  referralsPanel.hidden = !showReferrals;
  clientsPanel.hidden = !showClients;
  navDashboardButton.classList.toggle("active", showDashboard);
  navReferralsButton.classList.toggle("active", showReferrals);
  navClientsButton.classList.toggle("active", showClients);
  navDashboardButton.setAttribute("aria-current", showDashboard ? "page" : "false");
  navReferralsButton.setAttribute("aria-current", showReferrals ? "page" : "false");
  navClientsButton.setAttribute("aria-current", showClients ? "page" : "false");

  if (showDashboard) {
    closeReferralModal();
    closeClientModal();
    renderDashboard();
  } else if (showClients) {
    closeReferralModal();
    renderClients();
  } else {
    closeClientModal();
    renderReferrals();
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
  addDetailField(leftColumn, "Date of Birth", formatDateOnly(referral.dateOfBirth));
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

  addDetailField(trackingLeftColumn, "Referral Date", formatDateOnly(referral.referralDate));
  addDetailField(trackingLeftColumn, "Created Date", formatDateOnly((referral.createdAt || "").slice(0, 10)));
  addDetailField(trackingLeftColumn, "First Contact Date", formatDateOnly(referral.firstContactDate));
  addDetailField(trackingLeftColumn, "Most Recent Contact Date", formatDateOnly(referral.mostRecentContactDate));
  addDetailField(trackingRightColumn, "Referral Type", displayValue(referral.referralType));
  addDetailField(trackingRightColumn, "First Appointment Date", formatDateOnly(referral.firstAppointmentDate));
  addDetailField(trackingRightColumn, "Last Appointment Date", formatDateOnly(referral.lastAppointmentDate));
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

  referralDetail.append(heading, statusLabel, infoGrid, trackingTitle, trackingGrid, renderSiblingsSection(referral, "referrals"), notes);

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
  addDetailField(leftColumn, "Date of Birth", formatDateOnly(client.dateOfBirth));
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

  addDetailField(trackingLeftColumn, "Referral Date", formatDateOnly(client.referralDate));
  addDetailField(trackingLeftColumn, "Created Date", formatDateOnly((client.createdAt || "").slice(0, 10)));
  addDetailField(trackingLeftColumn, "First Contact Date", formatDateOnly(client.firstContactDate));
  addDetailField(trackingLeftColumn, "Most Recent Contact Date", formatDateOnly(client.mostRecentContactDate));
  const convertedDate = client.convertedAt || (client.sourceReferralId ? client.createdAt : "");
  addDetailField(trackingRightColumn, "Converted Date", formatDateOnly(convertedDate.slice(0, 10)));
  addDetailField(trackingRightColumn, "Referral Type", displayValue(client.referralType));
  addDetailField(trackingRightColumn, "First Appointment Date", formatDateOnly(client.firstAppointmentDate));
  addDetailField(trackingRightColumn, "Last Appointment Date", formatDateOnly(client.lastAppointmentDate));
  trackingGrid.append(trackingLeftColumn, trackingRightColumn);

  const notes = document.createElement("section");
  notes.className = "notes-panel";
  const notesTitle = document.createElement("h4");
  notesTitle.textContent = "Notes";
  const notesText = document.createElement("p");
  notesText.textContent = client.notes || "-";
  notes.append(notesTitle, notesText);

  clientDetail.append(heading, statusLabel, infoGrid, trackingTitle, trackingGrid, renderSiblingsSection(client, "clients"), notes);
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
    if (!clientModal.hidden && selectedClientId) {
      renderClientDetail();
    }
    setClientsLoadedStatus();
  } catch (error) {
    clientsStatusEl.textContent = "Could not load clients yet.";
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
    setActiveModule("clients");

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
  dashboardPanel.hidden = !signedIn;
  referralsPanel.hidden = true;
  clientsPanel.hidden = true;
  userEl.textContent = signedIn ? `Signed in as ${user.email}` : "Please sign in with your SNACK Google account.";

  if (signedIn) {
    setActiveModule(activeModule);
    loadMessage();
    loadReferrals();
    loadClients();
  } else {
    messageEl.textContent = "";
    statusEl.textContent = "Sign in to load the database message.";
    referralsStatusEl.textContent = "";
    clientsStatusEl.textContent = "";
    referralsList.innerHTML = "";
    clientsList.innerHTML = "";
    dashboardSummary.innerHTML = "";
    dashboardFollowups.innerHTML = "";
    dashboardNewReferrals.innerHTML = "";
    dashboardScheduled.innerHTML = "";
    dashboardNoNext.innerHTML = "";
    dashboardOldestFollowups.innerHTML = "";
    referralSummary.innerHTML = "";
    clientSummary.innerHTML = "";
    referralDetail.innerHTML = "";
    clientDetail.innerHTML = "";
    selectedReferralId = null;
    selectedClientId = null;
    loadedReferrals = [];
    loadedClients = [];
    referralForm.reset();
    closeReferralModal();
    closeClientModal();
  }
});

signInButton.addEventListener("click", signIn);
signOutButton.addEventListener("click", signOutUser);
refreshButton.addEventListener("click", loadMessage);
navDashboardButton.addEventListener("click", () => setActiveModule("dashboard"));
navReferralsButton.addEventListener("click", () => setActiveModule("referrals"));
navClientsButton.addEventListener("click", () => setActiveModule("clients"));
newReferralButton.addEventListener("click", startNewReferral);
newClientButton.addEventListener("click", startNewClient);
referralForm.addEventListener("submit", saveReferral);
clientForm.addEventListener("submit", saveClient);
referralSourceInput.addEventListener("focus", renderReferralSourceOptions);
referralSourceInput.addEventListener("input", renderReferralSourceOptions);
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
closeReferralModalButton.addEventListener("click", closeReferralModal);
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
document.addEventListener("click", (event) => {
  for (const menu of document.querySelectorAll(".columns-menu[open]")) {
    if (!menu.contains(event.target)) {
      menu.open = false;
    }
  }
});
