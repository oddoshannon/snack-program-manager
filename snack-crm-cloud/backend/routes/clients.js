import express from "express";
import { FieldValue } from "@google-cloud/firestore";
import {
  allowedClientStatuses,
  allowedReferralTypes,
  cleanBoolean,
  cleanOptionalNumber,
  cleanPersonPayload,
  cleanProviderLink,
  cleanString,
  clients,
  fetchAllDocuments,
  firestore,
  hasRequiredPersonFields,
  requireAuth,
  siblingIdsForImportedRecord,
  toClient,
  validateRequiredPersonFields
} from "../lib/core.js";

const router = express.Router();

router.get("/api/clients", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(clients.orderBy("createdAt", "desc"));

    response.json({
      clients: documents.map(toClient)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/clients", requireAuth, async (request, response, next) => {
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

router.post("/api/clients/import", requireAuth, async (request, response, next) => {
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

router.patch("/api/clients/:clientId", requireAuth, async (request, response, next) => {
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
      "graduationDate",
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

router.delete("/api/clients/:clientId", requireAuth, async (request, response, next) => {
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

router.post("/api/clients/:clientId/siblings", requireAuth, async (request, response, next) => {
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

router.delete("/api/clients/:clientId/siblings/:siblingId", requireAuth, async (request, response, next) => {
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

export default router;
