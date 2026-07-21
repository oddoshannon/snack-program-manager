import {
  appointmentActivityItems,
  appointmentEditPayload,
  appointmentLessonTitles,
  appointmentNotePayload,
  appointmentStatusPayload,
  appointmentWrapUpDefaults,
  appointmentWrapUpOptions,
  blockTimeEndOptions,
  blockTimePayload,
  clientFullName,
  completedAppointmentPayload,
  defaultNextAppointmentDate,
  formatAppointmentDate,
  formatScheduleDate,
  formatScheduleWeekRange,
  formatScheduleTime,
  mapAppointment,
  newAppointmentPayload,
  newAppointmentService,
  newAppointmentServices,
  nextAppointmentLessonNumber,
  nextAppointmentPayload,
  offsetScheduleDate,
  rescheduleAppointmentPayloads,
  scheduleDateKey,
  scheduleTimeMinutes,
  scheduleTimeOptions,
  scheduleWeekDates
} from "./modules/schedule.js?v=20260715-note-tabs2";
import {
  appointmentNotePage,
  appointmentPrepPage,
  dailyAppointmentNotePages,
  dailyPrepPages,
  dailyPrintPacketPages,
  dailySchedulePages,
  printDocumentHtml,
  printableScheduleItems
} from "./modules/schedule-print.js?v=20260715-print-workflow1";
import {
  clientLessonValue,
  clientLessonIndex,
  crmActivityPayload,
  crmAppointmentDescription,
  crmAppointmentUrl,
  crmClientMatches,
  crmClientPayload,
  crmCloseDecision,
  crmLessonIsCurrent,
  crmNewAppointmentUrl,
  crmPreferredItemId,
  crmSiblingChanges,
  crmStatusOptions,
  crmSummary,
  formatClientDate,
  languageOptions,
  lessonProgression,
  mapCrmClients,
  preferredContactOptions,
  referralTypeOptions
} from "./modules/crm.js?v=20260718-crm-links1";
import {
  crmConfirmDecision,
  crmNetworkMatches,
  crmNetworkPayload,
  crmNetworkSummary,
  crmReferralActivityPayload,
  crmReferralMatches,
  crmReferralPayload,
  crmReferralProviderLinks,
  crmReferralSummary,
  mapCrmNetworkEntries,
  mapCrmReferrals,
  referralNetworkTypeOptions,
  referralStatusOptions
} from "./modules/referrals.js?v=20260718-crm-links1";
import {
  formatOutreachMoney,
  mapOutreachContacts,
  mapOutreachEvents,
  mapOutreachTasks,
  outreachContactMatches,
  outreachContactPayload,
  outreachContactStatusOptions,
  outreachEventMatches,
  outreachEventPayload,
  outreachEventStatusOptions,
  outreachEventTypeOptions,
  outreachInterestTypeOptions,
  outreachReport,
  outreachSummary,
  outreachTaskMatches,
  outreachTaskPayload,
  outreachTaskPriorityOptions,
  outreachTaskStatusOptions
} from "./modules/outreach.js?v=20260721-outreach1";

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
  note: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`
};

const moduleOrder = ["schedule", "crm", "outreach", "fundraising", "marketing", "operations", "admin"];

const crmFamilyFields = [
  ["Caregiver", "caregiver"],
  ["Siblings", "siblings"],
  ["Phone", "phone"],
  ["Email", "email"],
  ["Address", "address"]
];

const crmClientDetailFields = [
  ["Language", "language"],
  ["Referral Date", "referralDate"],
  ["Referral Type", "referralType"],
  ["Birthdate", "dob"],
  ["First Contact", "firstContact"],
  ["Referring Provider", "providerProfiles"],
  ["Gender", "gender"],
  ["Converted Date", "convertedDate"],
  ["Preferred Contact", "preferredContact"],
  ["Insurance", "insurance"],
  ["First Appointment", "firstAppt"],
  ["Email Opt Out", "emailOptOut"],
  ["HRSN", "hrsn"],
  ["Graduation Date", "graduationDate"],
  ["Text Opt Out", "textOptOut"]
];

const crmReferralDetailFields = [
  ["Language", "language"],
  ["Referral Date", "referralDate"],
  ["Referral Type", "referralType"],
  ["Birthdate", "dob"],
  ["First Contact", "firstContact"],
  ["Referral Source", "referralSource"],
  ["Gender", "gender"],
  ["Recent Contact", "recentContact"],
  ["Referring Provider", "providerProfiles"],
  ["Insurance", "insurance"],
  ["First Appointment", "firstAppt"],
  ["Email Opt Out", "emailOptOut"],
  ["HRSN", "hrsn"],
  ["Converted Date", "convertedDate"],
  ["Text Opt Out", "textOptOut"]
];

const crmNetworkSideFields = [
  ["Contact", "contactName"],
  ["Phone", "phone"],
  ["Email", "email"],
  ["Website", "website"]
];

const crmNetworkDetailFields = [
  ["Organization Type", "type"],
  ["Primary Contact", "contactName"],
  ["Phone", "phone"],
  ["Email", "email"],
  ["Website", "website"],
  ["Providers", "providerCount"]
];

const modules = {
  schedule: {
    label: "Schedule",
    title: "Clinic Schedule",
    icon: "schedule",
    tone: "red",
    theme: ["var(--red)", "var(--red-soft)", "#f4b4b6"],
    subpages: ["Clinic", "Public Booking"],
    views: ["Day", "Week"],
    primaryAction: "New Appointment",
    quickActions: ["New Appointment", "Block Time", "Print Forms"],
    summary: [["0", "Today"], ["0", "Completed"], ["0", "No Show"], ["0", "Reschedule"]],
    listTitle: "Clinic",
    footerActions: ["Mark Complete", "Reschedule", "No Show"],
    detailTabs: ["Details", "Wrap Up", "Appt Note", "Activity", "Forms"],
    detailTabIcons: ["calendar", "check", "file", "history", "file"],
    sideTitle: "Family",
    sideIcon: "crm",
    sideLink: "Open Client Profile",
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
    subpages: ["Clients", "Referrals", "Referral Network"],
    views: [],
    primaryAction: "New Client",
    quickActions: ["New Client", "New Referral"],
    summary: [["0", "Needs Reschedule"], ["0", "Scheduled"], ["0", "Active"], ["0", "Waiting on Family"]],
    listTitle: "Clients",
    footerActions: ["Log Call", "Log Text", "New Appt", "Close Client"],
    detailTabs: ["Overview", "Notes", "Appointments", "Forms"],
    detailTabIcons: ["crm", "note", "calendar", "file"],
    sideTitle: "Family",
    sideIcon: "crm",
    sideLink: "",
    sideFields: crmFamilyFields,
    cards: [
      {
        title: "Client Details",
        fields: crmClientDetailFields
      },
      { title: "Lesson Progression", fields: [] }
    ],
    items: []
  },
  outreach: {
    label: "Outreach",
    title: "Outreach",
    icon: "outreach",
    tone: "yellow",
    theme: ["var(--yellow)", "var(--yellow-soft)", "#ead18a"],
    subpages: ["Events", "Contacts"],
    views: ["Events", "Contacts"],
    primaryAction: "New Event",
    quickActions: ["New Event", "Log Outcome", "Add Contact"],
    summary: [["0", "Annual events"], ["0", "Families reached"], ["0", "New contacts"], ["$0", "Event costs"]],
    listTitle: "Events",
    footerActions: ["Log Outcome", "Add Contact", "Create Task"],
    detailTabs: ["Logistics", "Outcomes", "Contacts"],
    detailTabIcons: ["calendar", "check", "crm"],
    sideTitle: "Event Lead",
    sideLink: "Open Event Plan",
    sideFields: [["Date", "date"], ["Location", "place"], ["Cost", "cost"], ["Contact", "contact"], ["Deadline", "deadline"]],
    cards: [
      { title: "Logistics", fields: [["Registration", "registration"], ["Setup", "setup"], ["Contact", "contact"], ["Deadline", "deadline"]] },
      { title: "Event Outcomes", fields: [["Main activity", "activity"], ["Giveaways", "giveaways"], ["Families interacted with", "families"], ["Leads and signups", "leads"]] },
      { title: "Contacts Generated", fields: [] }
    ],
    items: []
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
    subpages: ["Dashboard", "KPI", "Connectors", "Data Quality", "Tasks", "Reports"],
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
let scheduleActionBusy = false;
let schedulePanelMode = "detail";
let scheduleViewMode = "day";
let scheduleDetailTab = "details";
let scheduleSubpage = "Clinic";
let blockTimeEditingId = "";
let blockTimeDeletePendingId = "";
let appointmentEditingId = "";
let appointmentCancelPendingId = "";
let scheduleClients = [];
let scheduleClientsById = new Map();
let scheduleActivityLogs = [];
let scheduleSettings = {
  bookableStartTime: "13:30",
  bookableEndTime: "18:00",
  weekdays: [2, 3, 4],
  slotIntervalMinutes: 15
};
let crmCurrentUser = null;
let crmDataMessage = "Loading clients...";
let crmAllItems = [];
let crmClientItems = [];
let crmReferralItems = [];
let crmNetworkItems = [];
let crmRawClients = [];
let crmRawReferrals = [];
let crmRawNetworkEntries = [];
let crmAppointments = [];
let crmActivityLogs = [];
let crmDetailTab = "overview";
let crmPanelMode = "detail";
let crmEditorKind = "";
let crmEditingClientId = "";
let crmEditingReferralId = "";
let crmEditingNetworkId = "";
let crmSearchQuery = "";
let crmClosePendingId = "";
let crmDeletePendingId = "";
let crmConvertPendingId = "";
let crmActionBusy = false;
let crmOpenSignIn = null;
let crmOutreachHandoffHandled = false;
let crmOutreachContactId = "";
let crmSubpage = ["Clients", "Referrals", "Referral Network"].includes(new URLSearchParams(window.location.search).get("section"))
  ? new URLSearchParams(window.location.search).get("section")
  : "Clients";
let outreachCurrentUser = null;
let outreachDataMessage = "Loading outreach events...";
let outreachRawEvents = [];
let outreachRawContacts = [];
let outreachRawTasks = [];
let outreachEventItems = [];
let outreachContactItems = [];
let outreachTaskItems = [];
let outreachAllItems = [];
let outreachDetailTab = "logistics";
let outreachPanelMode = "detail";
let outreachEditorKind = "";
let outreachEditingEventId = "";
let outreachEditingContactId = "";
let outreachEditingTaskId = "";
let outreachSearchQuery = "";
let outreachDeletePendingId = "";
let outreachActionBusy = false;
let outreachOpenSignIn = null;
let outreachSubpage = ["Events", "Contacts", "Tasks", "Reports"].includes(new URLSearchParams(window.location.search).get("section"))
  ? new URLSearchParams(window.location.search).get("section")
  : "Events";
let scheduleHandoffHandled = false;
const newAppointmentClientIds = new Set();

function currentModuleId() {
  if (isOperationsOutreachReport()) {
    return "outreach";
  }

  const explicit = window.SNACK_MODULE_ID || document.body.dataset.module;
  if (explicit && modules[explicit]) {
    return explicit;
  }

  const page = location.pathname.split("/").pop().replace(".html", "");
  return modules[page] ? page : "outreach";
}

function isOperationsOutreachReport() {
  const page = location.pathname.split("/").pop();
  return page === "operations.html" && new URLSearchParams(location.search).get("section") === "Reports";
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

function crmSubpageDefinition(label = crmSubpage) {
  if (label === "Referrals") {
    return {
      primaryAction: "New Referral",
      quickActions: ["New Referral"],
      summary: crmReferralSummary(crmReferralItems),
      listTitle: "Referrals",
      searchLabel: "Search referrals",
      footerActions: ["Log Call", "Log Text", "Convert", "Delete"],
      detailTabs: ["Overview", "Notes", "Activity", "Conversion"],
      detailTabIcons: ["crm", "note", "history", "check"],
      sideTitle: "Family",
      sideIcon: "crm",
      sideFields: crmFamilyFields,
      cards: [{ title: "Referral Details", fields: crmReferralDetailFields }],
      items: crmReferralItems
    };
  }

  if (label === "Referral Network") {
    return {
      primaryAction: "New Organization",
      quickActions: ["New Organization", "New Referral"],
      summary: crmNetworkSummary(crmNetworkItems),
      listTitle: "Referral Network",
      searchLabel: "Search organizations",
      footerActions: ["Edit", "New Referral", "Delete"],
      detailTabs: ["Overview", "Providers", "Notes"],
      detailTabIcons: ["file", "crm", "note"],
      sideTitle: "Contact",
      sideIcon: "crm",
      sideFields: crmNetworkSideFields,
      cards: [{ title: "Organization Details", fields: crmNetworkDetailFields }],
      items: crmNetworkItems
    };
  }

  return {
    primaryAction: "New Client",
    quickActions: ["New Client", "New Referral"],
    summary: crmSummary(crmClientItems),
    listTitle: "Clients",
    searchLabel: "Search clients",
    footerActions: ["Log Call", "Log Text", "New Appt", "Close Client"],
    detailTabs: ["Overview", "Notes", "Appointments", "Forms"],
    detailTabIcons: ["crm", "note", "calendar", "file"],
    sideTitle: "Family",
    sideIcon: "crm",
    sideFields: crmFamilyFields,
    cards: [
      { title: "Client Details", fields: crmClientDetailFields },
      { title: "Lesson Progression", fields: [] }
    ],
    items: crmClientItems
  };
}

function configureCrmModule(label = crmSubpage) {
  const definition = crmSubpageDefinition(label);
  Object.assign(modules.crm, definition);
  crmSubpage = label;
  crmAllItems = [...definition.items];
}

function crmCurrentMatcher(item, query) {
  if (crmSubpage === "Referrals") return crmReferralMatches(item, query);
  if (crmSubpage === "Referral Network") return crmNetworkMatches(item, query);
  return crmClientMatches(item, query);
}

function crmCurrentSummary(items) {
  if (crmSubpage === "Referrals") return crmReferralSummary(items);
  if (crmSubpage === "Referral Network") return crmNetworkSummary(items);
  return crmSummary(items);
}

function crmEmptyMessage() {
  if (crmSubpage === "Referrals") return "No referrals found.";
  if (crmSubpage === "Referral Network") return "No referral organizations found.";
  return "No clients found.";
}

function outreachReportItem() {
  const report = outreachReport(outreachRawEvents, outreachRawContacts, outreachRawTasks);
  return {
    id: `report-${report.year}`,
    kind: "report",
    title: `${report.year} Outreach Report`,
    subtitle: `${report.events} events | ${report.interactions} families reached`,
    status: "Current",
    year: String(report.year),
    events: String(report.events),
    completedEvents: String(report.completedEvents),
    interactions: String(report.interactions),
    participants: String(report.participants),
    referrals: String(report.referrals),
    interestList: String(report.interestList),
    contacts: String(report.contacts),
    openTasks: String(report.openTasks),
    cost: formatOutreachMoney(report.cost),
    source: report
  };
}

function outreachSubpageDefinition(label = outreachSubpage) {
  if (label === "Contacts") {
    return {
      title: "Outreach",
      views: ["Events", "Contacts"],
      primaryAction: "Add Contact",
      quickActions: ["Add Contact", "New Event"],
      summary: outreachSummary(outreachRawEvents, outreachRawContacts),
      listTitle: "Contacts",
      searchLabel: "Search outreach contacts",
      footerActions: ["Edit", "New Referral", "Delete"],
      detailTabs: ["Overview", "Notes"],
      detailTabIcons: ["crm", "note"],
      sideTitle: "Contact",
      sideIcon: "crm",
      sideLink: "",
      sideFields: [["Event", "event"], ["Interest", "interestType"], ["Status", "status"], ["Phone", "phone"], ["Email", "email"]],
      cards: [{ title: "Contact Details", fields: [] }],
      items: outreachContactItems
    };
  }

  if (label === "Tasks") {
    return {
      title: "Outreach",
      views: ["Events", "Contacts"],
      primaryAction: "New Task",
      quickActions: ["New Task", "New Event", "Add Contact"],
      summary: outreachSummary(outreachRawEvents, outreachRawContacts),
      listTitle: "Tasks",
      searchLabel: "Search outreach tasks",
      footerActions: ["Edit", "Mark Done", "Delete"],
      detailTabs: ["Overview", "Notes"],
      detailTabIcons: ["check", "note"],
      sideTitle: "Task",
      sideIcon: "check",
      sideLink: "",
      sideFields: [["Due Date", "dueDate"], ["Priority", "priority"], ["Assigned To", "assignedTo"], ["Event", "event"], ["Status", "status"]],
      cards: [{ title: "Task Details", fields: [] }],
      items: outreachTaskItems
    };
  }

  if (label === "Reports") {
    return {
      title: "Outreach Reports",
      views: [],
      primaryAction: "",
      quickActions: [],
      summary: outreachSummary(outreachRawEvents, outreachRawContacts),
      listTitle: "Annual Reports",
      searchLabel: "Search outreach reports",
      footerActions: [],
      detailTabs: ["Annual Report"],
      detailTabIcons: ["file"],
      sideTitle: "Report",
      sideIcon: "file",
      sideLink: "",
      sideFields: [["Year", "year"], ["Events", "events"], ["Contacts", "contacts"], ["Event Costs", "cost"], ["Open Tasks", "openTasks"]],
      cards: [{ title: "Annual Report", fields: [] }],
      items: [outreachReportItem()]
    };
  }

  return {
    title: "Outreach",
    views: ["Events", "Contacts"],
    primaryAction: "New Event",
    quickActions: ["New Event", "Log Outcome", "Add Contact"],
    summary: outreachSummary(outreachRawEvents, outreachRawContacts),
    listTitle: "Events",
    searchLabel: "Search outreach events",
    footerActions: ["Log Outcome", "Add Contact", "Create Task"],
    detailTabs: ["Logistics", "Outcomes", "Contacts"],
    detailTabIcons: ["calendar", "check", "crm"],
    sideTitle: "Event Lead",
    sideIcon: "outreach",
    sideLink: "",
    sideFields: [["Date", "date"], ["Location", "place"], ["Cost", "cost"], ["Contact", "contact"], ["Deadline", "deadline"]],
    cards: [
      { title: "Logistics", fields: [] },
      { title: "Event Outcomes", fields: [] },
      { title: "Contacts Generated", fields: [] }
    ],
    items: outreachEventItems
  };
}

function configureOutreachModule(label = outreachSubpage) {
  const definition = outreachSubpageDefinition(label);
  Object.assign(modules.outreach, definition);
  outreachSubpage = label;
  outreachAllItems = [...definition.items];
}

function outreachCurrentMatcher(item, query) {
  if (outreachSubpage === "Contacts") return outreachContactMatches(item, query);
  if (outreachSubpage === "Tasks") return outreachTaskMatches(item, query);
  return outreachEventMatches(item, query);
}

function outreachEmptyMessage() {
  if (outreachSubpage === "Contacts") return "No outreach contacts found.";
  if (outreachSubpage === "Tasks") return "No outreach tasks found.";
  if (outreachSubpage === "Reports") return "No outreach report is available.";
  return "No outreach events found.";
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
              <button
                class="${activeId === "schedule" ? (label === scheduleSubpage ? "is-current" : "") : activeId === "crm" ? (label === crmSubpage ? "is-current" : "") : activeId === "outreach" ? (label === outreachSubpage ? "is-current" : "") : activeId === "operations" ? (label === (isOperationsOutreachReport() ? "Reports" : "Dashboard") ? "is-current" : "") : (index === 0 ? "is-current" : "")}"
                ${activeId === "schedule" && ["Clinic", "Print Forms"].includes(label) ? `data-schedule-subpage="${escapeHtml(label)}"` : ""}
                ${activeId === "crm" ? `data-crm-subpage="${escapeHtml(label)}"` : ""}
                ${activeId === "outreach" ? `data-outreach-subpage="${escapeHtml(label)}"` : ""}
                ${activeId === "operations" ? `data-operations-subpage="${escapeHtml(label)}"` : ""}
                type="button"
              >${label}</button>
            `).join("")}
          </div>
        ` : ""}
      </section>
    `;
  }).join("");
}

function renderListRows(module) {
  if (!module.items.length) {
    const message = module === modules.crm
      ? crmDataMessage
      : module === modules.outreach
        ? outreachDataMessage
        : "No records to show.";
    return `<p class="list-empty" role="status">${escapeHtml(message)}</p>`;
  }

  return module.items.map((item) => `
    <button
      class="list-row ${item.id === selectedItemId ? "is-selected" : ""}"
      data-row-id="${escapeHtml(item.id)}"
      data-tone="module"
      type="button"
    >
      <strong>${escapeHtml(item.title)}</strong>
      <span class="status-pill">${escapeHtml(item.status)}</span>
      <span>${escapeHtml(item.subtitle)}</span>
    </button>
  `).join("");
}

