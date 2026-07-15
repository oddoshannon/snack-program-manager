import {
  formatAppointmentDate,
  formatScheduleDate,
  formatScheduleTime,
  mapAppointment,
  offsetScheduleDate,
  scheduleDateKey,
  scheduleTimeMinutes
} from "./modules/schedule.js";

const icons = {
  schedule: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4M4 9h16M6 4h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>`,
  crm: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="8" r="2.4"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M14.8 16.4A4.8 4.8 0 0 1 21 20"/></svg>`,
  outreach: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14h4l9 5V5l-9 5H4z"/><path d="M20 9.5a4 4 0 0 1 0 5"/></svg>`,
  fundraising: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  marketing: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 18-7-7 18-3-8-8-3zM11 14l10-10"/></svg>`,
  operations: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M8 15v-4M12 15V7M16 15v-6"/></svg>`,
  admin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 8.92 4a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.47.52.82 1 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4M4 9h16M6 4h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>`,
  history: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>`,
  file: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l4 4v16H6zM14 2v5h5"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`
};

const moduleOrder = ["schedule", "crm", "outreach", "fundraising", "marketing", "operations", "admin"];

const modules = {
  schedule: {
    label: "Schedule",
    title: "Clinic Schedule",
    icon: "schedule",
    tone: "red",
    theme: ["var(--red)", "var(--red-soft)", "#f4b4b6"],
    subpages: ["Clinic", "Public Booking", "Unscheduled", "Print Forms", "Settings"],
    views: ["Day", "Week"],
    primaryAction: "New Appointment",
    quickActions: ["New Appointment", "Block Time", "Print Schedule"],
    summary: [["0", "Today"], ["0", "Completed"], ["0", "No Show"], ["0", "Reschedule"]],
    listTitle: "Clinic",
    footerActions: ["Mark Complete", "Reschedule", "No Show"],
    detailTabs: ["Appt Note", "Wrap Up", "Activity", "Forms"],
    detailTabIcons: ["calendar", "check", "history", "file"],
    sideTitle: "Family",
    sideIcon: "crm",
    sideLink: "View Family Profile",
    sideFields: [["Caregiver", "caregiver"], ["Siblings", "siblings"], ["Language", "language"], ["Phone", "phone"]],
    cards: [
      { title: "Details", fields: [["Lesson", "lesson"], ["Staff", "staff"], ["Goal", "goal"], ["Notes", "notes"]] },
      { title: "Prep", fields: [["Forms", "forms"], ["Supplies", "supplies"]] }
    ],
    items: []
  },
  crm: {
    label: "CRM",
    title: "CRM",
    icon: "crm",
    tone: "orange",
    theme: ["var(--orange)", "var(--orange-soft)", "#f5bd8e"],
    subpages: ["Clients", "Referrals", "Referral Network", "Tasks", "Forms"],
    views: ["Clients", "Referrals", "Tasks"],
    primaryAction: "New Client",
    quickActions: ["New Client", "New Referral", "New Task"],
    summary: [["3", "Reschedule"], ["2", "Scheduled"], ["3", "Active"], ["2", "Watch List"]],
    listTitle: "Clients",
    footerActions: ["Log Call", "New Appt", "Close Client"],
    detailTabs: ["Overview", "Notes", "Appointments", "Forms"],
    sideTitle: "Family",
    sideLink: "View Family Profile",
    sideFields: [["Caregiver", "caregiver"], ["Siblings", "siblings"], ["Language", "language"], ["Phone", "phone"]],
    cards: [
      { title: "Snapshot", fields: [["Date of birth", "dob"], ["Insurance", "insurance"], ["First appointment", "firstAppt"], ["Most recent appointment", "recentAppt"]] },
      { title: "Lesson Progression", fields: [["Current stage", "stage"], ["Next lesson", "nextLesson"], ["Provider profiles", "providerProfiles"], ["Referral source", "referralSource"]] }
    ],
    items: [
      {
        id: "kathan",
        title: "Kathan Teeters",
        subtitle: "Jennifer | 6/9/26",
        status: "Reschedule",
        caregiver: "Jennifer",
        siblings: "None linked yet",
        language: "English",
        phone: "(971) 237-8215",
        dob: "8/14/13",
        insurance: "YCCO",
        firstAppt: "12/3/25",
        recentAppt: "-",
        stage: "Enrollment complete",
        nextLesson: "Nutrient Density",
        providerProfiles: "None linked yet",
        referralSource: "Internal clinic referral"
      },
      {
        id: "rafael-janney-crm",
        title: "Rafael & Janney",
        subtitle: "Enrollment | 6/30/26",
        status: "Scheduled",
        caregiver: "Neiva",
        siblings: "Rafael, Janney",
        language: "Spanish",
        phone: "(971) 447-2646",
        dob: "Sibling profiles",
        insurance: "YCCO",
        firstAppt: "6/30/26",
        recentAppt: "-",
        stage: "Enrollment scheduled",
        nextLesson: "Enrollment",
        providerProfiles: "None linked yet",
        referralSource: "Event contact"
      },
      {
        id: "cali",
        title: "Cali Flint",
        subtitle: "Sugar | 6/23/26",
        status: "Active",
        caregiver: "Amanda",
        siblings: "Mark",
        language: "English",
        phone: "(971) 555-0108",
        dob: "5/3/14",
        insurance: "YCCO",
        firstAppt: "6/3/26",
        recentAppt: "6/23/26",
        stage: "Nutrition education",
        nextLesson: "Food Groups",
        providerProfiles: "Sibling profile linked",
        referralSource: "Clinic partner"
      }
    ]
  },
  outreach: {
    label: "Outreach",
    title: "Outreach",
    icon: "outreach",
    tone: "yellow",
    theme: ["var(--yellow)", "var(--yellow-soft)", "#ead18a"],
    subpages: ["Events", "Contacts", "Tasks", "Reports"],
    views: ["Events", "Contacts", "Reports"],
    primaryAction: "New Event",
    quickActions: ["New Event", "Log Outcome", "Add Contact"],
    summary: [["12", "Annual events"], ["418", "Families reached"], ["96", "New contacts"], ["$1.8k", "Event costs"]],
    listTitle: "Events",
    footerActions: ["Log Outcome", "Add Contact", "Create Task"],
    detailTabs: ["Logistics", "Outcomes", "Contacts"],
    sideTitle: "Event Lead",
    sideLink: "Open Event Plan",
    sideFields: [["Date", "date"], ["Location", "place"], ["Cost", "cost"], ["Contact", "contact"], ["Deadline", "deadline"]],
    cards: [
      { title: "Logistics", fields: [["Registration", "registration"], ["Setup", "setup"], ["Contact", "contact"], ["Deadline", "deadline"]] },
      { title: "Event Outcomes", fields: [["Main activity", "activity"], ["Giveaways", "giveaways"], ["Families interacted with", "families"], ["Leads and signups", "leads"]] },
      { title: "Contacts Generated", fields: [["Maria Lopez", "contact1"], ["Jordan Kim", "contact2"], ["Ana Rivera", "contact3"]] }
    ],
    items: [
      {
        id: "fair",
        title: "Yamhill County Fair",
        subtitle: "August 1-3, 2026 | Vendor portal and booth supplies",
        status: "Planning",
        date: "August 1-3, 2026",
        place: "Yamhill County Fairgrounds",
        cost: "$250 booth fee + prize supplies",
        contact: "Fair office",
        deadline: "Confirm by July 15",
        registration: "Vendor portal; insurance certificate required",
        setup: "10x10 booth, tablecloth, prize wheel, newsletter QR code",
        activity: "Prize wheel",
        giveaways: "SNACK stickers, pencils, recipe cards",
        families: "Goal: 180 families",
        leads: "Newsletter signups and appointment interest",
        contact1: "Newsletter signup | prefers text",
        contact2: "Family nutrition appointment interest",
        contact3: "School resource table partner"
      },
      {
        id: "resource-night",
        title: "Family Resource Night",
        subtitle: "May 20, 2026 | Prize wheel and bilingual interest forms",
        status: "Ready",
        date: "May 20, 2026",
        place: "Newberg Family Resource Center",
        cost: "$45 printing and prizes",
        contact: "Resource center coordinator",
        deadline: "Register by May 12",
        registration: "Email coordinator by May 12",
        setup: "Prize wheel, sticker basket, bilingual interest forms",
        activity: "Prize wheel",
        giveaways: "SNACK stickers, pencils, recipe cards",
        families: "Goal: 75 families",
        leads: "Family appointment interest list",
        contact1: "Spanish appointment interest",
        contact2: "Newsletter signup",
        contact3: "School partner follow-up"
      },
      {
        id: "back-school",
        title: "Back to School Bash",
        subtitle: "August 28, 2026 | Lead capture and giveaway checklist",
        status: "Tasks",
        date: "August 28, 2026",
        place: "McMinnville Community Center",
        cost: "$120 giveaway supplies",
        contact: "School outreach lead",
        deadline: "Confirm table by August 10",
        registration: "School partner form pending",
        setup: "Bingo cards, newsletter QR, flyer packets",
        activity: "Bingo card",
        giveaways: "Pencils, stickers, workbook preview",
        families: "Goal: 110 families",
        leads: "Newsletter signups and partner referrals",
        contact1: "Interested in cooking class",
        contact2: "Wants program flyer by text",
        contact3: "Business sponsor lead"
      }
    ]
  },
  fundraising: {
    label: "Fundraising",
    title: "Fundraising",
    icon: "fundraising",
    tone: "green",
    theme: ["var(--success)", "var(--success-soft)", "#a8d8b8"],
    subpages: ["Grants", "Donors", "Campaigns", "Sponsors", "Earned Income"],
    views: ["Overview", "Tasks", "Reports"],
    primaryAction: "New Record",
    quickActions: ["New Grant", "New Donor", "New Campaign"],
    summary: [["7", "Active grants"], ["$84k", "Pending"], ["42", "Donors"], ["$3.2k", "Earned income"]],
    listTitle: "Funding Pipeline",
    footerActions: ["Log Update", "Add Contact", "Create Task"],
    detailTabs: ["Funding", "Reporting", "Contacts"],
    sideTitle: "Owner",
    sideLink: "View Funding File",
    sideFields: [["Type", "type"], ["Stage", "stage"], ["Deadline", "deadline"], ["Owner", "owner"]],
    cards: [
      { title: "Funding Details", fields: [["Amount", "amount"], ["Source", "source"], ["Use", "use"], ["Status", "statusDetail"]] },
      { title: "Reporting", fields: [["Next report", "nextReport"], ["Required metrics", "metrics"], ["Notes", "notes"], ["Risk", "risk"]] },
      { title: "Contacts", fields: [["Primary contact", "primaryContact"], ["Relationship", "relationship"]] }
    ],
    items: [
      {
        id: "hrsns",
        title: "HRSN Reimbursement",
        subtitle: "Earned income | monthly reconciliation",
        status: "Active",
        type: "Earned income",
        stage: "Tracking",
        deadline: "Monthly",
        owner: "Shannon",
        amount: "$3.2k YTD",
        source: "HRSN services",
        use: "Nutrition education reimbursement",
        statusDetail: "Claims and payments tracked monthly",
        nextReport: "End of month",
        metrics: "Appointments, eligible services, payment status",
        notes: "Compare against scheduling records.",
        risk: "Missing appointment documentation",
        primaryContact: "Billing contact",
        relationship: "Payment partner"
      },
      {
        id: "community-benefit",
        title: "Community Benefit Grant",
        subtitle: "$25k request | draft narrative",
        status: "Draft",
        type: "Grant",
        stage: "Application",
        deadline: "August 15",
        owner: "Shannon",
        amount: "$25,000",
        source: "Community benefit fund",
        use: "Family nutrition appointments",
        statusDetail: "Narrative in progress",
        nextReport: "If awarded",
        metrics: "Families served, lesson completion, outcomes",
        notes: "Needs updated KPI language.",
        risk: "KPI refresh not finalized",
        primaryContact: "Grant officer",
        relationship: "Funder"
      },
      {
        id: "sponsors",
        title: "Business Sponsors",
        subtitle: "Local sponsor list | outreach queue",
        status: "Prospects",
        type: "Sponsorship",
        stage: "Cultivation",
        deadline: "Rolling",
        owner: "Shannon",
        amount: "$10k goal",
        source: "Local businesses",
        use: "Program supplies and classes",
        statusDetail: "Prospect list started",
        nextReport: "Quarterly",
        metrics: "Asks, commitments, renewals",
        notes: "Create sponsorship levels.",
        risk: "Needs outreach materials",
        primaryContact: "Sponsor prospects",
        relationship: "Community partners"
      }
    ]
  },
  marketing: {
    label: "Marketing",
    title: "Marketing",
    icon: "marketing",
    tone: "blue",
    theme: ["var(--blue)", "var(--blue-soft)", "#aecbfa"],
    subpages: ["Campaigns", "Email", "Newsletter", "Ad Grants", "Analytics"],
    views: ["Campaigns", "Tasks", "Reports"],
    primaryAction: "New Campaign",
    quickActions: ["New Email", "New Campaign", "Import Contacts"],
    summary: [["4", "Campaigns"], ["1.2k", "Subscribers"], ["42%", "Open rate"], ["$9.8k", "Ad grant"]],
    listTitle: "Campaigns",
    footerActions: ["Schedule Send", "Sync Contacts", "Create Task"],
    detailTabs: ["Message", "Audience", "Delivery"],
    sideTitle: "Delivery",
    sideLink: "View Campaign File",
    sideFields: [["Channel", "channel"], ["Audience", "audience"], ["Status", "statusDetail"], ["Owner", "owner"]],
    cards: [
      { title: "Message", fields: [["Subject", "subject"], ["Goal", "goal"], ["Call to action", "cta"], ["Language", "language"]] },
      { title: "Audience", fields: [["Segment", "segment"], ["Count", "count"], ["Source", "source"], ["Consent", "consent"]] },
      { title: "Delivery", fields: [["Tool", "tool"], ["Send window", "sendWindow"], ["Metric", "metric"], ["Next step", "nextStep"]] }
    ],
    items: [
      {
        id: "july-newsletter",
        title: "July Newsletter",
        subtitle: "Draft email | family updates",
        status: "Draft",
        channel: "Email",
        audience: "Newsletter subscribers",
        statusDetail: "Draft",
        owner: "Shannon",
        subject: "Summer nutrition and cooking updates",
        goal: "Keep families connected",
        cta: "Book appointments and classes",
        language: "English and Spanish",
        segment: "Newsletter",
        count: "1,248 contacts",
        source: "Newsletter signups",
        consent: "Email consent required",
        tool: "MailerLite-ready",
        sendWindow: "Mid July",
        metric: "Open and click rate",
        nextStep: "Finalize copy"
      },
      {
        id: "back-school-campaign",
        title: "Back to School Campaign",
        subtitle: "Appointment push | bilingual",
        status: "Planned",
        channel: "Email and social",
        audience: "Families and partners",
        statusDetail: "Planned",
        owner: "Shannon",
        subject: "Start the school year with SNACK",
        goal: "Increase enrollment bookings",
        cta: "Book an enrollment appointment",
        language: "English and Spanish",
        segment: "Family contacts",
        count: "800 contacts",
        source: "CRM and newsletter",
        consent: "Email/text consent required",
        tool: "MailerLite plus social",
        sendWindow: "Late August",
        metric: "Bookings and clicks",
        nextStep: "Build email draft"
      },
      {
        id: "ad-grants",
        title: "Google Ad Grants",
        subtitle: "Dashboard connection | search visibility",
        status: "Setup",
        channel: "Google Ads",
        audience: "Search visitors",
        statusDetail: "Connection planned",
        owner: "Shannon",
        subject: "Search campaigns",
        goal: "Increase local discovery",
        cta: "Visit booking page",
        language: "English and Spanish",
        segment: "Search traffic",
        count: "Dashboard import",
        source: "Google Ads",
        consent: "Not applicable",
        tool: "Google Ad Grants",
        sendWindow: "Always on",
        metric: "Clicks, CTR, conversions",
        nextStep: "Connect dashboard"
      }
    ]
  },
  operations: {
    label: "Operations",
    title: "Operations",
    icon: "operations",
    tone: "navy",
    theme: ["var(--navy)", "var(--navy-soft)", "#cfd5df"],
    subpages: ["Dashboard", "KPI", "Connectors", "Data Quality", "Tasks"],
    views: ["Overview", "Tasks", "Reports"],
    primaryAction: "New Task",
    quickActions: ["New Task", "Run Check", "Add KPI"],
    summary: [["3", "Launch blockers"], ["18", "KPIs"], ["6", "Connectors"], ["12", "Checks"]],
    listTitle: "Operations Queue",
    footerActions: ["Mark Reviewed", "Assign Task", "Create Check"],
    detailTabs: ["Overview", "Tasks", "Reports"],
    sideTitle: "Owner",
    sideLink: "View Operations File",
    sideFields: [["Area", "area"], ["Status", "statusDetail"], ["Owner", "owner"], ["Due", "due"]],
    cards: [
      { title: "Overview", fields: [["Purpose", "purpose"], ["Data source", "source"], ["Cadence", "cadence"], ["Risk", "risk"]] },
      { title: "Next Steps", fields: [["Step one", "step1"], ["Step two", "step2"], ["Step three", "step3"], ["Notes", "notes"]] },
      { title: "Reporting", fields: [["Primary metric", "metric"], ["Audience", "audience"]] }
    ],
    items: [
      {
        id: "launch-readiness",
        title: "Launch Readiness",
        subtitle: "Scheduling + CRM + public booking",
        status: "Blockers",
        area: "Launch",
        statusDetail: "Needs review",
        owner: "Shannon",
        due: "Before production",
        purpose: "Track final launch blockers",
        source: "Manual review and app checks",
        cadence: "Daily during launch week",
        risk: "Missed workflow break",
        step1: "Finish visual passes",
        step2: "Confirm public booking flow",
        step3: "Test CRM workflows",
        notes: "Keep this as the top launch surface.",
        metric: "Open blockers",
        audience: "Internal team"
      },
      {
        id: "kpi-command",
        title: "KPI Command Center",
        subtitle: "Program, marketing, earned income",
        status: "Build",
        area: "KPI",
        statusDetail: "Designing",
        owner: "Shannon",
        due: "After KPI refresh",
        purpose: "Bring program data into one place",
        source: "CRM, Analytics, Search Console, Ads",
        cadence: "Monthly",
        risk: "Definitions still changing",
        step1: "Finalize KPI list",
        step2: "Map each data source",
        step3: "Build dashboard cards",
        notes: "Wait for KPI update before native forms.",
        metric: "KPI completeness",
        audience: "Program leadership"
      },
      {
        id: "connector-health",
        title: "Connector Health",
        subtitle: "External systems and imports",
        status: "Monitor",
        area: "Connectors",
        statusDetail: "Planned",
        owner: "Shannon",
        due: "Ongoing",
        purpose: "Track external data connections",
        source: "Google, MailerLite, KDP, analytics tools",
        cadence: "Weekly",
        risk: "Expired access",
        step1: "List required connections",
        step2: "Track auth status",
        step3: "Flag failed imports",
        notes: "Keep this visible after launch.",
        metric: "Healthy connectors",
        audience: "Admin users"
      }
    ]
  },
  admin: {
    label: "Admin",
    title: "Admin",
    icon: "admin",
    tone: "purple",
    theme: ["var(--purple)", "var(--purple-soft)", "#c8b7f0"],
    subpages: ["Team", "Settings", "Forms", "Integrations", "Access"],
    views: ["Settings", "Tasks", "Reports"],
    primaryAction: "New Setting",
    quickActions: ["Invite User", "Add Form", "Add Integration"],
    summary: [["2", "Team members"], ["9", "Settings"], ["5", "Print forms"], ["4", "Integrations"]],
    listTitle: "Admin Areas",
    footerActions: ["Save Changes", "Add Note", "Create Task"],
    detailTabs: ["Settings", "Access", "Files"],
    sideTitle: "Admin",
    sideLink: "View Admin File",
    sideFields: [["Area", "area"], ["Status", "statusDetail"], ["Owner", "owner"], ["Updated", "updated"]],
    cards: [
      { title: "Settings", fields: [["Purpose", "purpose"], ["Current setup", "setup"], ["Launch note", "launchNote"], ["Risk", "risk"]] },
      { title: "Access", fields: [["Users", "users"], ["Permissions", "permissions"], ["Audit", "audit"], ["Next review", "nextReview"]] },
      { title: "Files", fields: [["Forms", "forms"], ["Storage", "storage"]] }
    ],
    items: [
      {
        id: "team-settings",
        title: "Team Settings",
        subtitle: "Shannon and Cynthia | Paige removed",
        status: "Ready",
        area: "Team",
        statusDetail: "Ready",
        owner: "Shannon",
        updated: "July 2026",
        purpose: "Manage staff profiles and access",
        setup: "Shannon and Cynthia active",
        launchNote: "Paige should not appear in production.",
        risk: "Wrong staff availability",
        users: "Shannon, Cynthia",
        permissions: "Owner and admin",
        audit: "Review before launch",
        nextReview: "Monthly",
        forms: "Print forms linked separately",
        storage: "CRM App folder"
      },
      {
        id: "print-forms",
        title: "Print Forms",
        subtitle: "Enrollment and final appointment packets",
        status: "Pinned",
        area: "Forms",
        statusDetail: "Print version",
        owner: "Shannon",
        updated: "July 2026",
        purpose: "Keep print forms available until KPI update",
        setup: "Forms 1, 2, 3 for enrollment; 2, 4, 5 for last appointment",
        launchNote: "Spanish versions use SP files.",
        risk: "Native forms too early",
        users: "Clinic staff",
        permissions: "Print access",
        audit: "Confirm file names",
        nextReview: "After KPI refresh",
        forms: "Print forms folder",
        storage: "CRM App folder"
      },
      {
        id: "integrations",
        title: "Integrations",
        subtitle: "Google, MailerLite, KDP, analytics",
        status: "Planned",
        area: "Integrations",
        statusDetail: "Research complete",
        owner: "Shannon",
        updated: "July 2026",
        purpose: "Connect external systems",
        setup: "API availability varies by tool",
        launchNote: "Start with highest-value connectors.",
        risk: "Access tokens expire",
        users: "Admin users",
        permissions: "Restricted",
        audit: "Connector health check",
        nextReview: "Before integration build",
        forms: "Not applicable",
        storage: "Secure settings area"
      }
    ]
  }
};

