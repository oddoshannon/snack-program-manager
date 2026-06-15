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
const allowedAppointmentStatuses = new Set(["Scheduled", "Completed", "No-show", "Rescheduled", "Canceled"]);
const allowedTaskStatuses = new Set(["Open", "In Progress", "Waiting", "Done", "Canceled"]);
const allowedTaskPriorities = new Set(["Low", "Normal", "Urgent"]);
const allowedTaskTypes = new Set(["Call", "Text", "Form", "Task"]);
const allowedActivityTypes = new Set(["Call", "Text"]);
const allowedActivityDirections = new Set(["Outbound", "Inbound"]);
const defaultAppointmentDurationMinutes = 30;
const schedulingStartMinutes = 13 * 60;
const schedulingEndMinutes = 18 * 60;
const publicSchedulingWeekdays = new Set([2, 3, 4]);
const publicAvailabilityDefaultDays = 21;
const publicAvailabilityMaxDays = 45;
const publicBookingMaxAdvanceDays = 120;
const publicBookingMaxLengths = {
  firstName: 60,
  lastName: 60,
  parentName: 80,
  phone: 30,
  email: 120,
  preferredLanguage: 30,
  preferredContactMethod: 20,
  notes: 600
};
const publicBookingServices = [
  {
    id: "enrollment",
    label: "Enrollment Appointment",
    appointmentType: "Enrollment",
    durationMinutes: 30,
    defaultLanguage: "English"
  },
  {
    id: "nutrition-education",
    label: "Nutrition Education Appointment",
    appointmentType: "Nutrition Education",
    durationMinutes: 30,
    defaultLanguage: "English"
  },
  {
    id: "spanish-enrollment",
    label: "Cita de inscripción en ESPAÑOL",
    appointmentType: "Enrollment",
    durationMinutes: 30,
    defaultLanguage: "Spanish"
  },
  {
    id: "spanish-nutrition-education",
    label: "Cita de educación nutricional en ESPAÑOL",
    appointmentType: "Nutrition Education",
    durationMinutes: 30,
    defaultLanguage: "Spanish"
  },
  {
    id: "sibling-enrollment",
    label: "Sibling Enrollment Appointment",
    appointmentType: "Enrollment",
    durationMinutes: 15,
    defaultLanguage: "English",
    siblingVisit: true
  },
  {
    id: "sibling-nutrition-education",
    label: "Sibling Nutrition Education Appointment",
    appointmentType: "Nutrition Education",
    durationMinutes: 15,
    defaultLanguage: "English",
    siblingVisit: true
  }
];
const publicBookingServiceById = new Map(publicBookingServices.map((service) => [service.id, service]));
const publicBookingAttempts = new Map();
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
    notes: data.notes,
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