function renderSummaryItems(module) {
  return module.summary.map(([value, label]) => `
    <div class="summary-item" data-summary-label="${escapeHtml(label)}">
      <strong>${escapeHtml(value)}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join("");
}

function refreshStandardModuleData(module) {
  const summary = document.querySelector(".summary-strip");
  const list = document.querySelector(".list");
  if (summary) summary.innerHTML = renderSummaryItems(module);
  if (list) list.innerHTML = renderListRows(module);
  const requestedClientId = module === modules.crm && crmSubpage === "Clients"
    ? new URLSearchParams(window.location.search).get("client")
    : "";
  selectedItemId = crmPreferredItemId(module.items, selectedItemId, requestedClientId);
  updateDetail(module, selectedItemId);
}

function refreshOutreachData(module, preferredItemId = selectedItemId) {
  module.summary = outreachSummary(outreachRawEvents, outreachRawContacts);
  module.items = outreachAllItems.filter((item) => outreachCurrentMatcher(item, outreachSearchQuery));
  outreachDataMessage = module.items.length
    ? ""
    : outreachAllItems.length
      ? `No ${outreachSubpage.toLowerCase()} match this search.`
      : outreachEmptyMessage();

  const nextItemId = module.items.some((item) => item.id === preferredItemId)
    ? preferredItemId
    : module.items[0]?.id || "";
  selectedItemId = nextItemId;
  refreshStandardModuleData(module);
  if (nextItemId) updateDetail(module, nextItemId);
  setOutreachDetailTab(outreachDetailTab);
}

function applyOutreachSearch(module, query = "") {
  outreachSearchQuery = query.trim();
  refreshOutreachData(module, selectedItemId);
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
        const durationSlots = Math.max(0.5, item.duration / intervalMinutes);
        return `
          <button
            class="schedule-appointment ${item.compact ? "is-compact" : ""} ${item.id === selectedItemId ? "is-selected" : ""}"
            data-row-id="${escapeHtml(item.id)}"
            type="button"
            style="--start-slot: ${startSlot}; --duration-slots: ${durationSlots}; --row-color: ${escapeHtml(item.accent)};"
          >
            <strong>${escapeHtml(item.title)}</strong>
            <span class="status-pill">${escapeHtml(item.status)}</span>
            ${item.compact ? "" : `<span>${escapeHtml(item.subtitle)}</span>`}
          </button>
        `;
      }).join("")}
      ${visibleAppointments.length ? "" : `<p class="schedule-empty">${escapeHtml(scheduleDataState === "ready" ? "No appointments scheduled." : scheduleDataMessage)}</p>`}
    </div>
  `;
}

function scheduleWeekDateKeys() {
  return scheduleWeekDates(scheduleVisibleDate, scheduleSettings.weekdays);
}

function scheduleDateControlLabel() {
  return scheduleViewMode === "week"
    ? formatScheduleWeekRange(scheduleWeekDateKeys())
    : formatScheduleDate(scheduleVisibleDate);
}

function renderScheduleWeekPanel(module) {
  const weekDates = scheduleWeekDateKeys();

  return `
    <section class="schedule-week-grid" aria-label="Clinic week">
      ${weekDates.map((dateKey) => {
        const date = new Date(`${dateKey}T00:00:00`);
        const appointments = module.items
          .filter((item) => item.date === dateKey)
          .sort((first, second) => first.time.localeCompare(second.time));
        const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
        const dateLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);

        return `
          <article class="schedule-week-day ${dateKey === scheduleVisibleDate ? "is-selected" : ""}">
            <button class="schedule-week-day-header" data-schedule-week-day="${escapeHtml(dateKey)}" type="button">
              <span><strong>${escapeHtml(weekday)}</strong> ${escapeHtml(dateLabel)}</span>
              <em>${appointments.length}</em>
            </button>
            <div class="schedule-week-appointments">
              ${appointments.length ? appointments.map((item) => `
                <button
                  class="schedule-week-appointment ${item.id === selectedItemId ? "is-selected" : ""}"
                  data-row-id="${escapeHtml(item.id)}"
                  data-row-date="${escapeHtml(dateKey)}"
                  type="button"
                  style="--row-color: ${escapeHtml(item.accent)};"
                >
                  <time>${escapeHtml(formatScheduleTime(scheduleTimeMinutes(item.time)))}</time>
                  <strong>${escapeHtml(item.title)}</strong>
                </button>
              `).join("") : `<p>Open clinic day.</p>`}
            </div>
          </article>
        `;
      }).join("")}
    </section>
  `;
}

function renderScheduleViewContent(module) {
  return scheduleViewMode === "week"
    ? renderScheduleWeekPanel(module)
    : renderScheduleTimeline(module, scheduleVisibleDate);
}

function renderScheduleDayPanel(module) {
  return `
    <div class="panel list-panel schedule-day-panel">
      <div class="schedule-date-controls">
        <button data-schedule-date-action="today" type="button">Today</button>
        <button class="schedule-date-arrow" data-schedule-date-action="previous" type="button" aria-label="Previous ${scheduleViewMode}">${icons.chevronLeft}</button>
        <button class="schedule-date-arrow" data-schedule-date-action="next" type="button" aria-label="Next ${scheduleViewMode}">${icons.chevronRight}</button>
        <div class="schedule-date-picker-wrap">
          <button class="schedule-date-picker" data-open-schedule-date-picker type="button">
            ${icons.calendar}
            <span data-schedule-date-label>${scheduleDateControlLabel()}</span>
          </button>
          <input data-schedule-date-input type="date" value="${scheduleVisibleDate}" aria-label="Choose schedule date" tabindex="-1">
        </div>
      </div>
      <div data-schedule-timeline>
        ${renderScheduleViewContent(module)}
      </div>
    </div>
  `;
}

function schedulePrintCounts(module) {
  const items = printableScheduleItems(module.items, scheduleVisibleDate);
  const appointments = items.filter((item) => item.status !== "Blocked");
  return {
    schedule: items.length,
    prep: appointments.length,
    notes: appointments.length,
    packet: dailyPrintPacketPages(module.items, scheduleVisibleDate, scheduleClientsById).length
  };
}

function renderSchedulePrintCenter(module) {
  const counts = schedulePrintCounts(module);
  const rows = [
    ["schedule", "Daily Schedule", "Appointments and blocked time", counts.schedule],
    ["prep", "Daily Prep List", "Forms and supplies for each appointment", counts.prep],
    ["notes", "Appointment Notes", "One lesson-specific note per appointment", counts.notes],
    ["packet", "Daily Print Packet", "Schedule, prep list, then appointment notes", counts.packet]
  ];

  return `
    <section class="schedule-print-center" data-schedule-print-center hidden>
      <div class="schedule-print-date panel">
        <div>
          <span>Print date</span>
          <strong data-print-center-date-label>${escapeHtml(formatScheduleDate(scheduleVisibleDate))}</strong>
        </div>
        <input data-print-center-date type="date" value="${escapeHtml(scheduleVisibleDate)}" aria-label="Choose print date">
      </div>
      <div class="schedule-print-options">
        ${rows.map(([action, title, description, count]) => `
          <article class="panel schedule-print-option">
            <div>
              <h2>${title}</h2>
              <p>${description}</p>
            </div>
            <span data-print-count="${action}">${count} ${count === 1 ? "item" : "items"}</span>
            <button data-schedule-print-action="${action}" type="button">Print</button>
          </article>
        `).join("")}
      </div>
      <p class="schedule-print-status" data-schedule-print-status role="status" aria-live="polite"></p>
    </section>
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

function renderCrmFields(fields) {
  return Array.from({ length: 3 }, (_, columnIndex) => `
    <div class="crm-detail-column">
      ${renderFields(fields.filter((_, fieldIndex) => fieldIndex % 3 === columnIndex))}
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
      <span class="appointment-meta-icon" data-appointment-third-icon>${icons.file}</span>
      <strong data-field="type" data-appointment-third-value></strong>
    </div>
  `;
}

function renderCrmClientMeta() {
  return `
    <div class="appointment-meta-row">
      <span class="appointment-meta-icon">${icons.history}</span>
      <span class="crm-meta-copy"><em>Recent Contact</em><strong data-field="recentContact"></strong></span>
    </div>
    <div class="appointment-meta-row">
      <span class="appointment-meta-icon">${icons.clock}</span>
      <span class="crm-meta-copy"><em>Recent Appt</em><strong data-field="recentAppt"></strong></span>
    </div>
  `;
}

function renderCrmReferralMeta() {
  return `
    <div class="appointment-meta-row">
      <span class="appointment-meta-icon">${icons.calendar}</span>
      <span class="crm-meta-copy"><em>Referral Date</em><strong data-field="referralDate"></strong></span>
    </div>
    <div class="appointment-meta-row">
      <span class="appointment-meta-icon">${icons.history}</span>
      <span class="crm-meta-copy"><em>Recent Contact</em><strong data-field="recentContact"></strong></span>
    </div>
  `;
}

function renderCrmNetworkMeta() {
  return `
    <div class="appointment-meta-row">
      <span class="appointment-meta-icon">${icons.file}</span>
      <span class="crm-meta-copy"><em>Organization Type</em><strong data-field="type"></strong></span>
    </div>
    <div class="appointment-meta-row">
      <span class="appointment-meta-icon">${icons.crm}</span>
      <span class="crm-meta-copy"><em>Providers</em><strong data-field="providerCount"></strong></span>
    </div>
  `;
}

function renderCrmSideMeta() {
  if (crmSubpage === "Referrals") return renderCrmReferralMeta();
  if (crmSubpage === "Referral Network") return renderCrmNetworkMeta();
  return renderCrmClientMeta();
}

function renderScheduleFamilyRows(module) {
  return module.sideFields.map(([label, key]) => `
    <div class="meta-row">
      <span>${label}</span>
      <strong class="${key === "siblings" ? "is-stacked-list" : ""}" data-field="${key}"></strong>
    </div>
  `).join("");
}

function renderCrmLessonProgression() {
  return `
    <section class="detail-card crm-lesson-card">
      <div class="card-heading">
        <h3>Lesson Progression</h3>
        <button class="edit-button" data-crm-edit-client type="button">Edit</button>
      </div>
      <ol class="crm-lesson-steps" data-crm-lesson-steps></ol>
    </section>
  `;
}

function crmDetailTabKey(tab) {
  return String(tab || "").toLowerCase().replaceAll(" ", "-");
}

function crmSelectedItem() {
  return crmAllItems.find((item) => item.id === selectedItemId) || null;
}

function renderCrmActivityList(item) {
  if (!item?.activityLogs?.length) {
    return `<p class="crm-empty-copy">No calls or texts have been logged for this ${crmSubpage === "Referrals" ? "referral" : "client"}.</p>`;
  }

  return `
    <ol class="schedule-activity-list crm-activity-list">
      ${item.activityLogs.map((activity) => `
        <li>
          <time>${escapeHtml(formatClientDate(activity.activityDate))}${activity.activityTime ? `<br>${escapeHtml(formatScheduleTime(scheduleTimeMinutes(activity.activityTime)))}` : ""}</time>
          <div>
            <strong>${escapeHtml(activity.title || `${activity.direction || "Outbound"} ${activity.type || "Contact"}`)}</strong>
            <span>${escapeHtml([activity.result, activity.description].filter(Boolean).join(" | ") || "-")}</span>
          </div>
        </li>
      `).join("")}
    </ol>
  `;
}

function renderCrmNotesPanel(item) {
  return `
    <section class="detail-card">
      <div class="card-heading">
        <h3>Client Notes</h3>
        <button class="edit-button" data-crm-edit-notes type="button">Edit</button>
      </div>
      <p class="crm-note-copy">${escapeHtml(item?.source?.notes || "No client notes yet.")}</p>
    </section>
    <section class="detail-card">
      <div class="card-heading">
        <h3>Contact History</h3>
        <button class="edit-button" data-crm-log-contact="Call" type="button">Log Contact</button>
      </div>
      ${renderCrmActivityList(item)}
    </section>
  `;
}

function renderCrmAppointmentsPanel(item) {
  if (!item?.appointments?.length) {
    return `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Appointments</h3>
          <button class="edit-button" data-crm-new-appointment type="button">New Appt</button>
        </div>
        <p class="crm-empty-copy">No appointments have been linked to this client.</p>
      </section>
    `;
  }

  return `
    <section class="detail-card">
      <div class="card-heading">
        <h3>Appointments</h3>
        <button class="edit-button" data-crm-new-appointment type="button">New Appt</button>
      </div>
      <div class="crm-appointment-list">
        ${item.appointments.map((appointment) => `
          <button
            class="crm-appointment-row"
            data-crm-appointment-id="${escapeHtml(appointment.id)}"
            data-crm-appointment-date="${escapeHtml(appointment.appointmentDate)}"
            type="button"
          >
            <span>
              <strong>${escapeHtml(formatClientDate(appointment.appointmentDate))}${appointment.appointmentTime ? ` at ${escapeHtml(formatScheduleTime(scheduleTimeMinutes(appointment.appointmentTime)))}` : ""}</strong>
              <small>${escapeHtml(crmAppointmentDescription(appointment))}</small>
            </span>
            <span class="status-pill">${escapeHtml(appointment.status || "Scheduled")}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

const crmPrintFormPackets = {
  enrollment: {
    English: [
      ["Program Enrollment", "1. Program Enrollment - Print.docx"],
      ["Questionnaire", "2. Questionnaire - Print.xlsx"],
      ["HRSN Screener", "3. HRSN Screener.docx"]
    ],
    Spanish: [
      ["Program Enrollment", "1. SP Program Enrollment - Print.docx"],
      ["Questionnaire", "2. SP Questionnaire - Print.xlsx"],
      ["HRSN Screener", "3. HRSN Screener- Spanish.docx"]
    ]
  },
  graduation: {
    English: [
      ["Questionnaire", "2. Questionnaire - Print.xlsx"],
      ["Child Feedback", "4. Child Feedback Form - Print.docx"],
      ["Parent Feedback", "5. Parent Feedback Form - Print.docx"]
    ],
    Spanish: [
      ["Questionnaire", "2. SP Questionnaire - Print.xlsx"],
      ["Child Feedback", "4. SP Child Feedback Form - Print.docx"],
      ["Parent Feedback", "5. SP Parent Feedback Form - Print.docx"]
    ]
  }
};

function renderCrmFormLinks(files) {
  return files.map(([label, fileName]) => `
    <a class="crm-form-link" href="./print-forms/${encodeURIComponent(fileName)}" download="${escapeHtml(fileName)}">
      ${icons.file}
      <span>${escapeHtml(label)}</span>
    </a>
  `).join("");
}

function renderCrmFormsPanel(item) {
  const language = String(item?.source?.preferredLanguage || "").toLowerCase().includes("spanish")
    ? "Spanish"
    : "English";

  return `
    <section class="detail-card">
      <div class="card-heading">
        <h3>Enrollment Packet</h3>
      </div>
      <p class="crm-form-description">${language} forms based on this client's preferred language.</p>
      <div class="crm-form-links">${renderCrmFormLinks(crmPrintFormPackets.enrollment[language])}</div>
    </section>
    <section class="detail-card">
      <div class="card-heading">
        <h3>Graduation Packet</h3>
      </div>
      <p class="crm-form-description">${language} questionnaire and feedback forms.</p>
      <div class="crm-form-links">${renderCrmFormLinks(crmPrintFormPackets.graduation[language])}</div>
    </section>
  `;
}

function renderCrmReferralNotesPanel(item) {
  return `
    <section class="detail-card">
      <div class="card-heading">
        <h3>Referral Notes</h3>
        <button class="edit-button" data-crm-edit-referral type="button">Edit</button>
      </div>
      <p class="crm-note-copy">${escapeHtml(item?.source?.notes || "No referral notes yet.")}</p>
    </section>
  `;
}

function renderCrmReferralActivityPanel(item) {
  return `
    <section class="detail-card">
      <div class="card-heading">
        <h3>Contact History</h3>
        <button class="edit-button" data-crm-log-contact="Call" type="button">Log Contact</button>
      </div>
      ${renderCrmActivityList(item)}
    </section>
  `;
}

function renderCrmReferralConversionPanel(item) {
  const converted = Boolean(item?.convertedClientId);
  return `
    <section class="detail-card">
      <div class="card-heading">
        <h3>${converted ? "Client Profile Created" : "Convert to Client"}</h3>
      </div>
      <p class="crm-note-copy">${
        converted
          ? "This referral is connected to a CRM client profile."
          : "Conversion creates a client profile from this referral and keeps the referral history connected."
      }</p>
      <div class="crm-panel-actions">
        <button data-crm-referral-convert type="button">${converted ? "Open Client Profile" : "Convert to Client"}</button>
      </div>
    </section>
  `;
}

function renderCrmNetworkProvidersPanel(item) {
  const providers = item?.providers || [];
  return `
    <section class="detail-card">
      <div class="card-heading">
        <h3>Providers</h3>
        <button class="edit-button" data-crm-edit-network type="button">Edit</button>
      </div>
      ${providers.length ? `
        <div class="crm-provider-list">
          ${providers.map((provider) => `
            <article class="crm-provider-row">
              <strong>${escapeHtml(provider.name)}</strong>
              <span>${escapeHtml(provider.email || "No email listed")}</span>
              ${provider.notes ? `<p>${escapeHtml(provider.notes)}</p>` : ""}
            </article>
          `).join("")}
        </div>
      ` : `<p class="crm-empty-copy">No providers are listed for this organization.</p>`}
    </section>
  `;
}

function renderCrmNetworkNotesPanel(item) {
  return `
    <section class="detail-card">
      <div class="card-heading">
        <h3>Organization Notes</h3>
        <button class="edit-button" data-crm-edit-network type="button">Edit</button>
      </div>
      <p class="crm-note-copy">${escapeHtml(item?.source?.notes || "No organization notes yet.")}</p>
    </section>
  `;
}

function renderCrmEmptyDetailPanel(title, message) {
  return `
    <section class="detail-card crm-empty-detail-card">
      <div class="card-heading">
        <h3>${escapeHtml(title)}</h3>
      </div>
      <p class="crm-empty-copy">${escapeHtml(message)}</p>
    </section>
  `;
}

function crmSelectOptions(options, selectedValue, placeholder = "") {
  return [
    ...(placeholder ? [[placeholder, ""]] : []),
    ...options.map((option) => Array.isArray(option) ? option : [option, option])
  ].map(([label, value]) => `
    <option value="${escapeHtml(value)}" ${String(selectedValue || "") === value ? "selected" : ""}>${escapeHtml(label)}</option>
  `).join("");
}

const crmClientEditorFormId = "crm-client-editor-form";
const crmReferralEditorFormId = "crm-referral-editor-form";
const crmNetworkEditorFormId = "crm-network-editor-form";

function crmEditorFormAttribute(formId = "") {
  return formId ? ` form="${escapeHtml(formId)}"` : "";
}

function renderCrmSiblingChoices(item, formId = "") {
  const selected = new Set(Array.isArray(item?.source?.siblingIds) ? item.source.siblingIds : []);
  const choices = crmRawClients.filter((client) => client.id !== item?.id);
  const formAttribute = crmEditorFormAttribute(formId);

  if (!choices.length) {
    return `<p class="crm-empty-copy">No other clients are available to link.</p>`;
  }

  return `
    <div class="crm-sibling-choices">
      ${choices.map((client) => {
        const name = [client.firstName, client.lastName].filter(Boolean).join(" ") || "Unnamed client";
        return `
          <label>
            <input type="checkbox" name="siblingIds" value="${escapeHtml(client.id)}"${formAttribute} ${selected.has(client.id) ? "checked" : ""}>
            <span>${escapeHtml(name)}</span>
          </label>
        `;
      }).join("")}
    </div>
  `;
}

function renderCrmReferralSiblingChoices(item, formId = "") {
  const selected = new Set(Array.isArray(item?.source?.siblingIds) ? item.source.siblingIds : []);
  const choices = crmRawReferrals.filter((referral) =>
    referral.id !== item?.id && !String(referral.convertedClientId || "").trim());
  const formAttribute = crmEditorFormAttribute(formId);

  if (!choices.length) {
    return `<p class="crm-empty-copy">No other referrals are available to link.</p>`;
  }

  return `
    <div class="crm-sibling-choices">
      ${choices.map((referral) => `
        <label>
          <input type="checkbox" name="siblingIds" value="${escapeHtml(referral.id)}"${formAttribute} ${selected.has(referral.id) ? "checked" : ""}>
          <span>${escapeHtml([referral.firstName, referral.lastName].filter(Boolean).join(" ") || "Unnamed referral")}</span>
        </label>
      `).join("")}
    </div>
  `;
}

function renderCrmProviderChoices(item, formId = "") {
  const providerLinks = Array.isArray(item?.source?.providerLinks) ? item.source.providerLinks : [];
  const selected = new Set(
    providerLinks
      .map((link) => link.providerId)
      .filter(Boolean)
  );
  const formAttribute = crmEditorFormAttribute(formId);
  const entries = crmRawNetworkEntries.filter((entry) => Array.isArray(entry.providers) && entry.providers.length);
  const selectedOrganizationId = providerLinks.find((link) =>
    entries.some((entry) => entry.id === link.networkId))?.networkId || "";

  if (!entries.length) {
    return `<p class="crm-empty-copy">No providers have been added to the Referral Network.</p>`;
  }

  return `
    <div class="crm-provider-choices">
      <label class="crm-provider-organization-field">
        <span>Organization</span>
        <select name="providerOrganizationId" data-crm-provider-organization${formAttribute}>
          <option value="">Choose organization</option>
          ${entries.map((entry) => `
            <option value="${escapeHtml(entry.id)}" ${entry.id === selectedOrganizationId ? "selected" : ""}>${escapeHtml(entry.name)}</option>
          `).join("")}
        </select>
      </label>
      <div class="crm-provider-groups">
        ${entries.map((entry) => {
          const isSelectedOrganization = entry.id === selectedOrganizationId;
          return `
        <fieldset data-crm-provider-group="${escapeHtml(entry.id)}" ${isSelectedOrganization ? "" : "hidden"}>
          <legend>Providers</legend>
          ${(entry.providers || []).map((provider) => `
            <label>
              <input type="checkbox" name="providerIds" value="${escapeHtml(provider.id)}"${formAttribute} ${selected.has(provider.id) ? "checked" : ""} ${isSelectedOrganization ? "" : "disabled"}>
              <span>${escapeHtml(provider.name)}</span>
            </label>
          `).join("")}
        </fieldset>
          `;
        }).join("")}
        <p class="crm-empty-copy" data-crm-provider-prompt ${selectedOrganizationId ? "hidden" : ""}>Choose an organization to see its providers.</p>
      </div>
    </div>
  `;
}

function renderCrmClientEditorSide(item = null) {
  const source = item?.source || {};
  const formAttribute = crmEditorFormAttribute(crmClientEditorFormId);

  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status"${formAttribute} aria-label="Client status">
          ${crmSelectOptions(crmStatusOptions(source.status), source.status || "Scheduled")}
        </select>
      </label>
      <div class="crm-editor-name-fields">
        <label>
          <span>First Name</span>
          <input name="firstName"${formAttribute} value="${escapeHtml(source.firstName || "")}" placeholder="First name" required>
        </label>
        <label>
          <span>Last Name</span>
          <input name="lastName"${formAttribute} value="${escapeHtml(source.lastName || "")}" placeholder="Last name" required>
        </label>
      </div>
      <div class="meta-list appointment-meta crm-editor-side-meta">
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.history}</span>
          <span class="crm-meta-copy">
            <em>Recent Contact</em>
            <input name="mostRecentContactDate"${formAttribute} type="date" value="${escapeHtml(source.mostRecentContactDate || source.firstContactDate || source.referralDate || "")}">
          </span>
        </label>
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.clock}</span>
          <span class="crm-meta-copy">
            <em>Recent Appt</em>
            <input name="mostRecentAppointmentDate"${formAttribute} type="date" value="${escapeHtml(source.mostRecentAppointmentDate || source.lastAppointmentDate || source.firstAppointmentDate || "")}">
          </span>
        </label>
      </div>
      <section class="side-section crm-editor-family-section">
        <h3><span class="section-icon">${icons.crm}</span>Family</h3>
        <label class="crm-side-field">
          <span>Caregiver</span>
          <input name="parentName"${formAttribute} value="${escapeHtml(source.parentName || "")}" required>
        </label>
        <div class="crm-side-field">
          <span>Siblings</span>
          ${renderCrmSiblingChoices(item, crmClientEditorFormId)}
        </div>
        <label class="crm-side-field">
          <span>Phone</span>
          <input name="phone"${formAttribute} type="tel" value="${escapeHtml(source.phone || "")}" required>
        </label>
        <label class="crm-side-field">
          <span>Email</span>
          <input name="email"${formAttribute} type="email" value="${escapeHtml(source.email || "")}">
        </label>
        <label class="crm-side-field">
          <span>Street</span>
          <input name="addressStreet"${formAttribute} value="${escapeHtml(source.addressStreet || "")}">
        </label>
        <label class="crm-side-field">
          <span>City</span>
          <input name="addressCity"${formAttribute} value="${escapeHtml(source.addressCity || "")}">
        </label>
        <div class="crm-side-address-row">
          <label class="crm-side-field">
            <span>State</span>
            <input name="addressState"${formAttribute} value="${escapeHtml(source.addressState || "")}">
          </label>
          <label class="crm-side-field">
            <span>ZIP</span>
            <input name="addressZip"${formAttribute} value="${escapeHtml(source.addressZip || "")}">
          </label>
        </div>
      </section>
    </div>
  `;
}

function renderCrmClientEditorMain(item = null) {
  const source = item?.source || {};
  const lessonValue = clientLessonValue(clientLessonIndex(source.currentLesson));
  const convertedDate = formatClientDate(source.convertedAt);

  return `
    <form class="crm-profile-editor-main" id="${crmClientEditorFormId}" data-crm-client-form>
      <section class="detail-card">
        <div class="card-heading">
          <h3>Client Details</h3>
          <button class="edit-button" data-close-crm-editor type="button">Cancel</button>
        </div>
        <div class="schedule-inline-fields crm-profile-editor-fields">
          <label><span>Language</span><select name="preferredLanguage">${crmSelectOptions(languageOptions, source.preferredLanguage || "English")}</select></label>
          <label><span>Referral Date</span><input name="referralDate" type="date" value="${escapeHtml(source.referralDate || "")}"></label>
          <label><span>Referral Type</span><select name="referralType">${crmSelectOptions(referralTypeOptions, source.referralType, "Choose")}</select></label>
          <label><span>Birthdate</span><input name="dateOfBirth" type="date" value="${escapeHtml(source.dateOfBirth || "")}"></label>
          <label><span>First Contact</span><input name="firstContactDate" type="date" value="${escapeHtml(source.firstContactDate || "")}"></label>
          <label><span>Referring Provider</span><input value="${escapeHtml(item?.providerProfiles || "-")}" readonly></label>
          <label><span>Gender</span><select name="gender">${crmSelectOptions(["Female", "Male", "Nonbinary", "Unspecified"], source.gender || "Unspecified")}</select></label>
          <label><span>Converted Date</span><input value="${escapeHtml(convertedDate)}" readonly></label>
          <label><span>Preferred Contact</span><select name="preferredContactMethod">${crmSelectOptions(preferredContactOptions, source.preferredContactMethod, "Choose")}</select></label>
          <label class="crm-profile-boolean-field">
            <span>Insurance</span>
            <span class="crm-profile-boolean-control">
              <input name="ycco" type="checkbox" ${source.ycco === true ? "checked" : ""}>
              <strong>YCCO</strong>
            </span>
          </label>
          <label><span>First Appointment</span><input name="firstAppointmentDate" type="date" value="${escapeHtml(source.firstAppointmentDate || "")}"></label>
          <label class="crm-profile-boolean-field">
            <span>Email Opt Out</span>
            <span class="crm-profile-boolean-control">
              <input name="emailOptOut" type="checkbox" ${source.emailOptOut ? "checked" : ""}>
              <strong>Opt Out</strong>
            </span>
          </label>
          <label class="crm-profile-boolean-field">
            <span>HRSN</span>
            <span class="crm-profile-boolean-control">
              <input name="hrsn" type="checkbox" ${source.hrsn === true ? "checked" : ""}>
              <strong>Eligible</strong>
            </span>
          </label>
          <label><span>Graduation Date</span><input name="graduationDate" type="date" value="${escapeHtml(source.graduationDate || "")}"></label>
          <label class="crm-profile-boolean-field">
            <span>Text Opt Out</span>
            <span class="crm-profile-boolean-control">
              <input name="textOptOut" type="checkbox" ${source.textOptOut ? "checked" : ""}>
              <strong>Opt Out</strong>
            </span>
          </label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="5">${escapeHtml(source.notes || "")}</textarea></label>
        </div>
      </section>
      <section class="detail-card crm-lesson-card">
        <div class="card-heading">
          <h3>Lesson Progression</h3>
        </div>
        <label class="crm-lesson-editor-field">
          <span>Completed Through</span>
          <select name="currentLesson">${crmSelectOptions(lessonProgression.map(([label], index) => [label, clientLessonValue(index)]), lessonValue, "Not assigned")}</select>
        </label>
      </section>
      <p class="schedule-dialog-status" data-crm-editor-status role="status" aria-live="polite"></p>
      <div class="footer-actions crm-editor-footer-actions">
        <button data-close-crm-editor type="button">Cancel</button>
        <button class="is-primary" type="submit">${item ? "Save Changes" : "Save Client"}</button>
      </div>
    </form>
  `;
}

function renderCrmReferralEditorSide(item = null, sourceOverride = null) {
  const source = sourceOverride || item?.source || {};
  const formAttribute = crmEditorFormAttribute(crmReferralEditorFormId);

  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status"${formAttribute} aria-label="Referral status">
          ${crmSelectOptions(referralStatusOptions, source.status || "New")}
        </select>
      </label>
      <div class="crm-editor-name-fields">
        <label>
          <span>First Name</span>
          <input name="firstName"${formAttribute} value="${escapeHtml(source.firstName || "")}" required>
        </label>
        <label>
          <span>Last Name</span>
          <input name="lastName"${formAttribute} value="${escapeHtml(source.lastName || "")}" required>
        </label>
      </div>
      <div class="meta-list appointment-meta crm-editor-side-meta">
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.calendar}</span>
          <span class="crm-meta-copy">
            <em>Referral Date</em>
            <input name="referralDate"${formAttribute} type="date" value="${escapeHtml(source.referralDate || "")}">
          </span>
        </label>
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.history}</span>
          <span class="crm-meta-copy">
            <em>Recent Contact</em>
            <input name="mostRecentContactDate"${formAttribute} type="date" value="${escapeHtml(source.mostRecentContactDate || source.firstContactDate || "")}">
          </span>
        </label>
      </div>
      <section class="side-section crm-editor-family-section">
        <h3><span class="section-icon">${icons.crm}</span>Family</h3>
        <label class="crm-side-field">
          <span>Caregiver</span>
          <input name="parentName"${formAttribute} value="${escapeHtml(source.parentName || "")}" required>
        </label>
        <div class="crm-side-field">
          <span>Siblings</span>
          ${renderCrmReferralSiblingChoices(item, crmReferralEditorFormId)}
        </div>
        <label class="crm-side-field">
          <span>Phone</span>
          <input name="phone"${formAttribute} type="tel" value="${escapeHtml(source.phone || "")}" required>
        </label>
        <label class="crm-side-field">
          <span>Email</span>
          <input name="email"${formAttribute} type="email" value="${escapeHtml(source.email || "")}">
        </label>
        <label class="crm-side-field">
          <span>Street</span>
          <input name="addressStreet"${formAttribute} value="${escapeHtml(source.addressStreet || "")}">
        </label>
        <label class="crm-side-field">
          <span>City</span>
          <input name="addressCity"${formAttribute} value="${escapeHtml(source.addressCity || "")}">
        </label>
        <div class="crm-side-address-row">
          <label class="crm-side-field">
            <span>State</span>
            <input name="addressState"${formAttribute} value="${escapeHtml(source.addressState || "")}">
          </label>
          <label class="crm-side-field">
            <span>ZIP</span>
            <input name="addressZip"${formAttribute} value="${escapeHtml(source.addressZip || "")}">
          </label>
        </div>
      </section>
    </div>
  `;
}

function renderCrmReferralEditorMain(item = null, sourceOverride = null) {
  const source = sourceOverride || item?.source || {};

  return `
    <form class="crm-profile-editor-main" id="${crmReferralEditorFormId}" data-crm-referral-form>
      <section class="detail-card">
        <div class="card-heading">
          <h3>Referral Details</h3>
          <button class="edit-button" data-close-crm-editor type="button">Cancel</button>
        </div>
        <div class="schedule-inline-fields crm-profile-editor-fields">
          <label><span>Language</span><select name="preferredLanguage">${crmSelectOptions(languageOptions, source.preferredLanguage || "English")}</select></label>
          <label><span>Referral Type</span><select name="referralType" required>${crmSelectOptions(referralTypeOptions, source.referralType, "Choose")}</select></label>
          <label><span>Referral Source</span><input name="referralSource" value="${escapeHtml(source.referralSource || "")}"></label>
          <label><span>Birthdate</span><input name="dateOfBirth" type="date" value="${escapeHtml(source.dateOfBirth || "")}"></label>
          <label><span>First Contact</span><input name="firstContactDate" type="date" value="${escapeHtml(source.firstContactDate || "")}"></label>
          <label><span>First Appointment</span><input name="firstAppointmentDate" type="date" value="${escapeHtml(source.firstAppointmentDate || "")}"></label>
          <label><span>Gender</span><select name="gender">${crmSelectOptions(["Female", "Male", "Nonbinary", "Unspecified"], source.gender || "Unspecified")}</select></label>
          <label><span>Preferred Contact</span><select name="preferredContactMethod">${crmSelectOptions(preferredContactOptions, source.preferredContactMethod, "Choose")}</select></label>
          <label class="crm-profile-boolean-field">
            <span>Insurance</span>
            <span class="crm-profile-boolean-control">
              <input name="ycco" type="checkbox" ${source.ycco === true ? "checked" : ""}>
              <strong>YCCO</strong>
            </span>
          </label>
          <label class="crm-profile-boolean-field">
            <span>HRSN</span>
            <span class="crm-profile-boolean-control">
              <input name="hrsn" type="checkbox" ${source.hrsn === true ? "checked" : ""}>
              <strong>Eligible</strong>
            </span>
          </label>
          <label class="crm-profile-boolean-field">
            <span>Email Opt Out</span>
            <span class="crm-profile-boolean-control">
              <input name="emailOptOut" type="checkbox" ${source.emailOptOut ? "checked" : ""}>
              <strong>Opt Out</strong>
            </span>
          </label>
          <label class="crm-profile-boolean-field">
            <span>Text Opt Out</span>
            <span class="crm-profile-boolean-control">
              <input name="textOptOut" type="checkbox" ${source.textOptOut ? "checked" : ""}>
              <strong>Opt Out</strong>
            </span>
          </label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="4">${escapeHtml(source.notes || "")}</textarea></label>
        </div>
      </section>
      <section class="detail-card">
        <div class="card-heading">
          <h3>Referring Providers</h3>
        </div>
        ${renderCrmProviderChoices(item, crmReferralEditorFormId)}
      </section>
      <p class="schedule-dialog-status" data-crm-editor-status role="status" aria-live="polite"></p>
      <div class="footer-actions crm-editor-footer-actions">
        <button data-close-crm-editor type="button">Cancel</button>
        <button class="is-primary" type="submit">${item ? "Save Changes" : "Save Referral"}</button>
      </div>
    </form>
  `;
}

function renderCrmNetworkEditorSide(item = null) {
  const source = item?.source || {};
  const formAttribute = crmEditorFormAttribute(crmNetworkEditorFormId);
  return `
    <div class="crm-profile-editor-side">
      <div class="status-line is-module-status">
        <span class="status-dot"></span>
        <span>${item ? "Referral Partner" : "New Partner"}</span>
      </div>
      <div class="crm-editor-name-fields">
        <label>
          <span>Organization Name</span>
          <input name="name"${formAttribute} value="${escapeHtml(source.name || "")}" required>
        </label>
      </div>
      <div class="meta-list appointment-meta crm-editor-side-meta">
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.file}</span>
          <span class="crm-meta-copy">
            <em>Organization Type</em>
            <select name="type"${formAttribute}>${crmSelectOptions(referralNetworkTypeOptions, source.type, "Choose")}</select>
          </span>
        </label>
      </div>
      <section class="side-section crm-editor-family-section">
        <h3><span class="section-icon">${icons.crm}</span>Contact</h3>
        <label class="crm-side-field">
          <span>Contact Name</span>
          <input name="contactName"${formAttribute} value="${escapeHtml(source.contactName || "")}">
        </label>
        <label class="crm-side-field">
          <span>Phone</span>
          <input name="phone"${formAttribute} type="tel" value="${escapeHtml(source.phone || "")}">
        </label>
        <label class="crm-side-field">
          <span>Email</span>
          <input name="email"${formAttribute} type="email" value="${escapeHtml(source.email || "")}">
        </label>
        <label class="crm-side-field">
          <span>Website</span>
          <input name="website"${formAttribute} type="url" value="${escapeHtml(source.website || "")}">
        </label>
      </section>
    </div>
  `;
}

function renderCrmProviderEditorRows(providers = []) {
  const rows = providers.length ? providers : [{ id: "", name: "", email: "", notes: "" }];
  return rows.map((provider) => `
    <div class="crm-provider-editor-row" data-crm-provider-row>
      <input name="providerId" type="hidden" value="${escapeHtml(provider.id || "")}">
      <label><span>Provider Name</span><input name="providerName" value="${escapeHtml(provider.name || "")}"></label>
      <label><span>Email</span><input name="providerEmail" type="email" value="${escapeHtml(provider.email || "")}"></label>
      <label class="is-wide"><span>Notes</span><input name="providerNotes" value="${escapeHtml(provider.notes || "")}"></label>
      <button data-remove-crm-provider type="button" aria-label="Remove provider">&times;</button>
    </div>
  `).join("");
}

function renderCrmNetworkEditorMain(item = null) {
  const source = item?.source || {};
  return `
    <form class="crm-profile-editor-main" id="${crmNetworkEditorFormId}" data-crm-network-form>
      <section class="detail-card">
        <div class="card-heading">
          <h3>Organization Details</h3>
          <button class="edit-button" data-close-crm-editor type="button">Cancel</button>
        </div>
        <label class="crm-lesson-editor-field">
          <span>Notes</span>
          <textarea name="notes" rows="5">${escapeHtml(source.notes || "")}</textarea>
        </label>
      </section>
      <section class="detail-card">
        <div class="card-heading">
          <h3>Providers</h3>
          <button class="edit-button" data-add-crm-provider type="button">Add Provider</button>
        </div>
        <div class="crm-provider-editor-list" data-crm-provider-editor-list>
          ${renderCrmProviderEditorRows(Array.isArray(source.providers) ? source.providers : [])}
        </div>
      </section>
      <p class="schedule-dialog-status" data-crm-editor-status role="status" aria-live="polite"></p>
      <div class="footer-actions crm-editor-footer-actions">
        <button data-close-crm-editor type="button">Cancel</button>
        <button class="is-primary" type="submit">${item ? "Save Changes" : "Save Organization"}</button>
      </div>
    </form>
  `;
}

function renderCrmClientForm(item = null, options = {}) {
  const source = item?.source || {};
  const title = options.notesOnly ? "Edit Client Notes" : item ? `Edit ${item.title}` : "New Client";

  if (options.notesOnly) {
    return `
      <form class="schedule-inline-form crm-inline-form" data-crm-client-form data-crm-notes-only="true">
        <div class="schedule-inline-form-header">
          <h3>${title}</h3>
          <button data-close-crm-editor type="button">Cancel</button>
        </div>
        <div class="schedule-inline-fields crm-inline-fields">
          <label class="is-full-width">
            <span>Notes</span>
            <textarea name="notes" rows="10">${escapeHtml(source.notes || "")}</textarea>
          </label>
        </div>
        <p class="schedule-dialog-status" data-crm-editor-status role="status" aria-live="polite"></p>
        <div class="schedule-inline-actions">
          <button type="submit">Save Notes</button>
        </div>
      </form>
    `;
  }

  return renderCrmClientEditorMain(item);
}

function activityResultOptions(type) {
  return type === "Text"
    ? ["Sent", "Reply received", "Scheduled", "Requested call back", "No response", "Not interested"]
    : ["Scheduled", "Left voicemail", "No voicemail, call back", "Not interested, do not call back", "Requested call back", "Invalid number"];
}

function localDateParts() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return {
    date: new Date(date.getTime() - offset).toISOString().slice(0, 10),
    time: new Date(date.getTime() - offset).toISOString().slice(11, 16)
  };
}

function renderCrmActivityForm(item, type = "Call") {
  const now = localDateParts();

  return `
    <form class="schedule-inline-form crm-inline-form" data-crm-activity-form data-activity-type="${escapeHtml(type)}">
      <div class="schedule-inline-form-header">
        <h3>Log ${escapeHtml(type)}</h3>
        <button data-close-crm-editor type="button">Cancel</button>
      </div>
      <div class="schedule-inline-fields crm-inline-fields">
        <label><span>Direction</span><select name="direction">${crmSelectOptions(["Outbound", "Inbound"], "Outbound")}</select></label>
        <label><span>Result</span><select name="result">${crmSelectOptions(activityResultOptions(type), activityResultOptions(type)[0])}</select></label>
        <label><span>Date</span><input name="activityDate" type="date" value="${now.date}" required></label>
        <label><span>Time</span><input name="activityTime" type="time" value="${now.time}" required></label>
        <label class="is-full-width"><span>Notes</span><textarea name="description" rows="6"></textarea></label>
      </div>
      <p class="schedule-dialog-status" data-crm-editor-status role="status" aria-live="polite"></p>
      <div class="schedule-inline-actions">
        <button type="submit">Save ${escapeHtml(type)}</button>
      </div>
    </form>
  `;
}

function setCrmActionStatus(message = "", state = "") {
  const actionStatus = document.querySelector("[data-crm-action-status]");
  const editorStatus = document.querySelector("[data-crm-editor-status]");
  [actionStatus, editorStatus].filter(Boolean).forEach((status) => {
    status.textContent = message;
    status.dataset.state = state;
  });
}

function updateCrmActionAvailability(item = crmSelectedItem()) {
  document.querySelectorAll("[data-crm-action], [data-crm-edit-client], [data-crm-edit-referral], [data-crm-edit-network], [data-crm-edit-notes], [data-crm-log-contact], [data-crm-new-appointment], [data-crm-lesson-value], [data-crm-status-select], [data-crm-referral-convert]").forEach((control) => {
    control.disabled = crmActionBusy || !item;
  });
  document.querySelectorAll("[data-crm-new-client], [data-crm-new-referral], [data-crm-new-network], [data-crm-search-toggle], [data-crm-search-input]").forEach((control) => {
    control.disabled = crmActionBusy;
  });
  const closeButton = document.querySelector("[data-crm-action='close-client']");
  if (closeButton) {
    const closed = item?.status === "Closed";
    closeButton.disabled = crmActionBusy || !item || closed;
    closeButton.textContent = closed ? "Client Closed" : crmClosePendingId === item?.id ? "Confirm Close" : "Close Client";
  }
  const deleteButton = document.querySelector("[data-crm-action='delete']");
  if (deleteButton) {
    deleteButton.textContent = crmDeletePendingId === item?.id ? "Confirm" : "Delete";
  }
  const convertButton = document.querySelector("[data-crm-action='convert']");
  if (convertButton) {
    convertButton.textContent = item?.convertedClientId
      ? "Open Client"
      : crmConvertPendingId === item?.id
        ? "Confirm"
        : "Convert";
  }
  const conversionPanelButton = document.querySelector("[data-crm-referral-convert]");
  if (conversionPanelButton) {
    conversionPanelButton.textContent = item?.convertedClientId
      ? "Open Client Profile"
      : crmConvertPendingId === item?.id
        ? "Confirm Conversion"
        : "Convert to Client";
  }
}

function setCrmActionBusy(busy) {
  crmActionBusy = busy;
  updateCrmActionAvailability();
  document.querySelectorAll("[data-crm-editor], [data-crm-side-editor]").forEach((editor) => {
    editor.setAttribute("aria-busy", String(busy));
    editor.querySelectorAll("button, input, select, textarea").forEach((control) => {
      control.disabled = busy;
    });
  });
}

async function crmAuthedFetch(path, options = {}) {
  if (!crmCurrentUser) {
    throw new Error("Sign in before changing a client profile.");
  }

  const token = await crmCurrentUser.getIdToken();
  const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `The client service returned ${response.status}.`);
  }

  return response.json().catch(() => ({}));
}

function renderCrmDetailContent(item) {
  const panels = crmSubpage === "Referrals"
    ? {
        notes: item
          ? renderCrmReferralNotesPanel(item)
          : renderCrmEmptyDetailPanel("Referral Notes", "Select a referral to review or edit its notes."),
        activity: item
          ? renderCrmReferralActivityPanel(item)
          : renderCrmEmptyDetailPanel("Contact History", "Select a referral to review or log contact activity."),
        conversion: item
          ? renderCrmReferralConversionPanel(item)
          : renderCrmEmptyDetailPanel("Convert to Client", "Select a referral before creating a client profile.")
      }
    : crmSubpage === "Referral Network"
      ? {
          providers: item
            ? renderCrmNetworkProvidersPanel(item)
            : renderCrmEmptyDetailPanel("Providers", "Select an organization to review or edit its providers."),
          notes: item
            ? renderCrmNetworkNotesPanel(item)
            : renderCrmEmptyDetailPanel("Organization Notes", "Select an organization to review or edit its notes.")
        }
      : {
          notes: item
            ? renderCrmNotesPanel(item)
            : renderCrmEmptyDetailPanel("Notes", "Select a client to review or log contact history."),
          appointments: item
            ? renderCrmAppointmentsPanel(item)
            : renderCrmEmptyDetailPanel("Appointments", "Select a client to review appointment history."),
          forms: item
            ? renderCrmFormsPanel(item)
            : renderCrmEmptyDetailPanel("Forms", "Select a client to open the correct program forms.")
        };

  Object.entries(panels).forEach(([key, html]) => {
    const panel = document.querySelector(`[data-crm-detail-panel="${key}"]`);
    if (panel) panel.innerHTML = html;
  });
}

function setCrmDetailTab(tab = "overview") {
  const validTabs = new Set(modules.crm.detailTabs.map(crmDetailTabKey));
  if (crmClosePendingId) resetCrmCloseAction();
  if (crmDeletePendingId || crmConvertPendingId) resetCrmProtectedActions();
  crmDetailTab = validTabs.has(tab) ? tab : "overview";

  document.querySelectorAll("[data-crm-detail-tab]").forEach((button) => {
    const active = button.dataset.crmDetailTab === crmDetailTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-crm-detail-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.crmDetailPanel !== crmDetailTab;
  });
}

function setCrmPanelMode(mode = "detail") {
  crmPanelMode = mode === "editor" ? "editor" : "detail";
  const tabs = document.querySelector("[data-crm-tabs]");
  const content = document.querySelector("[data-crm-detail-content]");
  const editor = document.querySelector("[data-crm-editor]");
  const sideDetail = document.querySelector("[data-crm-side-detail]");
  const sideEditor = document.querySelector("[data-crm-side-editor]");
  const editing = crmPanelMode === "editor";
  const editingProfile = editing && ["client", "referral", "network"].includes(crmEditorKind);

  if (tabs) {
    tabs.hidden = editing && !editingProfile;
    tabs.querySelectorAll("button").forEach((button) => {
      button.disabled = editing;
    });
  }
  if (content) content.hidden = editing;
  if (editor) editor.hidden = !editing;
  if (sideDetail) sideDetail.hidden = editingProfile;
  if (sideEditor) sideEditor.hidden = !editingProfile;
}

function openCrmClientEditor(item = null, options = {}) {
  if (crmActionBusy) return;
  const editor = document.querySelector("[data-crm-editor]");
  const sideEditor = document.querySelector("[data-crm-side-editor]");
  if (!editor) return;

  crmEditingClientId = item?.id || "";
  crmClosePendingId = "";
  crmEditorKind = options.notesOnly ? "inline" : "client";
  editor.classList.toggle("is-profile-editor", !options.notesOnly);
  editor.innerHTML = renderCrmClientForm(item, options);
  if (sideEditor) {
    sideEditor.innerHTML = options.notesOnly ? "" : renderCrmClientEditorSide(item);
  }
  if (!options.notesOnly) setCrmDetailTab("overview");
  setCrmActionStatus("");
  setCrmPanelMode("editor");
  (sideEditor?.querySelector("input, textarea, select") || editor.querySelector("input, textarea, select"))?.focus();
}

function openCrmReferralEditor(item = null, options = {}) {
  if (crmActionBusy) return;
  const editor = document.querySelector("[data-crm-editor]");
  const sideEditor = document.querySelector("[data-crm-side-editor]");
  if (!editor || !sideEditor) return;

  crmEditingReferralId = item?.id || "";
  crmDeletePendingId = "";
  crmConvertPendingId = "";
  crmEditorKind = "referral";
  editor.classList.add("is-profile-editor");
  editor.innerHTML = renderCrmReferralEditorMain(item, options.source || null);
  sideEditor.innerHTML = renderCrmReferralEditorSide(item, options.source || null);
  setCrmDetailTab("overview");
  setCrmActionStatus("");
  setCrmPanelMode("editor");
  sideEditor.querySelector("input, textarea, select")?.focus();
}

function openCrmNetworkEditor(item = null) {
  if (crmActionBusy) return;
  const editor = document.querySelector("[data-crm-editor]");
  const sideEditor = document.querySelector("[data-crm-side-editor]");
  if (!editor || !sideEditor) return;

  crmEditingNetworkId = item?.id || "";
  crmDeletePendingId = "";
  crmEditorKind = "network";
  editor.classList.add("is-profile-editor");
  editor.innerHTML = renderCrmNetworkEditorMain(item);
  sideEditor.innerHTML = renderCrmNetworkEditorSide(item);
  setCrmDetailTab("overview");
  setCrmActionStatus("");
  setCrmPanelMode("editor");
  sideEditor.querySelector("input, textarea, select")?.focus();
}

function openCrmActivityEditor(item, type) {
  if (!item || crmActionBusy) return;
  const editor = document.querySelector("[data-crm-editor]");
  if (!editor) return;

  if (crmSubpage === "Referrals") {
    crmEditingReferralId = item.id;
  } else {
    crmEditingClientId = item.id;
  }
  crmClosePendingId = "";
  crmEditorKind = "inline";
  editor.classList.remove("is-profile-editor");
  editor.innerHTML = renderCrmActivityForm(item, type);
  setCrmActionStatus("");
  setCrmPanelMode("editor");
  editor.querySelector("select, input, textarea")?.focus();
}

function closeCrmEditor() {
  if (crmActionBusy) return;
  const editor = document.querySelector("[data-crm-editor]");
  const sideEditor = document.querySelector("[data-crm-side-editor]");
  if (editor) {
    editor.replaceChildren();
    editor.classList.remove("is-profile-editor");
  }
  if (sideEditor) sideEditor.replaceChildren();
  crmEditingClientId = "";
  crmEditingReferralId = "";
  crmEditingNetworkId = "";
  crmEditorKind = "";
  setCrmPanelMode("detail");
  updateDetail(modules.crm, selectedItemId);
}

async function syncCrmSiblings(clientId, previousIds, selectedIds) {
  const { additions, removals } = crmSiblingChanges(previousIds, selectedIds);

  for (const siblingId of additions) {
    await crmAuthedFetch(`/api/clients/${encodeURIComponent(clientId)}/siblings`, {
      method: "POST",
      body: JSON.stringify({ siblingId })
    });
  }
  for (const siblingId of removals) {
    await crmAuthedFetch(`/api/clients/${encodeURIComponent(clientId)}/siblings/${encodeURIComponent(siblingId)}`, {
      method: "DELETE"
    });
  }
}

async function syncCrmReferralSiblings(referralId, previousIds, selectedIds) {
  const { additions, removals } = crmSiblingChanges(previousIds, selectedIds);

  for (const siblingId of additions) {
    await crmAuthedFetch(`/api/referrals/${encodeURIComponent(referralId)}/siblings`, {
      method: "POST",
      body: JSON.stringify({ siblingId })
    });
  }
  for (const siblingId of removals) {
    await crmAuthedFetch(`/api/referrals/${encodeURIComponent(referralId)}/siblings/${encodeURIComponent(siblingId)}`, {
      method: "DELETE"
    });
  }
}

async function saveCrmClient(form) {
  if (crmActionBusy) return;
  const item = crmAllItems.find((candidate) => candidate.id === crmEditingClientId) || null;
  const notesOnly = form.dataset.crmNotesOnly === "true";
  const values = Object.fromEntries(new FormData(form).entries());
  const selectedSiblingIds = new FormData(form).getAll("siblingIds");
  const previousSiblingIds = Array.isArray(item?.source?.siblingIds) ? item.source.siblingIds : [];
  const payload = notesOnly
    ? { notes: values.notes || "" }
    : crmClientPayload({
        ...values,
        ycco: form.elements.ycco?.checked ?? false,
        hrsn: form.elements.hrsn?.checked ?? false,
        emailOptOut: form.elements.emailOptOut?.checked ?? false,
        textOptOut: form.elements.textOptOut?.checked ?? false
      });

  setCrmActionBusy(true);
  setCrmActionStatus("");
  try {
    const result = await crmAuthedFetch(item ? `/api/clients/${encodeURIComponent(item.id)}` : "/api/clients", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    const savedId = result.client?.id || item?.id;
    if (!notesOnly && savedId) {
      await syncCrmSiblings(savedId, previousSiblingIds, selectedSiblingIds);
    }
    selectedItemId = savedId || selectedItemId;
    crmEditingClientId = "";
    crmEditorKind = "";
    await loadCrmData(crmCurrentUser, selectedItemId);
    setCrmPanelMode("detail");
  } catch (error) {
    console.error(error);
    setCrmActionStatus(error.message || "Could not save the client.", "error");
  } finally {
    setCrmActionBusy(false);
  }
}

async function saveCrmReferral(form) {
  if (crmActionBusy) return;
  const item = crmReferralItems.find((candidate) => candidate.id === crmEditingReferralId) || null;
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());
  const selectedSiblingIds = formData.getAll("siblingIds");
  const previousSiblingIds = Array.isArray(item?.source?.siblingIds) ? item.source.siblingIds : [];
  const providerLinks = crmReferralProviderLinks(
    formData.getAll("providerIds"),
    crmRawNetworkEntries,
    formData.get("providerOrganizationId")
  );
  const payload = crmReferralPayload({
    ...values,
    ycco: form.elements.ycco?.checked ?? false,
    hrsn: form.elements.hrsn?.checked ?? false,
    emailOptOut: form.elements.emailOptOut?.checked ?? false,
    textOptOut: form.elements.textOptOut?.checked ?? false,
    providerLinks
  });

  setCrmActionBusy(true);
  setCrmActionStatus("");
  try {
    let outreachLinkWarning = "";
    const result = await crmAuthedFetch(item ? `/api/referrals/${encodeURIComponent(item.id)}` : "/api/referrals", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    const savedId = result.referral?.id || item?.id;
    if (savedId) {
      await syncCrmReferralSiblings(savedId, previousSiblingIds, selectedSiblingIds);
    }
    if (savedId && crmOutreachContactId) {
      try {
        await crmAuthedFetch(`/api/outreach-contacts/${encodeURIComponent(crmOutreachContactId)}/link-referral`, {
          method: "PATCH",
          body: JSON.stringify({ referralId: savedId })
        });
      } catch (error) {
        console.error(error);
        outreachLinkWarning = "Referral saved, but its Outreach contact link could not be updated. Do not create the referral again.";
      }
      crmOutreachContactId = "";
    }
    selectedItemId = savedId || selectedItemId;
    crmEditingReferralId = "";
    crmEditorKind = "";
    await loadCrmData(crmCurrentUser, selectedItemId);
    setCrmPanelMode("detail");
    if (outreachLinkWarning) setCrmActionStatus(outreachLinkWarning, "error");
  } catch (error) {
    console.error(error);
    setCrmActionStatus(error.message || "Could not save the referral.", "error");
  } finally {
    setCrmActionBusy(false);
  }
}

async function saveCrmNetwork(form) {
  if (crmActionBusy) return;
  const item = crmNetworkItems.find((candidate) => candidate.id === crmEditingNetworkId) || null;
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());
  const providers = [...form.querySelectorAll("[data-crm-provider-row]")].map((row) => ({
    id: row.querySelector("[name='providerId']")?.value || "",
    name: row.querySelector("[name='providerName']")?.value || "",
    email: row.querySelector("[name='providerEmail']")?.value || "",
    notes: row.querySelector("[name='providerNotes']")?.value || ""
  }));
  const payload = crmNetworkPayload({ ...values, providers });

  setCrmActionBusy(true);
  setCrmActionStatus("");
  try {
    const result = await crmAuthedFetch(item ? `/api/referral-network/${encodeURIComponent(item.id)}` : "/api/referral-network", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    selectedItemId = result.entry?.id || item?.id || selectedItemId;
    crmEditingNetworkId = "";
    crmEditorKind = "";
    await loadCrmData(crmCurrentUser, selectedItemId);
    setCrmPanelMode("detail");
  } catch (error) {
    console.error(error);
    setCrmActionStatus(error.message || "Could not save the organization.", "error");
  } finally {
    setCrmActionBusy(false);
  }
}

async function saveCrmActivity(form) {
  const editingId = crmSubpage === "Referrals" ? crmEditingReferralId : crmEditingClientId;
  const item = crmAllItems.find((candidate) => candidate.id === editingId);
  if (!item || crmActionBusy) return;
  const values = Object.fromEntries(new FormData(form).entries());
  const type = form.dataset.activityType || "Call";
  const payload = crmSubpage === "Referrals"
    ? crmReferralActivityPayload(values, item, type)
    : crmActivityPayload(values, item, type);

  setCrmActionBusy(true);
  setCrmActionStatus("");
  try {
    await crmAuthedFetch("/api/activity-logs", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    selectedItemId = item.id;
    crmDetailTab = crmSubpage === "Referrals" ? "activity" : "notes";
    crmEditingClientId = "";
    crmEditingReferralId = "";
    crmEditorKind = "";
    await loadCrmData(crmCurrentUser);
    setCrmPanelMode("detail");
    setCrmDetailTab(crmDetailTab);
  } catch (error) {
    console.error(error);
    setCrmActionStatus(error.message || `Could not save the ${type.toLowerCase()}.`, "error");
  } finally {
    setCrmActionBusy(false);
  }
}

async function saveCrmStatus(item, status, control) {
  if (!item || crmActionBusy || status === item.status) return;
  const previousStatus = item.status;
  setCrmActionBusy(true);
  setCrmActionStatus("");

  try {
    const path = crmSubpage === "Referrals"
      ? `/api/referrals/${encodeURIComponent(item.id)}`
      : `/api/clients/${encodeURIComponent(item.id)}`;
    await crmAuthedFetch(path, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    selectedItemId = item.id;
    await loadCrmData(crmCurrentUser);
  } catch (error) {
    console.error(error);
    if (control) control.value = previousStatus;
    setCrmActionStatus(error.message || "Could not update the client status.", "error");
  } finally {
    setCrmActionBusy(false);
  }
}

async function saveCrmLesson(item, lessonValue) {
  if (!item || crmActionBusy || !lessonValue || crmLessonIsCurrent(item.source?.currentLesson, lessonValue)) return;
  setCrmActionBusy(true);
  setCrmActionStatus("");

  try {
    await crmAuthedFetch(`/api/clients/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify({ currentLesson: lessonValue })
    });
    selectedItemId = item.id;
    await loadCrmData(crmCurrentUser);
  } catch (error) {
    console.error(error);
    setCrmActionStatus(error.message || "Could not update lesson progression.", "error");
  } finally {
    setCrmActionBusy(false);
  }
}

