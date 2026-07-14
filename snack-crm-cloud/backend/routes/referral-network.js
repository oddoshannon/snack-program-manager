import express from "express";
import {
  cleanNetworkProvider,
  cleanReferralNetworkPayload,
  cleanString,
  fetchAllDocuments,
  firestore,
  normalizedLookupKey,
  referralNetwork,
  requireAuth,
  toReferralNetworkEntry
} from "../lib/core.js";

const router = express.Router();

router.get("/api/referral-network", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(referralNetwork.orderBy("name"));

    response.json({
      entries: documents.map(toReferralNetworkEntry)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/referral-network", requireAuth, async (request, response, next) => {
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

router.post("/api/referral-network/import", requireAuth, async (request, response, next) => {
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

router.patch("/api/referral-network/:entryId", requireAuth, async (request, response, next) => {
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

router.delete("/api/referral-network/:entryId", requireAuth, async (request, response, next) => {
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

export default router;
