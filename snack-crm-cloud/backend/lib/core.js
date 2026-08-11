import crypto from "node:crypto";
import { Firestore } from "@google-cloud/firestore";
import { GoogleAuth } from "google-auth-library";
import { createRemoteJWKSet, jwtVerify } from "jose";

const port = Number(process.env.PORT || 8080);
const developmentFrontendOrigins = Object.freeze([
  "http://localhost:5002",
  "http://127.0.0.1:5002",
  "http://localhost:8080",
  "http://127.0.0.1:8080"
]);
function configuredFrontendOrigins(environment = process.env) {
  const configured = String(environment.FRONTEND_ORIGINS || environment.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter((origin) => origin && origin !== "*");
  if (configured.length) return [...new Set(configured)];
  return environment.K_SERVICE || environment.NODE_ENV === "production"
    ? []
    : [...developmentFrontendOrigins];
}

const frontendOrigins = Object.freeze(configuredFrontendOrigins());
const frontendOrigin = frontendOrigins[0] || "";
const sessionInactivityMinutes = Math.max(5, Number(process.env.SESSION_INACTIVITY_MINUTES) || 120);
const sessionWarningMinutes = Math.max(1, Math.min(
  sessionInactivityMinutes - 1,
  Number(process.env.SESSION_WARNING_MINUTES) || 5
));
const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.PROJECT_ID;
const firebaseAuthProjectId = process.env.FIREBASE_AUTH_PROJECT_ID || "snack-crm";
const allowedEmailDomain = process.env.ALLOWED_EMAIL_DOMAIN || "snackprogram.org";
const googleCalendarId = String(process.env.GOOGLE_CALENDAR_ID || "").trim();
const googleCalendarEnabled = String(process.env.GOOGLE_CALENDAR_ENABLED || "").trim().toLowerCase() === "true";
const googleCalendarTimeZone = "America/Los_Angeles";
const staffAppUrl = String(process.env.STAFF_APP_URL || "https://hub.snackprogram.org").trim().replace(/\/$/, "");
const googleCalendarScopes = Object.freeze([
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly"
]);
let googleCalendarAuth;
const staffModuleIds = Object.freeze([
  "schedule",
  "crm",
  "outreach",
  "fundraising",
  "marketing",
  "operations",
  "admin"
]);
const staffFinanceSectionIds = Object.freeze([
  "Financial Activity",
  "Grants",
  "HRSN Billing",
  "Budget",
  "Giving"
]);
const defaultStaffAccessLevels = Object.freeze([
  Object.freeze({
    id: "Admin",
    name: "Admin",
    modules: Object.freeze([...staffModuleIds]),
    financeSections: Object.freeze([...staffFinanceSectionIds]),
    system: true,
    admin: true
  }),
  Object.freeze({
    id: "Manager",
    name: "Manager",
    modules: Object.freeze(["schedule", "crm", "outreach", "fundraising"]),
    financeSections: Object.freeze(["Grants", "Giving"]),
    system: true,
    admin: false
  }),
  Object.freeze({
    id: "Staff",
    name: "Staff",
    modules: Object.freeze(["schedule", "crm", "outreach"]),
    financeSections: Object.freeze([]),
    system: true,
    admin: false
  }),
  Object.freeze({
    id: "Intern",
    name: "Intern",
    modules: Object.freeze(["schedule", "outreach"]),
    financeSections: Object.freeze([]),
    system: true,
    admin: false
  })
]);
const staffRoles = Object.freeze(defaultStaffAccessLevels.map((level) => level.id));
const staffModuleAccess = Object.freeze(Object.fromEntries(
  defaultStaffAccessLevels.map((level) => [level.id, level.modules])
));
const adminEmails = new Set(
  String(process.env.ADMIN_EMAILS || "director@snackprogram.org")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);
const allowedReferralStatuses = new Set([
  "New",
  "Texted",
  "Left Voicemail",
  "Emailed",
  "Requested Call Back",
  "Caregiver Will Call Back",
  "Scheduled",
  "Not Interested",
  "Closed / No Further Outreach"
]);
const allowedReferralTypes = new Set([
  "Internal Clinic Referral",
  "External Clinic Referral",
  "Community Org Referral",
  "Nutrition Assessment",
  "Self Referral",
  "Outreach Event Interest",
  "Hosted Event/Class Interest",
  "Other"
]);
const defaultClientStatusDefinitions = Object.freeze([
  Object.freeze({ name: "Scheduled", color: "#078b4d" }),
  Object.freeze({ name: "Active", color: "#004aad" }),
  Object.freeze({ name: "Needs Reschedule", color: "#e23a4d" }),
  Object.freeze({ name: "Needs Language Support", color: "#7a33c2" }),
  Object.freeze({ name: "Waiting on Family", color: "#7a33c2" }),
  Object.freeze({ name: "Age Limit", color: "#d27354" }),
  Object.freeze({ name: "Graduated", color: "#f4c753" }),
  Object.freeze({ name: "Inactive", color: "#475467" }),
  Object.freeze({ name: "Closed", color: "#172033" })
]);
const allowedClientStatuses = new Set(defaultClientStatusDefinitions.map((status) => status.name));
const allowedAppointmentStatuses = new Set(["Scheduled", "Completed", "No-show", "Rescheduled", "Blocked", "Canceled"]);
const allowedAppointmentGoalResults = new Set(["Achieved", "Partly Achieved", "Not Achieved", "Not Assessed"]);
const allowedAppointmentPrepKeys = new Set([
  "formsAtReception",
  "enrollmentForm",
  "questionnaire",
  "markPre",
  "sticker",
  "penPencil",
  "prize",
  "foodSnack"
]);
const allowedTaskStatuses = new Set(["Open", "In Progress", "Waiting", "Done", "Canceled"]);
const allowedTaskPriorities = new Set(["Low", "Normal", "Urgent"]);
const allowedTaskTypes = new Set(["Call", "Text", "Form", "Task"]);
const allowedActivityTypes = new Set(["Call", "Text"]);
const allowedActivityDirections = new Set(["Outbound", "Inbound"]);
const allowedPrograms = new Set(["Kitchen", "School"]);
const allowedProgramSessionStatuses = new Set(["Scheduled", "Completed", "Canceled"]);
const allowedProgramRegistrationStatuses = new Set(["Registered", "Waitlisted", "Attended", "Absent", "Canceled"]);
const allowedMarketingSubscriberStatuses = new Set([
  "Consent Needed",
  "Active",
  "Unsubscribed",
  "Bounced",
  "Complained",
  "Do Not Contact"
]);
const allowedMarketingCommunicationPreferences = new Set([
  "Email",
  "Text",
  "Mail",
  "No Preference",
  "No Contact"
]);
const allowedPerformanceCalculationModes = new Set([
  "Automatic",
  "Manual",
  "Needs Definition",
  "Not Configured"
]);
const allowedPerformanceDirections = new Set([
  "Higher is better",
  "Lower is better",
  "No target status"
]);
const allowedPerformanceFrequencies = new Set([
  "Ongoing",
  "Monthly",
  "Quarterly",
  "Semiannual",
  "Annual"
]);
const allowedPerformanceTrackingTiers = new Set([
  "Core",
  "Future"
]);
const allowedPerformanceEvaluationRecordStatuses = new Set([
  "Draft",
  "Active",
  "Retired"
]);
const allowedPerformanceEvaluationResponseStatuses = new Set([
  "Draft",
  "Complete"
]);
const allowedHrsnCoveredPopulations = new Set([
  "Child Welfare",
  "Physical Health Need",
  "Behavioral Health Need",
  "Behavioral Health Facility",
  "Incarceration",
  "Unhoused",
  "Young Adult With Special Healthcare Needs",
  "Developmental Disability",
  "Interpersonal Violence",
  "Pregnant/Postpartum",
  "ED/Crisis Encounters"
]);
const allowedHrsnDescriptions = new Set([
  "Engaging Members who may be eligible for HRSN Services - in person (office) meeting",
  "Identifying and verifying the Member's CCO enrollment",
  "Verifying the Member is Presumed HRSN Eligible through screening questionnaire & conversational questions"
]);
const allowedHrsnOutcomes = new Set([
  "O&E Invoice",
  "NE Invoice",
  "HRSN Referral",
  "None"
]);
const defaultMarketingAudienceGroups = Object.freeze([
  "Newsletter",
  "Cooking Classes",
  "Volunteers",
  "Community Partners"
]);
const legacyMarketingRoleTags = new Set([
  "Parent/Caregiver",
  "Client Family",
  "Referral",
  "Referral Family",
  "Donor",
  "Outreach Contact",
  "Outreach Lead",
  "Class Family",
  "Cooking Class Family",
  "Referring Provider",
  "Community Partner"
]);
const appointmentLessonKeywords = [
  { value: "Check In", patterns: [/\bcheck\s*in\b/i] },
  { value: "7", patterns: [/\blesson\s*7\b/i, /\bhealthy\s+habits?\b/i, /\bHH\b/] },
  { value: "6", patterns: [/\blesson\s*6\b/i, /\bmindful\s+eating\b/i, /\bME\b/] },
  { value: "5", patterns: [/\blesson\s*5\b/i, /\bmicronutrients?\b/i, /\bmicros?\b/i] },
  { value: "4", patterns: [/\blesson\s*4\b/i, /\bmacronutrients?\b/i, /\bmacros?\b/i, /\bmacro\b/i] },
  { value: "3", patterns: [/\blesson\s*3\b/i, /\bfood\s+groups?\b/i, /\bFG\b/] },
  { value: "2", patterns: [/\blesson\s*2\b/i, /\bsugar\b/i] },
  { value: "1", patterns: [/\blesson\s*1\b/i, /\bnutrient\s+density\b/i, /\bnutrient\s+dense\b/i, /\bND\b/] }
];
const defaultAppointmentDurationMinutes = 30;
const defaultClinicServices = Object.freeze([
  Object.freeze({
    id: "enrollment",
    label: "Enrollment Appointment",
    appointmentType: "Enrollment",
    durationMinutes: 30,
    defaultLanguage: "English",
    staffMember: "Cynthia Esparza",
    active: true,
    publiclyBookable: true
  }),
  Object.freeze({
    id: "nutrition-education",
    label: "Nutrition Education Appointment",
    appointmentType: "Nutrition Education",
    durationMinutes: 30,
    defaultLanguage: "English",
    staffMember: "Cynthia Esparza",
    active: true,
    publiclyBookable: true
  }),
  Object.freeze({
    id: "spanish-enrollment",
    label: "Cita de inscripción en español",
    appointmentType: "Enrollment",
    durationMinutes: 30,
    defaultLanguage: "Spanish",
    staffMember: "Cynthia Esparza",
    active: true,
    publiclyBookable: true
  }),
  Object.freeze({
    id: "spanish-nutrition-education",
    label: "Cita de educación nutricional en español",
    appointmentType: "Nutrition Education",
    durationMinutes: 30,
    defaultLanguage: "Spanish",
    staffMember: "Cynthia Esparza",
    active: true,
    publiclyBookable: true
  })
]);
const defaultKitchenClassTypes = Object.freeze([
  Object.freeze({
    id: "kids-cooking-ages-6-9",
    label: "Kids Cooking + Nutrition Class - Ages 6-9",
    durationMinutes: 120,
    capacity: 8,
    active: true,
    publiclyBookable: true
  }),
  Object.freeze({
    id: "kids-cooking-ages-8-12",
    label: "Kids Cooking + Nutrition Class - Ages 8-12",
    durationMinutes: 120,
    capacity: 8,
    active: true,
    publiclyBookable: true
  }),
  Object.freeze({
    id: "teen-cooking-ages-13-18",
    label: "Teen Nutrition & Cooking Class - Ages 13-18",
    durationMinutes: 120,
    capacity: 8,
    active: true,
    publiclyBookable: true
  })
]);
const defaultKitchenSettings = Object.freeze({
  startTime: "13:00",
  endTime: "18:00",
  weekdays: [2, 3, 4],
  defaultCapacity: 8,
  waitlistEnabled: true,
  registrationMode: "Family",
  location: "1317 NE Dustin Ct, McMinnville, OR 97128"
});
const defaultSchedulingSettings = Object.freeze({
  officeStartTime: "13:00",
  officeEndTime: "18:00",
  bookableStartTime: "13:00",
  bookableEndTime: "18:00",
  clinicLocation: "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128",
  weekdays: [2, 3, 4],
  defaultDurationMinutes: defaultAppointmentDurationMinutes,
  slotIntervalMinutes: 15,
  clinicServices: defaultClinicServices,
  kitchenClassTypes: defaultKitchenClassTypes,
  kitchen: defaultKitchenSettings
});
const publicAvailabilityDefaultDays = 21;
const publicAvailabilityMaxDays = 93;
const publicBookingMaxAdvanceDays = 93;
const publicBookingMinimumNoticeHours = 24;
const publicBookingTimeZone = "America/Los_Angeles";
const publicBookingMaxLengths = {
  childName: 120,
  dateOfBirth: 20,
  gender: 40,
  parentName: 80,
  phone: 30,
  email: 120,
  address: 180,
  preferredLanguage: 30,
  preferredContactMethod: 20,
  yccoId: 60,
  notes: 600,
  foodRestrictions: 600
};
const publicBookingServices = defaultClinicServices;
const publicBookingServiceById = new Map(publicBookingServices.map((service) => [service.id, service]));
const publicBookingServiceByLabel = new Map(publicBookingServices.map((service) => [service.label.toLowerCase(), service]));
const publicBookingAttempts = new Map();
function isAdminBulkDeleteEnabled() {
  return process.env.ALLOW_ADMIN_BULK_DELETE === "true";
}
const legacyTaskTypeMap = {
  call: "Call",
  text: "Text",
  form: "Form",
  forms: "Form",
  schedule: "Call",
  review: "Task",
  admin: "Task",
  other: "Task",
  task: "Task",
  tasks: "Task"
};
const legacyStatusMap = {
  new: "New",
  contacted: "Texted",
  scheduled: "Scheduled",
  closed: "Closed / No Further Outreach",
  "Parent Will Call Back": "Caregiver Will Call Back",
  "Parent will Call Back": "Caregiver Will Call Back"
};

const firestore = projectId ? new Firestore({ projectId }) : new Firestore();
const messages = firestore.collection("messages");
const referrals = firestore.collection("referrals");
const clients = firestore.collection("clients");
const referralNetwork = firestore.collection("referralNetwork");
const outreachEvents = firestore.collection("outreachEvents");
const outreachContacts = firestore.collection("outreachContacts");
const volunteerProfiles = firestore.collection("volunteerProfiles");
const volunteerOpportunities = firestore.collection("volunteerOpportunities");
const appointments = firestore.collection("appointments");
const tasks = firestore.collection("tasks");
const activityLogs = firestore.collection("activityLogs");
const grants = firestore.collection("grants");
const grantQuestions = firestore.collection("grantQuestions");
const fundraisingDonors = firestore.collection("fundraisingDonors");
const fundraisingCampaigns = firestore.collection("fundraisingCampaigns");
const fundraisingGifts = firestore.collection("fundraisingGifts");
const earnedIncome = firestore.collection("earnedIncome");
const hrsnClaims = firestore.collection("hrsnClaims");
const budgetCategories = firestore.collection("budgetCategories");
const marketingCampaigns = firestore.collection("marketingCampaigns");
const marketingSubscribers = firestore.collection("marketingSubscribers");
const programSessions = firestore.collection("programSessions");
const programRegistrations = firestore.collection("programRegistrations");
const performanceMetrics = firestore.collection("performanceMetrics");
const performanceMeasurements = firestore.collection("performanceMeasurements");
const performanceEvaluationQuestions = firestore.collection("performanceEvaluationQuestions");
const performanceEvaluationInstruments = firestore.collection("performanceEvaluationInstruments");
const performanceEvaluationResponses = firestore.collection("performanceEvaluationResponses");
const adminSettings = firestore.collection("adminSettings");
const staffUsers = firestore.collection("staffUsers");
const securityAuditLogs = firestore.collection("securityAuditLogs");
const publicRateLimits = firestore.collection("publicRateLimits");
const applicationDataCollections = Object.freeze({
  messages,
  referrals,
  clients,
  referralNetwork,
  outreachEvents,
  outreachContacts,
  volunteerProfiles,
  volunteerOpportunities,
  appointments,
  tasks,
  activityLogs,
  grants,
  grantQuestions,
  fundraisingDonors,
  fundraisingCampaigns,
  fundraisingGifts,
  earnedIncome,
  hrsnClaims,
  budgetCategories,
  marketingCampaigns,
  marketingSubscribers,
  programSessions,
  programRegistrations,
  performanceMetrics,
  performanceMeasurements,
  performanceEvaluationQuestions,
  performanceEvaluationInstruments,
  performanceEvaluationResponses,
  adminSettings,
  staffUsers,
  securityAuditLogs
});
const applicationDataCollectionNames = Object.freeze(Object.keys(applicationDataCollections));
const protectedAdminDataCollectionNames = Object.freeze([
  "staffUsers",
  "adminSettings",
  "messages",
  "securityAuditLogs"
]);
const adminDataCollections = {
  referrals: { label: "Referrals", collection: referrals, serializer: toReferral },
  clients: { label: "Clients", collection: clients, serializer: toClient },
  "referral-network": { label: "Referral Network", collection: referralNetwork, serializer: toReferralNetworkEntry },
  "outreach-events": { label: "Outreach Events", collection: outreachEvents, serializer: toOutreachEvent },
  "outreach-contacts": { label: "Outreach Leads", collection: outreachContacts, serializer: toOutreachContact },
  "volunteer-profiles": { label: "Volunteer Profiles", collection: volunteerProfiles, serializer: toVolunteerProfile },
  "volunteer-opportunities": { label: "Volunteer Opportunities", collection: volunteerOpportunities, serializer: toVolunteerOpportunity },
  appointments: { label: "Appointments", collection: appointments, serializer: toAppointment },
  tasks: { label: "Tasks", collection: tasks, serializer: toTask },
  "activity-logs": { label: "Activity Logs", collection: activityLogs, serializer: toActivityLog },
  "security-audit": {
    label: "Security Audit History",
    collection: securityAuditLogs,
    serializer: toSecurityAuditLog,
    cleanupEligible: false
  },
  grants: { label: "Grants", collection: grants, serializer: toGrant },
  "grant-questions": { label: "Grant Questions", collection: grantQuestions, serializer: toGrantQuestion },
  donors: { label: "Fundraising Donors", collection: fundraisingDonors, serializer: toFundraisingDonor },
  campaigns: { label: "Fundraising Campaigns", collection: fundraisingCampaigns, serializer: toFundraisingCampaign },
  gifts: { label: "Fundraising Gifts", collection: fundraisingGifts, serializer: toFundraisingGift },
  "earned-income": { label: "Earned Income", collection: earnedIncome, serializer: toEarnedIncome },
  "hrsn-claims": { label: "HRSN Claims", collection: hrsnClaims, serializer: toHrsnClaim },
  "budget-categories": { label: "Budget Categories", collection: budgetCategories, serializer: toBudgetCategory },
  "marketing-campaigns": { label: "Marketing Campaigns", collection: marketingCampaigns, serializer: toMarketingCampaign },
  "marketing-subscribers": { label: "Marketing Contacts", collection: marketingSubscribers, serializer: toMarketingSubscriber },
  "program-sessions": { label: "Program Sessions", collection: programSessions, serializer: toProgramSession },
  "program-registrations": { label: "Program Registrations", collection: programRegistrations, serializer: toProgramRegistration },
  "performance-metrics": { label: "Performance Metrics", collection: performanceMetrics, serializer: toPerformanceMetric },
  "performance-measurements": { label: "Performance Measurements", collection: performanceMeasurements, serializer: toPerformanceMeasurement },
  "performance-evaluation-questions": {
    label: "Performance Evaluation Questions",
    collection: performanceEvaluationQuestions,
    serializer: toPerformanceEvaluationQuestion
  },
  "performance-evaluation-instruments": {
    label: "Performance Evaluation Instruments",
    collection: performanceEvaluationInstruments,
    serializer: toPerformanceEvaluationInstrument
  },
  "performance-evaluation-responses": {
    label: "Performance Evaluation Responses",
    collection: performanceEvaluationResponses,
    serializer: toPerformanceEvaluationResponse
  },
  "staff-users": {
    label: "Staff Accounts",
    collection: staffUsers,
    serializer: toAdminBackupRecord,
    cleanupEligible: false
  },
  "admin-settings": {
    label: "Admin Settings",
    collection: adminSettings,
    serializer: toAdminBackupRecord,
    cleanupEligible: false
  },
  messages: {
    label: "Connection Check Records",
    collection: messages,
    serializer: toAdminBackupRecord,
    cleanupEligible: false
  }
};

function toAdminBackupRecord(snapshot) {
  return {
    ...snapshot.data(),
    id: snapshot.id
  };
}
const firebaseJwtKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

async function collectionCount(collectionRef) {
  if (typeof collectionRef.count === "function") {
    const snapshot = await collectionRef.count().get();
    return snapshot.data().count || 0;
  }

  const snapshot = await collectionRef.get();
  return snapshot.size;
}

async function deleteCollectionDocuments(collectionRef) {
  let deletedCount = 0;

  while (true) {
    const snapshot = await collectionRef.limit(450).get();

    if (snapshot.empty) {
      break;
    }

    const batch = firestore.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deletedCount += snapshot.size;

    if (snapshot.size < 450) {
      break;
    }
  }

  return deletedCount;
}

const fetchAllBatchSize = 300;

async function fetchAllDocuments(query) {
  const documents = [];
  let cursor = null;

  while (true) {
    const page = cursor ? query.startAfter(cursor).limit(fetchAllBatchSize) : query.limit(fetchAllBatchSize);
    const snapshot = await page.get();
    documents.push(...snapshot.docs);

    if (snapshot.docs.length < fetchAllBatchSize) {
      return documents;
    }

    cursor = snapshot.docs[snapshot.docs.length - 1];
  }
}

function normalizeStaffEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function cleanStaffModules(value) {
  const requested = Array.isArray(value)
    ? value.map((moduleId) => cleanString(moduleId).toLowerCase())
    : [];
  return staffModuleIds.filter((moduleId) => requested.includes(moduleId));
}

function cleanStaffFinanceSections(value) {
  const requested = Array.isArray(value) ? value.map(cleanString) : [];
  return staffFinanceSectionIds.filter((section) => requested.includes(section));
}

function normalizeStaffAccessLevels(value) {
  const requested = Array.isArray(value) && value.length
    ? value
    : defaultStaffAccessLevels;
  const levels = [];
  const seen = new Set();

  for (const item of requested) {
    const id = cleanString(item?.id || item?.name);
    const key = id.toLowerCase();
    if (!id || seen.has(key)) continue;
    const defaultLevel = defaultStaffAccessLevels.find((level) => level.id === id);
    const admin = item?.admin === true || id === "Admin";
    const modules = cleanStaffModules(item?.modules);
    if (admin && !modules.includes("admin")) modules.push("admin");
    const savedFinanceSections = cleanStaffFinanceSections(item?.financeSections);
    const financeSections = admin
      ? [...staffFinanceSectionIds]
      : !modules.includes("fundraising")
        ? []
        : Array.isArray(item?.financeSections)
          ? savedFinanceSections
          : defaultLevel?.financeSections
            ? [...defaultLevel.financeSections]
            : [...staffFinanceSectionIds];
    levels.push({
      id,
      name: cleanString(item?.name) || id,
      modules,
      financeSections,
      system: item?.system === true || Boolean(defaultLevel),
      admin
    });
    seen.add(key);
  }

  for (const defaultLevel of defaultStaffAccessLevels) {
    if (seen.has(defaultLevel.id.toLowerCase())) continue;
    const normalizedDefault = {
      ...defaultLevel,
      modules: [...defaultLevel.modules],
      financeSections: [...defaultLevel.financeSections]
    };
    if (defaultLevel.admin) levels.unshift(normalizedDefault);
    else if (defaultLevel.id === "Manager") {
      const adminIndex = levels.findIndex((level) => level.admin);
      levels.splice(adminIndex >= 0 ? adminIndex + 1 : 0, 0, normalizedDefault);
    }
    else levels.push(normalizedDefault);
    seen.add(defaultLevel.id.toLowerCase());
  }

  return levels;
}

function staffAccessLevelForRole(role, accessLevels = defaultStaffAccessLevels) {
  const levels = normalizeStaffAccessLevels(accessLevels);
  const requested = cleanString(role).toLowerCase();
  return levels.find((level) =>
    level.id.toLowerCase() === requested || level.name.toLowerCase() === requested)
    || levels.find((level) => level.id === "Staff")
    || levels.find((level) => !level.admin)
    || levels[0];
}

async function loadStaffAccessLevels() {
  const snapshot = await adminSettings.doc("staffAccess").get();
  return normalizeStaffAccessLevels(snapshot.exists ? snapshot.data()?.accessLevels : null);
}

function normalizeStaffRole(value, email = "", accessLevels = defaultStaffAccessLevels) {
  if (adminEmails.has(normalizeStaffEmail(email))) return "Admin";
  return staffAccessLevelForRole(value, accessLevels).id;
}

function staffModulesForRole(role, accessLevels = defaultStaffAccessLevels) {
  return [...staffAccessLevelForRole(role, accessLevels).modules];
}

function staffFinanceSectionsForRole(role, accessLevels = defaultStaffAccessLevels) {
  return [...staffAccessLevelForRole(role, accessLevels).financeSections];
}

function staffRoleCanAccessGrantDocuments(role, accessLevels = defaultStaffAccessLevels) {
  return staffModulesForRole(role, accessLevels).includes("fundraising")
    && staffFinanceSectionsForRole(role, accessLevels).includes("Grants");
}

function staffRoleCanAccessModule(role, moduleId, accessLevels = defaultStaffAccessLevels) {
  return staffModulesForRole(role, accessLevels).includes(String(moduleId || "").trim().toLowerCase());
}

function staffModuleForApiPath(pathname = "") {
  const path = String(pathname || "").split("?")[0];
  if (/^\/api\/admin(?:\/|$)/.test(path)) return "admin";
  if (/^\/api\/operations(?:\/|$)/.test(path)) return "operations";
  if (/^\/api\/(?:marketing-campaigns|marketing-subscribers|marketing)(?:\/|$)/.test(path)) return "marketing";
  if (/^\/api\/(?:grants|grant-questions|grant-organization-info|donors|gifts|campaigns|earned-income|financial-activity|hrsn-claims|budget-categories)(?:\/|$)/.test(path)) return "fundraising";
  if (/^\/api\/(?:outreach-(?:events|contacts|tasks)|volunteer-(?:profiles|opportunities))(?:\/|$)/.test(path)) return "outreach";
  if (/^\/api\/(?:clients|referrals|referral-network|tasks|activity-logs|evaluation-instruments|evaluation-responses)(?:\/|$)/.test(path)) return "crm";
  if (/^\/api\/(?:appointments|program-sessions|program-registrations|schedule)(?:\/|$)/.test(path)) return "schedule";
  return "";
}

function staffFinanceSectionForApiPath(pathname = "") {
  const path = String(pathname || "").split("?")[0];
  if (/^\/api\/(?:grants|grant-questions|grant-organization-info)(?:\/|$)/.test(path)) return "Grants";
  if (/^\/api\/(?:donors|gifts|campaigns)(?:\/|$)/.test(path)) return "Giving";
  if (/^\/api\/(?:earned-income|financial-activity)(?:\/|$)/.test(path)) return "Financial Activity";
  if (/^\/api\/hrsn-claims(?:\/|$)/.test(path)) return "HRSN Billing";
  if (/^\/api\/budget-categories(?:\/|$)/.test(path)) return "Budget";
  return "";
}

function staffModulesCanAccessApiPath(modules, pathname) {
  const moduleId = staffModuleForApiPath(pathname);
  return !moduleId || cleanStaffModules(modules).includes(moduleId);
}

function staffAccessCanAccessApiPath(access = {}, pathname = "") {
  if (!staffModulesCanAccessApiPath(access.modules, pathname)) return false;
  const financeSection = staffFinanceSectionForApiPath(pathname);
  return !financeSection || cleanStaffFinanceSections(access.financeSections).includes(financeSection);
}

function staffRoleCanAccessApiPath(role, pathname, accessLevels = defaultStaffAccessLevels) {
  return staffAccessCanAccessApiPath({
    modules: staffModulesForRole(role, accessLevels),
    financeSections: staffFinanceSectionsForRole(role, accessLevels)
  }, pathname);
}

function staffAccountIsActive({ isAdmin = false, configured = false, active = true } = {}) {
  return isAdmin || (configured && active !== false);
}

function toStaffUser(snapshot, accessLevels = defaultStaffAccessLevels) {
  const data = snapshot.data();
  const email = normalizeStaffEmail(data.email || snapshot.id);
  const role = normalizeStaffRole(data.accessLevelId || data.role, email, accessLevels);
  const accessLevel = staffAccessLevelForRole(role, accessLevels);
  return {
    id: snapshot.id,
    email,
    displayName: typeof data.displayName === "string" ? data.displayName.trim() : "",
    title: cleanString(data.title),
    phone: cleanString(data.phone),
    programs: Array.isArray(data.programs) ? data.programs.map(cleanString).filter(Boolean) : [],
    role,
    accessLevelId: role,
    accessLevelName: accessLevel.name,
    active: data.active !== false,
    modules: staffModulesForRole(role, accessLevels),
    financeSections: staffFinanceSectionsForRole(role, accessLevels),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy
  };
}

async function resolveStaffAccess(email) {
  const normalizedEmail = normalizeStaffEmail(email);
  const isAdmin = adminEmails.has(normalizedEmail);
  const [snapshot, accessLevels] = await Promise.all([
    normalizedEmail ? staffUsers.doc(normalizedEmail).get() : null,
    loadStaffAccessLevels()
  ]);
  const configured = snapshot?.exists === true;
  const data = snapshot?.exists ? snapshot.data() : {};
  const role = normalizeStaffRole(
    isAdmin ? "Admin" : data.accessLevelId || data.role,
    normalizedEmail,
    accessLevels
  );
  const accessLevel = staffAccessLevelForRole(role, accessLevels);
  return {
    email: normalizedEmail,
    displayName: typeof data.displayName === "string" ? data.displayName.trim() : "",
    role,
    accessLevelId: role,
    accessLevelName: accessLevel.name,
    active: staffAccountIsActive({ isAdmin, configured, active: data.active }),
    modules: staffModulesForRole(role, accessLevels),
    financeSections: staffFinanceSectionsForRole(role, accessLevels)
  };
}

function cleanAuditPath(value = "") {
  return String(value || "").split("?")[0].slice(0, 240);
}

function cleanAuditMetadata(value = {}) {
  const allowedKeys = new Set([
    "method",
    "path",
    "reason",
    "statusCode",
    "collection",
    "fileType",
    "source",
    "changedFields"
  ]);
  return Object.fromEntries(Object.entries(value || {})
    .filter(([key, item]) => allowedKeys.has(key)
      && (["string", "number", "boolean"].includes(typeof item)
        || (key === "changedFields" && Array.isArray(item))))
    .map(([key, item]) => [key, key === "changedFields"
      ? item.map((field) => cleanString(field).slice(0, 80)).filter(Boolean).slice(0, 80)
      : typeof item === "string" ? item.slice(0, 240) : item]));
}

function toSecurityAuditLog(snapshot) {
  const data = typeof snapshot?.data === "function" ? snapshot.data() : snapshot || {};
  return {
    id: snapshot?.id || cleanString(data.id),
    actorEmail: normalizeStaffEmail(data.actorEmail),
    actorUid: cleanString(data.actorUid),
    action: cleanString(data.action),
    result: cleanString(data.result),
    resourceType: cleanString(data.resourceType),
    resourceId: cleanString(data.resourceId),
    metadata: cleanAuditMetadata(data.metadata),
    occurredAt: cleanString(data.occurredAt)
  };
}

async function appendSecurityAudit({
  actorEmail = "",
  actorUid = "",
  action,
  result = "success",
  resourceType = "application",
  resourceId = "",
  metadata = {}
} = {}) {
  if (!cleanString(action)) return;
  try {
    await securityAuditLogs.add({
      actorEmail: normalizeStaffEmail(actorEmail),
      actorUid: cleanString(actorUid).slice(0, 160),
      action: cleanString(action).slice(0, 120),
      result: cleanString(result).slice(0, 40) || "success",
      resourceType: cleanString(resourceType).slice(0, 80) || "application",
      resourceId: cleanString(resourceId).slice(0, 160),
      metadata: cleanAuditMetadata(metadata),
      occurredAt: new Date().toISOString()
    });
  } catch {
    console.error("Security audit entry could not be saved.");
  }
}

function auditActionForRequest(request) {
  const method = String(request.method || "GET").toUpperCase();
  const path = cleanAuditPath(request.path || request.originalUrl);
  if (path === "/api/security-events") return "";
  if (method === "GET" && /^\/api\/admin\/export\//.test(path)) return "backup.download";
  if (method === "GET" && /^\/api\/clients(?:\/|$)/.test(path)) return "client.records_viewed";
  if (method === "GET" && /^\/api\/(?:grants|grant-questions|grant-organization-info)(?:\/|$)/.test(path)) {
    return "grant.records_viewed";
  }
  if (method === "GET") return "api.read";
  if (method === "POST") return "api.create_or_action";
  if (["PATCH", "PUT"].includes(method)) return "api.update";
  if (method === "DELETE") return "api.delete";
  return "api.request";
}

function auditStaffRequest(request, response) {
  if (!request.user || !String(request.path || "").startsWith("/api/")) return;
  if (request.path === "/api/admin/security-audit") return;
  const action = auditActionForRequest(request);
  if (!action) return;
  const segments = cleanAuditPath(request.path).split("/").filter(Boolean);
  const changedFields = request.body && typeof request.body === "object" && !Array.isArray(request.body)
    ? Object.keys(request.body).filter((field) => /^[a-zA-Z0-9_-]{1,80}$/.test(field))
    : [];
  void appendSecurityAudit({
    actorEmail: request.user.email,
    actorUid: request.user.uid,
    action,
    result: response.statusCode >= 400 ? "failed" : "success",
    resourceType: segments[1] || "api",
    resourceId: segments.length > 2 ? segments.at(-1) : "",
    metadata: {
      method: request.method,
      path: cleanAuditPath(request.path),
      statusCode: response.statusCode,
      changedFields
    }
  });
}

async function requireAuth(request, response, next) {
  const authHeader = request.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

  if (!token) {
    await appendSecurityAudit({
      action: "auth.rejected",
      result: "denied",
      resourceType: "session",
      metadata: { reason: "missing_token" }
    });
    response.status(401).json({
      error: "Sign in is required."
    });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, firebaseJwtKeys, {
      issuer: `https://securetoken.google.com/${firebaseAuthProjectId}`,
      audience: firebaseAuthProjectId
    });
    const email = payload.email || "";
    const emailVerified = payload.email_verified === true;
    const isAllowedDomain = allowedEmailDomain ? email.endsWith(`@${allowedEmailDomain}`) : true;

    if (!emailVerified || !isAllowedDomain) {
      await appendSecurityAudit({
        actorEmail: normalizeStaffEmail(email),
        actorUid: payload.sub,
        action: "auth.rejected",
        result: "denied",
        resourceType: "session",
        metadata: { reason: emailVerified ? "email_domain" : "email_unverified" }
      });
      response.status(403).json({
        error: "This account is not allowed to use SNACK CRM."
      });
      return;
    }

    const access = await resolveStaffAccess(email);
    if (!access.active) {
      await appendSecurityAudit({
        actorEmail: normalizeStaffEmail(email),
        actorUid: payload.sub,
        action: "auth.rejected",
        result: "denied",
        resourceType: "session",
        metadata: { reason: "inactive_staff" }
      });
      response.status(403).json({
        error: "This staff account is inactive."
      });
      return;
    }

    if (!staffAccessCanAccessApiPath(access, request.path || request.originalUrl)) {
      await appendSecurityAudit({
        actorEmail: normalizeStaffEmail(email),
        actorUid: payload.sub,
        action: "authorization.rejected",
        result: "denied",
        resourceType: "api",
        metadata: { path: cleanAuditPath(request.path || request.originalUrl) }
      });
      response.status(403).json({
        error: "Your staff role does not include access to this area."
      });
      return;
    }

    request.user = {
      uid: payload.sub,
      ...access,
      displayName: access.displayName || (typeof payload.name === "string" ? payload.name.trim() : "")
    };
    next();
  } catch {
    await appendSecurityAudit({
      action: "auth.rejected",
      result: "denied",
      resourceType: "session",
      metadata: { reason: "invalid_token" }
    });
    response.status(401).json({
      error: "Your sign-in session could not be verified."
    });
  }
}

async function ensureHelloMessage() {
  const docRef = messages.doc("hello");
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    await docRef.set({
      text: "Hello from the SNACK CRM database.",
      createdAt: new Date().toISOString()
    });
  }
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeClientStatusDefinitions(value) {
  const source = Array.isArray(value) && value.length ? value : defaultClientStatusDefinitions;
  const definitions = [];
  const seen = new Set();
  source.forEach((item) => {
    const name = cleanString(item?.name || item?.label).slice(0, 60);
    const key = name.toLowerCase();
    if (!name || seen.has(key)) return;
    const color = /^#[0-9a-f]{6}$/i.test(cleanString(item?.color))
      ? cleanString(item.color).toLowerCase()
      : "#475467";
    definitions.push({ name, color });
    seen.add(key);
  });
  if (!definitions.some((item) => item.name === "Scheduled")) {
    definitions.unshift({ ...defaultClientStatusDefinitions[0] });
  }
  return definitions;
}

async function loadClientStatusDefinitions() {
  const snapshot = await adminSettings.doc("crm").get();
  return normalizeClientStatusDefinitions(snapshot.exists ? snapshot.data()?.clientStatuses : null);
}

const addressWordStyles = new Map([
  ["n", "N"], ["ne", "NE"], ["e", "E"], ["se", "SE"],
  ["s", "S"], ["sw", "SW"], ["w", "W"], ["nw", "NW"],
  ["or", "OR"], ["ore", "OR"], ["oregon", "OR"],
  ["st", "St"], ["street", "St"], ["ave", "Ave"], ["avenue", "Ave"],
  ["rd", "Rd"], ["road", "Rd"], ["blvd", "Blvd"], ["boulevard", "Blvd"],
  ["dr", "Dr"], ["drive", "Dr"], ["ln", "Ln"], ["lane", "Ln"],
  ["ct", "Ct"], ["court", "Ct"], ["cir", "Cir"], ["circle", "Cir"],
  ["pkwy", "Pkwy"], ["parkway", "Pkwy"], ["hwy", "Hwy"], ["highway", "Hwy"],
  ["pl", "Pl"], ["place", "Pl"], ["ter", "Ter"], ["terrace", "Ter"],
  ["apt", "Apt"], ["apartment", "Apt"], ["ste", "Suite"], ["suite", "Suite"],
  ["unit", "Unit"], ["po", "PO"], ["box", "Box"], ["mcminnville", "McMinnville"]
]);

function normalizeAddressWord(word) {
  const match = String(word || "").match(/^([^A-Za-z0-9#]*)([A-Za-z0-9#'-]+)([^A-Za-z0-9#]*)$/);
  if (!match) return word;
  const [, leading, body, trailing] = match;
  const key = body.toLowerCase().replace(/\.$/, "");
  if (addressWordStyles.has(key)) return `${leading}${addressWordStyles.get(key)}${trailing}`;
  if (/^\d+(?:st|nd|rd|th)?$/i.test(body) || /^#\w+$/i.test(body) || /^\d{5}(?:-\d{4})?$/.test(body) || /^[A-Z]{2,}$/.test(body)) {
    return `${leading}${body}${trailing}`;
  }
  if (/[A-Z]/.test(body.slice(1)) && /[a-z]/.test(body)) return `${leading}${body}${trailing}`;
  const styled = body.split(/([-'])/).map((part) => {
    if (part === "-" || part === "'") return part;
    return part ? `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}` : part;
  }).join("");
  return `${leading}${styled}${trailing}`;
}

function normalizeMailingAddress(value) {
  const cleaned = cleanString(value)
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ");
  if (!cleaned) return "";
  return cleaned.split(",").map((segment) => segment.trim().split(" ").map(normalizeAddressWord).join(" ")).join(", ");
}

function normalizeAddressState(value) {
  const cleaned = cleanString(value);
  if (/^(?:or|ore|oregon)$/i.test(cleaned)) return "OR";
  return /^[a-z]{2}$/i.test(cleaned) ? cleaned.toUpperCase() : cleaned;
}

function stripSetmoreBookingIdFromNotes(notes) {
  return cleanString(notes)
    .replace(/^\s*Setmore booking ID:\s*\S+\s*$/gim, "")
    .replace(/\bSetmore booking ID:\s*\S+/gi, "")
    .replace(/\s+\|?\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function inferAppointmentLessonFromNotes(notes, appointmentType = "") {
  const noteText = stripSetmoreBookingIdFromNotes(notes);

  if (!noteText || cleanString(appointmentType).toLowerCase() === "enrollment") {
    return "";
  }

  const numericMatch = noteText.match(/\blesson\s*:?\s*(\d)\b/i);
  if (numericMatch) {
    return numericMatch[1] === "8" ? "Check In" : numericMatch[1];
  }

  for (const item of appointmentLessonKeywords) {
    if (item.patterns.some((pattern) => pattern.test(noteText))) {
      return item.value;
    }
  }

  return "";
}

function cleanInferredGoalText(value) {
  return cleanString(value)
    .replace(/\bSetmore booking ID:\s*\S+/gi, "")
    .replace(/\bLesson\s*:?\s*(?:\d|ND|Sugar|Food Groups?|FG|Macro(?:nutrients?)?|Micros?|Micronutrients?|Mindful Eating|ME|Healthy Habits?|HH|Check In)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s:;|,-]+|[\s:;|,-]+$/g, "")
    .trim();
}

function inferAppointmentGoalFromNotes(notes, lesson = "") {
  const noteText = stripSetmoreBookingIdFromNotes(notes);

  if (!noteText) {
    return "";
  }

  const flattened = noteText.replace(/\s*\|\s*/g, " ").replace(/\s+/g, " ").trim();
  const explicitGoal = flattened.match(/\bgoal\s*:?\s*(.+?)(?=\s+\bLesson\b\s*:|\s+\bSetmore\b|$)/i);
  if (explicitGoal?.[1]) {
    return cleanInferredGoalText(explicitGoal[1]);
  }

  const firstLine = noteText.split(/\r?\n/).map((line) => line.trim()).find(Boolean) || "";
  const lessonFromNotes = lesson || inferAppointmentLessonFromNotes(noteText, "Nutrition Education");
  const lessonPattern = lessonFromNotes === "Check In"
    ? /^(check\s*in)\s*[:|-]\s*(.+)$/i
    : /^(nutrient density|nutrient dense|sugar|food groups?|fg|macros?|macronutrients?|micros?|micronutrients?|mindful eating|healthy habits?)\s*[:|-]\s*(.+)$/i;
  const lessonPrefix = firstLine.match(lessonPattern);

  return lessonPrefix?.[2] ? cleanInferredGoalText(lessonPrefix[2]) : "";
}

function cleanOptionalNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const cleaned = cleanString(value);
  if (!cleaned) {
    return null;
  }
  const number = Number(cleaned);
  return Number.isNaN(number) ? null : number;
}

function cleanOptionalInteger(value) {
  const number = cleanOptionalNumber(value);
  return number === null ? null : Math.max(0, Math.round(number));
}

function cleanBoolean(value) {
  if (value === true) {
    return true;
  }

  const normalized = cleanString(value).toLowerCase();
  return ["true", "yes", "y", "1", "checked", "on"].includes(normalized);
}

function cleanAppointmentPrepChecklist(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => allowedAppointmentPrepKeys.has(key))
      .map(([key, checked]) => [key, cleanBoolean(checked)])
  );
}

function normalizeStatus(status) {
  const cleaned = cleanString(status);
  return legacyStatusMap[cleaned] || cleaned || "New";
}

function toReferral(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    firstName: data.firstName,
    lastName: data.lastName,
    parentName: data.parentName,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    phone: data.phone,
    email: data.email,
    preferredLanguage: data.preferredLanguage,
    preferredContactMethod: data.preferredContactMethod,
    referralType: data.referralType,
    referralSource: data.referralSource,
    referralDate: data.referralDate,
    firstContactDate: data.firstContactDate,
    mostRecentContactDate: data.mostRecentContactDate,
    firstAppointmentDate: data.firstAppointmentDate,
    mostRecentAppointmentDate: data.mostRecentAppointmentDate,
    lastAppointmentDate: data.lastAppointmentDate,
    graduationDate: data.graduationDate,
    addressStreet: data.addressStreet,
    addressCity: data.addressCity,
    addressState: normalizeAddressState(data.addressState),
    addressZip: data.addressZip,
    emailOptOut: Boolean(data.emailOptOut),
    textOptOut: Boolean(data.textOptOut),
    serviceEmailConsent: cleanBoolean(data.serviceEmailConsent),
    serviceTextConsent: cleanBoolean(data.serviceTextConsent),
    marketingConsent: cleanBoolean(data.marketingConsent),
    consentSource: data.consentSource,
    consentDate: data.consentDate,
    ycco: cleanBoolean(data.ycco),
    yccoId: data.yccoId,
    hrsn: cleanBoolean(data.hrsn),
    assessmentScore: data.assessmentScore,
    willingnessScore: data.willingnessScore,
    status: normalizeStatus(data.status),
    notes: data.notes,
    siblingIds: Array.isArray(data.siblingIds) ? data.siblingIds : [],
    providerLinks: Array.isArray(data.providerLinks) ? data.providerLinks : [],
    referralOrganization: data.referralOrganization,
    referrerName: data.referrerName,
    referrerEmail: data.referrerEmail,
    referrerPhone: data.referrerPhone,
    providerReviewRequired: cleanBoolean(data.providerReviewRequired),
    providerReviewReason: data.providerReviewReason,
    convertedClientId: data.convertedClientId,
    convertedAt: data.convertedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toClient(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    firstName: data.firstName,
    lastName: data.lastName,
    parentName: data.parentName,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    phone: data.phone,
    email: data.email,
    preferredLanguage: data.preferredLanguage,
    preferredContactMethod: data.preferredContactMethod,
    sourceReferralId: data.sourceReferralId,
    referralType: data.referralType,
    referralSource: data.referralSource,
    referralDate: data.referralDate,
    firstContactDate: data.firstContactDate,
    mostRecentContactDate: data.mostRecentContactDate,
    firstAppointmentDate: data.firstAppointmentDate,
    mostRecentAppointmentDate: data.mostRecentAppointmentDate,
    lastAppointmentDate: data.lastAppointmentDate,
    graduationDate: data.graduationDate,
    addressStreet: data.addressStreet,
    addressCity: data.addressCity,
    addressState: normalizeAddressState(data.addressState),
    addressZip: data.addressZip,
    emailOptOut: Boolean(data.emailOptOut),
    textOptOut: Boolean(data.textOptOut),
    serviceEmailConsent: cleanBoolean(data.serviceEmailConsent),
    serviceTextConsent: cleanBoolean(data.serviceTextConsent),
    marketingConsent: cleanBoolean(data.marketingConsent),
    consentSource: data.consentSource,
    consentDate: data.consentDate,
    ycco: cleanBoolean(data.ycco),
    yccoId: data.yccoId,
    hrsn: cleanBoolean(data.hrsn),
    assessmentScore: data.assessmentScore,
    willingnessScore: data.willingnessScore,
    currentLesson: data.currentLesson,
    status: data.status,
    notes: data.notes,
    siblingIds: Array.isArray(data.siblingIds) ? data.siblingIds : [],
    providerLinks: Array.isArray(data.providerLinks) ? data.providerLinks : [],
    publicReviewRequired: cleanBoolean(data.publicReviewRequired),
    publicReviewReason: data.publicReviewReason,
    publicPossibleMatchIds: Array.isArray(data.publicPossibleMatchIds) ? data.publicPossibleMatchIds : [],
    convertedAt: data.convertedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toScheduleClient(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    firstName: data.firstName,
    lastName: data.lastName,
    parentName: data.parentName,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    phone: data.phone,
    preferredLanguage: data.preferredLanguage,
    currentLesson: data.currentLesson,
    status: data.status
  };
}

function toReferralNetworkEntry(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    name: data.name,
    type: data.type,
    contactName: data.contactName,
    phone: data.phone,
    email: data.email,
    website: data.website,
    providers: Array.isArray(data.providers) ? data.providers : [],
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toOutreachEvent(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    name: data.name,
    type: data.type,
    status: data.status || "Scheduled",
    eventDate: data.eventDate,
    repeatPattern: data.repeatPattern,
    location: normalizeMailingAddress(data.location),
    contactName: data.contactName,
    contactRole: data.contactRole,
    phone: data.phone,
    email: data.email,
    deadline: data.deadline,
    registration: data.registration,
    setup: data.setup,
    mainActivity: data.mainActivity,
    giveaways: data.giveaways,
    costAmount: data.costAmount,
    costNotes: data.costNotes,
    interactionsCount: data.interactionsCount,
    referralsCount: data.referralsCount,
    interestListCount: data.interestListCount,
    participantListCount: data.participantListCount,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toOutreachContact(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    eventId: data.eventId,
    contactName: data.contactName,
    childName: data.childName,
    organizationName: data.organizationName,
    phone: data.phone,
    email: data.email,
    preferredLanguage: data.preferredLanguage,
    interestType: data.interestType,
    status: data.status,
    audienceGroups: Array.isArray(data.audienceGroups) ? data.audienceGroups : [],
    marketingConsent: data.marketingConsent === true,
    consentSource: data.consentSource,
    consentDate: data.consentDate,
    referralId: data.referralId,
    conversionType: data.conversionType,
    convertedAt: data.convertedAt,
    convertedRecordId: data.convertedRecordId,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toVolunteerProfile(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    preferredContact: data.preferredContact,
    status: data.status || "Applicant",
    applicationDate: data.applicationDate,
    approvalDate: data.approvalDate,
    approvedBy: data.approvedBy,
    snackEmail: data.snackEmail,
    interests: Array.isArray(data.interests) ? data.interests : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    availability: data.availability,
    volunteerFrequency: data.volunteerFrequency,
    volunteerFrequencyOther: data.volunteerFrequencyOther,
    groupVolunteering: data.groupVolunteering,
    groupDetails: data.groupDetails,
    availabilityDays: data.availabilityDays,
    availabilityTimes: data.availabilityTimes,
    availabilitySeasons: data.availabilitySeasons,
    experience: data.experience,
    motivation: data.motivation,
    questions: data.questions,
    languages: Array.isArray(data.languages) ? data.languages : [],
    backgroundCheckStatus: data.backgroundCheckStatus,
    emergencyContact: data.emergencyContact,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toVolunteerOpportunity(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: data.title,
    program: data.program,
    status: data.status || "Draft",
    opportunityDate: data.opportunityDate,
    startTime: data.startTime,
    endTime: data.endTime,
    location: normalizeMailingAddress(data.location),
    capacity: cleanOptionalInteger(data.capacity),
    coordinator: data.coordinator,
    description: data.description,
    requirements: Array.isArray(data.requirements) ? data.requirements : [],
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toAppointment(snapshot) {
  const data = snapshot.data();
  const clientIds = Array.isArray(data.clientIds)
    ? data.clientIds.filter(Boolean)
    : data.clientId
      ? [data.clientId]
      : [];

  return {
    id: snapshot.id,
    clientId: data.clientId || clientIds[0] || "",
    clientIds,
    clientName: data.clientName,
    clientNames: Array.isArray(data.clientNames) ? data.clientNames.filter(Boolean) : data.clientName ? [data.clientName] : [],
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    appointmentType: data.appointmentType || (data.lesson ? "Nutrition Education" : "Enrollment"),
    durationMinutes: cleanOptionalInteger(data.durationMinutes),
    publicBookingServiceId: data.publicBookingServiceId,
    publicBookingServiceLabel: data.publicBookingServiceLabel,
    serviceEmailConsent: cleanBoolean(data.serviceEmailConsent),
    serviceTextConsent: cleanBoolean(data.serviceTextConsent),
    location: normalizeMailingAddress(data.location),
    status: data.status,
    lesson: data.lesson,
    goal: data.goal,
    goalResult: data.goalResult,
    participantGoals: cleanAppointmentParticipantGoals(data.participantGoals),
    interpreterUse: data.interpreterUse,
    staffMember: data.staffMember,
    caregiverMood: data.caregiverMood,
    confidence: data.confidence,
    participation: data.participation,
    barriers: data.barriers,
    notes: data.notes,
    appointmentNote: data.appointmentNote,
    prepChecklist: cleanAppointmentPrepChecklist(data.prepChecklist),
    googleCalendarId: data.googleCalendarId,
    googleEventId: data.googleEventId,
    googleCalendarSyncStatus: data.googleCalendarSyncStatus,
    googleCalendarSyncError: data.googleCalendarSyncError,
    googleCalendarSyncedAt: data.googleCalendarSyncedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toProgramSession(snapshot) {
  const data = snapshot.data();
  const kitchenSession = data.program === "Kitchen";

  return {
    id: snapshot.id,
    program: data.program,
    title: kitchenSession ? normalizeKitchenClassLabel(data.title) : data.title,
    classTypeId: data.classTypeId,
    classTypeLabel: kitchenSession ? normalizeKitchenClassLabel(data.classTypeLabel) : data.classTypeLabel,
    sessionDate: data.sessionDate,
    startTime: data.startTime,
    durationMinutes: cleanOptionalInteger(data.durationMinutes),
    capacity: cleanOptionalInteger(data.capacity),
    status: data.status,
    location: normalizeMailingAddress(data.location),
    staffMember: data.staffMember,
    schoolName: data.schoolName,
    gradeGroup: data.gradeGroup,
    participantCount: cleanOptionalInteger(data.participantCount),
    notes: data.notes,
    googleCalendarId: data.googleCalendarId,
    googleEventId: data.googleEventId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toProgramRegistration(snapshot) {
  const data = snapshot.data();
  const clientIds = Array.isArray(data.clientIds) ? data.clientIds.filter(Boolean) : [];
  const clientNames = Array.isArray(data.clientNames) ? data.clientNames.filter(Boolean) : [];

  return {
    id: snapshot.id,
    sessionId: data.sessionId,
    program: data.program,
    caregiverName: data.caregiverName,
    clientIds,
    clientNames,
    attendeeCount: cleanOptionalInteger(data.attendeeCount) || Math.max(clientIds.length, clientNames.length, 1),
    phone: data.phone,
    email: data.email,
    address: normalizeMailingAddress(data.address),
    preferredLanguage: data.preferredLanguage,
    preferredContactMethod: data.preferredContactMethod,
    yccoMember: cleanBoolean(data.yccoMember),
    yccoId: data.yccoId,
    consentReminders: cleanBoolean(data.consentReminders),
    serviceEmailConsent: cleanBoolean(data.serviceEmailConsent),
    serviceTextConsent: cleanBoolean(data.serviceTextConsent),
    marketingConsent: cleanBoolean(data.marketingConsent),
    foodRestrictions: data.foodRestrictions,
    status: data.status,
    notes: data.notes,
    createdVia: data.createdVia,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toTask(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    title: data.title,
    type: normalizeTaskType(data.type),
    status: data.status,
    priority: data.priority,
    dueDate: data.dueDate,
    dueTime: data.dueTime,
    assignedTo: data.assignedTo,
    clientId: data.clientId,
    clientName: data.clientName,
    appointmentId: data.appointmentId,
    referralId: data.referralId,
    outreachEventId: data.outreachEventId,
    outreachEventName: data.outreachEventName,
    source: data.source,
    notes: data.notes,
    completedAt: data.completedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toActivityLog(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    type: data.type,
    direction: data.direction,
    title: data.title,
    result: data.result,
    description: data.description,
    activityDate: data.activityDate,
    activityTime: data.activityTime,
    occurredAt: data.occurredAt,
    relatedType: data.relatedType,
    relatedId: data.relatedId,
    relatedName: data.relatedName,
    createdBy: data.createdBy,
    createdByDisplayName: data.createdByDisplayName,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toGrant(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    foundationName: data.foundationName,
    grantName: data.grantName,
    status: data.status,
    openDate: data.openDate,
    deadlineDate: data.deadlineDate,
    deadlineTime: data.deadlineTime,
    awardExpectedDate: data.awardExpectedDate,
    focusAreas: data.focusAreas,
    recurrence: data.recurrence,
    applicationFrequency: data.applicationFrequency,
    contactName: data.contactName,
    contactRole: data.contactRole,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    secondaryContactName: data.secondaryContactName,
    secondaryContactEmail: data.secondaryContactEmail,
    websiteUrl: data.websiteUrl,
    portalUrl: data.portalUrl,
    portalLoginEmail: data.portalLoginEmail,
    portalLoginPassword: data.portalLoginPassword,
    portalLoginNotes: data.portalLoginNotes,
    amountRequested: data.amountRequested ?? null,
    amountMin: data.amountMin ?? null,
    amountMax: data.amountMax ?? null,
    reportingRequirements: data.reportingRequirements,
    pastGrantReceived: Boolean(data.pastGrantReceived),
    pastGrantAmount: data.pastGrantAmount ?? null,
    pastGrantYear: data.pastGrantYear ?? null,
    previousAwardDate: data.previousAwardDate,
    pastGrantNotes: data.pastGrantNotes,
    documents: Array.isArray(data.documents) ? data.documents : [],
    brandingNotes: data.brandingNotes,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toGrantQuestion(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    category: data.category,
    prompt: data.prompt,
    answer: data.answer,
    targetLimit: data.targetLimit,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toGrantOrganizationInfo(snapshot) {
  const data = snapshot.exists ? snapshot.data() : {};

  return {
    id: snapshot.id,
    legalName: data.legalName || "",
    dbaName: data.dbaName || "",
    ein: data.ein || "",
    mailingAddress: normalizeMailingAddress(data.mailingAddress),
    yearFounded: data.yearFounded ?? null,
    websiteUrl: data.websiteUrl || "",
    socialMediaLinks: data.socialMediaLinks || "",
    fundingStructure: data.fundingStructure || "",
    mission: data.mission || "",
    vision: data.vision || "",
    guidingPrinciples: data.guidingPrinciples || "",
    organizationDescription: data.organizationDescription || "",
    populationServed: data.populationServed || "",
    annualBudget: data.annualBudget || "",
    copyBlocks: Array.isArray(data.copyBlocks) ? data.copyBlocks : [],
    documents: Array.isArray(data.documents) ? data.documents : [],
    dataNotes: data.dataNotes || "",
    updatedAt: data.updatedAt || ""
  };
}

function toFundraisingDonor(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    name: data.name,
    status: data.status,
    donorType: data.donorType,
    email: data.email,
    phone: data.phone,
    address: normalizeMailingAddress(data.address),
    preferredContact: data.preferredContact,
    firstGiftDate: data.firstGiftDate,
    lastGiftDate: data.lastGiftDate,
    lastGiftAmount: data.lastGiftAmount ?? null,
    lifetimeGiving: data.lifetimeGiving ?? null,
    recurringAmount: data.recurringAmount ?? null,
    recurringFrequency: data.recurringFrequency,
    campaignId: data.campaignId,
    campaignName: data.campaignName,
    acknowledgementStatus: data.acknowledgementStatus,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toFundraisingCampaign(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    name: data.name,
    status: data.status,
    campaignType: data.campaignType,
    startDate: data.startDate,
    endDate: data.endDate,
    goalAmount: data.goalAmount ?? null,
    raisedAmount: data.raisedAmount ?? null,
    audience: data.audience,
    channels: data.channels,
    owner: data.owner,
    contactName: data.contactName,
    contactEmail: data.contactEmail,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toFundraisingGift(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    donorId: data.donorId,
    donorName: data.donorName,
    campaignId: data.campaignId,
    campaignName: data.campaignName,
    giftDate: data.giftDate,
    amount: data.amount ?? null,
    giftType: data.giftType,
    paymentMethod: data.paymentMethod,
    recurring: data.recurring === true,
    recurringFrequency: data.recurringFrequency,
    acknowledgementStatus: data.acknowledgementStatus,
    externalTransactionId: data.externalTransactionId,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toMarketingCampaign(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    name: data.name,
    status: data.status,
    campaignType: data.campaignType,
    channel: data.channel,
    owner: data.owner,
    startDate: data.startDate,
    sendDate: data.sendDate,
    endDate: data.endDate,
    subject: data.subject,
    preheader: data.preheader,
    goal: data.goal,
    callToAction: data.callToAction,
    language: data.language,
    audience: data.audience,
    audienceCount: data.audienceCount ?? null,
    audienceSource: data.audienceSource,
    consentRule: data.consentRule,
    deliveryTool: data.deliveryTool,
    sendWindow: data.sendWindow,
    metric: data.metric,
    nextStep: data.nextStep,
    notes: data.notes,
    sentCount: data.sentCount ?? null,
    openCount: data.openCount ?? null,
    clickCount: data.clickCount ?? null,
    conversionCount: data.conversionCount ?? null,
    impressions: data.impressions ?? null,
    spend: data.spend ?? null,
    externalCampaignId: data.externalCampaignId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function normalizeMarketingEmail(value) {
  return cleanString(value).toLowerCase();
}

function isValidMarketingEmail(value) {
  const email = normalizeMarketingEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function marketingSubscriberIdForEmail(value) {
  const email = normalizeMarketingEmail(value);
  if (!email) return "";
  return `email_${crypto.createHash("sha256").update(email).digest("hex").slice(0, 32)}`;
}

function cleanMarketingTags(value) {
  const values = Array.isArray(value) ? value : cleanString(value).split(",");
  return [...new Set(values.map(cleanString).filter(Boolean))].slice(0, 50);
}

function marketingAudienceGroupsFromRecord(record = {}) {
  const storedGroups = Array.isArray(record.audienceGroups)
    ? cleanMarketingTags(record.audienceGroups)
    : cleanMarketingTags(record.tags);

  return storedGroups
    .map((tag) => tag === "Newsletter Subscriber" ? "Newsletter" : tag)
    .filter((tag) => !legacyMarketingRoleTags.has(tag));
}

function marketingRoleTagsFromRecord(record = {}) {
  return cleanMarketingTags([
    ...cleanMarketingTags(record.roleTags),
    ...cleanMarketingTags(record.audienceGroups),
    ...cleanMarketingTags(record.tags)
  ]).filter((tag) => legacyMarketingRoleTags.has(tag));
}

function marketingSubscriberEligibility(subscriber = {}) {
  if (!isValidMarketingEmail(subscriber.email)) {
    return { eligible: false, label: "Invalid Email" };
  }
  if (subscriber.emailOptOut === true) {
    return { eligible: false, label: "Email Opt Out" };
  }
  if (cleanString(subscriber.status) !== "Active") {
    return {
      eligible: false,
      label: cleanString(subscriber.status) === "Consent Needed" ? "Consent Required" : "Excluded"
    };
  }
  if (!cleanString(subscriber.consentSource) || !cleanString(subscriber.consentDate)) {
    return { eligible: false, label: "Consent Incomplete" };
  }
  if (cleanString(subscriber.communicationPreference) === "No Contact") {
    return { eligible: false, label: "No Contact" };
  }
  return { eligible: true, label: "Ready for MailerLite" };
}

function toMarketingSubscriber(snapshot) {
  const data = snapshot.data();
  const eligibility = marketingSubscriberEligibility(data);
  const audienceGroups = marketingAudienceGroupsFromRecord(data);
  const roleTags = marketingRoleTagsFromRecord(data);

  return {
    id: snapshot.id,
    fullName: data.fullName,
    firstName: data.firstName,
    lastName: data.lastName,
    email: normalizeMarketingEmail(data.email),
    normalizedEmail: normalizeMarketingEmail(data.normalizedEmail || data.email),
    phone: data.phone,
    address: normalizeMailingAddress(data.address),
    preferredLanguage: data.preferredLanguage,
    communicationPreference: data.communicationPreference,
    status: data.status,
    roleTags,
    audienceGroups,
    tags: audienceGroups,
    emailOptOut: Boolean(data.emailOptOut),
    signupSource: data.signupSource,
    consentSource: data.consentSource,
    consentDate: data.consentDate,
    dateSubscribed: data.dateSubscribed,
    notes: data.notes,
    mailerLiteSubscriberId: data.mailerLiteSubscriberId,
    lastEmailOpenedAt: data.lastEmailOpenedAt,
    lastEmailClickedAt: data.lastEmailClickedAt,
    totalEmailsSent: data.totalEmailsSent ?? 0,
    totalOpens: data.totalOpens ?? 0,
    totalClicks: data.totalClicks ?? 0,
    eligible: eligibility.eligible,
    eligibilityLabel: eligibility.label,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function cleanMarketingSubscriberPayload(body = {}) {
  const status = cleanString(body.status) || "Consent Needed";
  const communicationPreference = cleanString(body.communicationPreference) || "Email";
  const audienceGroups = cleanMarketingTags(body.audienceGroups ?? body.tags);
  return {
    fullName: cleanString(body.fullName),
    firstName: cleanString(body.firstName),
    lastName: cleanString(body.lastName),
    email: normalizeMarketingEmail(body.email),
    normalizedEmail: normalizeMarketingEmail(body.email),
    phone: cleanString(body.phone),
    address: normalizeMailingAddress(body.address),
    preferredLanguage: cleanString(body.preferredLanguage),
    communicationPreference: allowedMarketingCommunicationPreferences.has(communicationPreference)
      ? communicationPreference
      : "Email",
    status: allowedMarketingSubscriberStatuses.has(status) ? status : "Consent Needed",
    audienceGroups,
    tags: audienceGroups,
    emailOptOut: Boolean(body.emailOptOut),
    signupSource: cleanString(body.signupSource),
    consentSource: cleanString(body.consentSource),
    consentDate: cleanString(body.consentDate),
    dateSubscribed: cleanString(body.dateSubscribed),
    notes: cleanString(body.notes),
    mailerLiteSubscriberId: cleanString(body.mailerLiteSubscriberId),
    lastEmailOpenedAt: cleanString(body.lastEmailOpenedAt),
    lastEmailClickedAt: cleanString(body.lastEmailClickedAt),
    totalEmailsSent: cleanOptionalInteger(body.totalEmailsSent) || 0,
    totalOpens: cleanOptionalInteger(body.totalOpens) || 0,
    totalClicks: cleanOptionalInteger(body.totalClicks) || 0
  };
}

function marketingSubscriberValidationError(payload = {}) {
  if (!cleanString(payload.fullName)) return "Contact name is required.";
  if (!normalizeMarketingEmail(payload.email)) return "Contact email is required.";
  if (payload.status === "Active" && !isValidMarketingEmail(payload.email)) {
    return "Enter a valid contact email address before marking this record Active.";
  }
  if (payload.status === "Active" && (!cleanString(payload.consentSource) || !cleanString(payload.consentDate))) {
    return "Consent source and consent date are required before a contact can be Active.";
  }
  return "";
}

function marketingSubscriberAddress(record = {}) {
  if (cleanString(record.address)) return normalizeMailingAddress(record.address);
  return normalizeMailingAddress([
    record.addressStreet,
    record.addressCity,
    record.addressState,
    record.addressZip
  ].map(cleanString).filter(Boolean).join(", "));
}

function buildUnifiedMarketingSubscribers({
  clients: clientRecords = [],
  referrals: referralRecords = [],
  donors = [],
  outreachContacts: outreachContactRecords = [],
  outreachEvents: outreachEventRecords = [],
  programRegistrations: registrationRecords = [],
  referralNetwork: referralNetworkRecords = [],
  subscribers = []
} = {}) {
  const candidates = new Map();

  function sourceOnlyKey(record = {}, source = {}) {
    const identity = [source.type, record.id, record.fullName, record.name, record.contactName, record.parentName, record.phone]
      .map(cleanString)
      .filter(Boolean)
      .join("|");
    return `source_${crypto.createHash("sha256").update(identity || "unknown-contact").digest("hex").slice(0, 32)}`;
  }

  function mergeSource(record = {}, source = {}) {
    const email = normalizeMarketingEmail(record.email);
    const key = email || sourceOnlyKey(record, source);
    const existing = candidates.get(key) || {
      id: email ? marketingSubscriberIdForEmail(email) : key,
      fullName: "",
      firstName: "",
      lastName: "",
      email,
      phone: "",
      address: "",
      preferredLanguage: "",
      communicationPreference: "Email",
      status: "Consent Needed",
      roleTags: [],
      audienceGroups: [],
      emailOptOut: false,
      signupSource: "",
      consentSource: "",
      consentDate: "",
      dateSubscribed: "",
      notes: "",
      mailerLiteSubscriberId: "",
      lastEmailOpenedAt: "",
      lastEmailClickedAt: "",
      totalEmailsSent: 0,
      totalOpens: 0,
      totalClicks: 0,
      sourceRecords: [],
      stored: false,
      createdAt: "",
      updatedAt: ""
    };
    existing.fullName ||= cleanString(record.fullName || record.name || record.parentName || record.contactName || record.caregiverName);
    existing.email ||= email;
    existing.firstName ||= cleanString(record.firstName);
    existing.lastName ||= cleanString(record.lastName);
    existing.phone ||= cleanString(record.phone);
    existing.address ||= marketingSubscriberAddress(record);
    existing.preferredLanguage ||= cleanString(record.preferredLanguage);
    if (existing.communicationPreference === "Email") {
      existing.communicationPreference = cleanString(record.communicationPreference || record.preferredContact || record.preferredContactMethod) || "Email";
    }
    existing.emailOptOut ||= record.emailOptOut === true;
    cleanMarketingTags(source.roleTags || source.tag).forEach((roleTag) => {
      if (!existing.roleTags.includes(roleTag)) existing.roleTags.push(roleTag);
    });
    cleanMarketingTags(source.audienceGroups || record.audienceGroups).forEach((group) => {
      if (!existing.audienceGroups.includes(group)) existing.audienceGroups.push(group);
    });
    if (record.marketingConsent === true && cleanString(record.consentSource) && cleanString(record.consentDate)) {
      existing.status = "Active";
      existing.consentSource ||= cleanString(record.consentSource);
      existing.consentDate ||= cleanString(record.consentDate);
      existing.dateSubscribed ||= cleanString(record.consentDate);
      if (!existing.audienceGroups.includes("Newsletter")) existing.audienceGroups.push("Newsletter");
    }
    const sourceRecord = {
      type: cleanString(source.type),
      id: cleanString(record.id),
      label: cleanString(source.label || record.fullName || record.name || record.contactName || record.caregiverName || record.parentName)
    };
    if (sourceRecord.type && !existing.sourceRecords.some((item) => item.type === sourceRecord.type && item.id === sourceRecord.id)) {
      existing.sourceRecords.push(sourceRecord);
    }
    candidates.set(key, existing);
  }

  clientRecords.forEach((record) => mergeSource(record, {
    type: "CRM Client",
    roleTags: ["Client Family"],
    label: [record.firstName, record.lastName].map(cleanString).filter(Boolean).join(" ")
  }));
  referralRecords.forEach((record) => mergeSource(record, {
    type: "Referral",
    roleTags: ["Referral Family"],
    label: [record.firstName, record.lastName].map(cleanString).filter(Boolean).join(" ")
  }));
  donors.forEach((record) => mergeSource(record, {
    type: "Fundraising Donor",
    roleTags: ["Donor"],
    label: record.name
  }));
  outreachContactRecords.forEach((record) => mergeSource(record, {
    type: "Outreach Lead",
    roleTags: ["Outreach Lead"],
    label: record.contactName
  }));
  outreachEventRecords.forEach((record) => mergeSource({
    ...record,
    fullName: record.contactName,
    email: record.email,
    phone: record.phone
  }, {
    type: "Outreach Event Partner",
    roleTags: ["Community Partner"],
    label: [record.contactName, record.name].map(cleanString).filter(Boolean).join(" | ")
  }));
  registrationRecords.forEach((record) => mergeSource(record, {
    type: "Class Registration",
    roleTags: ["Cooking Class Family"],
    audienceGroups: ["Cooking Classes"],
    label: record.caregiverName
  }));
  referralNetworkRecords.forEach((record) => {
    mergeSource({
      ...record,
      fullName: record.contactName || record.name
    }, {
      type: "Referral Organization",
      roleTags: ["Community Partner"],
      label: record.name
    });
    (Array.isArray(record.providers) ? record.providers : []).forEach((provider) => mergeSource({
      ...provider,
      id: `${cleanString(record.id)}:${cleanString(provider.id)}`,
      fullName: provider.name
    }, {
      type: "Referring Provider",
      roleTags: ["Referring Provider", "Community Partner"],
      label: [provider.name, record.name].map(cleanString).filter(Boolean).join(" | ")
    }));
  });

  subscribers.forEach((subscriber) => {
    const email = normalizeMarketingEmail(subscriber.email);
    if (!email) return;
    const existing = candidates.get(email) || {
      id: marketingSubscriberIdForEmail(email),
      sourceRecords: []
    };
    const storedAudienceGroups = marketingAudienceGroupsFromRecord(subscriber);
    const storedRoleTags = marketingRoleTagsFromRecord(subscriber);
    const sourceAudienceGroups = cleanMarketingTags(existing.audienceGroups);
    const merged = {
      ...existing,
      ...subscriber,
      id: subscriber.id || existing.id || marketingSubscriberIdForEmail(email),
      email,
      normalizedEmail: email,
      fullName: cleanString(subscriber.fullName) || cleanString(existing.fullName),
      firstName: cleanString(subscriber.firstName) || cleanString(existing.firstName),
      lastName: cleanString(subscriber.lastName) || cleanString(existing.lastName),
      phone: cleanString(subscriber.phone) || cleanString(existing.phone),
      address: cleanString(subscriber.address) || cleanString(existing.address),
      preferredLanguage: cleanString(subscriber.preferredLanguage) || cleanString(existing.preferredLanguage),
      communicationPreference: cleanString(subscriber.communicationPreference) || cleanString(existing.communicationPreference) || "Email",
      status: cleanString(subscriber.status) || "Consent Needed",
      roleTags: [...new Set([...cleanMarketingTags(existing.roleTags), ...storedRoleTags])],
      audienceGroups: [...new Set([...sourceAudienceGroups, ...storedAudienceGroups])],
      emailOptOut: Boolean(existing.emailOptOut || subscriber.emailOptOut),
      sourceRecords: Array.isArray(existing.sourceRecords) ? existing.sourceRecords : [],
      stored: true
    };
    candidates.set(email, merged);
  });

  return [...candidates.values()].map((subscriber) => {
    const eligibility = marketingSubscriberEligibility(subscriber);
    const sourceTypes = [...new Set((subscriber.sourceRecords || []).map((source) => source.type).filter(Boolean))];
    return {
      ...subscriber,
      fullName: cleanString(subscriber.fullName) || [subscriber.firstName, subscriber.lastName].map(cleanString).filter(Boolean).join(" ") || "Unnamed Contact",
      roleTags: cleanMarketingTags(subscriber.roleTags),
      audienceGroups: cleanMarketingTags(subscriber.audienceGroups),
      tags: cleanMarketingTags(subscriber.audienceGroups),
      sourceRecords: (subscriber.sourceRecords || []).sort((first, second) => first.type.localeCompare(second.type)),
      sourceTypes,
      sourceSummary: sourceTypes.join(", ") || "Manual",
      eligible: eligibility.eligible,
      eligibilityLabel: eligibility.label
    };
  }).sort((first, second) => first.fullName.localeCompare(second.fullName) || first.email.localeCompare(second.email));
}

function toEarnedIncome(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    name: data.name,
    activityType: data.activityType,
    status: data.status,
    source: data.source,
    serviceType: data.serviceType,
    useOfFunds: data.useOfFunds,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    dueDate: data.dueDate,
    paymentDate: data.paymentDate,
    amountBilled: data.amountBilled ?? null,
    amountReceived: data.amountReceived ?? null,
    payerName: data.payerName,
    grantId: data.grantId,
    grantName: data.grantName,
    campaignId: data.campaignId,
    campaignName: data.campaignName,
    donorId: data.donorId,
    donorName: data.donorName,
    externalTransactionId: data.externalTransactionId,
    contactName: data.contactName,
    contactEmail: data.contactEmail,
    reportingFrequency: data.reportingFrequency,
    requiredMetrics: data.requiredMetrics,
    risk: data.risk,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toHrsnClaim(snapshot) {
  const data = snapshot.data();
  const descriptions = Array.isArray(data.descriptions)
    ? data.descriptions
    : cleanString(data.description)
      ? [cleanString(data.description)]
      : [];
  const outcomes = Array.isArray(data.outcomes)
    ? data.outcomes
    : cleanString(data.outcome)
      ? [cleanString(data.outcome)]
      : [];
  return {
    id: snapshot.id,
    submitted: data.submitted === true,
    approved: data.approved === true,
    approvalDate: data.approvalDate,
    clientId: data.clientId,
    name: data.name,
    dateOfBirth: data.dateOfBirth,
    medicaidId: data.medicaidId,
    address: normalizeMailingAddress(data.address),
    serviceDate: data.serviceDate,
    durationMinutes: data.durationMinutes ?? null,
    amount: data.amount ?? null,
    coveredPopulations: Array.isArray(data.coveredPopulations) ? data.coveredPopulations : [],
    foodSecurityScore: data.foodSecurityScore ?? null,
    descriptions,
    outcomes,
    invoiceNumber: data.invoiceNumber,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    createdBy: data.createdBy,
    updatedBy: data.updatedBy
  };
}

function toBudgetCategory(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    budgetYear: data.budgetYear ?? null,
    groupName: data.groupName,
    name: data.name,
    annualBudget: data.annualBudget ?? null,
    active: data.active !== false,
    sortOrder: data.sortOrder ?? null,
    ynabCategoryId: data.ynabCategoryId,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    createdBy: data.createdBy,
    updatedBy: data.updatedBy
  };
}

function cleanPerformanceMetricPayload(value = {}) {
  const calculationMode = cleanString(value.calculationMode);
  const performanceDirection = cleanString(value.performanceDirection);
  const reportingFrequency = cleanString(value.reportingFrequency);
  const trackingTier = cleanString(value.trackingTier);

  return {
    definitionVersion: cleanOptionalInteger(value.definitionVersion),
    name: cleanString(value.name),
    programArea: cleanString(value.programArea),
    category: cleanString(value.category),
    definition: cleanString(value.definition),
    logicModelOutcome: cleanString(value.logicModelOutcome),
    calculationNotes: cleanString(value.calculationNotes),
    unit: cleanString(value.unit),
    calculationMode: allowedPerformanceCalculationModes.has(calculationMode)
      ? calculationMode
      : "Needs Definition",
    sourceKey: cleanString(value.sourceKey),
    dataSource: cleanString(value.dataSource),
    collectionMethod: cleanString(value.collectionMethod),
    collectionFrequency: allowedPerformanceFrequencies.has(cleanString(value.collectionFrequency))
      ? cleanString(value.collectionFrequency)
      : "Quarterly",
    performanceDirection: allowedPerformanceDirections.has(performanceDirection)
      ? performanceDirection
      : "No target status",
    baselineYear: cleanOptionalInteger(value.baselineYear),
    baselineValue: cleanOptionalNumber(value.baselineValue),
    annualTargetYear: cleanOptionalInteger(value.annualTargetYear),
    annualTargetValue: cleanOptionalNumber(value.annualTargetValue),
    threeYearTargetYear: cleanOptionalInteger(value.threeYearTargetYear),
    threeYearTargetValue: cleanOptionalNumber(value.threeYearTargetValue),
    reportingFrequency: allowedPerformanceFrequencies.has(reportingFrequency)
      ? reportingFrequency
      : "Quarterly",
    responsibleStaffMember: cleanString(value.responsibleStaffMember),
    notes: cleanString(value.notes),
    dashboard: cleanBoolean(value.dashboard),
    active: value.active !== false,
    trackingTier: allowedPerformanceTrackingTiers.has(trackingTier) ? trackingTier : "Core"
  };
}

function toPerformanceMetric(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    metricKey: snapshot.id,
    ...cleanPerformanceMetricPayload(data),
    targetHistory: Array.isArray(data.targetHistory) ? data.targetHistory : [],
    createdAt: data.createdAt,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy
  };
}

function cleanPerformanceMeasurementPayload(value = {}) {
  return {
    metricKey: cleanString(value.metricKey),
    periodStart: cleanString(value.periodStart),
    periodEnd: cleanString(value.periodEnd),
    value: cleanOptionalNumber(value.value),
    note: cleanString(value.note)
  };
}

function toPerformanceMeasurement(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...cleanPerformanceMeasurementPayload(data),
    createdAt: data.createdAt,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy
  };
}

function cleanPerformanceEvaluationQuestionPayload(value = {}) {
  const metricKeys = Array.isArray(value.metricKeys)
    ? value.metricKeys
    : cleanString(value.metricKeys).split(",");
  const responseOptions = Array.isArray(value.responseOptions)
    ? value.responseOptions
    : cleanString(value.responseOptions).split("\n");
  const responseOptionsEs = Array.isArray(value.responseOptionsEs)
    ? value.responseOptionsEs
    : cleanString(value.responseOptionsEs).split("\n");
  const recordStatus = cleanString(value.recordStatus);

  return {
    instrumentId: cleanString(value.instrumentId),
    instrument: cleanString(value.instrument),
    version: cleanString(value.version),
    question: cleanString(value.question),
    questionEs: cleanString(value.questionEs),
    topic: cleanString(value.topic),
    topicEs: cleanString(value.topicEs),
    respondentType: cleanString(value.respondentType),
    administrationPoint: cleanString(value.administrationPoint),
    responseType: cleanString(value.responseType),
    logicModelOutcome: cleanString(value.logicModelOutcome),
    metricKeys: [...new Set(metricKeys.map(cleanString).filter(Boolean))].slice(0, 50),
    mappingStatus: cleanString(value.mappingStatus) || "Needs Review",
    recordStatus: allowedPerformanceEvaluationRecordStatuses.has(recordStatus) ? recordStatus : "Draft",
    required: cleanBoolean(value.required),
    sortOrder: cleanOptionalInteger(value.sortOrder),
    scoringRule: cleanString(value.scoringRule) || "Not Configured",
    responseOptions: [...new Set(responseOptions.map(cleanString).filter(Boolean))].slice(0, 50),
    responseOptionsEs: responseOptionsEs.map(cleanString).filter(Boolean).slice(0, 50),
    helperText: cleanString(value.helperText),
    helperTextEs: cleanString(value.helperTextEs),
    prefillKey: cleanString(value.prefillKey),
    profileField: cleanString(value.profileField),
    domainKey: cleanString(value.domainKey),
    conditionalQuestionId: cleanString(value.conditionalQuestionId),
    note: cleanString(value.note)
  };
}

function toPerformanceEvaluationQuestion(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...cleanPerformanceEvaluationQuestionPayload(data),
    createdAt: data.createdAt,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy
  };
}

function cleanPerformanceEvaluationInstrumentPayload(value = {}) {
  const status = cleanString(value.status);
  const administrationPoints = Array.isArray(value.administrationPoints)
    ? value.administrationPoints
    : cleanString(value.administrationPoints).split(",");
  const languages = Array.isArray(value.languages)
    ? value.languages
    : cleanString(value.languages).split(",");

  return {
    name: cleanString(value.name),
    nameEs: cleanString(value.nameEs),
    version: cleanString(value.version),
    effectiveDate: cleanString(value.effectiveDate),
    programArea: cleanString(value.programArea),
    status: allowedPerformanceEvaluationRecordStatuses.has(status) ? status : "Draft",
    description: cleanString(value.description),
    descriptionEs: cleanString(value.descriptionEs),
    administrationPoints: [...new Set(administrationPoints.map(cleanString).filter(Boolean))].slice(0, 20),
    languages: [...new Set(languages.map(cleanString).filter(Boolean))].slice(0, 20),
    formType: cleanString(value.formType),
    respondentType: cleanString(value.respondentType),
    instructions: cleanString(value.instructions),
    instructionsEs: cleanString(value.instructionsEs),
    notes: cleanString(value.notes)
  };
}

function toPerformanceEvaluationInstrument(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...cleanPerformanceEvaluationInstrumentPayload(data),
    createdAt: data.createdAt,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy
  };
}

function cleanPerformanceEvaluationAnswer(answer = {}) {
  const questionId = cleanString(answer.questionId);
  const cleanAnswerValue = (answerValue) => {
    if (Array.isArray(answerValue)) {
      return [...new Set(answerValue.map(cleanString).filter(Boolean))].slice(0, 50);
    }
    if (typeof answerValue === "number") return Number.isFinite(answerValue) ? answerValue : "";
    if (typeof answerValue === "boolean") return Boolean(answerValue);
    return cleanString(answerValue);
  };
  const cleaned = {
    questionId,
    value: cleanAnswerValue(answer.value)
  };
  if (Object.hasOwn(answer, "beforeValue")) cleaned.beforeValue = cleanAnswerValue(answer.beforeValue);
  if (Object.hasOwn(answer, "nowValue")) cleaned.nowValue = cleanAnswerValue(answer.nowValue);
  return cleaned;
}

function cleanPerformanceEvaluationResponsePayload(value = {}) {
  const status = cleanString(value.status);
  const answers = (Array.isArray(value.answers) ? value.answers : [])
    .map(cleanPerformanceEvaluationAnswer)
    .filter((answer) => answer.questionId)
    .slice(0, 250);

  return {
    instrumentId: cleanString(value.instrumentId),
    instrumentName: cleanString(value.instrumentName),
    instrumentVersion: cleanString(value.instrumentVersion),
    instrumentEffectiveDate: cleanString(value.instrumentEffectiveDate),
    programArea: cleanString(value.programArea),
    clientId: cleanString(value.clientId),
    clientBirthdate: cleanString(value.clientBirthdate),
    appointmentId: cleanString(value.appointmentId),
    administrationPoint: cleanString(value.administrationPoint),
    responseDate: cleanString(value.responseDate),
    status: allowedPerformanceEvaluationResponseStatuses.has(status) ? status : "Draft",
    respondentType: cleanString(value.respondentType),
    respondentName: cleanString(value.respondentName),
    language: cleanString(value.language),
    answers,
    notes: cleanString(value.notes)
  };
}

function toPerformanceEvaluationResponse(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...cleanPerformanceEvaluationResponsePayload(data),
    createdAt: data.createdAt,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy
  };
}

function cleanNetworkProvider(provider) {
  const id = cleanString(provider?.id) || crypto.randomUUID();
  return {
    id,
    name: cleanString(provider?.name),
    email: cleanString(provider?.email),
    notes: cleanString(provider?.notes)
  };
}

function cleanProviderLink(link) {
  return {
    networkId: cleanString(link?.networkId),
    providerId: cleanString(link?.providerId),
    organizationName: cleanString(link?.organizationName),
    providerName: cleanString(link?.providerName)
  };
}

function cleanGrantDocumentLink(document = {}) {
  return {
    id: cleanString(document.id) || crypto.randomUUID(),
    type: cleanString(document.type) || "Other",
    category: cleanString(document.category) || cleanString(document.type) || "Other",
    title: cleanString(document.title),
    url: cleanString(document.url),
    storagePath: cleanString(document.storagePath),
    fileName: cleanString(document.fileName),
    mimeType: cleanString(document.mimeType),
    fileSize: cleanOptionalInteger(document.fileSize),
    uploadedAt: cleanString(document.uploadedAt),
    uploadedBy: cleanString(document.uploadedBy),
    notes: cleanString(document.notes)
  };
}

function cleanGrantDocumentLinks(documents) {
  return (Array.isArray(documents) ? documents : [])
    .map(cleanGrantDocumentLink)
    .filter((document) => document.title || document.url || document.fileName || document.notes);
}

function cleanGrantCopyBlock(block = {}) {
  return {
    id: cleanString(block.id) || crypto.randomUUID(),
    title: cleanString(block.title),
    content: cleanString(block.content),
    notes: cleanString(block.notes)
  };
}

function cleanGrantCopyBlocks(blocks) {
  return (Array.isArray(blocks) ? blocks : [])
    .map(cleanGrantCopyBlock)
    .filter((block) => block.title || block.content || block.notes);
}

function cleanGrantPayload(body) {
  return {
    foundationName: cleanString(body.foundationName),
    grantName: cleanString(body.grantName),
    status: cleanString(body.status) || "Researching",
    openDate: cleanString(body.openDate),
    deadlineDate: cleanString(body.deadlineDate),
    deadlineTime: normalizeAppointmentTimeValue(body.deadlineTime),
    awardExpectedDate: cleanString(body.awardExpectedDate),
    focusAreas: cleanString(body.focusAreas),
    recurrence: cleanString(body.recurrence),
    applicationFrequency: cleanString(body.applicationFrequency),
    contactName: cleanString(body.contactName),
    contactRole: cleanString(body.contactRole),
    contactEmail: cleanString(body.contactEmail),
    contactPhone: cleanString(body.contactPhone),
    secondaryContactName: cleanString(body.secondaryContactName),
    secondaryContactEmail: cleanString(body.secondaryContactEmail),
    websiteUrl: cleanString(body.websiteUrl),
    portalUrl: cleanString(body.portalUrl),
    portalLoginEmail: cleanString(body.portalLoginEmail),
    portalLoginPassword: cleanString(body.portalLoginPassword),
    portalLoginNotes: cleanString(body.portalLoginNotes),
    amountRequested: cleanOptionalNumber(body.amountRequested),
    amountMin: cleanOptionalNumber(body.amountMin),
    amountMax: cleanOptionalNumber(body.amountMax),
    reportingRequirements: cleanString(body.reportingRequirements),
    pastGrantReceived: cleanBoolean(body.pastGrantReceived),
    pastGrantAmount: cleanOptionalNumber(body.pastGrantAmount),
    pastGrantYear: cleanOptionalInteger(body.pastGrantYear),
    previousAwardDate: cleanString(body.previousAwardDate),
    pastGrantNotes: cleanString(body.pastGrantNotes),
    documents: cleanGrantDocumentLinks(body.documents),
    brandingNotes: cleanString(body.brandingNotes),
    notes: cleanString(body.notes)
  };
}

function cleanGrantQuestionPayload(body) {
  return {
    category: cleanString(body.category) || "General",
    prompt: cleanString(body.prompt),
    answer: cleanString(body.answer),
    targetLimit: cleanString(body.targetLimit),
    notes: cleanString(body.notes)
  };
}

function cleanGrantOrganizationInfoPayload(body) {
  return {
    legalName: cleanString(body.legalName),
    dbaName: cleanString(body.dbaName),
    ein: cleanString(body.ein),
    mailingAddress: normalizeMailingAddress(body.mailingAddress),
    yearFounded: cleanOptionalInteger(body.yearFounded),
    websiteUrl: cleanString(body.websiteUrl),
    socialMediaLinks: cleanString(body.socialMediaLinks),
    fundingStructure: cleanString(body.fundingStructure),
    mission: cleanString(body.mission),
    vision: cleanString(body.vision),
    guidingPrinciples: cleanString(body.guidingPrinciples),
    organizationDescription: cleanString(body.organizationDescription),
    populationServed: cleanString(body.populationServed),
    annualBudget: cleanString(body.annualBudget),
    copyBlocks: cleanGrantCopyBlocks(body.copyBlocks),
    documents: cleanGrantDocumentLinks(body.documents),
    dataNotes: cleanString(body.dataNotes)
  };
}

function cleanFundraisingDonorPayload(body) {
  return {
    name: cleanString(body.name),
    status: cleanString(body.status) || "Prospect",
    donorType: cleanString(body.donorType) || "Individual",
    email: cleanString(body.email),
    phone: cleanString(body.phone),
    address: normalizeMailingAddress(body.address),
    preferredContact: cleanString(body.preferredContact),
    firstGiftDate: cleanString(body.firstGiftDate),
    lastGiftDate: cleanString(body.lastGiftDate),
    lastGiftAmount: cleanOptionalNumber(body.lastGiftAmount),
    lifetimeGiving: cleanOptionalNumber(body.lifetimeGiving),
    recurringAmount: cleanOptionalNumber(body.recurringAmount),
    recurringFrequency: cleanString(body.recurringFrequency),
    campaignId: cleanString(body.campaignId),
    campaignName: cleanString(body.campaignName),
    acknowledgementStatus: cleanString(body.acknowledgementStatus),
    notes: cleanString(body.notes)
  };
}

function cleanFundraisingCampaignPayload(body) {
  return {
    name: cleanString(body.name),
    status: cleanString(body.status) || "Planning",
    campaignType: cleanString(body.campaignType),
    startDate: cleanString(body.startDate),
    endDate: cleanString(body.endDate),
    goalAmount: cleanOptionalNumber(body.goalAmount),
    raisedAmount: cleanOptionalNumber(body.raisedAmount),
    audience: cleanString(body.audience),
    channels: cleanString(body.channels),
    owner: cleanString(body.owner),
    contactName: cleanString(body.contactName),
    contactEmail: cleanString(body.contactEmail),
    notes: cleanString(body.notes)
  };
}

function cleanFundraisingGiftPayload(body) {
  const amount = cleanOptionalNumber(body.amount);
  return {
    donorId: cleanString(body.donorId),
    donorName: cleanString(body.donorName),
    campaignId: cleanString(body.campaignId),
    campaignName: cleanString(body.campaignName),
    giftDate: cleanString(body.giftDate),
    amount: amount === null ? null : Math.round(amount * 100) / 100,
    giftType: cleanString(body.giftType) || "Individual Gift",
    paymentMethod: cleanString(body.paymentMethod),
    recurring: cleanBoolean(body.recurring),
    recurringFrequency: cleanString(body.recurringFrequency),
    acknowledgementStatus: cleanString(body.acknowledgementStatus),
    externalTransactionId: cleanString(body.externalTransactionId),
    notes: cleanString(body.notes)
  };
}

function cleanMarketingCampaignPayload(body) {
  return {
    name: cleanString(body.name),
    status: cleanString(body.status) || "Draft",
    campaignType: cleanString(body.campaignType) || "General Campaign",
    channel: cleanString(body.channel) || "Email",
    owner: cleanString(body.owner),
    startDate: cleanString(body.startDate),
    sendDate: cleanString(body.sendDate),
    endDate: cleanString(body.endDate),
    subject: cleanString(body.subject),
    preheader: cleanString(body.preheader),
    goal: cleanString(body.goal),
    callToAction: cleanString(body.callToAction),
    language: cleanString(body.language),
    audience: cleanString(body.audience),
    audienceCount: cleanOptionalNumber(body.audienceCount),
    audienceSource: cleanString(body.audienceSource),
    consentRule: cleanString(body.consentRule),
    deliveryTool: cleanString(body.deliveryTool),
    sendWindow: cleanString(body.sendWindow),
    metric: cleanString(body.metric),
    nextStep: cleanString(body.nextStep),
    notes: cleanString(body.notes),
    sentCount: cleanOptionalNumber(body.sentCount),
    openCount: cleanOptionalNumber(body.openCount),
    clickCount: cleanOptionalNumber(body.clickCount),
    conversionCount: cleanOptionalNumber(body.conversionCount),
    impressions: cleanOptionalNumber(body.impressions),
    spend: cleanOptionalNumber(body.spend),
    externalCampaignId: cleanString(body.externalCampaignId)
  };
}

function cleanEarnedIncomePayload(body) {
  return {
    name: cleanString(body.name),
    activityType: cleanString(body.activityType),
    status: cleanString(body.status) || "Planning",
    source: cleanString(body.source),
    serviceType: cleanString(body.serviceType),
    useOfFunds: cleanString(body.useOfFunds),
    periodStart: cleanString(body.periodStart),
    periodEnd: cleanString(body.periodEnd),
    dueDate: cleanString(body.dueDate),
    paymentDate: cleanString(body.paymentDate),
    amountBilled: cleanOptionalNumber(body.amountBilled),
    amountReceived: cleanOptionalNumber(body.amountReceived),
    payerName: cleanString(body.payerName),
    grantId: cleanString(body.grantId),
    grantName: cleanString(body.grantName),
    campaignId: cleanString(body.campaignId),
    campaignName: cleanString(body.campaignName),
    donorId: cleanString(body.donorId),
    donorName: cleanString(body.donorName),
    externalTransactionId: cleanString(body.externalTransactionId),
    contactName: cleanString(body.contactName),
    contactEmail: cleanString(body.contactEmail),
    reportingFrequency: cleanString(body.reportingFrequency),
    requiredMetrics: cleanString(body.requiredMetrics),
    risk: cleanString(body.risk),
    notes: cleanString(body.notes)
  };
}

function cleanHrsnClaimPayload(body = {}) {
  const amount = cleanOptionalNumber(body.amount);
  const coveredPopulations = Array.isArray(body.coveredPopulations)
    ? [...new Set(body.coveredPopulations.map(cleanString).filter((value) => allowedHrsnCoveredPopulations.has(value)))]
    : [];
  const descriptions = Array.isArray(body.descriptions)
    ? [...new Set(body.descriptions.map(cleanString).filter((value) => allowedHrsnDescriptions.has(value)))]
    : allowedHrsnDescriptions.has(cleanString(body.description))
      ? [cleanString(body.description)]
      : [];
  const outcomes = Array.isArray(body.outcomes)
    ? [...new Set(body.outcomes.map(cleanString).filter((value) => allowedHrsnOutcomes.has(value)))]
    : allowedHrsnOutcomes.has(cleanString(body.outcome))
      ? [cleanString(body.outcome)]
      : [];
  return {
    submitted: cleanBoolean(body.submitted),
    approved: cleanBoolean(body.approved),
    approvalDate: cleanString(body.approvalDate),
    clientId: cleanString(body.clientId),
    name: cleanString(body.name),
    dateOfBirth: cleanString(body.dateOfBirth),
    medicaidId: cleanString(body.medicaidId),
    address: normalizeMailingAddress(body.address),
    serviceDate: cleanString(body.serviceDate),
    durationMinutes: cleanOptionalInteger(body.durationMinutes),
    amount: amount === null ? null : Math.round(amount * 100) / 100,
    coveredPopulations,
    foodSecurityScore: cleanOptionalInteger(body.foodSecurityScore),
    descriptions,
    outcomes,
    invoiceNumber: cleanString(body.invoiceNumber),
    notes: cleanString(body.notes)
  };
}

function cleanBudgetCategoryPayload(body = {}) {
  const annualBudget = cleanOptionalNumber(body.annualBudget);
  return {
    budgetYear: cleanOptionalInteger(body.budgetYear),
    groupName: cleanString(body.groupName),
    name: cleanString(body.name),
    annualBudget: annualBudget === null ? null : Math.round(annualBudget * 100) / 100,
    active: body.active === undefined ? true : cleanBoolean(body.active),
    sortOrder: cleanOptionalInteger(body.sortOrder),
    ynabCategoryId: cleanString(body.ynabCategoryId),
    notes: cleanString(body.notes)
  };
}

function cleanPersonPayload(body) {
  return {
    firstName: cleanString(body.firstName),
    lastName: cleanString(body.lastName),
    parentName: cleanString(body.parentName),
    dateOfBirth: cleanString(body.dateOfBirth),
    gender: cleanString(body.gender),
    phone: cleanString(body.phone),
    email: cleanString(body.email),
    preferredLanguage: cleanString(body.preferredLanguage),
    preferredContactMethod: cleanString(body.preferredContactMethod),
    referralType: cleanString(body.referralType),
    referralSource: cleanString(body.referralSource),
    referralDate: cleanString(body.referralDate),
    firstContactDate: cleanString(body.firstContactDate),
    mostRecentContactDate: cleanString(body.mostRecentContactDate),
    firstAppointmentDate: cleanString(body.firstAppointmentDate),
    mostRecentAppointmentDate: cleanString(body.mostRecentAppointmentDate),
    lastAppointmentDate: cleanString(body.lastAppointmentDate),
    graduationDate: cleanString(body.graduationDate),
    currentLesson: cleanString(body.currentLesson),
    addressStreet: cleanString(body.addressStreet),
    addressCity: cleanString(body.addressCity),
    addressState: normalizeAddressState(body.addressState),
    addressZip: cleanString(body.addressZip),
    emailOptOut: cleanBoolean(body.emailOptOut),
    textOptOut: cleanBoolean(body.textOptOut),
    serviceEmailConsent: cleanBoolean(body.serviceEmailConsent),
    serviceTextConsent: cleanBoolean(body.serviceTextConsent),
    marketingConsent: cleanBoolean(body.marketingConsent),
    consentSource: cleanString(body.consentSource),
    consentDate: cleanString(body.consentDate),
    ycco: cleanBoolean(body.ycco),
    yccoId: cleanString(body.yccoId),
    hrsn: cleanBoolean(body.hrsn),
    assessmentScore: cleanOptionalNumber(body.assessmentScore),
    willingnessScore: cleanOptionalNumber(body.willingnessScore),
    notes: cleanString(body.notes)
  };
}

function referralSourceFromRecord(record = {}) {
  const source = cleanString(record.referralSource);

  if (source) {
    return source;
  }

  const providerLinks = Array.isArray(record.providerLinks) ? record.providerLinks : [];
  const primaryProvider = providerLinks.map(cleanProviderLink).find((link) => link.providerName);
  return primaryProvider?.providerName || "";
}

function clientPayloadFromReferral(referral, referralId, options = {}) {
  const now = options.now || new Date().toISOString();
  const convertedSiblingClientIds = Array.isArray(options.convertedSiblingClientIds)
    ? options.convertedSiblingClientIds.filter(Boolean)
    : [];

  return {
    firstName: referral.firstName || "",
    lastName: referral.lastName || "",
    parentName: referral.parentName || "",
    dateOfBirth: referral.dateOfBirth || "",
    gender: referral.gender || "",
    phone: referral.phone || "",
    email: referral.email || "",
    preferredLanguage: referral.preferredLanguage || "",
    preferredContactMethod: referral.preferredContactMethod || "",
    referralType: referral.referralType || "",
    referralSource: referralSourceFromRecord(referral),
    referralDate: referral.referralDate || "",
    firstContactDate: referral.firstContactDate || "",
    mostRecentContactDate: referral.mostRecentContactDate || "",
    firstAppointmentDate: referral.firstAppointmentDate || "",
    mostRecentAppointmentDate: referral.mostRecentAppointmentDate || "",
    lastAppointmentDate: referral.lastAppointmentDate || "",
    graduationDate: referral.graduationDate || "",
    addressStreet: referral.addressStreet || "",
    addressCity: referral.addressCity || "",
    addressState: normalizeAddressState(referral.addressState),
    addressZip: referral.addressZip || "",
    emailOptOut: Boolean(referral.emailOptOut),
    textOptOut: Boolean(referral.textOptOut),
    serviceEmailConsent: cleanBoolean(referral.serviceEmailConsent),
    serviceTextConsent: cleanBoolean(referral.serviceTextConsent),
    marketingConsent: cleanBoolean(referral.marketingConsent),
    consentSource: cleanString(referral.consentSource),
    consentDate: cleanString(referral.consentDate),
    ycco: cleanBoolean(referral.ycco),
    yccoId: cleanString(referral.yccoId),
    hrsn: cleanBoolean(referral.hrsn),
    assessmentScore: referral.assessmentScore ?? null,
    willingnessScore: referral.willingnessScore ?? null,
    sourceReferralId: referralId,
    siblingIds: convertedSiblingClientIds,
    providerLinks: Array.isArray(referral.providerLinks) ? referral.providerLinks.map(cleanProviderLink).filter((link) => link.providerId || link.providerName) : [],
    convertedAt: now,
    status: "Scheduled",
    notes: referral.notes || "",
    createdAt: now,
    updatedAt: now,
    createdBy: cleanString(options.createdBy)
  };
}

function cleanReferralNetworkPayload(body) {
  return {
    name: cleanString(body.name),
    type: cleanString(body.type),
    contactName: cleanString(body.contactName),
    phone: cleanString(body.phone),
    email: cleanString(body.email),
    website: cleanString(body.website),
    providers: Array.isArray(body.providers) ? body.providers.map(cleanNetworkProvider).filter((provider) => provider.name) : [],
    notes: cleanString(body.notes)
  };
}

function cleanOutreachEventPayload(body) {
  return {
    name: cleanString(body.name),
    type: cleanString(body.type) || "Outreach Event",
    status: cleanString(body.status) || "Scheduled",
    eventDate: cleanString(body.eventDate),
    repeatPattern: cleanString(body.repeatPattern),
    location: normalizeMailingAddress(body.location),
    contactName: cleanString(body.contactName),
    contactRole: cleanString(body.contactRole),
    phone: cleanString(body.phone),
    email: cleanString(body.email),
    deadline: cleanString(body.deadline),
    registration: cleanString(body.registration),
    setup: cleanString(body.setup),
    mainActivity: cleanString(body.mainActivity),
    giveaways: cleanString(body.giveaways),
    costAmount: cleanOptionalNumber(body.costAmount),
    costNotes: cleanString(body.costNotes),
    interactionsCount: cleanOptionalInteger(body.interactionsCount),
    referralsCount: cleanOptionalInteger(body.referralsCount),
    interestListCount: cleanOptionalInteger(body.interestListCount),
    participantListCount: cleanOptionalInteger(body.participantListCount),
    notes: cleanString(body.notes)
  };
}

function cleanOutreachContactPayload(body) {
  return {
    eventId: cleanString(body.eventId),
    contactName: cleanString(body.contactName),
    childName: cleanString(body.childName),
    organizationName: cleanString(body.organizationName),
    phone: cleanString(body.phone),
    email: normalizeMarketingEmail(body.email),
    preferredLanguage: cleanString(body.preferredLanguage),
    interestType: cleanString(body.interestType),
    status: cleanString(body.status) || "New",
    audienceGroups: cleanMarketingTags(body.audienceGroups),
    marketingConsent: body.marketingConsent === true,
    consentSource: cleanString(body.consentSource),
    consentDate: cleanString(body.consentDate),
    referralId: cleanString(body.referralId),
    conversionType: cleanString(body.conversionType),
    convertedAt: cleanString(body.convertedAt),
    convertedRecordId: cleanString(body.convertedRecordId),
    notes: cleanString(body.notes)
  };
}

function cleanVolunteerList(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(values.map(cleanString).filter(Boolean))].slice(0, 30);
}

function cleanVolunteerProfilePayload(body = {}) {
  return {
    fullName: cleanString(body.fullName),
    email: normalizeMarketingEmail(body.email),
    phone: cleanString(body.phone),
    preferredContact: cleanString(body.preferredContact) || "Email",
    status: cleanString(body.status) || "Applicant",
    applicationDate: cleanString(body.applicationDate),
    approvalDate: cleanString(body.approvalDate),
    approvedBy: cleanString(body.approvedBy),
    snackEmail: normalizeMarketingEmail(body.snackEmail),
    interests: cleanVolunteerList(body.interests),
    skills: cleanVolunteerList(body.skills),
    availability: cleanString(body.availability),
    volunteerFrequency: cleanString(body.volunteerFrequency),
    volunteerFrequencyOther: cleanString(body.volunteerFrequencyOther),
    groupVolunteering: cleanString(body.groupVolunteering),
    groupDetails: cleanString(body.groupDetails),
    availabilityDays: cleanString(body.availabilityDays),
    availabilityTimes: cleanString(body.availabilityTimes),
    availabilitySeasons: cleanString(body.availabilitySeasons),
    experience: cleanString(body.experience),
    motivation: cleanString(body.motivation),
    questions: cleanString(body.questions),
    languages: cleanVolunteerList(body.languages),
    backgroundCheckStatus: cleanString(body.backgroundCheckStatus) || "Not Started",
    emergencyContact: cleanString(body.emergencyContact),
    notes: cleanString(body.notes)
  };
}

function cleanVolunteerOpportunityPayload(body = {}) {
  return {
    title: cleanString(body.title),
    program: cleanString(body.program) || "Outreach",
    status: cleanString(body.status) || "Draft",
    opportunityDate: cleanString(body.opportunityDate),
    startTime: normalizeAppointmentTimeValue(body.startTime),
    endTime: normalizeAppointmentTimeValue(body.endTime),
    location: normalizeMailingAddress(body.location),
    capacity: cleanOptionalInteger(body.capacity),
    coordinator: cleanString(body.coordinator),
    description: cleanString(body.description),
    requirements: cleanVolunteerList(body.requirements),
    notes: cleanString(body.notes)
  };
}

function normalizeAppointmentStatus(status) {
  const cleaned = cleanString(status) || "Scheduled";
  return allowedAppointmentStatuses.has(cleaned) ? cleaned : "Scheduled";
}

function normalizeAppointmentGoalResult(result) {
  const cleaned = cleanString(result);
  return allowedAppointmentGoalResults.has(cleaned) ? cleaned : "";
}

function cleanAppointmentParticipantGoals(value) {
  if (!Array.isArray(value)) return [];

  const seen = new Set();
  const participantGoals = [];

  value.slice(0, 20).forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    const clientId = cleanString(entry.clientId);
    const clientName = cleanString(entry.clientName);
    const identityKey = clientId
      ? `client:${clientId}`
      : clientName
        ? `name:${clientName.toLowerCase()}`
        : "";
    if (!identityKey || seen.has(identityKey)) return;
    seen.add(identityKey);
    participantGoals.push({
      clientId,
      clientName,
      goal: cleanString(entry.goal),
      goalResult: normalizeAppointmentGoalResult(entry.goalResult)
    });
  });

  return participantGoals;
}

function normalizeTaskStatus(status) {
  const cleaned = cleanString(status) || "Open";
  return allowedTaskStatuses.has(cleaned) ? cleaned : "Open";
}

function normalizeTaskPriority(priority) {
  const cleaned = cleanString(priority) || "Normal";
  return allowedTaskPriorities.has(cleaned) ? cleaned : "Normal";
}

function normalizeTaskType(type) {
  const cleaned = cleanString(type);
  if (!cleaned) {
    return "Task";
  }
  const mapped = legacyTaskTypeMap[cleaned.toLowerCase()] || cleaned;
  return allowedTaskTypes.has(mapped) ? mapped : "Task";
}

function normalizeActivityType(type) {
  const cleaned = cleanString(type);
  return allowedActivityTypes.has(cleaned) ? cleaned : "Call";
}

function normalizeActivityDirection(direction) {
  const cleaned = cleanString(direction);
  return allowedActivityDirections.has(cleaned) ? cleaned : "Outbound";
}

function cleanAppointmentPayload(body) {
  const clientIds = Array.isArray(body.clientIds)
    ? body.clientIds.map(cleanString).filter(Boolean)
    : cleanString(body.clientIds)
      ? cleanString(body.clientIds).split(",").map(cleanString).filter(Boolean)
      : cleanString(body.clientId)
        ? [cleanString(body.clientId)]
        : [];
  const clientNames = Array.isArray(body.clientNames)
    ? body.clientNames.map(cleanString).filter(Boolean)
    : cleanString(body.clientNames)
      ? cleanString(body.clientNames).split(",").map(cleanString).filter(Boolean)
      : cleanString(body.clientName)
        ? [cleanString(body.clientName)]
        : [];
  const durationMinutes = cleanOptionalInteger(body.durationMinutes);
  const appointmentType = cleanString(body.appointmentType) || (cleanString(body.lesson) ? "Nutrition Education" : "Enrollment");
  const notes = stripSetmoreBookingIdFromNotes(body.notes);
  const inferredLesson = inferAppointmentLessonFromNotes(notes, appointmentType);
  const lesson = cleanString(body.lesson) || inferredLesson;
  const payload = {
    clientId: clientIds[0] || "",
    clientIds,
    clientName: clientNames[0] || cleanString(body.clientName),
    clientNames,
    appointmentDate: cleanString(body.appointmentDate),
    appointmentTime: normalizeAppointmentTimeValue(body.appointmentTime),
    appointmentType,
    location: normalizeMailingAddress(body.location),
    status: normalizeAppointmentStatus(body.status),
    lesson,
    goal: cleanString(body.goal) || inferAppointmentGoalFromNotes(notes, lesson),
    staffMember: cleanString(body.staffMember),
    notes,
    appointmentNote: cleanString(body.appointmentNote)
  };
  for (const field of ["interpreterUse", "caregiverMood", "confidence", "participation", "barriers"]) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = cleanString(body[field]);
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, "goalResult")) {
    payload.goalResult = normalizeAppointmentGoalResult(body.goalResult);
  }
  if (Object.prototype.hasOwnProperty.call(body, "participantGoals")) {
    payload.participantGoals = cleanAppointmentParticipantGoals(body.participantGoals);
  }
  const publicBookingServiceId = cleanString(body.publicBookingServiceId);
  const publicBookingServiceLabel = cleanString(body.publicBookingServiceLabel);

  if (durationMinutes) {
    payload.durationMinutes = durationMinutes;
  }

  if (publicBookingServiceId) {
    payload.publicBookingServiceId = publicBookingServiceId;
  }

  if (publicBookingServiceLabel) {
    payload.publicBookingServiceLabel = publicBookingServiceLabel;
  }

  return payload;
}

function normalizeProgram(value) {
  const program = cleanString(value);
  return allowedPrograms.has(program) ? program : "";
}

function normalizeProgramSessionStatus(value) {
  const status = cleanString(value) || "Scheduled";
  return allowedProgramSessionStatuses.has(status) ? status : "Scheduled";
}

function normalizeProgramRegistrationStatus(value) {
  const status = cleanString(value) || "Registered";
  return allowedProgramRegistrationStatuses.has(status) ? status : "Registered";
}

function cleanProgramSessionPayload(body = {}) {
  const durationMinutes = cleanOptionalInteger(body.durationMinutes);
  const capacity = cleanOptionalInteger(body.capacity);
  const participantCount = cleanOptionalInteger(body.participantCount);
  const program = normalizeProgram(body.program);

  return {
    program,
    title: program === "Kitchen" ? normalizeKitchenClassLabel(body.title) : cleanString(body.title),
    classTypeId: cleanString(body.classTypeId),
    classTypeLabel: program === "Kitchen" ? normalizeKitchenClassLabel(body.classTypeLabel) : cleanString(body.classTypeLabel),
    sessionDate: cleanString(body.sessionDate),
    startTime: normalizeAppointmentTimeValue(body.startTime),
    durationMinutes: durationMinutes > 0 ? durationMinutes : 60,
    capacity: capacity > 0 ? capacity : null,
    status: normalizeProgramSessionStatus(body.status),
    location: normalizeMailingAddress(body.location),
    staffMember: cleanString(body.staffMember),
    schoolName: cleanString(body.schoolName),
    gradeGroup: cleanString(body.gradeGroup),
    participantCount: participantCount ?? 0,
    notes: cleanString(body.notes),
    googleCalendarId: cleanString(body.googleCalendarId),
    googleEventId: cleanString(body.googleEventId)
  };
}

function cleanProgramRegistrationPayload(body = {}) {
  const clientIds = Array.isArray(body.clientIds) ? body.clientIds.map(cleanString).filter(Boolean) : [];
  const clientNames = Array.isArray(body.clientNames) ? body.clientNames.map(cleanString).filter(Boolean) : [];
  const requestedCount = cleanOptionalInteger(body.attendeeCount);

  return {
    sessionId: cleanString(body.sessionId),
    program: normalizeProgram(body.program),
    caregiverName: cleanString(body.caregiverName),
    clientIds: [...new Set(clientIds)],
    clientNames,
    attendeeCount: Math.max(requestedCount || 0, clientIds.length, clientNames.length, 1),
    phone: cleanString(body.phone),
    email: cleanString(body.email),
    address: normalizeMailingAddress(body.address),
    preferredLanguage: cleanString(body.preferredLanguage),
    preferredContactMethod: cleanString(body.preferredContactMethod),
    yccoMember: cleanBoolean(body.yccoMember),
    yccoId: cleanString(body.yccoId),
    consentReminders: cleanBoolean(body.consentReminders),
    serviceEmailConsent: cleanBoolean(body.serviceEmailConsent),
    serviceTextConsent: cleanBoolean(body.serviceTextConsent),
    marketingConsent: cleanBoolean(body.marketingConsent),
    foodRestrictions: cleanString(body.foodRestrictions),
    status: normalizeProgramRegistrationStatus(body.status),
    notes: cleanString(body.notes),
    createdVia: cleanString(body.createdVia)
  };
}

function programRegistrationSeatCount(registrations = []) {
  return registrations
    .filter((registration) => ["Registered", "Attended"].includes(registration.status))
    .reduce((total, registration) => total + Math.max(1, cleanOptionalInteger(registration.attendeeCount) || 1), 0);
}

function programRegistrationStatusForCapacity(session = {}, registrations = [], attendeeCount = 1, waitlistEnabled = true) {
  const capacity = cleanOptionalInteger(session.capacity);
  const requestedSeats = Math.max(1, cleanOptionalInteger(attendeeCount) || 1);

  if (!capacity || programRegistrationSeatCount(registrations) + requestedSeats <= capacity) {
    return "Registered";
  }

  return waitlistEnabled ? "Waitlisted" : "Registered";
}

function publicKitchenSessionAvailability(
  session = {},
  registrations = [],
  settings = defaultSchedulingSettingsNormalized,
  now = new Date()
) {
  const classType = settings.kitchenClassTypes.find((candidate) => candidate.id === cleanString(session.classTypeId));
  const sessionDate = cleanString(session.sessionDate);
  const startTime = normalizeAppointmentTimeValue(session.startTime);

  if (
    normalizeProgram(session.program) !== "Kitchen"
    || normalizeProgramSessionStatus(session.status) !== "Scheduled"
    || !classType?.active
    || !classType.publiclyBookable
    || !parseDateOnly(sessionDate)
    || !startTime
    || !isPublicBookingDateInRange(sessionDate, now)
    || !isPublicAppointmentAtLeastHoursAhead(sessionDate, startTime, now)
  ) {
    return null;
  }

  const capacity = cleanOptionalInteger(session.capacity) || classType.capacity || settings.kitchen.defaultCapacity;
  const registeredSeats = programRegistrationSeatCount(registrations);
  const spacesRemaining = Math.max(0, capacity - registeredSeats);
  const isFull = registeredSeats >= capacity;
  const waitlistEnabled = Boolean(settings.kitchen.waitlistEnabled);

  return {
    capacity,
    registeredSeats,
    spacesRemaining,
    isFull,
    waitlistEnabled,
    canRegister: !isFull || waitlistEnabled,
    nextStatus: isFull ? (waitlistEnabled ? "Waitlisted" : "Closed") : "Registered"
  };
}

async function resolveAppointmentImportClients(payload, clientsByName, options = {}) {
  if (payload.clientIds.length) {
    if (!payload.clientNames.length) {
      const clientNames = [];
      for (const clientId of payload.clientIds) {
        const clientSnapshot = await clients.doc(clientId).get();
        if (clientSnapshot.exists) {
          const client = toClient(clientSnapshot);
          clientNames.push(`${client.firstName || ""} ${client.lastName || ""}`.trim());
        }
      }
      payload.clientNames = clientNames;
      payload.clientName = clientNames[0] || "";
    }
    return "";
  }

  if (!payload.clientNames.length) {
    return "Client name or client ID is required.";
  }

  const matchedClients = [];

  for (const name of payload.clientNames) {
    const match = clientsByName.get(normalizedLookupKey(name));

    if (!match) {
      if (options.allowNameOnly) {
        continue;
      }
      return `No client match found for ${name}.`;
    }

    matchedClients.push(match);
  }

  payload.clientIds = matchedClients.map((client) => client.id);
  payload.clientId = payload.clientIds[0] || "";
  payload.clientName = payload.clientNames[0] || "";

  return "";
}

function normalizeAppointmentTimeValue(value) {
  const raw = cleanString(value);

  if (!raw) {
    return "";
  }

  const militaryMatch = raw.match(/^(\d{1,2}):(\d{2})$/);

  if (militaryMatch) {
    const hour = Number(militaryMatch[1]);
    const minute = Number(militaryMatch[2]);

    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
  }

  const standardMatch = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]\.?m\.?)$/i);

  if (standardMatch) {
    let hour = Number(standardMatch[1]);
    const minute = Number(standardMatch[2] || "00");
    const period = standardMatch[3].toLowerCase();

    if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
      if (period.startsWith("p") && hour !== 12) {
        hour += 12;
      }

      if (period.startsWith("a") && hour === 12) {
        hour = 0;
      }

      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
  }

  return raw;
}

function appointmentTimeMinutes(value) {
  const normalized = normalizeAppointmentTimeValue(value);
  const match = normalized.match(/^(\d{2}):(\d{2})$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

function formatAppointmentTimeValue(value) {
  const minutes = appointmentTimeMinutes(value);

  if (minutes === null) {
    return cleanString(value);
  }

  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

function normalizeSchedulingWeekdays(value) {
  const source = Array.isArray(value) ? value : defaultSchedulingSettings.weekdays;
  const weekdays = source
    .map((day) => Number(day))
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
  const unique = [...new Set(weekdays)];

  return unique.length ? unique.sort((first, second) => first - second) : [...defaultSchedulingSettings.weekdays];
}

function normalizeSchedulingTime(value, fallback) {
  const normalized = normalizeAppointmentTimeValue(value);

  if (appointmentTimeMinutes(normalized) === null) {
    return fallback;
  }

  return normalized;
}

function scheduleTypeId(value, label, prefix, index) {
  const supplied = cleanString(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const fromLabel = cleanString(label).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return supplied || fromLabel || `${prefix}-${index + 1}`;
}

function booleanWithDefault(value, fallback) {
  return value === undefined || value === null || value === "" ? fallback : cleanBoolean(value);
}

function normalizeClinicServices(value) {
  const source = Array.isArray(value) && value.length ? value : defaultClinicServices;
  const services = source.map((service = {}, index) => {
    const fallback = defaultClinicServices[index] || defaultClinicServices[0];
    const label = cleanString(service.label) || fallback.label;
    const durationMinutes = cleanOptionalInteger(service.durationMinutes);

    return {
      id: scheduleTypeId(service.id, label, "clinic-service", index),
      label,
      appointmentType: cleanString(service.appointmentType) || fallback.appointmentType,
      durationMinutes: durationMinutes > 0 ? durationMinutes : fallback.durationMinutes,
      defaultLanguage: cleanString(service.defaultLanguage) || fallback.defaultLanguage || "English",
      staffMember: cleanString(service.staffMember) || fallback.staffMember || "",
      active: booleanWithDefault(service.active, true),
      publiclyBookable: booleanWithDefault(service.publiclyBookable, true)
    };
  }).filter((service) => service.label);

  return services.length ? services : defaultClinicServices.map((service) => ({ ...service }));
}

function normalizeKitchenClassTypes(value) {
  const source = Array.isArray(value) && value.length ? value : defaultKitchenClassTypes;
  const classTypes = source.map((classType = {}, index) => {
    const fallback = defaultKitchenClassTypes[index] || defaultKitchenClassTypes[0];
    const label = normalizeKitchenClassLabel(classType.label) || fallback.label;
    const durationMinutes = cleanOptionalInteger(classType.durationMinutes);
    const capacity = cleanOptionalInteger(classType.capacity);

    return {
      id: scheduleTypeId(classType.id, label, "kitchen-class", index),
      label,
      durationMinutes: durationMinutes > 0 ? durationMinutes : fallback.durationMinutes,
      capacity: capacity > 0 ? capacity : fallback.capacity,
      active: booleanWithDefault(classType.active, true),
      publiclyBookable: booleanWithDefault(classType.publiclyBookable, true)
    };
  }).filter((classType) => classType.label);

  return classTypes.length ? classTypes : defaultKitchenClassTypes.map((classType) => ({ ...classType }));
}

function normalizeKitchenClassLabel(value) {
  return cleanString(value).replace(/^Kids Nutrition & Cooking Class\b/i, "Kids Cooking + Nutrition Class");
}

function normalizeKitchenSettings(raw = {}, scheduling = defaultSchedulingSettings) {
  const startTime = normalizeSchedulingTime(raw.startTime, scheduling.bookableStartTime || defaultKitchenSettings.startTime);
  let endTime = normalizeSchedulingTime(raw.endTime, scheduling.bookableEndTime || defaultKitchenSettings.endTime);
  if (appointmentTimeMinutes(endTime) <= appointmentTimeMinutes(startTime)) {
    endTime = scheduling.bookableEndTime || defaultKitchenSettings.endTime;
  }
  const capacity = cleanOptionalInteger(raw.defaultCapacity);

  return {
    startTime,
    endTime,
    weekdays: normalizeSchedulingWeekdays(raw.weekdays || scheduling.weekdays),
    defaultCapacity: capacity > 0 ? capacity : defaultKitchenSettings.defaultCapacity,
    waitlistEnabled: booleanWithDefault(raw.waitlistEnabled, defaultKitchenSettings.waitlistEnabled),
    registrationMode: cleanString(raw.registrationMode) || defaultKitchenSettings.registrationMode,
    location: normalizeMailingAddress(raw.location) || defaultKitchenSettings.location
  };
}

function normalizeSchedulingSettings(raw = {}) {
  const officeStartTime = normalizeSchedulingTime(raw.officeStartTime, defaultSchedulingSettings.officeStartTime);
  let officeEndTime = normalizeSchedulingTime(raw.officeEndTime, defaultSchedulingSettings.officeEndTime);
  let bookableStartTime = normalizeSchedulingTime(raw.bookableStartTime, defaultSchedulingSettings.bookableStartTime);
  let bookableEndTime = normalizeSchedulingTime(raw.bookableEndTime, defaultSchedulingSettings.bookableEndTime);
  const officeStartMinutes = appointmentTimeMinutes(officeStartTime);
  let officeEndMinutes = appointmentTimeMinutes(officeEndTime);
  let bookableStartMinutes = appointmentTimeMinutes(bookableStartTime);
  let bookableEndMinutes = appointmentTimeMinutes(bookableEndTime);

  if (officeEndMinutes <= officeStartMinutes) {
    officeEndTime = defaultSchedulingSettings.officeEndTime;
    officeEndMinutes = appointmentTimeMinutes(officeEndTime);
  }

  if (bookableStartMinutes < officeStartMinutes || bookableStartMinutes >= officeEndMinutes) {
    bookableStartTime = defaultSchedulingSettings.bookableStartTime;
    bookableStartMinutes = appointmentTimeMinutes(bookableStartTime);
  }

  if (bookableEndMinutes > officeEndMinutes || bookableEndMinutes <= bookableStartMinutes) {
    bookableEndTime = defaultSchedulingSettings.bookableEndTime;
    bookableEndMinutes = appointmentTimeMinutes(bookableEndTime);
  }

  const slotIntervalMinutes = cleanOptionalInteger(raw.slotIntervalMinutes, defaultSchedulingSettings.slotIntervalMinutes);
  const defaultDuration = cleanOptionalInteger(raw.defaultDurationMinutes, defaultSchedulingSettings.defaultDurationMinutes);

  const baseSettings = {
    officeStartTime,
    officeEndTime,
    bookableStartTime,
    bookableEndTime,
    clinicLocation: normalizeMailingAddress(raw.clinicLocation) || defaultSchedulingSettings.clinicLocation,
    weekdays: normalizeSchedulingWeekdays(raw.weekdays),
    defaultDurationMinutes: defaultDuration > 0 ? defaultDuration : defaultSchedulingSettings.defaultDurationMinutes,
    slotIntervalMinutes: [5, 10, 15, 30].includes(slotIntervalMinutes) ? slotIntervalMinutes : defaultSchedulingSettings.slotIntervalMinutes,
    officeStartMinutes,
    officeEndMinutes,
    bookableStartMinutes,
    bookableEndMinutes
  };

  return {
    ...baseSettings,
    clinicServices: normalizeClinicServices(raw.clinicServices),
    kitchenClassTypes: normalizeKitchenClassTypes(raw.kitchenClassTypes),
    kitchen: normalizeKitchenSettings(raw.kitchen || raw.kitchenSettings || {}, baseSettings)
  };
}

const defaultSchedulingSettingsNormalized = normalizeSchedulingSettings(defaultSchedulingSettings);

function serializeSchedulingSettings(settings = defaultSchedulingSettingsNormalized) {
  return {
    officeStartTime: settings.officeStartTime,
    officeEndTime: settings.officeEndTime,
    bookableStartTime: settings.bookableStartTime,
    bookableEndTime: settings.bookableEndTime,
    clinicLocation: settings.clinicLocation,
    weekdays: settings.weekdays,
    defaultDurationMinutes: settings.defaultDurationMinutes,
    slotIntervalMinutes: settings.slotIntervalMinutes,
    clinicServices: normalizeClinicServices(settings.clinicServices),
    kitchenClassTypes: normalizeKitchenClassTypes(settings.kitchenClassTypes),
    kitchen: normalizeKitchenSettings(settings.kitchen, settings),
    officeStartLabel: formatAppointmentTimeValue(settings.officeStartTime),
    officeEndLabel: formatAppointmentTimeValue(settings.officeEndTime),
    bookableStartLabel: formatAppointmentTimeValue(settings.bookableStartTime),
    bookableEndLabel: formatAppointmentTimeValue(settings.bookableEndTime)
  };
}

function toSchedulingSettings(snapshot) {
  return normalizeSchedulingSettings(snapshot.exists ? snapshot.data() || {} : {});
}

function cleanSchedulingSettingsPayload(body = {}) {
  return serializeSchedulingSettings(normalizeSchedulingSettings(body));
}

async function loadSchedulingSettings() {
  const snapshot = await adminSettings.doc("scheduling").get();
  return toSchedulingSettings(snapshot);
}

function appointmentClientCountFromRecord(appointment) {
  if (Array.isArray(appointment.clientIds) && appointment.clientIds.length) {
    return appointment.clientIds.filter(Boolean).length;
  }

  if (Array.isArray(appointment.clientNames) && appointment.clientNames.length) {
    return appointment.clientNames.filter(Boolean).length;
  }

  return appointment.clientId || appointment.clientName ? 1 : 0;
}

function appointmentDurationMinutesFromRecord(appointment) {
  const explicitDuration = Number(appointment.durationMinutes);

  if (Number.isInteger(explicitDuration) && explicitDuration > 0) {
    return explicitDuration;
  }

  return appointmentClientCountFromRecord(appointment) >= 3 ? 45 : defaultAppointmentDurationMinutes;
}

function appointmentBlocksSchedule(appointment) {
  return ["Scheduled", "Completed", "Blocked"].includes(appointment.status || "Scheduled");
}

function appointmentFitsSchedulingWindow(appointment, settings = defaultSchedulingSettingsNormalized) {
  const start = appointmentTimeMinutes(appointment.appointmentTime);

  if (start === null) {
    return false;
  }

  return start >= settings.bookableStartMinutes && start + appointmentDurationMinutesFromRecord(appointment) <= settings.bookableEndMinutes;
}

function schedulingWindowEndLabel(settings = defaultSchedulingSettingsNormalized) {
  return formatAppointmentTimeValue(settings.bookableEndTime);
}

function schedulingWindowError(appointment, settings = defaultSchedulingSettingsNormalized) {
  if (appointmentTimeMinutes(appointment.appointmentTime) === null) {
    return "Choose a valid appointment time.";
  }

  return `This appointment is ${appointmentDurationMinutesFromRecord(appointment)} min. Choose a start time that ends by ${schedulingWindowEndLabel(settings)}.`;
}

function appointmentRangesOverlap(first, second) {
  const firstStart = appointmentTimeMinutes(first.appointmentTime);
  const secondStart = appointmentTimeMinutes(second.appointmentTime);

  if (firstStart === null || secondStart === null) {
    return false;
  }

  const firstEnd = firstStart + appointmentDurationMinutesFromRecord(first);
  const secondEnd = secondStart + appointmentDurationMinutesFromRecord(second);
  return firstStart < secondEnd && firstEnd > secondStart;
}

async function findAppointmentConflict(payload, excludedAppointmentId = "") {
  if (!appointmentBlocksSchedule(payload) || !payload.appointmentDate || !payload.appointmentTime) {
    return null;
  }

  const snapshot = await appointments.where("appointmentDate", "==", payload.appointmentDate).get();

  for (const doc of snapshot.docs) {
    if (doc.id === excludedAppointmentId) {
      continue;
    }

    const appointment = toAppointment(doc);

    if (!appointmentBlocksSchedule(appointment)) {
      continue;
    }

    if (appointmentRangesOverlap(payload, appointment)) {
      return appointment;
    }
  }

  return null;
}

function cleanTaskPayload(body) {
  return {
    title: cleanString(body.title),
    type: normalizeTaskType(body.type),
    status: normalizeTaskStatus(body.status),
    priority: normalizeTaskPriority(body.priority),
    dueDate: cleanString(body.dueDate),
    dueTime: cleanString(body.dueTime),
    assignedTo: cleanString(body.assignedTo),
    clientId: cleanString(body.clientId),
    clientName: cleanString(body.clientName),
    appointmentId: cleanString(body.appointmentId),
    referralId: cleanString(body.referralId),
    outreachEventId: cleanString(body.outreachEventId),
    outreachEventName: cleanString(body.outreachEventName),
    source: cleanString(body.source) || "Manual",
    notes: cleanString(body.notes)
  };
}

function isActiveTaskStatus(status) {
  return ["Open", "In Progress", "Waiting"].includes(status || "Open");
}

function isGeneratedTaskSource(source) {
  return ["Start the Day", "Workflow Automation", "Polish Queue"].includes(source || "");
}

function normalizedTaskTitle(value) {
  return cleanString(value).replace(/\s+/g, " ").toLowerCase();
}

function startDayTaskIntent(title) {
  const normalized = normalizedTaskTitle(title);

  if (normalized.includes("reschedule")) {
    return "reschedule";
  }

  if (normalized.includes("schedule") || normalized.includes("new referral")) {
    return "schedule";
  }

  if (normalized.startsWith("prep ")) {
    return "prep";
  }

  if (normalized.includes("update outcome")) {
    return "outcome";
  }

  return normalized.split(" ")[0] || "task";
}

function startDayTaskSubject(title) {
  return normalizedTaskTitle(title)
    .replace(/^(call|text)\s+new referral\s+/, "")
    .replace(/^(call|text)\s+/, "")
    .replace(/^(schedule|reschedule|prep)\s+/, "")
    .replace(/^update outcome for\s+/, "")
    .replace(/\s+appointment$/, "")
    .trim();
}

function tasksMatchStartDayIntent(existingTask, payload) {
  const payloadTitle = normalizedTaskTitle(payload.title);
  const taskTitle = normalizedTaskTitle(existingTask.title);

  if (payloadTitle === taskTitle) {
    return true;
  }

  const payloadIntent = startDayTaskIntent(payloadTitle);
  const taskIntent = startDayTaskIntent(taskTitle);

  if (payload.appointmentId && existingTask.appointmentId === payload.appointmentId) {
    return payloadIntent === taskIntent;
  }

  if (payload.clientId && existingTask.clientId === payload.clientId) {
    const schedulingIntents = new Set(["schedule", "reschedule"]);
    return schedulingIntents.has(payloadIntent)
      ? schedulingIntents.has(taskIntent)
      : payloadIntent === taskIntent;
  }

  if (payload.referralId && existingTask.referralId === payload.referralId) {
    return payloadIntent === "schedule" ? taskIntent === "schedule" : payloadIntent === taskIntent;
  }

  const payloadSubject = startDayTaskSubject(payloadTitle);
  const taskSubject = startDayTaskSubject(taskTitle);
  return Boolean(payloadSubject && taskSubject === payloadSubject && payloadIntent === taskIntent);
}

function matchingGeneratedTaskDocument(taskDocuments, payload) {
  for (const doc of taskDocuments) {
    const task = toTask(doc);
    const sameDayGeneratedTask = isGeneratedTaskSource(task.source) && task.dueDate === payload.dueDate;

    if (!isActiveTaskStatus(task.status) && !sameDayGeneratedTask) {
      continue;
    }

    if (tasksMatchStartDayIntent(task, payload)) {
      return doc;
    }
  }

  return null;
}

async function findExistingStartDayTask(payload) {
  if (!isGeneratedTaskSource(payload.source)) {
    return null;
  }

  const taskDocuments = await fetchAllDocuments(tasks.orderBy("createdAt", "desc"));
  return matchingGeneratedTaskDocument(taskDocuments, payload);
}

async function createGeneratedTaskIfMissing(body, userEmail, now = new Date().toISOString(), taskDocuments = null) {
  const requestedSource = cleanString(body.source);
  const payload = cleanTaskPayload({
    ...body,
    source: isGeneratedTaskSource(requestedSource) ? requestedSource : "Workflow Automation"
  });

  if (!payload.title) {
    throw new Error("Generated tasks require a title.");
  }

  const documents = Array.isArray(taskDocuments)
    ? taskDocuments
    : await fetchAllDocuments(tasks.orderBy("createdAt", "desc"));
  const existing = matchingGeneratedTaskDocument(documents, payload);

  if (existing) {
    return { task: toTask(existing), created: false };
  }

  const docRef = await tasks.add({
    ...payload,
    completedAt: "",
    createdAt: now,
    updatedAt: now,
    createdBy: userEmail
  });
  const snapshot = await docRef.get();
  if (Array.isArray(taskDocuments)) {
    taskDocuments.unshift(snapshot);
  }
  return { task: toTask(snapshot), created: true };
}

function cleanActivityLogPayload(body) {
  const type = normalizeActivityType(body.type);
  const direction = normalizeActivityDirection(body.direction);
  const relatedType = cleanString(body.relatedType) === "referral" ? "referral" : "client";
  const activityDate = cleanString(body.activityDate);
  const activityTime = normalizeAppointmentTimeValue(body.activityTime);
  const relatedName = cleanString(body.relatedName);
  const title = cleanString(body.title) || `${direction} ${type} to ${relatedName || "profile"}`;
  const occurredAtDate = activityDate ? new Date(`${activityDate}T${activityTime || "00:00"}:00`) : null;

  return {
    type,
    direction,
    title,
    result: cleanString(body.result),
    description: cleanString(body.description),
    activityDate,
    activityTime,
    occurredAt: occurredAtDate && !Number.isNaN(occurredAtDate.getTime()) ? occurredAtDate.toISOString() : "",
    relatedType,
    relatedId: cleanString(body.relatedId),
    relatedName
  };
}

function appointmentShouldCompleteRescheduleTasks(appointment) {
  return (appointment.status || "Scheduled") === "Scheduled";
}

async function completeRescheduleTasksForAppointment(appointment, userEmail, now = new Date().toISOString()) {
  if (!appointmentShouldCompleteRescheduleTasks(appointment)) {
    return 0;
  }

  const clientIds = [...new Set(Array.isArray(appointment.clientIds) ? appointment.clientIds : [])].filter(Boolean);

  if (!clientIds.length) {
    return 0;
  }

  let completedCount = 0;

  for (let index = 0; index < clientIds.length; index += 10) {
    const batchClientIds = clientIds.slice(index, index + 10);
    const snapshot = await tasks.where("clientId", "in", batchClientIds).get();
    const batch = firestore.batch();
    let batchUpdates = 0;

    for (const doc of snapshot.docs) {
      const task = toTask(doc);
      const isActive = !["Done", "Canceled"].includes(task.status || "Open");
      const isRescheduleTask = ["schedule", "reschedule"].includes(startDayTaskIntent(task.title));

      if (!isActive || !isRescheduleTask) {
        continue;
      }

      batch.update(doc.ref, {
        status: "Done",
        completedAt: task.completedAt || now,
        updatedAt: now,
        updatedBy: userEmail,
        completionSource: "Appointment scheduled"
      });
      batchUpdates += 1;
    }

    if (batchUpdates) {
      await batch.commit();
      completedCount += batchUpdates;
    }
  }

  return completedCount;
}

async function completeOutcomeTasksForAppointment(appointment, userEmail, now = new Date().toISOString()) {
  const appointmentId = cleanString(appointment?.id);
  if (!appointmentId || (appointment?.status || "Scheduled") === "Scheduled") {
    return 0;
  }

  const snapshot = await tasks.where("appointmentId", "==", appointmentId).get();
  const batch = firestore.batch();
  let completedCount = 0;

  for (const doc of snapshot.docs) {
    const task = toTask(doc);
    if (!isActiveTaskStatus(task.status) || startDayTaskIntent(task.title) !== "outcome") {
      continue;
    }

    batch.update(doc.ref, {
      status: "Done",
      completedAt: task.completedAt || now,
      updatedAt: now,
      updatedBy: userEmail,
      completionSource: "Appointment outcome recorded"
    });
    completedCount += 1;
  }

  if (completedCount) {
    await batch.commit();
  }

  return completedCount;
}

function normalizedLookupKey(value) {
  return cleanString(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function validateRequiredPersonFields(payload, response) {
  if (!payload.firstName || !payload.lastName || !payload.parentName || !payload.phone || !payload.preferredLanguage) {
    response.status(400).json({
      error: "Name, caregiver name, phone, and preferred language are required."
    });
    return false;
  }

  return true;
}

function hasRequiredPersonFields(payload) {
  return Boolean(payload.firstName && payload.lastName && payload.parentName && payload.phone && payload.preferredLanguage);
}

function cleanSiblingZohoRecordIds(row = {}) {
  return Array.isArray(row.siblingZohoRecordIds)
    ? row.siblingZohoRecordIds.map(cleanString).filter(Boolean)
    : [];
}

function siblingIdsForImportedRecord(record, recordsByZohoId, allRecords = []) {
  const directSiblingIds = cleanSiblingZohoRecordIds(record.row)
    .map((zohoRecordId) => recordsByZohoId.get(zohoRecordId)?.docRef.id)
    .filter(Boolean);
  const reciprocalSiblingIds = record.zohoRecordId
    ? allRecords
      .filter((otherRecord) => otherRecord !== record && cleanSiblingZohoRecordIds(otherRecord.row).includes(record.zohoRecordId))
      .map((otherRecord) => otherRecord.docRef.id)
    : [];

  return [...new Set([...directSiblingIds, ...reciprocalSiblingIds])];
}

function todayDateString(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: publicBookingTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function parseDateOnly(value) {
  const raw = cleanString(value);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return null;
  }

  const date = new Date(`${raw}T00:00:00Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== raw) {
    return null;
  }

  return date;
}

function addDaysToDateString(value, days) {
  const date = parseDateOnly(value);

  if (!date) {
    return "";
  }

  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetweenDateStrings(startDate, endDate) {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!start || !end) {
    return null;
  }

  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function isPublicBookableDate(dateString, settings = defaultSchedulingSettingsNormalized) {
  const date = parseDateOnly(dateString);

  if (!date) {
    return false;
  }

  return new Set(settings.weekdays).has(date.getUTCDay());
}

function isPublicBookingDateInRange(dateString, now = new Date()) {
  const today = todayDateString(now);
  const daysAhead = daysBetweenDateStrings(today, dateString);
  return daysAhead !== null && daysAhead >= 0 && daysAhead <= publicBookingMaxAdvanceDays;
}

function timeZoneOffsetMilliseconds(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const localTimeAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return localTimeAsUtc - date.getTime();
}

function publicAppointmentDateTime(dateString, appointmentTime) {
  const date = parseDateOnly(dateString);
  const normalizedTime = normalizeAppointmentTimeValue(appointmentTime);

  if (!date || !normalizedTime) {
    return null;
  }

  const [hours, minutes] = normalizedTime.split(":").map(Number);
  const localTimeAsUtc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hours, minutes);
  let appointment = new Date(localTimeAsUtc);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const offset = timeZoneOffsetMilliseconds(appointment, publicBookingTimeZone);
    appointment = new Date(localTimeAsUtc - offset);
  }

  return appointment;
}

function googleCalendarSafeClientName(value) {
  const parts = cleanString(value).split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
  return lastName ? `${firstName} ${lastName.charAt(0).toUpperCase()}.` : firstName;
}

function googleCalendarDateTime(dateString, totalMinutes) {
  if (!parseDateOnly(dateString) || !Number.isFinite(totalMinutes)) return "";
  const dayOffset = Math.floor(totalMinutes / 1440);
  const minuteOfDay = ((totalMinutes % 1440) + 1440) % 1440;
  const resolvedDate = addDaysToDateString(dateString, dayOffset);
  const hours = Math.floor(minuteOfDay / 60);
  const minutes = minuteOfDay % 60;
  return `${resolvedDate}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

function googleCalendarEventForAppointment(appointment = {}) {
  const startMinutes = appointmentTimeMinutes(appointment.appointmentTime);
  if (!appointment.id || !appointment.appointmentDate || startMinutes === null) {
    throw new Error("The appointment needs an ID, date, and time before it can be added to Google Calendar.");
  }

  const clientNames = Array.isArray(appointment.clientNames) && appointment.clientNames.length
    ? appointment.clientNames
    : appointment.clientName
      ? [appointment.clientName]
      : [];
  const privateNames = clientNames.map(googleCalendarSafeClientName).filter(Boolean);
  const appointmentType = cleanString(appointment.appointmentType) || "Clinic Appointment";
  const durationMinutes = appointmentDurationMinutesFromRecord(appointment);
  const description = [
    cleanString(appointment.staffMember) ? `Assigned staff: ${cleanString(appointment.staffMember)}` : "",
    `${staffAppUrl}/schedule.html?appointment=${encodeURIComponent(appointment.id)}&date=${encodeURIComponent(appointment.appointmentDate)}`
  ].filter(Boolean).join("\n");

  return {
    summary: `${privateNames.join(" + ") || "Clinic appointment"} | ${appointmentType}`,
    description,
    ...(cleanString(appointment.location) ? { location: cleanString(appointment.location) } : {}),
    start: {
      dateTime: googleCalendarDateTime(appointment.appointmentDate, startMinutes),
      timeZone: googleCalendarTimeZone
    },
    end: {
      dateTime: googleCalendarDateTime(appointment.appointmentDate, startMinutes + durationMinutes),
      timeZone: googleCalendarTimeZone
    },
    extendedProperties: {
      private: {
        snackRecordType: "clinicAppointment",
        snackRecordId: appointment.id
      }
    }
  };
}

async function googleCalendarAccessToken() {
  if (!googleCalendarAuth) {
    googleCalendarAuth = new GoogleAuth({ scopes: googleCalendarScopes });
  }
  const client = await googleCalendarAuth.getClient();
  const result = await client.getAccessToken();
  const token = typeof result === "string" ? result : result?.token;
  if (!token) throw new Error("Google Calendar authorization is unavailable.");
  return token;
}

async function googleCalendarApiRequest(path, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const accessToken = options.accessToken || await googleCalendarAccessToken();
  const response = await fetchImpl(`https://www.googleapis.com/calendar/v3${path}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {})
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {})
  });
  const responseText = await response.text();
  let payload = null;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = null;
    }
  }
  if (!response.ok) {
    const error = new Error(payload?.error?.message || `Google Calendar returned ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function syncClinicAppointmentCalendar(appointment = {}, options = {}) {
  const enabled = options.enabled ?? googleCalendarEnabled;
  const configuredCalendarId = cleanString(options.calendarId ?? googleCalendarId);
  if (!configuredCalendarId) return { state: "inactive", eventId: cleanString(appointment.googleEventId) };
  if (!enabled) return { state: "paused", eventId: cleanString(appointment.googleEventId) };

  const existingEventId = cleanString(appointment.googleEventId);
  const targetCalendarId = existingEventId
    ? cleanString(appointment.googleCalendarId) || configuredCalendarId
    : configuredCalendarId;
  const calendarPath = `/calendars/${encodeURIComponent(targetCalendarId)}/events`;
  const removed = ["Canceled", "Rescheduled"].includes(appointment.status);

  if (removed) {
    if (existingEventId) {
      try {
        await googleCalendarApiRequest(`${calendarPath}/${encodeURIComponent(existingEventId)}`, {
          ...options,
          method: "DELETE"
        });
      } catch (error) {
        if (![404, 410].includes(error.status)) throw error;
      }
    }
    return { state: "removed", calendarId: targetCalendarId, eventId: "" };
  }

  const event = googleCalendarEventForAppointment(appointment);
  if (existingEventId) {
    try {
      const updated = await googleCalendarApiRequest(`${calendarPath}/${encodeURIComponent(existingEventId)}`, {
        ...options,
        method: "PATCH",
        body: event
      });
      return { state: "synced", calendarId: targetCalendarId, eventId: updated?.id || existingEventId };
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }

  const created = await googleCalendarApiRequest(calendarPath, {
    ...options,
    method: "POST",
    body: event
  });
  if (!created?.id) throw new Error("Google Calendar did not return an event ID.");
  return { state: "synced", calendarId: configuredCalendarId, eventId: created.id };
}

async function persistClinicAppointmentCalendarSync(docRef, appointment = {}, actor = "", options = {}) {
  try {
    const result = await syncClinicAppointmentCalendar(appointment, options);
    if (["inactive", "paused"].includes(result.state)) return result;
    const now = new Date().toISOString();
    await docRef.set({
      googleCalendarId: result.calendarId || googleCalendarId,
      googleEventId: result.eventId || "",
      googleCalendarSyncStatus: result.state === "removed" ? "Removed" : "Synced",
      googleCalendarSyncError: "",
      googleCalendarSyncedAt: now,
      ...(cleanString(actor) ? { updatedBy: cleanString(actor) } : {})
    }, { merge: true });
    return result;
  } catch (error) {
    const message = cleanString(error?.message).slice(0, 300) || "Google Calendar synchronization failed.";
    await docRef.set({
      googleCalendarSyncStatus: "Error",
      googleCalendarSyncError: message,
      googleCalendarSyncedAt: new Date().toISOString()
    }, { merge: true });
    return { state: "error", eventId: cleanString(appointment.googleEventId), error: message };
  }
}

async function googleCalendarConnectionStatus(options = {}) {
  const enabled = options.enabled ?? googleCalendarEnabled;
  const calendarId = cleanString(options.calendarId ?? googleCalendarId);
  if (!calendarId) return { configured: false, enabled: false, connected: false };
  if (!enabled) return { configured: true, enabled: false, connected: false };

  const calendar = await googleCalendarApiRequest(`/calendars/${encodeURIComponent(calendarId)}`, options);
  return {
    configured: true,
    enabled: true,
    connected: true,
    calendarName: cleanString(calendar?.summary) || "Clinic Appts",
    accessRole: cleanString(calendar?.accessRole)
  };
}

async function verifyGoogleCalendarLifecycle(options = {}) {
  const calendarId = cleanString(options.calendarId ?? googleCalendarId);
  if (!calendarId) throw new Error("Clinic Google Calendar has not been configured.");

  const lifecycleOptions = { ...options, calendarId, enabled: true };
  const connection = await googleCalendarConnectionStatus(lifecycleOptions);
  const testDate = cleanString(options.testDate) || addDaysToDateString(todayDateString(), 7);
  const appointment = {
    id: `qa-calendar-test-${Date.now()}`,
    appointmentDate: testDate,
    appointmentTime: "09:00",
    durationMinutes: 15,
    appointmentType: "Calendar Connection Test",
    staffMember: "SNACK system check",
    status: "Scheduled"
  };
  let eventId = "";

  try {
    const created = await syncClinicAppointmentCalendar(appointment, lifecycleOptions);
    eventId = cleanString(created.eventId);
    const updated = await syncClinicAppointmentCalendar({
      ...appointment,
      googleCalendarId: calendarId,
      googleEventId: eventId,
      appointmentTime: "09:15"
    }, lifecycleOptions);
    eventId = cleanString(updated.eventId) || eventId;
    const removed = await syncClinicAppointmentCalendar({
      ...appointment,
      googleCalendarId: calendarId,
      googleEventId: eventId,
      status: "Canceled"
    }, lifecycleOptions);
    eventId = "";

    return {
      connected: true,
      calendarName: connection.calendarName,
      accessRole: connection.accessRole,
      synchronizationEnabled: googleCalendarEnabled,
      lifecycle: {
        created: created.state === "synced",
        updated: updated.state === "synced",
        removed: removed.state === "removed"
      },
      testedAt: new Date().toISOString()
    };
  } catch (error) {
    if (eventId) {
      try {
        await syncClinicAppointmentCalendar({
          ...appointment,
          googleCalendarId: calendarId,
          googleEventId: eventId,
          status: "Canceled"
        }, lifecycleOptions);
      } catch (cleanupError) {
        error.message = `${cleanString(error.message)} Test-event cleanup also failed: ${cleanString(cleanupError?.message)}`.trim();
      }
    }
    throw error;
  }
}

function isPublicAppointmentAtLeastHoursAhead(
  dateString,
  appointmentTime,
  now = new Date(),
  minimumHours = publicBookingMinimumNoticeHours
) {
  const appointment = publicAppointmentDateTime(dateString, appointmentTime);

  return Boolean(appointment) && appointment.getTime() - now.getTime() >= minimumHours * 60 * 60 * 1000;
}

function publicBookingServiceFromId(serviceId, services = publicBookingServices) {
  const availableServices = normalizeClinicServices(services).filter((service) => service.active !== false);
  return availableServices.find((service) => service.id === cleanString(serviceId)) || availableServices[0] || publicBookingServices[0];
}

function publicBookingServiceFromAppointment(appointment = {}, services = publicBookingServices) {
  const availableServices = normalizeClinicServices(services);
  const byId = availableServices.find((service) => service.id === cleanString(appointment.publicBookingServiceId));

  if (byId) {
    return byId;
  }

  const byLabel = availableServices.find((service) => service.label.toLowerCase() === cleanString(appointment.publicBookingServiceLabel).toLowerCase());

  if (byLabel) {
    return byLabel;
  }

  return availableServices.find((service) => service.appointmentType === appointment.appointmentType) || availableServices[0] || publicBookingServices[0];
}

function createPublicManageToken() {
  return crypto.randomBytes(24).toString("hex");
}

function publicManageTokenHash(token) {
  return crypto.createHash("sha256").update(cleanString(token)).digest("hex");
}

function publicManageTokensMatch(token, storedHash) {
  if (!cleanString(token)) {
    return false;
  }

  const candidate = publicManageTokenHash(token);
  const stored = cleanString(storedHash);

  if (!/^[a-f0-9]{64}$/i.test(stored)) {
    return false;
  }

  const candidateBuffer = Buffer.from(candidate, "hex");
  const storedBuffer = Buffer.from(stored, "hex");

  return candidateBuffer.length === storedBuffer.length && crypto.timingSafeEqual(candidateBuffer, storedBuffer);
}

function publicManageTokenFromRequest(request) {
  return cleanString(request.query.token || request.body?.token);
}

function publicManageClientIdsFromAppointment(appointment = {}) {
  return [...new Set([
    ...(Array.isArray(appointment.clientIds) ? appointment.clientIds : []),
    appointment.clientId
  ].map(cleanString).filter(Boolean))];
}

async function existingPublicManageClientRefs(appointment = {}) {
  const refs = publicManageClientIdsFromAppointment(appointment).map((clientId) => clients.doc(clientId));
  const snapshots = await Promise.all(refs.map((ref) => ref.get()));

  return refs.filter((_ref, index) => snapshots[index].exists);
}

function publicAppointmentCanManage(appointment) {
  const daysAhead = daysBetweenDateStrings(todayDateString(), appointment.appointmentDate);
  return appointment?.status === "Scheduled" && daysAhead !== null && daysAhead >= 0;
}

function serializePublicManagedBooking(appointment) {
  const service = publicBookingServiceFromAppointment(appointment);
  const clientNames = Array.isArray(appointment.clientNames) && appointment.clientNames.length
    ? appointment.clientNames.filter(Boolean)
    : [appointment.clientName].filter(Boolean);

  return {
    id: appointment.id,
    clientName: clientNames.length > 1 ? clientNames.join(", ") : clientNames[0] || "",
    clientNames,
    serviceId: service.id,
    serviceLabel: appointment.publicBookingServiceLabel || service.label,
    appointmentDate: appointment.appointmentDate,
    appointmentTime: appointment.appointmentTime,
    appointmentTimeLabel: formatAppointmentTimeValue(appointment.appointmentTime),
    durationMinutes: appointment.durationMinutes || service.durationMinutes,
    location: appointment.location,
    status: appointment.status || "Scheduled",
    canCancel: publicAppointmentCanManage(appointment),
    canReschedule: publicAppointmentCanManage(appointment)
  };
}

async function loadPublicManagedAppointment(appointmentId, token) {
  const id = cleanString(appointmentId);

  if (!id || !token) {
    return null;
  }

  const snapshot = await appointments.doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  const appointment = toAppointment(snapshot);

  if (!publicManageTokensMatch(token, snapshot.data()?.publicManageTokenHash)) {
    return null;
  }

  return appointment;
}

function publicChildNameParts(childName) {
  const name = cleanString(childName);
  const parts = name.split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return {
      firstName: "",
      lastName: ""
    };
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: ""
    };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ")
  };
}

function rawPublicBookingChildren(body) {
  if (Array.isArray(body.children)) {
    return body.children;
  }

  if (typeof body.children === "string" && body.children.trim()) {
    try {
      const parsed = JSON.parse(body.children);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const childName = cleanString(body.childName || [body.firstName, body.lastName].filter(Boolean).join(" "));

  return childName ? [{
    childName,
    dateOfBirth: body.childDob || body.childDOB || body.dateOfBirth,
    gender: body.childGender || body.gender
  }] : [];
}

function cleanPublicBookingChildren(body) {
  return rawPublicBookingChildren(body)
    .map((child) => {
      const childName = cleanString(child.childName || child.name || [child.firstName, child.lastName].filter(Boolean).join(" "));
      const { firstName, lastName } = publicChildNameParts(childName);

      return {
        childName,
        firstName,
        lastName,
        dateOfBirth: cleanString(child.childDob || child.childDOB || child.dateOfBirth || child.dob),
        gender: cleanString(child.childGender || child.gender)
      };
    })
    .filter((child) => child.childName || child.firstName || child.lastName);
}

function publicAppointmentDraft({ service, appointmentDate, appointmentTime, clientName = "Public booking" }) {
  return {
    clientId: "public-booking-draft",
    clientIds: ["public-booking-draft"],
    clientName,
    clientNames: [clientName],
    appointmentDate,
    appointmentTime,
    appointmentType: service.appointmentType,
    durationMinutes: service.durationMinutes,
    status: "Scheduled"
  };
}

function publicSlotValuesForDate(
  dateString,
  service,
  existingAppointments = [],
  settings = defaultSchedulingSettingsNormalized,
  now = new Date()
) {
  if (!isPublicBookableDate(dateString, settings) || !isPublicBookingDateInRange(dateString, now)) {
    return [];
  }

  const slots = [];
  const latestStart = settings.bookableEndMinutes - service.durationMinutes;

  for (let minutes = settings.bookableStartMinutes; minutes <= latestStart; minutes += settings.slotIntervalMinutes) {
    const appointmentTime = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    const candidate = publicAppointmentDraft({ service, appointmentDate: dateString, appointmentTime });
    const conflict = existingAppointments.some(
      (appointment) => appointmentBlocksSchedule(appointment) && appointmentRangesOverlap(candidate, appointment)
    );

    if (!conflict && isPublicAppointmentAtLeastHoursAhead(dateString, appointmentTime, now)) {
      slots.push({
        value: appointmentTime,
        label: formatAppointmentTimeValue(appointmentTime)
      });
    }
  }

  return slots;
}

function publicSubmissionRateLimit(scope, maxAttempts, errorMessage) {
  return async function distributedPublicRateLimit(request, response, next) {
    const forwarded = cleanString(request.get("x-forwarded-for")).split(",")[0];
    const address = forwarded || cleanString(request.ip) || "unknown";
    const windowMs = 60 * 60 * 1000;
    const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
    const addressKey = crypto.createHash("sha256")
      .update(`${scope}:${new Date(windowStart).toISOString().slice(0, 10)}:${address}`)
      .digest("hex");
    const docRef = publicRateLimits.doc(`${scope}-${windowStart}-${addressKey}`);

    try {
      const allowed = await firestore.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(docRef);
        const count = snapshot.exists ? Number(snapshot.data()?.count || 0) : 0;
        if (count >= maxAttempts) return false;
        transaction.set(docRef, {
          scope,
          count: count + 1,
          windowStart: new Date(windowStart),
          expiresAt: new Date(windowStart + (2 * windowMs)),
          updatedAt: new Date().toISOString()
        }, { merge: true });
        return true;
      });
      if (!allowed) {
        response.status(429).json({ error: errorMessage });
        return;
      }
      next();
    } catch {
      response.status(503).json({
        error: "This form is temporarily unavailable. Please try again shortly."
      });
    }
  };
}

const publicBookingRateLimit = publicSubmissionRateLimit(
  "booking",
  12,
  "Too many booking attempts. Please try again later or call us at (971) 202-0232."
);

function cleanPublicFamilyPayload(body = {}, defaultLanguage = "English") {
  const children = cleanPublicBookingChildren(body);
  const parentName = cleanString(body.parentName || body.caregiverName);
  const preferredLanguage = cleanString(body.preferredLanguage) || defaultLanguage || "English";
  const phone = cleanString(body.mobilePhone || body.phone);
  const email = cleanString(body.email);
  const yccoMember = cleanBoolean(body.yccoMember || body.ycco);
  const legacyReminderConsent = cleanBoolean(body.consentReminders || body.reminderConsent || body.consentToReminders);
  const serviceEmailConsent = Object.hasOwn(body, "serviceEmailConsent")
    ? cleanBoolean(body.serviceEmailConsent)
    : legacyReminderConsent;
  const serviceTextConsent = Object.hasOwn(body, "serviceTextConsent")
    ? cleanBoolean(body.serviceTextConsent)
    : legacyReminderConsent;
  const marketingConsent = cleanBoolean(body.marketingConsent);

  return {
    children,
    firstName: children[0]?.firstName || "",
    lastName: children[0]?.lastName || "",
    parentName,
    phone,
    email,
    address: normalizeMailingAddress(body.address || body.addressStreet),
    preferredLanguage,
    preferredContactMethod: cleanString(body.preferredContactMethod),
    yccoMember,
    yccoId: yccoMember ? cleanString(body.yccoId || body.yccoID || body.memberId) : "",
    consentReminders: serviceEmailConsent || serviceTextConsent,
    serviceEmailConsent,
    serviceTextConsent,
    marketingConsent,
    notes: cleanString(body.notes),
    foodRestrictions: cleanString(body.foodRestrictions),
    spamTrap: cleanString(body.website || body.company || body.url || body.contactMe)
  };
}

function cleanPublicBookingPayload(body, services = publicBookingServices) {
  const service = publicBookingServiceFromId(body.serviceId, services);

  return {
    service,
    ...cleanPublicFamilyPayload(body, service.defaultLanguage),
    appointmentDate: cleanString(body.appointmentDate),
    appointmentTime: normalizeAppointmentTimeValue(body.appointmentTime)
  };
}

function cleanPublicClassRegistrationPayload(body = {}) {
  return {
    ...cleanPublicFamilyPayload(body, "English"),
    sessionId: cleanString(body.sessionId)
  };
}

function publicFamilyValidationError(payload) {
  if (payload.spamTrap || payload.website || payload.company || payload.url || payload.contactMe) {
    return "Could not submit this booking request. Please call or text (971) 202-0232.";
  }

  if (!payload.children.length || !payload.children.every((child) => child.childName && child.dateOfBirth && child.gender)) {
    return "Child name, date of birth, and gender are required for each child.";
  }

  if (!payload.parentName || !payload.phone || !payload.email || !payload.address || !payload.preferredLanguage || !payload.preferredContactMethod) {
    return "Caregiver name, mobile phone, email, address, language, and contact method are required.";
  }

  if (!payload.serviceEmailConsent && !payload.serviceTextConsent) {
    return "Choose email reminders, text reminders, or both.";
  }

  for (const [field, maxLength] of Object.entries(publicBookingMaxLengths)) {
    if (cleanString(payload[field]).length > maxLength) {
      return "Please shorten the booking details and try again.";
    }
  }

  for (const child of payload.children) {
    for (const field of ["childName", "dateOfBirth", "gender"]) {
      if (cleanString(child[field]).length > publicBookingMaxLengths[field]) {
        return "Please shorten the booking details and try again.";
      }
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "Enter a valid email address.";
  }

  return "";
}

function publicBookingValidationError(payload, settings = defaultSchedulingSettingsNormalized, now = new Date()) {
  const familyError = publicFamilyValidationError(payload);

  if (familyError) {
    return familyError;
  }

  if (!parseDateOnly(payload.appointmentDate) || !payload.appointmentTime) {
    return "Choose an appointment date and time.";
  }

  if (!isPublicBookableDate(payload.appointmentDate, settings) || !isPublicBookingDateInRange(payload.appointmentDate, now)) {
    return "Choose an available appointment date.";
  }

  if (!isPublicAppointmentAtLeastHoursAhead(payload.appointmentDate, payload.appointmentTime, now)) {
    return "Appointments must be booked at least 24 hours in advance.";
  }

  return "";
}

function publicClassRegistrationValidationError(
  payload,
  session,
  settings = defaultSchedulingSettingsNormalized,
  now = new Date()
) {
  const familyError = publicFamilyValidationError(payload);

  if (familyError) {
    return familyError;
  }

  if (!payload.sessionId || payload.sessionId !== cleanString(session?.id)) {
    return "Choose an available cooking class.";
  }

  if (!publicKitchenSessionAvailability(session, [], settings, now)) {
    return "This cooking class is no longer available for online registration.";
  }

  return "";
}

function validatePublicBookingPayload(payload, response, settings = defaultSchedulingSettingsNormalized) {
  const error = publicBookingValidationError(payload, settings);

  if (error) {
    response.status(400).json({
      error
    });
    return false;
  }

  return true;
}

function validatePublicClassRegistrationPayload(payload, response, session, settings = defaultSchedulingSettingsNormalized) {
  const error = publicClassRegistrationValidationError(payload, session, settings);

  if (error) {
    response.status(400).json({ error });
    return false;
  }

  return true;
}

export {
  activityLogs,
  appendSecurityAudit,
  addDaysToDateString,
  adminDataCollections,
  adminSettings,
  adminEmails,
  applicationDataCollections,
  applicationDataCollectionNames,
  allowedActivityDirections,
  allowedActivityTypes,
  allowedAppointmentGoalResults,
  allowedAppointmentPrepKeys,
  allowedAppointmentStatuses,
  allowedPrograms,
  allowedMarketingCommunicationPreferences,
  allowedMarketingSubscriberStatuses,
  allowedPerformanceCalculationModes,
  allowedPerformanceDirections,
  allowedPerformanceEvaluationRecordStatuses,
  allowedPerformanceEvaluationResponseStatuses,
  allowedPerformanceFrequencies,
  allowedPerformanceTrackingTiers,
  allowedHrsnCoveredPopulations,
  allowedHrsnDescriptions,
  allowedHrsnOutcomes,
  allowedProgramRegistrationStatuses,
  allowedProgramSessionStatuses,
  allowedClientStatuses,
  allowedEmailDomain,
  allowedReferralStatuses,
  allowedReferralTypes,
  allowedTaskPriorities,
  allowedTaskStatuses,
  allowedTaskTypes,
  appointmentBlocksSchedule,
  appointmentClientCountFromRecord,
  appointmentDurationMinutesFromRecord,
  appointmentFitsSchedulingWindow,
  appointmentLessonKeywords,
  appointmentRangesOverlap,
  appointments,
  budgetCategories,
  appointmentShouldCompleteRescheduleTasks,
  appointmentTimeMinutes,
  cleanActivityLogPayload,
  cleanAppointmentParticipantGoals,
  cleanAppointmentPrepChecklist,
  cleanAppointmentPayload,
  cleanBoolean,
  cleanGrantCopyBlock,
  cleanGrantCopyBlocks,
  cleanGrantDocumentLink,
  cleanGrantDocumentLinks,
  cleanGrantOrganizationInfoPayload,
  cleanGrantPayload,
  cleanGrantQuestionPayload,
  cleanBudgetCategoryPayload,
  cleanFundraisingCampaignPayload,
  cleanFundraisingDonorPayload,
  cleanFundraisingGiftPayload,
  cleanMarketingCampaignPayload,
  cleanMarketingSubscriberPayload,
  cleanEarnedIncomePayload,
  cleanHrsnClaimPayload,
  cleanInferredGoalText,
  cleanNetworkProvider,
  cleanOptionalInteger,
  cleanOptionalNumber,
  cleanPerformanceEvaluationQuestionPayload,
  cleanPerformanceEvaluationInstrumentPayload,
  cleanPerformanceEvaluationResponsePayload,
  cleanPerformanceMeasurementPayload,
  cleanPerformanceMetricPayload,
  cleanOutreachContactPayload,
  cleanOutreachEventPayload,
  cleanVolunteerOpportunityPayload,
  cleanVolunteerProfilePayload,
  cleanPersonPayload,
  cleanProgramRegistrationPayload,
  cleanProgramSessionPayload,
  cleanProviderLink,
  cleanPublicBookingChildren,
  cleanPublicBookingPayload,
  cleanPublicClassRegistrationPayload,
  cleanPublicFamilyPayload,
  cleanReferralNetworkPayload,
  cleanSchedulingSettingsPayload,
  cleanSiblingZohoRecordIds,
  cleanStaffFinanceSections,
  cleanStaffModules,
  cleanString,
  cleanTaskPayload,
  buildUnifiedMarketingSubscribers,
  clientPayloadFromReferral,
  clients,
  collectionCount,
  completeOutcomeTasksForAppointment,
  completeRescheduleTasksForAppointment,
  createGeneratedTaskIfMissing,
  createPublicManageToken,
  daysBetweenDateStrings,
  defaultAppointmentDurationMinutes,
  defaultClinicServices,
  defaultClientStatusDefinitions,
  defaultKitchenClassTypes,
  defaultKitchenSettings,
  defaultMarketingAudienceGroups,
  defaultSchedulingSettings,
  defaultSchedulingSettingsNormalized,
  defaultStaffAccessLevels,
  deleteCollectionDocuments,
  ensureHelloMessage,
  existingPublicManageClientRefs,
  fetchAllBatchSize,
  fetchAllDocuments,
  findAppointmentConflict,
  findExistingStartDayTask,
  firebaseAuthProjectId,
  firebaseJwtKeys,
  firestore,
  formatAppointmentTimeValue,
  frontendOrigin,
  frontendOrigins,
  configuredFrontendOrigins,
  googleCalendarConnectionStatus,
  googleCalendarEnabled,
  googleCalendarEventForAppointment,
  googleCalendarId,
  googleCalendarScopes,
  googleCalendarSafeClientName,
  fundraisingCampaigns,
  fundraisingDonors,
  fundraisingGifts,
  grantQuestions,
  grants,
  hasRequiredPersonFields,
  hrsnClaims,
  inferAppointmentGoalFromNotes,
  inferAppointmentLessonFromNotes,
  isActiveTaskStatus,
  isAdminBulkDeleteEnabled,
  isGeneratedTaskSource,
  isPublicBookableDate,
  isPublicBookingDateInRange,
  isPublicAppointmentAtLeastHoursAhead,
  legacyStatusMap,
  legacyTaskTypeMap,
  loadPublicManagedAppointment,
  loadClientStatusDefinitions,
  loadSchedulingSettings,
  loadStaffAccessLevels,
  messages,
  marketingCampaigns,
  marketingSubscriberEligibility,
  marketingSubscriberIdForEmail,
  marketingSubscriberValidationError,
  marketingSubscribers,
  normalizeActivityDirection,
  normalizeActivityType,
  normalizeAppointmentStatus,
  normalizeAppointmentTimeValue,
  normalizeClinicServices,
  normalizeClientStatusDefinitions,
  normalizeKitchenClassTypes,
  normalizeKitchenSettings,
  normalizeMailingAddress,
  normalizeAddressState,
  normalizeMarketingEmail,
  normalizeProgram,
  normalizeProgramRegistrationStatus,
  normalizeProgramSessionStatus,
  normalizeStaffEmail,
  normalizeStaffRole,
  normalizedLookupKey,
  normalizedTaskTitle,
  normalizeSchedulingSettings,
  normalizeSchedulingTime,
  normalizeSchedulingWeekdays,
  normalizeStaffAccessLevels,
  normalizeStatus,
  normalizeTaskPriority,
  normalizeTaskStatus,
  normalizeTaskType,
  outreachContacts,
  outreachEvents,
  volunteerOpportunities,
  volunteerProfiles,
  earnedIncome,
  parseDateOnly,
  port,
  projectId,
  programRegistrationSeatCount,
  programRegistrations,
  performanceMeasurements,
  performanceMetrics,
  performanceEvaluationInstruments,
  performanceEvaluationQuestions,
  performanceEvaluationResponses,
  persistClinicAppointmentCalendarSync,
  programRegistrationStatusForCapacity,
  programSessions,
  protectedAdminDataCollectionNames,
  publicAppointmentDateTime,
  publicClassRegistrationValidationError,
  publicAppointmentCanManage,
  publicAppointmentDraft,
  publicAvailabilityDefaultDays,
  publicAvailabilityMaxDays,
  publicBookingAttempts,
  publicBookingMaxAdvanceDays,
  publicBookingMinimumNoticeHours,
  publicBookingMaxLengths,
  publicBookingRateLimit,
  publicSubmissionRateLimit,
  publicBookingServiceById,
  publicBookingServiceByLabel,
  publicBookingServiceFromAppointment,
  publicBookingServiceFromId,
  publicBookingServices,
  publicBookingValidationError,
  publicFamilyValidationError,
  publicKitchenSessionAvailability,
  publicChildNameParts,
  publicManageClientIdsFromAppointment,
  publicManageTokenFromRequest,
  publicManageTokenHash,
  publicManageTokensMatch,
  publicSlotValuesForDate,
  rawPublicBookingChildren,
  referralNetwork,
  referrals,
  referralSourceFromRecord,
  requireAuth,
  resolveStaffAccess,
  resolveAppointmentImportClients,
  schedulingWindowEndLabel,
  schedulingWindowError,
  serializePublicManagedBooking,
  serializeSchedulingSettings,
  staffAccessCanAccessApiPath,
  staffModuleAccess,
  staffAccessLevelForRole,
  staffAccountIsActive,
  staffFinanceSectionForApiPath,
  staffFinanceSectionIds,
  staffFinanceSectionsForRole,
  staffModuleForApiPath,
  staffModuleIds,
  staffModulesCanAccessApiPath,
  staffModulesForRole,
  staffRoleCanAccessApiPath,
  staffRoleCanAccessGrantDocuments,
  staffRoleCanAccessModule,
  staffRoles,
  staffUsers,
  securityAuditLogs,
  sessionInactivityMinutes,
  sessionWarningMinutes,
  auditStaffRequest,
  siblingIdsForImportedRecord,
  startDayTaskIntent,
  startDayTaskSubject,
  stripSetmoreBookingIdFromNotes,
  syncClinicAppointmentCalendar,
  tasks,
  tasksMatchStartDayIntent,
  toActivityLog,
  toAppointment,
  toClient,
  todayDateString,
  toGrant,
  toGrantOrganizationInfo,
  toGrantQuestion,
  toEarnedIncome,
  toBudgetCategory,
  toFundraisingCampaign,
  toFundraisingDonor,
  toFundraisingGift,
  toHrsnClaim,
  toMarketingCampaign,
  toMarketingSubscriber,
  toPerformanceEvaluationQuestion,
  toPerformanceEvaluationInstrument,
  toPerformanceEvaluationResponse,
  toPerformanceMeasurement,
  toPerformanceMetric,
  toOutreachContact,
  toOutreachEvent,
  toVolunteerOpportunity,
  toVolunteerProfile,
  toProgramRegistration,
  toProgramSession,
  toReferral,
  toReferralNetworkEntry,
  toSchedulingSettings,
  toScheduleClient,
  toStaffUser,
  toTask,
  validatePublicBookingPayload,
  validatePublicClassRegistrationPayload,
  validateRequiredPersonFields,
  verifyGoogleCalendarLifecycle
};