function resetCrmCloseAction() {
  crmClosePendingId = "";
  const button = document.querySelector("[data-crm-action='close-client']");
  if (button) {
    button.textContent = "Close Client";
  }
  setCrmActionStatus("");
}

async function closeCrmClient(item) {
  if (!item || crmActionBusy) return;
  const button = document.querySelector("[data-crm-action='close-client']");
  const decision = crmCloseDecision(crmClosePendingId, item.id);
  crmClosePendingId = decision.pendingId;
  if (!decision.shouldClose) {
    if (button) button.textContent = "Confirm Close";
    setCrmActionStatus("Click Confirm Close to mark this client closed.");
    return;
  }

  resetCrmCloseAction();
  await saveCrmStatus(item, "Closed");
}

function resetCrmProtectedActions() {
  crmDeletePendingId = "";
  crmConvertPendingId = "";
  setCrmActionStatus("");
  updateCrmActionAvailability();
}

async function deleteCrmEntity(item) {
  if (!item || crmActionBusy || crmSubpage === "Clients") return;
  const decision = crmConfirmDecision(crmDeletePendingId, item.id);
  crmDeletePendingId = decision.pendingId;
  if (!decision.confirmed) {
    setCrmActionStatus(`Click Confirm Delete to permanently remove this ${crmSubpage === "Referrals" ? "referral" : "organization"}.`);
    updateCrmActionAvailability(item);
    return;
  }

  setCrmActionBusy(true);
  setCrmActionStatus("");
  try {
    const path = crmSubpage === "Referrals"
      ? `/api/referrals/${encodeURIComponent(item.id)}`
      : `/api/referral-network/${encodeURIComponent(item.id)}`;
    await crmAuthedFetch(path, { method: "DELETE" });
    selectedItemId = "";
    crmDeletePendingId = "";
    await loadCrmData(crmCurrentUser);
  } catch (error) {
    console.error(error);
    setCrmActionStatus(error.message || "Could not delete this record.", "error");
  } finally {
    setCrmActionBusy(false);
  }
}

function openCrmClientProfile(clientId) {
  if (!clientId) return;
  const query = new URLSearchParams({ client: clientId, section: "Clients" });
  location.href = `./crm.html?${query}`;
}

async function convertCrmReferral(item) {
  if (!item || crmActionBusy || crmSubpage !== "Referrals") return;
  if (item.convertedClientId) {
    openCrmClientProfile(item.convertedClientId);
    return;
  }

  const decision = crmConfirmDecision(crmConvertPendingId, item.id);
  crmConvertPendingId = decision.pendingId;
  if (!decision.confirmed) {
    setCrmActionStatus("Click Confirm Conversion to create a client profile from this referral.");
    updateCrmActionAvailability(item);
    return;
  }

  setCrmActionBusy(true);
  setCrmActionStatus("");
  try {
    const result = await crmAuthedFetch(`/api/referrals/${encodeURIComponent(item.id)}/convert`, {
      method: "POST",
      body: JSON.stringify({})
    });
    crmConvertPendingId = "";
    if (result.client?.id) {
      openCrmClientProfile(result.client.id);
      return;
    }
    await loadCrmData(crmCurrentUser);
  } catch (error) {
    console.error(error);
    setCrmActionStatus(error.message || "Could not convert this referral.", "error");
  } finally {
    setCrmActionBusy(false);
  }
}

function applyCrmSearch(module, query = crmSearchQuery) {
  crmSearchQuery = query;
  module.items = crmAllItems.filter((item) => crmCurrentMatcher(item, crmSearchQuery));
  module.summary = crmCurrentSummary(crmAllItems);
  crmDataMessage = module.items.length
    ? ""
    : crmAllItems.length
      ? `No ${crmSubpage.toLowerCase()} match this search.`
      : crmEmptyMessage();
  refreshStandardModuleData(module);
  setCrmDetailTab(crmDetailTab);
}

function openCrmAppointment(item) {
  if (!item) return;
  location.href = crmAppointmentUrl(item);
}

function openCrmNewAppointment(item) {
  if (!item) return;
  location.href = crmNewAppointmentUrl(item);
}

function renderRescheduleDialog() {
  return `
    <dialog class="schedule-dialog" data-reschedule-dialog>
      <form class="schedule-dialog-form" data-reschedule-form>
        <div class="schedule-dialog-heading">
          <div>
            <span>Reschedule</span>
            <h2 data-reschedule-title>Appointment</h2>
          </div>
          <button class="schedule-dialog-close" data-close-reschedule type="button" aria-label="Close">&times;</button>
        </div>
        <div class="schedule-dialog-fields">
          <label>
            <span>Date</span>
            <input data-reschedule-date type="date" required>
          </label>
          <label>
            <span>Time</span>
            <input data-reschedule-time type="time" step="900" required>
          </label>
          <label>
            <span>Staff</span>
            <select data-reschedule-staff required>
              <option value="Cynthia Esparza">Cynthia Esparza</option>
              <option value="Shannon Oddo">Shannon Oddo</option>
            </select>
          </label>
          <label class="is-full-width">
            <span>Notes</span>
            <textarea data-reschedule-notes rows="3"></textarea>
          </label>
        </div>
        <p class="schedule-dialog-status" data-reschedule-status role="status" aria-live="polite"></p>
        <div class="schedule-dialog-actions">
          <button data-close-reschedule type="button">Cancel</button>
          <button class="is-primary" data-save-reschedule type="submit">Save Appointment</button>
        </div>
      </form>
    </dialog>
  `;
}

