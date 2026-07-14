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
  normalizeStatus,
  referrals,
  requireAuth,
  siblingIdsForImportedRecord,
  toClient,
  toReferral
} from "../lib/core.js";

const router = express.Router();

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

export default router;
