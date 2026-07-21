import crypto from "node:crypto";
import { FieldValue, Firestore } from "@google-cloud/firestore";
import { createRemoteJWKSet, jwtVerify } from "jose";

const port = Number(process.env.PORT || 8080);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";
const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.PROJECT_ID;
const firebaseAuthProjectId = process.env.FIREBASE_AUTH_PROJECT_ID || "snack-crm";
const allowedEmailDomain = process.env.ALLOWED_EMAIL_DOMAIN || "snackprogram.org";
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
const allowedClientStatuses = new Set([
  "Scheduled",
  "Active",
  "Needs Reschedule",
  "Needs Language Support",
  "Waiting on Family",
  "Graduated",
  "Inactive",
  "Closed"
]);
const allowedAppointmentStatuses = new Set(["Scheduled", "Completed", "No-show", "Rescheduled", "Blocked", "Canceled"]);
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
const defaultSchedulingSettings = Object.freeze({
  officeStartTime: "13:00",
  officeEndTime: "18:00",
  bookableStartTime: "13:00",
  bookableEndTime: "18:00",
  weekdays: [2, 3, 4],
  defaultDurationMinutes: defaultAppointmentDurationMinutes,
  slotIntervalMinutes: 15
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
  notes: 600
};
const publicBookingServices = [
  {
    id: "enrollment",
    label: "Enrollment Appointment",
    appointmentType: "Enrollment",
    durationMinutes: 30,
    defaultLanguage: "English",
    staffMember: "Cynthia Esparza"
  },
  {
    id: "nutrition-education",
    label: "Nutrition Education Appointment",
    appointmentType: "Nutrition Education",
    durationMinutes: 30,
    defaultLanguage: "English",
    staffMember: "Cynthia Esparza"
  },
  {
    id: "spanish-enrollment",
    label: "Cita de inscripción en español",
    appointmentType: "Enrollment",
    durationMinutes: 30,
    defaultLanguage: "Spanish",
    staffMember: "Cynthia Esparza"
  },
  {
    id: "spanish-nutrition-education",
    label: "Cita de educación nutricional en español",
    appointmentType: "Nutrition Education",
    durationMinutes: 30,
    defaultLanguage: "Spanish",
    staffMember: "Cynthia Esparza"
  }
];
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
const appointments = firestore.collection("appointments");
const tasks = firestore.collection("tasks");
const activityLogs = firestore.collection("activityLogs");
const grants = firestore.collection("grants");
const grantQuestions = firestore.collection("grantQuestions");
const adminSettings = firestore.collection("adminSettings");
const adminDataCollections = {
  referrals: { label: "Referrals", collection: referrals, serializer: toReferral },
  clients: { label: "Clients", collection: clients, serializer: toClient },
  "referral-network": { label: "Referral Network", collection: referralNetwork, serializer: toReferralNetworkEntry },
  appointments: { label: "Appointments", collection: appointments, serializer: toAppointment },
  tasks: { label: "Tasks", collection: tasks, serializer: toTask },
  "activity-logs": { label: "Activity Logs", collection: activityLogs, serializer: toActivityLog }
};
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

async function requireAuth(request, response, next) {
  const authHeader = request.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

  if (!token) {
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
      response.status(403).json({
        error: "This account is not allowed to use SNACK CRM."
      });
      return;
    }

    request.user = {
      uid: payload.sub,
      email
    };
    next();
  } catch (error) {
    console.error(error);
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
  return ["true", "yes", "y", "1", "checked"].includes(normalized);
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
    addressState: data.addressState,
    addressZip: data.addressZip,
    emailOptOut: Boolean(data.emailOptOut),
    textOptOut: Boolean(data.textOptOut),
    ycco: cleanBoolean(data.ycco),
    hrsn: cleanBoolean(data.hrsn),
    assessmentScore: data.assessmentScore,
    willingnessScore: data.willingnessScore,
    status: normalizeStatus(data.status),
    notes: data.notes,
    siblingIds: Array.isArray(data.siblingIds) ? data.siblingIds : [],
    providerLinks: Array.isArray(data.providerLinks) ? data.providerLinks : [],
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
    addressState: data.addressState,
    addressZip: data.addressZip,
    emailOptOut: Boolean(data.emailOptOut),
    textOptOut: Boolean(data.textOptOut),
    ycco: cleanBoolean(data.ycco),
    hrsn: cleanBoolean(data.hrsn),
    assessmentScore: data.assessmentScore,
    willingnessScore: data.willingnessScore,
    currentLesson: data.currentLesson,
    status: data.status,
    notes: data.notes,
    siblingIds: Array.isArray(data.siblingIds) ? data.siblingIds : [],
    providerLinks: Array.isArray(data.providerLinks) ? data.providerLinks : [],
    convertedAt: data.convertedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
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
    location: data.location,
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
    phone: data.phone,
    email: data.email,
    preferredLanguage: data.preferredLanguage,
    interestType: data.interestType,
    status: data.status,
    referralId: data.referralId,
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
    status: data.status,
    lesson: data.lesson,
    goal: data.goal,
    staffMember: data.staffMember,
    caregiverMood: data.caregiverMood,
    confidence: data.confidence,
    participation: data.participation,
    barriers: data.barriers,
    notes: data.notes,
    appointmentNote: data.appointmentNote,
    prepChecklist: cleanAppointmentPrepChecklist(data.prepChecklist),
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
    mailingAddress: data.mailingAddress || "",
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
    title: cleanString(document.title),
    url: cleanString(document.url),
    storagePath: cleanString(document.storagePath),
    fileName: cleanString(document.fileName),
    mimeType: cleanString(document.mimeType),
    fileSize: cleanOptionalInteger(document.fileSize),
    uploadedAt: cleanString(document.uploadedAt),
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
    mailingAddress: cleanString(body.mailingAddress),
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
    addressState: cleanString(body.addressState),
    addressZip: cleanString(body.addressZip),
    emailOptOut: cleanBoolean(body.emailOptOut),
    textOptOut: cleanBoolean(body.textOptOut),
    ycco: cleanBoolean(body.ycco),
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
    addressState: referral.addressState || "",
    addressZip: referral.addressZip || "",
    emailOptOut: Boolean(referral.emailOptOut),
    textOptOut: Boolean(referral.textOptOut),
    ycco: cleanBoolean(referral.ycco),
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
    location: cleanString(body.location),
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
    phone: cleanString(body.phone),
    email: cleanString(body.email),
    preferredLanguage: cleanString(body.preferredLanguage),
    interestType: cleanString(body.interestType),
    status: cleanString(body.status) || "New",
    referralId: cleanString(body.referralId),
    notes: cleanString(body.notes)
  };
}