function cleanNetworkProvider(provider) {
  const id = cleanString(provider?.id) || crypto.randomUUID();
  return {
    id,
    name: cleanString(provider?.name),
    phone: cleanString(provider?.phone),
    email: cleanString(provider?.email),
    website: cleanString(provider?.website),
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
  const payload = {
    clientId: clientIds[0] || "",
    clientIds,
    clientName: clientNames[0] || cleanString(body.clientName),
    clientNames,
    appointmentDate: cleanString(body.appointmentDate),
    appointmentTime: normalizeAppointmentTimeValue(body.appointmentTime),
    appointmentType: cleanString(body.appointmentType) || (cleanString(body.lesson) ? "Nutrition Education" : "Enrollment"),
    status: normalizeAppointmentStatus(body.status),
    lesson: cleanString(body.lesson),
    goal: cleanString(body.goal),
    staffMember: cleanString(body.staffMember),
    notes: cleanString(body.notes)
  };
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
  return ["Scheduled", "Completed"].includes(appointment.status || "Scheduled");
}

function appointmentFitsSchedulingWindow(appointment) {
  const start = appointmentTimeMinutes(appointment.appointmentTime);

  if (start === null) {
    return false;
  }

  return start >= schedulingStartMinutes && start + appointmentDurationMinutesFromRecord(appointment) <= schedulingEndMinutes;
}

function schedulingWindowEndLabel() {
  return formatAppointmentTimeValue(
    `${String(Math.floor(schedulingEndMinutes / 60)).padStart(2, "0")}:${String(schedulingEndMinutes % 60).padStart(2, "0")}`
  );
}

function schedulingWindowError(appointment) {
  if (appointmentTimeMinutes(appointment.appointmentTime) === null) {
    return "Choose a valid appointment time.";
  }

  return `This appointment is ${appointmentDurationMinutesFromRecord(appointment)} min. Choose a start time that ends by ${schedulingWindowEndLabel()}.`;
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

  const snapshot = await tasks.orderBy("createdAt", "desc").limit(300).get();

  for (const doc of snapshot.docs) {
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
  return cleanString(value).toLowerCase();
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

function isPublicBookableDate(dateString) {
  const date = parseDateOnly(dateString);

  if (!date) {
    return false;
  }

  return publicSchedulingWeekdays.has(date.getUTCDay());
}

function isPublicBookingDateInRange(dateString) {
  const today = todayDateString();
  const daysAhead = daysBetweenDateStrings(today, dateString);
  return daysAhead !== null && daysAhead >= 0 && daysAhead <= publicBookingMaxAdvanceDays;
}

function publicBookingServiceFromId(serviceId) {
  return publicBookingServiceById.get(cleanString(serviceId)) || publicBookingServices[0];
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

function publicSlotValuesForDate(dateString, service, existingAppointments = []) {
  if (!isPublicBookableDate(dateString) || !isPublicBookingDateInRange(dateString)) {
    return [];
  }

  const slots = [];
  const latestStart = schedulingEndMinutes - service.durationMinutes;

  for (let minutes = schedulingStartMinutes; minutes <= latestStart; minutes += 15) {
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
  const firstName = cleanString(body.firstName || body.childFirstName);
  const lastName = cleanString(body.lastName || body.childLastName);
  const parentName = cleanString(body.parentName || body.caregiverName);
  const preferredLanguage = cleanString(body.preferredLanguage) || service.defaultLanguage || "English";

  return {
    service,
    firstName,
    lastName,
    parentName,
    phone: cleanString(body.phone),
    email: cleanString(body.email),
    preferredLanguage,
    preferredContactMethod: cleanString(body.preferredContactMethod) || "Call",
    appointmentDate: cleanString(body.appointmentDate),
    appointmentTime: normalizeAppointmentTimeValue(body.appointmentTime),
    notes: cleanString(body.notes),
    spamTrap: cleanString(body.website || body.company || body.url || body.contactMe)
  };
}

function publicBookingValidationError(payload) {
  if (payload.spamTrap || payload.website || payload.company || payload.url || payload.contactMe) {
    return "Could not submit this booking request. Please call or text (971) 202-0232.";
  }

  if (!payload.firstName || !payload.lastName || !payload.parentName || !payload.phone || !payload.preferredLanguage) {
    return "Child name, caregiver name, phone, and preferred language are required.";
  }

  for (const [field, maxLength] of Object.entries(publicBookingMaxLengths)) {
    if (cleanString(payload[field]).length > maxLength) {
      return "Please shorten the booking details and try again.";
    }
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "Enter a valid email address or leave email blank.";
  }

  if (!parseDateOnly(payload.appointmentDate) || !payload.appointmentTime) {
    return "Choose an appointment date and time.";
  }

  if (!isPublicBookableDate(payload.appointmentDate) || !isPublicBookingDateInRange(payload.appointmentDate)) {
    return "Choose an available appointment date.";
  }

  return "";
}

function validatePublicBookingPayload(payload, response) {
  const error = publicBookingValidationError(payload);

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

app.get("/api/public/booking-options", (_request, response) => {
  response.json({
    services: publicBookingServices,
    scheduling: {
      startTime: formatAppointmentTimeValue(
        `${String(Math.floor(schedulingStartMinutes / 60)).padStart(2, "0")}:${String(schedulingStartMinutes % 60).padStart(2, "0")}`
      ),
      endTime: schedulingWindowEndLabel(),
      weekdays: Array.from(publicSchedulingWeekdays)
    }
  });
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

      if (!date || !isPublicBookableDate(date) || !isPublicBookingDateInRange(date)) {
        continue;
      }

      dates.push({
        date,
        slots: publicSlotValuesForDate(date, service, existingAppointmentsByDate.get(date) || [])
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
    const clientName = `${payload.firstName} ${payload.lastName}`.trim();

    if (!validatePublicBookingPayload(payload, response)) {
      return;
    }

    const appointmentDraft = publicAppointmentDraft({
      service: payload.service,
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      clientName
    });

    if (!appointmentFitsSchedulingWindow(appointmentDraft)) {
      response.status(400).json({
        error: schedulingWindowError(appointmentDraft)
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

    const clientRef = clients.doc();
    const appointmentRef = appointments.doc();
    const taskRef = tasks.doc();
    const publicNotes = [
      "Booked through the public SNACK booking page.",
      payload.service.siblingVisit ? "Sibling appointment type selected." : "",
      payload.notes ? `Family notes: ${payload.notes}` : ""
    ].filter(Boolean).join(" ");
    const clientRecord = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      parentName: payload.parentName,
      phone: payload.phone,
      email: payload.email,
      preferredLanguage: payload.preferredLanguage,
      preferredContactMethod: payload.preferredContactMethod,
      referralType: "Self Referral",
      referralSource: "Public booking",
      referralDate: today,
      firstAppointmentDate: payload.appointmentDate,
      status: "Scheduled",
      notes: publicNotes,
      publicBookingServiceId: payload.service.id,
      publicBookingServiceLabel: payload.service.label,
      createdVia: "Public booking",
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    };
    const appointmentRecord = {
      clientId: clientRef.id,
      clientIds: [clientRef.id],
      clientName,
      clientNames: [clientName],
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      appointmentType: payload.service.appointmentType,
      durationMinutes: payload.service.durationMinutes,
      publicBookingServiceId: payload.service.id,
      publicBookingServiceLabel: payload.service.label,
      status: "Scheduled",
      lesson: "",
      goal: "",
      staffMember: "",
      notes: publicNotes,
      createdVia: "Public booking",
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    };
    const taskRecord = {
      title: `Review public booking for ${clientName}`,
      type: "Task",
      status: "Open",
      priority: "Normal",
      dueDate: today,
      dueTime: "",
      assignedTo: "",
      clientId: clientRef.id,
      clientName,
      appointmentId: appointmentRef.id,
      referralId: "",
      source: "Public Booking",
      notes: [
        `Booked ${payload.service.label} for ${payload.appointmentDate} at ${formatAppointmentTimeValue(payload.appointmentTime)}.`,
        "Review for duplicate records, sibling needs, forms, and appointment prep."
      ].join(" "),
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    };
    const batch = firestore.batch();

    batch.set(clientRef, clientRecord);
    batch.set(appointmentRef, appointmentRecord);
    batch.set(taskRef, taskRecord);
    await batch.commit();

    response.status(201).json({
      booking: {
        clientName,
        serviceLabel: payload.service.label,
        appointmentDate: payload.appointmentDate,
        appointmentTime: payload.appointmentTime,
        appointmentTimeLabel: formatAppointmentTimeValue(payload.appointmentTime),
        durationMinutes: payload.service.durationMinutes
      }
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

app.get("/api/referrals", requireAuth, async (_request, response, next) => {
  try {
    const snapshot = await referrals.orderBy("createdAt", "desc").limit(200).get();

    response.json({
      referrals: snapshot.docs.map(toReferral)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/clients", requireAuth, async (_request, response, next) => {
  try {
    const snapshot = await clients.orderBy("createdAt", "desc").limit(150).get();

    response.json({
      clients: snapshot.docs.map(toClient)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/appointments", requireAuth, async (_request, response, next) => {
  try {
    const snapshot = await appointments.orderBy("appointmentDate", "desc").limit(500).get();

    response.json({
      appointments: snapshot.docs.map(toAppointment)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/appointments", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanAppointmentPayload(request.body);
    const now = new Date().toISOString();

    if (!payload.clientIds.length || !payload.appointmentDate || !payload.appointmentTime) {
      response.status(400).json({
        error: "At least one client, appointment date, and appointment time are required."
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

    if (!appointmentFitsSchedulingWindow(payload)) {
      response.status(400).json({
        error: schedulingWindowError(payload)
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

    if (!payload.clientIds.length || !payload.appointmentDate || !payload.appointmentTime) {
      response.status(400).json({
        error: "At least one client, appointment date, and appointment time are required."
      });
      return;
    }

    const now = new Date().toISOString();
    if (!appointmentFitsSchedulingWindow(payload)) {
      response.status(400).json({
        error: schedulingWindowError(payload)
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
    const snapshot = await tasks.orderBy("createdAt", "desc").limit(300).get();

    response.json({
      tasks: snapshot.docs.map(toTask)
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
    const snapshot = await activityLogs.orderBy("occurredAt", "desc").limit(500).get();

    response.json({
      activityLogs: snapshot.docs.map(toActivityLog)
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

app.get("/api/referral-network", requireAuth, async (_request, response, next) => {
  try {
    const snapshot = await referralNetwork.orderBy("name").limit(100).get();

    response.json({
      entries: snapshot.docs.map(toReferralNetworkEntry)
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
    const existingSnapshot = await referralNetwork.limit(500).get();
    const existingByName = new Map();

    existingSnapshot.docs.forEach((doc) => {
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
    const snapshot = await outreachEvents.orderBy("eventDate", "desc").limit(200).get();

    response.json({
      events: snapshot.docs.map(toOutreachEvent)
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
    const snapshot = await outreachContacts.orderBy("createdAt", "desc").limit(500).get();

    response.json({
      contacts: snapshot.docs.map(toOutreachContact)
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
    let importedCount = 0;

    clientRows.forEach((row, index) => {
      const payload = cleanPersonPayload(row);
      const status = cleanString(row.status) || "Scheduled";
      const rowNumber = Number(row.rowNumber) || index + 1;

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
      batch.set(docRef, {
        ...payload,
        status,
        zohoRecordId: cleanString(row.zohoRecordId),
        importedFrom: "Zoho CSV",
        importedAt: now,
        createdAt: now,
        updatedAt: now,
        createdBy: request.user.email
      });
      importedCount += 1;
    });

    if (importedCount > 0) {
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
    let importedCount = 0;

    referralRows.forEach((row, index) => {
      const payload = cleanPersonPayload(row);
      const status = normalizeStatus(row.status);
      const rowNumber = Number(row.rowNumber) || index + 1;

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
      batch.set(docRef, {
        ...payload,
        status,
        referralDate: payload.referralDate || now.slice(0, 10),
        zohoRecordId: cleanString(row.zohoRecordId),
        importedFrom: cleanString(row.importSource) || "Zoho CSV",
        importedAt: now,
        createdAt: now,
        updatedAt: now,
        createdBy: request.user.email
      });
      importedCount += 1;
    });

    if (importedCount > 0) {
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
  cleanAppointmentPayload,
  cleanBoolean,
  cleanNetworkProvider,
  cleanOptionalInteger,
  cleanOptionalNumber,
  cleanOutreachContactPayload,
  cleanOutreachEventPayload,
  cleanPersonPayload,
  cleanProviderLink,
  cleanPublicBookingPayload,
  cleanReferralNetworkPayload,
  cleanString,
  cleanTaskPayload,
  clientPayloadFromReferral,
  daysBetweenDateStrings,
  formatAppointmentTimeValue,
  hasRequiredPersonFields,
  isActiveTaskStatus,
  isGeneratedTaskSource,
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
  publicSlotValuesForDate,
  referralSourceFromRecord,
  schedulingWindowEndLabel,
  schedulingWindowError,
  startDayTaskIntent,
  startDayTaskSubject,
  tasksMatchStartDayIntent,
  toActivityLog,
  toAppointment,
  toClient,
  toOutreachContact,
  toOutreachEvent,
  toReferral,
  toReferralNetworkEntry,
  toTask
};