let selectedItemId = "";
let scheduleVisibleDate = scheduleDateKey(new Date());
let scheduleDataState = "loading";
let scheduleDataMessage = "Loading appointments...";
let scheduleCurrentUser = null;

function currentModuleId() {
  const explicit = window.SNACK_MODULE_ID || document.body.dataset.module;
  if (explicit && modules[explicit]) {
    return explicit;
  }

  const page = location.pathname.split("/").pop().replace(".html", "");
  return modules[page] ? page : "outreach";
}

function icon(name) {
  return `<span class="nav-icon">${icons[name] || icons.admin}</span>`;
}

function pageUrl(id) {
  return id === "outreach" ? "./outreach.html" : `./${id}.html`;
}

function fieldValue(item, key) {
  return item[key] || "-";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderNav(activeId) {
  return moduleOrder.map((id) => {
    const module = modules[id];
    const active = id === activeId;

    return `
      <section class="module-group" data-tone="${module.tone}">
        <button class="nav-button ${active ? "is-active" : ""}" data-module-link="${id}" type="button">
          ${icon(module.icon)}
          ${module.label}
        </button>
        ${active ? `
          <div class="subnav">
            ${module.subpages.map((label, index) => `
              <button class="${index === 0 ? "is-current" : ""}" type="button">${label}</button>
            `).join("")}
          </div>
        ` : ""}
      </section>
    `;
  }).join("");
}

function renderListRows(module) {
  return module.items.map((item) => `
    <button
      class="list-row ${item.id === selectedItemId ? "is-selected" : ""}"
      data-row-id="${item.id}"
      data-tone="module"
      type="button"
    >
      <strong>${item.title}</strong>
      <span class="status-pill">${item.status}</span>
      <span>${item.subtitle}</span>
    </button>
  `).join("");
}

function renderScheduleTimeline(module, dateKey) {
  const startMinutes = 13 * 60;
  const endMinutes = 18 * 60;
  const intervalMinutes = 30;
  const totalSlots = (endMinutes - startMinutes) / intervalMinutes;
  const visibleAppointments = module.items.filter((item) => item.date === dateKey);

  return `
    <div class="schedule-day-timeline" style="--schedule-slot-count: ${totalSlots};">
      ${Array.from({ length: totalSlots + 1 }, (_, index) => `
        <div class="schedule-time-marker" style="--slot-index: ${index};">
          <time>${formatScheduleTime(startMinutes + (index * intervalMinutes))}</time>
          <span></span>
        </div>
      `).join("")}
      ${visibleAppointments.map((item) => {
        const appointmentMinutes = scheduleTimeMinutes(item.time);
        const startSlot = (appointmentMinutes - startMinutes) / intervalMinutes;
        const durationSlots = Math.max(1, item.duration / intervalMinutes);
        return `
          <button
            class="schedule-appointment ${item.id === selectedItemId ? "is-selected" : ""}"
            data-row-id="${escapeHtml(item.id)}"
            type="button"
            style="--start-slot: ${startSlot}; --duration-slots: ${durationSlots}; --row-color: ${escapeHtml(item.accent)};"
          >
            <strong>${escapeHtml(item.title)}</strong>
            <span class="status-pill">${escapeHtml(item.status)}</span>
            <span>${escapeHtml(item.subtitle)}</span>
          </button>
        `;
      }).join("")}
      ${visibleAppointments.length ? "" : `<p class="schedule-empty">${escapeHtml(scheduleDataState === "ready" ? "No appointments scheduled." : scheduleDataMessage)}</p>`}
    </div>
  `;
}

function renderScheduleDayPanel(module) {
  return `
    <div class="panel list-panel schedule-day-panel">
      <div class="schedule-date-controls">
        <button data-schedule-date-action="today" type="button">Today</button>
        <button class="schedule-date-arrow" data-schedule-date-action="previous" type="button" aria-label="Previous day">${icons.chevronLeft}</button>
        <button class="schedule-date-arrow" data-schedule-date-action="next" type="button" aria-label="Next day">${icons.chevronRight}</button>
        <label class="schedule-date-picker">
          ${icons.calendar}
          <span data-schedule-date-label>${formatScheduleDate(scheduleVisibleDate)}</span>
          <input data-schedule-date-input type="date" value="${scheduleVisibleDate}" aria-label="Choose schedule date">
        </label>
      </div>
      <div data-schedule-timeline>
        ${renderScheduleTimeline(module, scheduleVisibleDate)}
      </div>
    </div>
  `;
}

function renderFields(fields) {
  return fields.map(([label, key]) => `
    <div class="field">
      <span>${label}</span>
      <strong data-field="${key}"></strong>
    </div>
  `).join("");
}

function renderMetaRows(fields) {
  return fields.slice(0, 3).map(([label, key]) => `
    <div class="meta-row">
      <span>${label}</span>
      <strong data-field="${key}"></strong>
    </div>
  `).join("");
}

function renderSideRows(module) {
  return module.sideFields.slice(3).map(([label, key]) => `
    <div class="meta-row">
      <span>${label}</span>
      <strong data-field="${key}"></strong>
    </div>
  `).join("");
}

function renderScheduleAppointmentMeta() {
  return `
    <div class="appointment-meta-row">
      <span class="appointment-meta-icon">${icons.calendar}</span>
      <strong data-appointment-date></strong>
    </div>
    <div class="appointment-meta-row">
      <span class="appointment-meta-icon">${icons.clock}</span>
      <strong data-appointment-time></strong>
    </div>
    <div class="appointment-meta-row">
      <span class="appointment-meta-icon">${icons.file}</span>
      <strong data-field="type"></strong>
    </div>
  `;
}

function renderScheduleFamilyRows(module) {
  return module.sideFields.map(([label, key]) => `
    <div class="meta-row">
      <span>${label}</span>
      <strong class="${key === "siblings" ? "is-stacked-list" : ""}" data-field="${key}"></strong>
    </div>
  `).join("");
}

function renderPrepCard(card) {
  return `
    <section class="detail-card prep-card">
      <div class="card-heading">
        <h3>${card.title}</h3>
        <div class="prep-heading-actions">
          <span class="prep-save-status" data-prep-save-status role="status" aria-live="polite"></span>
          <button class="edit-button" type="button">Edit</button>
        </div>
      </div>
      <div class="prep-grid">
        ${card.fields.map(([label, key]) => `
          <section class="prep-column">
            <h4>${label}</h4>
            <div class="prep-list" data-prep-list="${key}"></div>
          </section>
        `).join("")}
      </div>
    </section>
  `;
}

function renderCards(module) {
  return module.cards.map((card) => `
    ${module.label === "Schedule" && card.title === "Prep" ? renderPrepCard(card) : `<section class="detail-card">
      <div class="card-heading">
        <h3>${card.title}</h3>
        <button class="edit-button" type="button">Edit</button>
      </div>
      <div class="field-grid">
        ${renderFields(card.fields)}
      </div>
    </section>`}
  `).join("");
}

function renderModulePage(moduleId) {
  const module = modules[moduleId];
  selectedItemId = module.items[0]?.id || "";
  document.title = `SNACK Program Manager ${module.label}`;

  const app = document.querySelector("#app");
  app.innerHTML = `
    <div
      class="app-shell"
      data-shell
      data-module-id="${moduleId}"
      style="--module: ${module.theme[0]}; --module-soft: ${module.theme[1]}; --module-line: ${module.theme[2]};"
    >
      <aside class="sidebar" aria-label="Main navigation">
        <div class="brand">
          <button class="brand-mark" data-toggle-sidebar type="button" aria-label="Collapse navigation">
            <img src="./favicon.png" alt="">
          </button>
          <div class="brand-copy">
            <strong>SNACK</strong>
            <span>Program Manager</span>
          </div>
        </div>

        <div class="sidebar-scroll">
          <nav class="module-nav" aria-label="${module.label} navigation">
            ${renderNav(moduleId)}
          </nav>
        </div>

        <section class="quick-actions" aria-label="Quick actions">
          <h2>Quick Actions</h2>
          ${module.quickActions.map((action) => `
            <button class="quick-button" type="button">${icon("plus")}${action}</button>
          `).join("")}
        </section>

        <div class="account">
          <span class="avatar">SO</span>
          <strong data-account-name>Shannon Oddo</strong>
        </div>
      </aside>

      <main class="main">
        <header class="page-header">
          <div class="page-title">
            <h1>${module.title}</h1>
          </div>

          <div class="header-actions">
            <div class="view-switch" role="group" aria-label="${module.label} views" style="grid-template-columns: repeat(${module.views.length}, minmax(86px, 1fr));">
              ${module.views.map((view, index) => `
                <button class="${index === 0 ? "is-active" : ""}" type="button">${view}</button>
              `).join("")}
            </div>
            <button class="primary-action" type="button">${icons.plus}${module.primaryAction}</button>
          </div>
        </header>

        <section class="summary-strip" aria-label="${module.label} summary">
          ${module.summary.map(([value, label]) => `
            <div class="summary-item" data-summary-label="${escapeHtml(label)}">
              <strong>${escapeHtml(value)}</strong>
              <span>${label}</span>
            </div>
          `).join("")}
        </section>

        <section class="workspace">
          ${moduleId === "schedule" ? renderScheduleDayPanel(module) : `<div class="panel list-panel">
            <div class="panel-header">
              <div>
                <h2>${module.listTitle}</h2>
              </div>
              <button class="list-search" type="button" aria-label="Search">${icons.search}</button>
            </div>
            <div class="list">
              ${renderListRows(module)}
            </div>
          </div>`}

          <article class="panel detail-panel">
            <aside class="detail-side">
              <div class="status-line is-module-status">
                <span class="status-dot"></span>
                <span data-detail-status></span>
              </div>
              <h2 data-detail-title></h2>
              <div class="meta-list ${moduleId === "schedule" ? "appointment-meta" : ""}">
                ${moduleId === "schedule" ? renderScheduleAppointmentMeta() : renderMetaRows(module.sideFields)}
              </div>
              <section class="side-section">
                <h3>${module.sideIcon ? `<span class="section-icon">${icons[module.sideIcon]}</span>` : ""}${module.sideTitle}</h3>
                ${moduleId === "schedule" ? renderScheduleFamilyRows(module) : renderSideRows(module)}
                <button class="text-link" type="button">${module.sideLink}</button>
              </section>
            </aside>

            <div class="detail-main">
              <div class="tabs" role="tablist" aria-label="${module.label} detail tabs">
                ${module.detailTabs.map((tab, index) => `
                  <button class="${index === 0 ? "is-active" : ""}" type="button">
                    ${module.detailTabIcons?.[index] ? `<span class="detail-tab-icon">${icons[module.detailTabIcons[index]]}</span>` : ""}
                    <span>${tab}</span>
                  </button>
                `).join("")}
              </div>

              ${renderCards(module)}

              <div class="footer-actions">
                ${module.footerActions.map((action) => `<button type="button">${action}</button>`).join("")}
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  `;

  updateDetail(module, selectedItemId);
}

function updateDetail(module, itemId) {
  selectedItemId = itemId;
  const item = itemId ? module.items.find((candidate) => candidate.id === itemId) : null;

  if (!item) {
    document.querySelectorAll(".list-row, .schedule-appointment").forEach((row) => row.classList.remove("is-selected"));
    document.querySelector("[data-detail-title]").textContent = "No appointment selected";
    document.querySelector("[data-detail-status]").textContent = "";
    document.querySelector(".status-line")?.setAttribute("hidden", "");
    document.querySelectorAll("[data-appointment-date], [data-appointment-time], [data-field]").forEach((field) => {
      field.textContent = "-";
    });
    document.querySelectorAll("[data-prep-list]").forEach((list) => list.replaceChildren());
    setPrepSaveStatus("");
    return;
  }

  document.querySelectorAll(".list-row, .schedule-appointment").forEach((row) => {
    row.classList.toggle("is-selected", row.dataset.rowId === item.id);
  });

  document.querySelector("[data-detail-title]").textContent = item.title;
  document.querySelector("[data-detail-status]").textContent = item.status;
  document.querySelector(".status-line")?.removeAttribute("hidden");

  const appointmentDate = document.querySelector("[data-appointment-date]");
  if (appointmentDate) {
    appointmentDate.textContent = formatAppointmentDate(item.date);
  }

  const appointmentTime = document.querySelector("[data-appointment-time]");
  if (appointmentTime) {
    appointmentTime.textContent = `${formatScheduleTime(scheduleTimeMinutes(item.time))} - ${item.duration} min`;
  }

  document.querySelectorAll("[data-field]").forEach((field) => {
    const value = fieldValue(item, field.dataset.field);
    if (field.classList.contains("is-stacked-list")) {
      const names = value.split(",").map((name) => name.trim()).filter(Boolean);
      field.replaceChildren(...names.map((name) => {
        const line = document.createElement("span");
        line.textContent = name;
        return line;
      }));
      return;
    }
    field.textContent = value;
  });

  document.querySelectorAll("[data-prep-list]").forEach((list) => {
    const value = item[list.dataset.prepList];
    const items = (Array.isArray(value) ? value : [value]).filter(Boolean);

    list.replaceChildren(...items.map((entry) => {
      const prepItem = typeof entry === "string" ? { key: "", text: entry } : entry;
      const label = document.createElement("label");
      label.className = "prep-check";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.prepItemKey = prepItem.key;
      checkbox.checked = Boolean(item.prepChecklist?.[prepItem.key]);

      const wording = document.createElement("span");
      wording.textContent = prepItem.text;

      label.append(checkbox, wording);
      return label;
    }));
  });

  setPrepSaveStatus("");
}

function updateScheduleDate(module, nextDateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nextDateKey)) {
    return;
  }

  scheduleVisibleDate = nextDateKey;
  const label = document.querySelector("[data-schedule-date-label]");
  const input = document.querySelector("[data-schedule-date-input]");
  const timeline = document.querySelector("[data-schedule-timeline]");

  if (label) {
    label.textContent = formatScheduleDate(scheduleVisibleDate);
  }
  if (input) {
    input.value = scheduleVisibleDate;
  }
  if (timeline) {
    timeline.innerHTML = renderScheduleTimeline(module, scheduleVisibleDate);
  }

  const visibleAppointments = module.items.filter((item) => item.date === scheduleVisibleDate);
  const selectedVisible = visibleAppointments.find((item) => item.id === selectedItemId);
  updateDetail(module, selectedVisible?.id || visibleAppointments[0]?.id || "");
  updateScheduleSummary(module);
}

