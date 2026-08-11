const moduleConfig = {
  schedule: {
    label: "Schedule",
    title: "Clinic Schedule",
    description: "Clinic appointments, completion workflow, and public-booking readiness.",
    icon: "□",
    color: "#ef4656",
    soft: "#fff1f2",
    line: "#fecdd3",
    tabs: ["Day", "Week", "Month"],
    action: "New Appointment",
    quickActions: ["New Appointment", "Block Time", "Print Schedule", "Print Appt Notes", "View Unscheduled"]
  },
  crm: {
    label: "CRM",
    title: "CRM Profiles",
    description: "Clients, referrals, providers, notes, appointments, and print packets.",
    icon: "◦",
    color: "#e56b2f",
    soft: "#fff4ed",
    line: "#fed7aa",
    tabs: ["Clients", "Referrals", "Referral Network"],
    action: "New Client",
    quickActions: ["New Referral", "New Client", "New Task", "Print Profile"]
  },
  outreach: {
    label: "Outreach",
    title: "Outreach",
    description: "Annual community events, logistics, outcomes, and generated contacts.",
    icon: "◇",
    color: "#df9908",
    soft: "#fff7e6",
    line: "#f8d38b",
    tabs: ["Overview", "Tasks", "Reports"],
    action: "New Event",
    quickActions: ["New Event", "Log Outcome", "Add Contact"]
  },
  fundraising: {
    label: "Fundraising",
    title: "Fundraising",
    description: "Grants, donors, campaigns, sponsors, and earned income in one working view.",
    icon: "$",
    color: "#17794b",
    soft: "#eaf7ef",
    line: "#b7dec6",
    tabs: ["Overview", "Tasks", "Reports"],
    action: "New Opportunity",
    quickActions: ["New Grant", "New Donor", "New Campaign"]
  },
  marketing: {
    label: "Marketing",
    title: "Marketing",
    description: "Mass email, content planning, audience segments, and marketing analytics.",
    icon: "▹",
    color: "#1d73e8",
    soft: "#eff6ff",
    line: "#bfdbfe",
    tabs: ["Overview", "Tasks", "Reports"],
    action: "New Campaign",
    quickActions: ["New Email", "New Post", "Import Contacts"]
  },
  operations: {
    label: "Operations",
    title: "Operations",
    description: "Daily command center for launch blockers, KPI health, connectors, and cleanup queues.",
    icon: "≡",
    color: "#4f46e5",
    soft: "#eef2ff",
    line: "#c7d2fe",
    tabs: ["Overview", "Tasks", "Reports"],
    action: "New Task",
    quickActions: ["New Task", "Run Check", "Open Report"]
  },
  settings: {
    label: "Settings",
    title: "Settings",
    description: "Staff, access, scheduling defaults, forms, backups, and connector setup.",
    icon: "⚙",
    color: "#7a33c2",
    soft: "#f6eeff",
    line: "#ddd6fe",
    tabs: ["Overview", "Tasks", "Reports"],
    action: "New Setting",
    quickActions: ["Add Staff", "Export JSON", "Connect Source"]
  }
};

const statusStyles = {
  Scheduled: ["#64748b", "#f8fafc", "#cbd5e1"],
  Completed: ["#17794b", "#eaf7ef", "#b7dec6"],
  "No-show": ["#0891b2", "#ecfeff", "#a5f3fc"],
  Reschedule: ["#ef4656", "#fff1f2", "#fecdd3"],
  Active: ["#17794b", "#eaf7ef", "#b7dec6"],
  Draft: ["#1d73e8", "#eff6ff", "#bfdbfe"],
  Planning: ["#df9908", "#fff7e6", "#f8d38b"],
  Drafting: ["#17794b", "#eaf7ef", "#b7dec6"],
  Core: ["#7a33c2", "#f6eeff", "#ddd6fe"]
};

const state = {
  module: "schedule",
  tabs: {
    schedule: "Day",
    crm: "Clients",
    outreach: "Overview",
    fundraising: "Overview",
    marketing: "Overview",
    operations: "Overview",
    settings: "Overview"
  },
  selected: {
    appointment: "appt-lana",
    crm: "client-kathan",
    outreach: "outreach-fair",
    fundraising: "grant-ycco",
    marketing: "campaign-july",
    operations: "ops-launch",
    settings: "settings-program"
  },
  detailTabs: {
    appointment: "Appt Note",
    crm: "Overview",
    outreach: "Logistics",
    fundraising: "Pipeline",
    marketing: "Campaigns",
    operations: "Command Center",
    settings: "Staff & Access"
  },
  search: {},
  scheduleMode: "detail",
  pendingClients: []
};

const appointments = [
  {
    id: "appt-milo",
    clients: ["Milo", "Tessa"],
    displayName: "Milo & Tessa",
    status: "Completed",
    date: "2026-07-07",
    time: "2:30 PM",
    duration: 30,
    type: "Enrollment",
    lesson: "Enrollment",
    staff: "Cynthia Esparza",
    caregiver: "Jordan",
    siblings: ["Milo", "Tessa"],
    language: "Spanish",
    phone: "(971) 447-2646",
    address: "1031 SE Rummel St, McMinnville, OR 97128",
    goal: "-",
    notes: "-",
    prep: [
      "Place paperwork at reception before the appointment.",
      "Enrollment form and questionnaire for each child.",
      "SNACK sticker and pen or pencil."
    ],
    activity: [
      ["7/7/26", "Completed", "Enrollment | Cynthia Esparza"],
      ["6/30/26", "Appointment created", "2:30 PM"]
    ]
  },
  {
    id: "appt-lana",
    clients: ["Lana", "Hamzah"],
    displayName: "Lana & Hamzah",
    status: "No-show",
    date: "2026-07-07",
    time: "4:30 PM",
    duration: 30,
    type: "Nutrition Education",
    lesson: "Micronutrients",
    staff: "Cynthia Esparza",
    caregiver: "Mariam",
    siblings: ["Lana", "Hamzah"],
    language: "English",
    phone: "(971) 208-1028",
    address: "1230 SW 2nd St, McMinnville, Oregon, 97128",
    goal: "BINGO",
    notes: "Micronutrients: BINGO",
    prep: ["Prize from the bin.", "Food snack."],
    activity: [
      ["7/7/26", "No-show", "Micronutrients | Cynthia Esparza"],
      ["7/7/26", "Last updated", "No-show"],
      ["6/25/26", "Appointment created", "4:30 PM"]
    ]
  },
  {
    id: "appt-mark",
    clients: ["Mark"],
    displayName: "Max Sample",
    status: "Scheduled",
    date: "2026-07-08",
    time: "1:30 PM",
    duration: 30,
    type: "Nutrition Education",
    lesson: "Food Groups",
    staff: "Cynthia Esparza",
    caregiver: "Claudia",
    siblings: ["Mark", "Cali"],
    language: "English",
    phone: "(971) 300-1414",
    address: "McMinnville, Oregon",
    goal: "Try one new vegetable.",
    notes: "Review food groups.",
    prep: ["Workbook.", "Prize from the bin."],
    activity: [["6/30/26", "Appointment created", "1:30 PM"]]
  },
  {
    id: "appt-cali",
    clients: ["Cali"],
    displayName: "Cora Sample",
    status: "Scheduled",
    date: "2026-07-08",
    time: "2:00 PM",
    duration: 15,
    type: "Nutrition Education",
    lesson: "Nutrient Density",
    staff: "Cynthia Esparza",
    caregiver: "Claudia",
    siblings: ["Mark", "Cali"],
    language: "English",
    phone: "(971) 300-1414",
    address: "McMinnville, Oregon",
    goal: "-",
    notes: "Sibling appointment example.",
    prep: ["Workbook."],
    activity: [["6/30/26", "Appointment created", "2:00 PM"]]
  }
];