function renderNewAppointmentPanel() {
  return `
    <aside class="detail-side schedule-new-appointment-side" data-new-appointment-side hidden>
      <div class="status-line is-module-status">
        <span class="status-dot"></span>
        <span data-new-appointment-side-status>Scheduled</span>
      </div>
      <h2>New Appointment</h2>
      <div class="meta-list appointment-meta">
        <div class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.calendar}</span>
          <strong data-new-appointment-side-date></strong>
        </div>
        <div class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.clock}</span>
          <strong data-new-appointment-side-time>Choose time</strong>
        </div>
        <div class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.file}</span>
          <strong data-new-appointment-side-type>Enrollment</strong>
        </div>
      </div>
    </aside>
    <div class="detail-main schedule-new-appointment-main" data-new-appointment-main hidden>
      <form class="schedule-inline-form" data-new-appointment-form>
        <div class="schedule-inline-form-header">
          <h3>Appointment</h3>
          <button data-close-new-appointment type="button">Cancel</button>
        </div>
        <div class="schedule-inline-fields">
          <div class="schedule-dialog-field is-full-width">
            <span>Clients</span>
            <div class="schedule-client-picker">
              <div class="schedule-client-search-row">
                <input
                  data-new-appointment-client-search
                  type="search"
                  placeholder="Start typing a client name"
                  autocomplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-controls="new-appointment-client-options"
                  aria-expanded="false"
                >
                <button data-add-new-appointment-client type="button">Add</button>
              </div>
              <div
                class="schedule-client-options"
                id="new-appointment-client-options"
                data-new-appointment-client-options
                role="listbox"
                hidden
              ></div>
            </div>
            <div class="schedule-selected-clients" data-new-appointment-selected-clients aria-live="polite"></div>
          </div>
          <label>
            <span>Status</span>
            <select name="status" data-new-appointment-status-select required>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="No-show">No-show</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </label>
          <label>
            <span>Date</span>
            <input name="appointmentDate" data-new-appointment-date type="date" required>
          </label>
          <label>
            <span>Time</span>
            <select name="appointmentTime" data-new-appointment-time required></select>
          </label>
          <label>
            <span>Appointment Type</span>
            <select name="serviceId" data-new-appointment-service required>
              ${newAppointmentServices.map((service) => `
                <option value="${escapeHtml(service.id)}">${escapeHtml(service.label)}</option>
              `).join("")}
            </select>
          </label>
          <label>
            <span>Staff</span>
            <select name="staffMember" data-new-appointment-staff required>
              <option value="Cynthia Esparza">Cynthia Esparza</option>
              <option value="Shannon Oddo">Shannon Oddo</option>
            </select>
          </label>
          <label data-new-appointment-lesson-field hidden>
            <span>Lesson</span>
            <select name="lesson" data-new-appointment-lesson>
              <option value="">Choose lesson</option>
              <option value="Nutrient Density">Nutrient Density</option>
              <option value="Sugar">Sugar</option>
              <option value="Food Groups">Food Groups</option>
              <option value="Macronutrients">Macronutrients</option>
              <option value="Micronutrients">Micronutrients</option>
              <option value="Mindful Eating">Mindful Eating</option>
              <option value="Healthy Habits">Healthy Habits</option>
            </select>
          </label>
          <label class="is-full-width" data-new-appointment-goal-field hidden>
            <span>Goal</span>
            <input name="goal" data-new-appointment-goal type="text">
          </label>
          <label class="is-full-width">
            <span>Notes</span>
            <textarea name="notes" data-new-appointment-notes rows="3"></textarea>
          </label>
        </div>
        <p class="schedule-dialog-status" data-new-appointment-status role="status" aria-live="polite"></p>
        <div class="schedule-inline-actions">
          <button class="is-primary" data-save-new-appointment type="submit">Save Appointment</button>
        </div>
      </form>
    </div>
  `;
}

function renderBlockTimePanel() {
  return `
    <aside class="detail-side schedule-new-appointment-side" data-block-time-side hidden>
      <div class="status-line is-module-status">
        <span class="status-dot"></span>
        <span>Blocked</span>
      </div>
      <h2 data-block-time-side-title>Block Time</h2>
      <div class="meta-list appointment-meta">
        <div class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.calendar}</span>
          <strong data-block-time-side-date></strong>
        </div>
        <div class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.clock}</span>
          <strong data-block-time-side-time>Choose time</strong>
        </div>
        <div class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.crm}</span>
          <strong data-block-time-side-staff>Cynthia Esparza</strong>
        </div>
      </div>
    </aside>
    <div class="detail-main schedule-new-appointment-main" data-block-time-main hidden>
      <form class="schedule-inline-form" data-block-time-form>
        <div class="schedule-inline-form-header">
          <h3 data-block-time-form-title>Blocked Time</h3>
          <button data-close-block-time type="button">Cancel</button>
        </div>
        <div class="schedule-inline-fields">
          <label>
            <span>Status</span>
            <select disabled>
              <option selected>Blocked</option>
            </select>
          </label>
          <label>
            <span>Date</span>
            <input name="appointmentDate" data-block-time-date type="date" required>
          </label>
          <label>
            <span>Start Time</span>
            <select name="appointmentTime" data-block-time-time required></select>
          </label>
          <label>
            <span>End Time</span>
            <select name="endTime" data-block-time-end-time required></select>
          </label>
          <label>
            <span>Staff</span>
            <select name="staffMember" data-block-time-staff required>
              <option value="Cynthia Esparza">Cynthia Esparza</option>
              <option value="Shannon Oddo">Shannon Oddo</option>
            </select>
          </label>
          <label class="is-full-width">
            <span>Notes</span>
            <textarea name="notes" data-block-time-notes rows="3">Blocked time</textarea>
          </label>
        </div>
        <p class="schedule-dialog-status" data-block-time-status role="status" aria-live="polite"></p>
        <div class="schedule-inline-actions">
          <button class="is-primary" data-save-block-time type="submit">Save Block</button>
        </div>
      </form>
    </div>
  `;
}

function renderBlockedTimeDetail() {
  return `
    <div class="detail-main schedule-blocked-detail-main" data-blocked-detail-main hidden>
      <div class="tabs" role="tablist" aria-label="Blocked time details">
        <button class="is-active" type="button">
          <span class="detail-tab-icon">${icons.clock}</span>
          <span>Details</span>
        </button>
      </div>
      <section class="detail-card">
        <div class="card-heading">
          <h3>Blocked Time</h3>
        </div>
        <div class="field-grid">
          <div class="field"><span>Date</span><strong data-block-detail-date></strong></div>
          <div class="field"><span>Staff</span><strong data-block-detail-staff></strong></div>
          <div class="field"><span>Start Time</span><strong data-block-detail-start></strong></div>
          <div class="field"><span>End Time</span><strong data-block-detail-end></strong></div>
          <div class="field"><span>Duration</span><strong data-block-detail-duration></strong></div>
          <div class="field"><span>Notes</span><strong data-block-detail-notes></strong></div>
        </div>
      </section>
      <p class="schedule-action-status" data-block-action-status role="status" aria-live="polite"></p>
      <div class="footer-actions schedule-blocked-actions">
        <button data-edit-block-time type="button">Edit Block</button>
        <button data-delete-block-time type="button">Delete Block</button>
      </div>
    </div>
  `;
}

function setSchedulePanelMode(mode = "detail") {
  schedulePanelMode = mode;
  const standardSide = document.querySelector("[data-standard-detail-side]");
  const standardMain = document.querySelector("[data-standard-detail-main]");
  const standardFamily = document.querySelector("[data-standard-family]");
  const blockedDetailMain = document.querySelector("[data-blocked-detail-main]");
  const newSide = document.querySelector("[data-new-appointment-side]");
  const newMain = document.querySelector("[data-new-appointment-main]");
  const blockSide = document.querySelector("[data-block-time-side]");
  const blockMain = document.querySelector("[data-block-time-main]");
  const selectedItem = modules.schedule.items.find((item) => item.id === selectedItemId);
  const selectedIsBlocked = selectedItem?.status === "Blocked";

  if (standardSide) standardSide.hidden = mode !== "detail";
  if (standardMain) standardMain.hidden = mode !== "detail" || selectedIsBlocked;
  if (standardFamily) standardFamily.hidden = mode !== "detail" || selectedIsBlocked;
  if (blockedDetailMain) blockedDetailMain.hidden = mode !== "detail" || !selectedIsBlocked;
  if (newSide) newSide.hidden = mode !== "new";
  if (newMain) newMain.hidden = mode !== "new";
  if (blockSide) blockSide.hidden = mode !== "block";
  if (blockMain) blockMain.hidden = mode !== "block";
}

function setNewAppointmentPanelOpen(open) {
  setSchedulePanelMode(open ? "new" : "detail");
}

function setNewAppointmentStatus(message) {
  const status = document.querySelector("[data-new-appointment-status]");
  if (status) {
    status.textContent = message;
  }
}

function scheduleClientSearchText(client) {
  return [clientFullName(client), client?.parentName, client?.phone, client?.email]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function renderNewAppointmentClientOptions(query = "") {
  const options = document.querySelector("[data-new-appointment-client-options]");
  const search = document.querySelector("[data-new-appointment-client-search]");
  if (!options || !search) {
    return;
  }

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    options.replaceChildren();
    options.hidden = true;
    search.setAttribute("aria-expanded", "false");
    return;
  }

  const matches = scheduleClients
    .filter((client) => !newAppointmentClientIds.has(client.id))
    .filter((client) => scheduleClientSearchText(client).includes(normalizedQuery))
    .slice(0, 8);

  options.replaceChildren(...matches.map((client) => {
    const button = document.createElement("button");
    const name = document.createElement("strong");
    const detail = document.createElement("span");

    button.type = "button";
    button.dataset.newAppointmentClientOption = client.id;
    button.setAttribute("role", "option");
    name.textContent = clientFullName(client);
    detail.textContent = client.parentName ? `Caregiver: ${client.parentName}` : "";
    button.append(name, detail);
    return button;
  }));

  options.hidden = !matches.length;
  search.setAttribute("aria-expanded", String(Boolean(matches.length)));
}

function renderNewAppointmentSelectedClients() {
  const selected = document.querySelector("[data-new-appointment-selected-clients]");
  if (!selected) {
    return;
  }

  const clients = [...newAppointmentClientIds]
    .map((clientId) => scheduleClientsById.get(clientId))
    .filter(Boolean);

  if (!clients.length) {
    const empty = document.createElement("span");
    empty.className = "schedule-selected-clients-empty";
    empty.textContent = "No clients selected.";
    selected.replaceChildren(empty);
    return;
  }

  selected.replaceChildren(...clients.map((client) => {
    const chip = document.createElement("span");
    const name = document.createElement("span");
    const remove = document.createElement("button");

    chip.className = "schedule-client-chip";
    name.textContent = clientFullName(client);
    remove.type = "button";
    remove.dataset.removeNewAppointmentClient = client.id;
    remove.setAttribute("aria-label", `Remove ${clientFullName(client)}`);
    remove.textContent = "×";
    chip.append(name, remove);
    return chip;
  }));
}

function addNewAppointmentClient(clientId) {
  if (!scheduleClientsById.has(clientId)) {
    return;
  }

  newAppointmentClientIds.add(clientId);
  const search = document.querySelector("[data-new-appointment-client-search]");
  if (search) {
    search.value = "";
  }
  renderNewAppointmentSelectedClients();
  const options = document.querySelector("[data-new-appointment-client-options]");
  if (options) {
    options.hidden = true;
  }
  search?.setAttribute("aria-expanded", "false");
  setNewAppointmentStatus("");
}

function removeNewAppointmentClient(clientId) {
  newAppointmentClientIds.delete(clientId);
  renderNewAppointmentSelectedClients();
  const search = document.querySelector("[data-new-appointment-client-search]");
  renderNewAppointmentClientOptions(search?.value || "");
}

function syncNewAppointmentServiceFields() {
  const serviceSelect = document.querySelector("[data-new-appointment-service]");
  const lessonField = document.querySelector("[data-new-appointment-lesson-field]");
  const goalField = document.querySelector("[data-new-appointment-goal-field]");
  const lesson = document.querySelector("[data-new-appointment-lesson]");
  const goal = document.querySelector("[data-new-appointment-goal]");
  const service = newAppointmentService(serviceSelect?.value);
  const showLessonFields = service.appointmentType === "Nutrition Education";

  if (lessonField) lessonField.hidden = !showLessonFields;
  if (goalField) goalField.hidden = !showLessonFields;
  if (lesson) lesson.disabled = !showLessonFields;
  if (goal) goal.disabled = !showLessonFields;
  if (!showLessonFields) {
    if (lesson) lesson.value = "";
    if (goal) goal.value = "";
  }
  syncNewAppointmentSummary();
}

function syncNewAppointmentSummary() {
  const date = document.querySelector("[data-new-appointment-date]")?.value || scheduleVisibleDate;
  const time = document.querySelector("[data-new-appointment-time]")?.value || "";
  const status = document.querySelector("[data-new-appointment-status-select]")?.value || "Scheduled";
  const service = newAppointmentService(document.querySelector("[data-new-appointment-service]")?.value);
  const dateSummary = document.querySelector("[data-new-appointment-side-date]");
  const timeSummary = document.querySelector("[data-new-appointment-side-time]");
  const typeSummary = document.querySelector("[data-new-appointment-side-type]");
  const statusSummary = document.querySelector("[data-new-appointment-side-status]");

  if (dateSummary) dateSummary.textContent = date ? formatAppointmentDate(date) : "Choose date";
  if (timeSummary) timeSummary.textContent = time ? formatScheduleTime(scheduleTimeMinutes(time)) : "Choose time";
  if (typeSummary) typeSummary.textContent = service.appointmentType;
  if (statusSummary) statusSummary.textContent = status;
}

function renderNewAppointmentTimeOptions(selectedTime = "") {
  const timeSelect = document.querySelector("[data-new-appointment-time]");
  const serviceSelect = document.querySelector("[data-new-appointment-service]");
  if (!timeSelect) {
    return;
  }

  const service = newAppointmentService(serviceSelect?.value);
  const times = scheduleTimeOptions(scheduleSettings, service.durationMinutes);
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose time";
  timeSelect.replaceChildren(placeholder, ...times.map((time) => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = formatScheduleTime(scheduleTimeMinutes(time));
    return option;
  }));
  timeSelect.value = times.includes(selectedTime) ? selectedTime : "";
  syncNewAppointmentSummary();
}

function openNewAppointmentPanel(preselectedClientIds = []) {
  const form = document.querySelector("[data-new-appointment-form]");
  if (!form || scheduleActionBusy) {
    return;
  }

  if (!scheduleCurrentUser || scheduleDataState !== "ready") {
    setScheduleActionStatus("Sign in and load the schedule before creating an appointment.", "error");
    return;
  }

  form.reset();
  newAppointmentClientIds.clear();
  preselectedClientIds
    .filter((clientId) => scheduleClientsById.has(clientId))
    .forEach((clientId) => newAppointmentClientIds.add(clientId));
  form.querySelector("[data-new-appointment-date]").value = scheduleVisibleDate;
  form.querySelector("[data-new-appointment-service]").value = "enrollment";
  form.querySelector("[data-new-appointment-status-select]").value = "Scheduled";
  form.querySelector("[data-new-appointment-staff]").value = "Cynthia Esparza";
  setNewAppointmentStatus("");
  renderNewAppointmentSelectedClients();
  renderNewAppointmentClientOptions("");
  syncNewAppointmentServiceFields();
  renderNewAppointmentTimeOptions();
  setNewAppointmentPanelOpen(true);
  syncNewAppointmentSummary();
  form.querySelector("[data-new-appointment-client-search]")?.focus();
}

function closeNewAppointmentPanel() {
  if (!scheduleActionBusy) {
    setNewAppointmentPanelOpen(false);
  }
}

async function saveNewAppointment(module, form) {
  if (scheduleActionBusy) {
    return;
  }

  const values = Object.fromEntries(new FormData(form).entries());
  const selectedClients = [...newAppointmentClientIds]
    .map((clientId) => scheduleClientsById.get(clientId))
    .filter(Boolean);

  if (!selectedClients.length) {
    setNewAppointmentStatus("Select at least one existing client.");
    form.querySelector("[data-new-appointment-client-search]")?.focus();
    return;
  }

  if (!values.appointmentDate || !values.appointmentTime || !values.staffMember) {
    setNewAppointmentStatus("Add the date, time, and staff member.");
    return;
  }

  const payload = newAppointmentPayload(values, selectedClients);
  const saveButton = form.querySelector("[data-save-new-appointment]");
  setNewAppointmentStatus("");
  saveButton.disabled = true;
  setScheduleActionBusy(true);

  try {
    const result = await scheduleAuthedFetch("/api/appointments", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const createdItem = mapAppointment(result.appointment || payload, scheduleClientsById);

    await updateScheduleClients(module, createdItem, payload.status).catch((error) => {
      console.error("The appointment was saved, but the client status could not be updated.", error);
    });

    scheduleVisibleDate = payload.appointmentDate;
    selectedItemId = result.appointment?.id || "";
    await loadScheduleData(scheduleCurrentUser);
    setNewAppointmentPanelOpen(false);
    setScheduleActionStatus("");
  } catch (error) {
    console.error(error);
    setNewAppointmentStatus(error.message || "Could not save appointment.");
  } finally {
    saveButton.disabled = false;
    setScheduleActionBusy(false);
  }
}

function setBlockTimeStatus(message) {
  const status = document.querySelector("[data-block-time-status]");
  if (status) {
    status.textContent = message;
  }
}

function syncBlockTimeSummary() {
  const date = document.querySelector("[data-block-time-date]")?.value || scheduleVisibleDate;
  const startTime = document.querySelector("[data-block-time-time]")?.value || "";
  const endTime = document.querySelector("[data-block-time-end-time]")?.value || "";
  const staff = document.querySelector("[data-block-time-staff]")?.value || "Cynthia Esparza";
  const dateSummary = document.querySelector("[data-block-time-side-date]");
  const timeSummary = document.querySelector("[data-block-time-side-time]");
  const staffSummary = document.querySelector("[data-block-time-side-staff]");

  if (dateSummary) dateSummary.textContent = date ? formatAppointmentDate(date) : "Choose date";
  if (timeSummary) {
    const startLabel = startTime ? formatScheduleTime(scheduleTimeMinutes(startTime)) : "";
    const endLabel = endTime ? formatScheduleTime(scheduleTimeMinutes(endTime)) : "";
    timeSummary.textContent = startLabel && endLabel ? `${startLabel} - ${endLabel}` : startLabel || "Choose time";
  }
  if (staffSummary) staffSummary.textContent = staff;
}

function renderBlockTimeEndTimeOptions(selectedEndTime = "") {
  const startTime = document.querySelector("[data-block-time-time]")?.value || "";
  const endTimeSelect = document.querySelector("[data-block-time-end-time]");
  if (!endTimeSelect) {
    return;
  }

  const times = blockTimeEndOptions(startTime, scheduleSettings);
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose end time";
  endTimeSelect.replaceChildren(placeholder, ...times.map((time) => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = formatScheduleTime(scheduleTimeMinutes(time));
    return option;
  }));

  const startMinutes = scheduleTimeMinutes(startTime);
  const thirtyMinuteEnd = times.find((time) => scheduleTimeMinutes(time) - startMinutes === 30);
  endTimeSelect.value = times.includes(selectedEndTime) ? selectedEndTime : thirtyMinuteEnd || times[0] || "";
  syncBlockTimeSummary();
}

function renderBlockTimeOptions(selectedTime = "", selectedEndTime = "") {
  const timeSelect = document.querySelector("[data-block-time-time]");
  if (!timeSelect) {
    return;
  }

  const times = scheduleTimeOptions(scheduleSettings, 15);
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose time";
  timeSelect.replaceChildren(placeholder, ...times.map((time) => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = formatScheduleTime(scheduleTimeMinutes(time));
    return option;
  }));
  timeSelect.value = times.includes(selectedTime) ? selectedTime : "";
  renderBlockTimeEndTimeOptions(selectedEndTime);
}

function openBlockTimePanel(item = null) {
  const form = document.querySelector("[data-block-time-form]");
  if (!form || scheduleActionBusy) {
    return;
  }

  if (!scheduleCurrentUser || scheduleDataState !== "ready") {
    setScheduleActionStatus("Sign in and load the schedule before blocking time.", "error");
    return;
  }

  form.reset();
  blockTimeEditingId = item?.id || "";
  form.querySelector("[data-block-time-date]").value = item?.date || scheduleVisibleDate;
  form.querySelector("[data-block-time-staff]").value = item?.staff && item.staff !== "-" ? item.staff : "Cynthia Esparza";
  form.querySelector("[data-block-time-notes]").value = item?.notes && item.notes !== "-" ? item.notes : "Blocked time";
  document.querySelector("[data-block-time-side-title]").textContent = item ? "Edit Block Time" : "Block Time";
  document.querySelector("[data-block-time-form-title]").textContent = item ? "Edit Blocked Time" : "Blocked Time";
  form.querySelector("[data-save-block-time]").textContent = item ? "Update Block" : "Save Block";
  setBlockTimeStatus("");
  renderBlockTimeOptions(item?.time || "", item?.endTime || "");
  setSchedulePanelMode("block");
  syncBlockTimeSummary();
  form.querySelector("[data-block-time-time]")?.focus();
}

function closeBlockTimePanel() {
  if (!scheduleActionBusy) {
    blockTimeEditingId = "";
    setSchedulePanelMode("detail");
  }
}

async function saveBlockTime(module, form) {
  if (scheduleActionBusy) {
    return;
  }

  const values = Object.fromEntries(new FormData(form).entries());
  if (!values.appointmentDate || !values.appointmentTime || !values.endTime || !values.staffMember) {
    setBlockTimeStatus("Add the date, start time, end time, and staff member.");
    return;
  }

  const payload = blockTimePayload(values);
  const saveButton = form.querySelector("[data-save-block-time]");
  setBlockTimeStatus("");
  saveButton.disabled = true;
  setScheduleActionBusy(true);

  try {
    const endpoint = blockTimeEditingId
      ? `/api/appointments/${encodeURIComponent(blockTimeEditingId)}`
      : "/api/appointments";
    const result = await scheduleAuthedFetch(endpoint, {
      method: blockTimeEditingId ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });

    scheduleVisibleDate = payload.appointmentDate;
    selectedItemId = result.appointment?.id || blockTimeEditingId;
    await loadScheduleData(scheduleCurrentUser);
    blockTimeEditingId = "";
    setSchedulePanelMode("detail");
    setScheduleActionStatus("");
  } catch (error) {
    console.error(error);
    setBlockTimeStatus(error.message || "Could not save blocked time.");
  } finally {
    saveButton.disabled = false;
    setScheduleActionBusy(false);
  }
}

function setBlockActionStatus(message, state = "") {
  const status = document.querySelector("[data-block-action-status]");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.dataset.state = state;
}

function setBlockDeletePending(pending) {
  const editButton = document.querySelector("[data-edit-block-time]");
  const deleteButton = document.querySelector("[data-delete-block-time]");
  blockTimeDeletePendingId = pending ? selectedItemId : "";
  if (editButton) editButton.textContent = pending ? "Cancel" : "Edit Block";
  if (deleteButton) deleteButton.textContent = pending ? "Confirm Delete" : "Delete Block";
  setBlockActionStatus(
    pending ? "Delete this blocked time? This cannot be undone." : "",
    pending ? "error" : ""
  );
}

async function deleteSelectedBlockTime(module) {
  const item = module.items.find((candidate) => candidate.id === selectedItemId);
  if (!item || item.status !== "Blocked" || scheduleActionBusy) {
    return;
  }

  if (blockTimeDeletePendingId !== item.id) {
    setBlockDeletePending(true);
    return;
  }

  setBlockDeletePending(false);
  setScheduleActionBusy(true);

  try {
    await scheduleAuthedFetch(`/api/appointments/${encodeURIComponent(item.id)}`, {
      method: "DELETE"
    });
    selectedItemId = "";
    await loadScheduleData(scheduleCurrentUser);
    setBlockActionStatus("");
  } catch (error) {
    console.error(error);
    setBlockActionStatus(error.message || "Could not delete blocked time.", "error");
  } finally {
    setScheduleActionBusy(false);
  }
}

function setAppointmentEditStatus(message, state = "") {
  const status = document.querySelector("[data-appointment-edit-status]");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.dataset.state = state;
}

function setAppointmentCancelPending(pending) {
  const cancelButton = document.querySelector("[data-cancel-appointment]");
  appointmentCancelPendingId = pending ? selectedItemId : "";
  if (cancelButton) {
    cancelButton.textContent = pending ? "Confirm Cancellation" : "Cancel Appointment";
  }
  setAppointmentEditStatus(
    pending ? "Cancel this appointment? It will be removed from the working schedule." : "",
    pending ? "error" : ""
  );
}

function setAppointmentEditOpen(open) {
  const view = document.querySelector("[data-appointment-details-view]");
  const form = document.querySelector("[data-appointment-edit-form]");
  if (view) view.hidden = open;
  if (form) form.hidden = !open;
  if (!open) {
    appointmentEditingId = "";
    setAppointmentCancelPending(false);
  }
}

function syncAppointmentEditTypeFields() {
  const form = document.querySelector("[data-appointment-edit-form]");
  if (!form) {
    return;
  }

  const isNutritionEducation = form.querySelector("[data-appointment-edit-type]")?.value === "Nutrition Education";
  const lessonField = form.querySelector("[data-appointment-edit-lesson-field]");
  const goalField = form.querySelector("[data-appointment-edit-goal-field]");
  const lesson = form.querySelector("[data-appointment-edit-lesson]");
  const goal = form.querySelector("[data-appointment-edit-goal]");
  if (lessonField) lessonField.hidden = !isNutritionEducation;
  if (goalField) goalField.hidden = !isNutritionEducation;
  if (lesson) lesson.disabled = !isNutritionEducation;
  if (goal) goal.disabled = !isNutritionEducation;
}

function openAppointmentEdit(module) {
  const item = module.items.find((candidate) => candidate.id === selectedItemId);
  const form = document.querySelector("[data-appointment-edit-form]");
  if (!item || item.status === "Blocked" || !form || scheduleActionBusy) {
    return;
  }

  form.reset();
  appointmentEditingId = item.id;
  form.querySelector("[data-appointment-edit-type]").value = item.type;
  const staff = form.querySelector("[data-appointment-edit-staff]");
  if (item.staff && item.staff !== "-" && ![...staff.options].some((option) => option.value === item.staff)) {
    staff.add(new Option(item.staff, item.staff));
  }
  staff.value = item.staff && item.staff !== "-" ? item.staff : "Cynthia Esparza";
  const lesson = form.querySelector("[data-appointment-edit-lesson]");
  if (item.lesson && item.lesson !== "-" && ![...lesson.options].some((option) => option.value === item.lesson)) {
    lesson.add(new Option(item.lesson, item.lesson));
  }
  lesson.value = item.lesson && item.lesson !== item.type && item.lesson !== "-" ? item.lesson : "";
  form.querySelector("[data-appointment-edit-goal]").value = item.goal === "-" ? "" : item.goal;
  form.querySelector("[data-appointment-edit-notes]").value = item.notes === "-" ? "" : item.notes;
  setAppointmentCancelPending(false);
  syncAppointmentEditTypeFields();
  setAppointmentEditOpen(true);
  form.querySelector("[data-appointment-edit-type]")?.focus();
}

function closeAppointmentEdit() {
  if (!scheduleActionBusy) {
    setAppointmentEditOpen(false);
  }
}

async function saveAppointmentEdit(module, form) {
  const item = module.items.find((candidate) => candidate.id === appointmentEditingId);
  if (!item || scheduleActionBusy) {
    return;
  }

  const payload = appointmentEditPayload(item, Object.fromEntries(new FormData(form).entries()));
  const saveButton = form.querySelector("[data-save-appointment-edit]");
  setAppointmentEditStatus("");
  saveButton.disabled = true;
  setScheduleActionBusy(true);

  try {
    await scheduleAuthedFetch(`/api/appointments/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    selectedItemId = item.id;
    appointmentEditingId = "";
    await loadScheduleData(scheduleCurrentUser);
    setAppointmentEditOpen(false);
  } catch (error) {
    console.error(error);
    setAppointmentEditStatus(error.message || "Could not save appointment changes.", "error");
  } finally {
    saveButton.disabled = false;
    setScheduleActionBusy(false);
  }
}

async function cancelSelectedAppointment(module) {
  const item = module.items.find((candidate) => candidate.id === appointmentEditingId);
  if (!item || item.status === "Blocked" || scheduleActionBusy) {
    return;
  }

  if (appointmentCancelPendingId !== item.id) {
    setAppointmentCancelPending(true);
    return;
  }

  setAppointmentCancelPending(false);
  setScheduleActionBusy(true);

  try {
    await scheduleAuthedFetch(`/api/appointments/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(appointmentStatusPayload(item, "Canceled"))
    });
    await updateScheduleClients(module, item, "Canceled");
    selectedItemId = "";
    appointmentEditingId = "";
    await loadScheduleData(scheduleCurrentUser);
    setAppointmentEditOpen(false);
  } catch (error) {
    console.error(error);
    setAppointmentEditStatus(error.message || "Could not cancel appointment.", "error");
  } finally {
    setScheduleActionBusy(false);
  }
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

