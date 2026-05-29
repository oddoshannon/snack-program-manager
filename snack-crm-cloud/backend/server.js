import express from "express";
import cors from "cors";
import { Firestore } from "@google-cloud/firestore";
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
  "Parent Will Call Back",
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
const legacyStatusMap = {
  new: "New",
  contacted: "Texted",
  scheduled: "Scheduled",
  closed: "Closed / No Further Outreach"
};

const firestore = projectId ? new Firestore({ projectId }) : new Firestore();
const messages = firestore.collection("messages");
const referrals = firestore.collection("referrals");
const clients = firestore.collection("clients");
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
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
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
    const snapshot = await referrals.orderBy("createdAt", "desc").limit(25).get();

    response.json({
      referrals: snapshot.docs.map(toReferral)
    });
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
        error: "Child name, parent name, phone, preferred language, and referral type are required."
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

    await docRef.delete();

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
        error: "Parent/guardian name is required."
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