const data = {
  crm: {
    Clients: [
      {
        id: "client-kathan",
        name: "Kathan Teeters",
        status: "Reschedule",
        subtitle: "Jennifer | Recent contact 6/9/26",
        facts: [["First appointment", "12/3/25"], ["Recent contact", "6/9/26"], ["Caregiver", "Jennifer"]],
        sections: {
          Family: [["Caregiver", "Jennifer"], ["Siblings", "None linked yet"], ["Language", "English"], ["Phone", "(971) 237-8215"], ["Address", "2275 SW Barbara Street Apt C101, McMinnville, OR 97128"]],
          Program: [["Current stage", "Enrollment complete, Nutrient Density next"], ["Provider profiles", "None linked yet"]]
        },
        detailTabs: ["Overview", "Notes", "Activity", "Appointments", "Forms"],
        details: {
          Overview: [["Date of birth", "8/14/13"], ["Language", "English"], ["First appointment", "12/3/25"], ["Most recent appointment", "-"], ["Graduation date", "Not graduated"], ["Insurance", "YCCO"]],
          Notes: [["Latest note", "Caregiver requested a reschedule call."], ["Follow-up", "Call this week."]],
          Activity: [["6/9/26", "Recent contact"], ["12/3/25", "First appointment"]],
          Appointments: [["Next step", "Schedule Nutrient Density"], ["Last appointment", "Enrollment complete"]],
          Forms: [["Enrollment packet", "Forms 1, 2, 3"], ["Final packet", "Forms 2, 4, 5"]]
        }
      },
      {
        id: "client-aaliya",
        name: "Aaliya Martinez Nambo",
        status: "Active",
        subtitle: "Silvia | Sugar next",
        facts: [["First appointment", "6/10/26"], ["Recent contact", "7/1/26"], ["Caregiver", "Silvia"]],
        sections: {
          Family: [["Caregiver", "Silvia"], ["Siblings", "Matthew"], ["Language", "English"], ["Phone", "(503) 508-1489"], ["Address", "3211 Deer Field Lane, McMinnville, OR 97128"]],
          Program: [["Current stage", "Nutrient Density complete, Sugar next"], ["Provider profiles", "YCCO"]]
        },
        detailTabs: ["Overview", "Notes", "Activity", "Appointments", "Forms"],
        details: {
          Overview: [["Date of birth", "10/12/14"], ["Language", "English"], ["First appointment", "6/10/26"], ["Insurance", "YCCO"]],
          Notes: [["Latest note", "Sibling profile linked."], ["Goal", "Try a balanced snack."]],
          Activity: [["7/1/26", "Appointment scheduled"], ["6/10/26", "Enrollment complete"]],
          Appointments: [["Next", "Sugar"], ["Status", "Scheduled"]],
          Forms: [["Enrollment packet", "Complete"], ["Final packet", "Later"]]
        }
      }
    ],
    Referrals: [
      {
        id: "ref-hayden",
        name: "Hayden Frier",
        status: "Call Back",
        subtitle: "Vanessa | Phone or text caregiver",
        facts: [["Referral date", "11/5/25"], ["Recent contact", "1/29/26"], ["Caregiver", "Vanessa"]],
        sections: {
          Family: [["Caregiver", "Vanessa"], ["Siblings", "None linked yet"], ["Language", "English"], ["Phone", "(503) 753-9115"], ["Address", "5950 NE Riverside Drive, McMinnville, OR 97128"]],
          Referral: [["Source", "Caleb Hentges, DO"], ["Type", "Internal Clinic Referral"]]
        },
        detailTabs: ["Overview", "Notes", "Activity", "Appointments", "Forms"],
        details: {
          Overview: [["Date of birth", "10/24/15"], ["Language", "English"], ["Referral date", "11/5/25"], ["First contact", "11/6/25"], ["Recent contact", "1/29/26"], ["Insurance", "YCCO"]],
          Notes: [["Preferred contact", "Phone or text caregiver"], ["Next step", "Call back."]],
          Activity: [["1/29/26", "Caregiver will call back"], ["11/6/25", "First contact"]],
          Appointments: [["Status", "Not scheduled"]],
          Forms: [["Referral intake", "Needs review"]]
        }
      }
    ],
    "Referral Network": [
      {
        id: "provider-ycco",
        name: "YCCO",
        status: "Active",
        subtitle: "Referral partner | Medicaid",
        facts: [["Type", "Insurance partner"], ["Contact", "Provider relations"], ["Status", "Active"]],
        sections: {
          Organization: [["Main contact", "Provider relations"], ["Email", "providers@example.org"], ["Phone", "(503) 000-0000"]],
          Notes: [["Use", "Referral source and insurance profile"], ["Next step", "Confirm current contact list"]]
        },
        detailTabs: ["Overview", "Notes", "Activity"],
        details: {
          Overview: [["Organization", "Yamhill CCO"], ["Category", "Insurance"], ["Linked profiles", "Client and referral sources"]],
          Notes: [["Portal notes", "Keep current login instructions in Settings later."]],
          Activity: [["7/7/26", "Profile reviewed"]]
        }
      }
    ]
  },
  outreach: [
    {
      id: "outreach-fair",
      name: "Yamhill County Fair",
      status: "Planning",
      subtitle: "Aug 1-3, 2026 | McMinnville",
      facts: [["Date", "August 1-3, 2026"], ["Place", "Yamhill County Fairgrounds"], ["Contact", "Elena Morris"], ["Cost", "$250 booth fee"]],
      sections: {
        "Event Contact": [["Contact", "Elena Morris"], ["Email", "events@yamhillfair.org"], ["Registration", "Online vendor form due July 10"], ["Owner", "Shannon"]]
      },
      detailTabs: ["Logistics", "Outcomes", "Contacts", "Playbook"],
      details: {
        Logistics: [["Date", "August 1-3, 2026"], ["Place", "Yamhill County Fairgrounds"], ["Registration", "Vendor portal; insurance certificate required"], ["Cost", "$250 booth fee + prize supplies"], ["Setup", "10x10 booth, tablecloth, prize wheel, newsletter QR"], ["Follow-up", "Confirm electricity and parking passes"]],
        Outcomes: [["Families reached", "TBD"], ["Main activity", "Prize wheel"], ["Giveaways", "Stickers, handouts"], ["Leads generated", "TBD"]],
        Contacts: [["New contacts", "Newsletter signups and clinic interest"], ["Consent", "Required before importing"]],
        Playbook: [["Prep checklist", "Submit booth registration, confirm staff, pack prize wheel, print QR cards"]]
      }
    }
  ],
  fundraising: [
    {
      id: "grant-ycco",
      name: "YCCO Community Benefit Grant",
      status: "Drafting",
      subtitle: "$50,000 | Due Aug 15",
      facts: [["Due", "August 15, 2026"], ["Request", "$50,000"], ["Owner", "Shannon"], ["Next step", "Narrative in progress"]],
      sections: {
        "Grant Snapshot": [["Funder", "YCCO"], ["Stage", "Drafting"], ["Next step", "Attach KPI projections"], ["Report due", "TBD"]]
      },
      detailTabs: ["Pipeline", "Stewardship", "Donors", "Campaigns", "Earned Income"],
      details: {
        Pipeline: [["Amount requested", "$50,000"], ["Deadline", "August 15, 2026"], ["Program area", "Clinic appointments + outreach"], ["Status", "Drafting"], ["Required attachments", "Budget, board list, outcome measures"], ["Open item", "Update KPI language"]],
        Stewardship: [["Acknowledgment", "Later"], ["Reporting", "TBD"]],
        Donors: [["Active donors", "42"], ["Follow-up", "Thank-you list"]],
        Campaigns: [["Campaign", "Fall giving"], ["Goal", "$25,000"]],
        "Earned Income": [["Workbook sales", "$3.2k YTD"], ["HRSN reimbursement", "Planned"]]
      }
    }
  ],
  marketing: [
    {
      id: "campaign-july",
      name: "July Newsletter",
      status: "Draft",
      subtitle: "Families + partners | MailerLite",
      facts: [["Channel", "Draft email"], ["Audience", "612"], ["Send date", "July 8"], ["Goal", "Class sign-ups"]],
      sections: {
        Audience: [["Segment", "Families, partners, outreach contacts"], ["Delivery", "MailerLite API candidate"], ["Opt-outs", "Respect CRM consent"], ["Owner", "Shannon"]]
      },
      detailTabs: ["Campaigns", "Email Builder", "Analytics", "Consent & Links"],
      details: {
        Campaigns: [["Theme", "Summer classes and clinic openings"], ["Audience", "Newsletter subscribers"], ["Send date", "July 8, 2026"], ["Delivery", "MailerLite integration placeholder"], ["CTA", "Book appointment / sign up for class"], ["Status", "Draft"]],
        "Email Builder": [["Subject", "Summer SNACK updates"], ["Body", "Draft area will live here."]],
        Analytics: [["Open rate", "38%"], ["Reach this month", "1,284"], ["Ad Grant spend today", "$0"]],
        "Consent & Links": [["Consent", "Use CRM consent before sending"], ["Segments", "Newsletter, outreach, donors"]]
      }
    }
  ],
  operations: [
    {
      id: "ops-launch",
      name: "Launch Readiness",
      status: "Active",
      subtitle: "Scheduling + CRM production path",
      facts: [["Priority", "Public cancel/reschedule pending"], ["Status", "CRM refresh in progress"], ["Queue", "Visual passes queued"], ["Checklist", "Production checklist"]],
      sections: {
        "Current Focus": [["Phase", "Clinic Scheduling core"], ["Next", "User visual pass"], ["Then", "CRM implementation pass"], ["Later", "Kitchen and school coming soon"]]
      },
      detailTabs: ["Command Center", "KPI Hub", "Connector Health", "Data Quality", "Launch Queue"],
      details: {
        "Command Center": [["Scheduling V2", "Visual pass needed"], ["CRM refresh", "Implementing"], ["Settings visual pass", "Queued"]],
        "KPI Hub": [["Clinic clients", "TBD"], ["Workbook royalties", "Track in Fundraising"], ["Program KPI", "Waiting for final KPI update"]],
        "Connector Health": [["Google Analytics", "Candidate"], ["Search Console", "Candidate"], ["MailerLite", "Candidate"], ["KDP", "Research needed"]],
        "Data Quality": [["Duplicates", "Queue later"], ["Missing fields", "Queue later"]],
        "Launch Queue": [["Public cancel/reschedule", "Required"], ["Production backup", "Required before cutover"]]
      }
    }
  ],
  settings: [
    {
      id: "settings-program",
      name: "Program Settings",
      status: "Core",
      subtitle: "Staff, roles, availability, modules",
      facts: [["System defaults", "Active"], ["Staff", "Shannon, Cynthia"], ["Clinic availability", "Adjustable"], ["Forms library", "Print packets"]],
      sections: {
        "Settings Groups": [["Staff", "Shannon Oddo, Cynthia Esparza"], ["Scheduling", "Office hours, bookable window, appointment days"], ["Forms", "Print packets for launch"], ["Roles", "Domain access baseline"]]
      },
      detailTabs: ["Staff & Access", "Scheduling Defaults", "Data Tools", "Integrations"],
      details: {
        "Staff & Access": [["Shannon Oddo", "Owner | Executive Director, fundraising, kitchen/classes"], ["Cynthia Esparza", "Admin | Nutrition Coordinator, clinic appointments"], ["Paige Spady", "Remove from launch staff list"]],
        "Scheduling Defaults": [["Appointment days", "Tuesday, Wednesday, Thursday"], ["Office hours", "1:00 PM - 6:00 PM"], ["First appointment", "1:30 PM"], ["Last appointment", "5:30 PM"], ["Slot size", "15 minutes"]],
        "Data Tools": [["JSON export", "Required"], ["Restore from JSON", "Roadmap with preview and validation"], ["Bulk delete", "Disabled in production"]],
        Integrations: [["MailerLite", "Candidate"], ["Google Analytics", "Candidate"], ["Search Console", "Candidate"], ["Google Ad Grants", "Candidate"]]
      }
    }
  ]
};