function updateScheduleSummary(module) {
  const appointments = module.items.filter((item) => item.date === scheduleVisibleDate && item.status !== "Canceled");
  const counts = {
    Today: appointments.length,
    Completed: appointments.filter((item) => item.status === "Completed").length,
    "No Show": appointments.filter((item) => item.status === "No-show").length,
    Reschedule: appointments.filter((item) => item.status === "Rescheduled").length
  };

  document.querySelectorAll("[data-summary-label]").forEach((summary) => {
    const value = counts[summary.dataset.summaryLabel];
    if (value !== undefined) {
      summary.querySelector("strong").textContent = value;
    }
  });
}

function setPrepSaveStatus(message, state = "") {
  const status = document.querySelector("[data-prep-save-status]");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.dataset.state = state;
}

async function savePrepCheckbox(module, checkbox) {
  const item = module.items.find((candidate) => candidate.id === selectedItemId);
  const key = checkbox.dataset.prepItemKey;
  const previousChecked = !checkbox.checked;

  if (!item || !key || !scheduleCurrentUser) {
    checkbox.checked = previousChecked;
    setPrepSaveStatus("Could not save", "error");
    return;
  }

  checkbox.disabled = true;
  setPrepSaveStatus("");

  try {
    const token = await scheduleCurrentUser.getIdToken();
    const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
    const response = await fetch(`${apiBaseUrl}/api/appointments/${encodeURIComponent(item.id)}/prep`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ key, checked: checkbox.checked })
    });

    if (!response.ok) {
      throw new Error(`Prep checklist save returned ${response.status}`);
    }

    const result = await response.json();
    item.prepChecklist = result.prepChecklist || {
      ...item.prepChecklist,
      [key]: checkbox.checked
    };
    setPrepSaveStatus("");
  } catch (error) {
    console.error(error);
    checkbox.checked = previousChecked;
    setPrepSaveStatus("Could not save", "error");
  } finally {
    checkbox.disabled = false;
  }
}

