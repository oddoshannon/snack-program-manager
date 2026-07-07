const icons = {
  schedule: `<svg viewBox="0 0 24 24"><path d="M7 3v4M17 3v4M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>`,
  crm: `<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  outreach: `<svg viewBox="0 0 24 24"><path d="m3 11 18-7-7 18-3-8-8-3Z"/><path d="m11 14 4-4"/></svg>`,
  fundraising: `<svg viewBox="0 0 24 24"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  marketing: `<svg viewBox="0 0 24 24"><path d="m3 11 18-5v12L3 13v-2Z"/><path d="M11.6 16.8a3 3 0 0 1-5.6-1.5"/></svg>`,
  operations: `<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/><path d="M8 7v10"/></svg>`,
  settings: `<svg viewBox="0 0 24 24"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.08 1.65V21a2 2 0 1 1-4 0v-.09a1.8 1.8 0 0 0-1.08-1.65 1.8 1.8 0 0 0-1.98.36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-1.65-1.08H3a2 2 0 1 1 0-4h.09A1.8 1.8 0 0 0 4.74 8.8a1.8 1.8 0 0 0-.36-1.98l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.8 1.8 0 0 0 1.98.36A1.8 1.8 0 0 0 10.27 3V3a2 2 0 1 1 4 0v.09a1.8 1.8 0 0 0 1.08 1.65 1.8 1.8 0 0 0 1.98-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.8 1.8 0 0 0-.36 1.98c.27.67.92 1.1 1.64 1.1H21a2 2 0 1 1 0 4h-.09A1.8 1.8 0 0 0 19.4 15Z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>`,
  search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`
};

const modules = [
  {
    id: "schedule",
    label: "Schedule",
    title: "Clinic Schedule",
    description: "Clinic appointments, completion workflow, and public-booking readiness.",
    color: "#ef4656",
    soft: "#fff1f2",
    line: "#fecdd3",
    subpages: ["Clinic", "Public Booking", "Unscheduled", "Print Forms", "Settings"],
    views: ["Day", "Week", "Month"],
    action: "New Appointment",
    quick: ["New Appointment", "Block Time", "Print Schedule", "Print Appt Notes", "View Unscheduled"],
    metrics: [["2", "Today"], ["1", "Completed"], ["1", "No Show"], ["0", "Reschedule"]],
    rows: [
      ["Rafael & Janney", "2:30 PM | Enrollment | Completed", "Completed"],
      ["Lana & Hamzah", "4:30 PM | Micronutrients | No-show", "No-show"],
      ["Cynthia availability", "Office 1:00 PM to 6:00 PM | Appointments 1:30 PM to 5:30 PM", "Settings"]
    ],
    detail: {
      eyebrow: "No-show",
      title: "Lana & Hamzah",
      facts: [["Date", "Tuesday, July 7, 2026"], ["Time", "4:30 PM - 30 min"], ["Type", "Nutrition Education"]],
      tabs: ["Appt Note", "Wrap Up", "Activity", "Forms"],
      cards: [
        ["Details", [["Lesson", "Micronutrients"], ["Staff", "Cynthia Esparza"], ["Goal", "BINGO"], ["Notes", "Micronutrients: BINGO"]]],
        ["Prep", [["Forms", "Prize from the bin."], ["Snack", "Food snack."]]]
      ],
      actions: ["Mark Complete", "Reschedule", "No Show"]
    }
  },
  {
    id: "crm",
    label: "CRM",
    title: "CRM Profiles",
    description: "Clients, referrals, providers, notes, appointments, and print packets.",
    color: "#d66d1f",
    soft: "#fff3e8",
    line: "#fed7aa",
    subpages: ["Clients", "Referrals", "Referral Network", "Tasks", "Forms"],
    views: ["List", "Activity", "Forms"],
    action: "New Client",
    quick: ["New Referral", "New Client", "New Task", "Print Profile"],
    metrics: [["31", "Active clients"], ["5", "Reschedule"], ["8", "Open tasks"], ["14", "Referrals"]],
    rows: [
      ["Kathan Teeters", "Reschedule | Jennifer | Nutrient Density next", "Reschedule"],
      ["Aaliya Martinez Nambo", "Active | Silvia | Sugar next", "Active"],
      ["Rafael & Janney", "Completed enrollment | Spanish | Linked siblings", "Scheduled"]
    ],
    detail: {
      eyebrow: "Reschedule",
      title: "Kathan Teeters",
      facts: [["Caregiver", "Jennifer"], ["Language", "English"], ["Recent contact", "6/9/26"]],
      tabs: ["Overview", "Notes", "Activity", "Appointments", "Forms"],
      cards: [
        ["Snapshot", [["Date of birth", "8/14/13"], ["Insurance", "YCCO"], ["First appointment", "12/3/25"], ["Graduation", "Not graduated"]]],
        ["Lesson Progression", [["Enroll", "Done"], ["Nutrient Density", "Next"], ["Sugar", "-"], ["Food Groups", "-"]]]
      ],
      actions: ["Log Call", "New Appointment", "Close Client"]
    }
  },
  {
    id: "outreach",
    label: "Outreach",
    title: "Outreach",
    description: "Annual community events, logistics, outcomes, and generated contacts.",
    color: "#d99a12",
    soft: "#fff8e8",
    line: "#f8d38b",
    subpages: ["Events", "Contacts", "Tasks", "Reports"],
    views: ["Overview", "Tasks", "Reports"],
    action: "New Event",
    quick: ["New Event", "Log Outcome", "Add Contact"],
    metrics: [["12", "Annual events"], ["418", "Families reached"], ["96", "New contacts"], ["$1.8k", "Event costs"]],
    rows: [
      ["Yamhill County Fair", "August 1-3, 2026 | Booth fee and prize supplies", "Planning"],
      ["Family Resource Night", "Register by May 12 | Prize wheel activity", "Ready"],
      ["Back to School Bash", "Lead capture and giveaway checklist", "Tasks"]
    ],
    detail: {
      eyebrow: "Planning",
      title: "Yamhill County Fair",
      facts: [["Date", "August 1-3, 2026"], ["Place", "Yamhill County Fairgrounds"], ["Cost", "$250 booth fee + prize supplies"]],
      tabs: ["Logistics", "Outcomes", "Contacts"],
      cards: [
        ["Logistics", [["Registration", "Vendor portal; insurance certificate required"], ["Setup", "10x10 booth, tablecloth, prize wheel, newsletter QR"]]],
        ["Outcomes", [["Families reached", "Goal 180"], ["Leads", "Newsletter and program interest signups"]]]
      ],
      actions: ["Log Outcome", "Add Contact", "Create Task"]
    }
  },
  {
    id: "fundraising",
    label: "Fundraising",
    title: "Fundraising",
    description: "Grants, donors, campaigns, sponsors, and earned income in one working view.",
    color: "#18724a",
    soft: "#eaf7ef",
    line: "#b7dec6",
    subpages: ["Grants", "Donors", "Campaigns", "Sponsors", "Earned Income"],
    views: ["Overview", "Tasks", "Reports"],
    action: "New Opportunity",
    quick: ["New Grant", "New Donor", "New Campaign"],
    metrics: [["$82k", "Grant pipeline"], ["18", "Donors"], ["4", "Campaigns"], ["$6.4k", "Earned income"]],
    rows: [
      ["YCCO prevention grant", "Draft due July 31 | Program and KPI narrative", "Drafting"],
      ["Workbook sales", "Kindle Direct Publishing connector planned", "Tracking"],
      ["Business sponsor packet", "Create outreach list and benefit tiers", "Planning"]
    ],
    detail: {
      eyebrow: "Drafting",
      title: "YCCO prevention grant",
      facts: [["Due date", "July 31, 2026"], ["Amount", "$50,000"], ["Owner", "Shannon Oddo"]],
      tabs: ["Pipeline", "Tasks", "Budget", "Reports"],
      cards: [
        ["Grant tracker", [["Stage", "Narrative draft"], ["Next step", "Attach KPI language"], ["Risk", "Final outcome measures pending"]]],
        ["Budget", [["Requested", "$50,000"], ["Match", "Not required"]]]
      ],
      actions: ["Open Draft", "Add Task", "Mark Submitted"]
    }
  },
  {
    id: "marketing",
    label: "Marketing",
    title: "Marketing",
    description: "Mass email, content planning, audience segments, and marketing analytics.",
    color: "#1570ef",
    soft: "#eff8ff",
    line: "#bfdbfe",
    subpages: ["Email", "Contacts", "Content", "Ad Grants", "Analytics"],
    views: ["Overview", "Tasks", "Reports"],
    action: "New Campaign",
    quick: ["New Email", "New Post", "Import Contacts"],
    metrics: [["2,418", "Contacts"], ["42%", "Open rate"], ["$10k", "Ad grant"], ["6", "Draft emails"]],
    rows: [
      ["July newsletter", "MailerLite draft | program updates and summer events", "Draft"],
      ["Google Ad Grants", "Search and Analytics connector planned", "Connector"],
      ["Program interest segment", "Outreach contacts and referral sources", "Audience"]
    ],
    detail: {
      eyebrow: "Draft",
      title: "July newsletter",
      facts: [["Audience", "Families and partners"], ["Delivery", "MailerLite"], ["Status", "Draft"]],
      tabs: ["Campaigns", "Audience", "Analytics"],
      cards: [
        ["Email builder", [["Subject", "Summer SNACK updates"], ["CTA", "Book a family nutrition appointment"]]],
        ["Analytics", [["Open rate", "42% target"], ["Clicks", "Booking page and events"]]]
      ],
      actions: ["Edit Email", "Preview", "Send Test"]
    }
  },
  {
    id: "operations",
    label: "Operations",
    title: "Operations",
    description: "Launch blockers, KPI health, connector readiness, and cleanup queues.",
    color: "#4f46e5",
    soft: "#eef2ff",
    line: "#c7d2fe",
    subpages: ["Command Center", "KPI", "Connectors", "Data Quality", "Tasks"],
    views: ["Overview", "Tasks", "Reports"],
    action: "New Task",
    quick: ["New Task", "Run Check", "Open Report"],
    metrics: [["3", "Launch blockers"], ["7", "Connector tasks"], ["22", "Cleanup items"], ["5", "KPI groups"]],
    rows: [
      ["Launch readiness", "Scheduling plus CRM visual pass before production", "Priority"],
      ["KPI command center", "Program, marketing, fundraising, earned income", "Planning"],
      ["Connector health", "Google, MailerLite, Kindle, analytics imports", "Research"]
    ],
    detail: {
      eyebrow: "Priority",
      title: "Launch readiness",
      facts: [["Owner", "Shannon + Codex"], ["Next check", "Visual pass"], ["Scope", "Scheduling and CRM first"]],
      tabs: ["Command Center", "Tasks", "Reports"],
      cards: [
        ["Readiness", [["Scheduling", "Needs visual pass"], ["CRM", "Needs clean build"], ["Settings", "Needs visual pass"]]],
        ["Connectors", [["Google Analytics", "Possible"], ["MailerLite", "Possible"], ["Kindle", "Research required"]]]
      ],
      actions: ["Add Task", "Run Check", "Open Report"]
    }
  },
  {
    id: "settings",
    label: "Settings",
    title: "Settings",
    description: "Staff, access, scheduling defaults, forms, backups, and connector setup.",
    color: "#7a33c2",
    soft: "#f6eeff",
    line: "#ddd6fe",
    subpages: ["Program", "Staff", "Schedule", "Forms", "Backups", "Connectors"],
    views: ["Overview", "Tasks", "Reports"],
    action: "New Setting",
    quick: ["Add Staff", "Export JSON", "Connect Source"],
    metrics: [["2", "Active staff"], ["3", "Clinic days"], ["10", "Print forms"], ["6", "Connectors"]],
    rows: [
      ["Cynthia Esparza", "Office 1:00 PM to 6:00 PM | Appointments 1:30 PM to 5:30 PM", "Staff"],
      ["Shannon Oddo", "Executive Director | owner access", "Staff"],
      ["JSON backup", "Export built | restore planned", "Backups"]
    ],
    detail: {
      eyebrow: "Staff",
      title: "Cynthia Esparza",
      facts: [["Role", "Nutrition Coordinator"], ["Clinic days", "Tuesday to Thursday"], ["Appointment window", "1:30 PM to 5:30 PM"]],
      tabs: ["Staff & Access", "Schedule Defaults", "Forms", "Backups"],
      cards: [
        ["Staff settings", [["Phone", "(971) 202-0232"], ["Email", "coordinator@snackprogram.org"], ["Access", "Admin"]]],
        ["Schedule defaults", [["Office hours", "1:00 PM to 6:00 PM"], ["Appointment hours", "1:30 PM to 5:30 PM"]]]
      ],
      actions: ["Edit Staff", "Add Staff", "Export JSON"]
    }
  }
];

const state = {
  module: "schedule",
  sidebarOpen: true,
  subpageByModule: Object.fromEntries(modules.map((module) => [module.id, module.subpages[0]])),
  viewByModule: Object.fromEntries(modules.map((module) => [module.id, module.views[0]])),
  selectedRowByModule: Object.fromEntries(modules.map((module) => [module.id, 0])),
  detailTabByModule: Object.fromEntries(modules.map((module) => [module.id, module.detail.tabs[0]]))
};

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");

function icon(name) {
  return `<span class="icon" aria-hidden="true">${icons[name] || icons.chevron}</span>`;
}

function currentModule() {
  return modules.find((module) => module.id === state.module);
}

function setModuleTheme(module) {
  document.documentElement.style.setProperty("--module", module.color);
  document.documentElement.style.setProperty("--module-soft", module.soft);
  document.documentElement.style.setProperty("--module-line", module.line);
}

function render() {
  const module = currentModule();
  setModuleTheme(module);
  app.innerHTML = `
    <div class="app-shell ${state.sidebarOpen ? "" : "is-collapsed"}">
      ${renderSidebar(module)}
      <main class="workspace">
        <section class="module-page" aria-live="polite">
          ${renderHeader(module)}
          ${renderMetrics(module)}
          ${renderBody(module)}
        </section>
      </main>
    </div>
  `;
}

function renderSidebar(activeModule) {
  return `
    <aside class="sidebar" aria-label="Main navigation">
      <div class="brand">
        <img src="./favicon.png" alt="">
        <div class="brand-name">
          <strong>SNACK</strong>
          <span>Program Manager</span>
        </div>
        <button class="collapse-button" type="button" data-action="toggle-sidebar" aria-label="Toggle navigation">${icon("chevron")}</button>
      </div>
      <div class="sidebar-scroll">
        <nav class="module-nav" aria-label="Modules">
          ${modules.map((module) => renderModuleButton(module, activeModule)).join("")}
        </nav>
      </div>
      <section class="quick-actions" aria-label="Quick actions">
        <h2>Quick Actions</h2>
        ${activeModule.quick.map((label) => `
          <button class="quick-button" type="button" data-action="toast" data-message="${label}">
            ${icon(label.includes("Print") ? "schedule" : "plus")}
            <span>${label}</span>
          </button>
        `).join("")}
      </section>
      <section class="account-card" aria-label="Signed in user">
        <span class="avatar">SO</span>
        <strong>Shannon Oddo</strong>
      </section>
    </aside>
  `;
}

function renderModuleButton(module, activeModule) {
  const isActive = module.id === activeModule.id;
  return `
    <div>
      <button class="module-button ${isActive ? "active" : ""}" type="button" data-module="${module.id}" style="--module:${module.color};--module-soft:${module.soft};--module-line:${module.line}">
        ${icon(module.id)}
        <span class="nav-label">${module.label}</span>
      </button>
      ${isActive ? `
        <div class="subpage-list" aria-label="${module.label} subpages">
          ${module.subpages.map((subpage) => `
            <button class="subpage-button ${state.subpageByModule[module.id] === subpage ? "active" : ""}" type="button" data-subpage="${subpage}">
              ${subpage}
            </button>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function renderHeader(module) {
  const activeView = state.viewByModule[module.id];
  return `
    <header class="module-header">
      <div class="module-title">
        <h1>${module.title}</h1>
        <p>${module.description}</p>
      </div>
      <div class="module-actions">
        <div class="view-switcher" role="tablist" aria-label="${module.label} views">
          ${module.views.map((view) => `
            <button class="view-button ${activeView === view ? "active" : ""}" type="button" data-view="${view}" role="tab" aria-selected="${activeView === view}">
              ${view}
            </button>
          `).join("")}
        </div>
        <button class="primary-button" type="button" data-action="toast" data-message="${module.action}">
          ${module.action}
        </button>
      </div>
    </header>
  `;
}

function renderMetrics(module) {
  return `
    <section class="metric-strip" aria-label="${module.label} summary">
      ${module.metrics.map(([value, label]) => `
        <div class="metric-card">
          <strong>${value}</strong>
          <span>${label}</span>
        </div>
      `).join("")}
    </section>
  `;
}

function renderBody(module) {
  const selectedIndex = state.selectedRowByModule[module.id];
  const selected = module.rows[selectedIndex] || module.rows[0];
  const detail = {
    ...module.detail,
    eyebrow: selected[2],
    title: selected[0],
    facts: [
      ["Status", selected[2]],
      ["Summary", selected[1]],
      ["Subpage", state.subpageByModule[module.id]]
    ]
  };
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <h2>${state.subpageByModule[module.id]}</h2>
            <p>${state.viewByModule[module.id]} view</p>
          </div>
          <button class="icon-only" type="button" data-action="toast" data-message="Search">${icon("search")}</button>
        </div>
        <div class="panel-body">
          <div class="list-stack">
            ${module.rows.map((row, index) => renderRow(module, row, index, selectedIndex)).join("")}
          </div>
        </div>
      </article>
      <article class="panel detail-panel">
        ${renderDetailHero(detail)}
        ${renderFacts(detail)}
        ${renderDetailTabs(module, detail)}
        ${renderDetailBody(detail)}
        ${renderDetailActions(detail)}
      </article>
    </section>
  `;
}

function renderRow(module, row, index, selectedIndex) {
  const [title, subtitle, status] = row;
  return `
    <button class="list-row ${index === selectedIndex ? "active" : ""}" type="button" data-row="${index}">
      <span class="row-accent" style="--row-color:${module.color}"></span>
      <span class="row-main">
        <strong>${title}</strong>
        <span>${subtitle}</span>
      </span>
      <span class="pill">${status}</span>
    </button>
  `;
}

function renderDetailHero(detail) {
  return `
    <div class="detail-hero">
      <div class="detail-title">
        <span class="eyebrow">${detail.eyebrow}</span>
        <h2>${detail.title}</h2>
      </div>
      <button class="secondary-button" type="button" data-action="toast" data-message="Edit">
        Edit
      </button>
    </div>
  `;
}

function renderFacts(detail) {
  return `
    <div class="fact-grid">
      ${detail.facts.map(([label, value]) => `
        <div class="fact">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderDetailTabs(module, detail) {
  const activeTab = state.detailTabByModule[module.id];
  return `
    <div class="detail-tabs" role="tablist" aria-label="${module.label} detail tabs">
      ${detail.tabs.map((tab) => `
        <button class="detail-tab ${activeTab === tab ? "active" : ""}" type="button" data-detail-tab="${tab}" role="tab" aria-selected="${activeTab === tab}">
          ${tab}
        </button>
      `).join("")}
    </div>
  `;
}

function renderDetailBody(detail) {
  return `
    <div class="detail-body">
      ${detail.cards.map(([title, items]) => `
        <section class="info-card">
          <h3>${title}</h3>
          <div class="info-grid">
            ${items.map(([label, value]) => `
              <div class="info-item ${value.length > 58 ? "wide" : ""}">
                <span>${label}</span>
                <strong>${value}</strong>
              </div>
            `).join("")}
          </div>
        </section>
      `).join("")}
      <div class="mini-grid">
        <div class="mini-card"><strong>Next step</strong><span>Ready for module-specific workflow build.</span></div>
        <div class="mini-card"><strong>Design rule</strong><span>Uses the shared layout and module color.</span></div>
        <div class="mini-card"><strong>Status</strong><span>Foundation screen, not final workflow.</span></div>
      </div>
    </div>
  `;
}

function renderDetailActions(detail) {
  return `
    <div class="detail-actions">
      ${detail.actions.map((label, index) => `
        <button class="${index === 0 ? "primary-button" : "secondary-button"}" type="button" data-action="toast" data-message="${label}">
          ${label}
        </button>
      `).join("")}
    </div>
  `;
}

function showToast(message) {
  toast.textContent = `${message} clicked`;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.action === "toggle-sidebar") {
    state.sidebarOpen = !state.sidebarOpen;
    render();
    return;
  }

  if (button.dataset.module) {
    state.module = button.dataset.module;
    render();
    return;
  }

  if (button.dataset.subpage) {
    state.subpageByModule[state.module] = button.dataset.subpage;
    render();
    return;
  }

  if (button.dataset.view) {
    state.viewByModule[state.module] = button.dataset.view;
    render();
    return;
  }

  if (button.dataset.row) {
    state.selectedRowByModule[state.module] = Number(button.dataset.row);
    render();
    return;
  }

  if (button.dataset.detailTab) {
    state.detailTabByModule[state.module] = button.dataset.detailTab;
    render();
    return;
  }

  if (button.dataset.action === "toast") {
    showToast(button.dataset.message || "Action");
  }
});

render();