const tasks = {
  schedule: ["Verify public cancel/reschedule after visual pass", "Review no-show task behavior"],
  crm: ["Remove client board view", "Confirm linked sibling/provider profile behavior"],
  outreach: ["Confirm event status list", "Add event contact import later"],
  fundraising: ["Confirm grant stages", "Decide donor profile fields"],
  marketing: ["Confirm MailerLite as delivery tool", "Map newsletter consent rules"],
  operations: ["Keep launch blockers visible", "Define connector health checks"],
  settings: ["Confirm staff list", "Confirm reminder consent wording"]
};

const root = document.querySelector("#module-root");
const appShell = document.querySelector("#app");
const nav = document.querySelector("#module-nav");
const quickActions = document.querySelector("#quick-actions-list");
const sidebarToggle = document.querySelector("#sidebar-toggle");
const toast = document.querySelector("#toast");
const workspace = document.querySelector(".workspace");

function render() {
  const config = moduleConfig[state.module];
  root.style.setProperty("--module-color", config.color);
  root.style.setProperty("--module-soft-color", config.soft);
  root.style.setProperty("--module-line-color", config.line);
  document.documentElement.style.setProperty("--module", config.color);
  document.documentElement.style.setProperty("--module-soft", config.soft);
  document.documentElement.style.setProperty("--module-line", config.line);
  renderNav();
  renderQuickActions();
  root.innerHTML = `
    ${renderModuleHeader(config)}
    ${renderSummary(config)}
    ${state.module === "schedule" ? renderSchedule() : renderGenericModule()}
  `;
}