function renderAppointmentDetailsCard(card) {
  return `
    <section class="detail-card appointment-details-card">
      <div data-appointment-details-view>
        <div class="card-heading">
          <h3>${card.title}</h3>
          <button class="edit-button" data-edit-appointment type="button">Edit</button>
        </div>
        <div class="field-grid appointment-details-fields">
          ${renderFields(card.fields)}
        </div>
      </div>
      <form class="appointment-edit-form" data-appointment-edit-form hidden>
        <div class="card-heading">
          <h3>${card.title}</h3>
          <button class="edit-button" data-close-appointment-edit type="button">Cancel</button>
        </div>
        <div class="appointment-edit-fields">
          <label>
            <span>Type</span>
            <select name="appointmentType" data-appointment-edit-type>
              <option value="Enrollment">Enrollment</option>
              <option value="Nutrition Education">Nutrition Education</option>
            </select>
          </label>
          <label>
            <span>Staff</span>
            <select name="staffMember" data-appointment-edit-staff>
              <option value="Cynthia Esparza">Cynthia Esparza</option>
              <option value="Shannon Oddo">Shannon Oddo</option>
            </select>
          </label>
          <label data-appointment-edit-lesson-field>
            <span>Lesson</span>
            <select name="lesson" data-appointment-edit-lesson>
              <option value="">Choose lesson</option>
              <option value="Nutrient Density">Nutrient Density</option>
              <option value="Sugar">Sugar</option>
              <option value="Food Groups">Food Groups</option>
              <option value="Macronutrients">Macronutrients</option>
              <option value="Micronutrients">Micronutrients</option>
              <option value="Mindful Eating">Mindful Eating</option>
              <option value="Healthy Habits">Healthy Habits</option>
            </select>
          </label>
          <label data-appointment-edit-goal-field>
            <span>Goal</span>
            <input name="goal" data-appointment-edit-goal type="text">
          </label>
          <label class="is-full-width">
            <span>Notes</span>
            <textarea name="notes" data-appointment-edit-notes rows="3"></textarea>
          </label>
        </div>
        <p class="appointment-edit-status" data-appointment-edit-status role="status" aria-live="polite"></p>
        <div class="appointment-edit-actions">
          <button class="is-danger" data-cancel-appointment type="button">Cancel Appointment</button>
          <button class="is-primary" data-save-appointment-edit type="submit">Save Changes</button>
        </div>
      </form>
    </section>
  `;
}

function renderCards(module) {
  return module.cards.map((card) => `
    ${module.label === "Schedule" && card.title === "Prep" ? renderPrepCard(card) : module.label === "Schedule" && card.title === "Details" ? renderAppointmentDetailsCard(card) : module.label === "CRM" && card.title === "Lesson Progression" ? renderCrmLessonProgression() : `<section class="detail-card">
      <div class="card-heading">
        <h3>${card.title}</h3>
        <button
          class="edit-button"
          ${module.label === "CRM" && card.title === "Client Details" ? "data-crm-edit-client" : ""}
          ${module.label === "CRM" && card.title === "Referral Details" ? "data-crm-edit-referral" : ""}
          ${module.label === "CRM" && card.title === "Organization Details" ? "data-crm-edit-network" : ""}
          type="button"
        >Edit</button>
      </div>
      <div class="field-grid${module.label === "CRM" ? " crm-client-detail-grid" : ""}">
        ${module.label === "CRM" ? renderCrmFields(card.fields) : renderFields(card.fields)}
      </div>
    </section>`}
  `).join("");
}

function renderCrmRelationshipField(field, item) {
  const key = field.dataset.field;
  const profiles = key === "siblings"
    ? item.siblingProfiles
    : key === "providerProfiles"
      ? item.providerProfileLinks
      : null;

  if (!profiles) {
    field.classList.remove("crm-profile-link-list");
    return false;
  }

  field.classList.add("crm-profile-link-list");
  field.replaceChildren();

  if (!profiles.length) {
    field.textContent = "-";
    return true;
  }

  profiles.forEach((profile) => {
    const label = profile.name || profile.label;
    if (!label) return;

    if (key === "siblings" && profile.id) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "crm-profile-link";
      button.dataset.crmRelatedId = profile.id;
      button.dataset.crmRelatedSection = profile.section || "Clients";
      button.textContent = label;
      field.append(button);
      return;
    }

    if (key === "providerProfiles" && profile.networkId) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "crm-profile-link";
      button.dataset.crmProviderNetworkId = profile.networkId;
      button.textContent = label;
      field.append(button);
      return;
    }

    const line = document.createElement("span");
    line.textContent = label;
    field.append(line);
  });

  return true;
}

function scheduleDetailTabKey(tab) {
  return String(tab || "")
    .toLowerCase()
    .replaceAll(" ", "-");
}

function renderWrapUpSelect(name, label, options, selectedValue) {
  return `
    <label>
      <span>${label}</span>
      <select name="${name}">
        ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === selectedValue ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderScheduleWrapUp(item) {
  const isCompleted = item.status === "Completed";
  const nextLesson = nextAppointmentLessonNumber(item);
  const nextLessonTitle = nextLesson ? appointmentLessonTitles[nextLesson] : "";
  const nextDate = defaultNextAppointmentDate(item);
  const nextTime = item.time || "";
  const timeOptions = scheduleTimeOptions(scheduleSettings, 30);
  if (nextTime && !timeOptions.includes(nextTime)) {
    timeOptions.push(nextTime);
    timeOptions.sort((first, second) => scheduleTimeMinutes(first) - scheduleTimeMinutes(second));
  }
  const staffOptions = ["Cynthia Esparza", "Shannon Oddo"];
  if (item.staff && !staffOptions.includes(item.staff)) {
    staffOptions.push(item.staff);
  }

  return `
    <form class="schedule-wrap-up-form" data-schedule-wrap-up-form>
      <section class="detail-card schedule-wrap-up-card">
        <div class="card-heading">
          <h3>Next Appointment</h3>
        </div>
        ${nextLesson ? `
          <label class="schedule-wrap-up-next-choice">
            <input type="checkbox" name="scheduleNext" data-wrap-up-schedule-next checked>
            <span>Schedule ${escapeHtml(nextLessonTitle)} next</span>
          </label>
          <div class="appointment-edit-fields" data-wrap-up-next-fields>
            <label>
              <span>Date</span>
              <input type="date" name="nextAppointmentDate" value="${escapeHtml(nextDate)}">
            </label>
            <label>
              <span>Time</span>
              <select name="nextAppointmentTime">
                ${timeOptions.map((time) => `<option value="${time}" ${time === nextTime ? "selected" : ""}>${formatScheduleTime(scheduleTimeMinutes(time))}</option>`).join("")}
              </select>
            </label>
            ${renderWrapUpSelect("nextAppointmentStaff", "Staff", staffOptions, item.staff)}
            <label>
              <span>Goal</span>
              <input type="text" name="nextAppointmentGoal">
            </label>
            <label class="is-full-width">
              <span>Notes</span>
              <textarea name="nextAppointmentNotes" rows="2"></textarea>
            </label>
          </div>
        ` : `<p class="schedule-wrap-up-finished">Program complete</p>`}
      </section>

      <section class="detail-card schedule-wrap-up-card">
        <div class="card-heading">
          <h3>Engagement</h3>
        </div>
        <div class="appointment-edit-fields">
          ${renderWrapUpSelect("caregiverMood", "Caregiver Mood", appointmentWrapUpOptions.caregiverMood, item.source?.caregiverMood || appointmentWrapUpDefaults.caregiverMood)}
          ${renderWrapUpSelect("confidence", "Confidence", appointmentWrapUpOptions.confidence, item.source?.confidence || appointmentWrapUpDefaults.confidence)}
          ${renderWrapUpSelect("participation", "Participation", appointmentWrapUpOptions.participation, item.source?.participation || appointmentWrapUpDefaults.participation)}
          ${renderWrapUpSelect("barriers", "Barriers", appointmentWrapUpOptions.barriers, item.source?.barriers || appointmentWrapUpDefaults.barriers)}
        </div>
      </section>

      <p class="schedule-action-status" data-schedule-wrap-up-status role="status" aria-live="polite"></p>
      <div class="schedule-wrap-up-actions">
        <button type="submit" data-schedule-wrap-up-submit ${isCompleted ? "disabled" : ""}>${isCompleted ? "Appointment Completed" : "Complete Appointment"}</button>
      </div>
    </form>
  `;
}

function renderScheduleAppointmentNote(item) {
  return `
    <form class="schedule-appointment-note-form" data-schedule-appointment-note-form>
      <section class="detail-card schedule-appointment-note-card">
        <div class="card-heading">
          <h3>Appointment Note</h3>
        </div>
        <label class="schedule-appointment-note-field">
          <textarea name="appointmentNote" rows="8" placeholder="Add the appointment note here.">${escapeHtml(item.appointmentNote || "")}</textarea>
        </label>
        <p class="schedule-action-status" data-schedule-appointment-note-status role="status" aria-live="polite"></p>
        <div class="schedule-appointment-note-actions">
          <button type="submit" data-schedule-appointment-note-submit>Save Appointment Note</button>
        </div>
      </section>
    </form>
  `;
}

function formatScheduleActivityDate(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || ""))) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${dateKey}T00:00:00`));
}

function renderScheduleActivity(item) {
  const items = appointmentActivityItems(item, scheduleActivityLogs);

  return `
    <section class="detail-card schedule-activity-card">
      <div class="card-heading">
        <h3>Activity</h3>
      </div>
      ${items.length ? `
        <ol class="schedule-activity-list">
          ${items.map((activity) => `
            <li>
              <time datetime="${escapeHtml(activity.date || "")}">${escapeHtml(formatScheduleActivityDate(activity.date))}</time>
              <div>
                <strong>${escapeHtml(activity.title)}</strong>
                <span>${escapeHtml(activity.detail || "-")}</span>
              </div>
            </li>
          `).join("")}
        </ol>
      ` : `<p class="schedule-activity-empty">No activity yet.</p>`}
    </section>
  `;
}

function syncScheduleWrapUpFields() {
  const checkbox = document.querySelector("[data-wrap-up-schedule-next]");
  const fields = document.querySelector("[data-wrap-up-next-fields]");
  if (!checkbox || !fields) {
    return;
  }

  fields.hidden = !checkbox.checked;
  fields.querySelectorAll("input, select, textarea").forEach((control) => {
    control.disabled = !checkbox.checked;
  });
}

function setScheduleDetailTab(module, tab = "details") {
  const buttons = [...document.querySelectorAll("[data-schedule-detail-tab]")];
  const validTabs = new Set(buttons.map((button) => button.dataset.scheduleDetailTab));
  scheduleDetailTab = validTabs.has(tab) ? tab : "details";

  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scheduleDetailTab === scheduleDetailTab);
  });

  document.querySelectorAll("[data-schedule-detail-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.scheduleDetailPanel !== scheduleDetailTab;
  });

  if (scheduleDetailTab === "wrap-up") {
    const panel = document.querySelector("[data-schedule-detail-panel='wrap-up']");
    const item = module.items.find((candidate) => candidate.id === selectedItemId);
    if (panel) {
      panel.innerHTML = item ? renderScheduleWrapUp(item) : "";
      syncScheduleWrapUpFields();
    }
  }

  if (scheduleDetailTab === "appt-note") {
    const panel = document.querySelector("[data-schedule-detail-panel='appt-note']");
    const item = module.items.find((candidate) => candidate.id === selectedItemId);
    if (panel) {
      panel.innerHTML = item ? renderScheduleAppointmentNote(item) : "";
    }
  }

  if (scheduleDetailTab === "activity") {
    const panel = document.querySelector("[data-schedule-detail-panel='activity']");
    const item = module.items.find((candidate) => candidate.id === selectedItemId);
    if (panel) {
      panel.innerHTML = item ? renderScheduleActivity(item) : "";
    }
  }

  if (scheduleDetailTab === "forms") {
    const panel = document.querySelector("[data-schedule-detail-panel='forms']");
    const item = module.items.find((candidate) => candidate.id === selectedItemId);
    if (panel) {
      panel.innerHTML = item ? renderScheduleForms(item) : "";
    }
  }
}

function renderScheduleForms(item) {
  if (item.status === "Blocked") {
    return `
      <article class="detail-card schedule-forms-card">
        <div><h3>Print Forms</h3><p>Blocked time does not have appointment forms.</p></div>
      </article>
    `;
  }

  return `
    <article class="detail-card schedule-forms-card">
      <div>
        <h3>Print Forms</h3>
        <p>Print forms for ${escapeHtml(item.title)} only.</p>
      </div>
      <div class="schedule-form-actions">
        <button data-schedule-print-action="appointment-prep" type="button">Print Prep List</button>
        <button data-schedule-print-action="appointment-note" type="button">Print Appointment Note</button>
      </div>
    </article>
    <p class="schedule-print-status" data-schedule-print-status role="status" aria-live="polite"></p>
  `;
}

function schedulePrintPages(module, action) {
  const item = module.items.find((candidate) => candidate.id === selectedItemId);
  if (action === "schedule") return dailySchedulePages(module.items, scheduleVisibleDate, scheduleClientsById);
  if (action === "prep") return dailyPrepPages(module.items, scheduleVisibleDate, scheduleClientsById);
  if (action === "notes") return dailyAppointmentNotePages(module.items, scheduleVisibleDate, scheduleClientsById);
  if (action === "packet") return dailyPrintPacketPages(module.items, scheduleVisibleDate, scheduleClientsById);
  if (action === "appointment-prep") {
    const page = appointmentPrepPage(item, scheduleClientsById);
    return page ? [page] : [];
  }
  if (action === "appointment-note" && item && item.status !== "Blocked") {
    return [appointmentNotePage(item, scheduleClientsById, module.items)];
  }
  return [];
}

function schedulePrintTitle(action) {
  return {
    schedule: "SNACK Daily Schedule",
    prep: "Daily Prep List",
    notes: "Appointment Notes",
    packet: "Daily Print Packet",
    "appointment-prep": "Appointment Prep List",
    "appointment-note": "Appointment Note"
  }[action] || "Print Forms";
}

function setSchedulePrintStatus(message, state = "") {
  document.querySelectorAll("[data-schedule-print-status]").forEach((status) => {
    status.textContent = message;
    status.dataset.state = state;
  });
}

function openSchedulePrint(module, action) {
  const pages = schedulePrintPages(module, action);
  if (!pages.length) {
    setSchedulePrintStatus("There is nothing to print for this selection.", "error");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    setSchedulePrintStatus("The print window was blocked. Allow pop-ups for this local page and try again.", "error");
    return;
  }

  const title = schedulePrintTitle(action);
  const baseHref = new URL("./", location.href).href;
  printWindow.document.open();
  printWindow.document.write(printDocumentHtml({ title, pages, baseHref, autoPrint: true }));
  printWindow.document.close();
  setSchedulePrintStatus(`${title} opened in a new tab.`, "success");
}

function updateSchedulePrintCenter(module) {
  const center = document.querySelector("[data-schedule-print-center]");
  if (!center) return;
  const counts = schedulePrintCounts(module);
  const dateInput = center.querySelector("[data-print-center-date]");
  const dateLabel = center.querySelector("[data-print-center-date-label]");
  if (dateInput) dateInput.value = scheduleVisibleDate;
  if (dateLabel) dateLabel.textContent = formatScheduleDate(scheduleVisibleDate);
  Object.entries(counts).forEach(([key, count]) => {
    const label = center.querySelector(`[data-print-count='${key}']`);
    if (label) label.textContent = `${count} ${count === 1 ? "item" : "items"}`;
  });
}

function setScheduleSubpage(module, label) {
  const isHiddenPrintCenter = module === modules.schedule && label === "Print Forms";
  if (!module.subpages.includes(label) && !isHiddenPrintCenter) return;
  scheduleSubpage = label;
  document.querySelectorAll("[data-schedule-subpage]").forEach((button) => {
    button.classList.toggle("is-current", button.dataset.scheduleSubpage === scheduleSubpage);
  });

  const isPrintForms = scheduleSubpage === "Print Forms";
  const clinicWorkspace = document.querySelector("[data-schedule-clinic-workspace]");
  const printCenter = document.querySelector("[data-schedule-print-center]");
  const summary = document.querySelector("[data-schedule-summary]");
  const headerActions = document.querySelector("[data-schedule-header-actions]");
  const title = document.querySelector("[data-page-title]");

  if (clinicWorkspace) clinicWorkspace.hidden = isPrintForms;
  if (printCenter) printCenter.hidden = !isPrintForms;
  if (summary) summary.hidden = isPrintForms;
  if (headerActions) headerActions.hidden = isPrintForms;
  if (title) title.textContent = isPrintForms ? "Print Forms" : module.title;
  if (isPrintForms) updateSchedulePrintCenter(module);
}

function outreachCreateActionAttribute(action) {
  if (action === "New Event") return "data-outreach-new-event";
  if (action === "Add Contact") return "data-outreach-new-contact";
  if (action === "New Task") return "data-outreach-new-task";
  if (action === "Log Outcome") return "data-outreach-log-outcome";
  return "";
}

function outreachDetailTabKey(tab = "") {
  return tab.toLowerCase().replaceAll(" ", "-");
}

function outreachSelectedItem() {
  return modules.outreach.items.find((item) => item.id === selectedItemId) || null;
}

function renderOutreachStatusControl() {
  const item = outreachSelectedItem();
  if (outreachSubpage === "Reports") {
    return `
      <div class="status-line is-module-status">
        <span class="status-dot"></span>
        <span>Current</span>
      </div>
    `;
  }

  const options = outreachSubpage === "Contacts"
    ? outreachContactStatusOptions
    : outreachSubpage === "Tasks"
      ? outreachTaskStatusOptions
      : outreachEventStatusOptions;
  return `
    <label class="status-line is-module-status crm-status-control outreach-status-control">
      <span class="status-dot"></span>
      <select data-outreach-status-select aria-label="${escapeHtml(outreachSubpage.slice(0, -1) || "Outreach")} status">
        ${crmSelectOptions(options, item?.status || options[0])}
      </select>
    </label>
  `;
}

