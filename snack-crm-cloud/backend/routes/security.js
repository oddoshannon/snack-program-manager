import express from "express";
import {
  appendSecurityAudit,
  cleanString,
  fetchAllDocuments,
  requireAuth,
  securityAuditLogs
} from "../lib/core.js";

const router = express.Router();
const staffEventActions = new Set([
  "session.login",
  "session.logout",
  "session.inactivity_logout",
  "grant.document_viewed",
  "backup.downloaded",
  "client.record_viewed"
]);

router.post("/api/security-events", requireAuth, async (request, response) => {
  const action = cleanString(request.body?.action);
  if (!staffEventActions.has(action)) {
    response.status(400).json({ error: "That security event is not supported." });
    return;
  }
  await appendSecurityAudit({
    actorEmail: request.user.email,
    actorUid: request.user.uid,
    action,
    resourceType: cleanString(request.body?.resourceType) || "application",
    resourceId: cleanString(request.body?.resourceId)
  });
  response.status(201).json({ recorded: true });
});

router.get("/api/admin/security-audit", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(securityAuditLogs.orderBy("occurredAt", "desc"));
    const visible = documents.slice(0, 200).map((document) => {
      const data = document.data() || {};
      return {
        id: document.id,
        actorEmail: cleanString(data.actorEmail),
        action: cleanString(data.action),
        result: cleanString(data.result),
        resourceType: cleanString(data.resourceType),
        resourceId: cleanString(data.resourceId),
        metadata: data.metadata && typeof data.metadata === "object" ? data.metadata : {},
        occurredAt: cleanString(data.occurredAt)
      };
    });
    response.json({
      events: visible,
      total: documents.length,
      showing: visible.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;