function normalizeAppointmentStatus(status) {
  const cleaned = cleanString(status) || "Scheduled";
  return allowedAppointmentStatuses.has(cleaned) ? cleaned : "Scheduled";
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
    status: normalizeAppointmentStatus(body.status),
    lesson,
    goal: cleanString(body.goal) || inferAppointmentGoalFromNotes(notes, lesson),
    staffMember: cleanString(body.staffMember),
    notes,
    appointmentNote: cleanString(body.appointmentNote)
  };
  for (const field of ["caregiverMood", "confidence", "participation", "barriers"]) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = cleanString(body[field]);
    }
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

  return {
    officeStartTime,
    officeEndTime,
    bookableStartTime,
    bookableEndTime,
    weekdays: normalizeSchedulingWeekdays(raw.weekdays),
    defaultDurationMinutes: defaultDuration > 0 ? defaultDuration : defaultSchedulingSettings.defaultDurationMinutes,
    slotIntervalMinutes: [5, 10, 15, 30].includes(slotIntervalMinutes) ? slotIntervalMinutes : defaultSchedulingSettings.slotIntervalMinutes,
    officeStartMinutes,
    officeEndMinutes,
    bookableStartMinutes,
    bookableEndMinutes
  };
}

const defaultSchedulingSettingsNormalized = normalizeSchedulingSettings(defaultSchedulingSettings);