function resetWorkspaceScroll() {
  workspace?.scrollTo({ top: 0, left: 0 });
  window.scrollTo({ top: 0, left: 0 });
}

function renderNav() {
  const order = ["schedule", "crm", "outreach", "fundraising", "marketing", "operations", "settings"];
  nav.innerHTML = order.map((key) => {
    const config = moduleConfig[key];
    const active = key === state.module ? " active" : "";
    return `
      <button class="nav-item${active}" type="button" data-module="${key}" ${active ? 'aria-current="page"' : ""}>
        <span class="nav-icon" aria-hidden="true">${config.icon}</span>
        <span class="nav-label">${config.label}</span>
      </button>
    `;
  }).join("");
}

function renderQuickActions() {
  const config = moduleConfig[state.module];
  quickActions.innerHTML = config.quickActions.map((label) => `
    <button class="quick-action" type="button" data-quick-action="${escapeAttr(label)}">
      <span class="action-icon" aria-hidden="true">${label.startsWith("Print") ? "□" : "+"}</span>
      <span>${label}</span>
    </button>
  `).join("");
}

function renderModuleHeader(config) {
  const activeTab = state.tabs[state.module];
  return `
    <header class="module-header">
      <div class="module-title">
        <h1>${config.title}</h1>
        <p>${config.description}</p>
      </div>
      <div class="module-controls">
        <div class="segmented" role="tablist" aria-label="${config.label} views">
          ${config.tabs.map((tab) => `
            <button type="button" role="tab" data-tab="${escapeAttr(tab)}" class="${tab === activeTab ? "active" : ""}" aria-selected="${tab === activeTab}">
              ${tab}
            </button>
          `).join("")}
        </div>
        <button class="primary-action" type="button" data-primary-action>${config.action}</button>
      </div>
    </header>
  `;
}

function renderSummary(config) {
  const metrics = getMetrics(state.module);
  return `
    <section class="summary-strip" aria-label="${config.label} summary">
      ${metrics.map((metric) => `
        <div class="summary-card">
          <strong>${metric.value}</strong>
          <span>${metric.label}</span>
        </div>
      `).join("")}
    </section>
  `;
}

function getMetrics(moduleKey) {
  if (moduleKey === "schedule") {
    const today = appointments.filter((appt) => appt.date === "2026-07-07");
    return [
      ["Today", today.length],
      ["Completed", today.filter((appt) => appt.status === "Completed").length],
      ["No Show", today.filter((appt) => appt.status === "No-show").length],
      ["Reschedule", today.filter((appt) => appt.status === "Reschedule").length]
    ].map(([label, value]) => ({ label, value }));
  }
  const metrics = {
    crm: [["Clients", data.crm.Clients.length], ["Referrals", data.crm.Referrals.length], ["Providers", data.crm["Referral Network"].length], ["Reschedule", 1]],
    outreach: [["Annual events", 12], ["Families reached", 418], ["New contacts", 96], ["Event costs", "$1.8k"]],
    fundraising: [["Grant pipeline", "$185k"], ["Active donors", 42], ["Sponsor prospects", 8], ["Earned income YTD", "$3.2k"]],
    marketing: [["Reach this month", "1,284"], ["Email subscribers", 612], ["Email open rate", "38%"], ["Ad Grant spend today", "$0"]],
    operations: [["Launch blockers", 3], ["Data alerts", 8], ["Reports due", 4], ["Connector checks", 5]],
    settings: [["Active staff", 2], ["Scheduling defaults", 3], ["Print packets", 6], ["Connector setups", 5]]
  };
  return metrics[moduleKey].map(([label, value]) => ({ label, value }));
}

function renderGenericModule() {
  const activeTab = state.tabs[state.module];
  if (activeTab === "Tasks") {
    return renderTaskPanel();
  }
  if (activeTab === "Reports") {
    return renderReportsPanel();
  }
  return renderRecordModule();
}

function getCurrentRecords() {
  if (state.module === "crm") {
    return data.crm[state.tabs.crm];
  }
  return data[state.module];
}

function renderRecordModule() {
  const records = getFilteredRecords();
  const selected = getSelectedRecord(records);
  const moduleKey = state.module === "crm" ? "crm" : state.module;
  if (selected) {
    state.selected[moduleKey] = selected.id;
  }
  return `
    <section class="record-layout">
      <div class="record-list-panel">
        ${renderSearch()}
        <div class="record-list">
          ${records.map((record) => renderRecordRow(record)).join("")}
        </div>
      </div>
      ${selected ? renderProfilePanel(selected) : '<div class="record-profile-panel"><div class="empty-state">Choose a record to preview.</div></div>'}
      ${selected ? renderDetailPanel(selected) : '<div class="record-detail-panel"><div class="empty-state">Choose a record to preview.</div></div>'}
    </section>
  `;
}

function getFilteredRecords() {
  const records = getCurrentRecords();
  const term = (state.search[state.module] || "").trim().toLowerCase();
  if (!term) return records;
  return records.filter((record) => `${record.name} ${record.status} ${record.subtitle}`.toLowerCase().includes(term));
}

function getSelectedRecord(records) {
  const key = state.module === "crm" ? "crm" : state.module;
  return records.find((record) => record.id === state.selected[key]) || records[0];
}

