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
  completedLessonForNextAppointment,
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
  scheduleClientOutcomeUpdates,
  scheduleDateKey,
  scheduleTimeKey,
  scheduleTimeMinutes,
  scheduleTimeOptions,
  scheduleWeekDates
} from "./modules/schedule.js?v=20260805-duration1";
import {
  mapProgramSessions,
  normalizeProgramScheduleSettings,
  programClientContact,
  programClientSearchResults,
  programRegistrationPayload,
  programScheduleSummary,
  programSessionPayload
} from "./modules/program-schedule.js?v=20260805-kitchen-picker1";
import {
  appointmentNotePage,
  appointmentPrepPage,
  dailyAppointmentNotePages,
  dailyFormPacketRequests,
  dailyFormsPrintDocumentHtml,
  dailyPrepPages,
  dailyPrintPacketPages,
  dailySchedulePages,
  printDocumentHtml,
  printableScheduleItems,
  selectedPrintDocumentHtml
} from "./modules/schedule-print.js?v=20260808-select1";
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
  crmClientStatusColor,
  crmClientStatusTone,
  crmStatusLabel,
  crmStatusOptions,
  crmSummary,
  formatClientDate,
  languageOptions,
  lessonProgression,
  mapCrmClients,
  preferredContactOptions,
  referralTypeOptions,
  setCrmClientStatusDefinitions
} from "./modules/crm.js?v=20260804-statuses1";
import {
  crmCompletedTaskItems,
  crmDashboardItems,
  crmDashboardTaskSummary
} from "./modules/crm-dashboard.js?v=20260805-tasks-fullwidth1";
import {
  clinicEvaluationResponseForPoint,
  clinicFormUrl,
  clinicHealthInstrumentFor,
  clinicInstrumentForFormType,
  clinicKnowledgeInstrumentFor,
  clinicKnowledgeQuestionsForInstrument,
  clinicKnowledgeResponseResult,
  clinicKnowledgeScoreSummary,
  clinicLegacyResponsesForClient,
  clinicNativeFormActions
} from "./modules/clinic-evaluation.js?v=20260805-appointment-link1";
import {
  crmConfirmDecision,
  crmNetworkMatches,
  crmNetworkPayload,
  crmNetworkSummary,
  crmReferralActivityPayload,
  crmReferralStatusTone,
  crmReferralMatches,
  crmReferralPayload,
  crmReferralProviderLinks,
  crmReferralSummary,
  mapCrmNetworkEntries,
  mapCrmReferrals,
  referralNetworkTypeOptions,
  referralStatusOptions
} from "./modules/referrals.js?v=20260728-workflow1";
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
  outreachLeadIsConverted,
  outreachLeadsForView,
  outreachReport,
  outreachSummary,
  outreachTaskMatches,
  outreachTaskPayload,
  outreachTaskPriorityOptions,
  outreachTaskStatusOptions
} from "./modules/outreach.js?v=20260722-audiences2";
import {
  mapVolunteerOpportunities,
  mapVolunteerProfiles,
  volunteerMatches,
  volunteerOpportunityPayload,
  volunteerProfilePayload,
  volunteerSummary
} from "./modules/volunteers.js?v=20260810-v1";
import {
  campaignMatches,
  campaignPayload,
  campaignStatusOptions,
  campaignSummary,
  campaignsWithGiftRollups,
  donorMatches,
  donorPayload,
  donorStatusOptions,
  donorSummary,
  donorsWithGiftRollups,
  financialActivityMatches,
  financialActivityPayload,
  financialActivityPeriod,
  financialActivitySummary,
  financialActivityTotals,
  financialActivityTypeOptions,
  financialGiftActivityTypeOptions,
  formatGrantMoney,
  giftMatches,
  giftPayload,
  giftPaymentMethodOptions,
  giftRecurringFrequencyOptions,
  giftSummary,
  giftTypeOptions,
  fundraisingSummary,
  grantDeadlineItems,
  grantDeleteDecision,
  grantDocumentFileSignatureError,
  grantDocumentFileError,
  grantDocumentMimeType,
  grantDocumentPayload,
  grantDocumentPreviewKind,
  grantDocumentRows,
  grantDocumentsWithoutIndex,
  grantPreviewClickIsOutside,
  grantMatches,
  grantMovePayload,
  grantOrganizationInfoPayload,
  grantPayload,
  grantPipelineColumns,
  grantPipelineGroups,
  grantQuestionPayload,
  grantStatusOptions,
  mapCampaigns,
  mapDonors,
  mapFinancialActivities,
  mapGifts,
  mapGrantOrganizationInfo,
  mapGrantQuestions,
  mapGrants
} from "./modules/fundraising.js?v=20260807-document-preview2";
import {
  defaultMarketingAudienceGroups,
  formatMarketingDateTime,
  mapMarketingCampaigns,
  mapMarketingSubscribers,
  marketingCampaignFilterOptions,
  marketingCommunicationPreferenceOptions,
  marketingCampaignMatches,
  marketingCampaignPayload,
  marketingCampaignTypeOptions,
  marketingCampaignsForFilter,
  marketingChannelOptions,
  marketingDashboardData,
  marketingDashboardSummary,
  marketingDefaultsForSubpage,
  marketingRecipientsForTargets,
  marketingSubscriberMatches,
  marketingSubscriberPayload,
  marketingSubscriberStatusOptions,
  marketingSubscriberSummary,
  marketingStatusOptions,
  marketingSummary
} from "./modules/marketing.js?v=20260722-dashboard1";
import {
  budgetCategoryGroups,
  budgetCategoryPayload,
  budgetPlanningSummary,
  formatOperationsValue,
  hrsnBillingSummary,
  hrsnClaimMatches,
  hrsnClaimPayload,
  hrsnClaimStatus,
  hrsnCoveredPopulationOptions,
  hrsnDescriptionOptions,
  hrsnOutcomeOptions,
  operationsCalculationModes,
  operationsCoreMetrics,
  operationsCurrentQuarterPeriod,
  operationsDashboardData,
  operationsDirections,
  operationsEvaluationFilters,
  operationsEvaluationInstrumentPayload,
  operationsEvaluationMappingStatuses,
  operationsEvaluationMetricGaps,
  operationsEvaluationQuestionPayload,
  operationsEvaluationQuestions as defaultOperationsEvaluationQuestions,
  operationsEvaluationQuestionsForFilter,
  operationsEvaluationRecordStatuses,
  operationsEvaluationSummary,
  operationsExecutiveDashboardData,
  operationsMetricDefinitionPayload,
  operationsMetricMatches,
  operationsMetricsForArea,
  operationsMeasurementPayload,
  operationsPeriodLabel,
  operationsProgramAreaLabel,
  operationsProgramAreas,
  operationsReportingFrequencies,
  operationsSummary,
  operationsTargetProgress,
  operationsTargetHistory,
  mergeOperationsEvaluationQuestions
} from "./modules/operations.js?v=20260728-finances1";
import {
  accountMenuUiState,
  cleanModulePageTitle,
  cleanModuleSummaryVisible,
  sessionCountdownLabel,
  staffPageAccessDecision
} from "./modules/shell.js?v=20260807-session-countdown1";
import {
  homeDashboardData
} from "./modules/home.js?v=20260729-home1";
import {
  importDefinitions as adminImportDefinitions,
  prepareAdminCsvImport,
  setAdminClientStatuses
} from "./modules/admin-data.js?v=20260804-statuses1";

const icons = {
  home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/></svg>`,
  schedule: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4M4 9h16M6 4h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>`,
  crm: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="8" r="2.4"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M14.8 16.4A4.8 4.8 0 0 1 21 20"/></svg>`,
  outreach: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14h4l9 5V5l-9 5H4z"/><path d="M20 9.5a4 4 0 0 1 0 5"/></svg>`,
  fundraising: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  marketing: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 18-7-7 18-3-8-8-3zM11 14l10-10"/></svg>`,
  operations: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M8 15v-4M12 15V7M16 15v-6"/></svg>`,
  utensils: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2v6M10 2v6M6 5h4M8 8v14M16 2v20M16 2c3 2 3 6 0 8"/></svg>`,
  admin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 8.92 4a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.47.52.82 1 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4M4 9h16M6 4h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>`,
  history: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>`,
  file: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l4 4v16H6zM14 2v5h5"/></svg>`,
  note: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/></svg>`,
  columns: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v16H4zM14 4h6v16h-6z"/></svg>`,
  building: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5l8-3 8 3v16M8 8h1M8 12h1M8 16h1M15 8h1M15 12h1M15 16h1M10 21v-3h4v3"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`
};

const moduleOrder = ["schedule", "crm", "outreach", "fundraising", "marketing", "operations", "admin"];
const defaultStaffModuleAccess = Object.freeze({
  Admin: Object.freeze([...moduleOrder]),
  Manager: Object.freeze(["schedule", "crm", "outreach", "fundraising"]),
  Staff: Object.freeze(["schedule", "crm", "outreach"]),
  Intern: Object.freeze(["schedule", "outreach"])
});
const financeSectionOrder = Object.freeze(["Financial Activity", "Grants", "HRSN Billing", "Budget", "Giving"]);
let staffAccessProfile = null;
let secureAuth = null;
let secureAuthApi = null;
let secureSessionTimer = 0;
let secureSessionWarningTimer = 0;
let secureSessionCountdownTimer = 0;
let secureSessionEndsAt = 0;
let secureSessionEventsBound = false;
let secureSessionPolicy = { inactivityMinutes: 120, warningMinutes: 5 };
let homeCurrentUser = null;
let homeDataState = "loading";
let homeDataMessage = "Loading today's highlights...";
let homeAppointments = [];
let homeClients = [];
let homeReferrals = [];
let homeTasks = [];
let homeStaffDirectory = [];
let homeTaskAssigneeFilter = "mine";
let homeProgramSessions = [];
let homeOutreachEvents = [];
let homeOpenSignIn = null;

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
  ["YCCO Member ID", "yccoId"],
  ["First Appointment", "firstAppt"],
  ["Email Opt Out", "emailOptOut"],
  ["HRSN", "hrsn"],
  ["Graduation Date", "graduationDate"],
  ["Text Opt Out", "textOptOut"],
  ["Service Email Consent", "serviceEmailConsent"],
  ["Service Text Consent", "serviceTextConsent"],
  ["Marketing Email Consent", "marketingConsent"],
  ["Consent Source", "consentSource"],
  ["Consent Date", "consentDate"]
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
  ["YCCO Member ID", "yccoId"],
  ["First Appointment", "firstAppt"],
  ["Service Email Consent", "serviceEmailConsent"],
  ["Service Text Consent", "serviceTextConsent"],
  ["Marketing Email Consent", "marketingConsent"],
  ["Consent Source", "consentSource"],
  ["Consent Date", "consentDate"],
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
  home: {
    label: "Home",
    title: "Home",
    icon: "home",
    tone: "navy",
    theme: ["var(--navy)", "var(--navy-soft)", "#cfd5df"],
    subpages: [],
    views: [],
    primaryAction: "",
    quickActions: [],
    summary: [],
    listTitle: "",
    searchLabel: "",
    footerActions: [],
    detailTabs: [],
    detailTabIcons: [],
    sideTitle: "",
    sideIcon: "home",
    sideLink: "",
    sideFields: [],
    cards: [],
    items: []
  },
  schedule: {
    label: "Schedule",
    title: "Clinic Schedule",
    icon: "schedule",
    tone: "red",
    theme: ["var(--red)", "var(--red-soft)", "#f4b4b6"],
    subpages: ["Clinic", "Kitchen", "School", "Public Booking"],
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
    summary: [["0", "Reschedule"], ["0", "Scheduled"], ["0", "Active"], ["0", "Waiting on Family"]],
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
    subpages: ["Events", "Leads", "Volunteers"],
    views: ["Events", "Leads"],
    primaryAction: "New Event",
    quickActions: ["New Event", "Log Outcome", "Add Lead"],
    summary: [["0", "Annual events"], ["0", "Families reached"], ["0", "New Leads"], ["$0", "Event costs"]],
    listTitle: "Events",
    footerActions: ["Log Outcome", "Add Lead", "Create Task"],
    detailTabs: ["Logistics", "Outcomes", "Leads"],
    detailTabIcons: ["calendar", "check", "crm"],
    sideTitle: "Event Lead",
    sideLink: "Open Event Plan",
    sideFields: [["Date", "date"], ["Location", "place"], ["Cost", "cost"], ["Contact", "contact"], ["Deadline", "deadline"]],
    cards: [
      { title: "Logistics", fields: [["Registration", "registration"], ["Setup", "setup"], ["Contact", "contact"], ["Deadline", "deadline"]] },
      { title: "Event Outcomes", fields: [["Main activity", "activity"], ["Giveaways", "giveaways"], ["Families interacted with", "families"], ["Leads and signups", "leads"]] },
      { title: "Leads Generated", fields: [] }
    ],
    items: []
  },
  fundraising: {
    label: "Finances",
    title: "Finances",
    icon: "fundraising",
    tone: "green",
    theme: ["var(--success)", "var(--success-soft)", "#a8d8b8"],
    subpages: ["Financial Activity", "Grants", "HRSN Billing", "Budget", "Giving"],
    views: [],
    primaryAction: "New Grant",
    quickActions: ["New Grant"],
    summary: [["0", "Open Grants"], ["0", "Due in 45 Days"], ["0", "Submitted"], ["0", "Awarded"]],
    listTitle: "Grants",
    searchLabel: "Search grants",
    footerActions: ["Edit", "New Grant", "Delete"],
    detailTabs: ["Funding", "Reporting", "Contacts", "Documents"],
    detailTabIcons: ["fundraising", "calendar", "crm", "file"],
    sideTitle: "Foundation",
    sideIcon: "fundraising",
    sideLink: "",
    sideFields: [["Deadline", "deadline"], ["Requested", "requested"], ["Award Expected", "awardExpected"], ["Focus Areas", "focusAreas"], ["Recurrence", "recurrence"], ["Contact", "contact"]],
    cards: [],
    items: []
  },
  marketing: {
    label: "Marketing",
    title: "Marketing",
    icon: "marketing",
    tone: "blue",
    theme: ["var(--blue)", "var(--blue-soft)", "#aecbfa"],
    subpages: ["Dashboard", "Campaigns", "Contacts", "Templates"],
    views: [],
    primaryAction: "New Campaign",
    quickActions: ["New Campaign"],
    summary: [["0", "Active"], ["0", "Scheduled"], ["0", "Sent"], ["0", "Largest Audience"]],
    listTitle: "Campaigns",
    searchLabel: "Search campaigns",
    footerActions: ["Edit", "New Campaign", "Delete"],
    detailTabs: ["Message", "Audience", "Delivery", "Results"],
    detailTabIcons: ["marketing", "crm", "calendar", "operations"],
    sideTitle: "Delivery",
    sideIcon: "marketing",
    sideLink: "",
    sideFields: [["Channel", "channel"], ["Type", "campaignType"], ["Send Date", "sendDate"], ["Owner", "owner"], ["Audience", "audience"]],
    cards: [],
    items: []
  },
  operations: {
    label: "Operations",
    title: "Operations",
    icon: "operations",
    tone: "navy",
    theme: ["var(--navy)", "var(--navy-soft)", "#cfd5df"],
    subpages: ["Dashboard", "Performance", "Evaluation", "Reports"],
    views: [],
    primaryAction: "",
    quickActions: [],
    summary: [["0", "Live Measures"], ["0", "Needs Definition"], ["0", "Manual Values Due"], ["0", "Data Issues"]],
    listTitle: "Performance Measures",
    footerActions: [],
    detailTabs: [],
    sideTitle: "",
    sideLink: "",
    sideFields: [],
    cards: [],
    items: []
  },
  admin: {
    label: "Admin",
    title: "Admin",
    icon: "admin",
    tone: "purple",
    theme: ["var(--purple)", "var(--purple-soft)", "#c8b7f0"],
    subpages: ["Settings", "Schedule", "Integrations"],
    views: [],
    primaryAction: "",
    quickActions: [],
    summary: [],
    listTitle: "",
    footerActions: [],
    detailTabs: [],
    sideTitle: "",
    sideLink: "",
    sideFields: [],
    cards: [],
    items: []
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
const requestedScheduleSubpage = new URLSearchParams(window.location.search).get("section");
let scheduleSubpage = modules.schedule.subpages.includes(requestedScheduleSubpage)
  ? requestedScheduleSubpage
  : "Clinic";
const requestedAdminSubpage = new URLSearchParams(window.location.search).get("section");
const requestedAdminSettingsTab = new URLSearchParams(window.location.search).get("tab");
const adminSettingsTabs = Object.freeze(["Team", "Access", "CRM", "Forms", "Data"]);
const legacyAdminSections = Object.freeze({
  Team: { section: "Settings", tab: "Team" },
  Access: { section: "Settings", tab: "Access" },
  Forms: { section: "Settings", tab: "Forms" },
  Data: { section: "Settings", tab: "Data" },
  Scheduling: { section: "Schedule", tab: "Team" }
});
const legacyAdminSelection = legacyAdminSections[requestedAdminSubpage];
let adminSubpage = modules.admin.subpages.includes(requestedAdminSubpage)
  ? requestedAdminSubpage
  : legacyAdminSelection?.section || "Settings";
let adminSettingsTab = adminSettingsTabs.includes(requestedAdminSettingsTab)
  ? requestedAdminSettingsTab
  : legacyAdminSelection?.tab || "Team";
let adminCurrentUser = null;
let adminOpenSignIn = null;
let adminDataState = "loading";
let adminDataMessage = adminSubpage === "Schedule"
  ? "Loading scheduling settings..."
  : adminSubpage === "Integrations"
    ? "Checking connections..."
    : adminSettingsTab === "Access"
      ? "Loading access settings..."
      : adminSettingsTab === "Team"
        ? "Loading team profiles..."
        : "";
let adminStaffUsers = [];
let adminAccessLevels = [];
let adminAccessModules = moduleOrder.map((id) => ({ id, name: modules[id].label }));
let adminFinanceSections = [...financeSectionOrder];
let adminAccessActionBusy = false;
let adminAccessLevelActionBusy = false;
let adminAccessLevelDeletePendingId = "";
let adminAccountDeletePendingEmail = "";
let adminClientStatuses = [];
let adminCrmSettingsActionBusy = false;
let adminTeamActionBusy = false;
let adminDataActionBusy = false;
let adminDataCollections = [];
let adminDataImportPreview = null;
let adminSecurityEvents = [];
let adminSecurityEventTotal = 0;
let adminIntegrationActionBusy = false;
let adminIntegrationStatus = {
  api: "checking",
  authentication: "checking",
  database: "checking",
  calendar: "checking",
  calendarMode: "Checking connection...",
  mailerLite: "checking",
  mailerLiteMode: "Checking connection...",
  workspaceEmail: "checking",
  workspaceEmailMode: "Checking connection...",
  workspaceEmailSender: "appointments@snackprogram.org",
  twilio: "checking",
  twilioLabel: "Checking",
  twilioMode: "Checking connection..."
};
let blockTimeEditingId = "";
let blockTimeDeletePendingId = "";
let appointmentEditingId = "";
let appointmentCancelPendingId = "";
let scheduleClients = [];
let scheduleClientsById = new Map();
let scheduleActivityLogs = [];
let scheduleEvaluationInstruments = [];
let scheduleEvaluationResponses = [];
let scheduleSettings = normalizeProgramScheduleSettings({
  bookableStartTime: "13:30",
  bookableEndTime: "18:00",
  weekdays: [2, 3, 4],
  slotIntervalMinutes: 15
});
let scheduleServices = [...newAppointmentServices];
let programRawSessions = [];
let programRawRegistrations = [];
let programScheduleItems = [];
let programSelectedSessionId = "";
let programScheduleDataState = "loading";
let programScheduleMessage = "Loading program sessions...";
let programSchedulePanelMode = "detail";
let programScheduleDetailTab = "details";
let programEditingSessionId = "";
let programEditingRegistrationId = "";
let programSelectedClientIds = [];
let programClientSearchQuery = "";
let programDeletePendingId = "";
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
let crmRawTasks = [];
let crmEvaluationInstruments = [];
let crmEvaluationQuestions = [];
let crmEvaluationResponses = [];
let crmDashboardQueueItems = [];
const crmDashboardExpandedQueues = new Set();
const crmExpandedClientStatuses = new Set(["Needs Reschedule", "Scheduled", "Active"]);
const crmExpandedReferralStatuses = new Set(["New", "Texted", "Left Voicemail", "Emailed", "Requested Call Back", "Scheduled"]);
let crmDashboardTaskBusyId = "";
let crmDashboardActionMessage = "";
let crmDashboardTaskView = "open";
let crmDashboardTaskDialogBusy = false;
let crmDetailTab = new URLSearchParams(window.location.search).get("tab") === "forms"
  ? "forms"
  : "overview";
let crmPanelMode = "detail";
let crmEditorKind = "";
let crmEditingClientId = "";
let crmEditingReferralId = "";
let crmEditingNetworkId = "";
let crmNetworkSourceReferralId = "";
let crmSearchQuery = "";
let crmClosePendingId = "";
let crmDeletePendingId = "";
let crmConvertPendingId = "";
let crmActionBusy = false;
let crmOpenSignIn = null;
let crmOutreachHandoffHandled = false;
let crmOutreachContactId = "";
let crmCommunicationsDrawerOpen = false;
let crmCommunicationsMode = "text";
let crmCommunicationsReviewing = false;
let crmCommunicationsDraft = "";
const crmInitialParams = new URLSearchParams(window.location.search);
const crmRequestedSubpage = ["Dashboard", "Tasks"].includes(crmInitialParams.get("section"))
  ? "Clients"
  : crmInitialParams.get("section");
let crmSubpage = ["Clients", "Referrals", "Referral Network"].includes(crmRequestedSubpage)
  ? crmRequestedSubpage
  : crmInitialParams.get("client")
    ? "Clients"
    : crmInitialParams.get("referral")
      ? "Referrals"
    : "Clients";
let outreachCurrentUser = null;
let outreachDataMessage = "Loading outreach events...";
let outreachRawEvents = [];
let outreachRawContacts = [];
let outreachRawTasks = [];
let outreachRawVolunteerProfiles = [];
let outreachRawVolunteerOpportunities = [];
let outreachEventItems = [];
let outreachContactItems = [];
let outreachTaskItems = [];
let outreachVolunteerProfileItems = [];
let outreachVolunteerOpportunityItems = [];
let outreachAllItems = [];
let outreachDetailTab = "logistics";
let outreachPanelMode = "detail";
let outreachEditorKind = "";
let outreachEditingEventId = "";
let outreachEditingContactId = "";
let outreachEditingTaskId = "";
let outreachEditingVolunteerProfileId = "";
let outreachEditingVolunteerOpportunityId = "";
let outreachSearchQuery = "";
let outreachDeletePendingId = "";
let outreachActionBusy = false;
let outreachOpenSignIn = null;
const outreachInitialSection = new URLSearchParams(window.location.search).get("section");
const normalizedOutreachInitialSection = outreachInitialSection === "Contacts" ? "Leads" : outreachInitialSection;
let outreachSubpage = (["Events", "Leads", "Volunteers"].includes(normalizedOutreachInitialSection)
  || (normalizedOutreachInitialSection === "Reports" && isOperationsOutreachReport()))
  ? normalizedOutreachInitialSection
  : "Events";
let outreachLeadView = new URLSearchParams(window.location.search).get("leadView") === "history" ? "history" : "active";
let outreachVolunteerView = new URLSearchParams(window.location.search).get("view") === "Opportunities" ? "Opportunities" : "Profiles";
if (outreachSubpage === "Volunteers") {
  outreachDetailTab = outreachVolunteerView === "Profiles" ? "profile" : "overview";
} else if (outreachSubpage === "Leads") {
  outreachDetailTab = "overview";
} else if (outreachSubpage === "Reports") {
  outreachDetailTab = "annual-report";
}
const volunteerProfileStatusOptions = Object.freeze(["Applicant", "Pending Review", "Approved", "Active", "Inactive", "Declined"]);
const volunteerOpportunityStatusOptions = Object.freeze(["Draft", "Open", "Filled", "Completed", "Canceled"]);
const volunteerBackgroundCheckOptions = Object.freeze(["Not Started", "Not Required", "Pending", "Cleared", "Needs Review"]);
let fundraisingCurrentUser = null;
let fundraisingDataMessage = "Loading Finance records...";
let fundraisingRawGrants = [];
let fundraisingRawDonors = [];
let fundraisingRawGifts = [];
let fundraisingRawCampaigns = [];
let fundraisingRawFinancialActivity = [];
let fundraisingRawQuestions = [];
let fundraisingOrganizationInfo = mapGrantOrganizationInfo({});
let fundraisingGrantItems = [];
let fundraisingDonorItems = [];
let fundraisingGiftItems = [];
let fundraisingCampaignItems = [];
let fundraisingFinancialActivityItems = [];
let fundraisingQuestionItems = [];
let fundraisingDetailTab = "funding";
let fundraisingWorkspaceView = ["Pipeline", "Details", "Deadlines", "Answer Library", "Organization", "Documents"]
  .includes(new URLSearchParams(window.location.search).get("view"))
  ? new URLSearchParams(window.location.search).get("view")
  : "Pipeline";
let fundraisingSelectedQuestionId = "";
let fundraisingQuestionEditorMode = "";
let fundraisingQuestionDeletePendingId = "";
let fundraisingOrganizationEditing = false;
let fundraisingDocumentEditorOpen = false;
let fundraisingDocumentDeletePendingId = "";
let fundraisingStorage = null;
let fundraisingStorageApi = null;
let fundraisingDocumentPreviewObjectUrl = "";
let fundraisingDraggedGrantId = "";
let fundraisingPanelMode = "detail";
let fundraisingEditingRecordId = "";
let fundraisingSearchQuery = "";
let fundraisingDeletePendingId = "";
let fundraisingActionBusy = false;
let fundraisingOpenSignIn = null;
const fundraisingInitialSection = new URLSearchParams(window.location.search).get("section");
const fundraisingNormalizedInitialSection = fundraisingInitialSection === "Earned Income"
  ? "Financial Activity"
  : ["Gifts", "Donors", "Campaigns"].includes(fundraisingInitialSection)
    ? "Giving"
    : fundraisingInitialSection;
let fundraisingSubpage = modules.fundraising.subpages.includes(fundraisingNormalizedInitialSection)
  ? fundraisingNormalizedInitialSection
  : "Financial Activity";
let fundraisingGivingView = ["Gifts", "Donors", "Campaigns"].includes(new URLSearchParams(window.location.search).get("view"))
  ? new URLSearchParams(window.location.search).get("view")
  : ["Gifts", "Donors", "Campaigns"].includes(fundraisingInitialSection)
    ? fundraisingInitialSection
    : "Gifts";
let fundraisingFinancialView = ["Dashboard", "Ledger"].includes(new URLSearchParams(window.location.search).get("view"))
  ? new URLSearchParams(window.location.search).get("view")
  : "Dashboard";
let fundraisingFinancialEditorId = null;
let fundraisingFinancialDeletePendingId = "";
let fundraisingFinancialSearchQuery = "";
let fundraisingFinancialTypeFilter = "All Revenue";
let marketingCurrentUser = null;
let marketingCampaignItems = [];
let marketingSubscriberItems = [];
let marketingMessageTemplates = [];
let marketingSelectedTemplateId = "";
let marketingTemplateLanguage = "English";
let marketingTemplatePreviewChannel = "email";
let marketingTemplateMessage = "";
let marketingTemplateMessageState = "";
let marketingDataMessage = "Loading marketing campaigns...";
let marketingDetailTab = "message";
let marketingPanelMode = "detail";
let marketingEditingCampaignId = "";
let marketingEditingSubscriberId = "";
let marketingDeletePendingId = "";
let marketingUnsubscribePendingId = "";
let marketingSearchQuery = "";
let marketingExpandedContactGroups = new Set(["Ready for Email", "Consent Needed"]);
let marketingCampaignFilter = "All Campaigns";
let marketingActionBusy = false;
let marketingOpenSignIn = null;
let marketingAudienceGroups = [...defaultMarketingAudienceGroups];
let marketingMailerLiteStatus = {
  provider: "MailerLite",
  configured: false,
  connected: false,
  connectionMode: "Not connected",
  sendingEnabled: false
};
const marketingInitialSection = new URLSearchParams(window.location.search).get("section");
const normalizedMarketingInitialSection = marketingInitialSection === "Subscribers"
  ? "Contacts"
  : marketingInitialSection === "Analytics"
    ? "Dashboard"
    : ["Email", "Newsletter", "Ad Grants"].includes(marketingInitialSection)
      ? "Campaigns"
      : marketingInitialSection;
let marketingSubpage = modules.marketing.subpages.includes(normalizedMarketingInitialSection)
  ? normalizedMarketingInitialSection
  : "Dashboard";
if (window.SNACK_MODULE_ID === "marketing" && marketingInitialSection && marketingInitialSection !== marketingSubpage) {
  const normalizedMarketingUrl = new URL(window.location.href);
  normalizedMarketingUrl.searchParams.set("section", marketingSubpage);
  history.replaceState({}, "", normalizedMarketingUrl);
}
let operationsCurrentUser = null;
let operationsDataMessage = "Loading performance data...";
let operationsMetrics = [];
let operationsMeasurements = [];
let operationsDataQualityItems = [];
let operationsPeriod = operationsCurrentQuarterPeriod();
let operationsPreviousPeriod = { startDate: "", endDate: "" };
let operationsProgramArea = "Organization";
let operationsSelectedMetricKey = "";
let operationsSearchQuery = "";
let operationsShowFutureMeasures = false;
let operationsEditorMode = "";
let operationsEditingMeasurementId = "";
let operationsDeletePendingMeasurementId = "";
let operationsEvaluationFilter = "All Questions";
let operationsEvaluationSearchQuery = "";
let operationsEvaluationQuestions = mergeOperationsEvaluationQuestions(defaultOperationsEvaluationQuestions, []);
let operationsAllEvaluationQuestions = [...operationsEvaluationQuestions];
let operationsEvaluationEditingId = "";
let operationsEvaluationInstruments = [];
let operationsEvaluationResponses = [];
let operationsEvaluationInstrumentEditingId = "";
let operationsHrsnClaims = [];
let operationsHrsnClientOptions = [];
let operationsHrsnDataState = "idle";
let operationsHrsnMessage = "";
let operationsSelectedHrsnClaimId = "";
let operationsHrsnSearchQuery = "";
let operationsHrsnEditorMode = "";
let operationsHrsnDeletePendingId = "";
const operationsSelectedHrsnClaimIds = new Set();
let operationsHrsnBulkMessage = "";
let operationsHrsnBulkMessageState = "";
let operationsBudgetCategories = [];
let operationsBudgetDataState = "idle";
let operationsBudgetMessage = "";
let operationsBudgetYear = new Date().getFullYear();
let operationsSelectedBudgetCategoryId = "";
let operationsBudgetEditorMode = "";
let operationsBudgetDeletePendingId = "";
let operationsActionBusy = false;
let operationsOpenSignIn = null;
const operationsInitialSection = new URLSearchParams(window.location.search).get("section");
const normalizedOperationsInitialSection = operationsInitialSection === "Data Quality" ? "Performance" : operationsInitialSection;
let operationsSubpage = modules.operations.subpages.includes(normalizedOperationsInitialSection)
  ? normalizedOperationsInitialSection
  : "Dashboard";
let operationsPerformanceView = new URLSearchParams(window.location.search).get("view") === "Data Quality"
  || operationsInitialSection === "Data Quality"
  ? "Data Quality"
  : "Measures";
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
  return modules[page] ? page : "home";
}

function isOperationsOutreachReport() {
  const page = location.pathname.split("/").pop();
  const params = new URLSearchParams(location.search);
  return page === "operations.html" && params.get("section") === "Reports" && params.get("report") === "outreach";
}

function icon(name) {
  return `<span class="nav-icon">${icons[name] || icons.admin}</span>`;
}

function pageUrl(id) {
  if (id === "home") return "./index.html";
  if (id === "fundraising") return "./finances.html";
  return id === "outreach" ? "./outreach.html" : `./${id}.html`;
}

function staffModules() {
  if (!staffAccessProfile) return [];
  if (Array.isArray(staffAccessProfile?.modules)) return staffAccessProfile.modules;
  return defaultStaffModuleAccess[staffAccessProfile?.role] || moduleOrder;
}

function staffCanAccessModule(moduleId) {
  if (moduleId === "home") return true;
  return staffModules().includes(moduleId);
}

function staffFinanceSections() {
  if (!staffAccessProfile) return [...financeSectionOrder];
  return Array.isArray(staffAccessProfile.financeSections)
    ? staffAccessProfile.financeSections
    : staffCanAccessModule("fundraising")
      ? [...financeSectionOrder]
      : [];
}

function staffCanAccessFinanceSection(section) {
  return staffFinanceSections().includes(section);
}

function setAccountMenuOpen(requestedOpen = false) {
  const state = accountMenuUiState(Boolean(staffAccessProfile), requestedOpen);
  const toggle = document.querySelector("[data-account-menu-toggle]");
  const menu = document.querySelector("[data-account-menu]");
  if (toggle) {
    toggle.hidden = state.triggerHidden;
    toggle.setAttribute("aria-expanded", String(state.expanded));
  }
  if (menu) menu.hidden = state.menuHidden;
}

function configureAccountSignInControl(account, signedIn, title = "") {
  if (!account) return;
  if (signedIn) {
    account.removeAttribute("role");
    account.removeAttribute("tabindex");
    account.removeAttribute("title");
    return;
  }
  account.setAttribute("role", "button");
  account.setAttribute("tabindex", "0");
  if (title) account.setAttribute("title", title);
}

function refreshStaffAccessUi() {
  const activeId = isOperationsOutreachReport() ? "operations" : currentModuleId();
  const navigation = document.querySelector(".module-nav");
  if (navigation) navigation.innerHTML = renderNav(activeId);
  document.querySelectorAll("[data-open-client-profile]").forEach((button) => {
    button.hidden = !staffCanAccessModule("crm");
  });
  const accountName = document.querySelector("[data-account-name]");
  if (accountName && staffAccessProfile?.displayName) {
    accountName.textContent = staffAccessProfile.displayName;
  }
  const signOutButton = document.querySelector("[data-secure-sign-out]");
  if (signOutButton) signOutButton.hidden = !staffAccessProfile;
  configureAccountSignInControl(document.querySelector(".account"), Boolean(staffAccessProfile));
  setAccountMenuOpen(false);
}

function currentStaffPageAccessDecision() {
  return staffPageAccessDecision({
    moduleId: currentModuleId(),
    modules: staffModules(),
    financeSection: fundraisingSubpage,
    financeSections: staffFinanceSections()
  });
}

function revealVerifiedStaffShell() {
  if (!staffAccessProfile || !currentStaffPageAccessDecision().allowed) return false;
  refreshStaffAccessUi();
  const shell = document.querySelector("[data-shell]");
  if (shell) shell.hidden = false;
  return true;
}

function staffAccountDisplayName(user) {
  return staffAccessProfile?.displayName || user?.displayName || "SNACK Staff";
}

async function recordSecureSessionEvent(action) {
  const user = secureAuth?.currentUser;
  if (!user) return;
  try {
    const token = await user.getIdToken();
    const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
    await fetch(`${apiBaseUrl}/api/security-events`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action, resourceType: "session" })
    });
  } catch {
    // Signing out must still finish if the audit service is temporarily unavailable.
  }
}

function closeSecureSessionWarning() {
  clearInterval(secureSessionCountdownTimer);
  secureSessionCountdownTimer = 0;
  document.querySelector("[data-session-warning]")?.remove();
}

async function endSecureSession(reason = "session.logout") {
  if (!secureAuth || !secureAuthApi) return;
  clearTimeout(secureSessionTimer);
  clearTimeout(secureSessionWarningTimer);
  closeSecureSessionWarning();
  const main = document.querySelector(".main");
  if (main) main.hidden = true;
  await recordSecureSessionEvent(reason);
  staffAccessProfile = null;
  refreshStaffAccessUi();
  sessionStorage.removeItem("snack-secure-login-recorded");
  await secureAuthApi.signOut(secureAuth);
  window.location.replace("./index.html");
}

function showSecureSessionWarning() {
  if (document.querySelector("[data-session-warning]")) return;
  const warning = document.createElement("div");
  warning.className = "secure-session-warning";
  warning.dataset.sessionWarning = "true";
  warning.innerHTML = `
    <section role="alertdialog" aria-modal="true" aria-labelledby="secure-session-title">
      <h2 id="secure-session-title">Your session will end soon</h2>
      <p>You will be signed out in <strong data-session-countdown>${escapeHtml(sessionCountdownLabel((secureSessionEndsAt - Date.now()) / 1000))}</strong> because there has been no activity.</p>
      <div><button data-session-continue type="button">Keep Working</button><button data-session-end type="button">Sign Out</button></div>
    </section>`;
  document.body.append(warning);
  const updateCountdown = () => {
    const countdown = warning.querySelector("[data-session-countdown]");
    if (countdown) countdown.textContent = sessionCountdownLabel((secureSessionEndsAt - Date.now()) / 1000);
  };
  updateCountdown();
  secureSessionCountdownTimer = window.setInterval(updateCountdown, 1000);
  warning.querySelector("[data-session-continue]")?.addEventListener("click", resetSecureSessionTimer);
  warning.querySelector("[data-session-end]")?.addEventListener("click", () => endSecureSession());
  warning.querySelector("[data-session-continue]")?.focus();
}

function resetSecureSessionTimer() {
  if (!secureAuth?.currentUser) return;
  clearTimeout(secureSessionTimer);
  clearTimeout(secureSessionWarningTimer);
  closeSecureSessionWarning();
  secureSessionEndsAt = Date.now() + secureSessionPolicy.inactivityMinutes * 60_000;
  const warningDelay = Math.max(1, secureSessionPolicy.inactivityMinutes - secureSessionPolicy.warningMinutes) * 60_000;
  secureSessionWarningTimer = window.setTimeout(showSecureSessionWarning, warningDelay);
  secureSessionTimer = window.setTimeout(
    () => endSecureSession("session.inactivity_logout"),
    secureSessionPolicy.inactivityMinutes * 60_000
  );
}

function bindSecureSessionEvents() {
  if (secureSessionEventsBound) return;
  secureSessionEventsBound = true;
  let lastReset = 0;
  const handleActivity = () => {
    const now = Date.now();
    if (now - lastReset < 15_000) return;
    lastReset = now;
    resetSecureSessionTimer();
  };
  ["pointerdown", "keydown", "scroll", "touchstart"].forEach((eventName) =>
    window.addEventListener(eventName, handleActivity, { passive: true }));
  document.addEventListener("click", (event) => {
    const accountMenuToggle = event.target.closest("[data-account-menu-toggle]");
    if (accountMenuToggle) {
      event.preventDefault();
      event.stopPropagation();
      setAccountMenuOpen(accountMenuToggle.getAttribute("aria-expanded") !== "true");
      return;
    }
    const signOutButton = event.target.closest("[data-secure-sign-out]");
    if (signOutButton) {
      event.preventDefault();
      event.stopPropagation();
      setAccountMenuOpen(false);
      endSecureSession();
      return;
    }
    if (!event.target.closest(".account")) setAccountMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setAccountMenuOpen(false);
  });
}

async function configureSecureAuthSession(auth) {
  secureAuthApi ||= await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js");
  await secureAuthApi.setPersistence(auth, secureAuthApi.browserSessionPersistence);
  secureAuth = auth;
  bindSecureSessionEvents();
  if (currentModuleId() !== "home") {
    secureAuthApi.onAuthStateChanged(auth, (user) => {
      if (!user) window.location.replace("./index.html");
    });
  }
}

async function loadStaffAccess(user) {
  const token = await user.getIdToken();
  const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
  const response = await fetch(`${apiBaseUrl}/api/access/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Staff access could not be verified.");
  staffAccessProfile = {
    ...result.access,
    displayName: result.access?.displayName || user.displayName || "SNACK Staff"
  };
  secureSessionPolicy = {
    inactivityMinutes: Math.max(5, Number(result.sessionPolicy?.inactivityMinutes) || 120),
    warningMinutes: Math.max(1, Number(result.sessionPolicy?.warningMinutes) || 5)
  };
  resetSecureSessionTimer();
  if (!sessionStorage.getItem("snack-secure-login-recorded")) {
    sessionStorage.setItem("snack-secure-login-recorded", "true");
    await recordSecureSessionEvent("session.login");
  }
  const accessDecision = currentStaffPageAccessDecision();
  if (!accessDecision.allowed) {
    const destinationUrl = new URL(pageUrl(accessDecision.destination), window.location.href);
    if (accessDecision.destination === "fundraising" && accessDecision.financeSection) {
      destinationUrl.searchParams.set("section", accessDecision.financeSection);
    }
    location.replace(destinationUrl);
    return false;
  }
  revealVerifiedStaffShell();
  return true;
}

async function authorizeStaffUser(user) {
  try {
    return await loadStaffAccess(user);
  } catch (error) {
    console.error(error);
    const message = error.message || "Staff access could not be verified.";
    if (currentModuleId() === "schedule") {
      scheduleDataState = "error";
      scheduleDataMessage = message;
      updateScheduleDate(modules.schedule, scheduleVisibleDate);
    } else if (currentModuleId() === "crm") {
      crmDataMessage = message;
      refreshStandardModuleData(modules.crm);
    } else if (currentModuleId() === "outreach") {
      outreachDataMessage = message;
      refreshStandardModuleData(modules.outreach);
    } else if (currentModuleId() === "fundraising") {
      fundraisingDataMessage = message;
      refreshFundraisingData();
    } else if (currentModuleId() === "marketing") {
      marketingDataMessage = message;
      if (marketingSubpage === "Dashboard") refreshMarketingDashboardPresentation();
      else if (marketingSubpage === "Templates") refreshMarketingTemplatesWorkspace();
      else refreshStandardModuleData(modules.marketing);
    } else if (currentModuleId() === "operations") {
      operationsDataMessage = message;
      refreshOperationsWorkspace();
    } else if (currentModuleId() === "admin") {
      adminDataState = "error";
      adminDataMessage = message;
      if (isAdminSettingsPage()) refreshAdminSettingsWorkspace();
      else if (isAdminIntegrationsPage()) refreshAdminIntegrationsWorkspace();
      else refreshAdminSchedulingWorkspace();
    } else if (currentModuleId() === "home") {
      homeDataState = "error";
      homeDataMessage = message;
      refreshHomeDashboard();
    }
    return false;
  }
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
  if (label === "Tasks") {
    const taskItems = crmDashboardQueueItems.filter((item) => item.queue === "Workflow Tasks");
    const taskSummary = crmDashboardTaskSummary(taskItems);
    return {
      primaryAction: "",
      quickActions: [],
      summary: [
        [String(taskSummary.overdue), "Overdue"],
        [String(taskSummary.dueToday), "Due Today"],
        [String(taskSummary.upcoming), "Upcoming"],
        [String(taskSummary.total), "Open Tasks"]
      ],
      listTitle: "Tasks",
      searchLabel: "Search tasks",
      footerActions: [],
      detailTabs: [],
      detailTabIcons: [],
      sideTitle: "",
      sideIcon: "",
      sideFields: [],
      cards: [],
      items: taskItems
    };
  }

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
  if (crmSubpage === "Tasks") {
    const normalized = String(query || "").trim().toLowerCase();
    return !normalized || [item.title, item.subtitle, item.status, item.queue]
      .some((value) => String(value || "").toLowerCase().includes(normalized));
  }
  if (crmSubpage === "Referrals") return crmReferralMatches(item, query);
  if (crmSubpage === "Referral Network") return crmNetworkMatches(item, query);
  return crmClientMatches(item, query);
}

function crmCurrentSummary(items) {
  if (crmSubpage === "Tasks") {
    const summary = crmDashboardTaskSummary(items);
    return [
      [String(summary.overdue), "Overdue"],
      [String(summary.dueToday), "Due Today"],
      [String(summary.upcoming), "Upcoming"],
      [String(summary.total), "Open Tasks"]
    ];
  }
  if (crmSubpage === "Referrals") return crmReferralSummary(items);
  if (crmSubpage === "Referral Network") return crmNetworkSummary(items);
  return crmSummary(items);
}

function crmEmptyMessage() {
  if (crmSubpage === "Tasks") return "No tasks found.";
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
  if (label === "Volunteers") {
    const profiles = outreachVolunteerView === "Profiles";
    return {
      title: "Volunteers",
      views: ["Profiles", "Opportunities"],
      primaryAction: profiles ? "New Volunteer" : "New Opportunity",
      quickActions: profiles ? ["New Volunteer", "New Opportunity"] : ["New Opportunity", "New Volunteer"],
      summary: volunteerSummary(outreachVolunteerProfileItems, outreachVolunteerOpportunityItems),
      listTitle: profiles ? "Volunteer Directory" : "Volunteer Opportunities",
      searchLabel: profiles ? "Search volunteer profiles" : "Search volunteer opportunities",
      footerActions: ["Edit", "Delete"],
      detailTabs: profiles ? ["Profile", "Interests", "Access", "Notes"] : ["Overview", "Requirements", "Notes"],
      detailTabIcons: profiles ? ["crm", "outreach", "admin", "note"] : ["calendar", "check", "note"],
      sideTitle: profiles ? "Volunteer" : "Opportunity",
      sideIcon: profiles ? "crm" : "outreach",
      sideLink: "",
      sideFields: profiles
        ? [["Email", "email"], ["Phone", "phone"], ["Preferred Contact", "preferredContact"], ["Applied", "applicationDate"], ["Background Check", "backgroundCheckStatus"]]
        : [["Date", "opportunityDate"], ["Time", "timeLabel"], ["Program", "program"], ["Location", "location"], ["Capacity", "capacity"]],
      cards: [{ title: profiles ? "Volunteer Profile" : "Opportunity", fields: [] }],
      items: profiles ? outreachVolunteerProfileItems : outreachVolunteerOpportunityItems
    };
  }

  if (label === "Leads") {
    const sourceItems = outreachLeadsForView(outreachContactItems, outreachLeadView);
    return {
      title: "Outreach",
      views: ["Events", "Leads"],
      primaryAction: "New Lead",
      quickActions: ["New Lead", "New Event"],
      summary: outreachSummary(outreachRawEvents, outreachRawContacts),
      listTitle: outreachLeadView === "history" ? "Lead History" : "Active Leads",
      searchLabel: "Search outreach leads",
      footerActions: ["Edit", "Create Referral", "Close Lead"],
      detailTabs: ["Overview", "Audience", "Conversion", "Notes"],
      detailTabIcons: ["crm", "marketing", "check", "note"],
      sideTitle: "Lead",
      sideIcon: "crm",
      sideLink: "",
      sideFields: [["Event", "event"], ["Interest", "interestType"], ["Organization", "organizationName"], ["Phone", "phone"], ["Email", "email"]],
      cards: [{ title: "Lead Details", fields: [] }],
      items: sourceItems,
      sourceItems
    };
  }

  if (label === "Tasks") {
    return {
      title: "Outreach",
      views: ["Events", "Leads"],
      primaryAction: "New Task",
      quickActions: ["New Task", "New Event", "New Lead"],
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
    views: ["Events", "Leads"],
    primaryAction: "New Event",
    quickActions: ["New Event", "Log Outcome", "Add Lead"],
    summary: outreachSummary(outreachRawEvents, outreachRawContacts),
    listTitle: "Events",
    searchLabel: "Search outreach events",
    footerActions: ["Log Outcome", "Add Lead", "Create Task"],
    detailTabs: ["Logistics", "Outcomes", "Leads"],
    detailTabIcons: ["calendar", "check", "crm"],
    sideTitle: "Event Lead",
    sideIcon: "outreach",
    sideLink: "",
    sideFields: [["Date", "date"], ["Location", "place"], ["Cost", "cost"], ["Contact", "contact"], ["Deadline", "deadline"]],
    cards: [
      { title: "Logistics", fields: [] },
      { title: "Event Outcomes", fields: [] },
      { title: "Leads Generated", fields: [] }
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
  if (outreachSubpage === "Volunteers") return volunteerMatches(item, query);
  if (outreachSubpage === "Leads") return outreachContactMatches(item, query);
  if (outreachSubpage === "Tasks") return outreachTaskMatches(item, query);
  return outreachEventMatches(item, query);
}

function outreachEmptyMessage() {
  if (outreachSubpage === "Volunteers") return outreachVolunteerView === "Profiles" ? "No volunteer profiles found." : "No volunteer opportunities found.";
  if (outreachSubpage === "Leads") return outreachLeadView === "history" ? "No converted leads found." : "No active outreach leads found.";
  if (outreachSubpage === "Tasks") return "No outreach tasks found.";
  if (outreachSubpage === "Reports") return "No outreach report is available.";
  return "No outreach events found.";
}

function fundraisingSubpageDefinition(label = fundraisingSubpage) {
  if (label === "Giving" && fundraisingGivingView === "Donors") {
    return {
      title: label,
      views: ["Gifts", "Donors", "Campaigns"],
      primaryAction: "New Donor",
      quickActions: ["New Donor"],
      summary: donorSummary(fundraisingRawDonors),
      listTitle: "Donors",
      searchLabel: "Search donors",
      footerActions: ["Edit", "New Donor", "Delete"],
      detailTabs: ["Profile", "Giving", "Contact", "Notes"],
      detailTabIcons: ["crm", "fundraising", "crm", "note"],
      sideTitle: "Donor",
      sideIcon: "fundraising",
      sideFields: [["Type", "donorType"], ["Last Gift", "lastGift"], ["Lifetime Giving", "lifetimeGiving"], ["Recurring", "recurring"], ["Preferred Contact", "preferredContact"]],
      items: fundraisingDonorItems,
      matcher: donorMatches,
      emptyLabel: "donors"
    };
  }

  if (label === "Giving") {
    if (fundraisingGivingView === "Campaigns") {
      return {
        title: label,
        views: ["Gifts", "Donors", "Campaigns"],
        primaryAction: "New Campaign",
        quickActions: ["New Campaign"],
        summary: campaignSummary(fundraisingRawCampaigns),
        listTitle: "Campaigns",
        searchLabel: "Search campaigns",
        footerActions: ["Edit", "New Campaign", "Delete"],
        detailTabs: ["Campaign", "Progress", "Audience", "Notes"],
        detailTabIcons: ["calendar", "fundraising", "crm", "note"],
        sideTitle: "Campaign",
        sideIcon: "fundraising",
        sideFields: [["Dates", "dateRange"], ["Goal", "goal"], ["Raised", "raised"], ["Remaining", "remaining"], ["Owner", "owner"]],
        items: fundraisingCampaignItems,
        matcher: campaignMatches,
        emptyLabel: "campaigns"
      };
    }
    return {
      title: label,
      views: ["Gifts", "Donors", "Campaigns"],
      primaryAction: "New Gift",
      quickActions: ["New Gift"],
      summary: giftSummary(fundraisingRawGifts),
      listTitle: "Gifts",
      searchLabel: "Search gifts",
      footerActions: ["Edit", "New Gift", "Delete"],
      detailTabs: ["Details", "Allocation", "Acknowledgement", "Notes"],
      detailTabIcons: ["fundraising", "calendar", "check", "note"],
      sideTitle: "Gift",
      sideIcon: "fundraising",
      sideFields: [["Gift Date", "giftDate"], ["Amount", "amount"], ["Type", "giftType"], ["Campaign", "campaignName"], ["Payment", "paymentMethod"], ["Recurring", "recurring"]],
      items: fundraisingGiftItems,
      matcher: giftMatches,
      emptyLabel: "gift transactions"
    };
  }

  if (["HRSN Billing", "Budget"].includes(label)) {
    return {
      title: label,
      primaryAction: "",
      quickActions: [],
      summary: [],
      listTitle: label,
      searchLabel: `Search ${label.toLowerCase()}`,
      footerActions: [],
      detailTabs: [],
      detailTabIcons: [],
      sideTitle: label,
      sideIcon: "fundraising",
      sideFields: [],
      items: [],
      matcher: () => true,
      emptyLabel: label.toLowerCase()
    };
  }

  if (label === "Financial Activity") {
    return {
      title: label,
      primaryAction: "Add Revenue",
      quickActions: ["Add Revenue"],
      summary: financialActivitySummary(fundraisingFinancialActivityItems),
      listTitle: "Revenue Activity",
      searchLabel: "Search financial activity",
      footerActions: [],
      detailTabs: ["Activity"],
      detailTabIcons: ["fundraising"],
      sideTitle: "Revenue",
      sideIcon: "fundraising",
      sideFields: [["Date", "transactionDate"], ["Type", "activityType"], ["Amount", "amount"], ["Source", "sourceName"]],
      items: fundraisingFinancialActivityItems,
      matcher: financialActivityMatches,
      emptyLabel: "financial activity records"
    };
  }

  return {
    title: "Grants",
    primaryAction: "New Grant",
    quickActions: ["New Grant"],
    summary: fundraisingSummary(fundraisingRawGrants),
    listTitle: "Grants",
    searchLabel: "Search grants",
    footerActions: ["Edit", "New Grant", "Delete"],
    detailTabs: ["Funding", "Reporting", "Contacts", "Documents"],
    detailTabIcons: ["fundraising", "calendar", "crm", "file"],
    sideTitle: "Foundation",
    sideIcon: "fundraising",
    sideFields: [["Deadline", "deadline"], ["Requested", "requested"], ["Award Expected", "awardExpected"], ["Focus Areas", "focusAreas"], ["Recurrence", "recurrence"], ["Contact", "contact"]],
    items: fundraisingGrantItems,
    matcher: grantMatches,
    emptyLabel: "grants"
  };
}

function configureFundraisingModule(label = fundraisingSubpage) {
  const definition = fundraisingSubpageDefinition(label);
  if (label === "Grants") definition.primaryAction = fundraisingWorkspacePrimaryAction();
  fundraisingSubpage = label;
  Object.assign(modules.fundraising, {
    views: [],
    ...definition,
    items: definition.items.filter((item) => definition.matcher(item, fundraisingSearchQuery))
  });
  fundraisingDataMessage = modules.fundraising.items.length
    ? ""
    : definition.items.length
      ? `No ${definition.emptyLabel} match this search.`
      : `No ${definition.emptyLabel} have been added yet.`;
}

function fundraisingCurrentItems() {
  return fundraisingSubpageDefinition().items;
}

function fundraisingSelectedItem() {
  return fundraisingCurrentItems().find((item) => item.id === selectedItemId) || null;
}

function refreshFundraisingData(preferredItemId = selectedItemId) {
  configureFundraisingModule();
  const module = modules.fundraising;
  if (["Financial Activity", "HRSN Billing", "Budget"].includes(fundraisingSubpage)) {
    selectedItemId = "";
    const summary = document.querySelector(".summary-strip");
    if (summary) summary.innerHTML = renderSummaryItems(module);
    if (fundraisingSubpage === "Financial Activity") refreshFinancialActivityWorkspace();
    else refreshFinancialRecordsWorkspace();
    return;
  }
  const nextItemId = module.items.some((item) => item.id === preferredItemId)
    ? preferredItemId
    : module.items[0]?.id || "";
  selectedItemId = nextItemId;
  refreshStandardModuleData(module);
  if (nextItemId) updateDetail(module, nextItemId);
  setFundraisingDetailTab(fundraisingDetailTab);
  refreshFundraisingWorkspace();
}

function applyFundraisingSearch(query = "") {
  fundraisingSearchQuery = query.trim();
  refreshFundraisingData(selectedItemId);
}

function setFundraisingSubpage(label) {
  if (!modules.fundraising.subpages.includes(label) || !staffCanAccessFinanceSection(label) || fundraisingActionBusy) return;
  fundraisingSubpage = label;
  fundraisingSearchQuery = "";
  fundraisingDetailTab = fundraisingDetailTabKey(fundraisingSubpageDefinition(label).detailTabs[0]);
  fundraisingPanelMode = "detail";
  fundraisingEditingRecordId = "";
  fundraisingDeletePendingId = "";
  fundraisingDocumentEditorOpen = false;
  fundraisingDocumentDeletePendingId = "";
  if (label === "Grants") {
    fundraisingWorkspaceView = "Pipeline";
  }
  if (label === "Financial Activity") {
    fundraisingFinancialView = "Dashboard";
    fundraisingFinancialEditorId = null;
    fundraisingFinancialDeletePendingId = "";
    fundraisingFinancialSearchQuery = "";
    fundraisingFinancialTypeFilter = "All Revenue";
  }
  if (label === "HRSN Billing") {
    operationsHrsnEditorMode = "";
    operationsHrsnDeletePendingId = "";
  }
  if (label === "Budget") {
    operationsBudgetEditorMode = "";
    operationsBudgetDeletePendingId = "";
  }
  configureFundraisingModule(label);

  const url = new URL(window.location.href);
  url.searchParams.set("section", label);
  if (label === "Financial Activity") url.searchParams.set("view", fundraisingFinancialView);
  else if (label === "Giving") url.searchParams.set("view", fundraisingGivingView);
  else if (label !== "Grants") url.searchParams.delete("view");
  history.replaceState({}, "", url);

  renderModulePage("fundraising");
  refreshFundraisingAccountControl();
  applyFundraisingSearch("");
  loadFinancialRecordsSubpageData();
}

function setFundraisingGivingView(view = "Gifts") {
  if (fundraisingSubpage !== "Giving" || !["Gifts", "Donors", "Campaigns"].includes(view) || fundraisingActionBusy) return;
  fundraisingGivingView = view;
  fundraisingSearchQuery = "";
  fundraisingPanelMode = "detail";
  fundraisingEditingRecordId = "";
  fundraisingDeletePendingId = "";
  selectedItemId = "";
  fundraisingDetailTab = fundraisingDetailTabKey(fundraisingSubpageDefinition("Giving").detailTabs[0]);
  configureFundraisingModule("Giving");

  const url = new URL(window.location.href);
  url.searchParams.set("section", "Giving");
  url.searchParams.set("view", fundraisingGivingView);
  history.replaceState({}, "", url);

  renderModulePage("fundraising");
  refreshFundraisingAccountControl();
  applyFundraisingSearch("");
}

function marketingDetailTabKey(tab = "") {
  return tab.toLowerCase().replaceAll(" ", "-");
}

function marketingSubpageDefinition(label = marketingSubpage) {
  if (label === "Templates") {
    return {
      primaryAction: "",
      quickActions: [],
      summary: [],
      listTitle: "Templates",
      searchLabel: "",
      footerActions: [],
      detailTabs: [],
      detailTabIcons: [],
      sideTitle: "",
      sideIcon: "",
      sideLink: "",
      sideFields: [],
      items: [],
      sourceItems: marketingMessageTemplates
    };
  }

  if (label === "Dashboard") {
    return {
      primaryAction: "New Campaign",
      quickActions: ["New Campaign"],
      summary: marketingDashboardSummary(marketingCampaignItems, marketingSubscriberItems),
      listTitle: "Marketing Dashboard",
      searchLabel: "",
      footerActions: [],
      detailTabs: [],
      detailTabIcons: [],
      sideTitle: "",
      sideIcon: "",
      sideLink: "",
      sideFields: [],
      items: [],
      sourceItems: marketingCampaignItems
    };
  }

  if (label === "Contacts") {
    const sourceItems = marketingSubscriberItems;
    return {
      primaryAction: "New Contact",
      quickActions: ["New Contact"],
      summary: marketingSubscriberSummary(sourceItems),
      listTitle: "Contacts",
      searchLabel: "Search contacts",
      footerActions: ["Edit", "New Contact", "Unsubscribe"],
      detailTabs: ["Profile", "Consent", "Audiences", "History"],
      detailTabIcons: ["crm", "check", "marketing", "history"],
      sideTitle: "Contact",
      sideIcon: "marketing",
      sideLink: "",
      sideFields: [["Email", "email"], ["Preference", "communicationPreference"], ["Sources", "sourceSummary"], ["MailerLite", "eligibilityLabel"]],
      items: sourceItems.filter((item) => marketingSubscriberMatches(item, marketingSearchQuery)),
      sourceItems
    };
  }

  const action = "New Campaign";
  const listTitle = "Campaigns";
  const sourceItems = marketingCampaignsForFilter(marketingCampaignItems, marketingCampaignFilter);
  return {
    primaryAction: action,
    quickActions: [action],
    summary: marketingSummary(marketingCampaignItems, "Campaigns"),
    listTitle,
    searchLabel: "Search campaigns",
    footerActions: ["Edit", action, "Delete"],
    detailTabs: ["Message", "Audience", "Delivery", "Results"],
    detailTabIcons: ["marketing", "crm", "calendar", "operations"],
    sideTitle: "Delivery",
    sideIcon: "marketing",
    sideLink: "",
    sideFields: [["Channel", "channel"], ["Type", "campaignType"], ["Send Date", "sendDate"], ["Owner", "owner"], ["Audience", "audience"]],
    items: sourceItems.filter((item) => marketingCampaignMatches(item, marketingSearchQuery)),
    sourceItems
  };
}

function configureMarketingModule(label = marketingSubpage) {
  marketingSubpage = label;
  const definition = marketingSubpageDefinition(label);
  Object.assign(modules.marketing, definition);
  marketingDataMessage = definition.items.length
    ? ""
    : definition.sourceItems.length
      ? `No ${definition.listTitle.toLowerCase()} match this search.`
      : ["Dashboard", "Templates"].includes(label)
        ? "Marketing data will appear here as contacts and campaigns are added."
        : `No ${definition.listTitle.toLowerCase()} have been added yet.`;
}

function marketingSelectedItem() {
  if (["Dashboard", "Templates"].includes(marketingSubpage)) return null;
  const items = marketingSubpage === "Contacts" ? marketingSubscriberItems : marketingCampaignItems;
  return items.find((item) => item.id === selectedItemId) || null;
}

function refreshMarketingDashboardPresentation() {
  selectedItemId = "";
  const summary = document.querySelector(".summary-strip");
  const dashboard = document.querySelector("[data-marketing-dashboard]");
  if (summary) summary.innerHTML = renderSummaryItems(modules.marketing);
  if (dashboard) dashboard.innerHTML = renderMarketingDashboard();
}

function refreshMarketingData(preferredItemId = selectedItemId) {
  configureMarketingModule(marketingSubpage);
  const module = modules.marketing;
  if (marketingSubpage === "Templates") {
    if (!marketingMessageTemplates.some((template) => template.id === marketingSelectedTemplateId)) {
      marketingSelectedTemplateId = marketingMessageTemplates[0]?.id || "";
    }
    refreshMarketingTemplatesWorkspace();
    return;
  }
  if (marketingSubpage === "Dashboard") {
    refreshMarketingDashboardPresentation();
    return;
  }
  selectedItemId = module.items.some((item) => item.id === preferredItemId)
    ? preferredItemId
    : module.items[0]?.id || "";
  refreshStandardModuleData(module);
  setMarketingDetailTab(marketingDetailTab);
}

function applyMarketingSearch(query = "") {
  marketingSearchQuery = query.trim();
  refreshMarketingData(selectedItemId);
}

function applyMarketingCampaignFilter(filter = "All Campaigns") {
  marketingCampaignFilter = marketingCampaignFilterOptions.includes(filter) ? filter : "All Campaigns";
  refreshMarketingData(selectedItemId);
}

function setMarketingSubpage(label) {
  if (!modules.marketing.subpages.includes(label) || marketingActionBusy) return;
  marketingSubpage = label;
  marketingSearchQuery = "";
  marketingCampaignFilter = "All Campaigns";
  marketingDetailTab = label === "Contacts" ? "profile" : "message";
  marketingPanelMode = "detail";
  marketingEditingCampaignId = "";
  marketingEditingSubscriberId = "";
  marketingDeletePendingId = "";
  marketingUnsubscribePendingId = "";
  marketingTemplateMessage = "";
  marketingTemplateMessageState = "";
  configureMarketingModule(label);

  const url = new URL(window.location.href);
  url.searchParams.set("section", label);
  history.replaceState({}, "", url);

  renderModulePage("marketing");
  refreshMarketingAccountControl();
  applyMarketingSearch("");
}

const fundraisingWorkspaceViews = [
  ["Pipeline", "columns"],
  ["Details", "file"],
  ["Deadlines", "calendar"],
  ["Answer Library", "note"],
  ["Organization", "building"],
  ["Documents", "file"]
];

function fundraisingWorkspacePrimaryAction() {
  if (fundraisingWorkspaceView === "Answer Library") return "New Answer";
  if (fundraisingWorkspaceView === "Organization") return "Edit Information";
  if (fundraisingWorkspaceView === "Documents") return "Upload Document";
  return "New Grant";
}

function renderFundraisingWorkspaceTabs() {
  return `
    <nav class="fundraising-workspace-tabs" aria-label="Grant workspace views" role="tablist">
      ${fundraisingWorkspaceViews.map(([view, iconName]) => `
        <button
          class="${view === fundraisingWorkspaceView ? "is-active" : ""}"
          data-fundraising-workspace-view="${escapeHtml(view)}"
          type="button"
          role="tab"
          aria-selected="${view === fundraisingWorkspaceView}"
        >
          <span>${icons[iconName]}</span><span>${escapeHtml(view)}</span>
        </button>
      `).join("")}
    </nav>
  `;
}

function grantCardAmount(item) {
  return item.requested !== "-" ? item.requested : item.range;
}

function renderFundraisingPipeline() {
  const groups = grantPipelineGroups(fundraisingGrantItems);
  return `
    <section class="fundraising-workspace-panel" data-fundraising-workspace-panel="Pipeline" ${fundraisingWorkspaceView === "Pipeline" ? "" : "hidden"}>
      <div class="fundraising-workspace-heading">
        <div><h2>Grant Pipeline</h2><p>Drag a grant to a new stage to update its saved status.</p></div>
      </div>
      <div class="grant-board" data-fundraising-pipeline>
        ${grantPipelineColumns.map((status) => `
          <section class="grant-column" data-fundraising-stage="${escapeHtml(status)}">
            <header><span>${escapeHtml(status)}</span><strong>${groups[status].length}</strong></header>
            <div class="grant-column-body" data-fundraising-drop-zone="${escapeHtml(status)}">
              ${groups[status].map((item) => `
                <article class="grant-board-card ${["Awarded", "Reporting"].includes(item.status) ? "is-awarded" : ""}" draggable="true" data-fundraising-grant-card="${escapeHtml(item.id)}">
                  <button class="grant-card-open" data-fundraising-open-grant="${escapeHtml(item.id)}" type="button">
                    <span class="grant-card-heading"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(grantCardAmount(item))}</span></span>
                    <span class="grant-card-foundation">${escapeHtml(item.foundation)}</span>
                    <span class="grant-card-meta"><span>${escapeHtml(item.deadline === "-" ? "No deadline" : `Due ${item.deadline}`)}</span><span>${escapeHtml(item.status)}</span></span>
                  </button>
                </article>
              `).join("") || `<p class="grant-column-empty">No grants</p>`}
            </div>
          </section>
        `).join("")}
      </div>
      <p class="fundraising-workspace-status" data-fundraising-workspace-status role="status" aria-live="polite"></p>
    </section>
  `;
}

function deadlineDateParts(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return { day: "-", month: "" };
  return {
    day: String(date.getDate()),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)
  };
}

function renderFundraisingDeadlines() {
  const deadlines = grantDeadlineItems(fundraisingGrantItems);
  return `
    <section class="fundraising-workspace-panel" data-fundraising-workspace-panel="Deadlines" ${fundraisingWorkspaceView === "Deadlines" ? "" : "hidden"}>
      <div class="fundraising-workspace-heading">
        <div><h2>Upcoming Deadlines</h2><p>Application deadlines and expected award decisions, in date order.</p></div>
      </div>
      <div class="grant-deadline-list">
        ${deadlines.map((row) => {
          const parts = deadlineDateParts(row.date);
          return `
            <button class="grant-deadline-row" data-fundraising-open-grant="${escapeHtml(row.grantId)}" type="button">
              <time datetime="${escapeHtml(row.date)}"><strong>${escapeHtml(parts.day)}</strong><span>${escapeHtml(parts.month)}</span></time>
              <span class="grant-deadline-copy"><strong>${escapeHtml(row.title)}</strong><span>${escapeHtml(row.foundation)}</span></span>
              <span class="grant-deadline-type" data-deadline-type="${escapeHtml(row.type)}">${escapeHtml(row.type)}</span>
              <span>${escapeHtml(row.status)}</span>
              <strong>${escapeHtml(row.amount)}</strong>
            </button>
          `;
        }).join("") || `<p class="fundraising-workspace-empty">No upcoming grant deadlines are saved.</p>`}
      </div>
    </section>
  `;
}

function selectedFundraisingQuestion() {
  return fundraisingQuestionItems.find((item) => item.id === fundraisingSelectedQuestionId)
    || fundraisingQuestionItems[0]
    || null;
}

function renderFundraisingQuestionEditor(item = null) {
  const source = item?.source || {};
  return `
    <form class="fundraising-answer-editor" data-fundraising-question-form data-question-id="${escapeHtml(item?.id || "")}">
      <div class="fundraising-editor-heading"><h3>${item ? "Edit Answer" : "New Answer"}</h3><button data-cancel-fundraising-question type="button">Cancel</button></div>
      <div class="fundraising-answer-fields">
        <label><span>Category</span><input name="category" value="${escapeHtml(source.category || "General")}"></label>
        <label><span>Target Limit</span><input name="targetLimit" value="${escapeHtml(source.targetLimit || "")}" placeholder="Optional word or character limit"></label>
        <label class="is-wide"><span>Question or Prompt</span><input name="prompt" value="${escapeHtml(source.prompt || "")}" required></label>
        <label class="is-wide"><span>Approved Answer</span><textarea name="answer" rows="10" required>${escapeHtml(source.answer || "")}</textarea></label>
        <label class="is-wide"><span>Notes</span><textarea name="notes" rows="3">${escapeHtml(source.notes || "")}</textarea></label>
      </div>
      <div class="fundraising-editor-actions"><button type="submit">Save Answer</button></div>
    </form>
  `;
}

function renderFundraisingAnswerLibrary() {
  const selected = selectedFundraisingQuestion();
  if (selected && !fundraisingSelectedQuestionId) fundraisingSelectedQuestionId = selected.id;
  return `
    <section class="fundraising-workspace-panel" data-fundraising-workspace-panel="Answer Library" ${fundraisingWorkspaceView === "Answer Library" ? "" : "hidden"}>
      <div class="fundraising-workspace-heading">
        <div><h2>Answer Library</h2><p>Approved responses ready to reuse in grant applications.</p></div>
      </div>
      <div class="fundraising-answer-workspace">
        <aside class="fundraising-answer-list" aria-label="Saved answers">
          ${fundraisingQuestionItems.map((item) => `
            <button class="${item.id === selected?.id ? "is-selected" : ""}" data-fundraising-question-id="${escapeHtml(item.id)}" type="button">
              <strong>${escapeHtml(item.prompt)}</strong><span>${escapeHtml(item.category)} | ${item.wordCount} words</span>
            </button>
          `).join("") || `<p>No reusable answers have been saved.</p>`}
        </aside>
        <article class="fundraising-answer-detail">
          ${fundraisingQuestionEditorMode ? renderFundraisingQuestionEditor(fundraisingQuestionEditorMode === "edit" ? selected : null) : selected ? `
            <div class="fundraising-answer-heading">
              <div><span>${escapeHtml(selected.category)}</span><h3>${escapeHtml(selected.prompt)}</h3></div>
              <div><button data-copy-fundraising-answer type="button">Copy</button><button data-edit-fundraising-question type="button">Edit</button></div>
            </div>
            <p class="fundraising-answer-copy">${escapeHtml(selected.answer)}</p>
            <dl class="fundraising-answer-meta">
              <div><dt>Word Count</dt><dd>${selected.wordCount}</dd></div>
              <div><dt>Target Limit</dt><dd>${escapeHtml(selected.targetLimit || "-")}</dd></div>
              <div><dt>Notes</dt><dd>${escapeHtml(selected.notes || "-")}</dd></div>
            </dl>
            <button class="fundraising-danger-link${fundraisingQuestionDeletePendingId === selected.id ? " is-confirming" : ""}" data-delete-fundraising-question type="button">${fundraisingQuestionDeletePendingId === selected.id ? "Confirm Delete" : "Delete Answer"}</button>
          ` : `<p class="fundraising-workspace-empty">Create the first reusable answer to begin the library.</p>`}
        </article>
      </div>
      <p class="fundraising-workspace-status" data-fundraising-workspace-status role="status" aria-live="polite"></p>
    </section>
  `;
}

function organizationValue(value) {
  return escapeHtml(value || "-");
}

function renderFundraisingOrganizationEditor() {
  const info = fundraisingOrganizationInfo;
  const fields = [
    ["Legal Name", "legalName"], ["DBA Name", "dbaName"], ["EIN", "ein"], ["Year Founded", "yearFounded"],
    ["Mailing Address", "mailingAddress"], ["Website", "websiteUrl"], ["Social Media Links", "socialMediaLinks"], ["Annual Budget", "annualBudget"],
    ["Funding Structure", "fundingStructure"], ["Population Served", "populationServed"], ["Mission", "mission"], ["Vision", "vision"],
    ["Guiding Principles", "guidingPrinciples"], ["Organization Description", "organizationDescription"], ["Data Notes", "dataNotes"]
  ];
  return `
    <form class="fundraising-organization-editor" data-fundraising-organization-form>
      <div class="fundraising-editor-heading"><h3>Edit Organization Information</h3><button data-cancel-fundraising-organization type="button">Cancel</button></div>
      <div class="fundraising-organization-fields">
        ${fields.map(([label, name]) => {
          const longField = ["mailingAddress", "socialMediaLinks", "fundingStructure", "mission", "vision", "guidingPrinciples", "organizationDescription", "populationServed", "dataNotes"].includes(name);
          return `<label class="${longField ? "is-wide" : ""}"><span>${label}</span>${longField
            ? `<textarea name="${name}" rows="${["mission", "vision", "guidingPrinciples", "organizationDescription"].includes(name) ? 3 : 2}">${escapeHtml(info[name] ?? "")}</textarea>`
            : `<input name="${name}" value="${escapeHtml(info[name] ?? "")}" ${name === "yearFounded" ? "type=number" : ""}>`}</label>`;
        }).join("")}
      </div>
      <div class="fundraising-editor-actions"><button type="submit">Save Information</button></div>
    </form>
  `;
}

function renderFundraisingOrganization() {
  const info = fundraisingOrganizationInfo;
  return `
    <section class="fundraising-workspace-panel" data-fundraising-workspace-panel="Organization" ${fundraisingWorkspaceView === "Organization" ? "" : "hidden"}>
      <div class="fundraising-workspace-heading"><div><h2>Organization Information</h2><p>Frequently requested details kept in one current source.</p></div></div>
      ${fundraisingOrganizationEditing ? renderFundraisingOrganizationEditor() : `
        <div class="fundraising-organization-grid">
          <section><h3>Identity</h3><dl>
            <div><dt>Legal Name</dt><dd>${organizationValue(info.legalName)}</dd></div>
            <div><dt>DBA</dt><dd>${organizationValue(info.dbaName)}</dd></div>
            <div><dt>EIN</dt><dd>${organizationValue(info.ein)}</dd></div>
            <div><dt>Year Founded</dt><dd>${organizationValue(info.yearFounded)}</dd></div>
            <div><dt>Annual Budget</dt><dd>${organizationValue(info.annualBudget)}</dd></div>
          </dl></section>
          <section><h3>Contact</h3><dl>
            <div><dt>Mailing Address</dt><dd>${organizationValue(info.mailingAddress)}</dd></div>
            <div><dt>Website</dt><dd>${organizationValue(info.websiteUrl)}</dd></div>
            <div><dt>Social Media</dt><dd>${organizationValue(info.socialMediaLinks)}</dd></div>
            <div><dt>Population Served</dt><dd>${organizationValue(info.populationServed)}</dd></div>
          </dl></section>
          <section class="is-wide"><h3>Core Language</h3><dl>
            <div><dt>Mission</dt><dd>${organizationValue(info.mission)}</dd></div>
            <div><dt>Vision</dt><dd>${organizationValue(info.vision)}</dd></div>
            <div><dt>Organization Description</dt><dd>${organizationValue(info.organizationDescription)}</dd></div>
            <div><dt>Funding Structure</dt><dd>${organizationValue(info.fundingStructure)}</dd></div>
          </dl></section>
        </div>
      `}
      <p class="fundraising-workspace-status" data-fundraising-workspace-status role="status" aria-live="polite"></p>
    </section>
  `;
}

function renderFundraisingDocumentEditor() {
  const selectedGrantId = fundraisingGrantItems.some((item) => item.id === selectedItemId)
    ? selectedItemId
    : fundraisingGrantItems[0]?.id || "";
  return `
    <form class="fundraising-document-editor" data-fundraising-document-form>
      <div class="fundraising-editor-heading"><h3>Upload Document</h3><button data-cancel-fundraising-document type="button">Cancel</button></div>
      <div class="fundraising-document-fields">
        <label class="is-wide"><span>File</span><input name="documentFile" type="file" accept=".pdf,.docx,.xlsx,.csv,.txt,.jpg,.jpeg,.png,.webp" required></label>
        <label><span>Document Name</span><input name="title" placeholder="Uses the file name when blank"></label>
        <label><span>Category</span><select name="category">
          ${["Application", "Award", "Budget", "Financial", "Guidelines", "Organization", "Report", "Other"].map((category) => `<option>${category}</option>`).join("")}
        </select></label>
        <label class="is-wide"><span>Save Under</span><select name="target" required>
          <option value="organization" ${selectedGrantId ? "" : "selected"}>Organization Information</option>
          ${fundraisingGrantItems.map((item) => `<option value="grant:${escapeHtml(item.id)}" ${item.id === selectedGrantId ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}
        </select></label>
        <label class="is-wide"><span>Notes</span><textarea name="notes" rows="2"></textarea></label>
      </div>
      <div class="fundraising-editor-actions"><button type="submit">Upload Document</button></div>
    </form>
  `;
}

function renderFundraisingDocumentWorkspace() {
  const documents = grantDocumentRows(fundraisingGrantItems, fundraisingOrganizationInfo);
  return `
    <section class="fundraising-workspace-panel" data-fundraising-workspace-panel="Documents" ${fundraisingWorkspaceView === "Documents" ? "" : "hidden"}>
      <div class="fundraising-workspace-heading"><div><h2>Grant Documents</h2><p>Organization files and documents linked to individual grants.</p></div></div>
      ${fundraisingDocumentEditorOpen ? renderFundraisingDocumentEditor() : ""}
      <div class="fundraising-document-table">
        <div class="fundraising-document-header"><span>Document</span><span>Source</span><span>Category</span><span>Actions</span></div>
        ${documents.map((document) => `
          <div class="fundraising-document-row">
            <span><strong>${escapeHtml(document.title)}</strong></span>
            <span>${escapeHtml(document.grantTitle)}</span>
            <span>${escapeHtml(document.category)}</span>
            <span class="fundraising-document-actions">
              ${document.storagePath
                ? `${grantDocumentPreviewKind(document) ? `<button class="is-document-action" data-preview-fundraising-document data-document-row-id="${escapeHtml(document.id)}" type="button">Preview</button>` : ""}
                  <button class="is-document-action" data-download-fundraising-document data-document-row-id="${escapeHtml(document.id)}" type="button">Download</button>`
                : document.url ? `<a href="${escapeHtml(document.url)}" target="_blank" rel="noopener noreferrer">Open</a>` : ""}
              <button
                class="${fundraisingDocumentDeletePendingId === document.id ? "is-confirming" : ""}"
                data-delete-fundraising-document
                data-document-row-id="${escapeHtml(document.id)}"
                data-document-scope="${escapeHtml(document.scope)}"
                data-document-index="${document.documentIndex}"
                data-document-grant-id="${escapeHtml(document.grantId)}"
                type="button"
                title="${fundraisingDocumentDeletePendingId === document.id ? "Confirm document deletion" : "Delete document"}"
                aria-label="${fundraisingDocumentDeletePendingId === document.id ? `Confirm deletion of ${escapeHtml(document.title)}` : `Delete ${escapeHtml(document.title)}`}"
              >${fundraisingDocumentDeletePendingId === document.id ? "Confirm" : icons.trash}</button>
            </span>
          </div>
        `).join("") || `<p class="fundraising-workspace-empty">No grant documents are linked yet.</p>`}
      </div>
      <p class="fundraising-workspace-status" data-fundraising-workspace-status role="status" aria-live="polite"></p>
    </section>
  `;
}

function renderFundraisingWorkspacePanels() {
  return [
    renderFundraisingPipeline(),
    renderFundraisingDeadlines(),
    renderFundraisingAnswerLibrary(),
    renderFundraisingOrganization(),
    renderFundraisingDocumentWorkspace()
  ].join("");
}

function refreshFundraisingWorkspace() {
  if (currentModuleId() !== "fundraising" || fundraisingSubpage !== "Grants") return;
  const tabHost = document.querySelector("[data-fundraising-workspace-tabs-host]");
  const panelHost = document.querySelector("[data-fundraising-workspace-panels-host]");
  const workspace = document.querySelector(".workspace");
  if (tabHost) tabHost.innerHTML = renderFundraisingWorkspaceTabs();
  if (panelHost) panelHost.innerHTML = renderFundraisingWorkspacePanels();
  if (workspace) workspace.hidden = fundraisingWorkspaceView !== "Details";
  const primary = document.querySelector(".page-header .primary-action");
  if (primary) {
    primary.innerHTML = `${icons.plus}${escapeHtml(fundraisingWorkspacePrimaryAction())}`;
    primary.removeAttribute("data-fundraising-new");
    primary.removeAttribute("data-fundraising-new-answer");
    primary.removeAttribute("data-fundraising-edit-organization");
    primary.removeAttribute("data-fundraising-upload-document");
    if (fundraisingWorkspaceView === "Answer Library") primary.dataset.fundraisingNewAnswer = "";
    else if (fundraisingWorkspaceView === "Organization") primary.dataset.fundraisingEditOrganization = "";
    else if (fundraisingWorkspaceView === "Documents") primary.dataset.fundraisingUploadDocument = "";
    else primary.dataset.fundraisingNew = "";
  }
}

function setFundraisingWorkspaceView(view, grantId = "") {
  if (!fundraisingWorkspaceViews.some(([label]) => label === view) || fundraisingActionBusy) return;
  fundraisingWorkspaceView = view;
  if (grantId) selectedItemId = grantId;
  fundraisingQuestionEditorMode = "";
  fundraisingOrganizationEditing = false;
  if (view !== "Documents") {
    fundraisingDocumentEditorOpen = false;
    fundraisingDocumentDeletePendingId = "";
  }
  const url = new URL(window.location.href);
  url.searchParams.set("section", "Grants");
  url.searchParams.set("view", view);
  history.replaceState({}, "", url);
  renderModulePage("fundraising");
  refreshFundraisingAccountControl();
}

function setFundraisingWorkspaceStatus(message = "", state = "") {
  document.querySelectorAll("[data-fundraising-workspace-status]").forEach((status) => {
    status.textContent = message;
    status.dataset.state = state;
  });
}

async function saveFundraisingPipelineStatus(grantId, status) {
  const item = fundraisingGrantItems.find((candidate) => candidate.id === grantId);
  if (!item || fundraisingActionBusy || item.status === status) return;

  setFundraisingActionBusy(true);
  setFundraisingWorkspaceStatus(`Moving ${item.title} to ${status}...`);
  try {
    await fundraisingAuthedFetch(`/api/grants/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(grantMovePayload(item, status))
    });
    await loadFundraisingData(fundraisingCurrentUser, item.id);
    setFundraisingWorkspaceStatus(`${item.title} moved to ${status}.`, "success");
  } catch (error) {
    console.error(error);
    refreshFundraisingWorkspace();
    setFundraisingWorkspaceStatus(error.message || "Could not move the grant.", "error");
  } finally {
    setFundraisingActionBusy(false);
  }
}

async function saveFundraisingQuestion(form) {
  if (fundraisingActionBusy) return;
  const questionId = form.dataset.questionId || "";
  const payload = grantQuestionPayload(Object.fromEntries(new FormData(form).entries()));
  if (!payload.prompt || !payload.answer) {
    setFundraisingWorkspaceStatus("Add both the question and approved answer.", "error");
    form.elements.prompt?.focus();
    return;
  }

  setFundraisingActionBusy(true);
  setFundraisingWorkspaceStatus("Saving answer...");
  try {
    const result = await fundraisingAuthedFetch(questionId ? `/api/grant-questions/${encodeURIComponent(questionId)}` : "/api/grant-questions", {
      method: questionId ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    fundraisingSelectedQuestionId = result.question?.id || questionId;
    fundraisingQuestionEditorMode = "";
    await loadFundraisingData(fundraisingCurrentUser, selectedItemId);
    setFundraisingWorkspaceStatus("Reusable answer saved.", "success");
  } catch (error) {
    console.error(error);
    setFundraisingWorkspaceStatus(error.message || "Could not save the reusable answer.", "error");
  } finally {
    setFundraisingActionBusy(false);
  }
}

async function deleteFundraisingQuestion() {
  const item = selectedFundraisingQuestion();
  if (!item || fundraisingActionBusy) return;
  if (fundraisingQuestionDeletePendingId !== item.id) {
    fundraisingQuestionDeletePendingId = item.id;
    refreshFundraisingWorkspace();
    setFundraisingWorkspaceStatus("Click Confirm Delete to permanently remove this saved answer.");
    return;
  }

  setFundraisingActionBusy(true);
  setFundraisingWorkspaceStatus("Deleting answer...");
  try {
    await fundraisingAuthedFetch(`/api/grant-questions/${encodeURIComponent(item.id)}`, { method: "DELETE" });
    fundraisingSelectedQuestionId = "";
    fundraisingQuestionEditorMode = "";
    fundraisingQuestionDeletePendingId = "";
    await loadFundraisingData(fundraisingCurrentUser, selectedItemId);
    setFundraisingWorkspaceStatus("Reusable answer deleted.", "success");
  } catch (error) {
    console.error(error);
    setFundraisingWorkspaceStatus(error.message || "Could not delete the reusable answer.", "error");
  } finally {
    setFundraisingActionBusy(false);
  }
}

async function copyFundraisingAnswer() {
  const item = selectedFundraisingQuestion();
  if (!item?.answer) return;
  try {
    await navigator.clipboard.writeText(item.answer);
    setFundraisingWorkspaceStatus("Answer copied.", "success");
  } catch (error) {
    console.error(error);
    setFundraisingWorkspaceStatus("The answer could not be copied automatically.", "error");
  }
}

async function saveFundraisingOrganization(form) {
  if (fundraisingActionBusy) return;
  const payload = grantOrganizationInfoPayload(
    Object.fromEntries(new FormData(form).entries()),
    fundraisingOrganizationInfo
  );

  setFundraisingActionBusy(true);
  setFundraisingWorkspaceStatus("Saving organization information...");
  try {
    const result = await fundraisingAuthedFetch("/api/grant-organization-info", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    fundraisingOrganizationInfo = mapGrantOrganizationInfo(result.organizationInfo || payload);
    fundraisingOrganizationEditing = false;
    refreshFundraisingWorkspace();
    setFundraisingWorkspaceStatus("Organization information saved.", "success");
  } catch (error) {
    console.error(error);
    setFundraisingWorkspaceStatus(error.message || "Could not save organization information.", "error");
  } finally {
    setFundraisingActionBusy(false);
  }
}

function fundraisingStorageSafeSegment(value) {
  return String(value || "document")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "document";
}

function fundraisingDocumentId() {
  return typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function saveFundraisingDocument(form) {
  if (fundraisingActionBusy) return;
  const file = form.elements.documentFile?.files?.[0] || null;
  const fileError = grantDocumentFileError(file);
  if (fileError) {
    setFundraisingWorkspaceStatus(fileError, "error");
    form.elements.documentFile?.focus();
    return;
  }
  const signatureError = await grantDocumentFileSignatureError(file);
  if (signatureError) {
    setFundraisingWorkspaceStatus(signatureError, "error");
    form.elements.documentFile?.focus();
    return;
  }
  if (!fundraisingStorage || !fundraisingStorageApi) {
    setFundraisingWorkspaceStatus("Document storage could not be started. Refresh and sign in again.", "error");
    return;
  }

  const values = Object.fromEntries(new FormData(form).entries());
  const target = String(values.target || "organization");
  const grantId = target.startsWith("grant:") ? target.slice(6) : "";
  const grantItem = grantId ? fundraisingGrantItems.find((item) => item.id === grantId) : null;
  if (grantId && !grantItem) {
    setFundraisingWorkspaceStatus("Choose a current grant for this document.", "error");
    form.elements.target?.focus();
    return;
  }

  const documentId = fundraisingDocumentId();
  const owner = fundraisingStorageSafeSegment(fundraisingCurrentUser?.uid || fundraisingCurrentUser?.email || "staff");
  const source = grantItem ? `grants/${fundraisingStorageSafeSegment(grantItem.id)}` : "organization";
  const fileName = fundraisingStorageSafeSegment(file.name);
  const storagePath = `grant-documents/${owner}/${source}/${Date.now()}-${documentId}-${fileName}`;
  const storageRef = fundraisingStorageApi.ref(fundraisingStorage, storagePath);
  let uploaded = false;
  let metadataSaved = false;

  setFundraisingActionBusy(true);
  setFundraisingWorkspaceStatus(`Uploading ${file.name}...`);
  try {
    await fundraisingStorageApi.uploadBytes(storageRef, file, {
      contentType: grantDocumentMimeType(file),
      customMetadata: {
        uploadedBy: fundraisingCurrentUser?.email || "",
        source: grantItem ? "grant" : "organization",
        sourceId: grantItem?.id || "organization"
      }
    });
    uploaded = true;
    const document = grantDocumentPayload({
      id: documentId,
      type: values.category,
      category: values.category,
      title: values.title || file.name.replace(/\.[^.]+$/, ""),
      url: "",
      storagePath,
      fileName: file.name,
      mimeType: grantDocumentMimeType(file),
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: fundraisingCurrentUser?.email || "",
      notes: values.notes
    });

    if (grantItem) {
      const payload = grantPayload({
        ...grantItem.source,
        documents: [...(grantItem.source.documents || []), document]
      }, grantItem.source);
      await fundraisingAuthedFetch(`/api/grants/${encodeURIComponent(grantItem.id)}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
    } else {
      const payload = grantOrganizationInfoPayload({
        documents: [...fundraisingOrganizationInfo.documents, document]
      }, fundraisingOrganizationInfo);
      await fundraisingAuthedFetch("/api/grant-organization-info", {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
    }
    metadataSaved = true;

    fundraisingDocumentEditorOpen = false;
    fundraisingDocumentDeletePendingId = "";
    await loadFundraisingData(fundraisingCurrentUser, grantItem?.id || selectedItemId);
    setFundraisingWorkspaceStatus("Document uploaded.", "success");
  } catch (error) {
    if (uploaded && !metadataSaved) {
      await fundraisingStorageApi.deleteObject(storageRef).catch((cleanupError) => console.error(cleanupError));
    }
    console.error(error);
    setFundraisingWorkspaceStatus(error.message || "Could not upload the document.", "error");
  } finally {
    setFundraisingActionBusy(false);
  }
}

async function deleteFundraisingDocument(button) {
  if (fundraisingActionBusy) return;
  const rowId = button.dataset.documentRowId || "";
  const document = grantDocumentRows(fundraisingGrantItems, fundraisingOrganizationInfo)
    .find((row) => row.id === rowId);
  if (!document) return;

  if (fundraisingDocumentDeletePendingId !== rowId) {
    fundraisingDocumentDeletePendingId = rowId;
    refreshFundraisingWorkspace();
    setFundraisingWorkspaceStatus("Click Confirm to permanently remove this document.");
    return;
  }

  setFundraisingActionBusy(true);
  setFundraisingWorkspaceStatus(`Deleting ${document.title}...`);
  try {
    if (document.storagePath && (!fundraisingStorage || !fundraisingStorageApi)) {
      throw new Error("Document storage could not be started. Refresh and sign in again.");
    }
    if (document.storagePath) {
      const storageRef = fundraisingStorageApi.ref(fundraisingStorage, document.storagePath);
      await fundraisingStorageApi.deleteObject(storageRef).catch((error) => {
        if (error?.code !== "storage/object-not-found") throw error;
      });
    }

    if (document.scope === "organization") {
      const payload = grantOrganizationInfoPayload({
        documents: grantDocumentsWithoutIndex(fundraisingOrganizationInfo.documents, document.documentIndex)
      }, fundraisingOrganizationInfo);
      await fundraisingAuthedFetch("/api/grant-organization-info", {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
    } else {
      const grantItem = fundraisingGrantItems.find((item) => item.id === document.grantId);
      if (!grantItem) throw new Error("The linked grant could not be found.");
      const payload = grantPayload({
        ...grantItem.source,
        documents: grantDocumentsWithoutIndex(grantItem.source.documents, document.documentIndex)
      }, grantItem.source);
      await fundraisingAuthedFetch(`/api/grants/${encodeURIComponent(grantItem.id)}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
    }

    fundraisingDocumentDeletePendingId = "";
    await loadFundraisingData(fundraisingCurrentUser, selectedItemId);
    setFundraisingWorkspaceStatus("Document deleted.", "success");
  } catch (error) {
    console.error(error);
    fundraisingDocumentDeletePendingId = "";
    refreshFundraisingWorkspace();
    setFundraisingWorkspaceStatus(error.message || "Could not delete the document.", "error");
  } finally {
    setFundraisingActionBusy(false);
  }
}

function fundraisingDocumentRow(rowId = "") {
  return grantDocumentRows(fundraisingGrantItems, fundraisingOrganizationInfo)
    .find((row) => row.id === rowId);
}

async function fundraisingDocumentBlob(documentRow) {
  if (!fundraisingCurrentUser) throw new Error("Sign in again to access this document.");
  if (!fundraisingStorage || !fundraisingStorageApi) {
    throw new Error("Document storage could not be started. Refresh and sign in again.");
  }
  const storageRef = fundraisingStorageApi.ref(fundraisingStorage, documentRow.storagePath);
  return fundraisingStorageApi.getBlob(storageRef, 20 * 1024 * 1024);
}

function clearFundraisingDocumentPreview() {
  if (fundraisingDocumentPreviewObjectUrl) URL.revokeObjectURL(fundraisingDocumentPreviewObjectUrl);
  fundraisingDocumentPreviewObjectUrl = "";
  document.querySelector("[data-fundraising-document-preview-body]")?.replaceChildren();
}

function ensureFundraisingDocumentPreviewDialog() {
  let dialog = document.querySelector("[data-fundraising-document-preview]");
  if (dialog) return dialog;
  dialog = document.createElement("dialog");
  dialog.className = "fundraising-document-preview";
  dialog.dataset.fundraisingDocumentPreview = "true";
  dialog.innerHTML = `
    <div class="fundraising-document-preview-heading">
      <h2 data-fundraising-document-preview-title>Document Preview</h2>
      <button data-close-fundraising-document-preview type="button" aria-label="Close preview">&times;</button>
    </div>
    <div class="fundraising-document-preview-body" data-fundraising-document-preview-body></div>`;
  dialog.addEventListener("close", clearFundraisingDocumentPreview);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog
      && grantPreviewClickIsOutside(dialog.getBoundingClientRect(), event.clientX, event.clientY)) {
      dialog.close();
    }
  });
  document.body.append(dialog);
  return dialog;
}

async function previewFundraisingDocument(button) {
  const rowId = button.dataset.documentRowId || "";
  const documentRow = fundraisingDocumentRow(rowId);
  const previewKind = grantDocumentPreviewKind(documentRow);
  if (!documentRow?.storagePath || !previewKind) return;

  button.disabled = true;
  setFundraisingWorkspaceStatus(`Preparing ${documentRow.title}...`);
  try {
    const blob = await fundraisingDocumentBlob(documentRow);
    const dialog = ensureFundraisingDocumentPreviewDialog();
    const title = dialog.querySelector("[data-fundraising-document-preview-title]");
    const body = dialog.querySelector("[data-fundraising-document-preview-body]");
    clearFundraisingDocumentPreview();
    title.textContent = documentRow.title;
    if (previewKind === "text") {
      const previewLimit = 1024 * 1024;
      const pre = document.createElement("pre");
      pre.textContent = await blob.slice(0, previewLimit).text();
      body.append(pre);
      if (blob.size > previewLimit) {
        const note = document.createElement("p");
        note.textContent = "Preview limited to the first 1 MB. Download the file to see the rest.";
        body.prepend(note);
      }
    } else {
      fundraisingDocumentPreviewObjectUrl = URL.createObjectURL(blob);
      if (previewKind === "image") {
        const image = document.createElement("img");
        image.src = fundraisingDocumentPreviewObjectUrl;
        image.alt = documentRow.title;
        body.append(image);
      } else {
        const frame = document.createElement("iframe");
        frame.src = fundraisingDocumentPreviewObjectUrl;
        frame.title = documentRow.title;
        body.append(frame);
      }
    }
    dialog.showModal();
    await fundraisingAuthedFetch("/api/security-events", {
      method: "POST",
      body: JSON.stringify({ action: "grant.document_viewed", resourceType: "grantDocument", resourceId: rowId })
    });
    setFundraisingWorkspaceStatus("Preview opened.", "success");
  } catch (error) {
    setFundraisingWorkspaceStatus(error.message || "The document could not be previewed. Check your Grants access and try again.", "error");
  } finally {
    button.disabled = false;
  }
}

async function downloadFundraisingDocument(button) {
  const rowId = button.dataset.documentRowId || "";
  const documentRow = fundraisingDocumentRow(rowId);
  if (!documentRow?.storagePath) return;

  button.disabled = true;
  setFundraisingWorkspaceStatus(`Downloading ${documentRow.title}...`);
  try {
    const blob = await fundraisingDocumentBlob(documentRow);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = documentRow.fileName || documentRow.title || "grant-document";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    await fundraisingAuthedFetch("/api/security-events", {
      method: "POST",
      body: JSON.stringify({ action: "grant.document_viewed", resourceType: "grantDocument", resourceId: rowId })
    });
    setFundraisingWorkspaceStatus("Document downloaded.", "success");
  } catch (error) {
    setFundraisingWorkspaceStatus(error.message || "The document could not be downloaded. Check your Grants access and try again.", "error");
  } finally {
    button.disabled = false;
  }
}

function renderNav(activeId) {
  return moduleOrder.filter((id) => staffCanAccessModule(id)).map((id) => {
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
            ${module.subpages.filter((label) => id !== "fundraising" || staffCanAccessFinanceSection(label)).map((label, index) => `
              <button
                class="${activeId === "schedule" ? (label === scheduleSubpage ? "is-current" : "") : activeId === "crm" ? (label === crmSubpage ? "is-current" : "") : activeId === "outreach" ? (label === outreachSubpage ? "is-current" : "") : activeId === "fundraising" ? (label === fundraisingSubpage ? "is-current" : "") : activeId === "marketing" ? (label === marketingSubpage ? "is-current" : "") : activeId === "operations" ? (label === operationsSubpage ? "is-current" : "") : activeId === "admin" ? (label === adminSubpage ? "is-current" : "") : (index === 0 ? "is-current" : "")}"
                ${activeId === "schedule" ? `data-schedule-subpage="${escapeHtml(label)}"` : ""}
                ${activeId === "crm" ? `data-crm-subpage="${escapeHtml(label)}"` : ""}
                ${activeId === "outreach" ? `data-outreach-subpage="${escapeHtml(label)}"` : ""}
                ${activeId === "fundraising" ? `data-fundraising-subpage="${escapeHtml(label)}"` : ""}
                ${activeId === "marketing" ? `data-marketing-subpage="${escapeHtml(label)}"` : ""}
                ${activeId === "operations" ? `data-operations-subpage="${escapeHtml(label)}"` : ""}
                ${activeId === "admin" ? `data-admin-subpage="${escapeHtml(label)}"` : ""}
                type="button"
              >${label}</button>
            `).join("")}
          </div>
        ` : ""}
      </section>
    `;
  }).join("");
}

function renderStandardListRow(module, item) {
  return `
    <button
      class="list-row ${item.id === selectedItemId ? "is-selected" : ""}"
      data-row-id="${escapeHtml(item.id)}"
      data-tone="module"
      type="button"
    >
      <strong>${escapeHtml(item.title)}</strong>
      <span class="status-pill" ${module === modules.crm && item.statusColor ? `style="--row-color: ${escapeHtml(item.statusColor)};"` : item.statusTone ? `data-status-tone="${escapeHtml(item.statusTone)}"` : ""}>${escapeHtml(module === modules.crm ? crmStatusLabel(item.status) : item.status)}</span>
      <span>${escapeHtml(item.subtitle)}</span>
    </button>
  `;
}

function renderCrmClientGroupedRows(items = []) {
  const groups = [];
  items.forEach((item) => {
    let group = groups.find((candidate) => candidate.status === item.status);
    if (!group) {
      group = { status: item.status, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  });
  const searchIsActive = Boolean(crmSearchQuery.trim());
  return groups.map((group) => {
    const expanded = searchIsActive || crmExpandedClientStatuses.has(group.status);
    return `
      <section class="crm-client-status-group" data-crm-client-status-group="${escapeHtml(group.status)}">
        <button class="crm-client-status-heading" data-crm-client-status-toggle="${escapeHtml(group.status)}" type="button" aria-expanded="${expanded}">
          <span>${icons.chevronRight}<strong>${escapeHtml(crmStatusLabel(group.status))}</strong></span>
          <span>${group.items.length}</span>
        </button>
        <div class="crm-client-status-items" ${expanded ? "" : "hidden"}>
          ${group.items.map((item) => renderStandardListRow(modules.crm, item)).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function renderCrmReferralGroupedRows(items = []) {
  const groups = [];
  items.forEach((item) => {
    let group = groups.find((candidate) => candidate.status === item.status);
    if (!group) {
      group = { status: item.status, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  });
  const searchIsActive = Boolean(crmSearchQuery.trim());
  return groups.map((group) => {
    const expanded = searchIsActive || crmExpandedReferralStatuses.has(group.status);
    return `
      <section class="crm-client-status-group" data-crm-referral-status-group="${escapeHtml(group.status)}">
        <button class="crm-client-status-heading" data-crm-referral-status-toggle="${escapeHtml(group.status)}" type="button" aria-expanded="${expanded}">
          <span>${icons.chevronRight}<strong>${escapeHtml(group.status)}</strong></span>
          <span>${group.items.length}</span>
        </button>
        <div class="crm-client-status-items" ${expanded ? "" : "hidden"}>
          ${group.items.map((item) => renderStandardListRow(modules.crm, item)).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function marketingContactGroup(item = {}) {
  if (!item.email || item.email === "-") return "Missing Email / Review";
  if (item.emailOptOut || item.status === "Unsubscribed") return "Unsubscribed / Opted Out";
  if (item.eligible) return "Ready for Email";
  return "Consent Needed";
}

function renderMarketingContactGroupedRows(items = []) {
  const groupNames = ["Ready for Email", "Consent Needed", "Unsubscribed / Opted Out", "Missing Email / Review"];
  const searchIsActive = Boolean(marketingSearchQuery.trim());
  return `
    <div class="crm-group-tools" aria-label="Marketing contact groups">
      <button data-marketing-contact-expand-all type="button">Expand All</button>
      <button data-marketing-contact-collapse-all type="button">Collapse All</button>
    </div>
    ${groupNames.map((name) => {
      const groupItems = items.filter((item) => marketingContactGroup(item) === name);
      if (!groupItems.length) return "";
      const expanded = searchIsActive || marketingExpandedContactGroups.has(name);
      return `
        <section class="crm-client-status-group" data-marketing-contact-group="${escapeHtml(name)}">
          <button class="crm-client-status-heading" data-marketing-contact-toggle="${escapeHtml(name)}" type="button" aria-expanded="${expanded}">
            <span>${icons.chevronRight}<strong>${escapeHtml(name)}</strong></span><span>${groupItems.length}</span>
          </button>
          <div class="crm-client-status-items" ${expanded ? "" : "hidden"}>
            ${groupItems.map((item) => renderStandardListRow(modules.marketing, item)).join("")}
          </div>
        </section>
      `;
    }).join("")}
  `;
}

function renderListRows(module) {
  if (module === modules.crm && crmSubpage === "Tasks") {
    return renderCrmTaskRows(module.items);
  }

  if (!module.items.length) {
    const message = module === modules.crm
      ? crmDataMessage
      : module === modules.outreach
        ? outreachDataMessage
        : module === modules.fundraising
          ? fundraisingDataMessage
          : module === modules.marketing
            ? marketingDataMessage
          : "No records to show.";
    return `<p class="list-empty" role="status">${escapeHtml(message)}</p>`;
  }

  if (module === modules.crm && crmSubpage === "Clients") return renderCrmClientGroupedRows(module.items);
  if (module === modules.crm && crmSubpage === "Referrals") return renderCrmReferralGroupedRows(module.items);
  if (module === modules.marketing && marketingSubpage === "Contacts") return renderMarketingContactGroupedRows(module.items);
  return module.items.map((item) => renderStandardListRow(module, item)).join("");
}

function renderCrmTaskRows(items = []) {
  const openTaskItems = items.filter((item) => item.queue === "Workflow Tasks");
  const completedTaskItems = crmCompletedTaskItems(crmRawTasks);
  const showingCompletedTasks = crmDashboardTaskView === "completed";
  const taskItems = showingCompletedTasks ? completedTaskItems : openTaskItems;
  const taskSummary = crmDashboardTaskSummary(items);
  const visibleTasks = crmDashboardExpandedQueues.has("Workflow Tasks") ? taskItems : taskItems.slice(0, 6);

  return `<div class="crm-dashboard-workspace">
    ${crmDashboardActionMessage ? `<p class="crm-dashboard-message" role="status">${escapeHtml(crmDashboardActionMessage)}</p>` : ""}
    <section class="crm-dashboard-task-panel" aria-label="Workflow tasks">
      <header>
        <div>
          <h3>Tasks</h3>
          <p>${showingCompletedTasks ? "Completed work remains available to review or restore" : "Assigned follow-up work, ordered by due date"}</p>
        </div>
        <div class="crm-dashboard-task-tools">
          <div class="crm-dashboard-task-view" role="group" aria-label="Task view">
            <button class="${showingCompletedTasks ? "" : "is-active"}" data-crm-dashboard-task-view="open" type="button">Open</button>
            <button class="${showingCompletedTasks ? "is-active" : ""}" data-crm-dashboard-task-view="completed" type="button">Completed</button>
          </div>
          <button class="crm-dashboard-new-task" data-crm-dashboard-new-task type="button">${icons.plus}New Task</button>
        </div>
      </header>
      ${showingCompletedTasks ? `
        <div class="crm-dashboard-task-history-summary"><strong>${completedTaskItems.length}</strong> completed task${completedTaskItems.length === 1 ? "" : "s"}</div>
      ` : `<div class="crm-dashboard-task-totals" aria-label="Task totals">
          <span data-tone="red"><strong>${taskSummary.overdue}</strong> Overdue</span>
          <span data-tone="yellow"><strong>${taskSummary.dueToday}</strong> Today</span>
          <span data-tone="blue"><strong>${taskSummary.upcoming}</strong> Upcoming</span>
        </div>`}
      <div class="crm-dashboard-task-list">
        ${visibleTasks.length ? visibleTasks.map((item) => {
          const linked = Boolean(item.section && item.recordId);
          return `
            <article class="crm-dashboard-task-row">
              <button class="crm-dashboard-task-copy" ${linked ? `data-crm-dashboard-section="${escapeHtml(item.section)}" data-crm-dashboard-record-id="${escapeHtml(item.recordId)}"` : "disabled"} type="button">
                <strong>${escapeHtml(item.title)}</strong>
                <span>${escapeHtml(item.subtitle)}</span>
              </button>
              <span class="status-pill" data-status-tone="${escapeHtml(item.statusTone || "navy")}">${escapeHtml(item.status)}</span>
              ${showingCompletedTasks
                ? `<button class="crm-dashboard-task-restore" data-crm-dashboard-restore-task="${escapeHtml(item.taskId)}" type="button" title="Restore task" aria-label="Restore ${escapeHtml(item.title)}" ${crmDashboardTaskBusyId === item.taskId ? "disabled" : ""}>${icons.history}</button>`
                : `<button class="crm-dashboard-task-complete" data-crm-dashboard-complete-task="${escapeHtml(item.taskId)}" type="button" title="Mark task complete" aria-label="Mark ${escapeHtml(item.title)} complete" ${crmDashboardTaskBusyId === item.taskId ? "disabled" : ""}>${icons.check}</button>`}
            </article>
          `;
        }).join("") : `<p class="crm-dashboard-none">${showingCompletedTasks ? "No completed tasks yet." : "No open workflow tasks."}</p>`}
      </div>
      ${taskItems.length > 6 ? `
        <button class="crm-dashboard-expand" data-crm-dashboard-toggle-queue="Workflow Tasks" type="button">
          ${crmDashboardExpandedQueues.has("Workflow Tasks") ? "Show Less" : `View All ${taskItems.length}`}
        </button>
      ` : ""}
    </section>
  </div>`;
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
  if (module === modules.crm && crmSubpage === "Tasks") {
    selectedItemId = "";
    updateDetail(module, "");
    return;
  }
  const requestedClientId = module === modules.crm && crmSubpage === "Clients"
    ? new URLSearchParams(window.location.search).get("client")
    : "";
  const requestedReferralId = module === modules.crm && crmSubpage === "Referrals"
    ? new URLSearchParams(window.location.search).get("referral")
    : "";
  const requestedRecordId = requestedReferralId || requestedClientId;
  selectedItemId = crmPreferredItemId(module.items, selectedItemId, requestedRecordId);
  updateDetail(module, selectedItemId);
}

function refreshOutreachData(module, preferredItemId = selectedItemId) {
  module.summary = outreachSubpage === "Volunteers"
    ? volunteerSummary(outreachVolunteerProfileItems, outreachVolunteerOpportunityItems)
    : outreachSummary(outreachRawEvents, outreachRawContacts);
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
      ${Array.from({ length: totalSlots }, (_, index) => {
        const time = scheduleTimeKey(startMinutes + (index * intervalMinutes));
        return `
          <button
            class="schedule-open-slot"
            data-schedule-new-time="${escapeHtml(time)}"
            type="button"
            style="--slot-index: ${index};"
            aria-label="Schedule a new appointment at ${escapeHtml(formatScheduleTime(scheduleTimeMinutes(time)))}"
            title="Schedule a new appointment at ${escapeHtml(formatScheduleTime(scheduleTimeMinutes(time)))}"
          ></button>
        `;
      }).join("")}
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

function schedulePrintSelectionItems(module) {
  const printable = printableScheduleItems(module.items, scheduleVisibleDate);
  const appointments = printable.filter((item) => item.status !== "Blocked");
  const formPackets = dailyFormPacketRequests(module.items, scheduleVisibleDate, scheduleClientsById);
  const items = [];

  if (printable.length) {
    items.push({ id: "daily-schedule", group: "Daily", label: "Daily Schedule", detail: `${printable.length} schedule ${printable.length === 1 ? "item" : "items"}` });
  }
  if (appointments.length) {
    items.push({ id: "daily-prep", group: "Daily", label: "Daily Prep List", detail: `${appointments.length} ${appointments.length === 1 ? "appointment" : "appointments"}` });
  }
  formPackets.forEach((request) => {
    const appointment = appointments.find((item) => String(item.id || item.source?.id || "") === request.appointmentId);
    const time = appointment?.time ? formatScheduleTime(scheduleTimeMinutes(appointment.time)) : "";
    items.push({
      id: `packet:${request.appointmentId}:${request.clientId}:${request.packet}`,
      group: "Client Forms",
      label: `${request.packet === "enrollment" ? "Enrollment" : "Graduation"} Forms — ${request.clientName}`,
      detail: time
    });
  });
  appointments.forEach((appointment) => {
    const appointmentId = String(appointment.id || appointment.source?.id || "");
    const clientNames = Array.isArray(appointment.clientNames) && appointment.clientNames.length
      ? appointment.clientNames.join(" & ")
      : appointment.title || appointment.source?.clientName || "Client";
    items.push({
      id: `note:${appointmentId}`,
      group: "Appointment Notes",
      label: `Appointment Note — ${clientNames}`,
      detail: appointment.time ? formatScheduleTime(scheduleTimeMinutes(appointment.time)) : ""
    });
  });
  return items;
}

function renderSchedulePrintSelectionList(module) {
  const items = schedulePrintSelectionItems(module);
  if (!items.length) return `<p class="schedule-print-empty">There is nothing to print for this date.</p>`;
  const groups = [...new Set(items.map((item) => item.group))];
  return groups.map((group) => `
    <fieldset class="panel schedule-print-group">
      <legend>${escapeHtml(group)}</legend>
      ${items.filter((item) => item.group === group).map((item) => `
        <label class="schedule-print-choice">
          <input type="checkbox" value="${escapeHtml(item.id)}" data-schedule-print-selection checked>
          <span><strong>${escapeHtml(item.label)}</strong>${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}</span>
        </label>
      `).join("")}
    </fieldset>
  `).join("");
}

function renderSchedulePrintCenter(module) {
  return `
    <section class="schedule-print-center" data-schedule-print-center hidden>
      <div class="schedule-print-date panel">
        <div>
          <span>Print Date</span>
          <strong data-print-center-date-label>${escapeHtml(formatScheduleDate(scheduleVisibleDate))}</strong>
        </div>
        <input data-print-center-date type="date" value="${escapeHtml(scheduleVisibleDate)}" aria-label="Choose print date">
      </div>
      <div class="schedule-print-selection-heading">
        <div><h2>Choose What to Print</h2><p>Each checked form stays separate. Blank pages are added only when needed for double-sided printing.</p></div>
        <div><button data-schedule-print-select-all type="button">Select All</button><button data-schedule-print-clear-all type="button">Clear All</button></div>
      </div>
      <div class="schedule-print-options" data-schedule-print-options>${renderSchedulePrintSelectionList(module)}</div>
      <div class="schedule-print-footer"><button data-schedule-print-selected type="button">Print Selected</button></div>
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
      <span class="appointment-meta-icon" data-appointment-third-icon>${icons.check}</span>
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

function crmCommunicationSenderName(activity = {}) {
  if (activity.createdByDisplayName) return activity.createdByDisplayName;
  const emailName = String(activity.createdBy || "").split("@")[0].replace(/[._-]+/g, " ").trim();
  if (emailName) return emailName.replace(/\b\w/g, (letter) => letter.toUpperCase());
  return activity.direction === "Inbound" ? "Family" : "SNACK staff";
}

function crmTextPermission(item) {
  const source = item?.source || {};
  if (!item || !item.phone || item.phone === "-") return { allowed: false, message: "Add a mobile number before sending a text." };
  if (source.textOptOut === true) return { allowed: false, message: "This family has opted out of text messages." };
  if (source.serviceTextConsent !== true) return { allowed: false, message: "Service-text permission is not recorded for this family." };
  return { allowed: true, message: "Service-text permission is recorded." };
}

function crmCommunicationsProviderReady() {
  return window.SNACK_CONFIG?.AZURE_COMMUNICATIONS_READY === true;
}

function renderCrmConversationHistory(item, mode = "text") {
  const type = mode === "call" ? "Call" : "Text";
  const history = [...(item?.activityLogs || [])]
    .filter((activity) => activity.type === type)
    .reverse();
  if (!history.length) {
    return `<p class="crm-communications-empty">No ${type.toLowerCase()} history has been recorded for this family.</p>`;
  }
  return history.map((activity) => {
    const inbound = activity.direction === "Inbound";
    const sender = inbound ? (item.caregiver === "-" ? "Family" : item.caregiver) : crmCommunicationSenderName(activity);
    const copy = activity.description || activity.result || activity.title || type;
    return `
      <article class="crm-communication-entry ${inbound ? "is-inbound" : "is-outbound"}">
        <div>${escapeHtml(copy)}</div>
        <small>${escapeHtml(inbound ? `Received from ${sender}` : `Sent by ${sender}`)} · ${escapeHtml(formatClientDate(activity.activityDate))}${activity.activityTime ? ` at ${escapeHtml(formatScheduleTime(scheduleTimeMinutes(activity.activityTime)))}` : ""}</small>
      </article>
    `;
  }).join("");
}

function renderCrmCommunicationsDrawer(item = crmSelectedItem()) {
  const mode = crmCommunicationsMode;
  const sender = staffAccountDisplayName(crmCurrentUser);
  const permission = crmTextPermission(item);
  const providerReady = crmCommunicationsProviderReady();
  const recipient = item?.caregiver && item.caregiver !== "-" ? item.caregiver : item?.title || "Selected family";
  const draft = crmCommunicationsDraft;
  const deliveryReady = permission.allowed && providerReady && Boolean(draft.trim());
  return `
    <header class="crm-communications-header">
      <div><span>Family Communications</span><h2>${escapeHtml(item?.title || "No family selected")}</h2></div>
      <button data-crm-communications-close type="button" aria-label="Close communications">×</button>
    </header>
    <div class="crm-communications-tabs" role="tablist" aria-label="Communication type">
      <button class="${mode === "text" ? "is-active" : ""}" data-crm-communications-mode="text" type="button" role="tab" aria-selected="${mode === "text"}">Text</button>
      <button class="${mode === "call" ? "is-active" : ""}" data-crm-communications-mode="call" type="button" role="tab" aria-selected="${mode === "call"}">Call</button>
    </div>
    <dl class="crm-communications-routing">
      <div><dt>To</dt><dd>${escapeHtml(recipient)}${item?.phone && item.phone !== "-" ? `<small>${escapeHtml(item.phone)}</small>` : ""}</dd></div>
      <div><dt>From</dt><dd>${escapeHtml(sender)}</dd></div>
    </dl>
    <section class="crm-communications-thread" aria-label="${escapeHtml(mode)} history">
      ${renderCrmConversationHistory(item, mode)}
    </section>
    ${mode === "text" ? `
      <section class="crm-communications-compose">
        ${crmCommunicationsReviewing ? `
          <span>Review message</span>
          <div class="crm-communications-review-copy">${escapeHtml(draft)}</div>
          <p class="crm-communications-consent" data-state="${permission.allowed ? "ready" : "blocked"}">${escapeHtml(permission.message)}</p>
          ${providerReady ? "" : `<p class="crm-communications-provider-note">Azure text delivery is not connected yet. Send will unlock only after the controlled delivery test passes.</p>`}
          <div class="crm-communications-actions">
            <button data-crm-communications-edit type="button">Edit Message</button>
            <button class="is-primary" data-crm-communications-send type="button" ${deliveryReady ? "" : "disabled"}>Send Text</button>
          </div>
        ` : `
          <label><span>Message</span><textarea data-crm-communications-message rows="5" maxlength="1600" placeholder="Write a service text to this family">${escapeHtml(draft)}</textarea></label>
          <div class="crm-communications-compose-meta"><span data-crm-communications-count>${draft.length}/1600</span><span>Sent by ${escapeHtml(sender)}</span></div>
          <p class="crm-communications-consent" data-state="${permission.allowed ? "ready" : "blocked"}">${escapeHtml(permission.message)}</p>
          <button class="is-primary" data-crm-communications-review type="button" ${draft.trim() ? "" : "disabled"}>Review Message</button>
        `}
      </section>
    ` : `
      <section class="crm-communications-compose crm-call-compose">
        <strong>Call as ${escapeHtml(sender)}</strong>
        <p>The call will open here and remain associated with this family record.</p>
        ${providerReady ? "" : `<p class="crm-communications-provider-note">Azure calling is not connected yet. Start Call will unlock only after the controlled call test passes.</p>`}
        <button class="is-primary" data-crm-communications-start-call type="button" ${providerReady && item?.phone && item.phone !== "-" ? "" : "disabled"}>Start Call</button>
      </section>
    `}
  `;
}

function refreshCrmCommunicationsDrawer() {
  const drawer = document.querySelector("[data-crm-communications-drawer]");
  const scrim = document.querySelector("[data-crm-communications-scrim]");
  if (!drawer || !scrim) return;
  drawer.hidden = !crmCommunicationsDrawerOpen;
  scrim.hidden = !crmCommunicationsDrawerOpen;
  drawer.setAttribute("aria-hidden", String(!crmCommunicationsDrawerOpen));
  if (crmCommunicationsDrawerOpen) drawer.innerHTML = renderCrmCommunicationsDrawer();
}

function openCrmCommunicationsDrawer(item, mode = "text") {
  if (!item) return;
  crmCommunicationsDrawerOpen = true;
  crmCommunicationsMode = mode === "call" ? "call" : "text";
  crmCommunicationsReviewing = false;
  crmCommunicationsDraft = "";
  refreshCrmCommunicationsDrawer();
  document.querySelector("[data-crm-communications-message], [data-crm-communications-close]")?.focus();
}

function closeCrmCommunicationsDrawer() {
  crmCommunicationsDrawerOpen = false;
  crmCommunicationsReviewing = false;
  crmCommunicationsDraft = "";
  refreshCrmCommunicationsDrawer();
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

function renderCrmAppointmentHeading() {
  return `
    <div class="card-heading">
      <h3>Appointments</h3>
      <button class="edit-button" data-crm-new-appointment type="button">New Appt</button>
    </div>
  `;
}

function renderCrmAppointmentsPanel(item) {
  if (!item?.appointments?.length) {
    return `
      <section class="detail-card">
        ${renderCrmAppointmentHeading()}
        <p class="crm-empty-copy">No appointments have been linked to this client.</p>
      </section>
    `;
  }

  return `
    <section class="detail-card">
      ${renderCrmAppointmentHeading()}
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
      ["HRSN Screener", "3. HRSN Screener.docx"]
    ],
    Spanish: [
      ["Program Enrollment", "1. SP Program Enrollment - Print.docx"],
      ["HRSN Screener", "3. HRSN Screener- Spanish.docx"]
    ]
  },
  graduation: {
    English: [
      ["Child Feedback", "4. Child Feedback Form - Print.docx"],
      ["Parent Feedback", "5. Parent Feedback Form - Print.docx"]
    ],
    Spanish: [
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

function crmKnowledgeInstrument() {
  return clinicKnowledgeInstrumentFor(crmEvaluationInstruments);
}

function crmKnowledgeQuestions(instrument = crmKnowledgeInstrument()) {
  return clinicKnowledgeQuestionsForInstrument(crmEvaluationQuestions, instrument?.id || "");
}

function crmHealthInstrument() {
  return clinicHealthInstrumentFor(crmEvaluationInstruments);
}

function crmFormTypeInstrument(formType) {
  return clinicInstrumentForFormType(crmEvaluationInstruments, formType);
}

function crmEvaluationResponse(item, administrationPoint, instrument) {
  return clinicEvaluationResponseForPoint(
    crmEvaluationResponses,
    item?.id || "",
    instrument?.id || "",
    administrationPoint
  );
}

function renderCrmAssessmentStatus(response, options = {}) {
  if (!response) return `<span class="status-pill" data-status-tone="navy">Not Started</span>`;
  const tone = response.status === "Complete" ? "green" : "blue";
  const result = options.questions?.length ? clinicKnowledgeResponseResult(response, options.questions) : null;
  const summary = options.knowledge && options.questions?.length
    ? clinicKnowledgeScoreSummary(response, options.questions)
    : null;
  const score = options.knowledge ? response.gain ?? result?.gain : null;
  const scoreSummary = summary?.beforeScore !== null && summary?.beforeScore !== undefined
    ? `
      <span class="crm-assessment-knowledge-score">
        <span>Before ${escapeHtml(summary.beforeScore)}% · Now ${escapeHtml(summary.nowScore)}%</span>
        <strong>${summary.gain > 0 ? "+" : ""}${escapeHtml(summary.gain)} points</strong>
      </span>
    `
    : score === null || score === undefined
      ? ""
      : `<strong>${score > 0 ? "+" : ""}${escapeHtml(score)} points</strong>`;
  return `
    <span class="status-pill" data-status-tone="${tone}">${escapeHtml(response.status)}</span>
    ${scoreSummary}
  `;
}

function renderCrmNativeFormRow(item, instrument, administrationPoint, options = {}) {
  const response = crmEvaluationResponse(item, administrationPoint, instrument);
  const actionLabels = clinicNativeFormActions(response);
  const formUrl = clinicFormUrl({
    clientId: item.id,
    instrumentId: instrument.id,
    administrationPoint,
    responseId: response?.id || ""
  });
  const printUrl = clinicFormUrl({
    clientId: item.id,
    instrumentId: instrument.id,
    administrationPoint,
    responseId: response?.id || "",
    mode: "print"
  });
  const staffUrl = clinicFormUrl({
    clientId: item.id,
    instrumentId: instrument.id,
    administrationPoint,
    responseId: response?.id || "",
    mode: "staff"
  });
  return `
    <div class="crm-assessment-summary-row">
      <div>
        <span class="crm-form-program-point">${escapeHtml(administrationPoint)}</span>
      </div>
      <div class="crm-assessment-summary-state">${renderCrmAssessmentStatus(response, options)}</div>
      <div class="crm-assessment-row-actions">
        <a href="${escapeHtml(printUrl)}" target="_blank">Print</a>
        <a href="${escapeHtml(formUrl)}">${escapeHtml(actionLabels.clientLabel)}</a>
        <a href="${escapeHtml(staffUrl)}" target="_blank" rel="noopener">${escapeHtml(actionLabels.staffLabel)}</a>
      </div>
    </div>
  `;
}

function renderCrmAssessmentSummary(item, instrument, options = {}) {
  const administrationPoints = options.administrationPoints || instrument.administrationPoints || [];
  const rows = administrationPoints.map((administrationPoint) => (
    renderCrmNativeFormRow(item, instrument, administrationPoint, options)
  )).join("");
  return `
    <section class="detail-card crm-assessment-card">
      <div class="card-heading">
        <div><h3>${escapeHtml(options.title || instrument.name)}</h3></div>
      </div>
      <div class="crm-assessment-summary">${rows}</div>
    </section>
  `;
}

function renderCrmLegacyAssessmentHistory(item, activeInstruments = []) {
  const activeIds = activeInstruments.map((instrument) => instrument?.id).filter(Boolean);
  const legacyResponses = clinicLegacyResponsesForClient(crmEvaluationResponses, item?.id || "", activeIds);
  if (!legacyResponses.length) return "";
  return `
    <details class="detail-card crm-assessment-history">
      <summary>Previous Form Versions <span>${escapeHtml(legacyResponses.length)}</span></summary>
      <p>These records keep their original questions, scoring rules, and version.</p>
      <div class="crm-assessment-history-list">
        ${legacyResponses.map((response) => {
          const reviewUrl = clinicFormUrl({
            clientId: item.id,
            instrumentId: response.instrumentId,
            administrationPoint: response.administrationPoint,
            responseId: response.id,
            mode: "review"
          });
          return `
            <a href="${escapeHtml(reviewUrl)}">
              <span><strong>${escapeHtml(response.instrumentName || "Previous Form")}</strong><small>${escapeHtml(response.administrationPoint || "")} · ${escapeHtml(response.instrumentVersion || "Original version")}</small></span>
              <span>${escapeHtml(formatClientDate(response.responseDate))}</span>
            </a>
          `;
        }).join("")}
      </div>
    </details>
  `;
}

function renderCrmFormsPanel(item) {
  const knowledgeInstrument = crmKnowledgeInstrument();
  const knowledgeQuestions = crmKnowledgeQuestions(knowledgeInstrument);
  const healthInstrument = crmHealthInstrument();
  const enrollmentInstrument = crmFormTypeInstrument("Enrollment");
  const hrsnInstrument = crmFormTypeInstrument("HRSN Screener");
  const childFeedbackInstrument = crmFormTypeInstrument("Child Feedback");
  const caregiverFeedbackInstrument = crmFormTypeInstrument("Caregiver Feedback");
  const activeInstruments = [
    enrollmentInstrument,
    hrsnInstrument,
    healthInstrument,
    knowledgeInstrument,
    childFeedbackInstrument,
    caregiverFeedbackInstrument
  ].filter(Boolean);

  return `
    ${enrollmentInstrument ? renderCrmAssessmentSummary(item, enrollmentInstrument, {
      title: "Program Enrollment",
      administrationPoints: ["Enrollment"]
    }) : ""}
    ${healthInstrument
      ? renderCrmAssessmentSummary(item, healthInstrument, {
        title: "Questionnaire",
        administrationPoints: ["Enrollment", "Graduation"]
      })
      : `
        <section class="detail-card crm-assessment-card">
          <div class="card-heading"><h3>Questionnaire</h3></div>
          <p class="crm-form-description">No active Questionnaire is available.</p>
        </section>
      `}
    ${hrsnInstrument ? renderCrmAssessmentSummary(item, hrsnInstrument, {
      title: "HRSN Screener",
      administrationPoints: ["Enrollment"]
    }) : ""}
    ${knowledgeInstrument && knowledgeQuestions.length
      ? renderCrmAssessmentSummary(item, knowledgeInstrument, {
        title: "Knowledge Assessment",
        administrationPoints: ["Graduation"],
        questions: knowledgeQuestions,
        knowledge: true
      })
      : `
        <section class="detail-card crm-assessment-card">
          <div class="card-heading"><h3>Knowledge Assessment</h3></div>
          <p class="crm-form-description">No active Knowledge Assessment is available.</p>
        </section>
      `}
    ${childFeedbackInstrument ? renderCrmAssessmentSummary(item, childFeedbackInstrument, {
      title: "Child Feedback",
      administrationPoints: ["Graduation"]
    }) : ""}
    ${caregiverFeedbackInstrument ? renderCrmAssessmentSummary(item, caregiverFeedbackInstrument, {
      title: "Caregiver Feedback",
      administrationPoints: ["Graduation"]
    }) : ""}
    ${renderCrmLegacyAssessmentHistory(item, activeInstruments)}
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

function renderCrmSiblingPicker(item, formId = "", kind = "client") {
  const selected = new Set(Array.isArray(item?.source?.siblingIds) ? item.source.siblingIds : []);
  const source = kind === "referral" ? crmRawReferrals : crmRawClients;
  const choices = source.filter((candidate) => candidate.id !== item?.id
    && (kind !== "referral" || !String(candidate.convertedClientId || "").trim()));
  const formAttribute = crmEditorFormAttribute(formId);
  const selectedRows = choices.filter((candidate) => selected.has(candidate.id));
  return `
    <div class="crm-sibling-picker" data-crm-sibling-picker="${escapeHtml(kind)}" data-current-id="${escapeHtml(item?.id || "")}" data-form-id="${escapeHtml(formId)}">
      <input data-crm-sibling-search type="search" autocomplete="off" placeholder="Search ${kind === "referral" ? "referrals" : "clients"}" aria-label="Search for a sibling">
      <div class="crm-sibling-selected" data-crm-sibling-selected>
        ${selectedRows.map((candidate) => `
          <span class="crm-sibling-chip">
            <input type="hidden" name="siblingIds" value="${escapeHtml(candidate.id)}"${formAttribute}>
            <span>${escapeHtml([candidate.firstName, candidate.lastName].filter(Boolean).join(" ") || "Unnamed record")}</span>
            <button data-crm-sibling-remove="${escapeHtml(candidate.id)}" type="button" aria-label="Remove sibling">&times;</button>
          </span>
        `).join("")}
      </div>
      <div class="crm-sibling-results" data-crm-sibling-results><p>Type at least two letters to search.</p></div>
    </div>
  `;
}

function renderCrmSiblingChoices(item, formId = "") {
  return renderCrmSiblingPicker(item, formId, "client");
}

function renderCrmReferralSiblingChoices(item, formId = "") {
  return renderCrmSiblingPicker(item, formId, "referral");
}

function refreshCrmSiblingPicker(picker) {
  if (!picker) return;
  const kind = picker.dataset.crmSiblingPicker;
  const source = kind === "referral" ? crmRawReferrals : crmRawClients;
  const query = picker.querySelector("[data-crm-sibling-search]")?.value.trim().toLowerCase() || "";
  const currentId = picker.dataset.currentId || "";
  const selected = new Set([...picker.querySelectorAll('input[name="siblingIds"]')].map((input) => input.value));
  const results = picker.querySelector("[data-crm-sibling-results]");
  if (!results) return;
  if (query.length < 2) {
    results.innerHTML = "<p>Type at least two letters to search.</p>";
    return;
  }
  const matches = source.filter((candidate) => {
    if (candidate.id === currentId || selected.has(candidate.id)) return false;
    if (kind === "referral" && String(candidate.convertedClientId || "").trim()) return false;
    return [candidate.firstName, candidate.lastName, candidate.parentName, candidate.phone, candidate.email]
      .filter(Boolean).join(" ").toLowerCase().includes(query);
  }).slice(0, 8);
  results.innerHTML = matches.length ? matches.map((candidate) => `
    <button data-crm-sibling-add="${escapeHtml(candidate.id)}" type="button">
      <strong>${escapeHtml([candidate.firstName, candidate.lastName].filter(Boolean).join(" ") || "Unnamed record")}</strong>
      <span>${escapeHtml(candidate.parentName || candidate.phone || candidate.email || "")}</span>
    </button>
  `).join("") : "<p>No matching records found.</p>";
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
          ${crmSelectOptions(crmStatusOptions(source.status).map((status) => [crmStatusLabel(status), status]), source.status || "Scheduled")}
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
          <label><span>YCCO Member ID</span><input name="yccoId" value="${escapeHtml(source.yccoId || "")}" autocomplete="off"></label>
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
          <label class="crm-profile-boolean-field">
            <span>Service Email Consent</span>
            <span class="crm-profile-boolean-control">
              <input name="serviceEmailConsent" type="checkbox" ${source.serviceEmailConsent === true ? "checked" : ""}>
              <strong>Approved</strong>
            </span>
          </label>
          <label class="crm-profile-boolean-field">
            <span>Service Text Consent</span>
            <span class="crm-profile-boolean-control">
              <input name="serviceTextConsent" type="checkbox" ${source.serviceTextConsent === true ? "checked" : ""}>
              <strong>Approved</strong>
            </span>
          </label>
          <label class="crm-profile-boolean-field">
            <span>Marketing Email Consent</span>
            <span class="crm-profile-boolean-control">
              <input name="marketingConsent" type="checkbox" ${source.marketingConsent === true ? "checked" : ""}>
              <strong>Approved</strong>
            </span>
          </label>
          <label><span>Consent Source</span><input name="consentSource" value="${escapeHtml(source.consentSource || "")}" placeholder="Public form, verbal, or written"></label>
          <label><span>Consent Date</span><input name="consentDate" type="date" value="${escapeHtml(source.consentDate || "")}"></label>
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
          <label><span>YCCO Member ID</span><input name="yccoId" value="${escapeHtml(source.yccoId || "")}" autocomplete="off"></label>
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
          <label class="crm-profile-boolean-field">
            <span>Service Email Consent</span>
            <span class="crm-profile-boolean-control">
              <input name="serviceEmailConsent" type="checkbox" ${source.serviceEmailConsent === true ? "checked" : ""}>
              <strong>Approved</strong>
            </span>
          </label>
          <label class="crm-profile-boolean-field">
            <span>Service Text Consent</span>
            <span class="crm-profile-boolean-control">
              <input name="serviceTextConsent" type="checkbox" ${source.serviceTextConsent === true ? "checked" : ""}>
              <strong>Approved</strong>
            </span>
          </label>
          <label class="crm-profile-boolean-field">
            <span>Marketing Email Consent</span>
            <span class="crm-profile-boolean-control">
              <input name="marketingConsent" type="checkbox" ${source.marketingConsent === true ? "checked" : ""}>
              <strong>Approved</strong>
            </span>
          </label>
          <label><span>Consent Source</span><input name="consentSource" value="${escapeHtml(source.consentSource || "")}" placeholder="Public form, verbal, or written"></label>
          <label><span>Consent Date</span><input name="consentDate" type="date" value="${escapeHtml(source.consentDate || "")}"></label>
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

function renderCrmNetworkEditorSide(item = null, sourceOverride = null) {
  const source = sourceOverride || item?.source || {};
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

function renderCrmNetworkEditorMain(item = null, sourceOverride = null) {
  const source = sourceOverride || item?.source || {};
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
    ? ["Sent", "Reply Received", "Scheduled", "Requested Call Back", "No Response to Text", "Not Interested"]
    : ["Scheduled", "Left Voicemail", "No Voicemail — Call Back", "Not Interested — Do Not Call Back", "Requested Call Back", "Invalid Number"];
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
        ${crmSubpage === "Referrals" ? `
          <label class="is-full-width crm-not-interested-confirm" data-crm-not-interested-confirm hidden>
            <input name="closeReferral" type="checkbox">
            <span>Close this referral as Not Interested and finish its open follow-up tasks.</span>
          </label>
        ` : ""}
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
  const signedInUser = crmCurrentUser || homeCurrentUser;
  if (!signedInUser) {
    throw new Error("Sign in before changing a client profile.");
  }

  const token = await signedInUser.getIdToken();
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

function renderCrmTaskRelatedOptions() {
  const clientItems = currentModuleId() === "home"
    ? homeClients.map((item) => ({ id: item.id, title: [item.firstName, item.lastName].filter(Boolean).join(" ") || "Unnamed Client" }))
    : crmClientItems;
  const referralItems = currentModuleId() === "home"
    ? homeReferrals.map((item) => ({ id: item.id, title: [item.firstName, item.lastName].filter(Boolean).join(" ") || "Unnamed Referral" }))
    : crmReferralItems;
  const clientOptions = clientItems.map((item) => `<option value="client:${escapeHtml(item.id)}">${escapeHtml(item.title)}</option>`).join("");
  const referralOptions = referralItems.map((item) => `<option value="referral:${escapeHtml(item.id)}">${escapeHtml(item.title)}</option>`).join("");
  return `
    <option value="">No linked profile</option>
    ${clientOptions ? `<optgroup label="Clients">${clientOptions}</optgroup>` : ""}
    ${referralOptions ? `<optgroup label="Referrals">${referralOptions}</optgroup>` : ""}
  `;
}

function renderCrmTaskDialog() {
  const assignees = homeStaffDirectory.length
    ? homeStaffDirectory
    : [{ displayName: crmCurrentUser?.displayName || staffAccessProfile?.displayName || "" }].filter((item) => item.displayName);
  return `
    <dialog class="schedule-dialog crm-task-dialog" data-crm-task-dialog>
      <form class="schedule-dialog-form" data-crm-task-form>
        <div class="schedule-dialog-heading">
          <div><span>CRM Dashboard</span><h2>New Task</h2></div>
          <button class="schedule-dialog-close" data-close-crm-task type="button" aria-label="Close">&times;</button>
        </div>
        <div class="schedule-dialog-fields">
          <label class="is-full-width"><span>Task</span><input name="title" maxlength="180" required></label>
          <label><span>Due Date</span><input name="dueDate" type="date"></label>
          <label><span>Due Time</span><input name="dueTime" type="time"></label>
          <label><span>Assigned To</span><input name="assignedTo" list="task-assignee-options" value="${escapeHtml((homeCurrentUser || crmCurrentUser)?.displayName || staffAccessProfile?.displayName || "")}"><datalist id="task-assignee-options">${assignees.map((user) => `<option value="${escapeHtml(user.displayName)}"></option>`).join("")}</datalist></label>
          <label><span>Priority</span><select name="priority"><option>Low</option><option selected>Normal</option><option>Urgent</option></select></label>
          <label><span>Type</span><select name="type"><option selected>Task</option><option>Call</option><option>Text</option><option>Form</option></select></label>
          <label><span>Related Profile</span><select name="relatedRecord">${renderCrmTaskRelatedOptions()}</select></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="3"></textarea></label>
        </div>
        <p class="schedule-dialog-status" data-crm-task-status role="status" aria-live="polite"></p>
        <div class="schedule-dialog-actions">
          <button data-close-crm-task type="button">Cancel</button>
          <button class="is-primary" type="submit">Create Task</button>
        </div>
      </form>
    </dialog>
  `;
}

function setCrmTaskDialogBusy(busy) {
  crmDashboardTaskDialogBusy = busy;
  const dialog = document.querySelector("[data-crm-task-dialog]");
  if (!dialog) return;
  dialog.setAttribute("aria-busy", String(busy));
  dialog.querySelectorAll("input, select, textarea, button").forEach((control) => {
    control.disabled = busy;
  });
}

function openCrmTaskDialog() {
  const dialog = document.querySelector("[data-crm-task-dialog]");
  const form = dialog?.querySelector("[data-crm-task-form]");
  if (!dialog || !form || crmDashboardTaskDialogBusy) return;
  const assigneeOptions = dialog.querySelector("#task-assignee-options");
  if (assigneeOptions) {
    const directory = homeStaffDirectory.length
      ? homeStaffDirectory
      : [{ displayName: (homeCurrentUser || crmCurrentUser)?.displayName || staffAccessProfile?.displayName || "" }];
    assigneeOptions.replaceChildren(...directory.filter((user) => user.displayName).map((user) => {
      const option = document.createElement("option");
      option.value = user.displayName;
      return option;
    }));
  }
  form.elements.relatedRecord.innerHTML = renderCrmTaskRelatedOptions();
  form.reset();
  form.elements.assignedTo.value = (homeCurrentUser || crmCurrentUser)?.displayName || staffAccessProfile?.displayName || "";
  dialog.querySelector("[data-crm-task-status]").textContent = "";
  dialog.showModal();
  form.elements.title.focus();
}

function closeCrmTaskDialog() {
  const dialog = document.querySelector("[data-crm-task-dialog]");
  if (dialog?.open && !crmDashboardTaskDialogBusy) dialog.close();
}

async function saveCrmDashboardTask(form) {
  if (crmDashboardTaskDialogBusy) return;
  const values = Object.fromEntries(new FormData(form).entries());
  const [relatedKind = "", relatedId = ""] = String(values.relatedRecord || "").split(":");
  const status = form.closest("dialog")?.querySelector("[data-crm-task-status]");
  const payload = {
    title: values.title,
    type: values.type,
    status: "Open",
    priority: values.priority,
    dueDate: values.dueDate,
    dueTime: values.dueTime,
    assignedTo: values.assignedTo,
    clientId: relatedKind === "client" ? relatedId : "",
    referralId: relatedKind === "referral" ? relatedId : "",
    source: "Manual",
    notes: values.notes
  };

  setCrmTaskDialogBusy(true);
  if (status) status.textContent = "Creating task...";
  try {
    await crmAuthedFetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    form.closest("dialog")?.close();
    crmDashboardActionMessage = "Task created.";
    crmDashboardTaskView = "open";
    if (currentModuleId() === "home") await loadHomeData(homeCurrentUser);
    else await loadCrmData(crmCurrentUser);
  } catch (error) {
    console.error(error);
    if (status) status.textContent = error.message || "The task could not be created.";
  } finally {
    setCrmTaskDialogBusy(false);
  }
}

async function updateCrmDashboardTaskStatus(taskId, nextStatus) {
  const task = crmRawTasks.find((candidate) => candidate.id === taskId);
  if (!task || crmDashboardTaskBusyId) return;

  crmDashboardTaskBusyId = taskId;
  crmDashboardActionMessage = "Saving task...";
  refreshStandardModuleData(modules.crm);
  try {
    await crmAuthedFetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
      method: "PATCH",
      body: JSON.stringify({ ...task, status: nextStatus })
    });
    crmDashboardActionMessage = nextStatus === "Done" ? "Task completed." : "Task restored.";
    await loadCrmData(crmCurrentUser);
  } catch (error) {
    console.error(error);
    crmDashboardActionMessage = error.message || "The task could not be updated.";
    refreshStandardModuleData(modules.crm);
  } finally {
    crmDashboardTaskBusyId = "";
    if (currentModuleId() === "crm" && crmSubpage === "Tasks") {
      refreshStandardModuleData(modules.crm);
    }
  }
}

function completeCrmDashboardTask(taskId) {
  return updateCrmDashboardTaskStatus(taskId, "Done");
}

function restoreCrmDashboardTask(taskId) {
  return updateCrmDashboardTaskStatus(taskId, "Open");
}

async function completeCrmPublicClientReview(item) {
  if (!item?.id || crmActionBusy) return;
  setCrmActionBusy(true);
  setCrmActionStatus("");
  try {
    await crmAuthedFetch(`/api/clients/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify({ publicReviewRequired: false })
    });
    await loadCrmData(crmCurrentUser, item.id);
    setCrmActionStatus("Public client review completed.");
  } catch (error) {
    console.error(error);
    setCrmActionStatus(error.message || "Could not complete the review.", "error");
  } finally {
    setCrmActionBusy(false);
  }
}

function openCrmReferralPartnerEditor(item) {
  if (!item?.id || crmActionBusy) return;
  const source = item.source || {};
  const type = source.referralType === "External Clinic Referral"
    ? "Clinic"
    : source.referralType === "Community Org Referral"
      ? "Community Organization"
      : "Other";
  const providerNotes = source.referrerPhone ? `Phone: ${source.referrerPhone}` : "";
  const prefill = {
    name: source.referralOrganization || source.referralSource || "",
    type,
    contactName: source.referrerName || "",
    phone: source.referrerPhone || "",
    email: source.referrerEmail || "",
    notes: `Created from public referral for ${item.title}. Please confirm these details before saving.`,
    providers: [{
      id: "",
      name: source.referrerName || "",
      email: source.referrerEmail || "",
      notes: providerNotes
    }]
  };
  const referralId = item.id;
  setCrmSubpage("Referral Network");
  openCrmNetworkEditor(null, { source: prefill, sourceReferralId: referralId });
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

  const overview = document.querySelector('[data-crm-detail-panel="overview"]');
  overview?.querySelector("[data-crm-record-review-alert]")?.remove();
  if (overview && item?.source?.publicReviewRequired) {
    const matches = Array.isArray(item.possibleMatchProfiles) ? item.possibleMatchProfiles : [];
    overview.insertAdjacentHTML("afterbegin", `
      <section class="crm-record-review-alert" data-crm-record-review-alert>
        <div>
          <strong>${matches.length ? "Possible duplicate client" : "Review this new public client record"}</strong>
          <p>${escapeHtml(item.source.publicReviewReason || "This record was created from public booking and needs staff review.")}</p>
          ${matches.length ? `<div class="crm-record-review-links">${matches.map((match) => `
            <button class="crm-profile-link" data-crm-related-id="${escapeHtml(match.id)}" data-crm-related-section="Clients" type="button">
              ${escapeHtml(match.name)}${match.detail ? ` — ${escapeHtml(match.detail)}` : ""}
            </button>
          `).join("")}</div>` : ""}
        </div>
        <button class="is-primary" data-crm-complete-public-review type="button">Mark Reviewed</button>
      </section>
    `);
  }
  if (overview && item?.source?.providerReviewRequired) {
    overview.insertAdjacentHTML("afterbegin", `
      <section class="crm-record-review-alert" data-crm-record-review-alert>
        <div>
          <strong>Referral partner needs review</strong>
          <p>${escapeHtml(item.source.providerReviewReason || "The submitted organization did not match one saved referral partner.")}</p>
          <p>${escapeHtml([item.source.referrerName, item.source.referralOrganization].filter(Boolean).join(" at "))}</p>
        </div>
        <button class="is-primary" data-crm-add-referral-partner type="button">Add to Referral Network</button>
      </section>
    `);
  }
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
  if (crmPanelMode === "editor" && ["client", "referral", "network"].includes(crmEditorKind)) {
    setCrmPanelMode("editor");
  }
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
  const editingOverview = editingProfile && crmDetailTab === "overview";

  if (tabs) {
    tabs.hidden = editing && !editingProfile;
    tabs.querySelectorAll("button").forEach((button) => {
      button.disabled = editing && !editingProfile;
    });
  }
  if (content) content.hidden = editing && (!editingProfile || editingOverview);
  if (editor) editor.hidden = !editing || (editingProfile && !editingOverview);
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
  if (!options.notesOnly) renderCrmDetailContent(item);
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
  renderCrmDetailContent(item);
  setCrmDetailTab("overview");
  setCrmActionStatus("");
  setCrmPanelMode("editor");
  sideEditor.querySelector("input, textarea, select")?.focus();
}

function openCrmNetworkEditor(item = null, options = {}) {
  if (crmActionBusy) return;
  const editor = document.querySelector("[data-crm-editor]");
  const sideEditor = document.querySelector("[data-crm-side-editor]");
  if (!editor || !sideEditor) return;

  crmEditingNetworkId = item?.id || "";
  crmNetworkSourceReferralId = options.sourceReferralId || "";
  crmDeletePendingId = "";
  crmEditorKind = "network";
  editor.classList.add("is-profile-editor");
  editor.innerHTML = renderCrmNetworkEditorMain(item, options.source || null);
  sideEditor.innerHTML = renderCrmNetworkEditorSide(item, options.source || null);
  renderCrmDetailContent(item);
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
  crmNetworkSourceReferralId = "";
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
        textOptOut: form.elements.textOptOut?.checked ?? false,
        serviceEmailConsent: form.elements.serviceEmailConsent?.checked ?? false,
        serviceTextConsent: form.elements.serviceTextConsent?.checked ?? false,
        marketingConsent: form.elements.marketingConsent?.checked ?? false
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
    serviceEmailConsent: form.elements.serviceEmailConsent?.checked ?? false,
    serviceTextConsent: form.elements.serviceTextConsent?.checked ?? false,
    marketingConsent: form.elements.marketingConsent?.checked ?? false,
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
    const sourceReferralId = crmNetworkSourceReferralId;
    const savedEntry = result.entry || item?.source || null;
    if (sourceReferralId && savedEntry?.id && savedEntry.providers?.[0]?.id) {
      await crmAuthedFetch(`/api/referrals/${encodeURIComponent(sourceReferralId)}`, {
        method: "PATCH",
        body: JSON.stringify({
          providerLinks: [{
            networkId: savedEntry.id,
            providerId: savedEntry.providers[0].id,
            organizationName: savedEntry.name,
            providerName: savedEntry.providers[0].name
          }]
        })
      });
    }
    selectedItemId = savedEntry?.id || item?.id || selectedItemId;
    crmEditingNetworkId = "";
    crmNetworkSourceReferralId = "";
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
  const notInterested = crmSubpage === "Referrals" && String(values.result || "").toLowerCase().includes("not interested");
  if (notInterested && !form.elements.closeReferral?.checked) {
    setCrmActionStatus("Confirm that this referral should be closed before saving the Not Interested result.", "error");
    return;
  }
  if (crmSubpage === "Referrals") payload.closeReferral = notInterested;

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
              ${scheduleServices.filter((service) => service.active !== false).map((service) => `
                <option value="${escapeHtml(service.id)}">${escapeHtml(service.label)}</option>
              `).join("")}
            </select>
          </label>
          <label>
            <span>Duration (minutes)</span>
            <input name="durationMinutes" data-new-appointment-duration type="number" min="15" step="15" value="30" required>
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

function refreshNewAppointmentServiceOptions() {
  const select = document.querySelector("[data-new-appointment-service]");
  if (!select) return;
  const previousValue = select.value;
  const activeServices = scheduleServices.filter((service) => service.active !== false);
  select.replaceChildren(...activeServices.map((service) => new Option(service.label, service.id)));
  select.value = activeServices.some((service) => service.id === previousValue)
    ? previousValue
    : activeServices[0]?.id || "";
}

function syncNewAppointmentServiceFields() {
  const serviceSelect = document.querySelector("[data-new-appointment-service]");
  const lessonField = document.querySelector("[data-new-appointment-lesson-field]");
  const goalField = document.querySelector("[data-new-appointment-goal-field]");
  const lesson = document.querySelector("[data-new-appointment-lesson]");
  const goal = document.querySelector("[data-new-appointment-goal]");
  const service = newAppointmentService(serviceSelect?.value, scheduleServices);
  const duration = document.querySelector("[data-new-appointment-duration]");
  const showLessonFields = service.appointmentType === "Nutrition Education";

  if (lessonField) lessonField.hidden = !showLessonFields;
  if (goalField) goalField.hidden = !showLessonFields;
  if (lesson) lesson.disabled = !showLessonFields;
  if (goal) goal.disabled = !showLessonFields;
  if (!showLessonFields) {
    if (lesson) lesson.value = "";
    if (goal) goal.value = "";
  }
  if (duration) duration.value = String(service.durationMinutes || 30);
  syncNewAppointmentSummary();
}

function syncNewAppointmentSummary() {
  const date = document.querySelector("[data-new-appointment-date]")?.value || scheduleVisibleDate;
  const time = document.querySelector("[data-new-appointment-time]")?.value || "";
  const status = document.querySelector("[data-new-appointment-status-select]")?.value || "Scheduled";
  const service = newAppointmentService(document.querySelector("[data-new-appointment-service]")?.value, scheduleServices);
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

  const service = newAppointmentService(serviceSelect?.value, scheduleServices);
  const requestedDuration = Number(document.querySelector("[data-new-appointment-duration]")?.value);
  const times = scheduleTimeOptions(scheduleSettings, requestedDuration > 0 ? requestedDuration : service.durationMinutes);
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

async function openNewAppointmentPanel(preselectedClientIds = [], selectedTime = "") {
  const form = document.querySelector("[data-new-appointment-form]");
  if (!form || scheduleActionBusy) {
    return;
  }

  if (!scheduleCurrentUser) {
    setScheduleActionStatus("Sign in before creating an appointment.", "error");
    return;
  }

  if (scheduleDataState === "error") {
    setScheduleActionStatus("Reloading appointments...", "");
    await loadScheduleData(scheduleCurrentUser);
  }

  if (scheduleDataState !== "ready") {
    setScheduleActionStatus(
      scheduleDataState === "loading"
        ? "Appointments are still loading. Please try again in a moment."
        : "Appointments could not be loaded. Click New Appointment to try again.",
      "error"
    );
    return;
  }

  form.reset();
  newAppointmentClientIds.clear();
  preselectedClientIds
    .filter((clientId) => scheduleClientsById.has(clientId))
    .forEach((clientId) => newAppointmentClientIds.add(clientId));
  form.querySelector("[data-new-appointment-date]").value = scheduleVisibleDate;
  form.querySelector("[data-new-appointment-service]").value = scheduleServices.find((service) => service.active !== false)?.id || "";
  form.querySelector("[data-new-appointment-status-select]").value = "Scheduled";
  form.querySelector("[data-new-appointment-staff]").value = "Cynthia Esparza";
  setNewAppointmentStatus("");
  renderNewAppointmentSelectedClients();
  renderNewAppointmentClientOptions("");
  syncNewAppointmentServiceFields();
  renderNewAppointmentTimeOptions(selectedTime);
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

  const payload = newAppointmentPayload(values, selectedClients, scheduleServices);
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
  form.querySelector("[data-appointment-edit-duration]").value = String(item.duration || item.source?.durationMinutes || 30);
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
          <label>
            <span>Duration (minutes)</span>
            <input name="durationMinutes" data-appointment-edit-duration type="number" min="15" step="15" required>
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

function scheduleWrapUpParticipants(item) {
  const clientIds = Array.isArray(item.clientIds) ? item.clientIds : [];
  const clientNames = Array.isArray(item.clientNames) ? item.clientNames : [];
  const count = Math.max(clientIds.length, clientNames.length, 1);
  const storedGoals = Array.isArray(item.source?.participantGoals) ? item.source.participantGoals : [];

  return Array.from({ length: count }, (_value, index) => {
    const clientId = clientIds[index] || "";
    const clientName = clientNames[index] || item.source?.clientName || `Child ${index + 1}`;
    const storedGoal = storedGoals.find((entry) => (
      clientId
        ? entry.clientId === clientId
        : String(entry.clientName || "").toLowerCase() === String(clientName).toLowerCase()
    ));
    return {
      clientId,
      clientName,
      goal: storedGoal?.goal || item.source?.goal || "",
      goalResult: storedGoal?.goalResult || (count === 1 ? item.source?.goalResult : "") || ""
    };
  });
}

function renderScheduleParticipantGoals(item, prefix, { includeResult = false, blankGoals = false } = {}) {
  return `
    <div class="schedule-participant-goals">
      ${scheduleWrapUpParticipants(item).map((participant) => `
        <div class="schedule-participant-goal-row">
          <strong>${escapeHtml(participant.clientName)}</strong>
          <input type="hidden" name="${prefix}ClientId" value="${escapeHtml(participant.clientId)}">
          <input type="hidden" name="${prefix}ClientName" value="${escapeHtml(participant.clientName)}">
          <label class="${includeResult ? "" : "is-full-width"}">
            <span>Goal</span>
            <input type="text" name="${prefix}Goal" value="${blankGoals ? "" : escapeHtml(participant.goal)}">
          </label>
          ${includeResult ? `
            <label>
              <span>Goal Result</span>
              <select name="${prefix}GoalResult" required>
                <option value="">Choose</option>
                ${appointmentWrapUpOptions.goalResult.map((option) => `<option value="${escapeHtml(option)}" ${option === participant.goalResult ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
              </select>
            </label>
          ` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function scheduleParticipantGoalsFromForm(formData, prefix) {
  const clientIds = formData.getAll(`${prefix}ClientId`);
  const clientNames = formData.getAll(`${prefix}ClientName`);
  const goals = formData.getAll(`${prefix}Goal`);
  const goalResults = formData.getAll(`${prefix}GoalResult`);
  const count = Math.max(clientIds.length, clientNames.length, goals.length, goalResults.length);
  return Array.from({ length: count }, (_value, index) => ({
    clientId: clientIds[index] || "",
    clientName: clientNames[index] || "",
    goal: goals[index] || "",
    goalResult: goalResults[index] || ""
  }));
}

function renderScheduleWrapUp(item) {
  const nextLesson = nextAppointmentLessonNumber(item);
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
          <p class="schedule-wrap-up-next-choice">Choose the lesson for the next appointment. If lessons were combined, select the lesson that should come next.</p>
          <div class="appointment-edit-fields" data-wrap-up-next-fields>
            <label>
              <span>Lesson</span>
              <select name="nextAppointmentLesson" required>
                ${Object.entries(appointmentLessonTitles).map(([lessonNumber, lessonTitle]) => `
                  <option value="${escapeHtml(lessonNumber)}" ${Number(lessonNumber) === nextLesson ? "selected" : ""}>Lesson ${escapeHtml(lessonNumber)}: ${escapeHtml(lessonTitle)}</option>
                `).join("")}
              </select>
            </label>
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
            ${renderScheduleParticipantGoals(item, "nextParticipant", { blankGoals: true })}
            <label class="is-full-width">
              <span>Notes</span>
              <textarea name="nextAppointmentNotes" rows="2"></textarea>
            </label>
          </div>
        ` : `<p class="schedule-wrap-up-finished">Program complete</p>`}
      </section>

      <p class="schedule-action-status" data-schedule-wrap-up-status role="status" aria-live="polite"></p>
      <div class="schedule-wrap-up-actions">
        <button type="submit" data-schedule-wrap-up-submit ${nextLesson ? "" : "disabled"}>${nextLesson ? "Schedule Next Appt" : "Program Complete"}</button>
        <button type="button" data-schedule-wrap-up-next>Next: Appt Note</button>
      </div>
    </form>
  `;
}

function renderScheduleAppointmentNote(item) {
  const isCompleted = item.status === "Completed";
  return `
    <form class="schedule-appointment-note-form" data-schedule-appointment-note-form>
      <section class="detail-card schedule-appointment-note-card">
        <div class="card-heading">
          <h3>Appointment Note</h3>
        </div>
        <label class="schedule-appointment-note-field">
          <textarea name="appointmentNote" rows="8" placeholder="Add the appointment note here." required>${escapeHtml(item.appointmentNote || "")}</textarea>
        </label>
      </section>
      <section class="detail-card schedule-wrap-up-card">
        <div class="card-heading">
          <h3>Engagement</h3>
        </div>
        <div class="appointment-edit-fields">
          ${renderScheduleParticipantGoals(item, "participant", { includeResult: true })}
          ${renderWrapUpSelect("interpreterUse", "Interpreter Used", appointmentWrapUpOptions.interpreterUse, item.source?.interpreterUse || "Not needed")}
          ${renderWrapUpSelect("caregiverMood", "Caregiver Mood", appointmentWrapUpOptions.caregiverMood, item.source?.caregiverMood || appointmentWrapUpDefaults.caregiverMood)}
          ${renderWrapUpSelect("confidence", "Confidence", appointmentWrapUpOptions.confidence, item.source?.confidence || appointmentWrapUpDefaults.confidence)}
          ${renderWrapUpSelect("participation", "Participation", appointmentWrapUpOptions.participation, item.source?.participation || appointmentWrapUpDefaults.participation)}
          ${renderWrapUpSelect("barriers", "Barriers", appointmentWrapUpOptions.barriers, item.source?.barriers || appointmentWrapUpDefaults.barriers)}
        </div>
      </section>
      <p class="schedule-action-status" data-schedule-appointment-note-status role="status" aria-live="polite"></p>
      <div class="schedule-appointment-note-actions">
        <button type="submit" data-schedule-appointment-note-submit>${isCompleted ? "Save Changes" : "Complete Appt"}</button>
      </div>
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

  const isEnrollment = item.type === "Enrollment";
  const isGraduation = /healthy habits|lesson\s*7/i.test(`${item.lesson || ""} ${item.type || ""}`);
  const healthInstrument = clinicHealthInstrumentFor(scheduleEvaluationInstruments);
  const definitions = isEnrollment
    ? [
        ["Program Enrollment", clinicInstrumentForFormType(scheduleEvaluationInstruments, "Enrollment"), "Enrollment"],
        ["Questionnaire", healthInstrument, "Enrollment"],
        ["HRSN Screener", clinicInstrumentForFormType(scheduleEvaluationInstruments, "HRSN Screener"), "Enrollment"]
      ]
    : isGraduation
      ? [
          ["Questionnaire", healthInstrument, "Graduation"],
          ["Knowledge Assessment", clinicKnowledgeInstrumentFor(scheduleEvaluationInstruments), "Graduation"],
          ["Child Feedback", clinicInstrumentForFormType(scheduleEvaluationInstruments, "Child Feedback"), "Graduation"],
          ["Caregiver Feedback", clinicInstrumentForFormType(scheduleEvaluationInstruments, "Caregiver Feedback"), "Graduation"]
        ]
      : [];
  const formDefinitions = definitions.filter(([, instrument]) => Boolean(instrument));
  const clientSections = (item.clientIds || []).map((clientId, index) => {
    const client = scheduleClientsById.get(clientId);
    const clientName = client ? clientFullName(client) : item.clientNames?.[index] || "Child";
    return `
      <section class="schedule-appointment-form-client">
        <h4>${escapeHtml(clientName)}</h4>
        <div class="schedule-appointment-form-list">
          ${formDefinitions.map(([label, instrument, administrationPoint]) => {
            const savedResponse = clinicEvaluationResponseForPoint(
              scheduleEvaluationResponses,
              clientId,
              instrument.id,
              administrationPoint
            );
            const actions = clinicNativeFormActions(savedResponse);
            const urlOptions = {
              clientId,
              instrumentId: instrument.id,
              administrationPoint,
              responseId: savedResponse?.id || "",
              appointmentId: item.id
            };
            const status = savedResponse?.status || "Not Started";
            const tone = status === "Complete" ? "green" : status === "Draft" ? "blue" : "navy";
            return `
              <div class="schedule-appointment-form-row">
                <span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(administrationPoint)}</small></span>
                <span class="status-pill" data-status-tone="${tone}">${escapeHtml(status)}</span>
                <span class="schedule-appointment-form-actions">
                  <a href="${escapeHtml(clinicFormUrl({ ...urlOptions, mode: "print" }))}" target="_blank" rel="noopener">Print</a>
                  <a href="${escapeHtml(clinicFormUrl(urlOptions))}" target="_blank" rel="noopener">${escapeHtml(actions.clientLabel)}</a>
                  <a href="${escapeHtml(clinicFormUrl({ ...urlOptions, mode: "staff" }))}" target="_blank" rel="noopener">${escapeHtml(actions.staffLabel)}</a>
                </span>
              </div>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("");
  const appointmentFormCopy = isEnrollment
    ? "Forms for this Enrollment appointment."
    : isGraduation
      ? "Forms for this final Healthy Habits appointment."
      : "This appointment does not require a native Enrollment or Graduation form.";

  return `
    <article class="detail-card schedule-appointment-forms-card">
      <div>
        <h3>Appointment Forms</h3>
        <p>${escapeHtml(appointmentFormCopy)}</p>
      </div>
      <div class="schedule-appointment-form-clients">
        ${clientSections || `<p class="schedule-print-status">No linked child was found for this appointment.</p>`}
      </div>
    </article>
    <article class="detail-card schedule-forms-card">
      <div>
        <h3>Appointment Printouts</h3>
        <p>Print the preparation list or appointment note for ${escapeHtml(item.title)}.</p>
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

function openAuthenticatedPrintWindow(html, onBlocked) {
  const printWindow = window.open("./print-shell.html", "_blank");
  if (!printWindow) {
    onBlocked?.();
    return null;
  }
  printWindow.addEventListener("load", () => {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }, { once: true });
  return printWindow;
}

function openSchedulePrint(module, action) {
  if (action === "packet") {
    const notePages = dailyAppointmentNotePages(module.items, scheduleVisibleDate, scheduleClientsById);
    if (!notePages.length) {
      setSchedulePrintStatus("There are no Clinic appointments to print for this date.", "error");
      return;
    }

    const packetRequests = dailyFormPacketRequests(module.items, scheduleVisibleDate, scheduleClientsById);
    const title = `Daily Forms - ${formatScheduleDate(scheduleVisibleDate)}`;
    const baseHref = new URL("./", location.href).href;
    const printWindow = openAuthenticatedPrintWindow(
      dailyFormsPrintDocumentHtml({ title, packetRequests, notePages, baseHref }),
      () => setSchedulePrintStatus("The print window was blocked. Allow pop-ups for SNACK Program Hub and try again.", "error")
    );
    if (!printWindow) return;
    setSchedulePrintStatus("Current forms and appointment notes opened in one print window.", "success");
    return;
  }

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

function scheduleSelectedPrintEntries(module, selectionIds) {
  const selected = new Set(selectionIds);
  const entries = [];
  if (selected.has("daily-schedule")) {
    const pages = dailySchedulePages(module.items, scheduleVisibleDate, scheduleClientsById);
    if (pages.length) entries.push({ kind: "static", label: "Daily Schedule", pageCount: pages.length, pages });
  }
  if (selected.has("daily-prep")) {
    const pages = dailyPrepPages(module.items, scheduleVisibleDate, scheduleClientsById);
    if (pages.length) entries.push({ kind: "static", label: "Daily Prep List", pageCount: pages.length, pages });
  }

  const packetRequests = dailyFormPacketRequests(module.items, scheduleVisibleDate, scheduleClientsById);
  packetRequests.forEach((request) => {
    const id = `packet:${request.appointmentId}:${request.clientId}:${request.packet}`;
    if (!selected.has(id)) return;
    entries.push({
      kind: "packet",
      label: `${request.packet === "enrollment" ? "Enrollment" : "Graduation"} Forms for ${request.clientName}`,
      request
    });
  });

  printableScheduleItems(module.items, scheduleVisibleDate)
    .filter((item) => item.status !== "Blocked")
    .forEach((item) => {
      const appointmentId = String(item.id || item.source?.id || "");
      if (!selected.has(`note:${appointmentId}`)) return;
      const clientNames = Array.isArray(item.clientNames) && item.clientNames.length
        ? item.clientNames.join(" & ")
        : item.title || item.source?.clientName || "Client";
      entries.push({
        kind: "static",
        label: `Appointment Note for ${clientNames}`,
        pageCount: 1,
        pages: [appointmentNotePage(item, scheduleClientsById, module.items)]
      });
    });
  return entries;
}

function openSelectedSchedulePrint(module) {
  const selections = [...document.querySelectorAll("[data-schedule-print-selection]:checked")].map((input) => input.value);
  if (!selections.length) {
    setSchedulePrintStatus("Choose at least one item to print.", "error");
    return;
  }
  const entries = scheduleSelectedPrintEntries(module, selections);
  if (!entries.length) {
    setSchedulePrintStatus("There is nothing to print for this selection.", "error");
    return;
  }
  const title = `Selected Forms - ${formatScheduleDate(scheduleVisibleDate)}`;
  const baseHref = new URL("./", location.href).href;
  const printWindow = openAuthenticatedPrintWindow(
    selectedPrintDocumentHtml({ title, selections: entries, baseHref }),
    () => setSchedulePrintStatus("The print window was blocked. Allow pop-ups for SNACK Program Hub and try again.", "error")
  );
  if (!printWindow) return;
  setSchedulePrintStatus(`${entries.length} selected ${entries.length === 1 ? "document" : "documents"} opened in a new tab.`, "success");
}

function updateSchedulePrintCenter(module) {
  const center = document.querySelector("[data-schedule-print-center]");
  if (!center) return;
  const dateInput = center.querySelector("[data-print-center-date]");
  const dateLabel = center.querySelector("[data-print-center-date-label]");
  const options = center.querySelector("[data-schedule-print-options]");
  if (dateInput) dateInput.value = scheduleVisibleDate;
  if (dateLabel) dateLabel.textContent = formatScheduleDate(scheduleVisibleDate);
  if (options) options.innerHTML = renderSchedulePrintSelectionList(module);
}

function activeProgramName() {
  return ["Kitchen", "School"].includes(scheduleSubpage) ? scheduleSubpage : "";
}

function selectedProgramSession() {
  return programScheduleItems.find((item) => item.id === programSelectedSessionId) || null;
}

function selectedProgramRegistration() {
  const session = selectedProgramSession();
  return session?.registrations.find((registration) => registration.id === programEditingRegistrationId) || null;
}

function programSessionLabel(program = activeProgramName()) {
  return ["Kitchen", "School"].includes(program) ? "Class" : "Session";
}

function programListEmptyMessage(program = activeProgramName()) {
  if (programScheduleDataState === "loading") return "Loading program classes...";
  if (programScheduleDataState === "error") return programScheduleMessage;
  return program === "Kitchen" ? "No cooking classes scheduled." : "No school classes scheduled.";
}

function programStatusOptions(selectedValue = "Scheduled") {
  return ["Scheduled", "Completed", "Canceled"].map((status) => `
    <option value="${status}" ${status === selectedValue ? "selected" : ""}>${status}</option>
  `).join("");
}

function registrationStatusOptions(selectedValue = "") {
  return [
    ["", "Choose automatically"],
    ["Registered", "Registered"],
    ["Waitlisted", "Waitlisted"],
    ["Attended", "Attended"],
    ["Absent", "Absent"],
    ["Canceled", "Canceled"]
  ].map(([value, label]) => `
    <option value="${value}" ${value === selectedValue ? "selected" : ""}>${label}</option>
  `).join("");
}

function renderProgramSessionRows() {
  if (!programScheduleItems.length) {
    return `<p class="list-empty" role="status">${escapeHtml(programListEmptyMessage())}</p>`;
  }

  return programScheduleItems.map((session) => `
    <button
      class="list-row ${session.id === programSelectedSessionId ? "is-selected" : ""}"
      data-program-session-id="${escapeHtml(session.id)}"
      data-tone="module"
      type="button"
    >
      <strong>${escapeHtml(session.title)}</strong>
      <span class="status-pill">${escapeHtml(session.status)}</span>
      <span>${escapeHtml(`${session.dateLabel} | ${session.timeLabel}`)}</span>
    </button>
  `).join("");
}

function renderProgramDetailSide(session, program) {
  if (!session) {
    return `
      <div class="status-line is-module-status" hidden><span class="status-dot"></span></div>
      <h2>No ${programSessionLabel(program).toLowerCase()} selected</h2>
      <div class="meta-list">
        <div class="meta-row"><span>Date</span><strong>-</strong></div>
        <div class="meta-row"><span>Time</span><strong>-</strong></div>
        <div class="meta-row"><span>Location</span><strong>-</strong></div>
      </div>
    `;
  }

  return `
    <div class="status-line is-module-status"><span class="status-dot"></span><span>${escapeHtml(session.status)}</span></div>
    <h2>${escapeHtml(session.title)}</h2>
    <div class="meta-list appointment-meta">
      <div class="meta-row"><span>Date</span><strong>${escapeHtml(session.dateLabel)}</strong></div>
      <div class="meta-row"><span>Time</span><strong>${escapeHtml(`${session.timeLabel} - ${session.durationMinutes} min`)}</strong></div>
      <div class="meta-row"><span>Location</span><strong>${escapeHtml(session.location || session.schoolName || "-")}</strong></div>
    </div>
    <section class="side-section">
      <h3><span class="section-icon">${program === "Kitchen" ? icons.crm : icons.building}</span>${program === "Kitchen" ? "Registration" : "School"}</h3>
      ${program === "Kitchen" ? `
        <div class="meta-row"><span>Registered Children</span><strong>${session.registeredChildren} / ${session.capacity || "-"}</strong></div>
        <div class="meta-row"><span>Waitlisted Families</span><strong>${session.waitlistedFamilies}</strong></div>
      ` : `
        <div class="meta-row"><span>School / Site</span><strong>${escapeHtml(session.schoolName || "-")}</strong></div>
        <div class="meta-row"><span>Grade / Group</span><strong>${escapeHtml(session.gradeGroup || "-")}</strong></div>
        <div class="meta-row"><span>Participants</span><strong>${session.participantCount || 0}</strong></div>
      `}
    </section>
  `;
}

function renderProgramDetailTabs(program) {
  const tabs = program === "Kitchen"
    ? [["details", "Details", "calendar"], ["roster", "Roster", "crm"]]
    : [["details", "Details", "calendar"], ["attendance", "Attendance", "crm"]];
  const validTabs = new Set(tabs.map(([key]) => key));
  if (!validTabs.has(programScheduleDetailTab)) programScheduleDetailTab = "details";

  return `
    <div class="tabs has-icons program-tabs" style="--detail-tab-count: ${tabs.length};" role="tablist" aria-label="${program} schedule detail tabs">
      ${tabs.map(([key, label, iconName]) => `
        <button class="${key === programScheduleDetailTab ? "is-active" : ""}" data-program-detail-tab="${key}" type="button">
          <span class="detail-tab-icon">${icons[iconName]}</span><span>${label}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderProgramDetails(session, program) {
  if (!session) {
    return `
      <section class="detail-card program-empty-card">
        <div class="card-heading"><h3>${program} Schedule</h3></div>
        <p>Create the first ${programSessionLabel(program).toLowerCase()} to begin using this schedule.</p>
      </section>
    `;
  }

  const fields = program === "Kitchen"
    ? [
        ["Class Type", session.classTypeLabel || session.title],
        ["Capacity", session.capacity || "-"],
        ["Staff", session.staffMember || "-"],
        ["Calendar", session.googleEventId ? "Connected" : "Not connected"]
      ]
    : [
        ["School / Site", session.schoolName || "-"],
        ["Grade / Group", session.gradeGroup || "-"],
        ["Staff", session.staffMember || "-"],
        ["Participants", session.participantCount || 0]
      ];

  return `
    <section class="detail-card">
      <div class="card-heading"><h3>${programSessionLabel(program)} Details</h3></div>
      <div class="field-grid">
        ${fields.map(([label, value]) => `<div class="field"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
      </div>
    </section>
    <section class="detail-card">
      <div class="card-heading"><h3>Notes</h3></div>
      <p class="program-notes">${escapeHtml(session.notes || "-")}</p>
    </section>
  `;
}

function renderProgramRoster(session) {
  if (!session) return `<section class="detail-card"><p>Select a class to view its roster.</p></section>`;
  return `
    <section class="detail-card program-roster-card">
      <div class="card-heading"><h3>Family Registrations</h3></div>
      ${session.registrations.length ? `
        <div class="program-roster-list">
          ${session.registrations.map((registration) => `
            <article class="program-roster-row">
              <button data-program-edit-registration="${escapeHtml(registration.id)}" type="button">
                <strong>${escapeHtml(registration.clientNames.join(", ") || `${registration.attendeeCount} children`)}</strong>
                <span>${escapeHtml(registration.caregiverName || "No caregiver listed")}</span>
              </button>
              <select data-program-registration-status="${escapeHtml(registration.id)}" aria-label="Registration status for ${escapeHtml(registration.caregiverName || "family")}">
                ${registrationStatusOptions(registration.status)}
              </select>
            </article>
          `).join("")}
        </div>
      ` : `<p class="program-notes">No families registered yet.</p>`}
    </section>
  `;
}

function renderProgramAttendance(session) {
  if (!session) return `<section class="detail-card"><p>Select a class to view attendance.</p></section>`;
  return `
    <section class="detail-card">
      <div class="card-heading"><h3>Attendance</h3></div>
      <div class="program-attendance-total"><strong>${session.participantCount || 0}</strong><span>participants recorded</span></div>
      <p class="program-notes">School scheduling is internal only. Use Edit Class to update attendance and reporting details.</p>
    </section>
  `;
}

function renderEditableTypeRows(types, kind) {
  return types.map((type) => `
    <div class="program-type-row" data-program-type-row data-program-type-id="${escapeHtml(type.id)}" data-program-type-kind="${kind}">
      <label class="program-type-name"><span>Name</span><input name="label" value="${escapeHtml(type.label)}" required></label>
      ${kind === "clinic" ? `
        <label><span>Type</span><input name="appointmentType" value="${escapeHtml(type.appointmentType)}" required></label>
        <label><span>Language</span><input name="defaultLanguage" value="${escapeHtml(type.defaultLanguage)}"></label>
        <label><span>Staff</span><input name="staffMember" value="${escapeHtml(type.staffMember)}"></label>
      ` : ""}
      <label><span>Minutes</span><input name="durationMinutes" type="number" min="5" step="5" value="${type.durationMinutes}" required></label>
      ${kind === "kitchen" ? `<label><span>Capacity</span><input name="capacity" type="number" min="1" value="${type.capacity}" required></label>` : ""}
      <label class="program-type-toggle"><input name="active" type="checkbox" ${type.active ? "checked" : ""}><span>Active</span></label>
      <label class="program-type-toggle"><input name="publiclyBookable" type="checkbox" ${type.publiclyBookable ? "checked" : ""}><span>Public</span></label>
      <button class="program-remove-type" data-program-remove-type type="button" aria-label="Remove ${escapeHtml(type.label)}">Remove</button>
    </div>
  `).join("");
}

function renderProgramSettings() {
  const weekdays = [[0, "Sun"], [1, "Mon"], [2, "Tue"], [3, "Wed"], [4, "Thu"], [5, "Fri"], [6, "Sat"]];
  return `
    <form class="program-settings-form" data-program-settings-form>
      <div class="program-settings-columns">
        <div class="program-settings-column" data-program-settings-column="clinic">
          <section class="detail-card">
            <div class="card-heading"><h3>Clinic Availability</h3></div>
            <div class="appointment-edit-fields program-settings-grid">
              <label class="is-full-width"><span>Clinic Appointment Location</span><input name="clinicLocation" value="${escapeHtml(scheduleSettings.clinicLocation)}" placeholder="Street, City, State, ZIP" required></label>
              <label><span>Schedule Start Time</span><input name="officeStartTime" type="time" value="${escapeHtml(scheduleSettings.officeStartTime)}"></label>
              <label><span>Schedule End Time</span><input name="officeEndTime" type="time" value="${escapeHtml(scheduleSettings.officeEndTime)}"></label>
              <label><span>Public Booking Start</span><input name="bookableStartTime" type="time" value="${escapeHtml(scheduleSettings.bookableStartTime)}"></label>
              <label><span>Public Booking End</span><input name="bookableEndTime" type="time" value="${escapeHtml(scheduleSettings.bookableEndTime)}"></label>
              <label><span>Default Appointment Length</span><input name="defaultDurationMinutes" type="number" min="5" step="5" value="${scheduleSettings.defaultDurationMinutes}"></label>
              <label><span>Appointment Interval</span><select name="slotIntervalMinutes">${[5, 10, 15, 30].map((minutes) => `<option value="${minutes}" ${scheduleSettings.slotIntervalMinutes === minutes ? "selected" : ""}>${minutes} minutes</option>`).join("")}</select></label>
            </div>
            <fieldset class="program-weekdays"><legend>Public Booking Days</legend>${weekdays.map(([value, label]) => `<label><input name="clinicWeekdays" type="checkbox" value="${value}" ${scheduleSettings.weekdays.includes(value) ? "checked" : ""}><span>${label}</span></label>`).join("")}</fieldset>
          </section>
          <section class="detail-card">
            <div class="card-heading"><h3>Clinic Appointment Types</h3><button data-program-add-type="clinic" type="button">Add Type</button></div>
            <p class="program-settings-note">These choices power both staff scheduling and public clinic booking.</p>
            <div class="program-type-list" data-program-type-list="clinic">${renderEditableTypeRows(scheduleSettings.clinicServices, "clinic")}</div>
          </section>
        </div>
        <div class="program-settings-column" data-program-settings-column="kitchen">
          <section class="detail-card">
            <div class="card-heading"><h3>Kitchen Availability</h3></div>
            <div class="appointment-edit-fields program-settings-grid">
              <label class="is-full-width"><span>Default Cooking Class Location</span><input name="kitchenLocation" value="${escapeHtml(scheduleSettings.kitchen.location)}" placeholder="Street, City, State, ZIP"></label>
              <label><span>Start Time</span><input name="startTime" type="time" value="${escapeHtml(scheduleSettings.kitchen.startTime)}"></label>
              <label><span>End Time</span><input name="endTime" type="time" value="${escapeHtml(scheduleSettings.kitchen.endTime)}"></label>
              <label><span>Default Capacity</span><input name="defaultCapacity" type="number" min="1" value="${scheduleSettings.kitchen.defaultCapacity}"></label>
              <label class="program-setting-toggle"><input name="waitlistEnabled" type="checkbox" ${scheduleSettings.kitchen.waitlistEnabled ? "checked" : ""}><span>Enable waitlist</span></label>
            </div>
            <fieldset class="program-weekdays"><legend>Available Days</legend>${weekdays.map(([value, label]) => `<label><input name="weekdays" type="checkbox" value="${value}" ${scheduleSettings.kitchen.weekdays.includes(value) ? "checked" : ""}><span>${label}</span></label>`).join("")}</fieldset>
          </section>
          <section class="detail-card">
            <div class="card-heading"><h3>Kitchen Class Types</h3><button data-program-add-type="kitchen" type="button">Add Type</button></div>
            <div class="program-type-list" data-program-type-list="kitchen">${renderEditableTypeRows(scheduleSettings.kitchenClassTypes, "kitchen")}</div>
          </section>
        </div>
      </div>
      <p class="schedule-action-status" data-program-action-status role="status" aria-live="polite"></p>
      <div class="program-form-actions"><button type="submit">Save Scheduling Settings</button></div>
    </form>
  `;
}

function renderProgramDetailContent(session, program) {
  if (programScheduleDetailTab === "roster") return renderProgramRoster(session);
  if (programScheduleDetailTab === "attendance") return renderProgramAttendance(session);
  return renderProgramDetails(session, program);
}

function renderProgramFooter(session, program) {
  if (!session) {
    return `<div class="footer-actions program-footer-actions"><button data-program-new-session type="button">New ${programSessionLabel(program)}</button></div>`;
  }
  return `
    <div class="footer-actions program-footer-actions">
      <button ${program === "Kitchen" ? "data-program-add-registration" : "data-program-edit-session"} type="button">${program === "Kitchen" ? "Add Family" : "Update Attendance"}</button>
      <button data-program-edit-session type="button">Edit ${programSessionLabel(program)}</button>
      <button data-program-delete-session type="button">${programDeletePendingId === session.id ? "Confirm Delete" : `Delete ${programSessionLabel(program)}`}</button>
    </div>
  `;
}

function renderProgramSessionEditor(program, session = null) {
  const classTypes = scheduleSettings.kitchenClassTypes.filter((type) => type.active || type.id === session?.classTypeId);
  const defaultType = classTypes.find((type) => type.id === session?.classTypeId) || classTypes[0];
  const value = session || {
    title: "",
    classTypeId: defaultType?.id || "",
    sessionDate: scheduleVisibleDate,
    startTime: program === "Kitchen" ? scheduleSettings.kitchen.startTime : "13:00",
    durationMinutes: program === "Kitchen" ? defaultType?.durationMinutes || 120 : 60,
    capacity: program === "Kitchen" ? defaultType?.capacity || scheduleSettings.kitchen.defaultCapacity : null,
    status: "Scheduled",
    location: program === "Kitchen" ? scheduleSettings.kitchen.location : "",
    staffMember: "",
    schoolName: "",
    gradeGroup: "",
    participantCount: 0,
    notes: ""
  };
  return `
    <article class="panel detail-panel program-editor-panel">
      <aside class="detail-side">${renderProgramDetailSide(session, program)}</aside>
      <div class="detail-main">
        <form class="program-editor-form" data-program-session-form>
          <div class="program-editor-heading"><h2>${session ? "Edit" : "New"} ${programSessionLabel(program)}</h2><button data-program-cancel-editor type="button">Cancel</button></div>
          <section class="detail-card">
            <div class="appointment-edit-fields program-editor-fields">
              ${program === "Kitchen" ? `
                <label class="is-full-width"><span>Class Type</span><select name="classTypeId" data-program-class-type>${classTypes.map((type) => `<option value="${escapeHtml(type.id)}" ${type.id === value.classTypeId ? "selected" : ""}>${escapeHtml(type.label)}</option>`).join("")}</select></label>
              ` : `
                <label><span>School / Site</span><input name="schoolName" value="${escapeHtml(value.schoolName)}" required></label>
                <label><span>Grade / Group</span><input name="gradeGroup" value="${escapeHtml(value.gradeGroup)}"></label>
              `}
              <label class="is-full-width"><span>${programSessionLabel(program)} Title</span><input name="title" value="${escapeHtml(value.title)}" ${program === "School" ? "required" : ""} placeholder="${program === "Kitchen" ? "Uses the class type name when blank" : "Class Title"}"></label>
              <label><span>Date</span><input name="sessionDate" type="date" value="${escapeHtml(value.sessionDate)}" required></label>
              <label><span>Start Time</span><input name="startTime" type="time" value="${escapeHtml(value.startTime)}" required></label>
              <label><span>Duration (minutes)</span><input name="durationMinutes" type="number" min="5" step="5" value="${value.durationMinutes}" required></label>
              ${program === "Kitchen" ? `<label><span>Capacity</span><input name="capacity" type="number" min="1" value="${value.capacity}" required></label>` : `<label><span>Participants</span><input name="participantCount" type="number" min="0" value="${value.participantCount || 0}"></label>`}
              <label class="is-full-width"><span>Location</span><input name="location" value="${escapeHtml(value.location)}" placeholder="Street, City, State, ZIP" required></label>
              <label><span>Staff</span><input name="staffMember" value="${escapeHtml(value.staffMember)}"></label>
              <label><span>Status</span><select name="status">${programStatusOptions(value.status)}</select></label>
              <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="4">${escapeHtml(value.notes)}</textarea></label>
            </div>
          </section>
          <p class="schedule-action-status" data-program-action-status role="status" aria-live="polite"></p>
          <div class="program-form-actions"><button type="submit">Save ${programSessionLabel(program)}</button></div>
        </form>
      </div>
    </article>
  `;
}

function renderProgramClientOptions(query = programClientSearchQuery, selectedIds = programSelectedClientIds) {
  if (query.trim().length < 2) return `<p>Type at least two letters to find a client.</p>`;
  const options = programClientSearchResults(scheduleClients, query, selectedIds);
  return options.map((client) => `
    <button data-program-select-client="${escapeHtml(client.id)}" type="button">
      <strong>${escapeHtml(clientFullName(client))}</strong>
      <span>${escapeHtml(client.parentName || "No caregiver listed")}${client.phone ? ` | ${escapeHtml(client.phone)}` : ""}</span>
    </button>
  `).join("") || `<p>No clients match this search.</p>`;
}

function renderProgramSelectedClients(selectedIds = programSelectedClientIds) {
  const selectedClients = selectedIds.map((id) => scheduleClientsById.get(id)).filter(Boolean);
  if (!selectedClients.length) return `<p>No children selected yet.</p>`;
  return selectedClients.map((client) => `
    <span class="program-selected-client">
      <input name="clientIds" type="hidden" value="${escapeHtml(client.id)}">
      <strong>${escapeHtml(clientFullName(client))}</strong>
      <button data-program-remove-client="${escapeHtml(client.id)}" type="button" aria-label="Remove ${escapeHtml(clientFullName(client))}">&times;</button>
    </span>
  `).join("");
}

function refreshProgramClientPicker() {
  const selected = document.querySelector("[data-program-selected-clients]");
  const options = document.querySelector("[data-program-client-options]");
  if (selected) selected.innerHTML = renderProgramSelectedClients();
  if (options) options.innerHTML = renderProgramClientOptions();
}

function fillProgramRegistrationContact(client) {
  const form = document.querySelector("[data-program-registration-form]");
  if (!form || !client) return;
  const contact = programClientContact(client);
  if (contact.caregiverName) form.elements.caregiverName.value = contact.caregiverName;
  if (contact.phone) form.elements.phone.value = contact.phone;
  if (contact.email) form.elements.email.value = contact.email;
}

function renderProgramRegistrationEditor(session, registration = null) {
  programSelectedClientIds = registration?.clientIds ? [...registration.clientIds] : [];
  return `
    <article class="panel detail-panel program-editor-panel">
      <aside class="detail-side">${renderProgramDetailSide(session, "Kitchen")}</aside>
      <div class="detail-main">
        <form class="program-editor-form" data-program-registration-form>
          <div class="program-editor-heading"><h2>${registration ? "Edit" : "Add"} Family</h2><button data-program-cancel-editor type="button">Cancel</button></div>
          <section class="detail-card">
            <div class="appointment-edit-fields program-editor-fields">
              <div class="program-client-picker is-full-width">
                <label><span>Find a Client</span><input data-program-client-search type="search" value="${escapeHtml(programClientSearchQuery)}" placeholder="Start typing a child's name"></label>
                <p class="program-client-help">Choose each child attending the class. Their caregiver, phone, and email will be filled in automatically.</p>
                <div class="program-selected-clients" data-program-selected-clients>${renderProgramSelectedClients()}</div>
                <div class="program-client-options" data-program-client-options>${renderProgramClientOptions()}</div>
              </div>
              <label><span>Caregiver</span><input name="caregiverName" value="${escapeHtml(registration?.caregiverName || "")}" required></label>
              <label><span>Registration Status</span><select name="status">${registrationStatusOptions(registration?.status || "")}</select><small>Choose automatically registers the whole family when every selected child fits. Otherwise, it places the whole family on the waitlist.</small></label>
              <label><span>Phone</span><input name="phone" value="${escapeHtml(registration?.phone || "")}"></label>
              <label><span>Email</span><input name="email" type="email" value="${escapeHtml(registration?.email || "")}"></label>
              <label class="is-full-width"><span>Food Restrictions</span><textarea name="foodRestrictions" rows="2">${escapeHtml(registration?.foodRestrictions || "")}</textarea></label>
              <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="3">${escapeHtml(registration?.notes || "")}</textarea></label>
            </div>
          </section>
          <p class="schedule-action-status" data-program-action-status role="status" aria-live="polite"></p>
          <div class="program-form-actions ${registration ? "has-delete" : ""}">
            ${registration ? `<button class="program-delete-registration" data-program-delete-registration type="button">${programDeletePendingId === registration.id ? "Confirm Remove" : "Remove Family"}</button>` : ""}
            <button type="submit">Save Family</button>
          </div>
        </form>
      </div>
    </article>
  `;
}

function renderProgramDetailArticle(program) {
  const session = selectedProgramSession();
  if (programSchedulePanelMode === "session-editor") return renderProgramSessionEditor(program, programEditingSessionId ? session : null);
  if (programSchedulePanelMode === "registration-editor") return renderProgramRegistrationEditor(session, selectedProgramRegistration());

  return `
    <article class="panel detail-panel program-detail-panel">
      <aside class="detail-side">${renderProgramDetailSide(session, program)}</aside>
      <div class="detail-main">
        ${renderProgramDetailTabs(program)}
        <div class="program-detail-content">${renderProgramDetailContent(session, program)}</div>
        <p class="schedule-action-status" data-program-action-status role="status" aria-live="polite"></p>
        ${renderProgramFooter(session, program)}
      </div>
    </article>
  `;
}

function renderProgramScheduleWorkspace() {
  const program = activeProgramName() || "Kitchen";
  return `
    <section class="workspace program-schedule-workspace" aria-label="${program} schedule">
      <div class="panel list-panel">
        <div class="panel-header"><div><h2>${program === "Kitchen" ? "Classes" : "School Classes"}</h2></div><button class="list-search program-new-icon" data-program-new-session type="button" aria-label="New ${programSessionLabel(program)}">${icons.plus}</button></div>
        <div class="list">${renderProgramSessionRows()}</div>
      </div>
      ${renderProgramDetailArticle(program)}
    </section>
  `;
}

function refreshProgramScheduleWorkspace() {
  const program = activeProgramName();
  if (!program) return;
  programScheduleItems = mapProgramSessions(programRawSessions, programRawRegistrations, program);
  if (!programScheduleItems.some((item) => item.id === programSelectedSessionId)) {
    programSelectedSessionId = programScheduleItems[0]?.id || "";
  }
  const host = document.querySelector("[data-program-schedule-workspace]");
  if (host) host.innerHTML = renderProgramScheduleWorkspace();
  const summary = document.querySelector("[data-schedule-summary]");
  if (summary) {
    modules.schedule.summary = programScheduleSummary(programScheduleItems, program);
    summary.innerHTML = renderSummaryItems(modules.schedule);
  }
}

function setProgramScheduleStatus(message, state = "") {
  const status = document.querySelector("[data-program-action-status]");
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
}

function setScheduleSubpage(module, label) {
  const isHiddenPrintCenter = module === modules.schedule && label === "Print Forms";
  if (!module.subpages.includes(label) && !isHiddenPrintCenter) return;
  if (label === "Public Booking") {
    location.href = "./booking.html";
    return;
  }
  scheduleSubpage = label;
  const url = new URL(window.location.href);
  if (label === "Clinic") url.searchParams.delete("section");
  else if (!isHiddenPrintCenter) url.searchParams.set("section", label);
  history.replaceState({}, "", url);
  document.querySelectorAll("[data-schedule-subpage]").forEach((button) => {
    button.classList.toggle("is-current", button.dataset.scheduleSubpage === scheduleSubpage);
  });

  const isPrintForms = scheduleSubpage === "Print Forms";
  const program = activeProgramName();
  const isProgram = Boolean(program);
  const clinicWorkspace = document.querySelector("[data-schedule-clinic-workspace]");
  const programWorkspace = document.querySelector("[data-program-schedule-workspace]");
  const printCenter = document.querySelector("[data-schedule-print-center]");
  const summary = document.querySelector("[data-schedule-summary]");
  const headerActions = document.querySelector("[data-schedule-header-actions]");
  const viewSwitch = headerActions?.querySelector(".view-switch");
  const primaryAction = headerActions?.querySelector(".primary-action");
  const quickActions = document.querySelector(".quick-actions");
  const title = document.querySelector("[data-page-title]");

  if (clinicWorkspace) clinicWorkspace.hidden = isPrintForms || isProgram;
  if (programWorkspace) programWorkspace.hidden = !isProgram;
  if (printCenter) printCenter.hidden = !isPrintForms;
  if (summary) summary.hidden = isPrintForms;
  if (headerActions) headerActions.hidden = isPrintForms;
  if (viewSwitch) viewSwitch.hidden = isProgram;
  if (quickActions) quickActions.hidden = isProgram || isPrintForms;
  if (primaryAction) {
    primaryAction.hidden = false;
    primaryAction.removeAttribute("data-program-new-session");
    if (isProgram) {
      primaryAction.removeAttribute("data-open-new-appointment");
      primaryAction.setAttribute("data-program-new-session", "");
      primaryAction.innerHTML = `${icons.plus}New ${programSessionLabel(program)}`;
    } else {
      primaryAction.setAttribute("data-open-new-appointment", "");
      primaryAction.innerHTML = `${icons.plus}New Appointment`;
    }
  }
  const pageTitle = cleanModulePageTitle("schedule", module.label, scheduleSubpage, module.title);
  if (title) title.textContent = pageTitle;
  document.title = `SNACK Program Hub ${pageTitle}`;
  if (isPrintForms) updateSchedulePrintCenter(module);
  if (isProgram) refreshProgramScheduleWorkspace();
  if (!isProgram && !isPrintForms) {
    module.summary = [["0", "Today"], ["0", "Completed"], ["0", "No Show"], ["0", "Reschedule"]];
    if (summary) summary.innerHTML = renderSummaryItems(module);
    updateScheduleSummary(module);
  }
}

function outreachCreateActionAttribute(action) {
  if (action === "New Event") return "data-outreach-new-event";
  if (["Add Lead", "New Lead"].includes(action)) return "data-outreach-new-contact";
  if (action === "New Task") return "data-outreach-new-task";
  if (action === "Log Outcome") return "data-outreach-log-outcome";
  if (action === "New Volunteer") return "data-outreach-new-volunteer";
  if (action === "New Opportunity") return "data-outreach-new-opportunity";
  return "";
}

function renderOutreachLeadViewSwitch() {
  if (outreachSubpage !== "Leads") return "";
  return `
    <div class="outreach-lead-switch" role="group" aria-label="Lead view">
      <button class="${outreachLeadView === "active" ? "is-active" : ""}" data-outreach-lead-view="active" type="button">Active</button>
      <button class="${outreachLeadView === "history" ? "is-active" : ""}" data-outreach-lead-view="history" type="button">History</button>
    </div>
  `;
}

function outreachDetailTabKey(tab = "") {
  return tab.toLowerCase().replaceAll(" ", "-");
}

function outreachSelectedItem() {
  return modules.outreach.items.find((item) => item.id === selectedItemId) || null;
}

function renderOutreachStatusControl(item = outreachSelectedItem()) {
  if (outreachSubpage === "Leads" && outreachLeadIsConverted(item)) {
    return `
      <div class="status-line is-module-status outreach-status-readonly" data-outreach-status-control aria-label="Lead status">
        <span class="status-dot"></span>
        <span>${escapeHtml(item?.status || "Converted")}</span>
      </div>
    `;
  }

  if (outreachSubpage === "Reports") {
    return `
      <div class="status-line is-module-status" data-outreach-status-control>
        <span class="status-dot"></span>
        <span>Current</span>
      </div>
    `;
  }

  const options = outreachSubpage === "Leads"
    ? outreachContactStatusOptions
    : outreachSubpage === "Volunteers"
      ? item?.kind === "volunteer-opportunity"
        ? volunteerOpportunityStatusOptions
        : volunteerProfileStatusOptions
    : outreachSubpage === "Tasks"
      ? outreachTaskStatusOptions
      : outreachEventStatusOptions;
  return `
    <label class="status-line is-module-status crm-status-control outreach-status-control" data-outreach-status-control>
      <span class="status-dot"></span>
      <select data-outreach-status-select aria-label="${escapeHtml(outreachSubpage.slice(0, -1) || "Outreach")} status">
        ${crmSelectOptions(options, item?.status || options[0])}
      </select>
    </label>
  `;
}

function refreshOutreachStatusControl(item = outreachSelectedItem()) {
  const current = document.querySelector("[data-outreach-status-control]");
  if (current) current.outerHTML = renderOutreachStatusControl(item);
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
    return `<p class="crm-empty-copy">No leads are linked to this event.</p>`;
  }

  return `
    <div class="crm-appointment-list">
      ${contacts.map((contact) => `
        <button class="crm-appointment-row" data-outreach-contact-id="${escapeHtml(contact.id)}" type="button">
          <span>
            <strong>${escapeHtml(contact.title)}</strong>
            <small>${escapeHtml([contact.interestType, contact.phone].filter((value) => value && value !== "-").join(" | ") || "Lead")}</small>
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
    leads: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Leads Generated</h3>
          <button class="edit-button" data-outreach-new-contact type="button">Add Lead</button>
        </div>
        ${renderOutreachLinkedContacts(item)}
      </section>
    `
  };
}

function renderOutreachContactPanels(item) {
  const converted = outreachLeadIsConverted(item);
  return {
    overview: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Lead Details</h3>
          <button class="edit-button" data-outreach-edit-contact type="button">Edit</button>
        </div>
        ${renderOutreachValueFields([
          ["Event", item.event],
          ["Caregiver or Contact", item.contactName],
          ["Child", item.childName],
          ["Organization", item.organizationName],
          ["Phone", item.phone],
          ["Email", item.email],
          ["Preferred Language", item.language],
          ["Interest", item.interestType],
          ["Created", item.createdDate]
        ])}
      </section>
    `,
    audience: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Audience</h3>
          <button class="edit-button" data-outreach-edit-contact type="button">Edit</button>
        </div>
        ${renderOutreachValueFields([
          ["Role Tag (Automatic)", "Outreach Lead"],
          ["Audience Groups", item.audienceGroupSummary],
          ["Marketing Consent", item.marketingConsent ? "Recorded" : "Not Recorded"],
          ["Consent Source", item.consentSource],
          ["Consent Date", item.consentDate]
        ])}
      </section>
    `,
    conversion: `
      <section class="detail-card">
        <div class="card-heading"><h3>Lead Conversion</h3></div>
        ${converted ? renderOutreachValueFields([
          ["Outcome", item.conversionType || item.status],
          ["Converted", item.convertedAt],
          ["Linked Record", item.convertedRecordId || item.referralId || "-"]
        ]) : `
          <p class="crm-note-copy">Choose where this lead belongs next. The original outreach record remains in Lead History.</p>
          <div class="outreach-conversion-actions">
            <button data-outreach-convert="referral" type="button">Create Referral</button>
            <button data-outreach-convert="audience" type="button">Keep as Audience Contact</button>
            <button data-outreach-convert="partner" type="button">Create Community Partner</button>
            <button data-outreach-convert="closed" type="button">Close Lead</button>
          </div>
        `}
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

function renderVolunteerProfilePanels(item) {
  return {
    profile: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Volunteer Profile</h3>
          <button class="edit-button" data-outreach-edit-volunteer-profile type="button">Edit</button>
        </div>
        ${renderOutreachValueFields([
          ["Email", item.email],
          ["Phone", item.phone],
          ["Preferred Contact", item.preferredContact],
          ["Application Date", item.applicationDate],
          ["Volunteer Frequency", item.volunteerFrequency],
          ["Frequency Details", item.volunteerFrequencyOther],
          ["Group Volunteering", item.groupVolunteering],
          ["Group Details", item.groupDetails],
          ["Available Days", item.availabilityDays],
          ["Available Times", item.availabilityTimes],
          ["Available Seasons", item.availabilitySeasons],
          ["Languages", item.languagesLabel]
        ])}
      </section>
    `,
    interests: `
      <section class="detail-card">
        <div class="card-heading"><h3>Interests & Skills</h3><button class="edit-button" data-outreach-edit-volunteer-profile type="button">Edit</button></div>
        ${renderOutreachValueFields([
          ["Program Interests", item.interestsLabel],
          ["Skills", item.skillsLabel],
          ["Prior Experience", item.experience],
          ["Emergency Contact", item.emergencyContact]
        ])}
      </section>
    `,
    access: `
      <section class="detail-card">
        <div class="card-heading"><h3>Approval & Access</h3><button class="edit-button" data-outreach-edit-volunteer-profile type="button">Edit</button></div>
        ${renderOutreachValueFields([
          ["Status", item.status],
          ["Background Check", item.backgroundCheckStatus],
          ["Approval Date", item.approvalDate],
          ["Approved By", item.approvedBy],
          ["SNACK Email", item.snackEmail]
        ])}
        <p class="crm-note-copy">Google Workspace accounts are created manually after approval. Version 1 records the assigned address but does not create or suspend Google users.</p>
      </section>
    `,
    notes: `
      <section class="detail-card">
        <div class="card-heading"><h3>Application & Notes</h3><button class="edit-button" data-outreach-edit-volunteer-profile type="button">Edit</button></div>
        ${renderOutreachValueFields([
          ["Why They Want to Volunteer", item.motivation],
          ["Applicant Questions", item.questions],
          ["Internal Notes", item.notes]
        ])}
      </section>
    `
  };
}

function renderVolunteerOpportunityPanels(item) {
  return {
    overview: `
      <section class="detail-card">
        <div class="card-heading"><h3>Opportunity</h3><button class="edit-button" data-outreach-edit-volunteer-opportunity type="button">Edit</button></div>
        ${renderOutreachValueFields([
          ["Program", item.program],
          ["Date", item.opportunityDate],
          ["Time", item.timeLabel],
          ["Location", item.location],
          ["Capacity", item.capacity],
          ["Coordinator", item.coordinator],
          ["Status", item.status]
        ])}
        <p class="crm-note-copy">${escapeHtml(item.description)}</p>
      </section>
    `,
    requirements: `
      <section class="detail-card">
        <div class="card-heading"><h3>Requirements</h3><button class="edit-button" data-outreach-edit-volunteer-opportunity type="button">Edit</button></div>
        <p class="crm-note-copy">${escapeHtml(item.requirementsLabel)}</p>
      </section>
    `,
    notes: `
      <section class="detail-card">
        <div class="card-heading"><h3>Notes</h3><button class="edit-button" data-outreach-edit-volunteer-opportunity type="button">Edit</button></div>
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
          ["New Leads", item.contacts],
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
    <div
      class="crm-detail-panel"
      id="outreach-detail-panel-${outreachDetailTabKey(tab)}"
      data-outreach-detail-panel="${outreachDetailTabKey(tab)}"
      role="tabpanel"
      ${index === 0 ? "" : "hidden"}
    ></div>
  `).join("");
}

function renderOutreachDetailContent(item) {
  const panels = !item
    ? Object.fromEntries(modules.outreach.detailTabs.map((tab) => [outreachDetailTabKey(tab), `
        <section class="detail-card"><p class="crm-empty-copy">Select ${outreachSubpage === "Volunteers" ? outreachVolunteerView === "Profiles" ? "a volunteer" : "an opportunity" : "an outreach record"} to review ${escapeHtml(tab.toLowerCase())} details.</p></section>
      `]))
    : outreachSubpage === "Volunteers"
      ? item.kind === "volunteer-opportunity" ? renderVolunteerOpportunityPanels(item) : renderVolunteerProfilePanels(item)
    : outreachSubpage === "Leads"
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
  const converted = outreachLeadIsConverted(item);
  const statusOptions = outreachContactStatusOptions.includes(source.status)
    ? outreachContactStatusOptions
    : [...outreachContactStatusOptions, source.status].filter(Boolean);
  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status" form="outreach-contact-editor-form" aria-label="Lead status" ${converted ? "disabled" : ""}>
          ${crmSelectOptions(statusOptions, source.status || "New")}
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
  const selectedGroups = Array.isArray(source.audienceGroups) ? source.audienceGroups : [];
  return `
    <form class="crm-profile-editor-main" id="outreach-contact-editor-form" data-outreach-contact-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Lead Details</h3><button class="edit-button" data-close-outreach-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields crm-profile-editor-fields">
          <label class="is-full-width"><span>Organization</span><input name="organizationName" value="${escapeHtml(source.organizationName || "")}"></label>
          <label><span>Phone</span><input name="phone" type="tel" value="${escapeHtml(source.phone || "")}"></label>
          <label><span>Email</span><input name="email" type="email" value="${escapeHtml(source.email || "")}"></label>
          <label><span>Preferred Language</span><select name="preferredLanguage">${crmSelectOptions(languageOptions, source.preferredLanguage || "English")}</select></label>
          <label><span>Interest</span><select name="interestType">${crmSelectOptions(outreachInterestTypeOptions, source.interestType, "Choose")}</select></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="5">${escapeHtml(source.notes || "")}</textarea></label>
        </div>
      </section>
      <section class="detail-card">
        <div class="card-heading"><h3>Audience</h3></div>
        <div class="schedule-inline-fields crm-profile-editor-fields">
          <div class="is-full-width marketing-audience-selector">
            <span class="marketing-field-label">Audience Groups</span>
            ${renderMarketingChoiceGrid(marketingEditableAudienceGroups(item), selectedGroups, "audienceGroups")}
          </div>
          <label class="is-full-width"><span>Additional Audience Groups</span><input name="additionalAudienceGroups" placeholder="Add another group, separated by commas"></label>
          <label class="crm-check-row marketing-opt-out-row"><input name="marketingConsent" type="checkbox" ${source.marketingConsent === true ? "checked" : ""}><span>Marketing Consent Recorded</span></label>
          <label><span>Consent Source</span><input name="consentSource" value="${escapeHtml(source.consentSource || "")}" placeholder="Event signup or written permission"></label>
          <label><span>Consent Date</span><input name="consentDate" type="date" value="${escapeHtml(source.consentDate || "")}"></label>
        </div>
      </section>
      <p class="schedule-dialog-status" data-outreach-editor-status role="status" aria-live="polite"></p>
      <div class="footer-actions outreach-editor-footer-actions" style="--outreach-editor-action-count: 2;">
        <button data-close-outreach-editor type="button">Cancel</button>
        <button class="is-primary" type="submit">${item ? "Save Changes" : "Save Lead"}</button>
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

function renderVolunteerProfileEditorSide(item = null) {
  const source = item?.source || {};
  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status" form="volunteer-profile-editor-form" aria-label="Volunteer status">
          ${crmSelectOptions(volunteerProfileStatusOptions, source.status || "Applicant")}
        </select>
      </label>
      <div class="crm-editor-name-fields">
        <label><span>Volunteer Name</span><input name="fullName" form="volunteer-profile-editor-form" value="${escapeHtml(source.fullName || "")}" required></label>
      </div>
      <div class="meta-list appointment-meta crm-editor-side-meta">
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.calendar}</span>
          <span class="crm-meta-copy"><em>Applied</em><input name="applicationDate" form="volunteer-profile-editor-form" type="date" value="${escapeHtml(source.applicationDate || "")}"></span>
        </label>
      </div>
    </div>
  `;
}

function renderVolunteerProfileEditorMain(item = null) {
  const source = item?.source || {};
  return `
    <form class="crm-profile-editor-main" id="volunteer-profile-editor-form" data-volunteer-profile-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Contact & Availability</h3><button class="edit-button" data-close-outreach-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields crm-profile-editor-fields">
          <label><span>Email</span><input name="email" type="email" value="${escapeHtml(source.email || "")}"></label>
          <label><span>Phone</span><input name="phone" type="tel" value="${escapeHtml(source.phone || "")}"></label>
          <label><span>Preferred Contact</span><select name="preferredContact">${crmSelectOptions(["Email", "Phone Call", "Text"], source.preferredContact || "Email")}</select></label>
          <label><span>Languages</span><input name="languages" value="${escapeHtml((source.languages || []).join(", "))}" placeholder="English, Spanish"></label>
          <label><span>Volunteer Frequency</span><select name="volunteerFrequency">${crmSelectOptions(["", "One time", "Ongoing", "Other"], source.volunteerFrequency || "")}</select></label>
          <label><span>Frequency Details</span><input name="volunteerFrequencyOther" value="${escapeHtml(source.volunteerFrequencyOther || "")}"></label>
          <label><span>Group Volunteering</span><select name="groupVolunteering">${crmSelectOptions(["", "Yes", "No", "Open to either"], source.groupVolunteering || "")}</select></label>
          <label><span>Group Details</span><input name="groupDetails" value="${escapeHtml(source.groupDetails || "")}"></label>
          <label class="is-full-width"><span>Available Days</span><input name="availabilityDays" value="${escapeHtml(source.availabilityDays || "")}" placeholder="Tuesday, Thursday, weekends"></label>
          <label class="is-full-width"><span>Available Times / Hours</span><input name="availabilityTimes" value="${escapeHtml(source.availabilityTimes || "")}" placeholder="Afternoons; about 3 hours per week"></label>
          <label class="is-full-width"><span>Available Seasons</span><input name="availabilitySeasons" value="${escapeHtml(source.availabilitySeasons || "")}" placeholder="Year-round, summer, or specific months"></label>
          <input name="availability" type="hidden" value="${escapeHtml(source.availability || "")}">
          <label class="is-full-width"><span>Program Interests</span><input name="interests" value="${escapeHtml((source.interests || []).join(", "))}" placeholder="Kitchen, Outreach, School"></label>
          <label class="is-full-width"><span>Skills</span><input name="skills" value="${escapeHtml((source.skills || []).join(", "))}" placeholder="Food preparation, bilingual, photography"></label>
          <label class="is-full-width"><span>Prior Experience</span><textarea name="experience" rows="4">${escapeHtml(source.experience || "")}</textarea></label>
          <label class="is-full-width"><span>Why They Want to Volunteer</span><textarea name="motivation" rows="4">${escapeHtml(source.motivation || "")}</textarea></label>
          <label class="is-full-width"><span>Applicant Questions</span><textarea name="questions" rows="4">${escapeHtml(source.questions || "")}</textarea></label>
          <label class="is-full-width"><span>Emergency Contact</span><input name="emergencyContact" value="${escapeHtml(source.emergencyContact || "")}" placeholder="Name and phone number"></label>
        </div>
      </section>
      <section class="detail-card">
        <div class="card-heading"><h3>Approval & Access</h3></div>
        <div class="schedule-inline-fields crm-profile-editor-fields">
          <label><span>Background Check</span><select name="backgroundCheckStatus">${crmSelectOptions(volunteerBackgroundCheckOptions, source.backgroundCheckStatus || "Not Started")}</select></label>
          <label><span>Approval Date</span><input name="approvalDate" type="date" value="${escapeHtml(source.approvalDate || "")}"></label>
          <label><span>Approved By</span><input name="approvedBy" value="${escapeHtml(source.approvedBy || "")}"></label>
          <label><span>SNACK Email</span><input name="snackEmail" type="email" value="${escapeHtml(source.snackEmail || "")}" placeholder="name@snackprogram.org"></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="5">${escapeHtml(source.notes || "")}</textarea></label>
        </div>
      </section>
      <p class="schedule-dialog-status" data-outreach-editor-status role="status" aria-live="polite"></p>
      <div class="footer-actions outreach-editor-footer-actions" style="--outreach-editor-action-count: ${item ? 3 : 2};">
        <button data-close-outreach-editor type="button">Cancel</button>
        ${item ? '<button data-outreach-delete-editor type="button">Delete Volunteer</button>' : ""}
        <button class="is-primary" type="submit">${item ? "Save Changes" : "Save Volunteer"}</button>
      </div>
    </form>
  `;
}

function renderVolunteerOpportunityEditorSide(item = null) {
  const source = item?.source || {};
  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status" form="volunteer-opportunity-editor-form" aria-label="Opportunity status">
          ${crmSelectOptions(volunteerOpportunityStatusOptions, source.status || "Draft")}
        </select>
      </label>
      <div class="crm-editor-name-fields">
        <label><span>Opportunity</span><input name="title" form="volunteer-opportunity-editor-form" value="${escapeHtml(source.title || "")}" required></label>
      </div>
      <div class="meta-list appointment-meta crm-editor-side-meta">
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.calendar}</span>
          <span class="crm-meta-copy"><em>Date</em><input name="opportunityDate" form="volunteer-opportunity-editor-form" type="date" value="${escapeHtml(source.opportunityDate || "")}"></span>
        </label>
        <label class="appointment-meta-row">
          <span class="appointment-meta-icon">${icons.outreach}</span>
          <span class="crm-meta-copy"><em>Program</em><select name="program" form="volunteer-opportunity-editor-form">${crmSelectOptions(["Clinic", "Kitchen", "School", "Outreach", "Operations"], source.program || "Outreach")}</select></span>
        </label>
      </div>
    </div>
  `;
}

function renderVolunteerOpportunityEditorMain(item = null) {
  const source = item?.source || {};
  return `
    <form class="crm-profile-editor-main" id="volunteer-opportunity-editor-form" data-volunteer-opportunity-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Opportunity Details</h3><button class="edit-button" data-close-outreach-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields crm-profile-editor-fields">
          <label><span>Start Time</span><input name="startTime" type="time" value="${escapeHtml(source.startTime || "")}"></label>
          <label><span>End Time</span><input name="endTime" type="time" value="${escapeHtml(source.endTime || "")}"></label>
          <label><span>Capacity</span><input name="capacity" type="number" min="1" value="${escapeHtml(source.capacity ?? "")}"></label>
          <label><span>Coordinator</span><input name="coordinator" value="${escapeHtml(source.coordinator || "")}"></label>
          <label class="is-full-width"><span>Location</span><input name="location" value="${escapeHtml(source.location || "")}"></label>
          <label class="is-full-width"><span>Description</span><textarea name="description" rows="4">${escapeHtml(source.description || "")}</textarea></label>
          <label class="is-full-width"><span>Requirements</span><input name="requirements" value="${escapeHtml((source.requirements || []).join(", "))}" placeholder="Background check, food handler card"></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="4">${escapeHtml(source.notes || "")}</textarea></label>
        </div>
      </section>
      <p class="schedule-dialog-status" data-outreach-editor-status role="status" aria-live="polite"></p>
      <div class="footer-actions outreach-editor-footer-actions" style="--outreach-editor-action-count: ${item ? 3 : 2};">
        <button data-close-outreach-editor type="button">Cancel</button>
        ${item ? '<button data-outreach-delete-editor type="button">Delete Opportunity</button>' : ""}
        <button class="is-primary" type="submit">${item ? "Save Changes" : "Save Opportunity"}</button>
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
  const profileEditor = editing && ["event", "contact", "task", "volunteer-profile", "volunteer-opportunity"].includes(outreachEditorKind);
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

  if (kind === "contact" && !item && outreachSubpage === "Leads") {
    outreachLeadView = "active";
    const url = new URL(window.location.href);
    url.searchParams.set("leadView", "active");
    history.replaceState({}, "", url);
  }

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
  } else if (kind === "volunteer-profile") {
    outreachEditingVolunteerProfileId = item?.id || "";
    editor.innerHTML = renderVolunteerProfileEditorMain(item);
    sideEditor.innerHTML = renderVolunteerProfileEditorSide(item);
  } else if (kind === "volunteer-opportunity") {
    outreachEditingVolunteerOpportunityId = item?.id || "";
    editor.innerHTML = renderVolunteerOpportunityEditorMain(item);
    sideEditor.innerHTML = renderVolunteerOpportunityEditorSide(item);
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
  outreachEditingVolunteerProfileId = "";
  outreachEditingVolunteerOpportunityId = "";
  setOutreachPanelMode("detail");
  updateDetail(modules.outreach, selectedItemId);
}

function refreshOutreachAccountControl() {
  if (currentModuleId() !== "outreach") return;
  const account = document.querySelector(".account");
  const accountName = document.querySelector("[data-account-name]");
  if (!account || !accountName) return;

  accountName.textContent = outreachCurrentUser ? staffAccountDisplayName(outreachCurrentUser) : "Sign in";
  configureAccountSignInControl(
    account,
    Boolean(outreachCurrentUser),
    `Sign in to load outreach ${outreachSubpage.toLowerCase()}`
  );
}

function updateOutreachActionAvailability(item = outreachSelectedItem()) {
  document.querySelectorAll("[data-outreach-action], [data-outreach-edit-event], [data-outreach-edit-contact], [data-outreach-edit-task], [data-outreach-edit-volunteer-profile], [data-outreach-edit-volunteer-opportunity], [data-outreach-log-outcome], [data-outreach-status-select], [data-outreach-contact-id], [data-outreach-delete-editor], [data-outreach-convert]").forEach((control) => {
    control.disabled = outreachActionBusy || !item;
  });
  document.querySelectorAll("[data-outreach-new-event], [data-outreach-new-contact], [data-outreach-new-task], [data-outreach-new-volunteer], [data-outreach-new-opportunity], [data-outreach-search-toggle], [data-outreach-search-input]").forEach((control) => {
    control.disabled = outreachActionBusy;
  });

  const deleteButton = document.querySelector("[data-outreach-action='delete'], [data-outreach-delete-editor]");
  if (deleteButton) {
    const noun = item?.kind === "volunteer-profile"
      ? "Volunteer"
      : item?.kind === "volunteer-opportunity"
        ? "Opportunity"
        : outreachSubpage === "Events"
          ? "Event"
          : outreachSubpage === "Leads"
            ? "Lead"
            : outreachSubpage === "Volunteers"
              ? outreachVolunteerView === "Profiles" ? "Volunteer" : "Opportunity"
              : "Task";
    deleteButton.textContent = outreachDeletePendingId === item?.id ? "Confirm Delete" : `Delete ${noun}`;
  }
  const doneButton = document.querySelector("[data-outreach-action='mark-done']");
  if (doneButton) {
    const done = item?.status === "Done";
    doneButton.disabled = outreachActionBusy || !item || done;
    doneButton.textContent = done ? "Task Done" : "Mark Done";
  }
  if (outreachSubpage === "Leads" && outreachLeadIsConverted(item)) {
    document.querySelectorAll("[data-outreach-status-select], [data-outreach-action='create-referral'], [data-outreach-action='close-lead'], [data-outreach-convert]").forEach((control) => {
      control.disabled = true;
    });
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
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());
  values.audienceGroups = marketingUniqueValues([
    ...formData.getAll("audienceGroups"),
    ...String(values.additionalAudienceGroups || "").split(",")
  ]);
  values.marketingConsent = form.elements.marketingConsent?.checked === true;
  const payload = outreachContactPayload({ ...(item?.source || {}), ...values });
  const returnEventId = !item && outreachSubpage === "Events" ? payload.eventId : "";

  setOutreachActionBusy(true);
  setOutreachActionStatus("");
  try {
    const result = await outreachAuthedFetch(item ? `/api/outreach-contacts/${encodeURIComponent(item.id)}` : "/api/outreach-contacts", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    selectedItemId = returnEventId || result.lead?.id || result.contact?.id || item?.id || selectedItemId;
    outreachEditingContactId = "";
    outreachEditorKind = "";
    if (returnEventId) {
      outreachDetailTab = "leads";
    } else if (outreachSubpage !== "Leads") {
      outreachSubpage = "Leads";
      configureOutreachModule("Leads");
      renderModulePage("outreach");
      refreshOutreachAccountControl();
    }
    await loadOutreachData(outreachCurrentUser, selectedItemId);
    setOutreachPanelMode("detail");
  } catch (error) {
    console.error(error);
    setOutreachActionStatus(error.message || "Could not save the lead.", "error");
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
    const result = await outreachAuthedFetch(item ? `/api/outreach-tasks/${encodeURIComponent(item.id)}` : "/api/outreach-tasks", {
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

async function saveVolunteerProfile(form) {
  if (outreachActionBusy) return;
  const item = outreachVolunteerProfileItems.find((candidate) => candidate.id === outreachEditingVolunteerProfileId) || null;
  const values = Object.fromEntries(new FormData(form).entries());
  const payload = volunteerProfilePayload({ ...(item?.source || {}), ...values });
  setOutreachActionBusy(true);
  setOutreachActionStatus("");
  try {
    const result = await outreachAuthedFetch(item ? `/api/volunteer-profiles/${encodeURIComponent(item.id)}` : "/api/volunteer-profiles", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    selectedItemId = result.profile?.id || item?.id || selectedItemId;
    outreachEditingVolunteerProfileId = "";
    outreachEditorKind = "";
    await loadOutreachData(outreachCurrentUser, selectedItemId);
    setOutreachPanelMode("detail");
  } catch (error) {
    console.error(error);
    setOutreachActionStatus(error.message || "Could not save the volunteer profile.", "error");
  } finally {
    setOutreachActionBusy(false);
  }
}

async function saveVolunteerOpportunity(form) {
  if (outreachActionBusy) return;
  const item = outreachVolunteerOpportunityItems.find((candidate) => candidate.id === outreachEditingVolunteerOpportunityId) || null;
  const values = Object.fromEntries(new FormData(form).entries());
  const payload = volunteerOpportunityPayload({ ...(item?.source || {}), ...values });
  setOutreachActionBusy(true);
  setOutreachActionStatus("");
  try {
    const result = await outreachAuthedFetch(item ? `/api/volunteer-opportunities/${encodeURIComponent(item.id)}` : "/api/volunteer-opportunities", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    selectedItemId = result.opportunity?.id || item?.id || selectedItemId;
    outreachEditingVolunteerOpportunityId = "";
    outreachEditorKind = "";
    await loadOutreachData(outreachCurrentUser, selectedItemId);
    setOutreachPanelMode("detail");
  } catch (error) {
    console.error(error);
    setOutreachActionStatus(error.message || "Could not save the volunteer opportunity.", "error");
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
  } else if (outreachSubpage === "Leads") {
    path = `/api/outreach-contacts/${encodeURIComponent(item.id)}`;
    payload = outreachContactPayload({ ...item.source, status });
  } else if (outreachSubpage === "Volunteers") {
    const opportunity = item.kind === "volunteer-opportunity";
    path = opportunity
      ? `/api/volunteer-opportunities/${encodeURIComponent(item.id)}`
      : `/api/volunteer-profiles/${encodeURIComponent(item.id)}`;
    payload = opportunity
      ? volunteerOpportunityPayload({ ...item.source, status })
      : volunteerProfilePayload({ ...item.source, status });
  } else {
    path = `/api/outreach-tasks/${encodeURIComponent(item.id)}`;
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
      : item.kind === "volunteer-profile"
        ? `/api/volunteer-profiles/${encodeURIComponent(item.id)}`
        : item.kind === "volunteer-opportunity"
          ? `/api/volunteer-opportunities/${encodeURIComponent(item.id)}`
      : `/api/outreach-tasks/${encodeURIComponent(item.id)}`;
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

async function convertOutreachLead(item, conversion = "") {
  if (!item || outreachActionBusy || outreachLeadIsConverted(item)) return;
  if (conversion === "referral") {
    openOutreachContactReferral(item);
    return;
  }

  const conversionTypes = {
    audience: "Audience Only",
    partner: "Community Partner",
    closed: "Closed"
  };
  const conversionType = conversionTypes[conversion];
  if (!conversionType) return;

  setOutreachActionBusy(true);
  setOutreachActionStatus("");
  try {
    await outreachAuthedFetch(`/api/outreach-contacts/${encodeURIComponent(item.id)}/convert`, {
      method: "POST",
      body: JSON.stringify({
        conversionType,
        organizationName: item.organizationName === "-" ? "" : item.organizationName
      })
    });
    outreachLeadView = "history";
    const url = new URL(window.location.href);
    url.searchParams.set("leadView", "history");
    history.replaceState({}, "", url);
    selectedItemId = item.id;
    outreachDetailTab = "conversion";
    await loadOutreachData(outreachCurrentUser, item.id);
    setOutreachDetailTab("conversion");
    setOutreachActionStatus(`${item.title} moved to Lead History as ${conversionType}.`, "success");
  } catch (error) {
    console.error(error);
    setOutreachActionStatus(error.message || "Could not convert this lead.", "error");
  } finally {
    setOutreachActionBusy(false);
  }
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
  if (label === "Leads") url.searchParams.set("leadView", outreachLeadView);
  else url.searchParams.delete("leadView");
  if (label === "Volunteers") url.searchParams.set("view", outreachVolunteerView);
  else url.searchParams.delete("view");
  history.replaceState({}, "", url);

  renderModulePage("outreach");
  refreshOutreachAccountControl();
  applyOutreachSearch(modules.outreach, "");
}

function setOutreachVolunteerView(view = "Profiles") {
  if (outreachSubpage !== "Volunteers" || outreachActionBusy) return;
  outreachVolunteerView = view === "Opportunities" ? "Opportunities" : "Profiles";
  outreachSearchQuery = "";
  outreachDetailTab = outreachVolunteerView === "Profiles" ? "profile" : "overview";
  outreachPanelMode = "detail";
  outreachEditorKind = "";
  configureOutreachModule("Volunteers");

  const url = new URL(window.location.href);
  url.searchParams.set("view", outreachVolunteerView);
  history.replaceState({}, "", url);

  renderModulePage("outreach");
  refreshOutreachAccountControl();
  applyOutreachSearch(modules.outreach, "");
}

function setOutreachLeadView(view = "active") {
  if (outreachSubpage !== "Leads" || outreachActionBusy) return;
  outreachLeadView = view === "history" ? "history" : "active";
  outreachSearchQuery = "";
  outreachDetailTab = "overview";
  outreachPanelMode = "detail";
  configureOutreachModule("Leads");

  const url = new URL(window.location.href);
  url.searchParams.set("leadView", outreachLeadView);
  history.replaceState({}, "", url);

  renderModulePage("outreach");
  refreshOutreachAccountControl();
  applyOutreachSearch(modules.outreach, "");
}

function fundraisingDetailTabKey(tab = "") {
  return tab.toLowerCase().replaceAll(" ", "-");
}

function fundraisingResourceLabel(label = fundraisingSubpage) {
  return label === "Giving" ? fundraisingGivingView : label;
}

function fundraisingResourceDefinition(label = fundraisingSubpage) {
  const resourceLabel = fundraisingResourceLabel(label);
  if (resourceLabel === "Donors") {
    return {
      endpoint: "/api/donors",
      itemKey: "donor",
      listKey: "donors",
      singular: "donor",
      title: "Donor",
      statusOptions: donorStatusOptions,
      defaultStatus: "Prospect",
      payload: donorPayload
    };
  }
  if (resourceLabel === "Gifts") {
    return {
      endpoint: "/api/gifts",
      itemKey: "gift",
      listKey: "gifts",
      singular: "gift",
      title: "Gift",
      statusOptions: giftTypeOptions,
      defaultStatus: "Individual Gift",
      payload: giftPayload
    };
  }
  if (resourceLabel === "Campaigns") {
    return {
      endpoint: "/api/campaigns",
      itemKey: "campaign",
      listKey: "campaigns",
      singular: "campaign",
      title: "Campaign",
      statusOptions: campaignStatusOptions,
      defaultStatus: "Planning",
      payload: campaignPayload
    };
  }
  if (resourceLabel === "Financial Activity") {
    return {
      endpoint: "/api/financial-activity",
      itemKey: "activity",
      listKey: "activities",
      singular: "revenue activity",
      title: "Revenue Activity",
      statusOptions: ["Received"],
      defaultStatus: "Received",
      payload: financialActivityPayload
    };
  }
  return {
    endpoint: "/api/grants",
    itemKey: "grant",
    listKey: "grants",
    singular: "grant",
    title: "Grant",
    statusOptions: grantStatusOptions,
    defaultStatus: "Researching",
    payload: grantPayload
  };
}

function renderFundraisingStatusControl() {
  const item = fundraisingSelectedItem();
  const resource = fundraisingResourceDefinition();
  if (fundraisingResourceLabel() === "Gifts") {
    return `
      <div class="status-line is-module-status fundraising-status-control">
        <span class="status-dot"></span>
        <strong>${escapeHtml(item?.giftType || resource.defaultStatus)}</strong>
      </div>
    `;
  }
  return `
    <label class="status-line is-module-status crm-status-control fundraising-status-control">
      <span class="status-dot"></span>
      <select data-fundraising-status-select aria-label="${escapeHtml(resource.title)} status">
        ${crmSelectOptions(resource.statusOptions, item?.status || resource.defaultStatus)}
      </select>
    </label>
  `;
}

function renderFundraisingValueFields(fields = []) {
  return `
    <div class="field-grid fundraising-field-grid">
      ${fields.map(([label, value]) => `
        <div class="field">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value || "-")}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function fundraisingSafeUrl(value = "") {
  try {
    const url = new URL(String(value).trim());
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function renderFundraisingLink(value, label) {
  const url = fundraisingSafeUrl(value);
  if (!url) return escapeHtml(value || "-");
  return `<a class="crm-profile-link" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
}

function renderFundraisingLinks(item) {
  if (!item.website && !item.portal) return "";
  return `
    <div class="fundraising-link-row">
      ${item.website ? `<span>${renderFundraisingLink(item.website, "Open Website")}</span>` : ""}
      ${item.portal ? `<span>${renderFundraisingLink(item.portal, "Open Application Portal")}</span>` : ""}
    </div>
  `;
}

function renderFundraisingDocuments(item) {
  if (!item?.documents?.length) {
    return `<p class="crm-empty-copy">No grant documents have been linked.</p>`;
  }

  return `
    <div class="crm-form-links fundraising-document-links">
      ${item.documents.map((document, index) => {
        const label = document.fileName || document.title || document.type || "Grant document";
        const url = fundraisingSafeUrl(document.url);
        const rowId = `grant:${item.id}:${document.id || index}`;
        return document.storagePath
          ? `<button class="crm-form-link" data-open-fundraising-document data-document-row-id="${escapeHtml(rowId)}" type="button">${icons.file}<span>${escapeHtml(label)}</span></button>`
          : url
          ? `<a class="crm-form-link" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${icons.file}<span>${escapeHtml(label)}</span></a>`
          : `<div class="crm-form-link is-disabled">${icons.file}<span>${escapeHtml(label)}</span></div>`;
      }).join("")}
    </div>
  `;
}

function renderFundraisingGrantPanels(item) {
  return {
    funding: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Funding Details</h3>
          <button class="edit-button" data-fundraising-edit type="button">Edit</button>
        </div>
        ${renderFundraisingValueFields([
          ["Foundation", item.foundation],
          ["Grant", item.grantName],
          ["Status", item.status],
          ["Opens", item.openDate],
          ["Deadline", item.deadline],
          ["Award Expected", item.awardExpected],
          ["Amount Requested", item.amountRequested],
          ["Available Range", item.range],
          ["Focus Areas", item.focusAreas],
          ["Recurrence", item.recurrence],
          ["Application Frequency", item.frequency]
        ])}
        <button class="fundraising-related-link" data-fundraising-add-grant-revenue="${escapeHtml(item.id)}" type="button">Record Grant Revenue</button>
        ${renderFundraisingLinkedFinancialActivity({ grantId: item.id, emptyLabel: "No revenue is linked to this grant yet." })}
      </section>
      <section class="detail-card">
        <div class="card-heading"><h3>Notes</h3></div>
        <p class="crm-note-copy">${escapeHtml(item.notes)}</p>
      </section>
    `,
    reporting: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Reporting</h3>
          <button class="edit-button" data-fundraising-edit type="button">Edit</button>
        </div>
        ${renderFundraisingValueFields([
          ["Requirements", item.reporting],
          ["Past Award", item.pastAward],
          ["Past Grant Notes", item.pastGrantNotes],
          ["Branding Notes", item.brandingNotes]
        ])}
      </section>
    `,
    contacts: `
      <section class="detail-card">
        <div class="card-heading">
          <h3>Contacts and Access</h3>
          <button class="edit-button" data-fundraising-edit type="button">Edit</button>
        </div>
        ${renderFundraisingValueFields([
          ["Primary Contact", item.contactName],
          ["Role", item.contactRole],
          ["Email", item.contactEmail],
          ["Phone", item.contactPhone],
          ["Secondary Contact", item.secondaryContact],
          ["Secondary Email", item.secondaryEmail],
          ["Portal Login Email", item.portalLoginEmail],
          ["Portal Notes", item.portalLoginNotes]
        ])}
        ${renderFundraisingLinks(item)}
      </section>
    `,
    documents: `
      <section class="detail-card">
        <div class="card-heading"><h3>Grant Documents</h3><button class="edit-button" data-fundraising-manage-documents="${escapeHtml(item.id)}" type="button">Manage</button></div>
        ${renderFundraisingDocuments(item)}
      </section>
    `
  };
}

function renderFundraisingDonorPanels(item) {
  return {
    profile: `
      <section class="detail-card">
        <div class="card-heading"><h3>Donor Profile</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["Donor Type", item.donorType],
          ["Status", item.status],
          ["Preferred Contact", item.preferredContact],
          ["Acknowledgement", item.acknowledgementStatus],
          ["Campaign", item.campaignName],
          ["Address", item.address]
        ])}
      </section>
    `,
    giving: `
      <section class="detail-card">
        <div class="card-heading"><h3>Giving</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["First Gift", item.firstGiftDate],
          ["Last Gift", item.lastGift],
          ["Lifetime Giving", item.lifetimeGiving],
          ["Recurring Amount", item.recurringAmount],
          ["Recurring Frequency", item.recurringFrequency],
          ["Campaign", item.campaignName]
        ])}
        <button class="fundraising-related-link" data-fundraising-add-gift-donor="${escapeHtml(item.id)}" type="button">Record Gift</button>
        ${renderFundraisingLinkedFinancialActivity({ donorId: item.id, emptyLabel: "No financial activity is linked to this donor yet." })}
      </section>
    `,
    contact: `
      <section class="detail-card">
        <div class="card-heading"><h3>Contact</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["Email", item.email],
          ["Phone", item.phone],
          ["Preferred Contact", item.preferredContact],
          ["Address", item.address]
        ])}
      </section>
    `,
    notes: `
      <section class="detail-card">
        <div class="card-heading"><h3>Notes</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        <p class="crm-note-copy">${escapeHtml(item.notes)}</p>
      </section>
    `
  };
}

function renderFundraisingGiftPanels(item) {
  return {
    details: `
      <section class="detail-card">
        <div class="card-heading"><h3>Gift Details</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["Donor", item.donorName],
          ["Gift Date", item.giftDate],
          ["Amount", item.amount],
          ["Gift Type", item.giftType],
          ["Payment Method", item.paymentMethod]
        ])}
        ${renderFundraisingRelatedRecordLink("Giving", item.donorId, "Open Donor", "Donors")}
      </section>
    `,
    allocation: `
      <section class="detail-card">
        <div class="card-heading"><h3>Allocation</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["Campaign", item.campaignName],
          ["Recurring", item.recurring],
          ["Recurring Frequency", item.recurringFrequency],
          ["External Transaction ID", item.externalTransactionId]
        ])}
        ${renderFundraisingRelatedRecordLink("Campaigns", item.campaignId, "Open Campaign")}
      </section>
    `,
    acknowledgement: `
      <section class="detail-card">
        <div class="card-heading"><h3>Acknowledgement</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["Status", item.acknowledgementStatus],
          ["Donor", item.donorName],
          ["Gift", `${item.amount} on ${item.giftDate}`]
        ])}
      </section>
    `,
    notes: `
      <section class="detail-card">
        <div class="card-heading"><h3>Notes</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        <p class="crm-note-copy">${escapeHtml(item.notes)}</p>
      </section>
    `
  };
}

function renderFundraisingCampaignPanels(item) {
  return {
    campaign: `
      <section class="detail-card">
        <div class="card-heading"><h3>Campaign Details</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["Campaign Type", item.campaignType],
          ["Status", item.status],
          ["Start Date", item.startDate],
          ["End Date", item.endDate],
          ["Owner", item.owner]
        ])}
      </section>
    `,
    progress: `
      <section class="detail-card">
        <div class="card-heading"><h3>Progress</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["Goal", item.goal],
          ["Raised", item.raised],
          ["Remaining", item.remaining],
          ["Status", item.status]
        ])}
        <button class="fundraising-related-link" data-fundraising-add-gift-campaign="${escapeHtml(item.id)}" type="button">Record Gift</button>
        ${renderFundraisingLinkedFinancialActivity({ campaignId: item.id, emptyLabel: "No financial activity is linked to this campaign yet." })}
      </section>
    `,
    audience: `
      <section class="detail-card">
        <div class="card-heading"><h3>Audience and Delivery</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["Audience", item.audience],
          ["Channels", item.channels],
          ["Contact", item.contactName],
          ["Contact Email", item.contactEmail]
        ])}
      </section>
    `,
    notes: `
      <section class="detail-card">
        <div class="card-heading"><h3>Notes</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        <p class="crm-note-copy">${escapeHtml(item.notes)}</p>
      </section>
    `
  };
}

function renderFundraisingRelatedRecordLink(section, recordId, label, view = "") {
  if (!recordId) return "";
  return `
    <button
      class="fundraising-related-link"
      data-fundraising-related-section="${escapeHtml(section)}"
      data-fundraising-related-id="${escapeHtml(recordId)}"
      ${view ? `data-fundraising-related-view="${escapeHtml(view)}"` : ""}
      type="button"
    >${escapeHtml(label)}</button>
  `;
}

function renderFundraisingLinkedFinancialActivity({ grantId = "", donorId = "", campaignId = "", emptyLabel = "No linked financial activity yet." } = {}) {
  const items = fundraisingFinancialActivityItems.filter((activity) => (
    (!grantId || activity.grantId === grantId)
    && (!donorId || activity.donorId === donorId)
    && (!campaignId || activity.campaignId === campaignId)
  ));
  const total = items.reduce((sum, activity) => (
    sum + (activity.includedInRevenue === false ? 0 : Number(activity.amountValue) || 0)
  ), 0);
  return `
    <div class="fundraising-linked-activity">
      <div class="fundraising-linked-activity-heading">
        <strong>Financial Activity</strong>
        <span>${escapeHtml(formatGrantMoney(total, "$0"))}</span>
      </div>
      ${items.length ? `
        <div class="fundraising-linked-activity-list">
          ${items.map((activity) => `
            <button
              data-fundraising-related-financial-activity="${escapeHtml(activity.id)}"
              type="button"
            >
              <span>
                <strong>${escapeHtml(activity.sourceName)}</strong>
                <small>${escapeHtml(activity.transactionDate)} · ${escapeHtml(activity.activityType)}</small>
              </span>
              <b>${escapeHtml(activity.amount)}</b>
            </button>
          `).join("")}
        </div>
      ` : `<p class="crm-empty-copy">${escapeHtml(emptyLabel)}</p>`}
    </div>
  `;
}

function renderFundraisingEarnedIncomePanels(item) {
  return {
    income: `
      <section class="detail-card">
        <div class="card-heading"><h3>Income Details</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["Source", item.sourceName],
          ["Service Type", item.serviceType],
          ["Status", item.status],
          ["Period", item.period],
          ["Due Date", item.dueDate],
          ["Payment Date", item.paymentDate],
          ["Use of Funds", item.useOfFunds]
        ])}
      </section>
    `,
    reporting: `
      <section class="detail-card">
        <div class="card-heading"><h3>Billing and Reporting</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["Billed", item.billed],
          ["Received", item.received],
          ["Outstanding", item.outstanding],
          ["Reporting Frequency", item.reportingFrequency],
          ["Required Metrics", item.requiredMetrics],
          ["Risk", item.risk]
        ])}
      </section>
    `,
    contacts: `
      <section class="detail-card">
        <div class="card-heading"><h3>Contacts</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        ${renderFundraisingValueFields([
          ["Payer", item.payerName],
          ["Contact", item.contactName],
          ["Email", item.contactEmail]
        ])}
      </section>
    `,
    notes: `
      <section class="detail-card">
        <div class="card-heading"><h3>Notes</h3><button class="edit-button" data-fundraising-edit type="button">Edit</button></div>
        <p class="crm-note-copy">${escapeHtml(item.notes)}</p>
      </section>
    `
  };
}

function renderFundraisingPanels(item) {
  const resourceLabel = fundraisingResourceLabel();
  if (resourceLabel === "Donors") return renderFundraisingDonorPanels(item);
  if (resourceLabel === "Gifts") return renderFundraisingGiftPanels(item);
  if (resourceLabel === "Campaigns") return renderFundraisingCampaignPanels(item);
  if (resourceLabel === "Earned Income") return renderFundraisingEarnedIncomePanels(item);
  return renderFundraisingGrantPanels(item);
}

function renderFundraisingDetailPanels(module) {
  return module.detailTabs.map((tab, index) => `
    <div class="crm-detail-panel" data-fundraising-detail-panel="${fundraisingDetailTabKey(tab)}" ${index === 0 ? "" : "hidden"}></div>
  `).join("");
}

function renderFundraisingDetailContent(item) {
  const resource = fundraisingResourceDefinition();
  const article = resource.singular === "earned income record" ? "an" : "a";
  const panels = item
    ? renderFundraisingPanels(item)
    : Object.fromEntries(modules.fundraising.detailTabs.map((tab) => [fundraisingDetailTabKey(tab), `
        <section class="detail-card"><p class="crm-empty-copy">Select ${article} ${escapeHtml(resource.singular)} to review its details.</p></section>
      `]));

  Object.entries(panels).forEach(([key, html]) => {
    const panel = document.querySelector(`[data-fundraising-detail-panel="${key}"]`);
    if (panel) panel.innerHTML = html;
  });
}

function setFundraisingDetailTab(tab = "") {
  const validTabs = new Set(modules.fundraising.detailTabs.map(fundraisingDetailTabKey));
  const fallback = fundraisingDetailTabKey(modules.fundraising.detailTabs[0] || "Funding");
  fundraisingDetailTab = validTabs.has(tab) ? tab : fallback;

  document.querySelectorAll("[data-fundraising-detail-tab]").forEach((button) => {
    const active = button.dataset.fundraisingDetailTab === fundraisingDetailTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-fundraising-detail-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.fundraisingDetailPanel !== fundraisingDetailTab;
  });
  document.querySelectorAll("[data-fundraising-editor-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.fundraisingEditorPanel !== fundraisingDetailTab;
  });
}

function fundraisingEditorValue(source, key) {
  const value = source?.[key];
  return value === null || value === undefined ? "" : String(value);
}

function renderFundraisingGrantEditorSide(item = null) {
  const source = item?.source || {};
  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status" form="fundraising-record-editor-form" aria-label="Grant status">
          ${crmSelectOptions(grantStatusOptions, source.status || "Researching")}
        </select>
      </label>
      <div class="crm-editor-name-fields">
        <label><span>Foundation</span><input name="foundationName" form="fundraising-record-editor-form" value="${escapeHtml(fundraisingEditorValue(source, "foundationName"))}"></label>
        <label><span>Grant Name</span><input name="grantName" form="fundraising-record-editor-form" value="${escapeHtml(fundraisingEditorValue(source, "grantName"))}"></label>
      </div>
      <div class="meta-list appointment-meta crm-editor-side-meta">
        <label class="crm-side-field"><span>Deadline</span><input name="deadlineDate" form="fundraising-record-editor-form" type="date" value="${escapeHtml(fundraisingEditorValue(source, "deadlineDate"))}"></label>
        <label class="crm-side-field"><span>Deadline Time</span><input name="deadlineTime" form="fundraising-record-editor-form" type="time" value="${escapeHtml(fundraisingEditorValue(source, "deadlineTime"))}"></label>
        <label class="crm-side-field"><span>Amount Requested</span><input name="amountRequested" form="fundraising-record-editor-form" type="number" min="0" step="0.01" value="${escapeHtml(fundraisingEditorValue(source, "amountRequested"))}"></label>
      </div>
      <section class="side-section crm-editor-family-section">
        <h3><span class="section-icon">${icons.crm}</span>Primary Contact</h3>
        <label class="crm-side-field"><span>Name</span><input name="contactName" form="fundraising-record-editor-form" value="${escapeHtml(fundraisingEditorValue(source, "contactName"))}"></label>
        <label class="crm-side-field"><span>Role</span><input name="contactRole" form="fundraising-record-editor-form" value="${escapeHtml(fundraisingEditorValue(source, "contactRole"))}"></label>
        <label class="crm-side-field"><span>Email</span><input name="contactEmail" form="fundraising-record-editor-form" type="email" value="${escapeHtml(fundraisingEditorValue(source, "contactEmail"))}"></label>
        <label class="crm-side-field"><span>Phone</span><input name="contactPhone" form="fundraising-record-editor-form" type="tel" value="${escapeHtml(fundraisingEditorValue(source, "contactPhone"))}"></label>
      </section>
    </div>
  `;
}

function renderFundraisingGrantEditorMain(item = null) {
  const source = item?.source || {};
  return `
    <form class="schedule-inline-form crm-profile-editor-main" id="fundraising-record-editor-form" data-fundraising-record-form>
      <section class="detail-card" data-fundraising-editor-panel="funding">
        <div class="card-heading"><h3>Funding Details</h3><button class="edit-button" data-close-fundraising-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields fundraising-editor-fields">
          <label><span>Open Date</span><input name="openDate" type="date" value="${escapeHtml(fundraisingEditorValue(source, "openDate"))}"></label>
          <label><span>Award Expected</span><input name="awardExpectedDate" type="date" value="${escapeHtml(fundraisingEditorValue(source, "awardExpectedDate"))}"></label>
          <label><span>Recurrence</span><input name="recurrence" value="${escapeHtml(fundraisingEditorValue(source, "recurrence"))}" placeholder="Annual, one-time, rolling"></label>
          <label><span>Application Frequency</span><input name="applicationFrequency" value="${escapeHtml(fundraisingEditorValue(source, "applicationFrequency"))}"></label>
          <label><span>Minimum Award</span><input name="amountMin" type="number" min="0" step="0.01" value="${escapeHtml(fundraisingEditorValue(source, "amountMin"))}"></label>
          <label><span>Maximum Award</span><input name="amountMax" type="number" min="0" step="0.01" value="${escapeHtml(fundraisingEditorValue(source, "amountMax"))}"></label>
          <label class="is-full-width"><span>Focus Areas</span><textarea name="focusAreas" rows="2">${escapeHtml(fundraisingEditorValue(source, "focusAreas"))}</textarea></label>
        </div>
      </section>
      <section class="detail-card" data-fundraising-editor-panel="contacts" hidden>
        <div class="card-heading"><h3>Contacts and Access</h3></div>
        <div class="schedule-inline-fields fundraising-editor-fields">
          <label><span>Secondary Contact</span><input name="secondaryContactName" value="${escapeHtml(fundraisingEditorValue(source, "secondaryContactName"))}"></label>
          <label><span>Secondary Email</span><input name="secondaryContactEmail" type="email" value="${escapeHtml(fundraisingEditorValue(source, "secondaryContactEmail"))}"></label>
          <label><span>Website</span><input name="websiteUrl" type="url" value="${escapeHtml(fundraisingEditorValue(source, "websiteUrl"))}"></label>
          <label><span>Application Portal</span><input name="portalUrl" type="url" value="${escapeHtml(fundraisingEditorValue(source, "portalUrl"))}"></label>
          <label><span>Portal Login Email</span><input name="portalLoginEmail" type="email" value="${escapeHtml(fundraisingEditorValue(source, "portalLoginEmail"))}"></label>
          <label><span>Portal Password</span><input name="portalLoginPassword" type="password" value="${escapeHtml(fundraisingEditorValue(source, "portalLoginPassword"))}"></label>
          <label class="is-full-width"><span>Portal Notes</span><textarea name="portalLoginNotes" rows="2">${escapeHtml(fundraisingEditorValue(source, "portalLoginNotes"))}</textarea></label>
        </div>
      </section>
      <section class="detail-card" data-fundraising-editor-panel="reporting" hidden>
        <div class="card-heading"><h3>Reporting and History</h3></div>
        <div class="schedule-inline-fields fundraising-editor-fields">
          <label class="is-full-width"><span>Reporting Requirements</span><textarea name="reportingRequirements" rows="2">${escapeHtml(fundraisingEditorValue(source, "reportingRequirements"))}</textarea></label>
          <label class="crm-profile-boolean-control"><input name="pastGrantReceived" type="checkbox" ${source.pastGrantReceived ? "checked" : ""}><strong>Past Grant Received</strong></label>
          <label><span>Past Grant Amount</span><input name="pastGrantAmount" type="number" min="0" step="0.01" value="${escapeHtml(fundraisingEditorValue(source, "pastGrantAmount"))}"></label>
          <label><span>Past Grant Year</span><input name="pastGrantYear" type="number" min="1900" max="2100" step="1" value="${escapeHtml(fundraisingEditorValue(source, "pastGrantYear"))}"></label>
          <label><span>Previous Award Date</span><input name="previousAwardDate" type="date" value="${escapeHtml(fundraisingEditorValue(source, "previousAwardDate"))}"></label>
          <label class="is-full-width"><span>Past Grant Notes</span><textarea name="pastGrantNotes" rows="2">${escapeHtml(fundraisingEditorValue(source, "pastGrantNotes"))}</textarea></label>
          <label class="is-full-width"><span>Branding Notes</span><textarea name="brandingNotes" rows="2">${escapeHtml(fundraisingEditorValue(source, "brandingNotes"))}</textarea></label>
          <label class="is-full-width"><span>Grant Notes</span><textarea name="notes" rows="3">${escapeHtml(fundraisingEditorValue(source, "notes"))}</textarea></label>
        </div>
      </section>
      <section class="detail-card" data-fundraising-editor-panel="documents" hidden>
        <div class="card-heading"><h3>Documents</h3></div>
        <p class="crm-empty-copy">${item ? "Save any changes, then use the Documents workspace to upload or manage files for this grant." : "Save this grant first. After it has been created, its Documents tab will allow uploads, previews, and downloads."}</p>
      </section>
      ${renderFundraisingEditorFooter(item)}
    </form>
  `;
}

function renderFundraisingEditorSideField(source, field) {
  const attributes = field.type === "number" ? 'type="number" min="0" step="0.01"' : field.type ? `type="${field.type}"` : "";
  return `<label class="crm-side-field"><span>${escapeHtml(field.label)}</span><input name="${escapeHtml(field.name)}" form="fundraising-record-editor-form" ${attributes} value="${escapeHtml(fundraisingEditorValue(source, field.name))}"></label>`;
}

function renderFundraisingStandardEditorSide(item, options) {
  const source = item?.source || {};
  const resource = fundraisingResourceDefinition();
  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status" form="fundraising-record-editor-form" aria-label="${escapeHtml(resource.title)} status">
          ${crmSelectOptions(resource.statusOptions, source.status || resource.defaultStatus)}
        </select>
      </label>
      <div class="crm-editor-name-fields">
        <label><span>${escapeHtml(options.nameLabel)}</span><input name="name" form="fundraising-record-editor-form" value="${escapeHtml(fundraisingEditorValue(source, "name"))}"></label>
      </div>
      <div class="meta-list appointment-meta crm-editor-side-meta">
        ${options.metaFields.map((field) => renderFundraisingEditorSideField(source, field)).join("")}
      </div>
      <section class="side-section crm-editor-family-section">
        <h3><span class="section-icon">${icons[options.sectionIcon || "crm"]}</span>${escapeHtml(options.sectionTitle)}</h3>
        ${options.sectionFields.map((field) => renderFundraisingEditorSideField(source, field)).join("")}
      </section>
    </div>
  `;
}

function renderFundraisingDonorEditorSide(item = null) {
  return renderFundraisingStandardEditorSide(item, {
    nameLabel: "Donor Name",
    metaFields: [
      { label: "Donor Type", name: "donorType" },
      { label: "Last Gift", name: "lastGiftDate", type: "date" },
      { label: "Lifetime Giving", name: "lifetimeGiving", type: "number" }
    ],
    sectionTitle: "Contact",
    sectionFields: [
      { label: "Email", name: "email", type: "email" },
      { label: "Phone", name: "phone", type: "tel" },
      { label: "Preferred Contact", name: "preferredContact" }
    ]
  });
}

function renderFundraisingGiftEditorSide(item = null) {
  const source = item?.source || {};
  const selectedDonorId = fundraisingEditorValue(source, "donorId");
  return `
    <div class="crm-profile-editor-side">
      <div class="status-line is-module-status fundraising-status-control">
        <span class="status-dot"></span>
        <strong>Gift Transaction</strong>
      </div>
      <div class="crm-editor-name-fields">
        <label><span>Donor</span><select name="donorId" form="fundraising-record-editor-form" required>
          <option value="">Choose donor</option>
          ${fundraisingDonorItems.map((donor) => `<option value="${escapeHtml(donor.id)}" ${donor.id === selectedDonorId ? "selected" : ""}>${escapeHtml(donor.title)}</option>`).join("")}
        </select></label>
      </div>
      <div class="meta-list appointment-meta crm-editor-side-meta">
        <label class="crm-side-field"><span>Gift Date</span><input name="giftDate" form="fundraising-record-editor-form" type="date" required value="${escapeHtml(fundraisingEditorValue(source, "giftDate"))}"></label>
        <label class="crm-side-field"><span>Amount</span><input name="amount" form="fundraising-record-editor-form" type="number" min="0.01" step="0.01" required value="${escapeHtml(fundraisingEditorValue(source, "amount"))}"></label>
        <label class="crm-side-field"><span>Gift Type</span><select name="giftType" form="fundraising-record-editor-form">
          ${crmSelectOptions(giftTypeOptions, source.giftType || "Individual Gift")}
        </select></label>
      </div>
      <section class="side-section crm-editor-family-section">
        <h3><span class="section-icon">${icons.fundraising}</span>Payment</h3>
        <label class="crm-side-field"><span>Payment Method</span><select name="paymentMethod" form="fundraising-record-editor-form">
          <option value="">Choose method</option>
          ${crmSelectOptions(giftPaymentMethodOptions, source.paymentMethod || "")}
        </select></label>
        <label class="crm-profile-boolean-control"><input name="recurring" form="fundraising-record-editor-form" type="checkbox" ${source.recurring ? "checked" : ""}><strong>Recurring Gift</strong></label>
      </section>
    </div>
  `;
}

function renderFundraisingCampaignEditorSide(item = null) {
  return renderFundraisingStandardEditorSide(item, {
    nameLabel: "Campaign Name",
    metaFields: [
      { label: "Start Date", name: "startDate", type: "date" },
      { label: "End Date", name: "endDate", type: "date" },
      { label: "Goal", name: "goalAmount", type: "number" }
    ],
    sectionTitle: "Campaign Lead",
    sectionFields: [
      { label: "Owner", name: "owner" },
      { label: "Contact", name: "contactName" },
      { label: "Contact Email", name: "contactEmail", type: "email" }
    ]
  });
}

function renderFundraisingEarnedIncomeEditorSide(item = null) {
  return renderFundraisingStandardEditorSide(item, {
    nameLabel: "Income Source Name",
    metaFields: [
      { label: "Due Date", name: "dueDate", type: "date" },
      { label: "Amount Billed", name: "amountBilled", type: "number" },
      { label: "Amount Received", name: "amountReceived", type: "number" }
    ],
    sectionTitle: "Payer",
    sectionFields: [
      { label: "Payer Name", name: "payerName" },
      { label: "Contact", name: "contactName" },
      { label: "Contact Email", name: "contactEmail", type: "email" }
    ]
  });
}

function renderFundraisingEditorFooter(item = null) {
  const resource = fundraisingResourceDefinition();
  return `
    <p class="schedule-dialog-status" data-fundraising-editor-status role="status" aria-live="polite"></p>
    <div class="footer-actions fundraising-editor-footer-actions" style="--fundraising-editor-action-count: ${item ? 3 : 2};">
      <button data-close-fundraising-editor type="button">Cancel</button>
      ${item ? `<button data-fundraising-delete-editor type="button">Delete ${escapeHtml(resource.title)}</button>` : ""}
      <button type="submit">${item ? "Save Changes" : `Save ${escapeHtml(resource.title)}`}</button>
    </div>
  `;
}

function renderFundraisingDonorEditorMain(item = null) {
  const source = item?.source || {};
  const selectedCampaignId = fundraisingEditorValue(source, "campaignId");
  return `
    <form class="schedule-inline-form crm-profile-editor-main" id="fundraising-record-editor-form" data-fundraising-record-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Giving Details</h3><button class="edit-button" data-close-fundraising-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields fundraising-editor-fields">
          <label><span>First Gift Date</span><input name="firstGiftDate" type="date" value="${escapeHtml(fundraisingEditorValue(source, "firstGiftDate"))}"></label>
          <label><span>Last Gift Amount</span><input name="lastGiftAmount" type="number" min="0" step="0.01" value="${escapeHtml(fundraisingEditorValue(source, "lastGiftAmount"))}"></label>
          <label><span>Recurring Amount</span><input name="recurringAmount" type="number" min="0" step="0.01" value="${escapeHtml(fundraisingEditorValue(source, "recurringAmount"))}"></label>
          <label><span>Recurring Frequency</span><input name="recurringFrequency" value="${escapeHtml(fundraisingEditorValue(source, "recurringFrequency"))}" placeholder="Monthly, quarterly, annual"></label>
          <label><span>Campaign</span><select name="campaignId" data-fundraising-campaign-select>
            <option value="">No campaign</option>
            ${fundraisingCampaignItems.map((campaign) => `<option value="${escapeHtml(campaign.id)}" ${campaign.id === selectedCampaignId ? "selected" : ""}>${escapeHtml(campaign.title)}</option>`).join("")}
          </select></label>
          <label><span>Acknowledgement</span><input name="acknowledgementStatus" value="${escapeHtml(fundraisingEditorValue(source, "acknowledgementStatus"))}" placeholder="Needed, sent, complete"></label>
          <label class="is-full-width"><span>Address</span><textarea name="address" rows="2">${escapeHtml(fundraisingEditorValue(source, "address"))}</textarea></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="3">${escapeHtml(fundraisingEditorValue(source, "notes"))}</textarea></label>
        </div>
      </section>
      ${renderFundraisingEditorFooter(item)}
    </form>
  `;
}

function renderFundraisingGiftEditorMain(item = null) {
  const source = item?.source || {};
  const selectedCampaignId = fundraisingEditorValue(source, "campaignId");
  return `
    <form class="schedule-inline-form crm-profile-editor-main" id="fundraising-record-editor-form" data-fundraising-record-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Gift Allocation</h3><button class="edit-button" data-close-fundraising-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields fundraising-editor-fields">
          <label><span>Campaign</span><select name="campaignId" data-fundraising-campaign-select>
            <option value="">No campaign</option>
            ${fundraisingCampaignItems.map((campaign) => `<option value="${escapeHtml(campaign.id)}" ${campaign.id === selectedCampaignId ? "selected" : ""}>${escapeHtml(campaign.title)}</option>`).join("")}
          </select></label>
          <label><span>Recurring Frequency</span><select name="recurringFrequency">
            <option value="">Not specified</option>
            ${crmSelectOptions(giftRecurringFrequencyOptions, source.recurringFrequency || "")}
          </select></label>
          <label><span>Acknowledgement Status</span><input name="acknowledgementStatus" value="${escapeHtml(fundraisingEditorValue(source, "acknowledgementStatus"))}" placeholder="Needed, sent, complete"></label>
          <label><span>External Transaction ID</span><input name="externalTransactionId" value="${escapeHtml(fundraisingEditorValue(source, "externalTransactionId"))}"></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="4">${escapeHtml(fundraisingEditorValue(source, "notes"))}</textarea></label>
        </div>
      </section>
      ${renderFundraisingEditorFooter(item)}
    </form>
  `;
}

function renderFundraisingCampaignEditorMain(item = null) {
  const source = item?.source || {};
  return `
    <form class="schedule-inline-form crm-profile-editor-main" id="fundraising-record-editor-form" data-fundraising-record-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Campaign Details</h3><button class="edit-button" data-close-fundraising-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields fundraising-editor-fields">
          <label><span>Campaign Type</span><input name="campaignType" value="${escapeHtml(fundraisingEditorValue(source, "campaignType"))}"></label>
          <label><span>Amount Raised</span><input name="raisedAmount" type="number" min="0" step="0.01" value="${escapeHtml(fundraisingEditorValue(source, "raisedAmount"))}"></label>
          <label class="is-full-width"><span>Audience</span><textarea name="audience" rows="2">${escapeHtml(fundraisingEditorValue(source, "audience"))}</textarea></label>
          <label class="is-full-width"><span>Channels</span><textarea name="channels" rows="2">${escapeHtml(fundraisingEditorValue(source, "channels"))}</textarea></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="3">${escapeHtml(fundraisingEditorValue(source, "notes"))}</textarea></label>
        </div>
      </section>
      ${renderFundraisingEditorFooter(item)}
    </form>
  `;
}

function renderFundraisingEarnedIncomeEditorMain(item = null) {
  const source = item?.source || {};
  return `
    <form class="schedule-inline-form crm-profile-editor-main" id="fundraising-record-editor-form" data-fundraising-record-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Income Details</h3><button class="edit-button" data-close-fundraising-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields fundraising-editor-fields">
          <label><span>Source</span><input name="source" value="${escapeHtml(fundraisingEditorValue(source, "source"))}"></label>
          <label><span>Service Type</span><input name="serviceType" value="${escapeHtml(fundraisingEditorValue(source, "serviceType"))}"></label>
          <label><span>Period Start</span><input name="periodStart" type="date" value="${escapeHtml(fundraisingEditorValue(source, "periodStart"))}"></label>
          <label><span>Period End</span><input name="periodEnd" type="date" value="${escapeHtml(fundraisingEditorValue(source, "periodEnd"))}"></label>
          <label><span>Payment Date</span><input name="paymentDate" type="date" value="${escapeHtml(fundraisingEditorValue(source, "paymentDate"))}"></label>
          <label><span>Reporting Frequency</span><input name="reportingFrequency" value="${escapeHtml(fundraisingEditorValue(source, "reportingFrequency"))}"></label>
          <label class="is-full-width"><span>Use of Funds</span><textarea name="useOfFunds" rows="2">${escapeHtml(fundraisingEditorValue(source, "useOfFunds"))}</textarea></label>
          <label class="is-full-width"><span>Required Metrics</span><textarea name="requiredMetrics" rows="2">${escapeHtml(fundraisingEditorValue(source, "requiredMetrics"))}</textarea></label>
          <label class="is-full-width"><span>Risk or Follow-up</span><textarea name="risk" rows="2">${escapeHtml(fundraisingEditorValue(source, "risk"))}</textarea></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="3">${escapeHtml(fundraisingEditorValue(source, "notes"))}</textarea></label>
        </div>
      </section>
      ${renderFundraisingEditorFooter(item)}
    </form>
  `;
}

function renderFundraisingEditorSide(item = null) {
  const resourceLabel = fundraisingResourceLabel();
  if (resourceLabel === "Donors") return renderFundraisingDonorEditorSide(item);
  if (resourceLabel === "Gifts") return renderFundraisingGiftEditorSide(item);
  if (resourceLabel === "Campaigns") return renderFundraisingCampaignEditorSide(item);
  if (resourceLabel === "Earned Income") return renderFundraisingEarnedIncomeEditorSide(item);
  return renderFundraisingGrantEditorSide(item);
}

function renderFundraisingEditorMain(item = null) {
  const resourceLabel = fundraisingResourceLabel();
  if (resourceLabel === "Donors") return renderFundraisingDonorEditorMain(item);
  if (resourceLabel === "Gifts") return renderFundraisingGiftEditorMain(item);
  if (resourceLabel === "Campaigns") return renderFundraisingCampaignEditorMain(item);
  if (resourceLabel === "Earned Income") return renderFundraisingEarnedIncomeEditorMain(item);
  return renderFundraisingGrantEditorMain(item);
}

function setFundraisingPanelMode(mode = "detail") {
  fundraisingPanelMode = mode === "editor" ? "editor" : "detail";
  const editing = fundraisingPanelMode === "editor";
  const tabs = document.querySelector("[data-fundraising-tabs]");
  const content = document.querySelector("[data-fundraising-detail-content]");
  const editor = document.querySelector("[data-fundraising-editor]");
  const sideDetail = document.querySelector("[data-fundraising-side-detail]");
  const sideEditor = document.querySelector("[data-fundraising-side-editor]");
  tabs?.querySelectorAll("button").forEach((button) => { button.disabled = editing && fundraisingSubpage !== "Grants"; });
  if (content) content.hidden = editing;
  if (editor) editor.hidden = !editing;
  if (sideDetail) sideDetail.hidden = editing;
  if (sideEditor) sideEditor.hidden = !editing;
}

function setFundraisingActionStatus(message = "", state = "") {
  document.querySelectorAll("[data-fundraising-action-status], [data-fundraising-editor-status]").forEach((status) => {
    status.textContent = message;
    status.dataset.state = state;
  });
}

function openFundraisingEditor(item = null) {
  if (fundraisingActionBusy) return;
  const editor = document.querySelector("[data-fundraising-editor]");
  const sideEditor = document.querySelector("[data-fundraising-side-editor]");
  if (!editor || !sideEditor) return;

  fundraisingEditingRecordId = item?.id || "";
  fundraisingDeletePendingId = "";
  fundraisingDetailTab = "funding";
  editor.classList.add("is-profile-editor");
  editor.innerHTML = renderFundraisingEditorMain(item);
  sideEditor.innerHTML = renderFundraisingEditorSide(item);
  setFundraisingActionStatus("");
  setFundraisingPanelMode("editor");
  setFundraisingDetailTab(fundraisingDetailTab);
  (sideEditor.querySelector("input, select, textarea") || editor.querySelector("input, select, textarea"))?.focus();
}

function openLinkedGiftEditor({ donorId = "", campaignId = "" } = {}) {
  fundraisingGivingView = "Gifts";
  setFundraisingSubpage("Giving");
  openFundraisingEditor();
  const donorSelect = document.querySelector('[name="donorId"][form="fundraising-record-editor-form"]');
  const campaignSelect = document.querySelector('[name="campaignId"][form="fundraising-record-editor-form"]');
  if (donorSelect && donorId) donorSelect.value = donorId;
  if (campaignSelect && campaignId) campaignSelect.value = campaignId;
}

function openLinkedGrantRevenueEditor(grantId = "") {
  const grant = fundraisingGrantItems.find((item) => item.id === grantId);
  setFundraisingSubpage("Financial Activity");
  setFundraisingFinancialView("Ledger");
  openFinancialActivityEditor("");
  const form = document.querySelector("[data-financial-activity-form]");
  if (!form) return;
  if (form.elements.activityType) form.elements.activityType.value = "Grant Revenue";
  if (form.elements.grantId) form.elements.grantId.value = grantId;
  if (form.elements.sourceName && grant) form.elements.sourceName.value = grant.foundation === "-" ? grant.title : grant.foundation;
}

function closeFundraisingEditor() {
  if (fundraisingActionBusy) return;
  const editor = document.querySelector("[data-fundraising-editor]");
  const sideEditor = document.querySelector("[data-fundraising-side-editor]");
  editor?.replaceChildren();
  editor?.classList.remove("is-profile-editor");
  sideEditor?.replaceChildren();
  fundraisingEditingRecordId = "";
  fundraisingDeletePendingId = "";
  setFundraisingPanelMode("detail");
  updateDetail(modules.fundraising, selectedItemId);
}

function refreshFundraisingAccountControl() {
  if (currentModuleId() !== "fundraising") return;
  const account = document.querySelector(".account");
  const accountName = document.querySelector("[data-account-name]");
  if (!account || !accountName) return;

  accountName.textContent = fundraisingCurrentUser ? staffAccountDisplayName(fundraisingCurrentUser) : "Sign in";
  configureAccountSignInControl(account, Boolean(fundraisingCurrentUser), "Sign in to load Finance records");
}

function updateFundraisingActionAvailability(item = fundraisingSelectedItem()) {
  document.querySelectorAll("[data-fundraising-action='edit'], [data-fundraising-action='delete'], [data-fundraising-edit], [data-fundraising-status-select], [data-fundraising-delete-editor]").forEach((control) => {
    control.disabled = fundraisingActionBusy || !item;
  });
  document.querySelectorAll("[data-fundraising-new], [data-fundraising-action^='new-'], [data-fundraising-search-toggle], [data-fundraising-search-input]").forEach((control) => {
    control.disabled = fundraisingActionBusy;
  });
  document.querySelectorAll("[data-fundraising-action='delete'], [data-fundraising-delete-editor]").forEach((deleteButton) => {
    deleteButton.textContent = fundraisingDeletePendingId === item?.id ? "Confirm Delete" : `Delete ${fundraisingResourceDefinition().title}`;
  });
}

function setFundraisingActionBusy(busy) {
  fundraisingActionBusy = busy;
  updateFundraisingActionAvailability();
  document.querySelectorAll("[data-fundraising-editor], [data-fundraising-side-editor]").forEach((editor) => {
    editor.setAttribute("aria-busy", String(busy));
    editor.querySelectorAll("button, input, select, textarea").forEach((control) => {
      control.disabled = busy;
    });
  });
  document.querySelectorAll("[data-fundraising-workspace-panels-host] button, [data-fundraising-workspace-panels-host] input, [data-fundraising-workspace-panels-host] select, [data-fundraising-workspace-panels-host] textarea").forEach((control) => {
    control.disabled = busy;
  });
  document.querySelectorAll("[data-financial-activity-workspace] button, [data-financial-activity-workspace] input, [data-financial-activity-workspace] select, [data-financial-activity-workspace] textarea").forEach((control) => {
    control.disabled = busy;
  });
}

async function fundraisingAuthedFetch(path, options = {}) {
  if (!fundraisingCurrentUser) {
    throw new Error("Sign in before changing a fundraising record.");
  }
  const token = await fundraisingCurrentUser.getIdToken();
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
    throw new Error(result.error || `The fundraising service returned ${response.status}.`);
  }
  return response.json().catch(() => ({}));
}

async function saveFundraisingRecord(form) {
  if (fundraisingActionBusy) return;
  const resource = fundraisingResourceDefinition();
  const resourceLabel = fundraisingResourceLabel();
  const item = fundraisingCurrentItems().find((candidate) => candidate.id === fundraisingEditingRecordId) || null;
  const values = Object.fromEntries(new FormData(form).entries());
  if (resourceLabel === "Grants") {
    values.pastGrantReceived = Boolean(form.elements.pastGrantReceived?.checked);
  }
  if (resourceLabel === "Donors") {
    const campaignSelect = form.elements.campaignId;
    values.campaignName = campaignSelect?.selectedOptions?.[0]?.value
      ? campaignSelect.selectedOptions[0].textContent
      : "";
  }
  if (resourceLabel === "Gifts") {
    const donorSelect = form.elements.donorId;
    const campaignSelect = form.elements.campaignId;
    values.recurring = Boolean(form.elements.recurring?.checked);
    values.donorName = donorSelect?.selectedOptions?.[0]?.value
      ? donorSelect.selectedOptions[0].textContent
      : "";
    values.campaignName = campaignSelect?.selectedOptions?.[0]?.value
      ? campaignSelect.selectedOptions[0].textContent
      : "";
  }
  const payload = resource.payload({ ...(item?.source || {}), ...values }, item?.source || {});
  if (resourceLabel === "Grants" && !payload.foundationName && !payload.grantName) {
    setFundraisingActionStatus("Enter a foundation or grant name.", "error");
    form.elements.foundationName?.focus();
    return;
  }
  if (resourceLabel === "Gifts" && !payload.donorId) {
    setFundraisingActionStatus("Choose a donor for this gift.", "error");
    document.querySelector('[name="donorId"][form="fundraising-record-editor-form"]')?.focus();
    return;
  }
  if (resourceLabel === "Gifts" && !/^\d{4}-\d{2}-\d{2}$/.test(payload.giftDate)) {
    setFundraisingActionStatus("Enter the gift date.", "error");
    document.querySelector('[name="giftDate"][form="fundraising-record-editor-form"]')?.focus();
    return;
  }
  if (resourceLabel === "Gifts" && !(payload.amount > 0)) {
    setFundraisingActionStatus("Enter a gift amount greater than zero.", "error");
    document.querySelector('[name="amount"][form="fundraising-record-editor-form"]')?.focus();
    return;
  }
  if (!["Grants", "Gifts"].includes(resourceLabel) && !payload.name) {
    setFundraisingActionStatus(`Enter a ${resource.singular} name.`, "error");
    document.querySelector('[name="name"][form="fundraising-record-editor-form"]')?.focus();
    return;
  }

  setFundraisingActionBusy(true);
  setFundraisingActionStatus("");
  try {
    const result = await fundraisingAuthedFetch(item ? `${resource.endpoint}/${encodeURIComponent(item.id)}` : resource.endpoint, {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    selectedItemId = result[resource.itemKey]?.id || item?.id || selectedItemId;
    fundraisingEditingRecordId = "";
    await loadFundraisingData(fundraisingCurrentUser, selectedItemId);
    setFundraisingPanelMode("detail");
  } catch (error) {
    console.error(error);
    setFundraisingActionStatus(error.message || `Could not save the ${resource.singular}.`, "error");
  } finally {
    setFundraisingActionBusy(false);
  }
}

async function saveFundraisingStatus(item, status, control) {
  if (!item || fundraisingActionBusy || status === item.status) return;
  const resource = fundraisingResourceDefinition();
  const previousStatus = item.status;
  const payload = resource.payload({ ...item.source, status }, item.source);
  setFundraisingActionBusy(true);
  setFundraisingActionStatus("");
  try {
    await fundraisingAuthedFetch(`${resource.endpoint}/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    await loadFundraisingData(fundraisingCurrentUser, item.id);
  } catch (error) {
    console.error(error);
    if (control) control.value = previousStatus;
    setFundraisingActionStatus(error.message || `Could not update the ${resource.singular} status.`, "error");
  } finally {
    setFundraisingActionBusy(false);
  }
}

async function deleteFundraisingRecord(item) {
  if (!item || fundraisingActionBusy) return;
  const resource = fundraisingResourceDefinition();
  if (grantDeleteDecision(fundraisingDeletePendingId, item.id) === "confirm") {
    fundraisingDeletePendingId = item.id;
    setFundraisingActionStatus(`Click Confirm Delete to permanently remove this ${resource.singular}.`);
    updateFundraisingActionAvailability(item);
    return;
  }

  setFundraisingActionBusy(true);
  setFundraisingActionStatus("");
  try {
    await fundraisingAuthedFetch(`${resource.endpoint}/${encodeURIComponent(item.id)}`, { method: "DELETE" });
    selectedItemId = "";
    fundraisingEditingRecordId = "";
    fundraisingDeletePendingId = "";
    await loadFundraisingData(fundraisingCurrentUser);
    setFundraisingPanelMode("detail");
  } catch (error) {
    console.error(error);
    fundraisingDeletePendingId = "";
    setFundraisingActionStatus(error.message || `Could not delete the ${resource.singular}.`, "error");
    updateFundraisingActionAvailability(item);
  } finally {
    setFundraisingActionBusy(false);
  }
}

function financialActivityVisibleItems() {
  return fundraisingFinancialActivityItems.filter((item) => financialActivityMatches(
    item,
    fundraisingFinancialSearchQuery,
    fundraisingFinancialTypeFilter
  ));
}

function financialActivityLinkedRecord(item = {}) {
  if (item.sourceKind === "hrsn" && item.sourceRecordId) {
    return { section: "HRSN Billing", id: item.sourceRecordId, label: item.externalTransactionId || "Billing Record" };
  }
  if (item.grantId) return { section: "Grants", id: item.grantId, label: item.grantName || "Grant" };
  if (item.campaignId) return { section: "Giving", view: "Campaigns", id: item.campaignId, label: item.campaignName || "Campaign" };
  if (item.donorId) return { section: "Giving", view: "Donors", id: item.donorId, label: item.donorName || "Donor" };
  return null;
}

function financialActivitySourceMix(totals = {}) {
  const byType = totals.byType || {};
  const grants = byType["Grant Revenue"] || 0;
  const hrsn = byType["HRSN Revenue"] || 0;
  const workbooks = byType["Workbook Sale"] || 0;
  const other = Math.max(totals.total - grants - hrsn - workbooks, 0);
  return [
    ["Grants", grants],
    ["HRSN", hrsn],
    ["Workbook Sales", workbooks],
    ["Other", other]
  ];
}

function renderFinancialActivityViewTabs() {
  return `
    <div class="financial-activity-view-tabs" role="tablist" aria-label="Financial Activity views">
      ${["Dashboard", "Ledger"].map((view) => `
        <button
          class="${fundraisingFinancialView === view ? "is-active" : ""}"
          data-financial-view="${view}"
          type="button"
          role="tab"
          aria-selected="${fundraisingFinancialView === view}"
        >${view}</button>
      `).join("")}
    </div>
  `;
}

function renderFinancialActivitySourceCell(item = {}) {
  const linked = financialActivityLinkedRecord(item);
  if (!linked) return `<span>-</span>`;
  return `
    <button
      class="financial-activity-source-link"
      data-financial-source-section="${escapeHtml(linked.section)}"
      data-financial-source-id="${escapeHtml(linked.id)}"
      ${linked.view ? `data-financial-source-view="${escapeHtml(linked.view)}"` : ""}
      type="button"
    >${escapeHtml(linked.label)}</button>
  `;
}

function renderFinancialActivityRows(items = [], { recent = false } = {}) {
  if (!items.length) {
    return `<p class="financial-activity-empty">${escapeHtml(fundraisingDataMessage || "No financial activity has been recorded yet.")}</p>`;
  }
  return `
    <div class="financial-activity-table ${recent ? "is-recent" : ""}" role="table" aria-label="Financial activity ledger">
      <div class="financial-activity-table-head" role="row">
        <span role="columnheader">Date</span>
        <span role="columnheader">Type</span>
        <span role="columnheader">Source / Payor</span>
        <span role="columnheader">Linked Record</span>
        <span role="columnheader">Amount</span>
        ${recent ? "" : `<span role="columnheader" class="financial-activity-actions-heading">Actions</span>`}
      </div>
      ${items.map((item) => `
        <div class="financial-activity-table-row" role="row" data-financial-activity-id="${escapeHtml(item.id)}">
          <span role="cell" data-label="Date">${escapeHtml(item.transactionDate)}</span>
          <span role="cell" data-label="Type">${escapeHtml(item.activityType)}</span>
          <span role="cell" data-label="Source / Payor">${escapeHtml(item.sourceName)}</span>
          <span role="cell" data-label="Linked Record">${renderFinancialActivitySourceCell(item)}</span>
          <strong role="cell" data-label="Amount">${escapeHtml(item.amount)}</strong>
          ${recent ? "" : item.sourceKind === "hrsn" ? `
            <span class="financial-activity-row-actions" role="cell" data-label="Actions">
              <span>Managed in HRSN Billing</span>
            </span>
          ` : `
            <span class="financial-activity-row-actions" role="cell" data-label="Actions">
              <button data-financial-edit="${escapeHtml(item.id)}" type="button">Edit</button>
              <button class="is-danger" data-financial-delete="${escapeHtml(item.id)}" type="button">
                ${fundraisingFinancialDeletePendingId === item.id ? "Confirm Delete" : "Delete"}
              </button>
            </span>
          `}
        </div>
      `).join("")}
    </div>
  `;
}

function renderFinancialActivityDashboard() {
  const period = financialActivityPeriod(new Date());
  const yearTotals = financialActivityTotals(fundraisingFinancialActivityItems, period.yearStart, period.yearEnd);
  const quarterTotals = financialActivityTotals(fundraisingFinancialActivityItems, period.quarterStart, period.quarterEnd);
  const mix = financialActivitySourceMix(yearTotals);
  const largestMixValue = Math.max(...mix.map(([, amount]) => amount), 1);
  const recentItems = fundraisingFinancialActivityItems.slice(0, 6);

  return `
    <div class="financial-activity-dashboard" data-financial-dashboard>
      <section class="financial-activity-overview" aria-labelledby="financial-overview-title">
        <header class="financial-activity-section-header">
          <div>
            <h2 id="financial-overview-title">Revenue Overview</h2>
            <p>${escapeHtml(period.yearStart.slice(0, 4))} year to date</p>
          </div>
          <button class="financial-activity-text-button" data-financial-view="Ledger" type="button">View Ledger</button>
        </header>
        <div class="financial-activity-kpis">
          <div><span>Revenue YTD</span><strong>${escapeHtml(formatGrantMoney(yearTotals.total, "$0"))}</strong></div>
          <div><span>This Quarter</span><strong>${escapeHtml(formatGrantMoney(quarterTotals.total, "$0"))}</strong></div>
          <div><span>Transactions YTD</span><strong>${yearTotals.count}</strong></div>
          <div><span>Grant Revenue YTD</span><strong>${escapeHtml(formatGrantMoney(yearTotals.byType["Grant Revenue"] || 0, "$0"))}</strong></div>
        </div>
        <div class="financial-activity-mix" aria-label="Year-to-date revenue mix">
          ${mix.map(([label, amount]) => `
            <div class="financial-activity-mix-row">
              <span>${escapeHtml(label)}</span>
              <span class="financial-activity-mix-track"><span style="--financial-mix-width: ${Math.round((amount / largestMixValue) * 100)}%;"></span></span>
              <strong>${escapeHtml(formatGrantMoney(amount, "$0"))}</strong>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="financial-activity-recent" aria-labelledby="financial-recent-title">
        <header class="financial-activity-section-header">
          <div>
            <h2 id="financial-recent-title">Recent Activity</h2>
            <p>Most recently dated revenue</p>
          </div>
          <button class="financial-activity-text-button" data-financial-add type="button">Add Revenue</button>
        </header>
        ${renderFinancialActivityRows(recentItems, { recent: true })}
      </section>
    </div>
  `;
}

function renderFinancialActivityLedger() {
  const filterOptions = ["All Revenue", "HRSN Revenue", ...financialActivityTypeOptions, ...financialGiftActivityTypeOptions];
  return `
    <section class="financial-activity-ledger" aria-labelledby="financial-ledger-title">
      <header class="financial-activity-section-header financial-activity-ledger-header">
        <div>
          <h2 id="financial-ledger-title">Revenue Ledger</h2>
          <p>${fundraisingFinancialActivityItems.length} ${fundraisingFinancialActivityItems.length === 1 ? "transaction" : "transactions"}</p>
        </div>
        <div class="financial-activity-ledger-tools">
          <input
            data-financial-search
            type="search"
            value="${escapeHtml(fundraisingFinancialSearchQuery)}"
            placeholder="Search revenue"
            aria-label="Search revenue"
          >
          <select data-financial-type-filter aria-label="Filter revenue type">
            ${crmSelectOptions(filterOptions, fundraisingFinancialTypeFilter)}
          </select>
          <button class="financial-activity-add-button" data-financial-add type="button">${icons.plus}Add Revenue</button>
        </div>
      </header>
      <p class="schedule-action-status financial-activity-status" data-financial-activity-status role="status" aria-live="polite"></p>
      ${renderFinancialActivityRows(financialActivityVisibleItems())}
    </section>
  `;
}

function renderFinancialActivityEditor() {
  if (fundraisingFinancialEditorId === null) return "";
  const item = fundraisingFinancialEditorId
    ? fundraisingFinancialActivityItems.find((candidate) => candidate.id === fundraisingFinancialEditorId) || null
    : null;
  const sourceKind = item?.sourceKind || "income";
  const legacy = sourceKind === "legacy";
  const gift = sourceKind === "gift";
  const typeOptions = gift ? financialGiftActivityTypeOptions : financialActivityTypeOptions;
  const selectedType = item?.activityType || "Grant Revenue";
  const selectedGrantId = item?.grantId || "";
  const selectedCampaignId = item?.campaignId || "";
  const selectedDonorId = item?.donorId || "";

  return `
    <section class="financial-activity-editor" aria-labelledby="financial-editor-title">
      <header class="financial-activity-section-header">
        <div>
          <h2 id="financial-editor-title">${item ? `Edit ${gift ? "Gift" : "Revenue"}` : "Add Revenue"}</h2>
          <p>${legacy ? "Imported from the previous Operations revenue log" : gift ? "Linked donor gift" : "Revenue received"}</p>
        </div>
        <button class="financial-activity-text-button" data-financial-cancel type="button">Cancel</button>
      </header>
      <form class="financial-activity-form" data-financial-activity-form>
        ${legacy ? `<input type="hidden" name="activityType" value="Grant Revenue">` : ""}
        <label><span>Revenue Type</span><select name="activityType" ${legacy ? "disabled" : ""}>${crmSelectOptions(typeOptions, selectedType)}</select></label>
        <label><span>Date</span><input name="transactionDate" type="date" required value="${escapeHtml(item?.transactionDateValue || scheduleDateKey(new Date()))}"></label>
        <label><span>Amount</span><input name="amount" type="number" min="0.01" step="0.01" required value="${escapeHtml(item?.amountValue ?? "")}"></label>
        ${gift ? `
          <label><span>Donor</span><select name="donorId" required>
            <option value="">Choose donor</option>
            ${fundraisingDonorItems.map((donor) => `<option value="${escapeHtml(donor.id)}" ${donor.id === selectedDonorId ? "selected" : ""}>${escapeHtml(donor.title)}</option>`).join("")}
          </select></label>
        ` : `<label><span>Source / Payor</span><input name="sourceName" value="${escapeHtml(item?.sourceName === "Legacy Operations entry" ? "" : item?.sourceName || "")}" placeholder="Foundation, payer, or sales source"></label>`}
        ${gift ? "" : `
          <label><span>Grant</span><select name="grantId">
            <option value="">No linked grant</option>
            ${fundraisingGrantItems.map((grant) => `<option value="${escapeHtml(grant.id)}" ${grant.id === selectedGrantId ? "selected" : ""}>${escapeHtml(grant.title)}</option>`).join("")}
          </select></label>
        `}
        <label><span>Campaign</span><select name="campaignId">
          <option value="">No linked campaign</option>
          ${fundraisingCampaignItems.map((campaign) => `<option value="${escapeHtml(campaign.id)}" ${campaign.id === selectedCampaignId ? "selected" : ""}>${escapeHtml(campaign.title)}</option>`).join("")}
        </select></label>
        ${gift ? `<label><span>Payment Method</span><select name="paymentMethod"><option value="">Choose method</option>${crmSelectOptions(giftPaymentMethodOptions, item?.paymentMethod || "")}</select></label>` : ""}
        <label><span>External Transaction ID</span><input name="externalTransactionId" value="${escapeHtml(item?.externalTransactionId || "")}"></label>
        <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="3">${escapeHtml(item?.notes || "")}</textarea></label>
        <p class="schedule-action-status financial-activity-status is-full-width" data-financial-activity-status role="status" aria-live="polite"></p>
        <div class="financial-activity-form-actions is-full-width">
          <button data-financial-cancel type="button">Cancel</button>
          <button type="submit">${item ? "Save Changes" : "Save Revenue"}</button>
        </div>
      </form>
    </section>
  `;
}

function renderFinancialActivityWorkspace() {
  return `
    ${renderFinancialActivityViewTabs()}
    ${fundraisingFinancialEditorId !== null ? renderFinancialActivityEditor() : ""}
    ${fundraisingFinancialView === "Ledger" ? renderFinancialActivityLedger() : renderFinancialActivityDashboard()}
  `;
}

function refreshFinancialActivityWorkspace() {
  const host = document.querySelector("[data-financial-activity-workspace]");
  if (host) host.innerHTML = renderFinancialActivityWorkspace();
}

function setFundraisingFinancialView(view = "Dashboard") {
  if (!['Dashboard', 'Ledger'].includes(view) || fundraisingActionBusy) return;
  fundraisingFinancialView = view;
  fundraisingFinancialDeletePendingId = "";
  const url = new URL(window.location.href);
  url.searchParams.set("section", "Financial Activity");
  url.searchParams.set("view", view);
  history.replaceState({}, "", url);
  refreshFinancialActivityWorkspace();
}

function setFinancialActivityStatus(message = "", state = "") {
  document.querySelectorAll("[data-financial-activity-status]").forEach((status) => {
    status.textContent = message;
    status.dataset.state = state;
  });
}

function openFinancialActivityEditor(activityId = "") {
  if (fundraisingActionBusy) return;
  fundraisingFinancialEditorId = activityId;
  fundraisingFinancialDeletePendingId = "";
  refreshFinancialActivityWorkspace();
  document.querySelector("[data-financial-activity-form] input, [data-financial-activity-form] select")?.focus();
}

function closeFinancialActivityEditor() {
  if (fundraisingActionBusy) return;
  fundraisingFinancialEditorId = null;
  refreshFinancialActivityWorkspace();
}

async function saveFinancialActivity(form) {
  if (fundraisingActionBusy) return;
  const item = fundraisingFinancialEditorId
    ? fundraisingFinancialActivityItems.find((candidate) => candidate.id === fundraisingFinancialEditorId) || null
    : null;
  const values = Object.fromEntries(new FormData(form).entries());
  const grantSelect = form.elements.grantId;
  const campaignSelect = form.elements.campaignId;
  const donorSelect = form.elements.donorId;
  values.grantName = grantSelect?.value ? grantSelect.selectedOptions[0]?.textContent || "" : "";
  values.campaignName = campaignSelect?.value ? campaignSelect.selectedOptions[0]?.textContent || "" : "";
  values.donorName = donorSelect?.value ? donorSelect.selectedOptions[0]?.textContent || "" : "";
  if (item?.sourceKind === "gift") values.sourceName = values.donorName;
  if (!values.sourceName) values.sourceName = values.grantName || values.campaignName || values.activityType;
  const payload = financialActivityPayload(values);

  if (!payload.transactionDate) {
    setFinancialActivityStatus("Enter the transaction date.", "error");
    form.elements.transactionDate?.focus();
    return;
  }
  if (!(payload.amount > 0)) {
    setFinancialActivityStatus("Enter an amount greater than zero.", "error");
    form.elements.amount?.focus();
    return;
  }
  if (!payload.activityType) {
    setFinancialActivityStatus("Choose a revenue type.", "error");
    form.elements.activityType?.focus();
    return;
  }

  setFundraisingActionBusy(true);
  setFinancialActivityStatus("");
  try {
    await fundraisingAuthedFetch(item ? `/api/financial-activity/${encodeURIComponent(item.id)}` : "/api/financial-activity", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    fundraisingFinancialEditorId = null;
    fundraisingFinancialDeletePendingId = "";
    fundraisingFinancialView = "Ledger";
    await loadFundraisingData(fundraisingCurrentUser);
  } catch (error) {
    console.error(error);
    setFinancialActivityStatus(error.message || "Could not save the financial activity.", "error");
  } finally {
    setFundraisingActionBusy(false);
  }
}

async function deleteFinancialActivity(activityId = "") {
  if (!activityId || fundraisingActionBusy) return;
  if (fundraisingFinancialDeletePendingId !== activityId) {
    fundraisingFinancialDeletePendingId = activityId;
    refreshFinancialActivityWorkspace();
    setFinancialActivityStatus("Click Confirm Delete to permanently remove this transaction.");
    return;
  }

  setFundraisingActionBusy(true);
  setFinancialActivityStatus("");
  try {
    await fundraisingAuthedFetch(`/api/financial-activity/${encodeURIComponent(activityId)}`, { method: "DELETE" });
    fundraisingFinancialDeletePendingId = "";
    fundraisingFinancialEditorId = null;
    await loadFundraisingData(fundraisingCurrentUser);
  } catch (error) {
    console.error(error);
    fundraisingFinancialDeletePendingId = "";
    refreshFinancialActivityWorkspace();
    setFinancialActivityStatus(error.message || "Could not delete the financial activity.", "error");
  } finally {
    setFundraisingActionBusy(false);
  }
}

function renderMarketingDashboardMetrics(items = []) {
  return `
    <div class="marketing-dashboard-metrics">
      ${items.map(([value, label]) => `
        <div>
          <strong>${escapeHtml(value)}</strong>
          <span>${escapeHtml(label)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderMarketingDashboardCampaigns(items = [], mode = "upcoming") {
  if (!items.length) {
    return `<p class="marketing-dashboard-empty">${escapeHtml(marketingDataMessage || (mode === "results" ? "No campaign results have been recorded yet." : "No active campaigns have been added yet."))}</p>`;
  }

  return `
    <div class="marketing-dashboard-campaigns">
      ${items.map((item) => `
        <button data-marketing-dashboard-campaign="${escapeHtml(item.id)}" type="button">
          <span>
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(mode === "results" ? `${item.channel} | ${item.openRate} open | ${item.clickRate} click` : item.subtitle)}</small>
          </span>
          <span class="status-pill">${escapeHtml(item.status)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderMarketingDashboard() {
  const dashboard = marketingDashboardData(marketingCampaignItems, marketingSubscriberItems);
  const integrationReady = Boolean(marketingMailerLiteStatus.connected);
  return `
    <div class="marketing-dashboard-grid">
      <section class="marketing-dashboard-section marketing-dashboard-integration is-wide">
        <div>
          <span class="marketing-dashboard-eyebrow">Delivery Connection</span>
          <strong>MailerLite</strong>
          <small>${escapeHtml(marketingMailerLiteStatus.connectionMode || "Not connected")}. Campaign sending remains outside the CRM.</small>
        </div>
        <span class="status-pill" data-state="${integrationReady ? "ready" : "inactive"}">${integrationReady ? "Connected" : "Not Connected"}</span>
      </section>

      <section class="marketing-dashboard-section">
        <header>
          <div><h2>Campaign Performance</h2><p>Combined results recorded across completed campaigns.</p></div>
        </header>
        ${renderMarketingDashboardMetrics(dashboard.performance)}
      </section>

      <section class="marketing-dashboard-section">
        <header>
          <div><h2>Campaign Pipeline</h2><p>Current work from draft through delivery.</p></div>
          <button data-marketing-dashboard-section="Campaigns" type="button">View Campaigns</button>
        </header>
        ${renderMarketingDashboardMetrics(dashboard.pipeline)}
      </section>

      <section class="marketing-dashboard-section">
        <header>
          <div><h2>Active Campaigns</h2><p>Campaigns still being planned, reviewed, or scheduled.</p></div>
          <button data-marketing-dashboard-section="Campaigns" type="button">View All</button>
        </header>
        ${renderMarketingDashboardCampaigns(dashboard.upcoming)}
      </section>

      <section class="marketing-dashboard-section">
        <header>
          <div><h2>Recent Results</h2><p>Email and advertising results already entered in the CRM.</p></div>
        </header>
        ${renderMarketingDashboardCampaigns(dashboard.recentResults, "results")}
      </section>

      <section class="marketing-dashboard-section">
        <header>
          <div><h2>Contact Readiness</h2><p>Who can safely be included in an email audience.</p></div>
          <button data-marketing-dashboard-section="Contacts" type="button">View Contacts</button>
        </header>
        ${renderMarketingDashboardMetrics(dashboard.audienceReadiness)}
      </section>

      <section class="marketing-dashboard-section">
        <header>
          <div><h2>Audience Groups</h2><p>Editable interest groups used to build campaign audiences.</p></div>
        </header>
        <div class="marketing-dashboard-groups">
          ${dashboard.audienceGroups.map((group) => `
            <div><span>${escapeHtml(group.name)}</span><strong>${group.count}</strong></div>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function selectedMarketingMessageTemplate() {
  const visibleTemplates = marketingMessageTemplates.filter((template) => template.language === marketingTemplateLanguage);
  return visibleTemplates.find((template) => template.id === marketingSelectedTemplateId)
    || visibleTemplates[0]
    || null;
}

function marketingTemplateCanManage() {
  return ["Admin", "Manager"].includes(staffAccessProfile?.accessLevelId || staffAccessProfile?.accessLevelName || "");
}

function marketingTemplatePreviewText(value = "") {
  const replacements = {
    "[Caregiver First Name]": "Maria",
    "[Referring Organization]": "Physicians' Medical Center",
    "[Private Enrollment Forms Link]": "hub.snackprogram.org/forms/••••••",
    "[Child or Children First Names]": "Alex and Sofia",
    "[Child First Name]": "Alex",
    "[Weekday, Month Day, Year]": "Thursday, August 20, 2026",
    "[Weekday, Month Day]": "Thursday, August 20",
    "[Short Date]": "8/20",
    "[Month Day]": "August 20",
    "[Time]": "3:30 PM",
    "[Start Time]": "5:30 PM",
    "[End Time]": "7:30 PM",
    "[Duration]": "30",
    "[Response Window]": "one week",
    "[Next Step or Appointment Details]": "schedule an enrollment appointment",
    "[Private Management Link]": "hub.snackprogram.org/manage/••••••",
    "[Management Link]": "hub.snackprogram.org/manage/••••••",
    "[Private Offer Link]": "hub.snackprogram.org/waitlist/••••••",
    "[CRM Record Link]": "Open family record",
    "[Class Name]": "Kids Cooking + Nutrition Class",
    "[Deadline]": "Wednesday at 5:30 PM",
    "[Email or Text Provider]": "Email provider",
    "[Template Name]": "Appointment Reminder",
    "[Date and Time]": "Aug 20, 2026 at 9:14 AM",
    "[Safe Provider Error Summary]": "Recipient address rejected"
  };
  return Object.entries(replacements).reduce((text, [placeholder, sample]) => text.replaceAll(placeholder, sample), String(value || ""));
}

function renderMarketingTemplateLine(line = "", { boldLabels = false } = {}) {
  const escaped = escapeHtml(line);
  if (!boldLabels) return escaped;
  return escaped.replace(
    /^(Children|Date|Time|Location|Class location|Important arrival directions|Parking map|Service|Message Type|Family Record|Attempted At|Reason|Niños|Fecha|Hora|Ubicación|Ubicación de la clase|Instrucciones importantes para llegar|Mapa del estacionamiento):\s*/i,
    "<strong>$1:</strong> "
  );
}

function renderMarketingTemplateBodyPreview(body = "", options = {}) {
  return marketingTemplatePreviewText(body).split(/\n{2,}/).map((paragraph) => (
    `<p>${paragraph.split("\n").map((line) => renderMarketingTemplateLine(line, options)).join("<br>")}</p>`
  )).join("");
}

function renderMarketingTemplateHistory(template) {
  const versions = Array.isArray(template?.versions) ? [...template.versions].reverse() : [];
  if (!versions.length) return `<p class="marketing-template-empty">No approved versions yet.</p>`;
  return `
    <ol class="marketing-template-history-list">
      ${versions.map((version) => `
        <li>
          <strong>Version ${escapeHtml(version.version)}</strong>
          <span>Approved ${escapeHtml(formatMarketingDateTime(version.approvedAt))}</span>
          <small>${escapeHtml(version.approvedBy || "SNACK staff")}</small>
        </li>
      `).join("")}
    </ol>
  `;
}

function renderMarketingTemplatesWorkspace() {
  const selected = selectedMarketingMessageTemplate();
  const visibleTemplates = marketingMessageTemplates.filter((template) => template.language === marketingTemplateLanguage);
  const canManage = marketingTemplateCanManage();
  if (!selected) {
    return `<div class="marketing-template-loading"><h2>Templates</h2><p>${escapeHtml(marketingDataMessage || "Loading templates...")}</p></div>`;
  }
  const approved = selected.status === "Approved";
  const disabled = !canManage || approved || marketingActionBusy;
  const previewBody = marketingTemplatePreviewChannel === "sms" ? selected.smsBody : selected.emailBody;
  return `
    <div class="marketing-template-layout">
      <aside class="marketing-template-list" aria-label="Message templates">
        <div class="marketing-template-list-heading">
          <div><span>Service Messages</span><h2>Templates</h2></div>
          <span>${visibleTemplates.length} ${escapeHtml(marketingTemplateLanguage)}</span>
        </div>
        <div class="marketing-template-language-tabs" role="tablist" aria-label="Template languages">
          ${["English", "Spanish"].map((language) => `
            <button class="${marketingTemplateLanguage === language ? "is-active" : ""}" data-marketing-template-language="${language}" type="button" role="tab" aria-selected="${marketingTemplateLanguage === language}">${language}</button>
          `).join("")}
        </div>
        <div class="marketing-template-list-rows">
          ${visibleTemplates.map((template) => `
            <button class="marketing-template-list-row ${template.id === selected.id ? "is-selected" : ""}" data-marketing-template-id="${escapeHtml(template.id)}" type="button">
              <span><strong>${escapeHtml(template.name)}</strong><small>${escapeHtml(template.category)}</small></span>
              <em data-template-status="${escapeHtml(template.status)}">${escapeHtml(template.status)}</em>
            </button>
          `).join("")}
        </div>
      </aside>

      <form class="marketing-template-editor" data-marketing-template-form>
        <input type="hidden" name="templateId" value="${escapeHtml(selected.id)}">
        <header>
          <div>
            <span>${escapeHtml(selected.category)} · ${escapeHtml(selected.language)} · Version ${escapeHtml(selected.version)}</span>
            <h2>${escapeHtml(selected.name)}</h2>
          </div>
          <strong data-template-status="${escapeHtml(selected.status)}">${escapeHtml(selected.status)}</strong>
        </header>
        ${approved ? `<p class="marketing-template-lock">This approved version is locked. Create a new draft before changing it.</p>` : ""}
        ${!canManage ? `<p class="marketing-template-lock">Only an Admin or Manager can edit and approve templates.</p>` : ""}
        <label>EMAIL SUBJECT<input name="emailSubject" maxlength="240" value="${escapeHtml(selected.emailSubject)}" ${disabled ? "disabled" : ""} required></label>
        <label>EMAIL BODY<textarea name="emailBody" rows="16" maxlength="6000" ${disabled ? "disabled" : ""} required>${escapeHtml(selected.emailBody)}</textarea></label>
        <label>SMS BODY <span>${String(selected.smsBody || "").length}/1600</span><textarea name="smsBody" rows="6" maxlength="1600" ${disabled ? "disabled" : ""}>${escapeHtml(selected.smsBody)}</textarea></label>
        <footer>
          ${approved && canManage ? `<button data-marketing-template-action="newDraft" type="button">Create New Draft</button>` : ""}
          ${!approved && canManage ? `
            <button data-marketing-template-action="save" type="submit">Save Draft</button>
            ${selected.status === "Draft" ? `<button data-marketing-template-action="review" type="button">Ready for Review</button>` : ""}
            ${selected.status === "Ready for Review" ? `<button class="is-approve" data-marketing-template-action="approve" type="button">Approve & Lock</button>` : ""}
          ` : ""}
        </footer>
        <p class="marketing-template-message" data-state="${escapeHtml(marketingTemplateMessageState)}" role="status">${escapeHtml(marketingTemplateMessage)}</p>
      </form>

      <aside class="marketing-template-preview" aria-label="Template preview">
        <div class="marketing-template-preview-heading">
          <div><span>Family Preview</span><h2>${marketingTemplatePreviewChannel === "sms" ? "Text Message" : "Email"}</h2></div>
          <div role="tablist" aria-label="Preview channel">
            <button class="${marketingTemplatePreviewChannel === "email" ? "is-active" : ""}" data-marketing-template-preview="email" type="button">Email</button>
            <button class="${marketingTemplatePreviewChannel === "sms" ? "is-active" : ""}" data-marketing-template-preview="sms" type="button" ${selected.smsBody ? "" : "disabled"}>SMS</button>
          </div>
        </div>
        ${marketingTemplatePreviewChannel === "email" ? `
          <article class="marketing-template-email-preview">
            <div class="marketing-template-email-meta"><span>Subject</span><strong>${escapeHtml(marketingTemplatePreviewText(selected.emailSubject))}</strong></div>
            <div class="marketing-template-email-brand"><img src="./favicon.png" alt=""><strong>The SNACK Program</strong></div>
            <div class="marketing-template-preview-copy">${renderMarketingTemplateBodyPreview(previewBody, { boldLabels: true })}</div>
          </article>
        ` : `
          <article class="marketing-template-sms-preview">
            <span>SNACK</span>
            <div>${renderMarketingTemplateBodyPreview(previewBody)}</div>
            <small>Sample only · Delivery is off</small>
          </article>
        `}
        <section class="marketing-template-history">
          <h3>Approved Version History</h3>
          ${renderMarketingTemplateHistory(selected)}
        </section>
      </aside>
    </div>
  `;
}

function refreshMarketingTemplatesWorkspace() {
  const workspace = document.querySelector("[data-marketing-templates-workspace]");
  if (workspace) workspace.innerHTML = renderMarketingTemplatesWorkspace();
}

function captureMarketingTemplateForm(form = document.querySelector("[data-marketing-template-form]")) {
  const selected = selectedMarketingMessageTemplate();
  if (!form || !selected || selected.status === "Approved") return selected;
  selected.emailSubject = form.elements.emailSubject?.value || "";
  selected.emailBody = form.elements.emailBody?.value || "";
  selected.smsBody = form.elements.smsBody?.value || "";
  return selected;
}

function refreshMarketingTemplateLivePreview(form) {
  const selected = captureMarketingTemplateForm(form);
  if (!selected) return;
  const subject = document.querySelector(".marketing-template-email-meta strong");
  const previewCopy = document.querySelector(".marketing-template-preview-copy");
  const smsCopy = document.querySelector(".marketing-template-sms-preview > div");
  const smsCount = form?.querySelector('label:has(textarea[name="smsBody"]) > span');
  if (subject) subject.textContent = marketingTemplatePreviewText(selected.emailSubject);
  if (previewCopy) previewCopy.innerHTML = renderMarketingTemplateBodyPreview(selected.emailBody, { boldLabels: true });
  if (smsCopy) smsCopy.innerHTML = renderMarketingTemplateBodyPreview(selected.smsBody);
  if (smsCount) smsCount.textContent = `${String(selected.smsBody || "").length}/1600`;
}

async function saveMarketingMessageTemplate(action = "save") {
  if (marketingActionBusy) return;
  const form = document.querySelector("[data-marketing-template-form]");
  const selected = captureMarketingTemplateForm(form);
  if (!form || !selected) return;

  const status = action === "review"
    ? "Ready for Review"
    : action === "approve"
      ? "Approved"
      : selected.status === "Ready for Review"
        ? "Ready for Review"
        : "Draft";
  if (action !== "newDraft" && (!selected.emailSubject.trim() || !selected.emailBody.trim())) {
    marketingTemplateMessage = "Email subject and body are required.";
    marketingTemplateMessageState = "error";
    refreshMarketingTemplatesWorkspace();
    document.querySelector('[data-marketing-template-form] [name="emailSubject"]')?.focus();
    return;
  }

  marketingActionBusy = true;
  marketingTemplateMessage = action === "approve"
    ? "Approving and locking this version..."
    : action === "newDraft"
      ? "Creating a new draft..."
      : "Saving template...";
  marketingTemplateMessageState = "";
  refreshMarketingTemplatesWorkspace();
  try {
    const result = await marketingAuthedFetch(`/api/marketing/templates/${encodeURIComponent(selected.id)}`, {
      method: "PATCH",
      body: JSON.stringify(action === "newDraft" ? { action } : {
        action: "save",
        status,
        emailSubject: selected.emailSubject,
        emailBody: selected.emailBody,
        smsBody: selected.smsBody
      })
    });
    const index = marketingMessageTemplates.findIndex((template) => template.id === result.template?.id);
    if (index >= 0) marketingMessageTemplates[index] = result.template;
    marketingSelectedTemplateId = result.template?.id || selected.id;
    marketingTemplateMessage = action === "approve"
      ? "Approved and locked. Delivery remains off."
      : action === "review"
        ? "Saved and ready for review."
        : action === "newDraft"
          ? "New editable draft created."
          : "Draft saved.";
    marketingTemplateMessageState = "success";
  } catch (error) {
    console.error(error);
    marketingTemplateMessage = error.message || "The template could not be saved.";
    marketingTemplateMessageState = "error";
  } finally {
    marketingActionBusy = false;
    refreshMarketingTemplatesWorkspace();
  }
}

function renderMarketingStatusControl() {
  const item = marketingSelectedItem();
  const subscriber = item?.kind === "marketing-subscriber" || marketingSubpage === "Contacts";
  const options = subscriber ? marketingSubscriberStatusOptions : marketingStatusOptions;
  const fallback = subscriber ? "Consent Needed" : "Draft";
  return `
    <label class="status-line is-module-status crm-status-control marketing-status-control">
      <span class="status-dot"></span>
      <select data-marketing-status-select aria-label="${subscriber ? "Contact" : "Campaign"} status">
        ${crmSelectOptions(options, item?.status || fallback)}
      </select>
    </label>
  `;
}

function renderMarketingValueFields(fields = []) {
  return `
    <div class="field-grid marketing-field-grid">
      ${fields.map(([label, value]) => `
        <div class="field">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value || "-")}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderMarketingIntegrationState() {
  const connected = Boolean(marketingMailerLiteStatus.connected);
  return `
    <div class="marketing-integration-state" data-state="${connected ? "ready" : "inactive"}">
      <div>
        <strong>MailerLite</strong>
        <span>${escapeHtml(marketingMailerLiteStatus.connectionMode || "Not connected")}</span>
      </div>
      <span class="status-pill">Sending Off</span>
    </div>
  `;
}

function renderMarketingPanels(item) {
  const editButton = '<button class="edit-button" data-marketing-edit type="button">Edit</button>';
  const recipients = marketingRecipientsForTargets(
    marketingSubscriberItems,
    item.audience === "-" ? [] : String(item.audience || "").split(",")
  );
  return {
    message: `
      <section class="detail-card">
        <div class="card-heading"><h3>Message</h3>${editButton}</div>
        ${renderMarketingValueFields([
          ["Subject", item.subject],
          ["Preheader", item.preheader],
          ["Goal", item.goal],
          ["Call to Action", item.callToAction],
          ["Language", item.language],
          ["Notes", item.notes]
        ])}
      </section>
    `,
    audience: `
      <section class="detail-card">
        <div class="card-heading"><h3>Audience</h3>${editButton}</div>
        ${renderMarketingValueFields([
          ["Audience", item.audience],
          ["Count When Saved", item.audienceCount],
          ["Current Eligible Contacts", String(recipients.length)],
          ["Source", item.audienceSource],
          ["Consent Rule", item.consentRule]
        ])}
        ${renderMarketingRecipientPreview(recipients, item.audience !== "-")}
      </section>
    `,
    delivery: `
      <section class="detail-card">
        <div class="card-heading"><h3>Delivery</h3>${editButton}</div>
        ${renderMarketingValueFields([
          ["Tool", item.deliveryTool],
          ["Send Window", item.sendWindow],
          ["Start Date", item.startDate],
          ["Send Date", item.sendDate],
          ["End Date", item.endDate],
          ["Next Step", item.nextStep]
        ])}
        ${["Email", "Newsletter"].includes(item.channel) || item.deliveryTool === "MailerLite" ? renderMarketingIntegrationState() : ""}
      </section>
    `,
    results: `
      <section class="detail-card">
        <div class="card-heading"><h3>Results</h3>${editButton}</div>
        ${renderMarketingValueFields([
          ["Sent", item.sentCount],
          ["Opened", item.openCount],
          ["Open Rate", item.openRate],
          ["Clicked", item.clickCount],
          ["Click Rate", item.clickRate],
          ["Conversions", item.conversionCount],
          ["Impressions", item.impressions],
          ["Spend", item.spend],
          ["Primary Metric", item.metric]
        ])}
      </section>
    `
  };
}

function renderMarketingSubscriberPanels(item) {
  return {
    profile: `
      <section class="detail-card">
        <div class="card-heading"><h3>Contact Profile</h3><button class="edit-button" data-marketing-edit type="button">Edit</button></div>
        ${renderMarketingValueFields([
          ["Name", item.title],
          ["Email", item.email],
          ["Phone", item.phone],
          ["Address", item.address],
          ["Language", item.preferredLanguage],
          ["Communication Preference", item.communicationPreference]
        ])}
      </section>
    `,
    consent: `
      <section class="detail-card">
        <div class="card-heading"><h3>Marketing Consent</h3><button class="edit-button" data-marketing-edit type="button">Edit</button></div>
        ${renderMarketingValueFields([
          ["Status", item.status],
          ["MailerLite Eligibility", item.eligibilityLabel],
          ["Consent Source", item.consentSource],
          ["Consent Date", item.consentDate],
          ["Date Subscribed", item.dateSubscribed],
          ["Signup Source", item.signupSource],
          ["Email Opt Out", item.emailOptOut ? "Yes" : "No"]
        ])}
      </section>
    `,
    audiences: `
      <section class="detail-card">
        <div class="card-heading"><h3>Audiences</h3><button class="edit-button" data-marketing-edit type="button">Edit</button></div>
        ${renderMarketingValueFields([
          ["Role Tags (Automatic)", item.roleTagSummary],
          ["Audience Groups", item.audienceGroupSummary],
          ["Linked Sources", item.sourceSummary],
          ["Notes", item.notes]
        ])}
      </section>
    `,
    history: `
      <section class="detail-card">
        <div class="card-heading"><h3>Email History</h3><button class="edit-button" data-marketing-edit type="button">Edit</button></div>
        ${renderMarketingValueFields([
          ["MailerLite Contact ID", item.mailerLiteSubscriberId],
          ["Emails Sent", item.totalEmailsSent],
          ["Total Opens", item.totalOpens],
          ["Total Clicks", item.totalClicks],
          ["Last Opened", item.lastEmailOpenedAt],
          ["Last Clicked", item.lastEmailClickedAt]
        ])}
      </section>
    `
  };
}

function renderMarketingDetailPanels(module) {
  return module.detailTabs.map((tab, index) => `
    <div class="crm-detail-panel" data-marketing-detail-panel="${marketingDetailTabKey(tab)}" ${index === 0 ? "" : "hidden"}></div>
  `).join("");
}

function renderMarketingDetailContent(item) {
  const panels = item
    ? item.kind === "marketing-subscriber"
      ? renderMarketingSubscriberPanels(item)
      : renderMarketingPanels(item)
    : Object.fromEntries(modules.marketing.detailTabs.map((tab) => [marketingDetailTabKey(tab), `
        <section class="detail-card"><p class="crm-empty-copy">Select a ${marketingSubpage === "Contacts" ? "contact" : "campaign"} to review its details.</p></section>
      `]));
  Object.entries(panels).forEach(([key, html]) => {
    const panel = document.querySelector(`[data-marketing-detail-panel="${key}"]`);
    if (panel) panel.innerHTML = html;
  });
}

function setMarketingDetailTab(tab = "") {
  const validTabs = new Set(modules.marketing.detailTabs.map(marketingDetailTabKey));
  const fallback = marketingSubpage === "Contacts" ? "profile" : "message";
  marketingDetailTab = validTabs.has(tab) ? tab : fallback;
  document.querySelectorAll("[data-marketing-detail-tab]").forEach((button) => {
    const active = button.dataset.marketingDetailTab === marketingDetailTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-marketing-detail-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.marketingDetailPanel !== marketingDetailTab;
  });
}

function marketingEditorValue(source, key) {
  const value = source?.[key];
  return value === null || value === undefined ? "" : String(value);
}

function marketingUniqueValues(values = []) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function marketingEditableAudienceGroups(item = null) {
  return marketingUniqueValues([
    ...defaultMarketingAudienceGroups,
    ...marketingAudienceGroups,
    ...marketingSubscriberItems.flatMap((contact) => contact.audienceGroups || []),
    ...(item?.audienceGroups || [])
  ]);
}

function marketingCampaignAudienceChoices(source = {}) {
  const selected = String(source.audience || "").split(",").map((value) => value.trim()).filter(Boolean);
  return marketingUniqueValues([
    ...marketingEditableAudienceGroups(),
    ...marketingSubscriberItems.flatMap((contact) => contact.roleTags || []),
    ...selected
  ]);
}

function renderMarketingChoiceGrid(options = [], selected = [], name = "audienceGroups") {
  const selectedValues = new Set(selected);
  return `
    <div class="crm-checkbox-grid marketing-choice-grid">
      ${options.map((option) => `
        <label class="crm-check-row">
          <input type="checkbox" name="${escapeHtml(name)}" value="${escapeHtml(option)}" ${selectedValues.has(option) ? "checked" : ""}>
          <span>${escapeHtml(option)}</span>
        </label>
      `).join("")}
    </div>
  `;
}

function renderMarketingRecipientPreview(recipients = [], hasTargets = false) {
  if (!hasTargets) {
    return `
      <div class="marketing-recipient-preview">
        <strong>Choose an audience to preview recipients.</strong>
      </div>
    `;
  }

  const visible = recipients.slice(0, 6);
  const remaining = recipients.length - visible.length;
  return `
    <div class="marketing-recipient-preview">
      <strong>${recipients.length} eligible ${recipients.length === 1 ? "contact" : "contacts"}</strong>
      ${visible.length ? `
        <ul class="marketing-recipient-list">
          ${visible.map((contact) => `
            <li><span>${escapeHtml(contact.title)}</span><span>${escapeHtml(contact.email)}</span></li>
          `).join("")}
        </ul>
        ${remaining > 0 ? `<span class="marketing-recipient-more">+${remaining} more</span>` : ""}
      ` : '<span class="marketing-recipient-empty">No contacts currently meet the selected audience and consent rules.</span>'}
    </div>
  `;
}

function marketingCampaignTargetsFromForm(form) {
  if (!form) return [];
  const formData = new FormData(form);
  return marketingUniqueValues([
    ...formData.getAll("audienceTargets"),
    ...String(formData.get("additionalAudienceTargets") || "").split(",")
  ]);
}

function refreshMarketingRecipientPreview(form = document.querySelector("[data-marketing-campaign-form]")) {
  if (!form) return;
  const targets = marketingCampaignTargetsFromForm(form);
  const recipients = marketingRecipientsForTargets(marketingSubscriberItems, targets);
  const count = form.querySelector("[data-marketing-audience-count]");
  const preview = form.querySelector("[data-marketing-recipient-preview]");
  if (count) count.value = String(recipients.length);
  if (preview) preview.innerHTML = renderMarketingRecipientPreview(recipients, targets.length > 0);
}

function renderMarketingEditorSide(item = null) {
  const source = { ...marketingDefaultsForSubpage(marketingSubpage), ...(item?.source || {}) };
  if (source.channel === "Newsletter") source.channel = "Email";
  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status" form="marketing-campaign-editor-form" aria-label="Campaign status">
          ${crmSelectOptions(marketingStatusOptions, source.status || "Draft")}
        </select>
      </label>
      <div class="crm-editor-name-fields">
        <label><span>Campaign Name</span><input name="name" form="marketing-campaign-editor-form" value="${escapeHtml(marketingEditorValue(source, "name"))}"></label>
      </div>
      <div class="meta-list crm-editor-side-meta">
        <label class="crm-side-field"><span>Start Date</span><input name="startDate" form="marketing-campaign-editor-form" type="date" value="${escapeHtml(marketingEditorValue(source, "startDate"))}"></label>
        <label class="crm-side-field"><span>Send Date</span><input name="sendDate" form="marketing-campaign-editor-form" type="date" value="${escapeHtml(marketingEditorValue(source, "sendDate"))}"></label>
        <label class="crm-side-field"><span>End Date</span><input name="endDate" form="marketing-campaign-editor-form" type="date" value="${escapeHtml(marketingEditorValue(source, "endDate"))}"></label>
      </div>
      <section class="side-section crm-editor-family-section">
        <h3><span class="section-icon">${icons.marketing}</span>Delivery</h3>
        <label class="crm-side-field"><span>Owner</span><input name="owner" form="marketing-campaign-editor-form" value="${escapeHtml(marketingEditorValue(source, "owner"))}"></label>
        <label class="crm-side-field"><span>Send Window</span><input name="sendWindow" form="marketing-campaign-editor-form" value="${escapeHtml(marketingEditorValue(source, "sendWindow"))}"></label>
        <label class="crm-side-field"><span>Next Step</span><textarea name="nextStep" form="marketing-campaign-editor-form" rows="3">${escapeHtml(marketingEditorValue(source, "nextStep"))}</textarea></label>
      </section>
    </div>
  `;
}

function renderMarketingEditorFooter(item = null) {
  return `
    <p class="schedule-dialog-status" data-marketing-editor-status role="status" aria-live="polite"></p>
    <div class="footer-actions marketing-editor-footer-actions" style="--marketing-editor-action-count: ${item ? 3 : 2};">
      <button data-close-marketing-editor type="button">Cancel</button>
      ${item ? "<button data-marketing-delete-editor type=\"button\">Delete Campaign</button>" : ""}
      <button type="submit">${item ? "Save Changes" : "Save Campaign"}</button>
    </div>
  `;
}

function renderMarketingEditorMain(item = null) {
  const source = { ...marketingDefaultsForSubpage(marketingSubpage), ...(item?.source || {}) };
  if (source.channel === "Newsletter") source.channel = "Email";
  const selectedAudiences = String(source.audience || "").split(",").map((value) => value.trim()).filter(Boolean);
  const audienceChoices = marketingCampaignAudienceChoices(source);
  return `
    <form class="schedule-inline-form crm-profile-editor-main" id="marketing-campaign-editor-form" data-marketing-campaign-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Campaign Setup</h3><button class="edit-button" data-close-marketing-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields marketing-editor-fields">
          <label><span>Campaign Type</span><select name="campaignType">${crmSelectOptions(marketingCampaignTypeOptions, source.campaignType)}</select></label>
          <label><span>Channel</span><select name="channel">${crmSelectOptions(marketingChannelOptions, source.channel)}</select></label>
          <label><span>Delivery Tool</span><input name="deliveryTool" value="${escapeHtml(marketingEditorValue(source, "deliveryTool"))}"></label>
          <label><span>Language</span><input name="language" value="${escapeHtml(marketingEditorValue(source, "language"))}" placeholder="English, Spanish, bilingual"></label>
          <label class="is-full-width"><span>Goal</span><textarea name="goal" rows="2">${escapeHtml(marketingEditorValue(source, "goal"))}</textarea></label>
        </div>
      </section>
      <section class="detail-card">
        <div class="card-heading"><h3>Message</h3></div>
        <div class="schedule-inline-fields marketing-editor-fields">
          <label class="is-full-width"><span>Subject or Headline</span><input name="subject" value="${escapeHtml(marketingEditorValue(source, "subject"))}"></label>
          <label class="is-full-width"><span>Preheader</span><input name="preheader" value="${escapeHtml(marketingEditorValue(source, "preheader"))}"></label>
          <label class="is-full-width"><span>Call to Action</span><input name="callToAction" value="${escapeHtml(marketingEditorValue(source, "callToAction"))}"></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="3">${escapeHtml(marketingEditorValue(source, "notes"))}</textarea></label>
        </div>
      </section>
      <section class="detail-card">
        <div class="card-heading"><h3>Audience and Consent</h3></div>
        <div class="schedule-inline-fields marketing-editor-fields">
          <div class="is-full-width marketing-audience-selector">
            <span class="marketing-field-label">Send To</span>
            ${renderMarketingChoiceGrid(audienceChoices, selectedAudiences, "audienceTargets")}
          </div>
          <label class="is-full-width"><span>Additional Audience Groups</span><input name="additionalAudienceTargets" placeholder="Add another group, separated by commas"></label>
          <div class="is-full-width" data-marketing-recipient-preview aria-live="polite">
            ${renderMarketingRecipientPreview([], selectedAudiences.length > 0)}
          </div>
          <label><span>Eligible Contacts</span><input data-marketing-audience-count name="audienceCount" type="number" min="0" step="1" value="${escapeHtml(marketingEditorValue(source, "audienceCount"))}" readonly></label>
          <label><span>Audience Source</span><input name="audienceSource" value="${escapeHtml(marketingEditorValue(source, "audienceSource"))}"></label>
          <label><span>Consent Rule</span><input name="consentRule" value="${escapeHtml(marketingEditorValue(source, "consentRule"))}"></label>
        </div>
      </section>
      <section class="detail-card">
        <div class="card-heading"><h3>Results</h3></div>
        <div class="schedule-inline-fields marketing-editor-fields marketing-results-fields">
          <label><span>Sent</span><input name="sentCount" type="number" min="0" step="1" value="${escapeHtml(marketingEditorValue(source, "sentCount"))}"></label>
          <label><span>Opened</span><input name="openCount" type="number" min="0" step="1" value="${escapeHtml(marketingEditorValue(source, "openCount"))}"></label>
          <label><span>Clicked</span><input name="clickCount" type="number" min="0" step="1" value="${escapeHtml(marketingEditorValue(source, "clickCount"))}"></label>
          <label><span>Conversions</span><input name="conversionCount" type="number" min="0" step="1" value="${escapeHtml(marketingEditorValue(source, "conversionCount"))}"></label>
          <label><span>Impressions</span><input name="impressions" type="number" min="0" step="1" value="${escapeHtml(marketingEditorValue(source, "impressions"))}"></label>
          <label><span>Spend</span><input name="spend" type="number" min="0" step="0.01" value="${escapeHtml(marketingEditorValue(source, "spend"))}"></label>
          <label class="is-full-width"><span>Primary Metric</span><input name="metric" value="${escapeHtml(marketingEditorValue(source, "metric"))}"></label>
          <label class="is-full-width"><span>Provider Campaign ID</span><input name="externalCampaignId" value="${escapeHtml(marketingEditorValue(source, "externalCampaignId"))}"></label>
        </div>
      </section>
      ${renderMarketingEditorFooter(item)}
    </form>
  `;
}

function renderMarketingSubscriberEditorSide(item = null) {
  const source = item?.source || {};
  return `
    <div class="crm-profile-editor-side">
      <label class="status-line is-module-status crm-status-control crm-editor-status-control">
        <span class="status-dot"></span>
        <select name="status" form="marketing-subscriber-editor-form" aria-label="Contact status">
          ${crmSelectOptions(marketingSubscriberStatusOptions, source.status || "Consent Needed")}
        </select>
      </label>
      <div class="crm-editor-name-fields">
        <label><span>Contact Name</span><input name="fullName" form="marketing-subscriber-editor-form" value="${escapeHtml(marketingEditorValue(source, "fullName") || item?.title || "")}"></label>
      </div>
      <div class="meta-list crm-editor-side-meta">
        <label class="crm-side-field"><span>Email</span><input name="email" form="marketing-subscriber-editor-form" type="email" value="${escapeHtml(marketingEditorValue(source, "email") || (item?.email === "-" ? "" : item?.email) || "")}"></label>
        <label class="crm-side-field"><span>Phone</span><input name="phone" form="marketing-subscriber-editor-form" type="tel" value="${escapeHtml(marketingEditorValue(source, "phone"))}"></label>
      </div>
      <section class="side-section crm-editor-family-section">
        <h3><span class="section-icon">${icons.marketing}</span>Contact Sources</h3>
        <div class="crm-side-field"><span>Linked Records</span><strong>${escapeHtml(item?.sourceSummary || "Manual")}</strong></div>
        <div class="crm-side-field"><span>MailerLite</span><strong>${escapeHtml(item?.eligibilityLabel || "Consent Required")}</strong></div>
      </section>
    </div>
  `;
}

function renderMarketingSubscriberEditorFooter(item = null) {
  return `
    <p class="schedule-dialog-status" data-marketing-editor-status role="status" aria-live="polite"></p>
    <div class="footer-actions marketing-editor-footer-actions" style="--marketing-editor-action-count: ${item ? 3 : 2};">
      <button data-close-marketing-editor type="button">Cancel</button>
      ${item ? "<button data-marketing-unsubscribe-editor type=\"button\">Unsubscribe</button>" : ""}
      <button type="submit">${item ? "Save Changes" : "Save Contact"}</button>
    </div>
  `;
}

function renderMarketingSubscriberEditorMain(item = null) {
  const source = item?.source || {};
  const rawSelectedGroups = item?.audienceGroups || source.audienceGroups || source.tags || [];
  const selectedGroups = marketingUniqueValues(Array.isArray(rawSelectedGroups) ? rawSelectedGroups : String(rawSelectedGroups).split(","));
  const audienceGroups = marketingEditableAudienceGroups(item);
  return `
    <form class="schedule-inline-form crm-profile-editor-main" id="marketing-subscriber-editor-form" data-marketing-subscriber-form>
      <section class="detail-card">
        <div class="card-heading"><h3>Contact Profile</h3><button class="edit-button" data-close-marketing-editor type="button">Cancel</button></div>
        <div class="schedule-inline-fields marketing-editor-fields">
          <label class="is-full-width"><span>Address</span><input name="address" value="${escapeHtml(marketingEditorValue(source, "address"))}"></label>
          <label><span>Preferred Language</span><input name="preferredLanguage" value="${escapeHtml(marketingEditorValue(source, "preferredLanguage"))}"></label>
          <label><span>Communication Preference</span><select name="communicationPreference">${crmSelectOptions(marketingCommunicationPreferenceOptions, source.communicationPreference || "Email")}</select></label>
        </div>
      </section>
      <section class="detail-card">
        <div class="card-heading"><h3>Marketing Consent</h3></div>
        <div class="schedule-inline-fields marketing-editor-fields">
          <label><span>Consent Source</span><input name="consentSource" value="${escapeHtml(marketingEditorValue(source, "consentSource"))}" placeholder="Signup form, MailerLite import, staff record"></label>
          <label><span>Consent Date</span><input name="consentDate" type="date" value="${escapeHtml(marketingEditorValue(source, "consentDate"))}"></label>
          <label><span>Date Subscribed</span><input name="dateSubscribed" type="date" value="${escapeHtml(marketingEditorValue(source, "dateSubscribed"))}"></label>
          <label><span>Signup Source</span><input name="signupSource" value="${escapeHtml(marketingEditorValue(source, "signupSource"))}"></label>
          <label class="crm-check-row marketing-opt-out-row"><input name="emailOptOut" type="checkbox" ${source.emailOptOut === true || item?.emailOptOut ? "checked" : ""}><span>Email Opt Out</span></label>
        </div>
      </section>
      <section class="detail-card">
        <div class="card-heading"><h3>Audiences and Notes</h3></div>
        <div class="schedule-inline-fields marketing-editor-fields">
          <div class="is-full-width marketing-readonly-tags">
            <span class="marketing-field-label">Role Tags (Automatic)</span>
            <strong>${escapeHtml(item?.roleTagSummary || "Assigned from linked records")}</strong>
          </div>
          <div class="is-full-width marketing-audience-selector">
            <span class="marketing-field-label">Audience Groups</span>
            ${renderMarketingChoiceGrid(audienceGroups, selectedGroups, "audienceGroups")}
          </div>
          <label class="is-full-width"><span>Additional Audience Groups</span><input name="additionalAudienceGroups" placeholder="Add another group, separated by commas"></label>
          <label class="is-full-width"><span>Notes</span><textarea name="notes" rows="3">${escapeHtml(marketingEditorValue(source, "notes"))}</textarea></label>
          <label class="is-full-width"><span>MailerLite Contact ID</span><input name="mailerLiteSubscriberId" value="${escapeHtml(marketingEditorValue(source, "mailerLiteSubscriberId"))}"></label>
        </div>
      </section>
      ${renderMarketingSubscriberEditorFooter(item)}
    </form>
  `;
}

function setMarketingPanelMode(mode = "detail") {
  marketingPanelMode = mode === "editor" ? "editor" : "detail";
  const editing = marketingPanelMode === "editor";
  const tabs = document.querySelector("[data-marketing-tabs]");
  const content = document.querySelector("[data-marketing-detail-content]");
  const editor = document.querySelector("[data-marketing-editor]");
  const sideDetail = document.querySelector("[data-marketing-side-detail]");
  const sideEditor = document.querySelector("[data-marketing-side-editor]");
  tabs?.querySelectorAll("button").forEach((button) => { button.disabled = editing; });
  if (content) content.hidden = editing;
  if (editor) editor.hidden = !editing;
  if (sideDetail) sideDetail.hidden = editing;
  if (sideEditor) sideEditor.hidden = !editing;
}

function setMarketingActionStatus(message = "", state = "") {
  document.querySelectorAll("[data-marketing-action-status], [data-marketing-editor-status]").forEach((status) => {
    status.textContent = message;
    status.dataset.state = state;
  });
}

function openMarketingEditor(item = null) {
  if (marketingActionBusy) return;
  if (marketingSubpage === "Dashboard") setMarketingSubpage("Campaigns");
  const editor = document.querySelector("[data-marketing-editor]");
  const sideEditor = document.querySelector("[data-marketing-side-editor]");
  if (!editor || !sideEditor) return;
  const subscriber = item?.kind === "marketing-subscriber" || marketingSubpage === "Contacts";
  marketingEditingCampaignId = subscriber ? "" : item?.id || "";
  marketingEditingSubscriberId = subscriber ? item?.id || "" : "";
  marketingDeletePendingId = "";
  marketingUnsubscribePendingId = "";
  editor.classList.add("is-profile-editor");
  editor.innerHTML = subscriber ? renderMarketingSubscriberEditorMain(item) : renderMarketingEditorMain(item);
  sideEditor.innerHTML = subscriber ? renderMarketingSubscriberEditorSide(item) : renderMarketingEditorSide(item);
  setMarketingActionStatus("");
  setMarketingPanelMode("editor");
  if (!subscriber) refreshMarketingRecipientPreview(editor.querySelector("[data-marketing-campaign-form]"));
  (sideEditor.querySelector("input, select, textarea") || editor.querySelector("input, select, textarea"))?.focus();
}

function closeMarketingEditor() {
  if (marketingActionBusy) return;
  document.querySelector("[data-marketing-editor]")?.replaceChildren();
  document.querySelector("[data-marketing-side-editor]")?.replaceChildren();
  marketingEditingCampaignId = "";
  marketingEditingSubscriberId = "";
  marketingDeletePendingId = "";
  marketingUnsubscribePendingId = "";
  setMarketingPanelMode("detail");
  updateDetail(modules.marketing, selectedItemId);
}

function refreshMarketingAccountControl() {
  if (currentModuleId() !== "marketing") return;
  const account = document.querySelector(".account");
  const accountName = document.querySelector("[data-account-name]");
  if (!account || !accountName) return;
  accountName.textContent = marketingCurrentUser ? staffAccountDisplayName(marketingCurrentUser) : "Sign in";
  configureAccountSignInControl(account, Boolean(marketingCurrentUser), "Sign in to load Marketing records");
}

function updateMarketingActionAvailability(item = marketingSelectedItem()) {
  document.querySelectorAll("[data-marketing-action='edit'], [data-marketing-action='delete'], [data-marketing-action='unsubscribe'], [data-marketing-edit], [data-marketing-status-select], [data-marketing-delete-editor], [data-marketing-unsubscribe-editor]").forEach((control) => {
    control.disabled = marketingActionBusy || !item;
  });
  document.querySelectorAll("[data-marketing-new], [data-marketing-search-toggle], [data-marketing-search-input]").forEach((control) => {
    control.disabled = marketingActionBusy;
  });
  document.querySelectorAll("[data-marketing-action='delete'], [data-marketing-delete-editor]").forEach((button) => {
    button.textContent = marketingDeletePendingId === item?.id ? "Confirm Delete" : "Delete Campaign";
  });
  document.querySelectorAll("[data-marketing-action='unsubscribe'], [data-marketing-unsubscribe-editor]").forEach((button) => {
    button.textContent = marketingUnsubscribePendingId === item?.id ? "Confirm Unsubscribe" : "Unsubscribe";
    button.disabled = marketingActionBusy || !item || item.status === "Unsubscribed";
  });
}

function setMarketingActionBusy(busy) {
  marketingActionBusy = busy;
  updateMarketingActionAvailability();
  document.querySelectorAll("[data-marketing-editor], [data-marketing-side-editor]").forEach((editor) => {
    editor.setAttribute("aria-busy", String(busy));
    editor.querySelectorAll("button, input, select, textarea").forEach((control) => { control.disabled = busy; });
  });
}

async function marketingAuthedFetch(path, options = {}) {
  if (!marketingCurrentUser) throw new Error("Sign in before changing a Marketing record.");
  const token = await marketingCurrentUser.getIdToken();
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
    throw new Error(result.error || `The marketing service returned ${response.status}.`);
  }
  return response.json().catch(() => ({}));
}

async function saveMarketingCampaign(form) {
  if (marketingActionBusy) return;
  const item = marketingCampaignItems.find((candidate) => candidate.id === marketingEditingCampaignId) || null;
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());
  const selectedTargets = marketingUniqueValues([
    ...formData.getAll("audienceTargets"),
    ...String(values.additionalAudienceTargets || "").split(",")
  ]);
  values.audience = selectedTargets.join(", ");
  values.audienceCount = marketingRecipientsForTargets(marketingSubscriberItems, selectedTargets).length;
  const payload = marketingCampaignPayload({ ...(item?.source || {}), ...values });
  if (!payload.name) {
    setMarketingActionStatus("Enter a campaign name.", "error");
    document.querySelector('[name="name"][form="marketing-campaign-editor-form"]')?.focus();
    return;
  }

  setMarketingActionBusy(true);
  setMarketingActionStatus("");
  try {
    const result = await marketingAuthedFetch(item ? `/api/marketing-campaigns/${encodeURIComponent(item.id)}` : "/api/marketing-campaigns", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    selectedItemId = result.campaign?.id || item?.id || selectedItemId;
    marketingEditingCampaignId = "";
    await loadMarketingData(marketingCurrentUser, selectedItemId);
    setMarketingPanelMode("detail");
  } catch (error) {
    console.error(error);
    setMarketingActionStatus(error.message || "Could not save the campaign.", "error");
  } finally {
    setMarketingActionBusy(false);
  }
}

async function saveMarketingSubscriber(form) {
  if (marketingActionBusy) return;
  const item = marketingSubscriberItems.find((candidate) => candidate.id === marketingEditingSubscriberId) || null;
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());
  values.audienceGroups = marketingUniqueValues([
    ...formData.getAll("audienceGroups"),
    ...String(values.additionalAudienceGroups || "").split(",")
  ]);
  values.emailOptOut = form.elements.emailOptOut?.checked === true;
  const payload = marketingSubscriberPayload({ ...(item?.source || {}), ...values });
  if (!payload.fullName) {
    setMarketingActionStatus("Enter the contact's name.", "error");
    document.querySelector('[name="fullName"][form="marketing-subscriber-editor-form"]')?.focus();
    return;
  }
  if (!payload.email) {
    setMarketingActionStatus("Enter the contact's email address.", "error");
    document.querySelector('[name="email"][form="marketing-subscriber-editor-form"]')?.focus();
    return;
  }

  setMarketingActionBusy(true);
  setMarketingActionStatus("");
  try {
    const result = await marketingAuthedFetch(item ? `/api/marketing-subscribers/${encodeURIComponent(item.id)}` : "/api/marketing-subscribers", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    selectedItemId = result.contact?.id || result.subscriber?.id || item?.id || selectedItemId;
    marketingEditingSubscriberId = "";
    marketingUnsubscribePendingId = "";
    await loadMarketingData(marketingCurrentUser, selectedItemId);
    setMarketingPanelMode("detail");
  } catch (error) {
    console.error(error);
    setMarketingActionStatus(error.message || "Could not save the contact.", "error");
  } finally {
    setMarketingActionBusy(false);
  }
}

async function saveMarketingStatus(item, status, control) {
  if (!item || marketingActionBusy || status === item.status) return;
  if (item.kind === "marketing-subscriber") {
    if (status === "Active" && (item.consentSource === "-" || item.consentDate === "-")) {
      if (control) control.value = item.status;
      setMarketingActionStatus("Use Edit to record the consent source and date before making this contact Active.", "error");
      return;
    }
    const previousStatus = item.status;
    setMarketingActionBusy(true);
    setMarketingActionStatus("");
    try {
      await marketingAuthedFetch(`/api/marketing-subscribers/${encodeURIComponent(item.id)}`, {
        method: "PATCH",
        body: JSON.stringify(marketingSubscriberPayload({ ...item.source, status }))
      });
      marketingUnsubscribePendingId = "";
      await loadMarketingData(marketingCurrentUser, item.id);
    } catch (error) {
      console.error(error);
      if (control) control.value = previousStatus;
      setMarketingActionStatus(error.message || "Could not update the contact status.", "error");
    } finally {
      setMarketingActionBusy(false);
    }
    return;
  }
  const previousStatus = item.status;
  setMarketingActionBusy(true);
  setMarketingActionStatus("");
  try {
    await marketingAuthedFetch(`/api/marketing-campaigns/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(marketingCampaignPayload({ ...item.source, status }))
    });
    await loadMarketingData(marketingCurrentUser, item.id);
  } catch (error) {
    console.error(error);
    if (control) control.value = previousStatus;
    setMarketingActionStatus(error.message || "Could not update the campaign status.", "error");
  } finally {
    setMarketingActionBusy(false);
  }
}

async function unsubscribeMarketingSubscriber(item) {
  if (!item || item.kind !== "marketing-subscriber" || marketingActionBusy || item.status === "Unsubscribed") return;
  if (marketingUnsubscribePendingId !== item.id) {
    marketingUnsubscribePendingId = item.id;
    setMarketingActionStatus("Click Confirm Unsubscribe to exclude this address from future Marketing audiences.");
    updateMarketingActionAvailability(item);
    return;
  }

  setMarketingActionBusy(true);
  setMarketingActionStatus("");
  try {
    await marketingAuthedFetch(`/api/marketing-subscribers/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(marketingSubscriberPayload({ ...item.source, status: "Unsubscribed" }))
    });
    marketingEditingSubscriberId = "";
    marketingUnsubscribePendingId = "";
    await loadMarketingData(marketingCurrentUser, item.id);
    setMarketingPanelMode("detail");
  } catch (error) {
    console.error(error);
    marketingUnsubscribePendingId = "";
    setMarketingActionStatus(error.message || "Could not unsubscribe this address.", "error");
    updateMarketingActionAvailability(item);
  } finally {
    setMarketingActionBusy(false);
  }
}

async function deleteMarketingCampaign(item) {
  if (!item || marketingActionBusy) return;
  if (marketingDeletePendingId !== item.id) {
    marketingDeletePendingId = item.id;
    setMarketingActionStatus("Click Confirm Delete to permanently remove this campaign.");
    updateMarketingActionAvailability(item);
    return;
  }

  setMarketingActionBusy(true);
  setMarketingActionStatus("");
  try {
    await marketingAuthedFetch(`/api/marketing-campaigns/${encodeURIComponent(item.id)}`, { method: "DELETE" });
    selectedItemId = "";
    marketingEditingCampaignId = "";
    marketingDeletePendingId = "";
    await loadMarketingData(marketingCurrentUser);
    setMarketingPanelMode("detail");
  } catch (error) {
    console.error(error);
    marketingDeletePendingId = "";
    setMarketingActionStatus(error.message || "Could not delete the campaign.", "error");
    updateMarketingActionAvailability(item);
  } finally {
    setMarketingActionBusy(false);
  }
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
  const options = crmSubpage === "Referrals"
    ? referralStatusOptions
    : crmStatusOptions().map((status) => [crmStatusLabel(status), status]);
  return `
    <label class="status-line is-module-status crm-status-control" data-status-tone="navy">
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

  accountName.textContent = crmCurrentUser ? staffAccountDisplayName(crmCurrentUser) : "Sign in";
  configureAccountSignInControl(
    account,
    Boolean(crmCurrentUser),
    `Sign in to load ${crmSubpage.toLowerCase()}`
  );
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
  crmNetworkSourceReferralId = "";
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

function operationsSelectedMetric() {
  return operationsMetrics.find((metric) => metric.metricKey === operationsSelectedMetricKey) || null;
}

function operationsDefaultMeasurementDate() {
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
  return today >= operationsPeriod.startDate && today <= operationsPeriod.endDate
    ? today
    : operationsPeriod.endDate;
}

function operationsStatusKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function renderOperationsStatus(value, state = value) {
  return `<span class="operations-status" data-state="${escapeHtml(operationsStatusKey(state))}">${escapeHtml(value || "No Data")}</span>`;
}

function renderOperationsPeriodControls(compact = false) {
  return `
    <form class="operations-period-controls ${compact ? "is-dashboard" : ""}" data-operations-period-form>
      <div class="operations-period-summary">
        <strong>${compact ? "Quarterly Overview" : "Reporting Period"}</strong>
        <span>${compact ? "Current performance across all SNACK programs" : escapeHtml(operationsPeriodLabel(operationsPeriod.startDate, operationsPeriod.endDate))}</span>
      </div>
      <label>
        <span class="${compact ? "sr-only" : ""}">Start Date</span>
        <input name="startDate" type="date" value="${escapeHtml(operationsPeriod.startDate)}" required>
      </label>
      <label>
        <span class="${compact ? "sr-only" : ""}">End Date</span>
        <input name="endDate" type="date" value="${escapeHtml(operationsPeriod.endDate)}" required>
      </label>
      <div class="operations-period-actions"><button type="submit">${compact ? "Refresh" : "Apply"}</button></div>
    </form>
  `;
}

function renderOperationsTargetProgress(
  metric,
  value = metric?.currentValue,
  startDate = operationsPeriod.startDate,
  endDate = operationsPeriod.endDate,
  label = ""
) {
  const progress = operationsTargetProgress(metric, startDate, endDate, value);
  if (!progress) return "";
  const target = formatOperationsValue(metric, progress.targetValue);
  const progressLabel = label || progress.label;
  return `
    <div class="operations-target-progress" aria-label="${escapeHtml(`${progress.percent}% of ${progressLabel} ${target}`)}">
      <span class="operations-target-progress-track" aria-hidden="true"><span style="width:${escapeHtml(progress.visualPercent)}%"></span></span>
      <small><b>${escapeHtml(progress.percent)}%</b><span>${escapeHtml(progressLabel)} ${escapeHtml(target)}</span></small>
    </div>
  `;
}

const operationsExecutiveAreaIcons = {
  Clinic: "crm",
  School: "building",
  Cooking: "utensils",
  Community: "outreach",
  Financial: "fundraising"
};

const operationsExecutiveMetricLabels = {
  "clinic.appointments-delivered": "Appointments",
  "school.knowledge-gain": "Knowledge Gain",
  "cooking.participants-served": "Participants Served",
  "cooking.classes-delivered": "Classes Delivered",
  "cooking.attendance-rate": "Attendance Rate",
  "community.events-completed": "Events Completed"
};

function renderOperationsSnapshotMetric(metric) {
  if (!metric) return "";
  const targetProgress = renderOperationsTargetProgress(metric);
  const status = ["Needs Definition", "Not Configured"].includes(metric.calculationMode)
    ? renderOperationsStatus(metric.calculationMode)
    : metric.calculationMode === "Manual" && metric.currentValue === null
      ? renderOperationsStatus("Manual Value", "Manual")
      : `<small>${escapeHtml(metric.calculationMode)}</small>`;
  return `
    <button class="operations-snapshot-metric" data-operations-open-metric="${escapeHtml(metric.metricKey)}" type="button">
      <span>${escapeHtml(metric.name)}</span>
      <strong>${escapeHtml(formatOperationsValue(metric))}</strong>
      ${targetProgress || status}
    </button>
  `;
}

function renderOperationsPulseMetric(metric) {
  if (!metric) return `<span class="operations-pulse-metric is-empty"><strong>-</strong><span class="operations-pulse-label">Not Configured</span></span>`;
  const label = operationsExecutiveMetricLabels[metric.metricKey] || metric.name;
  return `
    <button class="operations-pulse-metric" data-operations-open-metric="${escapeHtml(metric.metricKey)}" type="button">
      <strong>${escapeHtml(formatOperationsValue(metric))}</strong>
      <span class="operations-pulse-label">${escapeHtml(label)}</span>
      ${renderOperationsTargetProgress(metric)}
    </button>
  `;
}

function renderOperationsAttentionRow({ count, title, detail, attributes = "", clear = false }) {
  return `
    <button class="operations-executive-attention-row ${clear ? "is-clear" : ""}" ${attributes} type="button">
      <span class="operations-executive-count">${escapeHtml(count)}</span>
      <span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></span>
      <span class="operations-executive-chevron" aria-hidden="true">›</span>
    </button>
  `;
}

function renderOperationsDashboard() {
  const dashboard = operationsExecutiveDashboardData(operationsMetrics, operationsDataQualityItems);
  const referralCount = Number(dashboard.referralFollowUp?.issueCount || 0);
  const firstUnresolved = dashboard.unresolved[0];
  const firstManualDue = dashboard.manualDue[0];
  return `
    ${renderOperationsPeriodControls(true)}
    <div class="operations-executive-grid">
      <section class="operations-executive-overview">
        <header class="operations-executive-heading">
          <div><h2>Organization Snapshot</h2></div>
          <button data-operations-area="Organization" type="button">View All Measures</button>
        </header>
        <div class="operations-snapshot-strip">
          ${dashboard.snapshotMetrics.map(renderOperationsSnapshotMetric).join("")}
        </div>
        <div class="operations-program-pulse">
          <div class="operations-pulse-header"><span>Program</span><span>Reach</span><span>Delivery</span><span>Outcome</span><span>Status</span></div>
          ${dashboard.programRows.map((row) => `
            <div class="operations-program-row">
              <button class="operations-program-name" data-operations-area="${escapeHtml(row.area)}" type="button">
                <span class="operations-program-icon" data-area="${escapeHtml(operationsStatusKey(row.area))}">${icons[operationsExecutiveAreaIcons[row.area]] || icons.operations}</span>
                <span><strong>${escapeHtml(row.label || operationsProgramAreaLabel(row.area))}</strong><small>${escapeHtml(row.subtitle)}</small></span>
              </button>
              ${row.metrics.map(renderOperationsPulseMetric).join("")}
              <span class="operations-program-status">${renderOperationsStatus(row.readiness.label, row.readiness.state)}</span>
            </div>
          `).join("")}
        </div>
      </section>

      <aside class="operations-executive-attention">
        <header class="operations-executive-heading"><div><h2>Needs Attention</h2><p>Work that affects reporting readiness</p></div></header>
        <div class="operations-readiness-score">
          <div class="operations-score-ring" style="--readiness:${escapeHtml(dashboard.dashboardReadinessPercent)}%">${escapeHtml(dashboard.dashboardReadinessPercent)}%</div>
          <div><strong>Dashboard Readiness</strong><p>${escapeHtml(dashboard.dashboardReadyCount)} of ${escapeHtml(dashboard.dashboardMetricCount)} dashboard measures have current values.</p><div class="operations-progress"><span style="width:${escapeHtml(dashboard.dashboardReadinessPercent)}%"></span></div></div>
        </div>
        <div class="operations-executive-attention-list">
          ${renderOperationsAttentionRow({ count: referralCount, title: "Referral Follow-Up", detail: dashboard.referralFollowUp?.detail || "No referral timing gaps found.", attributes: `data-module-link="crm"`, clear: referralCount === 0 })}
          ${renderOperationsAttentionRow({ count: dashboard.unresolved.length, title: "Metric Definitions", detail: dashboard.unresolved.length ? "Definitions or collection methods still need approval." : "All definitions are ready.", attributes: firstUnresolved ? `data-operations-open-metric="${escapeHtml(firstUnresolved.metricKey)}"` : `data-operations-subpage-target="Performance"`, clear: dashboard.unresolved.length === 0 })}
          ${renderOperationsAttentionRow({ count: dashboard.manualDue.length, title: "Manual Values", detail: dashboard.manualDue.length ? "Current reporting values have not been entered." : "All manual values are current.", attributes: firstManualDue ? `data-operations-open-metric="${escapeHtml(firstManualDue.metricKey)}"` : `data-operations-subpage-target="Performance"`, clear: dashboard.manualDue.length === 0 })}
          ${renderOperationsAttentionRow({ count: dashboard.totalQualityIssues, title: "Data Quality", detail: dashboard.totalQualityIssues ? "Records, definitions, or manual values need review." : "No reporting gaps found.", attributes: `data-operations-performance-view="Data Quality"`, clear: dashboard.totalQualityIssues === 0 })}
        </div>
        <div class="operations-definition-progress">
          <div><strong>Definition Progress</strong><span>${escapeHtml(dashboard.definitionReadyCount)} / ${escapeHtml(dashboard.definitionCount)}</span></div>
          <div class="operations-progress"><span style="width:${escapeHtml(dashboard.definitionReadinessPercent)}%"></span></div>
          <small>Complete definitions before setting formal targets.</small>
        </div>
        <div class="operations-executive-period"><span>SELECTED REPORTING PERIOD</span><strong>${escapeHtml(operationsPeriodLabel(operationsPeriod.startDate, operationsPeriod.endDate))}</strong></div>
      </aside>
    </div>
    <section class="operations-financial-overview">
      <header class="operations-executive-heading">
        <div><h2>Financial Performance</h2><p>Year-to-date revenue and source mix</p></div>
        <button data-operations-area="Financial" type="button">View Financial Measures</button>
      </header>
      <div class="operations-financial-body">
        <button class="operations-financial-total" data-operations-open-metric="financial.total-revenue" type="button">
          <span>Total Revenue</span>
          <strong>${escapeHtml(formatOperationsValue(dashboard.financial.total, dashboard.financial.total?.ytdValue))}</strong>
          ${dashboard.financial.total
            ? renderOperationsTargetProgress(
              dashboard.financial.total,
              dashboard.financial.total.ytdValue,
              dashboard.financial.total.ytdStartDate,
              operationsPeriod.endDate,
              "YTD Target"
            )
            : ""}
        </button>
        <div class="operations-revenue-mix" aria-label="Year-to-date revenue mix">
          ${dashboard.financial.mix.map((source) => `
            <button data-operations-open-metric="${escapeHtml(source.metricKey)}" type="button">
              <span><strong>${escapeHtml(source.label)}</strong><b>${escapeHtml(source.percent)}%</b></span>
              <span class="operations-revenue-track" aria-hidden="true"><span style="width:${escapeHtml(Math.min(100, source.percent))}%"></span></span>
              <small>${escapeHtml(formatOperationsValue(source.metric, source.value))}</small>
            </button>
          `).join("")}
        </div>
      </div>
      ${dashboard.financial.grantValueMissing ? `<p class="operations-financial-note">Grant Revenue has not been logged for this year, so Total Revenue and Revenue Mix currently show known revenue only. <button data-operations-open-metric="financial.grant-revenue" type="button">Log Grant Revenue</button></p>` : ""}
    </section>
  `;
}

function operationsMetricHistoryRows(metric) {
  return operationsMeasurements
    .filter((measurement) => measurement.metricKey === metric.metricKey)
    .sort((first, second) => (
      String(second.periodEnd).localeCompare(String(first.periodEnd))
      || String(second.updatedAt || second.createdAt).localeCompare(String(first.updatedAt || first.createdAt))
    ))
    .map((measurement) => ({
      id: measurement.id,
      date: operationsPeriodLabel(measurement.periodStart, measurement.periodEnd),
      value: measurement.value,
      note: measurement.note || "Logged value"
    }));
}

function renderOperationsTargetValue(label, year, value, metric) {
  return `
    <div>
      <span>${escapeHtml(label)}${year ? ` ${escapeHtml(year)}` : ""}</span>
      <strong>${escapeHtml(formatOperationsValue(metric, value))}</strong>
    </div>
  `;
}

function renderOperationsMetricDetail(metric) {
  if (!metric) return `<div class="operations-empty-panel"><h2>No Measure Selected</h2><p>Choose a measure to review its definition, targets, and history.</p></div>`;
  const historyRows = operationsMetricHistoryRows(metric);
  const targetHistory = operationsTargetHistory(metric);
  const ytdStartDate = metric.ytdStartDate || `${operationsPeriod.endDate.slice(0, 4)}-01-01`;
  const annualPacingDate = metric.annualPacingDate || operationsPeriod.endDate;
  return `
    <div class="operations-metric-detail-heading">
      <div>
        <span>${escapeHtml(operationsProgramAreaLabel(metric.programArea))} · ${escapeHtml(metric.category)}</span>
        <h2>${escapeHtml(metric.name)}</h2>
      </div>
      <button data-operations-edit-definition type="button">Edit</button>
    </div>
    <section class="operations-detail-section">
      <header><h3>Current Performance</h3>${renderOperationsStatus(metric.annualPacingStatus, metric.annualPacingStatus)}</header>
      <div class="operations-current-value">
        <strong>${escapeHtml(formatOperationsValue(metric))}</strong>
        <span>${escapeHtml(operationsPeriodLabel(operationsPeriod.startDate, operationsPeriod.endDate))}</span>
      </div>
      <div class="operations-value-meta">
        <span>${renderOperationsStatus(metric.calculationMode)} ${escapeHtml(metric.dataSource || "Data source not recorded")}</span>
      </div>
      <div class="operations-dual-progress">
        <div><span>Quarterly Progress</span>${renderOperationsTargetProgress(metric, metric.currentValue, operationsPeriod.startDate, operationsPeriod.endDate, "Quarter Target") || `<small>No quarterly target progress yet.</small>`}</div>
        <div><span>Year-to-Date Progress</span>${renderOperationsTargetProgress(metric, metric.ytdValue, ytdStartDate, annualPacingDate, "YTD Target") || `<small>No year-to-date target progress yet.</small>`}</div>
      </div>
    </section>
    <section class="operations-detail-section">
      <header><h3>Baseline and Targets</h3></header>
      <div class="operations-target-grid">
        ${renderOperationsTargetValue("Baseline", metric.baselineYear, metric.baselineValue, metric)}
        ${renderOperationsTargetValue("Annual Target", metric.annualTargetYear, metric.annualTargetValue, metric)}
        ${renderOperationsTargetValue("Three-Year Target", metric.threeYearTargetYear, metric.threeYearTargetValue, metric)}
      </div>
      ${targetHistory.length ? `<p class="operations-history-note">${targetHistory.length} previous target version${targetHistory.length === 1 ? "" : "s"} retained.</p>` : ""}
    </section>
    <details class="operations-detail-disclosure">
      <summary>Definition</summary>
      <div>
        <p class="operations-definition">${escapeHtml(metric.definition)}</p>
        <dl class="operations-definition-grid">
          <div class="is-wide"><dt>Logic Model Outcome</dt><dd>${escapeHtml(metric.logicModelOutcome || "Not linked")}</dd></div>
          <div><dt>Unit</dt><dd>${escapeHtml(metric.unit)}</dd></div>
          <div><dt>Category</dt><dd>${escapeHtml(metric.category)}</dd></div>
          <div><dt>Owner</dt><dd>${escapeHtml(metric.responsibleStaffMember || "-")}</dd></div>
          <div><dt>Target Direction</dt><dd>${escapeHtml(metric.performanceDirection)}</dd></div>
        </dl>
        ${metric.calculationNotes ? `<p class="operations-note"><strong>Calculation:</strong> ${escapeHtml(metric.calculationNotes)}</p>` : ""}
        ${metric.notes ? `<p class="operations-note">${escapeHtml(metric.notes)}</p>` : ""}
      </div>
    </details>
    <details class="operations-detail-disclosure">
      <summary>Collection and Reporting</summary>
      <div><dl class="operations-definition-grid">
        <div><dt>Data Source</dt><dd>${escapeHtml(metric.dataSource || "Not recorded")}</dd></div>
        <div><dt>Collection Frequency</dt><dd>${escapeHtml(metric.collectionFrequency || "Not recorded")}</dd></div>
        <div class="is-wide"><dt>Collection Method</dt><dd>${escapeHtml(metric.collectionMethod || "Not recorded")}</dd></div>
        <div><dt>Reporting Frequency</dt><dd>${escapeHtml(metric.reportingFrequency)}</dd></div>
        <div><dt>Configuration</dt><dd>${escapeHtml(metric.calculationMode)}</dd></div>
      </dl></div>
    </details>
    <details class="operations-detail-disclosure">
      <summary>Activity</summary>
      <div class="operations-history-list">
        ${historyRows.map((row) => `
          <div class="operations-activity-row">
            <span><strong>${escapeHtml(row.date)}</strong><small>${escapeHtml(row.note)}</small></span>
            <span class="operations-activity-value">
              <strong>${escapeHtml(formatOperationsValue(metric, row.value))}</strong>
            </span>
          </div>
        `).join("") || `<p class="operations-empty">No values have been logged yet.</p>`}
      </div>
    </details>
  `;
}

function renderOperationsOptionList(options, current) {
  return options.map((option) => `<option value="${escapeHtml(option)}" ${option === current ? "selected" : ""}>${escapeHtml(option)}</option>`).join("");
}

function renderOperationsMetricEditor(metric) {
  const categoryOptions = ["Output", "Outcome", "Operational KPI", "Financial KPI", "Equity KPI", "Partnership KPI"];
  const unitOptions = ["Count", "Percentage", "Days", "Dollars", "Average", "Score"];
  return `
    <form class="operations-editor-form" data-operations-definition-form data-metric-key="${escapeHtml(metric.metricKey)}">
      <div class="operations-editor-heading">
        <div><span>${escapeHtml(operationsProgramAreaLabel(metric.programArea))}</span><h2>Edit Measure</h2></div>
        <button data-operations-cancel-editor type="button">Cancel</button>
      </div>
      <section>
        <h3>Measure</h3>
        <div class="operations-form-grid">
          <label class="is-wide"><span>Name</span><input name="name" value="${escapeHtml(metric.name)}" required></label>
          <label><span>Program Area</span><select name="programArea">${operationsProgramAreas.map((area) => `<option value="${escapeHtml(area)}" ${area === metric.programArea ? "selected" : ""}>${escapeHtml(operationsProgramAreaLabel(area))}</option>`).join("")}</select></label>
          <label><span>Category</span><select name="category">${renderOperationsOptionList(categoryOptions, metric.category)}</select></label>
          <label class="is-wide"><span>Definition</span><textarea name="definition" rows="3" required>${escapeHtml(metric.definition)}</textarea></label>
          <label class="is-wide"><span>Logic Model Outcome</span><input name="logicModelOutcome" value="${escapeHtml(metric.logicModelOutcome || "")}"></label>
          <label class="is-wide"><span>Calculation Notes</span><textarea name="calculationNotes" rows="2">${escapeHtml(metric.calculationNotes || "")}</textarea></label>
          <label><span>Unit</span><select name="unit">${renderOperationsOptionList(unitOptions, metric.unit)}</select></label>
          <label><span>Calculation</span><select name="calculationMode">${renderOperationsOptionList(operationsCalculationModes, metric.calculationMode)}</select></label>
          <label><span>Data Source</span><input name="dataSource" value="${escapeHtml(metric.dataSource)}"></label>
          <label><span>Target Direction</span><select name="performanceDirection">${renderOperationsOptionList(operationsDirections, metric.performanceDirection)}</select></label>
          <input name="sourceKey" type="hidden" value="${escapeHtml(metric.sourceKey)}">
        </div>
      </section>
      <section>
        <h3>Baseline and Targets</h3>
        <div class="operations-target-form-grid">
          <label><span>Baseline Year</span><input name="baselineYear" type="number" value="${escapeHtml(metric.baselineYear ?? "")}"></label>
          <label><span>Baseline Value</span><input name="baselineValue" type="number" step="any" value="${escapeHtml(metric.baselineValue ?? "")}"></label>
          <label><span>Annual Target Year</span><input name="annualTargetYear" type="number" value="${escapeHtml(metric.annualTargetYear ?? "")}"></label>
          <label><span>Annual Target Value</span><input name="annualTargetValue" type="number" step="any" value="${escapeHtml(metric.annualTargetValue ?? "")}"></label>
          <label><span>Three-Year Target Year</span><input name="threeYearTargetYear" type="number" value="${escapeHtml(metric.threeYearTargetYear ?? "")}"></label>
          <label><span>Three-Year Target Value</span><input name="threeYearTargetValue" type="number" step="any" value="${escapeHtml(metric.threeYearTargetValue ?? "")}"></label>
        </div>
      </section>
      <section>
        <h3>Collection and Reporting</h3>
        <div class="operations-form-grid">
          <label><span>Collection Frequency</span><select name="collectionFrequency">${renderOperationsOptionList(operationsReportingFrequencies, metric.collectionFrequency || "Quarterly")}</select></label>
          <label><span>Reporting Frequency</span><select name="reportingFrequency">${renderOperationsOptionList(operationsReportingFrequencies, metric.reportingFrequency)}</select></label>
          <label class="is-wide"><span>Collection Method</span><textarea name="collectionMethod" rows="2">${escapeHtml(metric.collectionMethod || "")}</textarea></label>
          <label><span>Responsible Staff Person</span><input name="responsibleStaffMember" value="${escapeHtml(metric.responsibleStaffMember)}"></label>
          <label class="is-wide"><span>Notes</span><textarea name="notes" rows="2">${escapeHtml(metric.notes)}</textarea></label>
          <label class="operations-checkbox"><input name="dashboard" type="checkbox" ${metric.dashboard ? "checked" : ""}><span>Show on Dashboard</span></label>
        </div>
      </section>
      <p class="schedule-action-status" data-operations-action-status role="status" aria-live="polite"></p>
      <div class="operations-editor-footer"><button type="submit">Save Measure</button></div>
    </form>
  `;
}

function renderOperationsMeasurementEditor(metric, measurement = null) {
  const measurementDate = measurement
    ? measurement.periodEnd
    : operationsDefaultMeasurementDate();
  return `
    <form class="operations-editor-form is-measurement" data-operations-measurement-form data-metric-key="${escapeHtml(metric.metricKey)}" ${measurement ? `data-measurement-id="${escapeHtml(measurement.id)}"` : ""}>
      <div class="operations-editor-heading">
        <div><span>${escapeHtml(operationsProgramAreaLabel(metric.programArea))}</span><h2>${measurement ? "Edit Logged Value" : "Log Manual Value"}</h2></div>
        <button data-operations-cancel-editor type="button">Cancel</button>
      </div>
      <section>
        <h3>${escapeHtml(metric.name)}</h3>
        <p>${escapeHtml(metric.definition)}</p>
        <div class="operations-form-grid">
          <label><span>Date</span><input name="measurementDate" type="date" value="${escapeHtml(measurementDate)}" required></label>
          <label><span>Value (${escapeHtml(metric.unit)})</span><input name="value" type="number" step="any" value="${escapeHtml(measurement?.value ?? "")}" required></label>
          <label class="is-wide"><span>Source Note</span><textarea name="note" rows="3">${escapeHtml(measurement?.note || metric.measurementNote || "")}</textarea></label>
        </div>
      </section>
      <p class="schedule-action-status" data-operations-action-status role="status" aria-live="polite"></p>
      <div class="operations-editor-footer"><button type="submit">Save Value</button></div>
    </form>
  `;
}

function renderOperationsQuickMeasurementEditor() {
  const manualMetrics = operationsCoreMetrics(operationsMetrics)
    .filter((metric) => metric.calculationMode === "Manual")
    .sort((first, second) => first.programArea.localeCompare(second.programArea) || first.name.localeCompare(second.name));
  const optionsByArea = operationsProgramAreas.map((area) => {
    const options = manualMetrics.filter((metric) => metric.programArea === area);
    if (!options.length) return "";
    return `<optgroup label="${escapeHtml(operationsProgramAreaLabel(area))}">${options.map((metric) => `<option value="${escapeHtml(metric.metricKey)}">${escapeHtml(metric.name)}</option>`).join("")}</optgroup>`;
  }).join("");
  return `
    <form class="operations-editor-form is-measurement" data-operations-measurement-form>
      <div class="operations-editor-heading">
        <div><span>Performance</span><h2>Log a Reporting Value</h2></div>
        <button data-operations-cancel-editor type="button">Cancel</button>
      </div>
      <section>
        <p>Choose any measure that needs a staff-entered value. Automatic measures update from their source records.</p>
        <div class="operations-form-grid">
          <label class="is-wide"><span>Measure</span><select name="metricKey" required>${optionsByArea}</select></label>
          <label><span>Date</span><input name="measurementDate" type="date" value="${escapeHtml(operationsDefaultMeasurementDate())}" required></label>
          <label><span>Value</span><input name="value" type="number" step="any" required></label>
          <label class="is-wide"><span>Source Note</span><textarea name="note" rows="3"></textarea></label>
        </div>
      </section>
      <p class="schedule-action-status" data-operations-action-status role="status" aria-live="polite"></p>
      <div class="operations-editor-footer"><button type="submit">Save Value</button></div>
    </form>
  `;
}

function renderOperationsPerformance() {
  const allAreaMetrics = operationsMetricsForArea(operationsMetrics, operationsProgramArea)
    .filter((metric) => operationsMetricMatches(metric, operationsSearchQuery));
  const areaMetrics = operationsShowFutureMeasures ? allAreaMetrics : operationsCoreMetrics(allAreaMetrics);
  const futureMeasureCount = allAreaMetrics.filter((metric) => metric.trackingTier === "Future").length;
  if (!areaMetrics.some((metric) => metric.metricKey === operationsSelectedMetricKey)) {
    operationsSelectedMetricKey = areaMetrics[0]?.metricKey || "";
  }
  const selected = operationsSelectedMetric();
  return `
    ${renderOperationsPeriodControls()}
    <div class="operations-area-tabs" role="tablist" aria-label="Performance areas">
      ${operationsProgramAreas.map((area) => `<button class="${area === operationsProgramArea ? "is-active" : ""}" data-operations-area="${escapeHtml(area)}" type="button">${escapeHtml(operationsProgramAreaLabel(area))}</button>`).join("")}
    </div>
    <section class="operations-performance-workspace">
      <aside class="operations-metric-list">
        <div class="operations-metric-list-heading">
          <div><h2>${escapeHtml(operationsProgramAreaLabel(operationsProgramArea))}</h2><span>${areaMetrics.length} ${operationsShowFutureMeasures ? "" : "core "}measure${areaMetrics.length === 1 ? "" : "s"}</span></div>
          <label><span class="sr-only">Search measures</span><input data-operations-search type="search" value="${escapeHtml(operationsSearchQuery)}" placeholder="Search measures"></label>
          ${futureMeasureCount ? `<label class="operations-future-toggle"><input data-operations-toggle-future type="checkbox" ${operationsShowFutureMeasures ? "checked" : ""}><span>Show future measures (${escapeHtml(futureMeasureCount)})</span></label>` : ""}
        </div>
        <div class="operations-metric-rows">
          ${areaMetrics.map((metric) => `
            <button class="${metric.metricKey === operationsSelectedMetricKey ? "is-selected" : ""}" data-operations-select-metric="${escapeHtml(metric.metricKey)}" type="button">
              <span><strong>${escapeHtml(metric.name)}</strong><small>${escapeHtml(metric.category)}</small></span>
              <span><strong>${escapeHtml(formatOperationsValue(metric))}</strong>${renderOperationsStatus(metric.calculationMode)}</span>
            </button>
          `).join("") || `<p class="operations-empty">No measures match this search.</p>`}
        </div>
      </aside>
      <article class="operations-metric-detail">
        ${operationsEditorMode === "quick-measurement"
          ? renderOperationsQuickMeasurementEditor()
          : operationsEditorMode === "definition" && selected
          ? renderOperationsMetricEditor(selected)
          : operationsEditorMode === "measurement" && selected
            ? renderOperationsMeasurementEditor(selected, operationsMeasurements.find((measurement) => measurement.id === operationsEditingMeasurementId) || null)
            : renderOperationsMetricDetail(selected)}
      </article>
    </section>
  `;
}

function operationsEvaluationMetricLabel(metricKey) {
  return operationsMetrics.find((metric) => metric.metricKey === metricKey)?.name || metricKey;
}

function operationsEvaluationQuestionForEditor() {
  if (operationsEvaluationEditingId === "__new__") {
    return {
      id: "",
      instrumentId: "",
      instrument: operationsEvaluationFilters.includes(operationsEvaluationFilter) && !["All Questions", "Measurement Gaps"].includes(operationsEvaluationFilter)
        ? operationsEvaluationFilter === "Questionnaire"
          ? "Nutrition & Healthy Habits Questionnaire"
          : operationsEvaluationFilter
        : "Nutrition & Healthy Habits Questionnaire",
      version: "Draft",
      question: "",
      topic: "",
      respondentType: "Child or Caregiver",
      administrationPoint: "Pre / Post / Follow-Up",
      responseType: "",
      logicModelOutcome: "",
      metricKeys: [],
      mappingStatus: "Needs Review",
      recordStatus: "Draft",
      required: false,
      sortOrder: null,
      scoringRule: "Not Configured",
      responseOptions: [],
      note: ""
    };
  }
  return operationsEvaluationQuestions.find((question) => question.id === operationsEvaluationEditingId) || null;
}

function renderOperationsEvaluationMetricPicker(question) {
  return operationsProgramAreas.map((area) => {
    const metrics = operationsMetricsForArea(operationsMetrics, area);
    if (!metrics.length) return "";
    return `
      <section>
        <h4>${escapeHtml(operationsProgramAreaLabel(area))}</h4>
        <div>
          ${metrics.map((metric) => `
            <label>
              <input name="metricKeys" type="checkbox" value="${escapeHtml(metric.metricKey)}" ${(question.metricKeys || []).includes(metric.metricKey) ? "checked" : ""}>
              <span>${escapeHtml(metric.name)}</span>
            </label>
          `).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function renderOperationsEvaluationEditor(question) {
  const isNew = operationsEvaluationEditingId === "__new__";
  const instruments = [...new Set([
    ...defaultOperationsEvaluationQuestions.map((item) => item.instrument),
    ...operationsEvaluationInstruments.map((item) => item.name)
  ])];
  return `
    <form class="operations-evaluation-editor" data-operations-evaluation-question-form>
      <div class="operations-evaluation-editor-heading">
        <div><span>${isNew ? "New Questionnaire Item" : escapeHtml(question.id)}</span><h3>${isNew ? "Add Question" : "Edit Question"}</h3></div>
        <button data-operations-cancel-question type="button">Cancel</button>
      </div>
      <div class="operations-evaluation-editor-grid">
        <label><span>Question ID</span><input name="id" type="text" value="${escapeHtml(question.id)}" pattern="[A-Za-z0-9][A-Za-z0-9._-]{0,79}" ${isNew ? "" : "readonly"} required></label>
        <label><span>Instrument Version</span><select name="instrumentId"><option value="">Not Linked</option>${operationsEvaluationInstruments.map((instrument) => `<option value="${escapeHtml(instrument.id)}" ${instrument.id === question.instrumentId ? "selected" : ""}>${escapeHtml(instrument.name)} · ${escapeHtml(instrument.version)} · ${escapeHtml(instrument.status)}</option>`).join("")}</select></label>
        <label><span>Instrument</span><input name="instrument" type="text" list="operations-evaluation-instruments" value="${escapeHtml(question.instrument)}" required></label>
        <datalist id="operations-evaluation-instruments">${instruments.map((instrument) => `<option value="${escapeHtml(instrument)}"></option>`).join("")}</datalist>
        <label><span>Version</span><input name="version" type="text" value="${escapeHtml(question.version)}"></label>
        <label><span>Topic</span><input name="topic" type="text" value="${escapeHtml(question.topic)}"></label>
        <label class="is-wide"><span>Question</span><textarea name="question" rows="3" required>${escapeHtml(question.question)}</textarea></label>
        <label><span>Respondent Type</span><input name="respondentType" type="text" value="${escapeHtml(question.respondentType)}"></label>
        <label><span>Administration Point</span><input name="administrationPoint" type="text" value="${escapeHtml(question.administrationPoint)}"></label>
        <label><span>Response Type</span><input name="responseType" type="text" value="${escapeHtml(question.responseType)}"></label>
        <label><span>Mapping Status</span><select name="mappingStatus">${operationsEvaluationMappingStatuses.map((status) => `<option ${status === question.mappingStatus ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}</select></label>
        <label><span>Record Status</span><select name="recordStatus">${operationsEvaluationRecordStatuses.map((status) => `<option ${status === question.recordStatus ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}</select></label>
        <label><span>Display Order</span><input name="sortOrder" type="number" min="0" step="1" value="${question.sortOrder ?? ""}"></label>
        <label class="is-wide"><span>Scoring Rule</span><input name="scoringRule" type="text" value="${escapeHtml(question.scoringRule || "Not Configured")}"></label>
        <label class="is-wide"><span>Response Options</span><textarea name="responseOptions" rows="3" placeholder="One option per line">${escapeHtml((question.responseOptions || []).join("\n"))}</textarea></label>
        <label class="operations-evaluation-required"><input name="required" type="checkbox" ${question.required ? "checked" : ""}><span>Required when this version is active</span></label>
        <label class="is-wide"><span>Logic Model Outcome</span><textarea name="logicModelOutcome" rows="2">${escapeHtml(question.logicModelOutcome)}</textarea></label>
        <label class="is-wide"><span>Notes</span><textarea name="note" rows="2">${escapeHtml(question.note)}</textarea></label>
      </div>
      <fieldset class="operations-evaluation-metric-picker">
        <legend>Linked Measures</legend>
        <div>${renderOperationsEvaluationMetricPicker(question)}</div>
      </fieldset>
      <p class="schedule-action-status" data-operations-action-status role="status" aria-live="polite"></p>
      <div class="operations-evaluation-editor-footer">
        <button data-operations-cancel-question type="button">Cancel</button>
        <button type="submit">Save Question</button>
      </div>
    </form>
  `;
}

function renderOperationsEvaluationQuestion(question) {
  return `
    <article class="operations-evaluation-row">
      <div class="operations-evaluation-id">
        <strong>${escapeHtml(question.id)}</strong>
        <span>${escapeHtml(question.topic)}</span>
      </div>
      <div class="operations-evaluation-question">
        <strong>${escapeHtml(question.question)}</strong>
        <span>${escapeHtml(question.instrument)} · ${escapeHtml(question.administrationPoint)} · ${escapeHtml(question.responseType)}</span>
        <small>${escapeHtml(question.logicModelOutcome)}</small>
      </div>
      <div class="operations-evaluation-links">
        ${(question.metricKeys || []).map((metricKey) => `
          <button data-operations-open-metric="${escapeHtml(metricKey)}" type="button">${escapeHtml(operationsEvaluationMetricLabel(metricKey))}</button>
        `).join("")}
      </div>
      <div class="operations-evaluation-state">
        ${renderOperationsStatus(question.recordStatus || "Draft", question.recordStatus || "Draft")}
        ${renderOperationsStatus(question.mappingStatus, question.mappingStatus)}
        <small>${escapeHtml(question.note)}</small>
        <button data-operations-edit-question="${escapeHtml(question.id)}" type="button">Edit</button>
      </div>
    </article>
  `;
}

function renderOperationsEvaluationGap(gap) {
  const metric = operationsMetrics.find((item) => item.metricKey === gap.metricKey);
  return `
    <article class="operations-evaluation-gap">
      <span>${escapeHtml(gap.programArea)}</span>
      <div>
        <strong>${escapeHtml(metric?.name || gap.metricKey)}</strong>
        <p>${escapeHtml(gap.need)}</p>
      </div>
      <button data-operations-open-metric="${escapeHtml(gap.metricKey)}" type="button">Open Measure</button>
    </article>
  `;
}

function operationsEvaluationInstrumentForEditor() {
  if (operationsEvaluationInstrumentEditingId === "__new__") {
    return {
      id: "",
      name: "",
      version: "Draft",
      effectiveDate: "",
      programArea: "Clinic",
      status: "Draft",
      description: "",
      administrationPoints: ["Enrollment", "Graduation"],
      languages: ["English"],
      notes: ""
    };
  }
  return operationsEvaluationInstruments.find((instrument) => instrument.id === operationsEvaluationInstrumentEditingId) || null;
}

function renderOperationsEvaluationInstrumentEditor(instrument) {
  const isNew = operationsEvaluationInstrumentEditingId === "__new__";
  return `
    <form class="operations-evaluation-editor operations-evaluation-instrument-editor" data-operations-evaluation-instrument-form>
      <div class="operations-evaluation-editor-heading">
        <div><span>${isNew ? "New Version Record" : escapeHtml(instrument.id)}</span><h3>${isNew ? "Add Instrument Version" : "Edit Instrument Version"}</h3></div>
        <button data-operations-cancel-instrument type="button">Cancel</button>
      </div>
      <div class="operations-evaluation-editor-grid">
        <label><span>Instrument ID</span><input name="id" type="text" value="${escapeHtml(instrument.id)}" pattern="[A-Za-z0-9][A-Za-z0-9._-]{0,79}" ${isNew ? "" : "readonly"} required></label>
        <label><span>Program Area</span><select name="programArea">${operationsProgramAreas.map((area) => `<option value="${escapeHtml(area)}" ${area === instrument.programArea ? "selected" : ""}>${escapeHtml(operationsProgramAreaLabel(area))}</option>`).join("")}</select></label>
        <label><span>Name</span><input name="name" type="text" value="${escapeHtml(instrument.name)}" required></label>
        <label><span>Version</span><input name="version" type="text" value="${escapeHtml(instrument.version)}" required></label>
        <label><span>Effective Date</span><input name="effectiveDate" type="date" value="${escapeHtml(instrument.effectiveDate || "")}"></label>
        <label><span>Status</span><select name="status">${operationsEvaluationRecordStatuses.map((status) => `<option ${status === instrument.status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}</select></label>
        <label><span>Administration Points</span><input name="administrationPoints" type="text" value="${escapeHtml((instrument.administrationPoints || []).join(", "))}"></label>
        <label><span>Languages</span><input name="languages" type="text" value="${escapeHtml((instrument.languages || []).join(", "))}"></label>
        <label class="is-wide"><span>Description</span><textarea name="description" rows="2">${escapeHtml(instrument.description)}</textarea></label>
        <label class="is-wide"><span>Notes</span><textarea name="notes" rows="2">${escapeHtml(instrument.notes)}</textarea></label>
      </div>
      <p class="schedule-action-status" data-operations-action-status role="status" aria-live="polite"></p>
      <div class="operations-evaluation-editor-footer">
        <button data-operations-cancel-instrument type="button">Cancel</button>
        <button type="submit">Save Version</button>
      </div>
    </form>
  `;
}

function renderOperationsEvaluationVersions() {
  const ordered = [...operationsEvaluationInstruments].sort((first, second) => (
    first.name.localeCompare(second.name) || first.version.localeCompare(second.version)
  ));
  const editor = operationsEvaluationInstrumentForEditor();
  return `
    <section class="operations-evaluation-versions">
      <header>
        <div><h3>Instrument Versions</h3><p>Version and status records only. Draft content does not calculate performance results.</p></div>
        <button data-operations-new-instrument type="button">New Version</button>
      </header>
      ${editor ? renderOperationsEvaluationInstrumentEditor(editor) : `
        <div class="operations-evaluation-version-list">
          ${ordered.map((instrument) => {
            const questionCount = operationsAllEvaluationQuestions.filter((question) => (
              question.instrumentId === instrument.id
              || (!question.instrumentId && question.instrument === instrument.name && question.version === instrument.version)
            )).length;
            const responseCount = operationsEvaluationResponses.filter((item) => item.instrumentId === instrument.id).length;
            return `
              <article>
                <div><strong>${escapeHtml(instrument.name)}</strong><span>${escapeHtml(instrument.version)} · ${escapeHtml(operationsProgramAreaLabel(instrument.programArea))}</span></div>
                <div><strong>${escapeHtml(questionCount)}</strong><span>Questions</span></div>
                <div><strong>${escapeHtml(responseCount)}</strong><span>Responses</span></div>
                ${renderOperationsStatus(instrument.status, instrument.status)}
                <button data-operations-edit-instrument="${escapeHtml(instrument.id)}" type="button">Edit</button>
              </article>
            `;
          }).join("") || `<p class="operations-empty">No saved version records yet. Current questionnaire items remain drafts.</p>`}
        </div>
      `}
    </section>
  `;
}

function renderOperationsEvaluation() {
  const summary = operationsEvaluationSummary(operationsEvaluationQuestions, operationsEvaluationMetricGaps);
  const showGaps = operationsEvaluationFilter === "Measurement Gaps";
  const visibleQuestions = showGaps
    ? []
    : operationsEvaluationQuestionsForFilter(
        operationsEvaluationQuestions,
        operationsEvaluationFilter,
        operationsEvaluationSearchQuery
      );
  const visibleGaps = operationsEvaluationMetricGaps.filter((gap) => {
    if (!operationsEvaluationSearchQuery) return true;
    const query = operationsEvaluationSearchQuery.toLowerCase();
    return [gap.programArea, gap.metricKey, gap.need, operationsEvaluationMetricLabel(gap.metricKey)]
      .some((value) => String(value || "").toLowerCase().includes(query));
  });
  return `
    <section class="operations-evaluation-surface">
      <header>
        <div>
          <h2>Survey Mapping</h2>
          <p>A draft bridge from the current evaluation tools to the logic model and core performance measures.</p>
        </div>
        <div class="operations-evaluation-header-actions">
          <button data-operations-evaluation-filter="Measurement Gaps" type="button">${escapeHtml(summary.gapCount)} Measurement Gaps</button>
          <button data-operations-new-question type="button">New Question</button>
        </div>
      </header>
      ${renderOperationsEvaluationVersions()}
      <div class="operations-evaluation-summary" aria-label="Evaluation mapping summary">
        <button data-operations-evaluation-filter="All Questions" type="button"><strong>${escapeHtml(summary.instrumentCount)}</strong><span>Current Instruments</span></button>
        <button data-operations-evaluation-filter="All Questions" type="button"><strong>${escapeHtml(summary.questionCount)}</strong><span>Current Questions</span></button>
        <button data-operations-evaluation-filter="All Questions" type="button"><strong>${escapeHtml(summary.mappedCount)}</strong><span>Linked to Measures</span></button>
        <button data-operations-evaluation-filter="Measurement Gaps" type="button"><strong>${escapeHtml(summary.gapCount)}</strong><span>Measurement Gaps</span></button>
      </div>
      <div class="operations-evaluation-toolbar">
        <div role="tablist" aria-label="Evaluation mapping filters">
          ${operationsEvaluationFilters.map((filter) => `
            <button class="${filter === operationsEvaluationFilter ? "is-active" : ""}" data-operations-evaluation-filter="${escapeHtml(filter)}" type="button">${escapeHtml(filter)}</button>
          `).join("")}
        </div>
        <label><span class="sr-only">Search survey mapping</span><input data-operations-evaluation-search type="search" value="${escapeHtml(operationsEvaluationSearchQuery)}" placeholder="Search questions or measures"></label>
      </div>
      ${showGaps ? `
        <div class="operations-evaluation-gap-list">
          <div class="operations-evaluation-list-heading"><strong>Core Measures Waiting for an Instrument or Rule</strong><span>${escapeHtml(visibleGaps.length)} items</span></div>
          ${visibleGaps.map(renderOperationsEvaluationGap).join("") || `<p class="operations-empty">No measurement gaps match this search.</p>`}
        </div>
      ` : `
        <div class="operations-evaluation-table">
          <div class="operations-evaluation-list-heading"><strong>${escapeHtml(operationsEvaluationFilter)}</strong><span>${escapeHtml(visibleQuestions.length)} questions</span></div>
          ${operationsEvaluationEditingId === "__new__" ? renderOperationsEvaluationEditor(operationsEvaluationQuestionForEditor()) : ""}
          ${visibleQuestions.map((question) => question.id === operationsEvaluationEditingId
            ? renderOperationsEvaluationEditor(question)
            : renderOperationsEvaluationQuestion(question)).join("") || (operationsEvaluationEditingId === "__new__" ? "" : `<p class="operations-empty">No questionnaire items match this search.</p>`)}
        </div>
      `}
      <footer>
        <strong>Still awaiting decisions</strong>
        <span>Future Clinic, School, Kitchen, and Community instruments remain listed under Measurement Gaps until their questions and scoring rules are approved.</span>
      </footer>
    </section>
  `;
}

function selectedOperationsHrsnClaim() {
  return operationsHrsnClaims.find((claim) => claim.id === operationsSelectedHrsnClaimId) || null;
}

function selectedOperationsBudgetCategory() {
  return operationsBudgetCategories.find((category) => category.id === operationsSelectedBudgetCategoryId) || null;
}

function renderOperationsRecordSummary(items) {
  return `
    <div class="operations-record-summary" aria-label="Section summary">
      ${items.map(([value, label]) => `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}
    </div>
  `;
}

function hrsnClaimSelections(claim = {}, pluralKey, legacyKey) {
  if (Array.isArray(claim[pluralKey])) return claim[pluralKey];
  return claim[legacyKey] ? [claim[legacyKey]] : [];
}

function renderHrsnMultiPicker({ label, name, options, selected = [] }) {
  const summary = selected.length ? selected.join(", ") : `Choose ${label.toLowerCase()}`;
  return `
    <div class="is-wide operations-multi-picker-label">
      <span>${escapeHtml(label)}</span>
      <details class="operations-multi-picker">
        <summary>${escapeHtml(summary)}</summary>
        <div>${options.map((option) => `
          <label><input name="${escapeHtml(name)}" type="checkbox" value="${escapeHtml(option)}" ${selected.includes(option) ? "checked" : ""}><span>${escapeHtml(option)}</span></label>
        `).join("")}</div>
      </details>
    </div>
  `;
}

function renderHrsnClaimEditor(claim = null) {
  const value = claim || {
    submitted: false,
    approved: false,
    approvalDate: "",
    clientId: "",
    name: "",
    dateOfBirth: "",
    medicaidId: "",
    address: "",
    serviceDate: "",
    durationMinutes: 15,
    amount: "",
    coveredPopulations: [],
    foodSecurityScore: 0,
    descriptions: [hrsnDescriptionOptions[0]],
    outcomes: ["None"],
    invoiceNumber: "",
    notes: ""
  };
  const selectedDescriptions = hrsnClaimSelections(value, "descriptions", "description");
  const selectedOutcomes = hrsnClaimSelections(value, "outcomes", "outcome");
  return `
    <form class="operations-record-editor operations-editor-form" data-operations-hrsn-form ${claim ? `data-claim-id="${escapeHtml(claim.id)}"` : ""}>
      <header class="operations-record-editor-heading">
        <div><span>HRSN Billing</span><h2>${claim ? "Edit Billing Record" : "New Billing Record"}</h2></div>
        <button data-operations-hrsn-cancel type="button">Cancel</button>
      </header>
      <section>
        <h3>Member and Eligibility</h3>
        <div class="operations-form-grid">
          <label class="is-wide"><span>Linked Client <small>Optional</small></span><select name="clientId" data-operations-hrsn-client>
            <option value="">Not Linked</option>
            ${operationsHrsnClientOptions.map((client) => `<option value="${escapeHtml(client.id)}" ${client.id === value.clientId ? "selected" : ""}>${escapeHtml(client.name)}</option>`).join("")}
          </select></label>
          <label><span>Name</span><input name="name" type="text" value="${escapeHtml(value.name)}" autocomplete="off" required></label>
          <label><span>Date of Birth</span><input name="dateOfBirth" type="date" value="${escapeHtml(value.dateOfBirth)}" required></label>
          <label><span>Medicaid Number</span><input name="medicaidId" type="text" value="${escapeHtml(value.medicaidId)}" autocomplete="off" required></label>
          <label><span>Food Security Score</span><select name="foodSecurityScore" required>${Array.from({ length: 7 }, (_, score) => `<option value="${score}" ${Number(value.foodSecurityScore) === score ? "selected" : ""}>${score}</option>`).join("")}</select></label>
          <label class="is-wide"><span>Address</span><input name="address" type="text" value="${escapeHtml(value.address)}" autocomplete="off" required></label>
        </div>
        <fieldset class="operations-option-fieldset">
          <legend>Covered Population</legend>
          <div>${hrsnCoveredPopulationOptions.map((option) => `<label><input name="coveredPopulations" type="checkbox" value="${escapeHtml(option)}" ${(value.coveredPopulations || []).includes(option) ? "checked" : ""}><span>${escapeHtml(option)}</span></label>`).join("")}</div>
        </fieldset>
      </section>
      <section>
        <h3>Service and Billing</h3>
        <div class="operations-form-grid">
          <label><span>Date of Service</span><input name="serviceDate" type="date" value="${escapeHtml(value.serviceDate)}" required></label>
          <label><span>Duration</span><input name="durationMinutes" type="number" min="15" step="15" value="${escapeHtml(value.durationMinutes)}" required></label>
          <label><span>Dollar Amount</span><input name="amount" type="number" min="0" step="0.01" value="${escapeHtml(value.amount)}" required></label>
          <label><span>Approval Date <small>Automatic when approved</small></span><input name="approvalDate" type="date" value="${escapeHtml(value.approvalDate || "")}"></label>
          ${renderHrsnMultiPicker({ label: "Outcome", name: "outcomes", options: hrsnOutcomeOptions, selected: selectedOutcomes })}
          ${renderHrsnMultiPicker({ label: "Description", name: "descriptions", options: hrsnDescriptionOptions, selected: selectedDescriptions })}
          <label class="is-wide"><span>Invoice Number</span><input name="invoiceNumber" type="text" value="${escapeHtml(value.invoiceNumber)}" autocomplete="off"></label>
          <label class="is-wide"><span>Notes <small>Optional</small></span><textarea name="notes" rows="2">${escapeHtml(value.notes)}</textarea></label>
        </div>
        <div class="operations-record-checks">
          <label><input name="submitted" type="checkbox" ${value.submitted ? "checked" : ""}><span>Submitted</span></label>
          <label><input name="approved" type="checkbox" ${value.approved ? "checked" : ""}><span>Approved</span></label>
        </div>
      </section>
      <p class="schedule-action-status" data-operations-action-status role="status" aria-live="polite"></p>
      <footer><button data-operations-hrsn-cancel type="button">Cancel</button><button type="submit">Save Billing Record</button></footer>
    </form>
  `;
}

function renderHrsnClaimDetail(claim) {
  if (!claim) {
    return `<div class="operations-record-empty"><h2>No Billing Record Selected</h2><p>Choose a record or add a new one.</p><button data-operations-hrsn-new type="button">New Billing Record</button></div>`;
  }
  const status = hrsnClaimStatus(claim);
  const descriptions = hrsnClaimSelections(claim, "descriptions", "description");
  const outcomes = hrsnClaimSelections(claim, "outcomes", "outcome");
  const confirmDelete = operationsHrsnDeletePendingId === claim.id;
  return `
    <article class="operations-record-detail">
      <header>
        <div>${renderOperationsStatus(status, status)}<h2>${escapeHtml(claim.name)}</h2><span>${escapeHtml(operationsPeriodLabel(claim.serviceDate, claim.serviceDate))}</span></div>
        <button data-operations-hrsn-edit type="button">Edit</button>
      </header>
      <section>
        <h3>Member and Eligibility</h3>
        <dl class="operations-record-fields">
          <div><dt>Date of Birth</dt><dd>${escapeHtml(operationsPeriodLabel(claim.dateOfBirth, claim.dateOfBirth))}</dd></div>
          <div><dt>Medicaid Number</dt><dd>${escapeHtml(claim.medicaidId || "-")}</dd></div>
          <div class="is-wide"><dt>Address</dt><dd>${escapeHtml(claim.address || "-")}</dd></div>
          <div><dt>Food Security Score</dt><dd>${escapeHtml(claim.foodSecurityScore)}</dd></div>
          <div class="is-wide"><dt>Covered Population</dt><dd>${escapeHtml((claim.coveredPopulations || []).join(", ") || "-")}</dd></div>
        </dl>
      </section>
      <section>
        <h3>Service and Billing</h3>
        <dl class="operations-record-fields">
          <div><dt>Date of Service</dt><dd>${escapeHtml(operationsPeriodLabel(claim.serviceDate, claim.serviceDate))}</dd></div>
          <div><dt>Duration</dt><dd>${escapeHtml(claim.durationMinutes)} minutes</dd></div>
          <div><dt>Dollar Amount</dt><dd>${escapeHtml(formatGrantMoney(claim.amount, "$0"))}</dd></div>
          <div><dt>Approval Date</dt><dd>${escapeHtml(claim.approvalDate ? operationsPeriodLabel(claim.approvalDate, claim.approvalDate) : "-")}</dd></div>
          <div class="is-wide"><dt>Outcome</dt><dd>${escapeHtml(outcomes.join(", ") || "-")}</dd></div>
          <div class="is-wide"><dt>Description</dt><dd>${escapeHtml(descriptions.join(", ") || "-")}</dd></div>
          <div class="is-wide"><dt>Invoice Number</dt><dd>${escapeHtml(claim.invoiceNumber || "-")}</dd></div>
          ${claim.notes ? `<div class="is-wide"><dt>Notes</dt><dd>${escapeHtml(claim.notes)}</dd></div>` : ""}
        </dl>
        <div class="operations-record-checks is-readonly" aria-label="Billing status">
          <label><input type="checkbox" ${claim.submitted ? "checked" : ""} disabled><span>Submitted</span></label>
          <label><input type="checkbox" ${claim.approved ? "checked" : ""} disabled><span>Approved</span></label>
        </div>
      </section>
      <footer class="operations-record-actions">
        <button class="is-positive" data-operations-hrsn-new type="button">New Record</button>
        <button class="is-primary" data-operations-hrsn-edit type="button">Edit</button>
        <button class="is-danger" data-operations-hrsn-delete="${escapeHtml(claim.id)}" type="button">${confirmDelete ? "Confirm Delete" : "Delete"}</button>
      </footer>
      ${confirmDelete ? `<p class="operations-delete-warning">Delete this billing record permanently? Click Confirm Delete once more.</p>` : ""}
    </article>
  `;
}

function renderOperationsHrsnBilling() {
  if (operationsHrsnDataState === "loading") return `<div class="operations-empty-panel"><p>Loading billing records...</p></div>`;
  if (operationsHrsnDataState === "error") return `<div class="operations-empty-panel"><p>${escapeHtml(operationsHrsnMessage)}</p><button data-operations-hrsn-retry type="button">Try Again</button></div>`;
  const summary = hrsnBillingSummary(operationsHrsnClaims);
  const visibleClaims = operationsHrsnClaims.filter((claim) => hrsnClaimMatches(claim, operationsHrsnSearchQuery));
  const selectableVisibleClaims = visibleClaims.filter((claim) => !claim.approved);
  const allVisibleSelected = selectableVisibleClaims.length > 0
    && selectableVisibleClaims.every((claim) => operationsSelectedHrsnClaimIds.has(claim.id));
  const selected = selectedOperationsHrsnClaim();
  return `
    <section class="operations-record-workspace operations-hrsn-workspace">
      <header class="operations-record-page-heading">
        <p>Protected service documentation and invoice tracking.</p>
        <button data-operations-hrsn-new type="button">New Billing Record</button>
      </header>
      ${renderOperationsRecordSummary([
        [summary.totalCount, "Billing Records"],
        [summary.draftCount, "Draft"],
        [summary.submittedCount, "Submitted"],
        [summary.approvedCount, "Approved"]
      ])}
      <div class="operations-record-layout">
        <aside class="operations-record-list">
          <label><span class="sr-only">Search HRSN billing records</span><input data-operations-hrsn-search type="search" value="${escapeHtml(operationsHrsnSearchQuery)}" placeholder="Search billing records"></label>
          <div class="operations-hrsn-bulk-toolbar">
            <label><input data-operations-hrsn-select-all type="checkbox" ${allVisibleSelected ? "checked" : ""} ${selectableVisibleClaims.length && !operationsActionBusy ? "" : "disabled"}><span>Select all visible</span></label>
            <button data-operations-hrsn-bulk-approve type="button" ${operationsSelectedHrsnClaimIds.size && !operationsActionBusy ? "" : "disabled"}>Approve Selected (${escapeHtml(operationsSelectedHrsnClaimIds.size)})</button>
          </div>
          <p class="operations-hrsn-bulk-status" data-state="${escapeHtml(operationsHrsnBulkMessageState)}" ${operationsHrsnBulkMessage ? "" : "hidden"} role="status" aria-live="polite">${escapeHtml(operationsHrsnBulkMessage)}</p>
          <div class="operations-hrsn-list">
            ${visibleClaims.map((claim) => `
              <div class="operations-hrsn-list-row ${claim.id === operationsSelectedHrsnClaimId ? "is-selected" : ""}">
                <label class="operations-hrsn-select-box" title="${claim.approved ? "Already approved" : `Select ${escapeHtml(claim.name)}`}"><input data-operations-hrsn-bulk-select="${escapeHtml(claim.id)}" type="checkbox" ${operationsSelectedHrsnClaimIds.has(claim.id) ? "checked" : ""} ${claim.approved || operationsActionBusy ? "disabled" : ""} aria-label="Select ${escapeHtml(claim.name)}"></label>
                <button data-operations-hrsn-select="${escapeHtml(claim.id)}" type="button">
                  <span><strong>${escapeHtml(claim.name)}</strong><small>${escapeHtml(operationsPeriodLabel(claim.serviceDate, claim.serviceDate))} | ${escapeHtml(claim.durationMinutes)} min${claim.invoiceNumber ? ` | ${escapeHtml(claim.invoiceNumber)}` : ""}</small></span>
                  ${renderOperationsStatus(hrsnClaimStatus(claim), hrsnClaimStatus(claim))}
                </button>
              </div>
            `).join("") || `<p class="operations-empty">${operationsHrsnClaims.length ? "No billing records match this search." : "No billing records yet."}</p>`}
          </div>
        </aside>
        <div class="operations-record-panel">
          ${operationsHrsnEditorMode === "new" ? renderHrsnClaimEditor() : operationsHrsnEditorMode === "edit" ? renderHrsnClaimEditor(selected) : renderHrsnClaimDetail(selected)}
        </div>
      </div>
    </section>
  `;
}

function renderBudgetCategoryEditor(category = null) {
  const existingGroups = [...new Set(operationsBudgetCategories.filter((item) => Number(item.budgetYear) === Number(operationsBudgetYear)).map((item) => item.groupName))];
  const value = category || {
    budgetYear: operationsBudgetYear,
    groupName: existingGroups[0] || "",
    name: "",
    annualBudget: "",
    active: true,
    sortOrder: operationsBudgetCategories.length + 1,
    ynabCategoryId: "",
    notes: ""
  };
  return `
    <form class="operations-record-editor operations-editor-form operations-budget-editor" data-operations-budget-form ${category ? `data-category-id="${escapeHtml(category.id)}"` : ""}>
      <header class="operations-record-editor-heading"><div><span>Budget</span><h2>${category ? "Edit Category" : "New Category"}</h2></div><button data-operations-budget-cancel type="button">Cancel</button></header>
      <section>
        <h3>Budget Category</h3>
        <div class="operations-form-grid">
          <label><span>Budget Year</span><input name="budgetYear" type="number" min="2000" max="2100" value="${escapeHtml(value.budgetYear)}" required></label>
          <label><span>Display Order</span><input name="sortOrder" type="number" min="0" step="1" value="${escapeHtml(value.sortOrder)}"></label>
          <label><span>Category Group</span><input name="groupName" type="text" list="operations-budget-groups" value="${escapeHtml(value.groupName)}" required></label>
          <datalist id="operations-budget-groups">${existingGroups.map((group) => `<option value="${escapeHtml(group)}"></option>`).join("")}</datalist>
          <label><span>Category Name</span><input name="name" type="text" value="${escapeHtml(value.name)}" required></label>
          <label><span>Annual Plan</span><input name="annualBudget" type="number" min="0" step="0.01" value="${escapeHtml(value.annualBudget)}" required></label>
          <label><span>Financial Source Category ID <small>Optional</small></span><input name="ynabCategoryId" type="text" value="${escapeHtml(value.ynabCategoryId)}"></label>
          <label class="is-wide"><span>Notes <small>Optional</small></span><textarea name="notes" rows="3">${escapeHtml(value.notes)}</textarea></label>
        </div>
        <label class="operations-editor-check"><input name="active" type="checkbox" ${value.active ? "checked" : ""}><span>Active Category</span></label>
      </section>
      <p class="schedule-action-status" data-operations-action-status role="status" aria-live="polite"></p>
      <footer><button data-operations-budget-cancel type="button">Cancel</button><button type="submit">Save Category</button></footer>
    </form>
  `;
}

function renderBudgetCategoryDetail(category) {
  if (!category) return `<div class="operations-record-empty"><h2>No Category Selected</h2><p>Choose a category or add a new one.</p><button data-operations-budget-new type="button">New Category</button></div>`;
  const confirmDelete = operationsBudgetDeletePendingId === category.id;
  return `
    <article class="operations-record-detail operations-budget-detail">
      <header><div>${renderOperationsStatus(category.active ? "Active" : "Inactive", category.active ? "Automatic" : "Not Configured")}<h2>${escapeHtml(category.name)}</h2><span>${escapeHtml(category.groupName)}</span></div><button data-operations-budget-edit type="button">Edit</button></header>
      <section>
        <h3>Budget Plan</h3>
        <dl class="operations-record-fields">
          <div><dt>Budget Year</dt><dd>${escapeHtml(category.budgetYear)}</dd></div>
          <div><dt>Annual Plan</dt><dd>${escapeHtml(formatGrantMoney(category.annualBudget, "$0"))}</dd></div>
          <div><dt>Actual Spending</dt><dd>-</dd></div>
          <div><dt>Financial Source</dt><dd>${category.ynabCategoryId ? "Mapped" : "Not Mapped"}</dd></div>
          <div><dt>Display Order</dt><dd>${escapeHtml(category.sortOrder)}</dd></div>
          ${category.notes ? `<div class="is-wide"><dt>Notes</dt><dd>${escapeHtml(category.notes)}</dd></div>` : ""}
        </dl>
        <p class="operations-record-note">Actual spending will be calculated from dated expense transactions supplied by the connected accounting source or a future manual ledger.</p>
      </section>
      <footer class="operations-record-actions">
        <button class="is-positive" data-operations-budget-new type="button">New Category</button>
        <button class="is-primary" data-operations-budget-edit type="button">Edit</button>
        <button class="is-danger" data-operations-budget-delete="${escapeHtml(category.id)}" type="button">${confirmDelete ? "Confirm Delete" : "Delete"}</button>
      </footer>
      ${confirmDelete ? `<p class="operations-delete-warning">Delete this category permanently? Click Confirm Delete once more.</p>` : ""}
    </article>
  `;
}

function renderOperationsBudget() {
  if (operationsBudgetDataState === "loading") return `<div class="operations-empty-panel"><p>Loading budget categories...</p></div>`;
  if (operationsBudgetDataState === "error") return `<div class="operations-empty-panel"><p>${escapeHtml(operationsBudgetMessage)}</p><button data-operations-budget-retry type="button">Try Again</button></div>`;
  const groups = budgetCategoryGroups(operationsBudgetCategories, operationsBudgetYear);
  const summary = budgetPlanningSummary(operationsBudgetCategories, operationsBudgetYear);
  const programCostValues = Object.entries(summary.costPerParticipant)
    .filter(([, value]) => value !== null)
    .map(([program, value]) => `${program} ${formatGrantMoney(value, "$0")}`);
  const selected = selectedOperationsBudgetCategory();
  const currentYear = new Date().getFullYear();
  const knownYears = [...new Set([
    operationsBudgetYear,
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
    ...operationsBudgetCategories.map((category) => Number(category.budgetYear))
  ])].filter(Number.isFinite).sort((first, second) => second - first);
  return `
    <section class="operations-record-workspace operations-budget-workspace">
      <header class="operations-record-page-heading">
        <p>Editable annual categories with calculated actuals from financial source data.</p>
        <div class="operations-budget-heading-actions">
          <label><span>Budget Year</span><select data-operations-budget-year>${knownYears.map((year) => `<option value="${year}" ${year === operationsBudgetYear ? "selected" : ""}>${year}</option>`).join("")}</select></label>
          <button data-operations-budget-new type="button">New Category</button>
        </div>
      </header>
      ${renderOperationsRecordSummary([
        [formatGrantMoney(summary.annualBudget, "$0"), "Annual Budget"],
        [summary.actualSpending === null ? "-" : formatGrantMoney(summary.actualSpending, "$0"), "Actual Spending"],
        [summary.remainingBudget === null ? "-" : formatGrantMoney(summary.remainingBudget, "$0"), "Remaining Budget"],
        [summary.budgetUsedPercent === null ? "-" : `${Math.round(summary.budgetUsedPercent)}%`, "Budget Used"]
      ])}
      <p class="operations-budget-source-note"><strong>SNACK Program Hub calculates these measures.</strong> Transaction, balance, and forecast inputs can come from QuickBooks, YNAB, or a future manual ledger.</p>
      <section class="operations-budget-planning" aria-label="Financial planning calculations">
        <article>
          <div><span>Budget vs Actual</span><strong>${summary.budgetUsedPercent === null ? "Needs Expense Data" : `${Math.round(summary.budgetUsedPercent)}% Used`}</strong></div>
          <div class="operations-budget-progress" aria-label="Budget used"><span style="width:${Math.min(Math.max(summary.budgetUsedPercent || 0, 0), 100)}%"></span></div>
          <small>Annual budget minus actual spending equals the remaining budget.</small>
        </article>
        <article>
          <div><span>90-Day Cash Projection</span><strong>${summary.projectedCashBalance === null ? "Needs Cash + Forecast Data" : formatGrantMoney(summary.projectedCashBalance, "$0")}</strong></div>
          <small>Current unrestricted cash + expected inflows - forecast outflows.</small>
        </article>
        <article>
          <div><span>Months of Cash on Hand</span><strong>${summary.monthsCashOnHand === null ? "Needs Cash + Expense Data" : summary.monthsCashOnHand.toFixed(1)}</strong></div>
          <small>Unrestricted cash divided by the trailing three-month average cash expense.</small>
        </article>
        <article>
          <div><span>Direct Cost per Participant</span><strong>${programCostValues.length ? escapeHtml(programCostValues.join(" | ")) : "Needs Program Expense Data"}</strong></div>
          <small>Clinic, Kitchen, School, and Community direct spending divided by participants served. Shared-cost allocation will be a separate approved rule.</small>
        </article>
      </section>
      <div class="operations-record-layout operations-budget-layout">
        <div class="operations-budget-table">
          <div class="operations-budget-table-heading"><span>Category</span><span>Annual Plan</span><span>Actual</span><span>Status</span></div>
          ${groups.map((group) => `
            <section>
              <h3>${escapeHtml(group.name)}</h3>
              ${group.items.map((category) => `
                <button class="${category.id === operationsSelectedBudgetCategoryId ? "is-selected" : ""}" data-operations-budget-select="${escapeHtml(category.id)}" type="button">
                  <span>${escapeHtml(category.name)}</span>
                  <strong>${escapeHtml(formatGrantMoney(category.annualBudget, "$0"))}</strong>
                  <span>-</span>
                  ${renderOperationsStatus(category.active ? "Active" : "Inactive", category.active ? "Automatic" : "Not Configured")}
                </button>
              `).join("")}
            </section>
          `).join("") || `<div class="operations-record-empty"><p>No budget categories have been added for ${escapeHtml(operationsBudgetYear)}.</p><button data-operations-budget-new type="button">New Category</button></div>`}
        </div>
        <div class="operations-record-panel">
          ${operationsBudgetEditorMode === "new" ? renderBudgetCategoryEditor() : operationsBudgetEditorMode === "edit" ? renderBudgetCategoryEditor(selected) : renderBudgetCategoryDetail(selected)}
        </div>
      </div>
    </section>
  `;
}

function renderFinancialRecordsWorkspace() {
  if (!fundraisingCurrentUser) {
    return `<div class="operations-empty-panel"><p>Sign in with your SNACK Google account to load ${escapeHtml(fundraisingSubpage)}.</p></div>`;
  }
  return fundraisingSubpage === "HRSN Billing" ? renderOperationsHrsnBilling() : renderOperationsBudget();
}

function refreshFinancialRecordsWorkspace() {
  const host = document.querySelector("[data-financial-records-workspace]");
  if (host) host.innerHTML = renderFinancialRecordsWorkspace();
}

function isFinancialRecordsModule(moduleId) {
  return moduleId === "fundraising" && ["HRSN Billing", "Budget"].includes(fundraisingSubpage);
}

function renderOperationsDataQuality() {
  const totalIssues = operationsDataQualityItems.reduce((sum, item) => sum + Number(item.issueCount || 0), 0);
  return `
    ${renderOperationsPeriodControls()}
    <section class="operations-quality-surface">
      <header>
        <div><h2>Data Quality</h2><p>Checks that directly affect the reliability of the selected reporting period.</p></div>
        <strong>${escapeHtml(totalIssues)} issue${totalIssues === 1 ? "" : "s"}</strong>
      </header>
      <div class="operations-quality-list">
        ${operationsDataQualityItems.map((item) => `
          <article>
            <div>
              <span class="operations-quality-count">${escapeHtml(item.issueCount)}</span>
              <span><strong>${escapeHtml(item.area)}</strong><small>${escapeHtml(item.detail)}</small></span>
            </div>
            <div><span>${escapeHtml(item.issueCount)} of ${escapeHtml(item.recordCount)}</span>${renderOperationsStatus(item.status)}</div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderOperationsReports() {
  const dashboard = operationsDashboardData(operationsMetrics, operationsDataQualityItems);
  const reportMetrics = dashboard.byArea.flatMap((group) => group.metrics).filter((metric) => metric.currentValue !== null).slice(0, 8);
  return `
    ${renderOperationsPeriodControls()}
    <section class="operations-reports-surface">
      <header><div><h2>Reports</h2><p>Print-ready summaries built from the selected reporting period.</p></div></header>
      <div class="operations-report-options">
        <article>
          <span class="section-icon">${icons.operations}</span>
          <div><h3>Performance Snapshot</h3><p>Current dashboard measures, targets, unresolved definitions, and data-quality notes.</p></div>
          <button data-operations-print-snapshot type="button">Print</button>
        </article>
        <article>
          <span class="section-icon">${icons.outreach}</span>
          <div><h3>Outreach Annual Report</h3><p>The existing event and community-reach report.</p></div>
          <button data-operations-open-outreach-report type="button">Open</button>
        </article>
        <article>
          <span class="section-icon">${icons.check}</span>
          <div><h3>Data Quality Review</h3><p>Missing source fields and measures that still need definitions.</p></div>
          <button data-operations-performance-view="Data Quality" type="button">Open</button>
        </article>
      </div>
      <div class="operations-report-preview">
        <div><span>SNACK Program Hub</span><h3>Performance Snapshot</h3><p>${escapeHtml(operationsPeriodLabel(operationsPeriod.startDate, operationsPeriod.endDate))}</p></div>
        <div class="operations-report-metrics">
          ${reportMetrics.map((metric) => `<div><span>${escapeHtml(metric.name)}</span><strong>${escapeHtml(formatOperationsValue(metric))}</strong><small>${escapeHtml(metric.programArea)}</small></div>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderOperationsPerformanceViewTabs() {
  return `
    <div class="operations-performance-view-switch">
      <div class="view-switch" role="tablist" aria-label="Performance views" style="grid-template-columns: repeat(2, minmax(112px, 1fr));">
        ${["Measures", "Data Quality"].map((view) => `<button class="${operationsPerformanceView === view ? "is-active" : ""}" data-operations-performance-view="${view}" type="button" role="tab" aria-selected="${operationsPerformanceView === view}">${view}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderOperationsWorkspace() {
  if (!operationsCurrentUser) {
    return `<div class="operations-empty-panel"><h2>Operations</h2><p>${escapeHtml(operationsDataMessage)}</p></div>`;
  }
  if (!operationsMetrics.length) {
    return `<div class="operations-empty-panel"><h2>Operations</h2><p>${escapeHtml(operationsDataMessage || "No performance measures are available.")}</p></div>`;
  }
  if (operationsSubpage === "Performance") {
    return `${renderOperationsPerformanceViewTabs()}${operationsPerformanceView === "Data Quality" ? renderOperationsDataQuality() : renderOperationsPerformance()}`;
  }
  if (operationsSubpage === "Evaluation") return renderOperationsEvaluation();
  if (operationsSubpage === "Reports") return renderOperationsReports();
  return renderOperationsDashboard();
}

function refreshOperationsWorkspace() {
  const host = document.querySelector("[data-operations-workspace]");
  if (host) host.innerHTML = renderOperationsWorkspace();
  modules.operations.summary = operationsSummary(operationsMetrics, operationsDataQualityItems);
  const summary = document.querySelector(".summary-strip");
  if (summary) summary.innerHTML = renderSummaryItems(modules.operations);
}

function setOperationsSubpage(label) {
  if (!modules.operations.subpages.includes(label) || operationsActionBusy) return;
  operationsSubpage = label;
  operationsEditorMode = "";
  operationsEditingMeasurementId = "";
  operationsDeletePendingMeasurementId = "";
  operationsEvaluationEditingId = "";
  if (label !== "Performance") operationsPerformanceView = "Measures";
  const url = new URL(window.location.href);
  url.searchParams.set("section", label);
  if (label === "Performance") url.searchParams.set("view", operationsPerformanceView);
  else url.searchParams.delete("view");
  url.searchParams.delete("report");
  history.replaceState({}, "", url);
  renderModulePage("operations");
  refreshOperationsAccountControl();
}

function setOperationsPerformanceView(view = "Measures") {
  if (operationsSubpage !== "Performance" || !["Measures", "Data Quality"].includes(view)) return;
  operationsPerformanceView = view;
  operationsEditorMode = "";
  const url = new URL(window.location.href);
  url.searchParams.set("section", "Performance");
  url.searchParams.set("view", view);
  history.replaceState({}, "", url);
  refreshOperationsWorkspace();
}

function setOperationsProgramArea(area, metricKey = "") {
  if (!operationsProgramAreas.includes(area)) return;
  operationsProgramArea = area;
  operationsSelectedMetricKey = metricKey
    || operationsCoreMetrics(operationsMetricsForArea(operationsMetrics, area))[0]?.metricKey
    || operationsMetricsForArea(operationsMetrics, area)[0]?.metricKey
    || "";
  operationsEditorMode = "";
  operationsEditingMeasurementId = "";
  operationsDeletePendingMeasurementId = "";
  operationsSubpage = "Performance";
  operationsPerformanceView = "Measures";
  const url = new URL(window.location.href);
  url.searchParams.set("section", "Performance");
  url.searchParams.set("view", "Measures");
  history.replaceState({}, "", url);
  renderModulePage("operations");
  refreshOperationsAccountControl();
  document.querySelector("[data-operations-select-metric].is-selected")?.focus();
}

function setOperationsActionStatus(message, state = "") {
  const status = document.querySelector("[data-operations-action-status]");
  if (!status) return;
  status.textContent = message;
  if (state) status.dataset.state = state;
  else status.removeAttribute("data-state");
}

async function operationsApiRequest(path, options = {}) {
  const token = await operationsCurrentUser.getIdToken();
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
    throw new Error(result.error || `Operations service returned ${response.status}.`);
  }
  return response.status === 204 ? null : response.json();
}

async function financialRecordsApiRequest(path, options = {}) {
  const token = await fundraisingCurrentUser.getIdToken();
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
    throw new Error(result.error || `Finance service returned ${response.status}.`);
  }
  return response.status === 204 ? null : response.json();
}

function loadFinancialRecordsSubpageData() {
  if (!fundraisingCurrentUser) return;
  if (fundraisingSubpage === "HRSN Billing" && operationsHrsnDataState === "idle") loadOperationsHrsnData();
  if (fundraisingSubpage === "Budget" && operationsBudgetDataState === "idle") loadOperationsBudgetData();
}

async function loadOperationsHrsnData() {
  if (!fundraisingCurrentUser || operationsHrsnDataState === "loading") return;
  operationsHrsnDataState = "loading";
  operationsHrsnMessage = "";
  refreshFinancialRecordsWorkspace();
  try {
    const result = await financialRecordsApiRequest("/api/hrsn-claims");
    operationsHrsnClaims = result.claims || [];
    operationsHrsnClientOptions = result.clientOptions || [];
    const currentClaimIds = new Set(operationsHrsnClaims.filter((claim) => !claim.approved).map((claim) => claim.id));
    [...operationsSelectedHrsnClaimIds].forEach((claimId) => {
      if (!currentClaimIds.has(claimId)) operationsSelectedHrsnClaimIds.delete(claimId);
    });
    if (!operationsHrsnClaims.some((claim) => claim.id === operationsSelectedHrsnClaimId)) {
      operationsSelectedHrsnClaimId = operationsHrsnClaims[0]?.id || "";
    }
    operationsHrsnDataState = "ready";
  } catch (error) {
    console.error(error);
    operationsHrsnDataState = "error";
    operationsHrsnMessage = "HRSN billing records could not be loaded. Check the local data service and try again.";
  }
  refreshFinancialRecordsWorkspace();
}

async function saveOperationsHrsnClaim(form) {
  if (operationsActionBusy) return;
  const claimId = form.dataset.claimId || "";
  const payload = hrsnClaimPayload(form);
  operationsActionBusy = true;
  form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = true; });
  setOperationsActionStatus("Saving billing record...");
  try {
    const result = await financialRecordsApiRequest(claimId
      ? `/api/hrsn-claims/${encodeURIComponent(claimId)}`
      : "/api/hrsn-claims", {
      method: claimId ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    operationsSelectedHrsnClaimId = result.claim.id;
    operationsHrsnEditorMode = "";
    operationsHrsnDeletePendingId = "";
    operationsHrsnDataState = "idle";
    await loadOperationsHrsnData();
  } catch (error) {
    console.error(error);
    form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = false; });
    setOperationsActionStatus(error.message, "error");
  } finally {
    operationsActionBusy = false;
  }
}

async function deleteOperationsHrsnClaim(claimId) {
  if (operationsActionBusy) return;
  if (operationsHrsnDeletePendingId !== claimId) {
    operationsHrsnDeletePendingId = claimId;
    refreshFinancialRecordsWorkspace();
    return;
  }
  operationsActionBusy = true;
  try {
    await financialRecordsApiRequest(`/api/hrsn-claims/${encodeURIComponent(claimId)}`, { method: "DELETE" });
    operationsSelectedHrsnClaimId = "";
    operationsHrsnDeletePendingId = "";
    operationsHrsnDataState = "idle";
    await loadOperationsHrsnData();
  } catch (error) {
    console.error(error);
    operationsHrsnDeletePendingId = "";
    refreshFinancialRecordsWorkspace();
  } finally {
    operationsActionBusy = false;
  }
}

async function bulkApproveOperationsHrsnClaims() {
  if (operationsActionBusy || !operationsSelectedHrsnClaimIds.size) return;
  const claimIds = [...operationsSelectedHrsnClaimIds];
  operationsActionBusy = true;
  operationsHrsnBulkMessage = `Approving ${claimIds.length} billing record${claimIds.length === 1 ? "" : "s"}...`;
  operationsHrsnBulkMessageState = "";
  refreshFinancialRecordsWorkspace();
  try {
    const result = await financialRecordsApiRequest("/api/hrsn-claims/bulk-approval", {
      method: "PATCH",
      body: JSON.stringify({ claimIds })
    });
    operationsSelectedHrsnClaimIds.clear();
    operationsHrsnBulkMessage = `${result.updatedCount} billing record${result.updatedCount === 1 ? "" : "s"} approved.`;
    operationsHrsnBulkMessageState = "success";
    operationsHrsnDataState = "idle";
    await loadOperationsHrsnData();
  } catch (error) {
    console.error(error);
    operationsHrsnBulkMessage = error.message;
    operationsHrsnBulkMessageState = "error";
  } finally {
    operationsActionBusy = false;
    refreshFinancialRecordsWorkspace();
  }
}

async function loadOperationsBudgetData() {
  if (!fundraisingCurrentUser || operationsBudgetDataState === "loading") return;
  operationsBudgetDataState = "loading";
  operationsBudgetMessage = "";
  refreshFinancialRecordsWorkspace();
  try {
    const result = await financialRecordsApiRequest(`/api/budget-categories?year=${encodeURIComponent(operationsBudgetYear)}`);
    operationsBudgetCategories = result.categories || [];
    if (!operationsBudgetCategories.some((category) => category.id === operationsSelectedBudgetCategoryId)) {
      operationsSelectedBudgetCategoryId = operationsBudgetCategories[0]?.id || "";
    }
    operationsBudgetDataState = "ready";
  } catch (error) {
    console.error(error);
    operationsBudgetDataState = "error";
    operationsBudgetMessage = "Budget categories could not be loaded. Check the local data service and try again.";
  }
  refreshFinancialRecordsWorkspace();
}

async function saveOperationsBudgetCategory(form) {
  if (operationsActionBusy) return;
  const categoryId = form.dataset.categoryId || "";
  const payload = budgetCategoryPayload(form);
  operationsActionBusy = true;
  form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = true; });
  setOperationsActionStatus("Saving budget category...");
  try {
    const result = await financialRecordsApiRequest(categoryId
      ? `/api/budget-categories/${encodeURIComponent(categoryId)}`
      : "/api/budget-categories", {
      method: categoryId ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    operationsBudgetYear = result.category.budgetYear;
    operationsSelectedBudgetCategoryId = result.category.id;
    operationsBudgetEditorMode = "";
    operationsBudgetDeletePendingId = "";
    operationsBudgetDataState = "idle";
    await loadOperationsBudgetData();
  } catch (error) {
    console.error(error);
    form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = false; });
    setOperationsActionStatus(error.message, "error");
  } finally {
    operationsActionBusy = false;
  }
}

async function deleteOperationsBudgetCategory(categoryId) {
  if (operationsActionBusy) return;
  if (operationsBudgetDeletePendingId !== categoryId) {
    operationsBudgetDeletePendingId = categoryId;
    refreshFinancialRecordsWorkspace();
    return;
  }
  operationsActionBusy = true;
  try {
    await financialRecordsApiRequest(`/api/budget-categories/${encodeURIComponent(categoryId)}`, { method: "DELETE" });
    operationsSelectedBudgetCategoryId = "";
    operationsBudgetDeletePendingId = "";
    operationsBudgetDataState = "idle";
    await loadOperationsBudgetData();
  } catch (error) {
    console.error(error);
    operationsBudgetDeletePendingId = "";
    refreshFinancialRecordsWorkspace();
  } finally {
    operationsActionBusy = false;
  }
}

async function loadOperationsData() {
  operationsDataMessage = "Loading performance data...";
  refreshOperationsWorkspace();
  try {
    const params = new URLSearchParams(operationsPeriod);
    const result = await operationsApiRequest(`/api/operations?${params}`);
    operationsMetrics = result.metrics || [];
    operationsMeasurements = result.measurements || [];
    if (operationsEditingMeasurementId && !operationsMeasurements.some((measurement) => measurement.id === operationsEditingMeasurementId)) {
      operationsEditingMeasurementId = "";
      operationsEditorMode = "";
    }
    operationsAllEvaluationQuestions = mergeOperationsEvaluationQuestions(
      defaultOperationsEvaluationQuestions,
      result.evaluationQuestions || []
    );
    operationsEvaluationQuestions = operationsAllEvaluationQuestions.filter((question) => question.recordStatus !== "Retired");
    operationsEvaluationInstruments = result.evaluationInstruments || [];
    operationsEvaluationResponses = result.evaluationResponses || [];
    operationsDataQualityItems = result.dataQuality || [];
    operationsPeriod = result.period || operationsPeriod;
    operationsPreviousPeriod = result.previousPeriod || operationsPreviousPeriod;
    if (!operationsSelectedMetricKey || !operationsMetrics.some((metric) => metric.metricKey === operationsSelectedMetricKey)) {
      operationsSelectedMetricKey = operationsCoreMetrics(operationsMetricsForArea(operationsMetrics, operationsProgramArea))[0]?.metricKey
        || operationsMetricsForArea(operationsMetrics, operationsProgramArea)[0]?.metricKey
        || operationsCoreMetrics(operationsMetrics)[0]?.metricKey
        || operationsMetrics[0]?.metricKey
        || "";
    }
    operationsDataMessage = "";
  } catch (error) {
    console.error(error);
    operationsMetrics = [];
    operationsMeasurements = [];
    operationsDataQualityItems = [];
    operationsEvaluationInstruments = [];
    operationsEvaluationResponses = [];
    operationsAllEvaluationQuestions = [...operationsEvaluationQuestions];
    operationsDataMessage = "Performance data could not be loaded. Check the local data service and try again.";
  }
  refreshOperationsWorkspace();
}

async function saveOperationsMetric(form) {
  if (operationsActionBusy) return;
  const metricKey = form.dataset.metricKey;
  const payload = operationsMetricDefinitionPayload(form);
  operationsActionBusy = true;
  form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = true; });
  setOperationsActionStatus("Saving measure...");
  try {
    await operationsApiRequest(`/api/operations/metrics/${encodeURIComponent(metricKey)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    operationsEditorMode = "";
    await loadOperationsData();
  } catch (error) {
    console.error(error);
    form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = false; });
    setOperationsActionStatus(error.message, "error");
  } finally {
    operationsActionBusy = false;
  }
}

async function saveOperationsMeasurement(form) {
  if (operationsActionBusy) return;
  const formData = new FormData(form);
  const metricKey = form.dataset.metricKey || String(formData.get("metricKey") || "");
  const measurementId = form.dataset.measurementId || "";
  const payload = operationsMeasurementPayload(form, metricKey);
  operationsActionBusy = true;
  form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = true; });
  setOperationsActionStatus("Saving value...");
  try {
    await operationsApiRequest(measurementId
      ? `/api/operations/measurements/${encodeURIComponent(measurementId)}`
      : "/api/operations/measurements", {
      method: measurementId ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    const savedMetric = operationsMetrics.find((metric) => metric.metricKey === metricKey);
    if (savedMetric) {
      operationsProgramArea = savedMetric.programArea;
      operationsSelectedMetricKey = savedMetric.metricKey;
    }
    operationsEditorMode = "";
    operationsEditingMeasurementId = "";
    operationsDeletePendingMeasurementId = "";
    await loadOperationsData();
  } catch (error) {
    console.error(error);
    form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = false; });
    setOperationsActionStatus(error.message, "error");
  } finally {
    operationsActionBusy = false;
  }
}

async function deleteOperationsMeasurement(measurementId) {
  if (!measurementId || operationsActionBusy) return;
  if (operationsDeletePendingMeasurementId !== measurementId) {
    operationsDeletePendingMeasurementId = measurementId;
    refreshOperationsWorkspace();
    document.querySelector(`[data-operations-delete-measurement="${CSS.escape(measurementId)}"]`)?.focus();
    return;
  }
  operationsActionBusy = true;
  try {
    await operationsApiRequest(`/api/operations/measurements/${encodeURIComponent(measurementId)}`, {
      method: "DELETE"
    });
    operationsDeletePendingMeasurementId = "";
    operationsEditingMeasurementId = "";
    operationsEditorMode = "";
    await loadOperationsData();
  } catch (error) {
    console.error(error);
    operationsDeletePendingMeasurementId = "";
    operationsDataMessage = error.message;
    refreshOperationsWorkspace();
  } finally {
    operationsActionBusy = false;
  }
}

async function saveOperationsEvaluationQuestion(form) {
  if (operationsActionBusy) return;
  const payload = operationsEvaluationQuestionPayload(form);
  if (!payload.id) {
    setOperationsActionStatus("Question ID is required.", "error");
    return;
  }
  operationsActionBusy = true;
  form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = true; });
  setOperationsActionStatus("Saving question...");
  try {
    const { id, ...question } = payload;
    await operationsApiRequest(`/api/operations/evaluation-questions/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(question)
    });
    operationsEvaluationEditingId = "";
    await loadOperationsData();
  } catch (error) {
    console.error(error);
    form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = false; });
    setOperationsActionStatus(error.message, "error");
  } finally {
    operationsActionBusy = false;
  }
}

async function saveOperationsEvaluationInstrument(form) {
  if (operationsActionBusy) return;
  const payload = operationsEvaluationInstrumentPayload(form);
  if (!payload.id) {
    setOperationsActionStatus("Instrument ID is required.", "error");
    return;
  }
  operationsActionBusy = true;
  form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = true; });
  setOperationsActionStatus("Saving instrument version...");
  try {
    const { id, ...instrument } = payload;
    await operationsApiRequest(`/api/operations/evaluation-instruments/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(instrument)
    });
    operationsEvaluationInstrumentEditingId = "";
    await loadOperationsData();
  } catch (error) {
    console.error(error);
    form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = false; });
    setOperationsActionStatus(error.message, "error");
  } finally {
    operationsActionBusy = false;
  }
}

function openOperationsSnapshotPrint() {
  const reportMetrics = operationsMetrics.filter((metric) => metric.dashboard);
  const qualityIssues = operationsDataQualityItems.filter((item) => item.issueCount > 0);
  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) return;
  printWindow.document.write(`<!doctype html><html><head><title>SNACK Performance Snapshot</title><style>
    @page{size:letter;margin:.5in}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#111827;margin:0;font-size:10pt}h1{font-size:20pt;margin:0 0 4px}h2{font-size:13pt;margin:18px 0 7px;border-bottom:1px solid #111;padding-bottom:4px}p{margin:0 0 12px;color:#4b5563}.grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #9ca3af}.grid div{padding:9px;border-right:1px solid #d1d5db;border-bottom:1px solid #d1d5db}.grid div:nth-child(3n){border-right:0}.grid span{display:block;font-size:8pt;color:#4b5563}.grid strong{display:block;font-size:15pt;margin-top:3px}.issues{display:grid;gap:5px}.issues div{display:flex;justify-content:space-between;border-bottom:1px solid #d1d5db;padding:5px 0}.footer{margin-top:18px;border-top:1px solid #111;padding-top:5px;font-size:8pt;color:#4b5563}
  </style></head><body><h1>SNACK Performance Snapshot</h1><p>${escapeHtml(operationsPeriodLabel(operationsPeriod.startDate, operationsPeriod.endDate))}</p><h2>Performance</h2><div class="grid">${reportMetrics.map((metric) => `<div><span>${escapeHtml(metric.programArea)} · ${escapeHtml(metric.name)}</span><strong>${escapeHtml(formatOperationsValue(metric))}</strong><span>${escapeHtml(metric.calculationMode)}</span></div>`).join("")}</div><h2>Data Quality and Definitions</h2><div class="issues">${qualityIssues.map((item) => `<div><span>${escapeHtml(item.area)}</span><strong>${escapeHtml(item.issueCount)} issue${item.issueCount === 1 ? "" : "s"}</strong></div>`).join("") || "<p>No reporting issues found.</p>"}</div><p class="footer">Generated from SNACK Program Hub. Measures marked Needs Definition or Not Configured are intentionally excluded from calculated results.</p><script>window.addEventListener('load',()=>window.print())</script></body></html>`);
  printWindow.document.close();
}

function refreshOperationsAccountControl() {
  const account = document.querySelector(".account");
  const accountName = document.querySelector("[data-account-name]");
  if (!account || !accountName || currentModuleId() !== "operations") return;
  accountName.textContent = operationsCurrentUser ? staffAccountDisplayName(operationsCurrentUser) : "Sign in";
  configureAccountSignInControl(account, Boolean(operationsCurrentUser), "Sign in to load Operations");
}

async function initializeOperationsData() {
  if (currentModuleId() !== "operations") return;
  try {
    const [{ initializeApp }, { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js")
    ]);
    const auth = getAuth(initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG));
    await configureSecureAuthSession(auth);
    const provider = new GoogleAuthProvider();
    operationsOpenSignIn = () => {
      if (!operationsCurrentUser) signInWithPopup(auth, provider).catch((error) => console.error(error));
    };
    refreshOperationsAccountControl();
    onAuthStateChanged(auth, async (user) => {
      operationsCurrentUser = user;
      refreshOperationsAccountControl();
      if (user) {
        if (!(await authorizeStaffUser(user))) return;
        loadOperationsData();
        return;
      }
      operationsMetrics = [];
      operationsMeasurements = [];
      operationsDataQualityItems = [];
      operationsHrsnClaims = [];
      operationsHrsnClientOptions = [];
      operationsSelectedHrsnClaimIds.clear();
      operationsHrsnBulkMessage = "";
      operationsHrsnBulkMessageState = "";
      operationsHrsnDataState = "idle";
      operationsSelectedHrsnClaimId = "";
      operationsBudgetCategories = [];
      operationsBudgetDataState = "idle";
      operationsSelectedBudgetCategoryId = "";
      operationsDataMessage = "Sign in with your SNACK Google account to load Operations.";
      refreshOperationsWorkspace();
    });
  } catch (error) {
    console.error(error);
    operationsDataMessage = "The secure sign-in connection could not be started.";
    refreshOperationsWorkspace();
  }
}

function isAdminSchedulePage(moduleId = currentModuleId()) {
  return moduleId === "admin" && adminSubpage === "Schedule";
}

function isAdminIntegrationsPage(moduleId = currentModuleId()) {
  return moduleId === "admin" && adminSubpage === "Integrations";
}

function isAdminSettingsPage(moduleId = currentModuleId()) {
  return moduleId === "admin" && adminSubpage === "Settings";
}

function renderAdminSettingsTabs() {
  const definitions = [
    { id: "Team", iconName: "crm" },
    { id: "Access", iconName: "admin" },
    { id: "CRM", iconName: "crm" },
    { id: "Forms", iconName: "file" },
    { id: "Data", iconName: "upload" }
  ];
  return `
    <nav class="admin-settings-tabs" role="tablist" aria-label="Admin settings">
      ${definitions.map((tab) => `
        <button
          class="${adminSettingsTab === tab.id ? "is-active" : ""}"
          data-admin-settings-tab="${tab.id}"
          role="tab"
          aria-selected="${adminSettingsTab === tab.id ? "true" : "false"}"
          type="button"
        >
          <span class="detail-tab-icon">${icons[tab.iconName]}</span>
          <span>${tab.id}</span>
        </button>
      `).join("")}
    </nav>
  `;
}

function renderAdminSettingsWorkspace() {
  const content = adminSettingsTab === "Access"
    ? renderAdminAccessWorkspace()
    : adminSettingsTab === "CRM"
      ? renderAdminCrmSettingsWorkspace()
    : adminSettingsTab === "Forms"
      ? renderAdminFormsWorkspace()
      : adminSettingsTab === "Data"
        ? renderAdminDataWorkspace()
      : renderAdminTeamWorkspace();
  return `
    ${renderAdminSettingsTabs()}
    <div class="admin-settings-tab-panel" data-admin-settings-tab-panel="${escapeHtml(adminSettingsTab)}">
      ${content}
    </div>
  `;
}

function refreshAdminSettingsWorkspace() {
  const host = document.querySelector("[data-admin-settings-workspace]");
  if (!host) return;
  host.dataset.state = adminDataState;
  host.innerHTML = renderAdminSettingsWorkspace();
}

const adminTeamPrograms = Object.freeze(["Clinic", "Kitchen", "School", "Outreach"]);

function adminTeamInitials(user) {
  return String(user.displayName || user.email || "SNACK")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "S";
}

function renderAdminTeamWorkspace() {
  const rows = adminStaffUsers.map((user) => `
    <form class="admin-team-card" data-admin-team-profile data-staff-email="${escapeHtml(user.email)}">
      <header>
        <span class="admin-team-avatar">${escapeHtml(adminTeamInitials(user))}</span>
        <div>
          <strong>${escapeHtml(user.displayName || user.email)}</strong>
          <span>${escapeHtml(user.accessLevelName || user.role)} · ${user.active ? "Active" : "Inactive"}</span>
        </div>
      </header>
      <div class="admin-team-fields">
        <label><span>Name</span><input name="displayName" value="${escapeHtml(user.displayName || "")}" required></label>
        <label><span>Job Title</span><input name="title" value="${escapeHtml(user.title || "")}" placeholder="Nutrition Coordinator"></label>
        <label><span>SNACK Email</span><input name="email" type="email" value="${escapeHtml(user.email)}" readonly></label>
        <label><span>Phone</span><input name="phone" type="tel" value="${escapeHtml(user.phone || "")}" placeholder="(971) 202-0232"></label>
      </div>
      <fieldset class="admin-team-programs">
        <legend>Program Areas</legend>
        ${adminTeamPrograms.map((program) => `
          <label><input name="programs" type="checkbox" value="${program}" ${(user.programs || []).includes(program) ? "checked" : ""}>${program}</label>
        `).join("")}
      </fieldset>
      <footer>
        <span>Module access is managed separately in the Access tab.</span>
        <button class="secondary-action" type="submit">Save Profile</button>
      </footer>
    </form>
  `).join("");

  return `
    <div class="admin-workspace-heading">
      <div>
        <h2>Team Directory</h2>
        <p>Keep staff contact details and program assignments together without changing their system permissions.</p>
      </div>
      <button class="admin-heading-action" data-admin-settings-tab="Access" type="button">Manage Access</button>
    </div>
    ${adminDataMessage ? `<p class="admin-workspace-message" role="status">${escapeHtml(adminDataMessage)}</p>` : ""}
    <div class="admin-team-grid">
      ${rows || `<p class="list-empty">No team accounts have been added yet. Add one in the Access tab.</p>`}
    </div>
  `;
}

function refreshAdminTeamWorkspace() {
  if (adminSettingsTab === "Team") refreshAdminSettingsWorkspace();
}

function renderAdminCrmSettingsWorkspace() {
  const rows = adminClientStatuses.map((status, index) => `
    <div class="admin-crm-status-row" data-admin-crm-status-row>
      <label><span>Status Name</span><input name="statusName" value="${escapeHtml(status.name)}" maxlength="60" required></label>
      <label><span>Color</span><input name="statusColor" type="color" value="${escapeHtml(status.color || "#475467")}"></label>
      <button class="danger-action" data-admin-remove-client-status="${index}" type="button" ${status.name === "Scheduled" ? "disabled" : ""}>Remove</button>
    </div>
  `).join("");
  return `
    <div class="admin-workspace-heading">
      <div>
        <h2>CRM Settings</h2>
        <p>Add client statuses and choose the color shown beside each status. Scheduled remains available because new clients start there.</p>
      </div>
      <button class="admin-heading-action" data-admin-add-client-status type="button">Add Status</button>
    </div>
    ${adminDataMessage ? `<p class="admin-workspace-message" role="status">${escapeHtml(adminDataMessage)}</p>` : ""}
    <form class="admin-crm-settings-form" data-admin-crm-settings-form>
      <div class="admin-crm-status-list">${rows || `<p class="list-empty">Loading client statuses...</p>`}</div>
      <p>Age Limit is available for children outside SNACK's 6–18 age range.</p>
      <button class="primary-action" type="submit" ${adminCrmSettingsActionBusy ? "disabled" : ""}>Save CRM Settings</button>
    </form>
  `;
}

function adminCrmStatusesFromForm(form = document.querySelector("[data-admin-crm-settings-form]")) {
  return form ? [...form.querySelectorAll("[data-admin-crm-status-row]")].map((row) => ({
    name: String(row.querySelector('[name="statusName"]')?.value || "").trim(),
    color: String(row.querySelector('[name="statusColor"]')?.value || "#475467")
  })).filter((status) => status.name) : [...adminClientStatuses];
}

async function loadAdminCrmSettings() {
  adminDataState = "loading";
  adminDataMessage = "Loading CRM settings...";
  refreshAdminSettingsWorkspace();
  try {
    const result = await adminAccessFetch("/api/admin/crm-settings");
    adminClientStatuses = result.clientStatuses || [];
    setAdminClientStatuses(adminClientStatuses);
    adminDataState = "ready";
    adminDataMessage = "";
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "CRM settings could not be loaded.";
  }
  refreshAdminSettingsWorkspace();
}

async function saveAdminCrmSettings(form) {
  if (adminCrmSettingsActionBusy) return;
  const clientStatuses = adminCrmStatusesFromForm(form);
  adminCrmSettingsActionBusy = true;
  adminDataMessage = "Saving CRM settings...";
  refreshAdminSettingsWorkspace();
  try {
    const result = await adminAccessFetch("/api/admin/crm-settings", {
      method: "PATCH",
      body: JSON.stringify({ clientStatuses })
    });
    adminClientStatuses = result.clientStatuses || clientStatuses;
    setAdminClientStatuses(adminClientStatuses);
    adminDataState = "ready";
    adminDataMessage = "CRM settings saved.";
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "CRM settings could not be saved.";
  } finally {
    adminCrmSettingsActionBusy = false;
    refreshAdminSettingsWorkspace();
  }
}

function renderAdminFormsPacket(title, description, files) {
  return `
    <section class="admin-form-packet">
      <header>
        <div>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
        </div>
        <span>${files.length} forms</span>
      </header>
      <div class="crm-form-links">${renderCrmFormLinks(files)}</div>
    </section>
  `;
}

function renderAdminFormsWorkspace() {
  return `
    <div class="admin-workspace-heading">
      <div>
        <h2>Print Form Library</h2>
        <p>Current native and paper forms used from client profiles and the daily Print Forms center.</p>
      </div>
      <a class="admin-heading-action" href="./operations.html?section=Evaluation">Edit Questionnaire Items</a>
    </div>
    <section class="admin-form-packet admin-native-form-packet">
      <header>
        <div>
          <h3>Native Clinic Forms</h3>
          <p>Client-specific names, program points, and completion dates are filled automatically.</p>
        </div>
        <span>3 forms</span>
      </header>
      <div class="admin-native-form-list">
        <span>Enrollment Questionnaire</span>
        <span>Graduation Questionnaire</span>
        <span>Graduation Knowledge Assessment</span>
      </div>
      <a class="admin-heading-action" href="./crm.html?section=Clients&tab=forms">Open Client Forms</a>
    </section>
    <div class="admin-form-library">
      <section class="admin-form-language" aria-labelledby="admin-forms-english">
        <div class="admin-form-language-heading">
          <span>EN</span>
          <div><h3 id="admin-forms-english">English</h3><p>Current clinic packets</p></div>
        </div>
        ${renderAdminFormsPacket("Enrollment Packet", "Used at the enrollment appointment.", crmPrintFormPackets.enrollment.English)}
        ${renderAdminFormsPacket("Graduation Packet", "Used at the final Healthy Habits appointment.", crmPrintFormPackets.graduation.English)}
      </section>
      <section class="admin-form-language" aria-labelledby="admin-forms-spanish">
        <div class="admin-form-language-heading">
          <span>ES</span>
          <div><h3 id="admin-forms-spanish">Spanish</h3><p>Current clinic packets</p></div>
        </div>
        ${renderAdminFormsPacket("Enrollment Packet", "Used at the enrollment appointment.", crmPrintFormPackets.enrollment.Spanish)}
        ${renderAdminFormsPacket("Graduation Packet", "Used at the final Healthy Habits appointment.", crmPrintFormPackets.graduation.Spanish)}
      </section>
    </div>
    <div class="admin-forms-note">
      ${icons.file}
      <p><strong>Current workflow:</strong> open a client profile to complete a native form on an iPad, print a client-filled copy, or review an earlier form version. The remaining packet files continue to download for printing.</p>
    </div>
  `;
}

function adminDataTotals() {
  return adminDataCollections.reduce((totals, collection) => ({
    records: totals.records + Number(collection.count || 0),
    fixtures: totals.fixtures + Number(collection.qaFixtureCount || 0)
  }), { records: 0, fixtures: 0 });
}

function renderAdminImportPreview() {
  if (!adminDataImportPreview) {
    return `<p class="admin-data-empty">Choose a CSV file to see exactly what is ready, skipped, or needs review before anything is saved.</p>`;
  }
  const preview = adminDataImportPreview;
  const messages = [...preview.invalidRows, ...preview.warnings];
  return `
    <section class="admin-import-preview" aria-label="Import preview">
      <div class="admin-data-summary-row">
        <span><strong>${preview.sourceRowCount}</strong>Rows Found</span>
        <span><strong>${preview.records.length}</strong>Ready</span>
        <span><strong>${preview.invalidRows.length}</strong>Skipped</span>
        <span><strong>${preview.warnings.length}</strong>Review</span>
      </div>
      <p><strong>${escapeHtml(preview.fileName)}</strong> · ${preview.columns.length} columns detected</p>
      ${preview.sample.length ? `
        <div class="admin-import-sample">
          <strong>First records ready to import</strong>
          ${preview.sample.map((item) => `<span>Row ${item.rowNumber}: ${escapeHtml(item.label)}</span>`).join("")}
        </div>
      ` : ""}
      ${messages.length ? `
        <details class="admin-import-warnings">
          <summary>${messages.length} skipped row${messages.length === 1 ? "" : "s"} or review note${messages.length === 1 ? "" : "s"}</summary>
          <div>
            ${messages.slice(0, 50).map((item) => `
              <p><strong>${item.rowNumber ? `Row ${item.rowNumber}` : escapeHtml(item.label)}</strong> ${escapeHtml(item.reason)}</p>
            `).join("")}
            ${messages.length > 50 ? `<p>Only the first 50 notes are shown. Correct the file and preview it again before importing.</p>` : ""}
          </div>
        </details>
      ` : ""}
      <label class="admin-data-review-check">
        <input name="reviewed" type="checkbox" data-admin-import-reviewed ${preview.records.length ? "" : "disabled"}>
        <span>I reviewed the ready, skipped, and warning counts.</span>
      </label>
      <p class="admin-data-safety-note">A JSON backup of ${escapeHtml(preview.definition.label)} downloads automatically before the import begins. Imports add records; they do not replace existing records.</p>
      <button class="primary-action" type="submit" data-admin-import-submit disabled>
        ${icons.upload}Import ${preview.records.length} ${escapeHtml(preview.definition.label)}
      </button>
    </section>
  `;
}

function formatSecurityEventDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function renderAdminDataWorkspace() {
  const totals = adminDataTotals();
  const fixtureCollections = adminDataCollections.filter((collection) => (
    collection.cleanupEligible !== false && Number(collection.qaFixtureCount) > 0
  ));
  const importOptions = Object.entries(adminImportDefinitions).map(([key, definition]) => `
    <option value="${escapeHtml(key)}" ${adminDataImportPreview?.collectionKey === key ? "selected" : ""}>${escapeHtml(definition.label)}</option>
  `).join("");
  return `
    <div class="admin-workspace-heading">
      <div>
        <h2>Data Center</h2>
        <p>Download backups, preview controlled CSV imports, and remove records explicitly marked as sample data.</p>
      </div>
      <button class="admin-heading-action" data-admin-refresh-data type="button">Refresh Counts</button>
    </div>
    ${adminDataMessage ? `<p class="admin-workspace-message" role="status">${escapeHtml(adminDataMessage)}</p>` : ""}
    <div class="admin-data-overview" aria-label="Data summary">
      <span><strong>${totals.records.toLocaleString()}</strong>Total Records</span>
      <span><strong>${adminDataCollections.length}</strong>Collections</span>
      <span><strong>${totals.fixtures.toLocaleString()}</strong>Sample Records</span>
    </div>
    <div class="admin-data-grid">
      <section class="admin-data-panel">
        <header><span class="admin-data-icon">${icons.file}</span><div><h3>Backup</h3><p>Download one private JSON file containing every available collection.</p></div></header>
        <div class="admin-data-collection-list">
          ${adminDataCollections.map((collection) => `
            <span><strong>${escapeHtml(collection.label)}</strong><b>${Number(collection.count || 0).toLocaleString()}</b></span>
          `).join("") || `<p>Counts have not loaded yet.</p>`}
        </div>
        <button class="secondary-action" data-admin-download-backup type="button" ${adminDataCollections.length && !adminDataActionBusy ? "" : "disabled"}>${icons.file}Download Complete Backup</button>
      </section>
      <section class="admin-data-panel">
        <header><span class="admin-data-icon">${icons.upload}</span><div><h3>Import</h3><p>Preview a supported CSV before adding any records.</p></div></header>
        <form data-admin-import-form>
          <label><span>Record Type</span><select name="collectionKey" data-admin-import-type>${importOptions}</select></label>
          <label><span>CSV File</span><input name="importFile" type="file" accept=".csv,text/csv" data-admin-import-file></label>
          ${renderAdminImportPreview()}
        </form>
      </section>
      <section class="admin-data-panel admin-data-cleanup">
        <header><span class="admin-data-icon">${icons.trash}</span><div><h3>Sample Data Cleanup</h3><p>Only records carrying the app's QA/sample marker can be removed here. Ordinary records are never selected.</p></div></header>
        <form data-admin-cleanup-form>
          <fieldset>
            <legend>Collections with sample records</legend>
            <div class="admin-data-cleanup-options">
              ${fixtureCollections.map((collection) => `
                <label><input name="collections" type="checkbox" value="${escapeHtml(collection.key)}"><span>${escapeHtml(collection.label)}</span><strong>${collection.qaFixtureCount}</strong></label>
              `).join("") || `<p>No marked sample records were found.</p>`}
            </div>
          </fieldset>
          <label><span>Type DELETE SAMPLE DATA</span><input name="confirmation" autocomplete="off" placeholder="DELETE SAMPLE DATA" ${fixtureCollections.length ? "" : "disabled"}></label>
          <p class="admin-data-safety-note">A backup of every selected collection downloads before cleanup. Records without a QA/sample marker remain untouched.</p>
          <button class="danger-action" type="submit" ${fixtureCollections.length && !adminDataActionBusy ? "" : "disabled"}>${icons.trash}Delete Selected Sample Data</button>
        </form>
      </section>
      <section class="admin-data-panel admin-security-history">
        <header><span class="admin-data-icon">${icons.history}</span><div><h3>Security History</h3><p>Recent sign-ins, denied access, record access, changes, deletions, and downloads.</p></div></header>
        <div class="admin-data-collection-list">
          ${adminSecurityEvents.slice(0, 30).map((event) => `
            <span>
              <strong>${escapeHtml(event.action)} · ${escapeHtml(event.actorEmail || "Unknown account")}</strong>
              <b class="${event.result === "denied" ? "is-denied" : ""}">${escapeHtml(event.result)}</b>
              <small>${escapeHtml(formatSecurityEventDate(event.occurredAt))}</small>
            </span>
          `).join("") || `<p>No security events have been recorded yet.</p>`}
        </div>
        <p class="admin-data-safety-note">Showing ${Math.min(adminSecurityEvents.length, 30)} of ${adminSecurityEventTotal.toLocaleString()} recorded events. This history is read-only inside the app.</p>
      </section>
    </div>
  `;
}

function adminIntegrationLabel(state) {
  return ({
    ready: "Connected",
    inactive: "Not Connected",
    paused: "Paused",
    planned: "Planned",
    checking: "Checking",
    error: "Check Failed"
  })[state] || "Not Connected";
}

function renderAdminIntegrationCard({ iconName, name, description, state, detail, href = "", action = "", calendarTest = false, emailTest = false, twilioTest = false, statusLabel = "" }) {
  return `
    <article class="admin-integration-card" data-state="${escapeHtml(state)}">
      <header>
        <span class="admin-integration-icon">${icons[iconName] || icons.admin}</span>
        <div><h3>${escapeHtml(name)}</h3><span class="admin-integration-status">${escapeHtml(statusLabel || adminIntegrationLabel(state))}</span></div>
      </header>
      <p>${escapeHtml(description)}</p>
      <footer>
        <span>${escapeHtml(detail)}</span>
        ${calendarTest
          ? `<button data-admin-test-calendar type="button" ${adminIntegrationActionBusy ? "disabled" : ""}>${adminIntegrationActionBusy ? "Testing..." : "Run Test"}</button>`
          : emailTest
            ? `<button data-admin-test-workspace-email type="button" ${adminIntegrationActionBusy || state === "inactive" ? "disabled" : ""}>${adminIntegrationActionBusy ? "Sending..." : "Send Test to Me"}</button>`
          : twilioTest
            ? `<button data-admin-test-twilio type="button" ${adminIntegrationActionBusy || state === "inactive" ? "disabled" : ""}>${adminIntegrationActionBusy ? "Testing..." : "Run Safe Test"}</button>`
          : href && action
            ? `<a href="${escapeHtml(href)}">${escapeHtml(action)}</a>`
            : ""}
      </footer>
    </article>
  `;
}

function renderAdminIntegrationsWorkspace() {
  const cards = [
    {
      iconName: "operations",
      name: "SNACK Data Service",
      description: "Cloud Run service used by every protected staff workflow.",
      state: adminIntegrationStatus.api,
      detail: adminIntegrationStatus.api === "ready" ? "Service responded normally" : "Could not reach the service"
    },
    {
      iconName: "admin",
      name: "Google Sign-In",
      description: "Verifies SNACK staff accounts and applies the access level selected in Settings.",
      state: adminIntegrationStatus.authentication,
      detail: adminIntegrationStatus.authentication === "ready" ? "Signed in and authorized" : "Sign-in check did not complete",
      href: "./admin.html?section=Settings&tab=Access",
      action: "View Access"
    },
    {
      iconName: "building",
      name: "Firestore Database",
      description: "Stores program, client, fundraising, marketing, operations, and Admin records.",
      state: adminIntegrationStatus.database,
      detail: adminIntegrationStatus.database === "ready" ? "Read/write connection verified" : "Database check did not complete"
    },
    {
      iconName: "marketing",
      name: "Google Workspace Service Email",
      description: "Sends controlled service emails from appointments@snackprogram.org with replies directed to the monitored SNACK inbox.",
      state: adminIntegrationStatus.workspaceEmail,
      detail: adminIntegrationStatus.workspaceEmailMode,
      emailTest: true
    },
    {
      iconName: "marketing",
      name: "MailerLite",
      description: "Future contact synchronization and email campaign delivery provider.",
      state: adminIntegrationStatus.mailerLite,
      detail: adminIntegrationStatus.mailerLiteMode,
      href: "./marketing.html",
      action: "Open Marketing"
    },
    {
      iconName: "calendar",
      name: "Google Calendar",
      description: "One-way Clinic appointment synchronization to the private staff calendar.",
      state: adminIntegrationStatus.calendar,
      detail: adminIntegrationStatus.calendarMode,
      calendarTest: true
    },
    {
      iconName: "note",
      name: "Twilio Text Reminders",
      description: "Safe provider testing for future appointment confirmations and reminders.",
      state: adminIntegrationStatus.twilio,
      statusLabel: adminIntegrationStatus.twilioLabel,
      detail: adminIntegrationStatus.twilioMode,
      twilioTest: true
    },
    {
      iconName: "fundraising",
      name: "YNAB",
      description: "Possible future expense source for financial reporting.",
      state: "planned",
      detail: "Revenue stays in Financial Activity; expenses are not connected"
    }
  ];

  return `
    <div class="admin-workspace-heading">
      <div>
        <h2>Integrations</h2>
        <p>Connection health and provider readiness. Secret keys are configured on the server and never shown here.</p>
      </div>
      <button class="admin-heading-action" data-admin-refresh-integrations type="button">Refresh Connections</button>
    </div>
    ${adminDataMessage ? `<p class="admin-workspace-message" role="status">${escapeHtml(adminDataMessage)}</p>` : ""}
    <div class="admin-integration-grid">${cards.map(renderAdminIntegrationCard).join("")}</div>
  `;
}

function refreshAdminIntegrationsWorkspace() {
  const host = document.querySelector("[data-admin-integrations-workspace]");
  if (!host) return;
  host.dataset.state = adminDataState;
  host.innerHTML = renderAdminIntegrationsWorkspace();
}

function renderAdminAccessLevelOptions(selectedId = "") {
  return adminAccessLevels.map((level) => `
    <option value="${escapeHtml(level.id)}" ${level.id === selectedId ? "selected" : ""}>
      ${escapeHtml(level.name)}
    </option>
  `).join("");
}

function renderAdminAccessModuleChoices(selectedModules = [], disabledModule = "") {
  return adminAccessModules.map((module) => `
    <label>
      <input
        name="modules"
        type="checkbox"
        value="${escapeHtml(module.id)}"
        ${selectedModules.includes(module.id) ? "checked" : ""}
        ${disabledModule === module.id ? "disabled" : ""}
      >
      <span>${escapeHtml(module.name)}</span>
    </label>
  `).join("");
}

function renderAdminFinanceSectionChoices(selectedSections = []) {
  return adminFinanceSections.map((section) => `
    <label>
      <input name="financeSections" type="checkbox" value="${escapeHtml(section)}" ${selectedSections.includes(section) ? "checked" : ""}>
      <span>${escapeHtml(section)}</span>
    </label>
  `).join("");
}

function renderAdminAccessLevelEditor(level) {
  return `
    <form class="admin-access-level-row" data-admin-access-level data-access-level-id="${escapeHtml(level.id)}">
      <label class="admin-access-level-name">
        <span>Access Level</span>
        <input name="name" value="${escapeHtml(level.name)}" required>
      </label>
      <fieldset>
        <legend>Module Access</legend>
        <div class="admin-access-module-options">
          ${renderAdminAccessModuleChoices(level.modules || [], level.admin ? "admin" : "")}
        </div>
      </fieldset>
      <fieldset>
        <legend>Finance Sections</legend>
        <div class="admin-access-module-options">
          ${renderAdminFinanceSectionChoices(level.financeSections || [])}
        </div>
      </fieldset>
      <div class="admin-access-level-action">
        ${level.system
          ? `<span>${level.admin ? "Admin required" : "Built-in level"}</span>`
          : `<button class="danger-action" data-admin-delete-access-level type="button">${adminAccessLevelDeletePendingId === level.id ? "Confirm Delete" : "Delete Level"}</button>`}
        <button class="secondary-action" type="submit">Save Level</button>
      </div>
    </form>
  `;
}

function renderAdminAccessWorkspace() {
  const userRows = adminStaffUsers.map((user) => {
    const protectedOwner = user.protectedOwner === true;
    return `
      <form class="admin-access-row" data-admin-access-user data-staff-email="${escapeHtml(user.email)}">
        <label>
          <span>Name</span>
          <input name="displayName" value="${escapeHtml(user.displayName || "")}" readonly>
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" value="${escapeHtml(user.email)}" readonly>
        </label>
        <label>
          <span>Access Level</span>
          <select name="accessLevelId" ${protectedOwner ? "disabled" : ""}>
            ${renderAdminAccessLevelOptions(user.accessLevelId || user.role)}
          </select>
        </label>
        <label class="admin-access-active">
          <span>Active</span>
          <input name="active" type="checkbox" ${user.active ? "checked" : ""} ${protectedOwner ? "disabled" : ""}>
        </label>
        <div class="admin-access-permissions">
          <span>
            ${protectedOwner ? "Protected owner · " : ""}${escapeHtml((user.modules || []).map((moduleId) => modules[moduleId]?.label || moduleId).join(", ") || "No modules")}
          </span>
          <button class="secondary-action" type="submit" ${protectedOwner ? "disabled" : ""}>Save Access</button>
          ${protectedOwner ? "" : `<button class="danger-action" data-admin-remove-account type="button">${adminAccountDeletePendingEmail === user.email ? "Confirm Remove" : "Remove Account"}</button>`}
        </div>
      </form>
    `;
  }).join("");

  return `
    <div class="admin-access-heading">
      <div>
        <h2>Access</h2>
        <p>Create reusable access levels, choose their modules, and assign one level to each staff account.</p>
      </div>
      ${adminDataMessage ? `<span class="admin-access-message" role="status">${escapeHtml(adminDataMessage)}</span>` : ""}
    </div>
    <section class="admin-access-section" aria-labelledby="admin-access-levels-title">
      <header>
        <div>
          <h3 id="admin-access-levels-title">Access Levels</h3>
          <p>Module changes apply to every account using that level and are enforced immediately.</p>
        </div>
      </header>
      <div class="admin-access-level-list">
        ${adminAccessLevels.map(renderAdminAccessLevelEditor).join("") || `<p class="list-empty">Loading access levels...</p>`}
      </div>
      <form class="admin-access-level-new" data-admin-access-level-new>
        <div class="admin-access-level-new-intro">
          <strong>New Access Level</strong>
          <span>Add another reusable set of permissions.</span>
          <label class="admin-access-level-new-name"><span>Name</span><input name="name" placeholder="Program Coordinator" required></label>
        </div>
        <fieldset>
          <legend>Module Access</legend>
          <div class="admin-access-module-options">${renderAdminAccessModuleChoices([])}</div>
        </fieldset>
        <fieldset>
          <legend>Finance Sections</legend>
          <div class="admin-access-module-options">${renderAdminFinanceSectionChoices([])}</div>
        </fieldset>
        <button class="primary-action" type="submit">${icons.plus}Add Level</button>
      </form>
    </section>
    <section class="admin-access-section" aria-labelledby="admin-staff-accounts-title">
      <header>
        <div>
          <h3 id="admin-staff-accounts-title">Staff Accounts</h3>
          <p>The director account remains protected, and additional staff may be assigned the Admin level.</p>
        </div>
      </header>
      <form class="admin-access-new" data-admin-access-new>
        <label><span>Name</span><input name="displayName" autocomplete="name" required></label>
        <label><span>SNACK Email</span><input name="email" type="email" placeholder="name@snackprogram.org" autocomplete="email" required></label>
        <label><span>Access Level</span><select name="accessLevelId">${renderAdminAccessLevelOptions("Staff")}</select></label>
        <button class="primary-action" type="submit">${icons.plus}Add Staff Account</button>
      </form>
      <div class="admin-access-list">
        ${userRows || `<p class="list-empty">No staff accounts have been added yet.</p>`}
      </div>
    </section>
  `;
}

function refreshAdminAccessWorkspace() {
  if (adminSettingsTab === "Access") refreshAdminSettingsWorkspace();
}

async function adminAccessFetch(path, options = {}) {
  if (!adminCurrentUser) throw new Error("Sign in is required.");
  const token = await adminCurrentUser.getIdToken();
  const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `Access service returned ${response.status}.`);
  return result;
}

function downloadAdminJson(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function downloadAdminBackup(collectionKeys, purpose = "complete") {
  const uniqueKeys = [...new Set(collectionKeys)].filter(Boolean);
  if (!uniqueKeys.length) throw new Error("No data collections are available for backup.");
  const exports = await Promise.all(uniqueKeys.map((key) =>
    adminAccessFetch(`/api/admin/export/${encodeURIComponent(key)}`)));
  const date = new Date().toISOString().slice(0, 10);
  downloadAdminJson({
    format: "SNACK Program Hub data backup",
    purpose,
    exportedAt: new Date().toISOString(),
    collections: Object.fromEntries(exports.map((item) => [item.collection, item]))
  }, `snack-${purpose}-backup-${date}.json`);
  return exports;
}

async function downloadCompleteAdminBackup() {
  if (adminDataActionBusy) return;
  adminDataActionBusy = true;
  adminDataMessage = "Preparing the complete backup...";
  refreshAdminSettingsWorkspace();
  try {
    await downloadAdminBackup(adminDataCollections.map((collection) => collection.key));
    await adminAccessFetch("/api/security-events", {
      method: "POST",
      body: JSON.stringify({ action: "backup.downloaded", resourceType: "backup", resourceId: "complete" })
    });
    adminDataState = "ready";
    adminDataMessage = "Complete backup downloaded. Keep it in a private SNACK folder.";
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "The backup could not be downloaded.";
  } finally {
    adminDataActionBusy = false;
    refreshAdminSettingsWorkspace();
  }
}

async function loadAdminDataCenter() {
  adminDataState = "loading";
  adminDataMessage = "Loading data counts...";
  refreshAdminSettingsWorkspace();
  try {
    const [result, crmSettings, securityHistory] = await Promise.all([
      adminAccessFetch("/api/admin/data-center"),
      adminAccessFetch("/api/admin/crm-settings"),
      adminAccessFetch("/api/admin/security-audit")
    ]);
    adminDataCollections = result.collections || [];
    adminClientStatuses = crmSettings.clientStatuses || adminClientStatuses;
    adminSecurityEvents = securityHistory.events || [];
    adminSecurityEventTotal = Number(securityHistory.total || adminSecurityEvents.length);
    setAdminClientStatuses(adminClientStatuses);
    adminDataState = "ready";
    adminDataMessage = "";
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "The Data Center could not be loaded.";
  }
  refreshAdminSettingsWorkspace();
}

async function previewAdminImport(file, collectionKey) {
  if (!file) return;
  adminDataMessage = "Reading the CSV preview...";
  refreshAdminSettingsWorkspace();
  try {
    adminDataImportPreview = prepareAdminCsvImport(collectionKey, await file.text(), file.name);
    adminDataMessage = adminDataImportPreview.records.length
      ? "Preview ready. No records have been saved."
      : "No importable records were found. Review the skipped rows before continuing.";
  } catch (error) {
    console.error(error);
    adminDataImportPreview = null;
    adminDataState = "error";
    adminDataMessage = error.message || "The CSV could not be previewed.";
  }
  refreshAdminSettingsWorkspace();
}

async function importAdminPreview(form) {
  if (adminDataActionBusy || !adminDataImportPreview?.records.length) return;
  if (!form.elements.reviewed?.checked) {
    adminDataMessage = "Review the preview and check the confirmation box before importing.";
    refreshAdminSettingsWorkspace();
    return;
  }
  const preview = adminDataImportPreview;
  adminDataActionBusy = true;
  adminDataMessage = `Downloading a ${preview.definition.label} backup...`;
  refreshAdminSettingsWorkspace();
  try {
    await downloadAdminBackup([preview.collectionKey], `${preview.collectionKey}-before-import`);
    adminDataMessage = `Importing ${preview.records.length} ${preview.definition.label.toLowerCase()}...`;
    refreshAdminSettingsWorkspace();
    const result = await adminAccessFetch(preview.definition.endpoint, {
      method: "POST",
      body: JSON.stringify({ [preview.definition.payloadKey]: preview.records })
    });
    const importedCount = Number(result.importedCount ?? result.createdCount ?? result.count ?? preview.records.length);
    const skippedCount = Array.isArray(result.skipped) ? result.skipped.length : 0;
    const successMessage = `${importedCount} record${importedCount === 1 ? "" : "s"} imported${skippedCount ? `; ${skippedCount} skipped by final validation` : ""}.`;
    adminDataImportPreview = null;
    await loadAdminDataCenter();
    adminDataMessage = successMessage;
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "The import could not be completed.";
  } finally {
    adminDataActionBusy = false;
    refreshAdminSettingsWorkspace();
  }
}

async function cleanupAdminFixtures(form) {
  if (adminDataActionBusy) return;
  const collectionKeys = [...form.querySelectorAll('input[name="collections"]:checked')]
    .map((input) => input.value);
  const confirmation = String(new FormData(form).get("confirmation") || "").trim();
  if (!collectionKeys.length || confirmation !== "DELETE SAMPLE DATA") {
    adminDataMessage = "Choose at least one collection and type DELETE SAMPLE DATA exactly.";
    refreshAdminSettingsWorkspace();
    return;
  }
  adminDataActionBusy = true;
  adminDataMessage = "Downloading a backup before sample cleanup...";
  refreshAdminSettingsWorkspace();
  try {
    await downloadAdminBackup(collectionKeys, "before-sample-cleanup");
    const result = await adminAccessFetch("/api/admin/qa-fixtures/delete", {
      method: "POST",
      body: JSON.stringify({ collections: collectionKeys, confirmation })
    });
    const deletedCount = Object.values(result.deleted || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    const successMessage = `${deletedCount} marked sample record${deletedCount === 1 ? "" : "s"} deleted. Ordinary records were not selected.`;
    await loadAdminDataCenter();
    adminDataMessage = successMessage;
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "Sample data could not be cleaned up.";
  } finally {
    adminDataActionBusy = false;
    refreshAdminSettingsWorkspace();
  }
}

async function loadAdminAccessUsers() {
  adminDataState = "loading";
  adminDataMessage = adminSettingsTab === "Team" ? "Loading team profiles..." : "Loading access settings...";
  refreshAdminSettingsWorkspace();
  try {
    const result = await adminAccessFetch("/api/admin/staff-users");
    adminStaffUsers = result.users || [];
    adminAccessLevels = result.accessLevels || [];
    adminAccessModules = result.modules || adminAccessModules;
    adminFinanceSections = result.financeSections || adminFinanceSections;
    adminDataState = "ready";
    adminDataMessage = "";
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "Access settings could not be loaded.";
  }
  refreshAdminSettingsWorkspace();
}

async function saveAdminAccessUser(form) {
  if (adminAccessActionBusy) return;
  const values = Object.fromEntries(new FormData(form).entries());
  const email = form.dataset.staffEmail || values.email || "";
  adminAccessActionBusy = true;
  form.querySelectorAll("input, select, button").forEach((control) => { control.disabled = true; });
  adminDataMessage = "Saving access...";
  refreshAdminAccessWorkspace();
  try {
    await adminAccessFetch(`/api/admin/staff-users/${encodeURIComponent(email)}`, {
      method: "PUT",
      body: JSON.stringify({
        displayName: values.displayName,
        accessLevelId: values.accessLevelId,
        active: form.elements.active ? form.elements.active.checked : true
      })
    });
    await loadAdminAccessUsers();
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "Staff access could not be saved.";
    refreshAdminAccessWorkspace();
  } finally {
    adminAccessActionBusy = false;
  }
}

async function saveAdminAccessLevel(form, creating = false) {
  if (adminAccessLevelActionBusy) return;
  const values = Object.fromEntries(new FormData(form).entries());
  const accessLevelId = form.dataset.accessLevelId || "";
  const selectedModules = [...form.querySelectorAll('input[name="modules"]:checked')]
    .map((input) => input.value);
  const selectedFinanceSections = [...form.querySelectorAll('input[name="financeSections"]:checked')]
    .map((input) => input.value);
  adminAccessLevelActionBusy = true;
  adminAccessLevelDeletePendingId = "";
  form.querySelectorAll("input, button").forEach((control) => { control.disabled = true; });
  adminDataMessage = creating ? "Adding access level..." : "Saving access level...";
  refreshAdminAccessWorkspace();
  try {
    await adminAccessFetch(
      creating
        ? "/api/admin/access-levels"
        : `/api/admin/access-levels/${encodeURIComponent(accessLevelId)}`,
      {
        method: creating ? "POST" : "PUT",
        body: JSON.stringify({
          name: values.name,
          modules: selectedModules,
          financeSections: selectedFinanceSections
        })
      }
    );
    await loadAdminAccessUsers();
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "The access level could not be saved.";
    refreshAdminAccessWorkspace();
  } finally {
    adminAccessLevelActionBusy = false;
  }
}

async function removeAdminAccessLevel(form) {
  if (adminAccessLevelActionBusy) return;
  const accessLevelId = form.dataset.accessLevelId || "";
  if (!accessLevelId) return;
  if (adminAccessLevelDeletePendingId !== accessLevelId) {
    adminAccessLevelDeletePendingId = accessLevelId;
    adminDataMessage = "Click Confirm Delete to remove this custom access level. If anyone uses it, reassign that account first.";
    refreshAdminAccessWorkspace();
    return;
  }

  adminAccessLevelActionBusy = true;
  adminDataMessage = "Deleting the access level...";
  refreshAdminAccessWorkspace();
  try {
    await adminAccessFetch(`/api/admin/access-levels/${encodeURIComponent(accessLevelId)}`, { method: "DELETE" });
    adminAccessLevelDeletePendingId = "";
    await loadAdminAccessUsers();
    adminDataMessage = "The custom access level was deleted.";
    refreshAdminAccessWorkspace();
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "The access level could not be deleted.";
    refreshAdminAccessWorkspace();
  } finally {
    adminAccessLevelActionBusy = false;
  }
}

async function removeAdminStaffAccount(form) {
  if (adminAccessActionBusy) return;
  const email = form.dataset.staffEmail || "";
  if (adminAccountDeletePendingEmail !== email) {
    adminAccountDeletePendingEmail = email;
    adminDataMessage = "Click Confirm Remove to remove this person's app access and team profile. Their Google account will not be deleted.";
    refreshAdminAccessWorkspace();
    return;
  }

  adminAccessActionBusy = true;
  adminDataMessage = "Removing the staff account...";
  refreshAdminAccessWorkspace();
  try {
    await adminAccessFetch(`/api/admin/staff-users/${encodeURIComponent(email)}`, { method: "DELETE" });
    adminAccountDeletePendingEmail = "";
    await loadAdminAccessUsers();
    adminDataMessage = "The staff account was removed from this app. The person's Google account was not changed.";
    refreshAdminAccessWorkspace();
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "The staff account could not be removed.";
    refreshAdminAccessWorkspace();
  } finally {
    adminAccessActionBusy = false;
  }
}

async function saveAdminTeamProfile(form) {
  if (adminTeamActionBusy) return;
  const values = Object.fromEntries(new FormData(form).entries());
  const email = form.dataset.staffEmail || values.email || "";
  const programs = [...form.querySelectorAll('input[name="programs"]:checked')].map((input) => input.value);
  adminTeamActionBusy = true;
  form.querySelectorAll("input, button").forEach((control) => { control.disabled = true; });
  adminDataMessage = "Saving team profile...";
  refreshAdminTeamWorkspace();
  try {
    await adminAccessFetch(`/api/admin/staff-users/${encodeURIComponent(email)}/profile`, {
      method: "PATCH",
      body: JSON.stringify({
        displayName: values.displayName,
        title: values.title,
        phone: values.phone,
        programs
      })
    });
    await loadAdminAccessUsers();
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = error.message || "The team profile could not be saved.";
    refreshAdminTeamWorkspace();
  } finally {
    adminTeamActionBusy = false;
  }
}

async function loadAdminIntegrationStatus() {
  adminDataState = "loading";
  adminDataMessage = "Checking connections...";
  adminIntegrationStatus = {
    api: "checking",
    authentication: "checking",
    database: "checking",
    calendar: "checking",
    calendarMode: "Checking connection...",
    workspaceEmail: "checking",
    workspaceEmailMode: "Checking connection...",
    workspaceEmailSender: "appointments@snackprogram.org",
    mailerLite: "checking",
    mailerLiteMode: "Checking connection...",
    twilio: "checking",
    twilioLabel: "Checking",
    twilioMode: "Checking connection..."
  };
  refreshAdminIntegrationsWorkspace();

  const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
  const [healthResult, accessResult, databaseResult, workspaceEmailResult, mailerLiteResult, twilioResult, calendarResult] = await Promise.allSettled([
    fetch(`${apiBaseUrl}/health`).then((response) => {
      if (!response.ok) throw new Error("Data service unavailable");
      return response.json();
    }),
    adminAccessFetch("/api/access/me"),
    adminAccessFetch("/api/admin/scheduling-settings"),
    adminAccessFetch("/api/reminders/email/status"),
    adminAccessFetch("/api/marketing/mailerlite/status"),
    adminAccessFetch("/api/reminders/twilio/status"),
    adminAccessFetch("/api/admin/google-calendar/status")
  ]);

  const mailerLite = mailerLiteResult.status === "fulfilled" ? mailerLiteResult.value : null;
  const workspaceEmail = workspaceEmailResult.status === "fulfilled" ? workspaceEmailResult.value : null;
  const twilio = twilioResult.status === "fulfilled" ? twilioResult.value : null;
  const calendar = calendarResult.status === "fulfilled" ? calendarResult.value : null;
  const calendarState = calendar?.connected
    ? "ready"
    : calendar?.configured && !calendar?.enabled
      ? "paused"
      : calendarResult.status === "fulfilled"
        ? calendar?.error ? "error" : "inactive"
        : "error";
  adminIntegrationStatus = {
    api: healthResult.status === "fulfilled" ? "ready" : "error",
    authentication: accessResult.status === "fulfilled" ? "ready" : "error",
    database: databaseResult.status === "fulfilled" ? "ready" : "error",
    workspaceEmail: workspaceEmail?.configured
      ? "ready"
      : workspaceEmailResult.status === "fulfilled"
        ? "inactive"
        : "error",
    workspaceEmailMode: workspaceEmail?.connectionMode || (workspaceEmailResult.status === "fulfilled" ? "Workspace sender has not been configured" : "Connection check failed"),
    workspaceEmailSender: workspaceEmail?.senderEmail || "appointments@snackprogram.org",
    calendar: calendarState,
    calendarMode: calendar?.connected
      ? `${calendar.calendarName || "Clinic Appts"} is connected`
      : calendar?.configured && !calendar?.enabled
        ? "Clinic Appts selected; synchronization is paused for testing"
        : calendar?.error || (calendarResult.status === "fulfilled" ? "Calendar access has not been configured" : "Connection check failed"),
    mailerLite: mailerLite?.connected
      ? "ready"
      : mailerLite?.configured
        ? "error"
        : mailerLiteResult.status === "fulfilled"
          ? "inactive"
          : "error",
    mailerLiteMode: mailerLite?.connectionMode || (mailerLiteResult.status === "fulfilled" ? "API token has not been configured" : "Connection check failed"),
    twilio: twilio?.connected
      ? "ready"
      : twilio?.configured
        ? "paused"
        : twilioResult.status === "fulfilled"
          ? "inactive"
          : "error",
    twilioLabel: twilio?.connected ? "Test Passed" : twilio?.configured ? "Ready to Test" : "Not Connected",
    twilioMode: twilio?.connectionMode || (twilioResult.status === "fulfilled" ? "Twilio test details have not been configured" : "Connection check failed")
  };
  const failureTasks = [
    adminIntegrationStatus.calendar === "error"
      ? ["Google Calendar", adminIntegrationStatus.calendarMode]
      : null,
    adminIntegrationStatus.mailerLite === "error"
      ? ["MailerLite", adminIntegrationStatus.mailerLiteMode]
      : null
  ].filter(Boolean);
  await Promise.all(failureTasks.map(([service, detail]) => adminAccessFetch("/api/tasks", {
    method: "POST",
    body: JSON.stringify({
      title: `Check ${service} connection`,
      type: "Task",
      status: "Open",
      priority: "High",
      dueDate: scheduleDateKey(new Date()),
      assignedTo: "",
      source: "Workflow Automation",
      notes: `${service} failed a real connection check: ${detail}. No secret keys or client messages are included in this task.`
    })
  }).catch((error) => console.error(`Could not record the ${service} connection task.`, error))));
  adminDataState = "ready";
  adminDataMessage = "";
  refreshAdminIntegrationsWorkspace();
}

async function testAdminGoogleCalendar() {
  if (adminIntegrationActionBusy) return;
  adminIntegrationActionBusy = true;
  adminDataMessage = "Creating, updating, and removing one QA Calendar event...";
  refreshAdminIntegrationsWorkspace();

  try {
    const result = await adminAccessFetch("/api/admin/google-calendar/test", {
      method: "POST",
      body: JSON.stringify({ confirmation: "TEST CLINIC CALENDAR" })
    });
    const passed = result.lifecycle?.created && result.lifecycle?.updated && result.lifecycle?.removed;
    if (!passed) throw new Error("The Calendar lifecycle did not complete all three steps.");
    await loadAdminIntegrationStatus();
    adminDataMessage = result.synchronizationEnabled
      ? "Calendar connection passed: the QA event was created, updated, and removed. Appointment sync is active."
      : "Calendar connection passed: the QA event was created, updated, and removed. Everyday appointment sync remains paused.";
  } catch (error) {
    console.error(error);
    adminDataMessage = error.message || "The Calendar connection test could not be completed.";
  } finally {
    adminIntegrationActionBusy = false;
    refreshAdminIntegrationsWorkspace();
  }
}

async function testAdminTwilio() {
  if (adminIntegrationActionBusy) return;
  adminIntegrationActionBusy = true;
  adminDataMessage = "Running a Twilio simulation. No text will be sent.";
  refreshAdminIntegrationsWorkspace();

  try {
    const result = await adminAccessFetch("/api/reminders/twilio/test", {
      method: "POST",
      body: JSON.stringify({ confirmation: "TEST TWILIO WITHOUT SENDING" })
    });
    adminIntegrationStatus.twilio = result.connected ? "ready" : "error";
    adminIntegrationStatus.twilioLabel = result.connected ? "Test Passed" : "Check Failed";
    adminIntegrationStatus.twilioMode = result.connectionMode || "The safe Twilio test did not pass";
    adminDataMessage = result.connected
      ? "The safe Twilio test passed. No text was sent and delivery remains off."
      : adminIntegrationStatus.twilioMode;
  } catch (error) {
    console.error(error);
    adminIntegrationStatus.twilio = "error";
    adminIntegrationStatus.twilioLabel = "Check Failed";
    adminIntegrationStatus.twilioMode = error.message || "The safe Twilio test could not be completed";
    adminDataMessage = adminIntegrationStatus.twilioMode;
  } finally {
    adminIntegrationActionBusy = false;
    refreshAdminIntegrationsWorkspace();
  }
}

async function testAdminWorkspaceEmail() {
  if (adminIntegrationActionBusy) return;
  adminIntegrationActionBusy = true;
  adminDataMessage = "Sending one private-safe test email to your signed-in SNACK address...";
  refreshAdminIntegrationsWorkspace();

  try {
    const result = await adminAccessFetch("/api/reminders/email/test", {
      method: "POST",
      body: JSON.stringify({ confirmation: "SEND SAFE WORKSPACE TEST" })
    });
    adminIntegrationStatus.workspaceEmail = result.sent ? "ready" : "error";
    adminIntegrationStatus.workspaceEmailMode = result.sent
      ? `Test sent from ${result.senderEmail} to ${result.recipient}; automatic delivery remains off`
      : "The controlled test did not send";
    adminDataMessage = result.sent
      ? `Test email sent to ${result.recipient}. Check the inbox and confirm the sender and Reply-To address look right.`
      : adminIntegrationStatus.workspaceEmailMode;
  } catch (error) {
    console.error(error);
    adminIntegrationStatus.workspaceEmail = "error";
    adminIntegrationStatus.workspaceEmailMode = error.message || "The controlled email test could not be completed";
    adminDataMessage = adminIntegrationStatus.workspaceEmailMode;
  } finally {
    adminIntegrationActionBusy = false;
    refreshAdminIntegrationsWorkspace();
  }
}

function refreshAdminSchedulingWorkspace() {
  const host = document.querySelector("[data-admin-scheduling-workspace]");
  if (!host) return;
  host.dataset.state = adminDataState;
  host.innerHTML = `
    <div class="admin-settings-intro">
      <p>Clinic and Kitchen scheduling choices are managed here so program pages stay focused on day-to-day work.</p>
      ${adminDataMessage ? `<span data-admin-settings-message>${escapeHtml(adminDataMessage)}</span>` : ""}
    </div>
    ${renderProgramSettings()}
  `;
}

function formatHomeDate(value, options = { weekday: "short", month: "short", day: "numeric" }) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value || "-";
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function formatHomeTime(value) {
  if (!/^\d{1,2}:\d{2}$/.test(String(value || ""))) return value || "Time TBD";
  return formatScheduleTime(scheduleTimeMinutes(value));
}

function homeStatusTone(value) {
  if (["Overdue", "No-show", "Canceled"].includes(value)) return "red";
  if (["Due Today", "Planning", "In Progress"].includes(value)) return "yellow";
  if (["Completed", "Approved"].includes(value)) return "green";
  return "blue";
}

function homeItemIcon(kind) {
  if (kind === "task") return icons.check;
  if (kind === "kitchen") return icons.utensils;
  if (kind === "school") return icons.building;
  if (kind === "outreach") return icons.outreach;
  return icons.calendar;
}

function homeItemUrl(item) {
  if (item.kind === "appointment") {
    const params = new URLSearchParams({ appointment: item.id, date: item.date });
    return `./schedule.html?${params.toString()}`;
  }
  if (item.kind === "task") {
    const task = item.source || {};
    if (task.referralId) return `./crm.html?section=Referrals&referral=${encodeURIComponent(task.referralId)}`;
    if (task.clientId) return `./crm.html?section=Clients&client=${encodeURIComponent(task.clientId)}`;
    if (task.appointmentId) return `./schedule.html?appointment=${encodeURIComponent(task.appointmentId)}`;
    return "#home-tasks";
  }
  if (item.kind === "kitchen") return "./schedule.html?section=Kitchen";
  if (item.kind === "school") return "./schedule.html?section=School";
  return "./outreach.html?section=Events";
}

function renderHomeRows(items, emptyMessage) {
  if (!items.length) return `<p class="home-empty">${escapeHtml(emptyMessage)}</p>`;
  return items.map((item) => {
    const taskLabel = item.kind === "task"
      ? item.dueBucket
      : [item.date ? formatHomeDate(item.date) : "", item.time ? formatHomeTime(item.time) : ""].filter(Boolean).join(" | ");
    const supportingText = [taskLabel, item.subtitle].filter(Boolean).join(" | ");
    const status = item.kind === "task" ? item.dueBucket : item.status;
    return `
      <a class="home-row" href="${escapeHtml(homeItemUrl(item))}">
        <span class="home-row-icon" data-home-kind="${escapeHtml(item.kind)}">${homeItemIcon(item.kind)}</span>
        <span class="home-row-copy">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(supportingText)}</span>
        </span>
        <span class="home-status" data-home-tone="${homeStatusTone(status)}">${escapeHtml(status)}</span>
        ${icons.chevronRight}
      </a>
    `;
  }).join("");
}

function renderHomeWorkflow(items = []) {
  const queues = [
    ["New Referrals", "Ready for first contact", "red"],
    ["Reschedule", "Need a new appointment time", "red"],
    ["No Next Appointment", "Active without a future visit", "blue"],
    ["Waiting on Family", "Awaiting a response or decision", "purple"]
  ];
  return `
    <section class="home-workflow" aria-label="Workflow">
      <header>
        <div><h2>Workflow</h2><p>Families and appointments that need attention</p></div>
      </header>
      <div class="crm-dashboard-queues">
        ${queues.map(([queue, description, tone]) => {
          const queueItems = items.filter((item) => item.queue === queue);
          return `
            <section class="crm-dashboard-queue" data-queue-tone="${tone}">
              <header><div><h3>${escapeHtml(queue)}</h3><p>${escapeHtml(description)}</p></div><strong>${queueItems.length}</strong></header>
              <div class="crm-dashboard-list">
                ${queueItems.length ? queueItems.slice(0, 3).map((item) => {
                  const parameter = item.section === "Referrals" ? "referral" : "client";
                  const url = `./crm.html?section=${encodeURIComponent(item.section)}&${parameter}=${encodeURIComponent(item.recordId)}`;
                  return `
                    <a class="crm-dashboard-row" href="${escapeHtml(url)}">
                      <span class="crm-dashboard-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subtitle)}</span></span>
                      <span class="status-pill" data-status-tone="${escapeHtml(item.statusTone || tone)}">${escapeHtml(item.status)}</span>
                    </a>
                  `;
                }).join("") : `<p class="crm-dashboard-none">Nothing in this queue.</p>`}
              </div>
              ${queueItems.length > 3 ? `<a class="crm-dashboard-expand" href="./crm.html?section=${queue === "New Referrals" ? "Referrals" : "Clients"}">View All ${queueItems.length}</a>` : ""}
            </section>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function normalizedTaskAssignee(value) {
  return String(value || "").trim().toLowerCase();
}

function homeTaskMatchesAssignee(task = {}) {
  const assignedTo = normalizedTaskAssignee(task.assignedTo);
  if (homeTaskAssigneeFilter === "all") return true;
  if (homeTaskAssigneeFilter === "shared") return !assignedTo;
  if (homeTaskAssigneeFilter.startsWith("assignee:")) {
    return assignedTo === normalizedTaskAssignee(homeTaskAssigneeFilter.slice(9));
  }
  const currentNames = new Set([
    homeCurrentUser?.displayName,
    homeCurrentUser?.email,
    staffAccessProfile?.displayName,
    staffAccessProfile?.email
  ].map(normalizedTaskAssignee).filter(Boolean));
  return !assignedTo || currentNames.has(assignedTo);
}

function renderHomeTaskFilter() {
  const staffOptions = homeStaffDirectory.map((user) => `
    <option value="assignee:${escapeHtml(user.displayName)}" ${homeTaskAssigneeFilter === `assignee:${user.displayName}` ? "selected" : ""}>${escapeHtml(user.displayName)}</option>
  `).join("");
  return `
    <label class="home-task-filter">
      <span>Task List</span>
      <select data-home-task-filter>
        <option value="mine" ${homeTaskAssigneeFilter === "mine" ? "selected" : ""}>My Tasks + Shared</option>
        <option value="shared" ${homeTaskAssigneeFilter === "shared" ? "selected" : ""}>Shared Tasks</option>
        <option value="all" ${homeTaskAssigneeFilter === "all" ? "selected" : ""}>All Tasks</option>
        ${staffOptions}
      </select>
    </label>
  `;
}

function renderHomeDashboard() {
  const visibleTasks = homeTasks.filter(homeTaskMatchesAssignee);
  const dashboard = homeDashboardData({
    appointments: homeAppointments,
    tasks: visibleTasks,
    sessions: homeProgramSessions,
    events: homeOutreachEvents
  });
  const appointmentRows = dashboard.todayAppointments.slice(0, 4);
  const taskRows = dashboard.activeTasks.slice(0, 4);
  const upcomingRows = dashboard.upcoming.slice(0, 4);
  const canViewSchedule = staffCanAccessModule("schedule");
  const canViewCrm = staffCanAccessModule("crm");
  const canViewUpcoming = canViewSchedule || staffCanAccessModule("outreach");
  const workflowItems = canViewCrm ? crmDashboardItems({
    clients: homeClients,
    referrals: homeReferrals,
    appointments: homeAppointments,
    tasks: homeTasks
  }) : [];

  if (homeDataState !== "ready") {
    return `
      <section class="home-state" data-state="${escapeHtml(homeDataState)}">
        <span class="home-state-icon">${icons.home}</span>
        <h2>${homeDataState === "signed-out" ? "Welcome to SNACK Program Hub" : "Preparing your day"}</h2>
        <p>${escapeHtml(homeDataMessage)}</p>
        ${homeDataState === "signed-out" ? `<button data-home-sign-in type="button">Sign In</button>` : ""}
      </section>
    `;
  }

  const todayLabel = formatHomeDate(dashboard.today, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  return `
    <div class="home-overview-bar">
      <div>
        <strong>Today</strong>
        <span>${escapeHtml(todayLabel)}</span>
      </div>
      <button class="home-refresh" data-home-refresh type="button" aria-label="Refresh Home dashboard" title="Refresh">${icons.history}</button>
    </div>

    <section class="home-summary" aria-label="Today's summary">
      <a href="./schedule.html">
        <strong>${canViewSchedule ? dashboard.todayAppointments.length : "-"}</strong>
        <span>Appointments Today</span>
      </a>
      <a href="#home-tasks">
        <strong>${canViewCrm ? dashboard.dueTasks.length : "-"}</strong>
        <span>Tasks Due</span>
        ${canViewCrm && dashboard.overdueTaskCount ? `<em>${dashboard.overdueTaskCount} overdue</em>` : ""}
      </a>
      <a href="./schedule.html?section=Kitchen">
        <strong>${canViewUpcoming ? dashboard.upcoming.length : "-"}</strong>
        <span>Coming Up</span>
        <em>Next 14 days</em>
      </a>
    </section>

    ${homeDataMessage ? `<p class="home-data-message" role="status">${escapeHtml(homeDataMessage)}</p>` : ""}

    ${canViewCrm ? renderHomeWorkflow(workflowItems) : ""}

    <div class="home-primary-grid">
      <section class="home-panel">
        <header>
          <div>
            <h2>Today's Schedule</h2>
            <p>Clinic appointments at a glance</p>
          </div>
          ${canViewSchedule ? `<div class="home-panel-actions">
            <button data-home-print-daily type="button">Print Daily Forms</button>
            <a href="./schedule.html">View Schedule ${icons.chevronRight}</a>
          </div>` : ""}
        </header>
        <div class="home-list">
          ${canViewSchedule
            ? renderHomeRows(appointmentRows, "No clinic appointments scheduled today.")
            : `<p class="home-empty">Schedule access is not enabled for this account.</p>`}
        </div>
      </section>

      <section class="home-panel" id="home-tasks">
        <header>
          <div>
            <h2>Tasks</h2>
            <p>Overdue and upcoming work first</p>
          </div>
          ${canViewCrm ? `<div class="home-panel-actions">${renderHomeTaskFilter()}<button data-home-new-task type="button">Add Task</button></div>` : ""}
        </header>
        <div class="home-list">
          ${canViewCrm
            ? renderHomeRows(taskRows, "No open workflow tasks.")
            : `<p class="home-empty">CRM access is not enabled for this account.</p>`}
        </div>
      </section>
    </div>

    <section class="home-panel home-upcoming-panel">
      <header>
        <div>
          <h2>Coming Up</h2>
          <p>Kitchen Classes, School Classes, and Outreach Events</p>
        </div>
      </header>
      <div class="home-upcoming-grid">
        ${canViewUpcoming
          ? renderHomeRows(upcomingRows, "No classes or outreach events in the next 14 days.")
          : `<p class="home-empty">Schedule and Outreach access are not enabled for this account.</p>`}
      </div>
    </section>
  `;
}

function refreshHomeDashboard() {
  const host = document.querySelector("[data-home-dashboard]");
  if (host) host.innerHTML = renderHomeDashboard();
}

function openHomeDailyForms() {
  const today = scheduleDateKey(new Date());
  const clientsById = new Map(homeClients.map((client) => [client.id, client]));
  const printItems = homeAppointments.map((appointment) => mapAppointment(appointment, clientsById));
  const appointments = printableScheduleItems(printItems, today).filter((item) => item.status !== "Blocked");
  const notePages = dailyAppointmentNotePages(printItems, today, clientsById);
  if (!appointments.length || !notePages.length) {
    homeDataMessage = "There are no Clinic appointments to print for today.";
    refreshHomeDashboard();
    return;
  }

  const packetRequests = dailyFormPacketRequests(printItems, today, clientsById);
  const baseHref = new URL("./", location.href).href;
  const printWindow = openAuthenticatedPrintWindow(
    dailyFormsPrintDocumentHtml({
      title: `Daily Forms - ${formatHomeDate(today, { month: "long", day: "numeric", year: "numeric" })}`,
      packetRequests,
      notePages,
      baseHref
    }),
    () => {
      homeDataMessage = "The print window was blocked. Allow pop-ups for SNACK Program Hub and try again.";
      refreshHomeDashboard();
    }
  );
  if (!printWindow) return;
  homeDataMessage = "Today's forms and appointment notes opened in one print window.";
  refreshHomeDashboard();
}

async function homeAuthedFetch(user, path, options = {}) {
  const token = await user.getIdToken();
  const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}.`);
  return response.json();
}

async function loadHomeData(user) {
  homeDataState = "loading";
  homeDataMessage = "Loading today's highlights...";
  refreshHomeDashboard();

  const canViewSchedule = staffCanAccessModule("schedule");
  const canViewCrm = staffCanAccessModule("crm");
  const canViewOutreach = staffCanAccessModule("outreach");
  const request = async (allowed, path, fallback) => {
    if (!allowed) return { value: fallback, error: "" };
    try {
      return { value: await homeAuthedFetch(user, path), error: "" };
    } catch (error) {
      console.error(error);
      return { value: fallback, error: error.message || path };
    }
  };

  if (canViewCrm) {
    await homeAuthedFetch(user, "/api/tasks/reconcile", { method: "POST" }).catch((error) => {
      console.error(error);
    });
  }

  const [appointmentResult, clientResult, referralResult, taskResult, sessionResult, eventResult, staffResult] = await Promise.all([
    request(canViewSchedule, "/api/appointments", { appointments: [] }),
    request(canViewCrm || canViewSchedule, "/api/clients", { clients: [] }),
    request(canViewCrm, "/api/referrals", { referrals: [] }),
    request(canViewCrm, "/api/tasks", { tasks: [] }),
    request(canViewSchedule, "/api/program-sessions", { sessions: [] }),
    request(canViewOutreach, "/api/outreach-events", { events: [] }),
    request(canViewCrm, "/api/staff-directory", { users: [] })
  ]);

  const clientsById = new Map((clientResult.value.clients || []).map((client) => [client.id, client]));
  homeAppointments = (appointmentResult.value.appointments || []).map((appointment) => {
    const clientIds = Array.isArray(appointment.clientIds)
      ? appointment.clientIds
      : appointment.clientId
        ? [appointment.clientId]
        : [];
    const clientNames = clientIds.map((clientId) => {
      const client = clientsById.get(clientId);
      return client ? [client.firstName, client.lastName].filter(Boolean).join(" ") : "";
    }).filter(Boolean);
    return { ...appointment, clientNames };
  });
  homeClients = clientResult.value.clients || [];
  homeReferrals = referralResult.value.referrals || [];
  homeTasks = taskResult.value.tasks || [];
  homeProgramSessions = sessionResult.value.sessions || [];
  homeOutreachEvents = eventResult.value.events || [];
  homeStaffDirectory = staffResult.value.users || [];

  const failures = [appointmentResult, clientResult, referralResult, taskResult, sessionResult, eventResult, staffResult].filter((result) => result.error);
  homeDataState = "ready";
  homeDataMessage = failures.length ? "Some highlights could not be loaded. The available sections are shown below." : "";
  refreshHomeDashboard();
}

async function initializeHomeData() {
  if (currentModuleId() !== "home") return;

  try {
    const [{ initializeApp }, { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js")
    ]);
    const auth = getAuth(initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG));
    await configureSecureAuthSession(auth);
    const provider = new GoogleAuthProvider();
    const account = document.querySelector(".account");
    const accountName = document.querySelector("[data-account-name]");
    homeOpenSignIn = () => {
      if (!homeCurrentUser) signInWithPopup(auth, provider).catch((error) => console.error(error));
    };
    account?.setAttribute("role", "button");
    account?.setAttribute("tabindex", "0");
    account?.addEventListener("click", homeOpenSignIn);
    account?.addEventListener("keydown", (event) => {
      if (["Enter", " "].includes(event.key)) {
        event.preventDefault();
        homeOpenSignIn();
      }
    });

    onAuthStateChanged(auth, async (user) => {
      homeCurrentUser = user;
      if (user) {
        if (!(await authorizeStaffUser(user))) return;
        if (accountName) accountName.textContent = staffAccessProfile?.displayName || user.displayName || "SNACK Staff";
        account?.removeAttribute("title");
        loadHomeData(user);
        return;
      }

      if (accountName) accountName.textContent = "Sign in";
      account?.setAttribute("title", "Sign in to load today's highlights");
      homeAppointments = [];
      homeClients = [];
      homeReferrals = [];
      homeTasks = [];
      homeProgramSessions = [];
      homeOutreachEvents = [];
      homeStaffDirectory = [];
      homeDataState = "signed-out";
      homeDataMessage = "Sign in with your SNACK Google account to see today's work.";
      refreshHomeDashboard();
    });
  } catch (error) {
    console.error(error);
    homeDataState = "error";
    homeDataMessage = "The secure sign-in connection could not be started.";
    refreshHomeDashboard();
  }
}

function renderModulePage(moduleId) {
  const module = modules[moduleId];
  const adminSettings = isAdminSettingsPage(moduleId);
  const adminSchedule = isAdminSchedulePage(moduleId);
  const adminIntegrations = isAdminIntegrationsPage(moduleId);
  const adminSpecialPage = adminSettings || adminSchedule || adminIntegrations;
  const activeSubpage = moduleId === "schedule"
    ? scheduleSubpage
    : moduleId === "crm"
      ? crmSubpage
      : moduleId === "outreach"
        ? outreachSubpage
        : moduleId === "fundraising"
          ? fundraisingSubpage
          : moduleId === "marketing"
            ? marketingSubpage
            : moduleId === "operations"
              ? operationsSubpage
              : "";
  const adminPageTitle = adminSettings
    ? "Settings"
    : adminSchedule
      ? "Schedule Settings"
      : adminIntegrations
        ? "Integrations"
        : cleanModulePageTitle(moduleId, module.label, activeSubpage, module.title);
  const showModuleSummary = moduleId !== "home" && !adminSpecialPage && cleanModuleSummaryVisible(moduleId, activeSubpage);
  const navigationModuleId = isOperationsOutreachReport() ? "operations" : moduleId;
  const navigationModule = modules[navigationModuleId];
  selectedItemId = module.items.some((item) => item.id === selectedItemId)
    ? selectedItemId
    : module.items[0]?.id || "";
  document.title = `SNACK Program Hub ${isOperationsOutreachReport() ? "Operations Reports" : adminPageTitle}`;

  const app = document.querySelector("#app");
  app.innerHTML = `
    <div
      class="app-shell"
      data-shell
      ${moduleId === "home" ? "" : "hidden"}
      data-module-id="${navigationModuleId}"
      ${moduleId === "crm" ? `data-crm-section="${escapeHtml(crmSubpage)}"` : ""}
      ${moduleId === "outreach" ? `data-outreach-section="${escapeHtml(outreachSubpage)}"` : ""}
      ${moduleId === "fundraising" ? `data-fundraising-section="${escapeHtml(fundraisingSubpage)}"` : ""}
      ${moduleId === "marketing" ? `data-marketing-section="${escapeHtml(marketingSubpage)}"` : ""}
      ${moduleId === "operations" ? `data-operations-section="${escapeHtml(operationsSubpage)}"` : ""}
      ${moduleId === "admin" ? `data-admin-section="${escapeHtml(adminSubpage)}"` : ""}
      style="--module: ${navigationModule.theme[0]}; --module-soft: ${navigationModule.theme[1]}; --module-line: ${navigationModule.theme[2]};"
    >
      <aside class="sidebar" aria-label="Main navigation">
        <div class="brand">
          <a class="brand-mark" href="./index.html" aria-label="Home">
            <img src="./favicon.png" alt="">
          </a>
          <a class="brand-copy" href="./index.html" aria-label="SNACK Program Hub Home">
            <strong>SNACK</strong>
            <span>Program Hub</span>
          </a>
          <button class="sidebar-collapse-button" data-toggle-sidebar type="button" aria-label="Collapse navigation" title="Collapse navigation">
            ${icons.chevronLeft}
          </button>
        </div>

        <div class="sidebar-scroll">
          <nav class="module-nav" aria-label="${navigationModule.label} navigation">
            ${renderNav(navigationModuleId)}
          </nav>
        </div>

        ${module.quickActions.length && moduleId !== "admin" && !adminSpecialPage ? `<section class="quick-actions" aria-label="Quick actions">
          <h2>Quick Actions</h2>
          ${module.quickActions.map((action) => `
            <button class="quick-button" ${moduleId === "schedule" && action === "New Appointment" ? "data-open-new-appointment" : ""} ${moduleId === "schedule" && action === "Block Time" ? "data-open-block-time" : ""} ${moduleId === "schedule" && action === "Print Forms" ? "data-open-schedule-print-center" : ""} ${moduleId === "crm" ? crmCreateActionAttribute(action) : ""} ${moduleId === "outreach" ? outreachCreateActionAttribute(action) : ""} ${moduleId === "fundraising" ? "data-fundraising-new" : ""} ${moduleId === "marketing" ? "data-marketing-new" : ""} type="button">${icon("plus")}${action}</button>
          `).join("")}
        </section>` : ""}

        <div class="account">
          <button class="account-trigger" data-account-menu-toggle type="button" aria-haspopup="menu" aria-expanded="false" hidden>
            <span class="avatar">SO</span>
            <strong data-account-name>Shannon Oddo</strong>
            <span class="account-chevron">${icons.chevronRight}</span>
          </button>
          <div class="account-menu" data-account-menu role="menu" hidden>
            <button class="account-sign-out" data-secure-sign-out role="menuitem" type="button" hidden>Sign Out</button>
          </div>
        </div>
      </aside>

      <main class="main">
        <header class="page-header">
          <div class="page-title">
            <h1 data-page-title>${adminPageTitle}</h1>
          </div>

          <div class="header-actions" ${moduleId === "schedule" ? "data-schedule-header-actions" : ""} ${adminSpecialPage || moduleId === "home" ? "hidden" : ""}>
            ${module.views.length ? `<div class="view-switch" role="group" aria-label="${module.label} views" style="grid-template-columns: repeat(${module.views.length}, minmax(86px, 1fr));">
              ${module.views.map((view, index) => `
                <button
                  class="${moduleId === "schedule" ? (view.toLowerCase() === scheduleViewMode ? "is-active" : "") : moduleId === "outreach" ? ((outreachSubpage === "Volunteers" ? view === outreachVolunteerView : view === outreachSubpage) ? "is-active" : "") : moduleId === "fundraising" ? (view === fundraisingGivingView ? "is-active" : "") : (index === 0 ? "is-active" : "")}"
                  ${moduleId === "schedule" ? `data-schedule-view="${view.toLowerCase()}"` : ""}
                  ${moduleId === "outreach" ? `data-outreach-view="${escapeHtml(view)}"` : ""}
                  ${moduleId === "fundraising" && fundraisingSubpage === "Giving" ? `data-fundraising-giving-view="${escapeHtml(view)}"` : ""}
                  type="button"
                >${view}</button>
              `).join("")}
            </div>` : ""}
            ${moduleId === "crm" && crmSubpage === "Referrals"
              ? `<a class="header-link-action" href="./refer.html" target="_blank" rel="noopener">${icons.file}External Referral Form</a>`
              : ""}
            ${moduleId === "outreach" && outreachSubpage === "Volunteers"
              ? `<a class="header-link-action" href="./volunteer.html" target="_blank" rel="noopener">${icons.file}Volunteer Application</a>`
              : ""}
            ${module.primaryAction ? `<button class="primary-action" ${moduleId === "schedule" ? "data-open-new-appointment" : ""} ${moduleId === "crm" ? crmCreateActionAttribute(module.primaryAction) : ""} ${moduleId === "outreach" ? outreachCreateActionAttribute(module.primaryAction) : ""} ${moduleId === "fundraising" ? "data-fundraising-new" : ""} ${moduleId === "marketing" ? "data-marketing-new" : ""} type="button">${icons.plus}${module.primaryAction}</button>` : ""}
          </div>
        </header>

        <section class="summary-strip" ${moduleId === "schedule" ? "data-schedule-summary" : ""} aria-label="${module.label} summary" ${showModuleSummary ? "" : "hidden"}>
          ${renderSummaryItems(module)}
        </section>

        ${moduleId === "home" ? `
          <section class="home-dashboard" data-home-dashboard aria-label="Home dashboard">
            ${renderHomeDashboard()}
          </section>
        ` : ""}

        ${moduleId === "marketing" && marketingSubpage === "Dashboard" ? `
          <section class="marketing-dashboard" data-marketing-dashboard aria-label="Marketing dashboard">
            ${renderMarketingDashboard()}
          </section>
        ` : ""}

        ${moduleId === "marketing" && marketingSubpage === "Templates" ? `
          <section class="marketing-templates-workspace" data-marketing-templates-workspace aria-label="Message templates">
            ${renderMarketingTemplatesWorkspace()}
          </section>
        ` : ""}

        ${moduleId === "operations" ? `
          <section class="operations-workspace" data-operations-workspace aria-label="Operations ${escapeHtml(operationsSubpage)}">
            ${renderOperationsWorkspace()}
          </section>
        ` : ""}

        ${adminSettings ? `
          <section class="admin-settings-workspace" data-admin-settings-workspace aria-label="Admin settings">
            ${renderAdminSettingsWorkspace()}
          </section>
        ` : ""}

        ${adminIntegrations ? `
          <section class="admin-integrations-workspace" data-admin-integrations-workspace aria-label="Integrations">
            ${renderAdminIntegrationsWorkspace()}
          </section>
        ` : ""}

        ${moduleId === "fundraising" && fundraisingSubpage === "Grants" ? `
          <div data-fundraising-workspace-tabs-host>${renderFundraisingWorkspaceTabs()}</div>
        ` : ""}

        ${moduleId === "fundraising" && fundraisingSubpage === "Financial Activity" ? `
          <section class="financial-activity-workspace" data-financial-activity-workspace aria-label="Financial Activity">
            ${renderFinancialActivityWorkspace()}
          </section>
        ` : ""}

        ${moduleId === "fundraising" && ["HRSN Billing", "Budget"].includes(fundraisingSubpage) ? `
          <section class="financial-records-workspace" data-financial-records-workspace aria-label="${escapeHtml(fundraisingSubpage)}">
            ${renderFinancialRecordsWorkspace()}
          </section>
        ` : ""}

        <section class="workspace" ${moduleId === "schedule" ? "data-schedule-clinic-workspace" : ""} ${moduleId === "fundraising" && ((fundraisingSubpage === "Grants" && fundraisingWorkspaceView !== "Details") || ["Financial Activity", "HRSN Billing", "Budget"].includes(fundraisingSubpage)) ? "hidden" : ""} ${moduleId === "marketing" && ["Dashboard", "Templates"].includes(marketingSubpage) ? "hidden" : ""} ${["home", "operations"].includes(moduleId) ? "hidden" : ""} ${adminSpecialPage ? "hidden" : ""}>
          ${moduleId === "schedule" ? renderScheduleDayPanel(module) : `<div class="panel list-panel">
            <div class="panel-header">
              <div>
                <h2>${module.listTitle}</h2>
                ${moduleId === "outreach" ? renderOutreachLeadViewSwitch() : ""}
              </div>
              <div class="panel-header-actions">
                ${moduleId === "crm" && crmSubpage === "Clients" ? `
                  <div class="crm-client-group-actions" role="group" aria-label="Client status groups">
                    <button data-crm-client-status-expand="all" type="button">Expand All</button>
                    <button data-crm-client-status-expand="none" type="button">Collapse All</button>
                  </div>
                ` : moduleId === "crm" && crmSubpage === "Referrals" ? `
                  <div class="crm-client-group-actions" role="group" aria-label="Referral status groups">
                    <button data-crm-referral-status-expand="all" type="button">Expand All</button>
                    <button data-crm-referral-status-expand="none" type="button">Collapse All</button>
                  </div>
                ` : ""}
                ${moduleId === "marketing" && marketingSubpage === "Campaigns" ? `
                  <select class="module-list-filter" data-marketing-campaign-filter aria-label="Filter campaigns">
                    ${crmSelectOptions(marketingCampaignFilterOptions, marketingCampaignFilter)}
                  </select>
                ` : ""}
                ${["crm", "outreach", "fundraising", "marketing"].includes(moduleId) ? `
                  <div class="crm-list-search">
                    <input ${moduleId === "crm" ? "data-crm-search-input" : moduleId === "outreach" ? "data-outreach-search-input" : moduleId === "fundraising" ? "data-fundraising-search-input" : "data-marketing-search-input"} type="search" placeholder="${escapeHtml(module.searchLabel)}" aria-label="${escapeHtml(module.searchLabel)}" hidden>
                    <button class="list-search" ${moduleId === "crm" ? "data-crm-search-toggle" : moduleId === "outreach" ? "data-outreach-search-toggle" : moduleId === "fundraising" ? "data-fundraising-search-toggle" : "data-marketing-search-toggle"} type="button" aria-label="${escapeHtml(module.searchLabel)}">${icons.search}</button>
                  </div>
                ` : `<button class="list-search" type="button" aria-label="Search">${icons.search}</button>`}
              </div>
            </div>
            <div class="list">
              ${renderListRows(module)}
            </div>
          </div>`}

          <article class="panel detail-panel">
            <aside class="detail-side" data-standard-detail-side>
              ${moduleId === "crm" ? `<div data-crm-side-detail>` : moduleId === "outreach" ? `<div data-outreach-side-detail>` : moduleId === "fundraising" ? `<div data-fundraising-side-detail>` : moduleId === "marketing" ? `<div data-marketing-side-detail>` : ""}
              ${moduleId === "crm" ? renderCrmStatusControl() : moduleId === "outreach" ? renderOutreachStatusControl() : moduleId === "fundraising" ? renderFundraisingStatusControl() : moduleId === "marketing" ? renderMarketingStatusControl() : `
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
              ${moduleId === "crm" ? `</div><div class="crm-profile-editor-side-host" data-crm-side-editor hidden></div>` : moduleId === "outreach" ? `</div><div class="crm-profile-editor-side-host" data-outreach-side-editor hidden></div>` : moduleId === "fundraising" ? `</div><div class="crm-profile-editor-side-host" data-fundraising-side-editor hidden></div>` : moduleId === "marketing" ? `</div><div class="crm-profile-editor-side-host" data-marketing-side-editor hidden></div>` : ""}
            </aside>

            <div class="detail-main" data-standard-detail-main>
              <div
                class="tabs ${module.detailTabIcons?.length ? "has-icons" : ""}"
                ${moduleId === "crm" ? "data-crm-tabs" : ""}
                ${moduleId === "outreach" ? "data-outreach-tabs" : ""}
                ${moduleId === "fundraising" ? "data-fundraising-tabs" : ""}
                ${moduleId === "marketing" ? "data-marketing-tabs" : ""}
                ${module.detailTabIcons?.length ? `style="--detail-tab-count: ${module.detailTabs.length};"` : ""}
                role="tablist"
                aria-label="${module.label} detail tabs"
              >
                ${module.detailTabs.map((tab, index) => `
                  <button
                    class="${index === 0 ? "is-active" : ""}"
                    ${moduleId === "schedule" ? `data-schedule-detail-tab="${scheduleDetailTabKey(tab)}"` : moduleId === "crm" ? `data-crm-detail-tab="${crmDetailTabKey(tab)}"` : moduleId === "outreach" ? `data-outreach-detail-tab="${outreachDetailTabKey(tab)}"` : moduleId === "fundraising" ? `data-fundraising-detail-tab="${fundraisingDetailTabKey(tab)}"` : moduleId === "marketing" ? `data-marketing-detail-tab="${marketingDetailTabKey(tab)}"` : ""}
                    ${moduleId === "schedule" ? `data-compact-label="${escapeHtml(tab === "Wrap Up" ? "Wrap" : tab === "Appt Note" ? "Note" : tab)}"` : moduleId === "crm" ? `data-compact-label="${escapeHtml(tab === "Appointments" ? "Appts" : tab)}"` : moduleId === "fundraising" ? `data-compact-label="${escapeHtml(tab === "Reporting" ? "Reports" : tab === "Documents" ? "Docs" : tab === "Allocation" ? "Funds" : tab === "Acknowledgement" ? "Thanks" : tab)}"` : moduleId === "marketing" ? `data-compact-label="${escapeHtml(tab === "Audiences" ? "Groups" : tab)}"` : moduleId === "outreach" ? `data-compact-label="${escapeHtml(tab === "Audience" ? "Groups" : tab === "Conversion" ? "Convert" : tab)}"` : ""}
                    ${moduleId === "outreach" ? `role="tab" aria-controls="outreach-detail-panel-${outreachDetailTabKey(tab)}" aria-selected="${index === 0}"` : ""}
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
              ` : moduleId === "fundraising" ? `
                <div data-fundraising-detail-content>
                  ${renderFundraisingDetailPanels(module)}
                  <p class="schedule-action-status" data-fundraising-action-status role="status" aria-live="polite"></p>
                  <div class="footer-actions" data-fundraising-footer-actions>
                    ${module.footerActions.map((action) => `<button data-fundraising-action="${action.toLowerCase().replaceAll(" ", "-")}" type="button">${action}</button>`).join("")}
                  </div>
                </div>
                <div class="crm-editor" data-fundraising-editor hidden></div>
              ` : moduleId === "marketing" ? `
                <div data-marketing-detail-content>
                  ${renderMarketingDetailPanels(module)}
                  <p class="schedule-action-status" data-marketing-action-status role="status" aria-live="polite"></p>
                  ${module.footerActions.length ? `
                    <div class="footer-actions" data-marketing-footer-actions>
                      ${module.footerActions.map((action) => `<button data-marketing-action="${action.toLowerCase().replaceAll(" ", "-")}" type="button">${action}</button>`).join("")}
                    </div>
                  ` : ""}
                </div>
                <div class="crm-editor" data-marketing-editor hidden></div>
              ` : `
                ${renderCards(module)}
                <div class="footer-actions">
                  ${module.footerActions.map((action) => `<button type="button">${action}</button>`).join("")}
                </div>
              `}
            </div>
            ${moduleId === "crm" ? `
              <button class="crm-communications-scrim" data-crm-communications-scrim type="button" aria-label="Close communications" hidden></button>
              <aside class="crm-communications-drawer" data-crm-communications-drawer aria-label="Family communications" aria-hidden="true" hidden></aside>
            ` : ""}
            ${moduleId === "schedule" ? renderBlockedTimeDetail() : ""}
            ${moduleId === "schedule" ? renderNewAppointmentPanel() : ""}
            ${moduleId === "schedule" ? renderBlockTimePanel() : ""}
          </article>
        </section>
        ${adminSchedule ? `<section class="admin-scheduling-workspace" data-admin-scheduling-workspace>${renderProgramSettings()}</section>` : ""}
        ${moduleId === "schedule" ? `<div data-program-schedule-workspace hidden></div>` : ""}
        ${moduleId === "fundraising" && fundraisingSubpage === "Grants" ? `
          <div data-fundraising-workspace-panels-host>${renderFundraisingWorkspacePanels()}</div>
        ` : ""}
        ${moduleId === "schedule" ? renderSchedulePrintCenter(module) : ""}
      </main>
    </div>
    ${moduleId === "schedule" ? renderRescheduleDialog() : ""}
    ${["crm", "home"].includes(moduleId) ? renderCrmTaskDialog() : ""}
  `;

  if (moduleId === "schedule") {
    setSchedulePanelMode("detail");
    setScheduleSubpage(module, scheduleSubpage);
  }
  if (moduleId === "outreach") {
    setOutreachPanelMode("detail");
  }
  if (moduleId === "fundraising" && !["Financial Activity", "HRSN Billing", "Budget"].includes(fundraisingSubpage)) {
    setFundraisingPanelMode("detail");
  }
  if (moduleId === "marketing" && !["Dashboard", "Templates"].includes(marketingSubpage)) {
    setMarketingPanelMode("detail");
  }
  if (moduleId !== "home"
    && !(moduleId === "fundraising" && ["Financial Activity", "HRSN Billing", "Budget"].includes(fundraisingSubpage))
    && !(moduleId === "marketing" && ["Dashboard", "Templates"].includes(marketingSubpage))) {
    updateDetail(module, selectedItemId);
  }
  if (moduleId === "fundraising" && fundraisingSubpage === "Grants") {
    refreshFundraisingWorkspace();
  }
  revealVerifiedStaffShell();
}

function updateDetail(module, itemId) {
  selectedItemId = itemId;
  const item = itemId ? module.items.find((candidate) => candidate.id === itemId) : null;

  if (!item) {
    if (module === modules.outreach) refreshOutreachStatusControl(null);
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
      closeCrmCommunicationsDrawer();
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
    if (module === modules.fundraising) {
      renderFundraisingDetailContent(null);
      fundraisingDeletePendingId = "";
      setFundraisingActionStatus("");
      setFundraisingPanelMode("detail");
      setFundraisingDetailTab(fundraisingDetailTab);
      updateFundraisingActionAvailability(null);
    }
    if (module === modules.marketing) {
      renderMarketingDetailContent(null);
      marketingDeletePendingId = "";
      marketingUnsubscribePendingId = "";
      setMarketingActionStatus("");
      setMarketingPanelMode("detail");
      setMarketingDetailTab(marketingDetailTab);
      updateMarketingActionAvailability(null);
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

  if (module === modules.outreach) refreshOutreachStatusControl(item);

  document.querySelector("[data-detail-title]").textContent = item.title;
  const detailStatus = document.querySelector("[data-detail-status]");
  if (detailStatus) detailStatus.textContent = module === modules.crm ? crmStatusLabel(item.status) : item.status;
  const crmStatusSelect = document.querySelector("[data-crm-status-select]");
  if (crmStatusSelect) {
    if (![...crmStatusSelect.options].some((option) => option.value === item.status)) {
      crmStatusSelect.add(new Option(crmStatusLabel(item.status), item.status));
    }
    crmStatusSelect.value = item.status;
    const crmStatusControl = crmStatusSelect.closest(".crm-status-control");
    if (crmStatusControl) {
      crmStatusControl.dataset.statusTone = crmSubpage === "Referrals"
        ? crmReferralStatusTone(item.status)
        : crmClientStatusTone(item.status);
      if (crmSubpage === "Clients") crmStatusControl.style.color = crmClientStatusColor(item.status);
      else crmStatusControl.style.removeProperty("color");
    }
  }
  const outreachStatusSelect = document.querySelector("[data-outreach-status-select]");
  if (outreachStatusSelect) {
    if (![...outreachStatusSelect.options].some((option) => option.value === item.status)) {
      outreachStatusSelect.add(new Option(item.status, item.status));
    }
    outreachStatusSelect.value = item.status;
  }
  const fundraisingStatusSelect = document.querySelector("[data-fundraising-status-select]");
  if (fundraisingStatusSelect) {
    if (![...fundraisingStatusSelect.options].some((option) => option.value === item.status)) {
      fundraisingStatusSelect.add(new Option(item.status, item.status));
    }
    fundraisingStatusSelect.value = item.status;
  }
  const marketingStatusSelect = document.querySelector("[data-marketing-status-select]");
  if (marketingStatusSelect) {
    if (![...marketingStatusSelect.options].some((option) => option.value === item.status)) {
      marketingStatusSelect.add(new Option(item.status, item.status));
    }
    marketingStatusSelect.value = item.status;
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
  if (thirdIcon) thirdIcon.innerHTML = isBlockedTime ? icons.crm : icons.check;
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
    if (crmCommunicationsDrawerOpen) refreshCrmCommunicationsDrawer();
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
  if (module === modules.marketing) {
    marketingDeletePendingId = "";
    marketingUnsubscribePendingId = "";
    setMarketingActionStatus("");
    renderMarketingDetailContent(item);
    setMarketingPanelMode(marketingPanelMode);
    setMarketingDetailTab(marketingDetailTab);
    updateMarketingActionAvailability(item);
  }
  if (module === modules.fundraising) {
    fundraisingDeletePendingId = "";
    setFundraisingActionStatus("");
    renderFundraisingDetailContent(item);
    setFundraisingPanelMode(fundraisingPanelMode);
    setFundraisingDetailTab(fundraisingDetailTab);
    updateFundraisingActionAvailability(item);
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
    wrapUpButton.disabled = busy || !selectedItem || !nextAppointmentLessonNumber(selectedItem);
  }
  const wrapUpNextButton = document.querySelector("[data-schedule-wrap-up-next]");
  if (wrapUpNextButton) {
    wrapUpNextButton.disabled = busy || !selectedItem;
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

async function schedulingSettingsAuthedFetch(path, options = {}) {
  const user = currentModuleId() === "admin" ? adminCurrentUser : scheduleCurrentUser;
  if (!user) {
    throw new Error("Sign in before changing scheduling settings.");
  }

  const token = await user.getIdToken();
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
    throw new Error(result.error || `The scheduling settings service returned ${response.status}.`);
  }

  return response.json().catch(() => ({}));
}

async function loadProgramScheduleData() {
  if (!scheduleCurrentUser) return;
  programScheduleDataState = "loading";
  programScheduleMessage = "Loading program sessions...";
  refreshProgramScheduleWorkspace();

  try {
    const [sessionResult, registrationResult] = await Promise.all([
      scheduleAuthedFetch("/api/program-sessions"),
      scheduleAuthedFetch("/api/program-registrations")
    ]);
    programRawSessions = sessionResult.sessions || [];
    programRawRegistrations = registrationResult.registrations || [];
    programScheduleDataState = "ready";
    programScheduleMessage = "";
  } catch (error) {
    console.error(error);
    programRawSessions = [];
    programRawRegistrations = [];
    programScheduleDataState = "error";
    programScheduleMessage = "Program sessions could not be loaded. Check the local data service and try again.";
  }

  refreshProgramScheduleWorkspace();
}

async function saveProgramSession(form) {
  if (scheduleActionBusy) return;
  const program = activeProgramName();
  if (!program) return;
  const values = Object.fromEntries(new FormData(form).entries());
  const payload = programSessionPayload(values, program, scheduleSettings.kitchenClassTypes);
  const editingId = programEditingSessionId;

  scheduleActionBusy = true;
  setProgramScheduleStatus(`Saving ${programSessionLabel(program).toLowerCase()}...`);
  try {
    const result = await scheduleAuthedFetch(editingId ? `/api/program-sessions/${encodeURIComponent(editingId)}` : "/api/program-sessions", {
      method: editingId ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    programSelectedSessionId = result.session?.id || editingId;
    programSchedulePanelMode = "detail";
    programEditingSessionId = "";
    programDeletePendingId = "";
    await loadProgramScheduleData();
    setProgramScheduleStatus(`${programSessionLabel(program)} saved.`, "success");
  } catch (error) {
    console.error(error);
    setProgramScheduleStatus(error.message || `Could not save the ${programSessionLabel(program).toLowerCase()}.`, "error");
  } finally {
    scheduleActionBusy = false;
  }
}

async function deleteProgramSession() {
  const session = selectedProgramSession();
  if (!session || scheduleActionBusy) return;
  if (programDeletePendingId !== session.id) {
    programDeletePendingId = session.id;
    refreshProgramScheduleWorkspace();
    setProgramScheduleStatus(`Click Confirm Delete to permanently remove this ${programSessionLabel().toLowerCase()}.`, "error");
    return;
  }

  scheduleActionBusy = true;
  try {
    await scheduleAuthedFetch(`/api/program-sessions/${encodeURIComponent(session.id)}`, { method: "DELETE" });
    programSelectedSessionId = "";
    programDeletePendingId = "";
    await loadProgramScheduleData();
    setProgramScheduleStatus(`${programSessionLabel()} deleted.`, "success");
  } catch (error) {
    console.error(error);
    setProgramScheduleStatus(error.message || `Could not delete the ${programSessionLabel().toLowerCase()}.`, "error");
  } finally {
    scheduleActionBusy = false;
  }
}

async function saveProgramRegistration(form) {
  const session = selectedProgramSession();
  if (!session || scheduleActionBusy) return;
  const formData = new FormData(form);
  const selectedIds = formData.getAll("clientIds");
  const selectedClients = selectedIds.map((id) => scheduleClientsById.get(id)).filter(Boolean);
  const values = Object.fromEntries(formData.entries());
  const payload = programRegistrationPayload(values, session, selectedClients);
  const editingId = programEditingRegistrationId;

  scheduleActionBusy = true;
  setProgramScheduleStatus("Saving family registration...");
  try {
    const result = await scheduleAuthedFetch(editingId ? `/api/program-registrations/${encodeURIComponent(editingId)}` : "/api/program-registrations", {
      method: editingId ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    programEditingRegistrationId = result.registration?.id || "";
    programSchedulePanelMode = "detail";
    programScheduleDetailTab = "roster";
    programDeletePendingId = "";
    await loadProgramScheduleData();
    setProgramScheduleStatus(`Family ${result.registration?.status === "Waitlisted" ? "added to the waitlist" : "registered"}.`, "success");
  } catch (error) {
    console.error(error);
    setProgramScheduleStatus(error.message || "Could not save the family registration.", "error");
  } finally {
    scheduleActionBusy = false;
  }
}

async function saveProgramRegistrationStatus(registrationId, status) {
  if (!registrationId || !status || scheduleActionBusy) return;
  scheduleActionBusy = true;
  try {
    await scheduleAuthedFetch(`/api/program-registrations/${encodeURIComponent(registrationId)}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    await loadProgramScheduleData();
    setProgramScheduleStatus("Registration status updated.", "success");
  } catch (error) {
    console.error(error);
    setProgramScheduleStatus(error.message || "Could not update the registration status.", "error");
  } finally {
    scheduleActionBusy = false;
  }
}

async function deleteProgramRegistration() {
  const registration = selectedProgramRegistration();
  if (!registration || scheduleActionBusy) return;
  if (programDeletePendingId !== registration.id) {
    programDeletePendingId = registration.id;
    refreshProgramScheduleWorkspace();
    return;
  }

  scheduleActionBusy = true;
  try {
    await scheduleAuthedFetch(`/api/program-registrations/${encodeURIComponent(registration.id)}`, { method: "DELETE" });
    programEditingRegistrationId = "";
    programDeletePendingId = "";
    programSchedulePanelMode = "detail";
    programScheduleDetailTab = "roster";
    await loadProgramScheduleData();
    setProgramScheduleStatus("Family removed from this class.", "success");
  } catch (error) {
    console.error(error);
    setProgramScheduleStatus(error.message || "Could not remove the family.", "error");
  } finally {
    scheduleActionBusy = false;
  }
}

function programTypeRows(form, kind) {
  return [...form.querySelectorAll(`[data-program-type-row][data-program-type-kind='${kind}']`)].map((row) => {
    const field = (name) => row.querySelector(`[name='${name}']`);
    const common = {
      id: row.dataset.programTypeId,
      label: field("label")?.value || "",
      durationMinutes: Number(field("durationMinutes")?.value || 0),
      active: Boolean(field("active")?.checked),
      publiclyBookable: Boolean(field("publiclyBookable")?.checked)
    };
    if (kind === "clinic") {
      return {
        ...common,
        appointmentType: field("appointmentType")?.value || "",
        defaultLanguage: field("defaultLanguage")?.value || "English",
        staffMember: field("staffMember")?.value || ""
      };
    }
    return { ...common, capacity: Number(field("capacity")?.value || 0) };
  });
}

async function saveProgramSettings(form) {
  if (scheduleActionBusy) return;
  const data = new FormData(form);
  const payload = {
    ...scheduleSettings,
    clinicLocation: data.get("clinicLocation"),
    officeStartTime: data.get("officeStartTime"),
    officeEndTime: data.get("officeEndTime"),
    bookableStartTime: data.get("bookableStartTime"),
    bookableEndTime: data.get("bookableEndTime"),
    defaultDurationMinutes: Number(data.get("defaultDurationMinutes") || 30),
    slotIntervalMinutes: Number(data.get("slotIntervalMinutes") || 15),
    weekdays: data.getAll("clinicWeekdays").map(Number),
    clinicServices: programTypeRows(form, "clinic"),
    kitchenClassTypes: programTypeRows(form, "kitchen"),
    kitchen: {
      ...scheduleSettings.kitchen,
      location: data.get("kitchenLocation"),
      startTime: data.get("startTime"),
      endTime: data.get("endTime"),
      defaultCapacity: Number(data.get("defaultCapacity") || 8),
      waitlistEnabled: data.get("waitlistEnabled") === "on",
      weekdays: data.getAll("weekdays").map(Number)
    }
  };

  scheduleActionBusy = true;
  setProgramScheduleStatus("Saving scheduling settings...");
  try {
    const result = await schedulingSettingsAuthedFetch("/api/admin/scheduling-settings", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    scheduleSettings = normalizeProgramScheduleSettings(result.schedulingSettings || payload);
    scheduleServices = scheduleSettings.clinicServices;
    if (currentModuleId() === "schedule") {
      refreshNewAppointmentServiceOptions();
      refreshProgramScheduleWorkspace();
    } else {
      adminDataMessage = "";
      refreshAdminSchedulingWorkspace();
    }
    setProgramScheduleStatus("Scheduling settings saved.", "success");
  } catch (error) {
    console.error(error);
    setProgramScheduleStatus(error.message || "Could not save scheduling settings.", "error");
  } finally {
    scheduleActionBusy = false;
  }
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
    const hasFutureAppointment = options.nextAppointmentScheduled ?? module.items.some((candidate) => candidate.id !== item.id
        && candidate.status === "Scheduled"
        && candidate.clientIds.includes(clientId)
        && appointmentOccursAfter(candidate, item));
    const requestedCurrentLesson = String(options.currentLesson || "").trim();
    const storedCurrentLesson = scheduleClientsById.get(clientId)?.currentLesson || "";
    const advancingCurrentLesson = requestedCurrentLesson
      && clientLessonIndex(requestedCurrentLesson) > clientLessonIndex(storedCurrentLesson)
      ? requestedCurrentLesson
      : "";
    const updates = scheduleClientOutcomeUpdates(item, status, {
      hasFutureAppointment,
      mostRecentCompletedDate: status === "No-show" ? mostRecentCompletedDate(module, clientId, item.id) : "",
      currentLesson: advancingCurrentLesson
    });

    if (Object.keys(updates).length) {
      await scheduleAuthedFetch(`/api/schedule/clients/${encodeURIComponent(clientId)}/outcome`, {
        method: "PATCH",
        body: JSON.stringify({
          ...updates,
          workflowReason: status,
          appointmentId: item.id,
          appointmentDate: item.date,
          appointmentType: item.type,
          staffMember: item.staff || item.source?.staffMember || ""
        })
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
  if (!item || scheduleActionBusy) {
    return;
  }

  const formData = new FormData(form);
  const nextLesson = nextAppointmentLessonNumber(item);
  if (!nextLesson) {
    setScheduleWrapUpStatus("This client has completed the final Clinic lesson.", "error");
    return;
  }
  const nextValues = {
    lesson: formData.get("nextAppointmentLesson"),
    appointmentDate: formData.get("nextAppointmentDate"),
    appointmentTime: formData.get("nextAppointmentTime"),
    staffMember: formData.get("nextAppointmentStaff"),
    participantGoals: scheduleParticipantGoalsFromForm(formData, "nextParticipant"),
    notes: formData.get("nextAppointmentNotes")
  };

  if (!nextValues.appointmentDate || !nextValues.appointmentTime) {
    setScheduleWrapUpStatus("Add a date and time for the next appointment.", "error");
    return;
  }

  const nextPayload = nextAppointmentPayload(item, nextValues);
  let nextAppointmentId = "";

  setScheduleWrapUpStatus("");
  setScheduleActionBusy(true);

  try {
    const result = await scheduleAuthedFetch("/api/appointments", {
      method: "POST",
      body: JSON.stringify(nextPayload)
    });
    nextAppointmentId = result.appointment?.id || "";
    const createdItem = mapAppointment(result.appointment || { ...nextPayload, id: nextAppointmentId }, scheduleClientsById);

    await updateScheduleClients(module, createdItem, "Scheduled", {
      currentLesson: completedLessonForNextAppointment(nextPayload.lesson)
    });

    scheduleVisibleDate = item.date;
    selectedItemId = item.id;
    await loadScheduleData(scheduleCurrentUser);
    scheduleDetailTab = "appt-note";
    setScheduleDetailTab(module, "appt-note");
    setScheduleAppointmentNoteStatus("Next appointment scheduled. Finish the appointment note and engagement to complete this appointment.");
  } catch (error) {
    console.error(error);
    if (nextAppointmentId) {
      scheduleVisibleDate = item.date;
      selectedItemId = item.id;
      await loadScheduleData(scheduleCurrentUser).catch(() => {});
      scheduleDetailTab = "appt-note";
      setScheduleDetailTab(module, "appt-note");
      setScheduleAppointmentNoteStatus("Next appointment scheduled, but the client profile could not be updated. You can still finish this appointment note.", "error");
    } else {
      setScheduleWrapUpStatus(error.message || "Could not schedule the next appointment.", "error");
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
  const values = {
    appointmentNote: formData.get("appointmentNote"),
    participantGoals: scheduleParticipantGoalsFromForm(formData, "participant"),
    interpreterUse: formData.get("interpreterUse"),
    caregiverMood: formData.get("caregiverMood"),
    confidence: formData.get("confidence"),
    participation: formData.get("participation"),
    barriers: formData.get("barriers")
  };
  const isAlreadyCompleted = item.status === "Completed";

  if (!String(values.appointmentNote || "").trim()) {
    setScheduleAppointmentNoteStatus("Add an appointment note before completing the appointment.", "error");
    return;
  }

  if (!isAlreadyCompleted) {
    const missingGoalResult = values.participantGoals.find((participant) => !participant.goalResult);
    if (missingGoalResult) {
      setScheduleAppointmentNoteStatus(`Choose a Goal Result for ${missingGoalResult.clientName}.`, "error");
      return;
    }
  }

  const payload = isAlreadyCompleted
    ? appointmentNotePayload(item, values)
    : completedAppointmentPayload(item, values);
  let completionSaved = false;

  setScheduleAppointmentNoteStatus("");
  setScheduleActionBusy(true);

  try {
    await scheduleAuthedFetch(`/api/appointments/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    completionSaved = !isAlreadyCompleted;
    if (!isAlreadyCompleted) {
      await updateScheduleClients(module, item, "Completed");
    }
    selectedItemId = item.id;
    await loadScheduleData(scheduleCurrentUser);
    scheduleDetailTab = "appt-note";
    setScheduleDetailTab(module, "appt-note");
    setScheduleAppointmentNoteStatus(isAlreadyCompleted ? "Changes saved." : "Appointment completed.");
  } catch (error) {
    console.error(error);
    if (completionSaved) {
      await loadScheduleData(scheduleCurrentUser).catch(() => {});
      scheduleDetailTab = "appt-note";
      setScheduleDetailTab(module, "appt-note");
      setScheduleAppointmentNoteStatus("Appointment completed, but the client status could not be updated.", "error");
    } else {
      setScheduleAppointmentNoteStatus(error.message || "Could not complete appointment.", "error");
    }
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
    const [appointmentsResponse, clientsResponse, settingsResult, activityLogsResult, instrumentsResult, responsesResult] = await Promise.all([
      fetch(`${apiBaseUrl}/api/appointments`, { headers }),
      fetch(`${apiBaseUrl}/api/schedule/clients`, { headers }),
      fetch(`${apiBaseUrl}/api/schedule/settings`, { headers })
        .then(async (response) => response.ok ? response.json() : { schedulingSettings: scheduleSettings })
        .catch(() => ({ schedulingSettings: scheduleSettings })),
      fetch(`${apiBaseUrl}/api/schedule/activity-logs`, { headers })
        .then(async (response) => response.ok ? response.json() : { activityLogs: [] })
        .catch(() => ({ activityLogs: [] })),
      fetch(`${apiBaseUrl}/api/evaluation-instruments?status=Active&includeQuestions=true`, { headers })
        .then(async (response) => response.ok ? response.json() : { instruments: [] })
        .catch(() => ({ instruments: [] })),
      fetch(`${apiBaseUrl}/api/evaluation-responses`, { headers })
        .then(async (response) => response.ok ? response.json() : { responses: [] })
        .catch(() => ({ responses: [] }))
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
    scheduleEvaluationInstruments = instrumentsResult.instruments || [];
    scheduleEvaluationResponses = responsesResult.responses || [];
    scheduleSettings = normalizeProgramScheduleSettings(settingsResult.schedulingSettings || scheduleSettings);
    scheduleServices = scheduleSettings.clinicServices;
    refreshNewAppointmentServiceOptions();
    module.items = appointments
      .filter((appointment) => appointment.status !== "Canceled")
      .map((appointment) => mapAppointment(appointment, scheduleClientsById))
      .filter((appointment) => appointment.date && appointment.time)
      .sort((first, second) => first.date.localeCompare(second.date) || first.time.localeCompare(second.time));
    await loadProgramScheduleData();

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
    scheduleDataMessage = "Appointments could not be loaded. Click New Appointment to try again.";
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
    if (crmSubpage === "Tasks") {
      await fetch(`${apiBaseUrl}/api/tasks/reconcile`, {
        method: "POST",
        headers
      }).catch((error) => console.error(error));
    }
    const [
      clientsResponse,
      referralsResponse,
      networkResponse,
      appointmentsResult,
      activityLogsResult,
      tasksResult,
      evaluationDefinitionsResult,
      evaluationResponsesResult,
      clientSettingsResult
    ] = await Promise.all([
      fetch(`${apiBaseUrl}/api/clients`, { headers }),
      fetch(`${apiBaseUrl}/api/referrals`, { headers }),
      fetch(`${apiBaseUrl}/api/referral-network`, { headers }),
      fetch(`${apiBaseUrl}/api/appointments`, { headers })
        .then(async (response) => response.ok ? response.json() : { appointments: [] })
        .catch(() => ({ appointments: [] })),
      fetch(`${apiBaseUrl}/api/activity-logs`, { headers })
        .then(async (response) => response.ok ? response.json() : { activityLogs: [] })
        .catch(() => ({ activityLogs: [] })),
      fetch(`${apiBaseUrl}/api/tasks`, { headers })
        .then(async (response) => response.ok ? response.json() : { tasks: [] })
        .catch(() => ({ tasks: [] })),
      fetch(`${apiBaseUrl}/api/evaluation-instruments?status=Active&includeQuestions=true`, { headers })
        .then(async (response) => response.ok ? response.json() : { instruments: [], questions: [] })
        .catch(() => ({ instruments: [], questions: [] })),
      fetch(`${apiBaseUrl}/api/evaluation-responses`, { headers })
        .then(async (response) => response.ok ? response.json() : { responses: [] })
        .catch(() => ({ responses: [] })),
      fetch(`${apiBaseUrl}/api/clients/settings`, { headers })
        .then(async (response) => response.ok ? response.json() : { clientStatuses: [] })
        .catch(() => ({ clientStatuses: [] }))
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
    crmRawTasks = tasksResult.tasks || [];
    crmEvaluationInstruments = evaluationDefinitionsResult.instruments || [];
    crmEvaluationQuestions = evaluationDefinitionsResult.questions || [];
    crmEvaluationResponses = evaluationResponsesResult.responses || [];
    setCrmClientStatusDefinitions(clientSettingsResult.clientStatuses || []);
    crmDashboardQueueItems = crmDashboardItems({
      clients: crmRawClients,
      referrals: crmRawReferrals,
      appointments: crmAppointments,
      tasks: crmRawTasks
    });
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
    crmRawTasks = [];
    crmEvaluationInstruments = [];
    crmEvaluationQuestions = [];
    crmEvaluationResponses = [];
    crmDashboardQueueItems = [];
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
    const [eventsResponse, contactsResponse, tasksResponse, volunteerProfilesResponse, volunteerOpportunitiesResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/api/outreach-events`, { headers }),
      fetch(`${apiBaseUrl}/api/outreach-contacts`, { headers }),
      fetch(`${apiBaseUrl}/api/outreach-tasks`, { headers }),
      fetch(`${apiBaseUrl}/api/volunteer-profiles`, { headers }),
      fetch(`${apiBaseUrl}/api/volunteer-opportunities`, { headers })
    ]);

    if (!eventsResponse.ok || !contactsResponse.ok || !tasksResponse.ok || !volunteerProfilesResponse.ok || !volunteerOpportunitiesResponse.ok) {
      throw new Error(`Outreach services returned ${eventsResponse.status}/${contactsResponse.status}/${tasksResponse.status}/${volunteerProfilesResponse.status}/${volunteerOpportunitiesResponse.status}`);
    }

    const [{ events = [] }, { contacts = [] }, { tasks = [] }, { profiles = [] }, { opportunities = [] }] = await Promise.all([
      eventsResponse.json(),
      contactsResponse.json(),
      tasksResponse.json(),
      volunteerProfilesResponse.json(),
      volunteerOpportunitiesResponse.json()
    ]);
    outreachRawEvents = events;
    outreachRawContacts = contacts;
    outreachRawTasks = tasks;
    outreachRawVolunteerProfiles = profiles;
    outreachRawVolunteerOpportunities = opportunities;
    outreachContactItems = mapOutreachContacts(outreachRawContacts, outreachRawEvents);
    outreachTaskItems = mapOutreachTasks(outreachRawTasks, outreachRawEvents);
    outreachEventItems = mapOutreachEvents(outreachRawEvents, {
      contacts: outreachRawContacts,
      tasks: outreachRawTasks
    });
    outreachVolunteerProfileItems = mapVolunteerProfiles(outreachRawVolunteerProfiles);
    outreachVolunteerOpportunityItems = mapVolunteerOpportunities(outreachRawVolunteerOpportunities);
    configureOutreachModule(outreachSubpage);
    outreachDataMessage = "";
    refreshOutreachData(module, preferredItemId);
    setOutreachDetailTab(outreachDetailTab);
  } catch (error) {
    console.error(error);
    outreachRawEvents = [];
    outreachRawContacts = [];
    outreachRawTasks = [];
    outreachRawVolunteerProfiles = [];
    outreachRawVolunteerOpportunities = [];
    outreachEventItems = [];
    outreachContactItems = [];
    outreachTaskItems = [];
    outreachVolunteerProfileItems = [];
    outreachVolunteerOpportunityItems = [];
    outreachAllItems = [];
    module.items = [];
    module.summary = outreachSummary([], []);
    outreachDataMessage = "Outreach records could not be loaded. Check the local data service and try again.";
    refreshStandardModuleData(module);
  }
}

async function loadFundraisingData(user, preferredItemId = selectedItemId) {
  fundraisingDataMessage = "Loading Finance records...";
  try {
    const token = await user.getIdToken();
    const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
    const endpoints = [
      ...(staffCanAccessFinanceSection("Grants") ? ["/api/grants", "/api/grant-questions", "/api/grant-organization-info"] : []),
      ...(staffCanAccessFinanceSection("Giving") ? ["/api/donors", "/api/gifts", "/api/campaigns"] : []),
      ...(staffCanAccessFinanceSection("Financial Activity") ? ["/api/financial-activity"] : [])
    ];
    const responses = await Promise.all(endpoints.map((path) => fetch(`${apiBaseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    })));
    const failedResponse = responses.find((response) => !response.ok);
    if (failedResponse) throw new Error(`Finance service returned ${failedResponse.status}`);
    const results = Object.fromEntries(await Promise.all(responses.map(async (response, index) => (
      [endpoints[index], await response.json()]
    ))));
    const grantResult = results["/api/grants"] || {};
    const donorResult = results["/api/donors"] || {};
    const giftResult = results["/api/gifts"] || {};
    const campaignResult = results["/api/campaigns"] || {};
    const financialActivityResult = results["/api/financial-activity"] || {};
    const questionResult = results["/api/grant-questions"] || {};
    const organizationResult = results["/api/grant-organization-info"] || {};
    const grants = grantResult.grants || [];
    const donors = donorResult.donors || [];
    const gifts = giftResult.gifts || [];
    const campaigns = campaignResult.campaigns || [];
    const rolledUpDonors = donorsWithGiftRollups(donors, gifts);
    const rolledUpCampaigns = campaignsWithGiftRollups(campaigns, gifts);
    fundraisingRawGrants = grants;
    fundraisingRawDonors = rolledUpDonors;
    fundraisingRawGifts = gifts;
    fundraisingRawCampaigns = rolledUpCampaigns;
    fundraisingRawFinancialActivity = financialActivityResult.activities || [];
    fundraisingRawQuestions = questionResult.questions || [];
    fundraisingOrganizationInfo = mapGrantOrganizationInfo(organizationResult.organizationInfo || {});
    fundraisingGrantItems = mapGrants(grants);
    fundraisingDonorItems = mapDonors(rolledUpDonors);
    fundraisingGiftItems = mapGifts(gifts);
    fundraisingCampaignItems = mapCampaigns(rolledUpCampaigns);
    fundraisingFinancialActivityItems = mapFinancialActivities(fundraisingRawFinancialActivity);
    fundraisingQuestionItems = mapGrantQuestions(fundraisingRawQuestions);
    fundraisingSelectedQuestionId = fundraisingQuestionItems.some((item) => item.id === fundraisingSelectedQuestionId)
      ? fundraisingSelectedQuestionId
      : fundraisingQuestionItems[0]?.id || "";
    fundraisingDataMessage = "";
    refreshFundraisingData(preferredItemId);
    loadFinancialRecordsSubpageData();
  } catch (error) {
    console.error(error);
    fundraisingRawGrants = [];
    fundraisingRawDonors = [];
    fundraisingRawGifts = [];
    fundraisingRawCampaigns = [];
    fundraisingRawFinancialActivity = [];
    fundraisingRawQuestions = [];
    fundraisingOrganizationInfo = mapGrantOrganizationInfo({});
    fundraisingGrantItems = [];
    fundraisingDonorItems = [];
    fundraisingGiftItems = [];
    fundraisingCampaignItems = [];
    fundraisingFinancialActivityItems = [];
    fundraisingQuestionItems = [];
    modules.fundraising.items = [];
    configureFundraisingModule(fundraisingSubpage);
    fundraisingDataMessage = "Finance records could not be loaded. Check the local data service and try again.";
    if (["Financial Activity", "HRSN Billing", "Budget"].includes(fundraisingSubpage)) refreshFundraisingData();
    else refreshStandardModuleData(modules.fundraising);
  }
}

async function loadMarketingData(user, preferredItemId = selectedItemId) {
  marketingDataMessage = "Loading Marketing records...";

  try {
    const token = await user.getIdToken();
    const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
    const headers = { Authorization: `Bearer ${token}` };
    const [campaignsResponse, subscribersResponse, mailerLiteResponse, templatesResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/api/marketing-campaigns`, { headers }),
      fetch(`${apiBaseUrl}/api/marketing-subscribers`, { headers }),
      fetch(`${apiBaseUrl}/api/marketing/mailerlite/status`, { headers }),
      fetch(`${apiBaseUrl}/api/marketing/templates`, { headers })
    ]);

    if (!campaignsResponse.ok || !subscribersResponse.ok || !mailerLiteResponse.ok || !templatesResponse.ok) {
      throw new Error(`Marketing services returned ${campaignsResponse.status}/${subscribersResponse.status}/${mailerLiteResponse.status}/${templatesResponse.status}`);
    }

    const [{ campaigns = [] }, contactsResult = {}, mailerLiteStatus = {}, templatesResult = {}] = await Promise.all([
      campaignsResponse.json(),
      subscribersResponse.json(),
      mailerLiteResponse.json(),
      templatesResponse.json()
    ]);
    const contacts = contactsResult.contacts || contactsResult.subscribers || [];
    marketingCampaignItems = mapMarketingCampaigns(campaigns);
    marketingSubscriberItems = mapMarketingSubscribers(contacts);
    marketingMessageTemplates = Array.isArray(templatesResult.templates) ? templatesResult.templates : [];
    marketingAudienceGroups = marketingUniqueValues([
      ...defaultMarketingAudienceGroups,
      ...(contactsResult.audienceGroups || []),
      ...marketingSubscriberItems.flatMap((contact) => contact.audienceGroups || [])
    ]);
    marketingMailerLiteStatus = {
      provider: mailerLiteStatus.provider || "MailerLite",
      configured: Boolean(mailerLiteStatus.configured),
      connected: Boolean(mailerLiteStatus.connected),
      connectionMode: mailerLiteStatus.connectionMode || "Not connected",
      sendingEnabled: false
    };
    marketingDataMessage = "";
    refreshMarketingData(preferredItemId);
  } catch (error) {
    console.error(error);
    marketingCampaignItems = [];
    marketingSubscriberItems = [];
    marketingMessageTemplates = [];
    marketingAudienceGroups = [...defaultMarketingAudienceGroups];
    marketingMailerLiteStatus = {
      provider: "MailerLite",
      configured: false,
      connected: false,
      connectionMode: "Not connected",
      sendingEnabled: false
    };
    configureMarketingModule(marketingSubpage);
    marketingDataMessage = "Marketing records could not be loaded. Check the local data service and try again.";
    if (marketingSubpage === "Dashboard") refreshMarketingDashboardPresentation();
    else if (marketingSubpage === "Templates") refreshMarketingTemplatesWorkspace();
    else refreshStandardModuleData(modules.marketing);
  }
}

async function initializeMarketingData() {
  if (currentModuleId() !== "marketing") return;

  try {
    const [
      { initializeApp },
      { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup }
    ] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js")
    ]);
    const firebaseApp = initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG);
    const auth = getAuth(firebaseApp);
    await configureSecureAuthSession(auth);
    const provider = new GoogleAuthProvider();
    marketingOpenSignIn = () => {
      if (!marketingCurrentUser) {
        signInWithPopup(auth, provider).catch((error) => console.error(error));
      }
    };
    refreshMarketingAccountControl();

    onAuthStateChanged(auth, async (user) => {
      marketingCurrentUser = user;
      refreshMarketingAccountControl();
      if (user) {
        if (!(await authorizeStaffUser(user))) return;
        loadMarketingData(user);
        return;
      }

      marketingCampaignItems = [];
      marketingSubscriberItems = [];
      marketingMessageTemplates = [];
      modules.marketing.items = [];
      configureMarketingModule(marketingSubpage);
      marketingDataMessage = "Sign in with your SNACK Google account to load Marketing records.";
      if (marketingSubpage === "Dashboard") refreshMarketingDashboardPresentation();
      else if (marketingSubpage === "Templates") refreshMarketingTemplatesWorkspace();
      else refreshStandardModuleData(modules.marketing);
    });
  } catch (error) {
    console.error(error);
    marketingDataMessage = "The secure sign-in connection could not be started.";
    if (marketingSubpage === "Dashboard") refreshMarketingDashboardPresentation();
    else if (marketingSubpage === "Templates") refreshMarketingTemplatesWorkspace();
    else refreshStandardModuleData(modules.marketing);
  }
}

async function initializeFundraisingData() {
  if (currentModuleId() !== "fundraising") return;

  try {
    const [
      { initializeApp },
      { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup },
      storageApi
    ] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js")
    ]);
    const firebaseApp = initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG);
    const auth = getAuth(firebaseApp);
    await configureSecureAuthSession(auth);
    fundraisingStorageApi = storageApi;
    fundraisingStorage = storageApi.getStorage(firebaseApp);
    const provider = new GoogleAuthProvider();
    fundraisingOpenSignIn = () => {
      if (!fundraisingCurrentUser) {
        signInWithPopup(auth, provider).catch((error) => console.error(error));
      }
    };
    refreshFundraisingAccountControl();

    onAuthStateChanged(auth, async (user) => {
      fundraisingCurrentUser = user;
      refreshFundraisingAccountControl();
      if (user) {
        if (!(await authorizeStaffUser(user))) return;
        loadFundraisingData(user);
        return;
      }

      fundraisingRawGrants = [];
      fundraisingRawDonors = [];
      fundraisingRawGifts = [];
      fundraisingRawCampaigns = [];
      fundraisingRawFinancialActivity = [];
      fundraisingRawQuestions = [];
      fundraisingOrganizationInfo = mapGrantOrganizationInfo({});
      fundraisingGrantItems = [];
      fundraisingDonorItems = [];
      fundraisingGiftItems = [];
      fundraisingCampaignItems = [];
      fundraisingFinancialActivityItems = [];
      fundraisingQuestionItems = [];
      operationsHrsnClaims = [];
      operationsHrsnClientOptions = [];
      operationsHrsnDataState = "idle";
      operationsSelectedHrsnClaimId = "";
      operationsSelectedHrsnClaimIds.clear();
      operationsHrsnBulkMessage = "";
      operationsHrsnBulkMessageState = "";
      operationsBudgetCategories = [];
      operationsBudgetDataState = "idle";
      operationsSelectedBudgetCategoryId = "";
      modules.fundraising.items = [];
      configureFundraisingModule(fundraisingSubpage);
      fundraisingDataMessage = "Sign in with your SNACK Google account to load financial records.";
      if (["Financial Activity", "HRSN Billing", "Budget"].includes(fundraisingSubpage)) refreshFundraisingData();
      else refreshStandardModuleData(modules.fundraising);
    });
  } catch (error) {
    console.error(error);
    fundraisingDataMessage = "The secure sign-in connection could not be started.";
    if (["Financial Activity", "HRSN Billing", "Budget"].includes(fundraisingSubpage)) refreshFundraisingData();
    else refreshStandardModuleData(modules.fundraising);
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
    await configureSecureAuthSession(auth);
    const provider = new GoogleAuthProvider();
    outreachOpenSignIn = () => {
      if (!outreachCurrentUser) {
        signInWithPopup(auth, provider).catch((error) => console.error(error));
      }
    };
    refreshOutreachAccountControl();

    onAuthStateChanged(auth, async (user) => {
      outreachCurrentUser = user;
      refreshOutreachAccountControl();
      if (user) {
        if (!(await authorizeStaffUser(user))) return;
        loadOutreachData(user);
        return;
      }

      outreachRawEvents = [];
      outreachRawContacts = [];
      outreachRawTasks = [];
      outreachRawVolunteerProfiles = [];
      outreachRawVolunteerOpportunities = [];
      outreachEventItems = [];
      outreachContactItems = [];
      outreachTaskItems = [];
      outreachVolunteerProfileItems = [];
      outreachVolunteerOpportunityItems = [];
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
    await configureSecureAuthSession(auth);
    const provider = new GoogleAuthProvider();
    const openSignIn = () => {
      if (!crmCurrentUser) {
        signInWithPopup(auth, provider).catch((error) => console.error(error));
      }
    };
    crmOpenSignIn = openSignIn;
    refreshCrmAccountControl();

    onAuthStateChanged(auth, async (user) => {
      crmCurrentUser = user;
      refreshCrmAccountControl();
      if (user) {
        if (!(await authorizeStaffUser(user))) return;
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

function refreshAdminAccountControl() {
  const account = document.querySelector(".account");
  const accountName = document.querySelector("[data-account-name]");
  if (!account || !accountName || currentModuleId() !== "admin") return;
  accountName.textContent = adminCurrentUser ? staffAccountDisplayName(adminCurrentUser) : "Sign in";
  configureAccountSignInControl(account, Boolean(adminCurrentUser), "Sign in to manage scheduling settings");
}

async function loadAdminSchedulingSettings(user) {
  adminDataState = "loading";
  adminDataMessage = "Loading scheduling settings...";
  refreshAdminSchedulingWorkspace();
  try {
    const token = await user.getIdToken();
    const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
    const response = await fetch(`${apiBaseUrl}/api/admin/scheduling-settings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(`Scheduling settings service returned ${response.status}.`);
    const result = await response.json();
    scheduleSettings = normalizeProgramScheduleSettings(result.schedulingSettings || scheduleSettings);
    scheduleServices = scheduleSettings.clinicServices;
    adminDataState = "ready";
    adminDataMessage = "";
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = "Scheduling settings could not be loaded. Check the local data service and try again.";
  }
  refreshAdminSchedulingWorkspace();
}

async function initializeAdminData() {
  if (currentModuleId() !== "admin") return;

  try {
    const [{ initializeApp }, { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js")
    ]);
    const auth = getAuth(initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG));
    await configureSecureAuthSession(auth);
    const provider = new GoogleAuthProvider();
    adminOpenSignIn = () => {
      if (!adminCurrentUser) signInWithPopup(auth, provider).catch((error) => console.error(error));
    };
    refreshAdminAccountControl();

    onAuthStateChanged(auth, async (user) => {
      adminCurrentUser = user;
      refreshAdminAccountControl();
      if (user) {
        if (!(await authorizeStaffUser(user))) return;
        if (isAdminSchedulePage()) loadAdminSchedulingSettings(user);
        else if (isAdminSettingsPage() && adminSettingsTab === "Data") loadAdminDataCenter();
        else if (isAdminSettingsPage() && adminSettingsTab === "CRM") loadAdminCrmSettings();
        else if (isAdminSettingsPage()) loadAdminAccessUsers();
        else if (isAdminIntegrationsPage()) loadAdminIntegrationStatus();
        return;
      }
      adminDataState = "signed-out";
      adminDataMessage = "Sign in with your SNACK Google account to manage Admin settings.";
      if (isAdminSettingsPage()) refreshAdminSettingsWorkspace();
      else if (isAdminIntegrationsPage()) refreshAdminIntegrationsWorkspace();
      else refreshAdminSchedulingWorkspace();
    });
  } catch (error) {
    console.error(error);
    adminDataState = "error";
    adminDataMessage = "The secure sign-in connection could not be started.";
    if (isAdminSettingsPage()) refreshAdminSettingsWorkspace();
    else if (isAdminIntegrationsPage()) refreshAdminIntegrationsWorkspace();
    else refreshAdminSchedulingWorkspace();
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
    await configureSecureAuthSession(auth);
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

    onAuthStateChanged(auth, async (user) => {
      scheduleCurrentUser = user;
      if (user) {
        if (!(await authorizeStaffUser(user))) return;
        if (accountName) accountName.textContent = staffAccessProfile?.displayName || user.displayName || "SNACK Staff";
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
      programRawSessions = [];
      programRawRegistrations = [];
      programScheduleDataState = "signed-out";
      programScheduleMessage = "Sign in with your SNACK Google account to load program schedules.";
      refreshProgramScheduleWorkspace();
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
      toggle.setAttribute("title", collapsed ? "Expand navigation" : "Collapse navigation");
      toggle.innerHTML = collapsed ? icons.chevronRight : icons.chevronLeft;
      return;
    }

    if (moduleId === "home" && event.target.closest("[data-home-refresh]")) {
      if (homeCurrentUser) loadHomeData(homeCurrentUser);
      return;
    }

    if (moduleId === "home" && event.target.closest("[data-home-sign-in]")) {
      homeOpenSignIn?.();
      return;
    }

    if (moduleId === "home" && event.target.closest("[data-home-print-daily]")) {
      openHomeDailyForms();
      return;
    }

    if (moduleId === "home" && event.target.closest("[data-home-new-task]")) {
      openCrmTaskDialog();
      return;
    }

    if (["home", "crm"].includes(moduleId) && event.target.closest("[data-close-crm-task]")) {
      closeCrmTaskDialog();
      return;
    }

    const moduleLink = event.target.closest("[data-module-link]");
    if (moduleLink) {
      const nextId = moduleLink.dataset.moduleLink;
      if (!staffCanAccessModule(nextId)) return;
      location.href = pageUrl(nextId);
      return;
    }

    const removeStaffAccountButton = event.target.closest("[data-admin-remove-account]");
    if (moduleId === "admin" && removeStaffAccountButton) {
      const form = removeStaffAccountButton.closest("[data-admin-access-user]");
      if (form) removeAdminStaffAccount(form);
      return;
    }

    const deleteAccessLevelButton = event.target.closest("[data-admin-delete-access-level]");
    if (moduleId === "admin" && deleteAccessLevelButton) {
      const form = deleteAccessLevelButton.closest("[data-admin-access-level]");
      if (form) removeAdminAccessLevel(form);
      return;
    }

    const operationsSubpageButton = event.target.closest("[data-operations-subpage]");
    if (operationsSubpageButton) {
      if (moduleId === "operations") {
        setOperationsSubpage(operationsSubpageButton.dataset.operationsSubpage);
      } else {
        const label = operationsSubpageButton.dataset.operationsSubpage;
        location.href = label === "Dashboard" ? "./operations.html" : `./operations.html?section=${encodeURIComponent(label)}`;
      }
      return;
    }

    const adminSubpageButton = event.target.closest("[data-admin-subpage]");
    if (moduleId === "admin" && adminSubpageButton) {
      const label = adminSubpageButton.dataset.adminSubpage;
      location.href = label === "Settings" ? "./admin.html" : `./admin.html?section=${encodeURIComponent(label)}`;
      return;
    }

    const adminSettingsTabButton = event.target.closest("[data-admin-settings-tab]");
    if (moduleId === "admin" && isAdminSettingsPage() && adminSettingsTabButton) {
      const label = adminSettingsTabButton.dataset.adminSettingsTab;
      if (!adminSettingsTabs.includes(label)) return;
      adminSettingsTab = label;
      const params = new URLSearchParams(location.search);
      params.set("section", "Settings");
      params.set("tab", label);
      history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
      adminDataMessage = "";
      refreshAdminSettingsWorkspace();
      if (label === "Data") loadAdminDataCenter();
      else if (label === "CRM") loadAdminCrmSettings();
      else if (["Team", "Access"].includes(label) && !adminStaffUsers.length) loadAdminAccessUsers();
      return;
    }

    if (moduleId === "admin" && event.target.closest("[data-admin-add-client-status]")) {
      adminClientStatuses = adminCrmStatusesFromForm();
      adminClientStatuses.push({ name: "", color: "#475467" });
      refreshAdminSettingsWorkspace();
      document.querySelector("[data-admin-crm-status-row]:last-child input[name='statusName']")?.focus();
      return;
    }

    const removeClientStatusButton = event.target.closest("[data-admin-remove-client-status]");
    if (moduleId === "admin" && removeClientStatusButton) {
      const removeIndex = Number(removeClientStatusButton.dataset.adminRemoveClientStatus);
      adminClientStatuses = adminCrmStatusesFromForm().filter((_status, index) => index !== removeIndex);
      refreshAdminSettingsWorkspace();
      return;
    }

    if (moduleId === "admin" && event.target.closest("[data-admin-refresh-integrations]")) {
      loadAdminIntegrationStatus();
      return;
    }

    if (moduleId === "admin" && event.target.closest("[data-admin-test-calendar]")) {
      testAdminGoogleCalendar();
      return;
    }

    if (moduleId === "admin" && event.target.closest("[data-admin-test-workspace-email]")) {
      testAdminWorkspaceEmail();
      return;
    }

    if (moduleId === "admin" && event.target.closest("[data-admin-test-twilio]")) {
      testAdminTwilio();
      return;
    }

    if (moduleId === "admin" && event.target.closest("[data-admin-refresh-data]")) {
      loadAdminDataCenter();
      return;
    }

    if (moduleId === "admin" && event.target.closest("[data-admin-download-backup]")) {
      downloadCompleteAdminBackup();
      return;
    }

    const scheduleSubpageButton = event.target.closest("[data-schedule-subpage]");
    if (moduleId === "schedule" && scheduleSubpageButton) {
      setScheduleSubpage(module, scheduleSubpageButton.dataset.scheduleSubpage);
      return;
    }

    const programSessionButton = event.target.closest("[data-program-session-id]");
    if (moduleId === "schedule" && programSessionButton) {
      programSelectedSessionId = programSessionButton.dataset.programSessionId;
      programSchedulePanelMode = "detail";
      programScheduleDetailTab = "details";
      programEditingSessionId = "";
      programEditingRegistrationId = "";
      programDeletePendingId = "";
      refreshProgramScheduleWorkspace();
      return;
    }

    const programDetailTab = event.target.closest("[data-program-detail-tab]");
    if (moduleId === "schedule" && programDetailTab) {
      programScheduleDetailTab = programDetailTab.dataset.programDetailTab;
      programSchedulePanelMode = "detail";
      programDeletePendingId = "";
      refreshProgramScheduleWorkspace();
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-program-new-session]")) {
      programSchedulePanelMode = "session-editor";
      programEditingSessionId = "";
      programDeletePendingId = "";
      refreshProgramScheduleWorkspace();
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-program-edit-session]")) {
      if (!selectedProgramSession()) return;
      programSchedulePanelMode = "session-editor";
      programEditingSessionId = programSelectedSessionId;
      programDeletePendingId = "";
      refreshProgramScheduleWorkspace();
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-program-add-registration]")) {
      if (!selectedProgramSession()) return;
      programSchedulePanelMode = "registration-editor";
      programEditingRegistrationId = "";
      programClientSearchQuery = "";
      programDeletePendingId = "";
      refreshProgramScheduleWorkspace();
      return;
    }

    const selectProgramClientButton = event.target.closest("[data-program-select-client]");
    if (moduleId === "schedule" && selectProgramClientButton) {
      const clientId = selectProgramClientButton.dataset.programSelectClient;
      const client = scheduleClientsById.get(clientId);
      if (client && !programSelectedClientIds.includes(clientId)) {
        programSelectedClientIds.push(clientId);
        fillProgramRegistrationContact(client);
      }
      programClientSearchQuery = "";
      const search = document.querySelector("[data-program-client-search]");
      if (search) search.value = "";
      refreshProgramClientPicker();
      search?.focus();
      return;
    }

    const removeProgramClientButton = event.target.closest("[data-program-remove-client]");
    if (moduleId === "schedule" && removeProgramClientButton) {
      programSelectedClientIds = programSelectedClientIds.filter((id) => id !== removeProgramClientButton.dataset.programRemoveClient);
      refreshProgramClientPicker();
      document.querySelector("[data-program-client-search]")?.focus();
      return;
    }

    const editProgramRegistration = event.target.closest("[data-program-edit-registration]");
    if (moduleId === "schedule" && editProgramRegistration) {
      programSchedulePanelMode = "registration-editor";
      programEditingRegistrationId = editProgramRegistration.dataset.programEditRegistration;
      programClientSearchQuery = "";
      programDeletePendingId = "";
      refreshProgramScheduleWorkspace();
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-program-cancel-editor]")) {
      programSchedulePanelMode = "detail";
      programEditingSessionId = "";
      programEditingRegistrationId = "";
      programClientSearchQuery = "";
      programDeletePendingId = "";
      refreshProgramScheduleWorkspace();
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-program-delete-session]")) {
      deleteProgramSession();
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-program-delete-registration]")) {
      deleteProgramRegistration();
      return;
    }

    const addProgramType = event.target.closest("[data-program-add-type]");
    if (["schedule", "admin"].includes(moduleId) && addProgramType) {
      const kind = addProgramType.dataset.programAddType;
      const list = document.querySelector(`[data-program-type-list='${kind}']`);
      if (!list) return;
      const type = kind === "clinic"
        ? { id: `clinic-service-${Date.now()}`, label: "", appointmentType: "Nutrition Education", durationMinutes: 30, defaultLanguage: "English", staffMember: "", active: true, publiclyBookable: true }
        : { id: `kitchen-class-${Date.now()}`, label: "", durationMinutes: 120, capacity: scheduleSettings.kitchen.defaultCapacity, active: true, publiclyBookable: true };
      list.insertAdjacentHTML("beforeend", renderEditableTypeRows([type], kind));
      list.querySelector("[data-program-type-row]:last-child [name='label']")?.focus();
      return;
    }

    const removeProgramType = event.target.closest("[data-program-remove-type]");
    if (["schedule", "admin"].includes(moduleId) && removeProgramType) {
      removeProgramType.closest("[data-program-type-row]")?.remove();
      return;
    }

    const crmSubpageButton = event.target.closest("[data-crm-subpage]");
    if (moduleId === "crm" && crmSubpageButton) {
      setCrmSubpage(crmSubpageButton.dataset.crmSubpage);
      return;
    }

    const crmClientStatusToggle = event.target.closest("[data-crm-client-status-toggle]");
    if (moduleId === "crm" && crmSubpage === "Clients" && crmClientStatusToggle) {
      const status = crmClientStatusToggle.dataset.crmClientStatusToggle;
      if (crmExpandedClientStatuses.has(status)) crmExpandedClientStatuses.delete(status);
      else crmExpandedClientStatuses.add(status);
      const list = document.querySelector(".list");
      if (list) list.innerHTML = renderListRows(modules.crm);
      return;
    }

    const crmReferralStatusToggle = event.target.closest("[data-crm-referral-status-toggle]");
    if (moduleId === "crm" && crmSubpage === "Referrals" && crmReferralStatusToggle) {
      const status = crmReferralStatusToggle.dataset.crmReferralStatusToggle;
      if (crmExpandedReferralStatuses.has(status)) crmExpandedReferralStatuses.delete(status);
      else crmExpandedReferralStatuses.add(status);
      const list = document.querySelector(".list");
      if (list) list.innerHTML = renderListRows(modules.crm);
      return;
    }

    const crmClientStatusExpand = event.target.closest("[data-crm-client-status-expand]");
    if (moduleId === "crm" && crmSubpage === "Clients" && crmClientStatusExpand) {
      crmExpandedClientStatuses.clear();
      if (crmClientStatusExpand.dataset.crmClientStatusExpand === "all") {
        modules.crm.items.forEach((item) => crmExpandedClientStatuses.add(item.status));
      }
      const list = document.querySelector(".list");
      if (list) list.innerHTML = renderListRows(modules.crm);
      return;
    }

    const crmReferralStatusExpand = event.target.closest("[data-crm-referral-status-expand]");
    if (moduleId === "crm" && crmSubpage === "Referrals" && crmReferralStatusExpand) {
      crmExpandedReferralStatuses.clear();
      if (crmReferralStatusExpand.dataset.crmReferralStatusExpand === "all") {
        modules.crm.items.forEach((item) => crmExpandedReferralStatuses.add(item.status));
      }
      const list = document.querySelector(".list");
      if (list) list.innerHTML = renderListRows(modules.crm);
      return;
    }

    const marketingContactToggle = event.target.closest("[data-marketing-contact-toggle]");
    if (moduleId === "marketing" && marketingSubpage === "Contacts" && marketingContactToggle) {
      const group = marketingContactToggle.dataset.marketingContactToggle;
      if (marketingExpandedContactGroups.has(group)) marketingExpandedContactGroups.delete(group);
      else marketingExpandedContactGroups.add(group);
      const list = document.querySelector(".list");
      if (list) list.innerHTML = renderListRows(modules.marketing);
      return;
    }

    if (moduleId === "marketing" && marketingSubpage === "Contacts" && event.target.closest("[data-marketing-contact-expand-all]")) {
      marketingExpandedContactGroups = new Set(["Ready for Email", "Consent Needed", "Unsubscribed / Opted Out", "Missing Email / Review"]);
      const list = document.querySelector(".list");
      if (list) list.innerHTML = renderListRows(modules.marketing);
      return;
    }

    if (moduleId === "marketing" && marketingSubpage === "Contacts" && event.target.closest("[data-marketing-contact-collapse-all]")) {
      marketingExpandedContactGroups.clear();
      const list = document.querySelector(".list");
      if (list) list.innerHTML = renderListRows(modules.marketing);
      return;
    }

    const crmSiblingAdd = event.target.closest("[data-crm-sibling-add]");
    if (moduleId === "crm" && crmSiblingAdd) {
      const picker = crmSiblingAdd.closest("[data-crm-sibling-picker]");
      const kind = picker?.dataset.crmSiblingPicker;
      const source = kind === "referral" ? crmRawReferrals : crmRawClients;
      const candidate = source.find((record) => record.id === crmSiblingAdd.dataset.crmSiblingAdd);
      const selected = picker?.querySelector("[data-crm-sibling-selected]");
      if (candidate && selected && !selected.querySelector(`input[value="${CSS.escape(candidate.id)}"]`)) {
        const formAttribute = crmEditorFormAttribute(picker.dataset.formId || "");
        selected.insertAdjacentHTML("beforeend", `
          <span class="crm-sibling-chip">
            <input type="hidden" name="siblingIds" value="${escapeHtml(candidate.id)}"${formAttribute}>
            <span>${escapeHtml([candidate.firstName, candidate.lastName].filter(Boolean).join(" ") || "Unnamed record")}</span>
            <button data-crm-sibling-remove="${escapeHtml(candidate.id)}" type="button" aria-label="Remove sibling">&times;</button>
          </span>
        `);
      }
      refreshCrmSiblingPicker(picker);
      return;
    }

    const crmSiblingRemove = event.target.closest("[data-crm-sibling-remove]");
    if (moduleId === "crm" && crmSiblingRemove) {
      const picker = crmSiblingRemove.closest("[data-crm-sibling-picker]");
      crmSiblingRemove.closest(".crm-sibling-chip")?.remove();
      refreshCrmSiblingPicker(picker);
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-dashboard-new-task]")) {
      openCrmTaskDialog();
      return;
    }

    const crmDashboardTaskViewButton = event.target.closest("[data-crm-dashboard-task-view]");
    if (moduleId === "crm" && crmDashboardTaskViewButton) {
      crmDashboardTaskView = crmDashboardTaskViewButton.dataset.crmDashboardTaskView === "completed" ? "completed" : "open";
      crmDashboardExpandedQueues.delete("Workflow Tasks");
      refreshStandardModuleData(modules.crm);
      return;
    }

    const crmDashboardCompleteTask = event.target.closest("[data-crm-dashboard-complete-task]");
    if (moduleId === "crm" && crmDashboardCompleteTask) {
      completeCrmDashboardTask(crmDashboardCompleteTask.dataset.crmDashboardCompleteTask);
      return;
    }

    const crmDashboardRestoreTask = event.target.closest("[data-crm-dashboard-restore-task]");
    if (moduleId === "crm" && crmDashboardRestoreTask) {
      restoreCrmDashboardTask(crmDashboardRestoreTask.dataset.crmDashboardRestoreTask);
      return;
    }

    const crmDashboardQueueToggle = event.target.closest("[data-crm-dashboard-toggle-queue]");
    if (moduleId === "crm" && crmDashboardQueueToggle) {
      const queue = crmDashboardQueueToggle.dataset.crmDashboardToggleQueue;
      if (crmDashboardExpandedQueues.has(queue)) crmDashboardExpandedQueues.delete(queue);
      else crmDashboardExpandedQueues.add(queue);
      refreshStandardModuleData(modules.crm);
      return;
    }

    const crmDashboardTarget = event.target.closest("[data-crm-dashboard-section]");
    if (moduleId === "crm" && crmDashboardTarget) {
      const section = crmDashboardTarget.dataset.crmDashboardSection;
      const recordId = crmDashboardTarget.dataset.crmDashboardRecordId;
      if (section === "Schedule") {
        location.href = `./schedule.html?appointment=${encodeURIComponent(recordId)}`;
        return;
      }
      setCrmSubpage(section);
      updateDetail(modules.crm, recordId);
      return;
    }

    const outreachSubpageButton = event.target.closest("[data-outreach-subpage]");
    if (moduleId === "outreach" && outreachSubpageButton) {
      setOutreachSubpage(outreachSubpageButton.dataset.outreachSubpage);
      return;
    }

    const fundraisingSubpageButton = event.target.closest("[data-fundraising-subpage]");
    if (moduleId === "fundraising" && fundraisingSubpageButton) {
      setFundraisingSubpage(fundraisingSubpageButton.dataset.fundraisingSubpage);
      return;
    }

    const fundraisingGivingViewButton = event.target.closest("[data-fundraising-giving-view]");
    if (moduleId === "fundraising" && fundraisingGivingViewButton) {
      setFundraisingGivingView(fundraisingGivingViewButton.dataset.fundraisingGivingView);
      return;
    }

    const marketingSubpageButton = event.target.closest("[data-marketing-subpage]");
    if (moduleId === "marketing" && marketingSubpageButton) {
      setMarketingSubpage(marketingSubpageButton.dataset.marketingSubpage);
      return;
    }

    const marketingTemplateButton = event.target.closest("[data-marketing-template-id]");
    if (moduleId === "marketing" && marketingTemplateButton) {
      captureMarketingTemplateForm();
      marketingSelectedTemplateId = marketingTemplateButton.dataset.marketingTemplateId;
      marketingTemplatePreviewChannel = "email";
      marketingTemplateMessage = "";
      marketingTemplateMessageState = "";
      refreshMarketingTemplatesWorkspace();
      return;
    }

    const marketingTemplateLanguageButton = event.target.closest("[data-marketing-template-language]");
    if (moduleId === "marketing" && marketingTemplateLanguageButton) {
      captureMarketingTemplateForm();
      marketingTemplateLanguage = marketingTemplateLanguageButton.dataset.marketingTemplateLanguage === "Spanish" ? "Spanish" : "English";
      marketingSelectedTemplateId = marketingMessageTemplates.find((template) => template.language === marketingTemplateLanguage)?.id || "";
      marketingTemplatePreviewChannel = "email";
      marketingTemplateMessage = "";
      marketingTemplateMessageState = "";
      refreshMarketingTemplatesWorkspace();
      return;
    }

    const marketingTemplatePreview = event.target.closest("[data-marketing-template-preview]");
    if (moduleId === "marketing" && marketingTemplatePreview) {
      captureMarketingTemplateForm();
      marketingTemplatePreviewChannel = marketingTemplatePreview.dataset.marketingTemplatePreview;
      refreshMarketingTemplatesWorkspace();
      return;
    }

    const marketingTemplateAction = event.target.closest("[data-marketing-template-action]");
    if (moduleId === "marketing" && marketingTemplateAction && marketingTemplateAction.type !== "submit") {
      saveMarketingMessageTemplate(marketingTemplateAction.dataset.marketingTemplateAction);
      return;
    }

    const marketingDashboardSection = event.target.closest("[data-marketing-dashboard-section]");
    if (moduleId === "marketing" && marketingDashboardSection) {
      setMarketingSubpage(marketingDashboardSection.dataset.marketingDashboardSection);
      return;
    }

    const marketingDashboardCampaign = event.target.closest("[data-marketing-dashboard-campaign]");
    if (moduleId === "marketing" && marketingDashboardCampaign) {
      const campaignId = marketingDashboardCampaign.dataset.marketingDashboardCampaign;
      setMarketingSubpage("Campaigns");
      updateDetail(modules.marketing, campaignId);
      return;
    }

    const operationsSubpageTarget = event.target.closest("[data-operations-subpage-target]");
    if (moduleId === "operations" && operationsSubpageTarget) {
      setOperationsSubpage(operationsSubpageTarget.dataset.operationsSubpageTarget);
      return;
    }

    const operationsPerformanceViewButton = event.target.closest("[data-operations-performance-view]");
    if (moduleId === "operations" && operationsPerformanceViewButton) {
      if (operationsSubpage !== "Performance") setOperationsSubpage("Performance");
      setOperationsPerformanceView(operationsPerformanceViewButton.dataset.operationsPerformanceView);
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.closest("[data-operations-hrsn-retry]")) {
      operationsHrsnDataState = "idle";
      loadOperationsHrsnData();
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.closest("[data-operations-hrsn-new]")) {
      operationsHrsnEditorMode = "new";
      operationsHrsnDeletePendingId = "";
      refreshFinancialRecordsWorkspace();
      document.querySelector("[data-operations-hrsn-form] [name='clientId']")?.focus();
      return;
    }

    const operationsHrsnSelect = event.target.closest("[data-operations-hrsn-select]");
    if (isFinancialRecordsModule(moduleId) && operationsHrsnSelect) {
      operationsSelectedHrsnClaimId = operationsHrsnSelect.dataset.operationsHrsnSelect;
      operationsHrsnEditorMode = "";
      operationsHrsnDeletePendingId = "";
      refreshFinancialRecordsWorkspace();
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.closest("[data-operations-hrsn-edit]")) {
      if (!selectedOperationsHrsnClaim()) return;
      operationsHrsnEditorMode = "edit";
      operationsHrsnDeletePendingId = "";
      refreshFinancialRecordsWorkspace();
      document.querySelector("[data-operations-hrsn-form] [name='name']")?.focus();
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.closest("[data-operations-hrsn-cancel]")) {
      operationsHrsnEditorMode = "";
      operationsHrsnDeletePendingId = "";
      refreshFinancialRecordsWorkspace();
      return;
    }

    const operationsHrsnDelete = event.target.closest("[data-operations-hrsn-delete]");
    if (isFinancialRecordsModule(moduleId) && operationsHrsnDelete) {
      deleteOperationsHrsnClaim(operationsHrsnDelete.dataset.operationsHrsnDelete);
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.closest("[data-operations-hrsn-bulk-approve]")) {
      bulkApproveOperationsHrsnClaims();
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.closest("[data-operations-budget-retry]")) {
      operationsBudgetDataState = "idle";
      loadOperationsBudgetData();
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.closest("[data-operations-budget-new]")) {
      operationsBudgetEditorMode = "new";
      operationsBudgetDeletePendingId = "";
      refreshFinancialRecordsWorkspace();
      document.querySelector("[data-operations-budget-form] [name='groupName']")?.focus();
      return;
    }

    const operationsBudgetSelect = event.target.closest("[data-operations-budget-select]");
    if (isFinancialRecordsModule(moduleId) && operationsBudgetSelect) {
      operationsSelectedBudgetCategoryId = operationsBudgetSelect.dataset.operationsBudgetSelect;
      operationsBudgetEditorMode = "";
      operationsBudgetDeletePendingId = "";
      refreshFinancialRecordsWorkspace();
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.closest("[data-operations-budget-edit]")) {
      if (!selectedOperationsBudgetCategory()) return;
      operationsBudgetEditorMode = "edit";
      operationsBudgetDeletePendingId = "";
      refreshFinancialRecordsWorkspace();
      document.querySelector("[data-operations-budget-form] [name='name']")?.focus();
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.closest("[data-operations-budget-cancel]")) {
      operationsBudgetEditorMode = "";
      operationsBudgetDeletePendingId = "";
      refreshFinancialRecordsWorkspace();
      return;
    }

    const operationsBudgetDelete = event.target.closest("[data-operations-budget-delete]");
    if (isFinancialRecordsModule(moduleId) && operationsBudgetDelete) {
      deleteOperationsBudgetCategory(operationsBudgetDelete.dataset.operationsBudgetDelete);
      return;
    }

    const operationsEvaluationFilterButton = event.target.closest("[data-operations-evaluation-filter]");
    if (moduleId === "operations" && operationsEvaluationFilterButton) {
      operationsEvaluationFilter = operationsEvaluationFilterButton.dataset.operationsEvaluationFilter;
      operationsEvaluationEditingId = "";
      operationsEvaluationInstrumentEditingId = "";
      refreshOperationsWorkspace();
      return;
    }

    if (moduleId === "operations" && event.target.closest("[data-operations-new-instrument]")) {
      operationsEvaluationInstrumentEditingId = "__new__";
      operationsEvaluationEditingId = "";
      refreshOperationsWorkspace();
      document.querySelector("[data-operations-evaluation-instrument-form] [name='id']")?.focus();
      return;
    }

    const operationsEditInstrument = event.target.closest("[data-operations-edit-instrument]");
    if (moduleId === "operations" && operationsEditInstrument) {
      operationsEvaluationInstrumentEditingId = operationsEditInstrument.dataset.operationsEditInstrument;
      operationsEvaluationEditingId = "";
      refreshOperationsWorkspace();
      document.querySelector("[data-operations-evaluation-instrument-form] [name='name']")?.focus();
      return;
    }

    if (moduleId === "operations" && event.target.closest("[data-operations-cancel-instrument]")) {
      operationsEvaluationInstrumentEditingId = "";
      refreshOperationsWorkspace();
      return;
    }

    if (moduleId === "operations" && event.target.closest("[data-operations-new-question]")) {
      operationsEvaluationFilter = "All Questions";
      operationsEvaluationEditingId = "__new__";
      operationsEvaluationInstrumentEditingId = "";
      refreshOperationsWorkspace();
      document.querySelector("[data-operations-evaluation-question-form] [name='id']")?.focus();
      return;
    }

    const operationsEditQuestion = event.target.closest("[data-operations-edit-question]");
    if (moduleId === "operations" && operationsEditQuestion) {
      operationsEvaluationEditingId = operationsEditQuestion.dataset.operationsEditQuestion;
      operationsEvaluationInstrumentEditingId = "";
      refreshOperationsWorkspace();
      document.querySelector("[data-operations-evaluation-question-form] [name='question']")?.focus();
      return;
    }

    if (moduleId === "operations" && event.target.closest("[data-operations-cancel-question]")) {
      operationsEvaluationEditingId = "";
      refreshOperationsWorkspace();
      return;
    }

    const operationsAreaButton = event.target.closest("[data-operations-area]");
    if (moduleId === "operations" && operationsAreaButton) {
      setOperationsProgramArea(operationsAreaButton.dataset.operationsArea);
      return;
    }

    const operationsOpenMetric = event.target.closest("[data-operations-open-metric]");
    if (moduleId === "operations" && operationsOpenMetric) {
      const metricKey = operationsOpenMetric.dataset.operationsOpenMetric;
      const metric = operationsMetrics.find((item) => item.metricKey === metricKey);
      if (metric) setOperationsProgramArea(metric.programArea, metricKey);
      return;
    }

    const operationsSelectMetric = event.target.closest("[data-operations-select-metric]");
    if (moduleId === "operations" && operationsSelectMetric) {
      operationsSelectedMetricKey = operationsSelectMetric.dataset.operationsSelectMetric;
      operationsEditorMode = "";
      operationsEditingMeasurementId = "";
      operationsDeletePendingMeasurementId = "";
      refreshOperationsWorkspace();
      return;
    }

    if (moduleId === "operations" && event.target.closest("[data-operations-edit-definition]")) {
      operationsEditorMode = "definition";
      refreshOperationsWorkspace();
      document.querySelector("[data-operations-definition-form] input")?.focus();
      return;
    }

    const operationsEditMeasurement = event.target.closest("[data-operations-edit-measurement]");
    if (moduleId === "operations" && operationsEditMeasurement) {
      operationsEditingMeasurementId = operationsEditMeasurement.dataset.operationsEditMeasurement;
      operationsDeletePendingMeasurementId = "";
      operationsEditorMode = "measurement";
      refreshOperationsWorkspace();
      document.querySelector("[data-operations-measurement-form] [name='value']")?.focus();
      return;
    }

    const operationsDeleteMeasurement = event.target.closest("[data-operations-delete-measurement]");
    if (moduleId === "operations" && operationsDeleteMeasurement) {
      deleteOperationsMeasurement(operationsDeleteMeasurement.dataset.operationsDeleteMeasurement);
      return;
    }

    if (moduleId === "operations" && event.target.closest("[data-operations-cancel-editor]")) {
      operationsEditorMode = "";
      operationsEditingMeasurementId = "";
      operationsDeletePendingMeasurementId = "";
      refreshOperationsWorkspace();
      return;
    }

    if (moduleId === "operations" && event.target.closest("[data-operations-print-snapshot]")) {
      openOperationsSnapshotPrint();
      return;
    }

    if (moduleId === "operations" && event.target.closest("[data-operations-open-outreach-report]")) {
      location.href = "./operations.html?section=Reports&report=outreach";
      return;
    }

    const outreachViewButton = event.target.closest("[data-outreach-view]");
    if (moduleId === "outreach" && outreachViewButton) {
      if (outreachSubpage === "Volunteers") setOutreachVolunteerView(outreachViewButton.dataset.outreachView);
      else setOutreachSubpage(outreachViewButton.dataset.outreachView);
      return;
    }

    const outreachLeadViewButton = event.target.closest("[data-outreach-lead-view]");
    if (moduleId === "outreach" && outreachLeadViewButton) {
      setOutreachLeadView(outreachLeadViewButton.dataset.outreachLeadView);
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

    if (moduleId === "fundraising" && event.target.closest(".account")) {
      fundraisingOpenSignIn?.();
      return;
    }

    if (moduleId === "marketing" && event.target.closest(".account")) {
      marketingOpenSignIn?.();
      return;
    }

    if (moduleId === "operations" && event.target.closest(".account")) {
      operationsOpenSignIn?.();
      return;
    }

    if (moduleId === "admin" && event.target.closest(".account")) {
      adminOpenSignIn?.();
      return;
    }

    const fundraisingWorkspaceButton = event.target.closest("[data-fundraising-workspace-view]");
    if (moduleId === "fundraising" && fundraisingWorkspaceButton) {
      setFundraisingWorkspaceView(fundraisingWorkspaceButton.dataset.fundraisingWorkspaceView);
      return;
    }

    const financialViewButton = event.target.closest("[data-financial-view]");
    if (moduleId === "fundraising" && financialViewButton) {
      setFundraisingFinancialView(financialViewButton.dataset.financialView);
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-financial-add]")) {
      openFinancialActivityEditor("");
      return;
    }

    const financialEditButton = event.target.closest("[data-financial-edit]");
    if (moduleId === "fundraising" && financialEditButton) {
      openFinancialActivityEditor(financialEditButton.dataset.financialEdit);
      return;
    }

    const financialDeleteButton = event.target.closest("[data-financial-delete]");
    if (moduleId === "fundraising" && financialDeleteButton) {
      deleteFinancialActivity(financialDeleteButton.dataset.financialDelete);
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-financial-cancel]")) {
      closeFinancialActivityEditor();
      return;
    }

    const financialSourceButton = event.target.closest("[data-financial-source-section]");
    if (moduleId === "fundraising" && financialSourceButton) {
      const section = financialSourceButton.dataset.financialSourceSection;
      const recordId = financialSourceButton.dataset.financialSourceId;
      if (section === "Giving") fundraisingGivingView = financialSourceButton.dataset.financialSourceView || "Donors";
      setFundraisingSubpage(section);
      refreshFundraisingData(recordId);
      return;
    }

    const fundraisingRelatedButton = event.target.closest("[data-fundraising-related-section]");
    if (moduleId === "fundraising" && fundraisingRelatedButton) {
      const section = fundraisingRelatedButton.dataset.fundraisingRelatedSection;
      const recordId = fundraisingRelatedButton.dataset.fundraisingRelatedId;
      if (section === "Giving") fundraisingGivingView = fundraisingRelatedButton.dataset.fundraisingRelatedView || "Gifts";
      setFundraisingSubpage(section);
      refreshFundraisingData(recordId);
      return;
    }

    const fundraisingRelatedFinancialActivity = event.target.closest("[data-fundraising-related-financial-activity]");
    if (moduleId === "fundraising" && fundraisingRelatedFinancialActivity) {
      const activityId = fundraisingRelatedFinancialActivity.dataset.fundraisingRelatedFinancialActivity;
      setFundraisingSubpage("Financial Activity");
      setFundraisingFinancialView("Ledger");
      openFinancialActivityEditor(activityId);
      return;
    }

    const fundraisingAddGiftDonor = event.target.closest("[data-fundraising-add-gift-donor]");
    if (moduleId === "fundraising" && fundraisingAddGiftDonor) {
      openLinkedGiftEditor({ donorId: fundraisingAddGiftDonor.dataset.fundraisingAddGiftDonor });
      return;
    }

    const fundraisingAddGiftCampaign = event.target.closest("[data-fundraising-add-gift-campaign]");
    if (moduleId === "fundraising" && fundraisingAddGiftCampaign) {
      openLinkedGiftEditor({ campaignId: fundraisingAddGiftCampaign.dataset.fundraisingAddGiftCampaign });
      return;
    }

    const fundraisingAddGrantRevenue = event.target.closest("[data-fundraising-add-grant-revenue]");
    if (moduleId === "fundraising" && fundraisingAddGrantRevenue) {
      openLinkedGrantRevenueEditor(fundraisingAddGrantRevenue.dataset.fundraisingAddGrantRevenue);
      return;
    }

    const fundraisingManageDocuments = event.target.closest("[data-fundraising-manage-documents]");
    if (moduleId === "fundraising" && fundraisingManageDocuments) {
      setFundraisingWorkspaceView("Documents", fundraisingManageDocuments.dataset.fundraisingManageDocuments);
      return;
    }

    const fundraisingGrantLink = event.target.closest("[data-fundraising-open-grant]");
    if (moduleId === "fundraising" && fundraisingGrantLink) {
      setFundraisingWorkspaceView("Details", fundraisingGrantLink.dataset.fundraisingOpenGrant);
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-fundraising-new-answer]")) {
      fundraisingWorkspaceView = "Answer Library";
      fundraisingQuestionEditorMode = "new";
      refreshFundraisingWorkspace();
      document.querySelector('[data-fundraising-question-form] [name="prompt"]')?.focus();
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-fundraising-edit-organization]")) {
      fundraisingWorkspaceView = "Organization";
      fundraisingOrganizationEditing = true;
      refreshFundraisingWorkspace();
      document.querySelector("[data-fundraising-organization-form] input, [data-fundraising-organization-form] textarea")?.focus();
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-fundraising-upload-document]")) {
      fundraisingWorkspaceView = "Documents";
      fundraisingDocumentEditorOpen = true;
      fundraisingDocumentDeletePendingId = "";
      refreshFundraisingWorkspace();
      document.querySelector('[data-fundraising-document-form] [name="documentFile"]')?.focus();
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-cancel-fundraising-document]")) {
      fundraisingDocumentEditorOpen = false;
      refreshFundraisingWorkspace();
      return;
    }

    const fundraisingDocumentPreview = event.target.closest("[data-preview-fundraising-document]");
    if (moduleId === "fundraising" && fundraisingDocumentPreview) {
      previewFundraisingDocument(fundraisingDocumentPreview);
      return;
    }

    const fundraisingDocumentDownload = event.target.closest("[data-download-fundraising-document]");
    if (moduleId === "fundraising" && fundraisingDocumentDownload) {
      downloadFundraisingDocument(fundraisingDocumentDownload);
      return;
    }

    if (event.target.closest("[data-close-fundraising-document-preview]")) {
      document.querySelector("[data-fundraising-document-preview]")?.close();
      return;
    }

    const fundraisingDocumentDelete = event.target.closest("[data-delete-fundraising-document]");
    if (moduleId === "fundraising" && fundraisingDocumentDelete) {
      deleteFundraisingDocument(fundraisingDocumentDelete);
      return;
    }

    const fundraisingQuestion = event.target.closest("[data-fundraising-question-id]");
    if (moduleId === "fundraising" && fundraisingQuestion) {
      fundraisingSelectedQuestionId = fundraisingQuestion.dataset.fundraisingQuestionId;
      fundraisingQuestionEditorMode = "";
      fundraisingQuestionDeletePendingId = "";
      refreshFundraisingWorkspace();
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-copy-fundraising-answer]")) {
      copyFundraisingAnswer();
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-edit-fundraising-question]")) {
      fundraisingQuestionEditorMode = "edit";
      fundraisingQuestionDeletePendingId = "";
      refreshFundraisingWorkspace();
      document.querySelector('[data-fundraising-question-form] [name="prompt"]')?.focus();
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-delete-fundraising-question]")) {
      deleteFundraisingQuestion();
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-cancel-fundraising-question]")) {
      fundraisingQuestionEditorMode = "";
      fundraisingQuestionDeletePendingId = "";
      refreshFundraisingWorkspace();
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-cancel-fundraising-organization]")) {
      fundraisingOrganizationEditing = false;
      refreshFundraisingWorkspace();
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-fundraising-new]")) {
      if (fundraisingSubpage === "Financial Activity") {
        openFinancialActivityEditor("");
        return;
      }
      if (fundraisingSubpage === "Grants" && fundraisingWorkspaceView !== "Details") {
        setFundraisingWorkspaceView("Details");
      }
      openFundraisingEditor();
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-close-fundraising-editor]")) {
      closeFundraisingEditor();
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-fundraising-search-toggle]")) {
      const input = document.querySelector("[data-fundraising-search-input]");
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

    if (moduleId === "marketing" && event.target.closest("[data-marketing-new]")) {
      openMarketingEditor();
      return;
    }

    if (moduleId === "marketing" && event.target.closest("[data-close-marketing-editor]")) {
      closeMarketingEditor();
      return;
    }

    if (moduleId === "marketing" && event.target.closest("[data-marketing-search-toggle]")) {
      const input = document.querySelector("[data-marketing-search-input]");
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

    if (moduleId === "outreach" && event.target.closest("[data-outreach-new-volunteer]")) {
      if (outreachSubpage !== "Volunteers") setOutreachSubpage("Volunteers");
      if (outreachVolunteerView !== "Profiles") setOutreachVolunteerView("Profiles");
      openOutreachEditor("volunteer-profile");
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-new-opportunity]")) {
      if (outreachSubpage !== "Volunteers") setOutreachSubpage("Volunteers");
      if (outreachVolunteerView !== "Opportunities") setOutreachVolunteerView("Opportunities");
      openOutreachEditor("volunteer-opportunity");
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

    const fundraisingStatusControl = event.target.closest(".fundraising-status-control");
    if (moduleId === "fundraising" && fundraisingStatusControl && !event.target.closest("select")) {
      const select = fundraisingStatusControl.querySelector("select");
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

    const marketingStatusControl = event.target.closest(".marketing-status-control");
    if (moduleId === "marketing" && marketingStatusControl && !event.target.closest("select")) {
      const select = marketingStatusControl.querySelector("select");
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

    if (moduleId === "fundraising" && event.target.closest("[data-fundraising-edit]")) {
      openFundraisingEditor(fundraisingSelectedItem());
      return;
    }

    if (moduleId === "fundraising" && event.target.closest("[data-fundraising-delete-editor]")) {
      deleteFundraisingRecord(fundraisingSelectedItem());
      return;
    }

    const fundraisingAction = event.target.closest("[data-fundraising-action]");
    if (moduleId === "fundraising" && fundraisingAction) {
      const item = fundraisingSelectedItem();
      const action = fundraisingAction.dataset.fundraisingAction;
      if (action === "edit") openFundraisingEditor(item);
      if (action.startsWith("new-")) openFundraisingEditor();
      if (action === "delete") deleteFundraisingRecord(item);
      return;
    }

    if (moduleId === "marketing" && event.target.closest("[data-marketing-edit]")) {
      openMarketingEditor(marketingSelectedItem());
      return;
    }

    if (moduleId === "marketing" && event.target.closest("[data-marketing-delete-editor]")) {
      deleteMarketingCampaign(marketingSelectedItem());
      return;
    }

    if (moduleId === "marketing" && event.target.closest("[data-marketing-unsubscribe-editor]")) {
      unsubscribeMarketingSubscriber(marketingSelectedItem());
      return;
    }

    const marketingAction = event.target.closest("[data-marketing-action]");
    if (moduleId === "marketing" && marketingAction) {
      const item = marketingSelectedItem();
      const action = marketingAction.dataset.marketingAction;
      if (action === "edit") openMarketingEditor(item);
      if (action.startsWith("new-")) openMarketingEditor();
      if (action === "delete") deleteMarketingCampaign(item);
      if (action === "unsubscribe") unsubscribeMarketingSubscriber(item);
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

    if (moduleId === "outreach" && event.target.closest("[data-outreach-edit-volunteer-profile]")) {
      openOutreachEditor("volunteer-profile", outreachSelectedItem());
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-edit-volunteer-opportunity]")) {
      openOutreachEditor("volunteer-opportunity", outreachSelectedItem());
      return;
    }

    if (moduleId === "outreach" && event.target.closest("[data-outreach-delete-editor]")) {
      deleteOutreachRecord(outreachSelectedItem());
      return;
    }

    const outreachContact = event.target.closest("[data-outreach-contact-id]");
    if (moduleId === "outreach" && outreachContact) {
      const linkedLead = outreachContactItems.find((item) => item.id === outreachContact.dataset.outreachContactId);
      outreachLeadView = outreachLeadIsConverted(linkedLead) ? "history" : "active";
      setOutreachSubpage("Leads");
      updateDetail(modules.outreach, outreachContact.dataset.outreachContactId);
      return;
    }

    const outreachConversion = event.target.closest("[data-outreach-convert]");
    if (moduleId === "outreach" && outreachConversion) {
      convertOutreachLead(outreachSelectedItem(), outreachConversion.dataset.outreachConvert);
      return;
    }

    const outreachAction = event.target.closest("[data-outreach-action]");
    if (moduleId === "outreach" && outreachAction) {
      const item = outreachSelectedItem();
      const action = outreachAction.dataset.outreachAction;
      if (action === "log-outcome") openOutreachEditor("outcome", item);
      if (["add-contact", "add-lead"].includes(action)) openOutreachEditor("contact", null, { eventId: item?.id || "" });
      if (action === "create-task") openOutreachEditor("task", null, { eventId: item?.id || "" });
      if (action === "edit" && item?.kind === "contact") openOutreachEditor("contact", item);
      if (action === "edit" && item?.kind === "task") openOutreachEditor("task", item);
      if (action === "edit" && item?.kind === "volunteer-profile") openOutreachEditor("volunteer-profile", item);
      if (action === "edit" && item?.kind === "volunteer-opportunity") openOutreachEditor("volunteer-opportunity", item);
      if (["new-referral", "create-referral"].includes(action)) convertOutreachLead(item, "referral");
      if (action === "close-lead") convertOutreachLead(item, "closed");
      if (action === "mark-done") saveOutreachStatus(item, "Done");
      if (action === "delete") deleteOutreachRecord(item);
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-edit-client]")) {
      openCrmClientEditor(crmSelectedItem());
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-communications-close], [data-crm-communications-scrim]")) {
      closeCrmCommunicationsDrawer();
      return;
    }

    const crmCommunicationsModeButton = event.target.closest("[data-crm-communications-mode]");
    if (moduleId === "crm" && crmCommunicationsModeButton) {
      crmCommunicationsMode = crmCommunicationsModeButton.dataset.crmCommunicationsMode === "call" ? "call" : "text";
      crmCommunicationsReviewing = false;
      refreshCrmCommunicationsDrawer();
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-communications-review]")) {
      const message = document.querySelector("[data-crm-communications-message]")?.value.trim() || "";
      if (!message) return;
      crmCommunicationsDraft = message;
      crmCommunicationsReviewing = true;
      refreshCrmCommunicationsDrawer();
      document.querySelector("[data-crm-communications-edit]")?.focus();
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-communications-edit]")) {
      crmCommunicationsReviewing = false;
      refreshCrmCommunicationsDrawer();
      const message = document.querySelector("[data-crm-communications-message]");
      message?.focus();
      message?.setSelectionRange(message.value.length, message.value.length);
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

    if (moduleId === "crm" && event.target.closest("[data-crm-complete-public-review]")) {
      completeCrmPublicClientReview(crmSelectedItem());
      return;
    }

    if (moduleId === "crm" && event.target.closest("[data-crm-add-referral-partner]")) {
      openCrmReferralPartnerEditor(crmSelectedItem());
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
      if (action === "log-call") openCrmCommunicationsDrawer(item, "call");
      if (action === "log-text") openCrmCommunicationsDrawer(item, "text");
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

    if (moduleId === "schedule" && event.target.closest("[data-schedule-print-select-all]")) {
      document.querySelectorAll("[data-schedule-print-selection]").forEach((input) => { input.checked = true; });
      setSchedulePrintStatus("");
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-schedule-print-clear-all]")) {
      document.querySelectorAll("[data-schedule-print-selection]").forEach((input) => { input.checked = false; });
      setSchedulePrintStatus("");
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-schedule-print-selected]")) {
      openSelectedSchedulePrint(module);
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

    const scheduleOpenSlot = event.target.closest("[data-schedule-new-time]");
    if (moduleId === "schedule" && scheduleOpenSlot) {
      openNewAppointmentPanel([], scheduleOpenSlot.dataset.scheduleNewTime);
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
      if (moduleId === "fundraising") {
        fundraisingDetailTab = fundraisingDetailTabKey(module.detailTabs[0]);
        fundraisingPanelMode = "detail";
        fundraisingDeletePendingId = "";
        setFundraisingActionStatus("");
      }
      if (moduleId === "marketing") {
        marketingDetailTab = "message";
        marketingPanelMode = "detail";
        marketingDeletePendingId = "";
        setMarketingActionStatus("");
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
        setScheduleDetailTab(module, "appt-note");
      } else if (action === "no-show") {
        saveScheduleOutcome(module, "No-show");
      } else if (action === "reschedule") {
        openRescheduleDialog(module);
      }
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-schedule-wrap-up-next]")) {
      setScheduleDetailTab(module, "appt-note");
      return;
    }

    if (moduleId === "schedule" && event.target.closest("[data-open-client-profile]")) {
      if (!staffCanAccessModule("crm")) return;
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
      if (moduleId === "fundraising" && detailTab.dataset.fundraisingDetailTab) {
        setFundraisingDetailTab(detailTab.dataset.fundraisingDetailTab);
        return;
      }
      if (moduleId === "marketing" && detailTab.dataset.marketingDetailTab) {
        setMarketingDetailTab(detailTab.dataset.marketingDetailTab);
        return;
      }
      document.querySelectorAll(".tabs button").forEach((item) => item.classList.remove("is-active"));
      detailTab.classList.add("is-active");
    }
  });

  document.addEventListener("dragstart", (event) => {
    const card = event.target.closest("[data-fundraising-grant-card]");
    if (moduleId !== "fundraising" || !card || fundraisingActionBusy) return;
    fundraisingDraggedGrantId = card.dataset.fundraisingGrantCard;
    card.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", fundraisingDraggedGrantId);
  });

  document.addEventListener("dragend", (event) => {
    if (moduleId !== "fundraising") return;
    event.target.closest("[data-fundraising-grant-card]")?.classList.remove("is-dragging");
    document.querySelectorAll("[data-fundraising-drop-zone]").forEach((zone) => zone.classList.remove("is-drag-over"));
    fundraisingDraggedGrantId = "";
  });

  document.addEventListener("dragover", (event) => {
    const zone = event.target.closest("[data-fundraising-drop-zone]");
    if (moduleId !== "fundraising" || !zone || !fundraisingDraggedGrantId || fundraisingActionBusy) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    document.querySelectorAll("[data-fundraising-drop-zone]").forEach((candidate) => {
      candidate.classList.toggle("is-drag-over", candidate === zone);
    });
  });

  document.addEventListener("dragleave", (event) => {
    const zone = event.target.closest("[data-fundraising-drop-zone]");
    if (moduleId !== "fundraising" || !zone || zone.contains(event.relatedTarget)) return;
    zone.classList.remove("is-drag-over");
  });

  document.addEventListener("drop", (event) => {
    const zone = event.target.closest("[data-fundraising-drop-zone]");
    if (moduleId !== "fundraising" || !zone || fundraisingActionBusy) return;
    event.preventDefault();
    const grantId = fundraisingDraggedGrantId || event.dataTransfer.getData("text/plain");
    document.querySelectorAll("[data-fundraising-drop-zone]").forEach((candidate) => candidate.classList.remove("is-drag-over"));
    fundraisingDraggedGrantId = "";
    saveFundraisingPipelineStatus(grantId, zone.dataset.fundraisingDropZone);
  });

  document.addEventListener("change", (event) => {
    if (moduleId === "home" && event.target.matches("[data-home-task-filter]")) {
      homeTaskAssigneeFilter = event.target.value || "mine";
      refreshHomeDashboard();
      return;
    }

    if (moduleId === "crm" && event.target.matches("[data-crm-activity-form] [name='result']")) {
      const form = event.target.closest("[data-crm-activity-form]");
      const confirmation = form?.querySelector("[data-crm-not-interested-confirm]");
      if (confirmation) {
        const show = String(event.target.value || "").toLowerCase().includes("not interested");
        confirmation.hidden = !show;
        if (!show) confirmation.querySelector("input").checked = false;
      }
      return;
    }

    if (moduleId === "admin" && event.target.matches("[data-admin-import-type]")) {
      adminDataImportPreview = null;
      adminDataMessage = "Choose a CSV file to preview this record type.";
      refreshAdminSettingsWorkspace();
      return;
    }

    if (moduleId === "admin" && event.target.matches("[data-admin-import-file]")) {
      const file = event.target.files?.[0];
      const collectionKey = event.target.form?.elements.collectionKey?.value || "clients";
      previewAdminImport(file, collectionKey);
      return;
    }

    if (moduleId === "admin" && event.target.matches("[data-admin-import-reviewed]")) {
      const submit = event.target.form?.querySelector("[data-admin-import-submit]");
      if (submit) submit.disabled = !event.target.checked || !adminDataImportPreview?.records.length;
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.matches("[data-operations-hrsn-bulk-select]")) {
      const claimId = event.target.dataset.operationsHrsnBulkSelect;
      if (event.target.checked) operationsSelectedHrsnClaimIds.add(claimId);
      else operationsSelectedHrsnClaimIds.delete(claimId);
      operationsHrsnBulkMessage = "";
      operationsHrsnBulkMessageState = "";
      refreshFinancialRecordsWorkspace();
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.matches("[data-operations-hrsn-select-all]")) {
      operationsHrsnClaims
        .filter((claim) => !claim.approved && hrsnClaimMatches(claim, operationsHrsnSearchQuery))
        .forEach((claim) => {
          if (event.target.checked) operationsSelectedHrsnClaimIds.add(claim.id);
          else operationsSelectedHrsnClaimIds.delete(claim.id);
        });
      operationsHrsnBulkMessage = "";
      operationsHrsnBulkMessageState = "";
      refreshFinancialRecordsWorkspace();
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.matches("[data-operations-hrsn-client]")) {
      const client = operationsHrsnClientOptions.find((item) => item.id === event.target.value);
      const form = event.target.form;
      if (client && form) {
        form.elements.name.value = client.name || "";
        form.elements.dateOfBirth.value = client.dateOfBirth || "";
        form.elements.medicaidId.value = client.medicaidId || "";
        form.elements.address.value = client.address || "";
      }
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.matches("[data-operations-hrsn-form] [name='approved']")) {
      if (event.target.checked) {
        event.target.form.elements.submitted.checked = true;
        if (!event.target.form.elements.approvalDate.value) {
          event.target.form.elements.approvalDate.value = scheduleDateKey(new Date());
        }
      } else {
        event.target.form.elements.approvalDate.value = "";
      }
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.matches("[data-operations-hrsn-form] [name='submitted']")) {
      if (!event.target.checked) {
        event.target.form.elements.approved.checked = false;
        event.target.form.elements.approvalDate.value = "";
      }
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.matches("[data-operations-hrsn-form] .operations-multi-picker input")) {
      const picker = event.target.closest(".operations-multi-picker");
      if (event.target.name === "outcomes" && event.target.value === "None" && event.target.checked) {
        picker.querySelectorAll('input[name="outcomes"]').forEach((input) => { if (input !== event.target) input.checked = false; });
      } else if (event.target.name === "outcomes" && event.target.checked) {
        const none = picker.querySelector('input[name="outcomes"][value="None"]');
        if (none) none.checked = false;
      }
      const selected = [...picker.querySelectorAll("input:checked")].map((input) => input.value);
      picker.querySelector("summary").textContent = selected.join(", ") || "Choose an option";
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.matches("[data-operations-budget-year]")) {
      operationsBudgetYear = Number(event.target.value);
      operationsBudgetEditorMode = "";
      operationsBudgetDeletePendingId = "";
      operationsSelectedBudgetCategoryId = "";
      operationsBudgetDataState = "idle";
      loadOperationsBudgetData();
      return;
    }

    if (moduleId === "operations" && event.target.matches("[data-operations-toggle-future]")) {
      operationsShowFutureMeasures = event.target.checked;
      refreshOperationsWorkspace();
      document.querySelector("[data-operations-toggle-future]")?.focus();
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-program-registration-status]")) {
      saveProgramRegistrationStatus(event.target.dataset.programRegistrationStatus, event.target.value);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-program-class-type]")) {
      const classType = scheduleSettings.kitchenClassTypes.find((type) => type.id === event.target.value);
      const form = event.target.closest("[data-program-session-form]");
      if (classType && form) {
        const title = form.elements.title;
        const duration = form.elements.durationMinutes;
        const capacity = form.elements.capacity;
        if (title && !title.value.trim()) title.value = classType.label;
        if (duration) duration.value = classType.durationMinutes;
        if (capacity) capacity.value = classType.capacity;
      }
      return;
    }

    if (moduleId === "crm" && event.target.matches("[data-crm-status-select]")) {
      saveCrmStatus(crmSelectedItem(), event.target.value, event.target);
      return;
    }

    if (moduleId === "outreach" && event.target.matches("[data-outreach-status-select]")) {
      saveOutreachStatus(outreachSelectedItem(), event.target.value, event.target);
      return;
    }

    if (moduleId === "fundraising" && event.target.matches("[data-fundraising-status-select]")) {
      saveFundraisingStatus(fundraisingSelectedItem(), event.target.value, event.target);
      return;
    }

    if (moduleId === "fundraising" && event.target.matches("[data-financial-type-filter]")) {
      fundraisingFinancialTypeFilter = event.target.value;
      fundraisingFinancialDeletePendingId = "";
      refreshFinancialActivityWorkspace();
      return;
    }

    if (moduleId === "marketing" && event.target.matches("[data-marketing-status-select]")) {
      saveMarketingStatus(marketingSelectedItem(), event.target.value, event.target);
      return;
    }

    if (moduleId === "marketing" && event.target.matches("[data-marketing-campaign-filter]")) {
      applyMarketingCampaignFilter(event.target.value);
      return;
    }

    if (moduleId === "marketing" && event.target.matches('[data-marketing-campaign-form] input[name="audienceTargets"]')) {
      refreshMarketingRecipientPreview(event.target.form);
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

    if (moduleId === "schedule" && event.target.matches("[data-new-appointment-duration]")) {
      renderNewAppointmentTimeOptions(document.querySelector("[data-new-appointment-time]")?.value || "");
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

  });

  document.addEventListener("input", (event) => {
    if (moduleId === "crm" && event.target.matches("[data-crm-communications-message]")) {
      crmCommunicationsDraft = event.target.value;
      const count = document.querySelector("[data-crm-communications-count]");
      const review = document.querySelector("[data-crm-communications-review]");
      if (count) count.textContent = `${crmCommunicationsDraft.length}/1600`;
      if (review) review.disabled = !crmCommunicationsDraft.trim();
      return;
    }

    if (moduleId === "marketing" && event.target.closest("[data-marketing-template-form]")) {
      refreshMarketingTemplateLivePreview(event.target.form);
      return;
    }

    if (moduleId === "crm" && event.target.matches("[data-crm-sibling-search]")) {
      refreshCrmSiblingPicker(event.target.closest("[data-crm-sibling-picker]"));
      return;
    }

    if (moduleId === "crm" && event.target.matches("[data-crm-search-input]")) {
      applyCrmSearch(module, event.target.value);
      return;
    }

    if (moduleId === "outreach" && event.target.matches("[data-outreach-search-input]")) {
      applyOutreachSearch(module, event.target.value);
      return;
    }

    if (moduleId === "fundraising" && event.target.matches("[data-fundraising-search-input]")) {
      applyFundraisingSearch(event.target.value);
      return;
    }

    if (moduleId === "fundraising" && event.target.matches("[data-financial-search]")) {
      fundraisingFinancialSearchQuery = event.target.value;
      fundraisingFinancialDeletePendingId = "";
      refreshFinancialActivityWorkspace();
      const input = document.querySelector("[data-financial-search]");
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (moduleId === "marketing" && event.target.matches("[data-marketing-search-input]")) {
      applyMarketingSearch(event.target.value);
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.matches("[data-operations-hrsn-search]")) {
      operationsHrsnSearchQuery = event.target.value;
      operationsHrsnDeletePendingId = "";
      refreshFinancialRecordsWorkspace();
      const input = document.querySelector("[data-operations-hrsn-search]");
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (moduleId === "operations" && event.target.matches("[data-operations-search]")) {
      operationsSearchQuery = event.target.value;
      refreshOperationsWorkspace();
      const input = document.querySelector("[data-operations-search]");
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (moduleId === "operations" && event.target.matches("[data-operations-evaluation-search]")) {
      operationsEvaluationSearchQuery = event.target.value;
      refreshOperationsWorkspace();
      const input = document.querySelector("[data-operations-evaluation-search]");
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (moduleId === "marketing" && event.target.matches('[data-marketing-campaign-form] input[name="additionalAudienceTargets"]')) {
      refreshMarketingRecipientPreview(event.target.form);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-new-appointment-client-search]")) {
      renderNewAppointmentClientOptions(event.target.value);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-program-client-search]")) {
      programClientSearchQuery = event.target.value;
      const options = document.querySelector("[data-program-client-options]");
      if (options) options.innerHTML = renderProgramClientOptions();
    }
  });

  document.addEventListener("focusin", (event) => {
    if (moduleId === "schedule" && event.target.matches("[data-new-appointment-client-search]")) {
      renderNewAppointmentClientOptions(event.target.value);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (moduleId === "crm" && event.key === "Escape" && crmCommunicationsDrawerOpen) {
      closeCrmCommunicationsDrawer();
      return;
    }

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

    if (moduleId === "fundraising" && event.target.closest(".account") && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      fundraisingOpenSignIn?.();
      return;
    }

    if (moduleId === "marketing" && event.target.closest(".account") && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      marketingOpenSignIn?.();
      return;
    }

    if (moduleId === "admin" && event.target.closest(".account") && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      adminOpenSignIn?.();
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

    if (moduleId === "fundraising" && event.target.matches("[data-fundraising-search-input]") && event.key === "Escape") {
      event.target.value = "";
      event.target.hidden = true;
      applyFundraisingSearch("");
      document.querySelector("[data-fundraising-search-toggle]")?.focus();
      return;
    }

    if (moduleId === "marketing" && event.target.matches("[data-marketing-search-input]") && event.key === "Escape") {
      event.target.value = "";
      event.target.hidden = true;
      applyMarketingSearch("");
      document.querySelector("[data-marketing-search-toggle]")?.focus();
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
    if (moduleId === "admin" && event.target.matches("[data-admin-import-form]")) {
      event.preventDefault();
      importAdminPreview(event.target);
      return;
    }

    if (moduleId === "admin" && event.target.matches("[data-admin-cleanup-form]")) {
      event.preventDefault();
      cleanupAdminFixtures(event.target);
      return;
    }

    if (moduleId === "admin" && event.target.matches("[data-admin-team-profile]")) {
      event.preventDefault();
      saveAdminTeamProfile(event.target);
      return;
    }

    if (moduleId === "admin" && event.target.matches("[data-admin-access-user], [data-admin-access-new]")) {
      event.preventDefault();
      saveAdminAccessUser(event.target);
      return;
    }

    if (moduleId === "admin" && event.target.matches("[data-admin-access-level], [data-admin-access-level-new]")) {
      event.preventDefault();
      saveAdminAccessLevel(event.target, event.target.matches("[data-admin-access-level-new]"));
      return;
    }

    if (moduleId === "admin" && event.target.matches("[data-admin-crm-settings-form]")) {
      event.preventDefault();
      saveAdminCrmSettings(event.target);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-program-session-form]")) {
      event.preventDefault();
      saveProgramSession(event.target);
      return;
    }

    if (moduleId === "schedule" && event.target.matches("[data-program-registration-form]")) {
      event.preventDefault();
      saveProgramRegistration(event.target);
      return;
    }

    if (["schedule", "admin"].includes(moduleId) && event.target.matches("[data-program-settings-form]")) {
      event.preventDefault();
      saveProgramSettings(event.target);
      return;
    }

    if (moduleId === "operations" && event.target.matches("[data-operations-period-form]")) {
      event.preventDefault();
      const data = new FormData(event.target);
      operationsPeriod = {
        startDate: String(data.get("startDate") || ""),
        endDate: String(data.get("endDate") || "")
      };
      loadOperationsData();
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.matches("[data-operations-hrsn-form]")) {
      event.preventDefault();
      saveOperationsHrsnClaim(event.target);
      return;
    }

    if (isFinancialRecordsModule(moduleId) && event.target.matches("[data-operations-budget-form]")) {
      event.preventDefault();
      saveOperationsBudgetCategory(event.target);
      return;
    }

    if (moduleId === "operations" && event.target.matches("[data-operations-definition-form]")) {
      event.preventDefault();
      saveOperationsMetric(event.target);
      return;
    }

    if (moduleId === "operations" && event.target.matches("[data-operations-measurement-form]")) {
      event.preventDefault();
      saveOperationsMeasurement(event.target);
      return;
    }

    if (moduleId === "operations" && event.target.matches("[data-operations-evaluation-question-form]")) {
      event.preventDefault();
      saveOperationsEvaluationQuestion(event.target);
      return;
    }

    if (moduleId === "operations" && event.target.matches("[data-operations-evaluation-instrument-form]")) {
      event.preventDefault();
      saveOperationsEvaluationInstrument(event.target);
      return;
    }

    if (moduleId === "fundraising" && event.target.matches("[data-fundraising-question-form]")) {
      event.preventDefault();
      saveFundraisingQuestion(event.target);
      return;
    }

    if (moduleId === "fundraising" && event.target.matches("[data-fundraising-organization-form]")) {
      event.preventDefault();
      saveFundraisingOrganization(event.target);
      return;
    }

    if (moduleId === "fundraising" && event.target.matches("[data-fundraising-document-form]")) {
      event.preventDefault();
      saveFundraisingDocument(event.target);
      return;
    }

    if (moduleId === "fundraising" && event.target.matches("[data-fundraising-record-form]")) {
      event.preventDefault();
      saveFundraisingRecord(event.target);
      return;
    }

    if (moduleId === "fundraising" && event.target.matches("[data-financial-activity-form]")) {
      event.preventDefault();
      saveFinancialActivity(event.target);
      return;
    }

    if (moduleId === "marketing" && event.target.matches("[data-marketing-campaign-form]")) {
      event.preventDefault();
      saveMarketingCampaign(event.target);
      return;
    }

    if (moduleId === "marketing" && event.target.matches("[data-marketing-template-form]")) {
      event.preventDefault();
      saveMarketingMessageTemplate("save");
      return;
    }


    if (moduleId === "marketing" && event.target.matches("[data-marketing-subscriber-form]")) {
      event.preventDefault();
      saveMarketingSubscriber(event.target);
      return;
    }

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

    if (moduleId === "outreach" && event.target.matches("[data-volunteer-profile-form]")) {
      event.preventDefault();
      saveVolunteerProfile(event.target);
      return;
    }

    if (moduleId === "outreach" && event.target.matches("[data-volunteer-opportunity-form]")) {
      event.preventDefault();
      saveVolunteerOpportunity(event.target);
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

    if (["crm", "home"].includes(moduleId) && event.target.matches("[data-crm-task-form]")) {
      event.preventDefault();
      saveCrmDashboardTask(event.target);
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

  document.querySelector("[data-crm-task-dialog]")?.addEventListener("cancel", (event) => {
    if (crmDashboardTaskDialogBusy) event.preventDefault();
  });

}

const moduleId = currentModuleId();
if (moduleId === "crm") configureCrmModule(crmSubpage);
if (moduleId === "outreach") configureOutreachModule(outreachSubpage);
if (moduleId === "fundraising") configureFundraisingModule(fundraisingSubpage);
if (moduleId === "marketing") configureMarketingModule(marketingSubpage);
renderModulePage(moduleId);
if (isAdminSettingsPage(moduleId)) refreshAdminSettingsWorkspace();
if (isAdminSchedulePage(moduleId)) refreshAdminSchedulingWorkspace();
if (isAdminIntegrationsPage(moduleId)) refreshAdminIntegrationsWorkspace();
bindModulePage(moduleId);
initializeHomeData();
initializeScheduleData();
initializeAdminData();
initializeCrmData();
initializeOutreachData();
initializeFundraisingData();
initializeMarketingData();
initializeOperationsData();
