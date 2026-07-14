import express from "express";
import {
  activityLogs,
  cleanActivityLogPayload,
  clients,
  fetchAllDocuments,
  referrals,
  requireAuth,
  toActivityLog
} from "../lib/core.js";

const router = express.Router();

router.get("/api/activity-logs", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(activityLogs.orderBy("occurredAt", "desc"));

    response.json({
      activityLogs: documents.map(toActivityLog)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/activity-logs", requireAuth, async (request, response, next) => {
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

export default router;
