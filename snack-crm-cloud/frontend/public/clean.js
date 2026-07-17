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
    detailTabs: ["Details", "Wrap Up", "Appt Note", "Activity", "Forms"],
    detailTabIcons: ["calendar", "check", "file", "history", "file"],
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
const newAppointmentClientIds = new Set();

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
              <button
                class="${activeId === "schedule" ? (label === scheduleSubpage ? "is-current" : "") : (index === 0 ? "is-current" : "")}"
                ${activeId === "schedule" && ["Clinic", "Print Forms"].includes(label) ? `data-schedule-subpage="${escapeHtml(label)}"` : ""}
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

function renderScheduleFamilyRows(module) {
  return module.sideFields.map(([label, key]) => `
    <div class="meta-row">
      <span>${label}</span>
      <strong class="${key === "siblings" ? "is-stacked-list" : ""}" data-field="${key}"></strong>
    </div>
  `).join("");
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

function openNewAppointmentPanel() {
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
    ${module.label === "Schedule" && card.title === "Prep" ? renderPrepCard(card) : module.label === "Schedule" && card.title === "Details" ? renderAppointmentDetailsCard(card) : `<section class="detail-card">
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
  if (!module.subpages.includes(label)) return;
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
            <button class="quick-button" ${moduleId === "schedule" && action === "New Appointment" ? "data-open-new-appointment" : ""} ${moduleId === "schedule" && action === "Block Time" ? "data-open-block-time" : ""} ${moduleId === "schedule" && action === "Print Schedule" ? "data-schedule-print-action=\"schedule\"" : ""} type="button">${icon("plus")}${action}</button>
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
            <h1 data-page-title>${module.title}</h1>
          </div>

          <div class="header-actions" ${moduleId === "schedule" ? "data-schedule-header-actions" : ""}>
            <div class="view-switch" role="group" aria-label="${module.label} views" style="grid-template-columns: repeat(${module.views.length}, minmax(86px, 1fr));">
              ${module.views.map((view, index) => `
                <button
                  class="${moduleId === "schedule" ? (view.toLowerCase() === scheduleViewMode ? "is-active" : "") : (index === 0 ? "is-active" : "")}"
                  ${moduleId === "schedule" ? `data-schedule-view="${view.toLowerCase()}"` : ""}
                  type="button"
                >${view}</button>
              `).join("")}
            </div>
            <button class="primary-action" ${moduleId === "schedule" ? "data-open-new-appointment" : ""} type="button">${icons.plus}${module.primaryAction}</button>
          </div>
        </header>

        <section class="summary-strip" ${moduleId === "schedule" ? "data-schedule-summary" : ""} aria-label="${module.label} summary">
          ${module.summary.map(([value, label]) => `
            <div class="summary-item" data-summary-label="${escapeHtml(label)}">
              <strong>${escapeHtml(value)}</strong>
              <span>${label}</span>
            </div>
          `).join("")}
        </section>

        <section class="workspace" ${moduleId === "schedule" ? "data-schedule-clinic-workspace" : ""}>
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
            <aside class="detail-side" data-standard-detail-side>
              <div class="status-line is-module-status">
                <span class="status-dot"></span>
                <span data-detail-status></span>
              </div>
              <h2 data-detail-title></h2>
              <div class="meta-list ${moduleId === "schedule" ? "appointment-meta" : ""}">
                ${moduleId === "schedule" ? renderScheduleAppointmentMeta() : renderMetaRows(module.sideFields)}
              </div>
              <section class="side-section" ${moduleId === "schedule" ? "data-standard-family" : ""}>
                <h3>${module.sideIcon ? `<span class="section-icon">${icons[module.sideIcon]}</span>` : ""}${module.sideTitle}</h3>
                ${moduleId === "schedule" ? renderScheduleFamilyRows(module) : renderSideRows(module)}
                <button class="text-link" type="button">${module.sideLink}</button>
              </section>
            </aside>

            <div class="detail-main" data-standard-detail-main>
              <div class="tabs" role="tablist" aria-label="${module.label} detail tabs">
                ${module.detailTabs.map((tab, index) => `
                  <button
                    class="${index === 0 ? "is-active" : ""}"
                    ${moduleId === "schedule" ? `data-schedule-detail-tab="${scheduleDetailTabKey(tab)}"` : ""}
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
  updateDetail(module, selectedItemId);
}

function updateDetail(module, itemId) {
  selectedItemId = itemId;
  const item = itemId ? module.items.find((candidate) => candidate.id === itemId) : null;

  if (!item) {
    document.querySelectorAll(".list-row, .schedule-appointment, .schedule-week-appointment").forEach((row) => row.classList.remove("is-selected"));
    document.querySelector("[data-detail-title]").textContent = "No appointment selected";
    document.querySelector("[data-detail-status]").textContent = "";
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
  document.querySelector("[data-detail-status]").textContent = item.status;
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
      if (nextId !== moduleId) {
        location.href = pageUrl(nextId);
      }
      return;
    }

    const scheduleSubpageButton = event.target.closest("[data-schedule-subpage]");
    if (moduleId === "schedule" && scheduleSubpageButton) {
      setScheduleSubpage(module, scheduleSubpageButton.dataset.scheduleSubpage);
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
      document.querySelectorAll(".tabs button").forEach((item) => item.classList.remove("is-active"));
      detailTab.classList.add("is-active");
    }
  });

  document.addEventListener("change", (event) => {
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
    if (moduleId === "schedule" && event.target.matches("[data-new-appointment-client-search]") && event.key === "Enter") {
      const firstOption = document.querySelector("[data-new-appointment-client-option]");
      if (firstOption) {
        event.preventDefault();
        addNewAppointmentClient(firstOption.dataset.newAppointmentClientOption);
      }
    }
  });

  document.addEventListener("submit", (event) => {
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
renderModulePage(moduleId);
bindModulePage(moduleId);
initializeScheduleData();
