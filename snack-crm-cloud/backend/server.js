import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
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
  bookableStartTime: "13:30",
  bookableEndTime: "18:00",
  weekdays: [2, 3, 4],
  defaultDurationMinutes: defaultAppointmentDurationMinutes,
  slotIntervalMinutes: 15
});
const publicAvailabilityDefaultDays = 21;
const publicAvailabilityMaxDays = 45;
const publicBookingMaxAdvanceDays = 120;
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

const app = express();

app.use(
  cors({
    origin: frontendOrigin === "*" ? true : frontendOrigin
  })
);
app.use(express.json());

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
const fetchAllMaxDocuments = 20000;

async function fetchAllDocuments(query) {
  const documents = [];
  let cursor = null;

  while (documents.length < fetchAllMaxDocuments) {
    const page = cursor ? query.startAfter(cursor).limit(fetchAllBatchSize) : query.limit(fetchAllBatchSize);
    const snapshot = await page.get();
    documents.push(...snapshot.docs);

    if (snapshot.docs.length < fetchAllBatchSize) {
      return documents;
    }

    cursor = snapshot.docs[snapshot.docs.length - 1];
  }

  console.warn(`fetchAllDocuments stopped at the ${fetchAllMaxDocuments} document safety ceiling; results may be incomplete.`);
  return documents;
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
    notes
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

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
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

function isPublicBookingDateInRange(dateString) {
  const today = todayDateString();
  const daysAhead = daysBetweenDateStrings(today, dateString);
  return daysAhead !== null && daysAhead >= 0 && daysAhead <= publicBookingMaxAdvanceDays;
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

function publicSlotValuesForDate(dateString, service, existingAppointments = [], settings = defaultSchedulingSettingsNormalized) {
  if (!isPublicBookableDate(dateString, settings) || !isPublicBookingDateInRange(dateString)) {
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

    if (!conflict) {
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

function publicBookingValidationError(payload, settings = defaultSchedulingSettingsNormalized) {
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

  if (!isPublicBookableDate(payload.appointmentDate, settings) || !isPublicBookingDateInRange(payload.appointmentDate)) {
    return "Choose an available appointment date.";
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

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "snack-crm-api"
  });
});

app.get("/api/public/booking-options", async (_request, response, next) => {
  try {
    const settings = await loadSchedulingSettings();

    response.json({
      services: publicBookingServices,
      scheduling: {
        startTime: formatAppointmentTimeValue(settings.bookableStartTime),
        endTime: schedulingWindowEndLabel(settings),
        weekdays: settings.weekdays
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/public/availability", async (request, response, next) => {
  try {
    const service = publicBookingServiceFromId(request.query.serviceId);
    const requestedStart = cleanString(request.query.startDate || request.query.start) || todayDateString();
    const startDate = parseDateOnly(requestedStart) ? requestedStart : todayDateString();
    const requestedDays = Number(request.query.days);
    const days = Number.isInteger(requestedDays)
      ? Math.min(Math.max(requestedDays, 1), publicAvailabilityMaxDays)
      : publicAvailabilityDefaultDays;
    const settings = await loadSchedulingSettings();
    const endDate = addDaysToDateString(startDate, days - 1);
    const snapshot = await appointments
      .where("appointmentDate", ">=", startDate)
      .where("appointmentDate", "<=", endDate)
      .get();
    const existingAppointmentsByDate = new Map();

    for (const doc of snapshot.docs) {
      const appointment = toAppointment(doc);

      if (!appointmentBlocksSchedule(appointment)) {
        continue;
      }

      const dateAppointments = existingAppointmentsByDate.get(appointment.appointmentDate) || [];
      dateAppointments.push(appointment);
      existingAppointmentsByDate.set(appointment.appointmentDate, dateAppointments);
    }

    const dates = [];

    for (let offset = 0; offset < days; offset += 1) {
      const date = addDaysToDateString(startDate, offset);

      if (!date || !isPublicBookableDate(date, settings) || !isPublicBookingDateInRange(date)) {
        continue;
      }

      dates.push({
        date,
        slots: publicSlotValuesForDate(date, service, existingAppointmentsByDate.get(date) || [], settings)
      });
    }

    response.json({
      service,
      dates
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/public/bookings", publicBookingRateLimit, async (request, response, next) => {
  try {
    const payload = cleanPublicBookingPayload(request.body);
    const now = new Date().toISOString();
    const today = todayDateString();
    const clientNames = payload.children.map((child) => child.childName || `${child.firstName} ${child.lastName}`.trim()).filter(Boolean);
    const clientName = clientNames[0] || "";

    const settings = await loadSchedulingSettings();

    if (!validatePublicBookingPayload(payload, response, settings)) {
      return;
    }

    const appointmentDraft = publicAppointmentDraft({
      service: payload.service,
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      clientName
    });

    if (!appointmentFitsSchedulingWindow(appointmentDraft, settings)) {
      response.status(400).json({
        error: schedulingWindowError(appointmentDraft, settings)
      });
      return;
    }

    const conflict = await findAppointmentConflict(appointmentDraft);

    if (conflict) {
      response.status(409).json({
        error: "That time was just booked. Please choose another open time."
      });
      return;
    }

    const clientRefs = payload.children.map(() => clients.doc());
    const appointmentRef = appointments.doc();
    const taskRef = tasks.doc();
    const publicManageToken = createPublicManageToken();
    const manageTokenHash = publicManageTokenHash(publicManageToken);
    const publicNotes = [
      "Booked through the public SNACK booking page.",
      clientNames.length > 1 ? `Children: ${clientNames.join(", ")}.` : "",
      `YCCO member: ${payload.yccoMember ? "Yes" : "No"}.`,
      payload.yccoMember && payload.yccoId ? `YCCO ID: ${payload.yccoId}.` : "",
      payload.notes ? `Family notes: ${payload.notes}` : ""
    ].filter(Boolean).join(" ");
    const clientRecords = payload.children.map((child, index) => ({
      firstName: child.firstName,
      lastName: child.lastName,
      parentName: payload.parentName,
      dateOfBirth: child.dateOfBirth,
      gender: child.gender,
      phone: payload.phone,
      email: payload.email,
      preferredLanguage: payload.preferredLanguage,
      preferredContactMethod: payload.preferredContactMethod,
      addressStreet: payload.address,
      emailOptOut: !payload.consentReminders,
      textOptOut: !payload.consentReminders,
      ycco: payload.yccoMember,
      yccoId: payload.yccoId,
      referralType: "Self Referral",
      referralSource: "Public booking",
      referralDate: today,
      firstAppointmentDate: payload.appointmentDate,
      status: "Scheduled",
      notes: publicNotes,
      siblingIds: clientRefs.map((ref, siblingIndex) => siblingIndex === index ? "" : ref.id).filter(Boolean),
      publicBookingServiceId: payload.service.id,
      publicBookingServiceLabel: payload.service.label,
      createdVia: "Public booking",
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    }));
    const taskClientName = clientNames.length > 1 ? clientNames.join(", ") : clientName;
    const appointmentRecord = {
      clientId: clientRefs[0].id,
      clientIds: clientRefs.map((ref) => ref.id),
      clientName,
      clientNames,
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      appointmentType: payload.service.appointmentType,
      durationMinutes: payload.service.durationMinutes,
      publicBookingServiceId: payload.service.id,
      publicBookingServiceLabel: payload.service.label,
      status: "Scheduled",
      lesson: "",
      goal: "",
      staffMember: payload.service.staffMember || "Cynthia Esparza",
      notes: publicNotes,
      createdVia: "Public booking",
      publicManageTokenHash: manageTokenHash,
      publicManageTokenCreatedAt: now,
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    };
    const taskRecord = {
      title: `Review public booking for ${taskClientName}`,
      type: "Task",
      status: "Open",
      priority: "Normal",
      dueDate: today,
      dueTime: "",
      assignedTo: "",
      clientId: clientRefs[0].id,
      clientName: taskClientName,
      appointmentId: appointmentRef.id,
      referralId: "",
      source: "Public Booking",
      notes: [
        `Booked ${payload.service.label} for ${payload.appointmentDate} at ${formatAppointmentTimeValue(payload.appointmentTime)}.`,
        clientNames.length > 1 ? `Multiple children: ${clientNames.join(", ")}.` : "",
        "Review for duplicate records, sibling needs, forms, and appointment prep."
      ].filter(Boolean).join(" "),
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    };
    const batch = firestore.batch();

    clientRefs.forEach((clientRef, index) => {
      batch.set(clientRef, clientRecords[index]);
    });
    batch.set(appointmentRef, appointmentRecord);
    batch.set(taskRef, taskRecord);
    await batch.commit();

    response.status(201).json({
      booking: {
        clientName: clientNames.length > 1 ? clientNames.join(", ") : clientName,
        clientNames,
        serviceLabel: payload.service.label,
        appointmentDate: payload.appointmentDate,
        appointmentTime: payload.appointmentTime,
        appointmentTimeLabel: formatAppointmentTimeValue(payload.appointmentTime),
        durationMinutes: payload.service.durationMinutes,
        appointmentId: appointmentRef.id,
        manageToken: publicManageToken
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/public/bookings/:appointmentId", async (request, response, next) => {
  try {
    const appointment = await loadPublicManagedAppointment(request.params.appointmentId, publicManageTokenFromRequest(request));

    if (!appointment) {
      response.status(404).json({
        error: "We could not find that appointment. Please call or text (971) 202-0232."
      });
      return;
    }

    response.json({
      booking: serializePublicManagedBooking(appointment)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/public/bookings/:appointmentId/cancel", publicBookingRateLimit, async (request, response, next) => {
  try {
    const appointment = await loadPublicManagedAppointment(request.params.appointmentId, publicManageTokenFromRequest(request));

    if (!appointment) {
      response.status(404).json({
        error: "We could not find that appointment. Please call or text (971) 202-0232."
      });
      return;
    }

    if (!publicAppointmentCanManage(appointment)) {
      response.status(400).json({
        error: "This appointment can no longer be changed online. Please call or text (971) 202-0232."
      });
      return;
    }

    const now = new Date().toISOString();
    const today = todayDateString();
    const clientNames = Array.isArray(appointment.clientNames) && appointment.clientNames.length
      ? appointment.clientNames.filter(Boolean)
      : [appointment.clientName].filter(Boolean);
    const displayName = clientNames.length > 1 ? clientNames.join(", ") : clientNames[0] || "Public booking";
    const clientRefsToUpdate = await existingPublicManageClientRefs(appointment);
    const batch = firestore.batch();

    batch.update(appointments.doc(appointment.id), {
      status: "Canceled",
      publicCanceledAt: now,
      updatedAt: now,
      updatedBy: "public-booking"
    });

    for (const clientRef of clientRefsToUpdate) {
      batch.update(clientRef, {
        status: "Needs Reschedule",
        updatedAt: now,
        updatedBy: "public-booking"
      });
    }

    batch.set(tasks.doc(), {
      title: `Review public cancellation for ${displayName}`,
      type: "Task",
      status: "Open",
      priority: "Normal",
      dueDate: today,
      dueTime: "",
      assignedTo: "",
      clientId: appointment.clientId || appointment.clientIds?.[0] || "",
      clientName: displayName,
      appointmentId: appointment.id,
      referralId: "",
      source: "Public Booking",
      notes: `Family canceled ${appointment.publicBookingServiceLabel || appointment.appointmentType || "appointment"} for ${appointment.appointmentDate} at ${formatAppointmentTimeValue(appointment.appointmentTime)}.`,
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    });

    await batch.commit();

    response.json({
      booking: serializePublicManagedBooking({ ...appointment, status: "Canceled" })
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/public/bookings/:appointmentId/reschedule", publicBookingRateLimit, async (request, response, next) => {
  try {
    const appointment = await loadPublicManagedAppointment(request.params.appointmentId, publicManageTokenFromRequest(request));

    if (!appointment) {
      response.status(404).json({
        error: "We could not find that appointment. Please call or text (971) 202-0232."
      });
      return;
    }

    if (!publicAppointmentCanManage(appointment)) {
      response.status(400).json({
        error: "This appointment can no longer be changed online. Please call or text (971) 202-0232."
      });
      return;
    }

    const appointmentDate = cleanString(request.body?.appointmentDate);
    const appointmentTime = normalizeAppointmentTimeValue(request.body?.appointmentTime);
    const settings = await loadSchedulingSettings();
    const service = publicBookingServiceFromAppointment(appointment);
    const rescheduledAppointment = {
      ...appointment,
      appointmentDate,
      appointmentTime,
      durationMinutes: service.durationMinutes,
      status: "Scheduled"
    };

    if (!parseDateOnly(appointmentDate) || !appointmentTime) {
      response.status(400).json({
        error: "Choose an appointment date and time."
      });
      return;
    }

    if (appointment.appointmentDate === appointmentDate && normalizeAppointmentTimeValue(appointment.appointmentTime) === appointmentTime) {
      response.status(400).json({
        error: "Choose a new appointment time."
      });
      return;
    }

    if (!isPublicBookableDate(appointmentDate, settings) || !isPublicBookingDateInRange(appointmentDate)) {
      response.status(400).json({
        error: "Choose an available appointment date."
      });
      return;
    }

    if (!appointmentFitsSchedulingWindow(rescheduledAppointment, settings)) {
      response.status(400).json({
        error: schedulingWindowError(rescheduledAppointment, settings)
      });
      return;
    }

    const conflict = await findAppointmentConflict(rescheduledAppointment, appointment.id);

    if (conflict) {
      response.status(409).json({
        error: "That time was just booked. Please choose another open time."
      });
      return;
    }

    const now = new Date().toISOString();
    const today = todayDateString();
    const clientNames = Array.isArray(appointment.clientNames) && appointment.clientNames.length
      ? appointment.clientNames.filter(Boolean)
      : [appointment.clientName].filter(Boolean);
    const displayName = clientNames.length > 1 ? clientNames.join(", ") : clientNames[0] || "Public booking";
    const clientRefsToUpdate = await existingPublicManageClientRefs(appointment);
    const batch = firestore.batch();

    batch.update(appointments.doc(appointment.id), {
      appointmentDate,
      appointmentTime,
      durationMinutes: service.durationMinutes,
      status: "Scheduled",
      publicRescheduledAt: now,
      updatedAt: now,
      updatedBy: "public-booking"
    });

    for (const clientRef of clientRefsToUpdate) {
      batch.update(clientRef, {
        status: "Scheduled",
        firstAppointmentDate: appointmentDate,
        updatedAt: now,
        updatedBy: "public-booking"
      });
    }

    batch.set(tasks.doc(), {
      title: `Review public reschedule for ${displayName}`,
      type: "Task",
      status: "Open",
      priority: "Normal",
      dueDate: today,
      dueTime: "",
      assignedTo: "",
      clientId: appointment.clientId || appointment.clientIds?.[0] || "",
      clientName: displayName,
      appointmentId: appointment.id,
      referralId: "",
      source: "Public Booking",
      notes: `Family rescheduled ${appointment.publicBookingServiceLabel || appointment.appointmentType || "appointment"} from ${appointment.appointmentDate} at ${formatAppointmentTimeValue(appointment.appointmentTime)} to ${appointmentDate} at ${formatAppointmentTimeValue(appointmentTime)}.`,
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    });

    await batch.commit();

    response.json({
      booking: serializePublicManagedBooking(rescheduledAppointment)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/message", requireAuth, async (_request, response, next) => {
  try {
    await ensureHelloMessage();
    const snapshot = await messages.doc("hello").get();
    const data = snapshot.data();

    response.json({
      id: snapshot.id,
      text: data.text,
      source: "Firestore collection: messages"
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/data-counts", requireAuth, async (_request, response, next) => {
  try {
    const counts = {};

    for (const [key, config] of Object.entries(adminDataCollections)) {
      counts[key] = await collectionCount(config.collection);
    }

    response.json({ counts });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/export/:collectionKey", requireAuth, async (request, response, next) => {
  try {
    const collectionKey = cleanString(request.params.collectionKey);
    const config = adminDataCollections[collectionKey];

    if (!config) {
      response.status(400).json({
        error: "Data collection is not available for export."
      });
      return;
    }

    const documents = await fetchAllDocuments(config.collection);

    response.json({
      collection: collectionKey,
      label: config.label,
      exportedAt: new Date().toISOString(),
      records: documents.map(config.serializer)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/bulk-delete", requireAuth, async (request, response, next) => {
  try {
    if (!isAdminBulkDeleteEnabled()) {
      response.status(403).json({
        error: "Bulk delete is disabled for this environment."
      });
      return;
    }

    const collectionKeys = Array.isArray(request.body.collections)
      ? request.body.collections.map(cleanString).filter(Boolean)
      : [];
    const confirmation = cleanString(request.body.confirmation);
    const uniqueCollectionKeys = [...new Set(collectionKeys)];

    if (confirmation !== "DELETE TEST DATA") {
      response.status(400).json({
        error: "Type DELETE TEST DATA to confirm this reset."
      });
      return;
    }

    if (!uniqueCollectionKeys.length) {
      response.status(400).json({
        error: "Choose at least one data collection to delete."
      });
      return;
    }

    const invalidCollection = uniqueCollectionKeys.find((key) => !adminDataCollections[key]);

    if (invalidCollection) {
      response.status(400).json({
        error: "One or more data collections cannot be deleted from this tool."
      });
      return;
    }

    const deleted = {};

    for (const key of uniqueCollectionKeys) {
      deleted[key] = await deleteCollectionDocuments(adminDataCollections[key].collection);
    }

    response.json({
      deleted,
      deletedAt: new Date().toISOString(),
      deletedBy: request.user.email
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/scheduling-settings", requireAuth, async (_request, response, next) => {
  try {
    const settings = await loadSchedulingSettings();

    response.json({
      schedulingSettings: serializeSchedulingSettings(settings)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/scheduling-settings", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanSchedulingSettingsPayload(request.body);
    const docRef = adminSettings.doc("scheduling");

    await docRef.set({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    }, { merge: true });

    const updated = await docRef.get();

    response.json({
      schedulingSettings: serializeSchedulingSettings(toSchedulingSettings(updated))
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/referrals", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(referrals.orderBy("createdAt", "desc"));

    response.json({
      referrals: documents.map(toReferral)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/clients", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(clients.orderBy("createdAt", "desc"));

    response.json({
      clients: documents.map(toClient)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/appointments", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(appointments.orderBy("appointmentDate", "desc"));

    response.json({
      appointments: documents.map(toAppointment)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/appointments", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanAppointmentPayload(request.body);
    const now = new Date().toISOString();

    if ((!payload.clientIds.length && !payload.clientNames.length) || !payload.appointmentDate || !payload.appointmentTime) {
      response.status(400).json({
        error: "Client or referral name, appointment date, and appointment time are required."
      });
      return;
    }

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

    const settings = await loadSchedulingSettings();

    if (!appointmentFitsSchedulingWindow(payload, settings)) {
      response.status(400).json({
        error: schedulingWindowError(payload, settings)
      });
      return;
    }

    const conflict = await findAppointmentConflict(payload);

    if (conflict) {
      response.status(409).json({
        error: `That time overlaps ${conflict.clientName || "another appointment"} at ${formatAppointmentTimeValue(conflict.appointmentTime)}. Choose a different time or add the client to that appointment.`
      });
      return;
    }

    const docRef = await appointments.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();
    const completedRescheduleTasks = await completeRescheduleTasksForAppointment(payload, request.user.email, now);

    response.status(201).json({
      appointment: toAppointment(created),
      completedRescheduleTasks
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/appointments/import", requireAuth, async (request, response, next) => {
  try {
    const appointmentRows = Array.isArray(request.body.appointments) ? request.body.appointments : [];

    if (!appointmentRows.length) {
      response.status(400).json({
        error: "No appointments were provided for import."
      });
      return;
    }

    if (appointmentRows.length > 450) {
      response.status(400).json({
        error: "Import is limited to 450 appointments at a time."
      });
      return;
    }

    const clientDocuments = await fetchAllDocuments(clients);
    const clientsByName = new Map();

    clientDocuments.forEach((doc) => {
      const client = toClient(doc);
      const key = normalizedLookupKey(`${client.firstName || ""} ${client.lastName || ""}`);
      if (key && !clientsByName.has(key)) {
        clientsByName.set(key, client);
      }
    });

    const now = new Date().toISOString();
    const batch = firestore.batch();
    const skipped = [];
    const settings = await loadSchedulingSettings();
    let importedCount = 0;

    for (const [index, row] of appointmentRows.entries()) {
      const payload = cleanAppointmentPayload(row);
      const rowNumber = Number(row.rowNumber) || index + 1;

      const clientError = await resolveAppointmentImportClients(payload, clientsByName, { allowNameOnly: true });

      if (clientError || !payload.appointmentDate || !payload.appointmentTime) {
        skipped.push({
          rowNumber,
          reason: clientError || "Appointment date and time are required."
        });
        continue;
      }

      if (!appointmentFitsSchedulingWindow(payload, settings)) {
        skipped.push({
          rowNumber,
          reason: schedulingWindowError(payload, settings)
        });
        continue;
      }

      const conflict = await findAppointmentConflict(payload);

      if (conflict) {
        skipped.push({
          rowNumber,
          reason: `Overlaps ${conflict.clientName || "another appointment"} at ${formatAppointmentTimeValue(conflict.appointmentTime)}.`
        });
        continue;
      }

      const docRef = appointments.doc();
      batch.set(docRef, {
        ...payload,
        importedFrom: cleanString(row.importSource) || "Appointments CSV",
        importedAt: now,
        createdAt: now,
        updatedAt: now,
        createdBy: request.user.email
      });
      importedCount += 1;
    }

    if (importedCount) {
      await batch.commit();
    }

    response.status(201).json({
      importedCount,
      skipped
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/appointments/:appointmentId", requireAuth, async (request, response, next) => {
  try {
    const appointmentId = cleanString(request.params.appointmentId);

    if (!appointmentId) {
      response.status(400).json({
        error: "Appointment ID is required."
      });
      return;
    }

    const docRef = appointments.doc(appointmentId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Appointment was not found."
      });
      return;
    }

    const payload = cleanAppointmentPayload(request.body);

    if ((!payload.clientIds.length && !payload.clientNames.length) || !payload.appointmentDate || !payload.appointmentTime) {
      response.status(400).json({
        error: "Client or referral name, appointment date, and appointment time are required."
      });
      return;
    }

    const now = new Date().toISOString();
    const settings = await loadSchedulingSettings();

    if (!appointmentFitsSchedulingWindow(payload, settings)) {
      response.status(400).json({
        error: schedulingWindowError(payload, settings)
      });
      return;
    }

    const conflict = await findAppointmentConflict(payload, appointmentId);

    if (conflict) {
      response.status(409).json({
        error: `That time overlaps ${conflict.clientName || "another appointment"} at ${formatAppointmentTimeValue(conflict.appointmentTime)}. Choose a different time or add the client to that appointment.`
      });
      return;
    }

    await docRef.update({
      ...payload,
      updatedAt: now,
      updatedBy: request.user.email
    });
    const updated = await docRef.get();
    const completedRescheduleTasks = await completeRescheduleTasksForAppointment(payload, request.user.email, now);

    response.json({
      appointment: toAppointment(updated),
      completedRescheduleTasks
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/appointments/:appointmentId/prep", requireAuth, async (request, response, next) => {
  try {
    const appointmentId = cleanString(request.params.appointmentId);
    const key = cleanString(request.body?.key);

    if (!appointmentId) {
      response.status(400).json({ error: "Appointment ID is required." });
      return;
    }

    if (!allowedAppointmentPrepKeys.has(key) || typeof request.body?.checked !== "boolean") {
      response.status(400).json({ error: "A valid prep item and checked state are required." });
      return;
    }

    const docRef = appointments.doc(appointmentId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({ error: "Appointment was not found." });
      return;
    }

    const prepChecklist = {
      ...cleanAppointmentPrepChecklist(snapshot.data().prepChecklist),
      [key]: request.body.checked
    };

    await docRef.update({
      prepChecklist,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });

    response.json({ prepChecklist });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/appointments/:appointmentId", requireAuth, async (request, response, next) => {
  try {
    const appointmentId = cleanString(request.params.appointmentId);

    if (!appointmentId) {
      response.status(400).json({
        error: "Appointment ID is required."
      });
      return;
    }

    const docRef = appointments.doc(appointmentId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Appointment was not found."
      });
      return;
    }

    await docRef.delete();

    response.json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/tasks", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(tasks.orderBy("createdAt", "desc"));

    response.json({
      tasks: documents.map(toTask)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/tasks", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanTaskPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.title) {
      response.status(400).json({
        error: "Task title is required."
      });
      return;
    }

    if (payload.clientId && !payload.clientName) {
      const clientSnapshot = await clients.doc(payload.clientId).get();
      if (clientSnapshot.exists) {
        const client = toClient(clientSnapshot);
        payload.clientName = `${client.firstName || ""} ${client.lastName || ""}`.trim();
      }
    }

    const existingStartDayTask = await findExistingStartDayTask(payload);

    if (existingStartDayTask) {
      response.json({
        task: toTask(existingStartDayTask),
        duplicate: true
      });
      return;
    }

    const docRef = await tasks.add({
      ...payload,
      completedAt: payload.status === "Done" ? now : "",
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      task: toTask(created),
      duplicate: false
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/tasks/:taskId", requireAuth, async (request, response, next) => {
  try {
    const taskId = cleanString(request.params.taskId);

    if (!taskId) {
      response.status(400).json({
        error: "Task ID is required."
      });
      return;
    }

    const docRef = tasks.doc(taskId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Task was not found."
      });
      return;
    }

    const payload = cleanTaskPayload(request.body);

    if (!payload.title) {
      response.status(400).json({
        error: "Task title is required."
      });
      return;
    }

    if (payload.clientId && !payload.clientName) {
      const clientSnapshot = await clients.doc(payload.clientId).get();
      if (clientSnapshot.exists) {
        const client = toClient(clientSnapshot);
        payload.clientName = `${client.firstName || ""} ${client.lastName || ""}`.trim();
      }
    }

    const existingTask = toTask(snapshot);
    const now = new Date().toISOString();

    await docRef.update({
      ...payload,
      completedAt: payload.status === "Done" ? existingTask.completedAt || now : "",
      updatedAt: now,
      updatedBy: request.user.email
    });
    const updated = await docRef.get();

    response.json({
      task: toTask(updated)
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/tasks/:taskId", requireAuth, async (request, response, next) => {
  try {
    const taskId = cleanString(request.params.taskId);

    if (!taskId) {
      response.status(400).json({
        error: "Task ID is required."
      });
      return;
    }

    const docRef = tasks.doc(taskId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Task was not found."
      });
      return;
    }

    await docRef.delete();

    response.json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/activity-logs", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(activityLogs.orderBy("occurredAt", "desc"));

    response.json({
      activityLogs: documents.map(toActivityLog)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/activity-logs", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanActivityLogPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.relatedId) {
      response.status(400).json({
        error: "Choose a client or referral before logging activity."
      });
      return;
    }

    if (!payload.activityDate) {
      response.status(400).json({
        error: "Activity date is required."
      });
      return;
    }

    const relatedCollection = payload.relatedType === "referral" ? referrals : clients;
    const relatedRef = relatedCollection.doc(payload.relatedId);
    const relatedSnapshot = await relatedRef.get();

    if (!relatedSnapshot.exists) {
      response.status(404).json({
        error: "The related profile was not found."
      });
      return;
    }

    const relatedData = relatedSnapshot.data();
    const docRef = await activityLogs.add({
      ...payload,
      relatedName: payload.relatedName || `${relatedData.firstName || ""} ${relatedData.lastName || ""}`.trim(),
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });

    const contactUpdates = {
      mostRecentContactDate: payload.activityDate,
      updatedAt: now,
      updatedBy: request.user.email
    };

    if (!relatedData.firstContactDate) {
      contactUpdates.firstContactDate = payload.activityDate;
    }

    await relatedRef.update(contactUpdates);
    const created = await docRef.get();

    response.status(201).json({
      activityLog: toActivityLog(created)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/grants", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(grants.orderBy("deadlineDate"));

    response.json({
      grants: documents.map(toGrant)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/grants", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanGrantPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.foundationName && !payload.grantName) {
      response.status(400).json({
        error: "Foundation or grant name is required."
      });
      return;
    }

    const docRef = await grants.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      grant: toGrant(created)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/grants/:grantId", requireAuth, async (request, response, next) => {
  try {
    const grantRef = grants.doc(request.params.grantId);
    const snapshot = await grantRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Grant not found."
      });
      return;
    }

    const payload = cleanGrantPayload(request.body);

    if (!payload.foundationName && !payload.grantName) {
      response.status(400).json({
        error: "Foundation or grant name is required."
      });
      return;
    }

    await grantRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    const updated = await grantRef.get();

    response.json({
      grant: toGrant(updated)
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/grants/:grantId", requireAuth, async (request, response, next) => {
  try {
    const grantRef = grants.doc(request.params.grantId);
    const snapshot = await grantRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Grant not found."
      });
      return;
    }

    await grantRef.delete();

    response.json({
      deleted: true
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/grant-questions", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(grantQuestions.orderBy("updatedAt", "desc"));

    response.json({
      questions: documents.map(toGrantQuestion)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/grant-questions", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanGrantQuestionPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.prompt || !payload.answer) {
      response.status(400).json({
        error: "Question and answer are required."
      });
      return;
    }

    const docRef = await grantQuestions.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      question: toGrantQuestion(created)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/grant-questions/:questionId", requireAuth, async (request, response, next) => {
  try {
    const questionRef = grantQuestions.doc(request.params.questionId);
    const snapshot = await questionRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Grant question not found."
      });
      return;
    }

    const payload = cleanGrantQuestionPayload(request.body);

    if (!payload.prompt || !payload.answer) {
      response.status(400).json({
        error: "Question and answer are required."
      });
      return;
    }

    await questionRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    const updated = await questionRef.get();

    response.json({
      question: toGrantQuestion(updated)
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/grant-questions/:questionId", requireAuth, async (request, response, next) => {
  try {
    const questionRef = grantQuestions.doc(request.params.questionId);
    const snapshot = await questionRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Grant question not found."
      });
      return;
    }

    await questionRef.delete();

    response.json({
      deleted: true
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/grant-organization-info", requireAuth, async (_request, response, next) => {
  try {
    const snapshot = await adminSettings.doc("grantOrganizationInfo").get();

    response.json({
      organizationInfo: toGrantOrganizationInfo(snapshot)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/grant-organization-info", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanGrantOrganizationInfoPayload(request.body);
    const docRef = adminSettings.doc("grantOrganizationInfo");

    await docRef.set({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    }, { merge: true });

    const updated = await docRef.get();

    response.json({
      organizationInfo: toGrantOrganizationInfo(updated)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/referral-network", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(referralNetwork.orderBy("name"));

    response.json({
      entries: documents.map(toReferralNetworkEntry)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/referral-network", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanReferralNetworkPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.name) {
      response.status(400).json({
        error: "Referral network name is required."
      });
      return;
    }

    const docRef = await referralNetwork.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      entry: toReferralNetworkEntry(created)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/referral-network/import", requireAuth, async (request, response, next) => {
  try {
    const entries = Array.isArray(request.body.entries) ? request.body.entries : [];

    if (!entries.length) {
      response.status(400).json({
        error: "No referral network entries were provided for import."
      });
      return;
    }

    if (entries.length > 250) {
      response.status(400).json({
        error: "Import is limited to 250 organizations at a time."
      });
      return;
    }

    const now = new Date().toISOString();
    const existingDocuments = await fetchAllDocuments(referralNetwork);
    const existingByName = new Map();

    existingDocuments.forEach((doc) => {
      const data = doc.data();
      const key = normalizedLookupKey(data.name);
      if (key) {
        existingByName.set(key, { doc, data });
      }
    });

    const batch = firestore.batch();
    let createdCount = 0;
    let updatedCount = 0;
    let providerCount = 0;
    const skipped = [];

    entries.forEach((entry, index) => {
      const payload = cleanReferralNetworkPayload(entry);
      const rowNumber = Number(entry.rowNumber) || index + 1;

      if (!payload.name) {
        skipped.push({
          rowNumber,
          reason: "Organization name is required."
        });
        return;
      }

      const key = normalizedLookupKey(payload.name);
      const existing = existingByName.get(key);
      const incomingProviders = payload.providers;
      providerCount += incomingProviders.length;

      if (existing) {
        const providerByKey = new Map();
        const existingProviders = Array.isArray(existing.data.providers) ? existing.data.providers : [];

        existingProviders.forEach((provider) => {
          providerByKey.set(`${normalizedLookupKey(provider.name)}|${normalizedLookupKey(provider.email)}`, cleanNetworkProvider(provider));
        });

        incomingProviders.forEach((provider) => {
          providerByKey.set(`${normalizedLookupKey(provider.name)}|${normalizedLookupKey(provider.email)}`, provider);
        });

        batch.update(existing.doc.ref, {
          type: payload.type || existing.data.type || "",
          contactName: payload.contactName || existing.data.contactName || "",
          phone: payload.phone || existing.data.phone || "",
          email: payload.email || existing.data.email || "",
          website: payload.website || existing.data.website || "",
          providers: [...providerByKey.values()],
          notes: payload.notes || existing.data.notes || "",
          importedFrom: "Zoho Providers CSV",
          importedAt: now,
          updatedAt: now,
          updatedBy: request.user.email
        });
        updatedCount += 1;
        return;
      }

      const docRef = referralNetwork.doc();
      batch.set(docRef, {
        ...payload,
        importedFrom: "Zoho Providers CSV",
        importedAt: now,
        createdAt: now,
        updatedAt: now,
        createdBy: request.user.email
      });
      existingByName.set(key, { doc: { ref: docRef }, data: payload });
      createdCount += 1;
    });

    if (createdCount + updatedCount > 0) {
      await batch.commit();
    }

    response.status(201).json({
      createdCount,
      updatedCount,
      providerCount,
      skipped
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/referral-network/:entryId", requireAuth, async (request, response, next) => {
  try {
    const entryId = cleanString(request.params.entryId);

    if (!entryId) {
      response.status(400).json({
        error: "Referral network entry ID is required."
      });
      return;
    }

    const docRef = referralNetwork.doc(entryId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Referral network entry was not found."
      });
      return;
    }

    const updates = {
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    };

    for (const field of ["name", "type", "contactName", "phone", "email", "website", "notes"]) {
      if (Object.hasOwn(request.body, field)) {
        updates[field] = cleanString(request.body[field]);
      }
    }

    if (Object.hasOwn(request.body, "providers")) {
      updates.providers = Array.isArray(request.body.providers)
        ? request.body.providers.map(cleanNetworkProvider).filter((provider) => provider.name)
        : [];
    }

    if (Object.hasOwn(updates, "name") && !updates.name) {
      response.status(400).json({
        error: "Referral network name is required."
      });
      return;
    }

    await docRef.update(updates);
    const updated = await docRef.get();

    response.json({
      entry: toReferralNetworkEntry(updated)
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/referral-network/:entryId", requireAuth, async (request, response, next) => {
  try {
    const entryId = cleanString(request.params.entryId);

    if (!entryId) {
      response.status(400).json({
        error: "Referral network entry ID is required."
      });
      return;
    }

    const docRef = referralNetwork.doc(entryId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Referral network entry was not found."
      });
      return;
    }

    await docRef.delete();

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get("/api/outreach-events", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(outreachEvents.orderBy("eventDate", "desc"));

    response.json({
      events: documents.map(toOutreachEvent)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/outreach-events", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanOutreachEventPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.name) {
      response.status(400).json({
        error: "Outreach event name is required."
      });
      return;
    }

    const docRef = await outreachEvents.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      event: toOutreachEvent(created)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/outreach-events/:eventId", requireAuth, async (request, response, next) => {
  try {
    const eventId = cleanString(request.params.eventId);

    if (!eventId) {
      response.status(400).json({
        error: "Outreach event ID is required."
      });
      return;
    }

    const docRef = outreachEvents.doc(eventId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach event was not found."
      });
      return;
    }

    const payload = cleanOutreachEventPayload(request.body);

    if (Object.hasOwn(request.body, "name") && !payload.name) {
      response.status(400).json({
        error: "Outreach event name is required."
      });
      return;
    }

    await docRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    const updated = await docRef.get();

    response.json({
      event: toOutreachEvent(updated)
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/outreach-events/:eventId", requireAuth, async (request, response, next) => {
  try {
    const eventId = cleanString(request.params.eventId);

    if (!eventId) {
      response.status(400).json({
        error: "Outreach event ID is required."
      });
      return;
    }

    const docRef = outreachEvents.doc(eventId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach event was not found."
      });
      return;
    }

    await docRef.delete();

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get("/api/outreach-contacts", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(outreachContacts.orderBy("createdAt", "desc"));

    response.json({
      contacts: documents.map(toOutreachContact)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/outreach-contacts", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanOutreachContactPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.contactName && !payload.childName) {
      response.status(400).json({
        error: "Contact name or child name is required."
      });
      return;
    }

    if (!payload.phone && !payload.email) {
      response.status(400).json({
        error: "Phone or email is required."
      });
      return;
    }

    const docRef = await outreachContacts.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      contact: toOutreachContact(created)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/outreach-contacts/:contactId", requireAuth, async (request, response, next) => {
  try {
    const contactId = cleanString(request.params.contactId);

    if (!contactId) {
      response.status(400).json({
        error: "Outreach contact ID is required."
      });
      return;
    }

    const docRef = outreachContacts.doc(contactId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach contact was not found."
      });
      return;
    }

    const payload = cleanOutreachContactPayload(request.body);

    if (Object.hasOwn(request.body, "contactName") && !payload.contactName && !payload.childName) {
      response.status(400).json({
        error: "Contact name or child name is required."
      });
      return;
    }

    await docRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    const updated = await docRef.get();

    response.json({
      contact: toOutreachContact(updated)
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/outreach-contacts/:contactId", requireAuth, async (request, response, next) => {
  try {
    const contactId = cleanString(request.params.contactId);

    if (!contactId) {
      response.status(400).json({
        error: "Outreach contact ID is required."
      });
      return;
    }

    const docRef = outreachContacts.doc(contactId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Outreach contact was not found."
      });
      return;
    }

    await docRef.delete();

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post("/api/clients", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanPersonPayload(request.body);
    const status = cleanString(request.body.status) || "Scheduled";
    const now = new Date().toISOString();

    if (!validateRequiredPersonFields(payload, response)) {
      return;
    }

    if (status && !allowedClientStatuses.has(status)) {
      response.status(400).json({
        error: "Client status is not valid."
      });
      return;
    }

    if (payload.referralType && !allowedReferralTypes.has(payload.referralType)) {
      response.status(400).json({
        error: "Referral type is not valid."
      });
      return;
    }

    const docRef = await clients.add({
      ...payload,
      status,
      providerLinks: Array.isArray(request.body.providerLinks)
        ? request.body.providerLinks.map(cleanProviderLink).filter((link) => link.networkId && link.providerId)
        : [],
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      client: toClient(created)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/clients/import", requireAuth, async (request, response, next) => {
  try {
    const clientRows = Array.isArray(request.body.clients) ? request.body.clients : [];

    if (!clientRows.length) {
      response.status(400).json({
        error: "No clients were provided for import."
      });
      return;
    }

    if (clientRows.length > 450) {
      response.status(400).json({
        error: "Import is limited to 450 clients at a time."
      });
      return;
    }

    const now = new Date().toISOString();
    const batch = firestore.batch();
    const skipped = [];
    const recordsToImport = [];
    const recordsByZohoId = new Map();

    clientRows.forEach((row, index) => {
      const payload = cleanPersonPayload(row);
      const status = cleanString(row.status) || "Scheduled";
      const rowNumber = Number(row.rowNumber) || index + 1;
      const zohoRecordId = cleanString(row.zohoRecordId);

      if (!hasRequiredPersonFields(payload)) {
        skipped.push({
          rowNumber,
          reason: "Missing required fields."
        });
        return;
      }

      if (status && !allowedClientStatuses.has(status)) {
        skipped.push({
          rowNumber,
          reason: "Client status is not valid."
        });
        return;
      }

      if (payload.referralType && !allowedReferralTypes.has(payload.referralType)) {
        skipped.push({
          rowNumber,
          reason: "Referral type is not valid."
        });
        return;
      }

      const docRef = clients.doc();
      const record = {
        docRef,
        payload,
        row,
        status,
        zohoRecordId
      };
      recordsToImport.push(record);

      if (zohoRecordId) {
        recordsByZohoId.set(zohoRecordId, record);
      }
    });

    recordsToImport.forEach((record) => {
      batch.set(record.docRef, {
        ...record.payload,
        status: record.status,
        siblingIds: siblingIdsForImportedRecord(record, recordsByZohoId, recordsToImport),
        zohoRecordId: record.zohoRecordId,
        importedFrom: "Zoho CSV",
        importedAt: now,
        createdAt: now,
        updatedAt: now,
        createdBy: request.user.email
      });
    });

    if (recordsToImport.length > 0) {
      await batch.commit();
    }

    response.status(201).json({
      importedCount: recordsToImport.length,
      skipped
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/clients/:clientId", requireAuth, async (request, response, next) => {
  try {
    const clientId = cleanString(request.params.clientId);
    const hasStatusUpdate = Object.hasOwn(request.body, "status");
    const status = hasStatusUpdate ? cleanString(request.body.status) : "";

    if (!clientId) {
      response.status(400).json({
        error: "Client ID is required."
      });
      return;
    }

    if (hasStatusUpdate && !allowedClientStatuses.has(status)) {
      response.status(400).json({
        error: "Client status is not valid."
      });
      return;
    }

    const docRef = clients.doc(clientId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Client was not found."
      });
      return;
    }

    const updates = {
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    };

    if (hasStatusUpdate) {
      updates.status = status;
    }

    for (const field of [
      "firstName",
      "lastName",
      "parentName",
      "dateOfBirth",
      "gender",
      "phone",
      "email",
      "preferredLanguage",
      "preferredContactMethod",
      "referralType",
      "referralSource",
      "referralDate",
      "firstContactDate",
      "mostRecentContactDate",
      "firstAppointmentDate",
      "mostRecentAppointmentDate",
      "lastAppointmentDate",
      "currentLesson",
      "addressStreet",
      "addressCity",
      "addressState",
      "addressZip",
      "notes"
    ]) {
      if (Object.hasOwn(request.body, field)) {
        updates[field] = cleanString(request.body[field]);
      }
    }

    if (Object.hasOwn(request.body, "assessmentScore")) {
      updates.assessmentScore = cleanOptionalNumber(request.body.assessmentScore);
    }

    if (Object.hasOwn(request.body, "willingnessScore")) {
      updates.willingnessScore = cleanOptionalNumber(request.body.willingnessScore);
    }

    if (Object.hasOwn(request.body, "emailOptOut")) {
      updates.emailOptOut = cleanBoolean(request.body.emailOptOut);
    }

    if (Object.hasOwn(request.body, "textOptOut")) {
      updates.textOptOut = cleanBoolean(request.body.textOptOut);
    }

    if (Object.hasOwn(request.body, "ycco")) {
      updates.ycco = cleanBoolean(request.body.ycco);
    }

    if (Object.hasOwn(request.body, "hrsn")) {
      updates.hrsn = cleanBoolean(request.body.hrsn);
    }

    if (Object.hasOwn(request.body, "providerLinks")) {
      updates.providerLinks = Array.isArray(request.body.providerLinks)
        ? request.body.providerLinks.map(cleanProviderLink).filter((link) => link.networkId && link.providerId)
        : [];
    }

    if (Object.hasOwn(updates, "firstName") && !updates.firstName) {
      response.status(400).json({
        error: "First name is required."
      });
      return;
    }

    if (Object.hasOwn(updates, "lastName") && !updates.lastName) {
      response.status(400).json({
        error: "Last name is required."
      });
      return;
    }

    if (Object.hasOwn(updates, "parentName") && !updates.parentName) {
      response.status(400).json({
        error: "Caregiver name is required."
      });
      return;
    }

    if (Object.hasOwn(updates, "phone") && !updates.phone) {
      response.status(400).json({
        error: "Phone is required."
      });
      return;
    }

    if (Object.hasOwn(updates, "preferredLanguage") && !updates.preferredLanguage) {
      response.status(400).json({
        error: "Preferred language is required."
      });
      return;
    }

    if (Object.hasOwn(updates, "referralType") && updates.referralType && !allowedReferralTypes.has(updates.referralType)) {
      response.status(400).json({
        error: "Referral type is not valid."
      });
      return;
    }

    await docRef.update(updates);
    const updated = await docRef.get();

    response.json({
      client: toClient(updated)
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/clients/:clientId", requireAuth, async (request, response, next) => {
  try {
    const clientId = cleanString(request.params.clientId);

    if (!clientId) {
      response.status(400).json({
        error: "Client ID is required."
      });
      return;
    }

    const docRef = clients.doc(clientId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Client was not found."
      });
      return;
    }

    const siblingIds = Array.isArray(snapshot.data().siblingIds) ? snapshot.data().siblingIds : [];
    await Promise.all(
      siblingIds.map((siblingId) =>
        clients.doc(siblingId).update({
          siblingIds: FieldValue.arrayRemove(clientId),
          updatedAt: new Date().toISOString(),
          updatedBy: request.user.email
        })
      )
    );
    await docRef.delete();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post("/api/clients/:clientId/siblings", requireAuth, async (request, response, next) => {
  try {
    const clientId = cleanString(request.params.clientId);
    const siblingId = cleanString(request.body.siblingId);

    if (!clientId || !siblingId) {
      response.status(400).json({
        error: "Client ID and sibling ID are required."
      });
      return;
    }

    if (clientId === siblingId) {
      response.status(400).json({
        error: "A client cannot be linked as their own sibling."
      });
      return;
    }

    const clientRef = clients.doc(clientId);
    const siblingRef = clients.doc(siblingId);
    const [clientSnapshot, siblingSnapshot] = await Promise.all([clientRef.get(), siblingRef.get()]);

    if (!clientSnapshot.exists || !siblingSnapshot.exists) {
      response.status(404).json({
        error: "Client or sibling was not found."
      });
      return;
    }

    const now = new Date().toISOString();
    await Promise.all([
      clientRef.update({
        siblingIds: FieldValue.arrayUnion(siblingId),
        updatedAt: now,
        updatedBy: request.user.email
      }),
      siblingRef.update({
        siblingIds: FieldValue.arrayUnion(clientId),
        updatedAt: now,
        updatedBy: request.user.email
      })
    ]);

    const updated = await clientRef.get();

    response.json({
      client: toClient(updated)
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/clients/:clientId/siblings/:siblingId", requireAuth, async (request, response, next) => {
  try {
    const clientId = cleanString(request.params.clientId);
    const siblingId = cleanString(request.params.siblingId);

    if (!clientId || !siblingId) {
      response.status(400).json({
        error: "Client ID and sibling ID are required."
      });
      return;
    }

    const clientRef = clients.doc(clientId);
    const siblingRef = clients.doc(siblingId);
    const [clientSnapshot, siblingSnapshot] = await Promise.all([clientRef.get(), siblingRef.get()]);

    if (!clientSnapshot.exists || !siblingSnapshot.exists) {
      response.status(404).json({
        error: "Client or sibling was not found."
      });
      return;
    }

    const now = new Date().toISOString();
    await Promise.all([
      clientRef.update({
        siblingIds: FieldValue.arrayRemove(siblingId),
        updatedAt: now,
        updatedBy: request.user.email
      }),
      siblingRef.update({
        siblingIds: FieldValue.arrayRemove(clientId),
        updatedAt: now,
        updatedBy: request.user.email
      })
    ]);

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post("/api/referrals", requireAuth, async (request, response, next) => {
  try {
    const firstName = cleanString(request.body.firstName);
    const lastName = cleanString(request.body.lastName);
    const parentName = cleanString(request.body.parentName);
    const dateOfBirth = cleanString(request.body.dateOfBirth);
    const gender = cleanString(request.body.gender);
    const phone = cleanString(request.body.phone);
    const email = cleanString(request.body.email);
    const preferredLanguage = cleanString(request.body.preferredLanguage);
    const preferredContactMethod = cleanString(request.body.preferredContactMethod);
    const referralType = cleanString(request.body.referralType);
    const referralSource = cleanString(request.body.referralSource);
    const referralDate = cleanString(request.body.referralDate);
    const firstContactDate = cleanString(request.body.firstContactDate);
    const mostRecentContactDate = cleanString(request.body.mostRecentContactDate);
    const firstAppointmentDate = cleanString(request.body.firstAppointmentDate);
    const mostRecentAppointmentDate = cleanString(request.body.mostRecentAppointmentDate);
    const lastAppointmentDate = cleanString(request.body.lastAppointmentDate);
    const addressStreet = cleanString(request.body.addressStreet);
    const addressCity = cleanString(request.body.addressCity);
    const addressState = cleanString(request.body.addressState);
    const addressZip = cleanString(request.body.addressZip);
    const emailOptOut = cleanBoolean(request.body.emailOptOut);
    const textOptOut = cleanBoolean(request.body.textOptOut);
    const ycco = cleanBoolean(request.body.ycco);
    const hrsn = cleanBoolean(request.body.hrsn);
    const assessmentScore = cleanOptionalNumber(request.body.assessmentScore);
    const willingnessScore = cleanOptionalNumber(request.body.willingnessScore);
    const notes = cleanString(request.body.notes);
    const now = new Date().toISOString();

    if (!firstName || !lastName || !parentName || !phone || !preferredLanguage || !referralType) {
      response.status(400).json({
        error: "Child name, caregiver name, phone, preferred language, and referral type are required."
      });
      return;
    }

    if (!allowedReferralTypes.has(referralType)) {
      response.status(400).json({
        error: "Referral type is not valid."
      });
      return;
    }

    const docRef = await referrals.add({
      firstName,
      lastName,
      parentName,
      dateOfBirth,
      gender,
      phone,
      email,
      preferredLanguage,
      preferredContactMethod,
      referralType,
      referralSource,
      referralDate: referralDate || now.slice(0, 10),
      firstContactDate,
      mostRecentContactDate,
      firstAppointmentDate,
      mostRecentAppointmentDate,
      lastAppointmentDate,
      addressStreet,
      addressCity,
      addressState,
      addressZip,
      emailOptOut,
      textOptOut,
      ycco,
      hrsn,
      assessmentScore,
      willingnessScore,
      status: "New",
      notes,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      referral: toReferral(created)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/referrals/import", requireAuth, async (request, response, next) => {
  try {
    const referralRows = Array.isArray(request.body.referrals) ? request.body.referrals : [];

    if (!referralRows.length) {
      response.status(400).json({
        error: "No referrals were provided for import."
      });
      return;
    }

    if (referralRows.length > 450) {
      response.status(400).json({
        error: "Import is limited to 450 referrals at a time."
      });
      return;
    }

    const now = new Date().toISOString();
    const batch = firestore.batch();
    const skipped = [];
    const recordsToImport = [];
    const recordsByZohoId = new Map();

    referralRows.forEach((row, index) => {
      const payload = cleanPersonPayload(row);
      const status = normalizeStatus(row.status);
      const rowNumber = Number(row.rowNumber) || index + 1;
      const zohoRecordId = cleanString(row.zohoRecordId);

      if (!hasRequiredPersonFields(payload) || !payload.referralType) {
        skipped.push({
          rowNumber,
          reason: "Missing required fields."
        });
        return;
      }

      if (!allowedReferralStatuses.has(status)) {
        skipped.push({
          rowNumber,
          reason: "Referral status is not valid."
        });
        return;
      }

      if (!allowedReferralTypes.has(payload.referralType)) {
        skipped.push({
          rowNumber,
          reason: "Referral type is not valid."
        });
        return;
      }

      const docRef = referrals.doc();
      const record = {
        docRef,
        payload,
        row,
        status,
        zohoRecordId,
        importedFrom: cleanString(row.importSource) || "Zoho CSV"
      };
      recordsToImport.push(record);

      if (zohoRecordId) {
        recordsByZohoId.set(zohoRecordId, record);
      }
    });

    recordsToImport.forEach((record) => {
      batch.set(record.docRef, {
        ...record.payload,
        status: record.status,
        referralDate: record.payload.referralDate || now.slice(0, 10),
        siblingIds: siblingIdsForImportedRecord(record, recordsByZohoId, recordsToImport),
        zohoRecordId: record.zohoRecordId,
        importedFrom: record.importedFrom,
        importedAt: now,
        createdAt: now,
        updatedAt: now,
        createdBy: request.user.email
      });
    });

    if (recordsToImport.length > 0) {
      await batch.commit();
    }

    response.status(201).json({
      importedCount: recordsToImport.length,
      skipped
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/referrals/:referralId", requireAuth, async (request, response, next) => {
  try {
    const referralId = cleanString(request.params.referralId);

    if (!referralId) {
      response.status(400).json({
        error: "Referral ID is required."
      });
      return;
    }

    const docRef = referrals.doc(referralId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Referral was not found."
      });
      return;
    }

    const siblingIds = Array.isArray(snapshot.data().siblingIds) ? snapshot.data().siblingIds : [];
    await Promise.all(
      siblingIds.map((siblingId) =>
        referrals.doc(siblingId).update({
          siblingIds: FieldValue.arrayRemove(referralId),
          updatedAt: new Date().toISOString(),
          updatedBy: request.user.email
        })
      )
    );
    await docRef.delete();

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post("/api/referrals/:referralId/siblings", requireAuth, async (request, response, next) => {
  try {
    const referralId = cleanString(request.params.referralId);
    const siblingId = cleanString(request.body.siblingId);

    if (!referralId || !siblingId) {
      response.status(400).json({
        error: "Referral ID and sibling ID are required."
      });
      return;
    }

    if (referralId === siblingId) {
      response.status(400).json({
        error: "A referral cannot be linked as their own sibling."
      });
      return;
    }

    const referralRef = referrals.doc(referralId);
    const siblingRef = referrals.doc(siblingId);
    const [referralSnapshot, siblingSnapshot] = await Promise.all([referralRef.get(), siblingRef.get()]);

    if (!referralSnapshot.exists || !siblingSnapshot.exists) {
      response.status(404).json({
        error: "Referral or sibling was not found."
      });
      return;
    }

    const now = new Date().toISOString();
    await Promise.all([
      referralRef.update({
        siblingIds: FieldValue.arrayUnion(siblingId),
        updatedAt: now,
        updatedBy: request.user.email
      }),
      siblingRef.update({
        siblingIds: FieldValue.arrayUnion(referralId),
        updatedAt: now,
        updatedBy: request.user.email
      })
    ]);

    const updated = await referralRef.get();

    response.json({
      referral: toReferral(updated)
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/referrals/:referralId/siblings/:siblingId", requireAuth, async (request, response, next) => {
  try {
    const referralId = cleanString(request.params.referralId);
    const siblingId = cleanString(request.params.siblingId);

    if (!referralId || !siblingId) {
      response.status(400).json({
        error: "Referral ID and sibling ID are required."
      });
      return;
    }

    const referralRef = referrals.doc(referralId);
    const siblingRef = referrals.doc(siblingId);
    const [referralSnapshot, siblingSnapshot] = await Promise.all([referralRef.get(), siblingRef.get()]);

    if (!referralSnapshot.exists || !siblingSnapshot.exists) {
      response.status(404).json({
        error: "Referral or sibling was not found."
      });
      return;
    }

    const now = new Date().toISOString();
    await Promise.all([
      referralRef.update({
        siblingIds: FieldValue.arrayRemove(siblingId),
        updatedAt: now,
        updatedBy: request.user.email
      }),
      siblingRef.update({
        siblingIds: FieldValue.arrayRemove(referralId),
        updatedAt: now,
        updatedBy: request.user.email
      })
    ]);

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.patch("/api/referrals/:referralId", requireAuth, async (request, response, next) => {
  try {
    const referralId = cleanString(request.params.referralId);
    const hasStatusUpdate = Object.hasOwn(request.body, "status");
    const status = hasStatusUpdate ? normalizeStatus(request.body.status) : "";

    if (!referralId) {
      response.status(400).json({
        error: "Referral ID is required."
      });
      return;
    }

    if (hasStatusUpdate && !allowedReferralStatuses.has(status)) {
      response.status(400).json({
        error: "Referral status is not valid."
      });
      return;
    }

    const docRef = referrals.doc(referralId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Referral was not found."
      });
      return;
    }

    const updates = {
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    };

    if (hasStatusUpdate) {
      updates.status = status;
    }

    for (const field of [
      "firstName",
      "lastName",
      "parentName",
      "dateOfBirth",
      "gender",
      "phone",
      "email",
      "preferredLanguage",
      "preferredContactMethod",
      "referralType",
      "referralSource",
      "referralDate",
      "firstContactDate",
      "mostRecentContactDate",
      "firstAppointmentDate",
      "mostRecentAppointmentDate",
      "lastAppointmentDate",
      "addressStreet",
      "addressCity",
      "addressState",
      "addressZip",
      "notes"
    ]) {
      if (Object.hasOwn(request.body, field)) {
        updates[field] = cleanString(request.body[field]);
      }
    }

    if (Object.hasOwn(request.body, "assessmentScore")) {
      updates.assessmentScore = cleanOptionalNumber(request.body.assessmentScore);
    }

    if (Object.hasOwn(request.body, "willingnessScore")) {
      updates.willingnessScore = cleanOptionalNumber(request.body.willingnessScore);
    }

    if (Object.hasOwn(request.body, "emailOptOut")) {
      updates.emailOptOut = cleanBoolean(request.body.emailOptOut);
    }

    if (Object.hasOwn(request.body, "textOptOut")) {
      updates.textOptOut = cleanBoolean(request.body.textOptOut);
    }

    if (Object.hasOwn(request.body, "ycco")) {
      updates.ycco = cleanBoolean(request.body.ycco);
    }

    if (Object.hasOwn(request.body, "hrsn")) {
      updates.hrsn = cleanBoolean(request.body.hrsn);
    }

    if (Object.hasOwn(request.body, "providerLinks")) {
      updates.providerLinks = Array.isArray(request.body.providerLinks)
        ? request.body.providerLinks.map(cleanProviderLink).filter((link) => link.networkId && link.providerId)
        : [];
    }

    if (Object.hasOwn(updates, "firstName") && !updates.firstName) {
      response.status(400).json({
        error: "First name is required."
      });
      return;
    }

    if (Object.hasOwn(updates, "lastName") && !updates.lastName) {
      response.status(400).json({
        error: "Last name is required."
      });
      return;
    }

    if (Object.hasOwn(updates, "parentName") && !updates.parentName) {
      response.status(400).json({
        error: "Caregiver name is required."
      });
      return;
    }

    if (Object.hasOwn(updates, "phone") && !updates.phone) {
      response.status(400).json({
        error: "Phone is required."
      });
      return;
    }

    if (Object.hasOwn(updates, "preferredLanguage") && !updates.preferredLanguage) {
      response.status(400).json({
        error: "Preferred language is required."
      });
      return;
    }

    if (Object.hasOwn(updates, "referralType") && !allowedReferralTypes.has(updates.referralType)) {
      response.status(400).json({
        error: "Referral type is not valid."
      });
      return;
    }

    await docRef.update(updates);
    const updated = await docRef.get();

    response.json({
      referral: toReferral(updated)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/referrals/:referralId/convert", requireAuth, async (request, response, next) => {
  try {
    const referralId = cleanString(request.params.referralId);

    if (!referralId) {
      response.status(400).json({
        error: "Referral ID is required."
      });
      return;
    }

    const referralRef = referrals.doc(referralId);
    const referralSnapshot = await referralRef.get();

    if (!referralSnapshot.exists) {
      response.status(404).json({
        error: "Referral was not found."
      });
      return;
    }

    const referral = toReferral(referralSnapshot);

    if (referral.convertedClientId) {
      const existingClient = await clients.doc(referral.convertedClientId).get();
      response.json({
        client: existingClient.exists ? toClient(existingClient) : null,
        referral
      });
      return;
    }

    const siblingIds = Array.isArray(referral.siblingIds) ? referral.siblingIds : [];
    const siblingSnapshots = await Promise.all(siblingIds.map((siblingId) => referrals.doc(siblingId).get()));
    const convertedSiblingClientIds = siblingSnapshots
      .filter((siblingSnapshot) => siblingSnapshot.exists)
      .map((siblingSnapshot) => toReferral(siblingSnapshot).convertedClientId)
      .filter(Boolean);
    const now = new Date().toISOString();
    const clientRef = await clients.add(
      clientPayloadFromReferral(referral, referralId, {
        now,
        convertedSiblingClientIds,
        createdBy: request.user.email
      })
    );

    await referralRef.update({
      status: "Scheduled",
      convertedClientId: clientRef.id,
      convertedAt: now,
      updatedAt: now,
      updatedBy: request.user.email
    });

    await Promise.all(
      convertedSiblingClientIds.map((siblingClientId) =>
        clients.doc(siblingClientId).update({
          siblingIds: FieldValue.arrayUnion(clientRef.id),
          updatedAt: now,
          updatedBy: request.user.email
        })
      )
    );

    const clientSnapshot = await clientRef.get();
    const updatedReferralSnapshot = await referralRef.get();

    response.status(201).json({
      client: toClient(clientSnapshot),
      referral: toReferral(updatedReferralSnapshot)
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    error: "The SNACK CRM API could not complete the request."
  });
});

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(port, () => {
    console.log(`SNACK CRM API listening on port ${port}`);
  });
}

export {
  allowedAppointmentStatuses,
  allowedClientStatuses,
  allowedReferralStatuses,
  allowedReferralTypes,
  allowedTaskPriorities,
  allowedTaskStatuses,
  allowedTaskTypes,
  app,
  appointmentBlocksSchedule,
  appointmentClientCountFromRecord,
  appointmentDurationMinutesFromRecord,
  appointmentFitsSchedulingWindow,
  appointmentRangesOverlap,
  appointmentTimeMinutes,
  cleanActivityLogPayload,
  cleanAppointmentPrepChecklist,
  cleanAppointmentPayload,
  cleanBoolean,
  cleanGrantDocumentLink,
  cleanGrantOrganizationInfoPayload,
  cleanGrantPayload,
  cleanGrantQuestionPayload,
  cleanNetworkProvider,
  cleanOptionalInteger,
  cleanOptionalNumber,
  cleanOutreachContactPayload,
  cleanOutreachEventPayload,
  cleanPersonPayload,
  cleanProviderLink,
  cleanPublicBookingPayload,
  cleanReferralNetworkPayload,
  cleanSchedulingSettingsPayload,
  cleanSiblingZohoRecordIds,
  cleanString,
  cleanTaskPayload,
  clientPayloadFromReferral,
  daysBetweenDateStrings,
  fetchAllDocuments,
  formatAppointmentTimeValue,
  hasRequiredPersonFields,
  isActiveTaskStatus,
  isGeneratedTaskSource,
  isAdminBulkDeleteEnabled,
  isPublicBookableDate,
  normalizeActivityDirection,
  normalizeActivityType,
  normalizeAppointmentStatus,
  normalizeAppointmentTimeValue,
  normalizeStatus,
  normalizeTaskPriority,
  normalizeTaskStatus,
  normalizeTaskType,
  normalizedLookupKey,
  normalizedTaskTitle,
  publicAppointmentDraft,
  publicBookingServiceFromId,
  publicBookingServices,
  publicBookingValidationError,
  publicManageClientIdsFromAppointment,
  publicManageTokenHash,
  publicManageTokensMatch,
  publicSlotValuesForDate,
  referralSourceFromRecord,
  resolveAppointmentImportClients,
  serializePublicManagedBooking,
  serializeSchedulingSettings,
  schedulingWindowEndLabel,
  schedulingWindowError,
  siblingIdsForImportedRecord,
  startDayTaskIntent,
  startDayTaskSubject,
  tasksMatchStartDayIntent,
  toActivityLog,
  toAppointment,
  toClient,
  toGrant,
  toGrantOrganizationInfo,
  toGrantQuestion,
  toOutreachContact,
  toOutreachEvent,
  toReferral,
  toReferralNetworkEntry,
  toTask
};
