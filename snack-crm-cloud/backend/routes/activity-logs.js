import express from "express";
import {
  activityLogs,
  appointments,
  cleanActivityLogPayload,
  clients,
  fetchAllDocuments,
  firestore,
  referrals,
  requireAuth,
  tasks,
  toActivityLog,
  toAppointment
} from "../lib/core.js";

const router = express.Router();
const unansweredContactResults = new Set([
  "invalid number",
  "left voicemail",
  "no response",
  "no response to text",
  "no voicemail call back"
]);

function normalizedContactResult(value) {
  return String(value || "")
    .toLowerCase()
    .replaceAll("—", " ")
    .replaceAll("–", " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isUnansweredContactResult(value) {
  return unansweredContactResults.has(normalizedContactResult(value));
}

function datePlusDays(dateKey, days) {
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || ""))
    ? new Date(`${dateKey}T12:00:00Z`)
    : new Date();
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function unansweredContactTask({ payload, relatedName, priorAttemptCount, assignedTo }) {
  if (!isUnansweredContactResult(payload.result)) return null;
  const completedAttempt = priorAttemptCount + 1;
  const relationField = payload.relatedType === "referral"
    ? { referralId: payload.relatedId }
    : { clientId: payload.relatedId, clientName: relatedName };

  if (completedAttempt >= 3) {
    return {
      ...relationField,
      automationKey: `unanswered:${payload.relatedType}:${payload.relatedId}:review`,
      title: `Review unanswered contact attempts: ${relatedName}`,
      type: "Task",
      status: "Open",
      priority: "Normal",
      dueDate: payload.activityDate,
      assignedTo,
      source: "Workflow Automation",
      notes: "Three staff contact attempts were recorded without reaching the family. Review the history and confirm whether the profile should move to Waiting on Family. The system will not change the status automatically."
    };
  }

  const nextAttempt = completedAttempt + 1;
  const invalidNumber = normalizedContactResult(payload.result) === "invalid number";
  return {
    ...relationField,
    automationKey: `unanswered:${payload.relatedType}:${payload.relatedId}:attempt:${nextAttempt}`,
    title: `${invalidNumber ? "Verify contact information for" : `Contact attempt ${nextAttempt} for`} ${relatedName}`,
    type: "Call",
    status: "Open",
    priority: "Normal",
    dueDate: datePlusDays(payload.activityDate, 7),
    assignedTo,
    source: "Workflow Automation",
    notes: invalidNumber
      ? `Unanswered contact attempt ${completedAttempt} of 3. Verify the phone number or use an approved alternate contact method before the next staff attempt. No automatic message will be sent.`
      : `Unanswered contact attempt ${completedAttempt} of 3. This is a staff follow-up task; no automatic email or text will be sent.`
  };
}

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

router.get("/api/schedule/activity-logs", requireAuth, async (_request, response, next) => {
  try {
    const [appointmentDocuments, activityDocuments] = await Promise.all([
      fetchAllDocuments(appointments),
      fetchAllDocuments(activityLogs.orderBy("occurredAt", "desc"))
    ]);
    const scheduledClientIds = new Set(
      appointmentDocuments
        .map(toAppointment)
        .filter((appointment) => appointment.status !== "Canceled")
        .flatMap((appointment) => appointment.clientIds?.length
          ? appointment.clientIds
          : [appointment.clientId])
        .filter(Boolean)
    );

    response.json({
      activityLogs: activityDocuments
        .map(toActivityLog)
        .filter((activity) => activity.relatedType !== "referral" && scheduledClientIds.has(activity.relatedId))
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
    const [taskDocuments, priorActivityDocuments] = await Promise.all([
      fetchAllDocuments(tasks.where(payload.relatedType === "referral" ? "referralId" : "clientId", "==", payload.relatedId)),
      fetchAllDocuments(activityLogs.where("relatedId", "==", payload.relatedId))
    ]);
    const docRef = activityLogs.doc();
    const batch = firestore.batch();
    batch.set(docRef, {
      ...payload,
      relatedName: payload.relatedName || `${relatedData.firstName || ""} ${relatedData.lastName || ""}`.trim(),
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email,
      createdByDisplayName: request.user.displayName || request.user.email
    });

    const contactUpdates = {
      mostRecentContactDate: payload.activityDate,
      updatedAt: now,
      updatedBy: request.user.email
    };

    if (!relatedData.firstContactDate) {
      contactUpdates.firstContactDate = payload.activityDate;
    }

    const resultIsNotInterested = payload.result.toLowerCase().includes("not interested");
    const closeReferral = payload.relatedType === "referral"
      && resultIsNotInterested
      && request.body.closeReferral === true;
    if (closeReferral) contactUpdates.status = "Not Interested";
    batch.update(relatedRef, contactUpdates);

    let completedTaskCount = 0;
    taskDocuments.forEach((taskDocument) => {
      const task = taskDocument.data();
      const active = !["Done", "Canceled"].includes(task.status || "Open");
      const initialCallTask = payload.type === "Call"
        && task.source === "Workflow Automation"
        && String(task.title || "").startsWith("Call new referral:");
      const unansweredFollowUpTask = task.source === "Workflow Automation"
        && String(task.automationKey || "").startsWith(`unanswered:${payload.relatedType}:${payload.relatedId}:attempt:`);
      if (!active || (!closeReferral && !initialCallTask && !unansweredFollowUpTask)) return;
      batch.update(taskDocument.ref, {
        status: "Done",
        completedAt: now,
        updatedAt: now,
        updatedBy: request.user.email
      });
      completedTaskCount += 1;
    });

    let followUpTaskCreated = false;
    if (!closeReferral && isUnansweredContactResult(payload.result)) {
      const priorAttemptCount = priorActivityDocuments
        .map((document) => document.data())
        .filter((activity) => activity.relatedType === payload.relatedType)
        .filter((activity) => isUnansweredContactResult(activity.result))
        .length;
      const followUpTask = unansweredContactTask({
        payload,
        relatedName: payload.relatedName || `${relatedData.firstName || ""} ${relatedData.lastName || ""}`.trim() || "family",
        priorAttemptCount,
        assignedTo: request.user.email
      });
      const existingTask = taskDocuments.find((document) => document.data().automationKey === followUpTask.automationKey);
      if (!existingTask) {
        const followUpRef = tasks.doc();
        batch.set(followUpRef, {
          ...followUpTask,
          completedAt: "",
          createdAt: now,
          updatedAt: now,
          createdBy: request.user.email
        });
        followUpTaskCreated = true;
      }
    }

    await batch.commit();
    const created = await docRef.get();

    response.status(201).json({
      activityLog: toActivityLog(created),
      referralClosed: closeReferral,
      completedTaskCount,
      followUpTaskCreated
    });
  } catch (error) {
    next(error);
  }
});

export { datePlusDays, isUnansweredContactResult, normalizedContactResult, unansweredContactTask };
export default router;