function renderOutreachValueFields(fields = []) {
  return `
    <div class="field-grid outreach-field-grid">
      ${fields.map(([label, value]) => `
        <div class="field">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value || "-")}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderOutreachLinkedContacts(item) {
  const contacts = (item?.contacts || [])
    .map((contact) => outreachContactItems.find((candidate) => candidate.id === contact.id))
    .filter(Boolean);

  if (!contacts.length) {
    return `<p class="crm-empty-copy">No contacts are linked to this event.</p>`;
  }

  return `
    <div class="crm-appointment-list">
      ${contacts.map((contact) => `
        <button class="crm-appointment-row" data-outreach-contact-id="${escapeHtml(contact.id)}" type="button">
          <span>
            <strong>${escapeHtml(contact.title)}</strong>
            <small>${escapeHtml([contact.interestType, contact.phone].filter((value) => value && value !== "-").join(" | ") || "Contact")}</small>
          </span>
          <span class="status-pill">${escapeHtml(contact.status)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderOutreachEventPanels(item) {
  return {
    logistics: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Logistics</h3>
          <button class="edit-button" data-outreach-edit-event type="button">Edit</button>
        </div>
        ${renderOutreachValueFields([
          ["Registration", item.registration],
          ["Setup", item.setup],
          ["Location", item.place],
          ["Deadline", item.deadline],
          ["Repeats", item.repeatPattern],
          ["Event Cost", item.cost]
        ])}
      </section>
      <section class="detail-card">
        <div class="card-heading"><h3>Event Contact</h3></div>
        ${renderOutreachValueFields([
          ["Contact", item.contactName],
          ["Role", item.contactRole],
          ["Phone", item.phone],
          ["Email", item.email]
        ])}
      </section>
      <section class="detail-card">
        <div class="card-heading"><h3>Notes</h3></div>
        <p class="crm-note-copy">${escapeHtml(item.notes)}</p>
      </section>
    `,
    outcomes: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Event Outcomes</h3>
          <button class="edit-button" data-outreach-log-outcome type="button">Edit</button>
        </div>
        ${renderOutreachValueFields([
          ["Main Activity", item.activity],
          ["Giveaways", item.giveaways],
          ["Families Interacted With", item.families],
          ["Participants", item.participants],
          ["Interest List", item.interestList],
          ["Referrals", item.referrals]
        ])}
      </section>
    `,
    contacts: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Contacts Generated</h3>
          <button class="edit-button" data-outreach-new-contact type="button">Add Contact</button>
        </div>
        ${renderOutreachLinkedContacts(item)}
      </section>
    `
  };
}

function renderOutreachContactPanels(item) {
  return {
    overview: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Contact Details</h3>
          <button class="edit-button" data-outreach-edit-contact type="button">Edit</button>
        </div>
        ${renderOutreachValueFields([
          ["Event", item.event],
          ["Caregiver or Contact", item.contactName],
          ["Child", item.childName],
          ["Phone", item.phone],
          ["Email", item.email],
          ["Preferred Language", item.language],
          ["Interest", item.interestType],
          ["Created", item.createdDate]
        ])}
      </section>
    `,
    notes: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Notes</h3>
          <button class="edit-button" data-outreach-edit-contact type="button">Edit</button>
        </div>
        <p class="crm-note-copy">${escapeHtml(item.notes)}</p>
      </section>
    `
  };
}

function renderOutreachTaskPanels(item) {
  return {
    overview: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Task Details</h3>
          <button class="edit-button" data-outreach-edit-task type="button">Edit</button>
        </div>
        ${renderOutreachValueFields([
          ["Event", item.event],
          ["Due Date", item.dueDate],
          ["Due Time", item.dueTime],
          ["Priority", item.priority],
          ["Assigned To", item.assignedTo],
          ["Status", item.status]
        ])}
      </section>
    `,
    notes: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Notes</h3>
          <button class="edit-button" data-outreach-edit-task type="button">Edit</button>
        </div>
        <p class="crm-note-copy">${escapeHtml(item.notes)}</p>
      </section>
    `
  };
}

function renderOutreachReportPanels(item) {
  return {
    "annual-report": `
      <section class="detail-card">
        <div class="card-heading"><h3>${escapeHtml(item.title)}</h3></div>
        ${renderOutreachValueFields([
          ["Events", item.events],
          ["Completed Events", item.completedEvents],
          ["Families Reached", item.interactions],
          ["Participants", item.participants],
          ["New Contacts", item.contacts],
          ["Interest List", item.interestList],
          ["Referrals", item.referrals],
          ["Open Tasks", item.openTasks],
          ["Event Costs", item.cost]
        ])}
      </section>
    `
  };
}

function renderOutreachDetailPanels(module) {
  return module.detailTabs.map((tab, index) => `
    <div class="crm-detail-panel" data-outreach-detail-panel="${outreachDetailTabKey(tab)}" ${index === 0 ? "" : "hidden"}></div>
  `).join("");
}

function renderOutreachDetailContent(item) {
  const panels = !item
    ? Object.fromEntries(modules.outreach.detailTabs.map((tab) => [outreachDetailTabKey(tab), `
        <section class="detail-card"><p class="crm-empty-copy">Select an outreach record to review its details.</p></section>
      `]))
    : outreachSubpage === "Contacts"
      ? renderOutreachContactPanels(item)
      : outreachSubpage === "Tasks"
        ? renderOutreachTaskPanels(item)
        : outreachSubpage === "Reports"
          ? renderOutreachReportPanels(item)
          : renderOutreachEventPanels(item);

  Object.entries(panels).forEach(([key, html]) => {
    const panel = document.querySelector(`[data-outreach-detail-panel="${key}"]`);
    if (panel) panel.innerHTML = html;
  });
}

function setOutreachDetailTab(tab = "") {
  const validTabs = new Set(modules.outreach.detailTabs.map(outreachDetailTabKey));
  const fallback = outreachDetailTabKey(modules.outreach.detailTabs[0] || "Overview");
  outreachDetailTab = validTabs.has(tab) ? tab : fallback;

  document.querySelectorAll("[data-outreach-detail-tab]").forEach((button) => {
    const active = button.dataset.outreachDetailTab === outreachDetailTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-outreach-detail-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.outreachDetailPanel !== outreachDetailTab;
  });
}

function renderOutreachEventOptions(selectedId = "", includeEmpty = true) {
  return `${includeEmpty ? '<option value="">Not linked</option>' : ""}${outreachRawEvents.map((event) => `
    <option value="${escapeHtml(event.id)}" ${event.id === selectedId ? "selected" : ""}>${escapeHtml(event.name || "Unnamed event")}</option>
  `).join("")}`;
}

function renderOutreachEventEditorSide(item = null) {
  const source = item?.source || {};
  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status" form="outreach-event-editor-form" aria-label="Event status">
          ${crmSelectOptions(outreachEventStatusOptions, source.status || "Scheduled")}
        </select>
      </label>
      <div class="crm-editor-name-fields">
        <label><span>Event Name</span><input name="name" form="outreach-event-editor-form" value="${escapeHtml(source.name || "")}" required></label>
      </div>
      <div class="meta-list appointment-meta crm-editor-side-meta">
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.calendar}</span>
          <span class="crm-meta-copy"><em>Date</em><input name="eventDate" form="outreach-event-editor-form" type="date" value="${escapeHtml(source.eventDate || "")}"></span>
        </label>
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.outreach}</span>
          <span class="crm-meta-copy"><em>Event Type</em><select name="type" form="outreach-event-editor-form">${crmSelectOptions(outreachEventTypeOptions, source.type || "Outreach Event")}</select></span>
        </label>
      </div>
      <section class="side-section crm-editor-family-section">
        <h3><span class="section-icon">${icons.crm}</span>Event Lead</h3>
        <label class="crm-side-field"><span>Contact</span><input name="contactName" form="outreach-event-editor-form" value="${escapeHtml(source.contactName || "")}"></label>
        <label class="crm-side-field"><span>Role</span><input name="contactRole" form="outreach-event-editor-form" value="${escapeHtml(source.contactRole || "")}"></label>
        <label class="crm-side-field"><span>Phone</span><input name="phone" form="outreach-event-editor-form" type="tel" value="${escapeHtml(source.phone || "")}"></label>
        <label class="crm-side-field"><span>Email</span><input name="email" form="outreach-event-editor-form" type="email" value="${escapeHtml(source.email || "")}"></label>
      </section>
    </div>
  `;
}

function renderOutreachEventEditorMain(item = null) {
  const source = item?.source || {};
  return `
    <form class="crm-profile-editor-main" id="outreach-event-editor-form" data-outreach-event-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Logistics</h3><button class="edit-button" data-close-outreach-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields crm-profile-editor-fields">
          <label><span>Location</span><input name="location" value="${escapeHtml(source.location || "")}"></label>
          <label><span>Repeat Pattern</span><input name="repeatPattern" value="${escapeHtml(source.repeatPattern || "")}" placeholder="One-time or annual"></label>
          <label><span>Deadline</span><input name="deadline" type="date" value="${escapeHtml(source.deadline || "")}"></label>
          <label><span>Event Cost</span><input name="costAmount" type="number" min="0" step="0.01" value="${escapeHtml(source.costAmount ?? "")}"></label>
          <label class="is-full-width"><span>Cost Notes</span><input name="costNotes" value="${escapeHtml(source.costNotes || "")}" placeholder="Booth fee, printing, or supplies"></label>
          <label class="is-full-width"><span>Registration</span><textarea name="registration" rows="3">${escapeHtml(source.registration || "")}</textarea></label>
          <label class="is-full-width"><span>Setup</span><textarea name="setup" rows="3">${escapeHtml(source.setup || "")}</textarea></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="4">${escapeHtml(source.notes || "")}</textarea></label>
        </div>
      </section>
      <section class="detail-card">
        <div class="card-heading"><h3>Planned Outcomes</h3></div>
        <div class="schedule-inline-fields crm-profile-editor-fields">
          <label><span>Main Activity</span><input name="mainActivity" value="${escapeHtml(source.mainActivity || "")}"></label>
          <label><span>Giveaways</span><input name="giveaways" value="${escapeHtml(source.giveaways || "")}"></label>
          <label><span>Families Interacted With</span><input name="interactionsCount" type="number" min="0" value="${escapeHtml(source.interactionsCount ?? "")}"></label>
          <label><span>Participants</span><input name="participantListCount" type="number" min="0" value="${escapeHtml(source.participantListCount ?? "")}"></label>
          <label><span>Interest List</span><input name="interestListCount" type="number" min="0" value="${escapeHtml(source.interestListCount ?? "")}"></label>
          <label><span>Referrals</span><input name="referralsCount" type="number" min="0" value="${escapeHtml(source.referralsCount ?? "")}"></label>
        </div>
      </section>
      <p class="schedule-dialog-status" data-outreach-editor-status role="status" aria-live="polite"></p>
      <div class="footer-actions outreach-editor-footer-actions" style="--outreach-editor-action-count: ${item ? 3 : 2};">
        <button data-close-outreach-editor type="button">Cancel</button>
        ${item ? '<button data-outreach-delete-editor type="button">Delete Event</button>' : ""}
        <button class="is-primary" type="submit">${item ? "Save Changes" : "Save Event"}</button>
      </div>
    </form>
  `;
}

function renderOutreachContactEditorSide(item = null, eventId = "") {
  const source = item?.source || {};
  const selectedEventId = source.eventId || eventId;
  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status" form="outreach-contact-editor-form" aria-label="Contact status">
          ${crmSelectOptions(outreachContactStatusOptions, source.status || "New")}
        </select>
      </label>
      <div class="crm-editor-name-fields">
        <label><span>Caregiver or Contact</span><input name="contactName" form="outreach-contact-editor-form" value="${escapeHtml(source.contactName || "")}"></label>
        <label><span>Child</span><input name="childName" form="outreach-contact-editor-form" value="${escapeHtml(source.childName || "")}"></label>
      </div>
      <div class="meta-list appointment-meta crm-editor-side-meta">
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.outreach}</span>
          <span class="crm-meta-copy"><em>Event</em><select name="eventId" form="outreach-contact-editor-form">${renderOutreachEventOptions(selectedEventId)}</select></span>
        </label>
      </div>
    </div>
  `;
}

function renderOutreachContactEditorMain(item = null) {
  const source = item?.source || {};
  return `
    <form class="crm-profile-editor-main" id="outreach-contact-editor-form" data-outreach-contact-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Contact Details</h3><button class="edit-button" data-close-outreach-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields crm-profile-editor-fields">
          <label><span>Phone</span><input name="phone" type="tel" value="${escapeHtml(source.phone || "")}"></label>
          <label><span>Email</span><input name="email" type="email" value="${escapeHtml(source.email || "")}"></label>
          <label><span>Preferred Language</span><select name="preferredLanguage">${crmSelectOptions(languageOptions, source.preferredLanguage || "English")}</select></label>
          <label><span>Interest</span><select name="interestType">${crmSelectOptions(outreachInterestTypeOptions, source.interestType, "Choose")}</select></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="8">${escapeHtml(source.notes || "")}</textarea></label>
        </div>
      </section>
      <p class="schedule-dialog-status" data-outreach-editor-status role="status" aria-live="polite"></p>
      <div class="footer-actions outreach-editor-footer-actions" style="--outreach-editor-action-count: 2;">
        <button data-close-outreach-editor type="button">Cancel</button>
        <button class="is-primary" type="submit">${item ? "Save Changes" : "Save Contact"}</button>
      </div>
    </form>
  `;
}

function renderOutreachTaskEditorSide(item = null, eventId = "") {
  const source = item?.source || {};
  const selectedEventId = source.outreachEventId || eventId;
  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status" form="outreach-task-editor-form" aria-label="Task status">
          ${crmSelectOptions(outreachTaskStatusOptions, source.status || "Open")}
        </select>
      </label>
      <div class="crm-editor-name-fields">
        <label><span>Task</span><input name="title" form="outreach-task-editor-form" value="${escapeHtml(source.title || "")}" required></label>
      </div>
      <div class="meta-list appointment-meta crm-editor-side-meta">
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.outreach}</span>
          <span class="crm-meta-copy"><em>Event</em><select name="outreachEventId" form="outreach-task-editor-form">${renderOutreachEventOptions(selectedEventId)}</select></span>
        </label>
      </div>
    </div>
  `;
}

function renderOutreachTaskEditorMain(item = null) {
  const source = item?.source || {};
  return `
    <form class="crm-profile-editor-main" id="outreach-task-editor-form" data-outreach-task-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Task Details</h3><button class="edit-button" data-close-outreach-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields crm-profile-editor-fields">
          <label><span>Priority</span><select name="priority">${crmSelectOptions(outreachTaskPriorityOptions, source.priority || "Normal")}</select></label>
          <label><span>Assigned To</span><input name="assignedTo" value="${escapeHtml(source.assignedTo || "")}"></label>
          <label><span>Due Date</span><input name="dueDate" type="date" value="${escapeHtml(source.dueDate || "")}"></label>
          <label><span>Due Time</span><input name="dueTime" type="time" value="${escapeHtml(source.dueTime || "")}"></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="8">${escapeHtml(source.notes || "")}</textarea></label>
        </div>
      </section>
      <p class="schedule-dialog-status" data-outreach-editor-status role="status" aria-live="polite"></p>
      <div class="footer-actions outreach-editor-footer-actions" style="--outreach-editor-action-count: 2;">
        <button data-close-outreach-editor type="button">Cancel</button>
        <button class="is-primary" type="submit">${item ? "Save Changes" : "Save Task"}</button>
      </div>
    </form>
  `;
}

function renderOutreachOutcomeForm(item) {
  const source = item?.source || {};
  return `
    <form class="schedule-inline-form crm-inline-form" data-outreach-outcome-form>
      <div class="schedule-inline-form-header"><h3>Log Event Outcome</h3><button data-close-outreach-editor type="button">Cancel</button></div>
      <div class="schedule-inline-fields crm-inline-fields">
        <label><span>Main Activity</span><input name="mainActivity" value="${escapeHtml(source.mainActivity || "")}"></label>
        <label><span>Giveaways</span><input name="giveaways" value="${escapeHtml(source.giveaways || "")}"></label>
        <label><span>Families Interacted With</span><input name="interactionsCount" type="number" min="0" value="${escapeHtml(source.interactionsCount ?? "")}"></label>
        <label><span>Participants</span><input name="participantListCount" type="number" min="0" value="${escapeHtml(source.participantListCount ?? "")}"></label>
        <label><span>Interest List</span><input name="interestListCount" type="number" min="0" value="${escapeHtml(source.interestListCount ?? "")}"></label>
        <label><span>Referrals</span><input name="referralsCount" type="number" min="0" value="${escapeHtml(source.referralsCount ?? "")}"></label>
        <label class="is-full-width"><span>Outcome Notes</span><textarea name="notes" rows="6">${escapeHtml(source.notes || "")}</textarea></label>
      </div>
      <p class="schedule-dialog-status" data-outreach-editor-status role="status" aria-live="polite"></p>
      <div class="schedule-inline-actions"><button type="submit">Save Outcome</button></div>
    </form>
  `;
}

function setOutreachPanelMode(mode = "detail") {
  outreachPanelMode = mode === "editor" ? "editor" : "detail";
  const editing = outreachPanelMode === "editor";
  const profileEditor = editing && ["event", "contact", "task"].includes(outreachEditorKind);
  const tabs = document.querySelector("[data-outreach-tabs]");
  const content = document.querySelector("[data-outreach-detail-content]");
  const editor = document.querySelector("[data-outreach-editor]");
  const sideDetail = document.querySelector("[data-outreach-side-detail]");
  const sideEditor = document.querySelector("[data-outreach-side-editor]");

  if (tabs) {
    tabs.hidden = editing && !profileEditor;
    tabs.querySelectorAll("button").forEach((button) => { button.disabled = editing; });
  }
  if (content) content.hidden = editing;
  if (editor) editor.hidden = !editing;
  if (sideDetail) sideDetail.hidden = profileEditor;
  if (sideEditor) sideEditor.hidden = !profileEditor;
}

function setOutreachActionStatus(message = "", state = "") {
  document.querySelectorAll("[data-outreach-action-status], [data-outreach-editor-status]").forEach((status) => {
    status.textContent = message;
    status.dataset.state = state;
  });
}

function openOutreachEditor(kind, item = null, options = {}) {
  if (outreachActionBusy) return;
  const editor = document.querySelector("[data-outreach-editor]");
  const sideEditor = document.querySelector("[data-outreach-side-editor]");
  if (!editor || !sideEditor) return;

  outreachEditorKind = kind;
  outreachDeletePendingId = "";
  editor.classList.toggle("is-profile-editor", kind !== "outcome");
  if (kind === "event") {
    outreachEditingEventId = item?.id || "";
    editor.innerHTML = renderOutreachEventEditorMain(item);
    sideEditor.innerHTML = renderOutreachEventEditorSide(item);
  } else if (kind === "contact") {
    outreachEditingContactId = item?.id || "";
    editor.innerHTML = renderOutreachContactEditorMain(item);
    sideEditor.innerHTML = renderOutreachContactEditorSide(item, options.eventId || "");
  } else if (kind === "task") {
    outreachEditingTaskId = item?.id || "";
    editor.innerHTML = renderOutreachTaskEditorMain(item);
    sideEditor.innerHTML = renderOutreachTaskEditorSide(item, options.eventId || "");
  } else if (kind === "outcome" && item) {
    outreachEditingEventId = item.id;
    editor.innerHTML = renderOutreachOutcomeForm(item);
    sideEditor.replaceChildren();
  }
  setOutreachActionStatus("");
  setOutreachPanelMode("editor");
  (sideEditor.querySelector("input, select, textarea") || editor.querySelector("input, select, textarea"))?.focus();
}

function closeOutreachEditor() {
  if (outreachActionBusy) return;
  const editor = document.querySelector("[data-outreach-editor]");
  const sideEditor = document.querySelector("[data-outreach-side-editor]");
  if (editor) {
    editor.replaceChildren();
    editor.classList.remove("is-profile-editor");
  }
  sideEditor?.replaceChildren();
  outreachEditorKind = "";
  outreachEditingEventId = "";
  outreachEditingContactId = "";
  outreachEditingTaskId = "";
  setOutreachPanelMode("detail");
  updateDetail(modules.outreach, selectedItemId);
}

function refreshOutreachAccountControl() {
  if (currentModuleId() !== "outreach") return;
  const account = document.querySelector(".account");
  const accountName = document.querySelector("[data-account-name]");
  if (!account || !accountName) return;

  account.setAttribute("role", "button");
  account.setAttribute("tabindex", "0");
  accountName.textContent = outreachCurrentUser ? "Shannon Oddo" : "Sign in";
  if (outreachCurrentUser) {
    account.removeAttribute("title");
  } else {
    account.setAttribute("title", `Sign in to load outreach ${outreachSubpage.toLowerCase()}`);
  }
}

function updateOutreachActionAvailability(item = outreachSelectedItem()) {
  document.querySelectorAll("[data-outreach-action], [data-outreach-edit-event], [data-outreach-edit-contact], [data-outreach-edit-task], [data-outreach-log-outcome], [data-outreach-status-select], [data-outreach-contact-id], [data-outreach-delete-editor]").forEach((control) => {
    control.disabled = outreachActionBusy || !item;
  });
  document.querySelectorAll("[data-outreach-new-event], [data-outreach-new-contact], [data-outreach-new-task], [data-outreach-search-toggle], [data-outreach-search-input]").forEach((control) => {
    control.disabled = outreachActionBusy;
  });

  const deleteButton = document.querySelector("[data-outreach-action='delete'], [data-outreach-delete-editor]");
  if (deleteButton) {
    const noun = outreachSubpage === "Events" ? "Event" : outreachSubpage === "Contacts" ? "Contact" : "Task";
    deleteButton.textContent = outreachDeletePendingId === item?.id ? "Confirm Delete" : `Delete ${noun}`;
  }
  const doneButton = document.querySelector("[data-outreach-action='mark-done']");
  if (doneButton) {
    const done = item?.status === "Done";
    doneButton.disabled = outreachActionBusy || !item || done;
    doneButton.textContent = done ? "Task Done" : "Mark Done";
  }
}

function setOutreachActionBusy(busy) {
  outreachActionBusy = busy;
  updateOutreachActionAvailability();
  document.querySelectorAll("[data-outreach-editor], [data-outreach-side-editor]").forEach((editor) => {
    editor.setAttribute("aria-busy", String(busy));
    editor.querySelectorAll("button, input, select, textarea").forEach((control) => {
      control.disabled = busy;
    });
  });
}

async function outreachAuthedFetch(path, options = {}) {
  if (!outreachCurrentUser) {
    throw new Error("Sign in before changing an outreach record.");
  }

  const token = await outreachCurrentUser.getIdToken();
  const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `The outreach service returned ${response.status}.`);
  }

  return response.json().catch(() => ({}));
}

function outreachTaskEvent(values = {}) {
  return outreachRawEvents.find((event) => event.id === values.outreachEventId) || {};
}