function renderSearch() {
  return `
    <label class="search-field">
      <span aria-hidden="true">⌕</span>
      <input type="search" value="${escapeAttr(state.search[state.module] || "")}" data-search placeholder="Search ${moduleConfig[state.module].label.toLowerCase()}">
    </label>
  `;
}

function renderRecordRow(record) {
  const [color, soft, line] = statusStyles[record.status] || [moduleConfig[state.module].color, moduleConfig[state.module].soft, moduleConfig[state.module].line];
  const key = state.module === "crm" ? "crm" : state.module;
  return `
    <button class="record-row ${state.selected[key] === record.id ? "active" : ""}" type="button" data-select-record="${record.id}" style="--row-color:${color}; --pill-color:${color}; --pill-bg:${soft}; --pill-line:${line};">
      <span class="record-accent" aria-hidden="true"></span>
      <span class="record-main">
        <strong>${record.name}</strong>
        <span>${record.subtitle}</span>
      </span>
      <span class="pill">${record.status}</span>
    </button>
  `;
}

function renderProfilePanel(record) {
  return `
    <aside class="record-profile-panel">
      <div class="profile-header">
        <div class="status-line"><span class="status-dot"></span>${record.status}</div>
        <h2>${record.name}</h2>
        <div class="profile-facts">
          ${record.facts.map(([label, value]) => `
            <div class="fact"><span class="fact-icon" aria-hidden="true">□</span><span>${label}: ${value}</span></div>
          `).join("")}
        </div>
      </div>
      ${Object.entries(record.sections).map(([title, rows]) => `
        <section class="profile-section">
          <h3>${title}</h3>
          <div class="profile-fields">
            ${rows.map(([label, value]) => `<div class="field-pair"><span>${label}</span><strong>${value}</strong></div>`).join("")}
          </div>
          ${title === "Family" ? '<button class="text-link" type="button" data-toast="Family profile link selected">View Family Profile</button>' : ""}
        </section>
      `).join("")}
    </aside>
  `;
}

function renderDetailPanel(record) {
  const tabKey = state.module === "crm" ? "crm" : state.module;
  const active = record.detailTabs.includes(state.detailTabs[tabKey]) ? state.detailTabs[tabKey] : record.detailTabs[0];
  state.detailTabs[tabKey] = active;
  const rows = record.details[active] || [];
  return `
    <section class="record-detail-panel">
      <nav class="detail-tabs" aria-label="${record.name} detail tabs">
        ${record.detailTabs.map((tab) => `<button type="button" data-detail-tab="${escapeAttr(tab)}" class="${tab === active ? "active" : ""}">${tab}</button>`).join("")}
      </nav>
      <div class="detail-content">
        <article class="detail-card">
          <h3>${active}</h3>
          <div class="detail-grid">
            ${rows.map(([label, value]) => `
              <div class="${String(value).length > 48 ? "wide" : ""}">
                <span class="detail-term">${label}</span>
                <strong class="detail-value">${value}</strong>
              </div>
            `).join("")}
          </div>
        </article>
      </div>
      <div class="detail-actions">
        <button class="secondary-action" type="button" data-toast="Saved update for ${escapeAttr(record.name)}">Save Update</button>
        <button class="ghost-action" type="button" data-create-task="${escapeAttr(record.name)}">Create Task</button>
        <button class="ghost-action" type="button" data-export-record="${record.id}">Export</button>
      </div>
    </section>
  `;
}

function renderTaskPanel() {
  return `
    <section class="task-list-panel">
      ${tasks[state.module].map((task, index) => `
        <label class="task-row">
          <input type="checkbox" data-task-index="${index}">
          <span>
            <h3>${task}</h3>
            <span class="detail-term">Working queue for ${moduleConfig[state.module].label}</span>
          </span>
          <span class="pill">Open</span>
        </label>
      `).join("")}
    </section>
  `;
}

function renderReportsPanel() {
  const reports = [
    ["This month", "Summary of activity and outcomes."],
    ["Launch readiness", "Open items and next checks."],
    ["Export preview", "Downloadable report placeholder."]
  ];
  return `
    <section class="report-grid">
      ${reports.map(([title, body]) => `
        <article class="report-card">
          <h3>${title}</h3>
          <p class="detail-term">${body}</p>
          <button class="secondary-action" type="button" data-toast="${escapeAttr(title)} report opened">Open Report</button>
        </article>
      `).join("")}
    </section>
  `;
}

function renderSchedule() {
  const activeTab = state.tabs.schedule;
  return `
    <section class="schedule-layout">
      <div class="schedule-board">
        <div class="date-controls">
          <button class="date-button" type="button" data-toast="Today selected">Today</button>
          <button class="date-button" type="button" data-toast="Previous clinic day selected">‹</button>
          <button class="date-button" type="button" data-toast="Next clinic day selected">›</button>
          <button class="date-button" type="button" data-toast="Date picker opened">Tue, Jul 7, 2026</button>
        </div>
        ${activeTab === "Day" ? renderDayView() : activeTab === "Week" ? renderWeekView() : renderMonthView()}
      </div>
      ${state.scheduleMode === "new" || state.scheduleMode === "block" ? renderAppointmentForm() : renderAppointmentPanel()}
    </section>
  `;
}

function renderDayView() {
  const start = toMinutes("1:00 PM");
  const end = toMinutes("6:00 PM");
  const total = end - start;
  const visible = appointments.filter((appt) => appt.date === "2026-07-07");
  const labels = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM"];
  return `
    <div class="day-grid" aria-label="Day schedule">
      ${labels.map((label) => {
        const top = ((toMinutes(label) - start) / total) * 100;
        return `<span class="time-line" style="top:${top}%"></span><span class="time-label" style="top:${top}%">${label}</span>`;
      }).join("")}
      ${visible.map((appt) => {
        const top = ((toMinutes(appt.time) - start) / total) * 100;
        const height = (appt.duration / total) * 100;
        return renderAppointmentBlock(appt, top, height);
      }).join("")}
    </div>
  `;
}

function renderAppointmentBlock(appt, top, height) {
  const [color, soft, line] = statusStyles[appt.status] || statusStyles.Scheduled;
  const minimumHeight = appt.duration < 30 ? 42 : 58;
  return `
    <button class="appointment-block ${state.selected.appointment === appt.id ? "active" : ""}" type="button" data-select-appointment="${appt.id}" style="top:${top}%; height:${height}%; min-height:${minimumHeight}px; --appt-color:${color}; --appt-bg:${soft}; --appt-line:${line};">
      <strong>${appt.displayName}</strong>
      <span>${appt.lesson} | ${appt.duration} min</span>
      <span class="pill" style="--pill-color:${color}; --pill-bg:${soft}; --pill-line:${line};">${appt.status}</span>
    </button>
  `;
}