function serializeSchedulingSettings(settings = defaultSchedulingSettingsNormalized) {
  return {
    officeStartTime: settings.officeStartTime,
    officeEndTime: settings.officeEndTime,
    bookableStartTime: settings.bookableStartTime,
    bookableEndTime: settings.bookableEndTime,
    weekdays: settings.weekdays,
    defaultDurationMinutes: settings.defaultDurationMinutes,
    slotIntervalMinutes: settings.slotIntervalMinutes,
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
  return ["Start the Day", "Polish Queue"].includes(source || "");
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
    return payloadIntent === "reschedule" ? taskIntent === "reschedule" : payloadIntent === taskIntent;
  }

  if (payload.referralId && existingTask.referralId === payload.referralId) {
    return payloadIntent === "schedule" ? taskIntent === "schedule" : payloadIntent === taskIntent;
  }

  const payloadSubject = startDayTaskSubject(payloadTitle);
  const taskSubject = startDayTaskSubject(taskTitle);
  return Boolean(payloadSubject && taskSubject === payloadSubject && payloadIntent === taskIntent);
}

async function findExistingStartDayTask(payload) {
  if (!isGeneratedTaskSource(payload.source)) {
    return null;
  }

  const taskDocuments = await fetchAllDocuments(tasks.orderBy("createdAt", "desc"));

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
      const isRescheduleTask = cleanString(task.title).toLowerCase().includes("reschedule");

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

function isPublicAppointmentAtLeastHoursAhead(
  dateString,
  appointmentTime,
  now = new Date(),
  minimumHours = publicBookingMinimumNoticeHours
) {
  const appointment = publicAppointmentDateTime(dateString, appointmentTime);

  return Boolean(appointment) && appointment.getTime() - now.getTime() >= minimumHours * 60 * 60 * 1000;
}

function publicBookingServiceFromId(serviceId) {
  return publicBookingServiceById.get(cleanString(serviceId)) || publicBookingServices[0];
}

function publicBookingServiceFromAppointment(appointment = {}) {
  const byId = publicBookingServiceById.get(cleanString(appointment.publicBookingServiceId));

  if (byId) {
    return byId;
  }

  const byLabel = publicBookingServiceByLabel.get(cleanString(appointment.publicBookingServiceLabel).toLowerCase());

  if (byLabel) {
    return byLabel;
  }

  return publicBookingServices.find((service) => service.appointmentType === appointment.appointmentType) || publicBookingServices[0];
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
    } catch (_error) {
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

function publicBookingRateLimit(request, response, next) {
  const key = cleanString(request.get("x-forwarded-for")).split(",")[0] || request.ip || "unknown";
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxAttempts = 12;
  const attempts = (publicBookingAttempts.get(key) || []).filter((timestamp) => now - timestamp < windowMs);

  if (attempts.length >= maxAttempts) {
    response.status(429).json({
      error: "Too many booking attempts. Please try again later or call us at (971) 202-0232."
    });
    return;
  }

  attempts.push(now);
  publicBookingAttempts.set(key, attempts);
  next();
}

function cleanPublicBookingPayload(body) {
  const service = publicBookingServiceFromId(body.serviceId);
  const children = cleanPublicBookingChildren(body);
  const parentName = cleanString(body.parentName || body.caregiverName);
  const preferredLanguage = cleanString(body.preferredLanguage) || service.defaultLanguage || "English";
  const phone = cleanString(body.mobilePhone || body.phone);
  const email = cleanString(body.email);
  const yccoMember = cleanBoolean(body.yccoMember || body.ycco);

  return {
    service,
    children,
    firstName: children[0]?.firstName || "",
    lastName: children[0]?.lastName || "",
    parentName,
    phone,
    email,
    address: cleanString(body.address || body.addressStreet),
    preferredLanguage,
    preferredContactMethod: cleanString(body.preferredContactMethod),
    yccoMember,
    yccoId: yccoMember ? cleanString(body.yccoId || body.yccoID || body.memberId) : "",
    consentReminders: cleanBoolean(body.consentReminders || body.reminderConsent || body.consentToReminders),
    appointmentDate: cleanString(body.appointmentDate),
    appointmentTime: normalizeAppointmentTimeValue(body.appointmentTime),
    notes: cleanString(body.notes),
    spamTrap: cleanString(body.website || body.company || body.url || body.contactMe)
  };
}

function publicBookingValidationError(payload, settings = defaultSchedulingSettingsNormalized, now = new Date()) {
  if (payload.spamTrap || payload.website || payload.company || payload.url || payload.contactMe) {
    return "Could not submit this booking request. Please call or text (971) 202-0232.";
  }

  if (!payload.children.length || !payload.children.every((child) => child.childName && child.dateOfBirth && child.gender)) {
    return "Child name, date of birth, and gender are required for each child.";
  }

  if (!payload.parentName || !payload.phone || !payload.email || !payload.address || !payload.preferredLanguage || !payload.preferredContactMethod || !payload.consentReminders) {
    return "Caregiver name, mobile phone, email, address, language, contact method, and reminder consent are required.";
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

export {
  activityLogs,
  addDaysToDateString,
  adminDataCollections,
  adminSettings,
  allowedActivityDirections,
  allowedActivityTypes,
  allowedAppointmentPrepKeys,
  allowedAppointmentStatuses,
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
  appointmentShouldCompleteRescheduleTasks,
  appointmentTimeMinutes,
  cleanActivityLogPayload,
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
  cleanInferredGoalText,
  cleanNetworkProvider,
  cleanOptionalInteger,
  cleanOptionalNumber,
  cleanOutreachContactPayload,
  cleanOutreachEventPayload,
  cleanPersonPayload,
  cleanProviderLink,
  cleanPublicBookingChildren,
  cleanPublicBookingPayload,
  cleanReferralNetworkPayload,
  cleanSchedulingSettingsPayload,
  cleanSiblingZohoRecordIds,
  cleanString,
  cleanTaskPayload,
  clientPayloadFromReferral,
  clients,
  collectionCount,
  completeRescheduleTasksForAppointment,
  createPublicManageToken,
  daysBetweenDateStrings,
  defaultAppointmentDurationMinutes,
  defaultSchedulingSettings,
  defaultSchedulingSettingsNormalized,
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
  grantQuestions,
  grants,
  hasRequiredPersonFields,
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
  loadSchedulingSettings,
  messages,
  normalizeActivityDirection,
  normalizeActivityType,
  normalizeAppointmentStatus,
  normalizeAppointmentTimeValue,
  normalizedLookupKey,
  normalizedTaskTitle,
  normalizeSchedulingSettings,
  normalizeSchedulingTime,
  normalizeSchedulingWeekdays,
  normalizeStatus,
  normalizeTaskPriority,
  normalizeTaskStatus,
  normalizeTaskType,
  outreachContacts,
  outreachEvents,
  parseDateOnly,
  port,
  projectId,
  publicAppointmentCanManage,
  publicAppointmentDraft,
  publicAvailabilityDefaultDays,
  publicAvailabilityMaxDays,
  publicBookingAttempts,
  publicBookingMaxAdvanceDays,
  publicBookingMinimumNoticeHours,
  publicBookingMaxLengths,
  publicBookingRateLimit,
  publicBookingServiceById,
  publicBookingServiceByLabel,
  publicBookingServiceFromAppointment,
  publicBookingServiceFromId,
  publicBookingServices,
  publicBookingValidationError,
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
  resolveAppointmentImportClients,
  schedulingWindowEndLabel,
  schedulingWindowError,
  serializePublicManagedBooking,
  serializeSchedulingSettings,
  siblingIdsForImportedRecord,
  startDayTaskIntent,
  startDayTaskSubject,
  stripSetmoreBookingIdFromNotes,
  tasks,
  tasksMatchStartDayIntent,
  toActivityLog,
  toAppointment,
  toClient,
  todayDateString,
  toGrant,
  toGrantOrganizationInfo,
  toGrantQuestion,
  toOutreachContact,
  toOutreachEvent,
  toReferral,
  toReferralNetworkEntry,
  toSchedulingSettings,
  toTask,
  validatePublicBookingPayload,
  validateRequiredPersonFields
};
