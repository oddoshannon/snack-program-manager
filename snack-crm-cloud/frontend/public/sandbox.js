const storageKey = "snack-training-sandbox-v1";
const moduleDefinitions = {
  schedule: {
    label: "Schedule", tone: "#e5484d", singular: "Appointment",
    fields: [
      ["clientName", "Client", "text"], ["appointmentDate", "Date", "date"],
      ["appointmentTime", "Time", "time"], ["appointmentType", "Type", "select", ["Enrollment", "Nutrition Education"]],
      ["status", "Status", "select", ["Scheduled", "Completed", "No-show", "Canceled"]], ["notes", "Notes", "textarea"]
    ],
    title: (row) => row.clientName, detail: (row) => `${row.appointmentDate} at ${row.appointmentTime} | ${row.appointmentType}`
  },
  crm: {
    label: "CRM", tone: "#1570ef", singular: "Client",
    fields: [
      ["firstName", "First Name", "text"], ["lastName", "Last Name", "text"],
      ["parentName", "Caregiver", "text"], ["phone", "Phone", "tel"],
      ["preferredLanguage", "Preferred Language", "select", ["English", "Spanish", "Other"]],
      ["status", "Status", "select", ["Scheduled", "Active", "Needs Reschedule", "Waiting on Family", "Graduated"]],
      ["notes", "Notes", "textarea"]
    ],
    title: (row) => `${row.firstName} ${row.lastName}`, detail: (row) => `${row.parentName} | ${row.phone} | ${row.preferredLanguage}`
  },
  outreach: {
    label: "Outreach", tone: "#cf9600", singular: "Outreach Record",
    fields: [
      ["name", "Event or Lead Name", "text"], ["eventDate", "Date", "date"],
      ["type", "Type", "select", ["Outreach Event", "Community Partner", "Lead"]],
      ["status", "Status", "select", ["New", "Scheduled", "Active", "Completed", "Closed"]],
      ["contact", "Contact", "text"], ["notes", "Notes", "textarea"]
    ],
    title: (row) => row.name, detail: (row) => `${row.eventDate || "No date"} | ${row.type} | ${row.contact || "No contact"}`
  },
  marketing: {
    label: "Marketing", tone: "#4969af", singular: "Marketing Record",
    fields: [
      ["name", "Campaign or Contact", "text"], ["email", "Email", "email"],
      ["type", "Type", "select", ["Campaign", "Contact"]],
      ["status", "Status", "select", ["Draft", "Ready", "Active", "Unsubscribed", "Complete"]],
      ["audience", "Audience", "text"], ["notes", "Notes", "textarea"]
    ],
    title: (row) => row.name, detail: (row) => `${row.type} | ${row.email || row.audience || "Training record"}`
  }
};

const seed = () => ({
  schedule: [
    { id: crypto.randomUUID(), clientName: "Maya Sample", appointmentDate: "2026-08-12", appointmentTime: "13:00", appointmentType: "Enrollment", status: "Scheduled", notes: "Fictional training appointment." },
    { id: crypto.randomUUID(), clientName: "Leo Practice", appointmentDate: "2026-08-12", appointmentTime: "14:30", appointmentType: "Nutrition Education", status: "Scheduled", notes: "Practice changing the outcome." }
  ],
  crm: [
    { id: crypto.randomUUID(), firstName: "Maya", lastName: "Sample", parentName: "Jordan Sample", phone: "(503) 555-0101", preferredLanguage: "English", status: "Scheduled", notes: "Fictional data only." },
    { id: crypto.randomUUID(), firstName: "Leo", lastName: "Practice", parentName: "Avery Practice", phone: "(503) 555-0102", preferredLanguage: "Spanish", status: "Active", notes: "Fictional data only." }
  ],
  outreach: [
    { id: crypto.randomUUID(), name: "Practice Family Fair", eventDate: "2026-09-05", type: "Outreach Event", status: "Scheduled", contact: "Taylor Example", notes: "Fictional event." },
    { id: crypto.randomUUID(), name: "Example Community Partner", eventDate: "", type: "Community Partner", status: "Active", contact: "Morgan Example", notes: "Fictional partner." }
  ],
  marketing: [
    { id: crypto.randomUUID(), name: "Practice Fall Newsletter", email: "", type: "Campaign", status: "Draft", audience: "Training audience", notes: "Cannot send outside the sandbox." },
    { id: crypto.randomUUID(), name: "Jamie Example", email: "jamie@example.invalid", type: "Contact", status: "Active", audience: "Newsletter", notes: "Reserved invalid domain." }
  ]
});

const app = document.querySelector("#sandbox-app");
const toast = document.querySelector("#toast");
let data = loadData();
let activeModule = "schedule";
let selectedId = data.schedule[0]?.id || "";