function renderWeekView() {
  const days = [
    ["Tue", "2026-07-07"],
    ["Wed", "2026-07-08"],
    ["Thu", "2026-07-09"]
  ];
  return `
    <div class="week-list">
      ${days.map(([label, date]) => {
        const dayAppts = appointments.filter((appt) => appt.date === date);
        return `
          <section class="week-day ${date === "2026-07-07" ? "active" : ""}">
            <div class="week-day-header">
              <div><h3>${label}</h3><span class="detail-term">${formatDateShort(date)}</span></div>
              <span class="pill">${dayAppts.length}</span>
            </div>
            <div class="week-appointments">
              ${dayAppts.length ? dayAppts.map(renderWeekAppointment).join("") : '<p class="detail-term">Open clinic day.</p>'}
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function renderWeekAppointment(appt) {
  const [color, soft, line] = statusStyles[appt.status] || statusStyles.Scheduled;
  return `
    <button class="week-appointment" type="button" data-select-appointment="${appt.id}" style="--appt-color:${color}; --appt-bg:${soft}; --appt-line:${line};">
      <strong>${appt.time} ${appt.displayName}</strong>
      <span>${appt.lesson} | ${appt.duration} min</span>
    </button>
  `;
}

function renderMonthView() {
  const dates = ["2026-06-30", "2026-07-01", "2026-07-02", "2026-07-07", "2026-07-08", "2026-07-09", "2026-07-14", "2026-07-15", "2026-07-16", "2026-07-21", "2026-07-22", "2026-07-23"];
  return `
    <div>
      <h2>July 2026</h2>
      <p class="detail-term">Clinic appointments are available Tuesday, Wednesday, Thursday.</p>
      <div class="month-grid">
        ${dates.map((date) => {
          const dayAppts = appointments.filter((appt) => appt.date === date);
          return `
            <section class="month-day">
              <div class="month-day-header">
                <h3>${formatMonthDay(date)}</h3>
                <span class="detail-term">${dayAppts.length ? `${dayAppts.length} appt${dayAppts.length === 1 ? "" : "s"}` : "Open"}</span>
              </div>
              <div class="month-appointments">
                ${dayAppts.map((appt) => {
                  const [color, soft, line] = statusStyles[appt.status] || statusStyles.Scheduled;
                  return `
                    <button class="month-appt" type="button" data-select-appointment="${appt.id}" style="--appt-color:${color}; --appt-bg:${soft}; --appt-line:${line};">
                      <strong>${appt.time} ${appt.displayName}</strong>
                    </button>
                  `;
                }).join("")}
              </div>
            </section>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderAppointmentPanel() {
  const appt = appointments.find((item) => item.id === state.selected.appointment) || appointments[0];
  const tabs = ["Appt Note", "Wrap Up", "Activity", "Forms"];
  const active = tabs.includes(state.detailTabs.appointment) ? state.detailTabs.appointment : "Appt Note";
  state.detailTabs.appointment = active;
  return `
    <section class="appointment-panel">
      <aside class="appointment-aside">
        ${renderAppointmentAside(appt)}
      </aside>
      <section class="record-detail-panel">
        <nav class="detail-tabs" aria-label="Appointment detail tabs">
          ${tabs.map((tab) => `<button type="button" data-appointment-tab="${tab}" class="${tab === active ? "active" : ""}">${tab}</button>`).join("")}
        </nav>
        <div class="detail-content">${renderAppointmentTab(appt, active)}</div>
        ${active === "Wrap Up" ? "" : `
          <div class="detail-actions">
            <button class="secondary-action" type="button" data-mark-complete>Mark Complete</button>
            <button class="ghost-action" type="button" data-reschedule>Reschedule</button>
            <button class="ghost-action" type="button" data-no-show>No Show</button>
          </div>
        `}
      </section>
    </section>
  `;
}

function renderAppointmentAside(appt) {
  return `
    <div class="profile-header">
      <div class="status-line"><span class="status-dot"></span>${appt.status}</div>
      <h2>${appt.displayName}</h2>
      <div class="profile-facts">
        <div class="fact"><span class="fact-icon">Date</span><span>${formatFullDate(appt.date)}</span></div>
        <div class="fact"><span class="fact-icon">Time</span><span>${appt.time} - ${appt.duration} min</span></div>
        <div class="fact"><span class="fact-icon">Type</span><span>${appt.type}</span></div>
      </div>
    </div>
    <section class="profile-section">
      <h3>Family</h3>
      <div class="profile-fields">
        <div class="field-pair"><span>Caregiver</span><strong>${appt.caregiver}</strong></div>
        <div class="field-pair"><span>Siblings</span><strong>${appt.siblings.join("<br>")}</strong></div>
        <div class="field-pair"><span>Language</span><strong>${appt.language}</strong></div>
        <div class="field-pair"><span>Phone</span><strong>${appt.phone}</strong></div>
        <div class="field-pair"><span>Address</span><strong>${appt.address}</strong></div>
      </div>
      <button class="text-link" type="button" data-toast="Family profile link selected">View Family Profile</button>
    </section>
  `;
}

function renderAppointmentTab(appt, active) {
  if (active === "Activity") {
    return `
      <article class="detail-card">
        <h3>Activity</h3>
        <div class="detail-grid">
          ${appt.activity.map(([date, action, detail]) => `
            <div><span class="detail-term">${date}</span></div>
            <div><strong class="detail-value">${action}</strong><span class="detail-term">${detail}</span></div>
          `).join("")}
        </div>
      </article>
    `;
  }
  if (active === "Forms") {
    return `
      <article class="detail-card">
        <h3>Forms</h3>
        <div class="detail-actions" style="border-top:0; padding:0; margin-bottom:16px;">
          <button class="ghost-action" type="button" data-toast="Appointment note print view opened">Print Appt Note</button>
          <button class="ghost-action" type="button" data-toast="Prep print view opened">Print Prep</button>
          <button class="ghost-action" type="button" data-toast="Day schedule print view opened">Print Day Schedule</button>
        </div>
        <div class="detail-card" style="background:#f8fafc;">
          <strong>Likely Needed</strong>
          <ul>
            <li>${appt.lesson} note sheet</li>
            <li>Lesson handouts</li>
            <li>Goal tracker</li>
          </ul>
        </div>
      </article>
    `;
  }
  if (active === "Wrap Up") {
    return `
      <article class="detail-card">
        <h3>Next Appointment</h3>
        <div class="form-grid">
          <label class="field wide"><span><input type="checkbox" checked> Schedule next lesson</span></label>
          <label class="field"><span>Date</span><input type="date" value="2026-07-14"></label>
          <label class="field"><span>Time</span><select>${timeOptions().map((time) => `<option ${time === appt.time ? "selected" : ""}>${time}</option>`).join("")}</select></label>
          <label class="field"><span>Staff</span><select><option>Cynthia Esparza</option><option>Shannon Oddo</option></select></label>
          <label class="field"><span>Goal</span><input value="${escapeAttr(appt.goal === "-" ? "" : appt.goal)}"></label>
          <label class="field wide"><span>Notes</span><textarea>${appt.notes === "-" ? "" : appt.notes}</textarea></label>
          <label class="field wide"><span>Appointment Note</span><textarea>${appt.notes === "-" ? "" : appt.notes}</textarea></label>
        </div>
      </article>
      <article class="detail-card">
        <h3>Engagement</h3>
        <div class="form-grid">
          ${["Caregiver Mood", "Confidence", "Participation", "Barriers"].map((field) => `
            <label class="field"><span>${field}</span><select><option>Good</option><option>Okay</option><option>High</option><option>Engaged</option><option>None</option></select></label>
          `).join("")}
        </div>
      </article>
      <button class="primary-action" type="button" data-complete-appointment style="justify-self:end;">Complete Appointment</button>
    `;
  }
  return `
    <article class="detail-card">
      <h3>Details</h3>
      <div class="detail-grid">
        <div><span class="detail-term">Lesson</span><strong class="detail-value">${appt.lesson}</strong></div>
        <div><span class="detail-term">Staff</span><strong class="detail-value">${appt.staff}</strong></div>
        <div class="wide"><span class="detail-term">Goal</span><strong class="detail-value">${appt.goal}</strong></div>
        <div class="wide"><span class="detail-term">Notes</span><strong class="detail-value">${appt.notes}</strong></div>
      </div>
    </article>
    <article class="detail-card">
      <h3>Prep</h3>
      <ul class="check-list">
        ${appt.prep.map((item) => `<li><label><input type="checkbox"> ${item}</label></li>`).join("")}
      </ul>
    </article>
  `;
}

function renderAppointmentForm() {
  const isBlock = state.scheduleMode === "block";
  return `
    <section class="appointment-panel">
      <aside class="appointment-aside">
        <div class="profile-header">
          <div class="status-line"><span class="status-dot"></span>${isBlock ? "Blocked" : "Scheduled"}</div>
          <h2>${isBlock ? "New Blocked Time" : "New Appointment"}</h2>
          <div class="profile-facts">
            <div class="fact"><span class="fact-icon">□</span><span>Tuesday, July 7, 2026</span></div>
            <div class="fact"><span class="fact-icon">○</span><span>Choose time</span></div>
            <div class="fact"><span class="fact-icon">□</span><span>${isBlock ? "Cynthia Esparza" : "Enrollment"}</span></div>
          </div>
        </div>
      </aside>
      <form class="appointment-form" data-appointment-form>
        <div class="form-header">
          <h2>${isBlock ? "Blocked Time" : "Appointment"}</h2>
          <button class="ghost-action" type="button" data-cancel-form>Cancel</button>
        </div>
        ${isBlock ? "" : `
          <label class="field wide">
            <span>Clients</span>
            <div class="client-picker">
              <input data-client-input list="client-options" placeholder="Start typing a client name">
              <button class="secondary-action" type="button" data-add-client>Add</button>
            </div>
            <datalist id="client-options">
              ${data.crm.Clients.map((client) => `<option value="${escapeAttr(client.name)}"></option>`).join("")}
            </datalist>
            <div class="client-chips">
              ${state.pendingClients.map((name) => `<span class="client-chip">${name}<button type="button" data-remove-client="${escapeAttr(name)}">Remove</button></span>`).join("")}
            </div>
          </label>
        `}
        <div class="form-grid">
          <label class="field"><span>Status</span><select name="status"><option>${isBlock ? "Blocked" : "Scheduled"}</option><option>Reschedule</option><option>No-show</option></select></label>
          <label class="field"><span>Date</span><input name="date" type="date" value="2026-07-07"></label>
          <label class="field"><span>Time</span><select name="time"><option value="">Choose time</option>${timeOptions().map((time) => `<option>${time}</option>`).join("")}</select></label>
          <label class="field"><span>Type</span><select name="type"><option>${isBlock ? "Administrative" : "Enrollment"}</option><option>Nutrition Education</option><option>Spanish Enrollment</option><option>Spanish Nutrition Education</option></select></label>
          ${isBlock ? "" : '<label class="field"><span>Lesson</span><select name="lesson"><option>-</option><option>Enrollment</option><option>Nutrient Density</option><option>Sugar</option><option>Food Groups</option><option>Micronutrients</option></select></label><label class="field"><span>Goal</span><input name="goal"></label>'}
          <label class="field"><span>Staff</span><select name="staff"><option>Cynthia Esparza</option><option>Shannon Oddo</option></select></label>
          <label class="field wide"><span>Notes</span><textarea name="notes">${isBlock ? "Blocked time" : ""}</textarea></label>
        </div>
        <button class="primary-action" type="submit" style="justify-self:end;">${isBlock ? "Save Block" : "Save Appointment"}</button>
      </form>
    </section>
  `;
}

function timeOptions() {
  return ["1:30 PM", "1:45 PM", "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM", "3:00 PM", "3:15 PM", "3:30 PM", "3:45 PM", "4:00 PM", "4:15 PM", "4:30 PM", "4:45 PM", "5:00 PM", "5:15 PM", "5:30 PM"];
}

function handlePrimaryAction() {
  if (state.module === "schedule") {
    state.scheduleMode = "new";
    state.pendingClients = [];
    render();
    return;
  }
  const records = getCurrentRecords();
  const label = moduleConfig[state.module].action.replace("New ", "");
  const record = {
    id: `${state.module}-${Date.now()}`,
    name: `New ${label}`,
    status: state.module === "crm" ? "Active" : "Draft",
    subtitle: "Draft record",
    facts: [["Status", "Draft"], ["Owner", "Shannon"], ["Next step", "Fill in details"]],
    sections: { Details: [["Created", "Just now"], ["Source", "Manual"]] },
    detailTabs: ["Overview", "Notes", "Activity"],
    details: {
      Overview: [["Status", "Draft"], ["Owner", "Shannon"]],
      Notes: [["Notes", "Add notes here."]],
      Activity: [["Today", "Created"]]
    }
  };
  records.unshift(record);
  state.selected[state.module === "crm" ? "crm" : state.module] = record.id;
  showToast(`${record.name} created.`);
  render();
}

document.addEventListener("click", (event) => {
  const moduleButton = event.target.closest("[data-module]");
  if (moduleButton) {
    state.module = moduleButton.dataset.module;
    state.scheduleMode = "detail";
    render();
    resetWorkspaceScroll();
    return;
  }

  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    state.tabs[state.module] = tabButton.dataset.tab;
    state.scheduleMode = "detail";
    render();
    resetWorkspaceScroll();
    return;
  }

  const primary = event.target.closest("[data-primary-action]");
  if (primary) {
    handlePrimaryAction();
    return;
  }

  const recordButton = event.target.closest("[data-select-record]");
  if (recordButton) {
    state.selected[state.module === "crm" ? "crm" : state.module] = recordButton.dataset.selectRecord;
    render();
    return;
  }

  const detailTab = event.target.closest("[data-detail-tab]");
  if (detailTab) {
    state.detailTabs[state.module === "crm" ? "crm" : state.module] = detailTab.dataset.detailTab;
    render();
    return;
  }

  const apptButton = event.target.closest("[data-select-appointment]");
  if (apptButton) {
    state.selected.appointment = apptButton.dataset.selectAppointment;
    state.scheduleMode = "detail";
    render();
    return;
  }

  const apptTab = event.target.closest("[data-appointment-tab]");
  if (apptTab) {
    state.detailTabs.appointment = apptTab.dataset.appointmentTab;
    render();
    return;
  }

  if (event.target.closest("[data-mark-complete]")) {
    state.detailTabs.appointment = "Wrap Up";
    render();
    return;
  }

  if (event.target.closest("[data-complete-appointment]")) {
    const appt = appointments.find((item) => item.id === state.selected.appointment);
    if (appt) {
      appt.status = "Completed";
      appt.activity.unshift(["Today", "Completed", `${appt.lesson} | ${appt.staff}`]);
      showToast(`${appt.displayName} marked complete.`);
    }
    state.detailTabs.appointment = "Appt Note";
    render();
    return;
  }

  if (event.target.closest("[data-no-show]")) {
    const appt = appointments.find((item) => item.id === state.selected.appointment);
    if (appt) {
      appt.status = "No-show";
      appt.activity.unshift(["Today", "No-show", `${appt.lesson} | ${appt.staff}`]);
      showToast(`${appt.displayName} marked no-show.`);
      render();
    }
    return;
  }

  if (event.target.closest("[data-reschedule]")) {
    const appt = appointments.find((item) => item.id === state.selected.appointment);
    state.scheduleMode = "new";
    state.pendingClients = appt ? [...appt.clients] : [];
    showToast("Reschedule form opened.");
    render();
    return;
  }

  if (event.target.closest("[data-cancel-form]")) {
    state.scheduleMode = "detail";
    render();
    return;
  }

  if (event.target.closest("[data-add-client]")) {
    const input = document.querySelector("[data-client-input]");
    const name = input?.value.trim();
    if (name && !state.pendingClients.includes(name)) {
      state.pendingClients.push(name);
      render();
    }
    return;
  }

  const removeClient = event.target.closest("[data-remove-client]");
  if (removeClient) {
    state.pendingClients = state.pendingClients.filter((name) => name !== removeClient.dataset.removeClient);
    render();
    return;
  }

  const quickAction = event.target.closest("[data-quick-action]");
  if (quickAction) {
    const label = quickAction.dataset.quickAction;
    if (state.module === "schedule" && label === "New Appointment") {
      state.scheduleMode = "new";
      state.pendingClients = [];
      render();
    } else if (state.module === "schedule" && label === "Block Time") {
      state.scheduleMode = "block";
      render();
    } else {
      showToast(`${label} selected.`);
    }
    return;
  }

  const toastButton = event.target.closest("[data-toast]");
  if (toastButton) {
    showToast(toastButton.dataset.toast);
    return;
  }

  const createTask = event.target.closest("[data-create-task]");
  if (createTask) {
    tasks[state.module].unshift(`Follow up on ${createTask.dataset.createTask}`);
    showToast("Task created.");
    return;
  }

  const exportButton = event.target.closest("[data-export-record]");
  if (exportButton) {
    exportSelectedRecord(exportButton.dataset.exportRecord);
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-search]")) {
    state.search[state.module] = event.target.value;
    render();
  }
});

