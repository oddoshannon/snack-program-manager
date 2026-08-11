import express from "express";
import { FieldValue } from "@google-cloud/firestore";
import {
  allowedReferralStatuses,
  allowedReferralTypes,
  cleanBoolean,
  cleanOptionalNumber,
  cleanPersonPayload,
  cleanProviderLink,
  cleanString,
  clientPayloadFromReferral,
  clients,
  fetchAllDocuments,
  firestore,
  hasRequiredPersonFields,
  normalizeAddressState,
  normalizedLookupKey,
  normalizeStatus,
  referralNetwork,
  referrals,
  requireAuth,
  publicSubmissionRateLimit,
  siblingIdsForImportedRecord,
  tasks,
  toClient,
  toReferral,
  toReferralNetworkEntry
} from "../lib/core.js";

const router = express.Router();
const publicReferralAttempts = new Map();

function limitedText(value, maxLength) {
  return cleanString(value).slice(0, maxLength);
}

const publicReferralRateLimit = publicSubmissionRateLimit(
  "referral",
  8,
  "Too many referral submissions. Please try again later or call us at (971) 202-0232."
);

function publicReferralPayload(body = {}, now = new Date().toISOString()) {
  const referralType = limitedText(body.referralType, 80);
  const rawChildren = Array.isArray(body.children) && body.children.length
    ? body.children.slice(0, 8)
    : [{ firstName: body.firstName, lastName: body.lastName, dateOfBirth: body.dateOfBirth }];
  const children = rawChildren.map((child = {}) => ({
    firstName: limitedText(child.firstName, 80),
    lastName: limitedText(child.lastName, 100),
    dateOfBirth: limitedText(child.dateOfBirth, 10)
  }));
  const parentName = limitedText(body.parentName, 160);
  const phone = limitedText(body.phone, 40);
  const email = limitedText(body.email, 180);
  const preferredLanguage = limitedText(body.preferredLanguage, 40) || "English";
  const preferredContactMethod = limitedText(body.preferredContactMethod, 40) || "Phone Call";
  const referralOrganization = limitedText(body.referralOrganization, 180);
  const referrerName = limitedText(body.referrerName, 160);
  const referrerEmail = limitedText(body.referrerEmail, 180);
  const referrerPhone = limitedText(body.referrerPhone, 40);
  const reason = limitedText(body.reason, 2000);
  const notes = limitedText(body.notes, 2000);
  const permissionToContact = cleanBoolean(body.permissionToContact);
  const spamTrap = limitedText(body.website, 200);

  if (spamTrap) return { spam: true, error: "" };
  if (!children.length || children.some((child) => !child.firstName || !child.lastName)
    || !parentName || !phone || !referralType) {
    return { error: "Each child's name, caregiver name, caregiver phone, and referral type are required." };
  }
  if (!allowedReferralTypes.has(referralType)) return { error: "Referral type is not valid." };
  if (children.some((child) => child.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(child.dateOfBirth))) {
    return { error: "Date of birth is not valid." };
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return { error: "Caregiver email is not valid." };
  if (referrerEmail && !/^\S+@\S+\.\S+$/.test(referrerEmail)) return { error: "Referrer email is not valid." };
  if (!permissionToContact) return { error: "Permission to contact the caregiver is required." };
  if (["External Clinic Referral", "Community Org Referral"].includes(referralType)
    && (!referralOrganization || !referrerName)) {
    return { error: "Referring organization and contact name are required for provider referrals." };
  }

  const referralDetails = [
    referralOrganization ? `Referring organization: ${referralOrganization}` : "",
    referrerName ? `Referrer: ${referrerName}` : "",
    referrerEmail ? `Referrer email: ${referrerEmail}` : "",
    referrerPhone ? `Referrer phone: ${referrerPhone}` : "",
    reason ? `Reason for referral: ${reason}` : "",
    notes ? `Additional information: ${notes}` : ""
  ].filter(Boolean).join("\n");

  const records = children.map((child) => ({
      firstName: child.firstName,
      lastName: child.lastName,
      parentName,
      dateOfBirth: child.dateOfBirth,
      gender: "",
      phone,
      email,
      preferredLanguage,
      preferredContactMethod,
      referralType,
      referralSource: referralOrganization || referrerName || "Public referral form",
      referralDate: now.slice(0, 10),
      firstContactDate: "",
      mostRecentContactDate: "",
      firstAppointmentDate: "",
      mostRecentAppointmentDate: "",
      lastAppointmentDate: "",
      addressStreet: "",
      addressCity: "",
      addressState: "",
      addressZip: "",
      emailOptOut: false,
      textOptOut: false,
      ycco: false,
      yccoId: "",
      hrsn: false,
      assessmentScore: null,
      willingnessScore: null,
      status: "New",
      notes: referralDetails,
      permissionToContact: true,
      permissionRecordedAt: now,
      submissionSource: "Public referral form",
      referralOrganization,
      referrerName,
      referrerEmail,
      referrerPhone,
      createdAt: now,
      updatedAt: now,
      createdBy: "public-referral-form"
    }));
  return {
    error: "",
    spam: false,
    matching: { referralOrganization, referrerName, referrerEmail },
    record: records[0],
    records
  };
}

function publicReferralProviderLinks(networkEntries = [], matching = {}) {
  const organizationKey = normalizedLookupKey(matching.referralOrganization);
  const providerNameKey = normalizedLookupKey(matching.referrerName);
  const providerEmailKey = normalizedLookupKey(matching.referrerEmail);
  if (!organizationKey || (!providerNameKey && !providerEmailKey)) return [];
  const organizations = networkEntries.filter((entry) => normalizedLookupKey(entry.name) === organizationKey);
  if (organizations.length !== 1) return [];
  const organization = organizations[0];
  const providers = (organization.providers || []).filter((provider) => (
    providerEmailKey
      ? normalizedLookupKey(provider.email) === providerEmailKey
      : normalizedLookupKey(provider.name) === providerNameKey
  ));
  if (providers.length !== 1) return [];
  return [cleanProviderLink({
    networkId: organization.id,
    providerId: providers[0].id,
    organizationName: organization.name,
    providerName: providers[0].name
  })];
}

function newReferralCallTask(record = {}, referralId = "", createdBy = "") {
  const childName = `${record.firstName || ""} ${record.lastName || ""}`.trim() || "new referral";
  return {
    title: `Call new referral: ${childName}`,
    type: "Call",
    status: "Open",
    priority: "High",
    dueDate: record.referralDate || new Date().toISOString().slice(0, 10),
    dueTime: "",
    assignedTo: "",
    clientId: "",
    clientName: "",
    appointmentId: "",
    referralId,
    source: "Workflow Automation",
    notes: `Call ${record.parentName || "the caregiver"} about the new referral for ${childName}. Logging a call on the referral completes this task.`,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    createdBy
  };
}

router.post("/api/public/referrals", publicReferralRateLimit, async (request, response, next) => {
  try {
    const payload = publicReferralPayload(request.body);
    if (payload.spam) {
      response.status(201).json({ submitted: true });
      return;
    }
    if (payload.error) {
      response.status(400).json({ error: payload.error });
      return;
    }
    const networkDocuments = await fetchAllDocuments(referralNetwork);
    const providerLinks = publicReferralProviderLinks(networkDocuments.map(toReferralNetworkEntry), payload.matching);
    const providerReviewRequired = providerLinks.length === 0
      && ["External Clinic Referral", "Community Org Referral"].includes(payload.records[0].referralType);
    const docRefs = payload.records.map(() => referrals.doc());
    const batch = firestore.batch();
    payload.records.forEach((record, index) => {
      batch.set(docRefs[index], {
        ...record,
        providerLinks,
        providerReviewRequired: providerReviewRequired && index === 0,
        providerReviewReason: providerReviewRequired && index === 0
          ? "The submitted organization and contact did not match exactly one saved referral partner."
          : "",
        siblingIds: docRefs.map((ref) => ref.id).filter((id) => id !== docRefs[index].id)
      });
    });
    batch.set(tasks.doc(), newReferralCallTask(payload.records[0], docRefs[0].id, "public-referral-form"));
    if (providerReviewRequired) {
      const taskRef = tasks.doc();
      const firstRecord = payload.records[0];
      batch.set(taskRef, {
        title: `Review new referral partner: ${firstRecord.referralOrganization}`,
        type: "Task",
        status: "Open",
        priority: "High",
        dueDate: firstRecord.referralDate,
        dueTime: "",
        assignedTo: "",
        clientId: "",
        clientName: "",
        appointmentId: "",
        referralId: docRefs[0].id,
        source: "Public Referral",
        notes: `Review ${firstRecord.referrerName} at ${firstRecord.referralOrganization}. Open the referral and use Add to Referral Network after confirming the details.`,
        createdAt: firstRecord.createdAt,
        updatedAt: firstRecord.updatedAt,
        createdBy: "public-referral-form"
      });
    }
    await batch.commit();
    const created = await Promise.all(docRefs.map((ref) => ref.get()));
    response.status(201).json({
      submitted: true,
      referral: toReferral(created[0]),
      referrals: created.map(toReferral),
      providerMatched: providerLinks.length === 1,
      providerReviewRequired
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/referrals", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(referrals.orderBy("createdAt", "desc"));

    response.json({
      referrals: documents.map(toReferral)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/referrals", requireAuth, async (request, response, next) => {
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
    const addressState = normalizeAddressState(request.body.addressState);
    const addressZip = cleanString(request.body.addressZip);
    const emailOptOut = cleanBoolean(request.body.emailOptOut);
    const textOptOut = cleanBoolean(request.body.textOptOut);
    const ycco = cleanBoolean(request.body.ycco);
    const yccoId = cleanString(request.body.yccoId);
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

    const record = {
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
      yccoId,
      hrsn,
      assessmentScore,
      willingnessScore,
      status: "New",
      notes,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    };
    const docRef = referrals.doc();
    const batch = firestore.batch();
    batch.set(docRef, record);
    batch.set(tasks.doc(), newReferralCallTask(record, docRef.id, request.user.email));
    await batch.commit();
    const created = await docRef.get();

    response.status(201).json({
      referral: toReferral(created)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/referrals/import", requireAuth, async (request, response, next) => {
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

router.delete("/api/referrals/:referralId", requireAuth, async (request, response, next) => {
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

router.post("/api/referrals/:referralId/siblings", requireAuth, async (request, response, next) => {
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

router.delete("/api/referrals/:referralId/siblings/:siblingId", requireAuth, async (request, response, next) => {
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

router.patch("/api/referrals/:referralId", requireAuth, async (request, response, next) => {
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
      "yccoId",
      "notes"
    ]) {
      if (Object.hasOwn(request.body, field)) {
        updates[field] = field === "addressState"
          ? normalizeAddressState(request.body[field])
          : cleanString(request.body[field]);
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

    const completesProviderReview = Object.hasOwn(request.body, "providerLinks")
      && updates.providerLinks.length > 0;
    if (completesProviderReview) {
      updates.providerReviewRequired = false;
      updates.providerReviewedAt = updates.updatedAt;
      updates.providerReviewedBy = request.user.email;
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
    if (completesProviderReview) {
      const taskDocuments = await fetchAllDocuments(tasks.where("referralId", "==", referralId));
      const batch = firestore.batch();
      let hasUpdates = false;
      const siblingIds = Array.isArray(snapshot.data().siblingIds) ? snapshot.data().siblingIds : [];
      siblingIds.forEach((siblingId) => {
        batch.update(referrals.doc(siblingId), {
          providerLinks: updates.providerLinks,
          providerReviewRequired: false,
          providerReviewedAt: updates.updatedAt,
          providerReviewedBy: request.user.email,
          updatedAt: updates.updatedAt,
          updatedBy: request.user.email
        });
        hasUpdates = true;
      });
      taskDocuments.forEach((taskDocument) => {
        const task = taskDocument.data();
        if (task.source === "Public Referral"
          && !["Done", "Canceled"].includes(cleanString(task.status))
          && cleanString(task.title).startsWith("Review new referral partner:")) {
          batch.update(taskDocument.ref, {
            status: "Done",
            completedAt: updates.updatedAt,
            updatedAt: updates.updatedAt,
            updatedBy: request.user.email
          });
          hasUpdates = true;
        }
      });
      if (hasUpdates) await batch.commit();
    }
    const updated = await docRef.get();

    response.json({
      referral: toReferral(updated)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/referrals/:referralId/convert", requireAuth, async (request, response, next) => {
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

export {
  newReferralCallTask,
  publicReferralAttempts,
  publicReferralPayload,
  publicReferralProviderLinks,
  publicReferralRateLimit
};

export default router;