async function loadScheduleData(user) {
  const module = modules.schedule;
  scheduleDataState = "loading";
  scheduleDataMessage = "Loading appointments...";
  updateScheduleDate(module, scheduleVisibleDate);

  try {
    const token = await user.getIdToken();
    const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
    const headers = { Authorization: `Bearer ${token}` };
    const [appointmentsResponse, clientsResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/api/appointments`, { headers }),
      fetch(`${apiBaseUrl}/api/clients`, { headers })
    ]);

    if (!appointmentsResponse.ok || !clientsResponse.ok) {
      throw new Error(`Data service returned ${appointmentsResponse.status}/${clientsResponse.status}`);
    }

    const [{ appointments = [] }, { clients = [] }] = await Promise.all([
      appointmentsResponse.json(),
      clientsResponse.json()
    ]);
    const clientsById = new Map(clients.map((client) => [client.id, client]));
    module.items = appointments
      .filter((appointment) => appointment.status !== "Canceled")
      .map((appointment) => mapAppointment(appointment, clientsById))
      .filter((appointment) => appointment.date && appointment.time)
      .sort((first, second) => first.date.localeCompare(second.date) || first.time.localeCompare(second.time));

    scheduleDataState = "ready";
    scheduleDataMessage = "";
    updateScheduleDate(module, scheduleVisibleDate);
  } catch (error) {
    console.error(error);
    scheduleDataState = "error";
    scheduleDataMessage = "Appointments could not be loaded. Check the local data service and try again.";
    module.items = [];
    updateScheduleDate(module, scheduleVisibleDate);
  }
}

async function initializeScheduleData() {
  if (currentModuleId() !== "schedule") {
    return;
  }

  try {
    const [{ initializeApp }, { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js")
    ]);
    const auth = getAuth(initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG));
    const provider = new GoogleAuthProvider();

    const account = document.querySelector(".account");
    const accountName = document.querySelector("[data-account-name]");
    const openSignIn = () => {
      if (!scheduleCurrentUser) {
        signInWithPopup(auth, provider).catch((error) => console.error(error));
      }
    };
    account?.setAttribute("role", "button");
    account?.setAttribute("tabindex", "0");
    account?.setAttribute("title", "Sign in to load appointments");
    account?.addEventListener("click", openSignIn);
    account?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSignIn();
      }
    });

    onAuthStateChanged(auth, (user) => {
      scheduleCurrentUser = user;
      if (user) {
        if (accountName) accountName.textContent = "Shannon Oddo";
        account?.removeAttribute("title");
        loadScheduleData(user);
        return;
      }
      if (accountName) accountName.textContent = "Sign in";
      account?.setAttribute("title", "Sign in to load appointments");
      scheduleDataState = "signed-out";
      scheduleDataMessage = "Sign in with your SNACK Google account to load appointments.";
      modules.schedule.items = [];
      updateScheduleDate(modules.schedule, scheduleVisibleDate);
    });
  } catch (error) {
    console.error(error);
    scheduleDataState = "error";
    scheduleDataMessage = "The secure sign-in connection could not be started.";
    updateScheduleDate(modules.schedule, scheduleVisibleDate);
  }
}

function bindModulePage(moduleId) {
  const module = modules[moduleId];

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-toggle-sidebar]");
    if (toggle) {
      const shell = document.querySelector("[data-shell]");
      const collapsed = shell.classList.toggle("is-collapsed");
      toggle.setAttribute("aria-label", collapsed ? "Expand navigation" : "Collapse navigation");
      return;
    }

    const moduleLink = event.target.closest("[data-module-link]");
    if (moduleLink) {
      const nextId = moduleLink.dataset.moduleLink;
      if (nextId !== moduleId) {
        location.href = pageUrl(nextId);
      }
      return;
    }

    const row = event.target.closest("[data-row-id]");
    if (row) {
      updateDetail(module, row.dataset.rowId);
      return;
    }

    const scheduleDateAction = event.target.closest("[data-schedule-date-action]");
    if (moduleId === "schedule" && scheduleDateAction) {
      const action = scheduleDateAction.dataset.scheduleDateAction;
      const nextDate = action === "today"
        ? scheduleDateKey(new Date())
        : offsetScheduleDate(scheduleVisibleDate, action === "previous" ? -1 : 1);
      updateScheduleDate(module, nextDate);
      return;
    }

    const viewTab = event.target.closest(".view-switch button");
    if (viewTab) {
      document.querySelectorAll(".view-switch button").forEach((item) => item.classList.remove("is-active"));
      viewTab.classList.add("is-active");
      return;
    }

    const detailTab = event.target.closest(".tabs button");
    if (detailTab) {
      document.querySelectorAll(".tabs button").forEach((item) => item.classList.remove("is-active"));
      detailTab.classList.add("is-active");
    }
  });

  document.addEventListener("change", (event) => {
    if (moduleId === "schedule" && event.target.matches("[data-schedule-date-input]")) {
      updateScheduleDate(module, event.target.value);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-prep-item-key]")) {
      savePrepCheckbox(module, event.target);
    }
  });
}

const moduleId = currentModuleId();
renderModulePage(moduleId);
bindModulePage(moduleId);
initializeScheduleData();