document.addEventListener("submit", (event) => {
  if (!event.target.matches("[data-appointment-form]")) return;
  event.preventDefault();
  const formData = new FormData(event.target);
  const isBlock = state.scheduleMode === "block";
  const time = formData.get("time") || "1:30 PM";
  if (!isBlock && state.pendingClients.length === 0) {
    showToast("Add at least one client before saving.");
    return;
  }
  const id = `appt-${Date.now()}`;
  appointments.push({
    id,
    clients: isBlock ? ["Blocked"] : [...state.pendingClients],
    displayName: isBlock ? "Blocked Time" : state.pendingClients.join(" & "),
    status: isBlock ? "Scheduled" : String(formData.get("status") || "Scheduled"),
    date: String(formData.get("date") || "2026-07-07"),
    time,
    duration: isBlock ? 30 : 30,
    type: String(formData.get("type") || "Nutrition Education"),
    lesson: String(formData.get("lesson") || formData.get("type") || "Nutrition Education"),
    staff: String(formData.get("staff") || "Cynthia Esparza"),
    caregiver: "Caregiver",
    siblings: isBlock ? [] : [...state.pendingClients],
    language: "English",
    phone: "-",
    address: "-",
    goal: String(formData.get("goal") || "-"),
    notes: String(formData.get("notes") || "-"),
    prep: ["Review appointment details.", "Prepare forms if needed."],
    activity: [["Today", "Appointment created", time]]
  });
  state.selected.appointment = id;
  state.scheduleMode = "detail";
  state.detailTabs.appointment = "Appt Note";
  state.pendingClients = [];
  showToast(isBlock ? "Blocked time saved." : "Appointment saved.");
  render();
});

sidebarToggle.addEventListener("click", () => {
  const closed = appShell.dataset.sidebar === "closed";
  appShell.dataset.sidebar = closed ? "open" : "closed";
  sidebarToggle.setAttribute("aria-expanded", String(closed));
  sidebarToggle.setAttribute("aria-label", closed ? "Collapse navigation" : "Expand navigation");
  sidebarToggle.querySelector("span").textContent = closed ? "‹" : "›";
});

function toMinutes(time) {
  const [clock, meridiem] = time.split(" ");
  let [hours, minutes] = clock.split(":").map(Number);
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function formatFullDate(date) {
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatDateShort(date) {
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });
}

function formatMonthDay(date) {
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function exportSelectedRecord(id) {
  const record = getCurrentRecords().find((item) => item.id === id);
  if (!record) return;
  const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${record.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Export started.");
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

render();
