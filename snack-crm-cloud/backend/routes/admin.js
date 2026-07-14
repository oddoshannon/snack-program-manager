import express from "express";
import {
  adminDataCollections,
  adminSettings,
  cleanSchedulingSettingsPayload,
  cleanString,
  collectionCount,
  deleteCollectionDocuments,
  fetchAllDocuments,
  isAdminBulkDeleteEnabled,
  loadSchedulingSettings,
  requireAuth,
  serializeSchedulingSettings,
  toSchedulingSettings
} from "../lib/core.js";

const router = express.Router();

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

router.patch("/api/admin/scheduling-settings", requireAuth, async (request, response, next) => {
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

export default router;
