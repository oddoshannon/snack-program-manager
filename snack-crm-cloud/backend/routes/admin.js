import express from "express";
import {
  adminDataCollections,
  adminSettings,
  cleanSchedulingSettingsPayload,
  cleanString,
  clients,
  collectionCount,
  deleteCollectionDocuments,
  fetchAllDocuments,
  firestore,
  googleCalendarConnectionStatus,
  isAdminBulkDeleteEnabled,
  loadSchedulingSettings,
  loadClientStatusDefinitions,
  normalizeClientStatusDefinitions,
  requireAuth,
  serializeSchedulingSettings,
  toSchedulingSettings,
  verifyGoogleCalendarLifecycle
} from "../lib/core.js";

const router = express.Router();
const adminImportableCollectionKeys = new Set([
  "clients",
  "referrals",
  "referral-network",
  "appointments"
]);

function isAdminQaFixtureDocument(document) {
  const data = typeof document?.data === "function" ? document.data() : document || {};
  const id = cleanString(document?.id || data.id);
  return /^qa(?:[-_]|$)/i.test(id)
    && data.qaFixture === true
    && Boolean(cleanString(data.qaFixtureSet));
}

function adminDataCollectionAllowsCleanup(config) {
  return Boolean(config) && config.cleanupEligible !== false;
}

function googleCalendarTestErrorMessage(error) {
  const message = cleanString(error?.message);
  if (/invalid_grant|invalid_rapt|reauth/i.test(message)) {
    return "This computer's Google sign-in needs to be refreshed before the Clinic Calendar test can run. No calendar event was created.";
  }
  return "The Clinic Calendar test could not complete. Confirm that the app has permission to edit the Clinic Appts calendar, then try again.";
}

async function deleteAdminQaFixtureDocuments(documents) {
  let deletedCount = 0;

  for (let start = 0; start < documents.length; start += 450) {
    const batch = firestore.batch();
    const page = documents.slice(start, start + 450);
    page.forEach((document) => batch.delete(document.ref));
    await batch.commit();
    deletedCount += page.length;
  }

  return deletedCount;
}

router.get("/api/admin/data-center", requireAuth, async (_request, response, next) => {
  try {
    const collections = [];

    for (const [key, config] of Object.entries(adminDataCollections)) {
      const documents = await fetchAllDocuments(config.collection);
      collections.push({
        key,
        label: config.label,
        count: documents.length,
        qaFixtureCount: adminDataCollectionAllowsCleanup(config)
          ? documents.filter(isAdminQaFixtureDocument).length
          : 0,
        cleanupEligible: adminDataCollectionAllowsCleanup(config),
        importable: adminImportableCollectionKeys.has(key)
      });
    }

    response.json({
      collections,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/admin/data-counts", requireAuth, async (_request, response, next) => {
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

router.get("/api/admin/export/:collectionKey", requireAuth, async (request, response, next) => {
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

router.post("/api/admin/bulk-delete", requireAuth, async (request, response, next) => {
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

    const invalidCollection = uniqueCollectionKeys.find(
      (key) => !adminDataCollectionAllowsCleanup(adminDataCollections[key])
    );

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

router.post("/api/admin/qa-fixtures/delete", requireAuth, async (request, response, next) => {
  try {
    const collectionKeys = Array.isArray(request.body.collections)
      ? request.body.collections.map(cleanString).filter(Boolean)
      : [];
    const uniqueCollectionKeys = [...new Set(collectionKeys)];

    if (cleanString(request.body.confirmation) !== "DELETE SAMPLE DATA") {
      response.status(400).json({
        error: "Type DELETE SAMPLE DATA to confirm this cleanup."
      });
      return;
    }

    if (!uniqueCollectionKeys.length) {
      response.status(400).json({
        error: "Choose at least one data collection to clean up."
      });
      return;
    }

    const invalidCollection = uniqueCollectionKeys.find(
      (key) => !adminDataCollectionAllowsCleanup(adminDataCollections[key])
    );
    if (invalidCollection) {
      response.status(400).json({
        error: "One or more data collections cannot be cleaned from this tool."
      });
      return;
    }

    const deleted = {};
    for (const key of uniqueCollectionKeys) {
      const documents = await fetchAllDocuments(adminDataCollections[key].collection);
      const fixtureDocuments = documents.filter(isAdminQaFixtureDocument);
      deleted[key] = await deleteAdminQaFixtureDocuments(fixtureDocuments);
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

router.get("/api/admin/scheduling-settings", requireAuth, async (_request, response, next) => {
  try {
    const settings = await loadSchedulingSettings();

    response.json({
      schedulingSettings: serializeSchedulingSettings(settings)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/admin/crm-settings", requireAuth, async (_request, response, next) => {
  try {
    response.json({ clientStatuses: await loadClientStatusDefinitions() });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/admin/crm-settings", requireAuth, async (request, response, next) => {
  try {
    if (!Array.isArray(request.body?.clientStatuses) || !request.body.clientStatuses.length) {
      response.status(400).json({ error: "Add at least one client status." });
      return;
    }
    const clientStatuses = normalizeClientStatusDefinitions(request.body.clientStatuses);
    const allowedNames = new Set(clientStatuses.map((item) => item.name));
    const clientDocuments = await fetchAllDocuments(clients);
    const statusesInUse = [...new Set(clientDocuments.map((document) => cleanString(document.data()?.status)).filter(Boolean))];
    const missingStatus = statusesInUse.find((status) => !allowedNames.has(status));
    if (missingStatus) {
      response.status(409).json({
        error: `The ${missingStatus} status is still used by a client. Change those clients before removing it.`
      });
      return;
    }
    const now = new Date().toISOString();
    await adminSettings.doc("crm").set({
      clientStatuses,
      updatedAt: now,
      updatedBy: request.user.email
    }, { merge: true });
    response.json({ clientStatuses });
  } catch (error) {
    next(error);
  }
});

router.get("/api/admin/google-calendar/status", requireAuth, async (_request, response) => {
  try {
    response.json(await googleCalendarConnectionStatus());
  } catch (error) {
    response.json({
      configured: true,
      enabled: true,
      connected: false,
      error: cleanString(error?.message) || "Google Calendar connection check failed."
    });
  }
});

router.post("/api/admin/google-calendar/test", requireAuth, async (request, response) => {
  try {
    if (cleanString(request.body?.confirmation) !== "TEST CLINIC CALENDAR") {
      response.status(400).json({
        error: "Confirm the controlled Clinic Calendar connection test."
      });
      return;
    }

    response.json(await verifyGoogleCalendarLifecycle());
  } catch (error) {
    response.status(503).json({ error: googleCalendarTestErrorMessage(error) });
  }
});

router.patch("/api/admin/scheduling-settings", requireAuth, async (request, response, next) => {
  try {
    const current = serializeSchedulingSettings(await loadSchedulingSettings());
    const payload = cleanSchedulingSettingsPayload({
      ...current,
      ...request.body,
      kitchen: {
        ...current.kitchen,
        ...(request.body?.kitchen || request.body?.kitchenSettings || {})
      }
    });
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

export default router;
export {
  adminDataCollectionAllowsCleanup,
  googleCalendarTestErrorMessage,
  isAdminQaFixtureDocument
};