async function saveOutreachEvent(form) {
  if (outreachActionBusy) return;
  const item = outreachEventItems.find((candidate) => candidate.id === outreachEditingEventId) || null;
  const values = Object.fromEntries(new FormData(form).entries());
  const payload = outreachEventPayload({ ...(item?.source || {}), ...values });

  setOutreachActionBusy(true);
  setOutreachActionStatus("");
  try {
    const result = await outreachAuthedFetch(item ? `/api/outreach-events/${encodeURIComponent(item.id)}` : "/api/outreach-events", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    selectedItemId = result.event?.id || item?.id || selectedItemId;
    outreachEditingEventId = "";
    outreachEditorKind = "";
    await loadOutreachData(outreachCurrentUser, selectedItemId);
    setOutreachPanelMode("detail");
  } catch (error) {
    console.error(error);
    setOutreachActionStatus(error.message || "Could not save the event.", "error");
  } finally {
    setOutreachActionBusy(false);
  }
}

async function saveOutreachContact(form) {
  if (outreachActionBusy) return;
  const item = outreachContactItems.find((candidate) => candidate.id === outreachEditingContactId) || null;
  const values = Object.fromEntries(new FormData(form).entries());
  const payload = outreachContactPayload({ ...(item?.source || {}), ...values });
  const returnEventId = !item && outreachSubpage === "Events" ? payload.eventId : "";

  setOutreachActionBusy(true);
  setOutreachActionStatus("");
  try {
    const result = await outreachAuthedFetch(item ? `/api/outreach-contacts/${encodeURIComponent(item.id)}` : "/api/outreach-contacts", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    selectedItemId = returnEventId || result.contact?.id || item?.id || selectedItemId;
    outreachEditingContactId = "";
    outreachEditorKind = "";
    if (returnEventId) {
      outreachDetailTab = "contacts";
    } else if (outreachSubpage !== "Contacts") {
      outreachSubpage = "Contacts";
      configureOutreachModule("Contacts");
      renderModulePage("outreach");
      refreshOutreachAccountControl();
    }
    await loadOutreachData(outreachCurrentUser, selectedItemId);
    setOutreachPanelMode("detail");
  } catch (error) {
    console.error(error);
    setOutreachActionStatus(error.message || "Could not save the contact.", "error");
  } finally {
    setOutreachActionBusy(false);
  }
}

async function saveOutreachTask(form) {
  if (outreachActionBusy) return;
  const item = outreachTaskItems.find((candidate) => candidate.id === outreachEditingTaskId) || null;
  const values = Object.fromEntries(new FormData(form).entries());
  const event = outreachTaskEvent(values);
  const payload = outreachTaskPayload({
    ...(item?.source || {}),
    ...values,
    outreachEventName: event.name || ""
  }, event);
  const returnEventId = !item && outreachSubpage === "Events" ? payload.outreachEventId : "";

  setOutreachActionBusy(true);
  setOutreachActionStatus("");
  try {
    const result = await outreachAuthedFetch(item ? `/api/tasks/${encodeURIComponent(item.id)}` : "/api/tasks", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    selectedItemId = returnEventId || result.task?.id || item?.id || selectedItemId;
    outreachEditingTaskId = "";
    outreachEditorKind = "";
    if (!returnEventId && outreachSubpage !== "Tasks") {
      outreachSubpage = "Tasks";
      configureOutreachModule("Tasks");
      renderModulePage("outreach");
      refreshOutreachAccountControl();
    }
    await loadOutreachData(outreachCurrentUser, selectedItemId);
    setOutreachPanelMode("detail");
  } catch (error) {
    console.error(error);
    setOutreachActionStatus(error.message || "Could not save the task.", "error");
  } finally {
    setOutreachActionBusy(false);
  }
}

async function saveOutreachOutcome(form) {
  const item = outreachEventItems.find((candidate) => candidate.id === outreachEditingEventId) || null;
  if (!item || outreachActionBusy) return;
  const values = Object.fromEntries(new FormData(form).entries());
  const payload = outreachEventPayload({ ...item.source, ...values });

  setOutreachActionBusy(true);
  setOutreachActionStatus("");
  try {
    await outreachAuthedFetch(`/api/outreach-events/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    selectedItemId = item.id;
    outreachDetailTab = "outcomes";
    outreachEditingEventId = "";
    outreachEditorKind = "";
    await loadOutreachData(outreachCurrentUser, item.id);
    setOutreachPanelMode("detail");
    setOutreachDetailTab("outcomes");
  } catch (error) {
    console.error(error);
    setOutreachActionStatus(error.message || "Could not save the outcome.", "error");
  } finally {
    setOutreachActionBusy(false);
  }
}

async function saveOutreachStatus(item, status, control) {
  if (!item || outreachActionBusy || status === item.status || outreachSubpage === "Reports") return;
  const previousStatus = item.status;
  let path = "";
  let payload = {};
  if (outreachSubpage === "Events") {
    path = `/api/outreach-events/${encodeURIComponent(item.id)}`;
    payload = outreachEventPayload({ ...item.source, status });
  } else if (outreachSubpage === "Contacts") {
    path = `/api/outreach-contacts/${encodeURIComponent(item.id)}`;
    payload = outreachContactPayload({ ...item.source, status });
  } else {
    path = `/api/tasks/${encodeURIComponent(item.id)}`;
    const event = outreachTaskEvent({ outreachEventId: item.eventId });
    payload = outreachTaskPayload({ ...item.source, status, outreachEventName: event.name || item.source?.outreachEventName || "" }, event);
  }

  setOutreachActionBusy(true);
  setOutreachActionStatus("");
  try {
    await outreachAuthedFetch(path, { method: "PATCH", body: JSON.stringify(payload) });
    selectedItemId = item.id;
    await loadOutreachData(outreachCurrentUser, item.id);
  } catch (error) {
    console.error(error);
    if (control) control.value = previousStatus;
    setOutreachActionStatus(error.message || "Could not update the status.", "error");
  } finally {
    setOutreachActionBusy(false);
  }
}

async function deleteOutreachRecord(item) {
  if (!item || outreachActionBusy || outreachSubpage === "Reports") return;
  const decision = crmConfirmDecision(outreachDeletePendingId, item.id);
  outreachDeletePendingId = decision.pendingId;
  if (!decision.confirmed) {
    setOutreachActionStatus(`Click Confirm Delete to permanently remove this ${item.kind}.`);
    updateOutreachActionAvailability(item);
    return;
  }

  const path = item.kind === "event"
    ? `/api/outreach-events/${encodeURIComponent(item.id)}`
    : item.kind === "contact"
      ? `/api/outreach-contacts/${encodeURIComponent(item.id)}`
      : `/api/tasks/${encodeURIComponent(item.id)}`;
  setOutreachActionBusy(true);
  setOutreachActionStatus("");
  try {
    await outreachAuthedFetch(path, { method: "DELETE" });
    selectedItemId = "";
    outreachDeletePendingId = "";
    outreachEditorKind = "";
    await loadOutreachData(outreachCurrentUser);
    setOutreachPanelMode("detail");
  } catch (error) {
    console.error(error);
    outreachDeletePendingId = "";
    setOutreachActionStatus(error.message || "Could not delete this outreach record.", "error");
    updateOutreachActionAvailability(item);
  } finally {
    setOutreachActionBusy(false);
  }
}

function openOutreachContactReferral(item) {
  if (!item) return;
  const query = new URLSearchParams({
    section: "Referrals",
    new: "outreach",
    outreachContactId: item.id,
    parentName: item.contactName === "-" ? "" : item.contactName,
    firstName: item.childName === "-" ? "" : item.childName,
    phone: item.phone === "-" ? "" : item.phone,
    email: item.email === "-" ? "" : item.email,
    preferredLanguage: item.language === "-" ? "English" : item.language,
    referralType: "Outreach Event Interest",
    referralSource: item.event === "Not linked" ? "Outreach" : item.event,
    notes: item.notes === "-" ? "" : item.notes
  });
  location.href = `./crm.html?${query}`;
}

function openCrmOutreachReferralHandoff() {
  if (crmOutreachHandoffHandled || currentModuleId() !== "crm" || crmSubpage !== "Referrals") return;
  const params = new URLSearchParams(window.location.search);
  if (params.get("new") !== "outreach") return;

  crmOutreachHandoffHandled = true;
  crmOutreachContactId = params.get("outreachContactId") || "";
  const childName = (params.get("firstName") || "").trim();
  const childParts = childName.split(/\s+/).filter(Boolean);
  const firstName = childParts.shift() || "";
  const lastName = childParts.join(" ");
  const today = scheduleDateKey(new Date());
  const source = {
    firstName,
    lastName,
    parentName: params.get("parentName") || "",
    phone: params.get("phone") || "",
    email: params.get("email") || "",
    preferredLanguage: params.get("preferredLanguage") || "English",
    preferredContactMethod: params.get("phone") ? "Phone Call" : params.get("email") ? "Email" : "",
    referralType: params.get("referralType") || "Outreach Event Interest",
    referralSource: params.get("referralSource") || "Outreach",
    referralDate: today,
    firstContactDate: today,
    mostRecentContactDate: today,
    status: "New",
    notes: params.get("notes") || ""
  };

  const cleanUrl = new URL(window.location.href);
  [...cleanUrl.searchParams.keys()].forEach((key) => {
    if (key !== "section") cleanUrl.searchParams.delete(key);
  });
  history.replaceState({}, "", cleanUrl);
  openCrmReferralEditor(null, { source });
}

function setOutreachSubpage(label) {
  if (!modules.outreach.subpages.includes(label) || outreachActionBusy) return;
  outreachSubpage = label;
  outreachSearchQuery = "";
  outreachDetailTab = outreachDetailTabKey(outreachSubpageDefinition(label).detailTabs[0]);
  outreachPanelMode = "detail";
  outreachEditorKind = "";
  outreachEditingEventId = "";
  outreachEditingContactId = "";
  outreachEditingTaskId = "";
  outreachDeletePendingId = "";
  configureOutreachModule(label);

  const url = new URL(window.location.href);
  url.searchParams.set("section", label);
  history.replaceState({}, "", url);

  renderModulePage("outreach");
  refreshOutreachAccountControl();
  applyOutreachSearch(modules.outreach, "");
}

function crmCreateActionAttribute(action) {
  if (action === "New Client") return "data-crm-new-client";
  if (action === "New Referral") return "data-crm-new-referral";
  if (action === "New Organization") return "data-crm-new-network";
  return "";
}

function renderCrmStatusControl() {
  if (crmSubpage === "Referral Network") {
    return `
      <div class="status-line is-module-status">
        <span class="status-dot"></span>
        <span>Referral Partner</span>
      </div>
    `;
  }

  const label = crmSubpage === "Referrals" ? "Referral status" : "Client status";
  const options = crmSubpage === "Referrals" ? referralStatusOptions : crmStatusOptions();
  return `
    <label class="status-line is-module-status crm-status-control">
      <span class="status-dot"></span>
      <select data-crm-status-select aria-label="${label}">
        ${crmSelectOptions(options, "")}
      </select>
    </label>
  `;
}

function renderCrmDetailPanels(module) {
  return module.detailTabs.map((tab, index) => {
    const key = crmDetailTabKey(tab);
    return `
      <div class="crm-detail-panel" data-crm-detail-panel="${key}" ${index === 0 ? "" : "hidden"}>
        ${index === 0 ? renderCards(module) : ""}
      </div>
    `;
  }).join("");
}

function refreshCrmAccountControl() {
  if (currentModuleId() !== "crm") return;
  const account = document.querySelector(".account");
  const accountName = document.querySelector("[data-account-name]");
  if (!account || !accountName) return;

  account.setAttribute("role", "button");
  account.setAttribute("tabindex", "0");
  accountName.textContent = crmCurrentUser ? "Shannon Oddo" : "Sign in";
  if (crmCurrentUser) {
    account.removeAttribute("title");
  } else {
    account.setAttribute("title", `Sign in to load ${crmSubpage.toLowerCase()}`);
  }
}

function setCrmSubpage(label) {
  if (!modules.crm.subpages.includes(label) || crmActionBusy) return;
  crmSubpage = label;
  crmSearchQuery = "";
  crmDetailTab = "overview";
  crmPanelMode = "detail";
  crmEditorKind = "";
  crmEditingClientId = "";
  crmEditingReferralId = "";
  crmEditingNetworkId = "";
  crmClosePendingId = "";
  crmDeletePendingId = "";
  crmConvertPendingId = "";
  configureCrmModule(label);

  const url = new URL(window.location.href);
  url.searchParams.set("section", label);
  if (label !== "Clients") url.searchParams.delete("client");
  history.replaceState({}, "", url);

  renderModulePage("crm");
  refreshCrmAccountControl();
  applyCrmSearch(modules.crm, "");
}

function renderModulePage(moduleId) {
  const module = modules[moduleId];
  const navigationModuleId = isOperationsOutreachReport() ? "operations" : moduleId;
  const navigationModule = modules[navigationModuleId];
  selectedItemId = module.items[0]?.id || "";
  document.title = `SNACK Program Manager ${isOperationsOutreachReport() ? "Operations Reports" : module.label}`;

  const app = document.querySelector("#app");
  app.innerHTML = `
    <div
      class="app-shell"
      data-shell
      data-module-id="${navigationModuleId}"
      ${moduleId === "crm" ? `data-crm-section="${escapeHtml(crmSubpage)}"` : ""}
      ${moduleId === "outreach" ? `data-outreach-section="${escapeHtml(outreachSubpage)}"` : ""}
      style="--module: ${navigationModule.theme[0]}; --module-soft: ${navigationModule.theme[1]}; --module-line: ${navigationModule.theme[2]};"
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
          <nav class="module-nav" aria-label="${navigationModule.label} navigation">
            ${renderNav(navigationModuleId)}
          </nav>
        </div>

        ${module.quickActions.length ? `<section class="quick-actions" aria-label="Quick actions">
          <h2>Quick Actions</h2>
          ${module.quickActions.map((action) => `
            <button class="quick-button" ${moduleId === "schedule" && action === "New Appointment" ? "data-open-new-appointment" : ""} ${moduleId === "schedule" && action === "Block Time" ? "data-open-block-time" : ""} ${moduleId === "schedule" && action === "Print Forms" ? "data-open-schedule-print-center" : ""} ${moduleId === "crm" ? crmCreateActionAttribute(action) : ""} ${moduleId === "outreach" ? outreachCreateActionAttribute(action) : ""} type="button">${icon("plus")}${action}</button>
          `).join("")}
        </section>` : ""}

        <div class="account">
          <span class="avatar">SO</span>
          <strong data-account-name>Shannon Oddo</strong>
        </div>
      </aside>

      <main class="main">
        <header class="page-header">
          <div class="page-title">
            <h1 data-page-title>${module.title}</h1>
          </div>

          <div class="header-actions" ${moduleId === "schedule" ? "data-schedule-header-actions" : ""}>
            ${module.views.length ? `<div class="view-switch" role="group" aria-label="${module.label} views" style="grid-template-columns: repeat(${module.views.length}, minmax(86px, 1fr));">
              ${module.views.map((view, index) => `
                <button
                  class="${moduleId === "schedule" ? (view.toLowerCase() === scheduleViewMode ? "is-active" : "") : moduleId === "outreach" ? (view === outreachSubpage ? "is-active" : "") : (index === 0 ? "is-active" : "")}"
                  ${moduleId === "schedule" ? `data-schedule-view="${view.toLowerCase()}"` : ""}
                  ${moduleId === "outreach" ? `data-outreach-view="${escapeHtml(view)}"` : ""}
                  type="button"
                >${view}</button>
              `).join("")}
            </div>` : ""}
            ${module.primaryAction ? `<button class="primary-action" ${moduleId === "schedule" ? "data-open-new-appointment" : ""} ${moduleId === "crm" ? crmCreateActionAttribute(module.primaryAction) : ""} ${moduleId === "outreach" ? outreachCreateActionAttribute(module.primaryAction) : ""} type="button">${icons.plus}${module.primaryAction}</button>` : ""}
          </div>
        </header>

        <section class="summary-strip" ${moduleId === "schedule" ? "data-schedule-summary" : ""} aria-label="${module.label} summary">
          ${renderSummaryItems(module)}
        </section>

        <section class="workspace" ${moduleId === "schedule" ? "data-schedule-clinic-workspace" : ""}>
          ${moduleId === "schedule" ? renderScheduleDayPanel(module) : `<div class="panel list-panel">
            <div class="panel-header">
              <div>
                <h2>${module.listTitle}</h2>
              </div>
              ${["crm", "outreach"].includes(moduleId) ? `
                <div class="crm-list-search">
                  <input ${moduleId === "crm" ? "data-crm-search-input" : "data-outreach-search-input"} type="search" placeholder="${escapeHtml(module.searchLabel)}" aria-label="${escapeHtml(module.searchLabel)}" hidden>
                  <button class="list-search" ${moduleId === "crm" ? "data-crm-search-toggle" : "data-outreach-search-toggle"} type="button" aria-label="${escapeHtml(module.searchLabel)}">${icons.search}</button>
                </div>
              ` : `<button class="list-search" type="button" aria-label="Search">${icons.search}</button>`}
            </div>
            <div class="list">
              ${renderListRows(module)}
            </div>
          </div>`}

          <article class="panel detail-panel">
            <aside class="detail-side" data-standard-detail-side>
              ${moduleId === "crm" ? `<div data-crm-side-detail>` : moduleId === "outreach" ? `<div data-outreach-side-detail>` : ""}
              ${moduleId === "crm" ? renderCrmStatusControl() : moduleId === "outreach" ? renderOutreachStatusControl() : `
                <div class="status-line is-module-status">
                  <span class="status-dot"></span>
                  <span data-detail-status></span>
                </div>
              `}
              <h2 data-detail-title></h2>
              <div class="meta-list ${["schedule", "crm", "outreach"].includes(moduleId) ? "appointment-meta" : ""}">
                ${moduleId === "schedule" ? renderScheduleAppointmentMeta() : moduleId === "crm" ? renderCrmSideMeta() : renderMetaRows(module.sideFields)}
              </div>
              <section class="side-section" ${["schedule", "crm"].includes(moduleId) ? "data-standard-family" : ""}>
                <h3>${module.sideIcon ? `<span class="section-icon">${icons[module.sideIcon]}</span>` : ""}${module.sideTitle}</h3>
                ${["schedule", "crm"].includes(moduleId) ? renderScheduleFamilyRows(module) : renderSideRows(module)}
                ${module.sideLink ? `<button class="text-link" ${moduleId === "schedule" ? "data-open-client-profile" : ""} type="button">${module.sideLink}</button>` : ""}
              </section>
              ${moduleId === "crm" ? `</div><div class="crm-profile-editor-side-host" data-crm-side-editor hidden></div>` : moduleId === "outreach" ? `</div><div class="crm-profile-editor-side-host" data-outreach-side-editor hidden></div>` : ""}
            </aside>

            <div class="detail-main" data-standard-detail-main>
              <div
                class="tabs ${module.detailTabIcons?.length ? "has-icons" : ""}"
                ${moduleId === "crm" ? "data-crm-tabs" : ""}
                ${moduleId === "outreach" ? "data-outreach-tabs" : ""}
                ${module.detailTabIcons?.length ? `style="--detail-tab-count: ${module.detailTabs.length};"` : ""}
                role="tablist"
                aria-label="${module.label} detail tabs"
              >
                ${module.detailTabs.map((tab, index) => `
                  <button
                    class="${index === 0 ? "is-active" : ""}"
                    ${moduleId === "schedule" ? `data-schedule-detail-tab="${scheduleDetailTabKey(tab)}"` : moduleId === "crm" ? `data-crm-detail-tab="${crmDetailTabKey(tab)}"` : moduleId === "outreach" ? `data-outreach-detail-tab="${outreachDetailTabKey(tab)}"` : ""}
                    ${moduleId === "crm" ? `data-compact-label="${escapeHtml(tab === "Appointments" ? "Appts" : tab)}"` : ""}
                    aria-label="${escapeHtml(tab)}"
                    type="button"
                  >
                    ${module.detailTabIcons?.[index] ? `<span class="detail-tab-icon">${icons[module.detailTabIcons[index]]}</span>` : ""}
                    <span>${tab}</span>
                  </button>
                `).join("")}
              </div>

              ${moduleId === "schedule" ? `
                <div class="schedule-detail-panel" data-schedule-detail-panel="details">
                  ${renderCards(module)}
                  <p class="schedule-action-status" data-schedule-action-status role="status" aria-live="polite"></p>
                  <div class="footer-actions">
                    ${module.footerActions.map((action) => `<button data-schedule-action="${action.toLowerCase().replace("mark ", "").replaceAll(" ", "-")}" type="button">${action}</button>`).join("")}
                  </div>
                </div>
                <div class="schedule-detail-panel" data-schedule-detail-panel="wrap-up" hidden></div>
                <div class="schedule-detail-panel" data-schedule-detail-panel="appt-note" hidden></div>
                <div class="schedule-detail-panel" data-schedule-detail-panel="activity" hidden></div>
                <div class="schedule-detail-panel" data-schedule-detail-panel="forms" hidden></div>
              ` : moduleId === "crm" ? `
                <div data-crm-detail-content>
                  ${renderCrmDetailPanels(module)}
                  <p class="schedule-action-status" data-crm-action-status role="status" aria-live="polite"></p>
                  <div class="footer-actions" data-crm-footer-actions style="--crm-footer-action-count: ${module.footerActions.length};">
                    ${module.footerActions.map((action) => `<button data-crm-action="${action.toLowerCase().replaceAll(" ", "-")}" type="button">${action}</button>`).join("")}
                  </div>
                </div>
                <div class="crm-editor" data-crm-editor hidden></div>
              ` : moduleId === "outreach" ? `
                <div data-outreach-detail-content>
                  ${renderOutreachDetailPanels(module)}
                  <p class="schedule-action-status" data-outreach-action-status role="status" aria-live="polite"></p>
                  ${module.footerActions.length ? `
                    <div class="footer-actions" data-outreach-footer-actions style="--outreach-footer-action-count: ${module.footerActions.length};">
                      ${module.footerActions.map((action) => `<button data-outreach-action="${action.toLowerCase().replaceAll(" ", "-")}" type="button">${action}</button>`).join("")}
                    </div>
                  ` : ""}
                </div>
                <div class="crm-editor" data-outreach-editor hidden></div>
              ` : `
                ${renderCards(module)}
                <div class="footer-actions">
                  ${module.footerActions.map((action) => `<button type="button">${action}</button>`).join("")}
                </div>
              `}
            </div>
            ${moduleId === "schedule" ? renderBlockedTimeDetail() : ""}
            ${moduleId === "schedule" ? renderNewAppointmentPanel() : ""}
            ${moduleId === "schedule" ? renderBlockTimePanel() : ""}
          </article>
        </section>
        ${moduleId === "schedule" ? renderSchedulePrintCenter(module) : ""}
      </main>
    </div>
    ${moduleId === "schedule" ? renderRescheduleDialog() : ""}
  `;

  if (moduleId === "schedule") {
    setSchedulePanelMode("detail");
    setScheduleSubpage(module, scheduleSubpage);
  }
  if (moduleId === "outreach") {
    setOutreachPanelMode("detail");
  }
  updateDetail(module, selectedItemId);
}

function updateDetail(module, itemId) {
  selectedItemId = itemId;
  const item = itemId ? module.items.find((candidate) => candidate.id === itemId) : null;

  if (!item) {
    document.querySelectorAll(".list-row, .schedule-appointment, .schedule-week-appointment").forEach((row) => row.classList.remove("is-selected"));
    document.querySelector("[data-detail-title]").textContent = module === modules.schedule ? "No appointment selected" : "No record selected";
    const detailStatus = document.querySelector("[data-detail-status]");
    if (detailStatus) detailStatus.textContent = "";
    document.querySelector(".status-line")?.setAttribute("hidden", "");
    document.querySelectorAll("[data-appointment-date], [data-appointment-time], [data-field]").forEach((field) => {
      field.textContent = "-";
    });
    document.querySelectorAll("[data-prep-list]").forEach((list) => list.replaceChildren());
    setPrepSaveStatus("");
    updateScheduleActionAvailability(null);
    if (module === modules.schedule) {
      setAppointmentEditOpen(false);
      setSchedulePanelMode("detail");
      setScheduleDetailTab(module, "details");
    }
    if (module === modules.crm) {
      renderCrmDetailContent(null);
      crmClosePendingId = "";
      crmDeletePendingId = "";
      crmConvertPendingId = "";
      setCrmPanelMode("detail");
      setCrmDetailTab(crmDetailTab);
      updateCrmActionAvailability(null);
    }
    if (module === modules.outreach) {
      renderOutreachDetailContent(null);
      outreachDeletePendingId = "";
      setOutreachActionStatus("");
      setOutreachPanelMode("detail");
      setOutreachDetailTab(outreachDetailTab);
      updateOutreachActionAvailability(null);
    }
    return;
  }

  const isBlockedTime = module === modules.schedule && item.status === "Blocked";
  setBlockDeletePending(false);
  if (module === modules.schedule && (isBlockedTime || appointmentEditingId !== item.id)) {
    setAppointmentEditOpen(false);
  }

  document.querySelectorAll(".list-row, .schedule-appointment, .schedule-week-appointment").forEach((row) => {
    row.classList.toggle("is-selected", row.dataset.rowId === item.id);
  });

  document.querySelector("[data-detail-title]").textContent = item.title;
  const detailStatus = document.querySelector("[data-detail-status]");
  if (detailStatus) detailStatus.textContent = item.status;
  const crmStatusSelect = document.querySelector("[data-crm-status-select]");
  if (crmStatusSelect) {
    if (![...crmStatusSelect.options].some((option) => option.value === item.status)) {
      crmStatusSelect.add(new Option(item.status, item.status));
    }
    crmStatusSelect.value = item.status;
  }
  const outreachStatusSelect = document.querySelector("[data-outreach-status-select]");
  if (outreachStatusSelect) {
    if (![...outreachStatusSelect.options].some((option) => option.value === item.status)) {
      outreachStatusSelect.add(new Option(item.status, item.status));
    }
    outreachStatusSelect.value = item.status;
  }
  document.querySelector(".status-line")?.removeAttribute("hidden");

  const appointmentDate = document.querySelector("[data-appointment-date]");
  if (appointmentDate) {
    appointmentDate.textContent = formatAppointmentDate(item.date);
  }

  const appointmentTime = document.querySelector("[data-appointment-time]");
  if (appointmentTime) {
    appointmentTime.textContent = isBlockedTime
      ? `${formatScheduleTime(scheduleTimeMinutes(item.time))} - ${formatScheduleTime(scheduleTimeMinutes(item.endTime))}`
      : `${formatScheduleTime(scheduleTimeMinutes(item.time))} - ${item.duration} min`;
  }

  document.querySelectorAll("[data-field]").forEach((field) => {
    const value = fieldValue(item, field.dataset.field);
    if (module === modules.crm && renderCrmRelationshipField(field, item)) {
      return;
    }
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

  const lessonSteps = document.querySelector("[data-crm-lesson-steps]");
  if (lessonSteps) {
    lessonSteps.replaceChildren(...(item.lessonSteps || []).map((step, index) => {
      const row = document.createElement("li");
      row.className = step.state === "Done"
        ? "is-done"
        : step.state === "Next"
          ? "is-next"
          : "";
      row.style.setProperty("--lesson-color", step.color);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "crm-lesson-button";
      button.dataset.crmLessonValue = step.value;
      button.setAttribute("aria-label", `Set lesson progression to ${step.label}`);

      const marker = document.createElement("span");
      marker.className = "crm-lesson-marker";
      marker.textContent = String(index + 1);

      const copy = document.createElement("span");
      const label = document.createElement("strong");
      const state = document.createElement("em");
      label.textContent = step.label;
      state.textContent = step.state;
      copy.append(label, state);
      button.append(marker, copy);
      row.append(button);
      return row;
    }));
  }

  const thirdIcon = document.querySelector("[data-appointment-third-icon]");
  const thirdValue = document.querySelector("[data-appointment-third-value]");
  if (thirdIcon) thirdIcon.innerHTML = isBlockedTime ? icons.crm : icons.file;
  if (thirdValue) thirdValue.textContent = isBlockedTime ? item.staff : item.type;

  if (isBlockedTime) {
    const blockedFields = {
      "[data-block-detail-date]": formatAppointmentDate(item.date),
      "[data-block-detail-staff]": item.staff,
      "[data-block-detail-start]": formatScheduleTime(scheduleTimeMinutes(item.time)),
      "[data-block-detail-end]": formatScheduleTime(scheduleTimeMinutes(item.endTime)),
      "[data-block-detail-duration]": `${item.duration} min`,
      "[data-block-detail-notes]": item.notes || "-"
    };
    Object.entries(blockedFields).forEach(([selector, value]) => {
      const field = document.querySelector(selector);
      if (field) field.textContent = value;
    });
    setBlockActionStatus("");
  }

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
  updateScheduleActionAvailability(item);
  if (module === modules.schedule) {
    setSchedulePanelMode(schedulePanelMode);
    setScheduleDetailTab(module, scheduleDetailTab);
  }
  if (module === modules.crm) {
    crmClosePendingId = "";
    crmDeletePendingId = "";
    crmConvertPendingId = "";
    setCrmActionStatus("");
    renderCrmDetailContent(item);
    setCrmPanelMode(crmPanelMode);
    setCrmDetailTab(crmDetailTab);
    updateCrmActionAvailability(item);
  }
  if (module === modules.outreach) {
    outreachDeletePendingId = "";
    setOutreachActionStatus("");
    renderOutreachDetailContent(item);
    setOutreachPanelMode(outreachPanelMode);
    setOutreachDetailTab(outreachDetailTab);
    updateOutreachActionAvailability(item);
  }
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
    label.textContent = scheduleDateControlLabel();
  }
  if (input) {
    input.value = scheduleVisibleDate;
  }
  if (timeline) {
    timeline.innerHTML = renderScheduleViewContent(module);
  }

  const visibleAppointments = module.items.filter((item) => item.date === scheduleVisibleDate);
  const selectedVisible = visibleAppointments.find((item) => item.id === selectedItemId);
  scheduleDetailTab = "details";
  updateDetail(module, selectedVisible?.id || visibleAppointments[0]?.id || "");
  updateScheduleSummary(module);
  updateSchedulePrintCenter(module);
}

function setScheduleView(module, view) {
  if (!["day", "week"].includes(view) || view === scheduleViewMode) {
    return;
  }

  scheduleViewMode = view;
  document.querySelectorAll("[data-schedule-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scheduleView === scheduleViewMode);
  });
  document.querySelectorAll("[data-schedule-date-action='previous'], [data-schedule-date-action='next']").forEach((button) => {
    const direction = button.dataset.scheduleDateAction === "previous" ? "Previous" : "Next";
    button.setAttribute("aria-label", `${direction} ${scheduleViewMode}`);
  });
  updateScheduleDate(module, scheduleVisibleDate);
}

function updateScheduleSummary(module) {
  const visibleDates = scheduleViewMode === "week"
    ? new Set(scheduleWeekDateKeys())
    : new Set([scheduleVisibleDate]);
  const appointments = module.items.filter((item) => visibleDates.has(item.date) && item.status !== "Canceled");
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
      if (summary.dataset.summaryLabel === "Today") {
        summary.querySelector("span").textContent = scheduleViewMode === "week" ? "This Week" : "Today";
      }
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

function setScheduleActionStatus(message, state = "") {
  const status = document.querySelector("[data-schedule-action-status]");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.dataset.state = state;
}

function setScheduleWrapUpStatus(message, state = "") {
  const status = document.querySelector("[data-schedule-wrap-up-status]");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.dataset.state = state;
}

function setScheduleAppointmentNoteStatus(message, state = "") {
  const status = document.querySelector("[data-schedule-appointment-note-status]");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.dataset.state = state;
}

function updateScheduleActionAvailability(item = modules.schedule.items.find((candidate) => candidate.id === selectedItemId)) {
  document.querySelectorAll("[data-schedule-action]").forEach((button) => {
    const currentStatus = item?.status || "";
    const duplicateOutcome = (button.dataset.scheduleAction === "complete" && currentStatus === "Completed")
      || (button.dataset.scheduleAction === "no-show" && currentStatus === "No-show")
      || (button.dataset.scheduleAction === "reschedule" && currentStatus === "Rescheduled");
    button.disabled = scheduleActionBusy || !item || duplicateOutcome;
  });
}

function setScheduleActionBusy(busy) {
  scheduleActionBusy = busy;
  updateScheduleActionAvailability();
  document.querySelectorAll("[data-open-new-appointment], [data-open-block-time], [data-edit-block-time], [data-delete-block-time], [data-edit-appointment], [data-close-appointment-edit], [data-cancel-appointment], [data-save-appointment-edit]").forEach((button) => {
    button.disabled = busy;
  });
  const wrapUpButton = document.querySelector("[data-schedule-wrap-up-submit]");
  const selectedItem = modules.schedule.items.find((candidate) => candidate.id === selectedItemId);
  if (wrapUpButton) {
    wrapUpButton.disabled = busy || selectedItem?.status === "Completed";
  }
  const appointmentNoteButton = document.querySelector("[data-schedule-appointment-note-submit]");
  if (appointmentNoteButton) {
    appointmentNoteButton.disabled = busy || !selectedItem;
  }
  document.querySelector("[data-new-appointment-form]")?.setAttribute("aria-busy", String(busy));
  document.querySelector("[data-block-time-form]")?.setAttribute("aria-busy", String(busy));
  document.querySelector("[data-appointment-edit-form]")?.setAttribute("aria-busy", String(busy));
  document.querySelector("[data-schedule-wrap-up-form]")?.setAttribute("aria-busy", String(busy));
  document.querySelector("[data-schedule-appointment-note-form]")?.setAttribute("aria-busy", String(busy));
  document.querySelector("[data-blocked-detail-main]")?.setAttribute("aria-busy", String(busy));
  document.querySelector("[data-reschedule-dialog]")?.setAttribute("aria-busy", String(busy));
}

async function scheduleAuthedFetch(path, options = {}) {
  if (!scheduleCurrentUser) {
    throw new Error("Sign in before changing an appointment.");
  }

  const token = await scheduleCurrentUser.getIdToken();
  const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `The appointment service returned ${response.status}.`);
  }

  return response.json().catch(() => ({}));
}

function appointmentOccursAfter(candidate, item) {
  return `${candidate.date}T${candidate.time}` > `${item.date}T${item.time}`;
}

function mostRecentCompletedDate(module, clientId, excludedAppointmentId) {
  return module.items
    .filter((candidate) => candidate.id !== excludedAppointmentId
      && candidate.status === "Completed"
      && candidate.clientIds.includes(clientId))
    .map((candidate) => candidate.date)
    .filter(Boolean)
    .sort()
    .at(-1) || "";
}

async function updateScheduleClients(module, item, status, options = {}) {
  for (const clientId of item.clientIds) {
    const updates = {};

    if (status === "Completed") {
      const hasFutureAppointment = options.nextAppointmentScheduled ?? module.items.some((candidate) => candidate.id !== item.id
        && candidate.status === "Scheduled"
        && candidate.clientIds.includes(clientId)
        && appointmentOccursAfter(candidate, item));
      updates.status = hasFutureAppointment ? "Active" : "Needs Reschedule";
      updates.mostRecentAppointmentDate = item.date;
    }

    if (status === "No-show") {
      updates.status = "Needs Reschedule";
      updates.mostRecentAppointmentDate = mostRecentCompletedDate(module, clientId, item.id);
    }

    if (status === "Scheduled") {
      updates.status = /enrollment|inscripci[oó]n/i.test(item.type) ? "Scheduled" : "Active";
    }

    if (status === "Canceled") {
      const hasFutureAppointment = module.items.some((candidate) => candidate.id !== item.id
        && candidate.status === "Scheduled"
        && candidate.clientIds.includes(clientId)
        && appointmentOccursAfter(candidate, item));
      updates.status = hasFutureAppointment ? "Active" : "Needs Reschedule";
    }

    if (Object.keys(updates).length) {
      await scheduleAuthedFetch(`/api/clients/${encodeURIComponent(clientId)}`, {
        method: "PATCH",
        body: JSON.stringify(updates)
      });
    }
  }
}

async function saveScheduleOutcome(module, status) {
  const item = module.items.find((candidate) => candidate.id === selectedItemId);
  if (!item || scheduleActionBusy) {
    return;
  }

  setScheduleActionStatus("");
  setScheduleActionBusy(true);

  try {
    await scheduleAuthedFetch(`/api/appointments/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(appointmentStatusPayload(item, status))
    });
    await updateScheduleClients(module, item, status);
    selectedItemId = item.id;
    await loadScheduleData(scheduleCurrentUser);
    setScheduleActionStatus("");
  } catch (error) {
    console.error(error);
    setScheduleActionStatus(status === "Completed" ? "Could not complete appointment." : "Could not mark no show.", "error");
  } finally {
    setScheduleActionBusy(false);
  }
}

async function saveScheduleWrapUp(module, form) {
  const item = module.items.find((candidate) => candidate.id === selectedItemId);
  if (!item || scheduleActionBusy || item.status === "Completed") {
    return;
  }

  const formData = new FormData(form);
  const nextLesson = nextAppointmentLessonNumber(item);
  const shouldScheduleNext = Boolean(nextLesson && formData.get("scheduleNext"));
  const completionValues = {
    caregiverMood: formData.get("caregiverMood"),
    confidence: formData.get("confidence"),
    participation: formData.get("participation"),
    barriers: formData.get("barriers")
  };
  const nextValues = {
    appointmentDate: formData.get("nextAppointmentDate"),
    appointmentTime: formData.get("nextAppointmentTime"),
    staffMember: formData.get("nextAppointmentStaff"),
    goal: formData.get("nextAppointmentGoal"),
    notes: formData.get("nextAppointmentNotes")
  };

  if (shouldScheduleNext && (!nextValues.appointmentDate || !nextValues.appointmentTime)) {
    setScheduleWrapUpStatus("Add a date and time for the next appointment.", "error");
    return;
  }

  const completedPayload = completedAppointmentPayload(item, completionValues);
  const nextPayload = shouldScheduleNext ? nextAppointmentPayload(item, nextValues) : null;
  let nextAppointmentId = "";
  let completionSaved = false;

  setScheduleWrapUpStatus("");
  setScheduleActionBusy(true);

  try {
    if (nextPayload) {
      const result = await scheduleAuthedFetch("/api/appointments", {
        method: "POST",
        body: JSON.stringify(nextPayload)
      });
      nextAppointmentId = result.appointment?.id || "";
    }

    await scheduleAuthedFetch(`/api/appointments/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(completedPayload)
    });
    completionSaved = true;

    await updateScheduleClients(module, item, "Completed", {
      nextAppointmentScheduled: shouldScheduleNext || !nextLesson
    });

    scheduleVisibleDate = nextPayload?.appointmentDate || item.date;
    selectedItemId = nextAppointmentId || item.id;
    scheduleDetailTab = "details";
    await loadScheduleData(scheduleCurrentUser);
    setScheduleActionStatus("");
  } catch (error) {
    console.error(error);

    if (nextAppointmentId && !completionSaved) {
      await scheduleAuthedFetch(`/api/appointments/${encodeURIComponent(nextAppointmentId)}`, {
        method: "DELETE"
      }).catch((rollbackError) => console.error("Could not remove the unsaved next appointment.", rollbackError));
    }

    if (completionSaved) {
      scheduleDetailTab = "details";
      await loadScheduleData(scheduleCurrentUser).catch(() => {});
      setScheduleActionStatus("Appointment saved, but the client status could not be updated.", "error");
    } else {
      setScheduleWrapUpStatus(error.message || "Could not complete appointment.", "error");
    }
  } finally {
    setScheduleActionBusy(false);
  }
}

async function saveScheduleAppointmentNote(module, form) {
  const item = module.items.find((candidate) => candidate.id === selectedItemId);
  if (!item || scheduleActionBusy) {
    return;
  }

  const formData = new FormData(form);
  const payload = appointmentNotePayload(item, formData.get("appointmentNote"));

  setScheduleAppointmentNoteStatus("");
  setScheduleActionBusy(true);

  try {
    await scheduleAuthedFetch(`/api/appointments/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    selectedItemId = item.id;
    await loadScheduleData(scheduleCurrentUser);
    scheduleDetailTab = "appt-note";
    setScheduleDetailTab(module, "appt-note");
    setScheduleAppointmentNoteStatus("Appointment note saved.");
  } catch (error) {
    console.error(error);
    setScheduleAppointmentNoteStatus(error.message || "Could not save appointment note.", "error");
  } finally {
    setScheduleActionBusy(false);
  }
}

function openRescheduleDialog(module) {
  const item = module.items.find((candidate) => candidate.id === selectedItemId);
  const dialog = document.querySelector("[data-reschedule-dialog]");
  if (!item || !dialog || scheduleActionBusy) {
    return;
  }

  dialog.querySelector("[data-reschedule-title]").textContent = item.title;
  dialog.querySelector("[data-reschedule-date]").value = item.date;
  dialog.querySelector("[data-reschedule-time]").value = item.time;
  dialog.querySelector("[data-reschedule-notes]").value = item.source?.notes || "";
  const staff = dialog.querySelector("[data-reschedule-staff]");
  if (item.staff && ![...staff.options].some((option) => option.value === item.staff)) {
    staff.add(new Option(item.staff, item.staff));
  }
  staff.value = item.staff || "Cynthia Esparza";
  dialog.querySelector("[data-reschedule-status]").textContent = "";
  dialog.showModal();
}

function closeRescheduleDialog() {
  const dialog = document.querySelector("[data-reschedule-dialog]");
  if (dialog?.open && !scheduleActionBusy) {
    dialog.close();
  }
}

async function saveReschedule(module, form) {
  const item = module.items.find((candidate) => candidate.id === selectedItemId);
  if (!item || scheduleActionBusy) {
    return;
  }

  const values = {
    appointmentDate: form.querySelector("[data-reschedule-date]").value,
    appointmentTime: form.querySelector("[data-reschedule-time]").value,
    staffMember: form.querySelector("[data-reschedule-staff]").value,
    notes: form.querySelector("[data-reschedule-notes]").value
  };
  const status = form.querySelector("[data-reschedule-status]");

  if (!values.appointmentDate || !values.appointmentTime) {
    status.textContent = "Add a date and time.";
    return;
  }

  if (values.appointmentDate === item.date && values.appointmentTime === item.time) {
    status.textContent = "Choose a new date or time.";
    return;
  }

  const { original, replacement } = rescheduleAppointmentPayloads(item, values);
  const saveButton = form.querySelector("[data-save-reschedule]");
  let originalRetired = false;
  let replacementCreated = false;

  status.textContent = "";
  saveButton.disabled = true;
  setScheduleActionBusy(true);

  try {
    await scheduleAuthedFetch(`/api/appointments/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(original)
    });
    originalRetired = true;

    const result = await scheduleAuthedFetch("/api/appointments", {
      method: "POST",
      body: JSON.stringify(replacement)
    });
    replacementCreated = true;
    await updateScheduleClients(module, item, "Scheduled");

    scheduleVisibleDate = values.appointmentDate;
    selectedItemId = result.appointment?.id || "";
    form.closest("dialog")?.close();
    await loadScheduleData(scheduleCurrentUser);
    setScheduleActionStatus("");
  } catch (error) {
    console.error(error);
    if (originalRetired && !replacementCreated) {
      await scheduleAuthedFetch(`/api/appointments/${encodeURIComponent(item.id)}`, {
        method: "PATCH",
        body: JSON.stringify(appointmentStatusPayload(item, item.source?.status || item.status))
      }).catch((restoreError) => console.error("Could not restore the original appointment.", restoreError));
    }
    status.textContent = error.message || "Could not reschedule appointment.";
  } finally {
    saveButton.disabled = false;
    setScheduleActionBusy(false);
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
    const [appointmentsResponse, clientsResponse, settingsResult, activityLogsResult] = await Promise.all([
      fetch(`${apiBaseUrl}/api/appointments`, { headers }),
      fetch(`${apiBaseUrl}/api/clients`, { headers }),
      fetch(`${apiBaseUrl}/api/admin/scheduling-settings`, { headers })
        .then(async (response) => response.ok ? response.json() : { schedulingSettings: scheduleSettings })
        .catch(() => ({ schedulingSettings: scheduleSettings })),
      fetch(`${apiBaseUrl}/api/activity-logs`, { headers })
        .then(async (response) => response.ok ? response.json() : { activityLogs: [] })
        .catch(() => ({ activityLogs: [] }))
    ]);

    if (!appointmentsResponse.ok || !clientsResponse.ok) {
      throw new Error(`Data service returned ${appointmentsResponse.status}/${clientsResponse.status}`);
    }

    const [{ appointments = [] }, { clients = [] }] = await Promise.all([
      appointmentsResponse.json(),
      clientsResponse.json()
    ]);
    scheduleClients = [...clients].sort((first, second) => clientFullName(first).localeCompare(clientFullName(second)));
    scheduleClientsById = new Map(scheduleClients.map((client) => [client.id, client]));
    scheduleActivityLogs = activityLogsResult.activityLogs || [];
    scheduleSettings = settingsResult.schedulingSettings || scheduleSettings;
    module.items = appointments
      .filter((appointment) => appointment.status !== "Canceled")
      .map((appointment) => mapAppointment(appointment, scheduleClientsById))
      .filter((appointment) => appointment.date && appointment.time)
      .sort((first, second) => first.date.localeCompare(second.date) || first.time.localeCompare(second.time));

    scheduleDataState = "ready";
    scheduleDataMessage = "";
    if (!scheduleHandoffHandled) {
      const query = new URLSearchParams(window.location.search);
      const requestedAppointmentId = query.get("appointment");
      const requestedClientId = query.get("client");
      const requestedAppointment = module.items.find((item) => item.id === requestedAppointmentId);
      if (requestedAppointment) {
        scheduleVisibleDate = requestedAppointment.date;
        selectedItemId = requestedAppointment.id;
      } else if (query.get("date") && /^\d{4}-\d{2}-\d{2}$/.test(query.get("date"))) {
        scheduleVisibleDate = query.get("date");
      }
      scheduleHandoffHandled = Boolean(requestedAppointmentId || requestedClientId || query.get("new"));
      updateScheduleDate(module, scheduleVisibleDate);
      if (query.get("new") === "1" && requestedClientId) {
        openNewAppointmentPanel([requestedClientId]);
      }
      return;
    }
    updateScheduleDate(module, scheduleVisibleDate);
  } catch (error) {
    console.error(error);
    scheduleDataState = "error";
    scheduleDataMessage = "Appointments could not be loaded. Check the local data service and try again.";
    scheduleClients = [];
    scheduleClientsById = new Map();
    scheduleActivityLogs = [];
    module.items = [];
    updateScheduleDate(module, scheduleVisibleDate);
  }
}

async function loadCrmData(user, requestedItemId = selectedItemId) {
  const module = modules.crm;
  const preferredItemId = requestedItemId;
  crmDataMessage = `Loading ${crmSubpage.toLowerCase()}...`;
  refreshStandardModuleData(module);
  selectedItemId = preferredItemId;

  try {
    const token = await user.getIdToken();
    const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
    const headers = { Authorization: `Bearer ${token}` };
    const [clientsResponse, referralsResponse, networkResponse, appointmentsResult, activityLogsResult] = await Promise.all([
      fetch(`${apiBaseUrl}/api/clients`, { headers }),
      fetch(`${apiBaseUrl}/api/referrals`, { headers }),
      fetch(`${apiBaseUrl}/api/referral-network`, { headers }),
      fetch(`${apiBaseUrl}/api/appointments`, { headers })
        .then(async (response) => response.ok ? response.json() : { appointments: [] })
        .catch(() => ({ appointments: [] })),
      fetch(`${apiBaseUrl}/api/activity-logs`, { headers })
        .then(async (response) => response.ok ? response.json() : { activityLogs: [] })
        .catch(() => ({ activityLogs: [] }))
    ]);

    if (!clientsResponse.ok || !referralsResponse.ok || !networkResponse.ok) {
      throw new Error(`CRM services returned ${clientsResponse.status}/${referralsResponse.status}/${networkResponse.status}`);
    }

    const [{ clients = [] }, { referrals = [] }, { entries = [] }] = await Promise.all([
      clientsResponse.json(),
      referralsResponse.json(),
      networkResponse.json()
    ]);
    crmRawClients = clients;
    crmRawReferrals = referrals;
    crmRawNetworkEntries = entries;
    crmAppointments = appointmentsResult.appointments || [];
    crmActivityLogs = activityLogsResult.activityLogs || [];
    crmClientItems = mapCrmClients(crmRawClients, {
      appointments: crmAppointments,
      activityLogs: crmActivityLogs
    });
    crmReferralItems = mapCrmReferrals(crmRawReferrals, { activityLogs: crmActivityLogs });
    crmNetworkItems = mapCrmNetworkEntries(crmRawNetworkEntries);
    configureCrmModule(crmSubpage);
    module.items = crmAllItems.filter((item) => crmCurrentMatcher(item, crmSearchQuery));
    module.summary = crmCurrentSummary(crmAllItems);
    crmDataMessage = module.items.length
      ? ""
      : crmAllItems.length
        ? `No ${crmSubpage.toLowerCase()} match this search.`
        : crmEmptyMessage();
    selectedItemId = preferredItemId;
    refreshStandardModuleData(module);
    setCrmDetailTab(crmDetailTab);
    openCrmOutreachReferralHandoff();
  } catch (error) {
    console.error(error);
    crmRawClients = [];
    crmRawReferrals = [];
    crmRawNetworkEntries = [];
    crmAppointments = [];
    crmActivityLogs = [];
    crmClientItems = [];
    crmReferralItems = [];
    crmNetworkItems = [];
    crmAllItems = [];
    module.items = [];
    module.summary = crmCurrentSummary([]);
    crmDataMessage = "CRM records could not be loaded. Check the local data service and try again.";
    refreshStandardModuleData(module);
  }
}

async function loadOutreachData(user, preferredItemId = selectedItemId) {
  const module = modules.outreach;
  outreachDataMessage = `Loading outreach ${outreachSubpage.toLowerCase()}...`;

  try {
    const token = await user.getIdToken();
    const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
    const headers = { Authorization: `Bearer ${token}` };
    const [eventsResponse, contactsResponse, tasksResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/api/outreach-events`, { headers }),
      fetch(`${apiBaseUrl}/api/outreach-contacts`, { headers }),
      fetch(`${apiBaseUrl}/api/tasks`, { headers })
    ]);

    if (!eventsResponse.ok || !contactsResponse.ok || !tasksResponse.ok) {
      throw new Error(`Outreach services returned ${eventsResponse.status}/${contactsResponse.status}/${tasksResponse.status}`);
    }

    const [{ events = [] }, { contacts = [] }, { tasks = [] }] = await Promise.all([
      eventsResponse.json(),
      contactsResponse.json(),
      tasksResponse.json()
    ]);
    outreachRawEvents = events;
    outreachRawContacts = contacts;
    outreachRawTasks = tasks;
    outreachContactItems = mapOutreachContacts(outreachRawContacts, outreachRawEvents);
    outreachTaskItems = mapOutreachTasks(outreachRawTasks, outreachRawEvents);
    outreachEventItems = mapOutreachEvents(outreachRawEvents, {
      contacts: outreachRawContacts,
      tasks: outreachRawTasks
    });
    configureOutreachModule(outreachSubpage);
    outreachDataMessage = "";
    refreshOutreachData(module, preferredItemId);
    setOutreachDetailTab(outreachDetailTab);
  } catch (error) {
    console.error(error);
    outreachRawEvents = [];
    outreachRawContacts = [];
    outreachRawTasks = [];
    outreachEventItems = [];
    outreachContactItems = [];
    outreachTaskItems = [];
    outreachAllItems = [];
    module.items = [];
    module.summary = outreachSummary([], []);
    outreachDataMessage = "Outreach records could not be loaded. Check the local data service and try again.";
    refreshStandardModuleData(module);
  }
}

async function initializeOutreachData() {
  if (currentModuleId() !== "outreach") {
    return;
  }

  try {
    const [{ initializeApp }, { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js")
    ]);
    const auth = getAuth(initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG));
    const provider = new GoogleAuthProvider();
    outreachOpenSignIn = () => {
      if (!outreachCurrentUser) {
        signInWithPopup(auth, provider).catch((error) => console.error(error));
      }
    };
    refreshOutreachAccountControl();

    onAuthStateChanged(auth, (user) => {
      outreachCurrentUser = user;
      refreshOutreachAccountControl();
      if (user) {
        loadOutreachData(user);
        return;
      }

      outreachRawEvents = [];
      outreachRawContacts = [];
      outreachRawTasks = [];
      outreachEventItems = [];
      outreachContactItems = [];
      outreachTaskItems = [];
      configureOutreachModule(outreachSubpage);
      modules.outreach.items = [];
      modules.outreach.summary = outreachSummary([], []);
      outreachDataMessage = `Sign in with your SNACK Google account to load outreach ${outreachSubpage.toLowerCase()}.`;
      refreshStandardModuleData(modules.outreach);
    });
  } catch (error) {
    console.error(error);
    outreachDataMessage = "The secure sign-in connection could not be started.";
    refreshStandardModuleData(modules.outreach);
  }
}