function loadData() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored && Object.keys(moduleDefinitions).every((key) => Array.isArray(stored[key]))) return stored;
  } catch {}
  const initial = seed();
  localStorage.setItem(storageKey, JSON.stringify(initial));
  return initial;
}

function saveData(message = "Training data saved.") {
  localStorage.setItem(storageKey, JSON.stringify(data));
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character]);
}

function fieldHtml([name, label, type, options], row) {
  const value = row?.[name] || "";
  const wide = type === "textarea" ? "is-wide" : "";
  if (type === "select") return `<label class="${wide}"><span>${label}</span><select name="${name}" required>${options.map((option) => `<option ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select></label>`;
  if (type === "textarea") return `<label class="${wide}"><span>${label}</span><textarea name="${name}">${escapeHtml(value)}</textarea></label>`;
  return `<label class="${wide}"><span>${label}</span><input name="${name}" type="${type}" value="${escapeHtml(value)}" ${["clientName", "firstName", "lastName", "name"].includes(name) ? "required" : ""}></label>`;
}

function render() {
  const definition = moduleDefinitions[activeModule];
  const rows = data[activeModule];
  const selected = rows.find((row) => row.id === selectedId) || null;
  app.innerHTML = `<div class="sandbox-shell" style="--sandbox-tone:${definition.tone}">
    <aside class="sandbox-sidebar">
      <div class="sandbox-brand"><img src="./favicon.png" alt=""><div><strong>SNACK Program Hub</strong><span>Training Sandbox</span></div></div>
      <nav class="sandbox-nav" aria-label="Training modules">${Object.entries(moduleDefinitions).map(([id, item]) => `<button class="nav-button ${id === activeModule ? "is-active" : ""}" data-module="${id}" type="button">${item.label}</button>`).join("")}</nav>
      <p class="sandbox-notice"><strong>Fictional data only.</strong><br>Everything here stays in this browser. Email, texting, calling, calendar, MailerLite, and production database actions are disabled.</p>
    </aside>
    <main class="sandbox-main">
      <header class="sandbox-header"><div><h1>${definition.label}</h1><p>Practice creating, editing, and deleting records without affecting the live Hub.</p></div><div class="sandbox-actions"><button data-reset type="button">Reset Training Data</button><a href="./index.html">Return to Live Hub</a></div></header>
      <section class="sandbox-workspace">
        <div class="sandbox-list"><div class="sandbox-toolbar"><strong>${definition.label} Records</strong><button data-new type="button">New ${definition.singular}</button></div><div class="sandbox-rows">${rows.length ? rows.map((row) => `<button class="sandbox-row ${row.id === selectedId ? "is-selected" : ""}" data-row="${row.id}" type="button"><strong>${escapeHtml(definition.title(row) || `Untitled ${definition.singular}`)}</strong><span class="sandbox-pill">${escapeHtml(row.status || "Draft")}</span><small>${escapeHtml(definition.detail(row))}</small></button>`).join("") : `<p class="sandbox-empty">No training records yet. Create one to practice.</p>`}</div></div>
        <div class="sandbox-editor">${selected ? `<h2>Edit ${definition.singular}</h2><form class="sandbox-form" data-form>${definition.fields.map((field) => fieldHtml(field, selected)).join("")}<div class="sandbox-editor-actions"><button class="is-danger" data-delete type="button">Delete Training Record</button><button class="is-primary" type="submit">Save Changes</button></div></form>` : `<p class="sandbox-empty">Select a record or create a new one.</p>`}</div>
      </section>
    </main>
  </div>`;
}

app.addEventListener("click", (event) => {
  const moduleButton = event.target.closest("[data-module]");
  if (moduleButton) { activeModule = moduleButton.dataset.module; selectedId = data[activeModule][0]?.id || ""; render(); return; }
  const rowButton = event.target.closest("[data-row]");
  if (rowButton) { selectedId = rowButton.dataset.row; render(); return; }
  if (event.target.closest("[data-new]")) {
    const blank = { id: crypto.randomUUID(), status: moduleDefinitions[activeModule].fields.find((field) => field[0] === "status")?.[3]?.[0] || "Draft" };
    data[activeModule].unshift(blank); selectedId = blank.id; saveData("New fictional record created."); render(); return;
  }
  if (event.target.closest("[data-delete]")) {
    data[activeModule] = data[activeModule].filter((row) => row.id !== selectedId); selectedId = data[activeModule][0]?.id || ""; saveData("Training record deleted."); render(); return;
  }
  if (event.target.closest("[data-reset]")) {
    if (!window.confirm("Reset all four sandbox modules to the original fictional training data?")) return;
    data = seed(); selectedId = data[activeModule][0]?.id || ""; saveData("Training sandbox reset."); render();
  }
});

app.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form).entries());
  const row = data[activeModule].find((item) => item.id === selectedId);
  Object.assign(row, values);
  saveData(); render();
});

render();
