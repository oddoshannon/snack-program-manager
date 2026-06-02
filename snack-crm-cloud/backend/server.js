import express from "express";
import cors from "cors";
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
const allowedAppointmentStatuses = new Set(["Scheduled", "Completed", "No-show", "Rescheduled", "Canceled"]);
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
  return value === true || value === "true";
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
    lastAppointmentDate: data.lastAppointmentDate,
    addressStreet: data.addressStreet,
    addressCity: data.addressCity,
    addressState: data.addressState,
    addressZip: data.addressZip,
    emailOptOut: Boolean(data.emailOptOut),
    textOptOut: Boolean(data.textOptOut),
    ycco: data.ycco,
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
    lastAppointmentDate: data.lastAppointmentDate,
    addressStreet: data.addressStreet,
    addressCity: data.addressCity,
    addressState: data.addressState,
    addressZip: data.addressZip,
    emailOptOut: Boolean(data.emailOptOut),
    textOptOut: Boolean(data.textOptOut),
    ycco: data.ycco,
    assessmentScore: data.assessmentScore,
    willingnessScore: data.willingnessScore,
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

  return {
    id: snapshot.id,
    clientId: data.clientId,
    clientName: data.clientName,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    status: data.status,
    lesson: data.lesson,
    goal: data.goal,
    staffMember: data.staffMember,
    notes: data.notes,
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
    lastAppointmentDate: cleanString(body.lastAppointmentDate),
    addressStreet: cleanString(body.addressStreet),
    addressCity: cleanString(body.addressCity),
    addressState: cleanString(body.addressState),
    addressZip: cleanString(body.addressZip),
    emailOptOut: cleanBoolean(body.emailOptOut),
    textOptOut: cleanBoolean(body.textOptOut),
    ycco: cleanString(body.ycco),
    assessmentScore: cleanOptionalNumber(body.assessmentScore),
    willingnessScore: cleanOptionalNumber(body.willingnessScore),
    notes: cleanString(body.notes)
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

function cleanAppointmentPayload(body) {
  return {
    clientId: cleanString(body.clientId),
    clientName: cleanString(body.clientName),
    appointmentDate: cleanString(body.appointmentDate),
    appointmentTime: cleanString(body.appointmentTime),
    status: normalizeAppointmentStatus(body.status),
    lesson: cleanString(body.lesson),
    goal: cleanString(body.goal),
    staffMember: cleanString(body.staffMember),
    notes: cleanString(body.notes)
  };
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

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "snack-crm-api"
  });
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

    if (!payload.clientId || !payload.appointmentDate) {
      response.status(400).json({
        error: "Client and appointment date are required."
      });
      return;
    }

    if (!payload.clientName) {
      const clientSnapshot = await clients.doc(payload.clientId).get();
      if (clientSnapshot.exists) {
        const client = toClient(clientSnapshot);
        payload.clientName = `${client.firstName || ""} ${client.lastName || ""}`.trim();
      }
    }

    const docRef = await appointments.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = await docRef.get();

    response.status(201).json({
      appointment: toAppointment(created)
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

    if (!payload.clientId || !payload.appointmentDate) {
      response.status(400).json({
        error: "Client and appointment date are required."
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
      appointment: toAppointment(updated)
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
      "lastAppointmentDate",
      "addressStreet",
      "addressCity",
      "addressState",
      "addressZip",
      "ycco",
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
    const lastAppointmentDate = cleanString(request.body.lastAppointmentDate);
    const addressStreet = cleanString(request.body.addressStreet);
    const addressCity = cleanString(request.body.addressCity);
    const addressState = cleanString(request.body.addressState);
    const addressZip = cleanString(request.body.addressZip);
    const emailOptOut = cleanBoolean(request.body.emailOptOut);
    const textOptOut = cleanBoolean(request.body.textOptOut);
    const ycco = cleanString(request.body.ycco);
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
      lastAppointmentDate,
      addressStreet,
      addressCity,
      addressState,
      addressZip,
      emailOptOut,
      textOptOut,
      ycco,
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
      "lastAppointmentDate",
      "addressStreet",
      "addressCity",
      "addressState",
      "addressZip",
      "ycco",
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
    const clientRef = await clients.add({
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
      referralSource: referral.referralSource || "",
      referralDate: referral.referralDate || "",
      firstContactDate: referral.firstContactDate || "",
      mostRecentContactDate: referral.mostRecentContactDate || "",
      firstAppointmentDate: referral.firstAppointmentDate || "",
      lastAppointmentDate: referral.lastAppointmentDate || "",
      addressStreet: referral.addressStreet || "",
      addressCity: referral.addressCity || "",
      addressState: referral.addressState || "",
      addressZip: referral.addressZip || "",
      emailOptOut: Boolean(referral.emailOptOut),
      textOptOut: Boolean(referral.textOptOut),
      ycco: referral.ycco || "",
      assessmentScore: referral.assessmentScore ?? null,
      willingnessScore: referral.willingnessScore ?? null,
      sourceReferralId: referralId,
      siblingIds: convertedSiblingClientIds,
      providerLinks: referral.providerLinks || [],
      convertedAt: now,
      status: "Scheduled",
      notes: referral.notes || "",
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });

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

app.listen(port, () => {
  console.log(`SNACK CRM API listening on port ${port}`);
});