async function initializeCrmData() {
  if (currentModuleId() !== "crm") {
    return;
  }

  try {
    const [{ initializeApp }, { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js")
    ]);
    const auth = getAuth(initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG));
    const provider = new GoogleAuthProvider();
    const openSignIn = () => {
      if (!crmCurrentUser) {
        signInWithPopup(auth, provider).catch((error) => console.error(error));
      }
    };
    crmOpenSignIn = openSignIn;
    refreshCrmAccountControl();

    onAuthStateChanged(auth, (user) => {
      crmCurrentUser = user;
      refreshCrmAccountControl();
      if (user) {
        loadCrmData(user);
        return;
      }

      crmClientItems = [];
      crmReferralItems = [];
      crmNetworkItems = [];
      modules.crm.items = [];
      modules.crm.summary = crmCurrentSummary([]);
      crmDataMessage = `Sign in with your SNACK Google account to load ${crmSubpage.toLowerCase()}.`;
      refreshStandardModuleData(modules.crm);
    });
  } catch (error) {
    console.error(error);
    crmDataMessage = "The secure sign-in connection could not be started.";
    refreshStandardModuleData(modules.crm);
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
      scheduleActivityLogs = [];
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
      const activeNavigationId = isOperationsOutreachReport() ? "operations" : moduleId;
      if (nextId !== activeNavigationId) {
        location.href = pageUrl(nextId);
      }
      return;
    }

    const operationsSubpageButton = event.target.closest("[data-operations-subpage]");
    if (operationsSubpageButton) {
      location.href = operationsSubpageButton.dataset.operationsSubpage === "Reports"
        ? "./operations.html?section=Reports"
        : "./operations.html";
      return;
    }

    const scheduleSubpageButton = event.target.closest("[data-schedule-subpage]");
    if (moduleId === "schedule" && scheduleSubpageButton) {
      setScheduleSubpage(module, scheduleSubpageButton.dataset.scheduleSubpage);
      return;
    }

    const crmSubpageButton = event.target.closest("[data-crm-subpage]");
    if (moduleId === "crm" && crmSubpageButton) {
      setCrmSubpage(crmSubpageButton.dataset.crmSubpage);
      return;
    }

    const outreachSubpageButton = event.target.closest("[data-outreach-subpage]");
    if (moduleId === "outreach" && outreachSubpageButton) {
      setOutreachSubpage(outreachSubpageButton.dataset.outreachSubpage);
      return;
    }

    const outreachViewButton = event.target.closest("[data-outreach-view]");
    if (moduleId === "outreach" && outreachViewButton) {
      setOutreachSubpage(outreachViewButton.dataset.outreachView);
      return;
    }

    if (moduleId === "crm" && event.target.closest(".account")) {
      crmOpenSignIn?.();
      return;
    }

    if (moduleId === "outreach" && event.target.closest(".account")) {
      outreachOpenSignIn?.();
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-new-event]")) {
      if (outreachSubpage !== "Events") setOutreachSubpage("Events");
      openOutreachEditor("event");
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-new-contact]")) {
      const eventItem = outreachSubpage === "Events" ? outreachSelectedItem() : null;
      openOutreachEditor("contact", null, { eventId: eventItem?.id || "" });
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-new-task]")) {
      const eventItem = outreachSubpage === "Events" ? outreachSelectedItem() : null;
      openOutreachEditor("task", null, { eventId: eventItem?.id || "" });
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-log-outcome]")) {
      const eventItem = outreachSubpage === "Events" ? outreachSelectedItem() : null;
      if (eventItem) openOutreachEditor("outcome", eventItem);
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-close-outreach-editor]")) {
      closeOutreachEditor();
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-search-toggle]")) {
      const input = document.querySelector("[data-outreach-search-input]");
      if (!input) return;
      if (input.hidden) {
        input.hidden = false;
        input.focus();
      } else if (!input.value) {
        input.hidden = true;
      } else {
        input.focus();
        input.select();
      }
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-new-client]")) {
      if (crmSubpage !== "Clients") setCrmSubpage("Clients");
      openCrmClientEditor();
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-new-referral]")) {
      if (crmSubpage !== "Referrals") setCrmSubpage("Referrals");
      openCrmReferralEditor();
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-new-network]")) {
      if (crmSubpage !== "Referral Network") setCrmSubpage("Referral Network");
      openCrmNetworkEditor();
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-close-crm-editor]")) {
      closeCrmEditor();
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-search-toggle]")) {
      const input = document.querySelector("[data-crm-search-input]");
      if (!input) return;
      if (input.hidden) {
        input.hidden = false;
        input.focus();
      } else if (!input.value) {
        input.hidden = true;
      } else {
        input.focus();
        input.select();
      }
      return;
    }

    const crmStatusControl = event.target.closest(".crm-status-control");
    if (moduleId === "crm" && crmStatusControl && !event.target.closest("select")) {
      const select = crmStatusControl.querySelector("select");
      if (select && !select.disabled) {
        event.preventDefault();
        if (typeof select.showPicker === "function") {
          try {
            select.showPicker();
          } catch {
            select.focus();
            select.click();
          }
        } else {
          select.focus();
          select.click();
        }
      }
      return;
    }

    const outreachStatusControl = event.target.closest(".outreach-status-control");
    if (moduleId === "outreach" && outreachStatusControl && !event.target.closest("select")) {
      const select = outreachStatusControl.querySelector("select");
      if (select && !select.disabled) {
        event.preventDefault();
        if (typeof select.showPicker === "function") {
          try {
            select.showPicker();
          } catch {
            select.focus();
            select.click();
          }
        } else {
          select.focus();
          select.click();
        }
      }
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-edit-event]")) {
      openOutreachEditor("event", outreachSelectedItem());
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-edit-contact]")) {
      openOutreachEditor("contact", outreachSelectedItem());
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-edit-task]")) {
      openOutreachEditor("task", outreachSelectedItem());
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-delete-editor]")) {
      deleteOutreachRecord(outreachSelectedItem());
      return;
    }

    const outreachContact = event.target.closest("[data-outreach-contact-id]");
    if (moduleId === "outreach" && outreachContact) {
      setOutreachSubpage("Contacts");
      updateDetail(modules.outreach, outreachContact.dataset.outreachContactId);
      return;
    }

    const outreachAction = event.target.closest("[data-outreach-action]");
    if (moduleId === "outreach" && outreachAction) {
      const item = outreachSelectedItem();
      const action = outreachAction.dataset.outreachAction;
      if (action === "log-outcome") openOutreachEditor("outcome", item);
      if (action === "add-contact") openOutreachEditor("contact", null, { eventId: item?.id || "" });
      if (action === "create-task") openOutreachEditor("task", null, { eventId: item?.id || "" });
      if (action === "edit" && item?.kind === "contact") openOutreachEditor("contact", item);
      if (action === "edit" && item?.kind === "task") openOutreachEditor("task", item);
      if (action === "new-referral") openOutreachContactReferral(item);
      if (action === "mark-done") saveOutreachStatus(item, "Done");
      if (action === "delete") deleteOutreachRecord(item);
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-edit-client]")) {
      openCrmClientEditor(crmSelectedItem());
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-edit-referral]")) {
      openCrmReferralEditor(crmSelectedItem());
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-edit-network]")) {
      openCrmNetworkEditor(crmSelectedItem());
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-edit-notes]")) {
      openCrmClientEditor(crmSelectedItem(), { notesOnly: true });
      return;
    }

    const crmLogContact = event.target.closest("[data-crm-log-contact]");
    if (moduleId === "crm" && crmLogContact) {
      openCrmActivityEditor(crmSelectedItem(), crmLogContact.dataset.crmLogContact || "Call");
      return;
    }

    const crmAppointment = event.target.closest("[data-crm-appointment-id]");
    if (moduleId === "crm" && crmAppointment) {
      const appointment = crmSelectedItem()?.appointments?.find((item) => item.id === crmAppointment.dataset.crmAppointmentId);
      openCrmAppointment(appointment);
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-new-appointment]")) {
      openCrmNewAppointment(crmSelectedItem());
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-referral-convert]")) {
      convertCrmReferral(crmSelectedItem());
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-add-crm-provider]")) {
      const list = document.querySelector("[data-crm-provider-editor-list]");
      if (list) list.insertAdjacentHTML("beforeend", renderCrmProviderEditorRows([{ id: "", name: "", email: "", notes: "" }]));
      return;
    }

    const removeProvider = event.target.closest("[data-remove-crm-provider]");
    if (moduleId === "crm" && removeProvider) {
      const row = removeProvider.closest("[data-crm-provider-row]");
      const list = row?.parentElement;
      row?.remove();
      if (list && !list.querySelector("[data-crm-provider-row]")) {
        list.insertAdjacentHTML("beforeend", renderCrmProviderEditorRows([{ id: "", name: "", email: "", notes: "" }]));
      }
      return;
    }

    const crmLesson = event.target.closest("[data-crm-lesson-value]");
    if (moduleId === "crm" && crmLesson) {
      saveCrmLesson(crmSelectedItem(), crmLesson.dataset.crmLessonValue);
      return;
    }

    const relatedProfile = event.target.closest("[data-crm-related-id]");
    if (moduleId === "crm" && relatedProfile) {
      const section = relatedProfile.dataset.crmRelatedSection || "Clients";
      setCrmSubpage(section);
      updateDetail(modules.crm, relatedProfile.dataset.crmRelatedId);
      return;
    }

    const providerProfile = event.target.closest("[data-crm-provider-network-id]");
    if (moduleId === "crm" && providerProfile) {
      setCrmSubpage("Referral Network");
      updateDetail(modules.crm, providerProfile.dataset.crmProviderNetworkId);
      setCrmDetailTab("providers");
      return;
    }

    const crmAction = event.target.closest("[data-crm-action]");
    if (moduleId === "crm" && crmAction) {
      const item = crmSelectedItem();
      const action = crmAction.dataset.crmAction;
      if (action === "log-call") openCrmActivityEditor(item, "Call");
      if (action === "log-text") openCrmActivityEditor(item, "Text");
      if (action === "new-appt") openCrmNewAppointment(item);
      if (action === "close-client") closeCrmClient(item);
      if (action === "convert") convertCrmReferral(item);
      if (action === "delete") deleteCrmEntity(item);
      if (action === "edit") openCrmNetworkEditor(item);
      if (action === "new-referral") {
        setCrmSubpage("Referrals");
        openCrmReferralEditor();
      }
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-open-schedule-print-center]")) {
      setScheduleSubpage(module, "Print Forms");
      return;
    }

    const schedulePrintAction = event.target.closest("[data-schedule-print-action]");
    if (moduleId === "schedule" && schedulePrintAction) {
      openSchedulePrint(module, schedulePrintAction.dataset.schedulePrintAction);
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-open-new-appointment]")) {
      openNewAppointmentPanel();
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-open-block-time]")) {
      openBlockTimePanel();
      return;
    }

    const newAppointmentClientOption = event.target.closest("[data-new-appointment-client-option]");
    if (moduleId === "schedule" && newAppointmentClientOption) {
      addNewAppointmentClient(newAppointmentClientOption.dataset.newAppointmentClientOption);
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-add-new-appointment-client]")) {
      const firstOption = document.querySelector("[data-new-appointment-client-option]");
      if (firstOption) {
        addNewAppointmentClient(firstOption.dataset.newAppointmentClientOption);
      } else {
        setNewAppointmentStatus("Start typing an existing client name.");
      }
      return;
    }

    const removeNewAppointmentClientButton = event.target.closest("[data-remove-new-appointment-client]");
    if (moduleId === "schedule" && removeNewAppointmentClientButton) {
      removeNewAppointmentClient(removeNewAppointmentClientButton.dataset.removeNewAppointmentClient);
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-close-new-appointment]")) {
      closeNewAppointmentPanel();
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-close-block-time]")) {
      closeBlockTimePanel();
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-edit-block-time]")) {
      if (blockTimeDeletePendingId === selectedItemId) {
        setBlockDeletePending(false);
        return;
      }
      const item = module.items.find((candidate) => candidate.id === selectedItemId);
      if (item?.status === "Blocked") {
        openBlockTimePanel(item);
      }
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-delete-block-time]")) {
      deleteSelectedBlockTime(module);
      return;
    }

    const scheduleView = event.target.closest("[data-schedule-view]");
    if (moduleId === "schedule" && scheduleView) {
      setScheduleView(module, scheduleView.dataset.scheduleView);
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-open-schedule-date-picker]")) {
      const input = document.querySelector("[data-schedule-date-input]");
      if (typeof input?.showPicker === "function") {
        input.showPicker();
      } else {
        input?.click();
      }
      return;
    }

    const weekDay = event.target.closest("[data-schedule-week-day]");
    if (moduleId === "schedule" && weekDay) {
      scheduleVisibleDate = weekDay.dataset.scheduleWeekDay;
      setScheduleView(module, "day");
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-edit-appointment]")) {
      openAppointmentEdit(module);
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-close-appointment-edit]")) {
      closeAppointmentEdit();
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-cancel-appointment]")) {
      cancelSelectedAppointment(module);
      return;
    }

    const row = event.target.closest("[data-row-id]");
    if (row) {
      if (moduleId === "schedule" && schedulePanelMode !== "detail") {
        setSchedulePanelMode("detail");
      }
      if (moduleId === "schedule" && row.dataset.rowDate && row.dataset.rowDate !== scheduleVisibleDate) {
        updateScheduleDate(module, row.dataset.rowDate);
      }
      if (moduleId === "schedule") {
        scheduleDetailTab = "details";
      }
      if (moduleId === "crm") {
        crmDetailTab = "overview";
        crmPanelMode = "detail";
        resetCrmCloseAction();
      }
      if (moduleId === "outreach") {
        outreachDetailTab = outreachDetailTabKey(module.detailTabs[0]);
        outreachPanelMode = "detail";
        outreachDeletePendingId = "";
        setOutreachActionStatus("");
      }
      updateDetail(module, row.dataset.rowId);
      return;
    }

    const scheduleDateAction = event.target.closest("[data-schedule-date-action]");
    if (moduleId === "schedule" && scheduleDateAction) {
      const action = scheduleDateAction.dataset.scheduleDateAction;
      const step = scheduleViewMode === "week" ? 7 : 1;
      const nextDate = action === "today"
        ? scheduleDateKey(new Date())
        : offsetScheduleDate(scheduleVisibleDate, action === "previous" ? -step : step);
      updateScheduleDate(module, nextDate);
      return;
    }

    const scheduleAction = event.target.closest("[data-schedule-action]");
    if (moduleId === "schedule" && scheduleAction) {
      const action = scheduleAction.dataset.scheduleAction;
      if (action === "complete") {
        setScheduleDetailTab(module, "wrap-up");
      } else if (action === "no-show") {
        saveScheduleOutcome(module, "No-show");
      } else if (action === "reschedule") {
        openRescheduleDialog(module);
      }
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-open-client-profile]")) {
      const item = module.items.find((candidate) => candidate.id === selectedItemId);
      const clientId = item?.clientIds?.[0];
      if (clientId) {
        location.href = `./crm.html?client=${encodeURIComponent(clientId)}`;
      }
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-close-reschedule]")) {
      closeRescheduleDialog();
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
      if (moduleId === "schedule" && detailTab.dataset.scheduleDetailTab) {
        setScheduleDetailTab(module, detailTab.dataset.scheduleDetailTab);
        return;
      }
      if (moduleId === "crm" && detailTab.dataset.crmDetailTab) {
        setCrmDetailTab(detailTab.dataset.crmDetailTab);
        return;
      }
      if (moduleId === "outreach" && detailTab.dataset.outreachDetailTab) {
        setOutreachDetailTab(detailTab.dataset.outreachDetailTab);
        return;
      }
      document.querySelectorAll(".tabs button").forEach((item) => item.classList.remove("is-active"));
      detailTab.classList.add("is-active");
    }
  });

  document.addEventListener("change", (event) => {
    if (moduleId === "crm" && event.target.matches("[data-crm-status-select]")) {
      saveCrmStatus(crmSelectedItem(), event.target.value, event.target);
      return;
    }

    if (moduleId === "outreach" && event.target.matches("[data-outreach-status-select]")) {
      saveOutreachStatus(outreachSelectedItem(), event.target.value, event.target);
      return;
    }

    if (moduleId === "crm" && event.target.matches("[data-crm-provider-organization]")) {
      const selectedOrganizationId = event.target.value;
      document.querySelectorAll("[data-crm-provider-group]").forEach((group) => {
        const isSelected = group.dataset.crmProviderGroup === selectedOrganizationId;
        group.hidden = !isSelected;
        group.querySelectorAll('input[name="providerIds"]').forEach((checkbox) => {
          checkbox.disabled = !isSelected;
        });
      });
      const prompt = document.querySelector("[data-crm-provider-prompt]");
      if (prompt) prompt.hidden = Boolean(selectedOrganizationId);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-print-center-date]")) {
      updateScheduleDate(module, event.target.value);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-schedule-date-input]")) {
      updateScheduleDate(module, event.target.value);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-new-appointment-service]")) {
      syncNewAppointmentServiceFields();
      renderNewAppointmentTimeOptions();
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-new-appointment-date], [data-new-appointment-time], [data-new-appointment-status-select]")) {
      syncNewAppointmentSummary();
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-block-time-time]")) {
      renderBlockTimeEndTimeOptions();
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-block-time-date], [data-block-time-end-time], [data-block-time-staff]")) {
      syncBlockTimeSummary();
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-appointment-edit-type]")) {
      setAppointmentCancelPending(false);
      syncAppointmentEditTypeFields();
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-appointment-edit-form]")) {
      setAppointmentCancelPending(false);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-prep-item-key]")) {
      savePrepCheckbox(module, event.target);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-wrap-up-schedule-next]")) {
      syncScheduleWrapUpFields();
    }
  });

  document.addEventListener("input", (event) => {
    if (moduleId === "crm" && event.target.matches("[data-crm-search-input]")) {
      applyCrmSearch(module, event.target.value);
      return;
    }

    if (moduleId === "outreach" && event.target.matches("[data-outreach-search-input]")) {
      applyOutreachSearch(module, event.target.value);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-new-appointment-client-search]")) {
      renderNewAppointmentClientOptions(event.target.value);
    }
  });

  document.addEventListener("focusin", (event) => {
    if (moduleId === "schedule" && event.target.matches("[data-new-appointment-client-search]")) {
      renderNewAppointmentClientOptions(event.target.value);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (moduleId === "crm" && event.target.closest(".account") && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      crmOpenSignIn?.();
      return;
    }

    if (moduleId === "outreach" && event.target.closest(".account") && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      outreachOpenSignIn?.();
      return;
    }

    if (moduleId === "outreach" && event.target.matches("[data-outreach-search-input]") && event.key === "Escape") {
      event.target.value = "";
      event.target.hidden = true;
      applyOutreachSearch(module, "");
      document.querySelector("[data-outreach-search-toggle]")?.focus();
      return;
    }

    if (moduleId === "crm" && event.target.matches("[data-crm-search-input]") && event.key === "Escape") {
      event.target.value = "";
      event.target.hidden = true;
      applyCrmSearch(module, "");
      document.querySelector("[data-crm-search-toggle]")?.focus();
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-new-appointment-client-search]") && event.key === "Enter") {
      const firstOption = document.querySelector("[data-new-appointment-client-option]");
      if (firstOption) {
        event.preventDefault();
        addNewAppointmentClient(firstOption.dataset.newAppointmentClientOption);
      }
    }
  });

  document.addEventListener("submit", (event) => {
    if (moduleId === "outreach" && event.target.matches("[data-outreach-event-form]")) {
      event.preventDefault();
      saveOutreachEvent(event.target);
      return;
    }

    if (moduleId === "outreach" && event.target.matches("[data-outreach-contact-form]")) {
      event.preventDefault();
      saveOutreachContact(event.target);
      return;
    }

    if (moduleId === "outreach" && event.target.matches("[data-outreach-task-form]")) {
      event.preventDefault();
      saveOutreachTask(event.target);
      return;
    }

    if (moduleId === "outreach" && event.target.matches("[data-outreach-outcome-form]")) {
      event.preventDefault();
      saveOutreachOutcome(event.target);
      return;
    }

    if (moduleId === "crm" && event.target.matches("[data-crm-client-form]")) {
      event.preventDefault();
      saveCrmClient(event.target);
      return;
    }

    if (moduleId === "crm" && event.target.matches("[data-crm-referral-form]")) {
      event.preventDefault();
      saveCrmReferral(event.target);
      return;
    }

    if (moduleId === "crm" && event.target.matches("[data-crm-network-form]")) {
      event.preventDefault();
      saveCrmNetwork(event.target);
      return;
    }

    if (moduleId === "crm" && event.target.matches("[data-crm-activity-form]")) {
      event.preventDefault();
      saveCrmActivity(event.target);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-new-appointment-form]")) {
      event.preventDefault();
      saveNewAppointment(module, event.target);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-block-time-form]")) {
      event.preventDefault();
      saveBlockTime(module, event.target);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-appointment-edit-form]")) {
      event.preventDefault();
      saveAppointmentEdit(module, event.target);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-reschedule-form]")) {
      event.preventDefault();
      saveReschedule(module, event.target);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-schedule-wrap-up-form]")) {
      event.preventDefault();
      saveScheduleWrapUp(module, event.target);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-schedule-appointment-note-form]")) {
      event.preventDefault();
      saveScheduleAppointmentNote(module, event.target);
    }
  });

  document.querySelector("[data-reschedule-dialog]")?.addEventListener("cancel", (event) => {
    if (scheduleActionBusy) {
      event.preventDefault();
    }
  });

}

const moduleId = currentModuleId();
if (moduleId === "crm") configureCrmModule(crmSubpage);
if (moduleId === "outreach") configureOutreachModule(outreachSubpage);
renderModulePage(moduleId);
bindModulePage(moduleId);
initializeScheduleData();
initializeCrmData();
initializeOutreachData();
